# 🚀 FlashFusion Deployment Commands Guide

## **Where to Run Each Command**

### 🖥️ **Local Commands (Your Computer)**
Run these in your project directory where `package.json` is located:

```bash
# Navigate to your project (if not already there)
cd /path/to/your/flashfusion-project

# Development commands
npm run dev                    # Start development server
npm run build                  # Build for production locally
npm run preview               # Preview production build locally
npm run test                  # Run tests
npm run lint                  # Check code quality
npm run ff:fix-styling        # Fix FlashFusion styling
npm run health-check          # Check app health
```

### ☁️ **CI/CD Commands (Automated)**
These run automatically in GitHub Actions or GitLab CI:

```bash
# Triggered automatically on git push
npm run build:prod            # Production build (in CI)
npm run test:prod             # Production tests (in CI)  
npm run deploy:prod           # Deploy to production (in CI)
```

### 🌐 **Deployment Commands (Where They Run)**
- **Local deployment**: Your computer → Vercel/Netlify
- **CI/CD deployment**: GitHub/GitLab servers → Vercel/Netlify
- **Manual deployment**: Your computer → Production servers

## 📋 **Complete Deployment Workflow**

### **Method 1: Automated (Recommended)**

#### **Setup Once:**
```bash
# 1. On your computer - setup the project
git clone https://github.com/yourusername/flashfusion.git
cd flashfusion
npm install
cp .env.example .env
# Edit .env with your secrets

# 2. Add secrets to GitHub/GitLab (web interface)
# See SECRETS_SETUP_GUIDE.md for details

# 3. Push to trigger automatic deployment
git add .
git commit -m "Initial setup"
git push origin main
```

#### **Daily Development:**
```bash
# On your computer
npm run dev                    # Develop locally
git add .
git commit -m "Your changes"
git push origin main          # Triggers automatic CI/CD deployment
```

### **Method 2: Manual Deployment**

#### **Local → Production:**
```bash
# On your computer
npm run build:prod            # Build locally
npm run deploy:prod           # Deploy manually
```

#### **Local → Vercel (Direct):**
```bash
# On your computer
npm install -g vercel         # Install Vercel CLI
vercel login                  # Login to Vercel
vercel --prod                 # Deploy to production
```

## 🎯 **Step-by-Step: Your First Deployment**

### **Step 1: Verify Local Setup**
```bash
# In your FlashFusion project directory
pwd                           # Should show /path/to/flashfusion
ls                           # Should show package.json, App.tsx, etc.

# Test that everything works locally
npm install                   # Install dependencies
npm run health-check         # Check project health
npm run build:prod           # Test production build
npm run preview              # Test production preview
```

### **Step 2: Setup Git Repository**
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial FlashFusion setup"

# Add GitHub remote (replace with your repo)
git remote add origin https://github.com/yourusername/flashfusion.git
git push -u origin main
```

### **Step 3: Setup Secrets**
Follow the **SECRETS_SETUP_GUIDE.md** to add secrets to GitHub/GitLab.

### **Step 4: Trigger First Deployment**
```bash
# Make a small change to trigger CI/CD
echo "# FlashFusion" > README.md
git add .
git commit -m "Trigger first deployment"
git push origin main

# Watch the deployment in GitHub Actions or GitLab CI
```

### **Step 5: Verify Deployment**
```bash
# Check if your site is live
curl https://your-domain.com/api/health

# Or visit in browser
open https://your-domain.com
```

## 🏗️ **Build Process Explained**

### **Development Build (Local)**
```bash
npm run dev
# - Starts Vite dev server
# - Hot module replacement
# - Source maps enabled
# - Runs on http://localhost:5173
```

### **Production Build (Local Testing)**
```bash
npm run build:prod
# - Creates optimized bundle in dist/
# - Minifies JavaScript/CSS
# - Optimizes assets
# - Generates source maps
# - Sets production environment variables
```

### **Production Preview (Local)**
```bash
npm run preview
# - Serves the dist/ folder
# - Simulates production environment
# - Runs on http://localhost:4173
# - Use this to test before deploying
```

### **Production Deployment (CI/CD)**
```bash
# Automated in CI/CD pipeline:
npm ci                        # Clean install
npm run build:prod           # Production build
npm run test:prod            # Run tests
vercel --prod                # Deploy to Vercel
# Health check after deployment
```

## 🌍 **Deployment Targets**

### **Vercel (Recommended)**
```bash
# Automatic (via GitHub/GitLab integration)
git push origin main → Vercel deploys automatically

# Manual deployment
npm install -g vercel
vercel login
vercel --prod

# Commands that run in CI/CD:
vercel --token $VERCEL_TOKEN --prod
```

### **Netlify**
```bash
# Automatic (via GitHub/GitLab integration)
git push origin main → Netlify deploys automatically

# Manual deployment
npm install -g netlify-cli
netlify login
netlify deploy --prod

# Commands that run in CI/CD:
netlify deploy --prod --auth $NETLIFY_AUTH_TOKEN
```

### **Custom Server**
```bash
# Build locally
npm run build:prod

# Upload dist/ folder to your server
scp -r dist/* user@your-server.com:/var/www/html/

# Or use CI/CD with SSH
ssh user@your-server.com "cd /var/www && git pull && npm run build:prod"
```

## 🔄 **Environment-Specific Deployments**

### **Development Environment**
```bash
# Local development
npm run dev                   # http://localhost:5173

# Deploy to dev environment
git push origin develop       # Triggers staging deployment
```

### **Staging Environment**
```bash
# Deploy to staging
git push origin develop       # → staging.your-domain.com
```

### **Production Environment**
```bash
# Deploy to production
git push origin main          # → your-domain.com
```

## 🚨 **Emergency Procedures**

### **Rollback Deployment**
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Git rollback
git revert HEAD
git push origin main

# Manual rollback
# 1. Find last working commit: git log --oneline
# 2. Reset to that commit: git reset --hard [commit-hash]
# 3. Force push: git push --force origin main
```

### **Quick Fix Deployment**
```bash
# Make urgent fix
git add .
git commit -m "HOTFIX: Critical bug fix"
git push origin main          # Deploys immediately via CI/CD

# Or manual quick deploy
npm run build:prod
vercel --prod                 # Direct deployment
```

### **Check Deployment Status**
```bash
# Health check
curl https://your-domain.com/api/health

# Detailed status
npm run health-check

# Check CI/CD status
# GitHub: Check Actions tab
# GitLab: Check CI/CD > Pipelines
# Vercel: Check dashboard
```

## 🔧 **Troubleshooting Deployments**

### **Build Fails Locally**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .cache
npm install
npm run build:prod

# Check for errors
npm run lint
npm run type-check
npm run test
```

### **Build Fails in CI/CD**
```bash
# Check the CI/CD logs for specific errors
# Common issues:
# - Missing environment variables
# - Node.js version mismatch
# - Dependency conflicts
# - TypeScript errors
```

### **Deployment Succeeds but Site Doesn't Work**
```bash
# Check browser console for errors
# Check network tab for failed requests
# Verify environment variables are set
# Check API endpoints are accessible
```

### **Site is Slow**
```bash
# Check build size
du -sh dist/*

# Run performance test
npm run performance:test

# Check for large dependencies
npm run build:prod -- --analyze
```

## 📊 **Monitoring Deployments**

### **Health Monitoring**
```bash
# Automated health checks (in CI/CD)
curl -f https://your-domain.com/api/health

# Manual monitoring
npm run health-check
npm run performance:test
```

### **Deployment Analytics**
```bash
# Check deployment frequency
git log --oneline --since="1 week ago"

# Check deployment success rate
# View in GitHub Actions or GitLab CI dashboard

# Performance monitoring
# Set up in Vercel Analytics or Google Analytics
```

## 🎉 **You're Ready to Deploy!**

### **Quick Reference Card**
```bash
# Daily workflow
npm run dev              # Develop locally
git add . && git commit -m "Changes" && git push origin main

# Testing before deploy
npm run build:prod       # Test build
npm run health-check     # Verify health
npm run preview          # Test production locally

# Emergency commands
npm run deploy:prod      # Manual deploy
vercel rollback          # Emergency rollback
```

Now you know exactly where to run every command and how to deploy FlashFusion professionally! 🚀