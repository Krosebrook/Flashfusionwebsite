# FlashFusion Documentation Hub

**Last Updated**: 2025-11-28  
**Documentation Status**: Consolidated and updated

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

Archived audit reports and historical documentation can be found in `archive/audits/` and `archive/docs/`.

---

## Quick Links

### Getting Started
- [Main README](../README.md) - Project overview and setup
- [Quick Start Guide](../QUICK_START_GUIDE.md) - Onboarding for new team members
- [Needed Tasks](../NEEDED_TASKS.md) - Current priorities

### Operations
- [Executive Snapshot](./ops/senior-snapshot.md) - High-level project status
- [Roadmap](./ops/roadmap.md) - Product roadmap
- [Feature Rollout Guide](./ops/new-feature-rollout.md) - Deployment procedures

### Development
- [Developer Handoff Guide](./DEVELOPER_HANDOFF_GUIDE.md) - Contribution guidelines
- [Component Decomposition](./COMPONENT_DECOMPOSITION_GUIDE.md) - Refactoring patterns
- [Testing Infrastructure](./TESTING_INFRA_SUMMARY.md) - Test setup and practices

### Technical References
- [API Documentation](./api/) - API specifications
- [UI Standards](./ui/) - Design system and components

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

## Archived Documentation

Previous audit reports and historical documentation are preserved in the `archive/` directory:

- `archive/audits/` - Previous code audits and analysis reports
- `archive/docs/` - Historical project documentation and progress reports

---

## Migration Status

- ✅ Documentation structure consolidated (November 2025)
- ✅ Audit reports archived
- ✅ Root-level docs cleaned up
- ⏳ Migrate remaining guides from `src/` into `docs/`

Please log additional documentation gaps in the engineering backlog and link them here once scheduled.
