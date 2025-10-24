#!/bin/bash

# ====================================
# FlashFusion Site Deployment Script
# ====================================
# Deploys the Next.js marketing site to Vercel
# Usage: ./deploy-site.sh [production|preview]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_DIR="apps/site"
DEPLOYMENT_ENV="${1:-preview}"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FlashFusion Site Deployment         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Validate deployment environment
if [[ "$DEPLOYMENT_ENV" != "production" && "$DEPLOYMENT_ENV" != "preview" ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'production' or 'preview'${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo -e "   Environment: ${GREEN}${DEPLOYMENT_ENV}${NC}"
echo -e "   Site Directory: ${GREEN}${SITE_DIR}${NC}"
echo -e "   Framework: ${GREEN}Next.js 15${NC}"
echo ""

# Navigate to site directory
cd "$SITE_DIR" || exit 1

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run type checking
echo -e "${BLUE}🔍 Running type check...${NC}"
npm run typecheck || {
    echo -e "${RED}❌ Type check failed!${NC}"
    exit 1
}

# Run build locally to catch errors
echo -e "${BLUE}🏗️  Building locally...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
}

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Deploy to Vercel
if [ "$DEPLOYMENT_ENV" = "production" ]; then
    echo -e "${YELLOW}🚀 Deploying to PRODUCTION...${NC}"
    echo -e "${RED}⚠️  WARNING: This will update the live site!${NC}"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 0
    fi
    
    vercel --prod --yes
else
    echo -e "${BLUE}🔍 Deploying preview...${NC}"
    vercel --yes
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Deployment Complete!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Show deployment URL
if [ "$DEPLOYMENT_ENV" = "production" ]; then
    echo -e "${GREEN}🌐 Production URL: https://flashfusion.co${NC}"
else
    echo -e "${BLUE}🔗 Preview URL will be shown above${NC}"
fi

echo ""
echo -e "${BLUE}📊 Next Steps:${NC}"
echo -e "   1. Visit the deployment URL"
echo -e "   2. Test all pages and functionality"
echo -e "   3. Check Vercel dashboard for logs"
echo -e "   4. Monitor analytics and performance"
echo ""
