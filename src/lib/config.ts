// FlashFusion configuration for Vite environment
// Uses VITE_ prefixed environment variables for client-side access

// Default values
const DEFAULT_VALUES = {
  NODE_ENV: 'development',
  API_BASE_URL: 'https://api.flashfusion.ai',
  ANALYTICS_ENABLED: false,
  ERROR_REPORTING: false,
  PERFORMANCE_MONITORING: false,
  DEBUG_MODE: true,
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  OPENAI_API_KEY: '',
  SENTRY_DSN: '',
  GA_MEASUREMENT_ID: '',
  STRIPE_SECRET_KEY: '',
};

// Safe environment variable getter for Vite
function getEnvironmentVariable(key: string, fallbackValue: string): string {
  try {
    // In Vite, environment variables are available via import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
      const value = import.meta.env[viteKey];
      if (value !== undefined && value !== '' && value !== 'undefined') {
        return value;
      }
      
      // Also check without VITE_ prefix for NODE_ENV
      if (key === 'NODE_ENV') {
        return import.meta.env.MODE || fallbackValue;
      }
    }
    
    // Browser environment fallback
    if (typeof window !== 'undefined') {
      return fallbackValue;
    }
    
    // Build/server environment fallback
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] || fallbackValue;
    }
    
    return fallbackValue;
  } catch (error) {
    // Silently fallback to default in development
    return fallbackValue;
  }
}

// Get boolean value safely
function getBooleanEnvironmentVariable(key: string, fallbackValue: boolean): boolean {
  const value = getEnvironmentVariable(key, String(fallbackValue));
  return value === 'true' || value === '1' || value === 'yes';
}

// Create configuration object
const CURRENT_NODE_ENV = getEnvironmentVariable('NODE_ENV', DEFAULT_VALUES.NODE_ENV);
const isProductionEnvironment = CURRENT_NODE_ENV === 'production';
const isDevelopmentEnvironment = CURRENT_NODE_ENV === 'development';

export const CONFIG = {
  NODE_ENV: CURRENT_NODE_ENV,
  IS_PRODUCTION: isProductionEnvironment,
  IS_DEVELOPMENT: isDevelopmentEnvironment,
  
  API_BASE_URL: getEnvironmentVariable('API_BASE_URL', DEFAULT_VALUES.API_BASE_URL),
  
  ANALYTICS_ENABLED: getBooleanEnvironmentVariable('ANALYTICS_ENABLED', isProductionEnvironment),
  ERROR_REPORTING: getBooleanEnvironmentVariable('ERROR_REPORTING', isProductionEnvironment),
  PERFORMANCE_MONITORING: getBooleanEnvironmentVariable('PERFORMANCE_MONITORING', isProductionEnvironment),
  DEBUG_MODE: getBooleanEnvironmentVariable('DEBUG_MODE', isDevelopmentEnvironment),
  
  SUPABASE_URL: getEnvironmentVariable('SUPABASE_URL', DEFAULT_VALUES.SUPABASE_URL),
  SUPABASE_ANON_KEY: getEnvironmentVariable('SUPABASE_ANON_KEY', DEFAULT_VALUES.SUPABASE_ANON_KEY),
  
  OPENAI_API_KEY: getEnvironmentVariable('OPENAI_API_KEY', DEFAULT_VALUES.OPENAI_API_KEY),
  SENTRY_DSN: getEnvironmentVariable('SENTRY_DSN', DEFAULT_VALUES.SENTRY_DSN),
  GA_MEASUREMENT_ID: getEnvironmentVariable('GA_MEASUREMENT_ID', DEFAULT_VALUES.GA_MEASUREMENT_ID),
  STRIPE_SECRET_KEY: getEnvironmentVariable('STRIPE_SECRET_KEY', DEFAULT_VALUES.STRIPE_SECRET_KEY),
};

// Check if using demo/mock configuration
const isDemoMode = CONFIG.SUPABASE_URL.includes('demo') || 
                   CONFIG.SUPABASE_ANON_KEY.includes('demo') ||
                   CONFIG.SUPABASE_URL === '' || 
                   CONFIG.SUPABASE_ANON_KEY === '';

// Simple exports
export const isProduction = CONFIG.IS_PRODUCTION;
export const isDevelopment = CONFIG.IS_DEVELOPMENT;

// Simple validation
export function validateConfig() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];
  
  if (isProduction) {
    // Production requirements
    if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('demo')) {
      errors.push('VITE_SUPABASE_URL must be set to your real Supabase URL in production');
    }
    if (!CONFIG.SUPABASE_ANON_KEY || CONFIG.SUPABASE_ANON_KEY.includes('demo')) {
      errors.push('VITE_SUPABASE_ANON_KEY must be set to your real Supabase anon key in production');
    }
  } else {
    // Development information
    if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
      if (isDemoMode) {
        info.push('✅ Using demo configuration for development - this is perfectly fine!');
        info.push('📝 To enable real features, update .env.local with your Supabase credentials');
      } else {
        info.push('✅ Using real Supabase configuration in development');
      }
    } else {
      warnings.push('No Supabase configuration found - create .env.local with VITE_SUPABASE_* variables');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    info: info,
    isDemoMode: isDemoMode,
  };
}

// Initialize function
export function initializeSimpleConfig() {
  const validation = validateConfig();
  
  if (isDevelopment) {
    console.log('🛠️ FlashFusion Development Mode');
    
    // Debug: Show current environment variable values
    console.log('🔧 Environment Check:', {
      SUPABASE_URL: CONFIG.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_ANON_KEY: CONFIG.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      isDemoMode: validation.isDemoMode ? '✅ Yes' : '❌ No'
    });
    
    // Show info messages
    if (validation.info.length > 0) {
      validation.info.forEach(info => console.log(info));
    }
    
    // Only show warnings if not in demo mode AND there are real issues
    if (validation.warnings.length > 0 && !validation.isDemoMode) {
      console.warn('⚠️ Configuration notes:', validation.warnings);
    }
  } else {
    console.log('🚀 FlashFusion Production Mode');
  }
  
  if (!validation.isValid) {
    if (isProduction) {
      console.error('❌ Configuration errors:', validation.errors);
    } else {
      console.warn('⚠️ Configuration issues:', validation.errors);
    }
  }
  
  return {
    config: CONFIG,
    validation: validation,
  };
}

export default CONFIG;