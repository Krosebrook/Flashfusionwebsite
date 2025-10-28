import React from 'react';
import { PageType } from '../../types';
import { RouteHandlers } from './route-handlers';

// Import FlashFusion Design System components
import { UniversalAgentDashboard } from '../agents/UniversalAgentDashboard';
import { WorkflowStatusPipeline } from '../agents/WorkflowStatusPipeline';
import { CrossPlatformIntegrationHub } from '../integrations/CrossPlatformIntegrationHub';
import { RevenueStreamDashboard } from '../analytics/RevenueStreamDashboard';
import { AIModelSelectionInterface } from '../ai/AIModelSelectionInterface';
import { MobileAgentSelector } from '../mobile/MobileAgentSelector';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { AutomationFlowBuilder } from '../automation/AutomationFlowBuilder';

// Import market differentiator components
import { NoCodeWorkflowBuilder } from '../automation/NoCodeWorkflowBuilder';
import { ContentRightsManager } from '../creator/ContentRightsManager';
import { AITrustVerificationSystem } from '../ai/AITrustVerificationSystem';
import { AIWellnessMonitor } from '../wellness/AIWellnessMonitor';
import { SecurityPostureDashboard } from '../security/SecurityPostureDashboard';

// Import fallback
import { HomePage } from '../pages/HomePage';

interface DesignSystemRouterProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isAuthenticated: boolean;
  handlers: RouteHandlers;
}

// Sample workflow data for demo purposes
const SAMPLE_WORKFLOW_STEPS = [
  {
    id: 'step-1',
    agentId: 'researcher',
    agentName: 'Researcher',
    agentColor: '#61dafb',
    taskName: 'Market Analysis',
    status: 'completed' as const,
    duration: '2m 30s',
    dependencies: []
  },
  {
    id: 'step-2',
    agentId: 'creator',
    agentName: 'Creator',
    agentColor: '#d14d21',
    taskName: 'Content Generation',
    status: 'active' as const,
    progress: 68,
    dependencies: ['step-1']
  },
  {
    id: 'step-3',
    agentId: 'optimizer',
    agentName: 'Optimizer',
    agentColor: '#10b981',
    taskName: 'Performance Optimization',
    status: 'pending' as const,
    dependencies: ['step-2']
  }
];

export function DesignSystemRouter({
  currentPage,
  setCurrentPage,
  isAuthenticated,
  handlers
}: DesignSystemRouterProps) {
  
  // Redirect to home if not authenticated
  const renderDesignSystemPage = () => {
    if (!isAuthenticated) {
      return <HomePage setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      // Design System Pages
      case 'agent-dashboard':
        return (
          <UniversalAgentDashboard
            onAgentSelect={handlers.onAgentSelect}
            selectedAgent=""
          />
        );

      case 'workflow-pipeline':
        return (
          <WorkflowStatusPipeline
            workflowId="sample-workflow"
            title="Content Creation Pipeline"
            description="Automated workflow for creating and optimizing content"
            steps={SAMPLE_WORKFLOW_STEPS}
            onStepClick={(stepId) => console.log('Step clicked:', stepId)}
          />
        );

      case 'integration-hub':
        return <CrossPlatformIntegrationHub />;

      case 'revenue-dashboard':
        return <RevenueStreamDashboard />;

      case 'ai-models':
        return <AIModelSelectionInterface />;

      case 'mobile-agents':
        return (
          <MobileAgentSelector
            onAgentSelect={handlers.onAgentSelect}
            selectedAgent=""
            onWorkflowStart={handlers.onWorkflowStart}
          />
        );

      case 'notifications':
        return <NotificationCenter />;

      case 'automation-flow':
        return <AutomationFlowBuilder />;

      // Market Differentiator Features
      case 'content-rights':
        return <ContentRightsManager />;

      case 'ai-trust':
        return <AITrustVerificationSystem />;

      case 'wellness-monitor':
        return <AIWellnessMonitor />;

      case 'no-code-workflows':
        return <NoCodeWorkflowBuilder />;

      case 'security-dashboard':
        return <SecurityPostureDashboard />;

      default:
        return null;
    }
  };

  return renderDesignSystemPage();
}