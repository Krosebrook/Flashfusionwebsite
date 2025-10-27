/**
 * Mock data fixtures for PerformanceOptimizerTool
 * Extracted from components/tools/optimization/PerformanceOptimizerTool.tsx
 */

export const SCAN_TYPES = [
  {
    value: 'comprehensive',
    label: 'Comprehensive Analysis',
    description:
      'Full performance audit including Core Web Vitals, bundle analysis, and optimization opportunities',
    duration: '3-5 minutes',
  },
  {
    value: 'core_vitals',
    label: 'Core Web Vitals',
    description: "Focus on Google's Core Web Vitals metrics",
    duration: '1-2 minutes',
  },
  {
    value: 'bundle_analysis',
    label: 'Bundle Analysis',
    description: 'Analyze JavaScript bundle size and optimization opportunities',
    duration: '2-3 minutes',
  },
  {
    value: 'api_performance',
    label: 'API Performance',
    description: 'Test API response times and database query performance',
    duration: '2-4 minutes',
  },
  {
    value: 'mobile_performance',
    label: 'Mobile Performance',
    description: 'Performance testing optimized for mobile devices',
    duration: '3-4 minutes',
  },
];

export const DEVICE_TYPES = [
  { value: 'desktop', label: 'Desktop', icon: '🖥️' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'tablet', label: 'Tablet', icon: '📄' },
  { value: 'all', label: 'All Devices', icon: '🌐' },
];

export const NETWORK_CONDITIONS = [
  { value: 'fast', label: 'Fast 3G', description: '1.6 Mbps down, 750 Kbps up' },
  { value: 'slow', label: 'Slow 3G', description: '400 Kbps down, 400 Kbps up' },
  { value: 'regular', label: 'Regular 4G', description: '4 Mbps down, 3 Mbps up' },
  { value: 'wifi', label: 'WiFi', description: 'No throttling' },
];
