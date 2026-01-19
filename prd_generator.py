from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from config import OrchestratorConfig
from llm_client import LLMClient
from observability import AgentObservability
from cost import CostRouter
from context import ContextManager
from chaining import ChainRunner, ChainStep


@dataclass
class PRDInput:
    """
    Input parameters for the PRD generation workflow.
    """
    feature_idea: str
    product_name: str = "Product"
    target_industry: str = ""
    company_context: str = ""


@dataclass
class PRDOutput:
    """
    Output of the PRD generation workflow containing all sections.
    """
    feature_idea: str
    executive_summary: str
    problem_statement: str
    target_audience: str
    functional_requirements: str
    non_functional_requirements: str
    user_stories: str
    technical_architecture: str
    api_design: str
    ui_ux_considerations: str
    security_compliance: str
    testing_strategy: str
    deployment_devops: str
    assumptions_risks: str
    final_document: str
    chain_state: Dict[str, str]


class PRDGeneratorWorkflow:
    """
    Orchestrates a comprehensive PRD generation process using ChainRunner.
    
    The pipeline generates all 13 required sections of a production-grade PRD:
      1. Executive Summary
      2. Problem Statement
      3. Target Audience / User Personas
      4. Functional Requirements
      5. Non-Functional Requirements
      6. User Stories & Acceptance Criteria (Gherkin format)
      7. Technical Architecture Overview
      8. API Design
      9. UI/UX Considerations
      10. Security & Compliance
      11. Testing Strategy
      12. Deployment & DevOps Plan
      13. Assumptions, Risks & Open Questions
    
    Each step builds upon previous outputs to create a cohesive document.
    """

    def __init__(self, config: OrchestratorConfig) -> None:
        self.config = config
        self.llm = LLMClient(config)
        self.obs = AgentObservability("prd_generator")
        self.cost_router = CostRouter(config)
        self.context_mgr = ContextManager(max_context_tokens=3000)

    def run(self, prd_input: PRDInput) -> PRDOutput:
        """
        Execute the full PRD generation chain for the given feature idea.
        """
        runner = ChainRunner(
            llm=self.llm,
            cost_router=self.cost_router,
            observability=self.obs,
            context_manager=self.context_mgr,
        )
        
        # Seed chain state with input parameters
        runner.state.update({
            "feature_idea": prd_input.feature_idea,
            "product_name": prd_input.product_name,
            "target_industry": prd_input.target_industry or "General Software",
            "company_context": prd_input.company_context or "A modern technology company",
        })
        
        steps = self._build_steps()
        state = runner.run(steps)
        
        # Generate final consolidated document
        final_doc = self._assemble_final_document(state)
        
        return PRDOutput(
            feature_idea=prd_input.feature_idea,
            executive_summary=state.get("executive_summary", ""),
            problem_statement=state.get("problem_statement", ""),
            target_audience=state.get("target_audience", ""),
            functional_requirements=state.get("functional_requirements", ""),
            non_functional_requirements=state.get("non_functional_requirements", ""),
            user_stories=state.get("user_stories", ""),
            technical_architecture=state.get("technical_architecture", ""),
            api_design=state.get("api_design", ""),
            ui_ux_considerations=state.get("ui_ux_considerations", ""),
            security_compliance=state.get("security_compliance", ""),
            testing_strategy=state.get("testing_strategy", ""),
            deployment_devops=state.get("deployment_devops", ""),
            assumptions_risks=state.get("assumptions_risks", ""),
            final_document=final_doc,
            chain_state=state,
        )

    def _build_steps(self) -> List[ChainStep]:
        """
        Construct the sequence of ChainStep instances for PRD generation.
        """
        steps: List[ChainStep] = []
        
        # Step 1: Executive Summary
        steps.append(
            ChainStep(
                name="executive_summary",
                inputs=["feature_idea", "product_name", "target_industry"],
                output_key="executive_summary",
                task_type="analysis",
                max_tokens=1024,
                temperature=0.7,
                importance="high",
                tags=["executive", "summary"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Product Name: {product_name}\n"
                    "Target Industry: {target_industry}\n\n"
                    "Write a comprehensive Executive Summary section for a Product Requirements Document.\n\n"
                    "Include:\n"
                    "1. High-level overview of the product/feature (2-3 paragraphs)\n"
                    "2. Business case - why this matters to the business\n"
                    "3. Primary business goals and success metrics\n"
                    "4. Strategic alignment and value proposition\n\n"
                    "Write in a professional, executive-friendly tone. Use clear, concise language.\n"
                    "Format using Markdown with appropriate headings."
                ),
                quality_validator=lambda x: len(x.strip()) > 200 and "##" in x,
            )
        )
        
        # Step 2: Problem Statement
        steps.append(
            ChainStep(
                name="problem_statement",
                inputs=["feature_idea", "executive_summary"],
                output_key="problem_statement",
                task_type="analysis",
                max_tokens=1024,
                temperature=0.7,
                importance="high",
                tags=["problem", "analysis"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Executive Summary: {executive_summary}\n\n"
                    "Write a comprehensive Problem Statement section for the PRD.\n\n"
                    "Include:\n"
                    "1. Clear articulation of the problem being solved\n"
                    "2. Who experiences this problem (user segments)\n"
                    "3. Why this problem is critical and urgent\n"
                    "4. Current pain points and workarounds\n"
                    "5. Impact of NOT solving this problem\n\n"
                    "Be specific and data-driven where possible. Use real-world scenarios.\n"
                    "Format using Markdown with appropriate headings."
                ),
                quality_validator=lambda x: len(x.strip()) > 200,
            )
        )
        
        # Step 3: Target Audience / User Personas
        steps.append(
            ChainStep(
                name="target_audience",
                inputs=["feature_idea", "problem_statement"],
                output_key="target_audience",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="high",
                tags=["personas", "users"],
                prompt_template=(
                    "You are an expert UX researcher and product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Problem Statement: {problem_statement}\n\n"
                    "Write a comprehensive Target Audience / User Personas section for the PRD.\n\n"
                    "Include:\n"
                    "1. Define 2-4 primary user personas\n"
                    "2. For each persona include:\n"
                    "   - Name and role/title\n"
                    "   - Background and context\n"
                    "   - Key pain points\n"
                    "   - Goals and motivations\n"
                    "   - Technical proficiency level\n"
                    "   - How they will use this feature\n"
                    "3. Prioritization of personas (primary vs secondary)\n\n"
                    "Make personas realistic and detailed.\n"
                    "Format using Markdown with appropriate headings."
                ),
                quality_validator=lambda x: len(x.strip()) > 300,
            )
        )
        
        # Step 4: Functional Requirements
        steps.append(
            ChainStep(
                name="functional_requirements",
                inputs=["feature_idea", "problem_statement", "target_audience"],
                output_key="functional_requirements",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.6,
                importance="high",
                tags=["requirements", "features"],
                prompt_template=(
                    "You are a senior full-stack developer and technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Problem Statement: {problem_statement}\n"
                    "Target Audience: {target_audience}\n\n"
                    "Write a comprehensive Functional Requirements section for the PRD.\n\n"
                    "Include:\n"
                    "1. List of all core features (minimum 8-12 features)\n"
                    "2. For each feature:\n"
                    "   - Feature ID (FR-001, FR-002, etc.)\n"
                    "   - Feature name\n"
                    "   - Detailed description\n"
                    "   - Priority (Must-have, Should-have, Nice-to-have)\n"
                    "   - Acceptance criteria\n"
                    "   - Edge cases and error handling\n"
                    "3. Feature dependencies and relationships\n"
                    "4. Out-of-scope items (what we explicitly won't build)\n\n"
                    "Be specific and technical. Think through edge cases.\n"
                    "Format using Markdown with numbered lists and tables where appropriate."
                ),
                quality_validator=lambda x: len(x.strip()) > 500 and "FR-" in x,
            )
        )
        
        # Step 5: Non-Functional Requirements
        steps.append(
            ChainStep(
                name="non_functional_requirements",
                inputs=["feature_idea", "functional_requirements"],
                output_key="non_functional_requirements",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["requirements", "nfr"],
                prompt_template=(
                    "You are a senior full-stack developer and system architect.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Functional Requirements: {functional_requirements}\n\n"
                    "Write a comprehensive Non-Functional Requirements section for the PRD.\n\n"
                    "Include detailed requirements for:\n"
                    "1. Performance (response times, throughput, resource limits)\n"
                    "2. Scalability (user load, growth projections, scaling strategy)\n"
                    "3. Reliability & Availability (uptime SLA, fault tolerance, disaster recovery)\n"
                    "4. Accessibility (WCAG compliance, keyboard navigation, screen readers)\n"
                    "5. Localization & Internationalization (languages, RTL, timezones)\n"
                    "6. Compatibility (browsers, devices, legacy systems)\n\n"
                    "Provide specific, measurable targets.\n"
                    "Format using Markdown with appropriate headings."
                ),
                quality_validator=lambda x: len(x.strip()) > 400,
            )
        )
        
        # Step 6: User Stories & Acceptance Criteria
        steps.append(
            ChainStep(
                name="user_stories",
                inputs=["target_audience", "functional_requirements"],
                output_key="user_stories",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.7,
                importance="high",
                tags=["stories", "gherkin"],
                prompt_template=(
                    "You are an expert Agile coach and QA engineer.\n\n"
                    "Target Audience: {target_audience}\n"
                    "Functional Requirements: {functional_requirements}\n\n"
                    "Write a comprehensive User Stories & Acceptance Criteria section for the PRD.\n\n"
                    "Requirements:\n"
                    "1. Create 10-15 user stories covering all personas and use cases\n"
                    "2. Use proper format: 'As a [persona], I want to [action], so that [benefit]'\n"
                    "3. For each story, provide acceptance criteria in Gherkin format:\n"
                    "   - Given [initial context]\n"
                    "   - When [action taken]\n"
                    "   - Then [expected outcome]\n"
                    "4. Include multiple scenarios per story (happy path, edge cases, error cases)\n"
                    "5. Cover core workflows, error handling, edge cases, and different personas\n\n"
                    "Be thorough and testable. Each story should be independently verifiable.\n"
                    "Format using Markdown with clear story IDs (US-001, US-002, etc.)."
                ),
                quality_validator=lambda x: len(x.strip()) > 500 and "Given" in x and "When" in x and "Then" in x,
            )
        )
        
        # Step 7: Technical Architecture Overview
        steps.append(
            ChainStep(
                name="technical_architecture",
                inputs=["feature_idea", "functional_requirements", "non_functional_requirements"],
                output_key="technical_architecture",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.6,
                importance="high",
                tags=["architecture", "technical"],
                prompt_template=(
                    "You are a senior software architect and full-stack developer.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Non-Functional Requirements: {non_functional_requirements}\n\n"
                    "Write a comprehensive Technical Architecture Overview section for the PRD.\n\n"
                    "Include:\n"
                    "1. High-level system design and architecture pattern\n"
                    "2. Frontend Architecture (framework, state management, components)\n"
                    "3. Backend Architecture (stack, services, business logic)\n"
                    "4. Data Architecture (database choices, schema, data flow)\n"
                    "5. Integration Points (external APIs, third-party services)\n"
                    "6. Sequence Diagram Description for key flows\n"
                    "7. Technology Stack Summary\n\n"
                    "Be specific about technology choices and provide rationale.\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 500,
            )
        )
        
        # Step 8: API Design
        steps.append(
            ChainStep(
                name="api_design",
                inputs=["functional_requirements", "technical_architecture"],
                output_key="api_design",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.6,
                importance="high",
                tags=["api", "endpoints"],
                prompt_template=(
                    "You are a senior backend engineer and API architect.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Technical Architecture: {technical_architecture}\n\n"
                    "Write a comprehensive API Design section for the PRD.\n\n"
                    "Include:\n"
                    "1. API Style (REST, GraphQL, gRPC) and rationale\n"
                    "2. For each major endpoint (minimum 8-10):\n"
                    "   - HTTP method and path\n"
                    "   - Purpose/description\n"
                    "   - Request schema\n"
                    "   - Response schema\n"
                    "   - Error responses\n"
                    "   - Example request/response\n"
                    "3. Authentication & Authorization (mechanism, permissions, RBAC)\n"
                    "4. API Versioning strategy\n"
                    "5. Rate limiting and throttling\n\n"
                    "Use OpenAPI/Swagger-style documentation format.\n"
                    "Format using Markdown with code blocks."
                ),
                quality_validator=lambda x: len(x.strip()) > 500 and ("GET" in x or "POST" in x),
            )
        )
        
        # Step 9: UI/UX Considerations
        steps.append(
            ChainStep(
                name="ui_ux_considerations",
                inputs=["target_audience", "functional_requirements"],
                output_key="ui_ux_considerations",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="medium",
                tags=["ui", "ux", "design"],
                prompt_template=(
                    "You are a senior UX designer and product manager.\n\n"
                    "Target Audience: {target_audience}\n"
                    "Functional Requirements: {functional_requirements}\n\n"
                    "Write a comprehensive UI/UX Considerations section for the PRD.\n\n"
                    "Include:\n"
                    "1. Page/Screen Layout Descriptions\n"
                    "2. Component Specifications\n"
                    "3. Interaction Patterns\n"
                    "4. Design System & Visual Design\n"
                    "5. Mobile Responsiveness\n"
                    "6. Accessibility Considerations\n\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 400,
            )
        )
        
        # Step 10: Security & Compliance
        steps.append(
            ChainStep(
                name="security_compliance",
                inputs=["feature_idea", "api_design", "technical_architecture"],
                output_key="security_compliance",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["security", "compliance"],
                prompt_template=(
                    "You are a senior security engineer and compliance specialist.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "API Design: {api_design}\n"
                    "Technical Architecture: {technical_architecture}\n\n"
                    "Write a comprehensive Security & Compliance section for the PRD.\n\n"
                    "Include:\n"
                    "1. Data Handling & Privacy\n"
                    "2. Authentication & Authorization\n"
                    "3. Security Controls (input validation, XSS, CSRF, SQL injection prevention)\n"
                    "4. Compliance Requirements (GDPR, SOC2, HIPAA if applicable)\n"
                    "5. Audit Logging\n"
                    "6. Vulnerability Management\n\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 400,
            )
        )
        
        # Step 11: Testing Strategy
        steps.append(
            ChainStep(
                name="testing_strategy",
                inputs=["functional_requirements", "user_stories", "api_design"],
                output_key="testing_strategy",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["testing", "qa"],
                prompt_template=(
                    "You are a senior QA engineer and test architect.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "User Stories: {user_stories}\n"
                    "API Design: {api_design}\n\n"
                    "Write a comprehensive Testing Strategy section for the PRD.\n\n"
                    "Include:\n"
                    "1. Testing Levels & Coverage (unit, integration, E2E)\n"
                    "2. Test Types (functional, performance, security, accessibility)\n"
                    "3. Testing Tools & Frameworks\n"
                    "4. Test Automation\n"
                    "5. Quality Gates\n"
                    "6. Test Environments\n\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 400,
            )
        )
        
        # Step 12: Deployment & DevOps Plan
        steps.append(
            ChainStep(
                name="deployment_devops",
                inputs=["technical_architecture", "non_functional_requirements"],
                output_key="deployment_devops",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["deployment", "devops"],
                prompt_template=(
                    "You are a senior DevOps engineer and site reliability engineer.\n\n"
                    "Technical Architecture: {technical_architecture}\n"
                    "Non-Functional Requirements: {non_functional_requirements}\n\n"
                    "Write a comprehensive Deployment & DevOps Plan section for the PRD.\n\n"
                    "Include:\n"
                    "1. Environment Strategy (dev, staging, prod)\n"
                    "2. CI/CD Pipeline\n"
                    "3. Deployment Strategy (blue-green, canary, rolling)\n"
                    "4. Infrastructure as Code\n"
                    "5. Monitoring & Observability\n"
                    "6. Rollback Plans\n"
                    "7. Disaster Recovery\n\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 400,
            )
        )
        
        # Step 13: Assumptions, Risks & Open Questions
        steps.append(
            ChainStep(
                name="assumptions_risks",
                inputs=["feature_idea", "functional_requirements", "technical_architecture"],
                output_key="assumptions_risks",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="high",
                tags=["risks", "assumptions"],
                prompt_template=(
                    "You are a senior technical product manager and risk analyst.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Technical Architecture: {technical_architecture}\n\n"
                    "Write a comprehensive Assumptions, Risks & Open Questions section for the PRD.\n\n"
                    "Include:\n"
                    "1. Key Assumptions\n"
                    "2. Known Risks (with impact, probability, mitigation)\n"
                    "3. Dependencies (external and internal)\n"
                    "4. Open Questions\n"
                    "5. Risk Mitigation Strategies\n\n"
                    "Format using Markdown."
                ),
                quality_validator=lambda x: len(x.strip()) > 300,
            )
        )
        
        return steps

    def _assemble_final_document(self, state: Dict[str, str]) -> str:
        """
        Combine all sections into a single formatted PRD document.
        """
        from datetime import datetime
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        document = f"""# Product Requirements Document

**Product/Feature:** {state.get('product_name', 'Product')}

**Version:** 1.0  
**Last Updated:** {current_date}  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience / User Personas](#3-target-audience--user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Stories & Acceptance Criteria](#6-user-stories--acceptance-criteria)
7. [Technical Architecture Overview](#7-technical-architecture-overview)
8. [API Design](#8-api-design)
9. [UI/UX Considerations](#9-uiux-considerations)
10. [Security & Compliance](#10-security--compliance)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment & DevOps Plan](#12-deployment--devops-plan)
13. [Assumptions, Risks & Open Questions](#13-assumptions-risks--open-questions)

---

## 1. Executive Summary

{state.get('executive_summary', '')}

---

## 2. Problem Statement

{state.get('problem_statement', '')}

---

## 3. Target Audience / User Personas

{state.get('target_audience', '')}

---

## 4. Functional Requirements

{state.get('functional_requirements', '')}

---

## 5. Non-Functional Requirements

{state.get('non_functional_requirements', '')}

---

## 6. User Stories & Acceptance Criteria

{state.get('user_stories', '')}

---

## 7. Technical Architecture Overview

{state.get('technical_architecture', '')}

---

## 8. API Design

{state.get('api_design', '')}

---

## 9. UI/UX Considerations

{state.get('ui_ux_considerations', '')}

---

## 10. Security & Compliance

{state.get('security_compliance', '')}

---

## 11. Testing Strategy

{state.get('testing_strategy', '')}

---

## 12. Deployment & DevOps Plan

{state.get('deployment_devops', '')}

---

## 13. Assumptions, Risks & Open Questions

{state.get('assumptions_risks', '')}

---

## Appendix

### Glossary

Add key terms and definitions here.

### References

Add links to external documents, research, or resources here.

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {current_date} | PRD Generator | Initial draft |

"""
        return document
