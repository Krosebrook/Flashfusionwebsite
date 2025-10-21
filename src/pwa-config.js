/**
 * @fileoverview Progressive Web App Configuration
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * PWA CONFIGURATION
 * 
 * Complete Progressive Web App setup for FlashFusion AI Platform
 * with offline support, background sync, push notifications, and app-like experience.
 * 
 * Features:
 * - Service Worker with advanced caching
 * - Offline functionality
 * - Background sync
 * - Push notifications
 * - App installation
 * - Update management
 * - Performance optimization
 */

// Manifest Configuration
export const PWA_MANIFEST = {
  name: 'FlashFusion AI Platform',
  short_name: 'FlashFusion',
  description: 'AI-powered development platform with 65+ tools for building applications',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0F172A',
  theme_color: '#FF7B00',
  orientation: 'portrait-primary',
  
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any'
    }
  ],
  
  categories: ['developer tools', 'productivity', 'utilities'],
  screenshots: [
    {
      src: '/screenshots/desktop-home.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
      label: 'FlashFusion Home Page'
    },
    {
      src: '/screenshots/mobile-tools.png',
      sizes: '390x844',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'AI Tools Hub'
    }
  ],
  
  shortcuts: [
    {
      name: 'AI Tools Hub',
      short_name: 'Tools',
      description: 'Access 65+ AI development tools',
      url: '/tools',
      icons: [{ src: '/icons/tools-shortcut.png', sizes: '96x96' }]
    },
    {
      name: 'Dashboard',
      short_name: 'Dashboard',
      description: 'View your projects and analytics',
      url: '/dashboard',
      icons: [{ src: '/icons/dashboard-shortcut.png', sizes: '96x96' }]
    },
    {
      name: 'Generate Code',
      short_name: 'Generate',
      description: 'Quick access to code generation',
      url: '/tools?category=generation',
      icons: [{ src: '/icons/generate-shortcut.png', sizes: '96x96' }]
    }
  ],
  
  related_applications: [
    {
      platform: 'webapp',
      url: 'https://app.flashfusion.ai/manifest.json'
    }
  ],
  
  prefer_related_applications: false,
  
  protocol_handlers: [
    {
      protocol: 'web+flashfusion',
      url: '/handle?protocol=%s'
    }
  ],
  
  file_handlers: [
    {
      action: '/open-file',
      accept: {
        'application/json': ['.json'],
        'text/javascript': ['.js', '.jsx'],
        'text/typescript': ['.ts', '.tsx'],
        'text/markdown': ['.md']
      }
    }
  ]
};

// Service Worker Configuration
export const SERVICE_WORKER_CONFIG = {
  // Cache Configuration
  caches: {
    // Static assets (long term cache)
    static: {
      name: 'flashfusion-static-v1',
      strategy: 'CacheFirst',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      maxEntries: 100,
      patterns: [
        '/static/**/*',
        '/icons/**/*',
        '/fonts/**/*',
        '/*.css',
        '/*.js'
      ]
    },
    
    // API responses (short term cache with network fallback)
    api: {
      name: 'flashfusion-api-v1',
      strategy: 'NetworkFirst',
      maxAge: 5 * 60, // 5 minutes
      maxEntries: 50,
      patterns: [
        '/api/**/*'
      ]
    },
    
    // HTML pages (network first with cache fallback)
    pages: {
      name: 'flashfusion-pages-v1',
      strategy: 'NetworkFirst',
      maxAge: 24 * 60 * 60, // 24 hours
      maxEntries: 25,
      patterns: [
        '/',
        '/dashboard',
        '/tools',
        '/projects',
        '/analytics'
      ]
    },
    
    // Images and media
    images: {
      name: 'flashfusion-images-v1',
      strategy: 'CacheFirst',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      maxEntries: 200,
      patterns: [
        '/**/*.{png,jpg,jpeg,gif,svg,webp,avif}'
      ]
    },
    
    // External resources
    external: {
      name: 'flashfusion-external-v1',
      strategy: 'StaleWhileRevalidate',
      maxAge: 24 * 60 * 60, // 24 hours
      maxEntries: 30,
      patterns: [
        'https://fonts.googleapis.com/**/*',
        'https://fonts.gstatic.com/**/*',
        'https://api.unsplash.com/**/*'
      ]
    }
  },
  
  // Background Sync Configuration
  backgroundSync: {
    queues: {
      // Analytics queue
      analytics: {
        name: 'analytics-queue',
        maxRetentionTime: 24 * 60 * 60 * 1000, // 24 hours
        maxRetries: 3
      },
      
      // User actions queue
      userActions: {
        name: 'user-actions-queue',
        maxRetentionTime: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxRetries: 5
      },
      
      // Feedback queue
      feedback: {
        name: 'feedback-queue',
        maxRetentionTime: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxRetries: 10
      }
    }
  },
  
  // Push Notifications Configuration
  pushNotifications: {
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    
    // Notification types
    types: {
      welcome: {
        title: 'Welcome to FlashFusion! 🚀',
        body: 'Start building amazing applications with AI assistance',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        tag: 'welcome',
        requireInteraction: false,
        silent: false
      },
      
      toolUpdate: {
        title: 'New AI Tool Available! ✨',
        body: 'Check out the latest addition to our AI tools suite',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        tag: 'tool-update',
        requireInteraction: false,
        silent: false,
        actions: [
          {
            action: 'view-tools',
            title: 'View Tools',
            icon: '/icons/tools-action.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/icons/dismiss-action.png'
          }
        ]
      },
      
      projectComplete: {
        title: 'Project Generation Complete! 🎉',
        body: 'Your project is ready for download',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        tag: 'project-complete',
        requireInteraction: true,
        silent: false,
        actions: [
          {
            action: 'download-project',
            title: 'Download',
            icon: '/icons/download-action.png'
          },
          {
            action: 'view-project',
            title: 'View Project',
            icon: '/icons/view-action.png'
          }
        ]
      },
      
      maintenance: {
        title: 'Scheduled Maintenance 🔧',
        body: 'FlashFusion will be offline for maintenance',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        tag: 'maintenance',
        requireInteraction: true,
        silent: false
      }
    }
  },
  
  // Offline Configuration
  offline: {
    // Offline fallback page
    fallbackPage: '/offline.html',
    
    // Critical resources to cache immediately
    precache: [
      '/',
      '/offline.html',
      '/static/app.js',
      '/static/app.css',
      '/icons/icon-192x192.png',
      '/manifest.json'
    ],
    
    // Routes that should work offline
    offlineRoutes: [
      '/',
      '/dashboard',
      '/tools',
      '/projects',
      '/settings'
    ],
    
    // Network timeout for offline detection
    networkTimeout: 3000
  },
  
  // Update Strategy
  updates: {
    // Check for updates interval (in minutes)
    checkInterval: 60,
    
    // Force update after this many days
    forceUpdateAfter: 7,
    
    // Show update available notification
    showUpdateNotification: true,
    
    // Skip waiting for update
    skipWaiting: false
  }
};

// Installation Prompts Configuration
export const INSTALL_PROMPT_CONFIG = {
  // When to show install prompt
  triggers: {
    // After visiting X pages
    pageVisits: 3,
    
    // After X minutes on site
    timeOnSite: 5 * 60 * 1000, // 5 minutes
    
    // After using X tools
    toolUsage: 2,
    
    // Show on specific pages
    pages: ['/tools', '/dashboard'],
    
    // Days to wait between prompts
    cooldownDays: 7
  },
  
  // Install prompt content
  content: {
    title: 'Install FlashFusion',
    message: 'Get faster access to AI development tools with our app!',
    benefits: [
      '⚡ Faster loading times',
      '📱 Works offline',
      '🔔 Push notifications',
      '🚀 App-like experience'
    ],
    installButton: 'Install App',
    dismissButton: 'Not Now'
  },
  
  // A2HS (Add to Home Screen) specific
  a2hs: {
    // Show custom prompt before browser prompt
    showCustomPrompt: true,
    
    // Defer browser prompt
    deferBrowserPrompt: true,
    
    // Track installation events
    trackEvents: true
  }
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Critical resource hints
  resourceHints: {
    // DNS prefetch for external domains
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.unsplash.com'
    ],
    
    // Preconnect to critical origins
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    
    // Preload critical resources
    preload: [
      { href: '/static/app.css', as: 'style' },
      { href: '/static/app.js', as: 'script' },
      { href: '/fonts/sora.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
    ]
  },
  
  // Lazy loading configuration
  lazyLoading: {
    // Image lazy loading
    images: {
      enabled: true,
      threshold: 0.1, // Load when 10% visible
      rootMargin: '50px'
    },
    
    // Component lazy loading
    components: {
      enabled: true,
      chunkSizeLimit: 250000 // 250KB
    }
  },
  
  // Code splitting
  codeSplitting: {
    // Split vendor libraries
    vendor: {
      react: ['react', 'react-dom'],
      ui: ['@radix-ui/*'],
      utils: ['lodash', 'date-fns']
    },
    
    // Route-based splitting
    routes: true,
    
    // Dynamic imports threshold
    dynamicImportThreshold: 100000 // 100KB
  }
};

// Analytics Configuration
export const PWA_ANALYTICS_CONFIG = {
  // Installation tracking
  installation: {
    trackPromptShown: true,
    trackPromptAccepted: true,
    trackPromptDismissed: true,
    trackInstallSuccess: true,
    trackInstallFailed: true
  },
  
  // Usage tracking
  usage: {
    trackOfflineUsage: true,
    trackServiceWorkerEvents: true,
    trackCachePerformance: true,
    trackNotificationInteractions: true
  },
  
  // Performance tracking
  performance: {
    trackFirstPaint: true,
    trackFirstContentfulPaint: true,
    trackLargestContentfulPaint: true,
    trackFirstInputDelay: true,
    trackCumulativeLayoutShift: true,
    trackTimeToInteractive: true
  }
};

// Security Configuration
export const PWA_SECURITY_CONFIG = {
  // Content Security Policy for PWA
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.vercel.app"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "blob:", "https://*.unsplash.com", "https://*.supabase.co"],
    'connect-src': ["'self'", "https://*.supabase.co", "https://*.vercel.app", "wss:"],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"]
  },
  
  // Service Worker security
  serviceWorker: {
    // Only allow service worker from same origin
    restrictToSameOrigin: true,
    
    // Validate service worker integrity
    validateIntegrity: true,
    
    // Security headers for service worker
    securityHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
};

// Export all configurations
export default {
  manifest: PWA_MANIFEST,
  serviceWorker: SERVICE_WORKER_CONFIG,
  installPrompt: INSTALL_PROMPT_CONFIG,
  performance: PERFORMANCE_CONFIG,
  analytics: PWA_ANALYTICS_CONFIG,
  security: PWA_SECURITY_CONFIG
};