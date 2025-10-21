/**
 * Simple, safe environment detection utilities
 * Avoids problematic import.meta checks that cause build errors
 */

/**
 * Detect if we're in development mode using safe checks
 */
export function isDevMode(): boolean {
  try {
    // Check hostname first (most reliable)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      
      if (hostname === 'localhost' || 
          hostname === '127.0.0.1' ||
          hostname.includes('127.0.0.1') ||
          port === '5173' ||
          port === '3000' ||
          port === '8080') {
        return true;
      }
    }

    // Check process.env if available
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Detect if we're in production mode
 */
export function isProdMode(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NODE_ENV === 'production') {
        return true;
      }
    }

    // If not development, assume production
    return !isDevMode();
  } catch (error) {
    return true; // Default to production for safety
  }
}

/**
 * Get environment variable safely
 */
export function getEnvVar(key: string): string | undefined {
  try {
    // Check process.env first
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key];
      if (value !== undefined) return value;
    }

    // Check window env if available
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      const value = (window as any).__ENV__[key];
      if (value !== undefined) return value;
    }

    return undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Safe console logging for development
 */
export const devLog = {
  debug: (...args: any[]) => {
    if (isDevMode()) {
      console.debug(...args);
    }
  },
  
  log: (...args: any[]) => {
    if (isDevMode()) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args);
  }
};

export default {
  isDevMode,
  isProdMode,
  getEnvVar,
  devLog
};