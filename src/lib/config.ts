// FlashFusion configuration for Vite environment
// Uses central environment handling from env.ts where possible
import { ENV, getEnvironmentVariable, isDevelopment as isDevEnv, isProduction as isProdEnv } from './env';

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

// Create configuration object using the centralized ENV
const NODE_ENV = ENV.NODE_ENV || DEFAULT_VALUES.NODE_ENV;
const IS_PROD = isProdEnv();
const IS_DEV = isDevEnv();

export const CONFIG = {
  NODE_ENV: NODE_ENV,
  IS_PRODUCTION: IS_PROD,
  IS_DEVELOPMENT: IS_DEV,
  
  API_BASE_URL: ENV.VITE_API_BASE_URL || DEFAULT_VALUES.API_BASE_URL,
  
  ANALYTICS_ENABLED: ENV.VITE_ENABLE_ANALYTICS === 'true',
  ERROR_REPORTING: IS_PROD, // Default to true in prod
  PERFORMANCE_MONITORING: IS_PROD,
  DEBUG_MODE: ENV.VITE_ENABLE_DEBUG === 'true',
  
  SUPABASE_URL: ENV.VITE_SUPABASE_URL || DEFAULT_VALUES.SUPABASE_URL,
  SUPABASE_ANON_KEY: ENV.VITE_SUPABASE_ANON_KEY || DEFAULT_VALUES.SUPABASE_ANON_KEY,
  
  // AI Keys - Prioritize VITE_ prefixed keys from ENV
  OPENAI_API_KEY: ENV.VITE_OPENAI_API_KEY || DEFAULT_VALUES.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: ENV.VITE_ANTHROPIC_API_KEY || '',
  GOOGLE_AI_API_KEY: ENV.VITE_GOOGLE_AI_API_KEY || '',
  
  SENTRY_DSN: ENV.VITE_SENTRY_DSN || DEFAULT_VALUES.SENTRY_DSN,
  GA_MEASUREMENT_ID: ENV.VITE_GA_MEASUREMENT_ID || DEFAULT_VALUES.GA_MEASUREMENT_ID,
  STRIPE_PUBLISHABLE_KEY: ENV.VITE_STRIPE_PUBLISHABLE_KEY || '',
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
    // Check for critical AI keys if features enabled
    if (!CONFIG.OPENAI_API_KEY) {
        warnings.push('VITE_OPENAI_API_KEY is missing. AI features will not work.');
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
      OPENAI_API_KEY: CONFIG.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
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