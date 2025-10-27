/**
 * @fileoverview Custom test utilities and helpers
 * Provides custom render function with providers and common test utilities
 */

import { render, type RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import type { RenderResult } from '@testing-library/react';

/**
 * Test wrapper component that provides necessary context providers
 */
function TestProviders({ children }: { children: ReactNode }) {
  // Add any global providers here (ThemeProvider, Router, etc.)
  return <>{children}</>;
}

/**
 * Custom render function with test providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render };
