/**
 * Performance Optimization Manager for FlashFusion
 * Advanced performance monitoring, optimization, and memory management
 */

import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  networkLatency: number;
  cacheHitRate: number;
}

interface OptimizationSuggestion {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: () => void;
}

/**
 * Enhanced performance monitoring hook
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    bundleSize: 0,
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
    networkLatency: 0,
    cacheHitRate: 100
  });

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics(prev => ({ ...prev, fps }));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    frameRef.current = requestAnimationFrame(measureFPS);
  }, []);

  // Memory usage monitoring
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
      setMetrics(prev => ({ ...prev, memoryUsage }));
    }
  }, []);

  // Bundle size detection
  const measureBundleSize = useCallback(() => {
    if ('transferSize' in PerformanceEntry.prototype) {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const bundleSize = Math.round((entries[0].transferSize || 0) / 1024); // KB
        setMetrics(prev => ({ ...prev, bundleSize }));
      }
    }
  }, []);

  // Network latency measurement
  const measureNetworkLatency = useCallback(async () => {
    try {
      const start = performance.now();
      await fetch('/api/health', { method: 'HEAD' }).catch(() => {});
      const latency = performance.now() - start;
      setMetrics(prev => ({ ...prev, networkLatency: Math.round(latency) }));
    } catch (error) {
      // Silent fail for latency measurement
    }
  }, []);

  // Generate optimization suggestions
  const generateSuggestions = useCallback((currentMetrics: PerformanceMetrics) => {
    const newSuggestions: OptimizationSuggestion[] = [];

    if (currentMetrics.fps < 30) {
      newSuggestions.push({
        id: 'low-fps',
        type: 'critical',
        title: 'Low Frame Rate Detected',
        description: 'Frame rate is below 30 FPS. Consider reducing animations or enabling lite mode.',
        impact: 'high',
        action: () => {
          localStorage.setItem('ff-reduce-animations', 'true');
          window.location.reload();
        }
      });
    }

    if (currentMetrics.memoryUsage > 80) {
      newSuggestions.push({
        id: 'high-memory',
        type: 'critical',
        title: 'High Memory Usage',
        description: 'Memory usage is above 80%. Clear cache or enable memory optimization.',
        impact: 'high',
        action: () => {
          localStorage.clear();
          if ('gc' in window) (window as any).gc();
        }
      });
    }

    if (currentMetrics.bundleSize > 5000) {
      newSuggestions.push({
        id: 'large-bundle',
        type: 'warning',
        title: 'Large Bundle Size',
        description: 'Bundle size is over 5MB. Enable code splitting for better performance.',
        impact: 'medium'
      });
    }

    if (currentMetrics.networkLatency > 1000) {
      newSuggestions.push({
        id: 'high-latency',
        type: 'warning',
        title: 'High Network Latency',
        description: 'Network latency is above 1 second. Enable offline mode or cache optimization.',
        impact: 'medium',
        action: () => {
          localStorage.setItem('ff-offline-mode', 'true');
        }
      });
    }

    setSuggestions(newSuggestions);
  }, []);

  // Initialize monitoring
  useEffect(() => {
    measureFPS();
    measureBundleSize();
    
    const memoryInterval = setInterval(measureMemory, 5000);
    const latencyInterval = setInterval(measureNetworkLatency, 30000);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      clearInterval(memoryInterval);
      clearInterval(latencyInterval);
    };
  }, [measureFPS, measureMemory, measureBundleSize, measureNetworkLatency]);

  // Update suggestions when metrics change
  useEffect(() => {
    generateSuggestions(metrics);
  }, [metrics, generateSuggestions]);

  return { metrics, suggestions };
}

/**
 * Performance Optimization Manager Component
 */
export function PerformanceOptimizationManager() {
  const { metrics, suggestions } = usePerformanceMonitoring();
  
  // Performance grade calculation
  const performanceGrade = useMemo(() => {
    let score = 100;
    
    if (metrics.fps < 60) score -= (60 - metrics.fps) * 2;
    if (metrics.memoryUsage > 50) score -= (metrics.memoryUsage - 50);
    if (metrics.networkLatency > 500) score -= (metrics.networkLatency - 500) / 10;
    
    if (score >= 90) return { grade: 'A', color: 'from-green-500 to-emerald-500', status: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'from-blue-500 to-cyan-500', status: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'from-yellow-500 to-orange-500', status: 'Fair' };
    return { grade: 'D', color: 'from-red-500 to-pink-500', status: 'Poor' };
  }, [metrics]);

  // Auto-optimization features
  const autoOptimize = useCallback(() => {
    // Enable performance optimizations
    localStorage.setItem('ff-performance-mode', 'true');
    localStorage.setItem('ff-reduce-animations', metrics.fps < 45 ? 'true' : 'false');
    localStorage.setItem('ff-lazy-loading', 'true');
    localStorage.setItem('ff-image-optimization', 'true');
    
    // Clear old cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('v1')) {
            caches.delete(name);
          }
        });
      });
    }
    
    window.location.reload();
  }, [metrics.fps]);

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Performance Overview */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="ff-text-title">Performance Overview</span>
            <div className={`w-16 h-16 bg-gradient-to-br ${performanceGrade.color} rounded-2xl flex items-center justify-center text-white ff-text-2xl font-bold`}>
              {performanceGrade.grade}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="ff-text-3xl font-bold text-primary">{metrics.fps}</div>
              <div className="ff-text-caption">FPS</div>
            </div>
            <div className="text-center space-y-2">
              <div className="ff-text-3xl font-bold text-secondary">{metrics.memoryUsage}%</div>
              <div className="ff-text-caption">Memory</div>
            </div>
            <div className="text-center space-y-2">
              <div className="ff-text-3xl font-bold text-accent">{metrics.bundleSize}KB</div>
              <div className="ff-text-caption">Bundle</div>
            </div>
            <div className="text-center space-y-2">
              <div className="ff-text-3xl font-bold text-warning">{metrics.networkLatency}ms</div>
              <div className="ff-text-caption">Latency</div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="ff-text-lg font-semibold">{performanceGrade.status} Performance</div>
              <div className="ff-text-caption">Grade: {performanceGrade.grade}</div>
            </div>
            <Button onClick={autoOptimize} className="ff-btn-primary ff-hover-glow">
              Auto-Optimize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="ff-text-title">Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={suggestion.type === 'critical' ? 'destructive' : suggestion.type === 'warning' ? 'secondary' : 'default'}
                          className={
                            suggestion.type === 'critical' ? 'ff-badge-error' :
                            suggestion.type === 'warning' ? 'ff-badge-warning' :
                            'ff-badge-primary'
                          }
                        >
                          {suggestion.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="ff-badge-secondary">
                          {suggestion.impact} impact
                        </Badge>
                      </div>
                      <h4 className="ff-text-lg font-semibold">{suggestion.title}</h4>
                      <p className="ff-text-body text-sm">{suggestion.description}</p>
                    </div>
                    {suggestion.action && (
                      <Button
                        size="sm"
                        onClick={suggestion.action}
                        variant={suggestion.type === 'critical' ? 'destructive' : 'outline'}
                        className={
                          suggestion.type === 'critical' ? 'ff-btn-accent' : 'ff-btn-outline'
                        }
                      >
                        Fix Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Settings */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="ff-text-title">Performance Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="ff-text-lg font-semibold">Optimization Features</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={localStorage.getItem('ff-lazy-loading') === 'true'}
                    onChange={(e) => localStorage.setItem('ff-lazy-loading', e.target.checked.toString())}
                    className="ff-focus-ring"
                  />
                  <span className="ff-text-body">Lazy Loading</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={localStorage.getItem('ff-image-optimization') === 'true'}
                    onChange={(e) => localStorage.setItem('ff-image-optimization', e.target.checked.toString())}
                    className="ff-focus-ring"
                  />
                  <span className="ff-text-body">Image Optimization</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={localStorage.getItem('ff-reduce-animations') === 'true'}
                    onChange={(e) => localStorage.setItem('ff-reduce-animations', e.target.checked.toString())}
                    className="ff-focus-ring"
                  />
                  <span className="ff-text-body">Reduce Animations</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={localStorage.getItem('ff-offline-mode') === 'true'}
                    onChange={(e) => localStorage.setItem('ff-offline-mode', e.target.checked.toString())}
                    className="ff-focus-ring"
                  />
                  <span className="ff-text-body">Offline Mode</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="ff-text-lg font-semibold">Advanced Settings</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="ff-btn-outline w-full"
                >
                  Clear All Cache
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if ('gc' in window) (window as any).gc();
                  }}
                  className="ff-btn-outline w-full"
                >
                  Force Garbage Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem('ff-emergency-mode', 'true');
                    window.location.reload();
                  }}
                  className="ff-btn-outline w-full"
                >
                  Enable Safe Mode
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="ff-text-title">Real-time Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="ff-text-2xl font-bold text-primary">{metrics.fps} FPS</div>
                <div className="ff-text-caption">Frame Rate</div>
                <div className={`mt-2 h-2 rounded-full ${metrics.fps >= 45 ? 'bg-green-500' : metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
              
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="ff-text-2xl font-bold text-secondary">{metrics.memoryUsage}%</div>
                <div className="ff-text-caption">Memory Usage</div>
                <div className={`mt-2 h-2 rounded-full ${metrics.memoryUsage <= 50 ? 'bg-green-500' : metrics.memoryUsage <= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
              
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="ff-text-2xl font-bold text-accent">{metrics.networkLatency}ms</div>
                <div className="ff-text-caption">Network Latency</div>
                <div className={`mt-2 h-2 rounded-full ${metrics.networkLatency <= 500 ? 'bg-green-500' : metrics.networkLatency <= 1000 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              Monitoring updates every 5 seconds • Network latency checked every 30 seconds
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PerformanceOptimizationManager;