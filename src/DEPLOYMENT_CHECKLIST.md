# ✅ FlashFusion Deployment Checklist

## **Complete Pre-Deployment to Post-Launch Checklist**

---

## **Phase 1: Pre-Deployment Setup** (30 minutes)

### **1.1 Local Testing**

- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` - both apps start without errors
- [ ] Site app loads at `http://localhost:3001`
- [ ] Web app loads at `http://localhost:5173`
- [ ] No console errors in browser
- [ ] Test at least 3 major features
- [ ] Run `npm run build` - builds complete successfully
- [ ] Run `npm run typecheck` - no critical errors

### **1.2 Code Repository**

- [ ] Create GitHub repository
- [ ] Push all code to `main` branch
- [ ] Verify all files uploaded
- [ ] Check `.gitignore` excludes:
  - [ ] `node_modules/`
  - [ ] `.env.local`
  - [ ] `.env.production`
  - [ ] `dist/`
  - [ ] `.next/`
- [ ] Add README.md with project description
- [ ] Tag initial release: `git tag v1.0.0`

### **1.3 Environment Variables Preparation**

- [ ] Copy `.env.production.template` to `.env.production`
- [ ] Fill in Supabase credentials
- [ ] Get Supabase URL from dashboard
- [ ] Get Supabase anon key from dashboard
- [ ] Get Supabase service role key from dashboard
- [ ] (Optional) Get Google Analytics ID
- [ ] (Optional) Get OpenAI API key
- [ ] (Optional) Get Stripe keys
- [ ] Verify no keys are committed to Git

---

## **Phase 2: Site App Deployment** (15 minutes)

### **2.1 Vercel Project Setup**

- [ ] Login to [vercel.com](https://vercel.com)
- [ ] Click "Import Git Repository"
- [ ] Select `flashfusion-platform` repo
- [ ] Project name: `flashfusion-site`
- [ ] Framework: Next.js
- [ ] **Root Directory: `apps/site`** ← CRITICAL!
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node version: 20.x

### **2.2 Environment Variables (Site)**

Add in Vercel UI (Settings → Environment Variables):

**REQUIRED:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**OPTIONAL:**
- [ ] `NEXT_PUBLIC_GA_ID`
- [ ] `NEXT_PUBLIC_SITE_URL`

### **2.3 Site Deployment**

- [ ] Click "Deploy" button
- [ ] Wait for build (2-3 minutes)
- [ ] Build completes successfully
- [ ] No build errors in logs
- [ ] Get preview URL
- [ ] Visit preview URL

### **2.4 Site Testing**

- [ ] Home page loads correctly
- [ ] Navigation menu works
- [ ] Features page loads
- [ ] Pricing page loads
- [ ] FAQ page loads
- [ ] Contact page loads
- [ ] Demo pages load
- [ ] Sign in page loads
- [ ] Sign up page loads
- [ ] Back buttons work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SSL certificate present
- [ ] Fast load time (<3s)

---

## **Phase 3: Web App Deployment** (15 minutes)

### **3.1 Vercel Project Setup**

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import same `flashfusion-platform` repo
- [ ] Project name: `flashfusion-app`
- [ ] Framework: Vite
- [ ] **Root Directory: `apps/web`** ← DIFFERENT FROM SITE!
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 20.x

### **3.2 Environment Variables (Web)**

Add in Vercel UI:

**REQUIRED:**
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`

**OPTIONAL:**
- [ ] `VITE_OPENAI_API_KEY`
- [ ] `VITE_ANTHROPIC_API_KEY`
- [ ] `VITE_GEMINI_API_KEY`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_GA_ID`

### **3.3 Web App Deployment**

- [ ] Click "Deploy" button
- [ ] Wait for build (3-5 minutes)
- [ ] Build completes successfully
- [ ] No critical build errors
- [ ] Get preview URL
- [ ] Visit preview URL

### **3.4 Web App Testing**

- [ ] App loads without errors
- [ ] Navigation works
- [ ] Authentication system loads
- [ ] Sign in works (or shows proper UI)
- [ ] At least 1 workflow loads
- [ ] AI tools interface works
- [ ] No critical console errors
- [ ] Mobile responsive
- [ ] SSL certificate present
- [ ] Performance acceptable

---

## **Phase 4: Domain Configuration** (Optional, 1 hour)

### **4.1 Vercel Domain Setup**

**For Site (flashfusion.co):**
- [ ] Vercel → flashfusion-site → Settings → Domains
- [ ] Add domain: `flashfusion.co`
- [ ] Add domain: `www.flashfusion.co`
- [ ] Note DNS instructions

**For App (app.flashfusion.co):**
- [ ] Vercel → flashfusion-app → Settings → Domains
- [ ] Add domain: `app.flashfusion.co`
- [ ] Note DNS instructions

### **4.2 DNS Configuration**

**At your domain registrar (GoDaddy/Namecheap/etc.):**

- [ ] Login to DNS management
- [ ] Add A record: `@` → `76.76.21.21`
- [ ] Add CNAME: `www` → `cname.vercel-dns.com`
- [ ] Add CNAME: `app` → `cname.vercel-dns.com`
- [ ] Save DNS changes
- [ ] Wait 30-60 minutes for propagation

### **4.3 DNS Verification**

- [ ] Check [dnschecker.org](https://dnschecker.org) for `flashfusion.co`
- [ ] Check for `app.flashfusion.co`
- [ ] Vercel shows "Valid Configuration"
- [ ] SSL certificates issued (green checkmark)
- [ ] HTTPS enforced
- [ ] HTTP redirects to HTTPS

### **4.4 Domain Testing**

- [ ] Visit https://flashfusion.co
- [ ] Visit https://www.flashfusion.co (redirects to non-www)
- [ ] Visit https://app.flashfusion.co
- [ ] All domains load correctly
- [ ] SSL certificates valid
- [ ] No mixed content warnings

---

## **Phase 5: Supabase Backend** (10 minutes)

### **5.1 Supabase Project Status**

- [ ] Supabase project is running
- [ ] Database is accessible
- [ ] Authentication is enabled
- [ ] API is responsive
- [ ] Check project health

### **5.2 Supabase Configuration**

- [ ] Verify API URL matches env vars
- [ ] Verify anon key matches env vars
- [ ] Check RLS policies are enabled
- [ ] Verify auth providers configured
- [ ] Check CORS settings
- [ ] Verify webhook endpoints (if any)

### **5.3 Database Tables**

- [ ] `kv_store_f091804d` table exists
- [ ] User profiles table (if using auth)
- [ ] Any custom tables created
- [ ] Indexes are created
- [ ] RLS policies applied

### **5.4 Supabase Testing**

- [ ] Test database connection from site
- [ ] Test database connection from web app
- [ ] Test authentication flow
- [ ] Test data read/write
- [ ] Check Supabase logs for errors

---

## **Phase 6: Security & Performance** (20 minutes)

### **6.1 Security Headers**

- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy set
- [ ] Permissions-Policy set
- [ ] HTTPS enforced
- [ ] HSTS enabled

### **6.2 API Keys Security**

- [ ] No API keys in client-side code
- [ ] Service role key never exposed
- [ ] Public keys properly prefixed
- [ ] Environment variables in Vercel only
- [ ] No keys in Git history
- [ ] Rotate any exposed keys

### **6.3 Performance Optimization**

- [ ] Static assets cached (max-age=31536000)
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Gzip/Brotli compression enabled
- [ ] Lazy loading implemented
- [ ] Code splitting working
- [ ] Bundle size acceptable (<500KB initial)

### **6.4 Lighthouse Audit**

- [ ] Performance score >80
- [ ] Accessibility score >90
- [ ] Best Practices score >90
- [ ] SEO score >90
- [ ] Core Web Vitals passing:
  - [ ] LCP <2.5s
  - [ ] FID <100ms
  - [ ] CLS <0.1

---

## **Phase 7: Analytics & Monitoring** (15 minutes)

### **7.1 Analytics Setup**

- [ ] Google Analytics configured (if using)
- [ ] Vercel Analytics enabled
- [ ] Tracking ID in environment variables
- [ ] Test event tracking
- [ ] Verify pageviews recorded
- [ ] Check real-time reports

### **7.2 Error Tracking**

- [ ] Error boundaries in place
- [ ] Console errors monitored
- [ ] Sentry/error service configured (optional)
- [ ] Test error reporting
- [ ] Alert notifications set up

### **7.3 Performance Monitoring**

- [ ] Vercel Speed Insights enabled
- [ ] Core Web Vitals tracked
- [ ] API response times monitored
- [ ] Database query performance
- [ ] Set up alerts for issues

### **7.4 Uptime Monitoring**

- [ ] Set up uptime monitor (UptimeRobot, etc.)
- [ ] Monitor both site and app
- [ ] Configure alert email/SMS
- [ ] Test alert system
- [ ] Set check frequency (5 min)

---

## **Phase 8: Documentation** (10 minutes)

### **8.1 Update README**

- [ ] Add live site URLs
- [ ] Update deployment instructions
- [ ] Add environment variables list
- [ ] Include setup instructions
- [ ] Add contribution guidelines
- [ ] Link to documentation

### **8.2 Create Documentation**

- [ ] User guide for main features
- [ ] API documentation (if applicable)
- [ ] Troubleshooting guide
- [ ] FAQ for common issues
- [ ] Changelog/release notes

### **8.3 Internal Documentation**

- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] DNS configuration recorded
- [ ] API keys location documented
- [ ] Emergency procedures

---

## **Phase 9: Final Pre-Launch Checks** (30 minutes)

### **9.1 Functionality Testing**

**Site App:**
- [ ] All navigation links work
- [ ] Contact form submits
- [ ] Email capture works
- [ ] Demo pages functional
- [ ] Authentication redirects work
- [ ] Mobile menu works
- [ ] Footer links work

**Web App:**
- [ ] Login/signup works
- [ ] User dashboard loads
- [ ] At least 5 workflows tested
- [ ] Code generation works
- [ ] File downloads work
- [ ] API integrations work
- [ ] Error handling works

### **9.2 Cross-Browser Testing**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### **9.3 Device Testing**

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape
- [ ] 4K display

### **9.4 User Flow Testing**

- [ ] New visitor → Sign up → Onboarding
- [ ] Returning user → Login → Dashboard
- [ ] Free user → Upgrade flow
- [ ] Demo → Try feature → Sign up
- [ ] Contact form → Confirmation
- [ ] Error pages display correctly

### **9.5 SEO Verification**

- [ ] Meta titles present
- [ ] Meta descriptions present
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Sitemap.xml accessible
- [ ] Robots.txt correct
- [ ] Canonical URLs set
- [ ] Schema.org markup (optional)

---

## **Phase 10: Launch Day** (2 hours)

### **10.1 Final Preparations**

- [ ] Review all checklists above
- [ ] Backup database
- [ ] Export environment variables
- [ ] Document current state
- [ ] Prepare rollback plan
- [ ] Alert team members

### **10.2 Launch**

- [ ] Switch Vercel to production domain
- [ ] Update DNS if needed
- [ ] Test production URLs
- [ ] Monitor error logs closely
- [ ] Watch analytics for traffic
- [ ] Check server load

### **10.3 Post-Launch Monitoring (First 24 Hours)**

- [ ] Monitor error rate
- [ ] Check response times
- [ ] Watch user signups
- [ ] Monitor API usage
- [ ] Check database performance
- [ ] Review analytics data
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately

### **10.4 Communication**

- [ ] Announce launch on social media
- [ ] Email waitlist (if applicable)
- [ ] Update landing page
- [ ] Share with beta users
- [ ] Notify stakeholders
- [ ] Prepare support channels

---

## **Phase 11: Post-Launch (Week 1)**

### **11.1 Daily Checks**

- [ ] Review error logs
- [ ] Check analytics
- [ ] Monitor uptime
- [ ] Review user feedback
- [ ] Check conversion rates
- [ ] Monitor API costs

### **11.2 Performance Optimization**

- [ ] Review Lighthouse scores
- [ ] Optimize slow pages
- [ ] Reduce bundle size
- [ ] Optimize images
- [ ] Enable caching where possible
- [ ] Review database queries

### **11.3 Bug Fixes**

- [ ] Prioritize reported bugs
- [ ] Fix critical issues immediately
- [ ] Schedule minor fixes
- [ ] Test fixes thoroughly
- [ ] Deploy bug fixes
- [ ] Communicate fixes to users

### **11.4 User Feedback**

- [ ] Collect user feedback
- [ ] Survey early users
- [ ] Analyze usage patterns
- [ ] Identify pain points
- [ ] Plan improvements
- [ ] Prioritize feature requests

---

## **Continuous Deployment Setup**

### **Automatic Deployments**

- [ ] Vercel auto-deploy on push to `main`
- [ ] Preview deployments for PRs
- [ ] Notifications on build failures
- [ ] Auto-rollback on errors
- [ ] Staging environment set up

### **CI/CD Pipeline**

- [ ] GitHub Actions configured
- [ ] Automated tests run on PR
- [ ] Lint checks pass
- [ ] Type checks pass
- [ ] Build succeeds before merge

---

## **Emergency Procedures**

### **If Site Goes Down:**

1. [ ] Check Vercel status page
2. [ ] Review deployment logs
3. [ ] Check DNS configuration
4. [ ] Verify Supabase is up
5. [ ] Rollback to last working deployment
6. [ ] Notify users if extended downtime

### **If Database Issues:**

1. [ ] Check Supabase dashboard
2. [ ] Review database logs
3. [ ] Check connection limits
4. [ ] Verify credentials
5. [ ] Restore from backup if needed

### **If Build Fails:**

1. [ ] Review build logs
2. [ ] Check for syntax errors
3. [ ] Verify environment variables
4. [ ] Test build locally
5. [ ] Rollback to working commit

---

## **Success Metrics**

Track these metrics post-launch:

- [ ] Uptime: >99.9%
- [ ] Page load time: <3 seconds
- [ ] Error rate: <1%
- [ ] User signups: Track daily
- [ ] Conversion rate: Track weekly
- [ ] User retention: Track monthly
- [ ] Customer satisfaction: >4/5
- [ ] API costs: Within budget

---

## **Quick Reference**

### **URLs to Monitor:**
- Production Site: https://flashfusion.co
- Production App: https://app.flashfusion.co
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Analytics: https://analytics.google.com

### **Key Files:**
- `/vercel-site.json` - Site deployment config
- `/vercel-web.json` - App deployment config
- `/.env.production.template` - Environment variables
- `/DEPLOYMENT_QUICKSTART.md` - Step-by-step guide
- `/ENVIRONMENT_VARIABLES_SETUP.md` - Env vars guide

### **Emergency Contacts:**
- Vercel Support: https://vercel.com/help
- Supabase Support: https://supabase.com/support
- GitHub Status: https://www.githubstatus.com

---

## **Completion Status**

Mark your overall progress:

- [ ] **Phase 1:** Pre-Deployment Setup _(30 min)_
- [ ] **Phase 2:** Site App Deployment _(15 min)_
- [ ] **Phase 3:** Web App Deployment _(15 min)_
- [ ] **Phase 4:** Domain Configuration _(1 hour)_
- [ ] **Phase 5:** Supabase Backend _(10 min)_
- [ ] **Phase 6:** Security & Performance _(20 min)_
- [ ] **Phase 7:** Analytics & Monitoring _(15 min)_
- [ ] **Phase 8:** Documentation _(10 min)_
- [ ] **Phase 9:** Final Pre-Launch Checks _(30 min)_
- [ ] **Phase 10:** Launch Day _(2 hours)_
- [ ] **Phase 11:** Post-Launch Week 1 _(Ongoing)_

**Estimated Total Time:** 4-6 hours (excluding DNS propagation wait time)

---

## **🎉 Launch Celebration!**

Once all phases are complete:

- [ ] Take a screenshot of live site
- [ ] Share launch announcement
- [ ] Thank your team
- [ ] Celebrate the milestone!
- [ ] Plan next features
- [ ] Keep improving

---

**You're ready to launch FlashFusion! Good luck! 🚀**
