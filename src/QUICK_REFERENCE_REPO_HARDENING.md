# ⚡ FlashFusion Repo Hardening - Quick Reference

## 📋 **5-Minute Setup**

```bash
# 1. Install all dependencies
pnpm install

# 2. Generate inventory
pnpm inventory

# 3. Test RLS (requires secrets)
export CI_SUPABASE_URL="https://your-test-project.supabase.co"
export CI_SUPABASE_ANON_KEY="your-anon-key"
pnpm -C supabase/tests/postgrest test

# 4. Run site app
pnpm -F site dev

# 5. Validate events
pnpm validate:events
```

---

## 🔑 **Required Secrets**

### **GitHub Repository Secrets**

```bash
# RLS Tests
CI_SUPABASE_URL=https://test-project.supabase.co
CI_SUPABASE_ANON_KEY=eyJ...

# Site App (Vercel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://prod.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🚀 **Common Commands**

### **Development**
```bash
# Both apps
pnpm dev

# Site only (port 3001)
pnpm -F site dev

# Web/Studio only (port 3000)
pnpm -F @flashfusion/web dev
```

### **Testing**
```bash
# RLS tests
pnpm -C supabase/tests/postgrest test

# Visual tests
pnpm -F site test

# Update snapshots
pnpm -F site test -- --update-snapshots

# All tests
pnpm test
```

### **Validation**
```bash
# Generate inventory
pnpm inventory

# Validate analytics events
pnpm validate:events

# Type check
pnpm type-check

# Lint
pnpm lint
```

### **Building**
```bash
# Build all
pnpm build

# Build site only
pnpm build --filter=site

# Build web only
pnpm build --filter=@flashfusion/web
```

---

## 📊 **CI Status Checks**

All must pass before merge:

- ✅ `security-gitleaks` - No secrets leaked
- ✅ `security-codeql` - No code vulnerabilities
- ✅ `dependency-audit` - No high/critical CVEs
- ✅ `supabase-rls` - RLS policies correct
- ✅ `validate-events` - Analytics events valid
- ✅ `site-visual` - UI unchanged (or approved)

---

## 🎯 **Key Files**

| File | Purpose |
|------|---------|
| `/docs/repo-inventory.json` | Package ownership tracker |
| `/docs/events.contract.json` | Analytics events schema |
| `.gitleaks.toml` | Secret scanning config |
| `/apps/site/` | Next.js marketing site |
| `/apps/web/` | Vite Studio app |
| `/supabase/tests/postgrest/` | RLS tests |

---

## 🐛 **Quick Fixes**

### **RLS Tests Fail**
```bash
# Check credentials
env | grep SUPABASE

# Verify Supabase project
curl $CI_SUPABASE_URL/rest/v1/ \
  -H "apikey: $CI_SUPABASE_ANON_KEY"
```

### **Events Validation Fails**
```bash
# Find unknown events
pnpm validate:events 2>&1 | grep "Unknown event"

# Add to contract
nano docs/events.contract.json

# Re-validate
pnpm validate:events
```

### **Gitleaks False Positive**
```bash
# Add to allowlist
nano .gitleaks.toml

# Test locally
gitleaks detect --config .gitleaks.toml
```

---

## 📱 **Dual-App Ports**

| App | Port | URL |
|-----|------|-----|
| **Site** (Next.js) | 3001 | http://localhost:3001 |
| **Web** (Vite) | 3000 | http://localhost:3000 |

---

## 🔐 **Security Levels**

| Data Access | Use Case | Key Type |
|-------------|----------|----------|
| **None** | Static utilities | - |
| **Anon** | Public reads | `SUPABASE_ANON_KEY` |
| **Service Role** | Server writes | `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ **NEVER** use service role key in client code!

---

## 📈 **Analytics Events**

### **Add New Event**

1. **Define:**
```json
// docs/events.contract.json
{
  "events": {
    "my_event": {
      "description": "User did something",
      "params": { "action": "string" },
      "required": ["action"]
    }
  }
}
```

2. **Validate:**
```bash
pnpm validate:events
```

3. **Use:**
```typescript
import { track } from '@/lib/track';
track('my_event', { action: 'clicked' });
```

---

## 🚢 **Deploy Site to Vercel**

1. **Import from GitHub**
2. **Root Directory:** `apps/site`
3. **Build Command:** `cd ../.. && pnpm build --filter=site`
4. **Output:** `.next`
5. **Install:** `cd ../.. && pnpm install`
6. **Add Environment Variables** (see above)
7. **Deploy!**

---

## 📞 **Get Help**

- **Full Guide:** `/REPO_HARDENING_IMPLEMENTATION_COMPLETE.md`
- **Monorepo:** `/TURBOREPO_QUICK_START.md`
- **Backend:** `/SUPABASE_STUDIO_BACKEND_DEPLOYED.md`
- **Issues:** File on GitHub with `security` label

---

## ✅ **Daily Checklist**

- [ ] `pnpm lint` before commit
- [ ] `pnpm type-check` before PR
- [ ] `pnpm validate:events` if analytics changed
- [ ] `pnpm inventory` if packages changed
- [ ] Review security alerts in GitHub
- [ ] Update snapshots if UI changed intentionally

---

**Quick Start:** `pnpm install && pnpm inventory && pnpm dev`

**Status:** ✅ Ready for Production  
**Version:** 2.0.0 (Hardened)
