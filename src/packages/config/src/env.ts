/**
 * Environment configuration for FlashFusion
 */

// Helper to safely access env vars with fallback
const getEnv = (key: string, fallback: string = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || import.meta.env[`VITE_${key}`] || fallback;
  }
  return fallback;
};

export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';
export const isTest = import.meta.env.MODE === 'test';

export const API_BASE_URL = getEnv('API_BASE_URL', 'http://localhost:3000');
export const SUPABASE_URL = getEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

// AI Keys
export const OPENAI_API_KEY = getEnv('OPENAI_API_KEY');
export const ANTHROPIC_API_KEY = getEnv('ANTHROPIC_API_KEY');

export const config = {
  isDevelopment,
  isProduction,
  isTest,
  apiBaseUrl: API_BASE_URL,
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  openaiApiKey: OPENAI_API_KEY,
  anthropicApiKey: ANTHROPIC_API_KEY,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
};