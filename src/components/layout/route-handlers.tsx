import { PageType, User, UserStats, DailyTask } from '../../types/core';
import { Project } from '../../types/project';

interface RouteProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  setShowWizard: (show: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  userStats: UserStats | null;
  projects: Project[];
  dailyTasks: DailyTask[];
  onToolUsage: (toolId: string, toolName: string) => void;
  onProjectCreated: () => void;
  onDeploy: (project: Project) => void;
}

export function renderPublicRoutes(currentPage: PageType, props: RouteProps) {
  const { setCurrentPage, isAuthenticated } = props;

  switch (currentPage) {
    case 'home':
      const { HomePage } = require('../pages/HomePage');
      return <HomePage setCurrentPage={setCurrentPage} isAuthenticated={isAuthenticated} />;
    
    case 'about':
      const { AboutPage } = require('../pages/AboutPage');
      return <AboutPage setCurrentPage={setCurrentPage} />;
    
    case 'features':
      const { FeaturesPage } = require('../pages/FeaturesPage');
      return <FeaturesPage setCurrentPage={setCurrentPage} />;
    
    case 'pricing':
      const { PricingPage } = require('../pages/PricingPage');
      return <PricingPage setCurrentPage={setCurrentPage} />;
    
    case 'testimonials':
      const { TestimonialsPage } = require('../pages/TestimonialsPage');
      return <TestimonialsPage setCurrentPage={setCurrentPage} />;
    
    case 'contact':
      const { ContactPage } = require('../pages/ContactPage');
      return <ContactPage />;
    
    case 'faq':
      const { FAQPage } = require('../pages/FAQPage');
      return <FAQPage />;
    
    case 'privacy':
      const { PrivacyPage } = require('../pages/PrivacyPage');
      return <PrivacyPage />;
    
    case 'terms':
      const { TermsPage } = require('../pages/TermsPage');
      return <TermsPage />;
    
    case 'demo':
      const { DemoPage } = require('../pages/DemoPage');
      return <DemoPage setCurrentPage={setCurrentPage} />;

    case 'tools':
      const { ToolsPage } = require('../pages/ToolsPage');
      const { selectedTool, setSelectedTool, onToolUsage, userStats } = props;
      return (
        <ToolsPage
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          setCurrentPage={setCurrentPage}
          onToolUsage={onToolUsage}
          userStats={userStats}
        />
      );
    
    case 'tool-detail':
      const { ToolDetailPage } = require('../pages/ToolDetailPage');
      const { selectedTool: toolId, onToolUsage: onToolUsageDetail, userStats: userStatsDetail } = props;
      return (
        <ToolDetailPage
          toolId={toolId}
          setCurrentPage={setCurrentPage}
          onToolUsage={onToolUsageDetail}
          userStats={userStatsDetail}
        />
      );

    default:
      return null;
  }
}

export function renderProtectedRoutes(currentPage: PageType, props: RouteProps) {
  const { 
    setCurrentPage, 
    user, 
    userStats, 
    projects, 
    dailyTasks, 
    onProjectCreated, 
    onDeploy, 
    setShowWizard 
  } = props;

  switch (currentPage) {
    case 'dashboard':
      const { DashboardPage } = require('../pages/DashboardPage');
      return (
        <DashboardPage
          userStats={userStats}
          projects={projects}
          dailyTasks={dailyTasks}
          onProjectCreated={onProjectCreated}
          setCurrentPage={setCurrentPage}
          setShowWizard={setShowWizard}
        />
      );
    
    case 'projects':
      const { ProjectsPage } = require('../pages/ProjectsPage');
      return (
        <ProjectsPage
          projects={projects}
          userStats={userStats}
          onDeploy={onDeploy}
          setCurrentPage={setCurrentPage}
          onProjectCreated={onProjectCreated}
        />
      );
    
    case 'templates':
      const { TemplatesPage } = require('../pages/TemplatesPage');
      return <TemplatesPage setCurrentPage={setCurrentPage} />;
    
    case 'deployments':
      const { DeploymentsPage } = require('../pages/DeploymentsPage');
      return (
        <DeploymentsPage
          projects={projects}
          userStats={userStats}
        />
      );
    
    case 'analytics':
      const { AnalyticsPage } = require('../pages/AnalyticsPage');
      return (
        <AnalyticsPage
          projects={projects}
          userStats={userStats}
        />
      );
    
    case 'collaboration':
      const { CollaborationPage } = require('../pages/CollaborationPage');
      return <CollaborationPage user={user} />;
    
    case 'integrations':
      const { IntegrationsPage } = require('../pages/IntegrationsPage');
      return <IntegrationsPage userStats={userStats} />;
    
    case 'cicd':
      const { CICDPage } = require('../pages/CICDPage');
      return <CICDPage projects={projects} />;
    
    case 'settings':
      const { SettingsPage } = require('../pages/SettingsPage');
      return <SettingsPage user={user} userStats={userStats} />;

    default:
      return null;
  }
}

export function renderSpecializedRoutes(currentPage: PageType, props: RouteProps) {
  const { setCurrentPage, user, userStats, projects } = props;

  switch (currentPage) {
    case 'creator-content-pipeline':
      const { CreatorContentPipelinePage } = require('../pages/CreatorContentPipelinePage');
      return <CreatorContentPipelinePage />;

    case 'multi-agent-orchestration':
      const { MultiAgentOrchestrationPage } = require('../pages/MultiAgentOrchestrationPage');
      return (
        <MultiAgentOrchestrationPage
          userStats={userStats}
          user={user}
        />
      );

    // FlashFusion Studio Routes
    case 'studio-analytics-behavior':
      const { default: StudioUserBehaviorTracker } = require('../studio/analytics/StudioUserBehaviorTracker');
      return <StudioUserBehaviorTracker />;

    case 'studio-ai-optimization':
      const { default: AIModelOptimizationService } = require('../studio/ai/AIModelOptimizationService');
      return <AIModelOptimizationService />;

    case 'gamification':
      const { GamificationHub } = require('../gamification/GamificationHub');
      const { dailyTasks } = props;
      return (
        <GamificationHub
          userStats={userStats}
          dailyTasks={dailyTasks}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'creator-mode':
      const { CreatorModeHub } = require('../creator/CreatorModeHub');
      return (
        <CreatorModeHub
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'influencer-suite':
      const { InfluencerSuite } = require('../influencer/InfluencerSuite');
      return (
        <InfluencerSuite
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'print-on-demand':
      const { PrintDesignSuite } = require('../print-on-demand/PrintDesignSuite');
      return (
        <PrintDesignSuite
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'marketplace-manager':
      const { MarketplaceManager } = require('../print-on-demand/MarketplaceManager');
      return (
        <MarketplaceManager
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'agents':
      const { UniversalAgentDashboard } = require('../agents/UniversalAgentDashboard');
      return (
        <UniversalAgentDashboard
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'community':
      const { CommunityHub } = require('../community/CommunityHub');
      return (
        <CommunityHub
          user={user}
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'performance':
      const { PerformanceOptimizer } = require('../performance/PerformanceOptimizer');
      return (
        <PerformanceOptimizer
          projects={projects}
          userStats={userStats}
        />
      );
    
    case 'security':
      const { SecurityPostureDashboard } = require('../security/SecurityPostureDashboard');
      return (
        <SecurityPostureDashboard
          projects={projects}
          userStats={userStats}
        />
      );
    
    case 'wellness':
      const { AIWellnessMonitor } = require('../wellness/AIWellnessMonitor');
      return (
        <AIWellnessMonitor
          user={user}
          userStats={userStats}
        />
      );
    
    case 'workflows':
      const { NoCodeWorkflowBuilder } = require('../automation/NoCodeWorkflowBuilder');
      return (
        <NoCodeWorkflowBuilder
          userStats={userStats}
          setCurrentPage={setCurrentPage}
        />
      );
    
    case 'content-rights':
      const { ContentRightsManager } = require('../creator/ContentRightsManager');
      return (
        <ContentRightsManager
          user={user}
          userStats={userStats}
        />
      );
    
    case 'ai-trust':
      const { AITrustVerificationSystem } = require('../ai/AITrustVerificationSystem');
      return (
        <AITrustVerificationSystem
          user={user}
          userStats={userStats}
        />
      );

    default:
      return null;
  }
}