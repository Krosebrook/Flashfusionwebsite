# ⚡ Quick API Setup Guide - Get FlashFusion Running in 30 Minutes

## 🎯 **Step-by-Step Setup (Essential Keys Only)**

### **Step 1: Supabase Setup (5 minutes)**
```bash
# 1. Go to https://supabase.com/dashboard
# 2. Create new project (takes 2-3 minutes to spin up)
# 3. Go to Settings → API
# 4. Copy these values:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ⚠️ Service role key goes in backend only - never in frontend!
```

### **Step 2: OpenAI Setup (3 minutes)**
```bash
# 1. Go to https://platform.openai.com/api-keys
# 2. Create new secret key
# 3. Copy the key (starts with sk-)

OPENAI_API_KEY=sk-proj-abc123...
```

### **Step 3: GitHub Token (2 minutes)**
```bash
# 1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
# 2. Generate new token (classic)
# 3. Select scopes: repo, workflow, write:packages
# 4. Copy the token

GITHUB_TOKEN=ghp_abc123...
```

### **Step 4: Sentry Setup (Optional - 5 minutes)**
```bash
# 1. Go to https://sentry.io
# 2. Create new project → React
# 3. Copy the DSN

VITE_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
```

### **Step 5: Create Your .env.local File**
```bash
# In your project root, create .env.local:
cat > .env.local << 'EOF'
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI (Required for AI features)
OPENAI_API_KEY=your_openai_key_here

# GitHub (Required for CI/CD)
GITHUB_TOKEN=your_github_token_here

# Sentry (Optional - Error monitoring)
VITE_SENTRY_DSN=your_sentry_dsn_here

# Development
NODE_ENV=development
EOF
```

### **Step 6: Test Your Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Should open at http://localhost:5173
# ✅ If it loads without errors, you're good to go!
```

---

## 🔥 **Fast Track: Get Running in 10 Minutes**

If you just want to test the app quickly:

### **Option 1: Use Demo Mode**
```bash
# Create minimal .env.local for demo
cat > .env.local << 'EOF'
# Demo mode - limited functionality
NODE_ENV=development
VITE_DEMO_MODE=true
EOF

npm run dev
```

### **Option 2: Essential Keys Only**
1. **Supabase** (2 min): Create project, copy URL + anon key
2. **OpenAI** (1 min): Get API key with $5 free credit
3. **Start app** (1 min): `npm run dev`

**Total: 4 minutes to working app!**

---

## 💡 **API Key Priorities by Feature**

### **🏠 Landing Page & Demo**
```bash
# No API keys needed - works out of the box
VITE_DEMO_MODE=true
```

### **🔧 AI Tools (60+ tools)**
```bash
# Required for AI functionality
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...  # Optional backup
```

### **👤 User Accounts & Data**
```bash
# Required for user authentication and data storage
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### **📊 Analytics & Monitoring**
```bash
# Optional but recommended for production
VITE_SENTRY_DSN=https://...
VITE_GA_MEASUREMENT_ID=G-...
```

### **💳 Payments (Premium Features)**
```bash
# Required only if monetizing
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

### **🚀 Deployment & CI/CD**
```bash
# Required for automated deployments
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=your_token  # Or Netlify
```

---

## 📋 **Checklist: Is My Setup Working?**

### **✅ Basic Functionality**
- [ ] App loads without console errors
- [ ] Landing page displays correctly
- [ ] Navigation works
- [ ] Demo features functional

### **✅ AI Features**
- [ ] AI tools page loads
- [ ] Can interact with AI tools
- [ ] Code generation works
- [ ] Image generation works (if enabled)

### **✅ User Features**
- [ ] Can sign up/sign in
- [ ] User dashboard loads
- [ ] Projects can be created
- [ ] Gamification system works

### **✅ Production Ready**
- [ ] Error monitoring working (Sentry)
- [ ] Analytics tracking (Google Analytics)
- [ ] Payment system functional (Stripe)
- [ ] Deployment pipeline works

---

## 🚨 **Troubleshooting Common Issues**

### **"Supabase connection failed"**
```bash
# Check your keys are correct
# Make sure URL doesn't have trailing slash
# Verify anon key is the public one, not service role
```

### **"OpenAI API error"**
```bash
# Check you have credits remaining
# Verify API key starts with 'sk-'
# Make sure key has proper permissions
```

### **"Build fails in production"**
```bash
# Make sure you're not importing server-only keys in frontend
# Check that all VITE_ prefixed keys are in your deployment env
```

### **"Authentication not working"**
```bash
# Verify Supabase auth is enabled
# Check redirect URLs in Supabase dashboard
# Make sure email confirmation is set correctly
```

---

## 💰 **Cost Monitoring Setup**

### **Set Spending Alerts**
1. **OpenAI**: Set monthly limit in OpenAI dashboard
2. **Supabase**: Monitor database usage
3. **Sentry**: Track error volume
4. **Stripe**: Monitor transaction fees

### **Free Tier Limits**
- **Supabase**: 50MB database, 50MB storage
- **OpenAI**: $5 free credit (first 3 months)
- **Sentry**: 5,000 errors/month
- **Vercel**: 100GB bandwidth/month

---

## 🚀 **Next Steps After Setup**

1. **Test all features** to ensure API keys work
2. **Set up monitoring** to track usage and errors
3. **Configure deployment** for your chosen platform
4. **Add additional APIs** as needed for advanced features
5. **Set up backup keys** for critical services

Your FlashFusion app should be fully functional with just the essential keys! 🎉