/**
 * @fileoverview Production Deployment Configuration
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * PRODUCTION DEPLOYMENT CONFIGURATION
 * 
 * Comprehensive production deployment setup for FlashFusion platform
 * with monitoring, health checks, SSL, and multi-environment support.
 */

// Production Environment Configuration
export const PRODUCTION_CONFIG = {
  app: {
    name: 'FlashFusion AI Platform',
    version: '2.0.0',
    environment: 'production',
    domain: 'app.flashfusion.ai',
    cdnDomain: 'cdn.flashfusion.ai'
  },
  
  deployment: {
    platforms: {
      primary: 'vercel',
      fallback: 'netlify',
      cdn: 'cloudflare'
    },
    
    regions: [
      'us-east-1',    // Virginia (Primary)
      'us-west-2',    // Oregon
      'eu-west-1',    // Ireland
      'ap-southeast-1' // Singapore
    ],
    
    scaling: {
      autoScale: true,
      minInstances: 3,
      maxInstances: 50,
      targetCPU: 70,
      targetMemory: 80
    }
  },
  
  monitoring: {
    healthCheck: {
      endpoint: '/api/health',
      interval: 30000, // 30 seconds
      timeout: 10000,  // 10 seconds
      retries: 3
    },
    
    metrics: {
      performance: true,
      errors: true,
      users: true,
      realtime: true
    },
    
    alerts: {
      email: 'alerts@flashfusion.ai',
      slack: process.env.SLACK_WEBHOOK_URL,
      discord: process.env.DISCORD_WEBHOOK_URL
    }
  },
  
  security: {
    ssl: {
      enforceHTTPS: true,
      hsts: true,
      certificateType: 'wildcard'
    },
    
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app *.supabase.co;
        style-src 'self' 'unsafe-inline' fonts.googleapis.com;
        font-src 'self' fonts.gstatic.com;
        img-src 'self' data: blob: *.supabase.co *.unsplash.com;
        connect-src 'self' *.supabase.co *.vercel.app wss:;
        frame-src 'none';
      `.replace(/\s+/g, ' ').trim()
    },
    
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000,
      skipSuccessfulRequests: false
    }
  },
  
  performance: {
    caching: {
      static: {
        maxAge: 31536000, // 1 year
        immutable: true
      },
      dynamic: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 60
      },
      api: {
        maxAge: 60, // 1 minute
        staleWhileRevalidate: 30
      }
    },
    
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024
    },
    
    bundleOptimization: {
      splitChunks: true,
      minifyCode: true,
      treeshaking: true,
      deadCodeElimination: true
    }
  }
};

// Environment-specific configurations
export const ENVIRONMENT_CONFIGS = {
  production: {
    ...PRODUCTION_CONFIG,
    debug: false,
    sourceMap: false,
    analytics: {
      enabled: true,
      anonymizeIP: true,
      cookieExpires: 365
    }
  },
  
  staging: {
    ...PRODUCTION_CONFIG,
    app: {
      ...PRODUCTION_CONFIG.app,
      domain: 'staging.flashfusion.ai'
    },
    debug: true,
    sourceMap: true,
    analytics: {
      enabled: false
    }
  },
  
  preview: {
    ...PRODUCTION_CONFIG,
    app: {
      ...PRODUCTION_CONFIG.app,
      domain: 'preview.flashfusion.ai'
    },
    debug: true,
    sourceMap: true,
    monitoring: {
      ...PRODUCTION_CONFIG.monitoring,
      alerts: {
        email: 'dev@flashfusion.ai'
      }
    }
  }
};

// Deployment Health Check
export const HEALTH_CHECK_CONFIG = {
  endpoints: [
    {
      name: 'API Health',
      url: '/api/health',
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000
    },
    {
      name: 'Database Connection',
      url: '/api/health/database',
      method: 'GET',
      expectedStatus: 200,
      timeout: 10000
    },
    {
      name: 'AI Services',
      url: '/api/health/ai-services',
      method: 'GET',
      expectedStatus: 200,
      timeout: 15000
    },
    {
      name: 'Supabase Connection',
      url: '/api/health/supabase',
      method: 'GET',
      expectedStatus: 200,
      timeout: 8000
    }
  ],
  
  intervals: {
    startup: 5000,    // 5 seconds during startup
    normal: 30000,    // 30 seconds during normal operation
    degraded: 10000   // 10 seconds when issues detected
  }
};

// SSL Certificate Configuration
export const SSL_CONFIG = {
  domains: [
    'flashfusion.ai',
    '*.flashfusion.ai',
    'app.flashfusion.ai',
    'api.flashfusion.ai',
    'cdn.flashfusion.ai',
    'staging.flashfusion.ai',
    'preview.flashfusion.ai'
  ],
  
  provider: 'letsencrypt',
  autoRenewal: true,
  renewalThreshold: 30, // days before expiry
  
  security: {
    minTLSVersion: '1.2',
    cipherSuites: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-RSA-AES256-SHA384'
    ],
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }
};

// Monitoring and Alerting
export const MONITORING_CONFIG = {
  providers: {
    primary: 'vercel-analytics',
    secondary: 'cloudflare-analytics',
    uptime: 'pingdom'
  },
  
  metrics: {
    performance: {
      coreWebVitals: true,
      customMetrics: [
        'ai_tool_generation_time',
        'user_session_duration',
        'api_response_time',
        'database_query_time'
      ]
    },
    
    business: {
      userSignups: true,
      toolUsage: true,
      conversionRate: true,
      revenueTracking: true
    },
    
    technical: {
      errorRate: true,
      memoryUsage: true,
      cpuUsage: true,
      networkLatency: true
    }
  },
  
  alerts: {
    thresholds: {
      errorRate: 5,        // 5% error rate
      responseTime: 3000,  // 3 seconds
      memoryUsage: 85,     // 85% memory usage
      cpuUsage: 80,        // 80% CPU usage
      diskUsage: 90        // 90% disk usage
    },
    
    channels: [
      {
        type: 'email',
        recipients: ['alerts@flashfusion.ai', 'team@flashfusion.ai'],
        severity: ['critical', 'high']
      },
      {
        type: 'slack',
        webhook: process.env.SLACK_WEBHOOK_URL,
        severity: ['critical', 'high', 'medium']
      },
      {
        type: 'discord',
        webhook: process.env.DISCORD_WEBHOOK_URL,
        severity: ['critical']
      }
    ]
  }
};

export default PRODUCTION_CONFIG;