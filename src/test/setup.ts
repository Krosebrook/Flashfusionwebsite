/**
 * Global Vitest setup configuring DOM matchers and shared mocks.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { ReactNode } from 'react';
import { resetSupabaseClientMock, supabaseClientMock } from './mocks/supabaseClient';

vi.mock('@/lib/supabase', () => ({
  supabase: supabaseClientMock,
}));

vi.mock('@/utils/supabase/client', () => ({
  supabase: supabaseClientMock,
}));

vi.mock('motion/react', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
    button: 'button',
    img: 'img',
    span: 'span',
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));

beforeEach(() => {
  resetSupabaseClientMock();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

if (!globalThis.ResizeObserver) {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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
}
