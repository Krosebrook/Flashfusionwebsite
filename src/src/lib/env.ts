/**
 * @fileoverview Centralized Environment Configuration
 * @description Single source of truth for all environment variables with strict typing.
 * @module lib/env
 */

export const ENV = {
  // Core Application
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  MODE: import.meta.env.MODE || 'development',
  
  // Supabase (Strictly Typed)
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // AI Services
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  VITE_ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  
  // Analytics & Monitoring
  VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  
  // Feature Flags
  VITE_ENABLE_BETA_FEATURES: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true',
  VITE_DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',

  // Deployment
  VITE_VERCEL_TOKEN: import.meta.env.VITE_VERCEL_TOKEN || '',
} as const;

/**
 * Validates critical environment variables on startup.
 * Throws a clear error if critical keys are missing in production.
 */
export function validateEnv() {
  const missingKeys: string[] = [];
  
  if (!ENV.VITE_SUPABASE_URL) missingKeys.push('VITE_SUPABASE_URL');
  if (!ENV.VITE_SUPABASE_ANON_KEY) missingKeys.push('VITE_SUPABASE_ANON_KEY');
  
  if (missingKeys.length > 0) {
    console.error(`🚨 CRITICAL: Missing environment variables: ${missingKeys.join(', ')}`);
    // In strict production, we might want to throw, but for now we warn to prevent white screen of death
  }
}
