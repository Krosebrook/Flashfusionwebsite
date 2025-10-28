/**
 * @fileoverview Authentication Guard Component
 * @chunk auth
 * @category security
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Provides route-level authentication protection
 */

import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { getRouteProtectionLevel } from '../../utils/auth-protection';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPermission?: string;
  redirectTo?: string;
}

/**
 * Authentication Guard Component
 * Protects routes based on authentication status and permissions
 */
export function AuthGuard({ 
  children, 
  fallback, 
  requiredPermission,
  redirectTo
}: AuthGuardProps) {
  const auth = useAuth();

  useEffect(() => {
    // Don't redirect if still loading or already on auth page
    if (auth.isLoading || window.location.pathname.includes('/auth')) {
      return;
    }

    const currentPath = window.location.pathname;
    const routeLevel = getRouteProtectionLevel(currentPath);

    // Handle protected routes
    if (routeLevel === 'protected' && !auth.isAuthenticated) {
      const redirectUrl = redirectTo || `/auth?mode=signin&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      window.location.href = redirectUrl;
      return;
    }

    // Handle admin routes
    if (routeLevel === 'admin' && (!auth.isAuthenticated || !auth.hasPermission('admin'))) {
      window.location.href = '/dashboard?error=insufficient_permissions';
      return;
    }

    // Handle specific permission requirements
    if (requiredPermission && !auth.hasPermission(requiredPermission)) {
      window.location.href = '/dashboard?error=insufficient_permissions';
      return;
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.hasPermission, requiredPermission, redirectTo]);

  // Show loading state
  if (auth.isLoading && !auth.isInitialized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div 
            className="w-12 h-12 mx-auto rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--ff-primary)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-sm)' }}>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  const currentPath = window.location.pathname;
  const routeLevel = getRouteProtectionLevel(currentPath);

  // Check route access
  if (routeLevel === 'protected' && !auth.isAuthenticated) {
    return fallback || (
      <div 
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundColor: 'var(--ff-bg-dark)',
          fontFamily: 'var(--ff-font-secondary)',
          color: 'var(--ff-text-primary)'
        }}
      >
        <div 
          className="max-w-md w-full text-center space-y-6"
          style={{
            backgroundColor: 'var(--ff-surface)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--ff-radius-lg)',
            padding: 'var(--ff-space-8)',
            boxShadow: 'var(--ff-shadow-xl)'
          }}
        >
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--ff-primary), var(--ff-secondary))',
              color: 'white'
            }}
          >
            <span style={{ fontSize: 'var(--ff-text-2xl)' }}>🔒</span>
          </div>

          <div className="space-y-4">
            <h1 
              className="font-bold tracking-tight"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-2xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-text-primary)',
                lineHeight: 'var(--ff-leading-tight)'
              }}
            >
              Authentication Required
            </h1>
            <p 
              style={{
                fontSize: 'var(--ff-text-base)',
                color: 'var(--ff-text-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Please sign in to access this area of FlashFusion.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const redirectUrl = redirectTo || `/auth?mode=signin&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                window.location.href = redirectUrl;
              }}
              className="w-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--ff-primary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-semibold)',
                padding: 'var(--ff-space-3) var(--ff-space-6)',
                borderRadius: 'var(--ff-radius)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--ff-shadow-sm)'
              }}
            >
              Sign In to Continue
            </button>
            
            <button
              onClick={() => auth.startDemoSession()}
              className="w-full transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--ff-secondary)',
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-medium)',
                padding: 'var(--ff-space-2) var(--ff-space-4)',
                borderRadius: 'var(--ff-radius)',
                border: '1px solid var(--ff-secondary)',
                cursor: 'pointer'
              }}
            >
              Try Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check admin access
  if (routeLevel === 'admin' && (!auth.isAuthenticated || !auth.hasPermission('admin'))) {
    return fallback || (
      <div 
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundColor: 'var(--ff-bg-dark)',
          fontFamily: 'var(--ff-font-secondary)',
          color: 'var(--ff-text-primary)'
        }}
      >
        <div 
          className="max-w-md w-full text-center space-y-6"
          style={{
            backgroundColor: 'var(--ff-surface)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--ff-radius-lg)',
            padding: 'var(--ff-space-8)',
            boxShadow: 'var(--ff-shadow-xl)'
          }}
        >
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--ff-error-500), var(--ff-error-600))',
              color: 'white'
            }}
          >
            <span style={{ fontSize: 'var(--ff-text-2xl)' }}>⚠️</span>
          </div>

          <div className="space-y-4">
            <h1 
              className="font-bold tracking-tight"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-2xl)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-text-primary)',
                lineHeight: 'var(--ff-leading-tight)'
              }}
            >
              Access Denied
            </h1>
            <p 
              style={{
                fontSize: 'var(--ff-text-base)',
                color: 'var(--ff-text-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              You don't have permission to access this area. Please contact your administrator.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              className="w-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--ff-primary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-semibold)',
                padding: 'var(--ff-space-3) var(--ff-space-6)',
                borderRadius: 'var(--ff-radius)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--ff-shadow-sm)'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check specific permission
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    return fallback || (
      <div className="p-8 text-center">
        <h2 style={{ color: 'var(--ff-error)', marginBottom: 'var(--ff-space-4)' }}>
          Insufficient Permissions
        </h2>
        <p style={{ color: 'var(--ff-text-secondary)' }}>
          You need "{requiredPermission}" permission to access this feature.
        </p>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

export default AuthGuard;