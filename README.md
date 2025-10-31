# FlashFusion Web Application

FlashFusion delivers a branded marketing experience, demo sandbox, and authenticated app shell for an AI-assisted product building platform. The repository currently hosts the front-end, extensive product documentation, deployment scripts, and Supabase edge function prototypes.

## Status Snapshot
- **Runtime**: React 18 + Vite + TypeScript targeting modern browsers.
- **Styling**: Custom design system implemented through CSS variables and utility classes in `src/styles/globals.css`.
- **Data & Auth**: Supabase client wrapper with a mock "demo mode" fallback (`src/lib/supabase.ts`). Most services operate against local storage until real credentials are provided.
- **Testing Tooling**: Vitest unit suites under `tests/unit` and Playwright end-to-end scaffolding under `tests/e2e`, both gated behind private package installs.
- **Documentation**: Living knowledge base under `docs/` with executive snapshot and roadmap in `docs/ops/`.

## Getting Started

### Prerequisites
- Node.js 20 LTS (or newer) and pnpm 8+.
- Access to internal `@flashfusion/*` packages if running the full experience; without them the app runs in demo mode with mocked services.

### Installation
```bash
pnpm install
```
> The command will warn/fail if the proprietary `@flashfusion/*` packages are unreachable. When that happens either provide the internal registry credentials or stub the packages locally before continuing.

### Environment Configuration
1. Copy `src/_env_example.tsx` to `.env.local`.
2. Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase project values.
3. Optional extras:
   - `VITE_APP_ENV` – `development`, `staging`, or `production`.
   - `VITE_APP_NAME`, `VITE_APP_VERSION` for telemetry overlays.

Without real Supabase credentials the client will run in demo mode (console warning) and all data mutations will be simulated.

### Useful Commands
```bash
pnpm dev            # Start Vite dev server on http://localhost:5173
pnpm run build      # Produce production bundle in dist/
# Suggested once dependencies resolve:
pnpm exec vitest    # Run unit tests
pnpm exec playwright test --project=chromium  # Run smoke E2E suite
```

## Project Layout
```
.
├── docs/                 # Product, ops, and engineering documentation
├── src/                  # React application codebase
│   ├── components/       # Feature modules (auth, demo, landing, dashboard)
│   ├── hooks/, services/ # Client-side domain logic with Supabase + local fallbacks
│   ├── lib/              # Runtime adapters (Supabase client, telemetry helpers)
│   └── styles/           # FlashFusion design tokens and animations
├── tests/                # Unit (Vitest) and E2E (Playwright) suites
├── scripts/, deploy-*.sh # Deployment utilities for Vercel/Netlify workflows
└── reports/, archive/    # Historical audits and migration notes
```

## Documentation & Planning
- **Executive snapshot** – `docs/ops/senior-snapshot.md`
- **Roadmap** – `docs/ops/roadmap.md`
- **Operational runbooks** – `docs/ops/new-feature-rollout.md`
- **API & integration specs** – `docs/api/`
- **Testing references** – `docs/testing/`

Keep documentation changes synchronized with code updates. Any new module or major decision should be reflected in `docs/` and cross-linked from the snapshot or roadmap where appropriate.

## Quality & Observability
- Error boundaries and runtime guards are centralized in `src/App.tsx` and `src/components/core/AppCoreOptimized.tsx`.
- Authentication context and route protection helpers live under `src/components/auth/` and `src/utils/auth-protection.ts`.
- Structured toast notifications (`sonner`) are wired throughout services for user feedback.
- Logging, metrics, and tracing for backend functions originate in `src/supabase/functions/server/` (Hono edge app).

Automated checks currently depend on private packages; unblock them before enforcing CI requirements.

## Deployment Notes
- `pnpm run build` emits a static bundle suitable for Vercel, Netlify, or any static host.
- Shell scripts (`deploy-production.sh`, `deploy-site.sh`, `deploy-web.sh`) document historical deployment flows; verify credentials and environment variables before execution.
- Supabase edge functions live under `src/supabase/functions/` and require the Supabase CLI for deployment.

## Contributing
1. Branch from `main` and keep commits scoped.
2. Update or add documentation in `docs/` for every user-facing or architectural change.
3. Run linting/tests once private dependencies are configured.
4. Submit PRs with:
   - Summary of changes
   - Testing evidence or blockers
   - Security/performance call-outs when relevant

For questions or onboarding assistance, start with `docs/ops/senior-snapshot.md` and follow the links to domain-specific guides.
