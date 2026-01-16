from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from ..config import OrchestratorConfig
from ..llm_client import LLMClient
from ..observability import AgentObservability
from ..cost import CostRouter
from ..context import ContextManager
from ..chaining import ChainRunner, ChainStep


@dataclass
class PRDInput:
    """
    Input parameters for the PRD generation workflow.
    """
    feature_idea: str
    product_name: Optional[str] = None
    target_users: Optional[str] = None
    business_context: Optional[str] = None


@dataclass
class PRDOutput:
    """
    Output of the PRD generation workflow.
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
    full_document: str
    chain_state: Dict[str, str]


class PRDGeneratorWorkflow:
    """
    Orchestrates a multi-step Product Requirements Document (PRD) generation process.

    The pipeline generates all 13 required sections:
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

    Each step has a quality validator to ensure acceptable outputs.
    """

    def __init__(self, config: OrchestratorConfig) -> None:
        self.config = config
        self.llm = LLMClient(config)
        self.obs = AgentObservability("prd_generator")
        self.cost_router = CostRouter(config)
        self.context_mgr = ContextManager(max_context_tokens=3000)

    def run(self, prd_input: PRDInput) -> PRDOutput:
        """
        Execute the full PRD generation chain for the given input.
        """
        runner = ChainRunner(
            llm=self.llm,
            cost_router=self.cost_router,
            observability=self.obs,
            context_manager=self.context_mgr,
        )
        # Seed chain state with input parameters
        runner.state.update(
            {
                "feature_idea": prd_input.feature_idea,
                "product_name": prd_input.product_name or "Unnamed Product",
                "target_users": prd_input.target_users or "",
                "business_context": prd_input.business_context or "",
            }
        )
        steps = self._build_steps()
        state = runner.run(steps)
        
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
            full_document=state.get("full_document", ""),
            chain_state=state,
        )

    def _build_steps(self) -> List[ChainStep]:
        """
        Construct the sequence of ChainStep instances for PRD generation.
        """
        steps: List[ChainStep] = []
        
        # 1. Executive Summary
        steps.append(
            ChainStep(
                name="executive_summary",
                inputs=["feature_idea", "product_name", "business_context"],
                output_key="executive_summary",
                task_type="writing",
                max_tokens=1024,
                temperature=0.7,
                importance="high",
                tags=["prd", "executive"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature/Product Idea: {feature_idea}\n"
                    "Product Name: {product_name}\n"
                    "Business Context: {business_context}\n\n"
                    "Write an Executive Summary section for a Product Requirements Document.\n\n"
                    "Include:\n"
                    "- High-level overview of the product/feature (2-3 paragraphs)\n"
                    "- Business case and primary goals\n"
                    "- Key success metrics\n"
                    "- Strategic alignment\n\n"
                    "Format as markdown with '## Executive Summary' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 2. Problem Statement
        steps.append(
            ChainStep(
                name="problem_statement",
                inputs=["feature_idea", "executive_summary"],
                output_key="problem_statement",
                task_type="analysis",
                max_tokens=1024,
                temperature=0.7,
                importance="high",
                tags=["prd", "problem"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Context from Executive Summary: {executive_summary}\n\n"
                    "Write a Problem Statement section for the PRD.\n\n"
                    "Include:\n"
                    "- Clear articulation of the problem being solved\n"
                    "- Who experiences this problem and why\n"
                    "- Current pain points and their impact\n"
                    "- Why this problem is critical to solve now\n\n"
                    "Format as markdown with '## Problem Statement' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 3. Target Audience / User Personas
        steps.append(
            ChainStep(
                name="target_audience",
                inputs=["feature_idea", "problem_statement", "target_users"],
                output_key="target_audience",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="high",
                tags=["prd", "personas"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Problem Statement: {problem_statement}\n"
                    "Additional Target User Info: {target_users}\n\n"
                    "Write a Target Audience / User Personas section.\n\n"
                    "Include:\n"
                    "- 2-3 primary user personas with:\n"
                    "  - Persona name and role\n"
                    "  - Key characteristics\n"
                    "  - Pain points specific to this persona\n"
                    "  - Goals and motivations\n"
                    "  - Technical proficiency level\n\n"
                    "Format as markdown with '## Target Audience / User Personas' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 4. Functional Requirements
        steps.append(
            ChainStep(
                name="functional_requirements",
                inputs=["feature_idea", "problem_statement", "target_audience"],
                output_key="functional_requirements",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.6,
                importance="high",
                tags=["prd", "requirements"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Problem: {problem_statement}\n"
                    "Users: {target_audience}\n\n"
                    "Write a Functional Requirements section.\n\n"
                    "Include:\n"
                    "- List of all core features (use numbered list)\n"
                    "- Clearly scoped feature behavior for each\n"
                    "- Edge cases and error scenarios\n"
                    "- Data requirements and inputs/outputs\n"
                    "- Integration points with other systems\n\n"
                    "Format as markdown with '## Functional Requirements' heading."
                ),
                quality_validator=self._validate_requirements,
            )
        )
        
        # 5. Non-Functional Requirements
        steps.append(
            ChainStep(
                name="non_functional_requirements",
                inputs=["feature_idea", "functional_requirements"],
                output_key="non_functional_requirements",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["prd", "nfr"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "Feature Idea: {feature_idea}\n"
                    "Functional Requirements: {functional_requirements}\n\n"
                    "Write a Non-Functional Requirements section.\n\n"
                    "Include:\n"
                    "- Performance targets (response time, throughput, load capacity)\n"
                    "- Scalability requirements\n"
                    "- Availability and uptime targets (SLA)\n"
                    "- Security requirements\n"
                    "- Usability and accessibility standards (WCAG, etc.)\n"
                    "- Localization and internationalization needs\n"
                    "- Compatibility requirements (browsers, devices, OS)\n\n"
                    "Format as markdown with '## Non-Functional Requirements' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 6. User Stories & Acceptance Criteria
        steps.append(
            ChainStep(
                name="user_stories",
                inputs=["target_audience", "functional_requirements"],
                output_key="user_stories",
                task_type="writing",
                max_tokens=2048,
                temperature=0.7,
                importance="high",
                tags=["prd", "user-stories"],
                prompt_template=(
                    "You are an expert technical product manager.\n\n"
                    "User Personas: {target_audience}\n"
                    "Functional Requirements: {functional_requirements}\n\n"
                    "Write a User Stories & Acceptance Criteria section.\n\n"
                    "For each major feature:\n"
                    "- Write user stories in format: 'As a [persona], I want to [action], so that [benefit]'\n"
                    "- Provide Gherkin-style acceptance criteria:\n"
                    "  - Given [initial context]\n"
                    "  - When [action occurs]\n"
                    "  - Then [expected outcome]\n"
                    "- Cover all personas and major use cases\n"
                    "- Include edge cases and error scenarios\n\n"
                    "Format as markdown with '## User Stories & Acceptance Criteria' heading."
                ),
                quality_validator=self._validate_gherkin,
            )
        )
        
        # 7. Technical Architecture Overview
        steps.append(
            ChainStep(
                name="technical_architecture",
                inputs=["functional_requirements", "non_functional_requirements"],
                output_key="technical_architecture",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.6,
                importance="high",
                tags=["prd", "architecture"],
                prompt_template=(
                    "You are a senior full-stack developer and solutions architect.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Non-Functional Requirements: {non_functional_requirements}\n\n"
                    "Write a Technical Architecture Overview section.\n\n"
                    "Include:\n"
                    "- High-level system design diagram description\n"
                    "- Frontend architecture (frameworks, state management, routing)\n"
                    "- Backend architecture (services, APIs, microservices vs monolith)\n"
                    "- Database design (schema approach, data models)\n"
                    "- External services and third-party integrations\n"
                    "- Data flow and sequence diagrams description\n"
                    "- Technology stack recommendations with rationale\n\n"
                    "Format as markdown with '## Technical Architecture Overview' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 8. API Design
        steps.append(
            ChainStep(
                name="api_design",
                inputs=["functional_requirements", "technical_architecture"],
                output_key="api_design",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.5,
                importance="medium",
                tags=["prd", "api"],
                prompt_template=(
                    "You are a senior backend developer and API architect.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Technical Architecture: {technical_architecture}\n\n"
                    "Write an API Design section.\n\n"
                    "Include:\n"
                    "- API style (REST, GraphQL, gRPC, etc.) with rationale\n"
                    "- Core endpoint specifications:\n"
                    "  - HTTP method and path\n"
                    "  - Request parameters and body schema\n"
                    "  - Response schema (success and error cases)\n"
                    "  - Status codes\n"
                    "- Authentication and authorization approach (JWT, OAuth2, API keys, etc.)\n"
                    "- Rate limiting and throttling strategy\n"
                    "- Versioning strategy\n"
                    "- Error handling patterns\n\n"
                    "Format as markdown with '## API Design' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 9. UI/UX Considerations
        steps.append(
            ChainStep(
                name="ui_ux_considerations",
                inputs=["target_audience", "functional_requirements", "user_stories"],
                output_key="ui_ux_considerations",
                task_type="writing",
                max_tokens=1536,
                temperature=0.7,
                importance="medium",
                tags=["prd", "ui-ux"],
                prompt_template=(
                    "You are a UX designer and product manager.\n\n"
                    "User Personas: {target_audience}\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "User Stories: {user_stories}\n\n"
                    "Write a UI/UX Considerations section.\n\n"
                    "Include:\n"
                    "- Key pages and views (with brief wireframe descriptions)\n"
                    "- Navigation structure and user flows\n"
                    "- Component library and design system references\n"
                    "- Interaction patterns (modals, toasts, loading states, etc.)\n"
                    "- Mobile responsiveness approach\n"
                    "- Accessibility considerations (keyboard navigation, screen readers, color contrast)\n"
                    "- Error states and user feedback mechanisms\n\n"
                    "Format as markdown with '## UI/UX Considerations' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 10. Security & Compliance
        steps.append(
            ChainStep(
                name="security_compliance",
                inputs=["functional_requirements", "non_functional_requirements", "api_design"],
                output_key="security_compliance",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.5,
                importance="high",
                tags=["prd", "security"],
                prompt_template=(
                    "You are a security engineer and compliance specialist.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Non-Functional Requirements: {non_functional_requirements}\n"
                    "API Design: {api_design}\n\n"
                    "Write a Security & Compliance section.\n\n"
                    "Include:\n"
                    "- Data handling and privacy policies (PII, sensitive data)\n"
                    "- Encryption requirements (at rest and in transit)\n"
                    "- Authentication and authorization mechanisms\n"
                    "- Role-based access control (RBAC) design\n"
                    "- Audit logging and monitoring requirements\n"
                    "- Compliance frameworks (GDPR, SOC2, HIPAA, etc.) if applicable\n"
                    "- Vulnerability management and security testing approach\n"
                    "- Incident response procedures\n\n"
                    "Format as markdown with '## Security & Compliance' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 11. Testing Strategy
        steps.append(
            ChainStep(
                name="testing_strategy",
                inputs=["functional_requirements", "technical_architecture", "user_stories"],
                output_key="testing_strategy",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["prd", "testing"],
                prompt_template=(
                    "You are a QA engineer and test architect.\n\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Technical Architecture: {technical_architecture}\n"
                    "User Stories: {user_stories}\n\n"
                    "Write a Testing Strategy section.\n\n"
                    "Include:\n"
                    "- Unit testing approach and coverage targets\n"
                    "- Integration testing strategy\n"
                    "- End-to-end (E2E) testing plan\n"
                    "- Performance and load testing requirements\n"
                    "- Security testing (penetration testing, vulnerability scans)\n"
                    "- Accessibility testing approach\n"
                    "- Testing tools and frameworks (Jest, Cypress, Playwright, etc.)\n"
                    "- Test automation and CI integration\n"
                    "- QA processes and release criteria\n\n"
                    "Format as markdown with '## Testing Strategy' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 12. Deployment & DevOps Plan
        steps.append(
            ChainStep(
                name="deployment_devops",
                inputs=["technical_architecture", "non_functional_requirements"],
                output_key="deployment_devops",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.6,
                importance="high",
                tags=["prd", "devops"],
                prompt_template=(
                    "You are a DevOps engineer and site reliability engineer.\n\n"
                    "Technical Architecture: {technical_architecture}\n"
                    "Non-Functional Requirements: {non_functional_requirements}\n\n"
                    "Write a Deployment & DevOps Plan section.\n\n"
                    "Include:\n"
                    "- Environment strategy (development, staging, production)\n"
                    "- Infrastructure as Code (IaC) approach (Terraform, CloudFormation, etc.)\n"
                    "- CI/CD pipeline design (GitHub Actions, GitLab CI, Jenkins, etc.)\n"
                    "- Build and deployment processes\n"
                    "- Containerization strategy (Docker, Kubernetes)\n"
                    "- Cloud provider and services (AWS, Azure, GCP)\n"
                    "- Monitoring and observability (logs, metrics, traces, alerts)\n"
                    "- Rollback and disaster recovery plans\n"
                    "- Scaling strategy (horizontal vs vertical)\n\n"
                    "Format as markdown with '## Deployment & DevOps Plan' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 13. Assumptions, Risks & Open Questions
        steps.append(
            ChainStep(
                name="assumptions_risks",
                inputs=["executive_summary", "problem_statement", "functional_requirements", "technical_architecture"],
                output_key="assumptions_risks",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="medium",
                tags=["prd", "risks"],
                prompt_template=(
                    "You are an experienced product manager and risk analyst.\n\n"
                    "Executive Summary: {executive_summary}\n"
                    "Problem Statement: {problem_statement}\n"
                    "Functional Requirements: {functional_requirements}\n"
                    "Technical Architecture: {technical_architecture}\n\n"
                    "Write an Assumptions, Risks & Open Questions section.\n\n"
                    "Include:\n"
                    "- Key assumptions made during planning\n"
                    "- Technical risks and mitigation strategies\n"
                    "- Business and market risks\n"
                    "- Resource and timeline risks\n"
                    "- External dependencies and third-party risks\n"
                    "- Open questions that need resolution\n"
                    "- Decision points requiring stakeholder input\n\n"
                    "Format as markdown with '## Assumptions, Risks & Open Questions' heading."
                ),
                quality_validator=self._validate_section,
            )
        )
        
        # 14. Final Document Assembly
        steps.append(
            ChainStep(
                name="final_document",
                inputs=[
                    "product_name",
                    "feature_idea",
                    "executive_summary",
                    "problem_statement",
                    "target_audience",
                    "functional_requirements",
                    "non_functional_requirements",
                    "user_stories",
                    "technical_architecture",
                    "api_design",
                    "ui_ux_considerations",
                    "security_compliance",
                    "testing_strategy",
                    "deployment_devops",
                    "assumptions_risks",
                ],
                output_key="full_document",
                task_type="writing",
                max_tokens=1024,
                temperature=0.5,
                importance="high",
                tags=["prd", "final"],
                prompt_template=(
                    "You are a technical editor assembling a Product Requirements Document.\n\n"
                    "Assemble all sections into a cohesive, production-grade PRD.\n\n"
                    "Product Name: {product_name}\n"
                    "Feature Idea: {feature_idea}\n\n"
                    "Sections:\n"
                    "{executive_summary}\n\n"
                    "{problem_statement}\n\n"
                    "{target_audience}\n\n"
                    "{functional_requirements}\n\n"
                    "{non_functional_requirements}\n\n"
                    "{user_stories}\n\n"
                    "{technical_architecture}\n\n"
                    "{api_design}\n\n"
                    "{ui_ux_considerations}\n\n"
                    "{security_compliance}\n\n"
                    "{testing_strategy}\n\n"
                    "{deployment_devops}\n\n"
                    "{assumptions_risks}\n\n"
                    "Create a complete PRD document with:\n"
                    "1. Title: '# Product Requirements Document: {product_name}'\n"
                    "2. Brief introduction paragraph\n"
                    "3. All sections assembled in order\n"
                    "4. Ensure consistent formatting and markdown structure\n"
                    "5. Add table of contents after introduction\n\n"
                    "Output the complete, production-ready PRD in markdown format."
                ),
                quality_validator=self._validate_full_document,
            )
        )
        
        return steps

    # ---- Quality validators ----

    def _validate_section(self, text: str) -> bool:
        """Validate that a section has reasonable content."""
        if len(text) < 200:
            return False
        if "##" not in text:
            return False
        return True

    def _validate_requirements(self, text: str) -> bool:
        """Validate that requirements section has proper structure."""
        if len(text) < 400:
            return False
        if "##" not in text:
            return False
        # Check for numbered or bulleted lists
        has_list = any(marker in text for marker in ["- ", "* ", "1.", "2.", "3."])
        return has_list

    def _validate_gherkin(self, text: str) -> bool:
        """Validate that user stories include Gherkin-style format."""
        if len(text) < 400:
            return False
        if "##" not in text:
            return False
        lower = text.lower()
        has_gherkin = all(keyword in lower for keyword in ["given", "when", "then"])
        has_user_story = "as a" in lower or "as an" in lower
        return has_gherkin and has_user_story

    def _validate_full_document(self, text: str) -> bool:
        """Validate the final assembled document."""
        if len(text) < 2000:
            return False
        if "# Product Requirements Document" not in text:
            return False
        # Check for multiple sections
        section_count = text.count("## ")
        if section_count < 10:
            return False
        return True
