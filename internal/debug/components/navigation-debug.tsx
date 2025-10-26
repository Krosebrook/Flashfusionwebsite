/**
 * @fileoverview Navigation Debug Component
 * @chunk debug
 * @category ui
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Debug component to help troubleshoot navigation issues.
 * Only shows in development mode.
 */

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { NavigationEventManager, URLParameterDetector } from '../../utils/navigation-system';
import { useAuthentication } from '../../hooks/useAuthentication';

interface NavigationDebugProps {
  showAppInterface: boolean;
}

export function NavigationDebug({ showAppInterface }: NavigationDebugProps) {
  const { isAuthenticated, user, logout } = useAuthentication();
  const [debugInfo, setDebugInfo] = useState({
    url: '',
    search: '',
    pathname: '',
    localStorage: '',
    detectorResult: false,
    timestamp: '',
    authStatus: 'unknown',
    userEmail: ''
  });

  const updateDebugInfo = () => {
    URLParameterDetector.clearCache(); // Clear cache to get fresh result
    setDebugInfo({
      url: window.location.href,
      search: window.location.search,
      pathname: window.location.pathname,
      localStorage: localStorage.getItem('ff-show-app') || 'null',
      detectorResult: URLParameterDetector.shouldShowAppInterface(),
      timestamp: new Date().toLocaleTimeString(),
      authStatus: isAuthenticated ? 'authenticated' : 'not authenticated',
      userEmail: user?.email || 'none'
    });
  };

  useEffect(() => {
    updateDebugInfo();
    
    // Update every 2 seconds
    const interval = setInterval(updateDebugInfo, 2000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Handle entering the app
  const handleEnterApp = () => {
    try {
      console.log('🚀 Debug: Triggering authentication...');
      
      // Set flag that user wants to access the app
      localStorage.setItem('ff-show-app', 'true');
      
      // Update URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('app', 'true');
      window.history.pushState({}, '', currentUrl.toString());
      
      // Trigger navigation change - this will show auth modal if not authenticated
      NavigationEventManager.getInstance().triggerNavigationChange();
      
      updateDebugInfo();
      console.log('✅ Debug: Authentication trigger completed');
    } catch (error) {
      console.error('❌ Debug: Failed to trigger authentication:', error);
    }
  };

  const handleExitApp = () => {
    try {
      console.log('🚪 Debug: Logging out and exiting app...');
      
      // Logout if authenticated
      if (isAuthenticated) {
        logout();
      }
      
      // Remove localStorage flag
      localStorage.removeItem('ff-show-app');
      
      // Update URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('app');
      window.history.pushState({}, '', currentUrl.toString());
      
      // Trigger navigation change
      NavigationEventManager.getInstance().triggerNavigationChange();
      
      updateDebugInfo();
      console.log('✅ Debug: App exit completed');
    } catch (error) {
      console.error('❌ Debug: Failed to exit app:', error);
    }
  };

  const handleClearCache = () => {
    try {
      console.log('🗑️ Debug: Clearing cache...');
      URLParameterDetector.clearCache();
      updateDebugInfo();
      console.log('✅ Debug: Cache cleared');
    } catch (error) {
      console.error('❌ Debug: Failed to clear cache:', error);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-red-950/90 border-red-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          🔧 Navigation Debug
          <Badge variant="destructive" className="text-xs">
            DEV
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        
        {/* Current State */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>App Interface:</strong>
            <Badge className={showAppInterface ? 'bg-green-600' : 'bg-red-600'}>
              {showAppInterface ? 'SHOWN' : 'HIDDEN'}
            </Badge>
          </div>
          <div>
            <strong>Auth Status:</strong>
            <Badge className={isAuthenticated ? 'bg-green-600' : 'bg-red-600'}>
              {debugInfo.authStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* URL Info */}
        <div className="space-y-1">
          <div><strong>URL:</strong> {debugInfo.url}</div>
          <div><strong>Search:</strong> {debugInfo.search || '(none)'}</div>
          <div><strong>Path:</strong> {debugInfo.pathname}</div>
          <div><strong>localStorage:</strong> {debugInfo.localStorage}</div>
          <div><strong>User:</strong> {debugInfo.userEmail}</div>
          <div><strong>Updated:</strong> {debugInfo.timestamp}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={handleEnterApp}
            className="bg-green-600 hover:bg-green-700 text-xs"
            disabled={isAuthenticated}
          >
            {isAuthenticated ? 'Authenticated' : 'Trigger Auth'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExitApp}
            className="bg-red-600 hover:bg-red-700 text-xs"
          >
            Logout & Exit
          </Button>
          <Button 
            size="sm" 
            onClick={handleClearCache}
            variant="outline"
            className="text-xs"
          >
            Clear Cache
          </Button>
        </div>

        {/* Refresh Button */}
        <Button 
          size="sm" 
          onClick={updateDebugInfo}
          variant="outline"
          className="w-full text-xs"
        >
          Refresh Debug Info
        </Button>
      </CardContent>
    </Card>
  );
}

export default NavigationDebug;