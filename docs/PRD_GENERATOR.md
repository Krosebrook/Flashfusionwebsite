# PRD Generator Documentation

## Overview

The PRD Generator is an AI-powered tool that creates comprehensive, spec-driven Product Requirements Documents (PRDs) following industry best practices. It generates all 13 required sections of a professional PRD based on a feature idea or product concept.

## Features

The PRD Generator produces:

1. **Executive Summary** - High-level overview with business case and goals
2. **Problem Statement** - Clear articulation of the problem and its criticality
3. **Target Audience / User Personas** - Primary user roles with pain points and goals
4. **Functional Requirements** - Core features with scoped behavior and edge cases
5. **Non-Functional Requirements** - Performance, scalability, accessibility, etc.
6. **User Stories & Acceptance Criteria** - Gherkin-style format (Given/When/Then)
7. **Technical Architecture Overview** - High-level system design and services
8. **API Design** - REST/GraphQL specs with authentication and authorization
9. **UI/UX Considerations** - Page layout, interaction patterns, responsiveness
10. **Security & Compliance** - Data handling, RBAC, encryption, compliance frameworks
11. **Testing Strategy** - Unit, integration, E2E test coverage and automation
12. **Deployment & DevOps Plan** - Environments, CI/CD, and rollback strategies
13. **Assumptions, Risks & Open Questions** - Known unknowns and risk mitigation

## Installation

The PRD Generator is part of the FlashFusion orchestrator package. No additional installation is required if you have the orchestrator set up.

### Prerequisites

- Python 3.8 or higher
- Anthropic API key (set as `ANTHROPIC_API_KEY` environment variable)

## Usage

### Command Line Interface

The PRD Generator can be invoked via the Python package interface. The root directory contains the `orchestrator` package.

#### From the repository root:

```bash
# Set up Python path to recognize the orchestrator package
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Generate a PRD
python -c "
import sys
from cli import main
sys.argv = ['cli', 'prd-generate', 'Your feature idea here',
            '--product-name', 'Product Name',
            '--target-users', 'Description of target users',
            '--business-context', 'Business objectives',
            '--output', 'PRODUCT_REQUIREMENTS_DOCUMENT.md']
main()
"
```

#### Using a Python script:

Create a file `generate_prd.py`:

```python
#!/usr/bin/env python3
import sys
import os

# Ensure orchestrator package can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import OrchestratorConfig
from workflows import PRDGeneratorWorkflow, PRDInput

# Load configuration from environment
config = OrchestratorConfig.from_env()

# Create workflow
workflow = PRDGeneratorWorkflow(config)

# Generate PRD
prd_input = PRDInput(
    feature_idea="Your feature idea here",
    product_name="Product Name",
    target_users="Target user description",
    business_context="Business context",
)

result = workflow.run(prd_input)

# Save to file
with open('PRODUCT_REQUIREMENTS_DOCUMENT.md', 'w') as f:
    f.write(result.full_document)

print("PRD generated successfully!")
```

Then run:

```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python generate_prd.py
```

#### Arguments

- `feature_idea` (required): The feature or product idea to generate a PRD for
- `--product-name`: Name of the product or feature
- `--target-users`: Description of target users or personas
- `--business-context`: Business context and strategic objectives
- `--output`: Output file path to save the PRD (e.g., `PRD.md`)

### Python API

You can also use the PRD Generator programmatically:

```python
#!/usr/bin/env python3
import sys
import os

# Ensure the orchestrator package is in the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import OrchestratorConfig
from workflows import PRDGeneratorWorkflow, PRDInput

# Load configuration from environment (requires ANTHROPIC_API_KEY)
config = OrchestratorConfig.from_env()

# Create workflow instance
workflow = PRDGeneratorWorkflow(config)

# Define input
prd_input = PRDInput(
    feature_idea="AI-powered code review assistant that provides intelligent feedback",
    product_name="CodeReview AI",
    target_users="Software developers and engineering teams",
    business_context="Improve code quality and reduce review time by 50%",
)

# Generate PRD
result = workflow.run(prd_input)

# Access individual sections
print(result.executive_summary)
print(result.problem_statement)
print(result.functional_requirements)

# Or get the full document
print(result.full_document)

# Save to file
with open('PRD.md', 'w') as f:
    f.write(result.full_document)
```

## Example

### Input

Create a script `example_prd.py`:

```python
#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import OrchestratorConfig
from workflows import PRDGeneratorWorkflow, PRDInput

config = OrchestratorConfig.from_env()
workflow = PRDGeneratorWorkflow(config)

prd_input = PRDInput(
    feature_idea="Real-time collaborative document editor with AI writing assistance",
    product_name="DocFlow Pro",
    target_users="Content creators, technical writers, and remote teams",
    business_context="Enable seamless collaboration and improve writing quality",
)

result = workflow.run(prd_input)

with open('PRODUCT_REQUIREMENTS_DOCUMENT.md', 'w') as f:
    f.write(result.full_document)

print("PRD generated and saved to PRODUCT_REQUIREMENTS_DOCUMENT.md")
```

Run it:

```bash
export ANTHROPIC_API_KEY=your_key_here
python example_prd.py
```

### Output Structure

The generated PRD will include:

```markdown
# Product Requirements Document: DocFlow Pro

## Table of Contents

- Executive Summary
- Problem Statement
- Target Audience / User Personas
- Functional Requirements
- Non-Functional Requirements
- User Stories & Acceptance Criteria
- Technical Architecture Overview
- API Design
- UI/UX Considerations
- Security & Compliance
- Testing Strategy
- Deployment & DevOps Plan
- Assumptions, Risks & Open Questions

## Executive Summary

[Generated content with business case, goals, and success metrics]

## Problem Statement

[Generated content articulating the problem and its impact]

...
```

## Quality Assurance

The PRD Generator includes built-in validators that ensure:

- Each section meets minimum content requirements
- Proper markdown formatting with headings
- User stories include Gherkin-style acceptance criteria (Given/When/Then)
- Requirements include structured lists
- Final document contains all required sections

## Best Practices

1. **Provide Clear Context**: The more detailed your feature idea, the better the PRD will be
2. **Specify Target Users**: Including user personas helps generate relevant requirements
3. **Add Business Context**: Strategic objectives help shape the executive summary
4. **Review and Refine**: The generated PRD is a starting point - review and customize as needed
5. **Iterate**: You can regenerate sections with different inputs to refine the document

## Architecture

The PRD Generator uses a chain-based workflow architecture:

1. **ChainRunner**: Orchestrates the sequential execution of 14 steps
2. **Context Manager**: Maintains context between steps for coherent output
3. **Cost Router**: Selects appropriate LLM models based on task complexity
4. **Quality Validators**: Ensure each section meets quality standards

Each section is generated independently with access to relevant previous sections as context.

## Troubleshooting

### Common Issues

**Issue**: `ANTHROPIC_API_KEY is not set`

- **Solution**: Set your Anthropic API key in the environment: `export ANTHROPIC_API_KEY=your_key_here`

**Issue**: Generated content is too generic

- **Solution**: Provide more specific details in the feature idea and context parameters

**Issue**: Missing sections in output

- **Solution**: Check the quality validators and ensure the LLM responses meet minimum requirements

## Contributing

To extend the PRD Generator:

1. Add new sections by creating `ChainStep` instances in `_build_steps()`
2. Implement custom validators for specific section requirements
3. Update the `PRDOutput` dataclass to include new fields
4. Add corresponding tests in `test_prd_generator.py`

## License

This tool is part of the FlashFusion platform and follows the same license.
