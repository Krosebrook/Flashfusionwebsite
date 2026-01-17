#!/usr/bin/env python3
"""
Example script demonstrating how to use the PRD Generator.

This script generates a sample PRD for an AI-powered code review assistant.

Prerequisites:
- Set ANTHROPIC_API_KEY environment variable
- Run from the repository root directory

Usage:
    export ANTHROPIC_API_KEY=your_api_key_here
    python example_prd_generation.py
"""

import sys
import os

# Add current directory to Python path so orchestrator package can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import OrchestratorConfig
from workflows import PRDGeneratorWorkflow, PRDInput


def main():
    """Generate a sample PRD."""
    print("=" * 60)
    print("PRD Generator Example")
    print("=" * 60)
    print()
    
    # Load configuration (requires ANTHROPIC_API_KEY in environment)
    try:
        config = OrchestratorConfig.from_env()
        print("✓ Configuration loaded successfully")
    except RuntimeError as e:
        print(f"✗ Error: {e}")
        print("\nPlease set ANTHROPIC_API_KEY environment variable:")
        print("  export ANTHROPIC_API_KEY=your_key_here")
        return 1
    
    # Create workflow
    workflow = PRDGeneratorWorkflow(config)
    print("✓ PRD Generator workflow initialized")
    print()
    
    # Define the feature idea
    feature_idea = (
        "AI-powered code review assistant that automatically analyzes pull requests, "
        "provides intelligent feedback on code quality, security vulnerabilities, "
        "and best practices, with support for multiple programming languages."
    )
    
    prd_input = PRDInput(
        feature_idea=feature_idea,
        product_name="CodeReview AI",
        target_users="Software developers, engineering teams, and tech leads",
        business_context=(
            "Reduce code review time by 60%, improve code quality consistency, "
            "and catch security issues earlier in the development cycle."
        ),
    )
    
    print("Generating PRD with the following inputs:")
    print(f"  Product Name: {prd_input.product_name}")
    print(f"  Feature Idea: {prd_input.feature_idea[:80]}...")
    print()
    print("This may take 2-5 minutes as it generates all 13 sections...")
    print()
    
    # Generate PRD
    try:
        result = workflow.run(prd_input)
        print("✓ PRD generated successfully!")
        print()
        
        # Print summary
        print("=" * 60)
        print("PRD Generation Summary")
        print("=" * 60)
        print(f"  Product Name: {result.feature_idea[:50]}...")
        print(f"  Total sections: 13")
        print(f"  Document length: {len(result.full_document)} characters")
        print()
        
        # Save to file
        output_file = "GENERATED_PRD_EXAMPLE.md"
        with open(output_file, 'w') as f:
            f.write(result.full_document)
        
        print(f"✓ Full PRD saved to: {output_file}")
        print()
        print("=" * 60)
        print("Preview: Executive Summary")
        print("=" * 60)
        print(result.executive_summary[:500])
        print("\n[...truncated for preview...]")
        print()
        print(f"View the complete PRD in {output_file}")
        
        return 0
        
    except Exception as e:
        print(f"✗ Error generating PRD: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
