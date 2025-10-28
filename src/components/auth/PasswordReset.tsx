/**
 * @fileoverview Password Reset Handler
 * @chunk auth
 * @category authentication
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Handles password reset for users who forgot their password
 */

import React, { useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft 
} from 'lucide-react';

export function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password validation
  const validatePassword = useCallback((password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!hasLowerCase) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!hasNumbers) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }

    setPasswordError('');
    return true;
  }, []);

  const handlePasswordReset = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) return;
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 Updating password...');
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Password update error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Password updated successfully');
      setIsComplete(true);
      
      // Redirect to app after a brief delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      console.error('❌ Password reset failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [password, confirmPassword, validatePassword]);

  const handleReturnToLogin = () => {
    window.location.href = '/';
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="ff-card border-[var(--border)] bg-[var(--ff-bg-dark)] shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto bg-[var(--ff-success)] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[var(--ff-success)]" />
              </div>
              <CardTitle 
                className="text-2xl font-bold text-[var(--ff-success)]" 
                style={{ fontFamily: 'var(--ff-font-primary)' }}
              >
                Password Updated!
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-[var(--ff-success)] bg-[var(--ff-success)] bg-opacity-10">
                <CheckCircle className="h-4 w-4 text-[var(--ff-success)]" />
                <AlertDescription className="text-[var(--ff-success)]">
                  Your password has been successfully updated. You can now sign in with your new password.
                </AlertDescription>
              </Alert>
              
              <p className="text-center text-[var(--ff-text-secondary)] text-sm">
                You will be redirected to the app automatically, or you can click the button below.
              </p>
              
              <Button
                onClick={handleReturnToLogin}
                className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200"
                style={{ fontFamily: 'var(--ff-font-primary)' }}
              >
                Continue to FlashFusion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="ff-card border-[var(--border)] bg-[var(--ff-bg-dark)] shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 mx-auto bg-[var(--ff-primary)] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[var(--ff-primary)]" />
            </div>
            <CardTitle 
              className="text-2xl font-bold text-[var(--ff-text-primary)]" 
              style={{ fontFamily: 'var(--ff-font-primary)' }}
            >
              Reset Your Password
            </CardTitle>
            <p className="text-[var(--ff-text-secondary)] text-sm mt-2">
              Enter your new password below
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* Error Display */}
              {error && (
                <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)] bg-opacity-10">
                  <AlertCircle className="h-4 w-4 text-[var(--ff-error)]" />
                  <AlertDescription className="text-[var(--ff-error)]">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="new-password" 
                    className="text-sm font-semibold text-[var(--ff-text-primary)]" 
                    style={{ fontFamily: 'var(--ff-font-primary)' }}
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                      }}
                      onBlur={() => validatePassword(password)}
                      className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-[var(--ff-error)] mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="confirm-password" 
                    className="text-sm font-semibold text-[var(--ff-text-primary)]" 
                    style={{ fontFamily: 'var(--ff-font-primary)' }}
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password !== confirmPassword && confirmPassword && (
                    <p className="text-sm text-[var(--ff-error)] mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword || password !== confirmPassword || !!passwordError}
                  className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleReturnToLogin}
                  variant="outline"
                  className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}