import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMarketingCampaigns } from '@/components/launch/useMarketingCampaigns';
import { INITIAL_CAMPAIGNS } from '@/fixtures/launch/launch-preparation-fixtures';
import type { MarketingCampaign } from '@/components/launch/LaunchPreparationHub.types';

describe('useMarketingCampaigns', () => {
  let campaignsFixture: MarketingCampaign[];

  beforeEach(() => {
    campaignsFixture = INITIAL_CAMPAIGNS.map((campaign) => ({ ...campaign }));
  });

  it('should initialize campaign state and statistics', () => {
    const { result } = renderHook(() => useMarketingCampaigns(campaignsFixture));

    expect(result.current.campaigns).toHaveLength(campaignsFixture.length);
    expect(result.current.statistics.total).toBe(campaignsFixture.length);
    expect(result.current.statistics.totalBudget).toBeGreaterThan(0);
    expect(result.current.activeCampaigns).toHaveLength(0);
  });

  it('should add, update, and delete campaigns', () => {
    const { result } = renderHook(() => useMarketingCampaigns(campaignsFixture));

    const newCampaign: MarketingCampaign = {
      id: 'product-hunt',
      name: 'Product Hunt Feature',
      type: 'community',
      status: 'active',
      reach: 8000,
      engagement: 9.5,
      budget: 1500,
      roi: 120,
      startDate: new Date('2024-05-01T00:00:00.000Z'),
      endDate: new Date('2024-05-08T00:00:00.000Z'),
    };

    act(() => {
      result.current.addCampaign(newCampaign);
    });

    expect(result.current.campaigns).toContainEqual(newCampaign);
    expect(result.current.activeCampaigns.some((campaign) => campaign.id === 'product-hunt')).toBe(true);

    act(() => {
      result.current.updateCampaign('product-hunt', { roi: 180, status: 'completed' });
    });

    const updated = result.current.campaigns.find((campaign) => campaign.id === 'product-hunt');
    expect(updated?.roi).toBe(180);
    expect(updated?.status).toBe('completed');

    act(() => {
      result.current.deleteCampaign('product-hunt');
    });

    expect(result.current.campaigns.some((campaign) => campaign.id === 'product-hunt')).toBe(false);
    expect(result.current.selectedCampaign).toBeNull();
  });

  it('should support filtering and ROI helpers', () => {
    const { result } = renderHook(() => useMarketingCampaigns(campaignsFixture));

    const scheduled = result.current.getCampaignsByStatus('scheduled');
    expect(scheduled.every((campaign) => campaign.status === 'scheduled')).toBe(true);

    const emailCampaigns = result.current.getCampaignsByType('email');
    expect(emailCampaigns.every((campaign) => campaign.type === 'email')).toBe(true);

    const roiSnapshot = result.current.getCampaignROI({ ...campaignsFixture[0] });
    expect(roiSnapshot.roi).toBeTypeOf('number');
    expect(result.current.sortedByROI[0].roi).toBeGreaterThanOrEqual(result.current.sortedByROI[1]?.roi ?? 0);
  });
});
