import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageType } from '../../types';
import { getPageTitle } from './route-constants';

interface BreadcrumbProps {
  currentPage: PageType;
}

const pageLabels: Record<PageType, string> = {
  // Public pages
  home: 'Home',
  about: 'About',
  features: 'Features',
  pricing: 'Pricing',
  contact: 'Contact',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  demo: 'Demo',
  
  // Protected pages
  dashboard: 'Dashboard',
  projects: 'Projects',
  analytics: 'Analytics',
  'production-analytics': 'Production Analytics',
  settings: 'Settings',
  integrations: 'Integrations',
  deployments: 'Deployments',
  templates: 'Templates',
  collaboration: 'Collaboration',
  cicd: 'CI/CD Pipeline',
  subscription: 'Subscription',
  'launch-campaign': 'Launch Campaign',
  
  // Design System pages
  'agent-dashboard': 'Agent Dashboard',
  'workflow-pipeline': 'Workflow Pipeline',
  'integration-hub': 'Integration Hub',
  'revenue-dashboard': 'Revenue Dashboard',
  'ai-models': 'AI Models',
  'mobile-agents': 'Mobile Agents',
  notifications: 'Notifications',
  'automation-flow': 'Automation Flow',
  
  // Market Differentiator pages
  'content-rights': 'Content Rights Manager',
  'ai-trust': 'AI Trust & Verification',
  'wellness-monitor': 'AI Wellness Monitor',
  'no-code-workflows': 'No-Code Workflows',
  'security-dashboard': 'Security Dashboard',
  
  // Tool pages
  tools: 'AI Tools',
  'tool-detail': 'Tool Details'
};

export function Breadcrumb({ currentPage }: BreadcrumbProps) {
  if (currentPage === 'home') {
    return null;
  }

  // Get the page label, fallback to route title if not in our mapping
  const pageLabel = pageLabels[currentPage] || getPageTitle(currentPage).replace(' - FlashFusion', '');

  return (
    <nav className="ff-breadcrumb">
      <div className="ff-breadcrumb-item">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </div>
      <ChevronRight className="w-4 h-4 ff-breadcrumb-separator" />
      <div className="ff-breadcrumb-item">
        <span>{pageLabel}</span>
      </div>
    </nav>
  );
}