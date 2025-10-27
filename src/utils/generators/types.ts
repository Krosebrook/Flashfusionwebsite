/**
 * Core types and interfaces for FlashFusion file generation system
 */

import type { GeneratedApp } from '../../types/full-stack-builder';

export type { GeneratedApp };

export interface ProjectFileStructure {
  [path: string]: string | ProjectFileStructure;
}

export interface DownloadOptions {
  format: 'zip' | 'individual';
  includeNodeModules?: boolean;
  includeGitIgnore?: boolean;
}

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
