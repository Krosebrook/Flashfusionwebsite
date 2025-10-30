# New Feature Test Plan: Launch Preparation Hub Experience

## 1. Feature Overview
- **Scope**: The Launch Preparation Hub consolidates documentation generation, marketing enablement, support readiness, legal review, and launch checklist tracking into a single workspace.
- **Key surfaces**: `LaunchPreparationHub` (UI), supporting logic in `LaunchPreparationHub.logic.ts`, marketing surfaces (`LaunchMarketingCampaign`, `ConversionOptimizedLanding`, `LaunchCampaign`), and shared analytics/services modules.
- **Critical user journeys**:
  1. Reviewing launch readiness metrics and checklist completion.
  2. Generating launch assets (documentation bundles, marketing copy, support materials) and downloading files.
  3. Coordinating cross-team tabs (Docs, Marketing, Support, Legal, Checklist) while analytics hooks track engagement.

## 2. Existing Test Inventory (tests/)
| Area | File | Coverage Summary |
| --- | --- | --- |
| Component smoke | `tests/unit/components/launch/LaunchPreparationHub.test.tsx` | Verifies static rendering, tab presence, accessibility roles, and default state. |
| Component logic | `tests/unit/components/launch/LaunchPreparationHub.logic.test.ts` | Exercises pure helpers: readiness/progress math, filename selection, marketing copy templating, ROI math, support aggregation, asset filtering/statistics. |
| Marketing UI | `tests/unit/components/marketing/LaunchMarketingCampaign.test.tsx` | Confirms campaign overview rendering, seeded cards, templates tab navigation, analytics mock integration. |
| Marketing UI | `tests/unit/components/marketing/ConversionOptimizedLanding.test.tsx` | Smoke coverage for landing page conversions (CTA, testimonials). |
| Marketing UI | `tests/unit/components/marketing/LaunchCampaign.test.tsx` | Smoke coverage for marketing orchestration UI (tabs, content). |
| Shared hook | `tests/unit/hooks/useGamification.test.ts` | Validates gamification state transitions unrelated to launch hub but reused in reward displays. |
| Service | `tests/unit/services/AIService.test.ts` | Confirms AI service prompt orchestration and error handling stubs. |
| End-to-end | `tests/e2e/launch-preparation.spec.ts` | Playwright smoke: app boot, nav visibility, console error guard, responsive viewport check, placeholder Launch Hub navigation probe, and load-time ceiling. |

## 3. Coverage Gaps for Launch Preparation Hub
1. **Dynamic state transitions**: Missing tests for tab content switching beyond marketing, progress bars updating after simulated completions, and readiness recalculation with live checklist edits.
2. **Async workflows**: No coverage for documentation generation promises (success + failure), download link creation, or toast notifications triggered by service calls.
3. **Analytics & tracking**: Only marketing component checks analytics mock; LaunchPreparationHub lacks assertions for feature usage tracking and structured logging hooks.
4. **Error resilience**: Absent coverage for API failures (e.g., asset fetch, campaign ROI errors), fallback UIs, and resilience to malformed fixture data.
5. **Accessibility regressions**: Only basic role checks; no assertions for keyboard navigation, focus management, or ARIA attributes on newly introduced interactive controls (download menus, accordions).
6. **Cross-surface consistency**: No integration test validating data passed from logic helpers into marketing/support widgets, or verifying that aggregated metrics match UI totals.
7. **Security boundaries**: No tests ensuring sensitive exports (e.g., downloadable docs) are sanitized, or that user-supplied variables in marketing copy are validated/escaped.

## 4. Planned Test Coverage

### 4.1 Unit Tests
| Priority | Test | Description |
| --- | --- | --- |
| P0 | `LaunchPreparationHub` state reducer | Simulate checklist mutations, tab switches, and verify readiness/overall progress updates (success + empty checklist regressions). |
| P0 | Documentation generation handlers | Mock `generateUserManualContent`/download pipeline to assert success flow, file naming, and error toast when service throws. Include negative test with invalid documentation type. |
| P0 | Analytics dispatch | Ensure hub calls `analyticsService.trackFeatureUsage` with structured payloads per tab/action; assert it is skipped on validation failure. |
| P1 | Accessibility helpers | Verify focus is sent to first actionable element after tab switch and ARIA attributes mirror active state. |
| P1 | Marketing ROI guardrails | Extend `calculateCampaignROI` tests to cover zero-budget, negative engagement, and clamp behavior. |
| P2 | Support metric aggregation | Validate `aggregateSupportMetrics` gracefully handles empty/support channels with partial data.

### 4.2 Integration Tests
| Priority | Test | Description |
| --- | --- | --- |
| P0 | Launch readiness dashboard integration | Render hub with mocked services responding asynchronously; assert readiness banner, checklist counts, and marketing/support summaries reconcile with mocked payloads. Include failure path verifying fallback alerts. |
| P0 | Documentation generation -> download | Simulate user clicking "Generate" buttons, wait for mocked promise resolution, confirm download modal content, analytics event, and state reset. Negative case: forced rejection surfaces error toast + logs. |
| P1 | Cross-tab data sync | Switch between Docs/Marketing/Support/Legal tabs, ensure shared context retains progress metrics and renders correct components without remounting glitches (assert via component markers). |
| P1 | Security sanitization | Pass marketing copy template with malicious input and ensure rendered HTML remains escaped/safe (no `innerHTML`). |
| P2 | Gamification badge integration | Mount hub with gamification hook provider and assert XP badge updates after completing checklist item.

### 4.3 End-to-End Tests (Playwright)
| Priority | Scenario | Description |
| --- | --- | --- |
| P0 | Launch readiness happy path | Navigate to hub route, complete checklist item, trigger doc generation, verify downloadable artifact link and readiness % increment. |
| P0 | Marketing activation | Use templates tab to generate campaign, confirm analytics toast, ensure ROI widget populates. |
| P0 | Failure handling | Force API mock failure (via dev toggle), confirm inline error messaging, logs, and absence of stale progress indicator. |
| P1 | Accessibility regression | Keyboard-only navigation across tabs/buttons, ensure visible focus ring and enter/space activation. |
| P1 | Responsiveness | View hub on mobile + desktop breakpoints verifying layout swaps (stacked cards vs grid) and no overflow. |
| P2 | Download audit trail | Validate that download events emit audit log entry and appear in activity feed.

## 5. Tooling & Data Requirements
- Expand fixtures in `src/fixtures/launch/launch-preparation-fixtures.ts` to include edge-case payloads (empty arrays, malformed metrics, high-volume campaigns).
- Introduce MSW (Mock Service Worker) or equivalent handler to simulate backend endpoints during integration/E2E tests.
- Add Playwright project for auth-required routes if Launch Hub demands login in production.

## 6. Exit Criteria
- All P0 tests implemented and passing in CI.
- P1 coverage implemented before code freeze; P2 scheduled if time allows.
- Code coverage threshold ≥ 80% statements/branches for Launch Hub modules.
- Accessibility audits (axe) integrated into CI for Launch Hub route.
