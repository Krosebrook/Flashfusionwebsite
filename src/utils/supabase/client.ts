/**
 * @fileoverview Supabase Client Configuration for FlashFusion
 * @chunk supabase
 * @category utils
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Supabase client setup with proper configuration for authentication
 */

import { createClient } from '@supabase/supabase-js';
import { ENV } from '../../src/lib/env';

const supabaseUrl = ENV.VITE_SUPABASE_URL;
const supabaseKey = ENV.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'flashfusion-web'
    }
  }
});

// Export configuration for use in components
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseKey,
  projectId: supabaseUrl.split('.')[0].replace('https://', '')
};

export default supabase;