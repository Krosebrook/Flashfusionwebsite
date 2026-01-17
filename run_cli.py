#!/usr/bin/env python3
"""
CLI runner for the orchestrator package.

Usage:
    python run_cli.py prd-generate "Your feature idea" --output PRD.md
    python run_cli.py blog-generate "keyword" --audience "developers"
    python run_cli.py saas-research "research question"
"""

import sys
import os

# Add parent directory to path to allow orchestrator imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Now we can import from orchestrator
if __name__ == "__main__":
    from cli import main
    main()
