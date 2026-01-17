from __future__ import annotations

import argparse
import asyncio

from .config import OrchestratorConfig
from .workflows import SaaSResearchWorkflow, ContentBlogWorkflow, BlogInput, PRDGeneratorWorkflow, PRDInput


def _run_saas_research(args: argparse.Namespace) -> None:
    """
    CLI handler for the SaaS research workflow.
    """
    config = OrchestratorConfig.from_env()
    workflow = SaaSResearchWorkflow(config)

    async def _inner() -> None:
        result = await workflow.run(args.query)
        print("\n===== EXECUTIVE SUMMARY =====\n")
        print(result.final_report)
        print("\n===== METADATA =====\n")
        print(f"Sub-queries: {len(result.sub_queries)}")
        print(f"Total findings: {len(result.findings)}")

    asyncio.run(_inner())


def _run_blog_generate(args: argparse.Namespace) -> None:
    """
    CLI handler for blog generation.
    """
    config = OrchestratorConfig.from_env()
    workflow = ContentBlogWorkflow(config)
    blog_input = BlogInput(
        keyword=args.keyword,
        primary_audience=args.audience,
        target_length_words=args.target_length or 2000,
        tone=args.tone or "conversational, authoritative",
        brand_voice=args.brand_voice or None,
    )
    result = workflow.run(blog_input)

    print("\n===== FINAL ARTICLE =====\n")
    print(result.final_article)
    print("\n===== SEO REVIEW =====\n")
    print(result.seo_review)
    print("\n===== OUTLINE =====\n")
    print(result.outline)
    print("\n===== INTRODUCTION =====\n")
    print(result.introduction)
    print("\n===== SECTIONS =====\n")
    for title, content in result.sections.items():
        print(f"\n## {title}\n{content}\n")
    print("\n===== CONCLUSION =====\n")
    print(result.conclusion)


def _run_prd_generate(args: argparse.Namespace) -> None:
    """
    CLI handler for PRD generation.
    """
    config = OrchestratorConfig.from_env()
    workflow = PRDGeneratorWorkflow(config)
    prd_input = PRDInput(
        feature_idea=args.feature_idea,
        product_name=args.product_name or None,
        target_users=args.target_users or None,
        business_context=args.business_context or None,
    )
    result = workflow.run(prd_input)

    print("\n===== PRODUCT REQUIREMENTS DOCUMENT =====\n")
    print(result.full_document)
    
    # Save to file if requested
    if args.output:
        with open(args.output, 'w') as f:
            f.write(result.full_document)
        print(f"\n===== PRD saved to {args.output} =====\n")


def main() -> None:
    """
    Entry point for the orchestrator CLI.
    """
    parser = argparse.ArgumentParser(
        description="Orchestrator CLI for AI workflows."
    )
    subparsers = parser.add_subparsers(dest="command")

    # SaaS research subcommand
    research_parser = subparsers.add_parser(
        "saas-research", help="Run SaaS opportunity research workflow."
    )
    research_parser.add_argument(
        "query",
        type=str,
        help="Research question (e.g. 'What SaaS opportunities exist after X shutdown?')",
    )
    research_parser.set_defaults(func=_run_saas_research)

    # Blog generation subcommand
    blog_parser = subparsers.add_parser(
        "blog-generate", help="Generate an SEO-focused blog article."
    )
    blog_parser.add_argument("keyword", type=str, help="Primary keyword for the blog.")
    blog_parser.add_argument(
        "--audience",
        type=str,
        required=True,
        help="Primary audience for the blog.",
    )
    blog_parser.add_argument(
        "--target-length",
        type=int,
        help="Target length in words for the article (default 2000).",
    )
    blog_parser.add_argument(
        "--tone",
        type=str,
        help="Desired tone for the article (default 'conversational, authoritative').",
    )
    blog_parser.add_argument(
        "--brand-voice",
        type=str,
        help="Optional brand voice to guide the copy.",
    )
    blog_parser.set_defaults(func=_run_blog_generate)

    # PRD generation subcommand
    prd_parser = subparsers.add_parser(
        "prd-generate", help="Generate a Product Requirements Document (PRD)."
    )
    prd_parser.add_argument(
        "feature_idea",
        type=str,
        help="Feature or product idea to generate PRD for.",
    )
    prd_parser.add_argument(
        "--product-name",
        type=str,
        help="Name of the product or feature.",
    )
    prd_parser.add_argument(
        "--target-users",
        type=str,
        help="Description of target users or personas.",
    )
    prd_parser.add_argument(
        "--business-context",
        type=str,
        help="Business context and strategic objectives.",
    )
    prd_parser.add_argument(
        "--output",
        type=str,
        help="Output file path to save the PRD (e.g., 'PRODUCT_REQUIREMENTS_DOCUMENT.md').",
    )
    prd_parser.set_defaults(func=_run_prd_generate)

    args = parser.parse_args()
    if hasattr(args, "func"):
        args.func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()