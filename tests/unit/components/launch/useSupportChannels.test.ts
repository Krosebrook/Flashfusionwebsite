import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useSupportChannels } from '@/components/launch/useSupportChannels';
import type { SupportChannel } from '@/components/launch/LaunchPreparationHub.types';

const BASE_CHANNELS: SupportChannel[] = [
  {
    id: 'channel-1',
    name: 'Email Support',
    type: 'email',
    status: 'active',
    responseTime: '< 4 hours',
    satisfaction: 4.5,
    volume: 120,
  },
  {
    id: 'channel-2',
    name: 'Live Chat',
    type: 'chat',
    status: 'testing',
    responseTime: '< 2 minutes',
    satisfaction: 4.1,
    volume: 80,
  },
  {
    id: 'channel-3',
    name: 'Docs Hub',
    type: 'docs',
    status: 'setup',
    responseTime: 'Self-serve',
    satisfaction: 3.6,
    volume: 60,
  },
];

describe('useSupportChannels', () => {
  it('manages channels and clears active selection on delete', () => {
    const { result } = renderHook(() => useSupportChannels(BASE_CHANNELS));

    expect(result.current.channels).toHaveLength(3);

    act(() => {
      result.current.addChannel({
        id: 'channel-4',
        name: 'Community Forum',
        type: 'community',
        status: 'setup',
        responseTime: 'Async',
        satisfaction: 3.8,
        volume: 45,
      });
    });

    expect(result.current.channels).toHaveLength(4);

    act(() => {
      result.current.updateChannel('channel-2', { status: 'active' });
    });
    expect(result.current.getChannelsByStatus('active')).toHaveLength(2);

    act(() => {
      result.current.setActiveChannel(
        result.current.channels.find((channel) => channel.id === 'channel-1') ?? null
      );
      result.current.deleteChannel('channel-1');
    });

    expect(result.current.channels.find((channel) => channel.id === 'channel-1')).toBeUndefined();
    expect(result.current.activeChannel).toBeNull();
  });

  it('provides filtered collections, metrics, and health summaries', () => {
    const { result } = renderHook(() => useSupportChannels(BASE_CHANNELS));

    expect(result.current.getChannelsByStatus('active')).toHaveLength(1);
    expect(result.current.getChannelsByType('chat')[0].id).toBe('channel-2');

    const statusSummary = result.current.getChannelStatus(BASE_CHANNELS[0]);
    expect(statusSummary.isHealthy).toBe(true);
    expect(statusSummary.statusLabel).toBe('Healthy');

    const metrics = result.current.metrics;
    expect(metrics.totalVolume).toBe(260);
    expect(metrics.averageSatisfaction).toBeCloseTo(4.07, 2);
    expect(metrics.activeChannels).toBe(1);

    expect(result.current.sortedBySatisfaction[0].id).toBe('channel-1');
    expect(result.current.sortedByVolume[0].id).toBe('channel-1');

    expect(result.current.statistics).toMatchObject({
      total: 3,
      healthy: 1,
      needsAttention: 1,
      inProgress: 1,
    });
  });
});
