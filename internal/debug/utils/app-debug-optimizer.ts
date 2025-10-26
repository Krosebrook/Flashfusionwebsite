/**
 * URL Parameter Detection Utilities
 */
export class URLParameterDetector {
  private static cachedResult: boolean | null = null;
  private static lastCheck: number = 0;
  private static readonly CACHE_DURATION = 1000; // Reduced to 1 second for more responsive updates

  /**
   * Optimized app interface detection with enhanced debugging
   */
  static shouldShowAppInterface(): boolean {
    const now = Date.now();
    
    // Always check fresh in development for debugging
    const skipCache = process.env.NODE_ENV === 'development';
    
    // Use cached result if still valid (except in development)
    if (!skipCache && this.cachedResult !== null && (now - this.lastCheck) < this.CACHE_DURATION) {
      console.log('🔍 URL Detection: Using cached result:', this.cachedResult);
      return this.cachedResult;
    }

    try {
      // Check localStorage first (fastest and most reliable)
      const storedPreference = localStorage.getItem('ff-show-app');
      if (storedPreference === 'true') {
        this.cachedResult = true;
        this.lastCheck = now;
        console.log('🔍 URL Detection: localStorage shows app interface');
        return true;
      }

      // Check URL parameters and pathname
      const { search, pathname, hash } = window.location;
      const patterns = ['app=true', '/app', '/dashboard', '/tools', '/projects'];
      
      // Enhanced search parameter checking
      const searchParams = new URLSearchParams(search);
      const hasAppParam = searchParams.get('app') === 'true';
      const hasHashApp = hash === '#app';
      
      // Check pathname patterns
      const matchesPathPattern = patterns.some(pattern => 
        pattern.startsWith('/') 
          ? pathname === pattern || pathname.startsWith(pattern)
          : search.includes(pattern)
      );
      
      const result = hasAppParam || hasHashApp || matchesPathPattern;

      // Enhanced debugging logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 URL Detection Debug - Enhanced:');
        console.log('- Current URL:', window.location.href);
        console.log('- Search:', search);
        console.log('- Pathname:', pathname);
        console.log('- Hash:', hash);
        console.log('- App param from URL:', searchParams.get('app'));
        console.log('- Has app param:', hasAppParam);
        console.log('- Has hash app:', hasHashApp);
        console.log('- Matches path pattern:', matchesPathPattern);
        console.log('- LocalStorage ff-show-app:', storedPreference);
        console.log('- Final result:', result);
        console.log('- Cache time since last check:', now - this.lastCheck, 'ms');
        console.log('- Cache duration:', this.CACHE_DURATION, 'ms');
      }

      // Cache the result
      this.cachedResult = result;
      this.lastCheck = now;

      return result;
    } catch (error) {
      console.warn('⚠️ URL detection failed:', error);
      // Return false on error, don't cache failed results
      return false;
    }
  }

  /**
   * Clear cache (use when URL changes)
   */
  static clearCache(): void {
    this.cachedResult = null;
    this.lastCheck = 0;
    console.log('🗑️ URL Detection: Cache cleared');
  }

  /**
   * Force a fresh check (bypass cache completely)
   */
  static forceCheck(): boolean {
    this.clearCache();
    return this.shouldShowAppInterface();
  }
}