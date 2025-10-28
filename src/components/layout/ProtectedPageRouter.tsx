import React from 'react';
import { PageType } from '../../types';
import { RouteProps } from './route-handlers';

// Import protected pages
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { IntegrationsPage } from '../pages/IntegrationsPage';
import { DeploymentsPage } from '../pages/DeploymentsPage';
import { TemplatesPage } from '../pages/TemplatesPage';
import { CollaborationPage } from '../pages/CollaborationPage';
import { CICDPage } from '../pages/CICDPage';

// Import feature components
import { ProductionAnalytics } from '../analytics/ProductionAnalytics';
import { SubscriptionSystem } from '../monetization/SubscriptionSystem';
import { LaunchCampaign } from '../marketing/LaunchCampaign';
import { HomePage } from '../pages/HomePage';

interface ProtectedPageRouterProps extends Omit<RouteProps, 'handlers'> {
  onToolUsage: (toolId: string) => void;
  onProjectCreated: () => void;
  onDeploy: () => void;
}

export function ProtectedPageRouter({
  currentPage,
  setCurrentPage,
  setShowWizard,
  isAuthenticated,
  user,
  userStats,
  projects,
  dailyTasks,
  onToolUsage,
  onProjectCreated,
  onDeploy
}: ProtectedPageRouterProps) {
  
  // Redirect to home if not authenticated
  const renderProtectedPage = () => {
    if (!isAuthenticated) {
      return <HomePage setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage 
            user={user}
            userStats={userStats}
            projects={projects}
            dailyTasks={dailyTasks}
            setCurrentPage={setCurrentPage}
            setShowWizard={setShowWizard}
          />
        );

      case 'projects':
        return (
          <ProjectsPage
            projects={projects}
            onProjectCreated={onProjectCreated}
            onDeploy={onDeploy}
            setCurrentPage={setCurrentPage}
          />
        );

      case 'analytics':
        return (
          <AnalyticsPage
            projects={projects}
            userStats={userStats}
          />
        );

      case 'production-analytics':
        return <ProductionAnalytics />;

      case 'settings':
        return <SettingsPage user={user} />;

      case 'integrations':
        return <IntegrationsPage />;

      case 'deployments':
        return (
          <DeploymentsPage
            projects={projects}
            onDeploy={onDeploy}
          />
        );

      case 'templates':
        return (
          <TemplatesPage
            setCurrentPage={setCurrentPage}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'collaboration':
        return <CollaborationPage />;

      case 'cicd':
        return <CICDPage />;

      case 'subscription':
        return <SubscriptionSystem user={user} />;

      case 'launch-campaign':
        return <LaunchCampaign />;

      default:
        return null;
    }
  };

  return renderProtectedPage();
}