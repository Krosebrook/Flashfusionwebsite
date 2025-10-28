import { useCallback } from 'react';
import { PageType } from '../types';
import { XP_REWARDS } from '../lib/app-constants';

interface UseAppHandlersParams {
  user: any;
  userStats: any;
  projects: any[];
  setShowWizard: (show: boolean) => void;
  setCurrentPage: (page: PageType) => void;
  awardXP: (amount: number, description: string, category: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  trackToolUsage: (toolId: string) => void;
  trackEvent: (event: string, data: any) => void;
}

export function useAppHandlers({
  user,
  userStats,
  projects,
  setShowWizard,
  setCurrentPage,
  awardXP,
  refreshProjects,
  trackToolUsage,
  trackEvent
}: UseAppHandlersParams) {

  const handleWizardComplete = useCallback(async () => {
    setShowWizard(false);
    setCurrentPage('projects');
    
    try {
      if (user && projects.length === 0) {
        await awardXP(XP_REWARDS.FIRST_PROJECT_SETUP, 'First Project Setup', 'create_project');
      }
      await refreshProjects();
      
      // Track wizard completion
      trackEvent('Wizard Completed', {
        userId: user?.id,
        completionTime: Date.now(),
        projectType: 'first-project'
      });
    } catch (error) {
      console.error('Error completing wizard:', error);
    }
  }, [user, projects, setShowWizard, setCurrentPage, awardXP, refreshProjects, trackEvent]);

  const handleToolUsage = useCallback(async (toolId: string) => {
    if (!user) return;
    
    try {
      await awardXP(XP_REWARDS.TOOL_USAGE, `Used tool: ${toolId}`, 'use_ai_tools');
      trackToolUsage(toolId);
      
      // Track enhanced tool usage metrics
      trackEvent('Tool Usage', {
        toolId,
        userId: user.id,
        userLevel: userStats?.level,
        subscriptionTier: user.subscription_tier || 'free',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
    }
  }, [user, userStats, awardXP, trackToolUsage, trackEvent]);

  const handleDeploy = useCallback(async () => {
    if (user) {
      try {
        await awardXP(XP_REWARDS.PROJECT_DEPLOYMENT, 'Project Deployment', 'deploy_project');
        
        // Track deployment with enhanced metrics
        trackEvent('Project Deployed', {
          userId: user.id,
          userLevel: userStats?.level,
          subscriptionTier: user.subscription_tier || 'free',
          deploymentTime: Date.now()
        });
      } catch (error) {
        console.error('Error awarding deployment XP:', error);
      }
    }
  }, [user, userStats, awardXP, trackEvent]);

  return {
    handleWizardComplete,
    handleToolUsage,
    handleDeploy
  };
}