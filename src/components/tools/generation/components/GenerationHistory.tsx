/**
 * @fileoverview Generation History Component
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { ScrollArea } from '../../../ui/scroll-area';
import { Separator } from '../../../ui/separator';
import { 
  History, 
  RefreshCw, 
  Trash2, 
  Clock, 
  DollarSign,
  Eye,
  Star,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { type GenerationHistoryEntry } from '../../../../types/image-generation';

interface GenerationHistoryProps {
  history: GenerationHistoryEntry[];
  onClearHistory: () => void;
  onRegenerateFromHistory: (request: GenerationHistoryEntry['request']) => void;
}

export function GenerationHistory({
  history,
  onClearHistory,
  onRegenerateFromHistory
}: GenerationHistoryProps): JSX.Element {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpanded = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const handleCopyPrompt = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 rounded-full bg-[var(--ff-surface)]">
          <History className="h-8 w-8 text-[var(--ff-text-muted)]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-[var(--ff-text-primary)]">No generation history</h3>
          <p className="text-[var(--ff-text-secondary)] max-w-md">
            Your generation history will appear here. Start creating images to build your history!
          </p>
        </div>
      </div>
    );
  }

  const totalCost = history.reduce((sum, entry) => sum + entry.totalCost, 0);
  const totalImages = history.reduce((sum, entry) => sum + entry.images.length, 0);
  const avgSuccessRate = history.reduce((sum, entry) => sum + entry.successRate, 0) / history.length;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ff-card">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Total Sessions</p>
                <p className="text-2xl font-bold text-[var(--ff-text-primary)]">{history.length}</p>
              </div>
              <History className="h-8 w-8 text-[var(--ff-primary)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Images Created</p>
                <p className="text-2xl font-bold text-[var(--ff-text-primary)]">{totalImages}</p>
              </div>
              <Eye className="h-8 w-8 text-[var(--ff-secondary)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Success Rate</p>
                <p className="text-2xl font-bold text-[var(--ff-text-primary)]">
                  {(avgSuccessRate * 100).toFixed(0)}%
                </p>
              </div>
              <Star className="h-8 w-8 text-[var(--ff-accent)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Total Cost</p>
                <p className="text-2xl font-bold text-[var(--ff-text-primary)]">
                  ${totalCost.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-[var(--ff-success)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card className="ff-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-[var(--ff-secondary)]" />
              Generation History
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearHistory}
              className="ff-btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-4">
              {history.map((entry, index) => {
                const isExpanded = expandedEntries.has(entry.id);
                const hasNotes = entry.notes && entry.notes.trim().length > 0;
                
                return (
                  <Card key={entry.id} className="bg-[var(--ff-surface-light)]/30 border-[var(--border)]">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{history.length - index}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {entry.request.model}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {entry.request.style}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-[var(--ff-text-muted)]">
                                <Clock className="h-3 w-3" />
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <p className="text-sm text-[var(--ff-text-primary)] line-clamp-2">
                              {entry.request.prompt}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(entry.id)}
                            className="ml-2"
                          >
                            <Eye className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between text-xs text-[var(--ff-text-muted)]">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{entry.images.length} images</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{(entry.totalTime / 1000).toFixed(1)}s</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${entry.totalCost.toFixed(3)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{(entry.successRate * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyPrompt(entry.request.prompt)}
                              className="h-6 px-2"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRegenerateFromHistory(entry.request)}
                              className="h-6 px-2"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              {/* Full Prompt */}
                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                  Full Prompt
                                </h5>
                                <p className="text-sm text-[var(--ff-text-secondary)] bg-[var(--ff-surface)]/50 p-3 rounded-lg">
                                  {entry.request.prompt}
                                </p>
                                {entry.request.negativePrompt && (
                                  <>
                                    <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                      Negative Prompt
                                    </h5>
                                    <p className="text-sm text-[var(--ff-text-secondary)] bg-[var(--ff-surface)]/50 p-3 rounded-lg">
                                      {entry.request.negativePrompt}
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* Settings */}
                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                  Generation Settings
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  <div className="text-xs">
                                    <span className="text-[var(--ff-text-muted)]">Aspect Ratio:</span>
                                    <div className="font-medium">{entry.request.aspectRatio}</div>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-[var(--ff-text-muted)]">Quality:</span>
                                    <div className="font-medium">{entry.request.quality}%</div>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-[var(--ff-text-muted)]">Batch Size:</span>
                                    <div className="font-medium">{entry.request.batchCount}</div>
                                  </div>
                                  {entry.request.seed && (
                                    <div className="text-xs">
                                      <span className="text-[var(--ff-text-muted)]">Seed:</span>
                                      <div className="font-medium">{entry.request.seed}</div>
                                    </div>
                                  )}
                                  {entry.request.steps && (
                                    <div className="text-xs">
                                      <span className="text-[var(--ff-text-muted)]">Steps:</span>
                                      <div className="font-medium">{entry.request.steps}</div>
                                    </div>
                                  )}
                                  {entry.request.guidanceScale && (
                                    <div className="text-xs">
                                      <span className="text-[var(--ff-text-muted)]">Guidance:</span>
                                      <div className="font-medium">{entry.request.guidanceScale}</div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Tags */}
                              {entry.tags.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                    Tags
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* User Notes */}
                              {hasNotes && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                    Notes
                                  </h5>
                                  <p className="text-sm text-[var(--ff-text-secondary)] bg-[var(--ff-surface)]/50 p-3 rounded-lg">
                                    {entry.notes}
                                  </p>
                                </div>
                              )}

                              {/* User Rating */}
                              {entry.userRating && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                    Your Rating
                                  </h5>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= entry.userRating!
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-[var(--ff-text-muted)]'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-sm text-[var(--ff-text-muted)] ml-2">
                                      {entry.userRating}/5
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Generated Images Preview */}
                              {entry.images.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                                    Generated Images ({entry.images.length})
                                  </h5>
                                  <div className="grid grid-cols-4 gap-2">
                                    {entry.images.slice(0, 8).map((image) => (
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
                                    {entry.images.length > 8 && (
                                      <div className="aspect-square rounded-lg bg-[var(--ff-surface)] flex items-center justify-center">
                                        <span className="text-xs text-[var(--ff-text-muted)]">
                                          +{entry.images.length - 8}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => onRegenerateFromHistory(entry.request)}
                                  className="ff-btn-primary"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Regenerate
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyPrompt(entry.request.prompt)}
                                  className="ff-btn-ghost"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Prompt
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}