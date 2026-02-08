# ADR-0001: Frontend Routing/Auth Boundary Consolidation

## Status
Accepted

## Context
The codebase had duplicated route-state logic and permissive authentication fallback behavior spread across multiple hooks. This reduced modularity, made test coverage shallow, and increased production risk.

## Decision
1. Introduce shared route-state computation helpers in `src/lib/routing-state.ts`.
2. Refactor `src/src/core/router/useRouter.ts` to consume the shared route-state helpers.
3. Introduce explicit auth fallback policy in `src/lib/auth-policy.ts`:
   - Demo fallback is **disabled by default in production**.
   - Demo fallback can be enabled explicitly with `VITE_ENABLE_DEMO_AUTH=true`.
4. Add focused unit tests for route-state and auth-policy behavior.

## Consequences
### Positive
- Removes duplicated decision logic and centralizes routing behavior.
- Makes fail-closed auth behavior the production default.
- Improves testability with pure-function unit tests.

### Negative
- Existing workflows that relied on implicit production demo fallback must opt-in via env flag.
- Additional module boundaries require developers to route behavior changes through shared helpers.

## Rollback
- Revert commit introducing `routing-state.ts` and `auth-policy.ts`.
- Restore previous `useRouter` and `useAuthentication` inline logic.
