import React from 'react';

export function useSmartPreloading() {
  React.useEffect(() => {
    // Preload critical routes on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload dashboard components
        import('../../components/pages/DashboardPage');
        import('../../components/pages/ToolsPage');
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('../../components/pages/DashboardPage');
        import('../../components/pages/ToolsPage');
      }, 1000);
    }
  }, []);
}