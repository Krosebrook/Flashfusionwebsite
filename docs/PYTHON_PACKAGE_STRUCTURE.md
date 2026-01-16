# PRD Generator - Package Structure Note

## Current Structure Issue

The Python orchestrator code in this repository uses relative imports that expect a specific package structure. The files are currently organized as:

```
/
├── config.py
├── llm_client.py
├── ... (other orchestrator files)
├── workflows/
│   ├── __init__.py
│   ├── content_blog.py
│   ├── saas_research.py
│   └── prd_generator.py
└── test_*.py
```

The workflow files use `from ..config import` which expects them to be part of an `orchestrator.workflows` subpackage.

## Recommended Usage

### Option 1: Install as Package (Recommended for Production)

Create a `setup.py` in the repository root:

```python
from setuptools import setup, find_packages

setup(
    name="flashfusion-orchestrator",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "anthropic>=0.18.0",
    ],
)
```

Then install in development mode:

```bash
pip install -e .
```

Now you can import:

```python
from orchestrator.config import OrchestratorConfig
from orchestrator.workflows import PRDGeneratorWorkflow, PRDInput
```

### Option 2: Direct Module Execution (Current Implementation)

For the current structure to work without installation, the orchestrator files need to be importable. One approach is to treat the repository root as the package:

1. Rename/restructure to have an `orchestrator/` directory containing all Python files
2. Or use absolute imports instead of relative imports

### Option 3: Standalone Script (Simplest for Demo)

Create standalone scripts that don't rely on package imports. See `example_prd_generation_standalone.py` (to be created).

## Testing

The test files expect the package structure:

```python
from orchestrator.config import OrchestratorConfig
from orchestrator.workflows.prd_generator import PRDGeneratorWorkflow
```

This means tests should be run with pytest from outside the orchestrator directory, or with the package installed.

## For Developers

When making changes to the PRD generator or other workflows:

1. Ensure your Python environment has the `anthropic` package installed
2. Set `ANTHROPIC_API_KEY` environment variable
3. Either install the package with `pip install -e .` or adjust your `PYTHONPATH`

## Future Improvements

Consider:

1. Adding a proper `setup.py` or `pyproject.toml` for package installation
2. Creating a CLI entry point that doesn't require relative imports
3. Reorganizing into a proper `orchestrator/` package directory
4. Adding a `requirements.txt` for dependencies
