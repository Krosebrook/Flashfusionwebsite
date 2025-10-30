/**
 * @fileoverview System, subscription, and business logic type definitions
 * @module types/system
 */

/**
 * Subscription plan information with features and limits
 * @interface SubscriptionPlan
 * @property {string} id - Unique plan identifier
 * @property {'free' | 'pro' | 'enterprise'} name - Plan tier name
 * @property {string} display_name - Display name for UI
 * @property {number} price - Price per billing interval
 * @property {'month' | 'year'} interval - Billing interval
 * @property {string[]} features - List of included features
 * @property {Object} limits - Usage limits for the plan
 * @property {number} limits.projects - Maximum number of projects
 * @property {number} limits.ai_tools_per_month - Monthly AI tool usage limit
 * @property {number} limits.storage_gb - Storage limit in GB
 * @property {number} limits.collaborators - Maximum collaborators
 * @property {number} limits.deployments_per_month - Monthly deployment limit
 * @property {boolean} [popular] - Whether plan is marked as popular
 * @property {string[]} [enterprise_features] - Additional enterprise features
 */
export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'pro' | 'enterprise';
  display_name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    projects: number;
    ai_tools_per_month: number;
    storage_gb: number;
    collaborators: number;
    deployments_per_month: number;
  };
  popular?: boolean;
  enterprise_features?: string[];
}

/**
 * Launch campaign for project marketing
 * @interface LaunchCampaign
 * @property {string} id - Unique campaign identifier
 * @property {string} user_id - Owner user ID
 * @property {string} project_id - Associated project ID
 * @property {string} name - Campaign name
 * @property {string} description - Campaign description
 * @property {string} launch_date - Scheduled launch date
 * @property {'planning' | 'active' | 'completed' | 'paused'} status - Campaign status
 * @property {LaunchChannel[]} channels - Marketing channels
 * @property {Object} metrics - Campaign performance metrics
 * @property {number} metrics.impressions - Total impressions
 * @property {number} metrics.clicks - Total clicks
 * @property {number} metrics.conversions - Total conversions
 * @property {number} metrics.engagement_rate - Engagement rate percentage
 * @property {number} [budget] - Campaign budget
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */
export interface LaunchCampaign {
  id: string;
  user_id: string;
  project_id: string;
  name: string;
  description: string;
  launch_date: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  channels: LaunchChannel[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    engagement_rate: number;
  };
  budget?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Launch channel configuration and metrics
 * @interface LaunchChannel
 * @property {string} platform - Platform name (e.g., Twitter, LinkedIn)
 * @property {string} content - Content to be published
 * @property {string} scheduled_time - Scheduled publication time
 * @property {'draft' | 'scheduled' | 'published'} status - Publication status
 * @property {Object} [performance_metrics] - Channel performance metrics
 * @property {number} performance_metrics.reach - Total reach
 * @property {number} performance_metrics.engagement - Engagement count
 * @property {number} performance_metrics.clicks - Click count
 * @property {number} performance_metrics.conversions - Conversion count
 */
export interface LaunchChannel {
  platform: string;
  content: string;
  scheduled_time: string;
  status: 'draft' | 'scheduled' | 'published';
  performance_metrics?: {
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
}

export interface ApiKey {
  id: string;
  user_id: string;
  service: string;
  key_name: string;
  encrypted_key: string;
  is_active: boolean;
  last_used?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowAutomation {
  id: string;
  user_id: string;
  name: string;
  description: string;
  trigger_type: 'schedule' | 'webhook' | 'manual' | 'event';
  trigger_config: Record<string, any>;
  actions: WorkflowAction[];
  is_active: boolean;
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowAction {
  id: string;
  type: 'api_call' | 'email' | 'webhook' | 'create_content' | 'deploy';
  configuration: Record<string, any>;
  order: number;
  conditions?: Record<string, any>;
}

export interface SystemMetrics {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users?: string[];
  target_tiers?: ('free' | 'pro' | 'enterprise')[];
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface BackupRecord {
  id: string;
  user_id: string;
  backup_type: 'project' | 'user_data' | 'full';
  file_path: string;
  file_size: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  expires_at: string;
}

export interface BillingRecord {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  billing_period_start: string;
  billing_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorReport {
  id: string;
  user_id?: string;
  error_type: string;
  error_message: string;
  stack_trace: string;
  request_url: string;
  user_agent: string;
  occurred_at: string;
  resolved_at?: string;
  metadata?: Record<string, any>;
}