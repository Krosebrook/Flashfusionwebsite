/**
 * @fileoverview App Performance Manager
 * @chunk performance
 * @category application
 * @version 1.0.0
 * 
 * Manages performance monitoring, metrics collection, and optimization.
 */

import React, { useEffect } from 'react';
import { PerformanceMonitor } from './app-states/PerformanceMonitor';

interface AppPerformanceManagerProps {
  appState: any;
  performanceMetrics: any;
  systemInfo: any;
}

/**
 * Performance Manager Component
 * Handles performance monitoring and metrics collection
 */
export const AppPerformanceManager: React.FC<AppPerformanceManagerProps> = React.memo(({ 
  appState, 
  performanceMetrics, 
  systemInfo 
}) => {
  // Performance monitoring setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize performance observers in development
    if (process.env.NODE_ENV === 'development') {
      // Web Vitals monitoring
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            if (lcpEntry) {
              console.log('🎯 LCP:', lcpEntry.startTime.toFixed(2), 'ms');
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              console.log('⚡ FID:', entry.processingStart - entry.startTime, 'ms');
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                console.log('📏 CLS:', entry.value);
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Cleanup function
          return () => {
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
          };
        } catch (error) {
          console.warn('Performance monitoring setup failed:', error);
        }
      }
    }

    // Memory monitoring in development
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memoryCheck = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const used = memory.usedJSHeapSize / 1048576; // Convert to MB
          const total = memory.totalJSHeapSize / 1048576;
          const limit = memory.jsHeapSizeLimit / 1048576;
          
          console.log('🧠 Memory:', {
            used: used.toFixed(1) + 'MB',
            total: total.toFixed(1) + 'MB',
            limit: limit.toFixed(1) + 'MB',
            usage: ((used / limit) * 100).toFixed(1) + '%'
          });
        }
      };

      // Check memory every 30 seconds in development
      const memoryInterval = setInterval(memoryCheck, 30000);
      
      return () => {
        clearInterval(memoryInterval);
      };
    }
  }, []);

  // Bundle size monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Track resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            const size = (entry as any).transferSize || 0;
            if (size > 0) {
              console.log('📦 Resource:', {
                name: entry.name.split('/').pop(),
                size: (size / 1024).toFixed(1) + 'KB',
                duration: entry.duration.toFixed(2) + 'ms'
              });
            }
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        return () => resourceObserver.disconnect();
      } catch (error) {
        console.warn('Resource monitoring setup failed:', error);
      }
    }
  }, []);

  // This component handles performance monitoring but doesn't render visible UI
  // The actual PerformanceMonitor component is rendered in the route handler
  return null;
});

AppPerformanceManager.displayName = 'AppPerformanceManager';

export default AppPerformanceManager;