/**
 * Enhanced FlashFusion Route Management System
 * URL-based routing with history management, preloading, and performance optimization
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

export type PageRoute = 
  // Core Routes
  | 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' 
  | 'analytics' | 'collaboration' | 'templates' | 'integrations' 
  | 'settings' | 'about' | 'pricing' | 'contact'
  // AI & Workflow Routes  
  | 'ai-models' | 'live-collaboration' | 'cicd-pipeline' | 'workflows'
  | 'ai-creation' | 'one-click-publishing' | 'creator-commerce'
  | 'enterprise-security' | 'smart-analytics' | 'quality-assurance'
  // Feature Routes
  | 'repository-hub' | 'business-intelligence' | 'multi-agent-orchestration'
  | 'performance-optimization' | 'security-center' | 'user-personas'
  // Optimization Testing Routes
  | 'optimization-validator' | 'performance-manager' | 'error-recovery' | 'comprehensive-test' | 'optimization-dashboard';

interface RouteConfig {
  path: string;
  requiresAuth?: boolean;
  preload?: boolean;
  title?: string;
  description?: string;
  category?: 'core' | 'tools' | 'workflows' | 'admin';
}

interface RouteState {
  currentRoute: PageRoute;
  currentPath: string;
  searchParams: URLSearchParams;
  routeParams: Record<string, string>;
  isTransitioning: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
}

interface NavigationOptions {
  replace?: boolean;
  preserveQuery?: boolean;
  scrollToTop?: boolean;
  preload?: boolean;
}

// Enhanced route configuration with metadata
const ROUTE_CONFIG: Record<PageRoute, RouteConfig> = {
  // Core Application Routes
  'home': { 
    path: '/', 
    title: 'FlashFusion - AI Development Platform',
    description: 'Transform ideas into production-ready applications',
    category: 'core'
  },
  'dashboard': { 
    path: '/dashboard', 
    requiresAuth: true, 
    preload: true,
    title: 'Dashboard - FlashFusion',
    category: 'core'
  },
  'tools': { 
    path: '/tools', 
    requiresAuth: true, 
    preload: true,
    title: 'AI Tools Hub - FlashFusion',
    category: 'tools'
  },
  'projects': { 
    path: '/projects', 
    requiresAuth: true,
    title: 'Projects - FlashFusion',
    category: 'core'
  },
  'deployments': { 
    path: '/deployments', 
    requiresAuth: true,
    title: 'Deployments - FlashFusion',
    category: 'core'
  },
  'analytics': { 
    path: '/analytics', 
    requiresAuth: true,
    title: 'Analytics - FlashFusion',
    category: 'core'
  },
  'collaboration': { 
    path: '/collaboration',
    requiresAuth: true,
    title: 'Collaboration Hub - FlashFusion',
    category: 'core'
  },
  'templates': { 
    path: '/templates',
    title: 'Templates - FlashFusion',
    category: 'tools'
  },
  'integrations': { 
    path: '/integrations',
    requiresAuth: true,
    title: 'Integrations - FlashFusion',
    category: 'tools'
  },
  'settings': { 
    path: '/settings', 
    requiresAuth: true,
    title: 'Settings - FlashFusion',
    category: 'core'
  },
  
  // Public Routes
  'about': { 
    path: '/about',
    title: 'About FlashFusion',
    category: 'core'
  },
  'pricing': { 
    path: '/pricing',
    title: 'Pricing - FlashFusion',
    category: 'core'
  },
  'contact': { 
    path: '/contact',
    title: 'Contact Us - FlashFusion',
    category: 'core'
  },
  
  // AI & Workflow Routes
  'ai-models': { 
    path: '/ai/models', 
    requiresAuth: true,
    title: 'AI Models - FlashFusion',
    category: 'tools'
  },
  'live-collaboration': { 
    path: '/collaboration/live', 
    requiresAuth: true,
    title: 'Live Collaboration - FlashFusion',
    category: 'tools'
  },
  'cicd-pipeline': { 
    path: '/cicd', 
    requiresAuth: true,
    title: 'CI/CD Pipeline - FlashFusion',
    category: 'tools'
  },
  'workflows': { 
    path: '/workflows',
    requiresAuth: true,
    title: 'Creator Workflows - FlashFusion',
    category: 'workflows'
  },
  
  // Creator Journey Workflows
  'ai-creation': { 
    path: '/workflows/ai-creation', 
    requiresAuth: true,
    title: 'AI Creation Workflow - FlashFusion',
    category: 'workflows'
  },
  'one-click-publishing': { 
    path: '/workflows/publishing', 
    requiresAuth: true,
    title: 'One-Click Publishing - FlashFusion',
    category: 'workflows'
  },
  'creator-commerce': { 
    path: '/workflows/commerce', 
    requiresAuth: true,
    title: 'Creator Commerce - FlashFusion',
    category: 'workflows'
  },
  'enterprise-security': { 
    path: '/workflows/security', 
    requiresAuth: true,
    title: 'Enterprise Security - FlashFusion',
    category: 'workflows'
  },
  'smart-analytics': { 
    path: '/workflows/analytics', 
    requiresAuth: true,
    title: 'Smart Analytics - FlashFusion',
    category: 'workflows'
  },
  'quality-assurance': { 
    path: '/workflows/qa', 
    requiresAuth: true,
    title: 'Quality Assurance - FlashFusion',
    category: 'workflows'
  },
  
  // Advanced Feature Routes
  'repository-hub': { 
    path: '/repository', 
    requiresAuth: true,
    title: 'Repository Service Hub - FlashFusion',
    category: 'tools'
  },
  'business-intelligence': { 
    path: '/business-intelligence', 
    requiresAuth: true,
    title: 'Business Intelligence - FlashFusion',
    category: 'admin'
  },
  'multi-agent-orchestration': { 
    path: '/multi-agent', 
    requiresAuth: true,
    title: 'Multi-Agent Orchestration - FlashFusion',
    category: 'tools'
  },
  'performance-optimization': { 
    path: '/performance', 
    requiresAuth: true,
    title: 'Performance Optimization - FlashFusion',
    category: 'admin'
  },
  'security-center': { 
    path: '/security', 
    requiresAuth: true,
    title: 'Security Center - FlashFusion',
    category: 'admin'
  },
  'user-personas': { 
    path: '/personas', 
    requiresAuth: true,
    title: 'User Personas - FlashFusion',
    category: 'admin'
  },
  
  // Optimization Testing Routes
  'optimization-validator': { 
    path: '/optimization/validator', 
    requiresAuth: true,
    title: 'Optimization Validator - FlashFusion',
    description: 'Test and validate system optimizations',
    category: 'admin'
  },
  'performance-manager': { 
    path: '/optimization/performance', 
    requiresAuth: true,
    title: 'Performance Manager - FlashFusion',
    description: 'Monitor and optimize system performance',
    category: 'admin'
  },
  'error-recovery': { 
    path: '/optimization/error-recovery', 
    requiresAuth: true,
    title: 'Error Recovery System - FlashFusion',
    description: 'Manage system errors and recovery',
    category: 'admin'
  },
  'comprehensive-test': { 
    path: '/optimization/comprehensive-test', 
    requiresAuth: true,
    title: 'Comprehensive Optimization Test - FlashFusion',
    description: 'Complete test suite for all optimizations',
    category: 'admin'
  },
  'optimization-dashboard': { 
    path: '/optimization/dashboard', 
    requiresAuth: true,
    title: 'Optimization Test Dashboard - FlashFusion',
    description: 'Central hub for all optimization testing',
    category: 'admin'
  }
};

/**
 * Enhanced routing hook with URL management and performance optimization
 */
export const useEnhancedRouting = (initialRoute: PageRoute = 'home') => {
  const [routeState, setRouteState] = useState<RouteState>(() => ({
    currentRoute: initialRoute,
    currentPath: '/',
    searchParams: new URLSearchParams(),
    routeParams: {},
    isTransitioning: false,
    canGoBack: false,
    canGoForward: false,
    history: ['/']
  }));

  // Memoized route lookup for performance
  const routeLookup = useMemo(() => {
    const lookup: Record<string, PageRoute> = {};
    Object.entries(ROUTE_CONFIG).forEach(([route, config]) => {
      lookup[config.path] = route as PageRoute;
    });
    return lookup;
  }, []);

  // Get route from URL path
  const getRouteFromPath = useCallback((path: string): PageRoute => {
    // Extract base path without query params
    const basePath = path.split('?')[0];
    
    // Direct lookup first
    const directMatch = routeLookup[basePath];
    if (directMatch) return directMatch;
    
    // Pattern matching for parameterized routes
    for (const [route, config] of Object.entries(ROUTE_CONFIG)) {
      if (config.path.includes(':') || config.path.includes('*')) {
        // Handle parameterized routes if needed
        const pattern = config.path.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(basePath)) {
          return route as PageRoute;
        }
      }
    }
    
    return 'home'; // Default fallback
  }, [routeLookup]);

  // Update route state from current URL
  const syncWithUrl = useCallback(() => {
    const url = new URL(window.location.href);
    const route = getRouteFromPath(url.pathname);
    const searchParams = url.searchParams;
    
    setRouteState(prev => ({
      ...prev,
      currentRoute: route,
      currentPath: url.pathname,
      searchParams,
      routeParams: {}, // Extract params if needed
      canGoBack: window.history.length > 1,
      canGoForward: false // Browser doesn't expose this
    }));
    
    // Update document title
    const config = ROUTE_CONFIG[route];
    if (config?.title) {
      document.title = config.title;
    }
    
    // Update meta description
    if (config?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', config.description);
      }
    }
  }, [getRouteFromPath]);

  // Enhanced navigation with performance optimization
  const navigateToRoute = useCallback(async (
    route: PageRoute, 
    options: NavigationOptions = {}
  ) => {
    const { 
      replace = false, 
      preserveQuery = false, 
      scrollToTop = true,
      preload = false 
    } = options;
    
    if (routeState.currentRoute === route && !preserveQuery) {
      return; // Prevent unnecessary navigation
    }
    
    try {
      setRouteState(prev => ({ ...prev, isTransitioning: true }));
      
      // Smooth transition delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const config = ROUTE_CONFIG[route];
      let newPath = config.path;
      
      // Preserve query parameters if requested
      if (preserveQuery && routeState.searchParams.toString()) {
        newPath += `?${routeState.searchParams.toString()}`;
      }
      
      // Update browser history
      const method = replace ? 'replaceState' : 'pushState';
      window.history[method]({ route }, '', newPath);
      
      // Update route state
      setRouteState(prev => ({
        ...prev,
        currentRoute: route,
        currentPath: newPath,
        isTransitioning: false,
        history: replace ? prev.history : [...prev.history.slice(-50), newPath] // Limit history size
      }));
      
      // Update document title and meta
      if (config.title) document.title = config.title;
      if (config.description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', config.description);
      }
      
      // Scroll to top if requested
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Preload next logical routes
      if (preload || config.preload) {
        await preloadRoute(route);
      }
      
      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: newPath,
          page_title: config.title
        });
      }
      
    } catch (error) {
      console.error('Navigation error:', error);
      setRouteState(prev => ({ ...prev, isTransitioning: false }));
    }
  }, [routeState.currentRoute, routeState.searchParams]);

  // Enhanced navigation shortcuts
  const navigationHelpers = useMemo(() => ({
    goHome: () => navigateToRoute('home'),
    goToDashboard: () => navigateToRoute('dashboard'),
    goToTools: () => navigateToRoute('tools'),
    goToWorkflows: () => navigateToRoute('workflows'),
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    
    // Workflow navigation chain
    startCreatorJourney: () => navigateToRoute('ai-creation'),
    nextWorkflowStep: (currentStep: PageRoute) => {
      const workflowOrder: PageRoute[] = [
        'ai-creation', 'one-click-publishing', 'creator-commerce',
        'enterprise-security', 'smart-analytics', 'quality-assurance'
      ];
      const currentIndex = workflowOrder.indexOf(currentStep);
      const nextStep = workflowOrder[currentIndex + 1];
      if (nextStep) navigateToRoute(nextStep);
    }
  }), [navigateToRoute]);

  // Preload component for performance
  const preloadRoute = useCallback(async (route: PageRoute) => {
    const config = ROUTE_CONFIG[route];
    if (!config.preload) return;
    
    try {
      // This would preload the component chunks
      console.log(`🚀 Preloading route: ${route}`);
      // Implementation would depend on your build system
    } catch (error) {
      console.warn(`⚠️ Failed to preload route ${route}:`, error);
    }
  }, []);

  // Route validation
  const validateRoute = useCallback((route: PageRoute, isAuthenticated: boolean): boolean => {
    const config = ROUTE_CONFIG[route];
    return !config.requiresAuth || isAuthenticated;
  }, []);

  // Get route metadata
  const getRouteMetadata = useCallback((route: PageRoute) => {
    return ROUTE_CONFIG[route];
  }, []);

  // Listen for browser navigation events
  useEffect(() => {
    const handlePopState = () => {
      syncWithUrl();
    };
    
    window.addEventListener('popstate', handlePopState);
    syncWithUrl(); // Initial sync
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncWithUrl]);

  // Enhanced transition management
  useEffect(() => {
    if (routeState.isTransitioning) {
      const timer = setTimeout(() => {
        setRouteState(prev => ({ ...prev, isTransitioning: false }));
      }, 5000); // Safety timeout
      
      return () => clearTimeout(timer);
    }
  }, [routeState.isTransitioning]);

  return {
    // Current state
    currentRoute: routeState.currentRoute,
    currentPath: routeState.currentPath,
    isTransitioning: routeState.isTransitioning,
    searchParams: routeState.searchParams,
    routeParams: routeState.routeParams,
    canGoBack: routeState.canGoBack,
    canGoForward: routeState.canGoForward,
    
    // Navigation methods
    navigateToRoute,
    ...navigationHelpers,
    
    // Utility methods
    validateRoute,
    getRouteMetadata,
    preloadRoute,
    syncWithUrl,
    
    // Route configuration
    routes: ROUTE_CONFIG,
    
    // Current route metadata
    currentRouteConfig: ROUTE_CONFIG[routeState.currentRoute]
  };
};