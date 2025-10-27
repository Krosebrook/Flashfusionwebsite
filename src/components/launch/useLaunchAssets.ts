/**
 * @fileoverview Custom hook for managing launch assets
 * @chunk launch
 * @category marketing
 *
 * Extracted during Step 3: Component Decomposition - Phase 3
 * Manages state and operations for launch assets
 */

import { useState, useCallback, useMemo } from 'react';
import type { LaunchAsset } from './LaunchPreparationHub.types';
import { filterAssets, getAssetStatistics } from './LaunchPreparationHub.logic';

/**
 * Custom hook for managing launch assets
 * @param initialAssets - Initial assets to populate state
 * @returns Asset state and management functions
 */
export function useLaunchAssets(initialAssets: LaunchAsset[]) {
  const [assets, setAssets] = useState<LaunchAsset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<LaunchAsset | null>(null);

  /**
   * Add a new asset to the list
   */
  const addAsset = useCallback((asset: LaunchAsset) => {
    setAssets((prev) => [...prev, asset]);
  }, []);

  /**
   * Update an existing asset by ID
   */
  const updateAsset = useCallback((id: string, updates: Partial<LaunchAsset>) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updates } : asset))
    );
  }, []);

  /**
   * Delete an asset by ID
   */
  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    // Clear selection if the deleted asset was selected
    setSelectedAsset((prev) => (prev?.id === id ? null : prev));
  }, []);

  /**
   * Filter assets by status
   */
  const getAssetsByStatus = useCallback(
    (status: LaunchAsset['status']) => {
      return filterAssets(assets, { status: [status] });
    },
    [assets]
  );

  /**
   * Filter assets by type
   */
  const getAssetsByType = useCallback(
    (type: LaunchAsset['type']) => {
      return filterAssets(assets, { type: [type] });
    },
    [assets]
  );

  /**
   * Filter assets by priority
   */
  const getAssetsByPriority = useCallback(
    (priority: LaunchAsset['priority']) => {
      return filterAssets(assets, { priority: [priority] });
    },
    [assets]
  );

  /**
   * Sort assets by priority (critical > high > medium > low)
   */
  const sortedByPriority = useMemo(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...assets].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [assets]);

  /**
   * Get assets sorted by due date
   */
  const sortedByDueDate = useMemo(() => {
    return [...assets].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [assets]);

  /**
   * Get comprehensive asset statistics
   */
  const statistics = useMemo(() => {
    return getAssetStatistics(assets);
  }, [assets]);

  /**
   * Get assets filtered by multiple criteria
   */
  const filterBy = useCallback(
    (criteria: {
      status?: LaunchAsset['status'][];
      type?: LaunchAsset['type'][];
      priority?: LaunchAsset['priority'][];
      minProgress?: number;
    }) => {
      return filterAssets(assets, criteria);
    },
    [assets]
  );

  return {
    // State
    assets,
    selectedAsset,
    setSelectedAsset,

    // Mutations
    addAsset,
    updateAsset,
    deleteAsset,

    // Queries
    getAssetsByStatus,
    getAssetsByType,
    getAssetsByPriority,
    filterBy,

    // Computed values
    sortedByPriority,
    sortedByDueDate,
    statistics,
  };
}
