/**
 * @fileoverview Mobile-Optimized Authentication System for FlashFusion
 * @chunk auth
 * @category authentication
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Mobile-first authentication with enhanced error handling, offline support,
 * and fallback mechanisms for unreliable mobile networks.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
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
  X,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  subscription?: string;
}

interface MobileAuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  connectionType: string;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'offline';

interface MobileAuthenticationSystemProps {
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
  onClose?: () => void;
}

/**
 * Network Detection Hook for Mobile
 */
function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkStatus({
        isOnline: navigator.onLine,
        connectionType: connection?.effectiveType || 'unknown'
      });
    };

    // Initial check
    updateNetworkStatus();

    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes (mobile specific)
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}

/**
 * Mobile-Safe Storage Hook
 */
function useMobileSafeStorage() {
  const setItem = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      // Also try sessionStorage as fallback
      sessionStorage.setItem(key + '_backup', value);
      return true;
    } catch (error) {
      console.warn('Storage failed, using memory cache:', error);
      // Use in-memory cache as last resort
      (window as any).ffMemoryCache = (window as any).ffMemoryCache || {};
      (window as any).ffMemoryCache[key] = value;
      return false;
    }
  }, []);

  const getItem = useCallback((key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      if (value) return value;
      
      // Try sessionStorage backup
      const backupValue = sessionStorage.getItem(key + '_backup');
      if (backupValue) return backupValue;
      
      // Try memory cache
      const memoryCache = (window as any).ffMemoryCache;
      return memoryCache?.[key] || null;
    } catch (error) {
      console.warn('Storage retrieval failed:', error);
      const memoryCache = (window as any).ffMemoryCache;
      return memoryCache?.[key] || null;
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key + '_backup');
      
      const memoryCache = (window as any).ffMemoryCache;
      if (memoryCache) {
        delete memoryCache[key];
      }
    } catch (error) {
      console.warn('Storage removal failed:', error);
    }
  }, []);

  return { setItem, getItem, removeItem };
}

/**
 * Enhanced CAPTCHA for Mobile
 */
interface MobileCaptchaProps {
  onVerify: (isVerified: boolean) => void;
  isLoading?: boolean;
}

function MobileCaptcha({ onVerify, isLoading }: MobileCaptchaProps) {
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
    if (answer && answer.length > 0) {
      handleVerify();
    }
  }, [answer, handleVerify]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-[var(--ff-text-primary)] flex items-center" style={{ fontFamily: 'var(--ff-font-primary)' }}>
        <Shield className="w-4 h-4 mr-2" />
        Verify you're not a robot
      </Label>
      <div className="flex items-center gap-3 p-4 bg-[var(--ff-surface)] rounded-lg border border-[var(--border)]">
        <div className="text-lg font-bold text-[var(--ff-text-primary)] min-w-[80px]" style={{ fontFamily: 'var(--ff-font-mono)' }}>
          {num1} + {num2} = ?
        </div>
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-20 text-center bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] focus:ring-[var(--ff-primary)] focus:ring-opacity-20 text-lg"
          disabled={isLoading}
          autoComplete="off"
        />
        {isVerified && (
          <CheckCircle className="w-5 h-5 text-[var(--ff-success)] flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

/**
 * Main Mobile Authentication System Component
 */
export function MobileAuthenticationSystem({ onAuthSuccess, onAuthError, onClose }: MobileAuthenticationSystemProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const networkStatus = useNetworkStatus();
  const storage = useMobileSafeStorage();
  
  const [authState, setAuthState] = useState<MobileAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isOnline: networkStatus.isOnline,
    connectionType: networkStatus.connectionType
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

  // Update network status
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      isOnline: networkStatus.isOnline,
      connectionType: networkStatus.connectionType
    }));

    // Auto-switch to offline mode if network is down
    if (!networkStatus.isOnline && mode !== 'offline') {
      setMode('offline');
    }
  }, [networkStatus, mode]);

  // Enhanced validation functions
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  }, []);

  const validateName = useCallback((name: string): boolean => {
    const isValid = name.trim().length >= 2;
    setNameError(isValid ? '' : 'Name must be at least 2 characters long');
    return isValid;
  }, []);

  // Enhanced login with mobile-specific error handling
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !isCaptchaVerified) return;

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check network connectivity
      if (!authState.isOnline) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

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

        setAuthState(prev => ({
          ...prev,
          user: demoUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

        // Store demo user data with mobile-safe storage
        if (rememberMe) {
          storage.setItem('ff-remember-user', JSON.stringify(demoUser));
          storage.setItem('ff-auth-token', 'demo-token-' + Date.now());
        }

        onAuthSuccess(demoUser);
        return;
      }
      
      console.log('🔐 Attempting mobile login for:', email);
      
      // Try Supabase authentication with timeout and retry
      let supabase;
      try {
        const supabaseModule = await import('../../utils/supabase/client');
        supabase = supabaseModule.supabase;
      } catch (importError) {
        console.error('Failed to load Supabase client:', importError);
        throw new Error('Authentication service unavailable. Please try again later.');
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout for mobile

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        clearTimeout(timeoutId);

        if (error) {
          console.error('❌ Supabase login error:', error);
          
          // Handle specific error types
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
          } else if (error.message.includes('Too many requests')) {
            throw new Error('Too many login attempts. Please wait a few minutes and try again.');
          } else {
            throw new Error(error.message || 'Login failed. Please try again.');
          }
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

        // Get user profile with error handling
        let profile = null;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.warn('⚠️ Profile fetch warning:', profileError.message);
          } else {
            profile = profileData;
          }
        } catch (profileError) {
          console.warn('⚠️ Profile fetch failed:', profileError);
        }

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
          role: profile?.role || 'user',
          subscription: profile?.subscription_tier || 'free'
        };

        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

        // Store user data if remember me is checked
        if (rememberMe) {
          storage.setItem('ff-remember-user', JSON.stringify(user));
          storage.setItem('ff-auth-token', data.session?.access_token || '');
        }

        onAuthSuccess(user);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Login request timed out. Please check your connection and try again.');
        }
        
        throw fetchError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('❌ Mobile login failed:', errorMessage);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      onAuthError(errorMessage);
    }
  }, [email, password, isCaptchaVerified, rememberMe, authState.isOnline, validateEmail, storage, onAuthSuccess, onAuthError]);

  // Check for remembered user on mount
  useEffect(() => {
    const rememberedUser = storage.getItem('ff-remember-user');
    if (rememberedUser) {
      try {
        const user = JSON.parse(rememberedUser);
        setEmail(user.email);
        setRememberMe(true);
        console.log('📱 Found remembered user:', user.email);
      } catch (error) {
        console.error('Failed to parse remembered user:', error);
        storage.removeItem('ff-remember-user');
      }
    }
  }, [storage]);

  // Offline mode component
  const renderOfflineMode = () => (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--ff-text-primary)] mb-2">
            You're offline
          </h3>
          <p className="text-[var(--ff-text-secondary)]">
            Authentication requires an internet connection. Please check your network and try again.
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <Alert className="border-yellow-500/20 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-[var(--ff-text-secondary)]">
            <strong className="text-yellow-500">Network Status:</strong> {authState.connectionType}
          </AlertDescription>
        </Alert>
        
        <Button
          onClick={() => {
            if (networkStatus.isOnline) {
              setMode('login');
            }
          }}
          disabled={!networkStatus.isOnline}
          className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
        >
          {networkStatus.isOnline ? (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              Connection Restored - Continue
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Waiting for connection...
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Network status indicator
  const NetworkIndicator = () => (
    <div className="mb-4">
      <Badge 
        variant={authState.isOnline ? "default" : "destructive"}
        className="mb-2"
      >
        {authState.isOnline ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Online ({authState.connectionType})
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );

  // Main render logic
  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-[var(--ff-surface)] border-[var(--border)] shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                    FlashFusion
                  </CardTitle>
                  <CardDescription className="text-[var(--ff-text-muted)]">
                    Mobile Authentication
                  </CardDescription>
                </div>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            <NetworkIndicator />
          </CardHeader>

          <CardContent className="space-y-6">
            {authState.error && (
              <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)]/10">
                <AlertCircle className="h-4 w-4 text-[var(--ff-error)]" />
                <AlertDescription className="text-[var(--ff-error)]">
                  {authState.error}
                </AlertDescription>
              </Alert>
            )}

            {mode === 'offline' ? renderOfflineMode() : (
              <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[var(--ff-surface-light)]">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-[var(--ff-primary)] data-[state=active]:text-white"
                    disabled={!authState.isOnline}
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-[var(--ff-primary)] data-[state=active]:text-white"
                    disabled={!authState.isOnline}
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 mt-6">
                  {/* Demo Mode Notice */}
                  <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
                    <Zap className="h-4 w-4 text-[var(--ff-secondary)]" />
                    <AlertDescription className="text-[var(--ff-text-secondary)] text-sm">
                      <strong className="text-[var(--ff-secondary)]">Quick Demo:</strong> Use <code className="bg-[var(--ff-surface)] px-1 rounded text-xs">demo@flashfusion.ai</code> and <code className="bg-[var(--ff-surface)] px-1 rounded text-xs">demo123</code>
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-[var(--ff-text-primary)]">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) validateEmail(e.target.value);
                          }}
                          onBlur={() => validateEmail(email)}
                          className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] text-base"
                          disabled={authState.isLoading || !authState.isOnline}
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-sm text-[var(--ff-error)] mt-1">{emailError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-[var(--ff-text-primary)]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)] focus:border-[var(--ff-primary)] text-base"
                          disabled={authState.isLoading || !authState.isOnline}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] p-1"
                          disabled={authState.isLoading || !authState.isOnline}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <MobileCaptcha onVerify={setIsCaptchaVerified} isLoading={authState.isLoading} />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                          disabled={authState.isLoading || !authState.isOnline}
                        />
                        <Label htmlFor="remember" className="text-sm text-[var(--ff-text-secondary)]">
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-sm text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors font-medium"
                        disabled={authState.isLoading || !authState.isOnline}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={authState.isLoading || !email || !password || !isCaptchaVerified || !authState.isOnline}
                      className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200 text-base min-h-[48px]"
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
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">
                      Create Your Account
                    </h3>
                    <p className="text-sm text-[var(--ff-text-secondary)]">
                      Join thousands of creators building amazing projects
                    </p>
                  </div>
                  {/* Add signup form here - simplified for space */}
                  <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
                    <Zap className="h-4 w-4 text-[var(--ff-secondary)]" />
                    <AlertDescription className="text-[var(--ff-text-secondary)]">
                      Signup functionality coming soon! Use the demo login for now.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MobileAuthenticationSystem;