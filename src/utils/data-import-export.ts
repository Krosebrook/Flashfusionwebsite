import type { ImportJob, ExportJob, JobStatus, DataSourceType } from '../types/data-import-export';

export const getStatusIcon = (status: JobStatus) => {
  switch (status) {
    case 'completed':
      return { icon: '✅', className: 'text-success' };
    case 'processing':
      return { icon: '🔄', className: 'text-primary animate-spin' };
    case 'failed':
      return { icon: '❌', className: 'text-destructive' };
    case 'cancelled':
      return { icon: '⏹️', className: 'text-muted-foreground' };
    default:
      return { icon: '⏱️', className: 'text-warning' };
  }
};

export const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success border-success/20';
    case 'processing':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'failed':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'cancelled':
      return 'bg-muted/50 text-muted-foreground border-muted';
    default:
      return 'bg-warning/10 text-warning border-warning/20';
  }
};

export const getTypeIcon = (type: DataSourceType) => {
  switch (type) {
    case 'database':
      return '🗄️';
    case 'api':
      return '⚡';
    case 'cloud':
      return '☁️';
    case 'file':
      return '📄';
    default:
      return '💾';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatDuration = (start: Date, end?: Date): string => {
  const endTime = end || new Date();
  const diff = endTime.getTime() - start.getTime();
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const calculateProgress = (processed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((processed / total) * 100), 100);
};

export const generateJobId = (type: 'import' | 'export'): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateJobName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 100;
};

export const getJobTypeDisplayName = (type: DataSourceType): string => {
  switch (type) {
    case 'database':
      return 'Database';
    case 'api':
      return 'API';
    case 'cloud':
      return 'Cloud Storage';
    case 'file':
      return 'File';
    default:
      return 'Unknown';
  }
};

export const isJobExpired = (job: ExportJob): boolean => {
  if (!job.expiresAt) return false;
  return new Date() > job.expiresAt;
};

export const canRetryJob = (job: ImportJob | ExportJob): boolean => {
  return job.status === 'failed' || job.status === 'cancelled';
};

export const canCancelJob = (job: ImportJob | ExportJob): boolean => {
  return job.status === 'pending' || job.status === 'processing';
};

export const getJobEstimatedCompletion = (job: ImportJob | ExportJob): Date | null => {
  if (job.status !== 'processing' || job.progress === 0) return null;
  
  const elapsed = Date.now() - job.startTime.getTime();
  const rate = job.progress / elapsed;
  const remaining = (100 - job.progress) / rate;
  
  return new Date(Date.now() + remaining);
};

export const sortJobsByStatus = (jobs: (ImportJob | ExportJob)[]): (ImportJob | ExportJob)[] => {
  const statusPriority = {
    processing: 0,
    pending: 1,
    failed: 2,
    completed: 3,
    cancelled: 4
  };

  return jobs.sort((a, b) => {
    const priorityA = statusPriority[a.status];
    const priorityB = statusPriority[b.status];
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return b.startTime.getTime() - a.startTime.getTime();
  });
};

export const filterJobsByQuery = (
  jobs: (ImportJob | ExportJob)[],
  query: string
): (ImportJob | ExportJob)[] => {
  if (!query.trim()) return jobs;
  
  const lowercaseQuery = query.toLowerCase();
  return jobs.filter(job =>
    job.name.toLowerCase().includes(lowercaseQuery) ||
    ('source' in job ? job.source.toLowerCase().includes(lowercaseQuery) : 
     job.destination.toLowerCase().includes(lowercaseQuery)) ||
    job.format.toLowerCase().includes(lowercaseQuery)
  );
};

export const getJobStatistics = (jobs: (ImportJob | ExportJob)[]) => {
  const stats = {
    total: jobs.length,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    totalRecords: 0,
    totalSize: 0
  };

  jobs.forEach(job => {
    stats[job.status]++;
    if ('recordsProcessed' in job) {
      stats.totalRecords += job.recordsProcessed;
    } else {
      stats.totalRecords += job.recordsExported;
    }
    stats.totalSize += job.size;
  });

  return stats;
};