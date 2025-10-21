-- FlashFusion Comprehensive Database Schema
-- This schema supports all features: users, projects, AI tools, collaboration, analytics, etc.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  
  -- Subscription and billing
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'unlimited')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  
  -- Gamification
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_generations INTEGER DEFAULT 0,
  total_deployments INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  
  -- Usage tracking
  api_calls_used INTEGER DEFAULT 0,
  api_calls_limit INTEGER DEFAULT 100,
  storage_used_bytes BIGINT DEFAULT 0,
  storage_limit_bytes BIGINT DEFAULT 1073741824, -- 1GB
  monthly_generations INTEGER DEFAULT 0,
  
  -- Preferences
  preferred_ai_model TEXT DEFAULT 'gpt-4-turbo',
  preferred_framework TEXT DEFAULT 'react',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "marketing": false}',
  ui_preferences JSONB DEFAULT '{"theme": "dark", "language": "en"}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Teams for collaboration
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Billing
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Team memberships
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}',
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(team_id, user_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Ownership
  user_id UUID REFERENCES public.users(id),
  team_id UUID REFERENCES public.teams(id),
  
  -- Project details
  framework TEXT NOT NULL,
  template_id TEXT,
  repository_url TEXT,
  deployment_url TEXT,
  preview_url TEXT,
  
  -- Configuration
  config JSONB DEFAULT '{}',
  environment_variables JSONB DEFAULT '{}',
  build_settings JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'deployed', 'failed', 'archived')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
  
  -- Stats
  total_builds INTEGER DEFAULT 0,
  total_deployments INTEGER DEFAULT 0,
  last_build_at TIMESTAMPTZ,
  last_deployment_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Project collaborators
CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor' CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')),
  permissions JSONB DEFAULT '{}',
  
  added_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, user_id)
);

-- AI Generations (code, content, etc.)
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  project_id UUID REFERENCES public.projects(id),
  
  -- Generation details
  type TEXT NOT NULL CHECK (type IN ('code', 'content', 'image', 'api', 'full-stack', 'ecommerce', 'documentation')),
  ai_model TEXT NOT NULL,
  ai_provider TEXT NOT NULL,
  
  -- Input/Output
  input_prompt TEXT NOT NULL,
  input_config JSONB DEFAULT '{}',
  output_content TEXT,
  output_files JSONB DEFAULT '{}',
  output_metadata JSONB DEFAULT '{}',
  
  -- Processing
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')),
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  
  -- Storage
  storage_path TEXT,
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  
  -- Quality metrics
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Deployments
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  
  -- Deployment details
  platform TEXT NOT NULL CHECK (platform IN ('vercel', 'netlify', 'heroku', 'aws', 'gcp', 'azure', 'railway', 'fly')),
  deployment_id TEXT, -- External platform deployment ID
  url TEXT,
  preview_url TEXT,
  
  -- Configuration
  environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
  build_config JSONB DEFAULT '{}',
  environment_variables JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'ready', 'error', 'canceled')),
  build_logs TEXT[],
  error_message TEXT,
  
  -- Metrics
  build_time_ms INTEGER,
  deploy_time_ms INTEGER,
  bundle_size_bytes BIGINT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Template details
  category TEXT NOT NULL,
  framework TEXT NOT NULL,
  tags TEXT[],
  
  -- Content
  files JSONB NOT NULL,
  config JSONB DEFAULT '{}',
  dependencies JSONB DEFAULT '{}',
  
  -- Metadata
  author_id UUID REFERENCES public.users(id),
  is_official BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Stats
  usage_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- User API Keys (encrypted)
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Key details
  provider TEXT NOT NULL,
  key_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider, key_name)
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  
  -- Requirements
  requirements JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  
  -- Achievement details
  progress JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  session_id TEXT,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_properties JSONB DEFAULT '{}',
  
  -- Context
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Location
  country TEXT,
  region TEXT,
  city TEXT,
  
  -- Device info
  device_type TEXT,
  browser TEXT,
  os TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Notification details
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT,
  
  -- Action
  action_url TEXT,
  action_text TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Delivery
  channels TEXT[] DEFAULT ARRAY['in-app'],
  delivered_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Integration connections
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Integration details
  provider TEXT NOT NULL,
  provider_account_id TEXT,
  
  -- Configuration
  config JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}', -- Encrypted
  
  -- Status
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error', 'expired')),
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- Workspaces for multi-agent orchestration
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Ownership
  user_id UUID REFERENCES public.users(id),
  team_id UUID REFERENCES public.teams(id),
  
  -- Configuration
  agents_config JSONB DEFAULT '{}',
  workflow_config JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Agent workflows
CREATE TABLE IF NOT EXISTS public.agent_workflows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Workflow definition
  workflow_definition JSONB NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  
  -- Stats
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow executions
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workflow_id UUID REFERENCES public.agent_workflows(id) ON DELETE CASCADE,
  
  -- Execution details
  trigger_data JSONB DEFAULT '{}',
  execution_log JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'canceled')),
  error_message TEXT,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

-- Subscriptions and billing
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  team_id UUID REFERENCES public.teams(id),
  
  -- Stripe integration
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription details
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- Usage tracking
  usage_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  
  -- Usage details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  
  -- Request/Response
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  response_time_ms INTEGER,
  status_code INTEGER,
  
  -- Resource usage
  ai_model TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Partitioning by month
  month_year TEXT GENERATED ALWAYS AS (to_char(created_at, 'YYYY-MM')) STORED
);

-- File storage tracking
CREATE TABLE IF NOT EXISTS public.file_storage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  project_id UUID REFERENCES public.projects(id),
  generation_id UUID REFERENCES public.generations(id),
  
  -- File details
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  content_type TEXT,
  file_hash TEXT,
  
  -- Storage details
  bucket_name TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'supabase',
  
  -- Access control
  is_public BOOLEAN DEFAULT FALSE,
  access_token TEXT,
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_type ON public.generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_status ON public.generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at);
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_month_year ON public.api_usage(month_year);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_storage ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can see their own data)
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Team members can view team projects" ON public.projects FOR SELECT USING (
  team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view own generations" ON public.generations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own deployments" ON public.deployments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own integrations" ON public.integrations FOR ALL USING (auth.uid() = user_id);

-- Functions and triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.users SET 
    monthly_generations = 0,
    api_calls_used = 0
  WHERE subscription_tier != 'unlimited';
END;
$$ LANGUAGE plpgsql;

-- Schedule monthly usage reset (first day of each month at midnight)
SELECT cron.schedule('reset-monthly-usage', '0 0 1 * *', 'SELECT reset_monthly_usage();');