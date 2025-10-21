/**
 * @fileoverview FlashFusion Performance Monitor Component
 * @chunk core
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Development-only performance monitoring display with FlashFusion design system.
 */

import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Activity, Clock, HardDrive, Zap } from 'lucide-react';

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  initTime: number;
  memoryUsage: number;
  renderTime: number;
}

/**
 * Performance monitor props interface
 */
interface PerformanceMonitorProps {
  /** Current app mode */
  mode: string;
  /** Performance metrics data */
  metrics: PerformanceMetrics;
  /** Additional system info */
  systemInfo?: {
    connection?: string;
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
}

/**
 * FlashFusion Performance Monitor Component
 * 
 * Development-only overlay showing real-time performance metrics.
 * Helps developers monitor system resource usage and initialization times.
 * 
 * @param props - Performance monitor configuration
 * @returns Performance monitor JSX (null in production)
 */
export function PerformanceMonitor({ 
  mode, 
  metrics, 
  systemInfo = {} 
}: PerformanceMonitorProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'var(--ff-success)';
    if (value <= thresholds.warning) return 'var(--ff-warning)';
    return 'var(--ff-error)';
  };

  const initTimeColor = getPerformanceColor(metrics.initTime, { good: 1000, warning: 3000 });
  const memoryColor = getPerformanceColor(metrics.memoryUsage, { good: 50, warning: 100 });

  return (
    <div className="fixed bottom-4 right-4 z-50 ff-fade-in-up" style={{ animationDelay: '500ms' }}>
      <Card className="ff-card bg-[var(--ff-surface)]/95 backdrop-blur-sm border-[var(--border)] shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[var(--ff-primary)]" />
            <span className="ff-text-xs font-semibold text-[var(--ff-text-primary)]">
              FlashFusion Performance
            </span>
            <Badge 
              className="ff-badge-primary text-[10px] px-1.5 py-0.5"
              style={{ 
                backgroundColor: `${mode === 'full' ? 'var(--ff-success)' : mode === 'lite' ? 'var(--ff-warning)' : 'var(--ff-error)'}/20`,
                color: mode === 'full' ? 'var(--ff-success)' : mode === 'lite' ? 'var(--ff-warning)' : 'var(--ff-error)',
                border: `1px solid ${mode === 'full' ? 'var(--ff-success)' : mode === 'lite' ? 'var(--ff-warning)' : 'var(--ff-error)'}/30`
              }}
            >
              {mode}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {/* Initialization Time */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" style={{ color: initTimeColor }} />
                <span className="text-[var(--ff-text-secondary)]">Init:</span>
              </div>
              <span 
                className="font-medium tabular-nums" 
                style={{ color: initTimeColor }}
              >
                {metrics.initTime.toFixed(0)}ms
              </span>
            </div>

            {/* Memory Usage */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3 h-3" style={{ color: memoryColor }} />
                <span className="text-[var(--ff-text-secondary)]">Memory:</span>
              </div>
              <span 
                className="font-medium tabular-nums" 
                style={{ color: memoryColor }}
              >
                {metrics.memoryUsage}MB
              </span>
            </div>

            {/* Render Time */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[var(--ff-secondary)]" />
                <span className="text-[var(--ff-text-secondary)]">Render:</span>
              </div>
              <span className="font-medium tabular-nums text-[var(--ff-secondary)]">
                {metrics.renderTime.toFixed(0)}ms
              </span>
            </div>

            {/* System Information */}
            {Object.keys(systemInfo).length > 0 && (
              <>
                <div className="border-t border-[var(--border)] my-2 pt-2">
                  <div className="ff-text-xs font-medium text-[var(--ff-text-muted)] mb-1">
                    System Info
                  </div>
                </div>
                
                {systemInfo.connection && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ff-text-muted)]">Connection:</span>
                    <span className="font-medium text-[var(--ff-text-secondary)] uppercase">
                      {systemInfo.connection}
                    </span>
                  </div>
                )}
                
                {systemInfo.deviceMemory && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ff-text-muted)]">Device RAM:</span>
                    <span className="font-medium text-[var(--ff-text-secondary)]">
                      {systemInfo.deviceMemory}GB
                    </span>
                  </div>
                )}
                
                {systemInfo.hardwareConcurrency && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ff-text-muted)]">CPU Cores:</span>
                    <span className="font-medium text-[var(--ff-text-secondary)]">
                      {systemInfo.hardwareConcurrency}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Performance Indicator */}
          <div className="mt-3 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: metrics.initTime < 1000 && metrics.memoryUsage < 50 
                    ? 'var(--ff-success)' 
                    : metrics.initTime < 3000 && metrics.memoryUsage < 100
                      ? 'var(--ff-warning)'
                      : 'var(--ff-error)'
                }}
              />
              <span className="ff-text-xs text-[var(--ff-text-muted)]">
                {metrics.initTime < 1000 && metrics.memoryUsage < 50 
                  ? 'Optimal Performance'
                  : metrics.initTime < 3000 && metrics.memoryUsage < 100
                    ? 'Good Performance'
                    : 'Performance Issues'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}