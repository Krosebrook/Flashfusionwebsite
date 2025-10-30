# Launch Preparation Hub Rollout Checklist

## 1. Pre-Launch Validation
- [ ] Confirm all P0/P1 tests from `docs/testing/new-feature-test-plan.md` pass in CI (lint, typecheck, unit, integration, E2E).
- [ ] Verify accessibility audit (axe) score ≥ 95 on Launch Hub route across desktop + mobile breakpoints.
- [ ] Ensure feature flags and environment variables (`LAUNCH_HUB_ENABLED`, API endpoints) are present in `.env` and `.env.example` without secrets committed.
- [ ] Review analytics dashboards (Mixpanel/Segment) to confirm new events (`launch_hub_tab_view`, `launch_doc_generated`) are defined and access-controlled.
- [ ] Run database migrations or seed updates tied to launch readiness data in staging; capture migration IDs.

## 2. Deployment Steps
1. Enable `launch-preparation-hub` feature flag for internal users in staging.
2. Deploy to staging via standard pipeline (`pnpm build && pnpm exec playwright test --project=chromium` smoke).
3. Conduct structured QA session using scenarios from the test plan (happy path, failure handling, accessibility, responsiveness).
4. Gather sign-off from:
   - Product (user journey completeness)
   - Engineering (performance/error budgets)
   - Support (knowledge base readiness)
   - Security (no new data exposure)
5. Schedule production release window with comms to support + marketing teams.

## 3. Monitoring Plan
- **Metrics**:
  - Launch readiness completion rate (% of users completing checklist).
  - Documentation generation success/failure counts.
  - Time-to-interaction (TTI) for hub route (target < 2.5s p95).
  - Error budgets for backend APIs powering launch data (5xx < 0.1%).
- **Logs/Tracing**:
  - Ensure structured logs include `feature=launch_hub`, sanitized payloads, correlation IDs.
  - Add OpenTelemetry spans for doc generation workflow (`launch.doc.generate`, `launch.doc.download`).
- **Alerts**:
  - PagerDuty warning when doc generation failure rate > 5% over 15 minutes.
  - Slack channel alert if Launch Hub page load > 3s p95 for 5 consecutive minutes.
  - Analytics anomaly detection for drop in marketing campaign activation > 20% day-over-day.

## 4. Rollback Strategy
- [ ] Maintain toggle `LAUNCH_HUB_ENABLED` to instantly disable UI while keeping backend services running.
- [ ] Prepare rollback deployment artifact (previous stable release tag) validated in staging.
- [ ] Automate database rollback scripts or ensure migrations are reversible (verified via `prisma migrate resolve --applied`).
- [ ] Communicate rollback decision tree with owners (Engineering lead + Incident commander) and update status page template.
- [ ] After rollback, run smoke test suite to confirm legacy experience operates normally.

## 5. Post-Launch Follow-up
- [ ] Monitor dashboards daily for first week; log findings in ops runbook.
- [ ] Collect user feedback via in-app survey and support tickets; categorize by severity.
- [ ] Review analytics events for data quality; backfill gaps if instrumentation lagged.
- [ ] Conduct retro covering deployment process, monitoring signals, and next test coverage improvements.
