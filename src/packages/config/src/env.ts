/**
 * Environment configuration for FlashFusion
 */

export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production';
export const isTest = import.meta.env.MODE === 'test';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const config = {
  isDevelopment,
  isProduction,
  isTest,
  apiBaseUrl: API_BASE_URL,
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
};