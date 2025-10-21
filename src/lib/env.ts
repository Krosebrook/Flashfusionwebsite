// Environment variables configuration for FlashFusion
// This module provides a centralized way to access environment variables
// and ensures they're properly typed and available in the browser

interface EnvironmentConfig {
  // Application Environment
  NODE_ENV: 'development' | 'production' | 'test';
  MODE: 'development' | 'production' | 'test';
  
  // Application Info
  VITE_APP_NAME?: string;
  VITE_APP_VERSION?: string;
  VITE_BUILD_TIME?: string;
  
  // Analytics
  VITE_GOOGLE_ANALYTICS_ID?: string;
  VITE_MIXPANEL_TOKEN?: string;
  VITE_HOTJAR_ID?: string;
  
  // Supabase Configuration
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  
  // API Configuration
  VITE_API_BASE_URL?: string;
  
  // Feature Flags
  VITE_ENABLE_ANALYTICS?: string;
  VITE_ENABLE_DEBUG?: string;
  VITE_ENABLE_BETA_FEATURES?: string;
}

// Safe environment variable access with fallbacks
function safeGetEnvVar(key: string, fallback: string = ''): string {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback;
    }
    
    // Fallback for server-side or build environments
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }
    
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return fallback;
  }
}

// Get environment mode with proper fallbacks
function getEnvironmentMode(): 'development' | 'production' | 'test' {
  try {
    // Try import.meta.env first
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const mode = import.meta.env.MODE || import.meta.env.NODE_ENV;
      if (mode && ['development', 'production', 'test'].includes(mode)) {
        return mode as 'development' | 'production' | 'test';
      }
    }
    
    // Try process.env as fallback
    if (typeof process !== 'undefined' && process.env) {
      const nodeEnv = process.env.NODE_ENV;
      if (nodeEnv && ['development', 'production', 'test'].includes(nodeEnv)) {
        return nodeEnv as 'development' | 'production' | 'test';
      }
    }
    
    // Default fallback based on other indicators
    if (typeof window !== 'undefined') {
      // In browser, assume development if localhost
      const isDev = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('dev');
      return isDev ? 'development' : 'production';
    }
    
    // Final fallback
    return 'development';
  } catch (error) {
    console.warn('Failed to determine environment mode:', error);
    return 'development';
  }
}

// Get environment configuration with proper fallbacks
function getEnvironmentConfig(): EnvironmentConfig {
  const mode = getEnvironmentMode();
  
  return {
    // Environment detection with fallbacks
    NODE_ENV: mode,
    MODE: mode,
    
    // Application info
    VITE_APP_NAME: safeGetEnvVar('VITE_APP_NAME', 'FlashFusion'),
    VITE_APP_VERSION: safeGetEnvVar('VITE_APP_VERSION', '1.0.0'),
    VITE_BUILD_TIME: safeGetEnvVar('VITE_BUILD_TIME', new Date().toISOString()),
    
    // Analytics
    VITE_GOOGLE_ANALYTICS_ID: safeGetEnvVar('VITE_GOOGLE_ANALYTICS_ID'),
    VITE_MIXPANEL_TOKEN: safeGetEnvVar('VITE_MIXPANEL_TOKEN'),
    VITE_HOTJAR_ID: safeGetEnvVar('VITE_HOTJAR_ID'),
    
    // Supabase
    VITE_SUPABASE_URL: safeGetEnvVar('VITE_SUPABASE_URL'),
    VITE_SUPABASE_ANON_KEY: safeGetEnvVar('VITE_SUPABASE_ANON_KEY'),
    
    // API
    VITE_API_BASE_URL: safeGetEnvVar('VITE_API_BASE_URL', '/api'),
    
    // Feature flags
    VITE_ENABLE_ANALYTICS: safeGetEnvVar('VITE_ENABLE_ANALYTICS', 'true'),
    VITE_ENABLE_DEBUG: safeGetEnvVar('VITE_ENABLE_DEBUG', mode === 'development' ? 'true' : 'false'),
    VITE_ENABLE_BETA_FEATURES: safeGetEnvVar('VITE_ENABLE_BETA_FEATURES', 'false')
  };
}

// Lazy initialization to avoid issues during module loading
let cachedConfig: EnvironmentConfig | null = null;

function getConfig(): EnvironmentConfig {
  if (!cachedConfig) {
    cachedConfig = getEnvironmentConfig();
  }
  return cachedConfig;
}

// Export the configuration getter
export const ENV = new Proxy({} as EnvironmentConfig, {
  get(target, prop) {
    return getConfig()[prop as keyof EnvironmentConfig];
  }
});

// Environment helper functions with safe access
export function isDevelopment(): boolean {
  try {
    return getConfig().MODE === 'development';
  } catch (error) {
    console.warn('Failed to check development mode:', error);
    return true; // Default to development for safety
  }
}

export function isProduction(): boolean {
  try {
    return getConfig().MODE === 'production';
  } catch (error) {
    console.warn('Failed to check production mode:', error);
    return false;
  }
}

export function isTest(): boolean {
  try {
    return getConfig().MODE === 'test';
  } catch (error) {
    console.warn('Failed to check test mode:', error);
    return false;
  }
}

// Feature flag helpers with safe access
export function isAnalyticsEnabled(): boolean {
  try {
    return getConfig().VITE_ENABLE_ANALYTICS === 'true';
  } catch (error) {
    console.warn('Failed to check analytics flag:', error);
    return false;
  }
}

export function isDebugEnabled(): boolean {
  try {
    return getConfig().VITE_ENABLE_DEBUG === 'true';
  } catch (error) {
    console.warn('Failed to check debug flag:', error);
    return isDevelopment();
  }
}

export function isBetaFeaturesEnabled(): boolean {
  try {
    return getConfig().VITE_ENABLE_BETA_FEATURES === 'true';
  } catch (error) {
    console.warn('Failed to check beta features flag:', error);
    return false;
  }
}

// Validation helper
export function validateRequiredEnvVars(): { isValid: boolean; missing: string[] } {
  try {
    const config = getConfig();
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missing = requiredVars.filter(varName => {
      const value = config[varName as keyof EnvironmentConfig];
      return !value || value === '';
    });
    
    return {
      isValid: missing.length === 0,
      missing
    };
  } catch (error) {
    console.warn('Failed to validate environment variables:', error);
    return {
      isValid: false,
      missing: ['VALIDATION_FAILED']
    };
  }
}

// Development helper to log environment info
export function logEnvironmentInfo(): void {
  try {
    if (isDevelopment() && typeof console !== 'undefined') {
      const config = getConfig();
      console.group('🔧 FlashFusion Environment Configuration');
      console.log('Mode:', config.MODE);
      console.log('Version:', config.VITE_APP_VERSION);
      console.log('Build Time:', config.VITE_BUILD_TIME);
      console.log('Analytics Enabled:', isAnalyticsEnabled());
      console.log('Debug Enabled:', isDebugEnabled());
      console.log('Beta Features:', isBetaFeaturesEnabled());
      
      const validation = validateRequiredEnvVars();
      if (!validation.isValid) {
        console.warn('Missing required environment variables:', validation.missing);
      } else {
        console.log('✅ All required environment variables are set');
      }
      console.groupEnd();
    }
  } catch (error) {
    console.warn('Failed to log environment info:', error);
  }
}

// Safe environment access for specific use cases
export function getEnvironmentVariable(key: string, fallback: string = ''): string {
  return safeGetEnvVar(key, fallback);
}

// Export types for use in other files
export type { EnvironmentConfig };

// Initialize logging in development (safely)
if (typeof window !== 'undefined' && typeof setTimeout !== 'undefined') {
  try {
    // Delay logging to ensure console is ready and avoid blocking
    setTimeout(() => {
      if (isDevelopment()) {
        logEnvironmentInfo();
      }
    }, 100);
  } catch (error) {
    // Silently fail if logging setup fails
  }
}