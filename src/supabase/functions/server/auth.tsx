/**
 * @fileoverview Authentication API Routes for FlashFusion
 * @chunk auth
 * @category api
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Real authentication endpoints using Supabase Auth with email verification
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';

const auth = new Hono();

// CORS and logging
auth.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
auth.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

/**
 * User Signup with Email Verification
 * POST /make-server-88829a40/auth/signup
 */
auth.post('/make-server-88829a40/auth/signup', async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    // Validate required fields
    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      }, 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return c.json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      }, 400);
    }

    console.log('🔐 Creating user account for:', email);

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        created_via: 'flashfusion_signup',
        signup_timestamp: new Date().toISOString()
      },
      // Automatically confirm email for development - set to false in production
      email_confirm: false // Set to false to require email verification
    });

    if (error) {
      console.error('❌ Signup error:', error);
      return c.json({ 
        success: false, 
        message: error.message || 'Failed to create account' 
      }, 400);
    }

    if (!data.user) {
      return c.json({ 
        success: false, 
        message: 'Failed to create user account' 
      }, 500);
    }

    console.log('✅ User created successfully:', data.user.id);

    // Store additional user profile data in database
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name,
        created_at: new Date().toISOString(),
        subscription_tier: 'free',
        onboarding_completed: false
      });

    if (profileError) {
      console.warn('⚠️ Profile creation warning:', profileError.message);
      // Don't fail signup if profile creation fails
    }

    return c.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        email_confirmed: data.user.email_confirmed_at !== null
      }
    });

  } catch (error) {
    console.error('❌ Signup endpoint error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error during signup' 
    }, 500);
  }
});

/**
 * User Login
 * POST /make-server-88829a40/auth/login
 */
auth.post('/make-server-88829a40/auth/login', async (c) => {
  try {
    const { email, password, rememberMe } = await c.req.json();

    // Validate required fields
    if (!email || !password) {
      return c.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, 400);
    }

    console.log('🔐 Login attempt for:', email);

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Login error:', error);
      return c.json({ 
        success: false, 
        message: error.message || 'Invalid email or password' 
      }, 401);
    }

    if (!data.user) {
      return c.json({ 
        success: false, 
        message: 'Authentication failed' 
      }, 401);
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      return c.json({ 
        success: false, 
        message: 'Please verify your email address before signing in. Check your inbox for a verification link.' 
      }, 403);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    console.log('✅ Login successful for:', email);

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: profile?.role || 'user',
        subscription: profile?.subscription_tier || 'free',
        onboarding_completed: profile?.onboarding_completed || false
      },
      token: data.session?.access_token || ''
    });

  } catch (error) {
    console.error('❌ Login endpoint error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error during login' 
    }, 500);
  }
});

/**
 * Password Reset Request
 * POST /make-server-88829a40/auth/forgot-password
 */
auth.post('/make-server-88829a40/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ 
        success: false, 
        message: 'Email address is required' 
      }, 400);
    }

    console.log('🔑 Password reset request for:', email);

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      console.error('❌ Password reset error:', error);
      return c.json({ 
        success: false, 
        message: error.message || 'Failed to send reset email' 
      }, 400);
    }

    console.log('✅ Password reset email sent to:', email);

    return c.json({
      success: true,
      message: 'Password reset email sent! Please check your inbox and follow the instructions.'
    });

  } catch (error) {
    console.error('❌ Password reset endpoint error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error during password reset' 
    }, 500);
  }
});

/**
 * Email Verification Resend
 * POST /make-server-88829a40/auth/resend-verification
 */
auth.post('/make-server-88829a40/auth/resend-verification', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ 
        success: false, 
        message: 'Email address is required' 
      }, 400);
    }

    console.log('📧 Resending verification email to:', email);

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/verify-email`
      }
    });

    if (error) {
      console.error('❌ Resend verification error:', error);
      return c.json({ 
        success: false, 
        message: error.message || 'Failed to resend verification email' 
      }, 400);
    }

    console.log('✅ Verification email resent to:', email);

    return c.json({
      success: true,
      message: 'Verification email resent! Please check your inbox.'
    });

  } catch (error) {
    console.error('❌ Resend verification endpoint error:', error);
    return c.json({ 
      success: false, 
      message: 'Internal server error during email resend' 
    }, 500);
  }
});

/**
 * Health Check
 * GET /make-server-88829a40/auth/health
 */
auth.get('/make-server-88829a40/auth/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'FlashFusion Auth API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default auth;