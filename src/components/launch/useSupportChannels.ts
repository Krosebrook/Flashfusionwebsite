/**
 * @fileoverview Custom hook for managing support channels
 * @chunk launch
 * @category marketing
 *
 * Extracted during Step 3: Component Decomposition - Phase 3
 * Manages state and operations for support channels
 */

import { useState, useCallback, useMemo } from 'react';
import type { SupportChannel } from './LaunchPreparationHub.types';
import { aggregateSupportMetrics } from './LaunchPreparationHub.logic';

/**
 * Custom hook for managing support channels
 * @param initialChannels - Initial channels to populate state
 * @returns Channel state and management functions
 */
export function useSupportChannels(initialChannels: SupportChannel[]) {
  const [channels, setChannels] = useState<SupportChannel[]>(initialChannels);
  const [activeChannel, setActiveChannel] = useState<SupportChannel | null>(null);

  /**
   * Add a new support channel
   */
  const addChannel = useCallback((channel: SupportChannel) => {
    setChannels((prev) => [...prev, channel]);
  }, []);

  /**
   * Update an existing channel by ID
   */
  const updateChannel = useCallback((id: string, updates: Partial<SupportChannel>) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, ...updates } : channel))
    );
  }, []);

  /**
   * Delete a channel by ID
   */
  const deleteChannel = useCallback((id: string) => {
    setChannels((prev) => prev.filter((channel) => channel.id !== id));
    // Clear selection if the deleted channel was active
    setActiveChannel((prev) => (prev?.id === id ? null : prev));
  }, []);

  /**
   * Get channels filtered by status
   */
  const getChannelsByStatus = useCallback(
    (status: SupportChannel['status']) => {
      return channels.filter((channel) => channel.status === status);
    },
    [channels]
  );

  /**
   * Get channels filtered by type
   */
  const getChannelsByType = useCallback(
    (type: SupportChannel['type']) => {
      return channels.filter((channel) => channel.type === type);
    },
    [channels]
  );

  /**
   * Get active channels (status === 'active')
   */
  const activeChannels = useMemo(() => {
    return channels.filter((channel) => channel.status === 'active');
  }, [channels]);

  /**
   * Get channels in testing (status === 'testing')
   */
  const testingChannels = useMemo(() => {
    return channels.filter((channel) => channel.status === 'testing');
  }, [channels]);

  /**
   * Get channels in setup (status === 'setup')
   */
  const setupChannels = useMemo(() => {
    return channels.filter((channel) => channel.status === 'setup');
  }, [channels]);

  /**
   * Get total support volume across all channels
   */
  const totalVolume = useMemo(() => {
    return channels.reduce((sum, channel) => sum + channel.volume, 0);
  }, [channels]);

  /**
   * Get average satisfaction rating across all channels
   */
  const averageSatisfaction = useMemo(() => {
    if (channels.length === 0) return 0;
    const totalSatisfaction = channels.reduce((sum, channel) => sum + channel.satisfaction, 0);
    return totalSatisfaction / channels.length;
  }, [channels]);

  /**
   * Get channels sorted by satisfaction (highest first)
   */
  const sortedBySatisfaction = useMemo(() => {
    return [...channels].sort((a, b) => b.satisfaction - a.satisfaction);
  }, [channels]);

  /**
   * Get channels sorted by volume (highest first)
   */
  const sortedByVolume = useMemo(() => {
    return [...channels].sort((a, b) => b.volume - a.volume);
  }, [channels]);

  /**
   * Get aggregated metrics for all channels
   */
  const metrics = useMemo(() => {
    return aggregateSupportMetrics(channels);
  }, [channels]);

  /**
   * Get channel status summary
   */
  const getChannelStatus = useCallback(
    (channel: SupportChannel) => {
      const isHealthy = channel.satisfaction >= 4.0 && channel.status === 'active';
      const needsAttention = channel.satisfaction < 3.5 || channel.status === 'setup';
      const inProgress = channel.status === 'testing';

      return {
        isHealthy,
        needsAttention,
        inProgress,
        statusLabel: isHealthy
          ? 'Healthy'
          : needsAttention
            ? 'Needs Attention'
            : 'In Progress',
      };
    },
    []
  );

  /**
   * Get channel health summary
   */
  const healthSummary = useMemo(() => {
    const healthy = channels.filter((ch) => ch.satisfaction >= 4.0 && ch.status === 'active')
      .length;
    const needsAttention = channels.filter((ch) => ch.satisfaction < 3.5 || ch.status === 'setup')
      .length;
    const inProgress = channels.filter((ch) => ch.status === 'testing').length;

    return {
      healthy,
      needsAttention,
      inProgress,
      total: channels.length,
    };
  }, [channels]);

  /**
   * Get channel statistics
   */
  const statistics = useMemo(() => {
    return {
      total: channels.length,
      active: activeChannels.length,
      testing: testingChannels.length,
      setup: setupChannels.length,
      totalVolume,
      averageSatisfaction,
      ...healthSummary,
    };
  }, [
    channels.length,
    activeChannels.length,
    testingChannels.length,
    setupChannels.length,
    totalVolume,
    averageSatisfaction,
    healthSummary,
  ]);

  return {
    // State
    channels,
    activeChannel,
    setActiveChannel,

    // Mutations
    addChannel,
    updateChannel,
    deleteChannel,

    // Queries
    getChannelsByStatus,
    getChannelsByType,
    getChannelStatus,

    // Computed values
    activeChannels,
    testingChannels,
    setupChannels,
    sortedBySatisfaction,
    sortedByVolume,
    metrics,
    statistics,
  };
}
