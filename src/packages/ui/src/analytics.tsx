import React from 'react';

interface AnalyticsProps {
  trackingId?: string;
}

export function Analytics({ trackingId }: AnalyticsProps) {
  React.useEffect(() => {
    // Initialize analytics in production
    if (import.meta.env.PROD && trackingId) {
      // Google Analytics 4 setup
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      window.gtag = window.gtag || function(...args: any[]) {
        (window.gtag as any).q = (window.gtag as any).q || [];
        (window.gtag as any).q.push(args);
      };

      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [trackingId]);

  // Track page views
  React.useEffect(() => {
    const handleRouteChange = () => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    };

    // Listen for hash changes (client-side routing)
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  return null;
}