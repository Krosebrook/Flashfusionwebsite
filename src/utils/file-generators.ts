import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { GeneratedApp } from '../types/full-stack-builder';

/**
 * File Generation Utilities for FlashFusion
 * Creates real downloadable project files instead of JSON exports
 */

export interface ProjectFileStructure {
  [path: string]: string | ProjectFileStructure;
}

export interface DownloadOptions {
  format: 'zip' | 'individual';
  includeNodeModules?: boolean;
  includeGitIgnore?: boolean;
}

/**
 * Generate a complete project structure as downloadable files
 */
export async function generateDownloadableProject(
  app: GeneratedApp,
  options: DownloadOptions = { format: 'zip', includeGitIgnore: true }
): Promise<void> {
  const zip = new JSZip();
  const projectName = app.name.toLowerCase().replace(/\s+/g, '-');

  try {
    // Create project structure
    const projectStructure = createProjectStructure(app);
    
    // Add all files to zip
    await addFilesToZip(zip, projectStructure, '');
    
    // Add additional project files
    if (options.includeGitIgnore) {
      zip.file('.gitignore', generateGitIgnore());
    }
    
    // Add package.json files
    zip.file('package.json', generateRootPackageJson(app));
    
    // Add README files
    zip.file('README.md', generateProjectReadme(app));
    zip.file('DEPLOYMENT.md', generateDeploymentGuide(app));
    zip.file('DEVELOPMENT.md', generateDevelopmentGuide(app));
    
    // Generate and download zip file
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });
    
    saveAs(content, `${projectName}-fullstack-project.zip`);
    
  } catch (error) {
    console.error('Error generating downloadable project:', error);
    throw new Error('Failed to generate project files');
  }
}

/**
 * Create the complete project file structure
 */
function createProjectStructure(app: GeneratedApp): ProjectFileStructure {
  const structure: ProjectFileStructure = {};
  
  // Organize files by type and location
  app.files.forEach(file => {
    const pathParts = file.path.split('/');
    let current = structure;
    
    // Navigate/create nested structure
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as ProjectFileStructure;
    }
    
    // Add the file content
    const fileName = pathParts[pathParts.length - 1];
    current[fileName] = file.content;
  });
  
  return structure;
}

/**
 * Recursively add files to zip archive
 */
async function addFilesToZip(
  zip: JSZip, 
  structure: ProjectFileStructure, 
  basePath: string
): Promise<void> {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = basePath ? `${basePath}/${name}` : name;
    
    if (typeof content === 'string') {
      // It's a file
      zip.file(fullPath, content);
    } else {
      // It's a directory
      const folder = zip.folder(fullPath);
      if (folder) {
        await addFilesToZip(folder, content, '');
      }
    }
  }
}

/**
 * Generate root package.json for the entire project
 */
function generateRootPackageJson(app: GeneratedApp): string {
  return JSON.stringify({
    name: app.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: app.description,
    private: true,
    workspaces: [
      'frontend',
      'backend'
    ],
    scripts: {
      'dev': 'concurrently "npm run dev:backend" "npm run dev:frontend"',
      'dev:frontend': 'cd frontend && npm run dev',
      'dev:backend': 'cd backend && npm run dev',
      'build': 'npm run build:backend && npm run build:frontend',
      'build:frontend': 'cd frontend && npm run build',
      'build:backend': 'cd backend && npm run build',
      'start': 'npm run start:backend',
      'start:backend': 'cd backend && npm start',
      'test': 'npm run test:frontend && npm run test:backend',
      'test:frontend': 'cd frontend && npm test',
      'test:backend': 'cd backend && npm test',
      'lint': 'npm run lint:frontend && npm run lint:backend',
      'lint:frontend': 'cd frontend && npm run lint',
      'lint:backend': 'cd backend && npm run lint',
      'docker:dev': 'docker-compose up -d',
      'docker:prod': 'docker-compose -f docker-compose.prod.yml up -d',
      'docker:down': 'docker-compose down',
      'setup': 'npm install && cd frontend && npm install && cd ../backend && npm install'
    },
    devDependencies: {
      'concurrently': '^8.2.0',
      '@types/node': '^20.0.0',
      'typescript': '^5.0.0'
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    },
    repository: {
      type: 'git',
      url: `https://github.com/username/${app.name.toLowerCase().replace(/\s+/g, '-')}.git`
    },
    keywords: [
      'fullstack',
      'react',
      'nodejs',
      'typescript',
      'generated-by-flashfusion'
    ],
    author: 'Generated by FlashFusion',
    license: 'MIT'
  }, null, 2);
}

/**
 * Generate comprehensive README.md
 */
function generateProjectReadme(app: GeneratedApp): string {
  return `# ${app.name}

${app.description}

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Docker (optional)

### Option 1: Docker (Recommended)
\`\`\`bash
# Clone and setup
git clone <your-repo>
cd ${app.name.toLowerCase().replace(/\s+/g, '-')}

# Start with Docker
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
\`\`\`

### Option 2: Local Development
\`\`\`bash
# Install dependencies for all workspaces
npm run setup

# Start development servers
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
\`\`\`

## 🏗️ Architecture

This is a full-stack application with the following architecture:

- **Frontend**: ${app.stack.frontend} with TypeScript
- **Backend**: ${app.stack.backend} with Express
- **Database**: ${app.stack.database}
- **Authentication**: ${app.stack.auth}
- **Deployment**: ${app.stack.deployment}

## ✨ Features

${app.features.map(feature => `- ✅ ${feature}`).join('\n')}

## 📁 Project Structure

\`\`\`
${app.name.toLowerCase().replace(/\s+/g, '-')}/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   ├── public/           # Static assets
│   └── package.json
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   └── package.json
├── database/              # Database schema and migrations
├── docker-compose.yml     # Docker configuration
├── README.md             # This file
└── package.json          # Root package.json
\`\`\`

## 🛠️ Available Scripts

### Root Level
- \`npm run dev\` - Start both frontend and backend in development mode
- \`npm run build\` - Build both applications for production
- \`npm run test\` - Run tests for both applications
- \`npm run docker:dev\` - Start with Docker in development mode

### Frontend
- \`npm run dev:frontend\` - Start frontend development server
- \`npm run build:frontend\` - Build frontend for production
- \`npm run test:frontend\` - Run frontend tests

### Backend
- \`npm run dev:backend\` - Start backend development server
- \`npm run build:backend\` - Build backend for production
- \`npm run test:backend\` - Run backend tests

## 🌐 API Documentation

The backend provides the following endpoints:

${app.endpoints.map(endpoint => `- \`${endpoint.method} ${endpoint.path}\` - ${endpoint.description}`).join('\n')}

## 🔧 Environment Configuration

1. Copy environment template:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Update the following variables:
- \`DATABASE_URL\` - Your database connection string
- \`JWT_SECRET\` - Secret for JWT tokens
- \`API_PORT\` - Backend server port (default: 3001)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

#### Vercel (Frontend + Serverless Backend)
\`\`\`bash
cd frontend
vercel --prod
\`\`\`

#### Railway (Full-Stack)
\`\`\`bash
railway login
railway link
railway up
\`\`\`

#### Docker Production
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Generated by FlashFusion

This project was generated using [FlashFusion](https://flashfusion.dev) - The AI-powered full-stack development platform.

### Generated Configuration
- **Framework**: ${app.stack.frontend}
- **Backend**: ${app.stack.backend}
- **Database**: ${app.stack.database}
- **Features**: ${app.features.join(', ')}
- **Generated**: ${new Date().toLocaleDateString()}

Need help? Check out our [documentation](https://docs.flashfusion.dev) or join our [community](https://discord.gg/flashfusion).
`;
}

/**
 * Generate deployment guide
 */
function generateDeploymentGuide(app: GeneratedApp): string {
  return `# Deployment Guide

This guide covers deploying your ${app.name} application to various platforms.

## 🚀 Platform-Specific Deployments

### Vercel (Recommended for Frontend)

1. **Frontend Deployment**:
\`\`\`bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
\`\`\`

2. **Environment Variables**:
- \`NEXT_PUBLIC_API_URL\` - Your backend API URL
- \`NEXT_PUBLIC_APP_ENV\` - production

### Railway (Full-Stack)

1. **Install Railway CLI**:
\`\`\`bash
npm install -g @railway/cli
railway login
\`\`\`

2. **Deploy**:
\`\`\`bash
railway link
railway up
\`\`\`

### Heroku

1. **Backend Deployment**:
\`\`\`bash
cd backend
heroku create ${app.name.toLowerCase().replace(/\s+/g, '-')}-api
git push heroku main
\`\`\`

2. **Frontend Deployment**:
\`\`\`bash
cd frontend
heroku create ${app.name.toLowerCase().replace(/\s+/g, '-')}
git push heroku main
\`\`\`

### Docker Production

1. **Build and Run**:
\`\`\`bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### AWS (Advanced)

1. **Using AWS App Runner**:
- Build Docker images
- Push to ECR
- Deploy with App Runner

2. **Using Elastic Beanstalk**:
- Package application
- Deploy to EB environment

## 🔒 Environment Variables

### Required for Production:
- \`NODE_ENV=production\`
- \`DATABASE_URL\` - Production database URL
- \`JWT_SECRET\` - Secure JWT secret
- \`CORS_ORIGIN\` - Frontend domain

### Optional:
- \`REDIS_URL\` - Redis cache URL
- \`SMTP_HOST\` - Email service
- \`STRIPE_SECRET_KEY\` - Payment processing

## 🏥 Health Checks

All platforms should monitor:
- \`GET /health\` - Application health
- \`GET /api/health\` - API health

## 🔄 CI/CD

GitHub Actions workflow is included for automatic deployments:

\`\`\`yaml
# See .github/workflows/deploy.yml
- Runs tests on push
- Builds Docker images
- Deploys to staging/production
\`\`\`

## 📊 Monitoring

Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Log aggregation
- Database monitoring

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify environment variables
   - Review build logs

2. **Database Connection**:
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is accessible

3. **CORS Errors**:
   - Update CORS_ORIGIN setting
   - Check frontend/backend URLs
   - Verify protocol (http/https)

For more help, check the platform-specific documentation or our [support resources](https://docs.flashfusion.dev).
`;
}

/**
 * Generate development guide
 */
function generateDevelopmentGuide(app: GeneratedApp): string {
  return `# Development Guide

Welcome to the ${app.name} development environment!

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- npm 8+
- Git
- Docker (optional but recommended)

### 2. Installation
\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd ${app.name.toLowerCase().replace(/\s+/g, '-')}

# Install all dependencies
npm run setup

# Or install manually:
npm install
cd frontend && npm install
cd ../backend && npm install
\`\`\`

### 3. Environment Setup
\`\`\`bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
\`\`\`

### 4. Database Setup
\`\`\`bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or setup local PostgreSQL
createdb ${app.name.toLowerCase().replace(/\s+/g, '_')}
\`\`\`

### 5. Start Development
\`\`\`bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
\`\`\`

## 🏗️ Architecture Overview

### Frontend (${app.stack.frontend})
- **Location**: \`./frontend/\`
- **Port**: 3000
- **Key Technologies**: React, TypeScript, Tailwind CSS
- **State Management**: React Hooks + Context
- **Routing**: React Router v6

### Backend (${app.stack.backend})
- **Location**: \`./backend/\`
- **Port**: 3001
- **Key Technologies**: Node.js, Express, TypeScript
- **Database**: ${app.stack.database}
- **Authentication**: ${app.stack.auth}

## 📁 Directory Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Application pages
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── styles/             # Global styles and themes
\`\`\`

## 🔧 Development Scripts

### Frontend Development
\`\`\`bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript checking
\`\`\`

### Backend Development
\`\`\`bash
cd backend

npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run migrate      # Run database migrations
\`\`\`

## 🧪 Testing

### Frontend Testing
- **Framework**: Vitest + Testing Library
- **Location**: \`frontend/src/**/*.test.ts\`
- **Commands**:
  \`\`\`bash
  npm run test         # Run all tests
  npm run test:watch   # Watch mode
  npm run test:ui      # Visual test UI
  \`\`\`

### Backend Testing
- **Framework**: Jest + Supertest
- **Location**: \`backend/src/**/*.test.ts\`
- **Commands**:
  \`\`\`bash
  npm run test         # Run all tests
  npm run test:watch   # Watch mode
  npm run test:e2e     # End-to-end tests
  \`\`\`

## 🎨 Styling & Design

### Tailwind CSS
- Configuration: \`tailwind.config.js\`
- Custom classes: \`src/styles/globals.css\`
- Component styles: Co-located with components

### Design System
- Colors: Defined in Tailwind config
- Typography: Custom font stack
- Spacing: Consistent spacing scale
- Components: Reusable component library

## 🔌 API Development

### Adding New Endpoints
1. Create route handler in \`backend/src/routes/\`
2. Add route to main app in \`backend/src/app.ts\`
3. Update API types in \`shared/types/\`
4. Add frontend service method

### Example API Route:
\`\`\`typescript
// backend/src/routes/example.ts
import { Router } from 'express';

const router = Router();

router.get('/example', async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
\`\`\`

## 🗄️ Database Management

### Migrations
\`\`\`bash
# Create new migration
npm run migrate:create <name>

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
\`\`\`

### Seeding
\`\`\`bash
# Seed development data
npm run seed

# Seed specific data
npm run seed:users
\`\`\`

## 🔧 Debugging

### Frontend Debugging
- Browser DevTools
- React DevTools extension
- Vite debug mode: \`DEBUG=vite:* npm run dev\`

### Backend Debugging
- VS Code debugger configuration included
- Debug mode: \`npm run dev:debug\`
- Database queries: Enable query logging

## 🚀 Building for Production

### Frontend Build
\`\`\`bash
cd frontend
npm run build        # Creates dist/ folder
npm run preview      # Preview production build
\`\`\`

### Backend Build
\`\`\`bash
cd backend
npm run build        # Compiles to dist/ folder
npm run start        # Runs compiled version
\`\`\`

## 📋 Code Standards

### TypeScript
- Strict mode enabled
- Explicit types preferred
- Use interfaces for object shapes
- Avoid \`any\` type

### React
- Functional components only
- Custom hooks for logic
- Props destructuring
- Proper key props for lists

### Node.js
- Async/await over promises
- Proper error handling
- Environment-based configuration
- Request validation

## 🤝 Contributing

1. Create feature branch: \`git checkout -b feature/new-feature\`
2. Follow code standards
3. Add tests for new features
4. Update documentation
5. Submit pull request

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   \`\`\`bash
   lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
   \`\`\`

2. **Node Modules Issues**:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

3. **Database Connection**:
   - Check DATABASE_URL in .env
   - Ensure database is running
   - Verify credentials

### Getting Help
- Check the [documentation](https://docs.flashfusion.dev)
- Search existing [issues](https://github.com/your-repo/issues)
- Join our [Discord community](https://discord.gg/flashfusion)

Generated by FlashFusion 🚀
`;
}

/**
 * Generate .gitignore file
 */
function generateGitIgnore(): string {
  return `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
/frontend/build
/frontend/dist
/backend/dist
/backend/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output

# ESLint cache
.eslintcache

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.docker/

# Database
*.db
*.sqlite
*.sqlite3

# Generated files
generated/
build/
dist/

# Local development
.local/
*.local

# Backup files
*.backup
*.bak
*.tmp

# FlashFusion specific
.ff-cache/
.ff-temp/
`;
}

/**
 * Download individual file
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, filename);
}

/**
 * Download multiple files as separate downloads
 */
export async function downloadMultipleFiles(files: Array<{ name: string; content: string; type?: string }>): Promise<void> {
  for (const file of files) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between downloads
    downloadFile(file.name, file.content, file.type || 'text/plain');
  }
}

/**
 * Enhanced download with progress tracking and multiple format support
 */
export interface EnhancedDownloadOptions extends DownloadOptions {
  onProgress?: (progress: number, message: string) => void;
  generateDocumentation?: boolean;
  generateTests?: boolean;
  includeSourceMaps?: boolean;
  includeAnalytics?: boolean;
  customBranding?: {
    logo?: string;
    companyName?: string;
    website?: string;
    email?: string;
  };
}

export async function generateEnhancedDownload(
  app: GeneratedApp,
  options: EnhancedDownloadOptions = { format: 'zip' }
): Promise<void> {
  const { onProgress } = options;
  
  try {
    onProgress?.(5, 'Analyzing project structure...');
    
    const zip = new JSZip();
    const projectName = app.name.toLowerCase().replace(/\s+/g, '-');
    
    onProgress?.(15, 'Creating project files...');
    
    // Create enhanced project structure
    const projectStructure = createEnhancedProjectStructure(app, options);
    
    onProgress?.(25, 'Adding application files...');
    await addFilesToZip(zip, projectStructure, '');
    
    onProgress?.(40, 'Generating documentation...');
    
    // Add enhanced documentation
    if (options.generateDocumentation !== false) {
      zip.file('README.md', generateEnhancedReadme(app, options));
      zip.file('ARCHITECTURE.md', generateArchitectureGuide(app));
      zip.file('API_DOCUMENTATION.md', generateAPIDocumentation(app));
      zip.file('DEPLOYMENT_GUIDE.md', generateEnhancedDeploymentGuide(app));
      zip.file('CONTRIBUTING.md', generateContributingGuide(app));
    }
    
    onProgress?.(55, 'Adding configuration files...');
    
    // Enhanced configuration files
    zip.file('package.json', generateEnhancedRootPackageJson(app, options));
    zip.file('.env.example', generateEnhancedEnvExample(app));
    zip.file('docker-compose.yml', generateEnhancedDockerCompose(app));
    zip.file('docker-compose.prod.yml', generateProductionDockerCompose(app));
    
    onProgress?.(70, 'Adding development tools...');
    
    // Development tools
    zip.file('.eslintrc.js', generateESLintConfig());
    zip.file('.prettierrc.json', generatePrettierConfig());
    zip.file('jest.config.js', generateJestConfig());
    zip.file('tsconfig.json', generateTSConfig());
    
    onProgress?.(80, 'Generating tests...');
    
    // Add tests if requested
    if (options.generateTests) {
      zip.file('frontend/src/__tests__/App.test.tsx', generateFrontendTests(app));
      zip.file('backend/src/__tests__/app.test.ts', generateBackendTests(app));
      zip.file('backend/src/__tests__/auth.test.ts', generateAuthTests(app));
    }
    
    onProgress?.(90, 'Adding CI/CD configurations...');
    
    // CI/CD files
    zip.file('.github/workflows/ci.yml', generateGitHubActionsCI(app));
    zip.file('.github/workflows/deploy.yml', generateGitHubActionsDeploy(app));
    zip.file('.github/ISSUE_TEMPLATE/bug_report.md', generateIssueTemplate('bug'));
    zip.file('.github/ISSUE_TEMPLATE/feature_request.md', generateIssueTemplate('feature'));
    
    onProgress?.(95, 'Finalizing download...');
    
    // Add gitignore and other meta files
    zip.file('.gitignore', generateEnhancedGitIgnore());
    zip.file('LICENSE', generateMITLicense(app));
    zip.file('CHANGELOG.md', generateChangelog(app));
    
    // Add FlashFusion branding and metadata
    zip.file('_flashfusion/metadata.json', generateFlashFusionMetadata(app, options));
    zip.file('_flashfusion/generation-report.html', generateGenerationReport(app, options));
    
    onProgress?.(98, 'Compressing files...');
    
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: options.format === 'zip' ? 6 : 0
      }
    });
    
    onProgress?.(100, 'Download ready!');
    
    saveAs(content, `${projectName}-enhanced-fullstack-project.zip`);
    
  } catch (error) {
    console.error('Enhanced download failed:', error);
    throw new Error('Failed to generate enhanced project package');
  }
}

/**
 * Generate package.json for npm install
 */
export function generateInstallablePackage(app: GeneratedApp): string {
  return JSON.stringify({
    name: `@flashfusion/${app.name.toLowerCase().replace(/\s+/g, '-')}`,
    version: '1.0.0',
    description: app.description,
    main: 'index.js',
    scripts: {
      postinstall: 'node setup.js'
    },
    keywords: ['flashfusion', 'generated', 'fullstack'],
    author: 'FlashFusion',
    license: 'MIT',
    files: [
      'frontend/**/*',
      'backend/**/*',
      'database/**/*',
      'docker-compose.yml',
      'setup.js',
      'README.md'
    ]
  }, null, 2);
}

// Enhanced generator functions for the new download system

function createEnhancedProjectStructure(app: GeneratedApp, options: EnhancedDownloadOptions): ProjectFileStructure {
  const structure = createProjectStructure(app);
  
  // Add enhanced structure elements
  if (options.generateTests) {
    structure['tests'] = {
      'frontend': {},
      'backend': {},
      'e2e': {},
      'integration': {}
    };
  }
  
  if (options.includeAnalytics) {
    structure['analytics'] = {
      'tracking.js': '// Analytics tracking implementation',
      'reports.js': '// Analytics reports generation'
    };
  }
  
  return structure;
}

function generateEnhancedReadme(app: GeneratedApp, options: EnhancedDownloadOptions): string {
  const branding = options.customBranding;
  const projectName = app.name;
  const timestamp = new Date().toLocaleDateString();
  
  return `# ${projectName}

${app.description}

${branding ? `*Generated for ${branding.companyName || 'Your Organization'}*` : ''}

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or later
- Docker and Docker Compose (recommended)
- PostgreSQL (if not using Docker)

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repository-url>
cd ${app.name.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies for all services
npm run setup

# Start the application
npm run dev
\`\`\`

## 🏗️ Architecture

This application follows a modern full-stack architecture:

- **Frontend**: ${app.stack.frontend} with TypeScript and Tailwind CSS
- **Backend**: ${app.stack.backend} with Express and TypeScript
- **Database**: ${app.stack.database} with Prisma ORM
- **Authentication**: ${app.stack.auth}
- **Deployment**: Optimized for ${app.stack.deployment}

## ✨ Features

${app.features.map(feature => `- ✅ ${feature}`).join('\n')}

## 📁 Project Structure

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
├── frontend/                 # React/Next.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages/routes
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── package.json
├── database/               # Database schema and migrations
│   ├── migrations/         # Database migrations
│   ├── seeds/             # Database seed files
│   └── schema.sql         # Database schema
├── docs/                  # Additional documentation
├── tests/                 # Test files
├── .github/               # GitHub workflows and templates
├── docker-compose.yml     # Docker development setup
├── docker-compose.prod.yml # Docker production setup
└── README.md             # This file
\`\`\`

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development
npm run dev              # Start all services in development mode
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build all services for production
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm test                 # Run all tests
npm run test:frontend    # Run frontend tests
npm run test:backend     # Run backend tests
npm run test:e2e         # Run end-to-end tests

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (destructive)

# Docker
npm run docker:dev       # Start with Docker (development)
npm run docker:prod      # Start with Docker (production)
npm run docker:build     # Build Docker images
npm run docker:down      # Stop Docker containers
\`\`\`

## 🔧 Configuration

### Environment Variables

Copy the environment template and configure your settings:

\`\`\`bash
cp .env.example .env
\`\`\`

Key variables to configure:
- \`DATABASE_URL\` - Your database connection string
- \`JWT_SECRET\` - Secret for JWT token signing
- \`API_PORT\` - Backend server port (default: 3001)
- \`FRONTEND_URL\` - Frontend URL for CORS (default: http://localhost:3000)

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Options

#### Vercel (Frontend + Serverless Backend)
\`\`\`bash
npx vercel --prod
\`\`\`

#### Railway (Full Stack)
\`\`\`bash
railway login
railway link
railway up
\`\`\`

#### Docker Production
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 📊 Monitoring & Analytics

${options.includeAnalytics ? 
  `This application includes built-in analytics and monitoring:
- User behavior tracking
- Performance monitoring  
- Error tracking and reporting
- Custom event tracking` :
  'Analytics can be added by setting includeAnalytics option during generation.'}

## 🧪 Testing

This project includes comprehensive testing:

- **Unit Tests**: Jest for both frontend and backend
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Cypress for full application testing
- **Component Tests**: React Testing Library

\`\`\`bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm run test:watch          # Run tests in watch mode
\`\`\`

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [FlashFusion](https://flashfusion.dev) - AI-powered full-stack development platform
- Generated on ${timestamp}
- Stack: ${Object.values(app.stack).join(', ')}

${branding ? `
## 📞 Support

For support and questions:
- Email: ${branding.email || 'support@yourcompany.com'}
- Website: ${branding.website || 'https://yourcompany.com'}
` : ''}

---

*Generated by FlashFusion 🚀 - The AI-powered full-stack development platform*
`;
}

function generateArchitectureGuide(app: GeneratedApp): string {
  return `# Architecture Guide

## Overview

${app.name} follows a modern three-tier architecture with clear separation of concerns:

## Frontend Layer
- **Technology**: ${app.stack.frontend}
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite/Next.js

## Backend Layer  
- **Technology**: ${app.stack.backend}
- **Framework**: Express.js
- **Authentication**: ${app.stack.auth}
- **API Style**: RESTful APIs with OpenAPI documentation

## Data Layer
- **Database**: ${app.stack.database}
- **ORM**: Prisma
- **Migrations**: Automated database migrations
- **Caching**: Redis (optional)

## Infrastructure
- **Containerization**: Docker + Docker Compose
- **Deployment**: ${app.stack.deployment}
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in health checks

## Security
- JWT-based authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Performance
- Code splitting
- Lazy loading
- Database indexing
- Caching strategies
- CDN integration ready
`;
}

function generateAPIDocumentation(app: GeneratedApp): string {
  return `# API Documentation

## Base URL
\`\`\`
http://localhost:3001/api
\`\`\`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Endpoints

${app.endpoints.map(endpoint => `
### ${endpoint.method.toUpperCase()} ${endpoint.path}
${endpoint.description}

**Response:**
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success"
}
\`\`\`
`).join('\n')}

## Error Handling
All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
\`\`\`

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
`;
}

function generateEnhancedDeploymentGuide(app: GeneratedApp): string {
  return `# Deployment Guide

## Production Deployment Options

### 1. Vercel (Recommended for Frontend)
\`\`\`bash
cd frontend
vercel --prod
\`\`\`

### 2. Railway (Full-Stack)
\`\`\`bash
railway login
railway link
railway up
\`\`\`

### 3. Docker Production
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### 4. AWS Deployment
- Use AWS ECS for container orchestration
- RDS for database
- S3 + CloudFront for static assets

## Environment Configuration
Ensure these environment variables are set in production:
- \`NODE_ENV=production\`
- \`DATABASE_URL\` (production database)
- \`JWT_SECRET\` (strong secret)
- \`CORS_ORIGIN\` (your frontend domain)

## Health Checks
- Frontend: \`/\`
- Backend: \`/health\`
- Database: Connection test included

## Monitoring
- Application logs
- Error tracking
- Performance monitoring
- Database monitoring
`;
}

function generateContributingGuide(app: GeneratedApp): string {
  return `# Contributing to ${app.name}

## Development Setup

1. Fork the repository
2. Clone your fork: \`git clone <your-fork-url>\`
3. Install dependencies: \`npm run setup\`
4. Create a feature branch: \`git checkout -b feature/amazing-feature\`

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Testing
- Write unit tests for new functions
- Add integration tests for API endpoints  
- Update E2E tests for UI changes
- Ensure test coverage stays above 80%

### Pull Request Process
1. Update documentation if needed
2. Add tests for your changes
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit pull request with clear description

## Issue Reporting
Use GitHub issues with appropriate labels:
- \`bug\` for bugs
- \`enhancement\` for new features
- \`documentation\` for docs updates
`;
}

function generateEnhancedRootPackageJson(app: GeneratedApp, options: EnhancedDownloadOptions): string {
  const branding = options.customBranding;
  
  return JSON.stringify({
    name: app.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: app.description,
    private: true,
    author: branding?.companyName || 'Generated by FlashFusion',
    homepage: branding?.website || 'https://flashfusion.dev',
    repository: {
      type: 'git',
      url: `https://github.com/username/${app.name.toLowerCase().replace(/\s+/g, '-')}.git`
    },
    workspaces: [
      'frontend',
      'backend'
    ],
    scripts: {
      'setup': 'npm install && cd frontend && npm install && cd ../backend && npm install',
      'dev': 'concurrently "npm run dev:backend" "npm run dev:frontend"',
      'dev:frontend': 'cd frontend && npm run dev',
      'dev:backend': 'cd backend && npm run dev',
      'build': 'npm run build:backend && npm run build:frontend',
      'build:frontend': 'cd frontend && npm run build',
      'build:backend': 'cd backend && npm run build',
      'start': 'npm run start:backend',
      'start:frontend': 'cd frontend && npm start',
      'start:backend': 'cd backend && npm start',
      'test': 'npm run test:frontend && npm run test:backend',
      'test:frontend': 'cd frontend && npm test',
      'test:backend': 'cd backend && npm test',
      'test:e2e': 'cypress run',
      'test:coverage': 'npm run test -- --coverage',
      'lint': 'npm run lint:frontend && npm run lint:backend',
      'lint:frontend': 'cd frontend && npm run lint',
      'lint:backend': 'cd backend && npm run lint',
      'lint:fix': 'npm run lint:frontend -- --fix && npm run lint:backend -- --fix',
      'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
      'type-check': 'npm run type-check:frontend && npm run type-check:backend',
      'type-check:frontend': 'cd frontend && tsc --noEmit',
      'type-check:backend': 'cd backend && tsc --noEmit',
      'docker:dev': 'docker-compose up -d',
      'docker:prod': 'docker-compose -f docker-compose.prod.yml up -d',
      'docker:build': 'docker-compose build',
      'docker:down': 'docker-compose down',
      'db:migrate': 'cd backend && npm run db:migrate',
      'db:seed': 'cd backend && npm run db:seed',
      'db:reset': 'cd backend && npm run db:reset',
      'deploy': 'npm run build && npm run deploy:production',
      'deploy:staging': 'echo "Deploy to staging"',
      'deploy:production': 'echo "Deploy to production"'
    },
    devDependencies: {
      'concurrently': '^8.2.0',
      '@types/node': '^20.0.0',
      'typescript': '^5.0.0',
      'prettier': '^3.0.0',
      'eslint': '^8.0.0',
      'husky': '^8.0.0',
      'lint-staged': '^13.0.0'
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    },
    keywords: [
      'fullstack',
      'react',
      'nodejs',
      'typescript',
      app.stack.frontend,
      app.stack.backend,
      app.stack.database,
      'generated-by-flashfusion'
    ],
    license: 'MIT'
  }, null, 2);
}

function generateEnhancedEnvExample(app: GeneratedApp): string {
  return `# Environment Configuration
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/${app.name.toLowerCase().replace(/\s+/g, '_')}"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# API Configuration
API_PORT=3001
API_BASE_URL="http://localhost:3001"

# Frontend Configuration
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET="your-session-secret-here"

# Email (optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# External Services (optional)
REDIS_URL=""
STRIPE_SECRET_KEY=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
`;
}

function generateEnhancedDockerCompose(app: GeneratedApp): string {
  return `version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3001/api
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/${app.name.toLowerCase().replace(/\s+/g, '_')}
      - JWT_SECRET=dev-jwt-secret
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${app.name.toLowerCase().replace(/\s+/g, '_')}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
`;
}

function generateProductionDockerCompose(app: GeneratedApp): string {
  return `version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
      - CORS_ORIGIN=\${CORS_ORIGIN}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=\${POSTGRES_DB}
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
`;
}

// Additional generator functions for development tools

function generateESLintConfig(): string {
  return `module.exports = {
  root: true,
  extends: [
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};`;
}

function generatePrettierConfig(): string {
  return JSON.stringify({
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false
  }, null, 2);
}

function generateJestConfig(): string {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};`;
}

function generateTSConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022'],
      module: 'commonjs',
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.ts']
  }, null, 2);
}

function generateFrontendTests(app: GeneratedApp): string {
  return `import { render, screen } from '@testing-library/react';
import App from '../App';

describe('${app.name} Frontend', () => {
  test('renders main application', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('displays application title', () => {
    render(<App />);
    expect(screen.getByText('${app.name}')).toBeInTheDocument();
  });
});`;
}

function generateBackendTests(app: GeneratedApp): string {
  return `import request from 'supertest';
import app from '../app';

describe('${app.name} Backend API', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/users requires authentication', async () => {
    await request(app)
      .get('/api/users')
      .expect(401);
  });
});`;
}

function generateAuthTests(app: GeneratedApp): string {
  return `import request from 'supertest';
import app from '../app';

describe('Authentication', () => {
  test('POST /api/auth/login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);
    
    expect(response.body.token).toBeDefined();
  });

  test('POST /api/auth/login with invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
  });
});`;
}

function generateGitHubActionsCI(app: GeneratedApp): string {
  return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_${app.name.toLowerCase().replace(/\s+/g, '_')}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm run setup
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_${app.name.toLowerCase().replace(/\s+/g, '_')}
    
    - name: Build application
      run: npm run build
`;
}

function generateGitHubActionsDeploy(app: GeneratedApp): string {
  return `name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm run setup
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to production
      run: npm run deploy:production
      env:
        DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;
}

function generateIssueTemplate(type: 'bug' | 'feature'): string {
  if (type === 'bug') {
    return `---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.`;
  } else {
    return `---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: 'enhancement'
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.`;
  }
}

function generateEnhancedGitIgnore(): string {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output/

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Logs
logs
*.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore

# Build outputs
build/
dist/

# TypeScript
*.tsbuildinfo

# Test coverage
coverage/

# E2E test artifacts
test-results/
playwright-report/

# Local development
.local/`;
}

function generateMITLicense(app: GeneratedApp): string {
  const year = new Date().getFullYear();
  return `MIT License

Copyright (c) ${year} ${app.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
}

function generateChangelog(app: GeneratedApp): string {
  return `# Changelog

All notable changes to ${app.name} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### Added
${app.features.map(feature => `- ${feature}`).join('\n')}

### Changed
- Initial release generated by FlashFusion

### Security
- JWT-based authentication implemented
- Input validation and sanitization
- CORS configuration
`;
}

function generateFlashFusionMetadata(app: GeneratedApp, options: EnhancedDownloadOptions): string {
  return JSON.stringify({
    generator: {
      name: 'FlashFusion',
      version: '2.0.0',
      url: 'https://flashfusion.dev'
    },
    project: {
      name: app.name,
      description: app.description,
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      stack: app.stack,
      features: app.features,
      endpoints: app.endpoints
    },
    options: {
      format: options.format,
      includeDocumentation: options.generateDocumentation,
      includeTests: options.generateTests,
      customBranding: options.customBranding
    },
    stats: {
      totalFiles: app.files.length,
      codeFiles: app.files.filter(f => f.type === 'frontend' || f.type === 'backend').length,
      configFiles: app.files.filter(f => f.type === 'config').length,
      databaseFiles: app.files.filter(f => f.type === 'database').length
    }
  }, null, 2);
}

function generateGenerationReport(app: GeneratedApp, options: EnhancedDownloadOptions): string {
  const timestamp = new Date().toLocaleString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generation Report - ${app.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem; line-height: 1.6; }
    .header { background: #f8f9fa; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; }
    .section { margin-bottom: 2rem; }
    .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .feature-item { background: #e3f2fd; padding: 1rem; border-radius: 4px; }
    .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tech-badge { background: #2196f3; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .stat-card { background: #f5f5f5; padding: 1rem; border-radius: 4px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${app.name}</h1>
    <p>${app.description}</p>
    <p><strong>Generated:</strong> ${timestamp}</p>
    <p><strong>Powered by:</strong> <a href="https://flashfusion.dev">FlashFusion</a></p>
  </div>

  <div class="section">
    <h2>Technology Stack</h2>
    <div class="tech-stack">
      <span class="tech-badge">Frontend: ${app.stack.frontend}</span>
      <span class="tech-badge">Backend: ${app.stack.backend}</span>
      <span class="tech-badge">Database: ${app.stack.database}</span>
      <span class="tech-badge">Auth: ${app.stack.auth}</span>
      <span class="tech-badge">Deploy: ${app.stack.deployment}</span>
    </div>
  </div>

  <div class="section">
    <h2>Features Included</h2>
    <div class="feature-list">
      ${app.features.map(feature => `<div class="feature-item">✅ ${feature}</div>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Project Statistics</h2>
    <div class="stats">
      <div class="stat-card">
        <h3>${app.files.length}</h3>
        <p>Total Files</p>
      </div>
      <div class="stat-card">
        <h3>${app.endpoints.length}</h3>
        <p>API Endpoints</p>
      </div>
      <div class="stat-card">
        <h3>${app.features.length}</h3>
        <p>Features</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Next Steps</h2>
    <ol>
      <li>Extract the project files</li>
      <li>Install dependencies: <code>npm run setup</code></li>
      <li>Configure environment variables</li>
      <li>Start development: <code>npm run dev</code></li>
      <li>Begin customization</li>
    </ol>
  </div>

  <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #ddd; text-align: center; color: #666;">
    <p>Generated by FlashFusion - The AI-powered full-stack development platform</p>
    <p><a href="https://flashfusion.dev">Visit FlashFusion</a></p>
  </footer>
</body>
</html>`;
}