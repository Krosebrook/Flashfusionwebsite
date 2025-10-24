# 🚀 FlashFusion Deployment Quickstart

## **Complete deployment guide in 4 simple steps**

---

## **Prerequisites Checklist**

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Supabase project (already deployed)
- [ ] Domain (optional: flashfusion.co)
- [ ] API keys ready (minimum: Supabase credentials)

---

## **Step 1: Push to GitHub** (5 minutes)

### **Option A: Using Git CLI**

```bash
# Initialize repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial FlashFusion platform commit"

# Create GitHub repository at github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/flashfusion-platform.git
git branch -M main
git push -u origin main
```

### **Option B: Using GitHub Desktop**

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select your FlashFusion folder
4. Publish repository to GitHub
5. Set name: `flashfusion-platform`
6. Push all files

---

## **Step 2: Deploy Site App to Vercel** (10 minutes)

### **A. Create Vercel Project**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select: `flashfusion-platform`
4. Click "Import"

### **B. Configure Build Settings**

**Important:** You're deploying from a monorepo!

```
Project Name:       flashfusion-site
Framework:          Next.js
Root Directory:     apps/site          ← IMPORTANT!
Build Command:      npm run build
Output Directory:   .next
Install Command:    npm install
Node Version:       20.x
```

### **C. Add Environment Variables**

Click "Environment Variables" and add these **REQUIRED** variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Optional but recommended:**

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://flashfusion.co
```

### **D. Deploy!**

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. You'll get a URL: `flashfusion-site-xyz.vercel.app`

### **E. Test Your Site**

Visit the URL and test:
- [ ] Home page loads
- [ ] Features page works
- [ ] Pricing page works
- [ ] FAQ page works
- [ ] Contact form works
- [ ] Sign in/up pages work
- [ ] Demo pages work

---

## **Step 3: Deploy Web App to Vercel** (10 minutes)

### **A. Create Another Vercel Project**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import same repository: `flashfusion-platform`
3. Click "Import"

### **B. Configure Build Settings**

```
Project Name:       flashfusion-app
Framework:          Vite
Root Directory:     apps/web           ← DIFFERENT!
Build Command:      npm run build
Output Directory:   dist
Install Command:    npm install
Node Version:       20.x
```

### **C. Add Environment Variables**

**REQUIRED:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Optional (add as needed):**

```env
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### **D. Deploy!**

1. Click "Deploy"
2. Wait 3-5 minutes for build
3. You'll get a URL: `flashfusion-app-xyz.vercel.app`

### **E. Test Your App**

Visit the URL and test:
- [ ] App loads without errors
- [ ] Navigation works
- [ ] Authentication system works
- [ ] At least one workflow works
- [ ] No console errors

---

## **Step 4: Connect Custom Domain** (Optional, 1 hour)

### **A. Add Domain in Vercel**

**For Site (flashfusion.co):**

1. Go to Vercel → flashfusion-site → Settings → Domains
2. Add domains:
   - `flashfusion.co`
   - `www.flashfusion.co`

**For App (app.flashfusion.co):**

1. Go to Vercel → flashfusion-app → Settings → Domains
2. Add domain:
   - `app.flashfusion.co`

### **B. Configure DNS at Domain Registrar**

**If using GoDaddy:**

1. Login to [GoDaddy DNS Management](https://dcc.godaddy.com/domains)
2. Select `flashfusion.co`
3. Click "DNS" → "Manage DNS"

**Add these records:**

```
# Main domain
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   600

# WWW subdomain
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   600

# App subdomain
Type:  CNAME
Name:  app
Value: cname.vercel-dns.com
TTL:   600
```

### **C. Wait for DNS Propagation**

- Usually takes **30-60 minutes**
- Check status: [dnschecker.org](https://dnschecker.org)
- Vercel will auto-issue SSL certificate

### **D. Verify SSL Certificate**

1. In Vercel → Domains
2. Each domain should show: ✅ **Valid Configuration**
3. SSL certificate automatically issued
4. Force HTTPS enabled

---

## **Alternative: One-Command Deployment**

If you prefer command-line deployment:

### **Install Vercel CLI**

```bash
npm install -g vercel
```

### **Deploy Site App**

```bash
chmod +x deploy-site.sh
./deploy-site.sh preview    # For testing
./deploy-site.sh production # For live deployment
```

### **Deploy Web App**

```bash
chmod +x deploy-web.sh
./deploy-web.sh preview     # For testing
./deploy-web.sh production  # For live deployment
```

---

## **Deployment Files Reference**

Your project now includes these deployment configuration files:

```
/vercel-site.json              ← Vercel config for Site app
/vercel-web.json               ← Vercel config for Web app
/.env.production.template      ← Environment variables template
/deploy-site.sh               ← Site deployment script
/deploy-web.sh                ← Web app deployment script
/DEPLOYMENT_QUICKSTART.md     ← This file
```

---

## **Environment Variables Guide**

### **Minimum Required (Both Apps)**

```env
# Supabase (REQUIRED)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### **Recommended for Site App**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://flashfusion.co
```

### **Recommended for Web App**

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_OPENAI_API_KEY=sk-...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### **Where to Get API Keys**

| Service | Where to Get |
|---------|-------------|
| **Supabase** | https://app.supabase.com/project/_/settings/api |
| **OpenAI** | https://platform.openai.com/api-keys |
| **Anthropic** | https://console.anthropic.com/settings/keys |
| **Google Gemini** | https://makersuite.google.com/app/apikey |
| **Stripe** | https://dashboard.stripe.com/apikeys |
| **Google Analytics** | https://analytics.google.com/analytics/web/ |

---

## **Troubleshooting**

### **Build Fails**

**Error:** `Module not found`
```bash
# Solution: Install dependencies
npm install
```

**Error:** `Root directory not found`
```
# Solution: Set correct root directory in Vercel
Site app:  apps/site
Web app:   apps/web
```

### **Environment Variables Not Working**

1. Check variable names (NEXT_PUBLIC_ vs VITE_)
2. Redeploy after adding variables
3. Check Vercel → Settings → Environment Variables

### **Domain Not Working**

1. Wait 30-60 minutes for DNS propagation
2. Check DNS records at [dnschecker.org](https://dnschecker.org)
3. Verify DNS records match Vercel requirements
4. Click "Refresh" in Vercel → Domains

### **Site Loads But Features Don't Work**

1. Check browser console for errors
2. Verify Supabase keys are correct
3. Check Supabase project is running
4. Verify CORS settings in Supabase

---

## **Post-Deployment Checklist**

After deployment, verify:

### **Site App (flashfusion.co)**
- [ ] Home page loads correctly
- [ ] All navigation links work
- [ ] Contact form submits
- [ ] Sign in/up redirects work
- [ ] Demo pages load
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SSL certificate active
- [ ] Analytics tracking works

### **Web App (app.flashfusion.co)**
- [ ] App loads without errors
- [ ] Authentication works
- [ ] At least 3 workflows tested
- [ ] API calls work
- [ ] No critical console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] SSL certificate active

---

## **Continuous Deployment**

Once set up, Vercel automatically deploys on every push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys if successful
# 4. Updates live site
```

**Preview Deployments:**
- Every pull request gets a unique preview URL
- Test changes before merging to main
- Auto-deleted when PR is closed

---

## **Monitoring & Analytics**

### **Vercel Dashboard**

Monitor:
- Build logs
- Deployment status
- Performance metrics
- Error rates
- Traffic analytics

### **Enable Vercel Analytics**

In `vercel.json`:
```json
{
  "analytics": {
    "enable": true
  },
  "speedInsights": {
    "enable": true
  }
}
```

---

## **Cost Estimate**

### **Vercel Hobby (FREE)**
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ 100GB bandwidth/month
- ✅ SSL certificates
- ❌ No commercial use

### **Vercel Pro ($20/month)**
- ✅ Everything in Hobby
- ✅ Commercial use
- ✅ Team collaboration
- ✅ Advanced analytics
- ✅ 1TB bandwidth/month
- ✅ Password protection
- ✅ Priority support

**Recommended:** Start with Hobby for testing, upgrade to Pro for launch.

---

## **Quick Commands Reference**

```bash
# Local development
npm run dev              # Run both apps
cd apps/site && npm run dev    # Run site only
cd apps/web && npm run dev     # Run web app only

# Build locally
npm run build            # Build both apps
cd apps/site && npm run build  # Build site only
cd apps/web && npm run build   # Build web app only

# Deploy with Vercel CLI
vercel                   # Preview deployment
vercel --prod            # Production deployment

# Check deployment status
vercel ls                # List deployments
vercel logs [url]        # View logs
vercel domains           # List domains
```

---

## **Support & Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **Supabase Docs:** https://supabase.com/docs
- **Your Deployment Guides:**
  - `/VERCEL_MULTI_DOMAIN_SETUP.md` - Detailed multi-domain setup
  - `/DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
  - `/QUICK_START_GUIDE.md` - Quick setup guide

---

## **Summary**

### **Timeline:**
- **Step 1** (Push to GitHub): 5 minutes
- **Step 2** (Deploy Site): 10 minutes
- **Step 3** (Deploy Web App): 10 minutes
- **Step 4** (Custom Domain): 1 hour (DNS propagation)
- **Total:** ~1.5-2 hours

### **Result:**
- ✅ **Site live** at flashfusion-site-xyz.vercel.app (or flashfusion.co)
- ✅ **App live** at flashfusion-app-xyz.vercel.app (or app.flashfusion.co)
- ✅ **SSL certificates** auto-issued
- ✅ **Auto-deploy** on every git push
- ✅ **Preview deployments** for every PR

---

**Ready to deploy? Start with Step 1!** 🚀
