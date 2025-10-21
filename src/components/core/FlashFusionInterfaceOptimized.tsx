/**
 * FlashFusion Main Interface - Optimized & Enhanced
 * Core application interface with intelligent routing, performance optimization, and enhanced UX
 */

import React, { memo, Suspense, useMemo, useCallback, useEffect } from 'react';
import { NavigationHeader } from '../layout/navigation-header';
import { FlashFusionLoader } from '../ui/flash-fusion-loader';
import { LiteModeIndicator } from '../ui/lite-mode-indicator';
import { EnhancedHomePage } from '../pages/enhanced-home-page';
import { useEnhancedRouting, type PageRoute } from '../../hooks/useEnhancedRouting';
import type { AppMode } from '../../utils/system-detection';

// Import existing UI components
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Enhanced lazy loading with intelligent preloading
const createIntelligentLazyComponent = (
  importFn: () => Promise<any>,
  displayName: string,
  preloadCondition?: () => boolean
) => {
  const LazyComponent = React.lazy(importFn);
  LazyComponent.displayName = displayName;
  
  // Optional preloading logic
  if (preloadCondition) {
    let preloaded = false;
    const preload = () => {
      if (!preloaded && preloadCondition()) {
        importFn().catch(() => {}); // Silent preload
        preloaded = true;
      }
    };
    
    // Preload on idle or interaction
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preload);
      } else {
        setTimeout(preload, 2000);
      }
    }
  }
  
  return LazyComponent;
};

// Core application components
const Dashboard = createIntelligentLazyComponent(
  () => import('../pages/DashboardPage'),
  'Dashboard',
  () => true // Always preload dashboard
);

const AIToolsHub = createIntelligentLazyComponent(
  () => import('../tools/AIToolsHub'),
  'AIToolsHub',
  () => localStorage.getItem('ff-frequent-tools') === 'true'
);

const ProjectsPage = createIntelligentLazyComponent(
  () => import('../pages/ProjectsPage'),
  'ProjectsPage'
);

const AnalyticsPage = createIntelligentLazyComponent(
  () => import('../pages/AnalyticsPage'),
  'AnalyticsPage'
);

// Advanced feature components
const MultiModelAIService = createIntelligentLazyComponent(
  () => import('../ai/MultiModelAIService'),
  'MultiModelAIService'
);

const LiveCodeCollaborationHub = createIntelligentLazyComponent(
  () => import('../collaboration/LiveCodeCollaborationHub'),
  'LiveCodeCollaborationHub'
);

const AdvancedCICDPipeline = createIntelligentLazyComponent(
  () => import('../cicd/AdvancedCICDPipeline'),
  'AdvancedCICDPipeline'
);

// Repository and business intelligence
const RepositoryServiceHub = createIntelligentLazyComponent(
  () => import('../repository/RepositoryServiceHub'),
  'RepositoryServiceHub'
);

const FlashFusionBusinessIntelligenceHub = createIntelligentLazyComponent(
  () => import('../analytics/FlashFusionBusinessIntelligenceHub'),
  'FlashFusionBusinessIntelligenceHub'
);

const MultiAgentOrchestrationDashboard = createIntelligentLazyComponent(
  () => import('../agents/MultiAgentOrchestrationDashboard'),
  'MultiAgentOrchestrationDashboard'
);

// Workflow components
const AICreationWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/AICreationWorkflow'),
  'AICreationWorkflow'
);

const OneClickPublishingWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/OneClickPublishingWorkflow'),
  'OneClickPublishingWorkflow'
);

const CreatorCommerceWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/CreatorCommerceWorkflow'),
  'CreatorCommerceWorkflow'
);

const EnterpriseSecurityWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/EnterpriseSecurityWorkflow'),
  'EnterpriseSecurityWorkflow'
);

const SmartAnalyticsWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/SmartAnalyticsWorkflow'),
  'SmartAnalyticsWorkflow'
);

const QualityAssuranceWorkflow = createIntelligentLazyComponent(
  () => import('../workflows/QualityAssuranceWorkflow'),
  'QualityAssuranceWorkflow'
);

// Performance optimization features
const AdvancedPerformanceOptimizer = createIntelligentLazyComponent(
  () => import('../performance/AdvancedPerformanceOptimizer'),
  'AdvancedPerformanceOptimizer'
);

const EnterpriseSecuritySuite = createIntelligentLazyComponent(
  () => import('../security/EnterpriseSecuritySuite'),
  'EnterpriseSecuritySuite'
);

const UserPersonaCards = createIntelligentLazyComponent(
  () => import('../pages/UserPersonaCards'),
  'UserPersonaCards'
);

// Optimization testing components
const OptimizationValidator = createIntelligentLazyComponent(
  () => import('../test/OptimizationValidator'),
  'OptimizationValidator'
);

const PerformanceOptimizationManager = createIntelligentLazyComponent(
  () => import('./PerformanceOptimizationManager'),
  'PerformanceOptimizationManager'
);

const EnhancedErrorRecoverySystemComponent = createIntelligentLazyComponent(
  () => import('./EnhancedErrorRecoverySystem'),
  'EnhancedErrorRecoverySystem'
);

const ComprehensiveOptimizationTest = createIntelligentLazyComponent(
  () => import('../test/ComprehensiveOptimizationTest'),
  'ComprehensiveOptimizationTest'
);

const OptimizationTestDashboard = createIntelligentLazyComponent(
  () => import('../test/OptimizationTestDashboard'),
  'OptimizationTestDashboard'
);

interface FlashFusionInterfaceProps {
  mode: AppMode;
}

/**
 * Enhanced loading fallback component
 */
const EnhancedLoader = memo(({ message, detail }: { message: string; detail: string }) => (
  <div className="ff-fade-in-up">
    <FlashFusionLoader message={message} detail={detail} />
  </div>
));
EnhancedLoader.displayName = 'EnhancedLoader';

/**
 * Quick action cards for common workflows
 */
const QuickActionCard = memo(({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  badge 
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  badge?: string;
}) => (
  <Card className="ff-card-interactive cursor-pointer ff-hover-lift" onClick={onClick}>
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto text-2xl ff-scale-in`}>
          {icon}
        </div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="ff-text-title text-lg">{title}</h3>
            {badge && <Badge className="ff-badge-primary text-xs">{badge}</Badge>}
          </div>
          <p className="ff-text-body text-sm">{description}</p>
        </div>
        <Button className="ff-btn-primary w-full ff-hover-glow">
          Launch
        </Button>
      </div>
    </CardContent>
  </Card>
));
QuickActionCard.displayName = 'QuickActionCard';

/**
 * Enhanced deployment platform grid
 */
const DeploymentPlatformCard = memo(({ 
  platform 
}: { 
  platform: { 
    name: string; 
    icon: string; 
    status: string; 
    deploys: number; 
    color: string; 
  } 
}) => (
  <Card className="ff-card-interactive p-6 ff-hover-lift">
    <div className="text-center space-y-4">
      <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mx-auto text-2xl text-white ff-scale-in`}>
        {platform.icon}
      </div>
      <div>
        <h3 className="ff-text-lg" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
          {platform.name}
        </h3>
        <Badge 
          variant={platform.status === 'Ready' || platform.status === 'Connected' ? 'default' : 'secondary'} 
          className={`mt-1 ${platform.status === 'Ready' || platform.status === 'Connected' ? 'ff-badge-primary' : 'ff-badge-secondary'}`}
        >
          {platform.status}
        </Badge>
      </div>
      <div className="ff-text-caption">
        {platform.deploys} deployments
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="ff-btn-outline w-full ff-hover-glow"
        disabled={platform.status === 'Available'}
      >
        {platform.status === 'Available' ? 'Setup Required' : 'Deploy Now'}
      </Button>
    </div>
  </Card>
));
DeploymentPlatformCard.displayName = 'DeploymentPlatformCard';

export const FlashFusionInterfaceOptimized = memo(({ mode }: FlashFusionInterfaceProps) => {
  const { 
    currentRoute, 
    isTransitioning, 
    navigateToRoute,
    nextWorkflowStep,
    currentRouteConfig
  } = useEnhancedRouting();

  // Track user interactions for analytics
  useEffect(() => {
    if (currentRoute && typeof window !== 'undefined') {
      // Track page view
      const pageView = {
        route: currentRoute,
        mode,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      // Store in local analytics (could be sent to analytics service)
      const analytics = JSON.parse(localStorage.getItem('ff-analytics') || '[]');
      analytics.push(pageView);
      localStorage.setItem('ff-analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
    }
  }, [currentRoute, mode]);

  // Memoized workflow data for performance
  const workflowData = useMemo(() => [
    {
      id: 'ai-creation',
      title: 'AI-Powered Creation',
      description: 'Generate stunning content, code, and creative assets in seconds',
      icon: '🤖',
      color: 'from-orange-500 to-red-500',
      route: 'ai-creation' as PageRoute,
      badge: 'Popular'
    },
    {
      id: 'one-click-publishing',
      title: 'One-Click Publishing',
      description: 'Deploy your creations instantly across 20+ platforms',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      route: 'one-click-publishing' as PageRoute,
      badge: 'Fast'
    },
    {
      id: 'creator-commerce',
      title: 'Creator Commerce',
      description: 'Turn your creative work into revenue streams',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      route: 'creator-commerce' as PageRoute,
      badge: 'New'
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption',
      icon: '🛡️',
      color: 'from-blue-600 to-purple-600',
      route: 'enterprise-security' as PageRoute
    },
    {
      id: 'smart-analytics',
      title: 'Smart Analytics',
      description: 'Track performance and revenue optimization in real-time',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
      route: 'smart-analytics' as PageRoute,
      badge: 'Pro'
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance',
      description: 'Automated quality checks for professional standards',
      icon: '✅',
      color: 'from-emerald-500 to-green-500',
      route: 'quality-assurance' as PageRoute
    }
  ], []);

  // Memoized deployment platforms data
  const deploymentPlatforms = useMemo(() => [
    { name: 'Vercel', icon: '▲', status: 'Ready', deploys: 23, color: 'from-black to-gray-800' },
    { name: 'Netlify', icon: '🌐', status: 'Connected', deploys: 18, color: 'from-teal-500 to-teal-600' },
    { name: 'AWS', icon: '☁️', status: 'Ready', deploys: 12, color: 'from-orange-500 to-yellow-500' },
    { name: 'Railway', icon: '🚂', status: 'Connected', deploys: 8, color: 'from-purple-500 to-purple-600' },
    { name: 'Render', icon: '🎨', status: 'Ready', deploys: 5, color: 'from-green-500 to-green-600' },
    { name: 'Heroku', icon: '🔺', status: 'Available', deploys: 0, color: 'from-purple-600 to-indigo-600' }
  ], []);

  // Enhanced collaboration content
  const renderCollaborationHub = useCallback(() => (
    <div className="space-y-6 ff-fade-in-up">
      <div className="grid lg:grid-cols-2 gap-6 ff-stagger-fade">
        <QuickActionCard
          title="Multi-Model AI Integration"
          description="Access multiple AI models with intelligent routing and fallback mechanisms"
          icon="🤖"
          color="from-orange-500 to-red-500"
          onClick={() => navigateToRoute('ai-models')}
          badge="Advanced"
        />
        
        <QuickActionCard
          title="Live Code Collaboration"
          description="Real-time collaborative coding with conflict resolution and presence awareness"
          icon="👥"
          color="from-blue-500 to-cyan-500"
          onClick={() => navigateToRoute('live-collaboration')}
          badge="Real-time"
        />
      </div>
      
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 ff-text-title">
            <span>🚀</span>
            <span>Advanced CI/CD Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="ff-text-body mb-4">
            Automated build, test, and deployment pipeline with real-time monitoring
          </p>
          <Button 
            onClick={() => navigateToRoute('cicd-pipeline')}
            className="ff-btn-accent w-full ff-hover-glow"
          >
            Configure Pipeline
          </Button>
        </CardContent>
      </Card>
    </div>
  ), [navigateToRoute]);

  // Enhanced workflows overview
  const renderWorkflowsOverview = useCallback(() => (
    <div className="max-w-7xl mx-auto space-y-8 ff-fade-in-up">
      <div className="text-center space-y-4">
        <h1 className="ff-text-headline">Creator Workflows</h1>
        <p className="ff-text-body">Complete end-to-end workflows for content creation and monetization</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
        {workflowData.map((workflow) => (
          <QuickActionCard
            key={workflow.id}
            title={workflow.title}
            description={workflow.description}
            icon={workflow.icon}
            color={workflow.color}
            onClick={() => navigateToRoute(workflow.route)}
            badge={workflow.badge}
          />
        ))}
      </div>
      
      <Card className="ff-card-interactive p-8 bg-gradient-to-r from-primary/10 to-secondary/10 ff-hover-lift">
        <div className="text-center space-y-4">
          <h3 className="ff-text-title">Complete Creator Journey</h3>
          <p className="ff-text-body max-w-2xl mx-auto">
            Experience the full FlashFusion workflow from AI-powered creation to revenue generation. 
            Each workflow builds on the previous one to create a complete creator ecosystem.
          </p>
          <Button size="lg" className="ff-btn-primary ff-hover-glow" onClick={() => navigateToRoute('ai-creation')}>
            Start Complete Journey
          </Button>
        </div>
      </Card>
    </div>
  ), [navigateToRoute, workflowData]);

  // Enhanced deployments hub
  const renderDeploymentsHub = useCallback(() => (
    <div className="max-w-6xl mx-auto space-y-8 ff-fade-in-up">
      <div className="text-center space-y-4">
        <h1 className="ff-text-headline">Deployment Hub</h1>
        <p className="ff-text-body">Deploy your applications to 15+ platforms with one click</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
        {deploymentPlatforms.map((platform, index) => (
          <DeploymentPlatformCard key={index} platform={platform} />
        ))}
      </div>
      
      <Card className="ff-card-interactive p-8 bg-gradient-to-r from-primary/10 to-secondary/10 ff-hover-lift">
        <div className="text-center space-y-4">
          <h3 className="ff-text-title">Automated CI/CD Pipeline</h3>
          <p className="ff-text-body max-w-2xl mx-auto">
            Set up automated deployments that trigger on every commit, with built-in testing, 
            security scanning, and rollback capabilities.
          </p>
          <Button size="lg" className="ff-btn-primary ff-hover-glow">
            Configure CI/CD
          </Button>
        </div>
      </Card>
    </div>
  ), [deploymentPlatforms]);

  // Enhanced about page
  const renderAboutPage = useCallback(() => (
    <div className="max-w-4xl mx-auto space-y-8 ff-fade-in-up">
      <div className="text-center space-y-4">
        <h1 className="ff-text-headline">About FlashFusion</h1>
        <p className="ff-text-body">The future of AI-powered application development</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 ff-stagger-fade">
        <Card className="ff-card-interactive p-6 ff-hover-lift">
          <h3 className="ff-text-title mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3 text-white ff-text-sm">🎯</span>
            Our Mission
          </h3>
          <p className="ff-text-body">
            To democratize application development by providing AI-powered tools that enable anyone 
            to build production-ready applications, regardless of their technical background.
          </p>
        </Card>
        
        <Card className="ff-card-interactive p-6 ff-hover-lift">
          <h3 className="ff-text-title mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3 text-white ff-text-sm">🚀</span>
            Our Vision
          </h3>
          <p className="ff-text-body">
            A world where every idea can become a reality through the power of AI, breaking down 
            barriers between concept and creation.
          </p>
        </Card>
      </div>
      
      <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl ff-hover-lift">
        <h3 className="ff-text-title mb-4">Ready to transform your development workflow?</h3>
        <Button size="lg" onClick={() => navigateToRoute('tools')} className="ff-btn-primary ff-hover-glow">
          Explore AI Tools
        </Button>
      </div>
    </div>
  ), [navigateToRoute]);

  // Main content renderer with enhanced performance
  const renderMainContent = useCallback(() => {
    if (isTransitioning) {
      return <EnhancedLoader message="Loading..." detail="Preparing your workspace" />;
    }

    switch (currentRoute) {
      case 'home':
        return <EnhancedHomePage onNavigate={navigateToRoute} />;
      
      case 'dashboard':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Dashboard" detail="Preparing your analytics and insights" />}>
            <Dashboard />
          </Suspense>
        );
      
      case 'tools':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading AI Tools" detail="Initializing 60+ development tools" />}>
            <AIToolsHub />
          </Suspense>
        );
      
      case 'projects':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Projects" detail="Fetching your development projects" />}>
            <ProjectsPage />
          </Suspense>
        );
      
      case 'analytics':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Analytics" detail="Analyzing your development metrics" />}>
            <AnalyticsPage />
          </Suspense>
        );
      
      case 'collaboration':
        return renderCollaborationHub();
      
      case 'ai-models':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading AI Models" detail="Initializing multi-model AI integration" />}>
            <MultiModelAIService />
          </Suspense>
        );
      
      case 'live-collaboration':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Live Collaboration" detail="Setting up real-time collaborative environment" />}>
            <LiveCodeCollaborationHub />
          </Suspense>
        );
      
      case 'cicd-pipeline':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading CI/CD Pipeline" detail="Initializing deployment automation" />}>
            <AdvancedCICDPipeline />
          </Suspense>
        );

      // Enhanced feature routes
      case 'repository-hub':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Repository Hub" detail="Connecting to version control systems" />}>
            <RepositoryServiceHub />
          </Suspense>
        );

      case 'business-intelligence':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Business Intelligence" detail="Analyzing business metrics and insights" />}>
            <FlashFusionBusinessIntelligenceHub />
          </Suspense>
        );

      case 'multi-agent-orchestration':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Multi-Agent System" detail="Initializing AI agent orchestration" />}>
            <MultiAgentOrchestrationDashboard />
          </Suspense>
        );

      case 'performance-optimization':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Performance Center" detail="Analyzing system performance metrics" />}>
            <AdvancedPerformanceOptimizer />
          </Suspense>
        );

      case 'security-center':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Security Center" detail="Initializing security monitoring" />}>
            <EnterpriseSecuritySuite />
          </Suspense>
        );

      case 'user-personas':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading User Personas" detail="Analyzing user behavior patterns" />}>
            <UserPersonaCards />
          </Suspense>
        );

      // Optimization and Testing Routes
      case 'optimization-validator':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Optimization Validator" detail="Initializing system optimization tests" />}>
            <OptimizationValidator />
          </Suspense>
        );

      case 'performance-manager':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Performance Manager" detail="Setting up real-time performance monitoring" />}>
            <PerformanceOptimizationManager />
          </Suspense>
        );

      case 'error-recovery':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Error Recovery" detail="Initializing error recovery system" />}>
            <EnhancedErrorRecoverySystemComponent />
          </Suspense>
        );

      case 'comprehensive-test':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Comprehensive Test" detail="Initializing complete optimization test suite" />}>
            <ComprehensiveOptimizationTest />
          </Suspense>
        );

      case 'optimization-dashboard':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Optimization Dashboard" detail="Preparing comprehensive test dashboard" />}>
            <OptimizationTestDashboard />
          </Suspense>
        );
      
      // Workflow Routes with enhanced navigation
      case 'ai-creation':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading AI Creation" detail="Initializing AI-powered content generation" />}>
            <AICreationWorkflow onComplete={() => nextWorkflowStep('ai-creation')} />
          </Suspense>
        );
      
      case 'one-click-publishing':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Publishing Platform" detail="Setting up deployment infrastructure" />}>
            <OneClickPublishingWorkflow onComplete={() => nextWorkflowStep('one-click-publishing')} />
          </Suspense>
        );
      
      case 'creator-commerce':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Commerce Hub" detail="Configuring revenue streams" />}>
            <CreatorCommerceWorkflow onComplete={() => nextWorkflowStep('creator-commerce')} />
          </Suspense>
        );
      
      case 'enterprise-security':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Security Suite" detail="Implementing enterprise-grade security" />}>
            <EnterpriseSecurityWorkflow onComplete={() => nextWorkflowStep('enterprise-security')} />
          </Suspense>
        );
      
      case 'smart-analytics':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Analytics Platform" detail="Setting up performance tracking" />}>
            <SmartAnalyticsWorkflow onComplete={() => nextWorkflowStep('smart-analytics')} />
          </Suspense>
        );
      
      case 'quality-assurance':
        return (
          <Suspense fallback={<EnhancedLoader message="Loading Quality Assurance" detail="Configuring automated quality checks" />}>
            <QualityAssuranceWorkflow onComplete={() => navigateToRoute('dashboard')} />
          </Suspense>
        );
      
      case 'workflows':
        return renderWorkflowsOverview();
      
      case 'deployments':
        return renderDeploymentsHub();
      
      case 'about':
        return renderAboutPage();
      
      default:
        return <EnhancedHomePage onNavigate={navigateToRoute} />;
    }
  }, [
    currentRoute, 
    isTransitioning, 
    navigateToRoute, 
    nextWorkflowStep,
    renderCollaborationHub,
    renderWorkflowsOverview,
    renderDeploymentsHub,
    renderAboutPage
  ]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentRoute={currentRoute} onRouteChange={navigateToRoute} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {mode === 'lite' && <LiteModeIndicator />}
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
});

FlashFusionInterfaceOptimized.displayName = 'FlashFusionInterfaceOptimized';

export default FlashFusionInterfaceOptimized;