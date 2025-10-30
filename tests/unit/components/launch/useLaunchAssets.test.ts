import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useLaunchAssets } from '@/components/launch/useLaunchAssets';
import type { LaunchAsset } from '@/components/launch/LaunchPreparationHub.types';

const BASE_ASSETS: LaunchAsset[] = [
  {
    id: 'asset-1',
    type: 'documentation',
    title: 'User Manual',
    description: 'Comprehensive user guide',
    status: 'approved',
    priority: 'high',
    progress: 90,
    dueDate: new Date('2024-05-01'),
    tags: ['docs'],
  },
  {
    id: 'asset-2',
    type: 'video',
    title: 'Launch Teaser',
    description: 'Short teaser video',
    status: 'draft',
    priority: 'medium',
    progress: 40,
    tags: ['marketing'],
  },
  {
    id: 'asset-3',
    type: 'image',
    title: 'Social Graphic',
    description: 'Social launch image',
    status: 'review',
    priority: 'critical',
    progress: 75,
    dueDate: new Date('2024-04-15'),
    tags: ['creative'],
  },
];

describe('useLaunchAssets', () => {
  it('manages asset lifecycle and clears selections on delete', () => {
    const { result } = renderHook(() => useLaunchAssets(BASE_ASSETS));

    expect(result.current.assets).toHaveLength(3);

    act(() => {
      result.current.setSelectedAsset(result.current.assets[0]);
    });

    act(() => {
      result.current.addAsset({
        id: 'asset-4',
        type: 'press-kit',
        title: 'Press Kit',
        description: 'Media assets bundle',
        status: 'draft',
        priority: 'low',
        progress: 10,
        dueDate: new Date('2024-07-01'),
        tags: ['press'],
      });
    });

    expect(result.current.assets).toHaveLength(4);

    act(() => {
      result.current.updateAsset('asset-1', { status: 'published', progress: 100 });
    });

    expect(result.current.assets.find((asset) => asset.id === 'asset-1')?.status).toBe(
      'published'
    );
    expect(result.current.assets.find((asset) => asset.id === 'asset-1')?.progress).toBe(100);

    act(() => {
      result.current.deleteAsset('asset-1');
    });

    expect(result.current.assets.find((asset) => asset.id === 'asset-1')).toBeUndefined();
    expect(result.current.selectedAsset).toBeNull();
  });

  it('derives filtered collections and aggregate statistics', () => {
    const { result } = renderHook(() => useLaunchAssets(BASE_ASSETS));

    expect(result.current.sortedByPriority.map((asset) => asset.id)).toEqual([
      'asset-3',
      'asset-1',
      'asset-2',
    ]);

    expect(result.current.sortedByDueDate.map((asset) => asset.id)).toEqual([
      'asset-3',
      'asset-1',
      'asset-2',
    ]);

    expect(result.current.getAssetsByStatus('approved')).toHaveLength(1);
    expect(result.current.getAssetsByType('video')[0].id).toBe('asset-2');
    expect(result.current.getAssetsByPriority('critical')[0].id).toBe('asset-3');

    const filtered = result.current.filterBy({ minProgress: 80 });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('asset-1');

    expect(result.current.statistics).toMatchObject({
      total: 3,
      averageProgress: 68,
    });
    expect(result.current.statistics.byType.documentation).toBe(1);
    expect(result.current.statistics.byPriority.critical).toBe(1);
  });
});
