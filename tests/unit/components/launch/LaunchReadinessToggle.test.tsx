import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, userEvent, waitFor, act } from '@/test/utils';

const toastMock = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock('sonner@2.0.3', () => ({
  toast: toastMock,
}));

const analyticsMock = {
  trackLaunchReadinessCheck: vi.fn(),
  trackLaunchModeActivated: vi.fn(),
  trackLaunchModeDeactivated: vi.fn(),
};

vi.mock('@/services/AnalyticsService', () => ({
  analyticsService: analyticsMock,
}));

import { LaunchReadinessToggle } from '@/components/launch/LaunchReadinessToggle';
import { analyticsService } from '@/services/AnalyticsService';

describe('LaunchReadinessToggle', () => {
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    Object.values(toastMock).forEach((mockFn) => mockFn.mockReset());
    Object.values(analyticsMock).forEach((mockFn) => mockFn.mockReset());

    vi.useFakeTimers();
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
  });

  afterEach(() => {
    vi.useRealTimers();
    randomSpy.mockRestore();
  });

  it('runs readiness checks and invokes callbacks', async () => {
    const onReadinessChange = vi.fn();
    const onNavigateToTool = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <LaunchReadinessToggle
        onReadinessChange={onReadinessChange}
        onNavigateToTool={onNavigateToTool}
      />
    );

    const runChecksButton = await screen.findByRole('button', { name: /Run Checks/i });

    await act(async () => {
      await user.click(runChecksButton);
      await vi.runAllTimersAsync();
    });

    await waitFor(() => {
      expect(onReadinessChange).toHaveBeenCalled();
    });
    expect(analyticsService.trackLaunchReadinessCheck).toHaveBeenCalled();

    const navigateButton = screen.getByRole('button', { name: /Deployment Settings/i });
    await user.click(navigateButton);
    expect(onNavigateToTool).toHaveBeenCalledWith('deployments');
  });
});
