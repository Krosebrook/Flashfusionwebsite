import { PerformanceMetric, OptimizationSuggestion } from './types';

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const getMetricScore = (metric: PerformanceMetric): number => {
  const ratio = metric.value / metric.target;
  if (metric.unit === 'ms' || metric.unit === 's' || metric.unit === 'KB') {
    // Lower is better for time and size metrics
    return Math.max(0, Math.min(100, (2 - ratio) * 50));
  } else {
    // Higher is better for other metrics
    return Math.max(0, Math.min(100, ratio * 100));
  }
};

export const getOverallScore = (metrics: PerformanceMetric[]): number => {
  if (metrics.length === 0) return 0;
  
  const scores = metrics.map(getMetricScore);
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return '↗';
    case 'down': return '↘';
    case 'stable': return '→';
    default: return '→';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'good': return 'text-green-500';
    case 'needs-improvement': return 'text-yellow-500';
    case 'poor': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

export const getEffortColor = (effort: string): string => {
  switch (effort) {
    case 'low': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'high': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'loading': return '⚡';
    case 'runtime': return '🏃';
    case 'memory': return '🧠';
    case 'network': return '🌐';
    default: return '⚙️';
  }
};

export const prioritizeSuggestions = (suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] => {
  const impactScore = { high: 3, medium: 2, low: 1 };
  const effortScore = { low: 3, medium: 2, high: 1 };
  
  return suggestions.sort((a, b) => {
    const scoreA = impactScore[a.impact] + effortScore[a.effort];
    const scoreB = impactScore[b.impact] + effortScore[b.effort];
    return scoreB - scoreA;
  });
};

export const calculatePotentialSavings = (suggestions: OptimizationSuggestion[]): {
  loadTime: number;
  bundleSize: number;
  runtime: number;
} => {
  const implementable = suggestions.filter(s => !s.isImplemented);
  
  return {
    loadTime: implementable.filter(s => s.category === 'loading').length * 15,
    bundleSize: implementable.filter(s => s.category === 'loading').length * 20,
    runtime: implementable.filter(s => s.category === 'runtime').length * 25
  };
};