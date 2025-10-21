// Core application types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  subscription?: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLogin: Date;
}

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
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'demo';

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

// Export all other type modules
export * from './core';
export * from './creator';
export * from './marketplace';
export * from './project';
export * from './system';
export * from './multi-agent-orchestration';