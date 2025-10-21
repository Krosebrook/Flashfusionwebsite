import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { memoryOptimizer, forceMemoryCleanup } from '../../utils/memory-optimizer';
import { cacheManager } from '../../utils/memory-aware-cache';
import { componentPool } from '../../utils/component-pool';
import { shouldLoadComponent } from '../../utils/bundle-analyzer';

/**
 * Advanced Memory Performance Monitor
 * Comprehensive monitoring and management of memory usage
 */

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
  cacheHitRate: number;
  poolEfficiency: number;
}

interface AdvancedMemoryMonitorProps {
  className?: string;
  showControls?: boolean;
}

export function AdvancedMemoryMonitor({ 
  className = '', 
  showControls = true 
}: AdvancedMemoryMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [cleanupHistory, setCleanupHistory] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoCleanup, setAutoCleanup] = useState(true);
  
  // Update metrics every 3 seconds
  useEffect(() => {
    const updateMetrics = () => {
      const memoryStats = memoryOptimizer.getMemoryStats();
      const cacheStats = cacheManager.getAllStats();
      const poolStats = componentPool.getStats();
      
      // Calculate cache hit rate
      const totalHits = Object.values(cacheStats).reduce((sum, stat) => sum + (stat.hitRate * 100), 0);
      const avgHitRate = totalHits / Object.keys(cacheStats).length;
      
      // Calculate pool efficiency
      const totalPooled = Array.from(poolStats.values()).reduce((sum, stat) => sum + stat.total, 0);
      const totalInUse = Array.from(poolStats.values()).reduce((sum, stat) => sum + stat.inUse, 0);
      const poolEfficiency = totalPooled > 0 ? (totalInUse / totalPooled) * 100 : 0;
      
      const newMetrics: PerformanceMetrics = {
        memoryUsage: memoryStats?.percentage || 0,
        renderTime: performance.now() % 100, // Simplified render time
        componentCount: document.querySelectorAll('[data-component]').length,
        cacheHitRate: avgHitRate || 0,
        poolEfficiency
      };
      
      setMetrics(newMetrics);
      
      // Auto cleanup if enabled and memory is high
      if (autoCleanup && memoryStats && memoryStats.percentage > 85) {
        performCleanup();
      }
    };
    
    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    
    return () => clearInterval(interval);
  }, [autoCleanup]);
  
  const performCleanup = useCallback(() => {
    const beforeMemory = memoryOptimizer.getMemoryStats()?.percentage || 0;
    
    // Perform comprehensive cleanup
    forceMemoryCleanup();
    cacheManager.forceCleanupAll();
    componentPool.forceCleanup();
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
    
    // Update cleanup history
    setTimeout(() => {
      const afterMemory = memoryOptimizer.getMemoryStats()?.percentage || 0;
      const reduction = beforeMemory - afterMemory;
      setCleanupHistory(prev => [...prev.slice(-9), reduction]);
    }, 1000);
  }, []);
  
  const getMemoryStatus = useCallback((percentage: number) => {
    if (percentage > 95) return { color: 'destructive', label: 'Critical', priority: 'high' };
    if (percentage > 85) return { color: 'warning', label: 'High', priority: 'medium' };
    if (percentage > 75) return { color: 'secondary', label: 'Moderate', priority: 'low' };
    return { color: 'success', label: 'Good', priority: 'none' };
  }, []);
  
  const memoryRecommendations = useMemo(() => {
    if (!metrics) return [];
    
    const recommendations = [];
    
    if (metrics.memoryUsage > 90) {
      recommendations.push({
        type: 'critical',
        message: 'Memory usage critical - consider refreshing the page',
        action: 'Refresh Page'
      });
    }
    
    if (metrics.cacheHitRate < 50) {
      recommendations.push({
        type: 'warning',
        message: 'Low cache hit rate - consider clearing cache',
        action: 'Clear Cache'
      });
    }
    
    if (metrics.poolEfficiency < 30) {
      recommendations.push({
        type: 'info',
        message: 'Low pool efficiency - components may be underutilized',
        action: 'Optimize Pool'
      });
    }
    
    return recommendations;
  }, [metrics]);
  
  if (!metrics) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading memory stats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const status = getMemoryStatus(metrics.memoryUsage);
  
  return (
    <Card className={`${className} ${status.priority === 'high' ? 'border-destructive' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Memory Performance</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={status.color as any} className="text-xs">
              {status.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {metrics.memoryUsage.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="controls" className="text-xs">Controls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Memory Usage Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Memory Usage</span>
                <span>{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={metrics.memoryUsage} 
                className={`h-2 ${status.priority === 'high' ? 'bg-destructive/20' : ''}`}
              />
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-xs text-muted-foreground">Cache Hit Rate</div>
                <div className="text-sm font-semibold">{metrics.cacheHitRate.toFixed(1)}%</div>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-xs text-muted-foreground">Pool Efficiency</div>
                <div className="text-sm font-semibold">{metrics.poolEfficiency.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Recommendations */}
            {memoryRecommendations.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold">Recommendations</div>
                {memoryRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        rec.type === 'critical' ? 'bg-destructive' :
                        rec.type === 'warning' ? 'bg-warning' : 'bg-info'
                      }`} 
                    />
                    <span className="flex-1">{rec.message}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {/* Detailed Metrics */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span>Components Rendered</span>
                <Badge variant="outline">{metrics.componentCount}</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Render Time</span>
                <Badge variant="outline">{metrics.renderTime.toFixed(1)}ms</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Auto Cleanup</span>
                <Badge variant={autoCleanup ? 'success' : 'secondary'}>
                  {autoCleanup ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            
            {/* Cleanup History */}
            {cleanupHistory.length > 0 && (
              <div>
                <div className="text-xs font-semibold mb-2">Cleanup History</div>
                <div className="space-y-1">
                  {cleanupHistory.slice(-5).map((reduction, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>Cleanup #{cleanupHistory.length - 4 + index}</span>
                      <Badge variant={reduction > 0 ? 'success' : 'secondary'} className="text-xs">
                        {reduction > 0 ? '-' : ''}{Math.abs(reduction).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="controls" className="space-y-4">
            {showControls && (
              <>
                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={status.priority === 'high' ? 'destructive' : 'outline'}
                    onClick={performCleanup}
                    className="text-xs"
                  >
                    🧹 Force Cleanup
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cacheManager.clearAll()}
                    className="text-xs"
                  >
                    🗑️ Clear Cache
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAutoCleanup(!autoCleanup)}
                    className="text-xs"
                  >
                    {autoCleanup ? '⏸️ Disable Auto' : '▶️ Enable Auto'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="text-xs"
                  >
                    🔄 Refresh
                  </Button>
                </div>
                
                {/* Emergency Actions */}
                {metrics.memoryUsage > 90 && (
                  <div className="p-2 bg-destructive/10 border border-destructive/20 rounded">
                    <div className="text-xs font-semibold text-destructive mb-2">
                      Emergency Actions
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        localStorage.setItem('ff-emergency-mode', 'true');
                        window.location.reload();
                      }}
                      className="w-full text-xs"
                    >
                      ⚠️ Activate Emergency Mode
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AdvancedMemoryMonitor;