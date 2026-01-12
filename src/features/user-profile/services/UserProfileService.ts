/**
 * User Profile Service
 * Handles all user profile data operations
 */

import type { UserProfile, UserPreferences, Activity, UserStats } from '../types/user-profile.types';

class UserProfileServiceClass {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    // Check cache first
    const cached = this.getFromCache(`profile_${userId}`);
    if (cached) return cached;

    try {
      // In production, this would call a real API
      // For now, return mock data compatible with actual services
      const profile: UserProfile = {
        id: userId,
        email: 'user@example.com',
        username: 'developer',
        displayName: 'Flash Developer',
        avatar: '',
        bio: 'Building amazing projects with FlashFusion',
        stats: {
          projectsCreated: 12,
          deploymentsSuccess: 45,
          totalXP: 2500,
          level: 8,
          streak: 7,
          joinedDate: new Date('2024-01-15')
        },
        badges: [], // TODO: Implement when badge system is ready
        achievements: [], // TODO: Implement when achievement system is ready
        preferences: await this.getUserPreferences(userId),
        recentActivity: await this.getUserActivity(userId)
      };

      this.saveToCache(`profile_${userId}`, profile);
      return profile;
    } catch (error) {
      throw new Error(`Failed to load user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // In production, this would call a real API
      const currentProfile = await this.getUserProfile(userId);
      const updatedProfile = { ...currentProfile, ...updates };
      
      this.saveToCache(`profile_${userId}`, updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const cached = this.getFromCache(`preferences_${userId}`);
    if (cached) return cached;

    try {
      // Load from localStorage or API
      const stored = localStorage.getItem(`ff_user_preferences_${userId}`);
      const defaults: UserPreferences = {
        theme: 'auto',
        notifications: {
          email: true,
          push: true,
          deployment: true,
          aiSuggestions: true
        },
        privacy: {
          profileVisibility: 'public',
          showActivity: true,
          showStats: true
        },
        editor: {
          fontSize: 14,
          tabSize: 2,
          lineWrapping: true,
          autoSave: true
        }
      };

      const preferences = stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
      this.saveToCache(`preferences_${userId}`, preferences);
      return preferences;
    } catch (error) {
      throw new Error(`Failed to load preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const current = await this.getUserPreferences(userId);
      const updated = { ...current, ...preferences };
      
      localStorage.setItem(`ff_user_preferences_${userId}`, JSON.stringify(updated));
      this.saveToCache(`preferences_${userId}`, updated);
      
      return updated;
    } catch (error) {
      throw new Error(`Failed to update preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user activity history
   */
  async getUserActivity(userId: string, limit: number = 10): Promise<Activity[]> {
    try {
      // In production, this would call a real API
      const activities: Activity[] = [
        {
          id: '1',
          type: 'project_created',
          title: 'Created new project',
          description: 'Started working on E-commerce Platform',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'deployment',
          title: 'Deployed to production',
          description: 'Successfully deployed Blog Platform v2.0',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'badge_earned',
          title: 'Earned new badge',
          description: 'Unlocked "Code Ninja" badge',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          type: 'achievement',
          title: 'Achievement unlocked',
          description: 'Completed "Deploy 50 Projects" achievement',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          type: 'level_up',
          title: 'Level up!',
          description: 'Reached level 8',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];

      return activities.slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to load activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const profile = await this.getUserProfile(userId);
      
      return {
        totalProjects: profile.stats.projectsCreated,
        totalDeployments: profile.stats.deploymentsSuccess,
        successRate: 0.94, // 94% success rate
        totalXP: profile.stats.totalXP,
        level: profile.stats.level,
        nextLevelXP: profile.stats.level * 500, // Example formula
        dailyStreak: profile.stats.streak,
        longestStreak: Math.max(profile.stats.streak, 14), // Example
        lastActive: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to load stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // In production, this would upload to a storage service
      // For now, create a local URL
      const url = URL.createObjectURL(file);
      
      await this.updateProfile(userId, { avatar: url });
      return url;
    } catch (error) {
      throw new Error(`Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cache helpers
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  private saveToCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const UserProfileService = new UserProfileServiceClass();
export default UserProfileService;
