import React, { Suspense, lazy, ComponentType } from 'react';
import { ComponentErrorBoundary } from '../ui/error-boundary-enhanced';
import { FullPageLoader } from '../ui/loading-states';
import { errorService } from '../../services/ErrorService';

interface LazyComponentLoaderProps {
  importFn: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  retryable?: boolean;
  loadingMessage?: string;
  componentName?: string;
}

interface LazyComponentState {
  hasError: boolean;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function createLazyComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: Omit<LazyComponentLoaderProps, 'importFn'> = {}
) {
  const LazyComponent = lazy(() => {
    return importFn().catch((error) => {
      // Handle chunk loading errors
      const appError = errorService.createError(
        'component',
        `Failed to load component: ${options.componentName || 'Unknown'}`,
        {
          details: error.message,
          code: 'COMPONENT_LOAD_FAILURE',
          context: { componentName: options.componentName }
        }
      );
      
      errorService.handleError(appError);
      throw error;
    });
  });

  return React.forwardRef<any, T>((props, ref) => (
    <LazyComponentLoader
      {...options}
      importFn={importFn}
    >
      <LazyComponent {...props} ref={ref} />
    </LazyComponentLoader>
  ));
}

class LazyComponentLoader extends React.Component<
  LazyComponentLoaderProps & { children: React.ReactNode },
  LazyComponentState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: LazyComponentLoaderProps & { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(): Partial<LazyComponentState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName } = this.props;
    
    errorService.handleError(
      errorService.createError(
        'component',
        `Lazy component crash: ${componentName || 'Unknown'}`,
        {
          details: errorInfo.componentStack,
          code: 'LAZY_COMPONENT_CRASH',
          context: { componentName, retryCount: this.state.retryCount }
        }
      )
    );
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < MAX_RETRIES) {
      this.setState(prevState => ({
        hasError: false,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleRetryWithDelay = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, RETRY_DELAY * (this.state.retryCount + 1));
  };

  render() {
    const { 
      children, 
      fallback, 
      errorFallback, 
      retryable = true, 
      loadingMessage = 'Loading component...',
      componentName 
    } = this.props;
    const { hasError, retryCount } = this.state;

    if (hasError) {
      if (errorFallback) {
        return errorFallback;
      }

      return (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-destructive">⚠️</span>
              <div>
                <p className="font-medium text-destructive">
                  Failed to load {componentName || 'component'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Attempt {retryCount + 1} of {MAX_RETRIES + 1}
                </p>
              </div>
            </div>
            
            {retryable && retryCount < MAX_RETRIES && (
              <div className="flex gap-2">
                <button
                  onClick={this.handleRetry}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={this.handleRetryWithDelay}
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-accent transition-colors"
                >
                  Retry in {RETRY_DELAY * (retryCount + 1)}ms
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <ComponentErrorBoundary>
        <Suspense 
          fallback={
            fallback || (
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <FullPageLoader message={loadingMessage} />
                  {componentName && (
                    <p className="text-sm text-muted-foreground">
                      Loading {componentName}...
                    </p>
                  )}
                </div>
              </div>
            )
          }
        >
          {children}
        </Suspense>
      </ComponentErrorBoundary>
    );
  }
}

// Predefined lazy loaders for common components
export const LazyDashboardPage = createLazyComponent(
  () => import('../pages/DashboardPage'),
  { componentName: 'Dashboard', loadingMessage: 'Loading dashboard...' }
);

export const LazyToolsPage = createLazyComponent(
  () => import('../pages/ToolsPage'),
  { componentName: 'Tools', loadingMessage: 'Loading AI tools...' }
);

export const LazyProjectsPage = createLazyComponent(
  () => import('../pages/ProjectsPage'),
  { componentName: 'Projects', loadingMessage: 'Loading projects...' }
);

export const LazySettingsPage = createLazyComponent(
  () => import('../pages/SettingsPage'),
  { componentName: 'Settings', loadingMessage: 'Loading settings...' }
);

export const LazyMultiAgentOrchestrationPage = createLazyComponent(
  () => import('../pages/MultiAgentOrchestrationPage'),
  { componentName: 'Multi-Agent Orchestration', loadingMessage: 'Loading orchestration dashboard...' }
);

// Utility for creating route-based lazy components
export function createRouteComponent(
  routeName: string,
  importFn: () => Promise<{ default: ComponentType<any> }>
) {
  return createLazyComponent(importFn, {
    componentName: routeName,
    loadingMessage: `Loading ${routeName.toLowerCase()}...`
  });
}