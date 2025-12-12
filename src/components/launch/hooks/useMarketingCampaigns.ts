/**
 * @fileoverview Custom hook for managing marketing campaigns
 * @chunk launch
 * @category marketing
 *
 * Extracted during Step 3: Component Decomposition - Phase 3
 * Manages state and operations for marketing campaigns
 */

import { useState, useCallback, useMemo } from 'react';
import type { MarketingCampaign } from '../LaunchPreparationHub.types';
import { calculateCampaignROI } from '../LaunchPreparationHub.logic';

/**
 * Custom hook for managing marketing campaigns
 * @param initialCampaigns - Initial campaigns to populate state
 * @returns Campaign state and management functions
 */
export function useMarketingCampaigns(initialCampaigns: MarketingCampaign[]) {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);

  /**
   * Add a new campaign to the list
   */
  const addCampaign = useCallback((campaign: MarketingCampaign) => {
    setCampaigns((prev) => [...prev, campaign]);
  }, []);

  /**
   * Update an existing campaign by ID
   */
  const updateCampaign = useCallback((id: string, updates: Partial<MarketingCampaign>) => {
    setCampaigns((prev) =>
      prev.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign))
    );
  }, []);

  /**
   * Delete a campaign by ID
   */
  const deleteCampaign = useCallback((id: string) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
    // Clear selection if the deleted campaign was selected
    setSelectedCampaign((prev) => (prev?.id === id ? null : prev));
  }, []);

  /**
   * Get campaigns filtered by status
   */
  const getCampaignsByStatus = useCallback(
    (status: MarketingCampaign['status']) => {
      return campaigns.filter((campaign) => campaign.status === status);
    },
    [campaigns]
  );

  /**
   * Get campaigns filtered by type
   */
  const getCampaignsByType = useCallback(
    (type: MarketingCampaign['type']) => {
      return campaigns.filter((campaign) => campaign.type === type);
    },
    [campaigns]
  );

  /**
   * Get active campaigns (status === 'active')
   */
  const activeCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => campaign.status === 'active');
  }, [campaigns]);

  /**
   * Get scheduled campaigns (status === 'scheduled')
   */
  const scheduledCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => campaign.status === 'scheduled');
  }, [campaigns]);

  /**
   * Calculate total budget across all campaigns
   */
  const totalBudget = useMemo(() => {
    return campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  }, [campaigns]);

  /**
   * Calculate total reach across all campaigns
   */
  const totalReach = useMemo(() => {
    return campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
  }, [campaigns]);

  /**
   * Calculate average engagement across all campaigns
   */
  const averageEngagement = useMemo(() => {
    if (campaigns.length === 0) return 0;
    const totalEngagement = campaigns.reduce((sum, campaign) => sum + campaign.engagement, 0);
    return totalEngagement / campaigns.length;
  }, [campaigns]);

  /**
   * Calculate detailed ROI metrics for a specific campaign
   */
  const getCampaignROI = useCallback((campaign: MarketingCampaign) => {
    return calculateCampaignROI(campaign);
  }, []);

  /**
   * Calculate overall portfolio ROI
   */
  const portfolioROI = useMemo(() => {
    if (campaigns.length === 0) return 0;
    const totalROI = campaigns.reduce((sum, campaign) => sum + campaign.roi, 0);
    return totalROI / campaigns.length;
  }, [campaigns]);

  /**
   * Get campaigns sorted by ROI (highest first)
   */
  const sortedByROI = useMemo(() => {
    return [...campaigns].sort((a, b) => b.roi - a.roi);
  }, [campaigns]);

  /**
   * Get campaigns sorted by reach (highest first)
   */
  const sortedByReach = useMemo(() => {
    return [...campaigns].sort((a, b) => b.reach - a.reach);
  }, [campaigns]);

  /**
   * Get campaign statistics
   */
  const statistics = useMemo(() => {
    return {
      total: campaigns.length,
      active: activeCampaigns.length,
      scheduled: scheduledCampaigns.length,
      totalBudget,
      totalReach,
      averageEngagement,
      portfolioROI,
    };
  }, [
    campaigns.length,
    activeCampaigns.length,
    scheduledCampaigns.length,
    totalBudget,
    totalReach,
    averageEngagement,
    portfolioROI,
  ]);

  return {
    // State
    campaigns,
    selectedCampaign,
    setSelectedCampaign,

    // Mutations
    addCampaign,
    updateCampaign,
    deleteCampaign,

    // Queries
    getCampaignsByStatus,
    getCampaignsByType,

    // Computed values
    activeCampaigns,
    scheduledCampaigns,
    sortedByROI,
    sortedByReach,
    statistics,

    // ROI calculations
    getCampaignROI,
  };
}
