import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { LaunchMarketingCampaign } from '@/components/marketing/LaunchMarketingCampaign';

const trackFeatureUsage = vi.fn();

vi.mock('sonner@2.0.3', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/services/AnalyticsService', () => ({
  analyticsService: {
    trackFeatureUsage,
  },
}));

describe('LaunchMarketingCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads marketing data and renders the campaign overview', async () => {
    render(<LaunchMarketingCampaign />);

    expect(await screen.findByText(/Launch Marketing Campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Drive user acquisition/i)).toBeInTheDocument();
    expect(await screen.findByText(/Campaigns \(4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Campaign/i)).toBeInTheDocument();
  });

  it('displays seeded campaign cards with metrics', async () => {
    render(<LaunchMarketingCampaign />);

    const campaignCard = await screen.findByText(/Twitter Launch Campaign/i);
    expect(campaignCard).toBeInTheDocument();
    expect(screen.getAllByText(/Reach:/i).length).toBeGreaterThan(0);
  });

  it('supports navigating to the templates tab', async () => {
    const user = userEvent.setup();

    render(<LaunchMarketingCampaign />);

    const templatesTab = await screen.findByRole('tab', { name: /Templates/i });
    await user.click(templatesTab);

    expect(await screen.findByText(/Marketing Content Templates/i)).toBeInTheDocument();
  });
});
