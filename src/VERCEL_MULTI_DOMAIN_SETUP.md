# FlashFusion Vercel Multi-Domain Deployment Guide

## Overview
Complete guide for deploying FlashFusion to Vercel with multi-subdomain architecture using GoDaddy DNS.

---

## Architecture

```
flashfusion.co           → Main landing page (marketing)
app.flashfusion.co       → Full platform application
store.flashfusion.com    → Creator commerce hub
```

---

## Prerequisites

✅ GoDaddy domain: `flashfusion.co` and `flashfusion.com`
✅ GitHub repository with FlashFusion code
✅ Vercel account (free tier supports custom domains)
✅ All environment variables ready (you have 50+ API keys configured)

---

## Step 1: Resolve "App Has Changed" Error

Before deploying, you need to sync your Figma Make changes:

1. **Refresh Figma Make** to see latest changes
2. **Review** the `OptimizationRecommendation.tsx` edits you made
3. **Download/Export** complete codebase if needed

---

## Step 2: Push to GitHub

### A. Using Figma Make's GitHub Integration

1. In Figma Make, look for "Publish to GitHub" or "Deploy" button
2. Authenticate with GitHub
3. Create repository: `flashfusion-platform`
4. Push all code

### B. Manual Method (if needed)

```bash
git init
git add .
git commit -m "Initial FlashFusion platform commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flashfusion-platform.git
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Initial Deployment

1. **Go to [vercel.com](https://vercel.com/new)**
2. **Click "Import Project"**
3. **Select your GitHub repository**: `flashfusion-platform`
4. **Configure project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables

Click "Environment Variables" and add all your secrets:

```env
# Supabase
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
GROK_API_KEY=...

# Payments
STRIPE_SECRET_API_KEY=sk_live_...
STRIPE_PUSHABLE_KEY=pk_live_...

# Other integrations (you have 50+ configured)
# Add all from your existing secrets
```

5. **Click "Deploy"**

---

## Step 4: Configure Custom Domains in Vercel

### For Main Landing Page (flashfusion.co)

1. Go to your Vercel project → **Settings** → **Domains**
2. Add domains:
   - `flashfusion.co` (primary)
   - `www.flashfusion.co` (redirect to primary)

### For App Subdomain (app.flashfusion.co)

**Option A: Same Vercel Project** (Simpler)
1. In same project, add domain: `app.flashfusion.co`
2. Configure routing in your React Router to show different content

**Option B: Separate Vercel Project** (Better separation)
1. Create new Vercel project: `flashfusion-app`
2. Add domain: `app.flashfusion.co`
3. Deploy app-specific code

### For Store Subdomain (store.flashfusion.com)

Same process:
1. Create project: `flashfusion-store`
2. Add domain: `store.flashfusion.com`

---

## Step 5: GoDaddy DNS Configuration

### Login to GoDaddy DNS Management

1. Go to [GoDaddy DNS Management](https://dcc.godaddy.com/domains)
2. Find `flashfusion.co`
3. Click "DNS" → "Manage DNS"

### DNS Records for flashfusion.co

Add these records:

#### Main Domain (Root)
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   600 seconds
```

#### WWW Subdomain
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   600 seconds
```

#### App Subdomain
```
Type:  CNAME
Name:  app
Value: cname.vercel-dns.com
TTL:   600 seconds
```

### DNS Records for flashfusion.com (Store)

Repeat for `flashfusion.com`:

```
Type:  CNAME
Name:  store
Value: cname.vercel-dns.com
TTL:   600 seconds
```

---

## Step 6: Verify Domain Configuration

### In Vercel Dashboard

1. Go to **Settings** → **Domains**
2. Each domain should show:
   - ✅ **Valid Configuration**
   - 🔒 **SSL Certificate** (auto-issued by Vercel)

### DNS Propagation

DNS changes take **5-60 minutes**. Check status:
- [https://dnschecker.org](https://dnschecker.org)
- Enter: `app.flashfusion.co`
- Should resolve to Vercel IPs

---

## Step 7: Configure React Router for Subdomains

### Update App.tsx to Handle Multi-Domain

Since you're using one Vercel project, detect subdomain:

```tsx
// In App.tsx or a routing utility
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // app.flashfusion.co → returns 'app'
  // flashfusion.co → returns null (main site)
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
};

function App() {
  const subdomain = getSubdomain();
  
  if (subdomain === 'app') {
    return <AppInterface />; // Full application
  }
  
  if (subdomain === 'store') {
    return <CreatorCommerceHub />; // Store
  }
  
  // Default: Landing page
  return <FlashFusionLandingPage />;
}
```

---

## Step 8: Test Deployment

### Health Checks

1. **Main site**: https://flashfusion.co
   - Should show landing page
   - Check SEO meta tags
   - Test navigation

2. **App subdomain**: https://app.flashfusion.co
   - Should show full application
   - Test authentication
   - Check API connections

3. **Store**: https://store.flashfusion.com
   - Creator commerce hub
   - Print-on-demand integration
   - Marketplace features

### Performance Tests

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://flashfusion.co --view

# Check bundle size
npm run build
du -h dist/
```

---

## Step 9: Enable Production Features

### Analytics

Update `vercel.json` to enable Vercel Analytics:

```json
{
  "analytics": {
    "enable": true
  }
}
```

### Speed Insights

```json
{
  "speedInsights": {
    "enable": true
  }
}
```

### Edge Functions (if needed)

For API routes at `app.flashfusion.co/api/*`:

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

---

## Step 10: Continuous Deployment

### Automatic Deployments

Vercel auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Update feature X"
git push origin main
# Vercel automatically deploys
```

### Preview Deployments

Every pull request gets a preview URL:
- `flashfusion-git-feature-branch.vercel.app`

### Production Branches

Configure in Vercel:
- **Production branch**: `main`
- **Preview branches**: All others

---

## Troubleshooting

### "Domain is not configured correctly"

**Solution**: Wait 30-60 minutes for DNS propagation, then:
1. Vercel → Domains → Click "Refresh"
2. Verify GoDaddy DNS records match exactly

### SSL Certificate Issues

**Solution**: Vercel auto-issues Let's Encrypt certificates:
1. Ensure DNS is correct
2. Wait 5-10 minutes
3. Certificate auto-renews every 90 days

### Build Failures

Check Vercel deployment logs:
```bash
# Common issues:
- Missing environment variables
- TypeScript errors
- Import path issues
```

**Fix**:
1. Verify all env vars are set in Vercel
2. Test build locally: `npm run build`
3. Check `tsconfig.json` paths

### 404 Errors on Refresh

**Solution**: Already handled in your `vercel.json`:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This enables client-side routing.

---

## Advanced: Multi-Project Setup

If you want **completely separate** apps:

### Structure

```
flashfusion-landing/     → flashfusion.co
flashfusion-app/         → app.flashfusion.co
flashfusion-store/       → store.flashfusion.com
flashfusion-shared/      → npm package for shared components
```

### Deploy Each Separately

1. Create 3 GitHub repos
2. Create 3 Vercel projects
3. Link each to its domain
4. Share code via npm packages or monorepo

---

## Performance Optimization

### Enable CDN Caching

Your static assets are already configured:
```json
{
  "headers": {
    "Cache-Control": "public, max-age=31536000, immutable"
  }
}
```

### Image Optimization

Use Vercel's Image Optimization:
```tsx
// Instead of:
<img src="/image.png" />

// Use:
<Image src="/image.png" width={500} height={300} />
```

### Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

---

## Monitoring

### Vercel Analytics Dashboard

Monitor:
- Page views
- Unique visitors
- Performance metrics
- Error rates

### Custom Analytics

Your FlashFusion platform already has:
- `AnalyticsService.ts`
- `ProductionAnalytics.tsx`
- Performance monitoring

---

## Security

### HTTPS Enforcement

Vercel auto-enforces HTTPS. Your `vercel.json` includes:
```json
{
  "headers": [
    { "X-Content-Type-Options": "nosniff" },
    { "X-Frame-Options": "DENY" },
    { "X-XSS-Protection": "1; mode=block" }
  ]
}
```

### Environment Variables

✅ **Never** commit `.env` files
✅ Use Vercel Environment Variables UI
✅ Separate variables for Preview vs Production

---

## Cost Estimation

### Vercel Pricing for FlashFusion

**Pro Plan** ($20/month recommended):
- ✅ Unlimited domains
- ✅ Commercial use
- ✅ Advanced analytics
- ✅ Team collaboration
- ✅ 100GB bandwidth
- ✅ Password protection
- ✅ Edge functions

**Hobby Plan** (FREE for testing):
- ✅ 100GB bandwidth
- ✅ Custom domains (unlimited)
- ❌ No commercial use
- ❌ Limited team features

---

## Next Steps After Deployment

1. ✅ **Test all workflows** from `COMPLETE_USER_WORKFLOWS_AND_DELIVERABLES.md`
2. ✅ **Configure monitoring** alerts
3. ✅ **Set up error tracking** (Sentry integration)
4. ✅ **Enable Vercel Analytics**
5. ✅ **Run performance audits**
6. ✅ **Set up status page** (status.flashfusion.co)
7. ✅ **Configure email** (SendGrid/Resend for transactional emails)
8. ✅ **Launch marketing campaigns**

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **GoDaddy DNS Guide**: https://www.godaddy.com/help/add-a-cname-record-19236
- **Your Platform Docs**: `/docs/DEPLOYMENT_GUIDE.md`

---

## Quick Reference Commands

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (alternative)
npx vercel --prod

# Check deployment status
npx vercel ls

# View deployment logs
npx vercel logs [deployment-url]
```

---

## Summary Checklist

- [ ] Resolve Figma Make "App has changed" error
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository to Vercel
- [ ] Configure environment variables (50+ secrets)
- [ ] Add custom domains in Vercel
- [ ] Configure GoDaddy DNS records
- [ ] Wait for DNS propagation (30-60 min)
- [ ] Verify SSL certificates
- [ ] Test all subdomains
- [ ] Run performance audits
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring
- [ ] Launch! 🚀

---

**Deployment Timeline**: 2-4 hours (including DNS propagation wait time)

**Status**: Ready to deploy once GitHub sync is complete
