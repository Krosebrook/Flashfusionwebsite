# FlashFusion Documentation

**Last Updated**: 2025-10-26
**Documentation Status**: Consolidation in progress (Prompt 5)

---

## Documentation Structure

```
docs/
├── README.md                          # This file - documentation index
├── guides/                            # How-to guides and tutorials
│   ├── development/                   # Development workflows
│   ├── deployment/                    # Deployment guides
│   ├── features/                      # Feature documentation
│   └── troubleshooting/               # Debug and fix guides
├── architecture/                      # System architecture docs
│   ├── components/                    # Component architecture
│   ├── data-flow/                     # Data flow diagrams
│   └── infrastructure/                # Infrastructure setup
├── api/                               # API documentation
│   ├── rest/                          # REST API docs
│   └── graphql/                       # GraphQL schema docs
├── refactoring/                       # Refactoring documentation
│   ├── COMPONENT_DECOMPOSITION_GUIDE.md
│   └── UTILITY_SPLIT_PLAN.md
└── project/                           # Project management docs
    ├── roadmap/                       # Feature roadmap
    ├── phases/                        # Development phases
    └── metrics/                       # Quality metrics
```

---

## Quick Links

### Getting Started
- [Development Workflow](./guides/development/DEVELOPMENT_WORKFLOW.md)
- [Repository Setup](./guides/development/REPOSITORY_SERVICES_SETUP_GUIDE.md)
- [Supabase Status](./guides/development/SUPABASE_STATUS_CHECK.md)

### Deployment
- [Deployment Pipeline](./guides/deployment/DEPLOYMENT_PIPELINE_COMPLETE.md)
- [Deployment Error Fixes](./guides/deployment/DEPLOYMENT_ERROR_FIX.md)

### Features & Implementation
- [Page Implementations](./guides/features/PAGE_IMPLEMENTATIONS_PAGES_4_8.md)
- [Premium Landing Page](./guides/features/PREMIUM_LANDING_PAGE_GUIDE.md)
- [Navigation System](./guides/features/ENTER_APP_NAVIGATION_FIX.md)

### Monitoring & Performance
- [Step 8: Monitoring & Analytics](./guides/development/STEP_8_MONITORING_ANALYTICS_SETUP.md)
- [Step 13: Performance Monitoring](./guides/development/STEP_13_PERFORMANCE_MONITORING_SCALING.md)
- [Optimization Implementation](./architecture/OPTIMIZATION_IMPLEMENTATION_COMPLETE.md)

### Quality & Testing
- [Phase 4: Quality Metrics](./project/phases/PHASE_4_QUALITY_METRICS_COMPLETE.md)
- [Phase 8: Blindspot Mitigation](./project/phases/PHASE_8_BLINDSPOT_MITIGATION_COMPLETE.md)
- [Final Validation Summary](./project/final-validation-summary.md)

### Refactoring
- [Component Decomposition Guide](./refactoring/COMPONENT_DECOMPOSITION_GUIDE.md)
- [Utility Split Plan](./refactoring/UTILITY_SPLIT_PLAN.md)
- [Debug Refactor Complete](./guides/development/DEBUG_REFACTOR_COMPLETE.md)

### Advanced Topics
- [Advanced Platform Evolution](./architecture/ADVANCED_PLATFORM_EVOLUTION_COMPLETE.md)
- [Navigation Debug Fix](./guides/troubleshooting/NAVIGATION_DEBUG_FIX_COMPLETE.md)

---

## Documentation Standards

### File Naming
- Use `SCREAMING_SNAKE_CASE.md` for major guides
- Use `kebab-case.md` for reference docs
- Include version/date in header

### Structure
Each documentation file should include:
```markdown
# Title

**Last Updated**: YYYY-MM-DD
**Status**: Draft | Review | Published
**Audience**: Developers | Users | DevOps

## Overview
Brief description

## Content
Main content sections

## Related
Links to related docs
```

### Categories

#### `guides/` - How-To Documentation
Step-by-step instructions for specific tasks

#### `architecture/` - System Design
High-level system design and architecture decisions

#### `api/` - API Reference
Endpoint documentation, schemas, examples

#### `refactoring/` - Refactoring Guides
Systematic refactoring patterns and plans

#### `project/` - Project Management
Roadmaps, phases, metrics, planning docs

---

## Migration Status

**Total Docs Found**: 186 markdown files in `src/`
**Organized**: ~20 files
**Remaining**: ~166 files need consolidation

### Priority Migration

1. **Development guides** → `docs/guides/development/`
2. **Deployment guides** → `docs/guides/deployment/`
3. **Phase documentation** → `docs/project/phases/`
4. **Step guides** → `docs/guides/development/` (rename to describe purpose)
5. **Debug/fix guides** → `docs/guides/troubleshooting/`
6. **Architecture docs** → `docs/architecture/`

### Cleanup Recommendations

**Consolidate similar docs**:
- `DEVELOPMENT_WORKFLOW.md` + `DEVELOPMENT_WORKFLOW_FIXED.md` → Keep latest
- Multiple `STEP_X_` files → Consolidate into single guide with sections
- `*_COMPLETE.md` files → Archive or merge into main guides

**Archive outdated docs**:
- Move to `docs/archive/` with date
- Add deprecation notice
- Link to current version

---

## Contributing to Docs

### Before Adding New Docs
1. Check if topic already exists
2. Update existing doc rather than creating new
3. Follow naming conventions
4. Add entry to this README

### Doc Review Process
1. Create in appropriate subdirectory
2. Follow documentation standards
3. Add to README quick links
4. Request review from team

---

## Related Files

- `/migration-notes.md` - Refactoring changelog
- `/reports/` - Machine-readable refactoring reports
- `/archive/` - Archived code and docs
