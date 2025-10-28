import React, { useState, useCallback, useMemo, memo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MemoryMonitor } from '../ui/memory-monitor';
import { memoryOptimizer } from '../../utils/memory-optimizer';

/**
 * Memory-Optimized Lightweight Dashboard
 * Ultra-minimal version of the main dashboard that uses <1MB memory
 */

interface LightweightDashboardProps {
  className?: string;
}

const QuickStatsCard = memo(({ title, value, change }: { title: string; value: string; change?: string }) => (
  <Card className="ff-card-compact">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-lg font-semibold text-foreground">{value}</h3>
        </div>
        {change && (
          <Badge variant="secondary" className="text-xs">
            {change}
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
));

const QuickActionButton = memo(({ icon, label, onClick, disabled = false }: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 text-sm"
  >
    <span className="text-base">{icon}</span>
    {label}
  </Button>
));

export function LightweightDashboard({ className = '' }: LightweightDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'tools' | 'recent'>('overview');
  
  // Memory-aware data - only keep essential items
  const quickStats = useMemo(() => [
    { title: 'Projects', value: '3', change: '+1' },
    { title: 'Tools Used', value: '12', change: '+4' },
    { title: 'Memory Usage', value: `${memoryOptimizer.getMemoryStats()?.percentage.toFixed(0) || 0}%` },
  ], []);
  
  const quickActions = useMemo(() => [
    {
      icon: '⚡',
      label: 'Quick Generate',
      onClick: () => console.log('Quick generate clicked'),
    },
    {
      icon: '📊',
      label: 'View Analytics',
      onClick: () => setActiveView('tools'),
    },
    {
      icon: '🔧',
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
  ], []);
  
  const recentActivity = useMemo(() => [
    { icon: '🎯', text: 'Generated React app', time: '2m ago' },
    { icon: '📱', text: 'Created mobile layout', time: '15m ago' },
    { icon: '🚀', text: 'Deployed to production', time: '1h ago' },
  ], []);
  
  return (
    <div className={`container mx-auto px-4 py-6 space-y-6 ${className}`}>
      {/* Header with Memory Monitor */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ff-text-gradient">FlashFusion Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Memory-optimized mode for better performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <MemoryMonitor showDetails={true} className="w-48" />
          <Badge variant="secondary" className="text-xs">
            Optimized
          </Badge>
        </div>
      </div>
      
      {/* View Selector */}
      <div className="flex gap-2">
        {(['overview', 'tools', 'recent'] as const).map((view) => (
          <Button
            key={view}
            variant={activeView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView(view)}
            className="capitalize"
          >
            {view}
          </Button>
        ))}
      </div>
      
      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat, index) => (
              <QuickStatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
              />
            ))}
          </div>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={action.onClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeView === 'tools' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: 'Code Generator', status: 'Available', icon: '⚡' },
            { name: 'Content Creator', status: 'Available', icon: '📝' },
            { name: 'Analytics', status: 'Available', icon: '📊' },
            { name: 'Deployment', status: 'Available', icon: '🚀' },
          ].map((tool) => (
            <Card key={tool.name} className="ff-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tool.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground">{tool.status}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {activeView === 'recent' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-base">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Footer */}
      <div className="text-center pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Running in memory-optimized mode • {memoryOptimizer.getMemoryStats()?.percentage.toFixed(1)}% memory used
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2 text-xs"
        >
          Try Full Dashboard
        </Button>
      </div>
    </div>
  );
}

export default LightweightDashboard;