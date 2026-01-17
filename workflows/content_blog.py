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
class BlogInput:
    """
    Input parameters for the blog generation workflow.
    """
    keyword: str
    primary_audience: str
    target_length_words: int = 2000
    tone: str = "conversational, authoritative"
    brand_voice: Optional[str] = None


@dataclass
class BlogOutput:
    """
    Output of the blog generation workflow.
    """
    keyword: str
    outline: str
    introduction: str
    sections: Dict[str, str]
    conclusion: str
    seo_review: str
    final_article: str
    chain_state: Dict[str, str]


class ContentBlogWorkflow:
    """
    Orchestrates a multi-step SEO blog generation process using ChainRunner.

    The pipeline is:
      1. keyword_research -> blog_research
      2. outline -> blog_outline
      3. introduction -> blog_intro
      4. sections -> blog_sections
      5. conclusion -> blog_conclusion
      6. seo_review -> blog_seo_review
      7. final_polish -> blog_final_article

    Each step has a quality validator to ensure acceptable outputs.
    """

    def __init__(self, config: OrchestratorConfig) -> None:
        self.config = config
        self.llm = LLMClient(config)
        self.obs = AgentObservability("content_blog")
        self.cost_router = CostRouter(config)
        self.context_mgr = ContextManager(max_context_tokens=2500)

    def run(self, blog_input: BlogInput) -> BlogOutput:
        """
        Execute the full blog generation chain for the given input.
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
                "keyword": blog_input.keyword,
                "primary_audience": blog_input.primary_audience,
                "target_length_words": str(blog_input.target_length_words),
                "tone": blog_input.tone,
                "brand_voice": blog_input.brand_voice or "",
            }
        )
        steps = self._build_steps()
        state = runner.run(steps)
        sections = self._split_sections(state.get("blog_sections", ""))
        return BlogOutput(
            keyword=blog_input.keyword,
            outline=state.get("blog_outline", ""),
            introduction=state.get("blog_intro", ""),
            sections=sections,
            conclusion=state.get("blog_conclusion", ""),
            seo_review=state.get("blog_seo_review", ""),
            final_article=state.get("blog_final_article", ""),
            chain_state=state,
        )

    def _build_steps(self) -> List[ChainStep]:
        """
        Construct the sequence of ChainStep instances for blog generation.
        """
        steps: List[ChainStep] = []
        # 1. Keyword research
        steps.append(
            ChainStep(
                name="keyword_research",
                inputs=["keyword", "primary_audience"],
                output_key="blog_research",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.7,
                importance="high",
                tags=["research", "seo"],
                prompt_template=(
                    "You are an SEO strategist.\n\n"
                    "Keyword: \"{keyword}\"\n"
                    "Primary audience: {primary_audience}\n\n"
                    "1. Identify 5–7 key trends and angles around this keyword that would make\n"
                    "   compelling blog topics in the next 12 months.\n"
                    "2. For each trend, include:\n"
                    "   - Trend name\n"
                    "   - 2–3 sentence description\n"
                    "   - Why it matters to this audience\n"
                    "   - Search-intent type (informational / commercial / transactional / navigational)\n"
                    "3. Include 10–15 long-tail keyword variations (bulleted).\n"
                    "4. Highlight 3–5 high-intent content angles.\n"
                ),
                quality_validator=self._validate_research,
            )
        )
        # 2. Outline
        steps.append(
            ChainStep(
                name="outline",
                inputs=["keyword", "blog_research", "tone"],
                output_key="blog_outline",
                task_type="analysis",
                max_tokens=2048,
                temperature=0.7,
                importance="high",
                tags=["outline"],
                prompt_template=(
                    "You are an expert content strategist.\n\n"
                    "Primary keyword: \"{keyword}\"\n"
                    "Research summary:\n{blog_research}\n\n"
                    "Create a detailed blog outline that will rank for this keyword and serve real value.\n"
                    "Requirements:\n"
                    "- Single H1 title containing the primary keyword.\n"
                    "- Short meta description (<= 155 chars) that is compelling.\n"
                    "- Introduction notes (2–3 bullet points about the hook and setup).\n"
                    "- 5–7 H2 sections, each with 3–5 bullet points describing what will be covered.\n"
                    "- Under any section that benefits from it, propose H3 subsections.\n"
                    "- Final 'Conclusion' section with key takeaways + optional CTA.\n\n"
                    "Use Markdown headings: '#', '##', '###'."
                ),
                quality_validator=self._validate_outline,
            )
        )
        # 3. Introduction
        steps.append(
            ChainStep(
                name="introduction",
                inputs=["blog_outline", "tone", "brand_voice"],
                output_key="blog_intro",
                task_type="writing",
                max_tokens=768,
                temperature=0.8,
                importance="high",
                tags=["intro"],
                prompt_template=(
                    "You are a senior copywriter.\n\n"
                    "Use the following outline to write the introduction section only.\n\n"
                    "Outline:\n{blog_outline}\n\n"
                    "Write a 200–300 word introduction that:\n"
                    "- Hooks the reader in the first 2–3 sentences with a concrete scenario or tension.\n"
                    "- Establishes the core problem related to the topic.\n"
                    "- Promises what the article will deliver.\n"
                    "- Speaks in this tone: {tone}.\n"
                    "- If provided, subtly reflect this brand voice: {brand_voice}.\n\n"
                    "Do NOT include section headings. Just the intro body."
                ),
                quality_validator=self._validate_intro,
            )
        )
        # 4. Sections (body)
        steps.append(
            ChainStep(
                name="sections",
                inputs=[
                    "blog_outline",
                    "blog_intro",
                    "tone",
                    "target_length_words",
                    "brand_voice",
                ],
                output_key="blog_sections",
                task_type="writing",
                max_tokens=4096,
                temperature=0.8,
                importance="high",
                tags=["body", "sections"],
                prompt_template=(
                    "You are a senior content writer.\n\n"
                    "Outline:\n{blog_outline}\n\n"
                    "Draft the full body sections (H2/H3) of the article, but NOT the introduction "
                    "and NOT the conclusion.\n\n"
                    "Requirements:\n"
                    "- Use the outline structure and headings exactly (# for H1, ## for H2, ### for H3).\n"
                    "- For each H2 section, write 300–450 words.\n"
                    "- Use concrete examples, light storytelling, and actionable advice.\n"
                    "- When helpful, use bullet lists for scanability.\n"
                    "- Maintain this tone: {tone}.\n"
                    "- Target total article length around {target_length_words} words.\n"
                    "- If provided, reflect this brand voice: {brand_voice}.\n"
                    "- Avoid fluff; aim for clarity and specificity.\n"
                ),
                quality_validator=self._validate_sections,
            )
        )
        # 5. Conclusion
        steps.append(
            ChainStep(
                name="conclusion",
                inputs=["blog_outline", "blog_intro", "blog_sections", "tone"],
                output_key="blog_conclusion",
                task_type="writing",
                max_tokens=768,
                temperature=0.8,
                importance="medium",
                tags=["conclusion"],
                prompt_template=(
                    "You are a senior content writer.\n\n"
                    "Using the outline, intro, and sections below, write only the conclusion.\n\n"
                    "Outline:\n{blog_outline}\n\n"
                    "Intro:\n{blog_intro}\n\n"
                    "Sections:\n{blog_sections}\n\n"
                    "Write a 200–300 word conclusion that:\n"
                    "- Recaps the core problem and key insights.\n"
                    "- Highlights 3–5 actionable takeaways.\n"
                    "- Ends with a strong, specific call to action.\n"
                    "- Maintains the same tone.\n"
                    "Do NOT add new headings (no 'Conclusion' heading)."
                ),
                quality_validator=self._validate_conclusion,
            )
        )
        # 6. SEO review
        steps.append(
            ChainStep(
                name="seo_review",
                inputs=[
                    "keyword",
                    "blog_outline",
                    "blog_intro",
                    "blog_sections",
                    "blog_conclusion",
                ],
                output_key="blog_seo_review",
                task_type="analysis",
                max_tokens=1536,
                temperature=0.3,
                importance="medium",
                tags=["seo", "review"],
                prompt_template=(
                    "You are an SEO editor.\n\n"
                    "Primary keyword: {keyword}\n\n"
                    "Outline:\n{blog_outline}\n\n"
                    "Intro:\n{blog_intro}\n\n"
                    "Body:\n{blog_sections}\n\n"
                    "Conclusion:\n{blog_conclusion}\n\n"
                    "Perform an SEO-focused review. Provide:\n"
                    "1. Estimated keyword density for the primary keyword.\n"
                    "2. Suggested meta title (<= 60 chars) and meta description (<= 155 chars).\n"
                    "3. 5–10 suggested secondary keywords.\n"
                    "4. 3–5 internal link anchor text ideas.\n"
                    "5. Any structural improvements for headings or readability.\n\n"
                    "Format your answer with clear headings and bullet points.\n"
                ),
                quality_validator=self._validate_seo_review,
            )
        )
        # 7. Final polish
        steps.append(
            ChainStep(
                name="final_polish",
                inputs=[
                    "keyword",
                    "blog_outline",
                    "blog_intro",
                    "blog_sections",
                    "blog_conclusion",
                    "blog_seo_review",
                    "tone",
                    "brand_voice",
                ],
                output_key="blog_final_article",
                task_type="writing",
                max_tokens=4096,
                temperature=0.7,
                importance="high",
                tags=["final"],
                prompt_template=(
                    "You are a senior editor.\n\n"
                    "Primary keyword: {keyword}\n"
                    "Tone: {tone}\n"
                    "Brand voice: {brand_voice}\n\n"
                    "You are given:\n"
                    "- Outline\n{blog_outline}\n\n"
                    "- Intro\n{blog_intro}\n\n"
                    "- Body sections\n{blog_sections}\n\n"
                    "- Conclusion\n{blog_conclusion}\n\n"
                    "- SEO review\n{blog_seo_review}\n\n"
                    "Your task:\n"
                    "1. Assemble a single, unified article in Markdown.\n"
                    "2. Keep the H1/H2/H3 structure from the outline.\n"
                    "3. Refine wording for clarity, flow, and readability.\n"
                    "4. Subtly incorporate SEO review suggestions (titles, internal anchors, etc.) WITHOUT making the copy feel stuffed.\n"
                    "5. Aim for a natural, human reading experience.\n\n"
                    "Output only the final article in Markdown."
                ),
                quality_validator=self._validate_final_article,
            )
        )
        return steps

    # ---- Quality validators ----

    def _validate_research(self, text: str) -> bool:
        if len(text) < 800:
            return False
        bullet_count = text.count("- ")
        return bullet_count >= 10

    def _validate_outline(self, text: str) -> bool:
        if "# " not in text:
            return False
        h2_count = text.count("## ")
        if h2_count < 4:
            return False
        lower = text.lower()
        return "meta description" in lower or "description:" in lower

    def _validate_intro(self, text: str) -> bool:
        if len(text) < 300:
            return False
        if "#" in text:
            return False
        return True

    def _validate_sections(self, text: str) -> bool:
        h2_count = text.count("## ")
        if h2_count < 4:
            return False
        if len(text) < 1500:
            return False
        return True

    def _validate_conclusion(self, text: str) -> bool:
        if len(text) < 200:
            return False
        if "#" in text:
            return False
        return True

    def _validate_seo_review(self, text: str) -> bool:
        lower = text.lower()
        if "meta title" not in lower and "title" not in lower:
            return False
        if "meta description" not in lower and "description" not in lower:
            return False
        if "keyword" not in lower:
            return False
        return True

    def _validate_final_article(self, text: str) -> bool:
        if "# " not in text:
            return False
        if text.count("## ") < 4:
            return False
        if len(text) < 2000:
            return False
        return True

    # ---- Utility ----

    def _split_sections(self, sections_markdown: str) -> Dict[str, str]:
        if "## " not in sections_markdown:
            return {}
        result: Dict[str, str] = {}
        current_title: Optional[str] = None
        current_lines: List[str] = []
        for line in sections_markdown.splitlines():
            if line.startswith("## "):
                if current_title is not None:
                    result[current_title] = "\n".join(current_lines).strip()
                    current_lines = []
                current_title = line[3:].strip()
            else:
                current_lines.append(line)
        if current_title is not None:
            result[current_title] = "\n".join(current_lines).strip()
        return result