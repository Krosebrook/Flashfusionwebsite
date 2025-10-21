import { useEffect } from 'react';
import CONFIG from '../lib/config';
import { PageType } from '../types';

interface UseAppAnalyticsParams {
  currentPage: PageType;
  user: any;
  userStats: any;
  trackEvent: (event: string, data: any) => void;
  configInitialized: boolean;
}

export function useAppAnalytics({
  currentPage,
  user,
  userStats,
  trackEvent,
  configInitialized
}: UseAppAnalyticsParams) {
  
  // Track page navigation with enhanced analytics
  useEffect(() => {
    if (!configInitialized) return;
    
    try {
      trackEvent('Page View', {
        page: currentPage,
        userId: user?.id,
        userLevel: userStats?.level,
        subscriptionTier: user?.subscription_tier || 'free',
        timestamp: new Date().toISOString(),
        sessionId: sessionStorage.getItem('ff-session-id') || 'anonymous'
      });

      // Track production metrics if enabled
      if (CONFIG.ANALYTICS_ENABLED && CONFIG.API_BASE_URL) {
        fetch(`${CONFIG.API_BASE_URL}/metrics/page-view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: currentPage,
            userId: user?.id,
            timestamp: Date.now()
          })
        }).catch(() => {}); // Fail silently for analytics
      }
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, [currentPage, user, userStats, trackEvent, configInitialized]);

  // Performance monitoring
  useEffect(() => {
    if (!configInitialized || !CONFIG.PERFORMANCE_MONITORING) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navigationEntry = entry as PerformanceNavigationTiming;
            const loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
            
            if (loadTime > 3000) { // 3 second threshold
              console.warn(`⚠️ Page load time exceeded threshold: ${loadTime}ms`);
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    } catch (error) {
      console.debug('Performance monitoring failed to initialize:', error);
    }
  }, [configInitialized]);
}