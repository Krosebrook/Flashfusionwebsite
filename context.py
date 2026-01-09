from __future__ import annotations

from dataclasses import dataclass
from typing import List, Dict, Optional


@dataclass
class ContextItem:
    """
    Represents an individual piece of context from a chain step.

    Attributes:
        step: The name of the step that produced this context.
        content: The actual text content.
        importance: The importance level used to order items when trimming.
        tokens: Estimated token count.
        tags: Optional tags used to filter context.
    """

    step: str
    content: str
    importance: str
    tokens: int
    tags: List[str]


class ContextManager:
    """
    Manages a rolling window of contextual information across chain steps.

    Older or low-importance items are pruned when the token budget is exceeded.
    """

    def __init__(self, max_context_tokens: int = 2000) -> None:
        self.max_tokens = max_context_tokens
        self._items: List[ContextItem] = []

    def add_step_result(
        self,
        step_name: str,
        result: str,
        importance: str = "medium",
        tags: Optional[List[str]] = None,
    ) -> None:
        """
        Add a step result to the context window.

        Items are pruned based on importance and recency if the token budget is exceeded.
        """
        if tags is None:
            tags = []
        item = ContextItem(
            step=step_name,
            content=result,
            importance=importance,
            tokens=self._estimate_tokens(result),
            tags=tags,
        )
        self._items.append(item)
        self._prune_if_needed()

    def get_relevant_context(
        self,
        required_steps: Optional[List[str]] = None,
        required_tags: Optional[List[str]] = None,
    ) -> str:
        """
        Return a concatenated context string constrained by the token budget.

        Items can be filtered by step name and/or tags.
        """
        required_tags = required_tags or []
        required_steps = required_steps or []

        def importance_score(level: str) -> int:
            return {"high": 3, "medium": 2, "low": 1}.get(level, 1)

        # Filter candidate items
        candidates: List[ContextItem] = []
        for item in self._items:
            if required_steps and item.step not in required_steps:
                continue
            if required_tags and not (set(required_tags) & set(item.tags)):
                continue
            candidates.append(item)
        # Default to all items if filters returned nothing
        if not candidates:
            candidates = list(self._items)

        # Sort by importance then recency
        sorted_items = sorted(
            candidates,
            key=lambda x: (importance_score(x.importance), -self._items.index(x)),
            reverse=True,
        )

        context_parts: List[str] = []
        tokens_used = 0
        for item in sorted_items:
            if tokens_used + item.tokens > self.max_tokens:
                continue
            context_parts.append(f"[{item.step}]:\n{item.content}\n")
            tokens_used += item.tokens
        return "\n".join(context_parts)

    def _estimate_tokens(self, text: str) -> int:
        """
        Roughly estimate token count from number of characters.
        """
        return max(1, len(text) // 4)

    def _total_tokens(self) -> int:
        return sum(item.tokens for item in self._items)

    def _prune_if_needed(self) -> None:
        if self._total_tokens() <= self.max_tokens:
            return
        # Drop low importance items first, then medium if necessary
        for level in ("low", "medium"):
            remaining = [item for item in self._items if item.importance != level]
            if sum(i.tokens for i in remaining) <= self.max_tokens:
                self._items = remaining
                return
        # If still too big, keep only the most recent items
        self._items = self._items[-5:]