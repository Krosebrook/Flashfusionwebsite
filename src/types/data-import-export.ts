/**
 * @fileoverview Data import/export type definitions
 * @module types/data-import-export
 */

/**
 * Import job for importing data from external sources
 * @interface ImportJob
 * @property {string} id - Unique job identifier
 * @property {string} name - Job name
 * @property {'file' | 'database' | 'api' | 'cloud'} type - Import source type
 * @property {string} source - Source location or identifier
 * @property {'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'} status - Job status
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} format - Data format (CSV, JSON, etc.)
 * @property {number} size - Data size in bytes
 * @property {number} recordsProcessed - Number of records processed
 * @property {number} totalRecords - Total number of records
 * @property {Date} startTime - Job start time
 * @property {Date} [endTime] - Job end time
 * @property {string[]} errors - Error messages
 * @property {Record<string, string>} [mapping] - Field mapping configuration
 */
export interface ImportJob {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'cloud';
  source: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  format: string;
  size: number;
  recordsProcessed: number;
  totalRecords: number;
  startTime: Date;
  endTime?: Date;
  errors: string[];
  mapping?: Record<string, string>;
}

/**
 * Export job for exporting data to external destinations
 * @interface ExportJob
 * @property {string} id - Unique job identifier
 * @property {string} name - Job name
 * @property {'file' | 'database' | 'api' | 'cloud'} type - Export destination type
 * @property {string} destination - Destination location or identifier
 * @property {'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'} status - Job status
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} format - Data format (CSV, JSON, etc.)
 * @property {number} size - Data size in bytes
 * @property {number} recordsExported - Number of records exported
 * @property {number} totalRecords - Total number of records
 * @property {Date} startTime - Job start time
 * @property {Date} [endTime] - Job end time
 * @property {string} [downloadUrl] - Download URL for exported file
 * @property {Date} [expiresAt] - Download URL expiration time
 */
export interface ExportJob {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'cloud';
  destination: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  format: string;
  size: number;
  recordsExported: number;
  totalRecords: number;
  startTime: Date;
  endTime?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

/**
 * External data source configuration
 * @interface DataSource
 * @property {string} id - Unique source identifier
 * @property {string} name - Source name
 * @property {'database' | 'api' | 'file' | 'cloud'} type - Source type
 * @property {string} provider - Provider name (e.g., PostgreSQL, AWS S3)
 * @property {string} icon - Icon identifier or URL
 * @property {boolean} connected - Connection status
 * @property {Date} lastSync - Last synchronization time
 * @property {'active' | 'error' | 'inactive'} syncStatus - Sync status
 * @property {Record<string, any>} config - Source configuration
 * @property {string[]} supportedFormats - Supported data formats
 */
export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  provider: string;
  icon: string;
  connected: boolean;
  lastSync: Date;
  syncStatus: 'active' | 'error' | 'inactive';
  config: Record<string, any>;
  supportedFormats: string[];
}

/**
 * Data template for import/export operations
 * @interface DataTemplate
 */
export interface DataTemplate {
  id: string;
  name: string;
  description: string;
  type: 'import' | 'export';
  format: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    example: string;
  }>;
  sampleData: any[];
}

export interface DataImportExportHubProps {
  onClose?: () => void;
}

export interface JobCardProps {
  job: ImportJob | ExportJob;
  type: 'import' | 'export';
  onCancel: (jobId: string, type: 'import' | 'export') => void;
  onRetry: (jobId: string, type: 'import' | 'export') => void;
  onDownload?: (job: ExportJob) => void;
  onViewDetails: (job: ImportJob | ExportJob) => void;
}

export interface DataSourceCardProps {
  source: DataSource;
  onConnect: (sourceId: string) => void;
  onDisconnect: (sourceId: string) => void;
  onConfigure: (source: DataSource) => void;
}

export interface TemplateCardProps {
  template: DataTemplate;
  onUse: (template: DataTemplate) => void;
  onPreview: (template: DataTemplate) => void;
}

export type JobStatus = ImportJob['status'];
export type DataSourceType = DataSource['type'];
export type TemplateType = DataTemplate['type'];