# CI Pipeline Update Plan for Launch Preparation Hub

## Objectives
- Enforce automated linting, type-checking, unit, integration, and E2E tests on every PR touching the Launch Preparation Hub feature.
- Provide fast feedback for core branches (`main`, `develop`) while enabling optional nightly full runs.
- Ensure reproducible installs using `pnpm` and cached Playwright browsers.

## Proposed Workflow Structure
```
.github/workflows/ci.yml
└── jobs
    ├── setup (pnpm install, cache node_modules/.pnpm-store)
    ├── lint (eslint, formatting, accessibility lint)
    ├── typecheck (tsc --noEmit)
    ├── unit-tests (vitest --run --coverage)
    ├── integration-tests (vitest --run --config vitest.config.integration.ts)
    └── e2e (playwright test --project=chromium)
```
- Gate merges on `lint`, `typecheck`, `unit-tests`, and `integration-tests`.
- Run `e2e` on PRs labeled `e2e-required` and always on default branch via `if` conditions.

## Job Details
### 1. Setup Job
- **Trigger**: All PRs and pushes to `main`.
- **Steps**:
  1. `actions/checkout@v4`.
  2. Setup pnpm (`pnpm/action-setup@v4`, version from `packageManager` once added) and Node 20 (`actions/setup-node@v4`, enable pnpm cache).
  3. `pnpm install --frozen-lockfile`.
  4. Cache `.pnpm-store` keyed on `pnpm-lock.yaml` hash.
  5. Upload workspace as artifact for downstream jobs (or rely on caching matrix).

### 2. Lint Job
- Needs: `setup`.
- Commands:
  - `pnpm lint` (add script to invoke ESLint across `src/` and `tests/`).
  - `pnpm format:check` (Prettier or equivalent; add script if missing).
  - Optional: `pnpm lint:a11y` using axe/storybook lint for React accessibility hotspots.
- Artifacts: attach `eslint-report.json` for PR annotations via `actions/upload-artifact`.

### 3. Typecheck Job
- Needs: `setup`.
- Command: `pnpm typecheck` invoking `tsc --noEmit --project tsconfig.json` with incremental caching.
- Fail-fast on type regression; upload `.tsbuildinfo` for caching if necessary.

### 4. Unit Test Job
- Needs: `setup`.
- Command: `pnpm test:unit -- --coverage` using Vitest DOM environment.
- Configure coverage threshold enforcement (≥80% statements) and output to `reports/unit/coverage` for PR comments.

### 5. Integration Test Job
- Needs: `setup`.
- Command: `pnpm test:integration -- --coverage=false` referencing a dedicated Vitest config that spins up MSW handlers.
- Utilize `--runInBand` if tests interact with shared fixtures; otherwise, keep concurrency with `--pool=threads`.
- Publish junit output to `reports/integration/junit.xml` for integration with GitHub Checks.

### 6. End-to-End Job
- Needs: `setup`.
- Conditional: `if: github.ref == 'refs/heads/main' || contains(github.event.pull_request.labels.*.name, 'e2e-required')`.
- Steps:
  - `pnpm exec playwright install --with-deps` (cached via `actions/cache`).
  - `pnpm test:e2e -- --reporter=list`.
  - Capture screenshots/videos on failure and upload artifacts.

## Additional Safeguards
- **Branch protections**: Require status checks `lint`, `typecheck`, `unit-tests`, `integration-tests` before merge to `main`.
- **Nightly workflow**: Schedule `0 3 * * *` run for `e2e` + `playwright test --project=webkit,firefox` to surface cross-browser issues.
- **Secret management**: Use environment-scoped secrets for API keys; never store in workflow file. Mask tokens via `env`.
- **Observability**: Emit coverage summaries using `dorny/test-reporter` for inline annotations; add `pnpm exec vitest --reporter=junit` for integration with reporting dashboards.

## Follow-up Actions
1. Add missing npm scripts (`lint`, `format:check`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`).
2. Introduce Vitest integration config and Playwright project filters as referenced above.
3. Set repository-level `required_linear_history` and `required_conversation_resolution` for clean merges.
4. Document workflow usage in `docs/TESTING_INFRA_SUMMARY.md` once implemented.
