# Testing Notes: Version Suffix Cleanup

## Why the `Fixed` suffix had to go

During Phase 2 of the refactor we found active components still exported under `*Fixed` filenames. Keeping the suffixes introduced two problems:

1. **Import drift** – production bundles were importing `LaunchDayCommandFixed` and `ErrorRecoverySystemFixed`, even though the "fixed" implementations were already the canonical ones. This created confusing module graphs and made static analysis look like multiple versions coexisted.
2. **Tooling fallout** – Vitest and Playwright suite discovery relied on predictable component names. Mixed suffix usage caused duplicated stories/tests and required custom ignore rules in CI.

Removing the suffix restored a single canonical path for each production component and simplified both lint/test configuration.

## Components touched by the rename

The following modules lost their `Fixed` suffix and now resolve to canonical paths:

- `src/components/layout/PageRouter.tsx` – lazy imports must reference the canonical names after the cleanup.
- `src/components/launch/LaunchDayCommand.tsx` (formerly `LaunchDayCommandFixed.tsx`).
- `src/components/recovery/ErrorRecoverySystem.tsx` (formerly `ErrorRecoverySystemFixed.tsx`).

Archive entries remain for the deprecated `Fixed` files under `archive/components/` for auditability.

## Post-cleanup expectations

- Imports must reference the canonical filenames; any lingering `*Fixed` import indicates stale code.
- Vitest suites should no longer require per-file ignores for duplicated component names.
- Playwright end-to-end suites now map directly to the canonical component routes without aliasing.
