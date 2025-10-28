import { useState, useEffect } from 'react';
import { DemoBanner } from '../ui/demo-banner';
import { ConfigDebugPanel } from '../ui/config-debug';
import { ConnectionStatus, FullPageLoader } from '../ui/loading-states';

// Layout and state components
import { LayoutStateManager } from '../layout/LayoutStateManager';
import { ApplicationShell } from '../layout/ApplicationShell';
import { PageRouter } from '../layout/PageRouter';
import { AppWizardModal } from '../layout/AppWizardModal';

// Feature components
import { OnboardingFlow, useOnboarding } from '../onboarding/OnboardingFlow';

// Hooks and utilities
import { useLayoutState } from '../layout/LayoutStateManager';

// Types
import { PageType } from '../../types/core';

/**
 * Main application content controller
 * Handles initialization, data loading, and core application logic
 */
function ApplicationContent() {
  const { 
    currentPage, 
    showWizard, 
    selectedTool,
    setCurrentPage,
    setShowWizard,
    setSelectedTool
  } = useLayoutState();
  
  // Onboarding state
  const { 
    isOnboardingOpen, 
    completeOnboarding, 
    closeOnboarding 
  } = useOnboarding();

  // Simplified app state - TODO: Connect to real hooks when they exist
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0 });
  
  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Simple event handlers
  const handleWizardComplete = () => {
    setShowWizard(false);
    console.log('Wizard completed');
  };

  const handleToolUsage = (toolId: string) => {
    console.log('Tool used:', toolId);
  };

  const handleDeploy = (projectId: string) => {
    console.log('Project deployed:', projectId);
  };

  // Show loading screen while initializing
  if (isLoading) {
    return <FullPageLoader message="Loading FlashFusion..." />;
  }

  return (
    <>
      <ConnectionStatus />
      <DemoBanner />
      
      <ApplicationShell>
        <PageRouter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          setShowWizard={setShowWizard}
          isAuthenticated={isAuthenticated}
          user={user}
          userStats={userStats}
          projects={projects}
          dailyTasks={dailyTasks}
          onToolUsage={handleToolUsage}
          onProjectCreated={refreshProjects}
          onDeploy={handleDeploy}
        />
      </ApplicationShell>

      {/* Modal Components */}
      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
        userLevel={userStats?.level}
        setCurrentPage={setCurrentPage}
        setShowWizard={setShowWizard}
      />

      <AppWizardModal
        showWizard={showWizard}
        setShowWizard={setShowWizard}
        onComplete={handleWizardComplete}
      />

      {/* Development Configuration Debug Panel */}
      <ConfigDebugPanel />
    </>
  );
}

interface ApplicationControllerProps {
  initialPage?: PageType;
}

/**
 * Application controller with layout state management
 */
export function ApplicationController({ initialPage = 'home' }: ApplicationControllerProps) {
  return (
    <LayoutStateManager initialPage={initialPage}>
      <ApplicationContent />
    </LayoutStateManager>
  );
}