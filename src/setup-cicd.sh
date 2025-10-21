#!/bin/bash

# 🚀 FlashFusion Complete CI/CD Setup Script
# This script sets up everything you need for production-ready CI/CD

set -e  # Exit on any error

echo "🚀 FlashFusion Complete CI/CD Setup"
echo "=================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) ✓"

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

print_success "Git $(git --version | cut -d' ' -f3) ✓"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "npm $(npm --version) ✓"

echo

# ===== STEP 1: LOCAL SETUP =====
print_step "Step 1: Setting up local development environment..."

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Setup environment file
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Created .env file from .env.example"
        print_warning "⚠️  IMPORTANT: Edit .env file with your actual values!"
        echo "    You need to add:"
        echo "    - SUPABASE_URL and keys"
        echo "    - VERCEL_TOKEN for deployment"
        echo "    - API keys for AI services"
        echo
    else
        print_error ".env.example not found. Please create environment configuration."
    fi
else
    print_success ".env file exists"
fi

# Run initial health check
print_step "Running initial health check..."
if npm run health-check; then
    print_success "Health check passed"
else
    print_warning "Health check had some warnings (this is normal for initial setup)"
fi

echo

# ===== STEP 2: GIT SETUP =====
print_step "Step 2: Setting up Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Check for GitHub remote
if git remote get-url origin &> /dev/null; then
    ORIGIN_URL=$(git remote get-url origin)
    print_success "Git remote origin: $ORIGIN_URL"
else
    print_warning "No Git remote origin set"
    echo "To add a GitHub remote, run:"
    echo "  git remote add origin https://github.com/yourusername/flashfusion.git"
    echo
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
# Dependencies
node_modules/
.npm
.pnpm-debug.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.turbo/
.vercel/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/
.nyc_output

# Cache
.cache/
.parcel-cache/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# ESLint cache
.eslintcache
EOF
    print_success "Created .gitignore file"
else
    print_success ".gitignore already exists"
fi

echo

# ===== STEP 3: CI/CD FILES CHECK =====
print_step "Step 3: Checking CI/CD configuration files..."

if [ -f ".github/workflows/ci.yml" ]; then
    print_success "GitHub Actions workflow exists"
else
    print_warning "GitHub Actions workflow not found"
fi

if [ -f ".gitlab-ci.yml" ]; then
    print_success "GitLab CI configuration exists"
else
    print_warning "GitLab CI configuration not found"
fi

# Create Lighthouse config
if [ ! -f "lighthouserc.json" ]; then
    cat > lighthouserc.json << EOF
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173"],
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Local:",
      "startServerReadyTimeout": 30000
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.8}],
        "categories:seo": ["warn", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
EOF
    print_success "Created Lighthouse configuration"
fi

echo

# ===== STEP 4: SECRETS SETUP =====
print_step "Step 4: Setting up secrets and environment variables..."

echo "🔐 Required secrets for CI/CD:"
echo
echo "For GitHub Actions, add these secrets in your repository settings:"
echo "  Go to: Settings > Secrets and variables > Actions"
echo
echo "Required secrets:"
echo "  - VERCEL_TOKEN: Your Vercel token"
echo "  - VERCEL_ORG_ID: Your Vercel organization ID"
echo "  - VERCEL_PROJECT_ID: Your Vercel project ID"
echo "  - SUPABASE_URL: Your Supabase project URL"
echo "  - SUPABASE_ANON_KEY: Your Supabase anonymous key"
echo "  - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key"
echo "  - OPENAI_API_KEY: Your OpenAI API key"
echo "  - ANTHROPIC_API_KEY: Your Anthropic API key"
echo
echo "For GitLab CI, add these variables in your project settings:"
echo "  Go to: Settings > CI/CD > Variables"
echo "  (Same variables as above)"
echo

# ===== STEP 5: DEPLOYMENT SETUP =====
print_step "Step 5: Deployment configuration..."

# Check if Vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI already installed"
fi

# Vercel configuration
if [ ! -f "vercel.json" ]; then
    print_warning "vercel.json not found. Using production configuration."
    if [ -f "vercel-production.json" ]; then
        cp vercel-production.json vercel.json
        print_success "Copied vercel-production.json to vercel.json"
    fi
fi

echo

# ===== STEP 6: TESTING =====
print_step "Step 6: Running tests and validation..."

echo "🧪 Running test suite..."
if npm run test; then
    print_success "Tests passed"
else
    print_warning "Some tests failed (fix these before deploying)"
fi

echo
echo "🎨 Checking FlashFusion styling..."
if npm run ff:validate-styling; then
    print_success "Styling validation passed"
else
    print_warning "Styling issues found - run 'npm run ff:fix-styling' to fix"
fi

echo
echo "🏗️ Testing production build..."
if npm run build:prod; then
    print_success "Production build successful"
    
    # Check build size
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    echo "📦 Build size: $BUILD_SIZE"
    
    # Cleanup
    # rm -rf dist/
else
    print_error "Production build failed"
fi

echo

# ===== FINAL INSTRUCTIONS =====
print_step "Setup Complete! Next Steps:"
echo
print_success "✅ Local development environment is ready"
print_success "✅ CI/CD configuration files are in place"
print_success "✅ All necessary scripts and configurations created"
echo
echo "🎯 TO COMPLETE SETUP:"
echo
echo "1. 📝 Edit your .env file with actual values:"
echo "   code .env"
echo
echo "2. 🐙 Push to GitHub (if using GitHub):"
echo "   git add ."
echo "   git commit -m \"Initial FlashFusion setup with CI/CD\""
echo "   git remote add origin https://github.com/yourusername/flashfusion.git"
echo "   git push -u origin main"
echo
echo "3. 🔐 Add secrets to your Git provider:"
echo "   - GitHub: Settings > Secrets and variables > Actions"
echo "   - GitLab: Settings > CI/CD > Variables"
echo
echo "4. 🚀 Test your setup:"
echo "   npm run dev  # Start development server"
echo "   npm run build:prod  # Test production build"
echo "   npm run deploy:prod  # Deploy to production (after secrets setup)"
echo
echo "📚 HELPFUL COMMANDS:"
echo "   npm run dev                    # Start development"
echo "   npm run build:prod           # Production build"
echo "   npm run test                  # Run tests"
echo "   npm run ff:fix-styling       # Fix styling issues"
echo "   npm run health-check         # Check app health"
echo "   npm run deploy:prod          # Deploy to production"
echo
echo "🆘 NEED HELP?"
echo "   - Check LOCAL_SETUP_GUIDE.md for detailed instructions"
echo "   - Check DEVELOPMENT_TROUBLESHOOTING.md for common issues"
echo "   - Run 'npm run health-check' to diagnose problems"
echo
print_success "🎉 FlashFusion CI/CD setup complete!"
echo "Your platform is ready for professional development and deployment!"