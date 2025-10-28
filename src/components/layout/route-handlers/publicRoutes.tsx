import { PricingPage } from '../../pages/PricingPage';
import { PricingPageWireframe } from '../../pages/PricingPageWireframe';
import { UserPersonaCards } from '../../pages/UserPersonaCards';
import { ResponsiveUIKit } from '../../architecture/ResponsiveUIKit';
import { BackendArchitectureVisualization } from '../../architecture/BackendArchitectureVisualization';
import { InfrastructureStrategyDiagram } from '../../architecture/InfrastructureStrategyDiagram';
import { DesignSystemSyncProtocol } from '../../coordination/DesignSystemSyncProtocol';
import { DevelopmentWorkflow } from '../../coordination/DevelopmentWorkflow';
import { QualityThresholdsDashboard } from '../../quality/QualityThresholdsDashboard';
import { SuccessMetricsDashboard } from '../../metrics/SuccessMetricsDashboard';
import { SecurityComplianceDashboard } from '../../compliance/SecurityComplianceDashboard';
import { ScalabilityPlanningBoard } from '../../scalability/ScalabilityPlanningBoard';
import { RecommendedTeamStructure } from '../../team/RecommendedTeamStructure';
import { CrossFunctionalCoordination } from '../../coordination/CrossFunctionalCoordination';
import { DiscoveryPhaseTimeline } from '../../roadmap/DiscoveryPhaseTimeline';
import { DevelopmentPhaseTimeline } from '../../roadmap/DevelopmentPhaseTimeline';
import { CommonBlindspotsMatrix } from '../../blindspot/CommonBlindspotsMatrix';
import { ImmediateNextActions } from '../../blindspot/ImmediateNextActions';
import { AdvancedPerformanceOptimizer } from '../../performance/AdvancedPerformanceOptimizer';
import { EnterpriseSecuritySuite } from '../../security/EnterpriseSecuritySuite';
import { AdvancedDeploymentOrchestrator } from '../../deployment/AdvancedDeploymentOrchestrator';
import { AICodeIntelligenceSystem } from '../../ai/AICodeIntelligenceSystem';
import { AdvancedCollaborationHub } from '../../collaboration/AdvancedCollaborationHub';
import { ContactPage } from '../../pages/ContactPage';

export function handlePublicRoutes(
  currentPage: PageType,
  onPageChange: (page: PageType) => void
) {
  switch (currentPage) {
    case 'pricing':
      return <PricingPage />;
    case 'pricing-wireframe':
      return <PricingPageWireframe />;
    case 'user-personas':
      return <UserPersonaCards />;
    case 'responsive-ui-kit':
      return <ResponsiveUIKit />;
    case 'backend-architecture':
      return <BackendArchitectureVisualization />;
    case 'infrastructure-strategy':
      return <InfrastructureStrategyDiagram />;
    case 'design-system-sync':
      return <DesignSystemSyncProtocol />;
    case 'development-workflow':
      return <DevelopmentWorkflow />;
    case 'quality-thresholds':
      return <QualityThresholdsDashboard />;
    case 'success-metrics':
      return <SuccessMetricsDashboard />;
    case 'security-compliance':
      return <SecurityComplianceDashboard />;
    case 'scalability-planning':
      return <ScalabilityPlanningBoard />;
    case 'team-structure':
      return <RecommendedTeamStructure />;
    case 'cross-functional-coordination':
      return <CrossFunctionalCoordination />;
    case 'discovery-phase-timeline':
      return <DiscoveryPhaseTimeline />;
    case 'development-phase-timeline':
      return <DevelopmentPhaseTimeline />;
    case 'common-blindspots':
      return <CommonBlindspotsMatrix />;
    case 'immediate-next-actions':
      return <ImmediateNextActions />;
    case 'advanced-performance':
      return <AdvancedPerformanceOptimizer />;
    case 'enterprise-security':
      return <EnterpriseSecuritySuite />;
    case 'advanced-deployment':
      return <AdvancedDeploymentOrchestrator />;
    case 'ai-code-intelligence':
      return <AICodeIntelligenceSystem />;
    case 'advanced-collaboration':
      return <AdvancedCollaborationHub />;
    case 'contact':
      return <ContactPage />;
    default:
      return null;
  }
}

export const publicRoutes: PageType[] = [
  'pricing',
  'pricing-wireframe',
  'user-personas',
  'responsive-ui-kit',
  'backend-architecture',
  'infrastructure-strategy',
  'design-system-sync',
  'development-workflow',
  'quality-thresholds',
  'success-metrics',
  'security-compliance',
  'scalability-planning',
  'team-structure',
  'cross-functional-coordination',
  'discovery-phase-timeline',
  'development-phase-timeline',
  'common-blindspots',
  'immediate-next-actions',
  'advanced-performance',
  'enterprise-security',
  'advanced-deployment',
  'ai-code-intelligence',
  'advanced-collaboration',
  'contact'
];