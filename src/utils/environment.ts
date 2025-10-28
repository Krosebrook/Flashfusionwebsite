/**
 * Robust environment detection utilities
 * Safe for use in any context (browser, SSR, Node.js)
 */

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  mode: 'development' | 'production' | 'test';
  hostname?: string;
  port?: string;
}

/**
 * Safely detect if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  try {
    // Check hostname for local development
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

    // Check import.meta.env safely
    try {
      if (import.meta && import.meta.env) {
        if (import.meta.env.DEV === true || 
            import.meta.env.MODE === 'development' ||
            import.meta.env.NODE_ENV === 'development') {
          return true;
        }
      }
    } catch {
      // import.meta not available, continue to other checks
    }

    // Check process.env if available (Node.js context)
    if (typeof process !== 'undefined' && 
        process.env && 
        process.env.NODE_ENV === 'development') {
      return true;
    }

    // Check global development flag
    if (typeof window !== 'undefined' && 
        (window as any).__DEV__ === true) {
      return true;
    }

    return false;
  } catch (error) {
    // If any error occurs, assume production for safety
    return false;
  }
}

/**
 * Safely detect if we're in production mode
 */
export function isProductionMode(): boolean {
  try {
    // Check import.meta.env safely
    try {
      if (import.meta && import.meta.env) {
        if (import.meta.env.PROD === true || 
            import.meta.env.MODE === 'production' ||
            import.meta.env.NODE_ENV === 'production') {
          return true;
        }
      }
    } catch {
      // import.meta not available, continue to other checks
    }

    // Check process.env if available
    if (typeof process !== 'undefined' && 
        process.env && 
        process.env.NODE_ENV === 'production') {
      return true;
    }

    // If not development, assume production
    return !isDevelopmentMode();
  } catch (error) {
    // If any error occurs, assume production for safety
    return true;
  }
}

/**
 * Safely detect if we're in test mode
 */
export function isTestMode(): boolean {
  try {
    // Check import.meta.env safely
    try {
      if (import.meta && import.meta.env) {
        if (import.meta.env.MODE === 'test' ||
            import.meta.env.NODE_ENV === 'test') {
          return true;
        }
      }
    } catch {
      // import.meta not available, continue to other checks
    }

    // Check process.env if available
    if (typeof process !== 'undefined' && 
        process.env && 
        process.env.NODE_ENV === 'test') {
      return true;
    }

    // Check for test runners
    if (typeof global !== 'undefined' && 
        ((global as any).__TEST__ || 
         (global as any).jest || 
         (global as any).vitest)) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const isDev = isDevelopmentMode();
  const isProd = isProductionMode();
  const isTest = isTestMode();

  let mode: 'development' | 'production' | 'test' = 'production';
  if (isTest) mode = 'test';
  else if (isDev) mode = 'development';

  const config: EnvironmentConfig = {
    isDevelopment: isDev,
    isProduction: isProd,
    isTest: isTest,
    mode
  };

  // Add browser-specific info if available
  if (typeof window !== 'undefined') {
    config.hostname = window.location.hostname;
    config.port = window.location.port;
  }

  return config;
}

/**
 * Safely get environment variable
 */
export function getEnvironmentVariable(key: string, defaultValue?: string): string | undefined {
  try {
    // Try import.meta.env first
    try {
      if (import.meta && import.meta.env) {
        const value = import.meta.env[key];
        if (value !== undefined) return value;
      }
    } catch {
      // import.meta not available, continue to fallbacks
    }

    // Fallback to process.env
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key];
      if (value !== undefined) return value;
    }

    // Fallback to window env (if set by build process)
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      const value = (window as any).__ENV__[key];
      if (value !== undefined) return value;
    }

    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Check if we're running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if we're running in Node.js
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && 
         process.versions != null && 
         process.versions.node != null;
}

/**
 * Check if we're running in a web worker
 */
export function isWebWorker(): boolean {
  return typeof self !== 'undefined' && 
         typeof window === 'undefined' && 
         typeof importScripts === 'function';
}

/**
 * Safe console logging that respects environment
 */
export const safeConsole = {
  debug: (...args: any[]) => {
    if (isDevelopmentMode()) {
      console.debug(...args);
    }
  },
  
  log: (...args: any[]) => {
    if (isDevelopmentMode()) {
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

// Export current environment for convenience
export const environment = getEnvironmentConfig();

// Export aliases for backward compatibility
export const isDevelopment = isDevelopmentMode;
export const isProduction = isProductionMode;
export const getEnvironmentMode = () => getEnvironmentConfig().mode;