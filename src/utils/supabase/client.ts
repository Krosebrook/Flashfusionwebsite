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
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

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
      'X-Client-Info': 'flashfusion-web@1.0.0'
    }
  }
});

// Export configuration for use in components
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseKey,
  projectId
};

export default supabase;