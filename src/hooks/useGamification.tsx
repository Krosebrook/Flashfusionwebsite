import { useState, useEffect, useCallback } from 'react';
import { GamificationService, type UserStats, type Achievement } from '../services/GamificationService';
import { toast } from 'sonner';

interface UseGamificationReturn {
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  addXP: (points: number, source: string, action: string, metadata?: Record<string, any>) => Promise<void>;
  recordToolUsage: (toolName: string, isFirstTime?: boolean) => Promise<void>;
  recordProjectCompletion: (projectName: string, projectType: string) => Promise<void>;
  recordCodeGeneration: (codeType: string, linesGenerated: number) => Promise<void>;
  recordDailyLogin: () => Promise<void>;
  unlockSpecialAchievement: (achievementId: string) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

export function useGamification(userId?: string): UseGamificationReturn {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or create user ID
  const currentUserId = userId || (() => {
    const existing = localStorage.getItem('user_id');
    if (existing) return existing;
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', newId);
    return newId;
  })();

  // Load user stats
  const refreshStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await GamificationService.getUserStats(currentUserId);
      setUserStats(stats);
      
      // If no stats returned, create initial stats
      if (!stats) {
        // Create initial user stats locally
        const initialStats = {
          user_id: currentUserId,
          total_xp: 0,
          level: 1,
          current_level_xp: 0,
          next_level_xp: 100,
          achievements_unlocked: [],
          badges_earned: [],
          streak_days: 1,
          last_activity_date: new Date().toISOString().split('T')[0],
          projects_completed: 0,
          tools_used: [],
          total_time_spent: 0,
          rank: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserStats(initialStats);
      }
    } catch (err) {
      // Don't show error for demo mode, just use fallback
      const errorMessage = err instanceof Error ? err.message : 'Failed to load gamification data';
      if (!errorMessage.includes('Demo mode')) {
        setError(errorMessage);
      }
      console.log('Gamification running in offline mode');
      
      // Create initial stats for offline mode
      const initialStats = {
        user_id: currentUserId,
        total_xp: 0,
        level: 1,
        current_level_xp: 0,
        next_level_xp: 100,
        achievements_unlocked: [],
        badges_earned: [],
        streak_days: 1,
        last_activity_date: new Date().toISOString().split('T')[0],
        projects_completed: 0,
        tools_used: [],
        total_time_spent: 0,
        rank: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUserStats(initialStats);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  // Initialize user stats on mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Auto-refresh stats periodically
  useEffect(() => {
    const interval = setInterval(refreshStats, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [refreshStats]);

  // Add XP with UI feedback
  const addXP = useCallback(async (
    points: number, 
    source: string, 
    action: string, 
    metadata: Record<string, any> = {}
  ) => {
    try {
      const sourceMap = {
        'tool_usage': 'tool_usage' as const,
        'project_completion': 'project_completion' as const,
        'achievement': 'achievement' as const,
        'daily_streak': 'daily_streak' as const,
        'collaboration': 'collaboration' as const,
        'special': 'special' as const
      };

      const mappedSource = sourceMap[source as keyof typeof sourceMap] || 'special' as const;

      const updatedStats = await GamificationService.addXP(
        currentUserId,
        points,
        mappedSource,
        action,
        metadata
      );

      if (updatedStats) {
        setUserStats(updatedStats);
      }
    } catch (err) {
      console.error('Failed to add XP:', err);
      toast.error('Failed to update XP. Please try again.');
    }
  }, [currentUserId]);

  // Record tool usage
  const recordToolUsage = useCallback(async (toolName: string, isFirstTime: boolean = false) => {
    try {
      await GamificationService.recordToolUsage(currentUserId, toolName, isFirstTime);
      await refreshStats();
    } catch (err) {
      console.error('Failed to record tool usage:', err);
    }
  }, [currentUserId, refreshStats]);

  // Record project completion
  const recordProjectCompletion = useCallback(async (projectName: string, projectType: string) => {
    try {
      await GamificationService.recordProjectCompletion(currentUserId, projectName, projectType);
      await refreshStats();
    } catch (err) {
      console.error('Failed to record project completion:', err);
    }
  }, [currentUserId, refreshStats]);

  // Record code generation
  const recordCodeGeneration = useCallback(async (codeType: string, linesGenerated: number) => {
    try {
      await GamificationService.recordCodeGeneration(currentUserId, codeType, linesGenerated);
      await refreshStats();
    } catch (err) {
      console.error('Failed to record code generation:', err);
    }
  }, [currentUserId, refreshStats]);

  // Record daily login
  const recordDailyLogin = useCallback(async () => {
    try {
      await GamificationService.recordDailyLogin(currentUserId);
      await refreshStats();
    } catch (err) {
      console.error('Failed to record daily login:', err);
    }
  }, [currentUserId, refreshStats]);

  // Unlock special achievement
  const unlockSpecialAchievement = useCallback(async (achievementId: string): Promise<boolean> => {
    try {
      const success = await GamificationService.unlockSpecialAchievement(currentUserId, achievementId);
      if (success) {
        await refreshStats();
      }
      return success;
    } catch (err) {
      console.error('Failed to unlock achievement:', err);
      return false;
    }
  }, [currentUserId, refreshStats]);

  return {
    userStats,
    isLoading,
    error,
    addXP,
    recordToolUsage,
    recordProjectCompletion,
    recordCodeGeneration,
    recordDailyLogin,
    unlockSpecialAchievement,
    refreshStats
  };
}

// Hook for XP notifications
export function useXPNotifications() {
  const showXPGain = useCallback((points: number, action: string) => {
    toast.success(`+${points} XP`, {
      description: action,
      duration: 2000,
      className: 'ff-scale-pop',
    });
  }, []);

  const showLevelUp = useCallback((newLevel: number) => {
    toast.success(`🎊 Level Up!`, {
      description: `You reached level ${newLevel}!`,
      duration: 5000,
      className: 'ff-level-up',
    });
  }, []);

  const showAchievementUnlock = useCallback((achievementName: string, description: string) => {
    toast.success(`🏆 Achievement Unlocked!`, {
      description: `${achievementName}: ${description}`,
      duration: 6000,
      className: 'ff-confetti',
    });
  }, []);

  return {
    showXPGain,
    showLevelUp,
    showAchievementUnlock
  };
}

// Context for global gamification state
import React, { createContext, useContext } from 'react';

interface GamificationContextType extends UseGamificationReturn {
  userId: string;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const gamification = useGamification(userId);
  
  // Auto-record daily login on mount
  useEffect(() => {
    const hasLoggedToday = localStorage.getItem('ff_last_login_date');
    const today = new Date().toDateString();
    
    if (hasLoggedToday !== today) {
      // Use timeout to avoid blocking initial render
      setTimeout(() => {
        gamification.recordDailyLogin().catch(() => {
          // Silently fail for daily login in demo mode
        });
        localStorage.setItem('ff_last_login_date', today);
      }, 1000);
    }
  }, [gamification]);

  return (
    <GamificationContext.Provider value={{ 
      ...gamification, 
      userId: userId || localStorage.getItem('user_id') || 'anonymous'
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamificationContext() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
}

export default useGamification;