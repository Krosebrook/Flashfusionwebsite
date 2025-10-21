import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Eye, X, RefreshCw, Download, AlertTriangle, Clock 
} from 'lucide-react';
import { 
  getStatusIcon, 
  getStatusColor, 
  getTypeIcon, 
  formatFileSize, 
  formatDuration,
  canRetryJob,
  canCancelJob
} from '../../../utils/data-import-export';
import type { JobCardProps, ImportJob, ExportJob } from '../../../types/data-import-export';

export function JobCard({ job, type, onCancel, onRetry, onDownload, onViewDetails }: JobCardProps) {
  const statusIconInfo = getStatusIcon(job.status);
  const isImportJob = 'source' in job;
  const sourceOrDestination = isImportJob ? (job as ImportJob).source : (job as ExportJob).destination;

  return (
    <Card className="ff-card-interactive">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(job.type)}</span>
              <span className={statusIconInfo.className}>
                {statusIconInfo.icon}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{job.name}</h3>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{isImportJob ? 'From' : 'To'}: {sourceOrDestination}</span>
                <span>•</span>
                <span>{job.format}</span>
                <span>•</span>
                <span>{formatFileSize(job.size * 1024 * 1024)}</span>
                <span>•</span>
                <span>
                  {isImportJob 
                    ? `${(job as ImportJob).recordsProcessed.toLocaleString()} / ${job.totalRecords.toLocaleString()}` 
                    : `${(job as ExportJob).recordsExported.toLocaleString()} / ${job.totalRecords.toLocaleString()}`
                  } records
                </span>
              </div>

              {job.status === 'processing' && (
                <div className="mt-2">
                  <Progress value={job.progress} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{job.progress}% complete</span>
                    <span>Started {formatDuration(job.startTime)} ago</span>
                  </div>
                </div>
              )}

              {isImportJob && (job as ImportJob).errors.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{(job as ImportJob).errors.length} error(s)</span>
                </div>
              )}

              {!isImportJob && (job as ExportJob).downloadUrl && job.status === 'completed' && (
                <div className="mt-2 flex items-center gap-2 text-sm text-success">
                  <Download className="w-4 h-4" />
                  <span>Ready for download</span>
                  {(job as ExportJob).expiresAt && (
                    <span className="text-muted-foreground">
                      • Expires {formatDuration(new Date(), (job as ExportJob).expiresAt)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(job)}
              className="ff-hover-scale"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>

            {canCancelJob(job) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(job.id, type)}
                className="text-destructive"
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}

            {canRetryJob(job) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRetry(job.id, type)}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}

            {!isImportJob && onDownload && (job as ExportJob).downloadUrl && job.status === 'completed' && (
              <Button
                size="sm"
                onClick={() => onDownload && onDownload(job as ExportJob)}
                className="ff-btn-primary"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}