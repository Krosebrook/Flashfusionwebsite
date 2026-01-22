from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any, List, Optional


@dataclass
class ObservabilityMetrics:
    """
    Aggregate metrics tracked during a workflow run.
    """
    total_calls: int = 0
    total_tokens: int = 0
    total_cost: float = 0.0
    agent_calls: Dict[str, int] = field(default_factory=dict)
    failures: List[Dict[str, Any]] = field(default_factory=list)
    latencies: List[float] = field(default_factory=list)


class AgentObservability:
    """
    Provides structured logging and collects runtime metrics for agent and chain calls.
    """

    def __init__(self, workflow_name: str) -> None:
        self.workflow_name = workflow_name
        self.logger = self._setup_logger()
        self.metrics = ObservabilityMetrics()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(f"agent.{self.workflow_name}")
        logger.setLevel(logging.INFO)
        # Attach handler once
        if not logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                logging.Formatter(
                    '{"timestamp":"%(asctime)s","level":"%(levelname)s",'
                    '"workflow":"%(name)s","message":%(message)s}'
                )
            )
            logger.addHandler(handler)
        return logger

    def log_agent_call(
        self,
        agent_id: str,
        task: str,
        input_tokens: int,
        output_tokens: int,
        latency_ms: float,
        success: bool,
        cost_usd: float,
        error: Optional[str] = None,
    ) -> None:
        """
        Record an invocation of an agent, update metrics, and emit a structured log.
        """
        total_tokens = input_tokens + output_tokens
        log_data = {
            "agent_id": agent_id,
            "task": task[:120],
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "latency_ms": round(latency_ms, 2),
            "success": success,
            "cost_usd": round(cost_usd, 6),
            "error": error,
        }
        # Update metrics
        self.metrics.total_calls += 1
        self.metrics.total_tokens += total_tokens
        self.metrics.total_cost += cost_usd
        self.metrics.latencies.append(latency_ms)
        self.metrics.agent_calls[agent_id] = self.metrics.agent_calls.get(agent_id, 0) + 1
        if not success:
            self.metrics.failures.append(log_data)
        # Emit JSON log
        self.logger.info(json.dumps(log_data))

    def log_workflow_step(
        self,
        step_name: str,
        step_type: str,
        metadata: Dict[str, Any],
    ) -> None:
        """
        Emit a high-level workflow progression log event.
        """
        log_data = {
            "step_name": step_name,
            "step_type": step_type,
            "metadata": metadata,
            "timestamp": datetime.now().isoformat(),
        }
        self.logger.info(json.dumps(log_data))

    def get_summary(self) -> Dict[str, Any]:
        """
        Return a snapshot of current metrics.
        """
        avg_latency = (
            sum(self.metrics.latencies) / len(self.metrics.latencies)
            if self.metrics.latencies
            else 0.0
        )
        return {
            "workflow": self.workflow_name,
            "total_calls": self.metrics.total_calls,
            "total_tokens": self.metrics.total_tokens,
            "total_cost_usd": round(self.metrics.total_cost, 4),
            "avg_latency_ms": round(avg_latency, 2),
            "failure_count": len(self.metrics.failures),
            "agent_breakdown": self.metrics.agent_calls,
            "cost_per_call": (
                round(self.metrics.total_cost / self.metrics.total_calls, 6)
                if self.metrics.total_calls
                else 0.0
            ),
        }