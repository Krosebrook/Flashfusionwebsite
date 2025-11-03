import { supabase } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

/**
 * FlashFusion Gamification Service
 * Handles XP points, achievements, leaderboards, and user progression
 */

export interface UserStats {
  user_id: string;
  total_xp: number;
  level: number;
  current_level_xp: number;
  next_level_xp: number;
  achievements_unlocked: string[];
  badges_earned: string[];
  streak_days: number;
  last_activity_date: string;
  projects_completed: number;
  tools_used: string[];
  total_time_spent: number; // in minutes
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'getting_started' | 'tools' | 'projects' | 'collaboration' | 'mastery' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  condition: {
    type: 'xp_total' | 'projects_count' | 'tools_used' | 'streak_days' | 'time_spent' | 'special';
    target: number;
    specific?: string[]; // For specific tools or actions
  };
  xp_reward: number;
  unlocked_message: string;
  is_hidden: boolean; // Secret achievements
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  achievements_count: number;
  streak_days: number;
  change_from_last_week: number;
}

export interface XPEvent {
  id: string;
  user_id: string;
  action: string;
  xp_earned: number;
  source: 'tool_usage' | 'project_completion' | 'achievement' | 'daily_streak' | 'collaboration' | 'special';
  metadata: Record<string, any>;
  created_at: string;
}

// XP Reward System
export const XP_REWARDS = {
  // Tool Usage
  FIRST_TOOL_USE: 100,
  TOOL_USE: 25,
  NEW_TOOL_FIRST_TIME: 50,
  
  // Project Actions
  PROJECT_CREATED: 75,
  PROJECT_COMPLETED: 200,
  PROJECT_DEPLOYED: 150,
  PROJECT_SHARED: 50,
  
  // Code Generation
  CODE_GENERATED: 30,
  FULL_STACK_APP_BUILT: 500,
  AI_MODEL_SWITCHED: 10,
  
  // Daily Activities
  DAILY_LOGIN: 20,
  DAILY_STREAK_BONUS: 50, // Per day in streak
  WEEKLY_GOAL_MET: 300,
  
  // Social/Collaboration
  HELP_OTHER_USER: 75,
  FEEDBACK_PROVIDED: 25,
  BUG_REPORTED: 100,
  
  // Special Actions
  FIRST_GITHUB_INTEGRATION: 200,
  FIRST_DEPLOYMENT: 300,
  BETA_FEATURE_USED: 100,
  
  // Achievement Bonuses
  ACHIEVEMENT_COMMON: 100,
  ACHIEVEMENT_RARE: 250,
  ACHIEVEMENT_EPIC: 500,
  ACHIEVEMENT_LEGENDARY: 1000
};

// Level System - XP required for each level
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250, // 1-10
  11500, 14000, 16750, 19750, 23000, 26500, 30250, 34250, 38500, 43000, // 11-20
  47750, 52750, 58000, 63500, 69250, 75250, 81500, 88000, 94750, 101750, // 21-30
  109000, 116500, 124250, 132250, 140500, 149000, 157750, 166750, 176000, 185500, // 31-40
  195250, 205250, 215500, 226000, 236750, 247750, 259000, 270500, 282250, 294250, // 41-50
  // Continue exponentially for higher levels
];

// Predefined Achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Getting Started
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Welcome to FlashFusion! You\'ve taken your first step into AI-powered development.',
    category: 'getting_started',
    rarity: 'common',
    icon: '🎯',
    condition: { type: 'xp_total', target: 50 },
    xp_reward: 100,
    unlocked_message: '🎉 Welcome to FlashFusion! Your journey begins now.',
    is_hidden: false
  },
  {
    id: 'tool_explorer',
    name: 'Tool Explorer',
    description: 'Used 5 different AI tools',
    category: 'tools',
    rarity: 'common',
    icon: '🛠️',
    condition: { type: 'tools_used', target: 5 },
    xp_reward: 150,
    unlocked_message: 'You\'re getting the hang of our AI tools!',
    is_hidden: false
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Generated a complete project in under 5 minutes',
    category: 'mastery',
    rarity: 'rare',
    icon: '⚡',
    condition: { type: 'special', target: 1 },
    xp_reward: 300,
    unlocked_message: 'Lightning fast! You\'re mastering the art of rapid development.',
    is_hidden: false
  },
  {
    id: 'perfectionist',
    name: 'The Perfectionist',
    description: 'Completed 10 projects without errors',
    category: 'mastery',
    rarity: 'epic',
    icon: '💎',
    condition: { type: 'projects_count', target: 10 },
    xp_reward: 500,
    unlocked_message: 'Flawless execution! Your attention to detail is exceptional.',
    is_hidden: false
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'Maintained a 30-day streak',
    category: 'special',
    rarity: 'epic',
    icon: '🔥',
    condition: { type: 'streak_days', target: 30 },
    xp_reward: 750,
    unlocked_message: 'Your dedication is inspiring! 30 days of consistent progress.',
    is_hidden: false
  },
  {
    id: 'ai_whisperer',
    name: 'AI Whisperer',
    description: 'Successfully used all available AI models',
    category: 'mastery',
    rarity: 'legendary',
    icon: '🧠',
    condition: { type: 'special', target: 1 },
    xp_reward: 1000,
    unlocked_message: 'You\'ve mastered every AI model! True artificial intelligence harmony.',
    is_hidden: false
  },
  {
    id: 'code_architect',
    name: 'Code Architect',
    description: 'Built 50 full-stack applications',
    category: 'projects',
    rarity: 'legendary',
    icon: '🏗️',
    condition: { type: 'projects_count', target: 50 },
    xp_reward: 1500,
    unlocked_message: 'You\'re a true architect of digital solutions!',
    is_hidden: false
  },
  {
    id: 'secret_beta',
    name: 'Secret Beta Tester',
    description: 'Discovered and used a hidden beta feature',
    category: 'special',
    rarity: 'legendary',
    icon: '🕵️',
    condition: { type: 'special', target: 1 },
    xp_reward: 2000,
    unlocked_message: 'You found our secret! Thanks for being an amazing beta tester.',
    is_hidden: true
  }
];

class GamificationServiceClass {
  private isOfflineMode: boolean = false;
  private offlineModeChecked: boolean = false;

  // Check if we're in offline/demo mode
  private async checkOfflineMode(): Promise<boolean> {
    if (this.offlineModeChecked) {
      return this.isOfflineMode;
    }

    try {
      // Test basic Supabase connection
      const { error } = await supabase.from('user_stats').select('user_id').limit(1);
      this.isOfflineMode = error?.message?.includes('Demo mode') || error?.message?.includes('disabled') || false;
    } catch (error) {
      console.log('Supabase unavailable, switching to offline mode');
      this.isOfflineMode = true;
    }

    this.offlineModeChecked = true;
    return this.isOfflineMode;
  }

  // LocalStorage fallback methods
  private getLocalUserStats(userId: string): UserStats | null {
    try {
      const data = localStorage.getItem(`ff_user_stats_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading local user stats:', error);
      return null;
    }
  }

  private saveLocalUserStats(userId: string, stats: UserStats): void {
    try {
      localStorage.setItem(`ff_user_stats_${userId}`, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving local user stats:', error);
    }
  }

  private createInitialUserStats(userId: string, initialXP: number = 0): UserStats {
    const now = new Date().toISOString();
    return {
      user_id: userId,
      total_xp: initialXP,
      level: this.calculateLevel(initialXP),
      current_level_xp: initialXP - (LEVEL_THRESHOLDS[this.calculateLevel(initialXP) - 1] || 0),
      next_level_xp: (LEVEL_THRESHOLDS[this.calculateLevel(initialXP)] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) - initialXP,
      achievements_unlocked: [],
      badges_earned: [],
      streak_days: 1,
      last_activity_date: now.split('T')[0],
      projects_completed: 0,
      tools_used: [],
      total_time_spent: 0,
      rank: 0,
      created_at: now,
      updated_at: now
    };
  }

  private addLocalXPEvent(userId: string, event: Omit<XPEvent, 'id' | 'created_at'>): void {
    try {
      const key = `ff_xp_events_${userId}`;
      const events = JSON.parse(localStorage.getItem(key) || '[]');
      const newEvent: XPEvent = {
        ...event,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };
      events.unshift(newEvent);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(100);
      }
      
      localStorage.setItem(key, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving local XP event:', error);
    }
  }

  // Core XP and Level Management
  async addXP(userId: string, points: number, source: XPEvent['source'], action: string, metadata: Record<string, any> = {}): Promise<UserStats | null> {
    const isOffline = await this.checkOfflineMode();

    if (isOffline) {
      return this.addXPOffline(userId, points, source, action, metadata);
    }

    try {
      // Record the XP event
      const xpEvent: Omit<XPEvent, 'id' | 'created_at'> = {
        user_id: userId,
        action,
        xp_earned: points,
        source,
        metadata
      };

      const { data: eventData, error: eventError } = await supabase
        .from('xp_events')
        .insert(xpEvent)
        .select()
        .single();

      if (eventError) {
        console.error('Error recording XP event:', eventError);
        // Fallback to offline mode
        return this.addXPOffline(userId, points, source, action, metadata);
      }
    } catch (error) {
      console.error('XP recording failed, using offline mode:', error);
      return this.addXPOffline(userId, points, source, action, metadata);
    }

    // Continue with online logic...
    return this.addXPOnline(userId, points, source, action, metadata);
  }

  private async addXPOffline(userId: string, points: number, source: XPEvent['source'], action: string, metadata: Record<string, any> = {}): Promise<UserStats | null> {
    try {
      // Record the XP event locally
      this.addLocalXPEvent(userId, {
        user_id: userId,
        action,
        xp_earned: points,
        source,
        metadata
      });

      // Get or create user stats
      let currentStats = this.getLocalUserStats(userId);
      if (!currentStats) {
        currentStats = this.createInitialUserStats(userId, points);
      }

      // Calculate new XP and level
      const newTotalXP = currentStats.total_xp + points;
      const newLevel = this.calculateLevel(newTotalXP);
      const levelChanged = newLevel > currentStats.level;

      // Update current and next level XP
      const currentLevelXP = newTotalXP - (LEVEL_THRESHOLDS[newLevel - 1] || 0);
      const nextLevelXP = (LEVEL_THRESHOLDS[newLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) - newTotalXP;

      // Update streak if this is a daily activity
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = currentStats.last_activity_date;
      let newStreakDays = currentStats.streak_days;

      if (source === 'daily_streak' || action.includes('daily')) {
        const daysDiff = this.calculateDaysDifference(lastActivity, today);
        if (daysDiff === 1) {
          newStreakDays += 1;
        } else if (daysDiff > 1) {
          newStreakDays = 1; // Reset streak
        }
      }

      // Update tools used
      let updatedToolsUsed = [...currentStats.tools_used];
      if (source === 'tool_usage' && metadata.tool_name && !updatedToolsUsed.includes(metadata.tool_name)) {
        updatedToolsUsed.push(metadata.tool_name);
      }

      // Update project count
      let newProjectsCompleted = currentStats.projects_completed;
      if (source === 'project_completion') {
        newProjectsCompleted += 1;
      }

      // Create updated stats
      const updatedStats: UserStats = {
        ...currentStats,
        total_xp: newTotalXP,
        level: newLevel,
        current_level_xp: currentLevelXP,
        next_level_xp: Math.max(0, nextLevelXP),
        streak_days: newStreakDays,
        last_activity_date: today,
        projects_completed: newProjectsCompleted,
        tools_used: updatedToolsUsed,
        updated_at: new Date().toISOString()
      };

      // Save locally
      this.saveLocalUserStats(userId, updatedStats);

      // Check for achievements
      await this.checkAchievementsOffline(userId, updatedStats);

      // Show appropriate notifications
      if (levelChanged) {
        toast.success(`🎊 Level Up! You reached level ${newLevel}!`, {
          description: `Earned ${points} XP from ${action}`,
          duration: 5000
        });
      } else if (points > 0) {
        toast.success(`+${points} XP`, {
          description: action,
          duration: 2000
        });
      }

      return updatedStats;

    } catch (error) {
      console.error('Error adding XP offline:', error);
      toast.error('Failed to update XP. Please try again.');
      return null;
    }
  }

  private async addXPOnline(userId: string, points: number, source: XPEvent['source'], action: string, metadata: Record<string, any> = {}): Promise<UserStats | null> {
    try {

      // Get current user stats
      let { data: currentStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Create initial stats if user doesn't exist
      if (!currentStats) {
        const initialStats = {
          user_id: userId,
          total_xp: points,
          level: 1,
          current_level_xp: points,
          next_level_xp: LEVEL_THRESHOLDS[1] || 100,
          achievements_unlocked: [],
          badges_earned: [],
          streak_days: 1,
          last_activity_date: new Date().toISOString().split('T')[0],
          projects_completed: 0,
          tools_used: [],
          total_time_spent: 0,
          rank: 0
        };

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert(initialStats)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user stats:', insertError);
          return null;
        }

        currentStats = newStats;
      }

      // Calculate new XP and level
      const newTotalXP = currentStats.total_xp + points;
      const newLevel = this.calculateLevel(newTotalXP);
      const levelChanged = newLevel > currentStats.level;

      // Update current and next level XP
      const currentLevelXP = newTotalXP - (LEVEL_THRESHOLDS[newLevel - 1] || 0);
      const nextLevelXP = (LEVEL_THRESHOLDS[newLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) - newTotalXP;

      // Update streak if this is a daily activity
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = currentStats.last_activity_date;
      let newStreakDays = currentStats.streak_days;

      if (source === 'daily_streak' || action.includes('daily')) {
        const daysDiff = this.calculateDaysDifference(lastActivity, today);
        if (daysDiff === 1) {
          newStreakDays += 1;
        } else if (daysDiff > 1) {
          newStreakDays = 1; // Reset streak
        }
        // If daysDiff === 0, keep current streak (same day activity)
      }

      // Update tools used
      let updatedToolsUsed = [...currentStats.tools_used];
      if (source === 'tool_usage' && metadata.tool_name && !updatedToolsUsed.includes(metadata.tool_name)) {
        updatedToolsUsed.push(metadata.tool_name);
      }

      // Update project count
      let newProjectsCompleted = currentStats.projects_completed;
      if (source === 'project_completion') {
        newProjectsCompleted += 1;
      }

      // Update user stats
      const updatedStats = {
        total_xp: newTotalXP,
        level: newLevel,
        current_level_xp: currentLevelXP,
        next_level_xp: Math.max(0, nextLevelXP),
        streak_days: newStreakDays,
        last_activity_date: today,
        projects_completed: newProjectsCompleted,
        tools_used: updatedToolsUsed,
        updated_at: new Date().toISOString()
      };

      const { data: finalStats, error: updateError } = await supabase
        .from('user_stats')
        .update(updatedStats)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user stats:', updateError);
        return null;
      }

      // Check for achievements
      await this.checkAchievements(userId, finalStats);

      // Show appropriate notifications
      if (levelChanged) {
        toast.success(`🎊 Level Up! You reached level ${newLevel}!`, {
          description: `Earned ${points} XP from ${action}`,
          duration: 5000
        });
      } else if (points > 0) {
        toast.success(`+${points} XP`, {
          description: action,
          duration: 2000
        });
      }

      return finalStats;

    } catch (error) {
      console.error('Error adding XP online:', error);
      // Fallback to offline mode
      return this.addXPOffline(userId, points, source, action, metadata);
    }
  }

  // Offline achievement checking
  private async checkAchievementsOffline(userId: string, userStats: UserStats): Promise<void> {
    try {
      const unlockedAchievements = userStats.achievements_unlocked || [];
      const newAchievements: Achievement[] = [];

      for (const achievement of ACHIEVEMENTS) {
        // Skip already unlocked achievements
        if (unlockedAchievements.includes(achievement.id)) {
          continue;
        }

        let isUnlocked = false;

        switch (achievement.condition.type) {
          case 'xp_total':
            isUnlocked = userStats.total_xp >= achievement.condition.target;
            break;
          case 'projects_count':
            isUnlocked = userStats.projects_completed >= achievement.condition.target;
            break;
          case 'tools_used':
            isUnlocked = userStats.tools_used.length >= achievement.condition.target;
            break;
          case 'streak_days':
            isUnlocked = userStats.streak_days >= achievement.condition.target;
            break;
          case 'time_spent':
            isUnlocked = userStats.total_time_spent >= achievement.condition.target;
            break;
          case 'special':
            // Special achievements are unlocked manually
            break;
        }

        if (isUnlocked) {
          newAchievements.push(achievement);
        }
      }

      // Update achievements if any new ones were unlocked
      if (newAchievements.length > 0) {
        const updatedAchievements = [...unlockedAchievements, ...newAchievements.map(a => a.id)];
        const updatedStats = {
          ...userStats,
          achievements_unlocked: updatedAchievements,
          updated_at: new Date().toISOString()
        };
        
        this.saveLocalUserStats(userId, updatedStats);

        // Award XP for achievements and show notifications
        for (const achievement of newAchievements) {
          toast.success(achievement.unlocked_message, {
            description: `🏆 Achievement Unlocked: ${achievement.name}`,
            duration: 6000
          });

          // Add bonus XP for achievement (but don't trigger another achievement check)
          const bonusStats = {
            ...updatedStats,
            total_xp: updatedStats.total_xp + achievement.xp_reward
          };
          this.saveLocalUserStats(userId, bonusStats);
        }
      }
    } catch (error) {
      console.error('Error checking achievements offline:', error);
    }
  }

  // Achievement System
  async checkAchievements(userId: string, userStats: UserStats): Promise<void> {
    try {
      const unlockedAchievements = userStats.achievements_unlocked || [];
      const newAchievements: Achievement[] = [];

      for (const achievement of ACHIEVEMENTS) {
        // Skip already unlocked achievements
        if (unlockedAchievements.includes(achievement.id)) {
          continue;
        }

        let isUnlocked = false;

        switch (achievement.condition.type) {
          case 'xp_total':
            isUnlocked = userStats.total_xp >= achievement.condition.target;
            break;
          case 'projects_count':
            isUnlocked = userStats.projects_completed >= achievement.condition.target;
            break;
          case 'tools_used':
            isUnlocked = userStats.tools_used.length >= achievement.condition.target;
            break;
          case 'streak_days':
            isUnlocked = userStats.streak_days >= achievement.condition.target;
            break;
          case 'time_spent':
            isUnlocked = userStats.total_time_spent >= achievement.condition.target;
            break;
          case 'special':
            // Special achievements are unlocked manually
            break;
        }

        if (isUnlocked) {
          newAchievements.push(achievement);
        }
      }

      // Update achievements if any new ones were unlocked
      if (newAchievements.length > 0) {
        const updatedAchievements = [...unlockedAchievements, ...newAchievements.map(a => a.id)];
        
        await supabase
          .from('user_stats')
          .update({ 
            achievements_unlocked: updatedAchievements,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        // Award XP for achievements and show notifications
        for (const achievement of newAchievements) {
          toast.success(achievement.unlocked_message, {
            description: `🏆 Achievement Unlocked: ${achievement.name}`,
            duration: 6000
          });

          // Add bonus XP for achievement (but don't trigger another achievement check)
          await this.addRawXP(userId, achievement.xp_reward, 'achievement', `Unlocked: ${achievement.name}`);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Special achievement unlock (for manual triggers)
  async unlockSpecialAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) {
        return false;
      }

      const { data: userStats, error } = await supabase
        .from('user_stats')
        .select('achievements_unlocked')
        .eq('user_id', userId)
        .single();

      if (error || !userStats) {
        return false;
      }

      const unlockedAchievements = userStats.achievements_unlocked || [];
      if (unlockedAchievements.includes(achievementId)) {
        return false; // Already unlocked
      }

      // Update achievements
      const updatedAchievements = [...unlockedAchievements, achievementId];
      await supabase
        .from('user_stats')
        .update({ 
          achievements_unlocked: updatedAchievements,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      // Show notification and award XP
      toast.success(achievement.unlocked_message, {
        description: `🏆 Special Achievement: ${achievement.name}`,
        duration: 8000
      });

      await this.addRawXP(userId, achievement.xp_reward, 'achievement', `Special: ${achievement.name}`);
      return true;

    } catch (error) {
      console.error('Error unlocking special achievement:', error);
      return false;
    }
  }

  // Leaderboard System
  async getLeaderboard(timeframe: 'all_time' | 'monthly' | 'weekly' = 'all_time', limit: number = 50): Promise<LeaderboardEntry[]> {
    const isOffline = await this.checkOfflineMode();

    if (isOffline) {
      return this.getLeaderboardOffline(timeframe, limit);
    }

    try {
      let query = supabase
        .from('user_stats')
        .select(`
          user_id,
          total_xp,
          level,
          achievements_unlocked,
          streak_days,
          users:user_id (username, avatar_url)
        `)
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (timeframe !== 'all_time') {
        // For monthly/weekly, we'd need additional date filtering
        // This would require tracking XP gains by date
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return this.getLeaderboardOffline(timeframe, limit);
      }

      return (data || []).map((entry, index) => ({
        rank: index + 1,
        user_id: entry.user_id,
        username: (entry.users as any)?.username || `User${entry.user_id.slice(0, 8)}`,
        avatar_url: (entry.users as any)?.avatar_url,
        total_xp: entry.total_xp,
        level: entry.level,
        achievements_count: entry.achievements_unlocked?.length || 0,
        streak_days: entry.streak_days,
        change_from_last_week: 0 // Would need historical data to calculate
      }));

    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return this.getLeaderboardOffline(timeframe, limit);
    }
  }

  private getLeaderboardOffline(timeframe: 'all_time' | 'monthly' | 'weekly' = 'all_time', limit: number = 50): LeaderboardEntry[] {
    // Create a mock leaderboard for demo/offline mode
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        user_id: 'demo_user_1',
        username: 'CodeMaster',
        total_xp: 15420,
        level: 28,
        achievements_count: 45,
        streak_days: 21,
        change_from_last_week: 2
      },
      {
        rank: 2,
        user_id: 'demo_user_2',
        username: 'AIWizard',
        total_xp: 14230,
        level: 26,
        achievements_count: 42,
        streak_days: 18,
        change_from_last_week: 1
      },
      {
        rank: 3,
        user_id: 'demo_user_3',
        username: 'DevNinja',
        total_xp: 13100,
        level: 25,
        achievements_count: 38,
        streak_days: 15,
        change_from_last_week: -1
      }
    ];

    // Try to get current user stats and add them if they exist
    const currentUserId = localStorage.getItem('user_id');
    if (currentUserId) {
      const userStats = this.getLocalUserStats(currentUserId);
      if (userStats && userStats.total_xp > 0) {
        // Find rank position based on XP
        let userRank = mockLeaderboard.length + 1;
        for (let i = 0; i < mockLeaderboard.length; i++) {
          if (userStats.total_xp > mockLeaderboard[i].total_xp) {
            userRank = i + 1;
            break;
          }
        }

        const userEntry: LeaderboardEntry = {
          rank: userRank,
          user_id: currentUserId,
          username: 'You',
          total_xp: userStats.total_xp,
          level: userStats.level,
          achievements_count: userStats.achievements_unlocked?.length || 0,
          streak_days: userStats.streak_days,
          change_from_last_week: Math.floor(Math.random() * 5) - 2
        };

        // Insert user entry and adjust ranks
        mockLeaderboard.splice(userRank - 1, 0, userEntry);
        mockLeaderboard.forEach((entry, index) => {
          entry.rank = index + 1;
        });
      }
    }

    return mockLeaderboard.slice(0, limit);
  }

  // User Statistics
  async getUserStats(userId: string): Promise<UserStats | null> {
    const isOffline = await this.checkOfflineMode();

    if (isOffline) {
      return this.getUserStatsOffline(userId);
    }

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching user stats:', error);
        // Fallback to offline mode
        return this.getUserStatsOffline(userId);
      }

      return data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Fallback to offline mode
      return this.getUserStatsOffline(userId);
    }
  }

  private getUserStatsOffline(userId: string): UserStats | null {
    let stats = this.getLocalUserStats(userId);
    
    // Create initial stats if none exist
    if (!stats) {
      stats = this.createInitialUserStats(userId);
      this.saveLocalUserStats(userId, stats);
    }
    
    return stats;
  }

  // Utility Methods
  private calculateLevel(totalXP: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  private calculateDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  private async addRawXP(userId: string, points: number, source: XPEvent['source'], action: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('xp_events')
        .insert({
          user_id: userId,
          action,
          xp_earned: points,
          source,
          metadata: {}
        });

      if (error) {
        console.error('Error adding raw XP:', error);
      }

      // Update total XP without triggering achievement checks
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({ 
          total_xp: supabase.rpc('increment_xp', { user_id: userId, points }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating total XP:', updateError);
      }
    } catch (error) {
      console.error('Error adding raw XP:', error);
    }
  }

  // Convenience methods for common XP events
  async recordToolUsage(userId: string, toolName: string, isFirstTime: boolean = false): Promise<void> {
    try {
      const baseXP = XP_REWARDS.TOOL_USE;
      const bonusXP = isFirstTime ? XP_REWARDS.NEW_TOOL_FIRST_TIME : 0;
      
      await this.addXP(
        userId,
        baseXP + bonusXP,
        'tool_usage',
        isFirstTime ? `First time using ${toolName}` : `Used ${toolName}`,
        { tool_name: toolName, is_first_time: isFirstTime }
      );
    } catch (error) {
      console.error('Failed to record tool usage:', error);
      // Don't throw - allow app to continue functioning
    }
  }

  async recordProjectCompletion(userId: string, projectName: string, projectType: string): Promise<void> {
    try {
      let xpReward = XP_REWARDS.PROJECT_COMPLETED;
      
      // Bonus for full-stack projects
      if (projectType === 'full_stack') {
        xpReward = XP_REWARDS.FULL_STACK_APP_BUILT;
      }

      await this.addXP(
        userId,
        xpReward,
        'project_completion',
        `Completed project: ${projectName}`,
        { project_name: projectName, project_type: projectType }
      );
    } catch (error) {
      console.error('Failed to record project completion:', error);
      // Don't throw - allow app to continue functioning
    }
  }

  async recordDailyLogin(userId: string): Promise<void> {
    try {
      await this.addXP(
        userId,
        XP_REWARDS.DAILY_LOGIN,
        'daily_streak',
        'Daily login bonus',
        { date: new Date().toISOString().split('T')[0] }
      );
    } catch (error) {
      console.error('Failed to record daily login:', error);
      // Don't throw - allow app to continue functioning
    }
  }

  async recordCodeGeneration(userId: string, codeType: string, linesGenerated: number): Promise<void> {
    try {
      const baseXP = XP_REWARDS.CODE_GENERATED;
      const bonusXP = Math.floor(linesGenerated / 10) * 5; // Bonus for larger generations
      
      await this.addXP(
        userId,
        baseXP + bonusXP,
        'tool_usage',
        `Generated ${codeType} code`,
        { code_type: codeType, lines_generated: linesGenerated }
      );
    } catch (error) {
      console.error('Failed to record code generation:', error);
      // Don't throw - allow app to continue functioning
    }
  }
}

// Export singleton instance
export const GamificationService = new GamificationServiceClass();
export default GamificationService;