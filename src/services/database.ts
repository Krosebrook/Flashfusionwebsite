import { Project, User, DailyTask, UserStats } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';

// Real Supabase database service
export const projectService = {
  async getUserProjects(userId: string): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      // Return mock data when in demo mode
      return [
        {
          id: '1',
          name: 'E-Commerce Platform',
          description: 'A modern React-based e-commerce platform',
          project_type: 'web-app',
          framework: 'react',
          styling: 'tailwind',
          features: ['authentication', 'payments', 'admin-panel'],
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T14:30:00Z',
          deployment_url: 'https://demo-ecommerce.vercel.app',
          deployment_status: 'success',
          is_public: true,
        },
        {
          id: '2',
          name: 'Task Management App',
          description: 'Collaborative task management tool',
          project_type: 'web-app',
          framework: 'react',
          styling: 'tailwind',
          features: ['real-time', 'notifications', 'teams'],
          created_at: '2024-01-10T09:15:00Z',
          updated_at: '2024-01-18T16:45:00Z',
          deployment_status: 'pending',
          is_public: false,
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
        return [];
      }

      // Transform database format to app format
      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        project_type: 'web-app' as const,
        framework: project.framework,
        styling: 'tailwind' as const,
        features: project.config?.features || [],
        created_at: project.created_at,
        updated_at: project.updated_at,
        deployment_url: project.config?.deployment_url,
        deployment_status: project.status === 'active' ? 'success' : 
                          project.status === 'draft' ? 'pending' : 'not_deployed',
        is_public: project.config?.is_public || false,
      }));
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      toast.error('Database connection error');
      return [];
    }
  },

  async createProject(userId: string, projectData: Partial<Project>): Promise<Project> {
    if (!isSupabaseConfigured) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name || 'New Project',
        description: projectData.description || '',
        project_type: projectData.project_type || 'web-app',
        framework: projectData.framework || 'react',
        styling: projectData.styling || 'tailwind',
        features: projectData.features || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deployment_status: 'not_deployed',
        is_public: false,
      };
      toast.success('Project created (demo mode)');
      return newProject;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: projectData.name || 'New Project',
          description: projectData.description || '',
          framework: projectData.framework || 'react',
          status: 'draft',
          config: {
            features: projectData.features || [],
            styling: projectData.styling || 'tailwind',
            is_public: projectData.is_public || false,
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        toast.error('Failed to create project');
        throw error;
      }

      toast.success('Project created successfully');
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        project_type: 'web-app' as const,
        framework: data.framework,
        styling: 'tailwind' as const,
        features: data.config?.features || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        deployment_status: 'not_deployed',
        is_public: data.config?.is_public || false,
      };
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    if (!isSupabaseConfigured) {
      toast.success('Project updated (demo mode)');
      return {
        id: projectId,
        ...updates,
        updated_at: new Date().toISOString(),
      } as Project;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          framework: updates.framework,
          config: {
            features: updates.features,
            styling: updates.styling,
            is_public: updates.is_public,
            deployment_url: updates.deployment_url,
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        toast.error('Failed to update project');
        throw error;
      }

      toast.success('Project updated successfully');
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        project_type: 'web-app' as const,
        framework: data.framework,
        styling: 'tailwind' as const,
        features: data.config?.features || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        deployment_url: data.config?.deployment_url,
        deployment_status: updates.deployment_status || 'not_deployed',
        is_public: data.config?.is_public || false,
      };
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      toast.success('Project deleted (demo mode)');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
        throw error;
      }

      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  }
};

export const userService = {
  async getUserProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return {
        id: userId,
        email: 'demo@flashfusion.dev',
        username: 'demo_user',
        user_metadata: {
          name: 'Demo User',
          avatar_url: 'https://via.placeholder.com/100',
        },
        role: 'pro',
        stats: {
          level: 5,
          xp: 1250,
          total_xp: 1250,
          current_streak: 3,
        }
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_stats (*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        username: data.email.split('@')[0],
        user_metadata: {
          name: data.full_name || 'User',
          avatar_url: data.avatar_url,
        },
        role: data.role,
        stats: data.user_stats ? {
          level: data.user_stats.level,
          xp: data.user_stats.xp,
          total_xp: data.user_stats.xp,
          current_streak: data.user_stats.streak,
        } : undefined
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    if (!isSupabaseConfigured) {
      const currentUser = await this.getUserProfile(userId);
      return {
        ...currentUser!,
        ...updates,
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: updates.user_metadata?.name,
          avatar_url: updates.user_metadata?.avatar_url,
          role: updates.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      toast.success('Profile updated successfully');
      return await this.getUserProfile(userId) || {} as User;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  },

  async getUserStats(userId: string): Promise<UserStats> {
    if (!isSupabaseConfigured) {
      return {
        level: 5,
        total_xp: 1250,
        current_streak: 3,
        total_projects: 8,
        total_deployments: 12,
        xp_to_next_level: 750,
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      let statsData = data;

      if (error) {
        if (error.code === 'PGRST116') {
          // No stats found, create initial stats
          const { data: newStats, error: createError } = await supabase
            .from('user_stats')
            .insert({
              user_id: userId,
              level: 1,
              xp: 0,
              total_projects: 0,
              total_images: 0,
              total_code: 0,
              daily_tasks_completed: 0,
              streak: 0
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating user stats:', createError);
            return {
              level: 1,
              total_xp: 0,
              current_streak: 0,
              total_projects: 0,
              total_deployments: 0,
              xp_to_next_level: 1000,
            };
          }

          statsData = newStats;
        } else {
          console.error('Error fetching user stats:', error);
          return {
            level: 1,
            total_xp: 0,
            current_streak: 0,
            total_projects: 0,
            total_deployments: 0,
            xp_to_next_level: 1000,
          };
        }
      }

      const xpForNextLevel = statsData.level * 1000;
      const xpToNextLevel = xpForNextLevel - statsData.xp;

      return {
        level: statsData.level,
        total_xp: statsData.xp,
        current_streak: statsData.streak,
        total_projects: statsData.total_projects,
        total_deployments: 0, // Would need to fetch from deployments table
        xp_to_next_level: Math.max(0, xpToNextLevel),
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        level: 1,
        total_xp: 0,
        current_streak: 0,
        total_projects: 0,
        total_deployments: 0,
        xp_to_next_level: 1000,
      };
    }
  }
};

export const badgeService = {
  async getUserBadges(userId: string) {
    if (!isSupabaseConfigured) {
      return [
        {
          id: '1',
          name: 'First Project',
          description: 'Created your first project',
          icon: '🎯',
          earned_at: '2024-01-15T10:00:00Z',
          rarity: 'common',
        },
        {
          id: '2',
          name: 'Code Master',
          description: 'Generated 10+ AI code snippets',
          icon: '💻',
          earned_at: '2024-01-18T14:30:00Z',
          rarity: 'rare',
        },
        {
          id: '3',
          name: 'Deployment Pro',
          description: 'Successfully deployed 5 projects',
          icon: '🚀',
          earned_at: '2024-01-20T09:15:00Z',
          rarity: 'epic',
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('earned', true)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        return [];
      }

      // Transform to expected format with badge definitions
      const badgeDefinitions = {
        'first_project': { name: 'First Project', description: 'Created your first project', icon: '🎯', rarity: 'common' },
        'code_master': { name: 'Code Master', description: 'Generated 10+ AI code snippets', icon: '💻', rarity: 'rare' },
        'deployment_pro': { name: 'Deployment Pro', description: 'Successfully deployed 5 projects', icon: '🚀', rarity: 'epic' },
        'streak_keeper': { name: 'Streak Keeper', description: 'Maintained 7-day streak', icon: '🔥', rarity: 'rare' },
      };

      return data.map(badge => ({
        id: badge.id,
        name: badgeDefinitions[badge.badge_id]?.name || 'Unknown Badge',
        description: badgeDefinitions[badge.badge_id]?.description || 'Description not available',
        icon: badgeDefinitions[badge.badge_id]?.icon || '🏆',
        earned_at: badge.earned_at,
        rarity: badgeDefinitions[badge.badge_id]?.rarity || 'common',
      }));
    } catch (error) {
      console.error('Error in getUserBadges:', error);
      return [];
    }
  },

  async getAvailableBadges() {
    if (!isSupabaseConfigured) {
      return [
        {
          id: '4',
          name: 'Team Player',
          description: 'Collaborate on 3 projects',
          icon: '👥',
          requirements: ['collaborate_projects: 3'],
          rarity: 'rare',
        },
        {
          id: '5',
          name: 'Streak Master',
          description: 'Maintain 30-day streak',
          icon: '🔥',
          requirements: ['streak_days: 30'],
          rarity: 'legendary',
        }
      ];
    }

    // Return all available badges (earned and unearned)
    return [
      {
        id: 'first_project',
        name: 'First Project',
        description: 'Create your first project',
        icon: '🎯',
        requirements: ['projects: 1'],
        rarity: 'common',
      },
      {
        id: 'code_master',
        name: 'Code Master',
        description: 'Generate 10+ AI code snippets',
        icon: '💻',
        requirements: ['code_generations: 10'],
        rarity: 'rare',
      },
      {
        id: 'deployment_pro',
        name: 'Deployment Pro',
        description: 'Successfully deploy 5 projects',
        icon: '🚀',
        requirements: ['deployments: 5'],
        rarity: 'epic',
      },
      {
        id: 'streak_keeper',
        name: 'Streak Keeper',
        description: 'Maintain 7-day streak',
        icon: '🔥',
        requirements: ['streak_days: 7'],
        rarity: 'rare',
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain 30-day streak',
        icon: '🔥',
        requirements: ['streak_days: 30'],
        rarity: 'legendary',
      }
    ];
  }
};

export const dailyTaskService = {
  async getDailyTasks(userId: string): Promise<DailyTask[]> {
    if (!isSupabaseConfigured) {
      return [
        {
          id: '1',
          task_type: 'create_project',
          task_title: 'Create a New Project',
          task_description: 'Start a new project using any AI tool',
          xp_reward: 100,
          target_value: 1,
          current_progress: 0,
          completed: false,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          task_type: 'use_ai_tools',
          task_title: 'Explore AI Tools',
          task_description: 'Use 3 different AI tools today',
          xp_reward: 75,
          target_value: 3,
          current_progress: 1,
          completed: false,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          task_type: 'deploy_project',
          task_title: 'Deploy to Production',
          task_description: 'Deploy a project to any platform',
          xp_reward: 150,
          target_value: 1,
          current_progress: 1,
          completed: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today);

      if (error) {
        console.error('Error fetching daily tasks:', error);
        return [];
      }

      // Define available daily tasks
      const taskDefinitions = {
        'create_project': { title: 'Create a New Project', description: 'Start a new project using any AI tool', xp: 100, target: 1 },
        'use_ai_tools': { title: 'Explore AI Tools', description: 'Use 3 different AI tools today', xp: 75, target: 3 },
        'deploy_project': { title: 'Deploy to Production', description: 'Deploy a project to any platform', xp: 150, target: 1 },
        'daily_login': { title: 'Daily Visit', description: 'Visit FlashFusion today', xp: 25, target: 1 },
        'share_project': { title: 'Share Creation', description: 'Share a project publicly', xp: 50, target: 1 },
      };

      // If no tasks exist for today, create them
      let tasksData = data;
      if (data.length === 0) {
        const tasksToCreate = ['create_project', 'use_ai_tools', 'daily_login'];
        const newTasks = tasksToCreate.map(taskId => ({
          user_id: userId,
          task_id: taskId,
          date: today,
          completed: false
        }));

        const { data: createdTasks, error: createError } = await supabase
          .from('daily_tasks')
          .insert(newTasks)
          .select();

        if (createError) {
          console.error('Error creating daily tasks:', createError);
          return [];
        }

        tasksData = createdTasks;
      }

      return tasksData.map(task => ({
        id: task.id,
        task_type: task.task_id,
        task_title: taskDefinitions[task.task_id]?.title || 'Unknown Task',
        task_description: taskDefinitions[task.task_id]?.description || 'Complete this task',
        xp_reward: taskDefinitions[task.task_id]?.xp || 50,
        target_value: taskDefinitions[task.task_id]?.target || 1,
        current_progress: task.completed ? taskDefinitions[task.task_id]?.target || 1 : 0,
        completed: task.completed,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }));
    } catch (error) {
      console.error('Error in getDailyTasks:', error);
      return [];
    }
  },

  async updateTaskProgress(userId: string, taskId: string, progress: number): Promise<DailyTask> {
    if (!isSupabaseConfigured) {
      const tasks = await this.getDailyTasks(userId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.current_progress = Math.min(progress, task.target_value);
        task.completed = task.current_progress >= task.target_value;
      }
      return task!;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .eq('date', today)
        .select()
        .single();

      if (error) {
        console.error('Error updating task progress:', error);
        throw error;
      }

      // Award XP and update user stats
      const taskDefinitions = {
        'create_project': { xp: 100, target: 1 },
        'use_ai_tools': { xp: 75, target: 3 },
        'deploy_project': { xp: 150, target: 1 },
        'daily_login': { xp: 25, target: 1 },
        'share_project': { xp: 50, target: 1 },
      };

      const xpReward = taskDefinitions[taskId]?.xp || 50;
      
      // Update user stats
      await supabase.rpc('increment_user_xp', {
        user_id: userId,
        xp_amount: xpReward
      });

      toast.success(`Task completed! +${xpReward} XP`);

      const updatedTasks = await this.getDailyTasks(userId);
      return updatedTasks.find(t => t.task_type === taskId) || {} as DailyTask;
    } catch (error) {
      console.error('Error in updateTaskProgress:', error);
      throw error;
    }
  }
};

export const analyticsService = {
  async getUserAnalytics(userId: string) {
    if (!isSupabaseConfigured) {
      return {
        overview: {
          totalProjects: 8,
          totalDeployments: 12,
          totalXP: 1250,
          currentStreak: 3,
        },
        activityData: [
          { date: '2024-01-15', projects: 2, deployments: 1, xp: 150 },
          { date: '2024-01-16', projects: 1, deployments: 2, xp: 200 },
          { date: '2024-01-17', projects: 0, deployments: 1, xp: 100 },
          { date: '2024-01-18', projects: 3, deployments: 0, xp: 180 },
          { date: '2024-01-19', projects: 1, deployments: 3, xp: 250 },
          { date: '2024-01-20', projects: 1, deployments: 2, xp: 200 },
        ],
        toolUsage: [
          { tool: 'React Generator', usage: 45, success_rate: 92 },
          { tool: 'API Creator', usage: 32, success_rate: 88 },
          { tool: 'UI Designer', usage: 28, success_rate: 95 },
          { tool: 'Database Schema', usage: 22, success_rate: 90 },
          { tool: 'Auth Setup', usage: 18, success_rate: 94 },
        ],
        deploymentStats: {
          vercel: 5,
          netlify: 3,
          aws: 2,
          digitalocean: 1,
          github_pages: 1,
        }
      };
    }

    try {
      // Get user stats for overview
      const userStats = await userService.getUserStats(userId);
      
      // Get project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Get deployment count
      const { count: deploymentCount } = await supabase
        .from('deployments')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Get tool usage data
      const { data: toolUsageData } = await supabase
        .from('tool_usage')
        .select('tool_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      // Process tool usage into analytics format
      const toolUsage = {};
      toolUsageData?.forEach(usage => {
        toolUsage[usage.tool_id] = (toolUsage[usage.tool_id] || 0) + 1;
      });

      const toolUsageArray = Object.entries(toolUsage).map(([tool, usage]) => ({
        tool: tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        usage: usage as number,
        success_rate: Math.floor(Math.random() * 10) + 90 // Mock success rate for now
      })).sort((a, b) => b.usage - a.usage);

      // Get activity data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const activityData = await Promise.all(
        last7Days.map(async (date) => {
          const { count: dailyProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .gte('created_at', `${date}T00:00:00Z`)
            .lt('created_at', `${date}T23:59:59Z`);

          const { count: dailyDeployments } = await supabase
            .from('deployments')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .gte('created_at', `${date}T00:00:00Z`)
            .lt('created_at', `${date}T23:59:59Z`);

          return {
            date,
            projects: dailyProjects || 0,
            deployments: dailyDeployments || 0,
            xp: (dailyProjects || 0) * 50 + (dailyDeployments || 0) * 100, // Estimated XP
          };
        })
      );

      // Get deployment platform stats
      const { data: deployments } = await supabase
        .from('deployments')
        .select('platform')
        .eq('user_id', userId);

      const deploymentStats = {};
      deployments?.forEach(deployment => {
        deploymentStats[deployment.platform] = (deploymentStats[deployment.platform] || 0) + 1;
      });

      return {
        overview: {
          totalProjects: projectCount || 0,
          totalDeployments: deploymentCount || 0,
          totalXP: userStats.total_xp,
          currentStreak: userStats.current_streak,
        },
        activityData,
        toolUsage: toolUsageArray.slice(0, 5), // Top 5 tools
        deploymentStats,
      };
    } catch (error) {
      console.error('Error in getUserAnalytics:', error);
      // Return fallback data
      return {
        overview: {
          totalProjects: 0,
          totalDeployments: 0,
          totalXP: 0,
          currentStreak: 0,
        },
        activityData: [],
        toolUsage: [],
        deploymentStats: {},
      };
    }
  },

  async getGlobalAnalytics() {
    if (!isSupabaseConfigured) {
      return {
        totalUsers: 15420,
        totalProjects: 89350,
        totalDeployments: 67890,
        popularTools: [
          { name: 'React Generator', usage: 8945 },
          { name: 'API Creator', usage: 7823 },
          { name: 'UI Designer', usage: 6791 },
        ]
      };
    }

    try {
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' });

      const { count: deploymentCount } = await supabase
        .from('deployments')
        .select('*', { count: 'exact' });

      const { data: toolUsageData } = await supabase
        .from('tool_usage')
        .select('tool_id')
        .order('created_at', { ascending: false })
        .limit(1000);

      const toolUsage = {};
      toolUsageData?.forEach(usage => {
        toolUsage[usage.tool_id] = (toolUsage[usage.tool_id] || 0) + 1;
      });

      const popularTools = Object.entries(toolUsage)
        .map(([tool, usage]) => ({
          name: tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          usage: usage as number
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      return {
        totalUsers: userCount || 0,
        totalProjects: projectCount || 0,
        totalDeployments: deploymentCount || 0,
        popularTools,
      };
    } catch (error) {
      console.error('Error in getGlobalAnalytics:', error);
      return {
        totalUsers: 0,
        totalProjects: 0,
        totalDeployments: 0,
        popularTools: [],
      };
    }
  }
};

export const deploymentService = {
  async getUserDeployments(userId: string) {
    if (!isSupabaseConfigured) {
      return [
        {
          id: '1',
          project_id: '1',
          project_name: 'E-Commerce Platform',
          platform: 'vercel',
          deployment_url: 'https://demo-ecommerce.vercel.app',
          status: 'success',
          created_at: '2024-01-20T14:30:00Z',
          build_time: 45,
          size: '2.3 MB',
        },
        {
          id: '2',
          project_id: '2',
          project_name: 'Task Management App',
          platform: 'netlify',
          deployment_url: 'https://task-app.netlify.app',
          status: 'building',
          created_at: '2024-01-20T16:15:00Z',
          build_time: null,
          size: null,
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('deployments')
        .select(`
          *,
          projects:project_id (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deployments:', error);
        return [];
      }

      return data.map(deployment => ({
        id: deployment.id,
        project_id: deployment.project_id,
        project_name: deployment.projects?.name || 'Unknown Project',
        platform: deployment.platform,
        deployment_url: deployment.url,
        status: deployment.status === 'deployed' ? 'success' : 
                deployment.status === 'failed' ? 'failed' : 'building',
        created_at: deployment.created_at,
        build_time: deployment.build_time ? parseInt(deployment.build_time) : null,
        size: null, // Would need to be calculated
        error: deployment.status === 'failed' ? 'Deployment failed' : undefined
      }));
    } catch (error) {
      console.error('Error in getUserDeployments:', error);
      return [];
    }
  },

  async createDeployment(projectId: string, platform: string, config: any) {
    if (!isSupabaseConfigured) {
      return {
        id: Date.now().toString(),
        project_id: projectId,
        platform,
        status: 'building',
        created_at: new Date().toISOString(),
        config,
      };
    }

    try {
      const { data, error } = await supabase
        .from('deployments')
        .insert({
          user_id: 'current-user', // Would get from auth context
          project_id: projectId,
          platform,
          status: 'deploying',
          auto_deploy: config.auto_deploy || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating deployment:', error);
        throw error;
      }

      return {
        id: data.id,
        project_id: data.project_id,
        platform: data.platform,
        status: data.status,
        created_at: data.created_at,
        config,
      };
    } catch (error) {
      console.error('Error in createDeployment:', error);
      throw error;
    }
  },

  async updateDeploymentStatus(deploymentId: string, status: string, url?: string, error?: string) {
    if (!isSupabaseConfigured) {
      console.log('Updated deployment status (demo mode):', { deploymentId, status, url });
      return;
    }

    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (url) updates.url = url;
      if (status === 'deployed') updates.build_time = '45'; // Mock build time
      if (error) updates.error = error;

      const { error: updateError } = await supabase
        .from('deployments')
        .update(updates)
        .eq('id', deploymentId);

      if (updateError) {
        console.error('Error updating deployment status:', updateError);
        throw updateError;
      }
    } catch (error) {
      console.error('Error in updateDeploymentStatus:', error);
      throw error;
    }
  },

  async getDeploymentLogs(deploymentId: string) {
    if (!isSupabaseConfigured) {
      return [
        { timestamp: '2024-01-20T14:30:00Z', level: 'info', message: 'Starting build process...' },
        { timestamp: '2024-01-20T14:30:15Z', level: 'info', message: 'Installing dependencies...' },
        { timestamp: '2024-01-20T14:30:45Z', level: 'info', message: 'Building application...' },
        { timestamp: '2024-01-20T14:31:30Z', level: 'success', message: 'Build completed successfully!' },
        { timestamp: '2024-01-20T14:31:45Z', level: 'info', message: 'Deploying to production...' },
        { timestamp: '2024-01-20T14:32:00Z', level: 'success', message: 'Deployment successful!' },
      ];
    }

    // In a real implementation, this would fetch logs from the deployment platform
    // For now, return mock logs
    return [
      { timestamp: new Date().toISOString(), level: 'info', message: 'Deployment initiated...' },
      { timestamp: new Date().toISOString(), level: 'info', message: 'Building application...' },
      { timestamp: new Date().toISOString(), level: 'success', message: 'Deployment completed!' },
    ];
  },

  async deleteDeployment(deploymentId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      toast.success('Deployment deleted (demo mode)');
      return;
    }

    try {
      const { error } = await supabase
        .from('deployments')
        .delete()
        .eq('id', deploymentId);

      if (error) {
        console.error('Error deleting deployment:', error);
        throw error;
      }

      toast.success('Deployment deleted successfully');
    } catch (error) {
      console.error('Error in deleteDeployment:', error);
      throw error;
    }
  }
};