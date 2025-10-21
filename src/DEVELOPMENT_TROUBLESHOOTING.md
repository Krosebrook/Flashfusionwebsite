# 🛠️ FlashFusion Development Troubleshooting

## 🚨 Configuration Warnings Fix

### **Issue: "No Supabase configuration found" warnings**

If you're seeing:
```
⚠️ Configuration notes: [
  "No Supabase configuration found - create .env.local with VITE_SUPABASE_* variables"
]
```

### **Quick Fix (30 seconds):**

```bash
# Test your environment setup
npm run test:env

# If missing, create environment file
npm run setup

# Start development
npm run dev
```

### **Manual Fix:**

1. **Create .env.local file:**
```bash
cp .env.example .env.local
```

2. **Edit .env.local with demo values:**
```bash
# Required for development
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-for-development
NODE_ENV=development
```

3. **Restart development server:**
```bash
npm run dev
```

---

## 🔍 **Debugging Tools**

### **1. Environment Test Script**
```bash
npm run test:env
```
Shows you exactly what environment variables are loaded and their values.

### **2. In-App Debug Panel**
When you run `npm run dev`, look for a **"🔧 Config Debug"** button in the bottom-right corner of your app. Click it to see:
- Current configuration values
- Environment variable status
- Validation results

### **3. Browser Console**
Check your browser's developer console for configuration messages:
- ✅ `"Using demo configuration for development - this is perfectly fine!"`
- ❌ `"Configuration notes: [...]"`

---

## 📋 **Common Issues & Solutions**

### **Issue: Environment variables not loading**

**Solution 1: Check file location**
```bash
# Make sure .env.local is in the root directory
ls -la .env.local
# Should show: .env.local file in your project root
```

**Solution 2: Check VITE_ prefix**
```bash
# ✅ Correct format in .env.local
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-for-development

# ❌ Wrong format (missing VITE_)
SUPABASE_URL=https://demo.supabase.co
SUPABASE_ANON_KEY=demo-anon-key-for-development
```

**Solution 3: Restart development server**
```bash
# Stop server (Ctrl+C) and restart
npm run dev
```

### **Issue: "import.meta.env not available"**

**Cause:** Using Node.js context instead of Vite/browser context.

**Solution:** Make sure you're checking the browser console, not the terminal. Environment variables are loaded in the browser when using Vite.

### **Issue: Demo mode not detected**

**Solution:** Ensure your demo values contain the word "demo":
```bash
# ✅ These will be detected as demo mode
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-for-development

# ❌ These might not be detected as demo mode
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=fake-key
```

---

## 🎯 **Verification Checklist**

Run through this checklist to verify everything is working:

### **✅ File Structure**
- [ ] `.env.local` exists in project root
- [ ] `main.tsx` exists (React entry point)
- [ ] `vite.config.ts` exists
- [ ] `.storybook/main.ts` exists (Storybook config)

### **✅ Environment Variables**
- [ ] `VITE_SUPABASE_URL` is set with "demo" in the value
- [ ] `VITE_SUPABASE_ANON_KEY` is set with "demo" in the value
- [ ] `NODE_ENV=development` is set

### **✅ Development Server**
- [ ] `npm run dev` starts without errors
- [ ] App opens at `http://localhost:5173`
- [ ] No configuration warnings in browser console
- [ ] Config Debug panel shows correct values

### **✅ Expected Console Output**
```
🛠️ FlashFusion Development Mode
🔧 Environment Check: {
  SUPABASE_URL: '✅ Set',
  SUPABASE_ANON_KEY: '✅ Set', 
  isDemoMode: '✅ Yes'
}
✅ Using demo configuration for development - this is perfectly fine!
📝 To enable real features, update .env.local with your Supabase credentials
```

---

## 🚀 **Real API Setup (When Ready)**

To switch from demo to real APIs:

### **1. Supabase Setup**
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Project Settings > API
4. Copy URL and anon key
5. Update `.env.local`:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-real-anon-key-here
```

### **2. Other APIs (Optional)**
```bash
# OpenAI for AI features
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# Stripe for payments  
VITE_STRIPE_SECRET_KEY=sk_test_your-stripe-key-here
```

---

## 🆘 **Still Having Issues?**

### **1. Complete Reset**
```bash
# Remove environment file
rm .env.local

# Recreate with automation
npm run setup:dev
```

### **2. Manual Debugging**
```bash
# Check environment loading
npm run test:env

# Check build process
npm run build

# Check TypeScript
npm run type-check
```

### **3. Browser Cache Issues**
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or try incognito/private mode

---

## ✅ **Success Indicators**

You'll know everything is working when you see:

✅ **No configuration warnings in console**  
✅ **App loads without errors at localhost:5173**  
✅ **Config Debug panel shows all green checkmarks**  
✅ **Hot reload works (changes appear instantly)**  
✅ **Build completes without errors: `npm run build`**

Your FlashFusion development environment is now ready! 🎉