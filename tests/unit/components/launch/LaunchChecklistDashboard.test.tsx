import { describe, it, expect, vi } from 'vitest';

import { render, screen, userEvent } from '@/test/utils';
import { LaunchChecklistDashboard } from '@/components/launch/LaunchChecklistDashboard';

describe('LaunchChecklistDashboard', () => {
  it('renders the current day overview with focus areas', () => {
    render(
      <LaunchChecklistDashboard
        onTaskComplete={vi.fn()}
        onTaskStart={vi.fn()}
        onNavigateToTool={vi.fn()}
      />
    );

    expect(screen.getByText(/Launch Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Day 1: Foundation & Infrastructure/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus Areas:/i)).toBeInTheDocument();
  });

  it('invokes callbacks when tasks are started, completed, and navigated', async () => {
    const onTaskStart = vi.fn();
    const onTaskComplete = vi.fn();
    const onNavigateToTool = vi.fn();
    const user = userEvent.setup();

    render(
      <LaunchChecklistDashboard
        onTaskComplete={onTaskComplete}
        onTaskStart={onTaskStart}
        onNavigateToTool={onNavigateToTool}
      />
    );

    const goToToolButton = screen.getAllByRole('button', { name: /Go to Tool/i })[0];
    await user.click(goToToolButton);
    expect(onNavigateToTool).toHaveBeenCalledWith('dashboard');

    const startButtons = screen.getAllByRole('button', { name: /Start Task/i });
    await user.click(startButtons[0]);
    expect(onTaskStart).toHaveBeenCalledWith('prod-deployment');

    const markCompleteButton = await screen.findByRole('button', { name: /Mark Complete/i });
    await user.click(markCompleteButton);
    expect(onTaskComplete).toHaveBeenCalledWith('prod-deployment');

    expect(await screen.findByText(/Completed/i)).toBeInTheDocument();
  });
});
