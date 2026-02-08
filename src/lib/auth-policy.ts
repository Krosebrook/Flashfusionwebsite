import { ENV } from './env';

/**
 * Demo auth fallback is disabled by default in production.
 * It can be explicitly enabled with VITE_ENABLE_DEMO_AUTH=true.
 */
export function isDemoAuthFallbackEnabled(mode: string = ENV.MODE, flag: string | undefined = import.meta.env.VITE_ENABLE_DEMO_AUTH): boolean {
  if (flag === 'true') {
    return true;
  }

  return mode !== 'production';
}
