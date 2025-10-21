/**
 * @fileoverview Batch Generation Manager Component
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { ScrollArea } from '../../../ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { type BatchGenerationJob } from '../../../../types/image-generation';

interface BatchGenerationManagerProps {
  jobs: BatchGenerationJob[];
  onStartJob: (jobId: string) => void;
  onPauseJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
}

export function BatchGenerationManager({
  jobs,
  onStartJob,
  onPauseJob,
  onCancelJob
}: BatchGenerationManagerProps): JSX.Element {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const getStatusIcon = (status: BatchGenerationJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: BatchGenerationJob['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 border-green-600/20';
      case 'failed':
        return 'text-red-600 border-red-600/20';
      case 'running':
        return 'text-blue-600 border-blue-600/20';
      case 'paused':
        return 'text-yellow-600 border-yellow-600/20';
      case 'cancelled':
        return 'text-gray-600 border-gray-600/20';
      default:
        return 'text-gray-500 border-gray-500/20';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 rounded-full bg-[var(--ff-surface)]">
          <Play className="h-8 w-8 text-[var(--ff-text-muted)]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-[var(--ff-text-primary)]">No batch jobs</h3>
          <p className="text-[var(--ff-text-secondary)] max-w-md">
            Batch generation jobs will appear here when you create them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-[var(--ff-primary)]" />
            Batch Generation Manager
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="bg-[var(--ff-surface-light)]/30 border-[var(--border)]">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <h4 className="font-semibold text-[var(--ff-text-primary)]">
                              {job.name}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(job.status)}`}
                            >
                              {job.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-[var(--ff-text-secondary)] line-clamp-2">
                            {job.baseRequest.prompt}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          {job.status === 'running' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPauseJob(job.id)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(job.status === 'paused' || job.status === 'queued') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onStartJob(job.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(job.status === 'running' || job.status === 'paused' || job.status === 'queued') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onCancelJob(job.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--ff-text-secondary)]">
                            Progress: {job.completedImages.length}/{job.promptVariations.length}
                          </span>
                          <span className="text-[var(--ff-text-secondary)]">
                            {job.progress.toFixed(0)}%
                          </span>
                        </div>
                        
                        <Progress value={job.progress} className="w-full" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Completed:</span>
                          <div className="font-medium text-green-600">
                            {job.completedImages.length}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Failed:</span>
                          <div className="font-medium text-red-600">
                            {job.failedGenerations.length}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Total Cost:</span>
                          <div className="font-medium text-[var(--ff-text-primary)]">
                            ${job.totalCost.toFixed(3)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Duration:</span>
                          <div className="font-medium text-[var(--ff-text-primary)]">
                            {job.endTime 
                              ? `${((job.endTime - job.startTime) / 1000).toFixed(0)}s`
                              : `${((Date.now() - job.startTime) / 1000).toFixed(0)}s`
                            }
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedJob === job.id && (
                        <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                          {/* Prompt Variations */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                              Prompt Variations ({job.promptVariations.length})
                            </h5>
                            <ScrollArea className="h-[200px] w-full">
                              <div className="space-y-2">
                                {job.promptVariations.map((prompt, index) => {
                                  const isCompleted = index < job.completedImages.length;
                                  const isFailed = job.failedGenerations.includes(prompt);
                                  
                                  return (
                                    <div 
                                      key={index}
                                      className={`p-3 rounded-lg border text-sm ${
                                        isCompleted 
                                          ? 'bg-green-50 border-green-200 text-green-800' :
                                        isFailed 
                                          ? 'bg-red-50 border-red-200 text-red-800' :
                                        'bg-[var(--ff-surface)]/50 border-[var(--border)] text-[var(--ff-text-secondary)]'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <span className="flex-1">{prompt}</span>
                                        <div className="ml-2">
                                          {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                                          {isFailed && <XCircle className="h-4 w-4 text-red-600" />}
                                          {!isCompleted && !isFailed && <Clock className="h-4 w-4 text-gray-400" />}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>

                          {/* Generated Images Preview */}
                          {job.completedImages.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                Generated Images ({job.completedImages.length})
                              </h5>
                              <div className="grid grid-cols-6 gap-2">
                                {job.completedImages.slice(0, 12).map((image) => (
                                  <div
                                    key={image.id}
                                    className="aspect-square rounded-lg overflow-hidden bg-[var(--ff-surface)] group cursor-pointer"
                                  >
                                    <img
                                      src={image.thumbnailUrl || image.url}
                                      alt={image.prompt}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                                {job.completedImages.length > 12 && (
                                  <div className="aspect-square rounded-lg bg-[var(--ff-surface)] flex items-center justify-center">
                                    <span className="text-xs text-[var(--ff-text-muted)]">
                                      +{job.completedImages.length - 12}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Job Settings */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                              Job Settings
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Model:</span>
                                <div className="font-medium">{job.baseRequest.model}</div>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Style:</span>
                                <div className="font-medium">{job.baseRequest.style}</div>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Quality:</span>
                                <div className="font-medium">{job.baseRequest.quality}%</div>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Aspect Ratio:</span>
                                <div className="font-medium">{job.baseRequest.aspectRatio}</div>
                              </div>
                            </div>
                          </div>

                          {/* Estimated Completion */}
                          {job.status === 'running' && job.estimatedCompletion && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-800">
                                  Estimated completion: {new Date(job.estimatedCompletion).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}