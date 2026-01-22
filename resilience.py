from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, TypeVar, Optional
import random
import time


T = TypeVar("T")


@dataclass
class RetryConfig:
    """
    Configuration controlling generic retry logic.

    Attributes:
        max_attempts: Maximum attempts before giving up.
        base_delay: Base delay in seconds for backoff.
        max_delay: Maximum delay in seconds between attempts.
        exponential_base: Growth factor for exponential backoff.
        jitter: Whether to apply random jitter to backoff.
    """
    max_attempts: int = 3
    base_delay: float = 1.0
    max_delay: float = 60.0
    exponential_base: float = 2.0
    jitter: bool = True


def execute_with_retry(
    func: Callable[[], T],
    retry_config: Optional[RetryConfig] = None,
    is_retryable: Optional[Callable[[Exception], bool]] = None,
) -> T:
    """
    Execute a callable with retry semantics using exponential backoff.

    Args:
        func: Callable returning a value.
        retry_config: Override default retry behavior.
        is_retryable: Callable to determine whether an exception is retryable.

    Returns:
        The callable's return value.

    Raises:
        The last encountered exception if all retries fail.
    """
    cfg = retry_config or RetryConfig()

    def default_is_retryable(e: Exception) -> bool:
        s = str(e).lower()
        # Marker substrings for common retryable errors
        retryable_markers = ("rate_limit", "timeout", "overloaded", "api_error")
        return any(m in s for m in retryable_markers)

    predicate = is_retryable or default_is_retryable

    last_exc: Optional[Exception] = None
    for attempt in range(cfg.max_attempts):
        try:
            return func()
        except Exception as e:  # noqa: BLE001
            last_exc = e
            # Give up if not retryable or last attempt
            if not predicate(e) or attempt == cfg.max_attempts - 1:
                break
            # Compute backoff delay
            delay = min(cfg.base_delay * (cfg.exponential_base ** attempt), cfg.max_delay)
            if cfg.jitter:
                delay *= 0.5 + random.random()
            time.sleep(delay)
    # Exhausted attempts: raise last error
    if last_exc is not None:
        raise last_exc
    raise RuntimeError("execute_with_retry failed unexpectedly without raising an error.")