/**
 * Core download orchestration - brings together all generators
 */

import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { GeneratedApp, DownloadOptions, EnhancedDownloadOptions } from './types';
import {
  createProjectStructure,
  createEnhancedProjectStructure,
  addFilesToZip,
} from './project-structure';
import { generateRootPackageJson, generateEnhancedRootPackageJson } from './package-generators';
import {
  generateGitIgnore,
  generateEnhancedGitIgnore,
  generateEnhancedEnvExample,
  generateEnhancedDockerCompose,
  generateProductionDockerCompose,
  generateESLintConfig,
  generatePrettierConfig,
  generateJestConfig,
  generateTSConfig,
} from './config-generators';
import {
  generateProjectReadme,
  generateEnhancedReadme,
  generateDeploymentGuide,
  generateDevelopmentGuide,
  generateArchitectureGuide,
  generateAPIDocumentation,
  generateEnhancedDeploymentGuide,
  generateContributingGuide,
} from './documentation-generators';
import { generateFrontendTests, generateBackendTests, generateAuthTests } from './test-generators';
import {
  generateGitHubActionsCI,
  generateGitHubActionsDeploy,
  generateIssueTemplate,
} from './cicd-generators';
import {
  generateMITLicense,
  generateChangelog,
  generateFlashFusionMetadata,
  generateGenerationReport,
} from './metadata-generators';

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
        level: 6,
      },
    });

    saveAs(content, `${projectName}-fullstack-project.zip`);
  } catch (error) {
    console.error('Error generating downloadable project:', error);
    throw new Error('Failed to generate project files');
  }
}

/**
 * Enhanced download with progress tracking and multiple format support
 */
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
        level: options.format === 'zip' ? 6 : 0,
      },
    });

    onProgress?.(100, 'Download ready!');

    saveAs(content, `${projectName}-enhanced-fullstack-project.zip`);
  } catch (error) {
    console.error('Enhanced download failed:', error);
    throw new Error('Failed to generate enhanced project package');
  }
}

/**
 * Download individual file
 */
export function downloadFile(
  filename: string,
  content: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, filename);
}

/**
 * Download multiple files as separate downloads
 */
export async function downloadMultipleFiles(
  files: Array<{ name: string; content: string; type?: string }>
): Promise<void> {
  for (const file of files) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between downloads
    downloadFile(file.name, file.content, file.type || 'text/plain');
  }
}
