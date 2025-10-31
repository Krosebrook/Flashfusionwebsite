# FlashFusion Website - Needed Tasks

**Last Updated**: 2025-10-31  
**Status**: Comprehensive Task List  
**Audience**: Engineering Team, Project Managers

---

## Executive Summary

This document provides a comprehensive, prioritized list of tasks needed to bring the FlashFusion Website to production-ready status. Tasks are organized by priority and include time estimates, dependencies, and success criteria.

**Current State**: Repository has strong documentation and architectural planning, but faces critical blockers in build infrastructure and dependency management.

**Health Score**: 🟠 **NEEDS IMMEDIATE ATTENTION** (see COMPREHENSIVE_AUDIT_2025.md for details)

---

## 🔴 CRITICAL PRIORITY - Must Complete First (8-12 hours)

These tasks are **blocking** all other development work and must be completed immediately.

### Task 1.1: Fix Package Dependencies (3-4 hours)

**Severity**: 🔴 CRITICAL - Blocks all development  
**Dependencies**: None  
**Assignable**: Senior Engineer with npm/pnpm expertise

**Problem**: 
- 60+ packages using wildcard versions (`"*"`)
- Storybook peer dependency conflicts
- Cannot install dependencies successfully
- No version pinning leads to unpredictable builds

**Action Items**:
1. [ ] Pin all `@radix-ui/*` packages to specific versions
2. [ ] Resolve Storybook version conflict (@storybook/test vs @storybook/react-vite)
3. [ ] Pin `tailwindcss`, `vite`, `vitest`, `zod`, and other wildcards
4. [ ] Determine if `@flashfusion/*` packages are local (monorepo) or external
5. [ ] Document package version decisions in `package.json` comments
6. [ ] Test with `npm install --legacy-peer-deps`
7. [ ] Verify `npm install` works without flags

**Success Criteria**:
- ✅ `npm install` completes without errors
- ✅ `pnpm install` completes without errors
- ✅ No wildcard dependencies remain (except internal packages if applicable)
- ✅ Lock file generated successfully

**Files to Modify**:
- `package.json`
- `pnpm-lock.yaml` (will be regenerated)

**Reference**: AUDIT_ACTION_PLAN.md, Section "Critical Issues Remaining"

---

### Task 1.2: Verify Build System Works (1 hour)

**Severity**: 🔴 CRITICAL  
**Dependencies**: Task 1.1 must be complete  
**Assignable**: Any engineer

**Action Items**:
1. [ ] Run `npm run type-check` - verify TypeScript compiles
2. [ ] Run `npm run build` - verify production build succeeds
3. [ ] Check `dist/` folder output
4. [ ] Run `npm run preview` - verify built app loads
5. [ ] Document any build warnings or errors
6. [ ] Fix any critical build failures

**Success Criteria**:
- ✅ Type checking passes with 0 errors
- ✅ Production build completes successfully
- ✅ Built application loads in browser
- ✅ No critical build warnings

**Commands**:
```bash
npm run type-check
npm run build
npm run preview
```

---

### Task 1.3: Run Security Audit (30 minutes)

**Severity**: 🔴 CRITICAL  
**Dependencies**: Task 1.1 must be complete  
**Assignable**: Any engineer

**Action Items**:
1. [ ] Run `npm audit`
2. [ ] Document all critical and high vulnerabilities
3. [ ] Run `npm audit fix` for auto-fixable issues
4. [ ] Create separate tasks for manual vulnerability fixes
5. [ ] Add security audit to CI/CD pipeline

**Success Criteria**:
- ✅ Security audit report generated
- ✅ 0 critical vulnerabilities
- ✅ High vulnerabilities documented with remediation plan
- ✅ Security scanning added to CI/CD

**Commands**:
```bash
npm audit
npm audit fix
npm audit fix --force  # Only if necessary
```

---

### Task 1.4: Set Up Basic CI/CD Pipeline (2-3 hours)

**Severity**: 🔴 HIGH  
**Dependencies**: Tasks 1.1, 1.2 must be complete  
**Assignable**: DevOps Engineer or Senior Developer

**Action Items**:
1. [ ] Create `.github/workflows/ci.yml`
2. [ ] Add jobs for: install, type-check, lint, build, test
3. [ ] Configure Node.js 20 LTS
4. [ ] Use appropriate package manager (npm vs pnpm)
5. [ ] Add status badge to README.md
6. [ ] Test workflow on pull request

**Success Criteria**:
- ✅ CI workflow runs on every PR
- ✅ All quality checks pass
- ✅ Workflow completes in < 10 minutes
- ✅ README displays build status badge

**Sample Workflow**:
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test
      - run: npm run build
```

**Files to Create**:
- `.github/workflows/ci.yml`

**Files to Modify**:
- `README.md` (add status badge)

---

## 🟠 HIGH PRIORITY - Complete Within 2 Weeks (40-60 hours)

### Task 2.1: Component Decomposition - Remaining Critical Components (50-80 hours total)

**Severity**: 🟠 HIGH  
**Dependencies**: None (can start in parallel)  
**Assignable**: Multiple engineers can work in parallel

**Background**: LaunchPreparationHub.tsx has been fully decomposed (see STEP_3_DECOMPOSITION_PLAN.md). Apply the same pattern to remaining oversized components.

**Remaining Components** (in priority order):

#### 2.1.1: CodeGeneratorTool.tsx (14-20 hours)
- **Current Size**: 1,753 lines
- **Target Size**: <500 lines
- **Status**: Fixtures already extracted
- **Phases**: Business Logic → Hooks → UI Sections → Testing

#### 2.1.2: FullStackAppBuilder.tsx (16-22 hours)
- **Current Size**: 1,726 lines
- **Target Size**: <500 lines
- **Status**: Not started
- **Phases**: Types & Fixtures → Business Logic → Hooks → UI Sections → Testing

#### 2.1.3: UserPersonaCards.tsx (14-20 hours)
- **Current Size**: 1,692 lines
- **Target Size**: <500 lines
- **Status**: Not started
- **Phases**: Types & Fixtures → Business Logic → Hooks → UI Sections → Testing

#### 2.1.4: AgentDesignerTool.tsx (14-20 hours)
- **Current Size**: 1,682 lines
- **Target Size**: <500 lines
- **Status**: Fixtures already extracted
- **Phases**: Business Logic → Hooks → UI Sections → Testing

**Success Criteria per Component**:
- ✅ Main component < 500 lines
- ✅ Types extracted to `.types.ts` file
- ✅ Business logic in `.logic.ts` file
- ✅ State management in custom hooks
- ✅ UI sections in separate components
- ✅ Test coverage > 80% for logic and hooks
- ✅ All TypeScript compilation passes

**Reference**: 
- `STEP_3_DECOMPOSITION_PLAN.md` - Detailed decomposition pattern
- `docs/COMPONENT_DECOMPOSITION_GUIDE.md` - Step-by-step guide

---

### Task 2.2: Fix Fixture Compliance Issues (1-2 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: None  
**Assignable**: Any engineer familiar with the codebase

**Problem**: Only 57% fixture compliance (4/7 components passing)

**Action Items**:
1. [ ] LaunchMarketingCampaign.tsx - Extract 300+ lines of inline mock data
2. [ ] ContentGeneratorTool.tsx - Fix fixture violations
3. [ ] AgentDesignerTool.tsx - Clean up fixture usage
4. [ ] Verify all extracted fixtures in `src/fixtures/`
5. [ ] Update component imports

**Success Criteria**:
- ✅ 100% fixture compliance (7/7 components)
- ✅ No inline mock data > 50 lines in any component
- ✅ All fixtures in `src/fixtures/` directory
- ✅ Fixtures properly typed with TypeScript

**Reference**: `FIXTURE_AUDIT.md`

---

### Task 2.3: Schema Validation Fixes (8-10 hours)

**Severity**: 🟠 HIGH  
**Dependencies**: None  
**Assignable**: Backend/Full-stack Engineer

**Problem**: Multiple schema inconsistencies creating type safety and runtime issues

**Action Items**:
1. [ ] Fix analytics event type inconsistency (timestamp: string vs number)
2. [ ] Merge duplicate analytics tables with different schemas
3. [ ] Align contract/implementation event mismatch (7 defined vs 20+ tracked)
4. [ ] Add missing API request/response types
5. [ ] Create Zod schemas for validation
6. [ ] Document schema decisions

**Success Criteria**:
- ✅ All schema inconsistencies resolved
- ✅ Single source of truth for each data type
- ✅ Zod validation schemas for all API boundaries
- ✅ TypeScript types generated from schemas
- ✅ 100% type coverage for API layer

**Reference**: `SCHEMA_VALIDATION_REPORT.md`

---

### Task 2.4: Utilities Split - file-generators.ts (6-8 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: None  
**Assignable**: Any engineer

**Problem**: `file-generators.ts` is 2,316 lines - impossible to maintain

**Action Items**:
1. [ ] Create 9 module structure per split plan
2. [ ] Extract functions per mappings in `reports/utilities-split.json`
3. [ ] Create barrel export `src/utils/generators/index.ts`
4. [ ] Update all imports across codebase
5. [ ] Verify no functionality broken
6. [ ] Add JSDoc comments to extracted modules

**Modules to Create**:
- `templateGenerator.ts` - Template generation functions
- `codeGenerator.ts` - Code generation functions
- `fileGenerator.ts` - File creation functions
- `documentGenerator.ts` - Documentation generation
- `configGenerator.ts` - Config file generation
- `schemaGenerator.ts` - Schema generation
- `apiGenerator.ts` - API generation
- `testGenerator.ts` - Test generation
- `projectGenerator.ts` - Project scaffolding

**Success Criteria**:
- ✅ Each module < 300 lines
- ✅ Clear separation of concerns
- ✅ All imports updated
- ✅ No broken functionality
- ✅ JSDoc documentation added

**Reference**: `docs/UTILITY_SPLIT_PLAN.md`, `reports/utilities-split.json`

---

## 🟡 MEDIUM PRIORITY - Complete Within 1 Month (30-50 hours)

### Task 3.1: Improve Test Coverage (15-20 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: Build system working (Task 1.2)  
**Assignable**: QA Engineer or Developer

**Current State**: ~5% coverage, Target: 35% minimum

**Action Items**:
1. [ ] Verify Vitest configuration works
2. [ ] Run `npm run test:coverage`
3. [ ] Identify critical paths without coverage
4. [ ] Add tests for authentication flows
5. [ ] Add tests for API services
6. [ ] Add tests for custom hooks
7. [ ] Add tests for business logic files
8. [ ] Set up coverage thresholds in `vitest.config.ts`
9. [ ] Add coverage reporting to CI/CD

**Test Priorities**:
1. Authentication system
2. Data services (Supabase integration)
3. Custom hooks from decomposed components
4. Business logic functions
5. UI component interactions

**Success Criteria**:
- ✅ Overall coverage > 35%
- ✅ Logic/utils coverage > 60%
- ✅ Critical auth flows > 80% coverage
- ✅ Coverage reports in CI/CD
- ✅ Coverage trends tracked

**Reference**: `docs/TESTING_INFRA_SUMMARY.md`

---

### Task 3.2: Tailwind Primitives Migration (10-15 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: None  
**Assignable**: Frontend Engineer

**Problem**: 2,466+ repeated Tailwind patterns across codebase

**Action Items**:
1. [ ] Review `reports/tailwind-primitives.json` for top patterns
2. [ ] Verify `Flex` and `Grid` primitives are working
3. [ ] Create additional primitives as needed:
   - `Stack` component
   - `Center` component
   - `Container` component
4. [ ] Migrate top 10 most-used patterns
5. [ ] Update component library documentation
6. [ ] Create migration guide for team

**Success Criteria**:
- ✅ Primitives cover top 20 repeated patterns
- ✅ At least 500 usages migrated to primitives
- ✅ Documentation for all primitives
- ✅ Storybook stories for each primitive
- ✅ Team trained on primitive usage

**Reference**: `reports/tailwind-primitives.json`, `TAILWIND_REFACTORING_FINDINGS.md`

---

### Task 3.3: Documentation Consolidation (5-8 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: None  
**Assignable**: Technical Writer or Senior Engineer

**Problem**: 186+ documentation files with some redundancy

**Action Items**:
1. [ ] Review `reports/documentation-consolidation.json`
2. [ ] Identify and merge duplicate documentation
3. [ ] Remove outdated audit reports (archive old ones)
4. [ ] Create clear documentation hierarchy
5. [ ] Update `docs/README.md` index
6. [ ] Add "last updated" dates to all docs
7. [ ] Implement documentation linting

**Success Criteria**:
- ✅ No duplicate documentation
- ✅ Clear hierarchy in `docs/`
- ✅ All docs have update dates
- ✅ Updated index in `docs/README.md`
- ✅ Stale docs archived or removed

**Reference**: `reports/documentation-consolidation.json`

---

### Task 3.4: Linting and Formatting Setup (2-4 hours)

**Severity**: 🟡 MEDIUM  
**Dependencies**: Dependencies installed (Task 1.1)  
**Assignable**: Any engineer

**Action Items**:
1. [ ] Verify ESLint configuration works
2. [ ] Verify Prettier configuration works
3. [ ] Run `npm run lint` and fix issues
4. [ ] Run `npm run format` on entire codebase
5. [ ] Set up pre-commit hooks (.husky already exists)
6. [ ] Add lint-staged configuration
7. [ ] Document code style decisions

**Success Criteria**:
- ✅ `npm run lint` passes
- ✅ `npm run format:check` passes
- ✅ Pre-commit hooks working
- ✅ Code style documented
- ✅ Linting enforced in CI/CD

**Reference**: `reports/lint-type-hygiene.json`

---

## 🟢 LOW PRIORITY - Future Improvements (40+ hours)

### Task 4.1: Supabase Integration (20-30 hours)

**Severity**: 🟢 LOW  
**Dependencies**: Build working, tests passing  
**Assignable**: Backend Engineer

**Action Items**:
1. [ ] Set up Supabase project
2. [ ] Create database schema migrations
3. [ ] Configure authentication providers
4. [ ] Wire real credentials in staging
5. [ ] Replace demo mode with real Supabase calls
6. [ ] Add error handling and retry logic
7. [ ] Document Supabase setup process

**Reference**: `docs/ops/roadmap.md` - "0-30 Days — Stabilize the Core"

---

### Task 4.2: Bundle Optimization (5-10 hours)

**Severity**: 🟢 LOW  
**Dependencies**: Build working  
**Assignable**: Performance Engineer

**Action Items**:
1. [ ] Analyze bundle with `rollup-plugin-visualizer`
2. [ ] Implement code splitting
3. [ ] Lazy load routes
4. [ ] Optimize images and assets
5. [ ] Configure tree shaking
6. [ ] Measure bundle size (target: <1MB gzipped)

---

### Task 4.3: Accessibility Audit (10-15 hours)

**Severity**: 🟢 LOW  
**Dependencies**: None  
**Assignable**: Accessibility Specialist

**Action Items**:
1. [ ] Add `@axe-core/react` for automated testing
2. [ ] Run manual accessibility audit
3. [ ] Fix WCAG violations
4. [ ] Add keyboard navigation tests
5. [ ] Add screen reader tests
6. [ ] Document accessibility standards

---

### Task 4.4: Performance Monitoring (8-12 hours)

**Severity**: 🟢 LOW  
**Dependencies**: Production deployment  
**Assignable**: DevOps Engineer

**Action Items**:
1. [ ] Set up error tracking (Sentry or similar)
2. [ ] Set up performance monitoring
3. [ ] Configure user session replay
4. [ ] Add custom metrics
5. [ ] Create performance dashboards
6. [ ] Set up alerts

---

## 📊 Summary & Effort Estimates

### By Priority

| Priority | Tasks | Estimated Hours | Status |
|----------|-------|----------------|--------|
| 🔴 Critical | 4 | 8-12 hours | Not Started |
| 🟠 High | 4 | 80-120 hours | LaunchPreparationHub Complete |
| 🟡 Medium | 4 | 30-50 hours | Not Started |
| 🟢 Low | 4 | 40+ hours | Not Started |
| **TOTAL** | **16** | **158-182+ hours** | **~10% Complete** |

### Critical Path

```
Task 1.1 (Fix Dependencies)
    ↓
Task 1.2 (Verify Build)
    ↓
Task 1.3 (Security Audit) + Task 1.4 (CI/CD)
    ↓
Task 2.x (High Priority) - Can work in parallel
    ↓
Task 3.x (Medium Priority) - Can work in parallel
    ↓
Task 4.x (Low Priority) - Can work in parallel
```

### Team Allocation Recommendation

**Week 1-2**: Focus on Critical Priority (1-2 engineers)
- Must complete Tasks 1.1-1.4 before other work can proceed

**Week 3-6**: High Priority (3-4 engineers can work in parallel)
- Task 2.1: Component decomposition (2 engineers)
- Task 2.2-2.4: Various improvements (1-2 engineers)

**Week 7-10**: Medium Priority (2-3 engineers)
- Tasks 3.1-3.4 in parallel

**Week 11+**: Low Priority (ongoing)
- Tasks 4.1-4.4 as resources allow

---

## 🎯 Quick Wins (Can Complete in 1 Day)

These tasks provide high impact with low effort:

1. **Fix Package Dependencies** (Task 1.1) - 3-4 hours
2. **Fix Fixture Compliance** (Task 2.2) - 1-2 hours
3. **Linting Setup** (Task 3.4) - 2-4 hours

**Total**: 6-10 hours for significant improvement in code quality

---

## 📝 Task Selection Guide

### For Senior Engineers
- Start with Task 1.1 (Fix Dependencies) - blocks everything
- Lead Task 2.1 (Component Decomposition) - complex refactoring
- Own Task 2.3 (Schema Validation) - requires architectural decisions

### For Mid-Level Engineers
- Task 2.2 (Fixture Compliance) - straightforward extraction
- Task 2.4 (Utilities Split) - clear structure provided
- Task 3.1 (Test Coverage) - good learning opportunity

### For Junior Engineers
- Task 3.4 (Linting Setup) - configuration work
- Task 3.3 (Documentation) - low technical risk
- Assist with component decomposition (UI sections)

### For DevOps
- Task 1.4 (CI/CD Setup) - infrastructure
- Task 4.4 (Performance Monitoring) - observability

---

## 🔄 Progress Tracking

Update this section weekly:

### Week of 2025-10-31
- [x] Tasks document created
- [ ] Critical tasks started
- [ ] Team assigned

### Week of 2025-11-07
- [ ] Critical tasks complete
- [ ] High priority in progress
- [ ] CI/CD running

---

## 📚 References

- `COMPREHENSIVE_AUDIT_2025.md` - Full audit findings
- `AUDIT_ACTION_PLAN.md` - Immediate fixes
- `STEP_3_DECOMPOSITION_PLAN.md` - Component decomposition progress
- `HANDOFF_CHECKLIST.md` - Developer handoff guide
- `docs/COMPONENT_DECOMPOSITION_GUIDE.md` - How to decompose components
- `docs/UTILITY_SPLIT_PLAN.md` - Utilities split plan
- `reports/*.json` - Machine-readable task data

---

**Created**: 2025-10-31  
**Maintained By**: Engineering Team  
**Review Cadence**: Weekly during standup

---

## 💡 How to Use This Document

1. **Project Managers**: Use priority levels and effort estimates for sprint planning
2. **Engineers**: Pick tasks matching your skill level and interests
3. **Team Leads**: Track progress and update completion status weekly
4. **Stakeholders**: Reference summary section for high-level progress

**Next Step**: Review with team, assign owners, add to project board
