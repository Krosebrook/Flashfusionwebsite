/**
 * @fileoverview App Route Handler
 * @chunk routing
 * @category application
 * @version 1.0.0
 * 
 * Handles all application routing logic and view rendering.
 */

import React, { Suspense } from 'react';
import { GranularErrorBoundary } from '../system/GranularErrorBoundaries';
import { EmergencyMode } from '../ui/emergency-mode';
import { AuthenticationSystem } from '../auth/AuthenticationSystem';
import { AuthCallback } from '../auth/AuthCallback';
import { EmailVerification } from '../auth/EmailVerification';
import { PasswordReset } from '../auth/PasswordReset';
import { LoadingState } from './app-states/LoadingState';
import { ErrorState } from './app-states/ErrorState';
import { PerformanceMonitor } from './app-states/PerformanceMonitor';
import { createLazyComponent, LoadingPriority } from '../system/LazyComponentLoader';

// Lazy-loaded components with progressive loading
const FlashFusionInterface = createLazyComponent(
  () => import('./flash-fusion-interface'),
  { priority: LoadingPriority.CRITICAL, preload: true }
);

const FlashFusionLandingPage = createLazyComponent(
  () => import('../landing/FlashFusionLandingPage'),
  { priority: LoadingPriority.HIGH, preload: true }
);

// Add Try Demo component
const TryDemoInterface = createLazyComponent(
  () => import('../demo/TryDemoInterface'),
  { priority: LoadingPriority.HIGH, preload: true }
);

interface AppRouteHandlerProps {
  appState: any;
  performanceMetrics: any;
  systemInfo: any;
  authState: any;
  authActions: any;
  computed: any;
}

/**
 * Route Handler Component
 * Manages all application routes and view rendering
 */
export const AppRouteHandler: React.FC<AppRouteHandlerProps> = React.memo(({ 
  appState, 
  performanceMetrics, 
  systemInfo,
  authState,
  authActions,
  computed
}) => {
  // Check for special auth routes first
  const currentPath = window.location.pathname;
  const currentUrl = new URL(window.location.href);
  const isDemoMode = currentUrl.searchParams.has('demo') || currentPath.includes('/demo');
  
  // Handle OAuth callback
  if (currentPath.includes('/auth/callback')) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'AuthCallback',
        enableRecovery: true,
        maxRetries: 2 
      }}>
        <AuthCallback
          onAuthSuccess={authActions.login}
          onAuthError={authActions.handleAuthError}
        />
      </GranularErrorBoundary>
    );
  }
  
  // Handle email verification
  if (currentPath.includes('/verify-email')) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'EmailVerification',
        enableRecovery: true 
      }}>
        <EmailVerification />
      </GranularErrorBoundary>
    );
  }
  
  // Handle password reset
  if (currentPath.includes('/reset-password')) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'PasswordReset',
        enableRecovery: true 
      }}>
        <PasswordReset />
      </GranularErrorBoundary>
    );
  }

  // Handle Demo Mode (no authentication required)
  if (isDemoMode) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'TryDemoInterface',
        enableRecovery: true,
        maxRetries: 2 
      }}>
        <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
             style={{ fontFamily: 'var(--ff-font-secondary)' }}>
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Demo" 
              detail="Preparing your interactive demo experience..." 
            />
          }>
            <TryDemoInterface />
          </Suspense>
          
          {/* Development performance monitor */}
          {process.env.NODE_ENV === 'development' && (
            <PerformanceMonitor 
              mode={appState.mode}
              metrics={performanceMetrics}
              systemInfo={systemInfo}
            />
          )}
        </div>
      </GranularErrorBoundary>
    );
  }

  // Emergency mode
  if (appState.mode === 'emergency') {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] ff-fade-in-up">
        <EmergencyMode />
      </div>
    );
  }

  // Loading state
  if (appState.isLoading) {
    return (
      <LoadingState 
        isRecovering={appState.isRecovering}
        retryCount={appState.retryCount}
        message="Initializing FlashFusion Platform"
        detail="Preparing your AI development workspace..."
      />
    );
  }

  // Error state
  if (appState.error && appState.mode !== 'emergency') {
    return (
      <ErrorState 
        error={appState.error}
        mode={appState.mode}
        retryCount={appState.retryCount}
        isRecovering={appState.isRecovering}
        performanceMetrics={performanceMetrics}
        onRetry={() => {}}
      />
    );
  }

  // Authentication modal
  if (computed.shouldShowAuthModal) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'AuthenticationSystem',
        enableRecovery: true,
        maxRetries: 3 
      }}>
        <AuthenticationSystem
          onAuthSuccess={authActions.login}
          onAuthError={authActions.handleAuthError}
          onClose={authActions.closeAuthModal}
        />
      </GranularErrorBoundary>
    );
  }

  // Main application interface (requires authentication)
  if (computed.shouldShowAppInterface) {
    return (
      <GranularErrorBoundary config={{ 
        name: 'FlashFusionInterface',
        enableRecovery: true,
        maxRetries: 2,
        isolateError: true 
      }}>
        <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
             style={{ fontFamily: 'var(--ff-font-secondary)' }}>
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Interface" 
              detail="Preparing your AI development workspace..." 
            />
          }>
            <FlashFusionInterface mode={appState.mode} />
          </Suspense>
          
          {/* Development performance monitor */}
          {process.env.NODE_ENV === 'development' && (
            <PerformanceMonitor 
              mode={appState.mode}
              metrics={performanceMetrics}
              systemInfo={systemInfo}
            />
          )}
        </div>
      </GranularErrorBoundary>
    );
  }

  // Landing page (public access)
  return (
    <GranularErrorBoundary config={{ 
      name: 'FlashFusionLandingPage',
      enableRecovery: true,
      maxRetries: 2 
    }}>
      <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
           style={{ fontFamily: 'var(--ff-font-secondary)' }}>
        <Suspense fallback={
          <LoadingState 
            message="Loading FlashFusion" 
            detail="Preparing the ultimate creators hub..." 
          />
        }>
          <FlashFusionLandingPage />
        </Suspense>
        
        {/* Development performance monitor */}
        {process.env.NODE_ENV === 'development' && (
          <PerformanceMonitor 
            mode={appState.mode}
            metrics={performanceMetrics}
            systemInfo={systemInfo}
          />
        )}
      </div>
    </GranularErrorBoundary>
  );
});

AppRouteHandler.displayName = 'AppRouteHandler';

export default AppRouteHandler;