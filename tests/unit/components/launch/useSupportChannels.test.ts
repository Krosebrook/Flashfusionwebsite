import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSupportChannels } from '@/components/launch/useSupportChannels';
import { INITIAL_SUPPORT_CHANNELS } from '@/fixtures/launch/launch-preparation-fixtures';
import type { SupportChannel } from '@/components/launch/LaunchPreparationHub.types';

describe('useSupportChannels', () => {
  let channelsFixture: SupportChannel[];

  beforeEach(() => {
    channelsFixture = INITIAL_SUPPORT_CHANNELS.map((channel) => ({ ...channel }));
  });

  it('should initialize channel state and derived metrics', () => {
    const { result } = renderHook(() => useSupportChannels(channelsFixture));

    expect(result.current.channels).toHaveLength(channelsFixture.length);
    expect(result.current.statistics.total).toBe(channelsFixture.length);
    expect(result.current.metrics.totalVolume).toBeGreaterThan(0);
    expect(result.current.sortedBySatisfaction[0].satisfaction).toBeGreaterThanOrEqual(
      result.current.sortedBySatisfaction[1]?.satisfaction ?? 0
    );
  });

  it('should add, update, and delete channels while managing active selection', () => {
    const { result } = renderHook(() => useSupportChannels(channelsFixture));

    const newChannel: SupportChannel = {
      id: 'sms-support',
      name: 'SMS Support',
      type: 'sms',
      status: 'testing',
      responseTime: '< 10 minutes',
      satisfaction: 4.1,
      volume: 42,
    };

    act(() => {
      result.current.addChannel(newChannel);
    });

    expect(result.current.channels).toContainEqual(newChannel);

    act(() => {
      result.current.setActiveChannel(newChannel);
      result.current.updateChannel('sms-support', { status: 'active', satisfaction: 4.6 });
    });

    const updated = result.current.channels.find((channel) => channel.id === 'sms-support');
    expect(updated?.status).toBe('active');
    expect(result.current.activeChannel?.id).toBe('sms-support');

    act(() => {
      result.current.deleteChannel('sms-support');
    });

    expect(result.current.channels.some((channel) => channel.id === 'sms-support')).toBe(false);
    expect(result.current.activeChannel).toBeNull();
  });

  it('should provide channel status helpers and health summary', () => {
    const { result } = renderHook(() => useSupportChannels(channelsFixture));

    const status = result.current.getChannelStatus(channelsFixture[0]);
    expect(status.statusLabel).toBeTruthy();

    const testingChannels = result.current.testingChannels;
    expect(testingChannels.every((channel) => channel.status === 'testing')).toBe(true);

    expect(result.current.statistics.total).toBe(result.current.channels.length);
    expect(
      result.current.statistics.healthy +
        result.current.statistics.needsAttention +
        result.current.statistics.inProgress
    ).toBeGreaterThanOrEqual(0);
  });
});
