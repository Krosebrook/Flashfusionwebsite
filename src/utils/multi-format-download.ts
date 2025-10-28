import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { GeneratedApp } from '../types/full-stack-builder';

/**
 * Multi-Format Download System for FlashFusion
 * Provides downloadable content in various formats and packaging options
 */

export type DownloadFormat = 
  | 'zip' 
  | 'tar' 
  | 'individual' 
  | 'json' 
  | 'yaml' 
  | 'docker' 
  | 'github-template'
  | 'vscode-workspace'
  | 'npm-package'
  | 'code-only'
  | 'config-only';

export type CompressionLevel = 'none' | 'low' | 'medium' | 'high' | 'maximum';

export interface DownloadOptions {
  format: DownloadFormat;
  compression?: CompressionLevel;
  includeNodeModules?: boolean;
  includeDependencies?: boolean;
  includeDevDependencies?: boolean;
  includeDocumentation?: boolean;
  includeTests?: boolean;
  includeDockerFiles?: boolean;
  includeGitFiles?: boolean;
  includeVSCodeConfig?: boolean;
  includeCICD?: boolean;
  customName?: string;
  platformSpecific?: 'vercel' | 'netlify' | 'railway' | 'heroku' | 'aws' | 'azure' | 'gcp';
}

export interface FileExport {
  name: string;
  content: string;
  mimeType?: string;
  size?: number;
  encoding?: 'utf8' | 'base64' | 'binary';
}

export interface DownloadPackage {
  files: FileExport[];
  metadata: {
    generatedAt: string;
    format: DownloadFormat;
    totalFiles: number;
    totalSize: number;
    appName: string;
    version: string;
  };
}

/**
 * Main multi-format download function
 */
export async function downloadInFormat(
  app: GeneratedApp,
  options: DownloadOptions
): Promise<void> {
  const packageData = await prepareDownloadPackage(app, options);
  
  switch (options.format) {
    case 'zip':
      return await downloadAsZip(packageData, options);
    case 'tar':
      return await downloadAsTar(packageData, options);
    case 'individual':
      return await downloadAsIndividualFiles(packageData);
    case 'json':
      return await downloadAsJSON(packageData, app);
    case 'yaml':
      return await downloadAsYAML(packageData, app);
    case 'docker':
      return await downloadAsDockerPackage(packageData, app, options);
    case 'github-template':
      return await downloadAsGitHubTemplate(packageData, app);
    case 'vscode-workspace':
      return await downloadAsVSCodeWorkspace(packageData, app);
    case 'npm-package':
      return await downloadAsNPMPackage(packageData, app);
    case 'code-only':
      return await downloadCodeOnly(packageData, app);
    case 'config-only':
      return await downloadConfigOnly(packageData, app);
    default:
      throw new Error(`Unsupported download format: ${options.format}`);
  }
}

/**
 * Prepare download package with selected options
 */
async function prepareDownloadPackage(
  app: GeneratedApp,
  options: DownloadOptions
): Promise<DownloadPackage> {
  const files: FileExport[] = [];
  let totalSize = 0;

  // Core application files
  app.files.forEach(file => {
    const content = file.content;
    const size = new Blob([content]).size;
    files.push({
      name: file.path,
      content,
      mimeType: getMimeType(file.path),
      size,
      encoding: 'utf8'
    });
    totalSize += size;
  });

  // Documentation files
  if (options.includeDocumentation !== false) {
    const docs = generateDocumentationFiles(app);
    docs.forEach(doc => {
      const size = new Blob([doc.content]).size;
      files.push({ ...doc, size });
      totalSize += size;
    });
  }

  // Configuration files
  const configFiles = generateConfigurationFiles(app, options);
  configFiles.forEach(config => {
    const size = new Blob([config.content]).size;
    files.push({ ...config, size });
    totalSize += size;
  });

  // Git files
  if (options.includeGitFiles !== false) {
    files.push({
      name: '.gitignore',
      content: generateGitIgnore(),
      mimeType: 'text/plain',
      size: new Blob([generateGitIgnore()]).size
    });
  }

  // VS Code configuration
  if (options.includeVSCodeConfig) {
    const vscodeFiles = generateVSCodeConfig(app);
    vscodeFiles.forEach(file => {
      const size = new Blob([file.content]).size;
      files.push({ ...file, size });
      totalSize += size;
    });
  }

  // Docker files
  if (options.includeDockerFiles) {
    const dockerFiles = generateDockerFiles(app);
    dockerFiles.forEach(file => {
      const size = new Blob([file.content]).size;
      files.push({ ...file, size });
      totalSize += size;
    });
  }

  // CI/CD files
  if (options.includeCICD) {
    const cicdFiles = generateCICDFiles(app, options.platformSpecific);
    cicdFiles.forEach(file => {
      const size = new Blob([file.content]).size;
      files.push({ ...file, size });
      totalSize += size;
    });
  }

  // Tests
  if (options.includeTests) {
    const testFiles = generateTestFiles(app);
    testFiles.forEach(file => {
      const size = new Blob([file.content]).size;
      files.push({ ...file, size });
      totalSize += size;
    });
  }

  return {
    files,
    metadata: {
      generatedAt: new Date().toISOString(),
      format: options.format,
      totalFiles: files.length,
      totalSize,
      appName: app.name,
      version: '1.0.0'
    }
  };
}

/**
 * Download as ZIP archive
 */
async function downloadAsZip(
  packageData: DownloadPackage,
  options: DownloadOptions
): Promise<void> {
  const zip = new JSZip();
  const compressionLevel = getCompressionLevel(options.compression);

  // Add all files to zip
  packageData.files.forEach(file => {
    const pathParts = file.name.split('/');
    let currentFolder = zip;

    // Create nested folder structure
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      if (!currentFolder.folder(folderName)) {
        currentFolder = currentFolder.folder(folderName) || zip;
      } else {
        currentFolder = currentFolder.folder(folderName) || zip;
      }
    }

    // Add file to appropriate folder
    const fileName = pathParts[pathParts.length - 1];
    zip.file(file.name, file.content);
  });

  // Add metadata file
  zip.file('_flashfusion-metadata.json', JSON.stringify(packageData.metadata, null, 2));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: compressionLevel }
  });

  const fileName = options.customName || 
    `${packageData.metadata.appName.toLowerCase().replace(/\s+/g, '-')}-${packageData.metadata.format}.zip`;
  
  saveAs(content, fileName);
}

/**
 * Download as TAR archive (simulated using ZIP with different naming)
 */
async function downloadAsTar(
  packageData: DownloadPackage,
  options: DownloadOptions
): Promise<void> {
  // Note: Browser environments don't natively support TAR creation
  // We'll create a ZIP but name it as TAR for download consistency
  const zip = new JSZip();

  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  zip.file('_flashfusion-metadata.json', JSON.stringify(packageData.metadata, null, 2));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'STORE' // No compression for TAR-like behavior
  });

  const fileName = options.customName || 
    `${packageData.metadata.appName.toLowerCase().replace(/\s+/g, '-')}-${packageData.metadata.format}.tar.gz`;
  
  saveAs(content, fileName);
}

/**
 * Download as individual files
 */
async function downloadAsIndividualFiles(packageData: DownloadPackage): Promise<void> {
  for (let i = 0; i < packageData.files.length; i++) {
    const file = packageData.files[i];
    
    // Small delay between downloads to prevent browser blocking
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const blob = new Blob([file.content], { type: file.mimeType || 'text/plain' });
    const fileName = file.name.replace(/\//g, '_'); // Flatten path for individual downloads
    saveAs(blob, fileName);
  }

  // Download metadata last
  await new Promise(resolve => setTimeout(resolve, 200));
  const metadataBlob = new Blob([JSON.stringify(packageData.metadata, null, 2)], { 
    type: 'application/json' 
  });
  saveAs(metadataBlob, '_flashfusion-metadata.json');
}

/**
 * Download as JSON configuration
 */
async function downloadAsJSON(packageData: DownloadPackage, app: GeneratedApp): Promise<void> {
  const jsonExport = {
    metadata: packageData.metadata,
    app: {
      name: app.name,
      description: app.description,
      stack: app.stack,
      features: app.features,
      endpoints: app.endpoints
    },
    files: packageData.files.reduce((acc, file) => {
      acc[file.name] = file.content;
      return acc;
    }, {} as Record<string, string>),
    configuration: {
      package: generatePackageJSON(app),
      docker: generateDockerCompose(app),
      environment: generateEnvironmentConfig(app)
    }
  };

  const blob = new Blob([JSON.stringify(jsonExport, null, 2)], { type: 'application/json' });
  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-export.json`;
  saveAs(blob, fileName);
}

/**
 * Download as YAML configuration
 */
async function downloadAsYAML(packageData: DownloadPackage, app: GeneratedApp): Promise<void> {
  // Simple YAML conversion (for production, use a proper YAML library)
  const yamlContent = convertToYAML({
    metadata: packageData.metadata,
    app: {
      name: app.name,
      description: app.description,
      stack: app.stack,
      features: app.features,
      endpoints: app.endpoints
    },
    files: Object.fromEntries(packageData.files.map(f => [f.name, f.content]))
  });

  const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-export.yaml`;
  saveAs(blob, fileName);
}

/**
 * Download as Docker package
 */
async function downloadAsDockerPackage(
  packageData: DownloadPackage,
  app: GeneratedApp,
  options: DownloadOptions
): Promise<void> {
  const zip = new JSZip();

  // Add all application files
  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Add Docker-specific files
  zip.file('Dockerfile', generateDockerfile(app));
  zip.file('docker-compose.yml', generateDockerCompose(app));
  zip.file('docker-compose.prod.yml', generateDockerComposeProd(app));
  zip.file('.dockerignore', generateDockerIgnore());

  // Add Docker setup scripts
  zip.file('scripts/docker-setup.sh', generateDockerSetupScript(app));
  zip.file('scripts/docker-deploy.sh', generateDockerDeployScript(app));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-docker-package.zip`;
  saveAs(content, fileName);
}

/**
 * Download as GitHub template
 */
async function downloadAsGitHubTemplate(
  packageData: DownloadPackage,
  app: GeneratedApp
): Promise<void> {
  const zip = new JSZip();

  // Add all files
  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Add GitHub-specific files
  zip.file('.github/workflows/ci.yml', generateGitHubActions(app));
  zip.file('.github/workflows/deploy.yml', generateGitHubDeploy(app));
  zip.file('.github/ISSUE_TEMPLATE/bug_report.md', generateBugReportTemplate());
  zip.file('.github/ISSUE_TEMPLATE/feature_request.md', generateFeatureRequestTemplate());
  zip.file('.github/PULL_REQUEST_TEMPLATE.md', generatePRTemplate());
  zip.file('CONTRIBUTING.md', generateContributingGuide());
  zip.file('CODE_OF_CONDUCT.md', generateCodeOfConduct());

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-github-template.zip`;
  saveAs(content, fileName);
}

/**
 * Download as VS Code workspace
 */
async function downloadAsVSCodeWorkspace(
  packageData: DownloadPackage,
  app: GeneratedApp
): Promise<void> {
  const zip = new JSZip();

  // Add all files
  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Add VS Code workspace files
  const workspaceConfig = {
    folders: [
      { path: './frontend' },
      { path: './backend' }
    ],
    settings: generateVSCodeSettings(),
    extensions: generateVSCodeExtensions(),
    tasks: generateVSCodeTasks(app),
    launch: generateVSCodeLaunchConfig(app)
  };

  zip.file(`${app.name.toLowerCase().replace(/\s+/g, '-')}.code-workspace`, 
    JSON.stringify(workspaceConfig, null, 2));
  zip.file('.vscode/settings.json', JSON.stringify(workspaceConfig.settings, null, 2));
  zip.file('.vscode/extensions.json', JSON.stringify(workspaceConfig.extensions, null, 2));
  zip.file('.vscode/tasks.json', JSON.stringify(workspaceConfig.tasks, null, 2));
  zip.file('.vscode/launch.json', JSON.stringify(workspaceConfig.launch, null, 2));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-vscode-workspace.zip`;
  saveAs(content, fileName);
}

/**
 * Download as NPM package
 */
async function downloadAsNPMPackage(
  packageData: DownloadPackage,
  app: GeneratedApp
): Promise<void> {
  const zip = new JSZip();

  // Add all files
  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Add NPM-specific files
  zip.file('package.json', generateNPMPackageJSON(app));
  zip.file('.npmignore', generateNPMIgnore());
  zip.file('index.js', generateNPMIndex(app));
  zip.file('setup.js', generateNPMSetupScript(app));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-npm-package.zip`;
  saveAs(content, fileName);
}

/**
 * Download code files only (no config/docs)
 */
async function downloadCodeOnly(
  packageData: DownloadPackage,
  app: GeneratedApp
): Promise<void> {
  const zip = new JSZip();

  // Filter only code files
  const codeFiles = packageData.files.filter(file => 
    isCodeFile(file.name) && !isConfigFile(file.name)
  );

  codeFiles.forEach(file => {
    zip.file(file.name, file.content);
  });

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-code-only.zip`;
  saveAs(content, fileName);
}

/**
 * Download configuration files only
 */
async function downloadConfigOnly(
  packageData: DownloadPackage,
  app: GeneratedApp
): Promise<void> {
  const zip = new JSZip();

  // Filter only config files
  const configFiles = packageData.files.filter(file => isConfigFile(file.name));

  configFiles.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Add additional config files
  zip.file('package.json', generatePackageJSON(app));
  zip.file('docker-compose.yml', generateDockerCompose(app));
  zip.file('.env.example', generateEnvironmentExample(app));

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const fileName = `${app.name.toLowerCase().replace(/\s+/g, '-')}-config-only.zip`;
  saveAs(content, fileName);
}

// Utility functions

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'js': 'text/javascript',
    'ts': 'text/typescript',
    'tsx': 'text/typescript',
    'jsx': 'text/javascript',
    'json': 'application/json',
    'html': 'text/html',
    'css': 'text/css',
    'md': 'text/markdown',
    'yml': 'application/x-yaml',
    'yaml': 'application/x-yaml',
    'xml': 'application/xml',
    'txt': 'text/plain'
  };
  return mimeTypes[ext || ''] || 'text/plain';
}

function getCompressionLevel(level?: CompressionLevel): number {
  switch (level) {
    case 'none': return 0;
    case 'low': return 2;
    case 'medium': return 4;
    case 'high': return 6;
    case 'maximum': return 9;
    default: return 6;
  }
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.css', '.scss', '.html'];
  return codeExtensions.some(ext => filename.endsWith(ext));
}

function isConfigFile(filename: string): boolean {
  const configFiles = ['package.json', 'tsconfig.json', '.env', 'docker-compose.yml', 'Dockerfile'];
  const configExtensions = ['.config.js', '.config.ts', '.json', '.yml', '.yaml'];
  return configFiles.some(file => filename.includes(file)) ||
         configExtensions.some(ext => filename.endsWith(ext));
}

function convertToYAML(obj: any, indent = 0): string {
  const indentStr = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      yaml += `${indentStr}${key}:\n${convertToYAML(value, indent + 1)}`;
    } else if (Array.isArray(value)) {
      yaml += `${indentStr}${key}:\n`;
      value.forEach(item => {
        yaml += `${indentStr}  - ${JSON.stringify(item)}\n`;
      });
    } else {
      yaml += `${indentStr}${key}: ${JSON.stringify(value)}\n`;
    }
  }

  return yaml;
}

// Generator functions (simplified versions - full implementations would be more comprehensive)

function generateDocumentationFiles(app: GeneratedApp): FileExport[] {
  return [
    {
      name: 'README.md',
      content: `# ${app.name}\n\n${app.description}\n\n## Generated by FlashFusion\n\nThis project was generated using FlashFusion AI platform.`,
      mimeType: 'text/markdown'
    },
    {
      name: 'DEPLOYMENT.md',
      content: '# Deployment Guide\n\nDetailed deployment instructions for your application.',
      mimeType: 'text/markdown'
    }
  ];
}

function generateConfigurationFiles(app: GeneratedApp, options: DownloadOptions): FileExport[] {
  const files: FileExport[] = [];

  files.push({
    name: 'package.json',
    content: generatePackageJSON(app),
    mimeType: 'application/json'
  });

  if (options.includeDockerFiles) {
    files.push({
      name: 'docker-compose.yml',
      content: generateDockerCompose(app),
      mimeType: 'application/x-yaml'
    });
  }

  return files;
}

function generatePackageJSON(app: GeneratedApp): string {
  return JSON.stringify({
    name: app.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: app.description,
    scripts: {
      dev: 'concurrently "npm run dev:backend" "npm run dev:frontend"',
      build: 'npm run build:backend && npm run build:frontend',
      start: 'npm run start:backend'
    },
    dependencies: {},
    devDependencies: {
      concurrently: '^8.2.0'
    }
  }, null, 2);
}

function generateDockerCompose(app: GeneratedApp): string {
  return `version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  backend:
    build: ./backend
    ports:
      - "3001:3001"
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: ${app.name.toLowerCase().replace(/\s+/g, '_')}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"`;
}

function generateGitIgnore(): string {
  return `node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store`;
}

function generateVSCodeConfig(app: GeneratedApp): FileExport[] {
  return [
    {
      name: '.vscode/settings.json',
      content: JSON.stringify(generateVSCodeSettings(), null, 2),
      mimeType: 'application/json'
    },
    {
      name: '.vscode/extensions.json',
      content: JSON.stringify(generateVSCodeExtensions(), null, 2),
      mimeType: 'application/json'
    }
  ];
}

function generateVSCodeSettings(): object {
  return {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "typescript.preferences.importModuleSpecifier": "relative"
  };
}

function generateVSCodeExtensions(): object {
  return {
    recommendations: [
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next",
      "bradlc.vscode-tailwindcss"
    ]
  };
}

function generateVSCodeTasks(app: GeneratedApp): object {
  return {
    version: "2.0.0",
    tasks: [
      {
        label: "dev",
        type: "shell",
        command: "npm run dev",
        group: "build"
      }
    ]
  };
}

function generateVSCodeLaunchConfig(app: GeneratedApp): object {
  return {
    version: "0.2.0",
    configurations: [
      {
        name: "Launch Frontend",
        type: "node",
        request: "launch",
        program: "${workspaceFolder}/frontend/src/index.ts"
      }
    ]
  };
}

function generateDockerFiles(app: GeneratedApp): FileExport[] {
  return [
    {
      name: 'Dockerfile',
      content: generateDockerfile(app),
      mimeType: 'text/plain'
    },
    {
      name: '.dockerignore',
      content: generateDockerIgnore(),
      mimeType: 'text/plain'
    }
  ];
}

function generateDockerfile(app: GeneratedApp): string {
  return `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`;
}

function generateDockerIgnore(): string {
  return `node_modules
.git
.env
*.log`;
}

function generateDockerComposeProd(app: GeneratedApp): string {
  return generateDockerCompose(app).replace('ports:', 'ports:\n    # Production ports');
}

function generateDockerSetupScript(app: GeneratedApp): string {
  return `#!/bin/bash
echo "Setting up ${app.name} with Docker..."
docker-compose build
docker-compose up -d
echo "Setup complete!"`;
}

function generateDockerDeployScript(app: GeneratedApp): string {
  return `#!/bin/bash
echo "Deploying ${app.name}..."
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
echo "Deployment complete!"`;
}

function generateCICDFiles(app: GeneratedApp, platform?: string): FileExport[] {
  const files: FileExport[] = [];

  files.push({
    name: '.github/workflows/ci.yml',
    content: generateGitHubActions(app),
    mimeType: 'application/x-yaml'
  });

  if (platform) {
    files.push({
      name: `.github/workflows/deploy-${platform}.yml`,
      content: generatePlatformDeploy(app, platform),
      mimeType: 'application/x-yaml'
    });
  }

  return files;
}

function generateGitHubActions(app: GeneratedApp): string {
  return `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test`;
}

function generateGitHubDeploy(app: GeneratedApp): string {
  return `name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: echo "Deploy ${app.name}"`;
}

function generatePlatformDeploy(app: GeneratedApp, platform: string): string {
  return `name: Deploy to ${platform}
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to ${platform}
        run: echo "Deploying ${app.name} to ${platform}"`;
}

function generateTestFiles(app: GeneratedApp): FileExport[] {
  return [
    {
      name: 'tests/example.test.ts',
      content: `describe('${app.name}', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});`,
      mimeType: 'text/typescript'
    }
  ];
}

function generateBugReportTemplate(): string {
  return `---
name: Bug report
about: Create a report to help us improve
---

**Describe the bug**
A clear description of what the bug is.

**Steps to reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.`;
}

function generateFeatureRequestTemplate(): string {
  return `---
name: Feature request
about: Suggest an idea for this project
---

**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.`;
}

function generatePRTemplate(): string {
  return `## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added`;
}

function generateContributingGuide(): string {
  return `# Contributing Guide

Thank you for your interest in contributing!

## Development Setup
1. Fork the repository
2. Clone your fork
3. Install dependencies: \`npm install\`
4. Start development: \`npm run dev\`

## Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed`;
}

function generateCodeOfConduct(): string {
  return `# Code of Conduct

## Our Pledge
We pledge to make participation in our community a harassment-free experience for everyone.

## Standards
Examples of behavior that contributes to a positive environment:
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community`;
}

function generateNPMPackageJSON(app: GeneratedApp): string {
  return JSON.stringify({
    name: `@flashfusion/${app.name.toLowerCase().replace(/\s+/g, '-')}`,
    version: '1.0.0',
    description: app.description,
    main: 'index.js',
    scripts: {
      postinstall: 'node setup.js'
    },
    keywords: ['flashfusion', 'generated'],
    author: 'FlashFusion',
    license: 'MIT'
  }, null, 2);
}

function generateNPMIgnore(): string {
  return `src/
tests/
*.test.js
.env`;
}

function generateNPMIndex(app: GeneratedApp): string {
  return `#!/usr/bin/env node
console.log('Setting up ${app.name}...');
require('./setup.js');`;
}

function generateNPMSetupScript(app: GeneratedApp): string {
  return `const fs = require('fs');
const path = require('path');

console.log('Setting up ${app.name} project...');

// Create project structure
// Add setup logic here

console.log('Setup complete!');`;
}

function generateEnvironmentConfig(app: GeneratedApp): Record<string, string> {
  return {
    NODE_ENV: 'development',
    DATABASE_URL: 'postgresql://localhost:5432/app',
    JWT_SECRET: 'your-secret-key'
  };
}

function generateEnvironmentExample(app: GeneratedApp): string {
  const config = generateEnvironmentConfig(app);
  return Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export {
  type DownloadFormat,
  type CompressionLevel,
  type DownloadOptions,
  type FileExport,
  type DownloadPackage
};