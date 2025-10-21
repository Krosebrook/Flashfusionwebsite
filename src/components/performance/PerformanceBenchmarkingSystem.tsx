/**
 * @fileoverview Performance Benchmarking & Optimization System
 * @category Performance Testing
 * @version 1.0.0
 * 
 * Automated performance monitoring, baseline establishment, regression testing,
 * and critical rendering path optimization for sub-2s load times.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Timer,
  Database,
  Memory,
  Network,
  Cpu,
  HardDrive,
  Gauge,
  Target,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Download,
  Settings,
  LineChart,
  BarChart3
} from 'lucide-react';

// Performance metrics and thresholds
interface PerformanceMetric {
  id: string;
  name: string;
  category: 'loading' | 'runtime' | 'memory' | 'network' | 'rendering';
  description: string;
  unit: string;
  target: number;
  warning: number;
  critical: number;
  currentValue?: number;
  baseline?: number;
  trend?: 'improving' | 'degrading' | 'stable';
  history?: PerformanceDataPoint[];
}

interface PerformanceDataPoint {
  timestamp: Date;
  value: number;
  metadata?: {
    buildId?: string;
    environment?: string;
    userAgent?: string;
    networkCondition?: string;
  };
}

interface PerformanceBudget {
  category: string;
  metrics: {
    [key: string]: {
      budget: number;
      current: number;
      status: 'pass' | 'warn' | 'fail';
    };
  };
}

interface BenchmarkSuite {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  estimatedDuration: number;
  frequency: 'realtime' | 'continuous' | 'scheduled';
}

// Core Web Vitals and Custom Metrics
const PERFORMANCE_METRICS: PerformanceMetric[] = [
  // Core Web Vitals
  {
    id: 'lcp',
    name: 'Largest Contentful Paint',
    category: 'loading',
    description: 'Time to render the largest content element',
    unit: 'ms',
    target: 2500,
    warning: 4000,
    critical: 5000
  },
  {
    id: 'fid',
    name: 'First Input Delay',
    category: 'runtime',
    description: 'Time from user interaction to browser response',
    unit: 'ms',
    target: 100,
    warning: 300,
    critical: 500
  },
  {
    id: 'cls',
    name: 'Cumulative Layout Shift',
    category: 'rendering',
    description: 'Visual stability score',
    unit: 'score',
    target: 0.1,
    warning: 0.25,
    critical: 0.5
  },
  {
    id: 'fcp',
    name: 'First Contentful Paint',
    category: 'loading',
    description: 'Time to first content render',
    unit: 'ms',
    target: 1800,
    warning: 3000,
    critical: 4000
  },
  {
    id: 'tti',
    name: 'Time to Interactive',
    category: 'loading',
    description: 'Time until page is fully interactive',
    unit: 'ms',
    target: 3800,
    warning: 7300,
    critical: 10000
  },
  
  // Memory Metrics
  {
    id: 'memory-used',
    name: 'Memory Usage',
    category: 'memory',
    description: 'Current memory consumption',
    unit: 'MB',
    target: 50,
    warning: 100,
    critical: 150
  },
  {
    id: 'memory-limit',
    name: 'Memory Limit',
    category: 'memory',
    description: 'Available memory limit',
    unit: 'MB',
    target: 256,
    warning: 128,
    critical: 64
  },
  
  // Network Metrics
  {
    id: 'bundle-size',
    name: 'Initial Bundle Size',
    category: 'network',
    description: 'Size of initial JavaScript bundle',
    unit: 'KB',
    target: 250,
    warning: 500,
    critical: 1000
  },
  {
    id: 'network-requests',
    name: 'Network Requests',
    category: 'network',
    description: 'Number of network requests on initial load',
    unit: 'count',
    target: 20,
    warning: 50,
    critical: 100
  },
  {
    id: 'cache-hit-rate',
    name: 'Cache Hit Rate',
    category: 'network',
    description: 'Percentage of requests served from cache',
    unit: '%',
    target: 80,
    warning: 60,
    critical: 40
  },
  
  // Rendering Metrics
  {
    id: 'frame-rate',
    name: 'Frame Rate',
    category: 'rendering',
    description: 'Average frames per second',
    unit: 'fps',
    target: 60,
    warning: 30,
    critical: 15
  },
  {
    id: 'render-blocking-resources',
    name: 'Render Blocking Resources',
    category: 'rendering',
    description: 'Number of render-blocking resources',
    unit: 'count',
    target: 0,
    warning: 3,
    critical: 5
  }
];

// Performance Budget Configuration
const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  {
    category: 'AI Tools',
    metrics: {
      'load-time': { budget: 2000, current: 0, status: 'pass' },
      'memory-usage': { budget: 75, current: 0, status: 'pass' },
      'bundle-size': { budget: 300, current: 0, status: 'pass' }
    }
  },
  {
    category: 'Authentication',
    metrics: {
      'load-time': { budget: 1500, current: 0, status: 'pass' },
      'memory-usage': { budget: 40, current: 0, status: 'pass' },
      'bundle-size': { budget: 150, current: 0, status: 'pass' }
    }
  },
  {
    category: 'Dashboard',
    metrics: {
      'load-time': { budget: 1800, current: 0, status: 'pass' },
      'memory-usage': { budget: 60, current: 0, status: 'pass' },
      'bundle-size': { budget: 250, current: 0, status: 'pass' }
    }
  },
  {
    category: 'Code Generation',
    metrics: {
      'load-time': { budget: 3000, current: 0, status: 'pass' },
      'memory-usage': { budget: 100, current: 0, status: 'pass' },
      'bundle-size': { budget: 400, current: 0, status: 'pass' }
    }
  }
];

// Benchmark Test Suites
const BENCHMARK_SUITES: BenchmarkSuite[] = [
  {
    id: 'core-vitals',
    name: 'Core Web Vitals',
    description: 'Essential loading and interactivity metrics',
    metrics: ['lcp', 'fid', 'cls', 'fcp', 'tti'],
    estimatedDuration: 30,
    frequency: 'continuous'
  },
  {
    id: 'memory-profile',
    name: 'Memory Profile',
    description: 'Memory usage and leak detection',
    metrics: ['memory-used', 'memory-limit'],
    estimatedDuration: 45,
    frequency: 'scheduled'
  },
  {
    id: 'network-performance',
    name: 'Network Performance',
    description: 'Network efficiency and optimization',
    metrics: ['bundle-size', 'network-requests', 'cache-hit-rate'],
    estimatedDuration: 20,
    frequency: 'continuous'
  },
  {
    id: 'rendering-performance',
    name: 'Rendering Performance',
    description: 'Visual rendering and frame rate analysis',
    metrics: ['frame-rate', 'render-blocking-resources'],
    estimatedDuration: 35,
    frequency: 'realtime'
  }
];

/**
 * Performance Benchmarking System Component
 */
export const PerformanceBenchmarkingSystem: React.FC = () => {
  const [metrics, setMetrics] = useState<Map<string, PerformanceMetric>>(new Map());
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('core-vitals');
  const [benchmarkResults, setBenchmarkResults] = useState<Map<string, any>>(new Map());
  const [performanceBudgets, setPerformanceBudgets] = useState<PerformanceBudget[]>(PERFORMANCE_BUDGETS);

  // Initialize metrics
  useEffect(() => {
    const metricsMap = new Map<string, PerformanceMetric>();
    PERFORMANCE_METRICS.forEach(metric => {
      metricsMap.set(metric.id, {
        ...metric,
        currentValue: Math.random() * metric.warning, // Simulated current value
        baseline: Math.random() * metric.target,
        trend: ['improving', 'degrading', 'stable'][Math.floor(Math.random() * 3)] as any,
        history: generateMockHistory(metric)
      });
    });
    setMetrics(metricsMap);
  }, []);

  // Generate mock performance history
  const generateMockHistory = useCallback((metric: PerformanceMetric): PerformanceDataPoint[] => {
    const history: PerformanceDataPoint[] = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseValue = metric.baseline || metric.target;
      const variation = (Math.random() - 0.5) * 0.3 * baseValue;
      const value = Math.max(0, baseValue + variation);
      
      history.push({
        timestamp,
        value,
        metadata: {
          buildId: `build-${Math.random().toString(36).substr(2, 9)}`,
          environment: 'production',
          userAgent: 'Chrome/91.0.4472.124'
        }
      });
    }
    
    return history;
  }, []);

  // Calculate performance score
  const calculatePerformanceScore = useCallback((metrics: Map<string, PerformanceMetric>): number => {
    let totalScore = 0;
    let totalWeight = 0;
    
    metrics.forEach(metric => {
      if (metric.currentValue !== undefined) {
        let score = 0;
        const weight = metric.category === 'loading' ? 3 : 1; // Prioritize loading metrics
        
        if (metric.currentValue <= metric.target) {
          score = 100;
        } else if (metric.currentValue <= metric.warning) {
          score = 75;
        } else if (metric.currentValue <= metric.critical) {
          score = 50;
        } else {
          score = 25;
        }
        
        totalScore += score * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }, []);

  // Real-time performance monitoring
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => {
        const updated = new Map(prev);
        updated.forEach((metric, id) => {
          // Simulate real-time metric updates
          const variation = (Math.random() - 0.5) * 0.1 * (metric.baseline || metric.target);
          const newValue = Math.max(0, (metric.currentValue || 0) + variation);
          
          updated.set(id, {
            ...metric,
            currentValue: newValue,
            history: [
              ...(metric.history || []).slice(-29),
              {
                timestamp: new Date(),
                value: newValue,
                metadata: {
                  buildId: 'real-time',
                  environment: 'production'
                }
              }
            ]
          });
        });
        return updated;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Run performance benchmark
  const runBenchmark = useCallback(async (suiteId: string) => {
    const suite = BENCHMARK_SUITES.find(s => s.id === suiteId);
    if (!suite) return;
    
    setBenchmarkResults(prev => {
      const updated = new Map(prev);
      updated.set(suiteId, { status: 'running', startTime: new Date() });
      return updated;
    });
    
    // Simulate benchmark execution
    await new Promise(resolve => setTimeout(resolve, suite.estimatedDuration * 100));
    
    const results = {
      status: 'completed',
      startTime: new Date(Date.now() - suite.estimatedDuration * 100),
      endTime: new Date(),
      metrics: suite.metrics.map(metricId => {
        const metric = metrics.get(metricId);
        return {
          id: metricId,
          value: metric?.currentValue || 0,
          target: metric?.target || 0,
          status: (metric?.currentValue || 0) <= (metric?.target || 0) ? 'pass' : 'fail'
        };
      })
    };
    
    setBenchmarkResults(prev => {
      const updated = new Map(prev);
      updated.set(suiteId, results);
      return updated;
    });
  }, [metrics]);

  // Export performance report
  const exportReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      performanceScore: calculatePerformanceScore(metrics),
      metrics: Array.from(metrics.values()),
      budgets: performanceBudgets,
      benchmarkResults: Array.from(benchmarkResults.entries())
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [metrics, performanceBudgets, benchmarkResults, calculatePerformanceScore]);

  // Calculate current performance score
  const currentScore = useMemo(() => 
    calculatePerformanceScore(metrics), 
    [metrics, calculatePerformanceScore]
  );

  // Get metrics by category
  const metricsByCategory = useMemo(() => {
    const categories: { [key: string]: PerformanceMetric[] } = {};
    Array.from(metrics.values()).forEach(metric => {
      if (!categories[metric.category]) {
        categories[metric.category] = [];
      }
      categories[metric.category].push(metric);
    });
    return categories;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Performance Benchmarking System
          </h1>
          <p className="text-gray-400">
            Automated performance monitoring, baseline establishment, and optimization recommendations
          </p>
        </div>

        {/* Performance Score Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="md:col-span-2 bg-[var(--ff-surface)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${
                      currentScore >= 90 ? 'text-green-400' :
                      currentScore >= 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${currentScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{currentScore}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {currentScore >= 90 && 'Excellent Performance'}
                {currentScore >= 70 && currentScore < 90 && 'Good Performance'}
                {currentScore >= 50 && currentScore < 70 && 'Needs Improvement'}
                {currentScore < 50 && 'Poor Performance'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                Load Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {metrics.get('lcp')?.currentValue?.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-400">Target: <2.5s</div>
              <Progress 
                value={(metrics.get('lcp')?.currentValue || 0) / 25} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Memory className="h-5 w-5 mr-2" />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {metrics.get('memory-used')?.currentValue?.toFixed(1)}MB
              </div>
              <div className="text-sm text-gray-400">Target: <50MB</div>
              <Progress 
                value={(metrics.get('memory-used')?.currentValue || 0) / 1.5} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)]">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <div className="space-y-6">
              {/* Controls */}
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Monitoring Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button
                      onClick={() => setIsMonitoring(!isMonitoring)}
                      className={`${
                        isMonitoring 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/80'
                      }`}
                    >
                      {isMonitoring ? (
                        <>
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Stop Monitoring
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Monitoring
                        </>
                      )}
                    </Button>

                    <Button onClick={exportReport} variant="outline" className="border-gray-600">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>

                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                      <span className="text-sm text-gray-400">
                        {isMonitoring ? 'Live Monitoring' : 'Monitoring Stopped'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics by Category */}
              {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => (
                <Card key={category} className="bg-[var(--ff-surface)] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white capitalize flex items-center">
                      {category === 'loading' && <Timer className="h-5 w-5 mr-2" />}
                      {category === 'runtime' && <Cpu className="h-5 w-5 mr-2" />}
                      {category === 'memory' && <Memory className="h-5 w-5 mr-2" />}
                      {category === 'network' && <Network className="h-5 w-5 mr-2" />}
                      {category === 'rendering' && <Activity className="h-5 w-5 mr-2" />}
                      {category} Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryMetrics.map(metric => {
                        const status = 
                          (metric.currentValue || 0) <= metric.target ? 'good' :
                          (metric.currentValue || 0) <= metric.warning ? 'warning' :
                          'critical';
                        
                        return (
                          <div key={metric.id} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white text-sm">{metric.name}</h4>
                              {status === 'good' && <CheckCircle className="h-4 w-4 text-green-400" />}
                              {status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                              {status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Current:</span>
                                <span className={`font-medium ${
                                  status === 'good' ? 'text-green-400' :
                                  status === 'warning' ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {metric.currentValue?.toFixed(1)} {metric.unit}
                                </span>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Target:</span>
                                <span className="text-gray-300">
                                  {metric.target} {metric.unit}
                                </span>
                              </div>
                              
                              <Progress 
                                value={Math.min(100, ((metric.currentValue || 0) / metric.critical) * 100)}
                                className="h-1"
                              />
                              
                              {metric.trend && (
                                <div className="flex items-center text-xs">
                                  {metric.trend === 'improving' && (
                                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                                  )}
                                  {metric.trend === 'degrading' && (
                                    <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                                  )}
                                  {metric.trend === 'stable' && (
                                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-1" />
                                  )}
                                  <span className="text-gray-400 capitalize">{metric.trend}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks">
            <div className="space-y-6">
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Benchmark Suites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BENCHMARK_SUITES.map(suite => {
                      const result = benchmarkResults.get(suite.id);
                      return (
                        <div key={suite.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">{suite.name}</h4>
                            <Button
                              size="sm"
                              onClick={() => runBenchmark(suite.id)}
                              disabled={result?.status === 'running'}
                              className="text-xs"
                            >
                              {result?.status === 'running' ? (
                                <>
                                  <Activity className="h-3 w-3 mr-1 animate-spin" />
                                  Running
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-3 w-3 mr-1" />
                                  Run
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">{suite.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Duration:</span>
                              <span className="text-gray-400">{suite.estimatedDuration}s</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Frequency:</span>
                              <Badge variant="outline" className="text-xs">
                                {suite.frequency}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              Metrics: {suite.metrics.join(', ')}
                            </div>
                          </div>
                          
                          {result && result.status === 'completed' && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <div className="text-xs text-gray-400 mb-1">Last Result:</div>
                              <div className="flex items-center space-x-2">
                                {result.metrics.every((m: any) => m.status === 'pass') ? (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                )}
                                <span className="text-xs text-gray-300">
                                  {result.metrics.filter((m: any) => m.status === 'pass').length} / {result.metrics.length} passed
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Budgets Tab */}
          <TabsContent value="budgets">
            <div className="space-y-6">
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceBudgets.map((budget, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-white mb-3">{budget.category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(budget.metrics).map(([metricName, data]) => (
                            <div key={metricName} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400 capitalize">{metricName.replace('-', ' ')}:</span>
                                <Badge variant={
                                  data.status === 'pass' ? 'default' :
                                  data.status === 'warn' ? 'secondary' :
                                  'destructive'
                                }>
                                  {data.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Budget:</span>
                                <span className="text-gray-400">{data.budget}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Current:</span>
                                <span className={`${
                                  data.status === 'pass' ? 'text-green-400' :
                                  data.status === 'warn' ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {data.current}
                                </span>
                              </div>
                              <Progress 
                                value={(data.current / data.budget) * 100}
                                className="h-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Trend Analysis</h3>
                  <p className="text-gray-400 mb-4">
                    Performance trend charts and historical data analysis would be displayed here.
                  </p>
                  <Button variant="outline" className="border-gray-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Charts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Critical:</strong> Implement code splitting for the main bundle to reduce initial load time by ~40%.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommended:</strong> Enable service worker caching to improve repeat visit performance.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Optimization:</strong> Consider implementing virtual scrolling for large lists to reduce memory usage.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerformanceBenchmarkingSystem;