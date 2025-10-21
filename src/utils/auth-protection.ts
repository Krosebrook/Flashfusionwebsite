/**
 * @fileoverview Authentication Protection Utilities
 * @chunk auth
 * @category security
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Utilities for managing authentication state and route protection
 */

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  error?: string;
}

// Route protection levels
export type RouteProtectionLevel = 'public' | 'protected' | 'admin' | 'demo';

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/features',
  '/demo',
  '/auth',
  '/login',
  '/signup',
  '/reset-password',
  '/verify-email',
  '/privacy',
  '/terms',
  '/testimonials',
  '/faq'
];

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/creator',
  '/tools',
  '/projects',
  '/deployments',
  '/analytics',
  '/collaboration',
  '/templates',
  '/integrations',
  '/settings',
  '/profile',
  '/education'
];

// Admin routes that require admin privileges
export const ADMIN_ROUTES = [
  '/admin',
  '/system',
  '/monitoring',
  '/user-management'
];

/**
 * Check if user is authenticated based on stored tokens
 */
export function checkAuthenticationStatus(): Promise<AuthState> {
  return new Promise((resolve) => {
    try {
      // Check multiple storage locations for auth data
      const authToken = 
        localStorage.getItem('ff-auth-token') || 
        sessionStorage.getItem('ff-auth-token') ||
        localStorage.getItem('supabase.auth.token') ||
        localStorage.getItem('auth-token');

      const userData = 
        localStorage.getItem('ff-user-data') ||
        localStorage.getItem('user-data') ||
        sessionStorage.getItem('ff-user-data');

      if (authToken && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Validate token format (basic check)
          if (typeof authToken === 'string' && authToken.length > 10) {
            resolve({
              isAuthenticated: true,
              isLoading: false,
              user
            });
            return;
          }
        } catch (parseError) {
          console.warn('Invalid user data in storage:', parseError);
          // Clear invalid data
          clearAuthData();
        }
      }

      // Check for demo mode or temporary access
      const demoMode = localStorage.getItem('ff-demo-mode') === 'true';
      const tempAccess = sessionStorage.getItem('ff-temp-access') === 'true';

      if (demoMode || tempAccess) {
        resolve({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@flashfusion.dev',
            plan: 'demo'
          }
        });
        return;
      }

      // No valid authentication found
      resolve({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
      resolve({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Authentication check failed'
      });
    }
  });
}

/**
 * Clear all authentication data from storage
 */
export function clearAuthData(): void {
  // Clear FlashFusion auth data
  localStorage.removeItem('ff-auth-token');
  localStorage.removeItem('ff-user-data');
  sessionStorage.removeItem('ff-auth-token');
  sessionStorage.removeItem('ff-user-data');
  
  // Clear generic auth data
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-data');
  
  // Clear Supabase auth data
  localStorage.removeItem('supabase.auth.token');
  
  // Clear temporary access
  sessionStorage.removeItem('ff-temp-access');
  localStorage.removeItem('ff-demo-mode');
}

/**
 * Determine route protection level based on current path
 */
export function getRouteProtectionLevel(path?: string): RouteProtectionLevel {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  
  // Check for demo mode
  if (searchParams.has('demo') || currentPath.includes('/demo') || localStorage.getItem('ff-demo-mode') === 'true') {
    return 'demo';
  }
  
  // Check admin routes
  if (ADMIN_ROUTES.some(route => currentPath.startsWith(route))) {
    return 'admin';
  }
  
  // Check protected routes
  if (PROTECTED_ROUTES.some(route => currentPath.startsWith(route))) {
    return 'protected';
  }
  
  // Check if explicitly requesting app access
  const showApp = searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
  if (showApp && !PUBLIC_ROUTES.some(route => currentPath === route || currentPath.startsWith(route + '/'))) {
    return 'protected';
  }
  
  // Default to public
  return 'public';
}

/**
 * Check if user has permission to access a route
 */
export function hasRoutePermission(authState: AuthState, routeLevel: RouteProtectionLevel): boolean {
  switch (routeLevel) {
    case 'public':
    case 'demo':
      return true;
      
    case 'protected':
      return authState.isAuthenticated;
      
    case 'admin':
      return authState.isAuthenticated && 
             authState.user && 
             (authState.user.role === 'admin' || authState.user.plan === 'enterprise');
      
    default:
      return false;
  }
}

/**
 * Get redirect URL for authentication
 */
export function getAuthRedirectUrl(intendedPath?: string): string {
  const redirectPath = intendedPath || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/dashboard');
  return `/auth?mode=signin&redirect=${encodeURIComponent(redirectPath)}`;
}

/**
 * Store authentication data securely
 */
export function storeAuthData(token: string, userData: any, persistent: boolean = true): void {
  const storage = persistent ? localStorage : sessionStorage;
  
  try {
    storage.setItem('ff-auth-token', token);
    storage.setItem('ff-user-data', JSON.stringify(userData));
    
    // Set show app flag for future visits
    localStorage.setItem('ff-show-app', 'true');
  } catch (error) {
    console.error('Failed to store authentication data:', error);
  }
}

/**
 * Validate authentication token format
 */
export function validateTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic token validation (adjust based on your token format)
  // JWT tokens typically have 3 parts separated by dots
  if (token.includes('.')) {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }
  
  // Simple token should be at least 20 characters
  return token.length >= 20;
}

/**
 * Create demo user session
 */
export function createDemoSession(): AuthState {
  sessionStorage.setItem('ff-temp-access', 'true');
  localStorage.setItem('ff-demo-mode', 'true');
  
  return {
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@flashfusion.dev',
      plan: 'demo',
      isDemo: true
    }
  };
}

/**
 * Handle authentication state changes
 */
export function handleAuthStateChange(
  newAuthState: AuthState,
  onStateChange?: (state: AuthState) => void
): void {
  if (onStateChange) {
    onStateChange(newAuthState);
  }
  
  // Trigger custom events for other parts of the app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ff-auth-state-change', {
      detail: newAuthState
    }));
  }
}

/**
 * Get user role from authentication state
 */
export function getUserRole(authState: AuthState): string {
  if (!authState.isAuthenticated || !authState.user) {
    return 'guest';
  }
  
  return authState.user.role || authState.user.plan || 'user';
}

/**
 * Check if user has specific permission
 */
export function hasPermission(authState: AuthState, permission: string): boolean {
  if (!authState.isAuthenticated || !authState.user) {
    return false;
  }
  
  const userRole = getUserRole(authState);
  
  // Define role-based permissions
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'], // Admin has all permissions
    enterprise: ['create', 'edit', 'delete', 'export', 'collaborate', 'integrate'],
    pro: ['create', 'edit', 'export', 'collaborate'],
    free: ['create', 'edit'],
    demo: ['view', 'demo'],
    guest: []
  };
  
  const permissions = rolePermissions[userRole] || [];
  
  return permissions.includes('*') || permissions.includes(permission);
}

export default {
  checkAuthenticationStatus,
  clearAuthData,
  getRouteProtectionLevel,
  hasRoutePermission,
  getAuthRedirectUrl,
  storeAuthData,
  validateTokenFormat,
  createDemoSession,
  handleAuthStateChange,
  getUserRole,
  hasPermission
};