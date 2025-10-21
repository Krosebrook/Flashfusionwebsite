#!/bin/bash

# FlashFusion Platform Deployment Script
# Automates deployment to Vercel and Netlify

set -e  # Exit on any error

echo "🚀 FlashFusion Platform Deployment Script"
echo "========================================"
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

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_status "Node.js and npm are installed"
}

# Run pre-deployment checks
pre_deployment_checks() {
    print_info "Running pre-deployment checks..."
    
    # Check if .env.example exists
    if [ ! -f ".env.example" ]; then
        print_warning ".env.example not found. Creating one..."
        cat > .env.example << EOF
# FlashFusion Platform Environment Variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
NODE_ENV=production
EOF
        print_status "Created .env.example template"
    fi
    
    # Check if essential files exist
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    if [ ! -f "vite.config.ts" ]; then
        print_error "vite.config.ts not found. This doesn't appear to be a Vite project."
        exit 1
    fi
    
    print_status "Essential files found"
}

# Install dependencies and build
build_project() {
    print_info "Installing dependencies and building project..."
    
    # Install dependencies
    npm install
    print_status "Dependencies installed"
    
    # Run type checking
    print_info "Running TypeScript checks..."
    npm run type-check || {
        print_error "TypeScript checks failed"
        exit 1
    }
    print_status "TypeScript checks passed"
    
    # Run tests if available
    if npm run test:run &> /dev/null; then
        print_info "Running tests..."
        npm run test:run || {
            print_error "Tests failed"
            exit 1
        }
        print_status "Tests passed"
    else
        print_warning "No tests found or test script not available"
    fi
    
    # Build the project
    print_info "Building project..."
    npm run build || {
        print_error "Build failed"
        exit 1
    }
    print_status "Project built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
        print_status "Vercel CLI installed"
    fi
    
    # Deploy to Vercel
    print_info "Starting Vercel deployment..."
    vercel --prod || {
        print_error "Vercel deployment failed"
        return 1
    }
    
    print_status "Successfully deployed to Vercel!"
    return 0
}

# Deploy to Netlify
deploy_netlify() {
    print_info "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
        print_status "Netlify CLI installed"
    fi
    
    # Deploy to Netlify
    print_info "Starting Netlify deployment..."
    netlify deploy --prod --dir=dist || {
        print_error "Netlify deployment failed"
        return 1
    }
    
    print_status "Successfully deployed to Netlify!"
    return 0
}

# Main deployment function
main() {
    echo "🎯 Choose deployment target:"
    echo "1) Vercel (recommended)"
    echo "2) Netlify"
    echo "3) Both"
    echo "4) Build only (no deployment)"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    check_dependencies
    pre_deployment_checks
    build_project
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            print_info "Deploying to both platforms..."
            if deploy_vercel; then
                print_info "Vercel deployment completed, now deploying to Netlify..."
                deploy_netlify
            else
                print_error "Vercel deployment failed, skipping Netlify"
                exit 1
            fi
            ;;
        4)
            print_status "Build completed successfully. Skipping deployment."
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 Deployment Process Complete!"
    echo "==============================="
    echo ""
    print_status "FlashFusion platform deployment finished!"
    echo ""
    print_info "Next steps:"
    echo "1. Verify your deployment is working correctly"
    echo "2. Set up monitoring and analytics"
    echo "3. Configure your custom domain (if needed)"
    echo "4. Set up GitHub branch protection rules"
    echo "5. Create your first release"
    echo ""
    print_info "Documentation: ./DEPLOYMENT_COMPLETE_GUIDE.md"
    print_info "Support: https://github.com/YOUR_USERNAME/flashfusion-platform/issues"
}

# Run the main function
main "$@"