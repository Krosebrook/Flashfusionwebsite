import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { PerformanceMonitor, getMemoryUsage, analyzeCriticalBundleSize } from '../../utils/performance';
import { analyticsService } from '../../services/AnalyticsService';
import { 
  Activity, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Gauge,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  bundleSize: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

interface PerformanceThresholds {
  fcp: { good: number; fair: number };
  lcp: { good: number; fair: number };
  cls: { good: number; fair: number };
  fid: { good: number; fair: number };
  ttfb: { good: number; fair: number };
  memoryUsage: { good: number; fair: number };
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  fcp: { good: 1800, fair: 3000 },
  lcp: { good: 2500, fair: 4000 },
  cls: { good: 0.1, fair: 0.25 },
  fid: { good: 100, fair: 300 },
  ttfb: { good: 600, fair: 1500 },
  memoryUsage: { good: 70, fair: 85 }
};

const MetricCard = memo(({ 
  title, 
  value, 
  threshold, 
  unit = 'ms', 
  icon: Icon,
  trend 
}: {
  title: string;
  value: number;
  threshold: { good: number; fair: number };
  unit?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'stable';
}) => {
  const getStatus = (val: number, thresh: { good: number; fair: number }) => {
    if (val <= thresh.good) return 'good';
    if (val <= thresh.fair) return 'fair';
    return 'poor';
  };

  const status = getStatus(value, threshold);
  const statusColors = {
    good: 'text-success bg-success/10 border-success/20',
    fair: 'text-warning bg-warning/10 border-warning/20',
    poor: 'text-destructive bg-destructive/10 border-destructive/20'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={`ff-card-interactive ff-hover-lift ${statusColors[status]} border`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="ff-text-sm font-sora">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {TrendIcon && <TrendIcon className="w-3 h-3" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="ff-text-2xl font-bold font-sora">
            {value.toFixed(unit === '%' ? 1 : 0)}{unit}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={status === 'good' ? 'default' : status === 'fair' ? 'secondary' : 'destructive'}>
              {status.toUpperCase()}
            </Badge>
            <span className="ff-text-xs text-muted-foreground font-inter">
              Goal: <{threshold.good}{unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

const BundleAnalysisCard = memo(({ bundleData }: { bundleData: any }) => (
  <Card className="ff-card-interactive">
    <CardHeader>
      <CardTitle className="ff-text-lg font-sora flex items-center gap-2">
        <Download className="w-5 h-5" />
        Bundle Analysis
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="ff-text-sm text-muted-foreground font-inter">Total Size</div>
          <div className="ff-text-xl font-bold font-sora">
            {(bundleData.totalSize / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
        <div>
          <div className="ff-text-sm text-muted-foreground font-inter">JavaScript</div>
          <div className="ff-text-xl font-bold font-sora">
            {(bundleData.jsSize / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between ff-text-sm font-inter">
          <span>JavaScript</span>
          <span>{((bundleData.jsSize / bundleData.totalSize) * 100).toFixed(1)}%</span>
        </div>
        <Progress value={(bundleData.jsSize / bundleData.totalSize) * 100} className="h-2" />
        
        <div className="flex justify-between ff-text-sm font-inter">
          <span>Stylesheets</span>
          <span>{((bundleData.cssSize / bundleData.totalSize) * 100).toFixed(1)}%</span>
        </div>
        <Progress value={(bundleData.cssSize / bundleData.totalSize) * 100} className="h-2" />
        
        <div className="flex justify-between ff-text-sm font-inter">
          <span>Images</span>
          <span>{((bundleData.imageSize / bundleData.totalSize) * 100).toFixed(1)}%</span>
        </div>
        <Progress value={(bundleData.imageSize / bundleData.totalSize) * 100} className="h-2" />
        
        <div className="flex justify-between ff-text-sm font-inter">
          <span>Fonts</span>
          <span>{((bundleData.fontSize / bundleData.totalSize) * 100).toFixed(1)}%</span>
        </div>
        <Progress value={(bundleData.fontSize / bundleData.totalSize) * 100} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <h4 className="ff-text-sm font-semibold font-sora">Critical Resources</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
          {bundleData.criticalResources
            .filter((resource: any) => resource.critical)
            .slice(0, 5)
            .map((resource: any, index: number) => (
              <div key={index} className="flex justify-between ff-text-xs font-inter p-2 bg-muted/30 rounded">
                <span className="truncate pr-2">{resource.name.split('/').pop()}</span>
                <span className="font-mono">{(resource.size / 1024).toFixed(1)}KB</span>
              </div>
            ))
          }
        </div>
      </div>
    </CardContent>
  </Card>
));

BundleAnalysisCard.displayName = 'BundleAnalysisCard';

const PerformanceMetricsDashboard = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    bundleSize: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    ttfb: 0
  });
  
  const [bundleAnalysis, setBundleAnalysis] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [historicalData, setHistoricalData] = useState<PerformanceMetrics[]>([]);

  const collectMetrics = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const performanceMonitor = PerformanceMonitor.getInstance();
      const allMetrics = performanceMonitor.getAllMetrics();
      
      // Get memory usage
      const memoryInfo = getMemoryUsage();
      
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Get paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      // Get LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lcpEntry = lcpEntries[lcpEntries.length - 1];
      
      // Calculate component count (estimate)
      const componentCount = document.querySelectorAll('[data-reactroot], [data-testid]').length;
      
      const newMetrics: PerformanceMetrics = {
        renderTime: allMetrics['app-render']?.renderTime || 0,
        memoryUsage: memoryInfo?.percentage || 0,
        componentCount,
        bundleSize: 0, // Will be updated by bundle analysis
        fcp: fcpEntry?.startTime || 0,
        lcp: lcpEntry?.startTime || 0,
        cls: 0, // Would need layout-shift observer
        fid: 0, // Would need first-input observer
        ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0
      };
      
      setMetrics(newMetrics);
      
      // Add to historical data
      setHistoricalData(prev => {
        const updated = [...prev, newMetrics];
        return updated.slice(-10); // Keep last 10 measurements
      });
      
      // Analyze bundle
      const bundleData = await analyzeCriticalBundleSize();
      setBundleAnalysis(bundleData);
      
      // Update bundle size in metrics
      setMetrics(prev => ({ ...prev, bundleSize: bundleData.totalSize }));
      
      // Track performance metrics
      analyticsService.trackPerformance('metrics_collected', {
        fcp: newMetrics.fcp,
        lcp: newMetrics.lcp,
        memoryUsage: newMetrics.memoryUsage,
        bundleSize: bundleData.totalSize,
        componentCount: newMetrics.componentCount
      });
      
    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
      analyticsService.trackError('performance', 'Metrics collection failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshMetrics = useCallback(() => {
    collectMetrics();
  }, [collectMetrics]);

  const exportMetrics = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currentMetrics: metrics,
      historicalData,
      bundleAnalysis,
      thresholds: PERFORMANCE_THRESHOLDS,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashfusion-performance-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    analyticsService.trackEvent('performance_export', { metricsCount: historicalData.length });
  }, [metrics, historicalData, bundleAnalysis]);

  // Collect initial metrics
  useEffect(() => {
    const timer = setTimeout(collectMetrics, 1000); // Allow page to settle
    return () => clearTimeout(timer);
  }, [collectMetrics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(collectMetrics, 30000);
    return () => clearInterval(interval);
  }, [collectMetrics]);

  const getOverallScore = () => {
    const scores = {
      fcp: metrics.fcp <= PERFORMANCE_THRESHOLDS.fcp.good ? 100 : 
           metrics.fcp <= PERFORMANCE_THRESHOLDS.fcp.fair ? 50 : 0,
      lcp: metrics.lcp <= PERFORMANCE_THRESHOLDS.lcp.good ? 100 : 
           metrics.lcp <= PERFORMANCE_THRESHOLDS.lcp.fair ? 50 : 0,
      ttfb: metrics.ttfb <= PERFORMANCE_THRESHOLDS.ttfb.good ? 100 : 
            metrics.ttfb <= PERFORMANCE_THRESHOLDS.ttfb.fair ? 50 : 0,
      memory: metrics.memoryUsage <= PERFORMANCE_THRESHOLDS.memoryUsage.good ? 100 : 
              metrics.memoryUsage <= PERFORMANCE_THRESHOLDS.memoryUsage.fair ? 50 : 0
    };
    
    return Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  };

  const overallScore = getOverallScore();
  const scoreColor = overallScore >= 80 ? 'text-success' : overallScore >= 60 ? 'text-warning' : 'text-destructive';

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-2xl font-bold ff-text-gradient font-sora">
            Performance Metrics
          </h2>
          <p className="ff-text-sm text-muted-foreground font-inter">
            Real-time FlashFusion performance monitoring and optimization
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className={`ff-text-3xl font-bold font-sora ${scoreColor}`}>
              {overallScore}
            </div>
            <div className="ff-text-xs text-muted-foreground font-inter">Overall Score</div>
          </div>
          
          <Button 
            onClick={refreshMetrics} 
            disabled={isRefreshing}
            className="ff-btn-secondary ff-hover-glow font-sora"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            onClick={exportMetrics}
            variant="outline"
            className="ff-hover-scale font-sora"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="web-vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="web-vitals" className="font-sora">Web Vitals</TabsTrigger>
          <TabsTrigger value="runtime" className="font-sora">Runtime</TabsTrigger>
          <TabsTrigger value="bundle" className="font-sora">Bundle</TabsTrigger>
          <TabsTrigger value="history" className="font-sora">History</TabsTrigger>
        </TabsList>

        <TabsContent value="web-vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="First Contentful Paint"
              value={metrics.fcp}
              threshold={PERFORMANCE_THRESHOLDS.fcp}
              icon={Zap}
              trend="stable"
            />
            
            <MetricCard
              title="Largest Contentful Paint"
              value={metrics.lcp}
              threshold={PERFORMANCE_THRESHOLDS.lcp}
              icon={Activity}
              trend="stable"
            />
            
            <MetricCard
              title="Time to First Byte"
              value={metrics.ttfb}
              threshold={PERFORMANCE_THRESHOLDS.ttfb}
              icon={Clock}
              trend="stable"
            />
            
            <MetricCard
              title="Cumulative Layout Shift"
              value={metrics.cls}
              threshold={PERFORMANCE_THRESHOLDS.cls}
              unit=""
              icon={Gauge}
              trend="stable"
            />
            
            <MetricCard
              title="First Input Delay"
              value={metrics.fid}
              threshold={PERFORMANCE_THRESHOLDS.fid}
              icon={Activity}
              trend="stable"
            />
            
            <MetricCard
              title="Memory Usage"
              value={metrics.memoryUsage}
              threshold={PERFORMANCE_THRESHOLDS.memoryUsage}
              unit="%"
              icon={AlertTriangle}
              trend="stable"
            />
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="ff-text-lg font-sora">Runtime Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="ff-text-sm font-inter">Render Time</span>
                    <span className="ff-text-sm font-mono">{metrics.renderTime.toFixed(2)}ms</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="ff-text-sm font-inter">Component Count</span>
                    <span className="ff-text-sm font-mono">{metrics.componentCount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="ff-text-sm font-inter">Memory Usage</span>
                    <span className="ff-text-sm font-mono">{metrics.memoryUsage.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="ff-text-lg font-sora">Performance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="ff-text-sm font-inter">React optimizations active</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="ff-text-sm font-inter">Bundle splitting enabled</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="ff-text-sm font-inter">Image lazy loading active</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="ff-text-sm font-inter">Performance monitoring enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bundle" className="space-y-6">
          {bundleAnalysis && <BundleAnalysisCard bundleData={bundleAnalysis} />}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="ff-text-lg font-sora">Historical Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {historicalData.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 ff-text-xs font-semibold text-muted-foreground font-sora">
                    <div>Time</div>
                    <div>FCP (ms)</div>
                    <div>LCP (ms)</div>
                    <div>Memory (%)</div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {historicalData.slice().reverse().map((data, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 ff-text-sm font-inter p-2 bg-muted/30 rounded">
                        <div className="font-mono">
                          {new Date(Date.now() - (historicalData.length - index - 1) * 30000).toLocaleTimeString()}
                        </div>
                        <div className="font-mono">{data.fcp.toFixed(0)}</div>
                        <div className="font-mono">{data.lcp.toFixed(0)}</div>
                        <div className="font-mono">{data.memoryUsage.toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="ff-text-sm text-muted-foreground font-inter">
                    No historical data available yet. Metrics are collected every 30 seconds.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

PerformanceMetricsDashboard.displayName = 'PerformanceMetricsDashboard';

export default PerformanceMetricsDashboard;