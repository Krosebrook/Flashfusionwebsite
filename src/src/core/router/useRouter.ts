/**
 * @fileoverview FlashFusion Router Hook
 * @description Type-safe, URL-based routing logic for the application.
 * @module core/router
 */

import { useState, useEffect, useCallback } from 'react';
import { computeRouteState } from '../../../lib/routing-state';

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
    return computeRouteState(url, navigator.userAgent, window.innerWidth, localStorage.getItem('ff-show-app'));
  });

  const updateRouteState = useCallback(() => {
    const url = new URL(window.location.href);
    setRouteState(computeRouteState(url, navigator.userAgent, window.innerWidth, localStorage.getItem('ff-show-app')));
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
