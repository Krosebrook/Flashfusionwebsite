/**
 * @fileoverview FlashFusion Core Controller
 * @description The central nervous system of the application. Orchestrates Routing, Auth, and System State.
 * @module core/FlashFusionCore
 */

import React, { Suspense } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { AuthErrorBoundary } from '../../components/auth/AuthErrorBoundary';
import { LoadingState } from '../../components/core/app-states/LoadingState';
import { ErrorState } from '../../components/core/app-states/ErrorState';
import { useAuthentication } from '../../hooks/useAuthentication';
import { ENV } from '../../lib/env';

import { useRouter } from './router/useRouter';
import { useSystem } from './system/useSystem';

// --- Lazy Load Views ---

const FlashFusionInterface = React.lazy(() => import('../../components/core/flash-fusion-interface'));
const VeteranLandingPage = React.lazy(() => import('../../components/landing/VeteranLandingPage'));
const TryDemoInterface = React.lazy(() => import('../../components/demo/TryDemoInterface'));
const InfrastructureValidator = React.lazy(() => import('../../components/validation/InfrastructureValidator'));
const AuthenticationSystem = React.lazy(() => import('../../components/auth/AuthenticationSystem'));

// --- Components ---

export function FlashFusionCore() {
  const { routeState, navigate, cleanupUrlParams } = useRouter();
  const { systemState, deviceDetection, retry } = useSystem();
  const auth = useAuthentication();

  // --- 1. Emergency Mode ---
  if (systemState.mode === 'emergency') {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center ff-fade-in-up">
        <div className="text-center space-y-6 p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-500">Safe Mode Active</h1>
          <p className="text-gray-400">System instability detected. Running with limited features.</p>
          <button onClick={retry} className="px-6 py-2 bg-red-600 rounded text-white font-bold">
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  // --- 2. Initialization ---
  if (!systemState.isInitialized || systemState.isLoading) {
    return <LoadingState message="Initializing FlashFusion Core" detail="Booting neural engine..." />;
  }

  // --- 3. System Error ---
  if (systemState.error) {
    return <ErrorState error={systemState.error} onRetry={retry} mode={systemState.mode} />;
  }

  // --- 4. Infrastructure Validator ---
  if (routeState.isValidatorRoute) {
    return (
      <ErrorBoundary fallback={<div>Validator Error</div>}>
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={<LoadingState message="Loading Validator" />}>
            <InfrastructureValidator 
              autoStart={true}
              onValidationComplete={(res) => console.log('Validation Complete', res)}
              onCriticalFailure={(err) => console.error('Critical Failure', err)}
            />
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  // --- 5. Demo Mode ---
  if (routeState.isDemoMode) {
    return (
      <ErrorBoundary fallback={<div>Demo Error</div>}>
        <Suspense fallback={<LoadingState message="Loading Demo" />}>
          <TryDemoInterface />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // --- 6. Auth Routes (Explicit) ---
  if (routeState.isAuthRoute) {
    return (
      <AuthErrorBoundary>
        <Suspense fallback={<LoadingState message="Loading Auth" />}>
          <AuthenticationSystem 
            onAuthSuccess={() => navigate('/')} 
            onAuthError={console.error}
            onClose={() => window.history.back()}
          />
        </Suspense>
      </AuthErrorBoundary>
    );
  }

  // --- 7. Main Interface vs Landing Page Logic ---
  const showInterface = auth.isAuthenticated && auth.user;
  const showAuthModal = routeState.shouldShowApp && !auth.isAuthenticated && !deviceDetection.isMobile;
  const forceLanding = routeState.shouldShowApp && !auth.isAuthenticated && deviceDetection.isMobile;

  if (showInterface) {
    return (
      <ErrorBoundary fallback={<div>Interface Error</div>}>
        <Suspense fallback={<LoadingState message="Loading Workspace" />}>
          <FlashFusionInterface mode={systemState.mode} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (forceLanding) {
     // Mobile users trying to access app without auth get sent back to landing with cleaned params
     // This prevents the "Auth Modal on Mobile" issue which is often bad UX
     cleanupUrlParams();
     // Fallthrough to Landing Page
  }

  return (
    <ErrorBoundary fallback={<div>Landing Page Error</div>}>
      <div className="min-h-screen bg-[var(--ff-bg-dark)] relative">
        <Suspense fallback={<LoadingState message="Loading FlashFusion" />}>
          <VeteranLandingPage />
        </Suspense>

        {/* Auth Modal Overlay */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Suspense fallback={<LoadingState message="Loading Secure Login" />}>
              <div className="w-full max-w-md">
                <AuthenticationSystem 
                  onAuthSuccess={() => {
                    cleanupUrlParams();
                    // Interface will render on next pass
                  }}
                  onAuthError={console.error}
                  onClose={cleanupUrlParams}
                />
              </div>
            </Suspense>
          </div>
        )}
        
        {/* Debug Overlay */}
        {ENV.NODE_ENV === 'development' && (
           <div className="fixed bottom-4 right-4 bg-black/80 text-[10px] text-white p-2 rounded z-50 font-mono pointer-events-none">
             Core: v6.1 | Mode: {systemState.mode} | Route: {routeState.currentPath}
           </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
