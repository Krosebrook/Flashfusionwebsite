/**
 * Simple test to verify AnalyticsService works without errors
 */

import { analyticsService } from './AnalyticsService';

export function testAnalyticsService() {
  console.log('🧪 Testing AnalyticsService...');
  
  try {
    // Test basic tracking
    analyticsService.track('test_event', {
      category: 'test',
      value: 1
    });
    
    console.log('✅ Basic tracking works');
    
    // Test session start
    analyticsService.trackSessionStart();
    console.log('✅ Session tracking works');
    
    // Test page view
    analyticsService.trackPageView('test-page');
    console.log('✅ Page view tracking works');
    
    // Test tool usage
    analyticsService.trackToolUsage('test-tool', 1000, true);
    console.log('✅ Tool usage tracking works');
    
    // Test error tracking
    analyticsService.trackError('test error', { context: 'test' });
    console.log('✅ Error tracking works');
    
    // Test environment detection
    console.log(`Environment: ${analyticsService.isDevelopment ? 'Development' : 'Production'}`);
    
    // Test session metrics
    const metrics = analyticsService.getSessionMetrics();
    console.log('✅ Session metrics works:', metrics);
    
    console.log('🎉 All AnalyticsService tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ AnalyticsService test failed:', error);
    return false;
  }
}

// Auto-run test in development
if (typeof window !== 'undefined') {
  // Check if we're in development mode safely
  let isDev = false;
  try {
    isDev = window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.port === '5173' ||
            window.location.port === '3000';
  } catch {
    // Ignore errors
  }

  if (isDev) {
    // Run test after a short delay to ensure service is initialized
    setTimeout(() => {
      testAnalyticsService();
    }, 1000);
  }
}