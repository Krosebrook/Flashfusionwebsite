// Creator Mode specific types
export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: string;
  engagement_potential: 'high' | 'medium' | 'low';
  trending: boolean;
  keywords: string[];
  created_at: string;
}

export interface GeneratedCaption {
  id: string;
  text: string;
  platform: string;
  category: string;
  hooks: string[];
  cta: string;
  hashtags: string[];
  character_count: number;
  engagement_score: number;
  brand_alignment_score: number;
  created_at: string;
}

export interface ContentCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: string[];
  scheduled_time: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement_metrics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatorModule {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'branding' | 'growth' | 'monetization' | 'analytics' | 'automation';
  tier: 'free' | 'pro' | 'enterprise';
  pain_point: string;
  usage_count: number;
  max_usage: number;
  is_active: boolean;
  completed_tasks: number;
  total_tasks: number;
}

export interface ViralFormat {
  name: string;
  description: string;
  platforms: string[];
  example: string;
  category: 'trend' | 'evergreen' | 'seasonal';
  engagement_potential: 'high' | 'medium' | 'low';
}

export interface HashtagSet {
  id: string;
  platform: string;
  category: string;
  hashtags: string[];
  engagement_score: number;
  reach_potential: 'high' | 'medium' | 'low';
  trending: boolean;
  last_updated: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  platform: string[];
  template_content: string;
  variables: string[];
  category: string;
  estimated_engagement: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export interface CreatorInsight {
  id: string;
  user_id: string;
  insight_type: 'performance' | 'trend' | 'audience' | 'content';
  title: string;
  description: string;
  action_items: string[];
  priority: 'high' | 'medium' | 'low';
  data: Record<string, any>;
  created_at: string;
}

export interface BrandGuideline {
  id: string;
  brand_kit_id: string;
  category: 'visual' | 'voice' | 'content' | 'social';
  title: string;
  description: string;
  do_examples: string[];
  dont_examples: string[];
  created_at: string;
}

export interface CollaborationRequest {
  id: string;
  requester_id: string;
  target_creator_id: string;
  collaboration_type: 'content_swap' | 'joint_project' | 'cross_promotion' | 'mentorship';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  details: string;
  proposed_timeline: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorMetrics {
  id: string;
  user_id: string;
  date: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  clicks: number;
  saves: number;
  shares: number;
  comments: number;
  likes: number;
  created_at: string;
}