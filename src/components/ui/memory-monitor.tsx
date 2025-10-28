import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { memoryOptimizer, forceMemoryCleanup } from '../../utils/memory-optimizer';

interface MemoryMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export function MemoryMonitor({ className = '', showDetails = false }: MemoryMonitorProps) {
  const [memoryStats, setMemoryStats] = useState<any>(null);
  const [cleanupCount, setCleanupCount] = useState(0);
  
  useEffect(() => {
    const updateMemoryStats = () => {
      const stats = memoryOptimizer.getMemoryStats();
      setMemoryStats(stats);
    };
    
    // Update immediately
    updateMemoryStats();
    
    // Update every 5 seconds
    const interval = setInterval(updateMemoryStats, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCleanup = async () => {
    forceMemoryCleanup();
    setCleanupCount(prev => prev + 1);
    
    // Update stats after cleanup
    setTimeout(() => {
      const stats = memoryOptimizer.getMemoryStats();
      setMemoryStats(stats);
    }, 1000);
  };
  
  if (!memoryStats) return null;
  
  const getMemoryStatus = (percentage: number) => {
    if (percentage > 95) return { color: 'destructive', label: 'Critical' };
    if (percentage > 85) return { color: 'warning', label: 'High' };
    if (percentage > 75) return { color: 'secondary', label: 'Moderate' };
    return { color: 'success', label: 'Good' };
  };
  
  const status = getMemoryStatus(memoryStats.percentage);
  
  return (
    <Card className={`${className} ${memoryStats.percentage > 90 ? 'border-destructive' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={status.color as any} className="text-xs">
                {status.label}
              </Badge>
              <span className="text-sm font-mono">
                {memoryStats.percentage.toFixed(1)}%
              </span>
            </div>
            
            {showDetails && (
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Used: {(memoryStats.used / 1024 / 1024).toFixed(1)} MB</div>
                <div>Total: {(memoryStats.total / 1024 / 1024).toFixed(1)} MB</div>
                {cleanupCount > 0 && (
                  <div>Cleanups: {cleanupCount}</div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button
              size="sm"
              variant={memoryStats.percentage > 85 ? 'destructive' : 'outline'}
              onClick={handleCleanup}
              className="text-xs"
            >
              🧹 Clean
            </Button>
            
            {memoryStats.percentage > 95 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="text-xs w-full"
              >
                🔄 Refresh
              </Button>
            )}
          </div>
        </div>
        
        {/* Memory usage bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                memoryStats.percentage > 95 
                  ? 'bg-destructive' 
                  : memoryStats.percentage > 85 
                    ? 'bg-warning'
                    : memoryStats.percentage > 75
                      ? 'bg-secondary'
                      : 'bg-success'
              }`}
              style={{ width: `${Math.min(memoryStats.percentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MemoryMonitor;