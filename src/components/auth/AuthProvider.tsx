/**
 * @fileoverview Authentication Provider - Global Auth State Management
 * @chunk auth
 * @category providers
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Provides authentication context throughout the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { 
  checkAuthenticationStatus, 
  clearAuthData, 
  storeAuthData,
  getRouteProtectionLevel,
  hasRoutePermission,
  createDemoSession,
  handleAuthStateChange,
  type AuthState,
  type RouteProtectionLevel
} from '../../utils/auth-protection';

interface AuthContextType extends AuthState {
  // Auth actions
  signIn: (token: string, userData: any, persistent?: boolean) => void;
  signOut: () => void;
  refreshAuth: () => Promise<void>;
  startDemoSession: () => void;
  
  // Route protection
  getRouteAccess: (path?: string) => { canAccess: boolean; redirectUrl?: string };
  hasPermission: (permission: string) => boolean;
  
  // Utility
  isDemo: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state and provides auth utilities
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const initialAuthState = await checkAuthenticationStatus();
        setAuthState(initialAuthState);
        handleAuthStateChange(initialAuthState);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Authentication initialization failed'
        });
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ff-auth-token' || e.key === 'ff-user-data') {
        refreshAuth();
      }
    };

    const handleAuthEvent = (e: CustomEvent) => {
      setAuthState(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ff-auth-state-change', handleAuthEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ff-auth-state-change', handleAuthEvent as EventListener);
    };
  }, []);

  // Sign in user
  const signIn = useCallback((token: string, userData: any, persistent: boolean = true) => {
    try {
      storeAuthData(token, userData, persistent);
      
      const newAuthState: AuthState = {
        isAuthenticated: true,
        isLoading: false,
        user: userData
      };
      
      setAuthState(newAuthState);
      handleAuthStateChange(newAuthState);
      
      // Redirect to intended destination or dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || '/dashboard';
      
      if (redirectPath !== window.location.pathname) {
        window.history.pushState({}, '', redirectPath);
        window.location.reload(); // Ensure proper route handling
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      setAuthState(prev => ({ ...prev, error: 'Sign in failed' }));
    }
  }, []);

  // Sign out user
  const signOut = useCallback(() => {
    try {
      clearAuthData();
      
      const newAuthState: AuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null
      };
      
      setAuthState(newAuthState);
      handleAuthStateChange(newAuthState);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, []);

  // Refresh authentication state
  const refreshAuth = useCallback(async () => {
    try {
      const newAuthState = await checkAuthenticationStatus();
      setAuthState(newAuthState);
      handleAuthStateChange(newAuthState);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setAuthState(prev => ({ ...prev, error: 'Authentication refresh failed' }));
    }
  }, []);

  // Start demo session
  const startDemoSession = useCallback(() => {
    try {
      const demoAuthState = createDemoSession();
      setAuthState(demoAuthState);
      handleAuthStateChange(demoAuthState);
      
      // Redirect to dashboard in demo mode
      window.location.href = '/dashboard?demo=true';
    } catch (error) {
      console.error('Demo session failed:', error);
      setAuthState(prev => ({ ...prev, error: 'Demo session failed' }));
    }
  }, []);

  // Check route access
  const getRouteAccess = useCallback((path?: string) => {
    const routeLevel = getRouteProtectionLevel(path);
    const canAccess = hasRoutePermission(authState, routeLevel);
    
    if (!canAccess && routeLevel === 'protected') {
      return {
        canAccess: false,
        redirectUrl: `/auth?mode=signin&redirect=${encodeURIComponent(path || window.location.pathname + window.location.search)}`
      };
    }
    
    if (!canAccess && routeLevel === 'admin') {
      return {
        canAccess: false,
        redirectUrl: '/dashboard?error=insufficient_permissions'
      };
    }
    
    return { canAccess: true };
  }, [authState]);

  // Check user permission
  const hasPermissionCheck = useCallback((permission: string) => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    
    const userRole = authState.user.role || authState.user.plan || 'user';
    
    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'],
      enterprise: ['create', 'edit', 'delete', 'export', 'collaborate', 'integrate', 'advanced'],
      pro: ['create', 'edit', 'export', 'collaborate'],
      free: ['create', 'edit', 'basic'],
      demo: ['view', 'demo', 'basic'],
      user: ['create', 'edit', 'basic']
    };
    
    const permissions = rolePermissions[userRole] || rolePermissions.user;
    
    return permissions.includes('*') || permissions.includes(permission);
  }, [authState]);

  // Compute derived values
  const isDemo = authState.user?.isDemo || authState.user?.plan === 'demo' || false;

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
    refreshAuth,
    startDemoSession,
    getRouteAccess,
    hasPermission: hasPermissionCheck,
    isDemo,
    isInitialized
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook for route protection
 */
export function useRouteProtection(requiredPermission?: string) {
  const auth = useAuth();
  
  useEffect(() => {
    const { canAccess, redirectUrl } = auth.getRouteAccess();
    
    if (!canAccess && redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }
    
    if (requiredPermission && !auth.hasPermission(requiredPermission)) {
      window.location.href = '/dashboard?error=insufficient_permissions';
      return;
    }
  }, [auth, requiredPermission]);
  
  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    hasAccess: auth.getRouteAccess().canAccess && (!requiredPermission || auth.hasPermission(requiredPermission))
  };
}

/**
 * HOC for protecting components with authentication
 */
export function withAuthProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string
) {
  const ProtectedComponent = (props: P) => {
    const { hasAccess, isLoading } = useRouteProtection(requiredPermission);
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p style={{ color: 'var(--ff-text-secondary)' }}>Checking permissions...</p>
          </div>
        </div>
      );
    }
    
    if (!hasAccess) {
      return null; // Will be redirected by useRouteProtection
    }
    
    return <Component {...props} />;
  };
  
  ProtectedComponent.displayName = `withAuthProtection(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
}

export default AuthProvider;