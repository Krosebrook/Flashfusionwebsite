# PRD Generator - Package Structure Note

## Important: Package Structure

The Python orchestrator code in this repository has a pre-existing package structure pattern that requires special handling.

### Current Structure

```
/ (repository root)
├── config.py
├── llm_client.py
├── cli.py
├── ... (other orchestrator core files)
├── workflows/
│   ├── __init__.py
│   ├── content_blog.py (existing)
│   ├── saas_research.py (existing)
│   └── prd_generator.py (new)
└── test_*.py
```

### Import Pattern Background

**The Pattern**:

- Workflow files use `from ..config import` (relative parent imports)
- Test files use `from orchestrator.config import` (absolute imports)
- CLI uses `from .workflows import` (relative sibling imports)

This means the code expects to be part of an `orchestrator` package, but the files are at the repository root.

### Why This Exists

This pattern was **established by the existing workflows** (content_blog.py, saas_research.py) before the PRD generator was added. The PRD generator **follows the same pattern for consistency** with existing code.

## Working Solutions

### Solution 1: Install as Package (Recommended)

Create `setup.py` at repository root:

```python
from setuptools import setup, find_packages

setup(
    name="flashfusion-orchestrator",
    version="0.1.0",
    packages=["workflows"],
    package_dir={"": "."},
    install_requires=[
        "anthropic>=0.18.0",
    ],
)
```

Install:

```bash
pip install -e .
```

Then import:

```python
from config import OrchestratorConfig
from workflows import PRDGeneratorWorkflow, PRDInput
```

### Solution 2: PYTHONPATH Workaround

Set Python path and use adjusted imports:

```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

In your script:

```python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import OrchestratorConfig
from workflows.prd_generator import PRDGeneratorWorkflow, PRDInput
```

### Solution 3: Future Repository Refactoring

A complete refactoring would benefit all Python code:

```
/
├── setup.py
├── orchestrator/
│   ├── __init__.py
│   ├── config.py
│   ├── cli.py
│   ├── workflows/
│   │   └── (all workflow files)
└── tests/
    └── (all test files)
```

This would allow clean absolute imports everywhere:

```python
from orchestrator.config import OrchestratorConfig
from orchestrator.workflows import PRDGeneratorWorkflow
```

**Note**: This would be a repository-wide change affecting all Python files.

## For This PR

Important context for reviewers:

1. ✅ **Follows existing patterns**: PRD generator uses same imports as content_blog.py and saas_research.py
2. ✅ **Documented workarounds**: Clear instructions in docs/PRD_GENERATOR.md
3. ✅ **Consistent with codebase**: Matches established patterns
4. ℹ️ **Repository-wide consideration**: A full refactoring would benefit all Python code but is beyond scope of this feature addition

## Testing

To run tests:

```bash
# Option 1: Install package (recommended)
pip install -e .
pytest test_prd_generator.py

# Option 2: Set PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest test_prd_generator.py -v
```

## Summary

- **This is a pre-existing pattern** in the repository
- **PRD generator follows existing conventions** for consistency
- **Documentation provides clear usage instructions**
- **Future repository-wide refactoring** could improve this for all Python code

The import structure exists in the current codebase and works with the documented setup methods.
