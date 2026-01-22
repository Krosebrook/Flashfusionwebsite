from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List
import asyncio
import json

from ..config import OrchestratorConfig
from ..llm_client import LLMClient
from ..observability import AgentObservability
from ..cost import CostRouter
from ..state import CentralizedStateManager
from ..agents import WorkerAgent, ManagerAgent


@dataclass
class SaaSResearchResult:
    """
    Result of a SaaS research workflow run.
    """
    query: str
    sub_queries: List[str]
    findings: Dict[str, str]
    analysis: str
    final_report: str


class SaaSResearchWorkflow:
    """
    Multi-agent workflow specialized for SaaS opportunity research.
    """

    def __init__(self, config: OrchestratorConfig) -> None:
        self.config = config
        self.llm = LLMClient(config)
        self.obs = AgentObservability("saas_research")
        self.cost_router = CostRouter(config)
        self.state_mgr = CentralizedStateManager()

        # Register workers
        research_worker = WorkerAgent(
            agent_id="research_agent",
            description="Researches SaaS markets, competitors, pricing, and user pain points.",
            llm=self.llm,
            observability=self.obs,
            cost_router=self.cost_router,
            state_manager=self.state_mgr,
        )
        analysis_worker = WorkerAgent(
            agent_id="analysis_agent",
            description="Synthesizes findings into opportunity maps, risk analysis, and strategy.",
            llm=self.llm,
            observability=self.obs,
            cost_router=self.cost_router,
            state_manager=self.state_mgr,
        )
        writing_worker = WorkerAgent(
            agent_id="writing_agent",
            description="Drafts investor-ready memos and concise opportunity briefs.",
            llm=self.llm,
            observability=self.obs,
            cost_router=self.cost_router,
            state_manager=self.state_mgr,
        )

        self.manager = ManagerAgent(
            agent_id="manager",
            llm=self.llm,
            observability=self.obs,
            cost_router=self.cost_router,
            state_manager=self.state_mgr,
            workers={
                "research_agent": research_worker,
                "analysis_agent": analysis_worker,
                "writing_agent": writing_worker,
            },
        )

    async def run(self, query: str) -> SaaSResearchResult:
        """
        Execute the SaaS research workflow.
        """
        self.obs.log_workflow_step(
            step_name="start", step_type="workflow_start", metadata={"query": query}
        )
        sub_queries = await self._decompose_query(query)
        findings = await self._parallel_research(sub_queries)
        analysis = await self._analyze_findings(query, findings)
        report = await self._generate_report(query, findings, analysis)
        self.obs.log_workflow_step(
            step_name="complete",
            step_type="workflow_end",
            metadata={"summary": self.obs.get_summary()},
        )
        return SaaSResearchResult(
            query=query,
            sub_queries=sub_queries,
            findings=findings,
            analysis=analysis,
            final_report=report,
        )

    async def _decompose_query(self, query: str) -> List[str]:
        prompt = f"""
You are a SaaS opportunity lead researcher.

Break the following question into 3–6 specific research sub-queries
that can be investigated in parallel.

Focus on:
- customer segments and pain points
- existing solutions and their gaps
- pricing / monetization patterns
- distribution / acquisition channels
- defensibility (moats, ecosystem, data, integrations)

Original question:
{query}

Return ONLY a JSON array of strings, e.g.:
["sub-question 1", "sub-question 2", ...]
"""
        resp = self.manager._call_llm(prompt, task_type="analysis", max_tokens=1024)
        text = resp.text
        import re
        match = re.search(r"\[[\s\S]*\]", text)
        if not match:
            raise ValueError("Failed to parse sub-queries JSON.")
        sub_queries = json.loads(match.group(0))
        self.state_mgr.update_state(
            agent_id="manager",
            updates={"sub_queries": sub_queries},
            update_type="decomposition",
        )
        return sub_queries

    async def _parallel_research(self, sub_queries: List[str]) -> Dict[str, str]:
        async def run_one(idx: int, q: str) -> str:
            prompt = f"""
You are a SaaS market research agent.

Research this specific question in depth:

Question #{idx+1}:
{q}

Focus on:
- concrete examples and products
- evidence of user demand (search, communities, reviews, churn stories)
- pricing bands and monetization patterns
- notable shutdowns or "orphaned demand" signals
- risks and constraints

Respond with a structured summary using headings and bullet points.
"""
            loop = asyncio.get_running_loop()
            resp = await loop.run_in_executor(
                None,
                lambda: self.manager._call_llm(
                    prompt, task_type="analysis", max_tokens=2048
                ),
            )
            return resp.text

        tasks = [run_one(i, q) for i, q in enumerate(sub_queries)]
        results_list = await asyncio.gather(*tasks)
        findings = {q: r for q, r in zip(sub_queries, results_list)}
        self.state_mgr.update_state(
            agent_id="research_agent",
            updates={"findings": findings},
            update_type="research",
        )
        return findings

    async def _analyze_findings(
        self, query: str, findings: Dict[str, str]
    ) -> str:
        findings_text = "\n\n".join(
            f"Sub-query: {sub_q}\n\n{body}" for sub_q, body in findings.items()
        )
        prompt = f"""
You are a SaaS strategy analyst.

Original query:
{query}

Research findings:
{findings_text}

Synthesize and analyze:
- key opportunity clusters
- evidence of orphaned or underserved demand
- potential business models (B2B, B2C, prosumer, infra, tooling)
- go-to-market angles and acquisition channels
- risks, constraints, and "gotchas"

Write a structured analysis with:
- "Opportunity Map" section
- "Market Dynamics" section
- "Risks & Constraints" section
- "Validation Plan" section
"""
        loop = asyncio.get_running_loop()
        resp = await loop.run_in_executor(
            None,
            lambda: self.manager._call_llm(
                prompt, task_type="analysis", max_tokens=3072
            ),
        )
        analysis = resp.text
        self.state_mgr.update_state(
            agent_id="analysis_agent",
            updates={"analysis": analysis},
            update_type="analysis",
        )
        return analysis

    async def _generate_report(
        self, query: str, findings: Dict[str, str], analysis: str
    ) -> str:
        prompt = f"""
You are a report writer.

Create a comprehensive research report.

Original Query: {query}

Analysis: {analysis}

Research Findings:
{json.dumps(findings, indent=2)}

Format as:
Executive Summary (2–3 paragraphs)
Key Findings (bullet points)
Detailed Analysis (sections with headers)
Recommendations
Conclusion
"""
        loop = asyncio.get_running_loop()
        resp = await loop.run_in_executor(
            None,
            lambda: self.manager._call_llm(
                prompt, task_type="writing", max_tokens=4096
            ),
        )
        report = resp.text
        self.state_mgr.update_state(
            agent_id="writing_agent",
            updates={"final_report": report},
            update_type="report",
        )
        return report