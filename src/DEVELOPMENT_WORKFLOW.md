# FlashFusion Development & Deployment Workflow

## 🚀 How to Make Changes That Reflect on Your Website

### Local Development (See Changes Immediately)

#### 1. **Start Development Server**
```bash
# Install dependencies (first time only)
npm install

# Start local development server
npm run dev
# or
npm start
```

Your local server will run at `http://localhost:5173` (Vite default) and **automatically refresh** when you make changes.

#### 2. **Make Changes to Any File**
- **Components**: Edit any `.tsx` file in `/components/`
- **Pages**: Edit files in `/components/pages/`
- **Styling**: Edit `/styles/globals.css` for global styles
- **Types**: Edit files in `/types/` for TypeScript definitions
- **Configuration**: Edit `App.tsx` for app-level changes

#### 3. **Changes Auto-Reload**
Vite provides **Hot Module Replacement (HMR)** - your browser automatically updates without full page refresh.

---

## 🌐 Deploy Changes to Live Website

Based on your file structure, you have multiple deployment options:

### Option 1: **Netlify Deployment** (Recommended)
```bash
# Build for production
npm run build

# Deploy to Netlify (if connected to Git)
git add .
git commit -m "Your change description"
git push origin main
```

**Netlify automatically deploys** when you push to your connected Git repository.

### Option 2: **Vercel Deployment**
```bash
# Install Vercel CLI (first time only)
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: **Manual Build & Deploy**
```bash
# Create production build
npm run build

# This creates a /dist folder with your built website
# Upload the /dist folder contents to your web host
```

---

## 📁 Key Files for Global Changes

### **App-Wide Changes**
- **`/App.tsx`** - Main app component, routing, global providers
- **`/styles/globals.css`** - Global styles, colors, typography, animations

### **Navigation & Layout**
- **`/components/layout/Sidebar.tsx`** - Sidebar menu items and navigation
- **`/components/layout/PageRouter.tsx`** - Page routing logic
- **`/components/layout/route-constants.ts`** - Route definitions and metadata

### **Multi-Agent Orchestration**
- **`/components/pages/MultiAgentOrchestrationPage.tsx`** - Main orchestration interface
- **`/types/multi-agent-orchestration.ts`** - Type definitions
- **`/constants/multi-agent-orchestration.ts`** - Configuration constants

---

## 🔄 Development Workflow

### **Daily Development Process:**

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Make Your Changes**
   - Edit any files you need
   - Changes appear instantly in browser at `http://localhost:5173`

4. **Test Locally**
   - Verify your changes work as expected
   - Check different pages and features

5. **Commit & Push to Deploy**
   ```bash
   git add .
   git commit -m "Add: Multi-Agent Orchestration improvements"
   git push origin main
   ```

6. **Live Site Updates**
   - **Netlify**: Auto-deploys in ~2-3 minutes
   - **Vercel**: Auto-deploys in ~1-2 minutes
   - Check your live URL to see changes

---

## 🎯 Quick Change Examples

### **Change Sidebar Menu**
Edit `/components/layout/Sidebar.tsx` lines 71-136:
```typescript
const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
      // Add new menu item here
      { id: 'my-new-page', label: 'New Feature', icon: <Star className="h-4 w-4" /> },
    ]
  },
  // ...
];
```

### **Change Global Colors**
Edit `/styles/globals.css` root variables:
```css
:root {
  --ff-primary: #FF7B00; /* Change this color */
  --ff-secondary: #00B4D8; /* Change this color */
  /* ... */
}
```

### **Add New Page**
1. Create `/components/pages/MyNewPage.tsx`
2. Add route to `/components/layout/route-constants.ts`
3. Add to `/components/layout/route-handlers.ts`
4. Add to sidebar navigation

---

## 🚨 Important Notes

### **File Watching**
- Development server watches ALL files for changes
- **TypeScript files** (`.ts`, `.tsx`) - Components, pages, hooks
- **CSS files** - Styles update instantly
- **Configuration files** - May require server restart

### **Build Errors**
If changes break the build:
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting issues  
npm run lint

# Fix and try again
npm run build
```

### **Environment Variables**
Changes to `.env` files require server restart:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 📱 Mobile Testing

Test responsive design:
```bash
# Development server accessible on network
npm run dev -- --host

# Then visit on mobile: http://YOUR_IP:5173
```

---

## 🔍 Debugging Changes

### **Browser DevTools**
- **F12** - Open developer tools
- **Console tab** - Check for JavaScript errors
- **Network tab** - Check failed requests
- **Elements tab** - Inspect CSS changes

### **VS Code Integration**
- Install "ES7+ React/Redux/React-Native snippets"
- Install "Tailwind CSS IntelliSense"
- Install "TypeScript Importer"

---

## ✅ Deployment Checklist

Before deploying major changes:

- [ ] Test locally with `npm run dev`
- [ ] Build successfully with `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Test on mobile viewport
- [ ] Check all routes work
- [ ] Verify Multi-Agent Orchestration feature

---

**Your changes will be live within 2-3 minutes of pushing to Git! 🚀**