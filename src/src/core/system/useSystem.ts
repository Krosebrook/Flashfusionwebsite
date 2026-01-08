/**
 * @fileoverview System Hook
 * @description Handles device detection, initialization, and system capabilities.
 * @module core/system
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp, type AppMode } from '../../../utils/system-detection';

export interface SystemState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  retryCount: number;
}

export function useSystem() {
  const [systemState, setSystemState] = useState<SystemState>({
    mode: 'lite',
    isLoading: true,
    error: null,
    isInitialized: false,
    retryCount: 0
  });

  const deviceDetection = useMemo(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true };
    
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(userAgent) || width <= 768;
    const isTablet = /iPad|Android/i.test(userAgent) && width > 768 && width <= 1024;
    const isDesktop = !isMobile && !isTablet;
    
    return { isMobile, isTablet, isDesktop };
  }, []);

  const initialize = useCallback(async (isRetry: boolean = false) => {
    try {
      setSystemState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        retryCount: isRetry ? prev.retryCount + 1 : 0
      }));
      
      const detectedMode = await initializeApp();
      
      setSystemState(prev => ({
        ...prev,
        mode: detectedMode,
        isLoading: false,
        error: null,
        isInitialized: true
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
      
      setSystemState(prev => ({
        ...prev,
        mode: prev.retryCount >= 2 ? 'emergency' : 'lite',
        isLoading: false,
        error: errorMessage,
        isInitialized: true,
        retryCount: prev.retryCount + 1
      }));
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const retry = useCallback(() => {
    if (systemState.retryCount < 3) {
      initialize(true);
    } else {
      localStorage.removeItem('ff-emergency-mode');
      window.location.reload();
    }
  }, [initialize, systemState.retryCount]);

  return { systemState, deviceDetection, retry };
}
