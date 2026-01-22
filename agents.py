from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Dict, Any, Optional, Protocol

from .llm_client import LLMClient, LLMResponse
from .observability import AgentObservability
from .state import CentralizedStateManager
from .cost import CostRouter, TaskType


class Agent(Protocol):
    """
    Protocol for agents that can perform tasks and return results.
    """

    agent_id: str

    def run(self, task: str, **kwargs: Any) -> str:
        ...


@dataclass
class BaseAgent:
    """
    Base class shared by all agents with common LLM invocation logic.

    Attributes:
        agent_id: Unique identifier.
        llm: LLM client used for calls.
        observability: Metrics and logging collector.
        cost_router: Model routing configuration.
    """

    agent_id: str
    llm: LLMClient
    observability: AgentObservability
    cost_router: CostRouter

    def _call_llm(
        self,
        prompt: str,
        task_type: TaskType,
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> LLMResponse:
        """
        Invoke the LLM through the cost router and log the call.
        """
        model_cfg = self.cost_router.select_model(prompt, task_type)
        resp = self.llm.call(
            model=model_cfg.name,
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        cost = self.cost_router.estimate_cost(
            model_cfg, resp.input_tokens, resp.output_tokens
        )
        self.observability.log_agent_call(
            agent_id=self.agent_id,
            task=prompt,
            input_tokens=resp.input_tokens,
            output_tokens=resp.output_tokens,
            latency_ms=resp.latency_ms,
            success=True,
            cost_usd=cost,
        )
        return resp


@dataclass
class StatefulAgentMixin:
    """
    Mixin providing read/write access to shared state.
    """

    state_manager: CentralizedStateManager

    def read_state(self, keys: Optional[list[str]] = None) -> Dict[str, Any]:
        return self.state_manager.read_state(keys)

    def update_state(
        self,
        agent_id: str,
        updates: Dict[str, Any],
        update_type: str = "task_completion",
    ) -> int:
        return self.state_manager.update_state(
            agent_id=agent_id, updates=updates, update_type=update_type
        )


@dataclass
class WorkerAgent(BaseAgent, StatefulAgentMixin):
    """
    An agent specialized in a particular domain that executes a single task.

    Attributes:
        description: High-level description used to contextualize prompts.
    """

    description: str

    def run(self, task: str, **kwargs: Any) -> str:
        ctx: Dict[str, Any] = kwargs.get("context", {})
        context_str = ""
        if ctx:
            parts = []
            for k, v in ctx.items():
                snippet = v if len(v) <= 800 else v[:800] + "...[truncated]"
                parts.append(f"- {k}: {snippet}")
            context_str = "\n\nPrevious results:\n" + "\n".join(parts)
        prompt = (
            f"You are a specialized agent: {self.description}\n\n"
            f"Task:\n{task}\n"
            f"{context_str}\n\n"
            "Provide your best possible result."
        )
        resp = self._call_llm(prompt, task_type="analysis")
        return resp.text


@dataclass
class ManagerAgent(BaseAgent, StatefulAgentMixin):
    """
    Coordinator that analyzes a high-level task and delegates subtasks to workers.
    """

    workers: Dict[str, WorkerAgent]

    def register_worker(self, name: str, worker: WorkerAgent) -> None:
        self.workers[name] = worker

    def _agent_capabilities_str(self) -> str:
        return "\n".join(
            f"- {name}: {worker.description}" for name, worker in self.workers.items()
        )

    def _parse_json_block(self, text: str) -> Dict[str, Any]:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON block found in manager plan.")
        return json.loads(match.group(0))

    def plan(self, task: str) -> Dict[str, Any]:
        """
        Ask the LLM to produce a delegation plan for the given task.
        """
        prompt = f"""
You are a task planner in a multi-agent system.

Task:
{task}

Available agents:
{self._agent_capabilities_str()}

Return ONLY a JSON object with:
{{
  "primary_agent": "agent_name",
  "supporting_agents": ["agent_name_1", "agent_name_2"],
  "execution_order": ["step1", "step2", "step3"],
  "step_to_agent": {{"step1": "agent_name", "step2": "agent_name"}},
  "reasoning": "short explanation"
}}
"""
        resp = self._call_llm(prompt, task_type="analysis")
        return self._parse_json_block(resp.text)

    def run(self, task: str, **kwargs: Any) -> str:
        """
        Execute the delegation plan by invoking workers in order and synthesizing results.
        """
        plan = self.plan(task)
        step_to_agent: Dict[str, str] = plan.get("step_to_agent", {})
        results: Dict[str, str] = {}
        for step in plan["execution_order"]:
            agent_name = step_to_agent.get(step, plan["primary_agent"])
            worker = self.workers[agent_name]
            result = worker.run(step, context=results)
            results[step] = result
        # Synthesis of final answer
        synth_prompt = f"""
Original task:
{task}

Step results:
{json.dumps(results, indent=2)}

Write a single, coherent final answer that integrates the step results.
"""
        resp = self._call_llm(synth_prompt, task_type="writing", max_tokens=3072)
        return resp.text