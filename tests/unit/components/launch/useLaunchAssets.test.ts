import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLaunchAssets } from '@/components/launch/useLaunchAssets';
import { INITIAL_ASSETS } from '@/fixtures/launch/launch-preparation-fixtures';
import type { LaunchAsset } from '@/components/launch/LaunchPreparationHub.types';

describe('useLaunchAssets', () => {
  let assetsFixture: LaunchAsset[];

  beforeEach(() => {
    assetsFixture = INITIAL_ASSETS.map((asset) => ({ ...asset }));
  });

  it('should initialize state and compute statistics', () => {
    const { result } = renderHook(() => useLaunchAssets(assetsFixture));

    expect(result.current.assets).toHaveLength(assetsFixture.length);
    expect(result.current.statistics.total).toBe(assetsFixture.length);
    expect(result.current.sortedByPriority[0].priority).toBe('critical');
  });

  it('should add, update, and delete assets while maintaining selection', () => {
    const { result } = renderHook(() => useLaunchAssets(assetsFixture));

    const newAsset: LaunchAsset = {
      id: 'design-guide',
      type: 'documentation',
      title: 'Design System Guide',
      description: 'Covers typography, colors, and spacing.',
      status: 'draft',
      priority: 'medium',
      progress: 15,
      tags: ['design'],
      dueDate: new Date('2024-02-01T00:00:00.000Z'),
    };

    act(() => {
      result.current.addAsset(newAsset);
    });

    expect(result.current.assets).toContainEqual(newAsset);
    expect(result.current.sortedByDueDate[0].id).toBe('design-guide');

    act(() => {
      result.current.updateAsset('design-guide', { progress: 55, status: 'review' });
    });

    const updated = result.current.assets.find((asset) => asset.id === 'design-guide');
    expect(updated?.progress).toBe(55);
    expect(updated?.status).toBe('review');

    act(() => {
      result.current.setSelectedAsset(updated ?? null);
    });

    act(() => {
      result.current.deleteAsset('design-guide');
    });

    expect(result.current.assets.some((asset) => asset.id === 'design-guide')).toBe(false);
    expect(result.current.selectedAsset).toBeNull();
  });

  it('should support advanced filtering helpers', () => {
    const { result } = renderHook(() => useLaunchAssets(assetsFixture));

    const highPriority = result.current.getAssetsByPriority('critical');
    expect(highPriority.every((asset) => asset.priority === 'critical')).toBe(true);

    const documentationAssets = result.current.getAssetsByType('documentation');
    expect(documentationAssets.length).toBeGreaterThan(0);

    const filtered = result.current.filterBy({
      status: ['approved'],
      type: ['documentation'],
      minProgress: 50,
    });
    expect(filtered.every((asset) => asset.status === 'approved')).toBe(true);
  });
});
