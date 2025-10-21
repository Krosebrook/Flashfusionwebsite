/**
 * @fileoverview Email Verification Handler
 * @chunk auth
 * @category authentication
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Handles email verification for new user signups
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';

export function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if this is a verification callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');

        if (!token || type !== 'signup') {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        console.log('📧 Processing email verification...');

        // The verification is automatically handled by Supabase when the user clicks the link
        // We just need to check the current session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Email verification failed');
          return;
        }

        if (data.session?.user?.email_confirmed_at) {
          console.log('✅ Email verified successfully');
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to app after a brief delay
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
        }

      } catch (error) {
        console.error('❌ Email verification processing failed:', error);
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, []);

  const handleReturnToLogin = () => {
    window.location.href = '/';
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-[var(--ff-success)] mx-auto" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-16 h-16 text-[var(--ff-error)] mx-auto" />;
      default:
        return <Mail className="w-16 h-16 text-[var(--ff-primary)] mx-auto animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'var(--ff-success)';
      case 'error':
      case 'expired':
        return 'var(--ff-error)';
      default:
        return 'var(--ff-primary)';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="ff-card border-[var(--border)] bg-[var(--ff-bg-dark)] shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            <CardTitle 
              className="text-2xl font-bold" 
              style={{ 
                fontFamily: 'var(--ff-font-primary)',
                color: getStatusColor()
              }}
            >
              {status === 'verifying' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'expired' && 'Link Expired'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === 'verifying' && (
              <div className="text-center">
                <p className="text-[var(--ff-text-secondary)] mb-4">
                  Please wait while we verify your email address...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ff-primary)]"></div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <Alert className="border-[var(--ff-success)] bg-[var(--ff-success)] bg-opacity-10">
                  <CheckCircle className="h-4 w-4 text-[var(--ff-success)]" />
                  <AlertDescription className="text-[var(--ff-success)]">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-[var(--ff-text-secondary)] text-sm">
                  You will be redirected to the app automatically, or you can click the button below.
                </p>
                <Button
                  onClick={handleReturnToLogin}
                  className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                >
                  Continue to FlashFusion
                </Button>
              </div>
            )}

            {(status === 'error' || status === 'expired') && (
              <div className="text-center space-y-4">
                <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)] bg-opacity-10">
                  <AlertCircle className="h-4 w-4 text-[var(--ff-error)]" />
                  <AlertDescription className="text-[var(--ff-error)]">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-[var(--ff-text-secondary)] text-sm">
                  Please return to the login page and try again, or contact support if the problem persists.
                </p>
                <Button
                  onClick={handleReturnToLogin}
                  variant="outline"
                  className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Login
                </Button>
              </div>
            )}

            {/* Trust indicators */}
            <div className="pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-center space-x-4 text-xs text-[var(--ff-text-muted)]">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}