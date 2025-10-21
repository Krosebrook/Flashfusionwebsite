/**
 * @fileoverview OAuth Authentication Callback Handler
 * @chunk auth
 * @category authentication
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Handles OAuth authentication callbacks from social providers
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { LoadingState } from '../core/app-states/LoadingState';
import { ErrorState } from '../core/app-states/ErrorState';
import { useAuthentication } from '../../hooks/useAuthentication';
import type { AuthUser } from '../../hooks/useAuthentication';

interface AuthCallbackProps {
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
}

export function AuthCallback({ onAuthSuccess, onAuthError }: AuthCallbackProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuthStatus } = useAuthentication();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        // Get the session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ OAuth callback error:', error);
          setError(error.message);
          onAuthError(error.message);
          return;
        }

        if (!data.session?.user) {
          console.error('❌ No user session found in callback');
          setError('Authentication failed - no user session found');
          onAuthError('Authentication failed');
          return;
        }

        console.log('✅ OAuth callback successful for:', data.session.user.email);

        // Get or create user profile
        let { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        // If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          console.log('📝 Creating new user profile for OAuth user');
          
          const newProfile = {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || 
                  data.session.user.user_metadata?.name || 
                  data.session.user.email?.split('@')[0] || 'User',
            avatar: data.session.user.user_metadata?.avatar_url || 
                   data.session.user.user_metadata?.picture ||
                   `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.session.user.email}`,
            created_at: new Date().toISOString(),
            subscription_tier: 'free',
            onboarding_completed: false,
            role: 'user'
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile);

          if (insertError) {
            console.warn('⚠️ Profile creation warning:', insertError.message);
          }

          profile = newProfile;
        } else if (profileError) {
          console.warn('⚠️ Profile fetch warning:', profileError.message);
        }

        const user: AuthUser = {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: profile?.name || 
                data.session.user.user_metadata?.full_name || 
                data.session.user.user_metadata?.name || 
                data.session.user.email?.split('@')[0] || 'User',
          avatar: profile?.avatar || 
                  data.session.user.user_metadata?.avatar_url || 
                  data.session.user.user_metadata?.picture ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.session.user.email}`,
          role: profile?.role || 'user',
          subscription: profile?.subscription_tier || 'free'
        };

        // Store user data
        localStorage.setItem('ff-auth-token', data.session.access_token);
        localStorage.setItem('ff-remember-user', JSON.stringify(user));

        // Update auth status
        await checkAuthStatus();

        onAuthSuccess(user);
        
        // Redirect to main app
        window.location.href = '/';
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed';
        console.error('❌ OAuth callback processing failed:', errorMessage);
        setError(errorMessage);
        onAuthError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [onAuthSuccess, onAuthError, checkAuthStatus]);

  if (error) {
    return (
      <ErrorState 
        error={error}
        mode="oauth-callback"
        retryCount={0}
        isRecovering={false}
        performanceMetrics={{}}
        onRetry={() => window.location.href = '/'}
      />
    );
  }

  return (
    <LoadingState 
      message="Completing authentication..."
      detail="Processing your login and setting up your account"
    />
  );
}