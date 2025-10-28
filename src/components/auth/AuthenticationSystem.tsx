/**
 * @fileoverview FlashFusion Authentication System
 * @chunk auth
 * @category authentication
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive authentication system with login, signup, forgot password,
 * and CAPTCHA verification using FlashFusion design system.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { supabase } from '../../utils/supabase/client';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  ArrowLeft,
  Github,
  Chrome,
  KeyRound,
  Zap,
  X
} from 'lucide-react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  subscription?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-email';

interface AuthenticationSystemProps {
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
  onClose?: () => void;
}

/**
 * Simple CAPTCHA Component
 */
interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
  isLoading?: boolean;
}

function SimpleCaptcha({ onVerify, isLoading }: CaptchaProps) {
  const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [answer, setAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = useCallback(() => {
    const correctAnswer = num1 + num2;
    const userAnswer = parseInt(answer);
    
    if (userAnswer === correctAnswer) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  }, [num1, num2, answer, onVerify]);

  useEffect(() => {
    if (answer) {
      handleVerify();
    }
  }, [answer, handleVerify]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
        <Shield className="w-4 h-4 inline mr-2" />
        Verify you're not a robot
      </Label>
      <div className="flex items-center gap-3 p-4 bg-[var(--ff-surface)] rounded-lg border border-[var(--border)]">
        <div className="text-lg font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-mono)' }}>
          {num1} + {num2} = ?
        </div>
        <Input
          type="number"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-20 text-center bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
          disabled={isLoading}
        />
        {isVerified && (
          <CheckCircle className="w-5 h-5 text-[var(--ff-success)]" />
        )}
      </div>
    </div>
  );
}

/**
 * Main Authentication System Component
 */
export function AuthenticationSystem({ onAuthSuccess, onAuthError, onClose }: AuthenticationSystemProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  // Email validation
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  }, []);

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

  // Name validation
  const validateName = useCallback((name: string): boolean => {
    const isValid = name.trim().length >= 2;
    setNameError(isValid ? '' : 'Name must be at least 2 characters long');
    return isValid;
  }, []);

  // Handle login
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !isCaptchaVerified) return;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Quick demo mode for testing
      if (email === 'demo@flashfusion.ai' && password === 'demo123') {
        console.log('🎯 Demo login activated');
        
        const demoUser: AuthUser = {
          id: 'demo-user-001',
          email: 'demo@flashfusion.ai',
          name: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          role: 'pro',
          subscription: 'pro'
        };

        setAuthState({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Store demo user data
        if (rememberMe) {
          localStorage.setItem('ff-remember-user', JSON.stringify(demoUser));
          localStorage.setItem('ff-auth-token', 'demo-token-' + Date.now());
        }

        onAuthSuccess(demoUser);
        return;
      }
      
      console.log('🔐 Attempting login with Supabase for:', email);
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Supabase login error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Authentication failed - no user data received');
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Please verify your email address before signing in. Check your inbox for a verification link.'
        }));
        return;
      }

      console.log('✅ Supabase login successful for:', email);

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Profile fetch warning:', profileError.message);
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
        avatar: profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: profile?.role || 'user',
        subscription: profile?.subscription_tier || 'free'
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      // Store user data if remember me is checked
      if (rememberMe) {
        localStorage.setItem('ff-remember-user', JSON.stringify(user));
        localStorage.setItem('ff-auth-token', data.session?.access_token || '');
      }

      onAuthSuccess(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('❌ Login failed:', errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onAuthError(errorMessage);
    }
  }, [email, password, isCaptchaVerified, rememberMe, validateEmail, onAuthSuccess, onAuthError]);

  // Handle signup
  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isNameValid = validateName(name);
    
    if (!isEmailValid || !isPasswordValid || !isNameValid || !acceptTerms || !isCaptchaVerified) {
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('📝 Attempting signup with Supabase for:', email);
      
      // Real Supabase authentication signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            created_via: 'flashfusion_signup',
            signup_timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('❌ Supabase signup error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Signup failed - no user data received');
      }

      console.log('✅ Supabase signup successful for:', email);
      
      // Check if email confirmation is needed
      if (!data.user.email_confirmed_at) {
        console.log('📧 Email confirmation required for:', email);
        setMode('verify-email');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // If auto-confirmed, proceed to create profile
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
      }

      // Auto-login if confirmed
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: 'user',
        subscription: 'free'
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      onAuthSuccess(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('❌ Signup failed:', errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onAuthError(errorMessage);
    }
  }, [email, password, confirmPassword, name, acceptTerms, isCaptchaVerified, validateEmail, validatePassword, validateName, onAuthSuccess, onAuthError]);

  // Handle forgot password
  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !isCaptchaVerified) return;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🔑 Attempting password reset for:', email);
      
      // Real Supabase password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Password reset email sent to:', email);
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: null 
      }));
      
      // Show success message
      setMode('verify-email');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      console.error('❌ Password reset failed:', errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onAuthError(errorMessage);
    }
  }, [email, isCaptchaVerified, validateEmail, onAuthError]);

  // Handle social login
  const handleSocialLogin = useCallback(async (provider: 'google' | 'github') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log(`🔐 Attempting ${provider} social login`);
      
      // Real Supabase social login
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error(`❌ ${provider} login error:`, error);
        throw new Error(error.message);
      }

      console.log(`✅ ${provider} login initiated successfully`);
      
      // OAuth will redirect, so we don't need to handle success here
      // The redirect will be handled by the auth callback
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} login failed`;
      console.error(`❌ ${provider} login failed:`, errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onAuthError(errorMessage);
    }
  }, [onAuthError]);

  // Check for remembered user
  useEffect(() => {
    const rememberedUser = localStorage.getItem('ff-remember-user');
    if (rememberedUser) {
      try {
        const user = JSON.parse(rememberedUser);
        setEmail(user.email);
        setRememberMe(true);
      } catch (error) {
        console.error('Failed to parse remembered user:', error);
      }
    }
  }, []);

  const renderLoginForm = () => (
    <div className="space-y-6">
      {/* Demo Mode Notice */}
      <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
        <Zap className="h-4 w-4 text-[var(--ff-secondary)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-secondary)]">Quick Demo:</strong> Use email <code className="bg-[var(--ff-surface)] px-1 rounded">demo@flashfusion.ai</code> and password <code className="bg-[var(--ff-surface)] px-1 rounded">demo123</code> to instantly access the platform.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
          </div>
          {emailError && (
            <p className="text-sm text-[var(--ff-error)] mt-1">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors"
              disabled={authState.isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <SimpleCaptcha onVerify={setIsCaptchaVerified} isLoading={authState.isLoading} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={authState.isLoading}
          />
          <Label htmlFor="remember" className="text-sm text-[var(--ff-text-secondary)]">
            Remember me
          </Label>
        </div>
        <button
          type="button"
          onClick={() => setMode('forgot-password')}
          className="text-sm text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors font-medium"
          disabled={authState.isLoading}
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        onClick={handleLogin}
        disabled={authState.isLoading || !email || !password || !isCaptchaVerified}
        className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{ fontFamily: 'var(--ff-font-primary)' }}
      >
        {authState.isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <KeyRound className="w-5 h-5 mr-2" />
            Sign In
          </>
        )}
      </Button>
    </div>
  );

  const renderSignupForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              onBlur={() => validateName(name)}
              className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
          </div>
          {nameError && (
            <p className="text-sm text-[var(--ff-error)] mt-1">{nameError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
          </div>
          {emailError && (
            <p className="text-sm text-[var(--ff-error)] mt-1">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors"
              disabled={authState.isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-sm text-[var(--ff-error)] mt-1">{passwordError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors"
              disabled={authState.isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {password !== confirmPassword && confirmPassword && (
            <p className="text-sm text-[var(--ff-error)] mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <SimpleCaptcha onVerify={setIsCaptchaVerified} isLoading={authState.isLoading} />

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={setAcceptTerms}
          disabled={authState.isLoading}
        />
        <Label htmlFor="terms" className="text-sm text-[var(--ff-text-secondary)] leading-relaxed">
          I agree to the{' '}
          <a href="/terms" className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        onClick={handleSignup}
        disabled={authState.isLoading || !name || !email || !password || !confirmPassword || !acceptTerms || !isCaptchaVerified || password !== confirmPassword}
        className="w-full bg-[var(--ff-secondary)] hover:bg-[var(--ff-secondary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{ fontFamily: 'var(--ff-font-primary)' }}
      >
        {authState.isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <User className="w-5 h-5 mr-2" />
            Create Account
          </>
        )}
      </Button>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
          Reset your password
        </h3>
        <p className="text-[var(--ff-text-secondary)] text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email" className="text-sm font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20"
              disabled={authState.isLoading}
              required
            />
          </div>
          {emailError && (
            <p className="text-sm text-[var(--ff-error)] mt-1">{emailError}</p>
          )}
        </div>
      </div>

      <SimpleCaptcha onVerify={setIsCaptchaVerified} isLoading={authState.isLoading} />

      <div className="space-y-4">
        <Button
          type="submit"
          onClick={handleForgotPassword}
          disabled={authState.isLoading || !email || !isCaptchaVerified}
          className="w-full bg-[var(--ff-accent)] hover:bg-[var(--ff-accent-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{ fontFamily: 'var(--ff-font-primary)' }}
        >
          {authState.isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending reset email...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Send Reset Email
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => setMode('login')}
          className="w-full text-center text-sm text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors font-medium"
          disabled={authState.isLoading}
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderVerifyEmailForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[var(--ff-primary)] bg-opacity-10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-[var(--ff-primary)]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Check your email
          </h3>
          <p className="text-[var(--ff-text-secondary)] text-sm max-w-sm mx-auto">
            We've sent you a verification link at <strong className="text-[var(--ff-text-primary)]">{email}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-center text-sm text-[var(--ff-text-muted)]">
          Didn't receive the email? Check your spam folder or
        </p>
        
        <Button
          type="button"
          onClick={async () => {
            if (!email) return;
            
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
            
            try {
              console.log('📧 Resending verification email to:', email);
              
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                  emailRedirectTo: `${window.location.origin}/verify-email`
                }
              });

              if (error) {
                console.error('❌ Resend verification error:', error);
                throw new Error(error.message);
              }

              console.log('✅ Verification email resent to:', email);
              
              setAuthState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: null 
              }));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
              console.error('❌ Resend verification failed:', errorMessage);
              
              setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
              }));
            }
          }}
          disabled={authState.isLoading}
          variant="outline"
          className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
          style={{ fontFamily: 'var(--ff-font-primary)' }}
        >
          {authState.isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Resending...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Resend verification email
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => setMode('login')}
          className="w-full text-center text-sm text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] transition-colors font-medium"
          disabled={authState.isLoading}
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderSocialLogin = () => (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--ff-bg-dark)] px-2 text-[var(--ff-text-muted)]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={authState.isLoading}
          className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
          style={{ fontFamily: 'var(--ff-font-primary)' }}
        >
          <Chrome className="w-5 h-5 mr-2" />
          Google
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          disabled={authState.isLoading}
          className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
          style={{ fontFamily: 'var(--ff-font-primary)' }}
        >
          <Github className="w-5 h-5 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Welcome back';
      case 'signup':
        return 'Create your account';
      case 'forgot-password':
        return 'Forgot password';
      case 'verify-email':
        return 'Email verification';
      default:
        return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your FlashFusion account';
      case 'signup':
        return 'Join FlashFusion and start building amazing applications';
      case 'forgot-password':
        return 'Reset your account password';
      case 'verify-email':
        return 'Verify your email address to continue';
      default:
        return '';
    }
  };

  const getCurrentForm = () => {
    switch (mode) {
      case 'login':
        return renderLoginForm();
      case 'signup':
        return renderSignupForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'verify-email':
        return renderVerifyEmailForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ff-fade-in-up">
      <div className="relative w-full max-w-md mx-4">
        <Card className="ff-card border-[var(--border)] bg-[var(--ff-bg-dark)] shadow-2xl">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200 z-10"
              disabled={authState.isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <CardHeader className="space-y-1 text-center pb-6">
            <div className="w-12 h-12 mx-auto bg-[var(--ff-primary)] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[var(--ff-primary)]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-[var(--ff-text-secondary)]">
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Display */}
            {authState.error && (
              <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)] bg-opacity-10">
                <AlertCircle className="h-4 w-4 text-[var(--ff-error)]" />
                <AlertDescription className="text-[var(--ff-error)]">
                  {authState.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Main Form */}
            {getCurrentForm()}

            {/* Social Login - Only show for login and signup */}
            {(mode === 'login' || mode === 'signup') && renderSocialLogin()}

            {/* Mode Switch */}
            {mode === 'login' && (
              <div className="text-center space-y-2">
                <p className="text-sm text-[var(--ff-text-muted)]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors font-medium"
                    disabled={authState.isLoading}
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <div className="text-center space-y-2">
                <p className="text-sm text-[var(--ff-text-muted)]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors font-medium"
                    disabled={authState.isLoading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-center space-x-4 text-xs text-[var(--ff-text-muted)]">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}