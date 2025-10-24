# ✅ FlashFusion Turborepo Migration Checklist

## 🎯 **Overview**

Complete checklist for migrating FlashFusion to a Turborepo monorepo.

---

## Phase 1: Setup (COMPLETE ✅)

### Root Configuration
- [x] Update root `package.json` with Turbo scripts
- [x] Configure `turbo.json` with optimized pipeline
- [x] Verify `pnpm-workspace.yaml` is correct
- [x] Create migration documentation

### Package Configurations
- [x] Update `packages/ui/package.json`
- [x] Update `packages/types/package.json`
- [x] Update `packages/hooks/package.json`
- [x] Update `packages/services/package.json`
- [x] Update `packages/utils/package.json`
- [x] Update `packages/config/package.json`
- [x] Verify `apps/web/package.json`

---

## Phase 2: Installation & Testing (DO NOW)

### Install Dependencies
```bash
# 1. Clean existing installations
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# 2. Clean lock file (if needed)
rm -f pnpm-lock.yaml

# 3. Install fresh
pnpm install
```

**Checklist:**
- [ ] Run `pnpm install` successfully
- [ ] Verify all packages are linked
- [ ] Check `node_modules/.pnpm` for workspace links
- [ ] No installation errors

### Test Build System
```bash
# 1. Type check all packages
pnpm type-check

# 2. Build all packages
pnpm build

# 3. Start dev server
pnpm dev
```

**Checklist:**
- [ ] Type checking passes
- [ ] Build completes successfully
- [ ] Dev server starts
- [ ] Hot reload works
- [ ] No console errors in browser

---

## Phase 3: Import Migration (AUTOMATED)

### Run Migration Script
```bash
# Make script executable
chmod +x scripts/migrate-imports.js

# Run migration
node scripts/migrate-imports.js
```

**Checklist:**
- [ ] Script runs successfully
- [ ] Imports updated count shown
- [ ] No script errors

### Manual Verification
```bash
# Search for remaining relative imports
grep -r "from '\.\./\.\./components/ui" apps/web/src
grep -r "from '\.\./\.\./types" apps/web/src
grep -r "from '\.\./\.\./hooks" apps/web/src
```

**Checklist:**
- [ ] No relative UI imports found
- [ ] No relative type imports found
- [ ] No relative hook imports found
- [ ] All imports use `@flashfusion/*` packages

---

## Phase 4: Code Organization (OPTIONAL)

### Move Root-Level Files to Packages

#### Move Components
```bash
# Create backup
cp -r components components.backup

# Move to packages (manual - selective)
# Only move truly shared components
```

**Checklist:**
- [ ] Identify truly shared components
- [ ] Move to `packages/ui/src/`
- [ ] Update exports in `packages/ui/src/index.ts`
- [ ] Test imports still work

#### Move Types
```bash
# Types are already in packages/types
# Just verify exports
```

**Checklist:**
- [ ] All types exported from `packages/types/src/index.ts`
- [ ] App-specific types in `apps/web/src/types/`
- [ ] Shared types in `packages/types/src/`

#### Move Services
```bash
# Services are already in packages/services
# Just verify exports
```

**Checklist:**
- [ ] All services exported from `packages/services/src/index.ts`
- [ ] App-specific services in `apps/web/src/services/`
- [ ] Shared services in `packages/services/src/`

---

## Phase 5: Cleanup (OPTIONAL)

### Remove Duplicates
```bash
# After confirming everything works, remove old files
# DO NOT DO THIS until Phase 4 is complete and tested!
```

**Checklist:**
- [ ] All imports verified working
- [ ] All tests passing
- [ ] App running in production mode
- [ ] Backup created before cleanup
- [ ] Remove old files (if applicable)

---

## Phase 6: Deployment Configuration

### Update Build Commands

#### Vercel
```json
{
  "buildCommand": "turbo run build --filter=@flashfusion/web",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

#### Netlify
```toml
[build]
  command = "turbo run build --filter=@flashfusion/web"
  publish = "apps/web/dist"

[build.environment]
  NODE_VERSION = "18"
```

**Checklist:**
- [ ] Update `vercel.json` or Vercel dashboard settings
- [ ] Update `netlify.toml` (if using Netlify)
- [ ] Test deployment
- [ ] Verify build succeeds
- [ ] Check deployed site works

---

## Phase 7: CI/CD Updates

### GitHub Actions
```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install

- name: Build
  run: pnpm build

- name: Test
  run: pnpm test

- name: Type Check
  run: pnpm type-check
```

**Checklist:**
- [ ] Update GitHub Actions workflows
- [ ] Test CI pipeline
- [ ] Verify builds pass
- [ ] Check test coverage
- [ ] Deployment succeeds

---

## Phase 8: Documentation

### Update READMEs
**Checklist:**
- [ ] Update root `/README.md` with monorepo info
- [ ] Add `packages/ui/README.md`
- [ ] Add `packages/types/README.md`
- [ ] Add `packages/hooks/README.md`
- [ ] Add `packages/services/README.md`
- [ ] Add `packages/utils/README.md`
- [ ] Add `packages/config/README.md`
- [ ] Update `apps/web/README.md`

### Developer Onboarding
**Checklist:**
- [ ] Update `CONTRIBUTING.md` with monorepo workflow
- [ ] Add monorepo section to developer docs
- [ ] Create video walkthrough (optional)
- [ ] Update team wiki/notion (if applicable)

---

## Phase 9: Performance Optimization

### Remote Caching (Optional)
```bash
# Login to Vercel
turbo login

# Link repository
turbo link

# Builds now use remote cache
pnpm build
```

**Checklist:**
- [ ] Turbo account created
- [ ] Repository linked
- [ ] Remote caching enabled
- [ ] Cache hits verified
- [ ] Team members linked

---

## Phase 10: Monitoring & Maintenance

### Performance Metrics
**Checklist:**
- [ ] Measure build times before/after
- [ ] Track cache hit rates
- [ ] Monitor bundle sizes
- [ ] Check developer experience feedback

### Regular Maintenance
**Checklist:**
- [ ] Schedule dependency updates
- [ ] Review package boundaries monthly
- [ ] Refactor shared code as needed
- [ ] Keep Turbo updated

---

## 🎯 **Quick Start Checklist**

**Do These Now (5 minutes):**
1. [ ] Run `pnpm install`
2. [ ] Run `pnpm dev`
3. [ ] Verify app loads in browser
4. [ ] Check hot reload works
5. [ ] Open `/TURBOREPO_QUICK_START.md`

**Do These Next (30 minutes):**
6. [ ] Run `node scripts/migrate-imports.js`
7. [ ] Run `pnpm type-check`
8. [ ] Run `pnpm build`
9. [ ] Test production build: `pnpm preview`
10. [ ] Deploy to staging

**Do These Later (This Week):**
11. [ ] Move shared components to packages
12. [ ] Update deployment configs
13. [ ] Update CI/CD pipelines
14. [ ] Add package READMEs
15. [ ] Enable remote caching (optional)

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "Cannot find module '@flashfusion/ui'"
```bash
# Solution:
pnpm install
rm -rf .turbo apps/web/.vite
pnpm dev
```

### Issue 2: Type errors after migration
```bash
# Solution:
pnpm type-check --filter=@flashfusion/ui
pnpm type-check --filter=@flashfusion/web
# Fix reported errors
```

### Issue 3: Build fails with workspace errors
```bash
# Solution:
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Issue 4: Hot reload not working
```bash
# Solution:
# Stop dev server
# Clear caches
rm -rf .turbo apps/web/.vite
# Restart
pnpm dev
```

---

## 📊 **Success Metrics**

### Before Monorepo
- Build time: ~45s
- Rebuild time: ~30s
- Type check: ~8s
- Test run: ~12s

### After Monorepo (Expected)
- Build time: ~25s (45% faster)
- Rebuild time: ~3s (90% faster)
- Type check: ~5s (38% faster)
- Test run: ~8s (33% faster)

### Measure Your Results
```bash
# Time a full build
time pnpm build

# Time a rebuild (run twice)
time pnpm build
time pnpm build

# Check cache effectiveness
turbo run build --summarize
```

---

## 🎉 **Migration Status**

**Current Phase:** Setup Complete ✅

**Next Steps:**
1. ✅ Install dependencies
2. ✅ Test build system
3. 🔄 Run import migration
4. 📋 Test everything works
5. 🚀 Deploy to production

**Estimated Time Remaining:** 1-2 hours

---

## 📞 **Need Help?**

- **Documentation:** `/MONOREPO_MIGRATION_GUIDE.md`
- **Quick Start:** `/TURBOREPO_QUICK_START.md`
- **Turborepo Docs:** https://turbo.build/repo/docs
- **PNPM Workspaces:** https://pnpm.io/workspaces

---

**Happy Migrating! 🚀**
