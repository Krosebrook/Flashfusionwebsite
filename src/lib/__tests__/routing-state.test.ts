import { describe, expect, it } from 'vitest';
import { computeRouteState, isMobileUserAgent, shouldShowApplication } from '../routing-state';

describe('routing-state', () => {
  it('computes demo/auth/validator flags from URL', () => {
    const url = new URL('https://flashfusion.test/validate?demo=true&app=true');

    const state = computeRouteState(url, 'Mozilla/5.0 (iPhone)', 390, null);

    expect(state.isDemoMode).toBe(true);
    expect(state.isAuthRoute).toBe(false);
    expect(state.isValidatorRoute).toBe(true);
    expect(state.shouldShowApp).toBe(true);
  });

  it('uses persisted app preference on desktop', () => {
    const url = new URL('https://flashfusion.test/');

    const state = computeRouteState(url, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 1440, 'true');

    expect(state.shouldShowApp).toBe(true);
  });

  it('does not use persisted app preference on mobile without explicit app=true', () => {
    const url = new URL('https://flashfusion.test/');

    const shouldShow = shouldShowApplication(url, true, 'true');

    expect(shouldShow).toBe(false);
  });

  it('detects mobile by width even with desktop user agent', () => {
    expect(isMobileUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 500)).toBe(true);
  });
});
