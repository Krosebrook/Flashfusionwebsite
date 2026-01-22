# FlashFusion Code Generation Engine

## Overview
The Code Generation Engine powers the AI Code Generator tool by turning prompt-based requirements into a structured project export. It now supports real ZIP exports, configurable templates, and guardrails for common edge cases.

## What’s Included
- **Template-driven file generation** for components, APIs, hooks, tests, and docs.
- **Export pipeline** powered by JSZip with proper directory structure.
- **Safe project naming** to avoid invalid filenames.
- **Config scaffolding** for TypeScript, ESLint, Docker, and package scripts.

## Key Modules
- **Templates**: `src/services/codeGenerationTemplates.ts`
  - Generates code artifacts, configs, and README content.
- **Export Hook**: `src/hooks/useProjectExport.ts`
  - Creates ZIP archives and handles download status.
- **UI Integration**: `src/components/tools/generation/CodeGeneratorTool.tsx`
  - Orchestrates generation, preview, and export.

## Edge Cases Covered
- **Missing project files**: Export throws a user-facing error instead of a broken ZIP.
- **Invalid file paths**: Paths are sanitized to avoid traversal or invalid separators.
- **Empty project name**: Defaults to a safe `flashfusion-project` export name.
- **Large file sets**: ZIP export is async and the UI shows a loading state.

## Usage Notes
1. Configure an AI model in the setup wizard.
2. Provide a clear description and select code type + framework.
3. Generate code and review the preview tab.
4. Export the ZIP from the Export tab.

## Next 9 Logical Steps
1. **Add real templates per framework** (Next.js, Vue, FastAPI) with framework-specific folder structures.
2. **Introduce validation schemas** for user input (project name, repo selection, feature flags).
3. **Add export metadata** (manifest.json) to capture generation settings.
4. **Enable GitHub export** by pushing a generated ZIP to a new repo via OAuth.
5. **Provide a CLI generator** that consumes the same template engine.
6. **Expand testing** to cover multi-file exports and large file counts.
7. **Add dependency resolution** for selected features (e.g., auth, database, validation).
8. **Track generation metrics** (time, token usage, export size) for analytics.
9. **Introduce versioned templates** so generated projects are reproducible.
