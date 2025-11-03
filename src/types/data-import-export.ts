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