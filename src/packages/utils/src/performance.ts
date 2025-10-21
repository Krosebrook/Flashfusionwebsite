/**
 * Performance optimization utilities for FlashFusion
 */

export const addCriticalResourceHints = () => {
  // Add preconnect links for external resources
  const head = document.head;
  
  // Supabase
  const supabasePreconnect = document.createElement('link');
  supabasePreconnect.rel = 'preconnect';
  supabasePreconnect.href = 'https://api.supabase.co';
  head.appendChild(supabasePreconnect);
  
  // Google Fonts
  const fontsPreconnect = document.createElement('link');
  fontsPreconnect.rel = 'preconnect';
  fontsPreconnect.href = 'https://fonts.googleapis.com';
  head.appendChild(fontsPreconnect);
  
  const fontStaticPreconnect = document.createElement('link');
  fontStaticPreconnect.rel = 'preconnect';
  fontStaticPreconnect.href = 'https://fonts.gstatic.com';
  fontStaticPreconnect.crossOrigin = 'anonymous';
  head.appendChild(fontStaticPreconnect);
};

export const measureWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export const optimizeImageLoading = (img: HTMLImageElement) => {
  img.loading = 'lazy';
  img.decoding = 'async';
};