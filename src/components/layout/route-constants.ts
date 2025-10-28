import { PageType } from '../../types';

// Route configuration with metadata
export interface RouteConfig {
  page: PageType;
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  category: 'public' | 'protected' | 'design-system' | 'differentiators' | 'tools';
  tier?: 'free' | 'pro' | 'enterprise';
  comingSoon?: boolean;
}

export const ROUTE_CONFIGS: Record<PageType, RouteConfig> = {
  // Public routes
  home: {
    page: 'home',
    path: '/',
    title: 'FlashFusion - AI Business Operating System',
    description: 'Transform ideas into reality with AI-powered business automation',
    requiresAuth: false,
    category: 'public'
  },
  about: {
    page: 'about',
    path: '/about',
    title: 'About FlashFusion',
    description: 'Learn about our mission to democratize AI-powered business creation',
    requiresAuth: false,
    category: 'public'
  },
  features: {
    page: 'features',
    path: '/features',
    title: 'Features - FlashFusion',
    description: 'Discover 60+ AI tools across 6 categories for complete business automation',
    requiresAuth: false,
    category: 'public'
  },
  pricing: {
    page: 'pricing',
    path: '/pricing',
    title: 'Pricing - FlashFusion',
    description: 'Choose the perfect plan for your AI-powered business needs',
    requiresAuth: false,
    category: 'public'
  },
  contact: {
    page: 'contact',
    path: '/contact',
    title: 'Contact Us - FlashFusion',
    description: 'Get in touch with our team for support and inquiries',
    requiresAuth: false,
    category: 'public'
  },
  testimonials: {
    page: 'testimonials',
    path: '/testimonials',
    title: 'Customer Success Stories - FlashFusion',
    description: 'See how businesses are transforming with FlashFusion AI platform',
    requiresAuth: false,
    category: 'public'
  },
  faq: {
    page: 'faq',
    path: '/faq',
    title: 'FAQ - FlashFusion',
    description: 'Frequently asked questions about FlashFusion AI platform',
    requiresAuth: false,
    category: 'public'
  },
  privacy: {
    page: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy - FlashFusion',
    description: 'How we protect your data and privacy',
    requiresAuth: false,
    category: 'public'
  },
  terms: {
    page: 'terms',
    path: '/terms',
    title: 'Terms of Service - FlashFusion',
    description: 'Terms and conditions for using FlashFusion platform',
    requiresAuth: false,
    category: 'public'
  },
  demo: {
    page: 'demo',
    path: '/demo',
    title: 'Interactive Demo - FlashFusion',
    description: 'Experience FlashFusion AI platform with our interactive demo',
    requiresAuth: false,
    category: 'public'
  },

  // Protected routes
  dashboard: {
    page: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard - FlashFusion',
    description: 'Your AI-powered business command center',
    requiresAuth: true,
    category: 'protected'
  },
  projects: {
    page: 'projects',
    path: '/projects',
    title: 'Projects - FlashFusion',
    description: 'Manage your AI-generated projects and applications',
    requiresAuth: true,
    category: 'protected'
  },
  analytics: {
    page: 'analytics',
    path: '/analytics',
    title: 'Analytics - FlashFusion',
    description: 'Comprehensive analytics and performance insights',
    requiresAuth: true,
    category: 'protected'
  },
  'production-analytics': {
    page: 'production-analytics',
    path: '/analytics/production',
    title: 'Production Analytics - FlashFusion',
    description: 'Real-time production metrics and monitoring',
    requiresAuth: true,
    category: 'protected',
    tier: 'pro'
  },
  settings: {
    page: 'settings',
    path: '/settings',
    title: 'Settings - FlashFusion',
    description: 'Configure your FlashFusion account and preferences',
    requiresAuth: true,
    category: 'protected'
  },
  integrations: {
    page: 'integrations',
    path: '/integrations',
    title: 'Integrations - FlashFusion',
    description: 'Connect FlashFusion with your favorite tools and platforms',
    requiresAuth: true,
    category: 'protected'
  },
  deployments: {
    page: 'deployments',
    path: '/deployments',
    title: 'Deployments - FlashFusion',
    description: 'Deploy your projects to 8+ platforms instantly',
    requiresAuth: true,
    category: 'protected'
  },
  templates: {
    page: 'templates',
    path: '/templates',
    title: 'Templates - FlashFusion',
    description: 'Pre-built templates for rapid development',
    requiresAuth: true,
    category: 'protected'
  },
  collaboration: {
    page: 'collaboration',
    path: '/collaboration',
    title: 'Team Collaboration - FlashFusion',
    description: 'Collaborate with your team on AI projects',
    requiresAuth: true,
    category: 'protected',
    tier: 'pro'
  },
  cicd: {
    page: 'cicd',
    path: '/cicd',
    title: 'CI/CD Pipeline - FlashFusion',
    description: 'Automated continuous integration and deployment',
    requiresAuth: true,
    category: 'protected',
    tier: 'enterprise'
  },
  subscription: {
    page: 'subscription',
    path: '/subscription',
    title: 'Subscription - FlashFusion',
    description: 'Manage your FlashFusion subscription and billing',
    requiresAuth: true,
    category: 'protected'
  },
  'launch-campaign': {
    page: 'launch-campaign',
    path: '/launch',
    title: 'Launch Campaign - FlashFusion',
    description: 'AI-powered marketing campaign management',
    requiresAuth: true,
    category: 'protected',
    tier: 'pro'
  },

  // FlashFusion Design System routes
  'agent-dashboard': {
    page: 'agent-dashboard',
    path: '/agents',
    title: 'Universal Agent Dashboard - FlashFusion',
    description: 'Command center for AI agent orchestration',
    requiresAuth: true,
    category: 'design-system'
  },
  'workflow-pipeline': {
    page: 'workflow-pipeline',
    path: '/workflow',
    title: 'Workflow Pipeline - FlashFusion',
    description: 'Visual workflow status and pipeline management',
    requiresAuth: true,
    category: 'design-system'
  },
  'integration-hub': {
    page: 'integration-hub',
    path: '/integrations/hub',
    title: 'Integration Hub - FlashFusion',
    description: 'Cross-platform integration management center',
    requiresAuth: true,
    category: 'design-system'
  },
  'revenue-dashboard': {
    page: 'revenue-dashboard',
    path: '/revenue',
    title: 'Revenue Dashboard - FlashFusion',
    description: 'Comprehensive revenue stream analytics',
    requiresAuth: true,
    category: 'design-system',
    tier: 'pro'
  },
  'ai-models': {
    page: 'ai-models',
    path: '/ai/models',
    title: 'AI Model Selection - FlashFusion',
    description: 'Choose and configure AI models for your projects',
    requiresAuth: true,
    category: 'design-system'
  },
  'mobile-agents': {
    page: 'mobile-agents',
    path: '/mobile/agents',
    title: 'Mobile Agent Selector - FlashFusion',
    description: 'Mobile-optimized AI agent selection interface',
    requiresAuth: true,
    category: 'design-system'
  },
  notifications: {
    page: 'notifications',
    path: '/notifications',
    title: 'Notification Center - FlashFusion',
    description: 'Centralized notification management system',
    requiresAuth: true,
    category: 'design-system'
  },
  'automation-flow': {
    page: 'automation-flow',
    path: '/automation',
    title: 'Automation Flow Builder - FlashFusion',
    description: 'Visual automation workflow designer',
    requiresAuth: true,
    category: 'design-system'
  },

  // Market Differentiator Features
  'content-rights': {
    page: 'content-rights',
    path: '/creators/rights',
    title: 'Content Rights Manager - FlashFusion',
    description: 'Manage content licensing, FTC compliance, and usage rights',
    requiresAuth: true,
    category: 'differentiators',
    tier: 'pro'
  },
  'ai-trust': {
    page: 'ai-trust',
    path: '/ai/trust',
    title: 'AI Trust & Verification - FlashFusion',
    description: 'AI content verification and trust scoring system',
    requiresAuth: true,
    category: 'differentiators'
  },
  'wellness-monitor': {
    page: 'wellness-monitor',
    path: '/wellness',
    title: 'AI Wellness Monitor - FlashFusion',
    description: 'Monitor AI usage patterns and maintain healthy habits',
    requiresAuth: true,
    category: 'differentiators'
  },
  'no-code-workflows': {
    page: 'no-code-workflows',
    path: '/workflows',
    title: 'No-Code Workflows - FlashFusion',
    description: 'Drag-and-drop workflow builder for complex automations',
    requiresAuth: true,
    category: 'differentiators'
  },
  'security-dashboard': {
    page: 'security-dashboard',
    path: '/security',
    title: 'Security Posture Dashboard - FlashFusion',
    description: 'Enterprise-grade security monitoring and compliance',
    requiresAuth: true,
    category: 'differentiators',
    tier: 'enterprise'
  },

  // Phase 3: Design/Dev Coordination Framework
  'design-system-sync': {
    page: 'design-system-sync',
    path: '/design-system',
    title: 'Design System Sync Protocol - FlashFusion',
    description: 'Comprehensive design system overview with automated token export and component updates',
    requiresAuth: false,
    category: 'design-system'
  },
  'development-workflow': {
    page: 'development-workflow',
    path: '/workflow/sprint',
    title: 'Development Workflow - FlashFusion',
    description: 'Two-week sprint board with comprehensive task management and team coordination',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 4: Quality Gates & Success Metrics
  'quality-thresholds': {
    page: 'quality-thresholds',
    path: '/quality/thresholds',
    title: 'Quality Thresholds Dashboard - FlashFusion',
    description: 'Comprehensive quality monitoring with WCAG compliance, performance targets, and visual consistency',
    requiresAuth: false,
    category: 'design-system'
  },
  'success-metrics': {
    page: 'success-metrics',
    path: '/metrics/success',
    title: 'Success Metrics Dashboard - FlashFusion',
    description: 'KPI dashboard with MAU, conversion rates, NPS, feature adoption, uptime, and performance metrics',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 5: Critical Risk Mitigation
  'security-compliance': {
    page: 'security-compliance',
    path: '/security/compliance',
    title: 'Security & Compliance Dashboard - FlashFusion',
    description: 'SOC 2 Type II, GDPR/HIPAA/CCPA compliance with data encryption, consent management, and incident response',
    requiresAuth: false,
    category: 'design-system'
  },
  'scalability-planning': {
    page: 'scalability-planning',
    path: '/scalability/planning',
    title: 'Scalability Planning Board - FlashFusion',
    description: 'Database optimization, CDN configuration, auto-scaling policies, and capacity planning with team assignment',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 6: Team Structure & Coordination
  'team-structure': {
    page: 'team-structure',
    path: '/team/structure',
    title: 'Recommended Team Structure - FlashFusion',
    description: 'Comprehensive organizational chart with core SaaS team roles, extended positions, and hiring timeline',
    requiresAuth: false,
    category: 'design-system'
  },
  'cross-functional-coordination': {
    page: 'cross-functional-coordination',
    path: '/team/coordination',
    title: 'Cross-Functional Coordination - FlashFusion',
    description: 'Team coordination calendar with daily stand-ups, weekly syncs, sprint planning, and OKR sessions',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 7: Implementation Roadmap
  'discovery-phase-timeline': {
    page: 'discovery-phase-timeline',
    path: '/roadmap/discovery',
    title: 'Discovery Phase Timeline - FlashFusion',
    description: 'Comprehensive discovery phase roadmap for weeks 1-2 with business requirements, architecture audit, and team setup',
    requiresAuth: false,
    category: 'design-system'
  },
  'development-phase-timeline': {
    page: 'development-phase-timeline',
    path: '/roadmap/development',
    title: 'Development Phase Timeline - FlashFusion',
    description: 'Complete development roadmap for weeks 3-8 covering foundation, feature development, and optimization phases',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 8: Blindspot Mitigation
  'common-blindspots': {
    page: 'common-blindspots',
    path: '/blindspot/matrix',
    title: 'Common Blindspots Matrix - FlashFusion',
    description: 'Risk matrix board categorizing blindspots with comprehensive mitigation strategies and implementation tracking',
    requiresAuth: false,
    category: 'design-system'
  },
  'immediate-next-actions': {
    page: 'immediate-next-actions',
    path: '/blindspot/actions',
    title: 'Immediate Next Actions - FlashFusion',
    description: 'Priority-based 7-day action plan with foundation tasks, quality gates, and success metrics implementation',
    requiresAuth: false,
    category: 'design-system'
  },

  // Advanced Platform Evolution
  'advanced-performance': {
    page: 'advanced-performance',
    path: '/advanced/performance',
    title: 'Advanced Performance Optimizer - FlashFusion',
    description: 'Enterprise-grade performance optimization with Core Web Vitals, intelligent caching, and automated optimization',
    requiresAuth: false,
    category: 'design-system'
  },
  'enterprise-security': {
    page: 'enterprise-security',
    path: '/advanced/security',
    title: 'Enterprise Security Suite - FlashFusion',
    description: 'Comprehensive security suite with threat detection, compliance automation, and zero-trust architecture',
    requiresAuth: false,
    category: 'design-system'
  },
  'advanced-deployment': {
    page: 'advanced-deployment',
    path: '/advanced/deployment',
    title: 'Advanced Deployment Orchestrator - FlashFusion',
    description: 'Intelligent deployment orchestration with CI/CD pipelines, infrastructure automation, and canary releases',
    requiresAuth: false,
    category: 'design-system'
  },
  'ai-code-intelligence': {
    page: 'ai-code-intelligence',
    path: '/advanced/ai-intelligence',
    title: 'AI Code Intelligence System - FlashFusion',
    description: 'AI-powered code analysis with intelligent review, predictive bug detection, and smart refactoring assistance',
    requiresAuth: false,
    category: 'design-system'
  },
  'advanced-collaboration': {
    page: 'advanced-collaboration',
    path: '/advanced/collaboration',
    title: 'Advanced Collaboration Hub - FlashFusion',
    description: 'Real-time collaboration platform with multi-user editing, team workspaces, and integrated communication',
    requiresAuth: false,
    category: 'design-system'
  },

  // Phase 1 & 2: Business Intelligence and Technical Architecture
  'pricing-wireframe': {
    page: 'pricing-wireframe',
    path: '/pricing/wireframe',
    title: 'SaaS Pricing Wireframe - FlashFusion',
    description: 'Three-tier pricing structure with conversion optimization and analytics',
    requiresAuth: false,
    category: 'public'
  },
  'user-personas': {
    page: 'user-personas',
    path: '/personas',
    title: 'User Persona Matrix - FlashFusion',
    description: 'Comprehensive user persona analysis with behavioral insights and workflows',
    requiresAuth: false,
    category: 'public'
  },
  'responsive-ui-kit': {
    page: 'responsive-ui-kit',
    path: '/ui-kit',
    title: 'Responsive UI Kit - FlashFusion',
    description: 'React 18 + TypeScript UI components with mobile-first design',
    requiresAuth: false,
    category: 'design-system'
  },
  'backend-architecture': {
    page: 'backend-architecture',
    path: '/architecture/backend',
    title: 'Backend Architecture - FlashFusion',
    description: 'Interactive visualization of Supabase edge functions and microservices',
    requiresAuth: false,
    category: 'design-system'
  },
  'infrastructure-strategy': {
    page: 'infrastructure-strategy',
    path: '/architecture/infrastructure',
    title: 'Infrastructure Strategy - FlashFusion',
    description: 'Multi-region deployment with CDN, load balancers, and monitoring tools',
    requiresAuth: false,
    category: 'design-system'
  },

  // Multi-Agent Orchestration - NEW FEATURE
  'multi-agent-orchestration': {
    page: 'multi-agent-orchestration',
    path: '/orchestration',
    title: 'Multi-Agent Orchestration - FlashFusion',
    description: 'Advanced AI agent coordination with real-time collaboration, predictive analytics, and voice control',
    requiresAuth: true,
    category: 'differentiators',
    tier: 'pro'
  },

  // Tool routes
  tools: {
    page: 'tools',
    path: '/tools',
    title: 'AI Tools - FlashFusion',
    description: 'Browse 60+ AI-powered tools across 6 categories',
    requiresAuth: false,
    category: 'tools'
  },
  'tool-detail': {
    page: 'tool-detail',
    path: '/tools/:id',
    title: 'Tool Details - FlashFusion',
    description: 'Detailed information about AI tools and capabilities',
    requiresAuth: false,
    category: 'tools'
  }
};

// Helper functions for route management
export const getRouteConfig = (page: PageType): RouteConfig => {
  return ROUTE_CONFIGS[page];
};

export const getRoutesByCategory = (category: RouteConfig['category']): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(route => route.category === category);
};

export const getProtectedRoutes = (): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(route => route.requiresAuth);
};

export const getPublicRoutes = (): RouteConfig[] => {
  return Object.values(ROUTE_CONFIGS).filter(route => !route.requiresAuth);
};

export const getTierRestrictedRoutes = (tier?: string): RouteConfig[] => {
  if (!tier) return [];
  return Object.values(ROUTE_CONFIGS).filter(route => route.tier === tier);
};

export const getPageTitle = (page: PageType): string => {
  return getRouteConfig(page).title;
};

export const getPageDescription = (page: PageType): string => {
  return getRouteConfig(page).description;
};

// Navigation constants for sidebar and mobile navigation
export const MAIN_NAVIGATION = [
  'dashboard',
  'projects',
  'analytics',
  'tools'
] as PageType[];

export const DESIGN_SYSTEM_NAVIGATION = [
  'agent-dashboard',
  'workflow-pipeline',
  'integration-hub',
  'revenue-dashboard',
  'ai-models',
  'mobile-agents',
  'notifications',
  'automation-flow'
] as PageType[];

export const DIFFERENTIATOR_NAVIGATION = [
  'multi-agent-orchestration', // Added to AI & Automation section
  'content-rights',
  'ai-trust',
  'wellness-monitor',
  'no-code-workflows',
  'security-dashboard'
] as PageType[];

export const ACCOUNT_NAVIGATION = [
  'settings',
  'subscription',
  'integrations',
  'deployments'
] as PageType[];

export const PUBLIC_NAVIGATION = [
  'home',
  'features',
  'pricing',
  'about',
  'contact'
] as PageType[];