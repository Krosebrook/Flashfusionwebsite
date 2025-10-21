# 🖥️ Local Development Setup Guide

## Prerequisites

### Required Software
1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Verify Installation
```bash
# Check versions
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
# If you haven't created a GitHub repo yet
git clone https://github.com/yourusername/flashfusion.git
cd flashfusion

# OR if starting fresh
git init
git remote add origin https://github.com/yourusername/flashfusion.git
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# OR if you prefer yarn
yarn install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your actual values
code .env  # Opens in VS Code
```

### 4. Start Development Server
```bash
# Start the development server
npm run dev

# Server will start at http://localhost:5173
```

## 🔧 Available Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run test             # Run tests
npm run type-check       # Check TypeScript types
```

### FlashFusion Specific
```bash
npm run ff:fix-styling       # Auto-fix FlashFusion styling
npm run ff:validate-styling  # Check styling compliance
npm run health-check         # Check app health
npm run performance:test     # Test performance
npm run security:scan        # Security scan
```

### Production
```bash
npm run build:prod       # Production build
npm run test:prod        # Production tests
npm run deploy:prod      # Deploy to production
npm run setup:prod       # Complete production setup
```

## 📁 Important File Locations

### Configuration Files
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (create from .env.example)
- `vercel.json` - Deployment configuration

### Main Application Files
- `App.tsx` - Main application component
- `main.tsx` - Application entry point
- `index.html` - HTML template

### Styling
- `styles/globals.css` - Global styles and FlashFusion design system
- `components/ui/` - UI components

### Development Tools
- `scripts/` - Utility scripts
- `.github/workflows/` - GitHub Actions (will be created)
- `.gitlab-ci.yml` - GitLab CI (will be created)

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# If port 5173 is busy, use a different port
npm run dev -- --port 3000
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Fix common issues
npm run lint:fix
```

#### Environment Variables Not Loading
```bash
# Make sure .env file exists and has correct format
ls -la .env
cat .env
```

### Getting Help
- Check the console for error messages
- Look at the browser developer tools
- Check the terminal where you ran `npm run dev`
- Review the troubleshooting docs: `DEVELOPMENT_TROUBLESHOOTING.md`

## 🎯 Next Steps

After local setup is working:
1. [Set up GitHub repository](#github-setup)
2. [Configure CI/CD pipelines](#cicd-setup)
3. [Set up production deployment](#production-deployment)
4. [Configure monitoring and analytics](#monitoring-setup)

## 📝 Development Workflow

### Daily Development
1. Pull latest changes: `git pull origin main`
2. Start dev server: `npm run dev`
3. Make changes to your code
4. Test changes: `npm run test`
5. Check styling: `npm run ff:validate-styling`
6. Commit changes: `git add . && git commit -m "Your message"`
7. Push changes: `git push origin main`

### Before Deploying
1. Run production build: `npm run build:prod`
2. Test production build: `npm run preview`
3. Run health check: `npm run health-check`
4. Deploy: `npm run deploy:prod`

## 🛠️ VS Code Setup (Recommended)

### Required Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*=\\s*{([^}]*)", "'([^']*)'"],
    ["className\\s*=\\s*\"([^\"]*)\"", "([^\"\\s]+)"]
  ]
}
```

This guide gets you started with local development. Next, let's set up the full CI/CD pipeline!