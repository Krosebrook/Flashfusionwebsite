import React, { Suspense, useEffect } from 'react';
import { Analytics } from '@flashfusion/ui/analytics';
import { DemoBanner } from '@flashfusion/ui/demo-banner';
import { ConfigDebugPanel } from '@flashfusion/ui/config-debug';
import { ConnectionStatus, FullPageLoader } from '@flashfusion/ui/loading-states';
import { Button } from '@flashfusion/ui/button';
import { Navigation } from './components/layout/Navigation';
import { PageRouter } from './components/layout/PageRouter';
import { AppFooter } from './components/layout/AppFooter';
import { CriticalErrorBoundary } from '@flashfusion/ui/error-boundary-enhanced';
import { FeatureFlagProvider, FeatureFlagDebugPanel } from '@flashfusion/ui/feature-flag';
import { ConfigProvider } from '@flashfusion/services/config';
import { GamificationProvider } from '@flashfusion/hooks/gamification';
import { XPNotificationSystem } from './components/gamification/XPNotificationSystem';
import { initializeGamification } from '@flashfusion/services/gamification-initializer';
import { useAppState } from '@flashfusion/hooks/app-state';
import { useKeyboardShortcuts } from '@flashfusion/hooks/keyboard-shortcuts';
import { useSmartPreloading } from '@flashfusion/ui/code-splitting';
import { addCriticalResourceHints } from '@flashfusion/utils/performance';
import { useErrorService } from '@flashfusion/services/error';
import { isDevelopment } from '@flashfusion/config/env';

/**
 * FlashFusion - AI Development Assistant Platform
 * 
 * Your intelligent development companion that transforms ideas into production-ready
 * applications through advanced AI orchestration and automation, featuring:
 * - 60+ AI-powered development tools across 6 specialized categories
 * - Intelligent multi-agent orchestration for complex development workflows
 * - Real-time collaboration with AI assistance and team coordination
 * - Automated deployment to 8+ cloud platforms with intelligent monitoring
 * - Advanced code generation, analysis, and optimization across 15+ frameworks
 * - Creator-focused toolkit for content generation and monetization
 * - Intelligent project validation and feasibility analysis
 * - Integrated development environment with AI-powered assistance
 * - Production-ready CI/CD automation with quality assurance
 * - Comprehensive analytics and performance optimization
 * 
 * FlashFusion learns from your development patterns and provides contextual assistance
 * to accelerate your workflow from concept to deployment.
 */

function AppContent() {
  const errorService = useErrorService();
  
  // Use extracted application state management
  const {
    appState,
    error,
    errorSeverity,
    retryCount,
    handleAuthToggle,
    handlePageChange,
    handleRetry
  } = useAppState();

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    currentPage: appState.currentPage,
    isAuthenticated: appState.isAuthenticated,
    onPageChange: handlePageChange,
    onError: (errorData) => {
      errorService.handleError(
        errorService.createError(errorData.type as any, errorData.message, {
          code: errorData.code
        })
      );
    }
  });

  // Enable smart preloading
  useSmartPreloading();

  // Add critical resource hints for performance and initialize gamification
  useEffect(() => {
    addCriticalResourceHints();
    
    // Initialize gamification system
    initializeGamification().catch(err => {
      console.log('Gamification system will run in offline mode');
    });
  }, []);

  // Enhanced loading state with better UX
  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 ff-fade-in-up max-w-md mx-auto px-6">
          <div className="ff-pulse-glow">
            <FullPageLoader message="Initializing FlashFusion..." />
          </div>
          
          {retryCount > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Retry attempt {retryCount} of 3
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="ff-progress-bar h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(retryCount / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Loading your AI development assistant...</p>
            {appState.connectionStatus === 'checking' && (
              <p className="ff-pulse-glow-secondary">Checking connection...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced critical error state with recovery options
  if (error && !error.recoverable) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-lg mx-auto ff-fade-in-up">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-destructive ff-text-gradient">
              Application Error
            </h1>
            
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                {error.message}
              </p>
              {error.details && (
                <p className="text-sm text-muted-foreground/75 bg-muted/50 p-3 rounded-lg">
                  {error.details}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleRetry} 
              className="ff-btn-primary flex items-center gap-2"
            >
              <span>🔄</span>
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="ff-focus-ring flex items-center gap-2"
            >
              <span>↻</span>
              Refresh Page
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg space-y-1">
            <p><strong>Error Details:</strong></p>
            <p>Type: {error.type}</p>
            {error.code && <p>Code: {error.code}</p>}
            {error.timestamp && (
              <p>Time: {new Date(error.timestamp).toLocaleString()}</p>
            )}
            <p className="mt-2">If this problem persists, please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CriticalErrorBoundary>
      {/* Global Status Components */}
      <ConnectionStatus status={appState.connectionStatus} />
      <DemoBanner />
      <Analytics />
      
      {/* Enhanced Recoverable Error Banner */}
      {error?.recoverable && (
        <div className={`border-b p-3 transition-all duration-300 ${
          errorSeverity === 'critical' ? 'bg-destructive/10 border-destructive/20' :
          errorSeverity === 'warning' ? 'bg-warning/10 border-warning/20' :
          errorSeverity === 'info' ? 'bg-info/10 border-info/20' :
          'bg-destructive/10 border-destructive/20'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl shrink-0">
                {errorSeverity === 'warning' ? '⚠️' : 
                 errorSeverity === 'info' ? 'ℹ️' : '❌'}
              </span>
              
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${
                  errorSeverity === 'warning' ? 'text-warning' :
                  errorSeverity === 'info' ? 'text-info' :
                  'text-destructive'
                }`}>
                  {error.message}
                </p>
                {error.details && (
                  <p className="text-xs text-muted-foreground truncate">
                    {error.details}
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRetry}
              className="text-xs shrink-0 ff-hover-scale"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background flex flex-col">
        {/* Enhanced Navigation with error boundary */}
        <CriticalErrorBoundary>
          <Navigation 
            currentPage={appState.currentPage}
            isAuthenticated={appState.isAuthenticated}
            onPageChange={handlePageChange}
            onAuthToggle={handleAuthToggle}
          />
        </CriticalErrorBoundary>

        {/* Main Content with Enhanced Error Boundaries and Loading States */}
        <main className="flex-1">
          <CriticalErrorBoundary>
            <Suspense 
              fallback={
                <div className="flex items-center justify-center min-h-[40vh]">
                  <div className="text-center space-y-3 ff-fade-in-up max-w-md mx-auto px-4">
                    <FullPageLoader message="Loading component..." />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Preparing your development environment...
                      </p>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div className="ff-progress-bar h-1 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <PageRouter 
                currentPage={appState.currentPage}
                isAuthenticated={appState.isAuthenticated}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </CriticalErrorBoundary>
        </main>

        {/* Enhanced Footer with Conditional Rendering and Error Boundary */}
        <CriticalErrorBoundary>
          <AppFooter 
            currentPage={appState.currentPage}
            isAuthenticated={appState.isAuthenticated}
            onPageChange={handlePageChange}
          />
        </CriticalErrorBoundary>
      </div>

      {/* Development and Debug Tools */}
      {isDevelopment && (
        <CriticalErrorBoundary>
          <ConfigDebugPanel />
          <FeatureFlagDebugPanel />
        </CriticalErrorBoundary>
      )}
      
      {/* Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
      
      {/* XP Notification System */}
      <XPNotificationSystem />
    </CriticalErrorBoundary>
  );
}

// Main App component with providers
export default function App() {
  return (
    <ConfigProvider>
      <FeatureFlagProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </FeatureFlagProvider>
    </ConfigProvider>
  );
}

// Enhanced global TypeScript declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    FF_DEBUG?: boolean;
    FF_VERSION?: string;
    FF_BUILD_TIME?: string;
  }
  
  interface Navigator {
    connection?: {
      effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
      downlink: number;
      rtt: number;
      saveData?: boolean;
    };
  }
  
  interface Document {
    startViewTransition?: (callback: () => void) => void;
  }
}