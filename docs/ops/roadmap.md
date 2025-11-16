# FlashFusion Roadmap

**Last Updated**: 2024-11-24  
**Status**: Published  
**Audience**: Product, Engineering, Ops

---

## Guiding Principles
1. Unlock real Supabase-backed workflows before expanding feature breadth.
2. Keep private dependencies installable in CI/CD to regain automated quality gates.
3. Ship incrementally with toggles and rollback paths for every surface.

---

## Delivery Timeline

### ✅ Foundations (In Progress)
- Documented executive snapshot and documentation structure refresh.
- Clarified environment expectations (`README.md`, `.env.local` template).

### 0-30 Days — Stabilize the Core
- Configure access to `@flashfusion/*` packages or replace them with open equivalents; document `.npmrc` instructions.
- Stand up Supabase project (auth, storage, gamification tables) and wire real credentials locally + staging.
- Refactor services (`AuthProvider`, `GamificationService`, `AIService`) to fail closed when Supabase responses error; add telemetry hooks.
- Create baseline CI job: `pnpm install`, `pnpm run build`, `pnpm exec vitest --run --reporter=dot`.

### 30-60 Days — Production Readiness
- Harden Supabase edge functions with RBAC, rate limiting, and structured logs; add automated Playwright smoke tests for auth + dashboard flows.
- Implement persistent project CRUD + deployment tracking using real Supabase tables.
- Integrate API key vaulting strategy for AI providers (backed by Supabase secrets or external secret manager).
- Publish public-facing docs for setup, deployment, and incident response.

### 60-90 Days — Monetization & Observability
- Enable billing/credits enforcement through Stripe integration in edge functions and UI entitlements.
- Roll out analytics dashboards for usage (Recharts-based) with real data.
- Launch feature flags and remote config for progressive delivery; instrument health metrics + alerts.
- Conduct security review + penetration test prior to GA.

### 90+ Days — Expansion
- Marketplace/plugin framework for third-party tool integrations.
- Workspace/team collaboration with granular permissions.
- Mobile companion experience leveraging shared component library.
- Advanced workflow automation API described in `docs/api/new-feature.md`.

---

## Dependencies & Gating Issues
- **Package Access**: Document internal registry URL and tokens; consider vendoring critical utilities if contracts allow.
- **Supabase Schema**: Need migrations for users, projects, gamification, billing tables with rollback scripts.
- **Secrets**: Establish `.env.local` + production secret management policy; evaluate Vault or Supabase secret store.

---

## Success Metrics
- Install + build succeed in CI on every PR.
- Authentication + dashboard smoke suite green in staging within 5 minutes of deploy.
- Error rate on Supabase edge functions < 0.5% p95.
- Time-to-interactive for landing page < 2.5s p95 on mid-tier devices.

---

## Reporting Cadence
- Weekly engineering sync: review roadmap status, doc gaps, risk register.
- Bi-weekly product demo: show incremental progress on Supabase-backed features.
- Monthly executive update: summarize metrics, upcoming milestones, and resource needs.

---

## Change Log
- **2024-11-24**: Initial roadmap aligned with senior snapshot and documentation overhaul.
