from __future__ import annotations

import argparse
import asyncio

from .config import OrchestratorConfig
from .saas_research import SaaSResearchWorkflow
from .content_blog import ContentBlogWorkflow, BlogInput
from .prd_generator import PRDGeneratorWorkflow, PRDInput


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
        product_name=args.product_name or "Product",
        target_industry=args.industry or "",
        company_context=args.context or "",
    )
    result = workflow.run(prd_input)

    # Save to file if output path provided
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(result.final_document)
        print(f"\n✅ PRD generated successfully and saved to: {args.output}")
    else:
        print("\n===== PRODUCT REQUIREMENTS DOCUMENT =====\n")
        print(result.final_document)
    
    # Print summary
    print("\n===== GENERATION SUMMARY =====\n")
    print(f"Feature Idea: {result.feature_idea}")
    print(f"Sections Generated: 13")
    print(f"Executive Summary Length: {len(result.executive_summary)} chars")
    print(f"Total Document Length: {len(result.final_document)} chars")


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
        "prd-generate", help="Generate a comprehensive Product Requirements Document."
    )
    prd_parser.add_argument(
        "feature_idea",
        type=str,
        help="The product/feature idea to generate a PRD for.",
    )
    prd_parser.add_argument(
        "--product-name",
        type=str,
        help="Name of the product (default: 'Product').",
    )
    prd_parser.add_argument(
        "--industry",
        type=str,
        help="Target industry for the product.",
    )
    prd_parser.add_argument(
        "--context",
        type=str,
        help="Additional company or product context.",
    )
    prd_parser.add_argument(
        "--output",
        "-o",
        type=str,
        help="Output file path to save the PRD (if not specified, prints to stdout).",
    )
    prd_parser.set_defaults(func=_run_prd_generate)

    args = parser.parse_args()
    if hasattr(args, "func"):
        args.func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()