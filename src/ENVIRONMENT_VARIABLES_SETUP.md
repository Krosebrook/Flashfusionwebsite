# 🔐 Environment Variables Setup Guide

## **Quick Reference: What You Need**

### **Minimum to Get Started (REQUIRED)**

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**That's it!** Everything else is optional.

---

## **Where to Add Environment Variables**

### **Option 1: Vercel UI (Recommended)**

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add variables one by one
4. Select environments: Production, Preview, Development
5. Click "Save"

### **Option 2: Vercel CLI**

```bash
vercel env add SUPABASE_URL
# Paste value when prompted
# Select: Production, Preview, Development
```

### **Option 3: `.env.local` (Local Development)**

```bash
# Create file
cp .env.production.template .env.local

# Edit with your values
nano .env.local

# NEVER commit this file!
```

---

## **Complete Environment Variables List**

### **1. Supabase (REQUIRED)** ✅

```env
# Get from: https://app.supabase.com/project/_/settings/api

# For Next.js Site App
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For Vite Web App
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key
5. Copy "service_role" key (keep secret!)

---

### **2. OpenAI (Optional)** 🤖

```env
OPENAI_API_KEY=sk-...
VITE_OPENAI_API_KEY=sk-...
```

**How to get:**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy immediately (can't view again)

**Cost:** Pay-as-you-go, ~$0.002 per request

---

### **3. Anthropic Claude (Optional)** 🤖

```env
ANTHROPIC_API_KEY=sk-ant-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**How to get:**
1. Go to [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create new API key
3. Copy key

**Cost:** Pay-as-you-go, similar to OpenAI

---

### **4. Google Gemini (Optional)** 🤖

```env
GEMINI_API_KEY=AIza...
VITE_GEMINI_API_KEY=AIza...
```

**How to get:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy key

**Cost:** Free tier available, then pay-as-you-go

---

### **5. Stripe (Optional - For Payments)** 💳

```env
STRIPE_SECRET_API_KEY=sk_live_... # or sk_test_... for testing
STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy "Publishable key" (safe to expose)
3. Copy "Secret key" (keep secret!)
4. For webhook secret: Developers → Webhooks → Add endpoint

**Cost:** Free to set up, 2.9% + $0.30 per transaction

---

### **6. Google Analytics (Optional)** 📊

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
VITE_GA_ID=G-XXXXXXXXXX
```

**How to get:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create property
3. Get Measurement ID (starts with G-)

**Cost:** Free

---

### **7. GitHub OAuth (Optional - For Sign in with GitHub)** 🐙

```env
GITHUB_OAUTH_CLIENT_ID=Iv1...
GITHUB_OAUTH_CLIENT_SECRET=...
NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=Iv1...
VITE_GITHUB_OAUTH_CLIENT_ID=Iv1...
```

**How to get:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Set callback URL: `https://your-site.com/api/auth/callback/github`
4. Copy Client ID and generate Client Secret

**Cost:** Free

---

### **8. Additional Optional Services**

#### **ElevenLabs (Text-to-Speech)**
```env
ELEVENLABS_API_KEY=...
VITE_ELEVENLABS_API_KEY=...
```
Get from: [elevenlabs.io](https://elevenlabs.io)

#### **Notion API**
```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```
Get from: [notion.so/my-integrations](https://www.notion.so/my-integrations)

#### **Printify (Print-on-Demand)**
```env
PRINTIFY_API_KEY=...
VITE_PRINTIFY_API_KEY=...
```
Get from: [printify.com/app/account/api](https://printify.com/app/account/api)

---

## **How to Add Variables in Different Platforms**

### **Vercel**

```bash
# Using CLI
vercel env add VARIABLE_NAME

# Or in UI
Vercel Dashboard → Project → Settings → Environment Variables
```

### **Netlify**

```bash
# Using CLI
netlify env:set VARIABLE_NAME "value"

# Or in UI
Netlify Dashboard → Site → Site settings → Environment variables
```

### **Render**

```bash
# In UI only
Render Dashboard → Service → Environment → Add Environment Variable
```

---

## **Variable Naming Conventions**

### **For Next.js (Site App):**
- **Public (exposed to browser):** `NEXT_PUBLIC_*`
- **Private (server only):** No prefix

```env
✅ NEXT_PUBLIC_SUPABASE_URL       # Can use in browser
✅ NEXT_PUBLIC_GA_ID               # Can use in browser
❌ SUPABASE_SERVICE_ROLE_KEY      # Server only, NEVER expose!
```

### **For Vite (Web App):**
- **Public (exposed to browser):** `VITE_*`
- **Private:** Not supported in Vite (use API routes)

```env
✅ VITE_SUPABASE_URL              # Can use in browser
✅ VITE_OPENAI_API_KEY            # Can use in browser (be careful!)
```

---

## **Security Best Practices**

### **✅ DO:**
- Use `NEXT_PUBLIC_` or `VITE_` for public keys only
- Keep `SERVICE_ROLE_KEY` and `SECRET_KEY` server-side only
- Rotate API keys regularly
- Use different keys for development and production
- Store keys in Vercel/Netlify environment UI

### **❌ DON'T:**
- Commit `.env` files to Git
- Expose service role keys to browser
- Use production keys in development
- Share API keys in screenshots or docs
- Hard-code keys in source code

---

## **Testing Environment Variables**

### **Check if variables are loaded:**

```typescript
// In Next.js
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// In Vite
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### **Verify in production:**

1. Deploy to Vercel
2. Open browser console
3. Type: `console.log(process.env)` (Next.js) or `console.log(import.meta.env)` (Vite)
4. Check if your `PUBLIC` variables are present
5. Check that `SECRET` variables are NOT present

---

## **Environment-Specific Variables**

### **Development (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_URL=http://localhost:54321
```

### **Preview/Staging**
```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-xxxxx.supabase.co
VITE_SUPABASE_URL=https://staging-xxxxx.supabase.co
```

### **Production**
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-xxxxx.supabase.co
VITE_SUPABASE_URL=https://prod-xxxxx.supabase.co
```

---

## **Quick Copy-Paste Templates**

### **Minimum Viable (Site App)**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### **Minimum Viable (Web App)**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### **Full Featured (Site App)**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=https://flashfusion.co
STRIPE_SECRET_API_KEY=
STRIPE_PUBLISHABLE_KEY=
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
```

### **Full Featured (Web App)**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
VITE_ANTHROPIC_API_KEY=
VITE_GEMINI_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_GA_ID=
```

---

## **Troubleshooting**

### **Variable not working in browser**

**Problem:** Variable is undefined in browser console

**Solution:**
1. Check variable name starts with `NEXT_PUBLIC_` or `VITE_`
2. Restart dev server after adding variables
3. Rebuild and redeploy if in production

### **Variable not working on server**

**Problem:** Variable works locally but not in production

**Solution:**
1. Check variable is added in Vercel/Netlify UI
2. Check variable is added to correct environment (Production)
3. Redeploy after adding variables

### **"Service role key exposed" error**

**Problem:** Service role key appears in browser

**Solution:**
1. Remove `NEXT_PUBLIC_` or `VITE_` prefix from secret keys
2. Never expose service role keys to client
3. Use API routes to call Supabase with service role key

---

## **Cost Breakdown**

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Supabase** | 500MB database, 2GB bandwidth | $25/month |
| **Vercel** | 100GB bandwidth | $20/month |
| **OpenAI** | $5 credit (expires) | Pay-as-you-go |
| **Anthropic** | None | Pay-as-you-go |
| **Google Gemini** | Free quota | Pay-as-you-go |
| **Stripe** | Free setup | 2.9% + $0.30/transaction |
| **Google Analytics** | Free forever | Free |
| **GitHub OAuth** | Free forever | Free |

**Total minimum cost:** $0/month (using free tiers)
**Recommended for launch:** ~$45/month (Vercel Pro + Supabase Pro)

---

## **Quick Reference Card**

```
┌─────────────────────────────────────────────────────────────┐
│                   REQUIRED VARIABLES                         │
├─────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL         ← From Supabase Dashboard  │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY    ← From Supabase Dashboard  │
│ SUPABASE_SERVICE_ROLE_KEY        ← From Supabase Dashboard  │
│                                                               │
│ VITE_SUPABASE_URL                ← Same as above            │
│ VITE_SUPABASE_ANON_KEY           ← Same as above            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RECOMMENDED VARIABLES                      │
├─────────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_GA_ID                ← Google Analytics         │
│ VITE_OPENAI_API_KEY              ← OpenAI Platform          │
│ STRIPE_SECRET_API_KEY            ← Stripe Dashboard         │
└─────────────────────────────────────────────────────────────┘
```

---

## **Next Steps**

1. ✅ Copy `.env.production.template` to `.env.local`
2. ✅ Fill in at minimum: Supabase credentials
3. ✅ Add variables to Vercel/Netlify UI
4. ✅ Test locally: `npm run dev`
5. ✅ Deploy and verify variables work in production

---

**Need help?** Check:
- `/DEPLOYMENT_QUICKSTART.md` - Complete deployment guide
- `/.env.production.template` - Full template with all variables
- `/VERCEL_MULTI_DOMAIN_SETUP.md` - Domain setup guide
