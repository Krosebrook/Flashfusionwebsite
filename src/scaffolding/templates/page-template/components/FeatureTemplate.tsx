/**
 * @fileoverview {{FEATURE_NAME}} - FlashFusion Page Component
 * @version 1.0.0
 * @category {{FEATURE_CATEGORY}}
 * @type page
 * 
 * A production-ready page component optimized for full-page experiences,
 * with routing, SEO, analytics, and responsive layouts.
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  AlertCircle,
  Home,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  BarChart3,
  FileText
} from 'lucide-react';

// Import page-specific store
import { useFeatureStore } from '../stores/FeatureStore';

// Import page service
import { FeatureService } from '../services/FeatureService';

// Import types
import type {
  FeatureData,
  FeatureConfig,
  PageSection,
  PageMetadata
} from '../types/feature.types';

/**
 * Page component props interface
 */
export interface FeaturePageProps {
  /**
   * Initial configuration for the page
   */
  config?: Partial<FeatureConfig>;
  
  /**
   * Page metadata for SEO
   */
  metadata?: Partial<PageMetadata>;
  
  /**
   * Whether to show breadcrumbs
   */
  showBreadcrumbs?: boolean;
  
  /**
   * Whether to show page header
   */
  showHeader?: boolean;
  
  /**
   * Custom CSS class for the container
   */
  className?: string;
  
  /**
   * Callback when page mounts
   */
  onMount?: () => void;
  
  /**
   * Callback when page unmounts
   */
  onUnmount?: () => void;
}

/**
 * Page loading skeleton
 */
const PageSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[400px]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/**
 * Page error component
 */
const PageError: React.FC<{ 
  error: Error; 
  onRetry?: () => void;
  onGoHome?: () => void;
}> = ({ error, onRetry, onGoHome }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
    <p className="text-muted-foreground text-center mb-6 max-w-md">
      {error.message}
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
      {onGoHome && (
        <Button onClick={onGoHome} variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      )}
    </div>
  </div>
);

/**
 * Page breadcrumbs component
 */
const PageBreadcrumbs: React.FC<{ 
  items: Array<{ label: string; href?: string }> 
}> = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span>/</span>}
        {item.href ? (
          <a 
            href={item.href} 
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <span className="text-foreground font-medium">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

/**
 * Page header component
 */
const PageHeader: React.FC<{
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
}> = ({ title, description, badge, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

/**
 * Page section component
 */
const PageSectionComponent: React.FC<PageSection> = ({ 
  title, 
  description, 
  icon: Icon, 
  content 
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <CardTitle>{title}</CardTitle>
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{content}</CardContent>
  </Card>
);

/**
 * {{FEATURE_NAME}} Page Component
 * 
 * Full-page experience for {{FEATURE_DESCRIPTION}}
 * 
 * Features:
 * - SEO optimized with metadata
 * - Responsive layout
 * - Analytics integration
 * - Loading states
 * - Error boundaries
 * - Breadcrumb navigation
 * 
 * @example
 * ```tsx
 * <{{FEATURE_NAME}}Page
 *   metadata={{
 *     title: "My Page",
 *     description: "Page description"
 *   }}
 *   showBreadcrumbs={true}
 * />
 * ```
 */
export const {{FEATURE_NAME}}Page: React.FC<FeaturePageProps> = ({
  config,
  metadata,
  showBreadcrumbs = true,
  showHeader = true,
  className = '',
  onMount,
  onUnmount
}) => {
  // Get service instance
  const service = useMemo(() => FeatureService.getInstance(), []);
  
  // Store state and actions
  const {
    data,
    status,
    error,
    config: storeConfig,
    loadData,
    updateConfig,
    clearError,
    reset
  } = useFeatureStore();
  
  /**
   * Set page title and metadata
   */
  useEffect(() => {
    if (metadata?.title) {
      document.title = `${metadata.title} | FlashFusion`;
    }
    
    // Set meta description
    if (metadata?.description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', metadata.description);
    }
    
    // Track page view
    if (storeConfig.enabled.analytics) {
      console.log('[Analytics] Page view:', metadata?.title);
      // Add your analytics tracking here
    }
  }, [metadata, storeConfig.enabled.analytics]);
  
  /**
   * Initialize page
   */
  useEffect(() => {
    if (config) {
      updateConfig(config);
    }
    
    // Load initial data
    loadData();
    
    // Call onMount callback
    if (onMount) {
      onMount();
    }
    
    // Cleanup on unmount
    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [config, updateConfig, loadData, onMount, onUnmount]);
  
  /**
   * Handle page refresh
   */
  const handleRefresh = useCallback(async () => {
    clearError();
    await loadData();
  }, [clearError, loadData]);
  
  /**
   * Handle navigation to home
   */
  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);
  
  /**
   * Define page sections
   */
  const sections: PageSection[] = useMemo(() => [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Key metrics and statistics',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is where you display your overview content.
          </p>
          {/* Add your overview content here */}
        </div>
      )
    },
    {
      id: 'details',
      title: 'Details',
      description: 'Detailed information',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is where you display detailed information.
          </p>
          {/* Add your details content here */}
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Performance metrics',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is where you display analytics and metrics.
          </p>
          {/* Add your analytics content here */}
        </div>
      )
    }
  ], []);
  
  // Breadcrumb items
  const breadcrumbs = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: '{{FEATURE_CATEGORY}}', href: `/{{FEATURE_CATEGORY}}` },
    { label: '{{FEATURE_NAME}}' }
  ], []);
  
  return (
    <div className={`container mx-auto py-6 px-4 ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && <PageBreadcrumbs items={breadcrumbs} />}
      
      {/* Page Header */}
      {showHeader && (
        <PageHeader
          title="{{FEATURE_NAME}}"
          description="{{FEATURE_DESCRIPTION}}"
          badge="Page"
          actions={
            <>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={status === 'loading'}
              >
                <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </>
          }
        />
      )}
      
      {/* Loading State */}
      {status === 'loading' && !data && (
        <PageSkeleton />
      )}
      
      {/* Error State */}
      {error && (
        <PageError
          error={new Error(error.message)}
          onRetry={handleRefresh}
          onGoHome={handleGoHome}
        />
      )}
      
      {/* Content */}
      {status !== 'loading' && !error && (
        <div className="space-y-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <PageSectionComponent key={section.id} {...section} />
            ))}
          </div>
          
          {/* Additional Content */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                More details about {{FEATURE_NAME}}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add your additional page content here. This could include
                tables, charts, forms, or any other components relevant to
                your page.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Export as default
export default {{FEATURE_NAME}}Page;
