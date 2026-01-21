/**
 * @fileoverview Tests for AnalyticsDashboard
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AnalyticsDashboardService } from '../services/AnalyticsDashboardService';
import { useAnalyticsDashboardStore } from '../stores/AnalyticsDashboardStore';

vi.mock('@/hooks/useAuthentication', () => ({
  useAuthentication: () => ({
    user: { id: 'user-123', email: 'test@example.com', name: 'Test User' }
  })
}));

const mockAnalyticsData = {
  overview: {
    totalProjects: 12,
    totalDeployments: 7,
    totalXP: 980,
    currentStreak: 4,
    totalToolRuns: 42,
    successRate: 96
  },
  activity: [
    { date: '2024-01-01', projects: 2, deployments: 1, xp: 120 },
    { date: '2024-01-02', projects: 3, deployments: 1, xp: 180 }
  ],
  toolUsage: [
    { tool: 'Code Generator', usage: 12, successRate: 94, trend: 'up', lastUsedAt: '2024-01-02' }
  ],
  deploymentStats: [
    { platform: 'vercel', count: 4, share: 57.1 },
    { platform: 'netlify', count: 3, share: 42.9 }
  ],
  usageHistory: [
    { date: '2024-01-01', tool: 'Code Generator', usage: 3, successRate: 94 }
  ],
  insights: [
    { id: 'insight-1', title: 'Momentum', description: 'Strong usage trend.', type: 'success' }
  ]
};

const mockServiceResponse = {
  data: mockAnalyticsData,
  metadata: {
    requestId: 'request-1',
    fetchedAt: '2024-01-03T00:00:00.000Z',
    processingTimeMs: 120
  }
};

beforeEach(() => {
  const { result } = renderHook(() => useAnalyticsDashboardStore());
  act(() => {
    result.current.reset();
  });
  vi.spyOn(AnalyticsDashboardService.getInstance(), 'initialize').mockResolvedValue();
  vi.spyOn(AnalyticsDashboardService.getInstance(), 'fetchAnalytics').mockResolvedValue(mockServiceResponse);
});

describe('AnalyticsDashboard Component', () => {
  it('renders dashboard header and metrics', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('updates time range filter when clicked', async () => {
    render(<AnalyticsDashboard />);

    const button = await screen.findByRole('button', { name: '30D' });
    fireEvent.click(button);

    await waitFor(() => {
      const store = useAnalyticsDashboardStore.getState();
      expect(store.filters.timeRange).toBe('30d');
    });
  });

  it('shows error state when service fails', async () => {
    vi.spyOn(AnalyticsDashboardService.getInstance(), 'fetchAnalytics').mockRejectedValueOnce(
      new Error('Fetch failed')
    );

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});

describe('AnalyticsDashboardStore', () => {
  it('loads analytics data successfully', async () => {
    const { result } = renderHook(() => useAnalyticsDashboardStore());

    await act(async () => {
      await result.current.initialize();
      await result.current.loadAnalytics('user-123');
    });

    expect(result.current.status).toBe('ready');
    expect(result.current.data?.overview.totalProjects).toBe(12);
  });

  it('handles service errors', async () => {
    vi.spyOn(AnalyticsDashboardService.getInstance(), 'fetchAnalytics').mockRejectedValueOnce(
      new Error('Service failure')
    );

    const { result } = renderHook(() => useAnalyticsDashboardStore());

    await act(async () => {
      await result.current.initialize();
      await result.current.loadAnalytics('user-123');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.message).toBe('Service failure');
  });
});
