from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Dict, Any, List, Optional

from .llm_client import LLMClient
from .context import ContextManager
from .observability import AgentObservability
from .cost import CostRouter, TaskType


@dataclass
class ChainStep:
    """
    Definition of a single step in a sequential prompt chain.

    Attributes:
        name: The unique name of the step.
        prompt_template: A Python format string used to build the prompt.
        inputs: The keys from the chain state used to format the prompt.
        output_key: The key in the chain state into which to store the result.
        task_type: The type of task for model routing.
        max_tokens: Maximum generation length.
        temperature: Sampling temperature.
        importance: Importance level for context management.
        tags: Optional tags for context filtering.
        quality_validator: Callable that returns True if the output meets quality expectations.
    """

    name: str
    prompt_template: str
    inputs: List[str]
    output_key: str
    task_type: TaskType = "analysis"
    max_tokens: int = 2048
    temperature: float = 0.7
    importance: str = "medium"
    tags: List[str] = field(default_factory=list)
    quality_validator: Optional[Callable[[str], bool]] = None


class ChainRunner:
    """
    Executes a list of ChainStep instances sequentially, managing state and context.
    """

    def __init__(
        self,
        llm: LLMClient,
        cost_router: CostRouter,
        observability: AgentObservability,
        context_manager: Optional[ContextManager] = None,
    ) -> None:
        self.llm = llm
        self.cost_router = cost_router
        self.observability = observability
        self.context = context_manager or ContextManager()
        self.state: Dict[str, Any] = {}

    def run(self, steps: List[ChainStep]) -> Dict[str, Any]:
        """
        Execute each step, updating state and recording outputs.
        """
        for step in steps:
            self._run_step(step)
        return dict(self.state)

    def _run_step(self, step: ChainStep) -> None:
        # Format the prompt
        input_values = {k: self.state.get(k, "") for k in step.inputs}
        prompt = step.prompt_template.format(**input_values)
        # Select model and call LLM
        model_cfg = self.cost_router.select_model(prompt, step.task_type)
        resp = self.llm.call(
            model=model_cfg.name,
            prompt=prompt,
            max_tokens=step.max_tokens,
            temperature=step.temperature,
        )
        cost = self.cost_router.estimate_cost(
            model_cfg, resp.input_tokens, resp.output_tokens
        )
        # Log invocation
        self.observability.log_agent_call(
            agent_id=f"chain_step:{step.name}",
            task=prompt,
            input_tokens=resp.input_tokens,
            output_tokens=resp.output_tokens,
            latency_ms=resp.latency_ms,
            success=True,
            cost_usd=cost,
        )
        output_text = resp.text
        # Quality check
        if step.quality_validator and not step.quality_validator(output_text):
            self.observability.log_workflow_step(
                step_name=step.name,
                step_type="quality_warning",
                metadata={"message": "quality_validator_failed"},
            )
        # Update state
        self.state[step.output_key] = output_text
        # Add to context
        self.context.add_step_result(
            step_name=step.name,
            result=output_text,
            importance=step.importance,
            tags=step.tags,
        )