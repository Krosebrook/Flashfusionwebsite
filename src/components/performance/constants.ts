import { PerformanceMetric, OptimizationSuggestion, BundleAnalysis } from './types';

export const MOCK_PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    name: 'First Contentful Paint',
    value: 1.8,
    unit: 's',
    target: 1.5,
    status: 'needs-improvement',
    trend: 'down',
    description: 'Time until the first piece of content is painted on screen'
  },
  {
    name: 'Largest Contentful Paint',
    value: 2.4,
    unit: 's',
    target: 2.5,
    status: 'good',
    trend: 'stable',
    description: 'Time until the largest content element is painted'
  },
  {
    name: 'Cumulative Layout Shift',
    value: 0.15,
    unit: '',
    target: 0.1,
    status: 'needs-improvement',
    trend: 'up',
    description: 'Measures visual stability during page load'
  },
  {
    name: 'First Input Delay',
    value: 45,
    unit: 'ms',
    target: 100,
    status: 'good',
    trend: 'stable',
    description: 'Time from first user interaction to browser response'
  },
  {
    name: 'Bundle Size',
    value: 450,
    unit: 'KB',
    target: 300,
    status: 'poor',
    trend: 'up',
    description: 'Total JavaScript bundle size'
  },
  {
    name: 'Time to Interactive',
    value: 3.2,
    unit: 's',
    target: 3.0,
    status: 'needs-improvement',
    trend: 'down',
    description: 'Time until page is fully interactive'
  }
];

export const MOCK_OPTIMIZATION_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    id: '1',
    title: 'Enable Code Splitting',
    description: 'Split your JavaScript bundle into smaller chunks to reduce initial load time',
    impact: 'high',
    effort: 'medium',
    category: 'loading',
    potentialSavings: '30-40% faster initial load',
    isImplemented: false,
    autoImplementable: true
  },
  {
    id: '2',
    title: 'Optimize Images',
    description: 'Compress and convert images to modern formats like WebP',
    impact: 'high',
    effort: 'low',
    category: 'loading',
    potentialSavings: '50-70% smaller image sizes',
    isImplemented: true,
    autoImplementable: true
  },
  {
    id: '3',
    title: 'Implement Caching Strategy',
    description: 'Add aggressive caching for static assets and API responses',
    impact: 'medium',
    effort: 'medium',
    category: 'network',
    potentialSavings: '80-90% faster repeat visits',
    isImplemented: false,
    autoImplementable: true
  },
  {
    id: '4',
    title: 'Remove Unused Dependencies',
    description: 'Remove unused npm packages and dead code',
    impact: 'medium',
    effort: 'low',
    category: 'loading',
    potentialSavings: '15-25% smaller bundle',
    isImplemented: false,
    autoImplementable: false
  },
  {
    id: '5',
    title: 'Implement Virtual Scrolling',
    description: 'Use virtual scrolling for large lists to improve runtime performance',
    impact: 'medium',
    effort: 'high',
    category: 'runtime',
    potentialSavings: '60-80% better list performance',
    isImplemented: false,
    autoImplementable: false
  }
];

export const MOCK_BUNDLE_ANALYSIS: BundleAnalysis = {
  totalSize: 450000,
  gzippedSize: 135000,
  chunks: [
    { name: 'vendor', size: 280000, type: 'vendor', modules: 45 },
    { name: 'main', size: 120000, type: 'main', modules: 23 },
    { name: 'about', size: 35000, type: 'async', modules: 8 },
    { name: 'dashboard', size: 15000, type: 'async', modules: 4 }
  ],
  dependencies: [
    { name: 'react', size: 45000, percentage: 10, treeshakeable: false },
    { name: 'lodash', size: 67000, percentage: 15, treeshakeable: true },
    { name: 'moment', size: 56000, percentage: 12, treeshakeable: false },
    { name: 'chart.js', size: 89000, percentage: 20, treeshakeable: true },
    { name: 'framer-motion', size: 78000, percentage: 17, treeshakeable: true }
  ]
};

export const OPTIMIZATION_CATEGORIES = [
  'loading',
  'runtime', 
  'memory',
  'network'
] as const;

export const METRIC_STATUS_COLORS = {
  good: 'text-green-500',
  'needs-improvement': 'text-yellow-500',
  poor: 'text-red-500'
} as const;

export const IMPACT_COLORS = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500'
} as const;

export const EFFORT_COLORS = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
} as const;