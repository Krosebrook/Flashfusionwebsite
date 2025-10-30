/**
 * @fileoverview Project and gamification related type definitions
 * @module types/project
 */

/**
 * Project information with deployment and technology details
 * @interface Project
 * @property {string} id - Unique project identifier
 * @property {string} name - Project name
 * @property {string} type - Project type
 * @property {string} framework - Framework used
 * @property {string} description - Project description
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {string} user_id - Owner user ID
 * @property {'active' | 'completed' | 'archived'} status - Project status
 * @property {string} [deployment_url] - Deployment URL
 * @property {string} [repository_url] - Repository URL
 * @property {string} [preview_image] - Preview image URL
 * @property {string[]} technologies - List of technologies used
 * @property {string[]} features - List of features
 * @property {number} [performance_score] - Performance score (0-100)
 */
export interface Project {
  id: string;
  name: string;
  type: string;
  framework: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: 'active' | 'completed' | 'archived';
  deployment_url?: string;
  repository_url?: string;
  preview_image?: string;
  technologies: string[];
  features: string[];
  performance_score?: number;
}

/**
 * Daily task for user engagement and progression
 * @interface DailyTask
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {'create_project' | 'use_ai_tools' | 'deploy_project' | 'collaborate' | 'learn'} type - Task type
 * @property {boolean} completed - Whether task is completed
 * @property {number} xp_reward - XP reward for completion
 * @property {string} created_at - Creation timestamp
 * @property {string} due_date - Task due date
 */
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'create_project' | 'use_ai_tools' | 'deploy_project' | 'collaborate' | 'learn';
  completed: boolean;
  xp_reward: number;
  created_at: string;
  due_date: string;
}

/**
 * User achievement badge with progress tracking
 * @interface Achievement
 * @property {string} id - Unique achievement identifier
 * @property {string} name - Achievement name
 * @property {string} description - Achievement description
 * @property {string} icon - Icon identifier or URL
 * @property {'beginner' | 'intermediate' | 'advanced' | 'expert'} category - Achievement category
 * @property {number} xp_reward - XP reward for unlocking
 * @property {boolean} unlocked - Whether achievement is unlocked
 * @property {string} [unlocked_at] - Unlock timestamp
 * @property {number} [progress] - Current progress
 * @property {number} [max_progress] - Maximum progress required
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xp_reward: number;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
}

/**
 * Platform tool or feature definition
 * @interface Tool
 * @property {string} id - Unique tool identifier
 * @property {string} name - Tool name
 * @property {string} description - Tool description
 * @property {string} category - Tool category
 * @property {string} icon - Icon identifier or URL
 * @property {'free' | 'pro' | 'enterprise'} tier - Required subscription tier
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tier: 'free' | 'pro' | 'enterprise';
  usage_count?: number;
  last_used?: string;
  features: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  // Creator Mode specific fields
  pain_point?: string;
  platforms?: string[];
  content_types?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image: string;
  technologies: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  features: string[];
  tier: 'free' | 'pro' | 'enterprise';
  usage_count: number;
  rating: number;
  created_by: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  project_id: string;
  platform: string;
  url: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  created_at: string;
  build_logs?: string[];
  performance_metrics?: {
    loading_time: number;
    lighthouse_score: number;
    bundle_size: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'available' | 'connected' | 'error';
  tier: 'free' | 'pro' | 'enterprise';
  setup_complexity: 'easy' | 'medium' | 'hard';
  features: string[];
  pricing?: string;
  documentation_url: string;
}

export interface CollaborationInvite {
  id: string;
  project_id: string;
  inviter_id: string;
  invitee_email: string;
  role: 'viewer' | 'editor' | 'admin';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
}

export interface CICDPipeline {
  id: string;
  project_id: string;
  name: string;
  triggers: string[];
  steps: PipelineStep[];
  status: 'active' | 'inactive' | 'error';
  last_run?: {
    status: 'success' | 'failed' | 'running';
    started_at: string;
    completed_at?: string;
    duration?: number;
    logs: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'notify';
  configuration: Record<string, any>;
  order: number;
}