import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { LaunchCampaign } from '@/components/marketing/LaunchCampaign';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LaunchCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the launch metrics dashboard summary', () => {
    render(<LaunchCampaign />);

    expect(screen.getByText(/Launch Day Metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Signups/i)).toBeInTheDocument();
    expect(screen.getByText(/Social Media Templates/i)).toBeInTheDocument();
  });

  it('expands a campaign card to show preparation details', async () => {
    const user = userEvent.setup();

    render(<LaunchCampaign />);

    await user.click(screen.getByText(/Product Hunt Launch/i));

    expect(await screen.findByText(/Preparation Checklist/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Submit product 24-48 hours before launch/i)
    ).toBeInTheDocument();
  });

  it('lists social media templates with platform labels', () => {
    render(<LaunchCampaign />);

    expect(screen.getByText(/Twitter\/X/i)).toBeInTheDocument();
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
  });
});
