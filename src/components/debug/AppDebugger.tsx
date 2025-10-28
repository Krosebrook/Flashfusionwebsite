/**
 * @fileoverview FlashFusion App Debugger Component
 * @chunk debug
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Development-only debugging component for monitoring App.tsx state,
 * performance metrics, and system information. Provides real-time
 * insights into application behavior and potential issues.
 * 
 * Features:
 * - Real-time app state monitoring
 * - Performance metrics tracking
 * - System capability detection
 * - Error boundary monitoring
 * - Route detection debugging
 * - Memory usage tracking
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Activity, 
  Bug, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  MemoryStick,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  EyeOff,
  RefreshCw,
  Gauge,
  BarChart3,
  Code2,
  Globe,
  Smartphone
} from 'lucide-react';

/**
 * App state for debugging
 */
interface DebugAppState {
  mode: 'full' | 'lite' | 'emergency';
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  isRecovering: boolean;
}

/**
 * Performance metrics for debugging
 */
interface DebugPerformanceMetrics {
  initTime: number;
  memoryUsage: number;
  renderTime: number;
  loadTime: number;
}

/**
 * System information for debugging
 */
interface DebugSystemInfo {
  connection?: string;
  deviceMemory?: number;
  hardwareConcurrency: number;
  userAgent: string;
  platform: string;
}

/**
 * Props for AppDebugger component
 */
interface AppDebuggerProps {
  /** Current app state */
  appState: DebugAppState;
  /** Performance metrics */
  performanceMetrics: DebugPerformanceMetrics;
  /** System information */
  systemInfo: DebugSystemInfo;
  /** Whether app interface is shown */
  showAppInterface: boolean;
  /** Route detection patterns */
  routePatterns: readonly string[];
  /** Error recovery handler */
  onRetry?: () => void;
}

/**
 * FlashFusion App Debugger Component
 * 
 * Only renders in development environment to provide debugging
 * insights without affecting production performance.
 */
export function AppDebugger({
  appState,
  performanceMetrics,
  systemInfo,
  showAppInterface,
  routePatterns,
  onRetry
}: AppDebuggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Memory status calculation
  const memoryStatus = useMemo(() => {
    const usage = performanceMetrics.memoryUsage;
    if (usage > 100) return { status: 'critical', color: 'var(--ff-error)' };
    if (usage > 50) return { status: 'warning', color: 'var(--ff-warning)' };
    return { status: 'good', color: 'var(--ff-success)' };
  }, [performanceMetrics.memoryUsage]);

  // Performance grade calculation
  const performanceGrade = useMemo(() => {
    const initTime = performanceMetrics.initTime;
    if (initTime < 500) return { grade: 'A', color: 'var(--ff-success)' };
    if (initTime < 1000) return { grade: 'B', color: 'var(--ff-warning)' };
    if (initTime < 2000) return { grade: 'C', color: 'var(--ff-accent)' };
    return { grade: 'D', color: 'var(--ff-error)' };
  }, [performanceMetrics.initTime]);

  // Route detection status
  const routeDetection = useMemo(() => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const matchedPatterns = routePatterns.filter(pattern => 
      currentSearch.includes(pattern) || currentPath.startsWith(pattern.replace('?', ''))
    );
    
    return {
      matched: matchedPatterns,
      total: routePatterns.length,
      hasMatch: matchedPatterns.length > 0
    };
  }, [routePatterns, refreshCount]);

  // System capabilities assessment
  const systemCapabilities = useMemo(() => {
    const capabilities = [];
    
    if (systemInfo.deviceMemory && systemInfo.deviceMemory >= 4) {
      capabilities.push({ name: 'High Memory', status: 'good' });
    } else if (systemInfo.deviceMemory && systemInfo.deviceMemory >= 2) {
      capabilities.push({ name: 'Medium Memory', status: 'warning' });
    } else {
      capabilities.push({ name: 'Low Memory', status: 'critical' });
    }
    
    if (systemInfo.hardwareConcurrency >= 8) {
      capabilities.push({ name: 'High CPU', status: 'good' });
    } else if (systemInfo.hardwareConcurrency >= 4) {
      capabilities.push({ name: 'Medium CPU', status: 'warning' });
    } else {
      capabilities.push({ name: 'Low CPU', status: 'critical' });
    }
    
    if (systemInfo.connection === '4g' || systemInfo.connection === '5g') {
      capabilities.push({ name: 'Fast Network', status: 'good' });
    } else if (systemInfo.connection === '3g') {
      capabilities.push({ name: 'Slow Network', status: 'warning' });
    } else {
      capabilities.push({ name: 'Unknown Network', status: 'warning' });
    }
    
    return capabilities;
  }, [systemInfo]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="ff-btn-primary shadow-lg"
          size="sm"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="ff-card border-[var(--ff-primary)]/20 bg-[var(--ff-bg-dark)]/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="ff-text-sm flex items-center gap-2">
              <Bug className="w-4 h-4 text-[var(--ff-primary)]" />
              FlashFusion App Debugger
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
                className={autoRefresh ? 'ff-btn-success' : 'ff-btn-outline'}
              >
                <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                className="ff-btn-outline"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {/* App State Section */}
          <div className="space-y-2">
            <h4 className="ff-text-xs" style={{ fontWeight: 'var(--ff-weight-semibold)', color: 'var(--ff-text-primary)' }}>
              App State
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)]">Mode:</span>
                <Badge className={`ff-badge-${appState.mode === 'full' ? 'success' : appState.mode === 'lite' ? 'warning' : 'error'}`}>
                  {appState.mode}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)]">Loading:</span>
                {appState.isLoading ? (
                  <Clock className="w-3 h-3 text-[var(--ff-warning)] animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-[var(--ff-success)]" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)]">Interface:</span>
                {showAppInterface ? (
                  <Monitor className="w-3 h-3 text-[var(--ff-success)]" />
                ) : (
                  <Globe className="w-3 h-3 text-[var(--ff-secondary)]" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)]">Retries:</span>
                <span className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  {appState.retryCount}
                </span>
              </div>
            </div>
            
            {appState.error && (
              <div className="p-2 bg-[var(--ff-error)]/10 border border-[var(--ff-error)]/20 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <XCircle className="w-3 h-3 text-[var(--ff-error)]" />
                  <span className="text-[var(--ff-error)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>Error:</span>
                </div>
                <p className="text-[var(--ff-text-muted)]">{appState.error}</p>
                {onRetry && (
                  <Button onClick={onRetry} size="sm" className="ff-btn-error mt-2">
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="space-y-2">
            <h4 className="ff-text-xs" style={{ fontWeight: 'var(--ff-weight-semibold)', color: 'var(--ff-text-primary)' }}>
              Performance Metrics
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)] text-xs">Init Time:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: performanceGrade.color, fontWeight: 'var(--ff-weight-semibold)' }}>
                    {performanceMetrics.initTime.toFixed(0)}ms
                  </span>
                  <Badge className="text-xs px-1" style={{ backgroundColor: performanceGrade.color + '20', color: performanceGrade.color }}>
                    {performanceGrade.grade}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[var(--ff-text-muted)] text-xs">Memory:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    {performanceMetrics.memoryUsage}MB
                  </span>
                  <MemoryStick className="w-3 h-3" style={{ color: memoryStatus.color }} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--ff-text-muted)]">Memory Usage</span>
                  <span className="text-[var(--ff-text-primary)]">{Math.min(performanceMetrics.memoryUsage, 100)}%</span>
                </div>
                <Progress 
                  value={Math.min(performanceMetrics.memoryUsage, 100)} 
                  className="h-1"
                />
              </div>
            </div>
          </div>

          {/* Route Detection */}
          <div className="space-y-2">
            <h4 className="ff-text-xs" style={{ fontWeight: 'var(--ff-weight-semibold)', color: 'var(--ff-text-primary)' }}>
              Route Detection
            </h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--ff-text-muted)]">Current Path:</span>
                <code className="text-[var(--ff-primary)] text-xs bg-[var(--ff-surface)] px-1 rounded">
                  {window.location.pathname}
                </code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--ff-text-muted)]">Query Params:</span>
                <code className="text-[var(--ff-secondary)] text-xs bg-[var(--ff-surface)] px-1 rounded">
                  {window.location.search || 'none'}
                </code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--ff-text-muted)]">Matched Patterns:</span>
                <Badge className={`ff-badge-${routeDetection.hasMatch ? 'success' : 'secondary'} text-xs`}>
                  {routeDetection.matched.length}/{routeDetection.total}
                </Badge>
              </div>
              {routeDetection.matched.length > 0 && (
                <div className="text-xs">
                  <span className="text-[var(--ff-text-muted)]">Matches:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {routeDetection.matched.map((pattern, index) => (
                      <code key={index} className="text-[var(--ff-success)] bg-[var(--ff-success)]/10 px-1 rounded text-xs">
                        {pattern}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Capabilities */}
          <div className="space-y-2">
            <h4 className="ff-text-xs" style={{ fontWeight: 'var(--ff-weight-semibold)', color: 'var(--ff-text-primary)' }}>
              System Capabilities
            </h4>
            <div className="space-y-1">
              {systemCapabilities.map((capability, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--ff-text-muted)]">{capability.name}:</span>
                  <Badge className={`ff-badge-${capability.status === 'good' ? 'success' : capability.status === 'warning' ? 'warning' : 'error'} text-xs`}>
                    {capability.status}
                  </Badge>
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className="text-center p-1 bg-[var(--ff-surface)] rounded">
                  <Cpu className="w-3 h-3 mx-auto mb-1 text-[var(--ff-primary)]" />
                  <div className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    {systemInfo.hardwareConcurrency}
                  </div>
                  <div className="text-[var(--ff-text-muted)]">Cores</div>
                </div>
                
                <div className="text-center p-1 bg-[var(--ff-surface)] rounded">
                  <HardDrive className="w-3 h-3 mx-auto mb-1 text-[var(--ff-secondary)]" />
                  <div className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    {systemInfo.deviceMemory || '?'}GB
                  </div>
                  <div className="text-[var(--ff-text-muted)]">RAM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Actions */}
          <div className="pt-2 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--ff-text-muted)]">
                Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
              </span>
              <span className="text-[var(--ff-text-muted)]">
                Updates: {refreshCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppDebugger;