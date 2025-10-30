import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { LaunchChecklistDashboard } from '@/components/launch/LaunchChecklistDashboard';

describe('LaunchChecklistDashboard', () => {
  it('renders launch plan and triggers callbacks on task interactions', async () => {
    const onTaskStart = vi.fn();
    const onTaskComplete = vi.fn();
    const onNavigateToTool = vi.fn();
    const user = userEvent.setup();

    render(
      <LaunchChecklistDashboard
        onTaskStart={onTaskStart}
        onTaskComplete={onTaskComplete}
        onNavigateToTool={onNavigateToTool}
      />
    );

    expect(await screen.findByText(/7-Day Launch Command Center/i)).toBeInTheDocument();

    const goToToolButtons = await screen.findAllByRole('button', { name: /Go to Tool/i });
    await user.click(goToToolButtons[0]);
    expect(onNavigateToTool).toHaveBeenCalledTimes(1);

    const startButtons = await screen.findAllByRole('button', { name: /Start Task/i });
    await user.click(startButtons[0]);
    expect(onTaskStart).toHaveBeenCalledTimes(1);

    await waitFor(async () => {
      const markCompleteButton = await screen.findByRole('button', { name: /Mark Complete/i });
      await user.click(markCompleteButton);
    });

    expect(onTaskComplete).toHaveBeenCalledTimes(1);
  });
});
