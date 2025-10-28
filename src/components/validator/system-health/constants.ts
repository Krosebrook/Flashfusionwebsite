import type { SystemMetric, ErrorLog, PerformanceMetric, Incident, HealthScore } from './types';

export const INITIAL_HEALTH_SCORE: HealthScore = {
  overall: 94,
  performance: 91,
  infrastructure: 96,
  application: 89,
  security: 98,
  user: 87
};

export const INITIAL_SYSTEM_METRICS: SystemMetric[] = [
  {
    id: 'cpu-usage',
    name: 'CPU Usage',
    category: 'infrastructure',
    value: 23,
    unit: '%',
    status: 'healthy',
    threshold: { warning: 70, critical: 90 },
    trend: 'stable',
    lastUpdate: '30 seconds ago',
    description: 'Average CPU utilization across all servers'
  },
  {
    id: 'memory-usage',
    name: 'Memory Usage',
    category: 'infrastructure',
    value: 67,
    unit: '%',
    status: 'warning',
    threshold: { warning: 80, critical: 95 },
    trend: 'up',
    lastUpdate: '30 seconds ago',
    description: 'Memory consumption across application servers'
  },
  {
    id: 'response-time',
    name: 'API Response Time',
    category: 'performance',
    value: 142,
    unit: 'ms',
    status: 'healthy',
    threshold: { warning: 500, critical: 1000 },
    trend: 'down',
    lastUpdate: '1 minute ago',
    description: 'Average API response time across all endpoints'
  },
  {
    id: 'error-rate',
    name: 'Error Rate',
    category: 'application',
    value: 0.3,
    unit: '%',
    status: 'healthy',
    threshold: { warning: 1, critical: 5 },
    trend: 'stable',
    lastUpdate: '2 minutes ago',
    description: 'Application error rate over the last hour'
  },
  {
    id: 'uptime',
    name: 'System Uptime',
    category: 'infrastructure',
    value: 99.9,
    unit: '%',
    status: 'healthy',
    threshold: { warning: 99, critical: 95 },
    trend: 'stable',
    lastUpdate: '5 minutes ago',
    description: 'Overall system availability over the last 30 days'
  },
  {
    id: 'active-users',
    name: 'Active Users',
    category: 'user',
    value: 1247,
    unit: 'users',
    status: 'healthy',
    threshold: { warning: 10000, critical: 15000 },
    trend: 'up',
    lastUpdate: '1 minute ago',
    description: 'Currently active users on the platform'
  }
];

export const INITIAL_ERROR_LOGS: ErrorLog[] = [
  {
    id: 'error-1',
    timestamp: '2 minutes ago',
    level: 'error',
    service: 'validation-engine',
    message: 'Failed to process AI validation request: Timeout after 30 seconds',
    userId: 'user-123',
    sessionId: 'session-456',
    count: 3,
    resolved: false,
    category: 'backend'
  },
  {
    id: 'error-2',
    timestamp: '5 minutes ago',
    level: 'warning',
    service: 'creator-commerce',
    message: 'High memory usage detected in product catalog service',
    count: 1,
    resolved: false,
    category: 'backend'
  },
  {
    id: 'error-3',
    timestamp: '8 minutes ago',
    level: 'error',
    service: 'collaboration-hub',
    message: 'WebSocket connection lost for real-time collaboration',
    userId: 'user-789',
    sessionId: 'session-012',
    count: 2,
    resolved: true,
    category: 'network'
  },
  {
    id: 'error-4',
    timestamp: '12 minutes ago',
    level: 'warning',
    service: 'auth-system',
    message: 'Multiple failed login attempts detected',
    count: 5,
    resolved: false,
    category: 'auth'
  }
];

export const INITIAL_PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: 'page-load',
    name: 'Page Load Time',
    value: 1.2,
    unit: 's',
    benchmark: 2.0,
    status: 'excellent',
    impact: 'high',
    suggestions: ['Optimize image compression', 'Enable browser caching']
  },
  {
    id: 'ttfb',
    name: 'Time to First Byte',
    value: 180,
    unit: 'ms',
    benchmark: 200,
    status: 'good',
    impact: 'medium',
    suggestions: ['Optimize database queries', 'Use CDN for static assets']
  },
  {
    id: 'cls',
    name: 'Cumulative Layout Shift',
    value: 0.05,
    unit: '',
    benchmark: 0.1,
    status: 'excellent',
    impact: 'medium',
    suggestions: ['Pre-size image dimensions', 'Reserve space for ads']
  },
  {
    id: 'fcp',
    name: 'First Contentful Paint',
    value: 0.8,
    unit: 's',
    benchmark: 1.8,
    status: 'excellent',
    impact: 'high',
    suggestions: ['Minify CSS', 'Optimize critical rendering path']
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'incident-1',
    title: 'Elevated API Response Times',
    severity: 'medium',
    status: 'monitoring',
    affectedServices: ['Validation Engine', 'Creator Commerce'],
    startTime: '45 minutes ago',
    description: 'API response times elevated by 40% above normal baseline',
    updates: [
      {
        id: 'update-1',
        timestamp: '30 minutes ago',
        message: 'Identified high memory usage in validation service',
        status: 'identified'
      },
      {
        id: 'update-2',
        timestamp: '15 minutes ago',
        message: 'Applied memory optimization patches',
        status: 'monitoring'
      }
    ]
  },
  {
    id: 'incident-2',
    title: 'Database Connection Pool Exhaustion',
    severity: 'high',
    status: 'resolved',
    affectedServices: ['All Services'],
    startTime: '2 hours ago',
    resolvedTime: '1 hour ago',
    description: 'Database connection pool reached maximum capacity causing service timeouts',
    updates: [
      {
        id: 'update-3',
        timestamp: '1.5 hours ago',
        message: 'Increased connection pool size and optimized queries',
        status: 'resolved'
      }
    ]
  }
];