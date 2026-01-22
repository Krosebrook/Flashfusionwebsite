from __future__ import annotations

from dataclasses import dataclass
from typing import Dict
import os


@dataclass(frozen=True)
class ModelConfig:
    """
    Configuration for an LLM model tier.

    Attributes:
        name: The model name understood by the upstream provider.
        input_cost_per_1k: Cost in USD per 1k input tokens.
        output_cost_per_1k: Cost in USD per 1k output tokens.
    """

    name: str
    input_cost_per_1k: float
    output_cost_per_1k: float


@dataclass(frozen=True)
class OrchestratorConfig:
    """
    Aggregate configuration used to bootstrap the orchestrator.

    Contains API keys and default model tier information. Pulls API keys
    from environment variables by default.
    """

    anthropic_api_key: str
    premium_model: ModelConfig
    standard_model: ModelConfig

    @classmethod
    def from_env(cls) -> "OrchestratorConfig":
        """
        Construct an OrchestratorConfig from environment variables.

        Reads ANTHROPIC_API_KEY and constructs sane default ModelConfig
        instances for premium and standard model tiers.
        """
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is not set in the environment. Please set it before running."
            )

        premium = ModelConfig(
            name="claude-3-5-sonnet-20241022",
            input_cost_per_1k=0.003,
            output_cost_per_1k=0.015,
        )
        standard = ModelConfig(
            name="claude-3-5-haiku-20241022",
            input_cost_per_1k=0.00025,
            output_cost_per_1k=0.00125,
        )

        return cls(
            anthropic_api_key=api_key,
            premium_model=premium,
            standard_model=standard,
        )

    def model_map(self) -> Dict[str, ModelConfig]:
        """
        Return a mapping of tier names to model configurations.
        """
        return {
            "premium": self.premium_model,
            "standard": self.standard_model,
        }