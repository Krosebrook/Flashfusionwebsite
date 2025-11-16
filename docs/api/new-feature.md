# FlashFusion Automation Workflow API Specification

**Last Updated**: 2025-10-30  
**Status**: Draft  
**Audience**: Developers, Security Reviewers

## Overview
This document proposes a new set of Automation Workflow API endpoints that let product teams define, execute, and audit multi-step automations inside FlashFusion Studio. The endpoints are designed to build on existing Supabase edge functions and Hono routing so we can orchestrate AI generation, repository analysis, and third-party integrations through a single workflow object.

## Existing API Assets for Reuse
- **Hono middleware & response patterns** – The primary edge function already applies global CORS and logging middleware plus JSON error responses for login, signup, and other routes, which we should extend for workflow operations.【F:src/supabase/functions/server/index.tsx†L1-L170】
- **Supabase-authenticated flows** – The dedicated auth router shows how to bootstrap the Supabase client, enforce email verification, and compose structured success/error payloads; reuse the same initialization helpers for workflow ownership validation.【F:src/supabase/functions/server/auth.tsx†L11-L200】
- **Collaboration & realtime utilities** – Collaboration handlers maintain presence maps, validate tokens, and broadcast updates; these patterns can be repurposed for workflow run state fan-out and audit streaming.【F:src/supabase/functions/server/realtime.tsx†L1-L120】
- **Integration testing UI** – The internal IntegrationTester component enumerates repository, AI, performance, and security checks; those categories map directly to workflow step templates we can expose via metadata endpoints.【F:internal/debug/components/IntegrationTester.tsx†L66-L200】
- **Stripe and API key management** – Existing helpers already encapsulate Stripe customer creation and API key retrieval, ensuring we can attach billing entitlements or per-provider credentials to workflow executions without duplicating logic.【F:src/supabase/functions/server/stripe.tsx†L1-L120】【F:src/services/APIKeyService.ts†L1-L140】

## Proposed Endpoints
| Path | Method | Auth | Description |
| --- | --- | --- | --- |
| `/make-server-88829a40/automation/workflows` | `POST` | Required (Bearer) | Create a workflow definition with ordered steps and guardrails. |
| `/make-server-88829a40/automation/workflows` | `GET` | Required (Bearer) | List workflows owned by the requesting workspace with filtering options. |
| `/make-server-88829a40/automation/workflows/:workflowId` | `GET` | Required (Bearer) | Fetch a single workflow with current revision, step metadata, and audit summary. |
| `/make-server-88829a40/automation/workflows/:workflowId` | `PATCH` | Required (Bearer) | Update workflow metadata, steps, or activation status. |
| `/make-server-88829a40/automation/workflows/:workflowId/run` | `POST` | Required (Bearer + RBAC `automation:execute`) | Trigger a workflow execution and stream progress events. |
| `/make-server-88829a40/automation/runs/:runId` | `GET` | Required (Bearer) | Retrieve run details, status timeline, and output artifacts. |
| `/make-server-88829a40/automation/workflows/:workflowId/steps` | `GET` | Required (Bearer) | Enumerate compatible workflow step templates with validation hints. |

### Shared Requirements
- **Routing**: Extend the existing Hono app or mount a new sub-app similar to the auth router for modularity.【F:src/supabase/functions/server/index.tsx†L1-L170】【F:src/supabase/functions/server/auth.tsx†L11-L36】
- **AuthZ**: Enforce bearer tokens issued by Supabase Auth and gate write/run actions behind role claims (`automation:admin`, `automation:execute`). Reuse token verification flows from realtime handlers.【F:src/supabase/functions/server/realtime.tsx†L25-L70】
- **Storage**: Persist workflows and runs in Supabase tables (`automation_workflows`, `automation_runs`, `automation_run_events`) with RLS policies that scope access to workspace IDs linked to the Supabase user.

## Request & Response Schemas
All payloads MUST be validated with Zod at the edge function boundary and mirrored in shared TypeScript types for client SDKs.

```ts
// src/schemas/automation.ts
import { z } from 'zod';

export const workflowStepSchema = z.object({
  id: z.string().uuid('step id must be a UUID'),
  type: z.enum(['ai_generate', 'repo_analyze', 'integration_call', 'wait', 'custom_script']),
  name: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
  config: z.record(z.string(), z.unknown()),
  retryPolicy: z.object({
    maxAttempts: z.number().int().min(0).max(5).default(0),
    backoffSeconds: z.number().int().min(0).max(3600).default(0)
  }).default({ maxAttempts: 0, backoffSeconds: 0 }),
  guards: z.object({
    requiredKeys: z.array(z.string()).default([]),
    allowedProviders: z.array(z.string()).optional(),
    timeoutSeconds: z.number().int().min(10).max(7200).optional()
  }).default({ requiredKeys: [] })
});

export const createWorkflowSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  workspaceId: z.string().uuid(),
  tags: z.array(z.string().max(30)).max(20).default([]),
  steps: z.array(workflowStepSchema).min(1).max(25),
  trigger: z.object({
    type: z.enum(['manual', 'webhook', 'schedule']),
    config: z.record(z.string(), z.unknown()).optional()
  }),
  isActive: z.boolean().default(false)
});

export const updateWorkflowSchema = createWorkflowSchema.partial({
  name: true,
  description: true,
  tags: true,
  steps: true,
  trigger: true,
  isActive: true
});

export const runWorkflowSchema = z.object({
  workspaceId: z.string().uuid(),
  inputs: z.record(z.string(), z.unknown()).default({}),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  idempotencyKey: z.string().uuid().optional()
});
```

### Example Responses
- **Create Workflow (201)**
```json
{
  "workflowId": "67e5d4d0-12ac-4c81-9a7a-5b70bf9b1a4f",
  "status": "created",
  "isActive": false,
  "steps": [...],
  "createdAt": "2025-10-30T12:00:00.000Z",
  "createdBy": "auth_user_id"
}
```
- **Run Workflow (202)**
```json
{
  "runId": "0dfc3d66-0191-4b77-8ee4-2c89878e1bcb",
  "status": "queued",
  "streamUrl": "wss://<project-id>.supabase.co/functions/v1/make-server-88829a40/automation/runs/0dfc3d66-.../stream",
  "estimatedStartSeconds": 5
}
```
- **Validation Error (422)**
```json
{
  "error": "validation_failed",
  "details": [
    { "path": ["steps", 0, "name"], "message": "String must contain at least 3 character(s)" }
  ],
  "requestId": "req_123"
}
```

## Error Handling Strategy
- Respond with RFC 7807-style objects (`type`, `title`, `status`, `detail`, `instance`) for predictable parsing; log structured errors with request IDs and scrub sensitive config fields.
- Use domain-specific error classes: `WorkflowValidationError` (422), `WorkflowNotFoundError` (404), `WorkflowConflictError` (409 for idempotency key collisions), and `WorkflowExecutionError` (500 with sanitized detail).
- Propagate Stripe or third-party errors through mapped error codes so billing enforcement aligns with existing checkout flows.【F:src/supabase/functions/server/stripe.tsx†L1-L120】

## Security & Compliance Review
1. **Threat Modeling** – Reuse the security checklist from IntegrationTester categories (security token & validation) to evaluate new endpoints, documenting findings before code merges.【F:internal/debug/components/IntegrationTester.tsx†L158-L173】
2. **AuthZ Verification** – Partner with the security lead to confirm RBAC scopes are enforced via Supabase policies and middleware before deploying to staging.
3. **Data Governance** – Ensure workflow payloads respect workspace data boundaries; coordinate with compliance to record data processing activities, especially for AI provider credentials retrieved through APIKeyService.【F:src/services/APIKeyService.ts†L1-L140】
4. **Sign-off** – Present this spec and threat model to Security & Compliance for approval. Implementation MAY NOT begin until written approval is recorded in the review tracker.

## Testing Expectations
- Unit tests: Zod schema validation, RBAC guard utilities, and workflow execution orchestrator.
- Integration tests: Edge function calls for create/list/update/run using Supabase test project, verifying persistence and event streaming.
- Negative tests: Expired tokens, missing entitlements, malformed steps (e.g., missing requiredKeys for integration_call types).

## Acceptance Checklist
- [ ] Security & compliance review sign-off recorded.
- [ ] Schemas merged into shared `src/schemas/automation.ts` module.
- [ ] Supabase migrations for workflow tables ready with rollback scripts.
- [ ] Test suite covering positive/negative paths passes in CI.
- [ ] API reference synced to `docs/api/rest` once implementation is complete.

## Rollback Plan
- Maintain feature-flag (`automationWorkflows`) to disable routes instantly.
- If deployment introduces regressions, revert edge function deployment to previous bundle and drop uncommitted migrations; Supabase point-in-time recovery available for new tables.
- Retain previous docs until feature is launched to avoid broken references.
