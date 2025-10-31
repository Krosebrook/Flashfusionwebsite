# FlashFusion Documentation Hub

**Last Updated**: 2024-11-24
**Documentation Status**: Snapshot alignment complete

---

## Directory Overview
```
docs/
├── README.md                 # You are here – documentation index
├── api/                      # API and integration specifications
├── development/              # Engineering process notes
├── ops/                      # Operational runbooks, roadmap, and executive snapshot
├── testing/                  # Test strategies and plans
└── ui/                       # Visual and UX guidance
```

Historical, high-volume documentation from earlier phases still lives in `src/` (for example `src/COMPLETE_DOCUMENTATION_INDEX.md`). Treat those files as archival references until they are triaged into the structure above.

---

## Quick Links
- **Executive Snapshot**: [`docs/ops/senior-snapshot.md`](./ops/senior-snapshot.md)
- **Roadmap**: [`docs/ops/roadmap.md`](./ops/roadmap.md)
- **Operational Runbooks**: [`docs/ops/new-feature-rollout.md`](./ops/new-feature-rollout.md)
- **API Specifications**: [`docs/api/`](./api/)
- **Testing References**: [`docs/testing/`](./testing/)
- **UI Standards**: [`docs/ui/`](./ui/)

---

## Documentation Standards
Every new or updated document should follow this header block:
```markdown
# Title

**Last Updated**: YYYY-MM-DD
**Status**: Draft | Review | Published
**Audience**: Developers | Product | Ops | All
```

### Writing Guidelines
- Keep titles action-oriented (e.g., "Deploying Supabase Functions")
- Call out prerequisites, security considerations, and rollback steps
- Cross-link related documents to avoid duplication
- Record TODOs with owners and target dates when applicable

### Change Management
1. Update or create the relevant document under `docs/`
2. Add the file (or section) to this index when it becomes canonical
3. Reference the document from PR descriptions when functionality ships
4. Archive superseded documents in `archive/` with a deprecation notice

---

## Migration Backlog
- ✅ Executive snapshot + roadmap refreshed (November 2024)
- 🔄 Migrate critical guides from `src/` into `docs/` (in progress)
- ⏳ Audit testing documentation for parity with current tooling (Vitest + Playwright)
- ⏳ Consolidate Supabase setup instructions into a single deployment guide

Please log additional documentation gaps in the engineering backlog and link them here once scheduled.
