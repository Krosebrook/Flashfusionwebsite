from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from .config import OrchestratorConfig, ModelConfig


TaskType = Literal[
    "extraction",
    "classification",
    "simple_tasks",
    "analysis",
    "writing",
    "complex_reasoning",
]


@dataclass
class CostRouter:
    """
    Heuristically route tasks to the appropriate LLM model tier and compute cost.
    """

    config: OrchestratorConfig

    def select_model(self, task: str, task_type: TaskType) -> ModelConfig:
        """
        Select the model configuration based on explicit task type or heuristics.
        """
        model_map = self.config.model_map()
        # Explicit mapping
        if task_type in ("analysis", "writing", "complex_reasoning"):
            return model_map["premium"]
        if task_type in ("extraction", "classification", "simple_tasks"):
            return model_map["standard"]
        # Heuristic fallback based on keywords
        lower = task.lower()
        high_signals = ("analyze", "synthesize", "evaluate", "compare", "design")
        if any(sig in lower for sig in high_signals):
            return model_map["premium"]
        return model_map["standard"]

    def estimate_cost(
        self,
        model: ModelConfig,
        input_tokens: int,
        output_tokens: int,
    ) -> float:
        """
        Compute approximate cost for the given token usage on a specific model tier.
        """
        return (
            (input_tokens / 1000.0) * model.input_cost_per_1k
            + (output_tokens / 1000.0) * model.output_cost_per_1k
        )