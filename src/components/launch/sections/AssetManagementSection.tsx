/**
 * @fileoverview Asset management section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { ScrollArea } from '../../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Check, ClipboardCheck, Edit, Trash2 } from 'lucide-react';
import type { LaunchAsset } from '../LaunchPreparationHub.types';

interface AssetManagementSectionProps {
  readonly selectedAsset: LaunchAsset | null;
  readonly onSelectAsset: (asset: LaunchAsset | null) => void;
  readonly onUpdateAsset: (id: string, updates: Partial<LaunchAsset>) => void;
  readonly onDeleteAsset: (id: string) => void;
  readonly sortedByPriority: LaunchAsset[];
  readonly averageProgress: number;
}

const STATUS_LABEL: Record<LaunchAsset['status'], string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  published: 'Published',
};

const PRIORITY_VARIANT: Record<LaunchAsset['priority'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
};

export function AssetManagementSection({
  selectedAsset,
  onSelectAsset,
  onUpdateAsset,
  onDeleteAsset,
  sortedByPriority,
  averageProgress,
}: AssetManagementSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Production</CardTitle>
        <CardDescription>Track readiness of documentation, media, and launch-critical deliverables.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">Average completion rate</p>
            <Badge variant="secondary">{Math.round(averageProgress)}% complete</Badge>
          </div>
          <Progress value={averageProgress} className="mt-3" />
        </div>

        <ScrollArea className="h-80 rounded-lg border">
          <div className="divide-y">
            {sortedByPriority.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectAsset(asset)}
                      className="text-left text-sm font-semibold hover:text-primary"
                    >
                      {asset.title}
                    </button>
                    <Badge variant={PRIORITY_VARIANT[asset.priority]}>{asset.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{asset.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Status: {STATUS_LABEL[asset.status]}</span>
                    <span>•</span>
                    <span>{asset.tags.join(', ')}</span>
                  </div>
                  <Progress value={asset.progress} className="h-2" />
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <Badge variant="outline">{asset.progress}% complete</Badge>
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateAsset(asset.id, { status: 'approved', progress: Math.max(asset.progress, 90) })}
                          >
                            <ClipboardCheck className="mr-2 h-4 w-4" /> Mark review ready
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Promote asset for stakeholder review.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button size="sm" variant="secondary" onClick={() => onUpdateAsset(asset.id, { status: 'published', progress: 100 })}>
                      <Check className="mr-2 h-4 w-4" /> Publish
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDeleteAsset(asset.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {selectedAsset ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">Selected asset</h3>
            <p className="text-sm text-muted-foreground">{selectedAsset.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant={PRIORITY_VARIANT[selectedAsset.priority]}>Priority: {selectedAsset.priority}</Badge>
              <Badge variant="secondary">Status: {STATUS_LABEL[selectedAsset.status]}</Badge>
              <Badge variant="outline">Tags: {selectedAsset.tags.join(', ')}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => onUpdateAsset(selectedAsset.id, { status: 'review' })}>
                <Edit className="mr-2 h-3 w-3" /> Request revisions
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onSelectAsset(null)}>
                Clear selection
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
