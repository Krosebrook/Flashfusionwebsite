import { describe, expect, it } from 'vitest';
import { isDemoAuthFallbackEnabled } from '../auth-policy';

describe('auth-policy', () => {
  it('enables demo fallback outside production by default', () => {
    expect(isDemoAuthFallbackEnabled('development', undefined)).toBe(true);
    expect(isDemoAuthFallbackEnabled('test', undefined)).toBe(true);
  });

  it('disables demo fallback in production by default (negative case)', () => {
    expect(isDemoAuthFallbackEnabled('production', undefined)).toBe(false);
  });

  it('allows explicit override in production', () => {
    expect(isDemoAuthFallbackEnabled('production', 'true')).toBe(true);
  });
});
