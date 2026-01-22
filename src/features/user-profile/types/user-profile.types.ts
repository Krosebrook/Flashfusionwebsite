/**
 * User Profile specific type definitions
 */

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  
  // Stats
  stats: {
    projectsCreated: number;
    deploymentsSuccess: number;
    totalXP: number;
    level: number;
    streak: number;
    joinedDate: Date;
  };
  
  // Gamification
  badges: Badge[];
  achievements: Achievement[];
  
  // Preferences
  preferences: UserPreferences;
  
  // Activity
  recentActivity: Activity[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
  reward: {
    xp: number;
    badge?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    deployment: boolean;
    aiSuggestions: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showActivity: boolean;
    showStats: boolean;
  };
  editor: {
    fontSize: number;
    tabSize: number;
    lineWrapping: boolean;
    autoSave: boolean;
  };
}

export interface Activity {
  id: string;
  type: 'project_created' | 'deployment' | 'achievement' | 'badge_earned' | 'level_up';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserStats {
  totalProjects: number;
  totalDeployments: number;
  successRate: number;
  totalXP: number;
  level: number;
  nextLevelXP: number;
  dailyStreak: number;
  longestStreak: number;
  lastActive: Date;
}
