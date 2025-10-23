/**
 * Test Environment Setup
 * 
 * Configures global test environment for Vitest
 * Target: 85%+ test coverage
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock fetch
global.fetch = vi.fn();

// Console error/warning tracking
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  console.error = vi.fn((...args) => {
    // Ignore specific expected errors
    const msg = args[0]?.toString() || '';
    if (msg.includes('Not implemented: HTMLFormElement.prototype.submit')) {
      return;
    }
    originalError(...args);
  });
  
  console.warn = vi.fn((...args) => {
    // Ignore specific expected warnings
    const msg = args[0]?.toString() || '';
    if (msg.includes('ReactDOM.render')) {
      return;
    }
    originalWarn(...args);
  });
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-key';

export {};
