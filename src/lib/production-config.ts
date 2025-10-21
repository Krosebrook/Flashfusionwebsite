// Simple production configuration for FlashFusion
import { CONFIG, isProduction, isDevelopment } from './config';

// Production environment configuration
export const PRODUCTION_CONFIG = {
  // Environment detection
  isProd: isProduction,
  isDev: isDevelopment,
  
  // API endpoints
  API_BASE_URL: CONFIG.API_BASE_URL,
  
  // Feature flags
  FEATURES: {
    ANALYTICS_ENABLED: CONFIG.ANALYTICS_ENABLED,
    ERROR_REPORTING: CONFIG.ERROR_REPORTING,
    PERFORMANCE_MONITORING: CONFIG.PERFORMANCE_MONITORING,
    A_B_TESTING: false,
    BETA_FEATURES: isDevelopment,
    DEBUG_TOOLS: CONFIG.DEBUG_MODE,
  },
  
  // Performance thresholds
  PERFORMANCE: {
    MAX_BUNDLE_SIZE: 512 * 1024, // 512KB
    MAX_API_RESPONSE_TIME: 2000, // 2 seconds
    MAX_PAGE_LOAD_TIME: 3000, // 3 seconds
    LIGHTHOUSE_SCORE_THRESHOLD: 90,
  },
  
  // Rate limiting
  RATE_LIMITS: {
    AI_TOOLS_PER_HOUR: 100,
    API_CALLS_PER_MINUTE: 60,
    PROJECT_DEPLOYMENTS_PER_DAY: 10,
  },
  
  // CDN and caching
  CDN: {
    IMAGES_BASE_URL: 'https://cdn.flashfusion.ai/images',
    ASSETS_BASE_URL: 'https://cdn.flashfusion.ai/assets',
    CACHE_DURATION: 31536000, // 1 year
  },
  
  // Monitoring endpoints
  MONITORING: {
    SENTRY_DSN: CONFIG.SENTRY_DSN,
    ANALYTICS_ID: CONFIG.GA_MEASUREMENT_ID,
    PERFORMANCE_API: CONFIG.API_BASE_URL + '/metrics',
  },
};

// Create Supabase client mock for development
function createMockSupabaseClient() {
  const mockClient = {
    auth: {
      signUp: function() { return Promise.resolve({ data: null, error: null }); },
      signIn: function() { return Promise.resolve({ data: null, error: null }); },
      signOut: function() { return Promise.resolve({ error: null }); },
      getSession: function() { return Promise.resolve({ data: { session: null }, error: null }); },
      getUser: function() { return Promise.resolve({ data: { user: null }, error: null }); },
      onAuthStateChange: function() { 
        return { 
          data: { 
            subscription: { 
              unsubscribe: function() {} 
            } 
          } 
        }; 
      },
    },
    from: function() {
      return {
        select: function() { return Promise.resolve({ data: [], error: null }); },
        insert: function() { return Promise.resolve({ data: null, error: null }); },
        update: function() { return Promise.resolve({ data: null, error: null }); },
        delete: function() { return Promise.resolve({ data: null, error: null }); },
      };
    },
  };
  
  return mockClient;
}

// Production-ready Supabase client factory
export function createProductionSupabaseClient() {
  const supabaseUrl = CONFIG.SUPABASE_URL;
  const supabaseKey = CONFIG.SUPABASE_ANON_KEY;
  
  // Check if we have credentials
  if (!supabaseUrl || !supabaseKey) {
    if (isProduction) {
      throw new Error('Missing required Supabase credentials in production environment');
    }
    
    console.warn('⚠️ Missing Supabase credentials, using mock client for development');
    return createMockSupabaseClient();
  }
  
  try {
    // Dynamic import to avoid build issues
    const { createClient } = require('@supabase/supabase-js');
    
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        headers: {
          'x-application-name': 'FlashFusion',
        },
      },
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    
    if (isProduction) {
      throw new Error('Supabase configuration error in production');
    }
    
    return createMockSupabaseClient();
  }
}

// Health check configuration
export const HEALTH_CHECK = {
  endpoints: [
    '/api/health',
    '/api/auth/status',
    '/api/tools/status',
    '/api/projects/status',
  ],
  timeout: 5000,
  retries: 3,
};

// SEO and metadata
export const SEO_CONFIG = {
  title: 'FlashFusion - AI-Powered Web Application Builder',
  description: 'Build complete web applications with AI. 60+ AI tools, real-time collaboration, and deployment to 8+ platforms.',
  keywords: 'AI web builder, no-code platform, web development, AI tools, app generator',
  canonical: 'https://flashfusion.ai',
  image: 'https://flashfusion.ai/og-image.png',
  twitter: '@FlashFusionAI',
};

// Initialize configuration
export function initializeConfig() {
  const hasSupabase = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
  
  if (isProduction) {
    console.log('🚀 FlashFusion Production Mode Active');
    console.log('📊 Analytics:', PRODUCTION_CONFIG.FEATURES.ANALYTICS_ENABLED);
    console.log('🔍 Error Reporting:', PRODUCTION_CONFIG.FEATURES.ERROR_REPORTING);
    console.log('⚡ Performance Monitoring:', PRODUCTION_CONFIG.FEATURES.PERFORMANCE_MONITORING);
    
    if (!hasSupabase) {
      console.error('❌ Missing Supabase configuration in production');
    }
  } else {
    console.log('🛠️ FlashFusion Development Mode');
    console.log('🔧 Debug Tools:', PRODUCTION_CONFIG.FEATURES.DEBUG_TOOLS);
    console.log('🧪 Beta Features:', PRODUCTION_CONFIG.FEATURES.BETA_FEATURES);
    
    if (!hasSupabase) {
      console.warn('⚠️ Missing Supabase configuration (using mock client)');
    }
  }
  
  return {
    isValid: isProduction ? hasSupabase : true,
    config: PRODUCTION_CONFIG,
    errors: isProduction && !hasSupabase ? ['Missing Supabase configuration'] : [],
  };
}

// Export simple values
export { isProduction, isDevelopment };
export { CONFIG as ENV };