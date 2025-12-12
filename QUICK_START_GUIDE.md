# FlashFusion Website - Quick Start Guide

**For New Team Members** | **Updated**: 2025-11-28

---

## ⚡ First 30 Minutes

### 1. Clone and Setup

```bash
git clone https://github.com/Krosebrook/Flashfusionwebsite.git
cd Flashfusionwebsite
npm install --legacy-peer-deps
npm run dev
```

### 2. Read These First

**Priority Order** (30 mins total):
1. 📄 `README.md` - Project overview (5 mins)
2. 📄 `NEEDED_TASKS.md` - What needs to be done (10 mins)
3. 📄 `docs/ops/senior-snapshot.md` - Executive context (10 mins)
4. 📄 `docs/DEVELOPER_HANDOFF_GUIDE.md` - How to contribute (5 mins)

### 3. Understand Current State

**✅ What's Working**:
- Excellent documentation
- Clear architectural planning
- Component decomposition pattern established
- LaunchPreparationHub.tsx fully refactored (example to follow)
- Dependencies can be installed with `--legacy-peer-deps`

**🎯 Next Steps**:
- Review component architecture
- Follow established patterns
- Contribute to ongoing refactoring

---

## 🗺️ Repository Structure

```
Flashfusionwebsite/
├── src/                          # Application source code
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication
│   │   ├── demo/                 # Demo mode
│   │   ├── landing/              # Landing pages
│   │   ├── dashboard/            # Dashboard features
│   │   └── ui/                   # UI components & primitives
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # Business logic & API clients
│   ├── lib/                      # Third-party integrations
│   ├── utils/                    # Utility functions
│   ├── fixtures/                 # Mock data for development
│   └── styles/                   # Global styles & design tokens
│
├── docs/                         # Documentation
│   ├── ops/                      # Operations & planning
│   │   ├── roadmap.md            # Product roadmap
│   │   ├── senior-snapshot.md    # Executive summary
│   │   └── new-feature-rollout.md # Feature deployment guide
│   ├── api/                      # API documentation
│   ├── testing/                  # Testing guides
│   └── development/              # Development guides
│
├── tests/                        # Test suites
│   ├── unit/                     # Unit tests (Vitest)
│   └── e2e/                      # End-to-end tests (Playwright)
│
├── reports/                      # Analysis reports (JSON)
│   ├── components-decomposition.json  # Component size analysis
│   ├── utilities-split.json           # Utilities split plan
│   ├── tailwind-primitives.json       # Tailwind pattern analysis
│   └── REFACTORING_SUMMARY.json       # Overall refactoring plan
│
├── NEEDED_TASKS.md              # 👈 START HERE - What to work on
├── COMPREHENSIVE_AUDIT_2025.md  # Full audit report
├── STEP_3_DECOMPOSITION_PLAN.md # Component decomposition progress
└── package.json                  # Dependencies (needs fixing!)
```

---

## 🎯 What Should I Work On?

### If You're a...

**Senior Engineer**:
→ Start with `NEEDED_TASKS.md` Task 1.1 (Fix Dependencies)  
→ Then lead Task 2.1 (Component Decomposition)

**Mid-Level Engineer**:
→ Read `STEP_3_DECOMPOSITION_PLAN.md` to see completed example  
→ Pick a component from Task 2.1 to decompose  
→ Follow `docs/COMPONENT_DECOMPOSITION_GUIDE.md`

**Junior Engineer**:
→ Start with Task 3.4 (Linting Setup) once dependencies are fixed  
→ Help with UI section extraction in component decomposition  
→ Work on documentation improvements (Task 3.3)

**DevOps Engineer**:
→ Task 1.4 (Set up CI/CD) - after dependencies fixed  
→ Task 4.4 (Performance Monitoring) - long term

**QA Engineer**:
→ Task 3.1 (Test Coverage) - after build works  
→ Review existing tests in `tests/` directory

---

## 📋 Common Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev              # http://localhost:3000

# Production build
npm run build            # Build for production
```

---

## 🔥 Getting Started Tips

### 1. Use Legacy Peer Deps
Always install with `npm install --legacy-peer-deps` to avoid peer dependency conflicts.

### 2. Review Archived Audits
Previous audit reports are available in `archive/audits/` for historical context.

### 3. Follow Established Patterns
Study `LaunchPreparationHub.tsx` as an example of the target component architecture.

---

## 📚 Key Documentation

### Getting Started
- `README.md` - Project overview and setup
- `NEEDED_TASKS.md` - Prioritized task list
- This file - Quick orientation

### For Contributors
- `docs/DEVELOPER_HANDOFF_GUIDE.md` - How to contribute
- `docs/COMPONENT_DECOMPOSITION_GUIDE.md` - How to refactor large components
- `docs/UTILITY_SPLIT_PLAN.md` - How to split utilities
- `migration-notes.md` - Change history

### Project Planning
- `docs/ops/roadmap.md` - Product roadmap
- `docs/ops/senior-snapshot.md` - Executive summary
- `STEP_3_DECOMPOSITION_PLAN.md` - Refactoring progress

### Technical References
- `COMPREHENSIVE_AUDIT_2025.md` - Full audit report
- `AUDIT_ACTION_PLAN.md` - Immediate actions
- `reports/*.json` - Machine-readable data

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS + Custom design system
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Backend**: Supabase (in demo mode until configured)
- **UI Components**: Radix UI primitives

### Design Patterns

**Component Structure** (see LaunchPreparationHub.tsx as example):
```
ComponentName/
├── ComponentName.tsx              # Main orchestration (< 500 lines)
├── ComponentName.types.ts         # TypeScript interfaces
├── ComponentName.logic.ts         # Pure business logic
├── use{Feature}.ts                # Custom hooks for state
├── {Feature}Section.tsx           # UI sections
└── __tests__/                     # Tests
    ├── ComponentName.test.tsx
    ├── ComponentName.logic.test.ts
    └── use{Feature}.test.ts
```

**Fixtures** (centralized mock data):
```
src/fixtures/
├── launch/
│   ├── launch-preparation-fixtures.ts
│   └── launch.fixtures.ts
├── marketing/
└── ...
```

---

## 🚀 Quick Wins

Want to contribute immediately? These tasks are high-impact and low-effort:

1. **Review Dependencies** (3-4 hours)
   - Pin wildcard versions in `package.json`
   - Resolve Storybook conflicts
   - Test installation

2. **Fix Fixture Compliance** (1-2 hours)
   - Extract inline mock data
   - Move to `src/fixtures/`
   - Clean imports

3. **Setup Linting** (2-4 hours)
   - Verify ESLint/Prettier work
   - Run formatters
   - Fix any issues

**Total**: One day of work for significant improvement!

---

## ❓ FAQ

### Q: How do I install dependencies?
**A**: Use `npm install --legacy-peer-deps` to handle peer dependency conflicts.

### Q: What's the priority right now?
**A**: Check `NEEDED_TASKS.md` for current priorities.

### Q: Where do I find examples of good code?
**A**: `LaunchPreparationHub.tsx` and its decomposed files show the target architecture.

### Q: How do I know what to work on?
**A**: Check `NEEDED_TASKS.md` and pick based on your skill level.

### Q: Where is the old audit documentation?
**A**: Archived in `archive/audits/` and `archive/docs/`.

---

## 🆘 Getting Help

### Documentation
1. Check this guide first
2. Read relevant docs in `docs/`
3. Search `reports/*.json` for data
4. Review `migration-notes.md` for context

### Team
- **General questions**: Team chat/stand-up
- **Architecture decisions**: Check `COMPREHENSIVE_AUDIT_2025.md`
- **Refactoring help**: See `docs/COMPONENT_DECOMPOSITION_GUIDE.md`
- **Blocked by dependencies**: Escalate Task 1.1

### Resources
- GitHub Issues: Track bugs and features
- Pull Requests: Code review process
- Documentation: `docs/` directory
- Analysis Reports: `reports/` directory

---

## ✅ Onboarding Checklist

**Day 1**:
- [ ] Clone repository
- [ ] Read this guide
- [ ] Read `README.md`
- [ ] Read `NEEDED_TASKS.md`
- [ ] Understand current blockers
- [ ] Join team chat/meetings

**Week 1**:
- [ ] Review `docs/ops/senior-snapshot.md`
- [ ] Read `COMPREHENSIVE_AUDIT_2025.md`
- [ ] Study `LaunchPreparationHub.tsx` decomposition
- [ ] Pick first task from `NEEDED_TASKS.md`
- [ ] Set up development environment (if dependencies fixed)

**Week 2**:
- [ ] Complete first task
- [ ] Submit first PR
- [ ] Get code review
- [ ] Contribute to team planning

---

## 🎓 Learning Path

### Beginner Track
1. Read all documentation
2. Study completed refactoring (LaunchPreparationHub)
3. Work on Task 3.4 (Linting)
4. Help with fixture extraction
5. Assist with UI section components

### Intermediate Track
1. Understand architecture
2. Study decomposition guides
3. Pick a medium component to refactor
4. Add test coverage
5. Review others' PRs

### Advanced Track
1. Lead dependency resolution (Task 1.1)
2. Design component decomposition strategy
3. Architect schema validation fixes
4. Mentor junior developers
5. Make architectural decisions

---

**Welcome to the FlashFusion team!** 🚀

Start with the "First 30 Minutes" section above, then dive into `NEEDED_TASKS.md` to find your first contribution.

**Questions?** Ask in team chat or check the FAQ above.

---

**Last Updated**: 2025-11-27  
**Maintained By**: Engineering Team  
**Feedback**: Submit PR or create issue
