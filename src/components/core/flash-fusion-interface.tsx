/**
 * FlashFusion Main Interface
 * Core application interface with routing and layout management
 */

import React, { memo, Suspense } from 'react';
import { NavigationHeader } from '../layout/navigation-header';
import { FlashFusionLoader } from '../ui/flash-fusion-loader';
import { LiteModeIndicator } from '../ui/lite-mode-indicator';
import { EnhancedHomePage } from '../pages/enhanced-home-page';
import { useRouteNavigation } from '../../hooks/use-route-navigation';
import type { AppMode } from '../../utils/system-detection';

// Import existing pages
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// Lazy load major components
const Dashboard = React.lazy(() => import('../pages/DashboardPage'));
const AIToolsHub = React.lazy(() => import('../tools/AIToolsHub'));
const ProjectsPage = React.lazy(() => import('../pages/ProjectsPage'));
const AnalyticsPage = React.lazy(() => import('../pages/AnalyticsPage'));

// Phase 1 Components
const MultiModelAIService = React.lazy(() => import('../ai/MultiModelAIService'));
const LiveCodeCollaborationHub = React.lazy(() => import('../collaboration/LiveCodeCollaborationHub'));
const AdvancedCICDPipeline = React.lazy(() => import('../cicd/AdvancedCICDPipeline'));

// Workflow Components
const AICreationWorkflow = React.lazy(() => import('../workflows/AICreationWorkflow'));
const OneClickPublishingWorkflow = React.lazy(() => import('../workflows/OneClickPublishingWorkflow'));
const CreatorCommerceWorkflow = React.lazy(() => import('../workflows/CreatorCommerceWorkflow'));
const EnterpriseSecurityWorkflow = React.lazy(() => import('../workflows/EnterpriseSecurityWorkflow'));
const SmartAnalyticsWorkflow = React.lazy(() => import('../workflows/SmartAnalyticsWorkflow'));
const QualityAssuranceWorkflow = React.lazy(() => import('../workflows/QualityAssuranceWorkflow'));

interface FlashFusionInterfaceProps {
  mode: AppMode;
}

export const FlashFusionInterface = memo(({ mode }: FlashFusionInterfaceProps) => {
  const { currentRoute, isTransitioning, navigateToRoute } = useRouteNavigation();

  const renderMainContent = () => {
    if (isTransitioning) {
      return <FlashFusionLoader message="Loading..." detail="Preparing your workspace" />;
    }

    switch (currentRoute) {
      case 'home':
        return <EnhancedHomePage onNavigate={navigateToRoute} />;
      
      case 'dashboard':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Dashboard" detail="Preparing your analytics and insights" />}>
            <Dashboard />
          </Suspense>
        );
      
      case 'tools':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading AI Tools" detail="Initializing 60+ development tools" />}>
            <AIToolsHub />
          </Suspense>
        );
      
      case 'projects':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Projects" detail="Fetching your development projects" />}>
            <ProjectsPage />
          </Suspense>
        );
      
      case 'analytics':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Analytics" detail="Analyzing your development metrics" />}>
            <AnalyticsPage />
          </Suspense>
        );
      
      case 'collaboration':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Live Collaboration" detail="Initializing real-time collaborative environment" />}>
            <div className="space-y-6 ff-fade-in-up">
              <div className="grid lg:grid-cols-2 gap-6 ff-stagger-fade">
                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 ff-text-title">
                      <span>🤖</span>
                      <span>Multi-Model AI Integration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="ff-text-body mb-4">
                      Access multiple AI models with intelligent routing and fallback mechanisms
                    </p>
                    <Button 
                      onClick={() => navigateToRoute('ai-models')}
                      className="ff-btn-primary w-full"
                    >
                      Launch AI Models
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 ff-text-title">
                      <span>👥</span>
                      <span>Live Code Collaboration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="ff-text-body mb-4">
                      Real-time collaborative coding with conflict resolution and presence awareness
                    </p>
                    <Button 
                      onClick={() => navigateToRoute('live-collaboration')}
                      className="ff-btn-secondary w-full"
                    >
                      Start Collaborating
                    </Button>
                  </CardContent>
                </Card>
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
                    className="ff-btn-accent w-full"
                  >
                    Configure Pipeline
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Suspense>
        );
      
      case 'ai-models':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading AI Models" detail="Initializing multi-model AI integration" />}>
            <MultiModelAIService />
          </Suspense>
        );
      
      case 'live-collaboration':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Live Collaboration" detail="Setting up real-time collaborative environment" />}>
            <LiveCodeCollaborationHub />
          </Suspense>
        );
      
      case 'cicd-pipeline':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading CI/CD Pipeline" detail="Initializing deployment automation" />}>
            <AdvancedCICDPipeline />
          </Suspense>
        );
      
      // Workflow Routes
      case 'ai-creation':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading AI Creation" detail="Initializing AI-powered content generation" />}>
            <AICreationWorkflow onComplete={() => navigateToRoute('one-click-publishing')} />
          </Suspense>
        );
      
      case 'one-click-publishing':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Publishing Platform" detail="Setting up deployment infrastructure" />}>
            <OneClickPublishingWorkflow onComplete={() => navigateToRoute('creator-commerce')} />
          </Suspense>
        );
      
      case 'creator-commerce':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Commerce Hub" detail="Configuring revenue streams" />}>
            <CreatorCommerceWorkflow onComplete={() => navigateToRoute('enterprise-security')} />
          </Suspense>
        );
      
      case 'enterprise-security':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Security Suite" detail="Implementing enterprise-grade security" />}>
            <EnterpriseSecurityWorkflow onComplete={() => navigateToRoute('smart-analytics')} />
          </Suspense>
        );
      
      case 'smart-analytics':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Analytics Platform" detail="Setting up performance tracking" />}>
            <SmartAnalyticsWorkflow onComplete={() => navigateToRoute('quality-assurance')} />
          </Suspense>
        );
      
      case 'quality-assurance':
        return (
          <Suspense fallback={<FlashFusionLoader message="Loading Quality Assurance" detail="Configuring automated quality checks" />}>
            <QualityAssuranceWorkflow onComplete={() => navigateToRoute('dashboard')} />
          </Suspense>
        );
      
      case 'workflows':
        return (
          <div className="max-w-7xl mx-auto space-y-8 ff-fade-in-up">
            <div className="text-center space-y-4">
              <h1 className="ff-text-headline">Creator Workflows</h1>
              <p className="ff-text-body">Complete end-to-end workflows for content creation and monetization</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
              {[
                {
                  id: 'ai-creation',
                  title: 'AI-Powered Creation',
                  description: 'Generate stunning content, code, and creative assets in seconds',
                  icon: '🤖',
                  color: 'from-orange-500 to-red-500',
                  route: 'ai-creation'
                },
                {
                  id: 'one-click-publishing',
                  title: 'One-Click Publishing',
                  description: 'Deploy your creations instantly across 20+ platforms',
                  icon: '🚀',
                  color: 'from-blue-500 to-cyan-500',
                  route: 'one-click-publishing'
                },
                {
                  id: 'creator-commerce',
                  title: 'Creator Commerce',
                  description: 'Turn your creative work into revenue streams',
                  icon: '💰',
                  color: 'from-green-500 to-emerald-500',
                  route: 'creator-commerce'
                },
                {
                  id: 'enterprise-security',
                  title: 'Enterprise Security',
                  description: 'Bank-level security with end-to-end encryption',
                  icon: '🛡️',
                  color: 'from-blue-600 to-purple-600',
                  route: 'enterprise-security'
                },
                {
                  id: 'smart-analytics',
                  title: 'Smart Analytics',
                  description: 'Track performance and revenue optimization in real-time',
                  icon: '📊',
                  color: 'from-purple-500 to-pink-500',
                  route: 'smart-analytics'
                },
                {
                  id: 'quality-assurance',
                  title: 'Quality Assurance',
                  description: 'Automated quality checks for professional standards',
                  icon: '✅',
                  color: 'from-emerald-500 to-green-500',
                  route: 'quality-assurance'
                }
              ].map((workflow) => (
                <Card key={workflow.id} className="ff-card-interactive cursor-pointer" onClick={() => navigateToRoute(workflow.route)}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${workflow.color} rounded-2xl flex items-center justify-center mx-auto text-2xl`}>
                        {workflow.icon}
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="ff-text-title text-lg">{workflow.title}</h3>
                        <p className="ff-text-body text-sm">{workflow.description}</p>
                      </div>
                      <Button className="ff-btn-primary w-full">
                        Start Workflow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="ff-card-interactive p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-center space-y-4">
                <h3 className="ff-text-title">Complete Creator Journey</h3>
                <p className="ff-text-body max-w-2xl mx-auto">
                  Experience the full FlashFusion workflow from AI-powered creation to revenue generation. 
                  Each workflow builds on the previous one to create a complete creator ecosystem.
                </p>
                <Button size="lg" className="ff-btn-primary" onClick={() => navigateToRoute('ai-creation')}>
                  Start Complete Journey
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 'deployments':
        return (
          <div className="max-w-6xl mx-auto space-y-8 ff-fade-in-up">
            <div className="text-center space-y-4">
              <h1 className="ff-text-headline">Deployment Hub</h1>
              <p className="ff-text-body">Deploy your applications to 15+ platforms with one click</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
              {[
                { name: 'Vercel', icon: '▲', status: 'Ready', deploys: 23, color: 'from-black to-gray-800' },
                { name: 'Netlify', icon: '🌐', status: 'Connected', deploys: 18, color: 'from-teal-500 to-teal-600' },
                { name: 'AWS', icon: '☁️', status: 'Ready', deploys: 12, color: 'from-orange-500 to-yellow-500' },
                { name: 'Railway', icon: '🚂', status: 'Connected', deploys: 8, color: 'from-purple-500 to-purple-600' },
                { name: 'Render', icon: '🎨', status: 'Ready', deploys: 5, color: 'from-green-500 to-green-600' },
                { name: 'Heroku', icon: '🔺', status: 'Available', deploys: 0, color: 'from-purple-600 to-indigo-600' }
              ].map((platform, index) => (
                <Card key={index} className="ff-card-interactive p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mx-auto text-2xl text-white`}>
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
                      className="ff-btn-outline w-full"
                      disabled={platform.status === 'Available'}
                    >
                      {platform.status === 'Available' ? 'Setup Required' : 'Deploy Now'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="ff-card-interactive p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-center space-y-4">
                <h3 className="ff-text-title">Automated CI/CD Pipeline</h3>
                <p className="ff-text-body max-w-2xl mx-auto">
                  Set up automated deployments that trigger on every commit, with built-in testing, 
                  security scanning, and rollback capabilities.
                </p>
                <Button size="lg" className="ff-btn-primary">
                  Configure CI/CD
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 'about':
        return (
          <div className="max-w-4xl mx-auto space-y-8 ff-fade-in-up">
            <div className="text-center space-y-4">
              <h1 className="ff-text-headline">About FlashFusion</h1>
              <p className="ff-text-body">The future of AI-powered application development</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 ff-stagger-fade">
              <Card className="ff-card-interactive p-6">
                <h3 className="ff-text-title mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3 text-white ff-text-sm">🎯</span>
                  Our Mission
                </h3>
                <p className="ff-text-body">
                  To democratize application development by providing AI-powered tools that enable anyone 
                  to build production-ready applications, regardless of their technical background.
                </p>
              </Card>
              
              <Card className="ff-card-interactive p-6">
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
            
            <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
              <h3 className="ff-text-title mb-4">Ready to transform your development workflow?</h3>
              <Button size="lg" onClick={() => navigateToRoute('tools')} className="ff-btn-primary">
                Explore AI Tools
              </Button>
            </div>
          </div>
        );
      
      default:
        return <EnhancedHomePage onNavigate={navigateToRoute} />;
    }
  };

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

FlashFusionInterface.displayName = 'FlashFusionInterface';

export default FlashFusionInterface;