# GitHub Copilot Custom Agents

## Symphony of Roles Architecture

This directory contains **17 specialized GitHub Copilot Custom Agents** implementing the Symphony of Roles architecture for the FlashFusion source-of-truth-monorepo. Each agent represents a distinct persona with specialized expertise, working collaboratively across 6 development phases.

### Architecture Overview

The Symphony of Roles architecture enables AI-assisted development where specialized agents collaborate using RACI (Responsible, Accountable, Consulted, Informed) accountability matrices. This approach ensures:

- **Specialization**: Each agent has deep expertise in their domain
- **Collaboration**: Agents work together across development phases
- **Accountability**: Clear ownership and responsibility for deliverables
- **Consistency**: Standardized outputs and security boundaries

## Agent Directory

| File | Role | Description |
|------|------|-------------|
| `visionary.agent.md` | Product Strategist | Market research, competitive analysis, strategic roadmaps |
| `product.agent.md` | Product Manager | User stories, backlog prioritization, sprint planning |
| `ux.agent.md` | UX Designer | User research, personas, journey mapping, wireframes |
| `ui.agent.md` | UI Designer | Design tokens, component specs, brand consistency |
| `mobile.agent.md` | Mobile Developer | React Native, iOS/Android, platform guidelines |
| `database.agent.md` | Database Architect | Supabase, schemas, RLS policies, migrations |
| `test.agent.md` | QA Engineer | Test planning, unit/integration/E2E, coverage |
| `deploy.agent.md` | DevOps Engineer | CI/CD, GitHub Actions, Docker, infrastructure |
| `security.agent.md` | Security Analyst | Audits, OWASP, vulnerability scanning, compliance |
| `growth.agent.md` | Growth Strategist | Marketing, ASO, SEO, campaigns, retention |
| `analyst.agent.md` | Business Analyst | Requirements, BRD, feasibility, RACI matrices |
| `docs.agent.md` | Documentation Specialist | README, JSDoc, CHANGELOG, ADRs, API docs |
| `api.agent.md` | API Designer | REST design, OpenAPI specs, Zod schemas |
| `automation.agent.md` | Automation Specialist | n8n workflows, webhooks, integrations |
| `review.agent.md` | Code Reviewer | PR reviews, code quality, security review |
| `refactor.agent.md` | Refactoring Specialist | Code improvement, SOLID, complexity reduction |
| `debug.agent.md` | Debugging Specialist | Error tracing, root cause analysis, profiling |

## RACI Matrix by Development Phase

### Phase Responsibilities

| Phase | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
|-------|-----------------|-----------------|---------------|--------------|
| **Discovery** | Visionary, Analyst | Product | UX, Security | Growth |
| **Design** | UX, UI | Product | Visionary | Growth |
| **Build** | Mobile, Database, Deploy | Product | Security, Test | UI |
| **Release** | Test, Deploy | Product | Security | Growth |
| **Growth** | Growth | Visionary | Product | UX |
| **Maintenance** | Deploy, Test, Security | Product | Database | Visionary |

### RACI Legend

- **R (Responsible)**: Does the work to complete the task
- **A (Accountable)**: Ultimately answerable for the task's completion
- **C (Consulted)**: Provides input and expertise before decisions
- **I (Informed)**: Kept updated on progress and decisions

## Usage Instructions

### GitHub.com (Copilot Chat)

1. Open any file in the repository on GitHub.com
2. Click the Copilot icon in the top-right corner
3. In the chat, invoke an agent using:
   ```
   @visionary-agent Analyze our competitive landscape for AI-powered development tools
   ```

### VS Code (GitHub Copilot Extension)

1. Ensure GitHub Copilot extension is installed and active
2. Open the Copilot Chat panel (Ctrl+Shift+I / Cmd+Shift+I)
3. Invoke agents in the chat:
   ```
   @product-agent Create user stories for the new dashboard feature
   ```

### GitHub Copilot CLI

1. Install GitHub Copilot CLI: `gh extension install github/gh-copilot`
2. Use in terminal:
   ```bash
   gh copilot suggest "@test-agent Generate unit tests for the UserService class"
   ```

### Multi-Agent Workflows

Agents can be chained for complex workflows:

```
# Discovery Phase
@visionary-agent Define market opportunity for feature X
@analyst-agent Create BRD based on visionary analysis

# Design Phase
@ux-agent Create user personas for feature X
@ui-agent Define design tokens for the new component

# Build Phase
@database-agent Design schema for feature X
@mobile-agent Review React Native implementation

# Release Phase
@test-agent Create E2E test plan
@deploy-agent Configure CI/CD pipeline

# Maintenance Phase
@security-agent Run security audit
@debug-agent Investigate performance issue
```

## Requirements

### Subscription Tiers

| Feature | Copilot Individual | Copilot Business | Copilot Enterprise |
|---------|-------------------|------------------|-------------------|
| Agent Access | ✅ | ✅ | ✅ |
| Custom Instructions | ✅ | ✅ | ✅ |
| Knowledge Base | ❌ | ✅ | ✅ |
| Fine-tuning | ❌ | ❌ | ✅ |

### Minimum Requirements

- GitHub Copilot subscription (Individual, Business, or Enterprise)
- VS Code with GitHub Copilot extension v1.200+, or
- GitHub.com with Copilot access enabled, or
- GitHub CLI with Copilot extension

## Tech Stack Context

All agents are configured for the FlashFusion monorepo:

- **Package Manager**: pnpm 9.x with workspaces
- **Build Tool**: Turbo for monorepo orchestration
- **Language**: TypeScript 5.x strict mode
- **Frontend**: React 18 / React Native
- **Database**: Supabase (PostgreSQL + Auth + Edge Functions)
- **CI/CD**: GitHub Actions
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Security**: gitleaks, Renovate, pnpm audit

## Security Guidelines

All agents enforce security boundaries:

1. **No secrets in code**: Agents will never suggest hardcoding API keys or passwords
2. **Authentication required**: All endpoint suggestions include auth requirements
3. **Data protection**: PII and sensitive data handling follows GDPR/CCPA
4. **Audit logging**: Security-relevant changes are flagged for review

## Contributing

To add or modify agents:

1. Follow the agent file format in existing `.agent.md` files
2. Include YAML frontmatter with name, description, and tools
3. Define clear security boundaries
4. Provide output templates and invocation examples
5. Update this README with the new agent

## License

Private - All rights reserved. Part of the FlashFusion source-of-truth-monorepo.
