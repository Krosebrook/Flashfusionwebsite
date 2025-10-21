#!/bin/bash

# FlashFusion Production Build Script
echo "🚀 Starting FlashFusion Production Build..."

# Set production environment
export NODE_ENV=production
export FF_ENVIRONMENT=production
export FF_VERSION=1.0.0
export FF_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist build .cache

# Install dependencies
echo "📦 Installing production dependencies..."
npm ci --production

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run linting
echo "✨ Running ESLint..."
npx eslint . --ext .ts,.tsx --fix

# Build the application
echo "🏗️ Building FlashFusion for production..."
npm run build

# Run production tests
echo "🧪 Running production tests..."
npm run test:prod

# Verify build integrity
echo "✅ Verifying build integrity..."
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size analysis:"
    du -sh dist/*
else
    echo "❌ Build failed!"
    exit 1
fi

# Generate sitemap
echo "🗺️ Generating sitemap..."
npm run generate:sitemap

# Security scan
echo "🔒 Running security scan..."
npm audit --audit-level moderate

echo "🎉 FlashFusion is ready for production deployment!"
echo "🌐 Deploy command: npm run deploy:prod"