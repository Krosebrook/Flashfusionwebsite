/**
 * @fileoverview Test utilities and helpers
 * @module test/utils
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Create a custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

// Mock localStorage for tests
export function mockLocalStorage() {
  const storage: Record<string, string> = {};

  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
    key: (index: number) => Object.keys(storage)[index] || null,
    get length() {
      return Object.keys(storage).length;
    },
  };
}

// Mock fetch for API tests
export function mockFetch(response: any, status = 200) {
  return vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      text: async () => JSON.stringify(response),
    })
  ) as any;
}

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock user object for auth tests
export const mockAuthUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  subscription: 'free' as const,
};

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
