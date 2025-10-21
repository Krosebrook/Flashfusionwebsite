export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'needs-improvement' | 'poor';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: 'loading' | 'runtime' | 'memory' | 'network';
  potentialSavings: string;
  isImplemented: boolean;
  autoImplementable: boolean;
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    type: 'vendor' | 'main' | 'async';
    modules: number;
  }>;
  dependencies: Array<{
    name: string;
    size: number;
    percentage: number;
    treeshakeable: boolean;
  }>;
}

export interface OptimizationSettings {
  codeSplitting: boolean;
  imageOptimization: boolean;
  caching: boolean;
  compression: boolean;
  prefetching: boolean;
  serviceWorker: boolean;
}