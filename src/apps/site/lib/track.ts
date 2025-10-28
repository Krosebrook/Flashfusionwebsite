/**
 * Client-side analytics tracking utilities
 * Only works if user has granted consent
 */

export function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // Check consent
  const consent = localStorage.getItem('consent');
  if (consent !== 'granted') return;
  
  // Use gtag if available
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params || {});
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, params);
  }
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(label: string) {
  track('cta_click', { label });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  track('scroll_depth', { percent });
}

/**
 * Track pricing page view
 */
export function trackPricingView() {
  track('pricing_view', {});
}

/**
 * Track waitlist confirmation
 */
export function trackWaitlistConfirmed(source: string) {
  track('waitlist_confirmed', { source });
}
