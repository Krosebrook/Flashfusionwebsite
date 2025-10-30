/**
 * @fileoverview Component tests for LaunchPreparationHub composition layer
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { LaunchPreparationHub } from '@/components/launch/LaunchPreparationHub';

describe('LaunchPreparationHub', () => {
  it('renders core sections and overview metrics', () => {
    render(<LaunchPreparationHub />);

    expect(screen.getByRole('heading', { name: /Launch Preparation Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Launch Overview/i })).toBeInTheDocument();
    expect(screen.getByText(/Launch Readiness/i)).toBeInTheDocument();
  });

  it('exposes documentation generation controls', () => {
    render(<LaunchPreparationHub />);

    expect(screen.getByRole('heading', { name: /Documentation Generator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate User Manual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate API Documentation/i })).toBeInTheDocument();
  });

  it('displays asset, marketing, and support sections', () => {
    render(<LaunchPreparationHub />);

    expect(screen.getByRole('heading', { name: /Asset Production/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Marketing Operations/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Support Operations/i })).toBeInTheDocument();
  });

  it('lists launch checklist categories and completion progress', () => {
    render(<LaunchPreparationHub />);

    expect(screen.getByRole('heading', { name: /Launch Checklist/i })).toBeInTheDocument();
    expect(screen.getByText(/Checklist completion/i)).toBeInTheDocument();
    expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
    expect(screen.getByText(/Support Systems/i)).toBeInTheDocument();
  });

  it('renders content request queue with deadlines', () => {
    render(<LaunchPreparationHub />);

    expect(screen.getByRole('heading', { name: /Content Production Queue/i })).toBeInTheDocument();
    expect(screen.getByText(/press release/i)).toBeInTheDocument();
    expect(screen.getAllByText(/deadline/i)[0]).toBeInTheDocument();
  });
});
