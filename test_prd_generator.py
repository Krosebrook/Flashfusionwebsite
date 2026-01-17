import pytest
from typing import List

from orchestrator.config import OrchestratorConfig, ModelConfig
from orchestrator.llm_client import LLMResponse
from orchestrator.cost import CostRouter
from orchestrator.chaining import ChainRunner, ChainStep
from orchestrator.context import ContextManager
from orchestrator.observability import AgentObservability
from orchestrator.workflows.prd_generator import PRDGeneratorWorkflow, PRDInput


class FakeLLMClient:
    # Minimal fake LLM client that echoes prompts to enable offline tests.
    def call(self, model: str, prompt: str, max_tokens: int = 2048, temperature: float = 0.7) -> LLMResponse:
        return LLMResponse(
            text=f"## Test Section\n\nMODEL={model}\nLEN={len(prompt)}\n\nTest content with proper structure.\n\n- Item 1\n- Item 2\n- Item 3\n\nGiven initial context\nWhen action occurs\nThen expected outcome\n\nAs a user, I want to test the system.",
            input_tokens=len(prompt) // 4,
            output_tokens=100,
            latency_ms=1.0,
        )


def make_dummy_config() -> OrchestratorConfig:
    # Construct an OrchestratorConfig with dummy model names and costs.
    return OrchestratorConfig(
        anthropic_api_key="dummy",
        premium_model=ModelConfig(name="premium_model", input_cost_per_1k=0.003, output_cost_per_1k=0.015),
        standard_model=ModelConfig(name="standard_model", input_cost_per_1k=0.00025, output_cost_per_1k=0.00125),
    )


def test_prd_generator_validators_accept_reasonable_content() -> None:
    cfg = make_dummy_config()
    workflow = PRDGeneratorWorkflow(cfg)
    
    # Test section validator
    section_text = "## Test Section\n\n" + ("Content paragraph. " * 50)
    assert workflow._validate_section(section_text)
    
    # Test requirements validator
    requirements_text = (
        "## Functional Requirements\n\n"
        "1. Feature one\n"
        "2. Feature two\n"
        "3. Feature three\n"
        "- Additional point\n"
        "- Another point\n"
    ) * 5
    assert workflow._validate_requirements(requirements_text)
    
    # Test Gherkin validator
    gherkin_text = (
        "## User Stories & Acceptance Criteria\n\n"
        "As a user, I want to test the system.\n\n"
        "Given initial context\n"
        "When action occurs\n"
        "Then expected outcome\n"
    ) * 3
    assert workflow._validate_gherkin(gherkin_text)
    
    # Test full document validator
    full_doc = (
        "# Product Requirements Document: Test Product\n\n"
        "## Executive Summary\nContent\n"
        "## Problem Statement\nContent\n"
        "## Target Audience\nContent\n"
        "## Functional Requirements\nContent\n"
        "## Non-Functional Requirements\nContent\n"
        "## User Stories\nContent\n"
        "## Technical Architecture\nContent\n"
        "## API Design\nContent\n"
        "## UI/UX Considerations\nContent\n"
        "## Security & Compliance\nContent\n"
        "## Testing Strategy\nContent\n"
        "## Deployment & DevOps\nContent\n"
        "## Assumptions & Risks\nContent\n"
    ) * 5
    assert workflow._validate_full_document(full_doc)


def test_prd_generator_validators_reject_bad_inputs() -> None:
    cfg = make_dummy_config()
    workflow = PRDGeneratorWorkflow(cfg)
    
    # Too short
    assert not workflow._validate_section("too short")
    
    # Missing heading
    assert not workflow._validate_section("Content without heading. " * 100)
    
    # Requirements without lists
    assert not workflow._validate_requirements("## Requirements\nJust text without any lists.")
    
    # Gherkin without proper format
    assert not workflow._validate_gherkin("## Stories\nNo proper Gherkin format here.")
    
    # Full document without proper structure
    assert not workflow._validate_full_document("# Doc\nNot enough sections")


def test_prd_input_dataclass() -> None:
    # Test PRDInput creation with required field
    prd_input = PRDInput(feature_idea="Test feature")
    assert prd_input.feature_idea == "Test feature"
    assert prd_input.product_name is None
    assert prd_input.target_users is None
    assert prd_input.business_context is None
    
    # Test with all fields
    prd_input_full = PRDInput(
        feature_idea="Test feature",
        product_name="Test Product",
        target_users="Developers",
        business_context="Improve productivity",
    )
    assert prd_input_full.feature_idea == "Test feature"
    assert prd_input_full.product_name == "Test Product"
    assert prd_input_full.target_users == "Developers"
    assert prd_input_full.business_context == "Improve productivity"


@pytest.mark.skip(reason="Integration test requires actual LLM API")
def test_prd_generator_workflow_run_integration() -> None:
    cfg = OrchestratorConfig.from_env()
    wf = PRDGeneratorWorkflow(cfg)
    result = wf.run(PRDInput(
        feature_idea="AI-powered code review assistant",
        product_name="CodeReview AI",
        target_users="Software developers and engineering teams",
    ))
    assert "# Product Requirements Document" in result.full_document
    assert len(result.full_document) > 2000
    assert len(result.executive_summary) > 200
    assert "Given" in result.user_stories
    assert "When" in result.user_stories
    assert "Then" in result.user_stories
