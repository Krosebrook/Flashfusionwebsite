/**
 * @fileoverview FlashFusion Router Hook
 * @description Type-safe, URL-based routing logic for the application.
 * @module core/router
 */

import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  currentPath: string;
  searchParams: URLSearchParams;
  isDemoMode: boolean;
  isAuthRoute: boolean;
  shouldShowApp: boolean;
  isValidatorRoute: boolean;
}

export function useRouter() {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    if (typeof window === 'undefined') {
      return {
        currentPath: '/',
        searchParams: new URLSearchParams(),
        isDemoMode: false,
        isAuthRoute: false,
        shouldShowApp: false,
        isValidatorRoute: false
      };
    }
    
    const url = new URL(window.location.href);
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // For mobile devices, we require explicit intent to enter the app
    const shouldShowApp = isMobileDevice 
      ? url.searchParams.has('app') && url.searchParams.get('app') === 'true'
      : url.searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
    
    return {
      currentPath: url.pathname,
      searchParams: url.searchParams,
      isDemoMode: url.searchParams.has('demo') || url.pathname.includes('/demo'),
      isAuthRoute: url.pathname.includes('/auth/') || url.pathname.includes('/verify-') || url.pathname.includes('/reset-'),
      shouldShowApp,
      isValidatorRoute: url.pathname === '/validate'
    };
  });

  const updateRouteState = useCallback(() => {
    const url = new URL(window.location.href);
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    const shouldShowApp = isMobileDevice 
      ? url.searchParams.has('app') && url.searchParams.get('app') === 'true'
      : url.searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
    
    setRouteState({
      currentPath: url.pathname,
      searchParams: url.searchParams,
      isDemoMode: url.searchParams.has('demo') || url.pathname.includes('/demo'),
      isAuthRoute: url.pathname.includes('/auth/') || url.pathname.includes('/verify-') || url.pathname.includes('/reset-'),
      shouldShowApp,
      isValidatorRoute: url.pathname === '/validate'
    });
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', updateRouteState);
    window.addEventListener('pushstate', updateRouteState);
    window.addEventListener('replacestate', updateRouteState);
    
    return () => {
      window.removeEventListener('popstate', updateRouteState);
      window.removeEventListener('pushstate', updateRouteState);
      window.removeEventListener('replacestate', updateRouteState);
    };
  }, [updateRouteState]);

  const navigate = useCallback((path: string, replace: boolean = false) => {
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', path);
    updateRouteState();
  }, [updateRouteState]);

  const cleanupUrlParams = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('app');
    localStorage.removeItem('ff-show-app');
    window.history.replaceState({}, '', url.toString());
    updateRouteState();
  }, [updateRouteState]);

  return { routeState, navigate, cleanupUrlParams };
}
