/**
 * @fileoverview Component smoke tests for LaunchPreparationHub
 * @category test
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { LaunchPreparationHub } from '@/components/launch/LaunchPreparationHub';

describe('LaunchPreparationHub', () => {
  describe('Smoke Tests', () => {
    it('should render without crashing', () => {
      render(<LaunchPreparationHub />);

      // Check that the component renders
      expect(screen.getByText(/Launch Preparation Hub/i)).toBeInTheDocument();
    });

    it('should display the main title', () => {
      render(<LaunchPreparationHub />);

      const title = screen.getByText(/Launch Preparation Hub/i);
      expect(title).toBeInTheDocument();
    });

    it('should display launch readiness section', () => {
      render(<LaunchPreparationHub />);

      // Check for readiness indicator
      expect(screen.getByText(/Launch Readiness:/i)).toBeInTheDocument();
    });

    it('should display tab navigation', () => {
      render(<LaunchPreparationHub />);

      // Check for tab triggers
      expect(screen.getByRole('tab', { name: /Docs/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Marketing/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Support/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Legal/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Checklist/i })).toBeInTheDocument();
    });

    it('should display documentation tab content by default', () => {
      render(<LaunchPreparationHub />);

      // Documentation tab should be selected by default
      expect(screen.getByText(/Documentation Generation:/i)).toBeInTheDocument();
    });

    it('should display progress indicator', () => {
      render(<LaunchPreparationHub />);

      // Check for progress percentage
      const progressText = screen.getByText(/% complete/i);
      expect(progressText).toBeInTheDocument();
    });

    it('should display readiness badge', () => {
      render(<LaunchPreparationHub />);

      // Check for readiness status badge (Ready, In Progress, or Needs Work)
      const badge = screen.getByText(/Ready|In Progress|Needs Work/i);
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Documentation Tab', () => {
    it('should display documentation generation buttons', () => {
      render(<LaunchPreparationHub />);

      // Check for documentation generation buttons
      expect(screen.getByText(/Generate User Manual/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate Tutorial Scripts/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate FAQ Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/Generate API Documentation/i)).toBeInTheDocument();
    });

    it('should display user documentation section', () => {
      render(<LaunchPreparationHub />);

      expect(screen.getByText(/User Documentation/i)).toBeInTheDocument();
    });

    it('should display developer resources section', () => {
      render(<LaunchPreparationHub />);

      expect(screen.getByText(/Developer Resources/i)).toBeInTheDocument();
    });
  });

  describe('Marketing Tab', () => {
    it('should display press kit button', () => {
      render(<LaunchPreparationHub />);

      // The press kit button is visible in the component
      const pressKitButton = screen.getByRole('button', { name: /Press Kit/i });
      expect(pressKitButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible tab structure', () => {
      render(<LaunchPreparationHub />);

      // Check for ARIA roles
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should have buttons with accessible labels', () => {
      render(<LaunchPreparationHub />);

      // Verify buttons have text content or aria-labels
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('Layout Structure', () => {
    it('should render card structure', () => {
      const { container } = render(<LaunchPreparationHub />);

      // Check that the component has the expected structure
      expect(container.querySelector('[class*="space-y-6"]')).toBeInTheDocument();
    });

    it('should render alert for launch readiness', () => {
      const { container } = render(<LaunchPreparationHub />);

      // Check for alert component
      expect(screen.getByText(/Launch Readiness:/i)).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('should not show generation progress initially', () => {
      render(<LaunchPreparationHub />);

      // Generation progress should not be visible initially
      expect(screen.queryByText(/Generating documentation.../i)).not.toBeInTheDocument();
    });

    it('should show default readiness percentage', () => {
      render(<LaunchPreparationHub />);

      // Should display some readiness percentage
      const readinessText = screen.getByText(/\d+% complete/i);
      expect(readinessText).toBeInTheDocument();
    });
  });
});
