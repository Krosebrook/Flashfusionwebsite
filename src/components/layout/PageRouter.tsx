import React, { Suspense, lazy } from 'react';
import { FullPageLoader } from '../ui/loading-states';
import { ErrorBoundary } from '../ErrorBoundary';
import type { PageType } from '../../types/core';

// Import route handlers
import { handleValidatorRoutes } from './route-handlers/validatorRoutes';
import { handleValidationRoutes } from './route-handlers/validationRoutes';
import { handleCreatorRoutes } from './route-handlers/creatorRoutes';
import { handleCoreSystemRoutes } from './route-handlers/coreSystemRoutes';

// Enhanced lazy loading with proper error handling and fallbacks
const createLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      
      // Try default export first
      if (module.default) {
        return { default: module.default };
      }
      
      // Try named export matching component name
      if (module[componentName]) {
        return { default: module[componentName] };
      }
      
      // Fallback to first available export
      const exportNames = Object.keys(module).filter(key => key !== 'default');
      if (exportNames.length > 0) {
        return { default: module[exportNames[0]] };
      }
      
      throw new Error(`No valid export found for ${componentName}`);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      
      // Return a fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-destructive">
                Component Load Error
              </h2>
              <p className="text-muted-foreground">
                Failed to load {componentName}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="ff-btn-primary px-4 py-2 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      };
    }
  });
};

// Page components with enhanced error handling
const HomePage = createLazyComponent(() => import('../pages/HomePage'), 'HomePage');
const ToolsPage = createLazyComponent(() => import('../pages/ToolsPage'), 'ToolsPage');
const ProjectsPage = createLazyComponent(() => import('../pages/ProjectsPage'), 'ProjectsPage');
const DashboardPage = createLazyComponent(() => import('../pages/DashboardPage'), 'DashboardPage');
const SettingsPage = createLazyComponent(() => import('../pages/SettingsPage'), 'SettingsPage');
const PricingPage = createLazyComponent(() => import('../pages/PricingPage'), 'PricingPage');
const AboutPage = createLazyComponent(() => import('../pages/AboutPage'), 'AboutPage');
const ContactPage = createLazyComponent(() => import('../pages/ContactPage'), 'ContactPage');
const FeaturesPage = createLazyComponent(() => import('../pages/FeaturesPage'), 'FeaturesPage');
const TestimonialsPage = createLazyComponent(() => import('../pages/TestimonialsPage'), 'TestimonialsPage');
const FAQPage = createLazyComponent(() => import('../pages/FAQPage'), 'FAQPage');
const PrivacyPage = createLazyComponent(() => import('../pages/PrivacyPage'), 'PrivacyPage');
const TermsPage = createLazyComponent(() => import('../pages/TermsPage'), 'TermsPage');
const NotFoundPage = createLazyComponent(() => import('../pages/NotFoundPage'), 'NotFoundPage');

// Tool components with enhanced error handling
const CodeGenerator = createLazyComponent(() => import('../generation/CodeGenerator'), 'CodeGenerator');
const FullStackBuilderTool = createLazyComponent(() => import('../tools/FullStackBuilderTool'), 'FullStackBuilderTool');
const ContentGeneratorTool = createLazyComponent(() => import('../tools/ContentGeneratorTool'), 'ContentGeneratorTool');
const CreatorCommerceHub = createLazyComponent(() => import('../creator/CreatorCommerceHub'), 'CreatorCommerceHub');
const ContentCreationHub = createLazyComponent(() => import('../creator/ContentCreationHub'), 'ContentCreationHub');
const CICDPipelineIntegration = createLazyComponent(() => import('../cicd/CICDPipelineIntegration'), 'CICDPipelineIntegration');

// System components with enhanced error handling
const GlobalSearchPalette = createLazyComponent(() => import('../search/GlobalSearchPalette'), 'GlobalSearchPalette');
const UserProfileHub = createLazyComponent(() => import('../user/UserProfileHub'), 'UserProfileHub');
const NotificationCenter = createLazyComponent(() => import('../notifications/NotificationCenter'), 'NotificationCenter');

// Additional page components
const AnalyticsPage = createLazyComponent(() => import('../pages/AnalyticsPage'), 'AnalyticsPage');
const DemoPage = createLazyComponent(() => import('../pages/DemoPage'), 'DemoPage');
const DeploymentsPage = createLazyComponent(() => import('../pages/DeploymentsPage'), 'DeploymentsPage');
const CollaborationPage = createLazyComponent(() => import('../pages/CollaborationPage'), 'CollaborationPage');
const IntegrationsPage = createLazyComponent(() => import('../pages/IntegrationsPage'), 'IntegrationsPage');
const MultiAgentOrchestrationPage = createLazyComponent(() => import('../pages/MultiAgentOrchestrationPage'), 'MultiAgentOrchestrationPage');
const TemplatesPage = createLazyComponent(() => import('../pages/TemplatesPage'), 'TemplatesPage');
const ToolDetailPage = createLazyComponent(() => import('../pages/ToolDetailPage'), 'ToolDetailPage');

// Showcase components
const FlashFusionPlatformShowcase = createLazyComponent(() => import('../showcase/FlashFusionPlatformShowcase'), 'FlashFusionPlatformShowcase');

// Launch-ready optimization components
const OptimizedOnboardingFlow = createLazyComponent(() => import('../onboarding/OptimizedOnboardingFlow'), 'OptimizedOnboardingFlow');
const LaunchPerformanceDashboard = createLazyComponent(() => import('../performance/LaunchPerformanceDashboard'), 'LaunchPerformanceDashboard');
const ErrorRecoverySystem = createLazyComponent(() => import('../stability/ErrorRecoverySystemFixed'), 'ErrorRecoverySystem');
const UserEngagementHub = createLazyComponent(() => import('../engagement/UserEngagementHub'), 'UserEngagementHub');
const MobileOptimizationCenter = createLazyComponent(() => import('../mobile/MobileOptimizationCenter'), 'MobileOptimizationCenter');
const SEOOptimizationSuite = createLazyComponent(() => import('../seo/SEOOptimizationSuite'), 'SEOOptimizationSuite');
const CommunityFeedbackHub = createLazyComponent(() => import('../community/CommunityFeedbackHub'), 'CommunityFeedbackHub');
const LaunchDayCommand = createLazyComponent(() => import('../launch/LaunchDayCommandFixed'), 'LaunchDayCommand');

// Testing, monitoring, and launch preparation components
const LaunchStabilityTester = createLazyComponent(() => import('../testing/LaunchStabilityTester'), 'LaunchStabilityTester');
const AdvancedMonitoringSystem = createLazyComponent(() => import('../monitoring/AdvancedMonitoringSystem'), 'AdvancedMonitoringSystem');
const LaunchMarketingCampaign = createLazyComponent(() => import('../marketing/LaunchMarketingCampaign'), 'LaunchMarketingCampaign');
const LaunchDayPreparationChecklist = createLazyComponent(() => import('../launch/LaunchDayPreparationChecklist'), 'LaunchDayPreparationChecklist');

// Launch readiness demo component
const LaunchReadinessDemo = createLazyComponent(() => import('../pages/LaunchReadinessDemo'), 'LaunchReadinessDemo');

// Pricing and FAQ demo component
const PricingFAQDemoPage = createLazyComponent(() => import('../pages/PricingFAQDemoPage'), 'PricingFAQDemoPage');

// Enhanced performance and security components
const RealTimePerformanceMonitor = createLazyComponent(() => import('../performance/RealTimePerformanceMonitor'), 'RealTimePerformanceMonitor');
const ComprehensiveSecurityScanner = createLazyComponent(() => import('../security/ComprehensiveSecurityScanner'), 'ComprehensiveSecurityScanner');
const SecurityPage = createLazyComponent(() => import('../pages/SecurityPage'), 'SecurityPage');
const PremiumMicroInteractions = createLazyComponent(() => import('../ui/PremiumMicroInteractions'), 'PremiumMicroInteractions');
const IntelligentAnalyticsDashboard = createLazyComponent(() => import('../analytics/IntelligentAnalyticsDashboard'), 'IntelligentAnalyticsDashboard');
const SmartOptimizationEngine = createLazyComponent(() => import('../performance/SmartOptimizationEngine'), 'SmartOptimizationEngine');
const PerformanceSecurityShowcase = createLazyComponent(() => import('../pages/PerformanceSecurityShowcase'), 'PerformanceSecurityShowcase');

// Fallback component for missing pages
const MissingPageComponent = ({ pageName }: { pageName: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-6 max-w-md mx-auto px-6">
      <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Page Under Construction
        </h2>
        <p className="text-muted-foreground">
          The {pageName} page is currently being built. Please check back soon!
        </p>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="ff-btn-primary px-6 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  </div>
);

interface PageRouterProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
}

export function PageRouter({ currentPage, isAuthenticated, onPageChange }: PageRouterProps) {
  const renderPage = () => {
    // Handle hash-based routing for tools with error boundaries
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('/tools/')) {
      const toolRoute = hash.replace('/tools/', '');
      
      try {
        switch (toolRoute) {
          case 'code-generator':
          case 'react-builder':
          case 'api-generator':
            return (
              <ErrorBoundary>
                <CodeGenerator />
              </ErrorBoundary>
            );
          case 'ecommerce-generator':
          case 'ecommerce-store':
          case 'product-catalog':
          case 'payment-setup':
            return (
              <ErrorBoundary>
                <CreatorCommerceHub />
              </ErrorBoundary>
            );
          case 'content-generator':
          case 'blog-writer':
          case 'social-media':
            return (
              <ErrorBoundary>
                <ContentCreationHub />
              </ErrorBoundary>
            );
          case 'cicd-pipeline':
          case 'docker-setup':
            return (
              <ErrorBoundary>
                <CICDPipelineIntegration />
              </ErrorBoundary>
            );
          default:
            return (
              <ErrorBoundary>
                <ToolsPage />
              </ErrorBoundary>
            );
        }
      } catch (error) {
        console.error('Tool routing error:', error);
        return <MissingPageComponent pageName={toolRoute} />;
      }
    }

    // Check route handlers first
    try {
      // Try validator routes
      const validatorRoute = handleValidatorRoutes(currentPage, isAuthenticated);
      if (validatorRoute) {
        return <ErrorBoundary>{validatorRoute}</ErrorBoundary>;
      }

      // Try validation routes
      const validationRoute = handleValidationRoutes(currentPage, isAuthenticated);
      if (validationRoute) {
        return <ErrorBoundary>{validationRoute}</ErrorBoundary>;
      }

      // Try creator routes
      const creatorRoute = handleCreatorRoutes(currentPage, isAuthenticated);
      if (creatorRoute) {
        return <ErrorBoundary>{creatorRoute}</ErrorBoundary>;
      }

      // Try core system routes
      const coreSystemRoute = handleCoreSystemRoutes(currentPage, isAuthenticated);
      if (coreSystemRoute) {
        return <ErrorBoundary>{coreSystemRoute}</ErrorBoundary>;
      }

      // Regular page routing with error boundaries
      switch (currentPage) {
        case 'home':
          return (
            <ErrorBoundary>
              <HomePage onPageChange={onPageChange} />
            </ErrorBoundary>
          );
        case 'tools':
          return (
            <ErrorBoundary>
              <ToolsPage />
            </ErrorBoundary>
          );
        case 'projects':
          return (
            <ErrorBoundary>
              <ProjectsPage onPageChange={onPageChange} />
            </ErrorBoundary>
          );
        case 'dashboard':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <DashboardPage />
            </ErrorBoundary>
          );
        case 'settings':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <SettingsPage />
            </ErrorBoundary>
          );
        case 'pricing':
          return (
            <ErrorBoundary>
              <PricingPage />
            </ErrorBoundary>
          );
        case 'about':
          return (
            <ErrorBoundary>
              <AboutPage />
            </ErrorBoundary>
          );
        case 'contact':
          return (
            <ErrorBoundary>
              <ContactPage />
            </ErrorBoundary>
          );
        case 'features':
          return (
            <ErrorBoundary>
              <FeaturesPage />
            </ErrorBoundary>
          );
        case 'testimonials':
          return (
            <ErrorBoundary>
              <TestimonialsPage />
            </ErrorBoundary>
          );
        case 'faq':
          return (
            <ErrorBoundary>
              <FAQPage />
            </ErrorBoundary>
          );
        case 'privacy':
          return (
            <ErrorBoundary>
              <PrivacyPage />
            </ErrorBoundary>
          );
        case 'terms':
          return (
            <ErrorBoundary>
              <TermsPage />
            </ErrorBoundary>
          );
        
        // System Components
        case 'search':
          return (
            <ErrorBoundary>
              <GlobalSearchPalette onClose={() => onPageChange('home')} />
            </ErrorBoundary>
          );
        case 'profile':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <UserProfileHub />
            </ErrorBoundary>
          );
        case 'notifications':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <NotificationCenter />
            </ErrorBoundary>
          );
        
        // Additional pages
        case 'analytics':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <AnalyticsPage />
            </ErrorBoundary>
          );
        case 'demo':
          return (
            <ErrorBoundary>
              <DemoPage />
            </ErrorBoundary>
          );
        case 'deployments':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <DeploymentsPage />
            </ErrorBoundary>
          );
        case 'collaboration':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <CollaborationPage currentUserId="current-user" />
            </ErrorBoundary>
          );
        case 'integrations':
          return (
            <ErrorBoundary>
              <IntegrationsPage />
            </ErrorBoundary>
          );
        case 'multi-agent-orchestration':
          if (!isAuthenticated) {
            return (
              <ErrorBoundary>
                <HomePage onPageChange={onPageChange} />
              </ErrorBoundary>
            );
          }
          return (
            <ErrorBoundary>
              <MultiAgentOrchestrationPage />
            </ErrorBoundary>
          );
        case 'templates':
          return (
            <ErrorBoundary>
              <TemplatesPage />
            </ErrorBoundary>
          );
        case 'tool-detail':
          return (
            <ErrorBoundary>
              <ToolDetailPage />
            </ErrorBoundary>
          );
        case 'showcase':
          return (
            <ErrorBoundary>
              <FlashFusionPlatformShowcase />
            </ErrorBoundary>
          );
        
        // Tool-specific routes
        case 'code-generator':
          return (
            <ErrorBoundary>
              <FullStackBuilderTool />
            </ErrorBoundary>
          );
        case 'full-stack-builder':
        case 'full-stack-app-builder':
          return (
            <ErrorBoundary>
              <FullStackBuilderTool />
            </ErrorBoundary>
          );
        case 'ecommerce-generator':
          return (
            <ErrorBoundary>
              <CreatorCommerceHub />
            </ErrorBoundary>
          );
        case 'content-generator':
          return (
            <ErrorBoundary>
              <ContentGeneratorTool />
            </ErrorBoundary>
          );
        case 'content-creation':
          return (
            <ErrorBoundary>
              <ContentCreationHub />
            </ErrorBoundary>
          );
        case 'cicd-pipeline':
          return (
            <ErrorBoundary>
              <CICDPipelineIntegration />
            </ErrorBoundary>
          );
        
        // Launch optimization components
        case 'onboarding-optimization':
          return (
            <ErrorBoundary>
              <OptimizedOnboardingFlow 
                onComplete={(data) => {
                  console.log('Onboarding completed:', data);
                  onPageChange('dashboard');
                }}
                onSkip={() => onPageChange('dashboard')}
              />
            </ErrorBoundary>
          );
        case 'performance-dashboard':
          return (
            <ErrorBoundary>
              <LaunchPerformanceDashboard />
            </ErrorBoundary>
          );
        case 'error-recovery':
          return (
            <ErrorBoundary>
              <ErrorRecoverySystem />
            </ErrorBoundary>
          );
        case 'engagement-hub':
          return (
            <ErrorBoundary>
              <UserEngagementHub />
            </ErrorBoundary>
          );
        case 'mobile-optimization':
          return (
            <ErrorBoundary>
              <MobileOptimizationCenter />
            </ErrorBoundary>
          );
        case 'seo-optimization':
          return (
            <ErrorBoundary>
              <SEOOptimizationSuite />
            </ErrorBoundary>
          );
        case 'community-feedback':
          return (
            <ErrorBoundary>
              <CommunityFeedbackHub />
            </ErrorBoundary>
          );
        case 'launch-command':
          return (
            <ErrorBoundary>
              <LaunchDayCommand />
            </ErrorBoundary>
          );
        
        // Testing, monitoring, and launch preparation
        case 'stability-testing':
          return (
            <ErrorBoundary>
              <LaunchStabilityTester />
            </ErrorBoundary>
          );
        case 'monitoring-system':
          return (
            <ErrorBoundary>
              <AdvancedMonitoringSystem />
            </ErrorBoundary>
          );
        case 'marketing-campaign':
          return (
            <ErrorBoundary>
              <LaunchMarketingCampaign />
            </ErrorBoundary>
          );
        case 'launch-preparation':
          return (
            <ErrorBoundary>
              <LaunchDayPreparationChecklist />
            </ErrorBoundary>
          );
        case 'launch-readiness-demo':
          return (
            <ErrorBoundary>
              <LaunchReadinessDemo />
            </ErrorBoundary>
          );
        case 'pricing-faq-demo':
          return (
            <ErrorBoundary>
              <PricingFAQDemoPage />
            </ErrorBoundary>
          );
        
        // Enhanced Performance & Security Components
        case 'performance-monitor':
          return (
            <ErrorBoundary>
              <RealTimePerformanceMonitor />
            </ErrorBoundary>
          );
        case 'security':
        case 'security-center':
        case 'security-dashboard':
          return (
            <ErrorBoundary>
              <SecurityPage />
            </ErrorBoundary>
          );
        case 'security-scanner':
          return (
            <ErrorBoundary>
              <ComprehensiveSecurityScanner />
            </ErrorBoundary>
          );
        case 'micro-interactions':
          return (
            <ErrorBoundary>
              <PremiumMicroInteractions />
            </ErrorBoundary>
          );
        case 'intelligent-analytics':
          return (
            <ErrorBoundary>
              <IntelligentAnalyticsDashboard />
            </ErrorBoundary>
          );
        case 'optimization-engine':
          return (
            <ErrorBoundary>
              <SmartOptimizationEngine />
            </ErrorBoundary>
          );
        case 'performance-security-showcase':
          return (
            <ErrorBoundary>
              <PerformanceSecurityShowcase onNavigateToTool={onPageChange} />
            </ErrorBoundary>
          );
        
        // Not Found
        case 'not-found':
          return (
            <ErrorBoundary>
              <NotFoundPage />
            </ErrorBoundary>
          );
        
        default:
          console.warn(`Unknown page: ${currentPage}`);
          return (
            <ErrorBoundary>
              <NotFoundPage />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error('Page routing error:', error);
      return <MissingPageComponent pageName={currentPage} />;
    }
  };

  return (
    <div className="min-h-screen" id="main-content">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 ff-fade-in-up max-w-md mx-auto px-6">
              <FullPageLoader message="Loading page..." />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Preparing your FlashFusion experience...
                </p>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="ff-progress-bar h-1 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default PageRouter;