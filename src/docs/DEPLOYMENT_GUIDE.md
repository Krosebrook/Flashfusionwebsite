# FlashFusion Deployment Guide

Complete guide to deploying FlashFusion applications to various platforms, from simple static sites to complex full-stack applications.

## 📋 Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Platform-Specific Guides](#platform-specific-guides)
3. [Environment Configuration](#environment-configuration)
4. [CI/CD Setup](#cicd-setup)
5. [Database Deployment](#database-deployment)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Deployment Overview

### Supported Platforms

FlashFusion supports deployment to 8+ cloud platforms with one-click deployment:

| Platform | Type | Best For | Complexity |
|----------|------|----------|------------|
| **Vercel** | JAMstack/SSR | React, Next.js apps | Easy |
| **Netlify** | Static/JAMstack | Static sites, SPAs | Easy |
| **AWS** | Full Cloud | Enterprise, scalable apps | Advanced |
| **Google Cloud** | Full Cloud | AI/ML workloads | Advanced |
| **Azure** | Full Cloud | Enterprise, Microsoft stack | Advanced |
| **DigitalOcean** | VPS/Kubernetes | Flexible deployments | Medium |
| **Railway** | Container | Full-stack apps | Medium |
| **Heroku** | PaaS | Rapid prototyping | Easy |

### Deployment Types

**1. Static Site Deployment**
- Pre-built HTML, CSS, JavaScript
- CDN distribution
- Best for: Landing pages, documentation, blogs

**2. Single Page Application (SPA)**
- Client-side routing
- API integration
- Best for: Dashboards, interactive apps

**3. Server-Side Rendered (SSR)**
- Dynamic content generation
- SEO optimization
- Best for: E-commerce, content sites

**4. Full-Stack Application**
- Frontend + Backend + Database
- Complete application stack
- Best for: SaaS platforms, complex applications

## 🌐 Platform-Specific Guides

### Vercel Deployment (Recommended)

Vercel offers the best experience for React and Next.js applications with automatic optimizations.

#### Quick Deploy

**One-Click Deployment:**
1. Connect your GitHub repository
2. Configure build settings
3. Deploy automatically on push

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Production deployment
vercel --prod
```

#### Vercel Configuration

**vercel.json:**
```json
{
  "version": 2,
  "name": "flashfusion-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "pages/api/*.js": {
      "maxDuration": 30
    }
  },
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

**Environment Variables:**
```bash
# Set via Vercel CLI
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add OPENAI_API_KEY production

# Or via Vercel Dashboard
# Project Settings → Environment Variables
```

#### Advanced Vercel Features

**Edge Functions:**
```typescript
// pages/api/edge-function.ts
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  return new Response(
    JSON.stringify({
      message: 'Hello from the edge!',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
```

**Image Optimization:**
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.flashfusion.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Netlify Deployment

Perfect for static sites and JAMstack applications with excellent CI/CD integration.

#### Netlify Setup

**netlify.toml:**
```toml
[build]
  command = "pnpm build"
  publish = "dist"
  
[build.environment]
  NODE_ENV = "production"
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Netlify Functions:**
```typescript
// netlify/functions/hello.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Hello from Netlify Functions!',
      timestamp: new Date().toISOString(),
    }),
  };
};
```

### AWS Deployment

Enterprise-grade deployment with complete control over infrastructure.

#### AWS Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│      S3         │────│     Route53     │
│   (CDN)         │    │   (Static)      │    │    (DNS)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      ALB        │────│      ECS        │────│      RDS        │
│ (Load Balancer) │    │  (Containers)   │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**AWS CDK Deployment:**
```typescript
// aws-cdk/app-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';

export class FlashFusionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for static assets
    const staticBucket = new s3.Bucket(this, 'StaticAssets', {
      bucketName: 'flashfusion-static-assets',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'CDN', {
      defaultBehavior: {
        origin: new origins.S3Origin(staticBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });

    // ECS Cluster for backend services
    const cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: 'flashfusion-cluster',
    });

    // RDS Database
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      multiAz: true,
      backupRetention: cdk.Duration.days(7),
    });
  }
}
```

#### Docker Deployment

**Dockerfile:**
```dockerfile
# Multi-stage build for optimal image size
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: flashfusion
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Google Cloud Platform

Ideal for AI/ML workloads with integrated AI services.

**Cloud Run Deployment:**
```yaml
# cloudbuild.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/flashfusion:$COMMIT_SHA', '.']
  
  # Push the image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/flashfusion:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'flashfusion',
      '--image', 'gcr.io/$PROJECT_ID/flashfusion:$COMMIT_SHA',
      '--platform', 'managed',
      '--region', 'us-central1',
      '--allow-unauthenticated'
    ]

images:
  - 'gcr.io/$PROJECT_ID/flashfusion:$COMMIT_SHA'
```

**Terraform Configuration:**
```hcl
# terraform/main.tf
provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "flashfusion" {
  name     = "flashfusion"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/flashfusion:latest"
        
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        
        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_url.secret_id
              key  = "latest"
            }
          }
        }

        resources {
          limits = {
            cpu    = "2000m"
            memory = "2Gi"
          }
        }

        ports {
          container_port = 3000
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_domain_mapping" "flashfusion" {
  location = var.region
  name     = "flashfusion.com"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.flashfusion.name
  }
}
```

---

## ⚙️ Environment Configuration

### Environment Variables by Platform

#### Production Environment Variables
```bash
# Core Application
NODE_ENV=production
PORT=3000
APP_URL=https://flashfusion.com

# Supabase Configuration
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# AI Service Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# Authentication
NEXTAUTH_URL=https://flashfusion.com
NEXTAUTH_SECRET=your-secret-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External Services
SENDGRID_API_KEY=SG....
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
SENTRY_DSN=https://...@sentry.io/...
LOGTAIL_TOKEN=your-logtail-token

# Feature Flags
FEATURE_MULTI_AGENT=true
FEATURE_VOICE_INTERFACE=false
FEATURE_BLOCKCHAIN_TOOLS=false
```

#### Environment-Specific Overrides

**Staging Environment:**
```bash
# Override production values for staging
NODE_ENV=staging
APP_URL=https://staging.flashfusion.com
SUPABASE_URL=https://staging-project.supabase.co
STRIPE_SECRET_KEY=sk_test_...
GOOGLE_ANALYTICS_ID=GA_STAGING_ID
```

### Secrets Management

#### Using Environment Variables Services

**Vercel:**
```bash
# Add secrets via CLI
vercel env add OPENAI_API_KEY production
vercel env add DATABASE_URL production

# Or via dashboard at vercel.com/project/settings/environment-variables
```

**Netlify:**
```bash
# Using Netlify CLI
netlify env:set OPENAI_API_KEY "sk-..." --context production

# Or via Netlify dashboard
# Site Settings → Environment Variables
```

**AWS Parameter Store:**
```bash
# Store secrets in AWS Systems Manager
aws ssm put-parameter \
  --name "/flashfusion/prod/database-url" \
  --value "postgresql://..." \
  --type "SecureString"

# Retrieve in application
aws ssm get-parameter \
  --name "/flashfusion/prod/database-url" \
  --with-decryption
```

#### Docker Secrets

**Docker Compose with Secrets:**
```yaml
version: '3.8'

services:
  app:
    image: flashfusion:latest
    secrets:
      - db_password
      - api_keys
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_keys:
    external: true
```

---

## 🔄 CI/CD Setup

### GitHub Actions Workflow

**Complete CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linting
        run: pnpm lint

      - name: Run type checking
        run: pnpm type-check

      - name: Run unit tests
        run: pnpm test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Build application
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  security:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run security audit
        run: pnpm audit --audit-level moderate

      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: typescript, javascript

      - name: Run dependency vulnerability scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to AWS S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: us-east-1

      - name: Notify deployment status
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  lighthouse:
    needs: deploy-production
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### GitLab CI/CD

**GitLab CI Configuration:**
```yaml
# .gitlab-ci.yml
stages:
  - test
  - security
  - build
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_REGISTRY: "registry.gitlab.com"
  
cache:
  paths:
    - node_modules/
    - .pnpm-store/

before_script:
  - apt-get update -qq && apt-get install -y -qq git curl
  - curl -fsSL https://get.pnpm.io/install.sh | sh -
  - source ~/.bashrc
  - pnpm config set store-dir .pnpm-store
  - pnpm install --frozen-lockfile

test:
  stage: test
  image: node:18-alpine
  services:
    - postgres:15-alpine
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/test_db"
  script:
    - pnpm lint
    - pnpm type-check
    - pnpm test:unit
    - pnpm test:e2e
  artifacts:
    reports:
      coverage: coverage/
      junit: junit.xml

security:
  stage: security
  image: node:18-alpine
  script:
    - pnpm audit --audit-level moderate
    - npx depcheck
  allow_failure: true

build:
  stage: build
  image: node:18-alpine
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy_staging:
  stage: deploy
  image: alpine:latest
  environment:
    name: staging
    url: https://staging.flashfusion.com
  script:
    - apk add --no-cache curl
    - curl -X POST -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN" 
           -H "Content-Type: application/json" 
           -d '{"branch":"main"}' 
           "https://api.netlify.com/build_hooks/$NETLIFY_STAGING_HOOK"
  only:
    - develop

deploy_production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://flashfusion.com
  script:
    - apk add --no-cache curl
    - curl -X POST -H "Authorization: Bearer $NETLIFY_ACCESS_TOKEN"
           -H "Content-Type: application/json"
           -d '{"branch":"main"}'
           "https://api.netlify.com/build_hooks/$NETLIFY_PRODUCTION_HOOK"
  only:
    - main
  when: manual
```

---

## 🗄️ Database Deployment

### Supabase Database Setup

#### Production Database Configuration

**Database Schema Migration:**
```sql
-- migrations/001_initial_schema.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE project_status AS ENUM ('active', 'archived', 'draft');

-- Core tables
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'starter',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Database Deployment Script:**
```bash
#!/bin/bash
# deploy-database.sh

set -e

echo "🚀 Starting database deployment..."

# Load environment variables
source .env.production

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g @supabase/cli
fi

# Authenticate with Supabase
echo "Authenticating with Supabase..."
supabase login

# Link to project
supabase link --project-ref $SUPABASE_PROJECT_REF

# Run migrations
echo "Running database migrations..."
supabase db push

# Seed data if needed
if [ "$1" = "--with-seed" ]; then
    echo "Seeding database..."
    supabase db reset --linked
fi

# Generate types
echo "Generating database types..."
supabase gen types typescript --linked > types/supabase.ts

echo "✅ Database deployment completed!"
```

### Self-Hosted Database Options

#### PostgreSQL with Docker

**PostgreSQL Configuration:**
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    command: |
      postgres 
      -c shared_preload_libraries=pg_stat_statements
      -c pg_stat_statements.track=all
      -c max_connections=200
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c work_mem=4MB
      -c maintenance_work_mem=64MB

  postgres_backup:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      PGUSER: ${DB_USER}
    volumes:
      - ./backups:/backups
    command: |
      bash -c "
        while true; do
          pg_dump -h postgres -d $POSTGRES_DB > /backups/backup_$(date +%Y%m%d_%H%M%S).sql
          sleep 86400  # 24 hours
        done
      "
    depends_on:
      - postgres

volumes:
  postgres_data:
    driver: local
```

#### Redis for Caching

**Redis Configuration:**
```yaml
# redis service in docker-compose
redis:
  image: redis:7-alpine
  restart: always
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
    - ./redis.conf:/etc/redis/redis.conf
  command: redis-server /etc/redis/redis.conf
  sysctls:
    - net.core.somaxconn=65535

volumes:
  redis_data:
    driver: local
```

**redis.conf:**
```conf
# Redis configuration for production
maxmemory 256mb
maxmemory-policy allkeys-lru
tcp-keepalive 300
timeout 0

# Persistence
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes

# Security
requirepass ${REDIS_PASSWORD}
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""

# Network
bind 0.0.0.0
protected-mode yes
port 6379
```

---

## 🌐 Custom Domain Setup

### DNS Configuration

#### Domain Provider Setup

**Cloudflare DNS Records:**
```bash
# A Records (Root domain)
Type: A
Name: @
Content: 76.76.19.123 (Vercel IP)
TTL: Auto

# CNAME Records (Subdomains)
Type: CNAME
Name: www
Content: flashfusion.com
TTL: Auto

Type: CNAME
Name: api
Content: api-gateway.vercel.app
TTL: Auto

Type: CNAME
Name: cdn
Content: cdn.jsdelivr.net
TTL: Auto

# MX Records (Email)
Type: MX
Name: @
Content: mx1.forwardemail.net
Priority: 10

# TXT Records (Verification)
Type: TXT
Name: @
Content: "v=spf1 include:_spf.google.com ~all"

Type: TXT
Name: _dmarc
Content: "v=DMARC1; p=quarantine; rua=mailto:dmarc@flashfusion.com"
```

#### SSL Certificate Setup

**Let's Encrypt with Certbot:**
```bash
#!/bin/bash
# setup-ssl.sh

# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d flashfusion.com -d www.flashfusion.com

# Set up auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

**Nginx SSL Configuration:**
```nginx
# /etc/nginx/sites-available/flashfusion.com
server {
    listen 80;
    server_name flashfusion.com www.flashfusion.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flashfusion.com www.flashfusion.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/flashfusion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flashfusion.com/privkey.pem;
    
    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Application Proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Routes
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
}
```

---

## ⚡ Performance Optimization

### Build Optimization

#### Webpack/Vite Configuration

**Vite Production Config:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
```

#### Code Splitting Strategy

**Route-based Code Splitting:**
```typescript
// components/layout/PageRouter.tsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '../ui/loading-states';

// Lazy load page components
const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MultiAgentPage = lazy(() => import('../pages/MultiAgentOrchestrationPage'));
const CreatorContentPage = lazy(() => import('../pages/CreatorContentPipelinePage'));
const FullStackBuilderPage = lazy(() => import('../pages/FullStackBuilderDemoPage'));

export function PageRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/multi-agent" element={<MultiAgentPage />} />
        <Route path="/creator-content" element={<CreatorContentPage />} />
        <Route path="/full-stack-builder" element={<FullStackBuilderPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization

**Next.js Image Optimization:**
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`
          transition-all duration-300
          ${isLoading ? 'blur-sm' : 'blur-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### CDN Configuration

**Cloudflare CDN Settings:**
```javascript
// Cloudflare Workers script for advanced caching
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Cache static assets aggressively
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff2?)$/)) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    
    // Set long cache headers
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    newResponse.headers.set('Vary', 'Accept-Encoding');
    
    return newResponse;
  }
  
  // Cache HTML for shorter periods
  if (url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    
    newResponse.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    
    return newResponse;
  }
  
  return fetch(request);
}
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring

#### Health Check Endpoints

**Health Check Implementation:**
```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: 'pass' | 'fail';
    redis: 'pass' | 'fail';
    external_apis: 'pass' | 'fail';
  };
  response_time: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  const startTime = Date.now();
  
  const checks = {
    database: 'fail' as const,
    redis: 'fail' as const,
    external_apis: 'fail' as const,
  };

  // Check database connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (!error) {
      checks.database = 'pass';
    }
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Check Redis connection
  try {
    // Add Redis health check if using Redis
    checks.redis = 'pass';
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  // Check external APIs
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      timeout: 5000,
    });
    
    if (response.ok) {
      checks.external_apis = 'pass';
    }
  } catch (error) {
    console.error('External API health check failed:', error);
  }

  const responseTime = Date.now() - startTime;
  
  // Determine overall status
  const failedChecks = Object.values(checks).filter(check => check === 'fail');
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (failedChecks.length === 0) {
    status = 'healthy';
  } else if (failedChecks.length <= 1) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  const healthStatus: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks,
    response_time: responseTime,
  };

  const statusCode = status === 'healthy' ? 200 : 
                    status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(healthStatus);
}
```

#### Monitoring Setup with Uptime Robot

**Uptime Monitoring Configuration:**
```bash
# Set up monitoring endpoints
curl -X POST \
  https://api.uptimerobot.com/v2/newMonitor \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'api_key=YOUR_API_KEY' \
  -d 'format=json' \
  -d 'type=1' \
  -d 'url=https://flashfusion.com/api/health' \
  -d 'friendly_name=FlashFusion Health Check' \
  -d 'interval=300'
```

### Error Tracking

#### Sentry Integration

**Sentry Configuration:**
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out non-critical errors in production
    if (process.env.NODE_ENV === 'production') {
      if (event.exception) {
        const error = hint.originalException;
        if (error?.name === 'ChunkLoadError') {
          return null; // Ignore chunk loading errors
        }
      }
    }
    return event;
  },
});

export { Sentry };
```

#### Custom Error Boundary

**Enhanced Error Boundary:**
```typescript
// components/ui/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Sentry } from '../../lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">
              Something went wrong
            </h2>
            <p className="text-muted-foreground">
              We've been notified about this error and are working to fix it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures

**Memory Issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

**Dependency Issues:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Environment Variable Issues

**Debug Environment Variables:**
```typescript
// Debug environment variables in development
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Missing');
}
```

#### Database Connection Issues

**Connection Troubleshooting:**
```typescript
// lib/db-test.ts
import { createClient } from '@supabase/supabase-js';

export async function testDatabaseConnection() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
```

### Performance Issues

#### Bundle Size Analysis

**Analyze Bundle Size:**
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build

# Or with webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/chunks/*.js
```

#### Lighthouse Optimization

**Lighthouse CI Configuration:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm start",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Debugging Deployment

#### Deployment Logs

**View Deployment Logs:**
```bash
# Vercel logs
vercel logs https://your-app.vercel.app

# Netlify logs
netlify logs --site-name=your-site

# Heroku logs
heroku logs --tail --app=your-app

# AWS CloudWatch
aws logs tail /aws/lambda/your-function --follow
```

#### Health Check Script

**Deployment Verification Script:**
```bash
#!/bin/bash
# verify-deployment.sh

set -e

DEPLOYMENT_URL="https://flashfusion.com"
API_URL="$DEPLOYMENT_URL/api/health"

echo "🔍 Verifying deployment at $DEPLOYMENT_URL"

# Check if site is accessible
echo "Checking main site..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $DEPLOYMENT_URL)
if [ $RESPONSE -eq 200 ]; then
    echo "✅ Main site is accessible"
else
    echo "❌ Main site returned HTTP $RESPONSE"
    exit 1
fi

# Check health endpoint
echo "Checking health endpoint..."
HEALTH_RESPONSE=$(curl -s $API_URL)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | jq -r '.status')

if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $HEALTH_STATUS"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Check performance
echo "Running basic performance test..."
LOAD_TIME=$(curl -s -w "%{time_total}" -o /dev/null $DEPLOYMENT_URL)
echo "Page load time: ${LOAD_TIME}s"

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    echo "✅ Performance is acceptable"
else
    echo "⚠️  Performance is slow (${LOAD_TIME}s)"
fi

echo "🎉 Deployment verification completed!"
```

---

This comprehensive deployment guide covers all major platforms and scenarios for deploying FlashFusion applications. For platform-specific issues or advanced configurations, refer to the respective platform documentation or contact our support team.

*Last Updated: January 2024 | Guide Version: 2.0*