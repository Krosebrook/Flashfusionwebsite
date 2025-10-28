/**
 * FlashFusion Route Navigation Hook
 * Centralized routing logic with smooth transitions
 */

import { useState, useCallback } from 'react';

export type PageRoute = 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
                        'analytics' | 'collaboration' | 'templates' | 'integrations' | 
                        'settings' | 'about' | 'pricing' | 'contact' | 'ai-models' | 
                        'live-collaboration' | 'cicd-pipeline' | 'workflows' |
                        'ai-creation' | 'one-click-publishing' | 'creator-commerce' |
                        'enterprise-security' | 'smart-analytics' | 'quality-assurance';

export const useRouteNavigation = (initialRoute: PageRoute = 'home') => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initialRoute);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToRoute = useCallback(async (route: PageRoute) => {
    if (currentRoute === route) return; // Prevent unnecessary navigation
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 150)); // Smooth transition
    setCurrentRoute(route);
    setIsTransitioning(false);
  }, [currentRoute]);

  return {
    currentRoute,
    isTransitioning,
    navigateToRoute
  };
};