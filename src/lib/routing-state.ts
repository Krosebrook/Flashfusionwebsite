/**
 * Shared routing state helpers used by multiple router hooks.
 */

export interface ComputedRouteState {
  currentPath: string;
  searchParams: URLSearchParams;
  isDemoMode: boolean;
  isAuthRoute: boolean;
  shouldShowApp: boolean;
  isValidatorRoute: boolean;
}

const MOBILE_USER_AGENT_PATTERN = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i;

export function isMobileUserAgent(userAgent: string, width: number): boolean {
  return MOBILE_USER_AGENT_PATTERN.test(userAgent) || width <= 768;
}

export function shouldShowApplication(url: URL, isMobileDevice: boolean, persistedValue: string | null): boolean {
  return isMobileDevice
    ? url.searchParams.get('app') === 'true'
    : url.searchParams.has('app') || persistedValue === 'true';
}

export function computeRouteState(url: URL, userAgent: string, width: number, persistedValue: string | null): ComputedRouteState {
  const isMobileDevice = isMobileUserAgent(userAgent, width);

  return {
    currentPath: url.pathname,
    searchParams: url.searchParams,
    isDemoMode: url.searchParams.has('demo') || url.pathname.includes('/demo'),
    isAuthRoute: url.pathname.includes('/auth/') || url.pathname.includes('/verify-') || url.pathname.includes('/reset-'),
    shouldShowApp: shouldShowApplication(url, isMobileDevice, persistedValue),
    isValidatorRoute: url.pathname === '/validate'
  };
}
