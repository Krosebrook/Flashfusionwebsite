# 🔐 Secrets & Environment Setup Guide

## Overview
This guide shows you exactly where and how to set up all the secrets and environment variables needed for FlashFusion's CI/CD pipeline.

## 🎯 Required Secrets

### **Core Secrets (Required)**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_vercel_project_id
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### **AI Services (Choose what you need)**
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### **Optional Secrets**
```
GOOGLE_ANALYTICS_ID=your_ga_id
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SENTRY_DSN=your_sentry_dsn
```

## 🐙 GitHub Secrets Setup

### **Step 1: Go to Repository Settings**
1. Go to your GitHub repository
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** in left sidebar
4. Click **"Actions"**

### **Step 2: Add Repository Secrets**
Click **"New repository secret"** and add each secret:

#### **Vercel Secrets**
```
Name: VERCEL_TOKEN
Value: [Get from https://vercel.com/account/tokens]

Name: VERCEL_ORG_ID  
Value: [Get from Vercel project settings]

Name: VERCEL_PROJECT_ID
Value: [Get from Vercel project settings]
```

#### **Supabase Secrets**
```
Name: SUPABASE_URL
Value: https://your-project.supabase.co

Name: SUPABASE_ANON_KEY
Value: [Get from Supabase project settings > API]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase project settings > API]
```

#### **AI Service Secrets**
```
Name: OPENAI_API_KEY
Value: [Get from https://platform.openai.com/api-keys]

Name: ANTHROPIC_API_KEY
Value: [Get from https://console.anthropic.com/]
```

### **Step 3: Verify Secrets**
- Go to **Actions** tab
- Click on latest workflow run
- Check that secrets are being loaded (they'll show as `***`)

## 🦊 GitLab Variables Setup

### **Step 1: Go to Project Settings**
1. Go to your GitLab project
2. Click **"Settings"** in left sidebar
3. Click **"CI/CD"**
4. Expand **"Variables"** section

### **Step 2: Add Variables**
Click **"Add variable"** and add each one:

#### **Vercel Variables**
```
Key: VERCEL_TOKEN
Value: [Your Vercel token]
Flags: ✅ Protect variable, ✅ Mask variable

Key: VERCEL_ORG_ID
Value: [Your Vercel org ID]
Flags: ✅ Protect variable

Key: VERCEL_PROJECT_ID  
Value: [Your Vercel project ID]
Flags: ✅ Protect variable
```

#### **Supabase Variables**
```
Key: SUPABASE_URL
Value: https://your-project.supabase.co
Flags: ✅ Protect variable

Key: SUPABASE_ANON_KEY
Value: [Your Supabase anon key]
Flags: ✅ Protect variable, ✅ Mask variable

Key: SUPABASE_SERVICE_ROLE_KEY
Value: [Your Supabase service role key]  
Flags: ✅ Protect variable, ✅ Mask variable
```

## 🔍 How to Get Each Secret

### **Vercel Secrets**

#### **VERCEL_TOKEN**
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create"**
3. Name it "FlashFusion CI/CD"
4. Select **"Full Account"** scope
5. Copy the token

#### **VERCEL_ORG_ID & VERCEL_PROJECT_ID**
1. Go to your Vercel project
2. Click **"Settings"**
3. Scroll down to **"General"**
4. Copy **"Project ID"** and **"Team ID"** (if you have a team)

### **Supabase Secrets**

#### **All Supabase Keys**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"Settings"** (gear icon)
4. Click **"API"**
5. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### **AI Service Keys**

#### **OpenAI API Key**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name it "FlashFusion"
4. Copy the key

#### **Anthropic API Key**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Click **"API Keys"**
3. Click **"Create Key"**
4. Name it "FlashFusion"
5. Copy the key

## 🔒 Local Development (.env)

### **Create .env File**
```bash
# Copy the example file
cp .env.example .env

# Edit with your values
code .env  # or nano .env
```

### **Example .env Content**
```bash
# === CORE CONFIG ===
NODE_ENV=development
FF_ENVIRONMENT=development
FF_DEBUG=true

# === SUPABASE ===
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# === AI SERVICES ===
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# === DEPLOYMENT ===
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here
```

## ✅ Testing Your Setup

### **Test Local Environment**
```bash
# Check if secrets are loaded
npm run health-check

# Test development server
npm run dev
```

### **Test CI/CD Pipeline**
```bash
# Commit and push to trigger pipeline
git add .
git commit -m "Test CI/CD pipeline"
git push origin main

# Check GitHub Actions or GitLab CI
```

### **Verify Deployment**
```bash
# After successful CI/CD run
curl https://your-domain.com/api/health
```

## 🚨 Security Best Practices

### **✅ DO**
- Use environment-specific secrets
- Enable "Protect variable" and "Mask variable" in GitLab
- Use different keys for staging and production
- Rotate keys regularly
- Use least-privilege access

### **❌ DON'T**
- Never commit secrets to Git
- Don't share API keys in plain text
- Don't use production keys in development
- Don't disable secret masking
- Don't use overly broad permissions

## 🔧 Troubleshooting

### **Secrets Not Working?**

#### **Check Secret Names**
```bash
# Make sure names match exactly (case-sensitive)
VERCEL_TOKEN  # ✅ Correct
vercel_token  # ❌ Wrong
Vercel_Token  # ❌ Wrong
```

#### **Check Secret Values**
```bash
# No extra spaces or characters
"sk-abc123"     # ❌ Has quotes
sk-abc123       # ✅ Correct
sk-abc123       # ❌ Has trailing space
```

#### **Check Environment**
```bash
# GitHub Actions
- name: Check secrets
  run: |
    echo "Vercel token exists: ${{ secrets.VERCEL_TOKEN != '' }}"
    
# GitLab CI
script:
  - echo "Vercel token exists: $([[ -n "$VERCEL_TOKEN" ]] && echo "true" || echo "false")"
```

### **Pipeline Failing?**

#### **Check Logs**
- GitHub: Go to Actions tab → Click failed run → Check logs
- GitLab: Go to CI/CD → Pipelines → Click failed pipeline → Check job logs

#### **Common Issues**
```bash
# Missing secret
Error: VERCEL_TOKEN is required
# → Add the secret in your Git provider

# Wrong secret value
Error: Invalid token
# → Check that the token is correct and not expired

# Network issues
Error: connect ECONNREFUSED
# → Check if the service is accessible from CI/CD runner
```

## 📞 Getting Help

### **Quick Checks**
```bash
# Test locally first
npm run health-check

# Check environment variables
node -e "console.log(process.env.VERCEL_TOKEN ? 'Token exists' : 'Token missing')"

# Test API connection
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user
```

### **Resources**
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitLab CI Variables Documentation](https://docs.gitlab.com/ee/ci/variables/)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Supabase API Documentation](https://supabase.com/docs/reference/api)

## 🎉 You're All Set!

Once you've set up all the secrets:

1. **Push to trigger CI/CD**: `git push origin main`
2. **Watch the pipeline run**: Check Actions/CI tab
3. **Verify deployment**: Visit your deployed site
4. **Monitor**: Check health endpoints

Your FlashFusion platform is now ready for professional deployment! 🚀