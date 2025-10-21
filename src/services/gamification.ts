import { supabase } from '../lib/supabase';
import { trackGamificationEvent } from '../lib/monitoring';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'creation' | 'mastery' | 'exploration' | 'social' | 'consistency' | 'special';
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: Record<string, any>;
  hidden?: boolean;
}

export interface DailyTask {
  id: string;
  type: string;
  title: string;
  description: string;
  xpReward: number;
  targetValue: number;
  currentProgress: number;
  completed: boolean;
  expiresAt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  totalXp: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  rank?: number;
  achievementsCount: number;
  projectsCount: number;
  deploymentsCount: number;
}

// Comprehensive achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Creation achievements
  {
    id: 'first_project',
    name: 'Hello World',
    description: 'Create your first project',
    category: 'creation',
    icon: '🎯',
    xpReward: 100,
    rarity: 'common',
    requirements: { projectsCreated: 1 }
  },
  {
    id: 'project_master',
    name: 'Project Master',
    description: 'Create 10 projects',
    category: 'creation',
    icon: '🏆',
    xpReward: 500,
    rarity: 'rare',
    requirements: { projectsCreated: 10 }
  },
  {
    id: 'prolific_creator',
    name: 'Prolific Creator',
    description: 'Create 50 projects',
    category: 'creation',
    icon: '👑',
    xpReward: 2000,
    rarity: 'epic',
    requirements: { projectsCreated: 50 }
  },

  // Deployment achievements
  {
    id: 'first_deployment',
    name: 'Going Live',
    description: 'Deploy your first project',
    category: 'creation',
    icon: '🚀',
    xpReward: 200,
    rarity: 'common',
    requirements: { deploymentsCount: 1 }
  },
  {
    id: 'deployment_expert',
    name: 'Deployment Expert',
    description: 'Successfully deploy to 5 different platforms',
    category: 'mastery',
    icon: '🌐',
    xpReward: 1000,
    rarity: 'epic',
    requirements: { uniquePlatforms: 5 }
  },

  // AI Tool achievements
  {
    id: 'ai_explorer',
    name: 'AI Explorer',
    description: 'Use 10 different AI tools',
    category: 'exploration',
    icon: '🤖',
    xpReward: 300,
    rarity: 'rare',
    requirements: { uniqueToolsUsed: 10 }
  },
  {
    id: 'ai_master',
    name: 'AI Master',
    description: 'Use all 60+ AI tools',
    category: 'mastery',
    icon: '🧠',
    xpReward: 5000,
    rarity: 'legendary',
    requirements: { uniqueToolsUsed: 60 }
  },

  // Social achievements
  {
    id: 'community_contributor',
    name: 'Community Contributor',
    description: 'Get 100 likes on your projects',
    category: 'social',
    icon: '❤️',
    xpReward: 750,
    rarity: 'rare',
    requirements: { totalLikes: 100 }
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Get 1000 likes on your projects',
    category: 'social',
    icon: '⭐',
    xpReward: 3000,
    rarity: 'epic',
    requirements: { totalLikes: 1000 }
  },

  // Consistency achievements
  {
    id: 'consistent_creator',
    name: 'Consistent Creator',
    description: 'Maintain a 7-day streak',
    category: 'consistency',
    icon: '🔥',
    xpReward: 400,
    rarity: 'rare',
    requirements: { currentStreak: 7 }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    category: 'consistency',
    icon: '💪',
    xpReward: 1500,
    rarity: 'epic',
    requirements: { currentStreak: 30 }
  },

  // Level achievements
  {
    id: 'apprentice',
    name: 'Apprentice',
    description: 'Reach level 5',
    category: 'mastery',
    icon: '📚',
    xpReward: 250,
    rarity: 'common',
    requirements: { level: 5 }
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Reach level 25',
    category: 'mastery',
    icon: '🎓',
    xpReward: 2000,
    rarity: 'epic',
    requirements: { level: 25 }
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Reach level 50',
    category: 'mastery',
    icon: '⚡',
    xpReward: 10000,
    rarity: 'legendary',
    requirements: { level: 50 }
  },

  // Special achievements
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join FlashFusion in its early days',
    category: 'special',
    icon: '🌟',
    xpReward: 1000,
    rarity: 'rare',
    requirements: { joinedBefore: '2024-12-31' },
    hidden: true
  },
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Report a bug that helps improve FlashFusion',
    category: 'special',
    icon: '🐛',
    xpReward: 500,
    rarity: 'rare',
    requirements: { bugsReported: 1 }
  }
];

export class GamificationService {
  // Award XP and handle level ups
  static async awardXP(userId: string, amount: number, reason: string): Promise<boolean> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('level, total_xp, xp_to_next_level')
        .eq('id', userId)
        .single();

      if (error || !user) throw new Error('User not found');

      const newTotalXp = user.total_xp + amount;
      
      // Check for level up using database function
      const { data: leveledUp } = await supabase
        .rpc('check_level_up', { user_uuid: userId });

      // Update user XP
      await supabase
        .from('users')
        .update({ 
          total_xp: newTotalXp,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', userId);

      trackGamificationEvent('xp_awarded', {
        userId,
        amount,
        reason,
        newTotal: newTotalXp,
        leveledUp
      });

      return leveledUp;
    } catch (error) {
      console.error('Error awarding XP:', error);
      return false;
    }
  }

  // Check and award achievements
  static async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      // Get user stats
      const { data: user } = await supabase
        .from('users')
        .select(`
          level, total_xp, current_streak, longest_streak, 
          total_projects, total_deployments, created_at
        `)
        .eq('id', userId)
        .single();

      if (!user) return [];

      // Get user's existing achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      const earnedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);

      // Get additional stats
      const [toolUsageData, likesData, platformsData] = await Promise.all([
        supabase
          .from('ai_tool_usage')
          .select('tool_id')
          .eq('user_id', userId),
        supabase
          .from('project_likes')
          .select('project_id')
          .in('project_id', 
            supabase.from('projects').select('id').eq('user_id', userId)
          ),
        supabase
          .from('deployments')
          .select('platform')
          .eq('user_id', userId)
          .eq('status', 'success')
      ]);

      const stats = {
        level: user.level,
        projectsCreated: user.total_projects,
        deploymentsCount: user.total_deployments,
        currentStreak: user.current_streak,
        uniqueToolsUsed: new Set(toolUsageData.data?.map(t => t.tool_id) || []).size,
        totalLikes: likesData.data?.length || 0,
        uniquePlatforms: new Set(platformsData.data?.map(p => p.platform) || []).size,
        joinedBefore: user.created_at
      };

      // Check each achievement
      const newAchievements: Achievement[] = [];
      
      for (const achievement of ACHIEVEMENTS) {
        if (earnedIds.has(achievement.id)) continue;

        if (this.checkAchievementRequirements(achievement, stats)) {
          // Award achievement
          await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              achievement_name: achievement.name,
              achievement_description: achievement.description,
              achievement_category: achievement.category,
              xp_reward: achievement.xpReward
            });

          // Award XP
          await this.awardXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`);
          
          newAchievements.push(achievement);

          trackGamificationEvent('achievement_earned', {
            userId,
            achievementId: achievement.id,
            achievementName: achievement.name,
            xpReward: achievement.xpReward
          });
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Check if achievement requirements are met
  private static checkAchievementRequirements(achievement: Achievement, stats: any): boolean {
    const req = achievement.requirements;

    for (const [key, value] of Object.entries(req)) {
      switch (key) {
        case 'projectsCreated':
        case 'deploymentsCount':
        case 'uniqueToolsUsed':
        case 'totalLikes':
        case 'uniquePlatforms':
        case 'currentStreak':
        case 'level':
          if (stats[key] < value) return false;
          break;
        
        case 'joinedBefore':
          if (new Date(stats.joinedBefore) > new Date(value)) return false;
          break;
      }
    }

    return true;
  }

  // Generate daily tasks
  static async generateDailyTasks(userId: string): Promise<DailyTask[]> {
    try {
      // Check if user already has tasks for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingTasks } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('expires_at', today);

      if (existingTasks && existingTasks.length > 0) {
        return existingTasks;
      }

      // Get user level to scale task difficulty
      const { data: user } = await supabase
        .from('users')
        .select('level')
        .eq('id', userId)
        .single();

      const userLevel = user?.level || 1;
      
      // Define task templates
      const taskTemplates = [
        {
          type: 'create_project',
          title: 'Create New Project',
          description: 'Start a new project using any AI tool',
          baseXp: 100,
          targetValue: 1
        },
        {
          type: 'use_ai_tools',
          title: 'Explore AI Tools',
          description: 'Use 3 different AI tools today',
          baseXp: 75,
          targetValue: 3
        },
        {
          type: 'deploy_project',
          title: 'Deploy to Production',
          description: 'Deploy a project to any platform',
          baseXp: 150,
          targetValue: 1
        },
        {
          type: 'improve_project',
          title: 'Project Enhancement',
          description: 'Update or improve an existing project',
          baseXp: 80,
          targetValue: 1
        },
        {
          type: 'community_interaction',
          title: 'Community Engagement',
          description: 'Like or comment on 5 community projects',
          baseXp: 60,
          targetValue: 5
        }
      ];

      // Select 3 random tasks
      const shuffled = taskTemplates.sort(() => 0.5 - Math.random());
      const selectedTasks = shuffled.slice(0, 3);

      // Create tasks in database
      const tasksToInsert = selectedTasks.map(template => ({
        user_id: userId,
        task_type: template.type,
        task_title: template.title,
        task_description: template.description,
        xp_reward: Math.floor(template.baseXp * (1 + (userLevel - 1) * 0.1)),
        target_value: template.targetValue,
        current_progress: 0,
        completed: false,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      const { data: newTasks } = await supabase
        .from('daily_tasks')
        .insert(tasksToInsert)
        .select('*');

      return newTasks || [];
    } catch (error) {
      console.error('Error generating daily tasks:', error);
      return [];
    }
  }

  // Update task progress
  static async updateTaskProgress(userId: string, taskType: string, increment: number = 1): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: task } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_type', taskType)
        .gte('expires_at', today)
        .eq('completed', false)
        .single();

      if (!task) return;

      const newProgress = Math.min(task.current_progress + increment, task.target_value);
      const isCompleted = newProgress >= task.target_value;

      await supabase
        .from('daily_tasks')
        .update({
          current_progress: newProgress,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', task.id);

      if (isCompleted) {
        await this.awardXP(userId, task.xp_reward, `Daily Task: ${task.task_title}`);
        trackGamificationEvent('daily_task_completed', {
          userId,
          taskType,
          xpReward: task.xp_reward
        });
      }
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  }

  // Update user streak
  static async updateStreak(userId: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('last_activity_date, current_streak, longest_streak')
        .eq('id', userId)
        .single();

      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = user.last_activity_date;
      
      if (lastActivity === today) return; // Already updated today

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let newStreak = 1;
      if (lastActivity === yesterday) {
        newStreak = user.current_streak + 1;
      }

      const newLongestStreak = Math.max(user.longest_streak, newStreak);

      await supabase
        .from('users')
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today
        })
        .eq('id', userId);

      trackGamificationEvent('streak_updated', {
        userId,
        newStreak,
        isNewRecord: newLongestStreak > user.longest_streak
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Get leaderboard
  static async getLeaderboard(limit: number = 100): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Get user rank
  static async getUserRank(userId: string): Promise<number | null> {
    try {
      const { data } = await supabase
        .from('leaderboard')
        .select('rank')
        .eq('id', userId)
        .single();

      return data?.rank || null;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return null;
    }
  }
}