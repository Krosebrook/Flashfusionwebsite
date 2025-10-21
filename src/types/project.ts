// Project and gamification related types
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