import pytest
from typing import List

from orchestrator.config import OrchestratorConfig, ModelConfig
from orchestrator.llm_client import LLMResponse
from orchestrator.cost import CostRouter
from orchestrator.chaining import ChainRunner, ChainStep
from orchestrator.context import ContextManager
from orchestrator.observability import AgentObservability
from orchestrator.workflows.content_blog import ContentBlogWorkflow, BlogInput


class FakeLLMClient:
    # Minimal fake LLM client that echoes prompts to enable offline tests.
    def call(self, model: str, prompt: str, max_tokens: int = 2048, temperature: float = 0.7) -> LLMResponse:
        return LLMResponse(
            text=f"MODEL={model}\nLEN={len(prompt)}\nBODY=ok",
            input_tokens=len(prompt) // 4,
            output_tokens=len(prompt) // 4,
            latency_ms=1.0,
        )


def make_dummy_config() -> OrchestratorConfig:
    # Construct an OrchestratorConfig with dummy model names and costs.
    return OrchestratorConfig(
        anthropic_api_key="dummy",
        premium_model=ModelConfig(name="premium_model", input_cost_per_1k=0.003, output_cost_per_1k=0.015),
        standard_model=ModelConfig(name="standard_model", input_cost_per_1k=0.00025, output_cost_per_1k=0.00125),
    )


def test_content_blog_validators_accept_reasonable_content() -> None:
    cfg = make_dummy_config()
    workflow = ContentBlogWorkflow(cfg)
    research_text = "Trend 1\n" + "- bullet\n" * 15 + ("Text. " * 50)
    assert workflow._validate_research(research_text)
    outline_text = (
        "# Main Title\n\n"
        "## Section 1\nContent\n"
        "## Section 2\nContent\n"
        "## Section 3\nContent\n"
        "## Section 4\nContent\n"
        "Meta description: Something"
    )
    assert workflow._validate_outline(outline_text)
    intro_text = "This introduction is long enough. " * 20
    assert workflow._validate_intro(intro_text)
    sections_text = (
        "## One\nBody text.\n"
        "## Two\nBody text.\n"
        "## Three\nBody text.\n"
        "## Four\nBody text.\n"
    ) * 10
    assert workflow._validate_sections(sections_text)
    conclusion_text = "This is a lengthy conclusion paragraph " * 10
    assert workflow._validate_conclusion(conclusion_text)
    seo_text = (
        "Meta title: Great Title\n"
        "Meta description: Concise summary.\n"
        "Primary keyword usage: highlighted\n"
    )
    assert workflow._validate_seo_review(seo_text)
    final_article = "# Title\n\n## A\nText\n## B\nText\n## C\nText\n## D\nText\n"
    final_article = final_article * 10
    assert workflow._validate_final_article(final_article)


def test_content_blog_validators_reject_bad_inputs() -> None:
    cfg = make_dummy_config()
    workflow = ContentBlogWorkflow(cfg)
    assert not workflow._validate_research("too short")
    assert not workflow._validate_outline("no headings at all")
    assert not workflow._validate_intro("# heading in intro")
    assert not workflow._validate_sections("## Only one section")
    assert not workflow._validate_conclusion("tiny")
    assert not workflow._validate_seo_review("no meta or keyword")
    assert not workflow._validate_final_article("just text, no headings")


def test_chainrunner_executes_steps_and_propagates_state() -> None:
    cfg = make_dummy_config()
    fake_llm = FakeLLMClient()
    cost_router = CostRouter(cfg)
    obs = AgentObservability("test_chain")
    ctx = ContextManager(max_context_tokens=200)
    runner = ChainRunner(
        llm=fake_llm,
        cost_router=cost_router,
        observability=obs,
        context_manager=ctx,
    )
    runner.state.update({"keyword": "ai automation", "x": "foo"})
    validator_calls: List[str] = []
    def validator_step1(output: str) -> bool:
        validator_calls.append("step1")
        return True
    def validator_step2(output: str) -> bool:
        validator_calls.append("step2")
        return True
    steps = [
        ChainStep(
            name="step1",
            prompt_template="Keyword={keyword}; X={x}",
            inputs=["keyword", "x"],
            output_key="y",
            task_type="analysis",
            max_tokens=256,
            temperature=0.0,
            importance="high",
            tags=["test"],
            quality_validator=validator_step1,
        ),
        ChainStep(
            name="step2",
            prompt_template="Prev={y}",
            inputs=["y"],
            output_key="z",
            task_type="simple_tasks",
            max_tokens=256,
            temperature=0.0,
            importance="medium",
            tags=["test"],
            quality_validator=validator_step2,
        ),
    ]
    result = runner.run(steps)
    assert "y" in result and "z" in result and result["y"] and result["z"]
    assert validator_calls == ["step1", "step2"]
    context_str = ctx.get_relevant_context()
    assert "[step1]" in context_str and "[step2]" in context_str


def test_content_blog_workflow_split_sections_basic() -> None:
    cfg = make_dummy_config()
    workflow = ContentBlogWorkflow(cfg)
    text = "## Section One\nContent A\n## Section Two\nContent B\n"
    expected = {"Section One": "Content A", "Section Two": "Content B"}
    assert workflow._split_sections(text) == expected


@pytest.mark.skip
def test_content_blog_workflow_run_integration() -> None:
    cfg = OrchestratorConfig.from_env()
    wf = ContentBlogWorkflow(cfg)
    result = wf.run(BlogInput(keyword="AI automation", primary_audience="engineers"))
    assert "# " in result.final_article and len(result.final_article) > 1000