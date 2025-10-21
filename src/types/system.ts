// System, subscription, and business logic types
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