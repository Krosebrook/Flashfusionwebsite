import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useMarketingCampaigns } from '@/components/launch/useMarketingCampaigns';
import type { MarketingCampaign } from '@/components/launch/LaunchPreparationHub.types';

const BASE_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'campaign-1',
    name: 'Social Launch',
    type: 'social',
    status: 'active',
    reach: 12000,
    engagement: 6,
    budget: 1500,
    roi: 140,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
  },
  {
    id: 'campaign-2',
    name: 'Email Warmup',
    type: 'email',
    status: 'scheduled',
    reach: 8000,
    engagement: 4,
    budget: 800,
    roi: 90,
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-07'),
  },
  {
    id: 'campaign-3',
    name: 'Press Outreach',
    type: 'press',
    status: 'planning',
    reach: 5000,
    engagement: 3,
    budget: 1200,
    roi: 75,
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-20'),
  },
];

describe('useMarketingCampaigns', () => {
  it('manages campaign lifecycle and updates derived statistics', () => {
    const { result } = renderHook(() => useMarketingCampaigns(BASE_CAMPAIGNS));

    expect(result.current.statistics.total).toBe(3);
    expect(result.current.statistics.active).toBe(1);
    expect(result.current.statistics.scheduled).toBe(1);
    expect(result.current.statistics.totalBudget).toBe(3500);
    expect(result.current.statistics.totalReach).toBe(25000);
    expect(result.current.statistics.averageEngagement).toBeCloseTo(4.33, 2);
    expect(result.current.statistics.portfolioROI).toBeCloseTo(101.67, 2);

    act(() => {
      result.current.addCampaign({
        id: 'campaign-4',
        name: 'Influencer Series',
        type: 'influencer',
        status: 'active',
        reach: 6000,
        engagement: 5,
        budget: 900,
        roi: 110,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-14'),
      });
    });

    expect(result.current.campaigns).toHaveLength(4);
    expect(result.current.getCampaignsByStatus('active')).toHaveLength(2);

    act(() => {
      result.current.updateCampaign('campaign-2', { status: 'active' });
    });

    expect(result.current.getCampaignsByStatus('active')).toHaveLength(3);

    act(() => {
      result.current.setSelectedCampaign(
        result.current.campaigns.find((campaign) => campaign.id === 'campaign-3') ?? null
      );
      result.current.deleteCampaign('campaign-3');
    });

    expect(result.current.campaigns).toHaveLength(3);
    expect(result.current.selectedCampaign).toBeNull();
    expect(result.current.statistics.total).toBe(3);
    expect(result.current.statistics.active).toBe(3);
  });

  it('calculates ROI insights and sorted campaign views', () => {
    const { result } = renderHook(() => useMarketingCampaigns(BASE_CAMPAIGNS));

    const roiSummary = result.current.getCampaignROI(BASE_CAMPAIGNS[0]);
    expect(roiSummary.roi).toBeGreaterThan(0);
    expect(roiSummary.profit).toBeGreaterThan(0);
    expect(roiSummary.costPerEngagement).toBeGreaterThan(0);

    expect(result.current.sortedByROI[0].id).toBe('campaign-1');
    expect(result.current.sortedByReach[0].id).toBe('campaign-1');

    expect(result.current.getCampaignsByType('email')[0].id).toBe('campaign-2');
  });
});
