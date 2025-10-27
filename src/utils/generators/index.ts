/**
 * FlashFusion File Generation System
 *
 * This module provides a comprehensive set of utilities for generating
 * downloadable full-stack project files with proper structure, configuration,
 * and documentation.
 *
 * @module generators
 */

// Core types
export type {
  GeneratedApp,
  ProjectFileStructure,
  DownloadOptions,
  EnhancedDownloadOptions,
} from './types';

// Core download functions
export {
  generateDownloadableProject,
  generateEnhancedDownload,
  downloadFile,
  downloadMultipleFiles,
} from './core-download';

// Project structure utilities
export {
  createProjectStructure,
  createEnhancedProjectStructure,
  addFilesToZip,
} from './project-structure';

// Package.json generators
export {
  generateRootPackageJson,
  generateInstallablePackage,
  generateEnhancedRootPackageJson,
} from './package-generators';

// Configuration file generators
export {
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

// Documentation generators
export {
  generateProjectReadme,
  generateEnhancedReadme,
  generateDeploymentGuide,
  generateDevelopmentGuide,
  generateArchitectureGuide,
  generateAPIDocumentation,
  generateEnhancedDeploymentGuide,
  generateContributingGuide,
} from './documentation-generators';

// Test generators
export { generateFrontendTests, generateBackendTests, generateAuthTests } from './test-generators';

// CI/CD generators
export {
  generateGitHubActionsCI,
  generateGitHubActionsDeploy,
  generateIssueTemplate,
} from './cicd-generators';

// Metadata and reporting generators
export {
  generateMITLicense,
  generateChangelog,
  generateFlashFusionMetadata,
  generateGenerationReport,
} from './metadata-generators';
