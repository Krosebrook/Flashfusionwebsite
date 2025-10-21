import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { memoryOptimizer } from '../../utils/memory-optimizer';
import { shouldLoadComponent } from '../../utils/bundle-analyzer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

/**
 * Memory-Aware Page Router
 * Loads components based on available memory
 */

interface MemoryAwarePageRouterProps {
  currentPage: string;
  isAuthenticated: boolean;
  onPageChange: (page: string) => void;
}

// Lightweight fallback components for high memory situations
const LightweightDashboard = React.lazy(() => 
  Promise.resolve({
    default: () => (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>FlashFusion Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dashboard is running in memory-optimized mode.</p>
            <Button onClick={() => window.location.reload()}>
              Try Full Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  })
);

const LightweightTools = React.lazy(() => 
  Promise.resolve({
    default: () => (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Development Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Tools are available in memory-optimized mode.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {['Code Generator', 'Content Creator', 'Analytics'].map((tool) => (
                <Card key={tool} className="p-4">
                  <h3 className="font-semibold">{tool}</h3>
                  <p className="text-sm text-muted-foreground">Available in full mode</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  })
);

// Heavy components with lazy loading
const getPageComponent = (page: string, memoryUsage: number) => {
  // If memory is critical (>90%), use lightweight components
  if (memoryUsage > 90) {
    switch (page) {
      case 'dashboard': return LightweightDashboard;
      case 'tools': return LightweightTools;
      default: return LightweightDashboard;
    }
  }
  
  // If memory is high (75-90%), load medium priority components
  if (memoryUsage > 75) {
    switch (page) {
      case 'dashboard':
        return lazy(() => import('../pages/DashboardPage').catch(() => 
          Promise.resolve({ default: LightweightDashboard })
        ));
      case 'tools':
        return lazy(() => import('../pages/ToolsPage').catch(() =>
          Promise.resolve({ default: LightweightTools })
        ));
      case 'analytics':
        return lazy(() => import('../pages/AnalyticsPage').catch(() =>
          Promise.resolve({ default: LightweightDashboard })
        ));
      default:
        return lazy(() => import('../pages/HomePage').catch(() =>
          Promise.resolve({ default: LightweightDashboard })
        ));
    }
  }
  
  // Normal memory usage - load all components
  switch (page) {
    case 'home':
      return lazy(() => import('../pages/HomePage'));
    case 'dashboard':
      return lazy(() => import('../pages/DashboardPage'));
    case 'tools':
      return lazy(() => import('../pages/ToolsPage'));
    case 'analytics':
      return lazy(() => import('../pages/AnalyticsPage'));
    case 'multi-agent-orchestration':
      return lazy(() => import('../pages/MultiAgentOrchestrationPage'));
    case 'creator-content-pipeline':
      return lazy(() => import('../pages/CreatorContentPipelinePage'));
    case 'code-generator':
      return lazy(() => import('../tools/generation/FullStackAppBuilder'));
    case 'collaboration':
      return lazy(() => import('../pages/CollaborationPage'));
    case 'deployments':
      return lazy(() => import('../pages/DeploymentsPage'));
    case 'projects':
      return lazy(() => import('../pages/ProjectsPage'));
    case 'settings':
      return lazy(() => import('../pages/SettingsPage'));
    case 'integrations':
      return lazy(() => import('../pages/IntegrationsPage'));
    case 'security':
      return lazy(() => import('../pages/SecurityPage'));
    case 'about':
      return lazy(() => import('../pages/AboutPage'));
    case 'pricing':
      return lazy(() => import('../pages/PricingPage'));
    case 'features':
      return lazy(() => import('../pages/FeaturesPage'));
    default:
      return lazy(() => import('../pages/NotFoundPage'));
  }
};

const MemoryOptimizedLoader = ({ memoryUsage }: { memoryUsage: number }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h3 className="font-semibold">Loading FlashFusion</h3>
            <p className="text-sm text-muted-foreground">
              Memory usage: {memoryUsage.toFixed(1)}%
            </p>
            {memoryUsage > 85 && (
              <p className="text-xs text-warning mt-1">
                Optimizing for memory efficiency...
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export function MemoryAwarePageRouter({ 
  currentPage, 
  isAuthenticated, 
  onPageChange 
}: MemoryAwarePageRouterProps) {
  const memoryStats = memoryOptimizer.getMemoryStats();
  const memoryUsage = memoryStats?.percentage || 0;
  
  const PageComponent = useMemo(() => {
    return getPageComponent(currentPage, memoryUsage);
  }, [currentPage, memoryUsage]);
  
  const handleComponentError = useCallback(() => {
    console.warn(`Component failed to load for page: ${currentPage}, falling back to lightweight version`);
    return LightweightDashboard;
  }, [currentPage]);
  
  return (
    <Suspense fallback={<MemoryOptimizedLoader memoryUsage={memoryUsage} />}>
      <PageComponent />
    </Suspense>
  );
}

export default MemoryAwarePageRouter;