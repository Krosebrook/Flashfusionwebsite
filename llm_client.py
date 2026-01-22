from __future__ import annotations

import time
from dataclasses import dataclass

try:
    # Import anthropic client if available. Tests may run without this dependency.
    from anthropic import Anthropic  # type: ignore[import]
except ImportError:  # pragma: no cover
    Anthropic = None  # type: ignore[assignment]

from .config import OrchestratorConfig


@dataclass
class LLMResponse:
    """
    A normalized response returned from the underlying LLM client.

    Attributes:
        text: The content returned by the model.
        input_tokens: The number of input tokens billed.
        output_tokens: The number of output tokens billed.
        latency_ms: The round-trip latency for the call.
    """

    text: str
    input_tokens: int
    output_tokens: int
    latency_ms: float


class LLMClient:
    """
    Thin wrapper around the Anthropic client to standardize invocations and
    surface cost and latency information.

    This wrapper does not attempt to hide provider-specific exceptions.
    """

    def __init__(self, config: OrchestratorConfig) -> None:
        self.config = config
        if Anthropic is None:
            raise ImportError(
                "anthropic package is required to instantiate LLMClient"
            )
        self.client = Anthropic(api_key=config.anthropic_api_key)

    def call(
        self,
        model: str,
        prompt: str,
        max_tokens: int = 2048,
        temperature: float = 0.7,
        timeout_s: float | None = None,
    ) -> LLMResponse:
        """
        Invoke the underlying LLM and return a normalized response.

        Args:
            model: The model name to call.
            prompt: The user prompt.
            max_tokens: Maximum number of tokens to generate.
            temperature: Sampling temperature.
            timeout_s: Timeout in seconds for the request. Currently unused.

        Returns:
            LLMResponse containing the text, token counts and latency.
        """
        start = time.time()
        message = self.client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{"role": "user", "content": prompt}],
        )
        latency_ms = (time.time() - start) * 1000.0
        text = message.content[0].text  # type: ignore[index]
        return LLMResponse(
            text=text,
            input_tokens=message.usage.input_tokens,  # type: ignore[attr-defined]
            output_tokens=message.usage.output_tokens,  # type: ignore[attr-defined]
            latency_ms=latency_ms,
        )