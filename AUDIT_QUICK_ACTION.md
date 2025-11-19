# Quick Action Guide - High-Level Audit
**Date**: 2025-11-19  
**Status**: 🔴 CRITICAL ACTIONS REQUIRED

---

## 🚨 CRITICAL: Fix These NOW (Next 30 Minutes)

### 1. Remove Invalid Dependencies

**File**: `package.json`

**Remove these 6 lines** from the `dependencies` section:

```json
"child_process": "*",    // Line 52 - DELETE
"fs": "*",               // Line 61 - DELETE
"node:fs": "*",          // Line 70 - DELETE
"node:path": "*",        // Line 71 - DELETE
"path": "*",             // Line 72 - DELETE
"url": "*",              // Line 84 - DELETE
```

**Why**: These are Node.js built-in modules and should NOT be in package.json. They are causing `npm install` to fail.

**Test**:
```bash
npm install
# or
pnpm install
```

---

## ⚠️ HIGH PRIORITY: Fix These Next (2-3 Hours)

### 2. Pin Wildcard Dependencies

**Problem**: 46 dependencies use `"*"` (any version)

**Action**: After fixing #1, update package.json to pin versions.

**Example changes**:
```json
// BEFORE
"tailwindcss": "*",
"vitest": "*",
"zod": "*"

// AFTER (use actual versions from lock file)
"tailwindcss": "^3.4.0",
"vitest": "^1.0.0",
"zod": "^3.22.0"
```

**How to find versions**:
1. Install dependencies (after fixing #1)
2. Check `pnpm-lock.yaml` for resolved versions
3. Update package.json with those versions

---

### 3. Add Essential npm Scripts

**File**: `package.json`

**Add to `scripts` section**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    
    // Add these:
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "validate": "npm run type-check && npm run lint && npm run test"
  }
}
```

---

## 🔒 SECURITY: Run After Fixing Dependencies

### 4. Security Audit

```bash
# After fixing invalid dependencies
npm audit

# Review the output
# Fix critical and high severity issues
npm audit fix

# If there are breaking changes
npm audit fix --force  # Use with caution
```

---

## 🤖 AUTOMATION: Set Up CI/CD (1-2 Hours)

### 5. Create GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test
    
    - name: Build
      run: npm run build
    
    - name: Security audit
      run: npm audit --audit-level=high
```

---

## 📋 Checklist

### Immediate (Do Now)
- [ ] Remove 6 invalid Node.js dependencies from package.json
- [ ] Test that `npm install` or `pnpm install` works
- [ ] Commit changes

### High Priority (Today)
- [ ] Pin all 46 wildcard dependencies
- [ ] Add essential npm scripts
- [ ] Run `npm audit` and review findings
- [ ] Test all scripts work

### This Week
- [ ] Create GitHub Actions CI workflow
- [ ] Fix critical security vulnerabilities
- [ ] Configure Dependabot for automated updates
- [ ] Document changes

---

## ⏱️ Time Estimates

| Task | Time | Priority |
|------|------|----------|
| Remove invalid dependencies | 5 min | 🔴 CRITICAL |
| Test install works | 5 min | 🔴 CRITICAL |
| Pin wildcard dependencies | 2-3 hrs | 🟠 HIGH |
| Add npm scripts | 15 min | 🟠 HIGH |
| Run security audit | 30 min | 🟠 HIGH |
| Set up CI/CD | 1-2 hrs | 🟡 MEDIUM |
| **TOTAL** | **4-6 hrs** | |

---

## 🆘 If You Get Stuck

### Can't install dependencies?
- Make sure you removed all 6 invalid dependencies
- Try `npm install --legacy-peer-deps`
- Try `pnpm install --force`

### Security audit shows too many issues?
- Focus on critical and high severity only
- Check if issues are in dev dependencies (lower risk)
- Update major dependencies carefully

### CI/CD workflow fails?
- Check that all scripts exist in package.json
- Verify that tests pass locally first
- Check GitHub Actions logs for specific errors

---

## 📚 Full Details

For comprehensive analysis, see:
- **HIGH_LEVEL_AUDIT_2025.md** - Complete audit report
- **COMPREHENSIVE_AUDIT_2025.md** - Previous audit details
- **AUDIT_ACTION_PLAN.md** - Previous action plan

---

## 🎯 Success Criteria

You're done with critical fixes when:
- [x] `npm install` or `pnpm install` works without errors
- [x] `npm run build` completes successfully
- [x] No critical security vulnerabilities
- [x] CI/CD pipeline is running

---

**Last Updated**: 2025-11-19  
**Next Review**: After completing critical fixes
