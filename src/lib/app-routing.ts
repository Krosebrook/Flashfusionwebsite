import { PageType } from '../types';

// Protected pages that require authentication
export const PROTECTED_PAGES: PageType[] = [
  // Core protected pages
  'dashboard', 'projects', 'analytics', 'production-analytics', 'settings', 
  'integrations', 'deployments', 'templates', 'collaboration', 'cicd',
  'subscription', 'launch-campaign',
  
  // Design system pages
  'agent-dashboard', 'workflow-pipeline', 'integration-hub', 'revenue-dashboard', 
  'ai-models', 'mobile-agents', 'notifications', 'automation-flow',
  
  // Market differentiator pages
  'content-rights', 'ai-trust', 'wellness-monitor', 'no-code-workflows', 'security-dashboard'
];

// Pages where footer should be hidden
export const FULLSCREEN_PAGES: PageType[] = [
  'demo', 
  'automation-flow', 
  'no-code-workflows'
];

// Helper functions for routing logic
export const isProtectedPage = (page: PageType): boolean => {
  return PROTECTED_PAGES.includes(page);
};

export const shouldShowFooter = (page: PageType): boolean => {
  return !FULLSCREEN_PAGES.includes(page);
};

export const shouldShowSidebar = (page: PageType, isMobile: boolean, isAuthenticated: boolean): boolean => {
  return !isMobile && (isAuthenticated || ['tools', 'tool-detail'].includes(page));
};