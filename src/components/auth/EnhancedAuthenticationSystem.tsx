/**
 * @fileoverview Enhanced FlashFusion Authentication System
 * @chunk auth
 * @category authentication
 * @version 2.0.0
 * 
 * Comprehensive authentication system with modern UX patterns, security features,
 * and quick demo functionality for FlashFusion platform.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { StripeCheckoutPromo } from './StripeCheckoutPromo';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  Zap, 
  Users,
  Github,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Gift,
  Clock,
  CreditCard,
  Star,
  Crown,
  Percent
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: { plan: string, active: boolean };
}

interface EnhancedAuthenticationSystemProps {
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'demo';

export function EnhancedAuthenticationSystem({ 
  onAuthSuccess, 
  onAuthError, 
  onClose 
}: EnhancedAuthenticationSystemProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showDiscountOffer, setShowDiscountOffer] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false,
    captchaAnswer: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaQuestion, setCaptchaQuestion] = useState({ a: 6, b: 3, answer: 9 });
  const [showPromoOffer, setShowPromoOffer] = useState(false);
  const [promoOfferTimer, setPromoOfferTimer] = useState<NodeJS.Timeout | null>(null);

  // Generate new captcha question
  const generateCaptcha = useCallback(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
  }, []);

  // Initialize captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Handle promotional offer timing
  useEffect(() => {
    if (authMode === 'signup' && !showPromoOffer) {
      // Show promotional offer after user completes basic signup form
      const timer = setTimeout(() => {
        setShowPromoOffer(true);
      }, 3000); // Show after 3 seconds on signup page
      
      setPromoOfferTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else if (authMode !== 'signup') {
      setShowPromoOffer(false);
      if (promoOfferTimer) {
        clearTimeout(promoOfferTimer);
        setPromoOfferTimer(null);
      }
    }
  }, [authMode, showPromoOffer, promoOfferTimer]);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation for signin/signup
    if (authMode !== 'forgot-password' && authMode !== 'demo') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (authMode === 'signup' && !validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters long';
      }

      // Confirm password for signup
      if (authMode === 'signup') {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        // Name validation for signup
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
      }

      // Captcha validation
      if (!formData.captchaAnswer) {
        newErrors.captchaAnswer = 'Please solve the math problem';
      } else if (parseInt(formData.captchaAnswer) !== captchaQuestion.answer) {
        newErrors.captchaAnswer = 'Incorrect answer. Please try again.';
        generateCaptcha();
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle demo login
  const handleDemoLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate demo authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoUser: AuthUser = {
        id: 'demo-user',
        email: 'demo@flashfusion.ai',
        name: 'Demo User',
        avatar: undefined
      };

      // Store demo session
      localStorage.setItem('ff-demo-session', 'true');
      onAuthSuccess(demoUser);
    } catch (error) {
      onAuthError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onAuthSuccess, onAuthError]);

  // Handle OAuth login
  const handleOAuthLogin = useCallback(async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to OAuth provider
      console.log(`Initiating ${provider} OAuth...`);
      
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, simulate successful OAuth
      const oauthUser: AuthUser = {
        id: `${provider}-user-${Date.now()}`,
        email: `user@${provider === 'google' ? 'gmail.com' : 'github.com'}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: undefined
      };

      onAuthSuccess(oauthUser);
    } catch (error) {
      onAuthError(`${provider} authentication failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [onAuthSuccess, onAuthError]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (authMode === 'demo') {
        await handleDemoLogin();
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (authMode === 'signin') {
        // Simulate signin
        const user: AuthUser = {
          id: 'user-' + Date.now(),
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          avatar: undefined
        };

        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('ff-remember-user', JSON.stringify(user));
        }

        onAuthSuccess(user);
      } else if (authMode === 'signup') {
        // Instead of completing signup immediately, show promotional offer
        if (validateForm() && !showPromoOffer) {
          setShowPromoOffer(true);
          return;
        }
        
        // Simulate signup (this would be after payment or free account selection)
        const user: AuthUser = {
          id: 'user-' + Date.now(),
          email: formData.email,
          name: formData.name,
          avatar: undefined,
          subscription: { plan: 'free', active: true }
        };
        onAuthSuccess(user);
      } else if (authMode === 'forgot-password') {
        // Simulate password reset email
        alert(`Password reset email sent to ${formData.email}`);
        setAuthMode('signin');
      }
    } catch (error) {
      onAuthError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [authMode, formData, validateForm, onAuthSuccess, onAuthError, handleDemoLogin]);

  // Handle promotional offer success
  const handlePromoSuccess = useCallback((subscriptionData: any) => {
    console.log('Promotional subscription successful:', subscriptionData);
    
    // Create user with subscription data
    const user: AuthUser = {
      id: 'user-' + Date.now(),
      email: formData.email,
      name: formData.name,
      avatar: undefined,
      subscription: subscriptionData
    };
    
    // Store subscription info
    localStorage.setItem('ff-subscription', JSON.stringify(subscriptionData));
    
    onAuthSuccess(user);
  }, [formData, onAuthSuccess]);

  // Handle promotional offer error
  const handlePromoError = useCallback((error: string) => {
    console.error('Promotional checkout error:', error);
    onAuthError(`Payment failed: ${error}`);
    setShowPromoOffer(false); // Allow user to continue with free account
  }, [onAuthError]);

  // Handle continuing with free account
  const handleContinueFree = useCallback(() => {
    setShowPromoOffer(false);
    
    // Complete free account creation
    const user: AuthUser = {
      id: 'user-' + Date.now(),
      email: formData.email,
      name: formData.name,
      avatar: undefined,
      subscription: { plan: 'free', active: true }
    };
    
    onAuthSuccess(user);
  }, [formData, onAuthSuccess]);

  // Load remembered user on mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('ff-remember-user');
    if (rememberedUser) {
      try {
        const user = JSON.parse(rememberedUser);
        setFormData(prev => ({ 
          ...prev, 
          email: user.email, 
          rememberMe: true 
        }));
      } catch (error) {
        console.error('Failed to load remembered user:', error);
      }
    }
  }, []);

  const getTitle = () => {
    switch (authMode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot-password': return 'Reset Password';
      case 'demo': return 'Quick Demo Access';
      default: return 'Sign In';
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case 'signin': return 'Sign in to access your FlashFusion workspace';
      case 'signup': return 'Join thousands of creators building with AI';
      case 'forgot-password': return 'We\'ll send you a link to reset your password';
      case 'demo': return 'Experience FlashFusion without creating an account';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Show promotional offer if triggered */}
      {showPromoOffer && authMode === 'signup' && (
        <StripeCheckoutPromo
          onClose={() => setShowPromoOffer(false)}
          onSuccess={handlePromoSuccess}
          onError={handlePromoError}
          userEmail={formData.email}
          userName={formData.name}
        />
      )}

      {/* Show regular auth modal when not showing promo */}
      {!showPromoOffer && (
        <Card className="w-full max-w-md bg-[var(--ff-surface)] border-[var(--ff-primary)]/20 shadow-2xl">
          <CardHeader className="relative space-y-4 pb-6">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  FF
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  FlashFusion
                </h1>
                <p className="text-xs text-[var(--ff-text-muted)]">AI Development Platform</p>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                {getTitle()}
              </h2>
              <p className="text-sm text-[var(--ff-text-muted)]">
                {getSubtitle()}
              </p>
            </div>

            {/* Quick Demo Banner */}
            {authMode !== 'demo' && (
              <div className="bg-gradient-to-r from-[var(--ff-primary)]/10 to-[var(--ff-secondary)]/10 border border-[var(--ff-primary)]/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-[var(--ff-primary)]" />
                    <span className="text-sm font-medium text-white">Quick Demo Available</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthMode('demo')}
                    className="text-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/10 h-8 px-3"
                  >
                    Try Now
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Demo Mode Content */}
            {authMode === 'demo' && (
              <div className="space-y-4">
                <div className="bg-[var(--ff-primary)]/10 border border-[var(--ff-primary)]/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-[var(--ff-primary)] mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Demo Credentials</h3>
                      <div className="space-y-1 text-xs text-[var(--ff-text-muted)]">
                        <p><strong>Email:</strong> demo@flashfusion.ai</p>
                        <p><strong>Password:</strong> demo123</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Accessing Demo...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Access Demo Instantly
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthMode('signin')}
                    className="text-[var(--ff-text-muted)] hover:text-white"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            )}

            {/* Regular Auth Forms */}
            {authMode !== 'demo' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Signup only) */}
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                        errors.name ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                        errors.email ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                {authMode !== 'forgot-password' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                          errors.password ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-white/10"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field (Signup only) */}
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--ff-text-muted)]" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-[var(--ff-text-muted)] ${
                          errors.confirmPassword ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-white/10"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Captcha */}
                {authMode !== 'forgot-password' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Security Check</label>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-center min-w-[120px]">
                        <span className="text-lg font-bold text-white">
                          {captchaQuestion.a} + {captchaQuestion.b} = ?
                        </span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Answer"
                        value={formData.captchaAnswer}
                        onChange={(e) => handleInputChange('captchaAnswer', e.target.value)}
                        className={`w-20 bg-white/5 border-white/20 text-white text-center ${
                          errors.captchaAnswer ? 'border-red-500' : 'focus:border-[var(--ff-primary)]'
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateCaptcha}
                        className="text-[var(--ff-text-muted)] hover:text-white"
                      >
                        Refresh
                      </Button>
                    </div>
                    {errors.captchaAnswer && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.captchaAnswer}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                {authMode === 'signin' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-[var(--ff-text-muted)]">
                        Remember me
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthMode('forgot-password')}
                      className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] text-sm"
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {authMode === 'signin' ? 'Signing In...' : 
                       authMode === 'signup' ? 'Creating Account...' : 
                       'Sending Reset Link...'}
                    </>
                  ) : (
                    <>
                      {authMode === 'signin' ? 'Sign In' : 
                       authMode === 'signup' ? 'Create Account' : 
                       'Send Reset Link'}
                    </>
                  )}
                </Button>

                {/* OAuth Options */}
                {authMode !== 'forgot-password' && (
                  <>
                    <div className="relative">
                      <Separator className="bg-white/20" />
                      <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--ff-surface)] px-3 text-xs text-[var(--ff-text-muted)]">
                        Or continue with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOAuthLogin('google')}
                        disabled={isLoading}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOAuthLogin('github')}
                        disabled={isLoading}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </>
                )}

                {/* Mode Switch */}
                <div className="text-center space-y-2">
                  {authMode === 'signin' && (
                    <p className="text-sm text-[var(--ff-text-muted)]">
                      Don't have an account?{' '}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAuthMode('signup')}
                        className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] p-0 h-auto font-semibold"
                      >
                        Sign up for free
                      </Button>
                    </p>
                  )}
                  {authMode === 'signup' && (
                    <p className="text-sm text-[var(--ff-text-muted)]">
                      Already have an account?{' '}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAuthMode('signin')}
                        className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] p-0 h-auto font-semibold"
                      >
                        Sign in
                      </Button>
                    </p>
                  )}
                  {authMode === 'forgot-password' && (
                    <p className="text-sm text-[var(--ff-text-muted)]">
                      Remember your password?{' '}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAuthMode('signin')}
                        className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] p-0 h-auto font-semibold"
                      >
                        Sign in
                      </Button>
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Security Features */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-center space-x-6 text-xs text-[var(--ff-text-muted)]">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-green-400" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EnhancedAuthenticationSystem;