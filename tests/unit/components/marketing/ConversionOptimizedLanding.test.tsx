import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/test/utils';
import { ConversionOptimizedLanding } from '@/components/marketing/ConversionOptimizedLanding';

describe('ConversionOptimizedLanding', () => {
  const onSignup = vi.fn();
  const onDemoRequest = vi.fn();
  const onToolSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the primary hero content and trust signals', () => {
    render(
      <ConversionOptimizedLanding
        onSignup={onSignup}
        onDemoRequest={onDemoRequest}
        onToolSelect={onToolSelect}
      />
    );

    expect(
      screen.getByRole('heading', { name: /Build Apps/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start Building Free/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No credit card required/i)
    ).toBeInTheDocument();
  });

  it('submits the signup form when a valid email is provided', async () => {
    const user = userEvent.setup();

    render(
      <ConversionOptimizedLanding
        onSignup={onSignup}
        onDemoRequest={onDemoRequest}
        onToolSelect={onToolSelect}
      />
    );

    const emailInput = screen.getAllByPlaceholderText(/Enter your email/i)[0];
    await user.type(emailInput, 'founder@example.com');
    await user.click(screen.getByRole('button', { name: /Start Building Free/i }));

    await waitFor(() => {
      expect(onSignup).toHaveBeenCalledWith('founder@example.com');
    });
  });

  it('opens the demo modal and forwards demo requests', async () => {
    const user = userEvent.setup();

    render(
      <ConversionOptimizedLanding
        onSignup={onSignup}
        onDemoRequest={onDemoRequest}
        onToolSelect={onToolSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: /Watch 2-Minute Demo/i }));

    expect(await screen.findByText(/Interactive Demo/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Start Interactive Demo/i }));
    expect(onDemoRequest).toHaveBeenCalledTimes(1);
  });

  it('notifies when an interactive feature demo is selected', async () => {
    const user = userEvent.setup();

    render(
      <ConversionOptimizedLanding
        onSignup={onSignup}
        onDemoRequest={onDemoRequest}
        onToolSelect={onToolSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: /Try Interactive Demo/i }));

    expect(onToolSelect).toHaveBeenCalledWith('full-stack-app-builder');
  });
});
