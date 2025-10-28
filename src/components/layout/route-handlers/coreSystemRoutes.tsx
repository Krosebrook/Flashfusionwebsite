import { lazy } from 'react';
import type { PageType } from '../../../types/core';

// Only import components that actually exist
const NotificationCenter = lazy(() => import('../../notifications/NotificationCenter'));
const UserProfileHub = lazy(() => import('../../user/UserProfileHub'));
const GlobalSearchPalette = lazy(() => import('../../search/GlobalSearchPalette'));
const FlashFusionBusinessIntelligenceHub = lazy(() => import('../../analytics/FlashFusionBusinessIntelligenceHub'));
const ExternalAppIntegrationHub = lazy(() => import('../../integrations/ExternalAppIntegrationHub'));

export function handleCoreSystemRoutes(
  currentPage: PageType,
  isAuthenticated: boolean
) {
  switch (currentPage) {
    case 'notifications':
      return <NotificationCenter />;
    
    case 'profile':
      return <UserProfileHub />;
    
    case 'search':
      return <GlobalSearchPalette />;
    
    case 'plugins':
      return isAuthenticated ? <PluginManagerPlaceholder /> : null;
    
    case 'data-hub':
      return isAuthenticated ? <DataImportExportHubPlaceholder /> : null;
    
    case 'insights':
      return isAuthenticated ? <FlashFusionBusinessIntelligenceHub /> : null;
    
    case 'business-intelligence':
      return isAuthenticated ? <FlashFusionBusinessIntelligenceHub /> : null;
    
    case 'workspace':
      return isAuthenticated ? <CrossAppWorkspacePlaceholder /> : null;
    
    case 'external-integrations':
      return isAuthenticated ? <ExternalAppIntegrationHub /> : null;
    
    case 'repository-hub':
      return isAuthenticated ? <RepositoryServiceHubPlaceholder /> : null;
    
    default:
      return null;
  }
}

export const coreSystemRoutes: PageType[] = [
  'notifications',
  'profile', 
  'search',
  'plugins',
  'data-hub',
  'insights',
  'business-intelligence',
  'workspace',
  'external-integrations',
  'repository-hub'
];

// Placeholder components for missing core system apps
function PluginManagerPlaceholder() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h1 className="ff-text-gradient">Plugin Manager</h1>
        <p className="text-muted-foreground">
          Manage your FlashFusion extensions and integrations.
        </p>
        <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8">
          <p className="text-muted-foreground">Plugin Manager component coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function DataImportExportHubPlaceholder() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h1 className="ff-text-gradient">Data Import/Export Hub</h1>
        <p className="text-muted-foreground">
          Import, export, and sync your data across platforms.
        </p>
        <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8">
          <p className="text-muted-foreground">Data Hub component coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsInsightsDashboardPlaceholder() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h1 className="ff-text-gradient">Analytics & Insights Dashboard</h1>
        <p className="text-muted-foreground">
          Advanced analytics and reporting for your projects.
        </p>
        <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8">
          <p className="text-muted-foreground">Analytics Dashboard component coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function CrossAppWorkspacePlaceholder() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h1 className="ff-text-gradient">Cross-App Workspace</h1>
        <p className="text-muted-foreground">
          Unified workspace for managing all your FlashFusion applications.
        </p>
        <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8">
          <p className="text-muted-foreground">Cross-App Workspace component coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function RepositoryServiceHubPlaceholder() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center space-y-4">
        <h1 className="ff-text-gradient">Repository & Service Hub</h1>
        <p className="text-muted-foreground">
          Connect GitHub, Vercel, Supabase, Notion, and manage your development workflow.
        </p>
        <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8">
          <p className="text-muted-foreground">Repository Service Hub available - check /components/repository/</p>
        </div>
      </div>
    </div>
  );
}