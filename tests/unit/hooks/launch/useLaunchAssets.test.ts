import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLaunchAssets } from '@/components/launch/useLaunchAssets';
import { INITIAL_ASSETS } from '@/fixtures/launch/launch-preparation-fixtures';

describe('useLaunchAssets', () => {
  beforeEach(() => {
    // ensure deterministic IDs for new assets in individual tests
    vi.useRealTimers();
  });

  it('initialises with provided assets and exposes statistics', () => {
    const { result } = renderHook(() => useLaunchAssets(INITIAL_ASSETS));

    expect(result.current.assets).toHaveLength(INITIAL_ASSETS.length);
    expect(result.current.statistics.total).toBeGreaterThan(0);
    expect(result.current.sortedByPriority[0].priority).toBe('critical');
  });

  it('updates asset status and preserves derived metrics', () => {
    const { result } = renderHook(() => useLaunchAssets(INITIAL_ASSETS));
    const target = result.current.assets[0];

    act(() => {
      result.current.updateAsset(target.id, { status: 'published', progress: 100 });
    });

    expect(result.current.assets[0].status).toBe('published');
    expect(result.current.statistics.averageProgress).toBeGreaterThan(0);
  });

  it('removes assets and clears selection when deleted', () => {
    const { result } = renderHook(() => useLaunchAssets(INITIAL_ASSETS));

    act(() => {
      result.current.setSelectedAsset(result.current.assets[0]);
      result.current.deleteAsset(result.current.assets[0].id);
    });

    expect(result.current.assets).toHaveLength(INITIAL_ASSETS.length - 1);
    expect(result.current.selectedAsset).toBeNull();
  });

  it('filters assets based on priority criteria', () => {
    const { result } = renderHook(() => useLaunchAssets(INITIAL_ASSETS));

    const filtered = result.current.filterBy({ priority: ['critical'] });
    expect(filtered.every((asset) => asset.priority === 'critical')).toBe(true);

    const none = result.current.filterBy({ priority: ['non-existent' as never] });
    expect(none).toHaveLength(0);
  });
});
