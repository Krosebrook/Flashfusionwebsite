/**
 * @fileoverview Core application type definitions for FlashFusion platform
 * @module types/index
 */

/**
 * User account information
 * @interface User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} [name] - User display name
 * @property {string} [avatar] - User avatar URL
 * @property {'free' | 'pro' | 'enterprise'} [subscription] - User subscription tier
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} lastLogin - Last login timestamp
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  subscription?: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLogin: Date;
}

/**
 * User statistics and progress tracking
 * @interface UserStats
 * @property {number} level - User level
 * @property {number} xp - Current experience points
 * @property {number} xpToNext - XP required for next level
 * @property {number} totalProjects - Total number of projects created
 * @property {number} activeProjects - Number of active projects
 * @property {number} completedTasks - Number of completed tasks
 * @property {number} streak - Current daily streak
 * @property {number} credits - Available credits
 * @property {'free' | 'pro' | 'enterprise'} subscription - Subscription tier
 * @property {Date} joinDate - Account join date
 * @property {Achievement[]} achievements - Unlocked achievements
 * @property {number} weeklyProgress - Weekly progress percentage
 * @property {number} monthlyProgress - Monthly progress percentage
 */
export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  streak: number;
  credits: number;
  subscription: 'free' | 'pro' | 'enterprise';
  joinDate: Date;
  achievements: Achievement[];
  weeklyProgress: number;
  monthlyProgress: number;
}

/**
 * User achievement badge
 * @interface Achievement
 * @property {string} id - Unique achievement identifier
 * @property {string} name - Achievement name
 * @property {string} description - Achievement description
 * @property {string} icon - Icon identifier or URL
 * @property {'creation' | 'collaboration' | 'mastery' | 'community'} category - Achievement category
 * @property {'common' | 'rare' | 'epic' | 'legendary'} rarity - Achievement rarity level
 * @property {Date} [unlockedAt] - Timestamp when achievement was unlocked
 * @property {number} [progress] - Current progress towards achievement
 * @property {number} [maxProgress] - Maximum progress required
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'creation' | 'collaboration' | 'mastery' | 'community';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

/**
 * Project information and metadata
 * @interface Project
 * @property {string} id - Unique project identifier
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {'web-app' | 'mobile-app' | 'api' | 'bot' | 'extension'} type - Project type
 * @property {string} framework - Framework or technology used
 * @property {'draft' | 'generating' | 'completed' | 'deployed'} status - Project status
 * @property {number} progress - Completion progress (0-100)
 * @property {Date} createdAt - Project creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} [deployUrl] - Deployment URL
 * @property {string} [thumbnail] - Project thumbnail URL
 * @property {string[]} tags - Project tags
 * @property {boolean} isPublic - Whether project is public
 * @property {number} likes - Number of likes
 * @property {number} views - Number of views
 * @property {number} forks - Number of forks
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'web-app' | 'mobile-app' | 'api' | 'bot' | 'extension';
  framework: string;
  status: 'draft' | 'generating' | 'completed' | 'deployed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  deployUrl?: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  likes: number;
  views: number;
  forks: number;
}

/**
 * Daily task for user engagement
 * @interface DailyTask
 * @property {string} id - Unique task identifier
 * @property {string} name - Task name
 * @property {string} description - Task description
 * @property {'create' | 'explore' | 'share' | 'learn'} type - Task type
 * @property {number} xpReward - XP reward for completion
 * @property {boolean} completed - Whether task is completed
 * @property {Date} deadline - Task deadline
 * @property {'easy' | 'medium' | 'hard'} difficulty - Task difficulty level
 * @property {string} estimatedTime - Estimated time to complete
 */
export interface DailyTask {
  id: string;
  name: string;
  description: string;
  type: 'create' | 'explore' | 'share' | 'learn';
  xpReward: number;
  completed: boolean;
  deadline: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

/**
 * Platform tool or feature
 * @interface Tool
 * @property {string} id - Unique tool identifier
 * @property {string} name - Tool name
 * @property {string} description - Tool description
 * @property {'generation' | 'design' | 'optimization' | 'analysis' | 'automation' | 'collaboration'} category - Tool category
 * @property {string} icon - Icon identifier or URL
 * @property {'free' | 'pro' | 'enterprise'} tier - Required subscription tier
 * @property {number} popularity - Popularity score
 * @property {number} usageCount - Total usage count
 * @property {boolean} featured - Whether tool is featured
 * @property {boolean} [comingSoon] - Whether tool is coming soon
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'generation' | 'design' | 'optimization' | 'analysis' | 'automation' | 'collaboration';
  icon: string;
  tier: 'free' | 'pro' | 'enterprise';
  popularity: number;
  usageCount: number;
  featured: boolean;
  comingSoon?: boolean;
}

/**
 * Deployment configuration and status
 * @interface Deployment
 * @property {string} id - Unique deployment identifier
 * @property {string} projectId - Associated project ID
 * @property {string} platform - Deployment platform (e.g., Vercel, Netlify)
 * @property {string} url - Deployment URL
 * @property {'pending' | 'deploying' | 'success' | 'failed'} status - Deployment status
 * @property {Date} createdAt - Deployment initiation timestamp
 * @property {string} branch - Git branch deployed
 * @property {string} [commit] - Git commit hash
 * @property {number} [buildTime] - Build time in seconds
 * @property {string} [size] - Deployment size
 */
export interface Deployment {
  id: string;
  projectId: string;
  platform: string;
  url: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  createdAt: Date;
  branch: string;
  commit?: string;
  buildTime?: number;
  size?: string;
}

/**
 * Third-party integration configuration
 * @interface Integration
 */
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'development' | 'design' | 'marketing' | 'analytics' | 'productivity';
  status: 'available' | 'connected' | 'disabled';
  tier: 'free' | 'pro' | 'enterprise';
  popularity: number;
  setupComplexity: 'easy' | 'medium' | 'advanced';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: Date;
  lastActive: Date;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

// Page types - Updated to include Multi-Agent Orchestration
export type PageType = 
  | 'home'
  | 'dashboard'
  | 'projects'
  | 'tools'
  | 'tool-detail'
  | 'creator-content-pipeline'
  | 'multi-agent-orchestration'  // New page type
  | 'templates'
  | 'deployments'
  | 'analytics'
  | 'production-analytics'
  | 'collaboration'
  | 'integrations'
  | 'cicd'
  | 'gamification'
  | 'creator-mode'
  | 'influencer-suite'
  | 'print-on-demand'
  | 'marketplace-manager'
  | 'agents'
  | 'community'
  | 'performance'
  | 'security'
  | 'wellness'
  | 'workflows'
  | 'content-rights'
  | 'ai-trust'
  | 'settings'
  | 'about'
  | 'features'
  | 'pricing'
  | 'pricing-wireframe'
  | 'user-personas'
  | 'responsive-ui-kit'
  | 'backend-architecture'
  | 'infrastructure-strategy'
  | 'design-system-sync'
  | 'development-workflow'
  | 'quality-thresholds'
  | 'success-metrics'
  | 'security-compliance'
  | 'scalability-planning'
  | 'team-structure'
  | 'cross-functional-coordination'
  | 'discovery-phase-timeline'
  | 'development-phase-timeline'
  | 'common-blindspots'
  | 'immediate-next-actions'
  | 'advanced-performance'
  | 'enterprise-security'
  | 'advanced-deployment'
  | 'ai-code-intelligence'
  | 'advanced-collaboration'
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'demo'
  | 'subscription'
  | 'launch-campaign'
  | 'agent-dashboard'
  | 'workflow-pipeline'
  | 'integration-hub'
  | 'revenue-dashboard'
  | 'ai-models'
  | 'mobile-agents'
  | 'notifications'
  | 'automation-flow'
  | 'wellness-monitor'
  | 'no-code-workflows'
  | 'security-dashboard';

// Analytics types
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  conversionRate: number;
  revenue: number;
  userGrowth: number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  current?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  type: 'general' | 'support' | 'sales' | 'partnership';
}

// Performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  bundleSize: {
    total: number;
    gzipped: number;
    assets: Array<{ name: string; size: number }>;
  };
}

// Security types
export interface SecurityMetrics {
  vulnerabilityScore: number;
  threatsDetected: number;
  securityPosture: 'excellent' | 'good' | 'fair' | 'poor';
  lastScan: Date;
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    description: string;
    resolved: boolean;
  }>;
}

// Content creation types for CAP
export interface ContentOutput {
  id: string;
  platform: string;
  type: string;
  content: string;
  status: 'generating' | 'completed' | 'error';
  wordCount?: number;
  characterCount?: number;
  estimatedEngagement?: number;
  createdAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

export interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  outputs: string[];
  apiEndpoint?: string;
  rateLimits?: {
    daily: number;
    hourly: number;
  };
}

// Export all types
export * from './core';
export * from './creator';
export * from './marketplace';
export * from './project';
export * from './system';
export * from './multi-agent-orchestration';