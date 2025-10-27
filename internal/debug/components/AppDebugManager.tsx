/**
 * @fileoverview App Debug Manager
 * @chunk debugging
 * @category application
 * @version 1.0.0
 * 
 * Manages all development debug tools and panels.
 */

import React from 'react';
import DebugControlPanel, { DebugPanelWrapper } from '../system/DebugControlPanel';
import { NavigationDebugPanel } from '../system/OptimizedNavigationSystem';
import { LazyLoadingDebugPanel } from '../system/LazyComponentLoader';
import { ErrorAnalyticsDashboard } from '../system/GranularErrorBoundaries';

interface AppDebugManagerProps {
  authState: any;
  appState: any;
}

/**
 * Debug Manager Component
 * Centralizes all development debug tools and provides clean interface
 */
export const AppDebugManager: React.FC<AppDebugManagerProps> = React.memo(({ 
  authState, 
  appState 
}) => {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Auth Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-black/80 text-white text-xs p-2 rounded border border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <span>Auth: {authState.isAuthenticated ? '✅' : '❌'}</span>
            <span>Modal: {authState.showAuthModal ? '👁️' : '🚫'}</span>
            <span>Init: {authState.isInitialized ? '✅' : '⏳'}</span>
            <span>Retry: {authState.retryCount}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Mode: {appState.mode} | Arch: Modular
          </div>
        </div>
      </div>

      {/* Debug Control Panel - Master toggle for all debug panels */}
      <DebugControlPanel />

      {/* Toggleable Debug Panels */}
      <DebugPanelWrapper panelId="navigation">
        <NavigationDebugPanel />
      </DebugPanelWrapper>
      
      <DebugPanelWrapper panelId="lazyLoading">
        <LazyLoadingDebugPanel />
      </DebugPanelWrapper>
      
      <DebugPanelWrapper panelId="errorAnalytics">
        <ErrorAnalyticsDashboard />
      </DebugPanelWrapper>
    </>
  );
});

AppDebugManager.displayName = 'AppDebugManager';

export default AppDebugManager;