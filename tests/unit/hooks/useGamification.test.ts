import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();

const getUserStatsMock = vi.fn();
const addXPMock = vi.fn();
const recordToolUsageMock = vi.fn();
const recordProjectCompletionMock = vi.fn();
const recordCodeGenerationMock = vi.fn();
const recordDailyLoginMock = vi.fn();
const unlockSpecialAchievementMock = vi.fn();

vi.mock('sonner@2.0.3', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

vi.mock('@/services/GamificationService', () => ({
  GamificationService: {
    getUserStats: getUserStatsMock,
    addXP: addXPMock,
    recordToolUsage: recordToolUsageMock,
    recordProjectCompletion: recordProjectCompletionMock,
    recordCodeGeneration: recordCodeGenerationMock,
    recordDailyLogin: recordDailyLoginMock,
    unlockSpecialAchievement: unlockSpecialAchievementMock,
  },
}));

import { useGamification } from '@/hooks/useGamification';

describe('useGamification', () => {
  const baseStats = () => ({
    user_id: 'user-123',
    total_xp: 100,
    level: 2,
    current_level_xp: 20,
    next_level_xp: 200,
    achievements_unlocked: [],
    badges_earned: [],
    streak_days: 3,
    last_activity_date: new Date().toISOString().split('T')[0],
    projects_completed: 1,
    tools_used: ['builder'],
    total_time_spent: 45,
    rank: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('loads user stats on mount and exposes them to consumers', async () => {
    const stats = baseStats();
    getUserStatsMock.mockResolvedValueOnce(stats);

    const { result } = renderHook(() => useGamification('user-123'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.userStats).toEqual(stats);
    expect(result.current.error).toBeNull();
  });

  it('creates fallback stats when no remote data is available', async () => {
    getUserStatsMock.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useGamification('user-456'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.userStats).not.toBeNull();
    expect(result.current.userStats?.total_xp).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('updates XP totals after successful addXP calls', async () => {
    const stats = baseStats();
    const updatedStats = { ...stats, total_xp: stats.total_xp + 50 };

    getUserStatsMock.mockResolvedValue(stats);
    addXPMock.mockResolvedValue(updatedStats);

    const { result } = renderHook(() => useGamification('user-123'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addXP(50, 'tool_usage', 'Used AI builder');
    });

    expect(addXPMock).toHaveBeenCalledWith(
      'user-123',
      50,
      'tool_usage',
      'Used AI builder',
      {}
    );
    expect(result.current.userStats?.total_xp).toBe(updatedStats.total_xp);
  });

  it('surfaces toast notifications when XP updates fail', async () => {
    const stats = baseStats();
    getUserStatsMock.mockResolvedValue(stats);
    addXPMock.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useGamification('user-123'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addXP(25, 'tool_usage', 'Tried builder');
    });

    expect(toastErrorMock).toHaveBeenCalledWith('Failed to update XP. Please try again.');
  });
});
