# 🚀 FlashFusion: How to Make Changes That Show on Your Website

## ⚡ Quick Start (Get Changes Live in 3 Minutes)

### **Step 1: Start Local Development**
```bash
# Navigate to your project folder
cd flashfusion-platform

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```
Your local site opens at: **http://localhost:5173**

### **Step 2: Make Your Changes**
Edit any file - changes appear **instantly** in your browser:

- **Global styles**: `/styles/globals.css`
- **App-wide changes**: `/App.tsx`
- **Multi-Agent Orchestration**: `/components/pages/MultiAgentOrchestrationPage.tsx`
- **Sidebar menu**: `/components/layout/Sidebar.tsx`
- **Any component**: `/components/**/*.tsx`

### **Step 3: Deploy to Live Website**
```bash
# Save and commit your changes
git add .
git commit -m "Updated Multi-Agent Orchestration feature"
git push origin main
```

**Your live website updates automatically in 2-3 minutes!** ✨

---

## 🎯 Your Specific Setup

### **Development Server**
- **Local URL**: `http://localhost:5173`
- **Auto-reload**: ✅ Changes appear instantly
- **Hot Module Replacement**: ✅ No page refresh needed

### **Deployment**  
- **Platform**: Netlify (configured via `netlify.toml`)
- **Trigger**: Automatic on Git push to `main` branch
- **Build Command**: `npm run build`
- **Deploy Time**: ~2-3 minutes

### **Live Website**
- **URL**: Based on your repository name or custom domain
- **Updates**: Automatic after Git push

---

## 📝 Common Changes You'll Make

### **1. Multi-Agent Orchestration Updates**

**File**: `/components/pages/MultiAgentOrchestrationPage.tsx`
```typescript
// Change agent count, features, or interface
const orchestrationStats = {
  activeAgents: agents.filter(a => a.status === 'active').length,
  completedTasks: agents.reduce((sum, a) => sum + a.totalTasksCompleted, 0),
  efficiency: Math.round(agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length),
  collaborationScore: 87 // ← Change this value
};
```

### **2. Change Colors/Branding**

**File**: `/styles/globals.css`
```css
:root {
  --ff-primary: #FF7B00; /* ← Your orange brand color */
  --ff-secondary: #00B4D8; /* ← Your cyan brand color */
  --ff-accent: #E91E63; /* ← Your magenta brand color */
}
```

### **3. Add/Remove Sidebar Menu Items**

**File**: `/components/layout/Sidebar.tsx` (lines 104-113)
```typescript
{
  title: 'AI & Automation',
  items: [
    { id: 'multi-agent-orchestration', label: 'Multi-Agent Orchestration', icon: <Brain className="h-4 w-4" />, tier: 'enterprise', new: true },
    // ← Add new menu items here
  ]
}
```

### **4. Update Page Content**

**Files**: `/components/pages/*.tsx`
- Edit any page component
- Changes reflect immediately in development
- Push to deploy live

---

## 🔧 Development Commands

```bash
# Start development (most used)
npm run dev

# Build for production (test before deploy)
npm run build

# Run tests
npm test

# Check TypeScript errors
npm run type-check

# Fix code formatting
npm run lint:fix

# Preview production build locally
npm run preview
```

---

## 🌐 Git Workflow for Live Updates

### **Daily Development:**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Start development
npm run dev

# 3. Make changes (edit files)
# 4. Test locally at http://localhost:5173

# 5. Deploy to live site
git add .
git commit -m "Describe your changes"
git push origin main

# 6. Wait 2-3 minutes - live site updates automatically!
```

### **Branch-Based Development (Recommended):**
```bash
# Create feature branch
git checkout -b feature/agent-improvements

# Make changes and test
npm run dev

# Commit changes
git add .
git commit -m "Enhanced agent collaboration features"

# Push feature branch
git push origin feature/agent-improvements

# Merge to main when ready (triggers live deployment)
git checkout main
git merge feature/agent-improvements
git push origin main
```

---

## 🚨 Troubleshooting

### **Changes Not Appearing Locally?**
```bash
# Restart development server
Ctrl+C  # Stop server
npm run dev  # Start again
```

### **Live Site Not Updating?**
1. **Check Netlify Dashboard** - Look for build errors
2. **Verify Git Push** - `git status` should show "nothing to commit"
3. **Check Build** - `npm run build` should succeed locally

### **TypeScript Errors?**
```bash
# Check errors
npm run type-check

# Most common fixes:
# - Add missing type imports
# - Fix typos in component names
# - Add missing props to components
```

### **Build Failing?**
```bash
# Check what's wrong
npm run build

# Common issues:
# - Missing dependencies: npm install
# - TypeScript errors: npm run type-check
# - Linting errors: npm run lint:fix
```

---

## 📁 Key Files for Your Changes

### **Most Important Files:**
- **`/App.tsx`** - Main app, routing, global providers
- **`/styles/globals.css`** - All styling, colors, animations
- **`/components/pages/MultiAgentOrchestrationPage.tsx`** - Your main feature
- **`/components/layout/Sidebar.tsx`** - Navigation menu

### **Configuration:**
- **`/netlify.toml`** - Deployment settings
- **`/package.json`** - Dependencies and scripts
- **`/types/index.ts`** - TypeScript type definitions

### **Multi-Agent System:**
- **`/types/multi-agent-orchestration.ts`** - Type definitions
- **`/constants/multi-agent-orchestration.ts`** - Configuration
- **`/components/agents/*.tsx`** - Individual orchestration components

---

## 🎉 You're All Set!

### **Quick Recap:**
1. **`npm run dev`** - Start development, see changes instantly
2. **Edit any file** - Changes appear in browser immediately  
3. **`git push origin main`** - Deploy to live website
4. **Wait 2-3 minutes** - Live site updates automatically

### **For Multi-Agent Orchestration:**
- Edit `/components/pages/MultiAgentOrchestrationPage.tsx`
- Available in sidebar: **AI & Automation → Multi-Agent Orchestration**
- Requires Enterprise tier (configured in sidebar)

**Your development workflow is now optimized for rapid iteration! 🚀**