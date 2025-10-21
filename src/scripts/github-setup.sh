#!/bin/bash

# FlashFusion GitHub Setup Script
# This script helps automate the GitHub repository setup process

set -e  # Exit on any error

echo "🚀 FlashFusion GitHub Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_status "Git is installed"

# Check if we're in a git repository
if [ -d ".git" ]; then
    print_warning "Git repository already exists. Continuing with existing repo..."
else
    print_info "Initializing new Git repository..."
    git init
    print_status "Git repository initialized"
fi

# Get GitHub username and repository name
echo ""
echo "📝 Repository Setup"
echo "=================="
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: flashfusion-platform): " REPO_NAME
REPO_NAME=${REPO_NAME:-flashfusion-platform}

echo ""
print_info "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

# Check if .env files exist and warn about security
echo ""
echo "🔐 Security Check"
echo "================"

if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.production" ]; then
    print_warning "Environment files detected. These will be ignored by Git."
    print_info "Make sure to add your environment variables to GitHub Secrets"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - Any API keys you're using"
else
    print_info "No environment files detected."
fi

# Check for sensitive files that shouldn't be committed
echo ""
print_info "Checking for sensitive files..."

SENSITIVE_FILES=(
    "*.key"
    "*.pem" 
    "secrets/"
    "config/secrets/"
)

for pattern in "${SENSITIVE_FILES[@]}"; do
    if ls $pattern &> /dev/null; then
        print_warning "Found potential sensitive files matching: $pattern"
        print_info "Make sure these are in your .gitignore"
    fi
done

# Stage all files
echo ""
print_info "Staging files for commit..."
git add .
print_status "Files staged"

# Create initial commit if needed
if git diff --cached --quiet; then
    print_info "No changes to commit"
else
    print_info "Creating initial commit..."
    git commit -m "🚀 Initial commit: FlashFusion Platform v2.0.0

✨ Features:
- 60+ AI-powered tools across 6 categories
- Complete gamification system with XP, badges, leaderboards  
- Multi-agent orchestration dashboard
- Real-time collaboration with AI assistance
- Automated deployment to 8+ cloud platforms
- Advanced code generation and optimization
- Creator-focused toolkit for content generation
- Production-ready CI/CD automation
- Comprehensive analytics and performance monitoring
- Full authentication system with Supabase
- Mobile-optimized responsive design
- Complete brand system with FlashFusion colors

🛠️ Tech Stack:
- React 18 + TypeScript
- Tailwind CSS v4 + Motion animations
- Supabase (Database, Auth, Storage)
- 60+ AI integrations
- Multi-platform deployment ready

🎮 Gamification:
- XP progression system
- Achievement badges
- Daily flash tasks
- Community leaderboards
- Level up animations

🤖 AI Tools:
- Content generation pipeline
- Image creation suite
- Video editing automation
- Social media management
- Analytics and insights
- Monetization optimization"

    print_status "Initial commit created"
fi

# Set up remote
echo ""
print_info "Setting up GitHub remote..."
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Remove existing origin if it exists
if git remote get-url origin &> /dev/null; then
    print_warning "Removing existing origin remote"
    git remote remove origin
fi

git remote add origin $REMOTE_URL
print_status "Remote origin set to: $REMOTE_URL"

# Ensure we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_info "Switching to main branch..."
    git branch -M main
fi

# Push to GitHub
echo ""
print_info "Pushing to GitHub..."
echo "You may be prompted for GitHub authentication."
echo ""

if git push -u origin main; then
    print_status "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. You have write access to the repository"
    echo "   3. Your GitHub authentication is set up"
    echo ""
    echo "Manual push command:"
    echo "   git push -u origin main"
    exit 1
fi

# Create development branch
echo ""
print_info "Creating development branch..."
git checkout -b develop
git push -u origin develop
git checkout main
print_status "Development branch created"

# Tag initial release
echo ""
print_info "Creating initial release tag..."
git tag -a v2.0.0 -m "🚀 FlashFusion Platform v2.0.0

✨ Initial production release
🎮 Complete gamification system  
🤖 60+ AI tools across 6 categories
🚀 Multi-agent orchestration
📱 Mobile-optimized design
🔐 Full authentication system
📊 Analytics and monitoring
💻 Production-ready platform"

git push origin --tags
print_status "Release tag v2.0.0 created"

# Final success message
echo ""
echo "🎉 GitHub Setup Complete!"
echo "========================"
echo ""
print_status "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
print_status "Clone command: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "📋 Next Steps:"
echo "1. Go to your GitHub repository settings"
echo "2. Add environment variables to Secrets and Variables → Actions"
echo "3. Set up branch protection rules for main branch"
echo "4. Configure deployment (Vercel/Netlify)"
echo "5. Enable GitHub Pages for documentation (optional)"
echo "6. Set up project boards for task management"
echo ""
echo "📖 Full setup guide: ./GITHUB_SETUP_GUIDE.md"
echo ""
print_status "FlashFusion is now on GitHub! 🚀"