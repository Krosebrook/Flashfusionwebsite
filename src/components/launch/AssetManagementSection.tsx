import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import type { AssetManagementSectionProps } from './LaunchPreparationHub.types';

/**
 * Displays launch assets and their progress for quick review.
 */
export function AssetManagementSection({
  assets,
  selectedAssetId,
  onSelectAsset,
}: AssetManagementSectionProps) {
  const documentationAssets = assets.filter((asset) => asset.type === 'documentation');

  if (documentationAssets.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {documentationAssets.map((asset) => {
        const isSelected = selectedAssetId === asset.id;
        return (
          <Card
            key={asset.id}
            className={`bg-[var(--ff-surface)] border-[var(--border)] transition-colors ${
              isSelected ? 'ring-2 ring-[var(--ff-primary)]' : ''
            }`}
            onClick={() => onSelectAsset?.(asset)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={asset.status === 'approved' ? 'default' : asset.status === 'review' ? 'secondary' : 'outline'}>
                  {asset.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {asset.priority}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-1">{asset.title}</h4>
                <p className="text-xs text-[var(--ff-text-muted)]">{asset.description}</p>
              </div>
              <div>
                <Progress value={asset.progress} className="h-1 mb-2" />
                <p className="text-xs text-[var(--ff-text-muted)]">{asset.progress}% complete</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
