/**
 * Project structure creation and file management utilities
 */

import JSZip from 'jszip';
import type { GeneratedApp, ProjectFileStructure, EnhancedDownloadOptions } from './types';

/**
 * Create the complete project file structure
 */
export function createProjectStructure(app: GeneratedApp): ProjectFileStructure {
  const structure: ProjectFileStructure = {};

  // Organize files by type and location
  app.files.forEach((file) => {
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
 * Create enhanced project structure with additional features
 */
export function createEnhancedProjectStructure(
  app: GeneratedApp,
  options: EnhancedDownloadOptions
): ProjectFileStructure {
  const structure = createProjectStructure(app);

  // Add enhanced structure elements
  if (options.generateTests) {
    structure['tests'] = {
      frontend: {},
      backend: {},
      e2e: {},
      integration: {},
    };
  }

  if (options.includeAnalytics) {
    structure['analytics'] = {
      'tracking.js': '// Analytics tracking implementation',
      'reports.js': '// Analytics reports generation',
    };
  }

  return structure;
}

/**
 * Recursively add files to zip archive
 */
export async function addFilesToZip(
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
