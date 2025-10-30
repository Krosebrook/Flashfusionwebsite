/**
 * @fileoverview Creator Mode specific type definitions
 * @module types/creator
 */

/**
 * Content idea for creator inspiration
 * @interface ContentIdea
 * @property {string} id - Unique idea identifier
 * @property {string} title - Idea title
 * @property {string} description - Detailed description
 * @property {string[]} platform - Target platforms (e.g., YouTube, TikTok)
 * @property {string} category - Content category
 * @property {'easy' | 'medium' | 'hard'} difficulty - Difficulty level
 * @property {string} estimated_time - Estimated time to create
 * @property {'high' | 'medium' | 'low'} engagement_potential - Expected engagement level
 * @property {boolean} trending - Whether idea is currently trending
 * @property {string[]} keywords - Related keywords
 * @property {string} created_at - Creation timestamp
 */
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

/**
 * AI-generated social media caption
 * @interface GeneratedCaption
 * @property {string} id - Unique caption identifier
 * @property {string} text - Caption text
 * @property {string} platform - Target platform
 * @property {string} category - Content category
 * @property {string[]} hooks - Attention-grabbing hooks
 * @property {string} cta - Call-to-action text
 * @property {string[]} hashtags - Suggested hashtags
 * @property {number} character_count - Character count
 * @property {number} engagement_score - Predicted engagement score (0-100)
 * @property {number} brand_alignment_score - Brand alignment score (0-100)
 * @property {string} created_at - Creation timestamp
 */
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

/**
 * Content calendar event for scheduling posts
 * @interface ContentCalendarEvent
 * @property {string} id - Unique event identifier
 * @property {string} user_id - Owner user ID
 * @property {string} title - Event title
 * @property {string} content - Content to be published
 * @property {string[]} platform - Target platforms
 * @property {string} scheduled_time - Scheduled publication time
 * @property {'draft' | 'scheduled' | 'published' | 'failed'} status - Publication status
 * @property {Object} [engagement_metrics] - Post engagement metrics
 * @property {number} engagement_metrics.views - View count
 * @property {number} engagement_metrics.likes - Like count
 * @property {number} engagement_metrics.comments - Comment count
 * @property {number} engagement_metrics.shares - Share count
 * @property {number} engagement_metrics.saves - Save count
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */
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

/**
 * Creator mode module configuration
 * @interface CreatorModule
 */
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