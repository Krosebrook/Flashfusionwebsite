-- Phase 1 Features: Multi-Model AI Integration, Live Collaboration, Basic CI/CD
-- Migration: 003_phase1_features.sql

-- AI Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  context JSONB,
  user_id UUID,
  project_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for AI conversations
CREATE INDEX IF NOT EXISTS idx_ai_conversations_model ON ai_conversations(model);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_project_id ON ai_conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

-- AI Model Usage Statistics
CREATE TABLE IF NOT EXISTS ai_model_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,6) DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on model
ALTER TABLE ai_model_usage 
ADD CONSTRAINT unique_ai_model_usage_model UNIQUE (model);

-- Collaboration Sessions Table
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id VARCHAR(100) PRIMARY KEY,
  project_id UUID NOT NULL,
  file_id VARCHAR(200) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  language VARCHAR(50) DEFAULT 'javascript',
  code_content TEXT DEFAULT '',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for collaboration sessions
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_project_id ON collaboration_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_is_active ON collaboration_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_updated_at ON collaboration_sessions(updated_at);

-- Collaboration Users Table
CREATE TABLE IF NOT EXISTS collaboration_users (
  id VARCHAR(150) PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_avatar VARCHAR(10) NOT NULL,
  user_color VARCHAR(7) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  cursor_position JSONB,
  selection JSONB,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for collaboration users
CREATE INDEX IF NOT EXISTS idx_collaboration_users_session_id ON collaboration_users(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_users_user_id ON collaboration_users(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_users_is_active ON collaboration_users(is_active);
CREATE INDEX IF NOT EXISTS idx_collaboration_users_last_seen ON collaboration_users(last_seen);

-- Add foreign key constraint
ALTER TABLE collaboration_users 
ADD CONSTRAINT fk_collaboration_users_session 
FOREIGN KEY (session_id) REFERENCES collaboration_sessions(id) ON DELETE CASCADE;

-- Collaboration Changes Table (for operational transformation)
CREATE TABLE IF NOT EXISTS collaboration_changes (
  id VARCHAR(150) PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL,
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('insert', 'delete', 'replace')),
  position JSONB NOT NULL,
  content TEXT NOT NULL,
  old_content TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied BOOLEAN DEFAULT false,
  conflict_resolved BOOLEAN DEFAULT false
);

-- Create indexes for collaboration changes
CREATE INDEX IF NOT EXISTS idx_collaboration_changes_session_id ON collaboration_changes(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_changes_user_id ON collaboration_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_changes_timestamp ON collaboration_changes(timestamp);
CREATE INDEX IF NOT EXISTS idx_collaboration_changes_applied ON collaboration_changes(applied);

-- Add foreign key constraint
ALTER TABLE collaboration_changes 
ADD CONSTRAINT fk_collaboration_changes_session 
FOREIGN KEY (session_id) REFERENCES collaboration_sessions(id) ON DELETE CASCADE;

-- CI/CD Pipelines Table
CREATE TABLE IF NOT EXISTS cicd_pipelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name VARCHAR(200) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'cancelled')),
  environment VARCHAR(20) DEFAULT 'development' CHECK (environment IN ('development', 'staging', 'production')),
  commit_hash VARCHAR(40),
  commit_message TEXT,
  commit_author VARCHAR(100),
  stages JSONB NOT NULL DEFAULT '[]',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  total_duration INTEGER,
  deployment_url VARCHAR(500),
  trigger_type VARCHAR(20) DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'push', 'pull_request', 'schedule')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for CI/CD pipelines
CREATE INDEX IF NOT EXISTS idx_cicd_pipelines_project_id ON cicd_pipelines(project_id);
CREATE INDEX IF NOT EXISTS idx_cicd_pipelines_status ON cicd_pipelines(status);
CREATE INDEX IF NOT EXISTS idx_cicd_pipelines_environment ON cicd_pipelines(environment);
CREATE INDEX IF NOT EXISTS idx_cicd_pipelines_branch ON cicd_pipelines(branch);
CREATE INDEX IF NOT EXISTS idx_cicd_pipelines_created_at ON cicd_pipelines(created_at);

-- Pipeline Stages Table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  stage_order INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'skipped', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  logs TEXT[] DEFAULT '{}',
  artifacts JSONB DEFAULT '[]',
  test_results JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for pipeline stages
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_id ON pipeline_stages(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_status ON pipeline_stages(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_stage_order ON pipeline_stages(stage_order);

-- Add foreign key constraint
ALTER TABLE pipeline_stages 
ADD CONSTRAINT fk_pipeline_stages_pipeline 
FOREIGN KEY (pipeline_id) REFERENCES cicd_pipelines(id) ON DELETE CASCADE;

-- Deployment Targets Table
CREATE TABLE IF NOT EXISTS deployment_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  environment VARCHAR(20) NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'deploying', 'error')),
  health VARCHAR(20) DEFAULT 'unknown' CHECK (health IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
  configuration JSONB DEFAULT '{}',
  last_deployment TIMESTAMP WITH TIME ZONE,
  last_health_check TIMESTAMP WITH TIME ZONE,
  project_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for deployment targets
CREATE INDEX IF NOT EXISTS idx_deployment_targets_project_id ON deployment_targets(project_id);
CREATE INDEX IF NOT EXISTS idx_deployment_targets_environment ON deployment_targets(environment);
CREATE INDEX IF NOT EXISTS idx_deployment_targets_status ON deployment_targets(status);
CREATE INDEX IF NOT EXISTS idx_deployment_targets_health ON deployment_targets(health);

-- Deployment History Table
CREATE TABLE IF NOT EXISTS deployment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL,
  target_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'deploying', 'success', 'failed', 'rolled_back')),
  version VARCHAR(50),
  deployment_url VARCHAR(500),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  logs TEXT[] DEFAULT '{}',
  rollback_reason TEXT,
  deployed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for deployment history
CREATE INDEX IF NOT EXISTS idx_deployment_history_pipeline_id ON deployment_history(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_deployment_history_target_id ON deployment_history(target_id);
CREATE INDEX IF NOT EXISTS idx_deployment_history_status ON deployment_history(status);
CREATE INDEX IF NOT EXISTS idx_deployment_history_created_at ON deployment_history(created_at);

-- Add foreign key constraints
ALTER TABLE deployment_history 
ADD CONSTRAINT fk_deployment_history_pipeline 
FOREIGN KEY (pipeline_id) REFERENCES cicd_pipelines(id) ON DELETE CASCADE;

ALTER TABLE deployment_history 
ADD CONSTRAINT fk_deployment_history_target 
FOREIGN KEY (target_id) REFERENCES deployment_targets(id) ON DELETE CASCADE;

-- Project Settings Table (for storing project-specific configurations)
CREATE TABLE IF NOT EXISTS project_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL UNIQUE,
  ai_settings JSONB DEFAULT '{}',
  collaboration_settings JSONB DEFAULT '{}',
  cicd_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for project settings
CREATE INDEX IF NOT EXISTS idx_project_settings_project_id ON project_settings(project_id);

-- Real-time Subscriptions for Collaboration
-- Enable real-time for collaboration tables
ALTER TABLE collaboration_sessions REPLICA IDENTITY FULL;
ALTER TABLE collaboration_users REPLICA IDENTITY FULL;
ALTER TABLE collaboration_changes REPLICA IDENTITY FULL;

-- Enable real-time for CI/CD tables
ALTER TABLE cicd_pipelines REPLICA IDENTITY FULL;
ALTER TABLE pipeline_stages REPLICA IDENTITY FULL;
ALTER TABLE deployment_history REPLICA IDENTITY FULL;

-- Row Level Security (RLS) Policies

-- AI Conversations RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI conversations" ON ai_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own AI conversations" ON ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Collaboration Sessions RLS
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaboration sessions they participate in" ON collaboration_sessions
  FOR SELECT USING (
    id IN (
      SELECT session_id FROM collaboration_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create collaboration sessions" ON collaboration_sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Collaboration Users RLS
ALTER TABLE collaboration_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaboration users in their sessions" ON collaboration_users
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own collaboration presence" ON collaboration_users
  FOR ALL USING (user_id = auth.uid());

-- Collaboration Changes RLS
ALTER TABLE collaboration_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view changes in their collaboration sessions" ON collaboration_changes
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM collaboration_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create changes in their collaboration sessions" ON collaboration_changes
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    session_id IN (
      SELECT session_id FROM collaboration_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- CI/CD Pipelines RLS
ALTER TABLE cicd_pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipelines for their projects" ON cicd_pipelines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create pipelines" ON cicd_pipelines
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own pipelines" ON cicd_pipelines
  FOR UPDATE USING (created_by = auth.uid());

-- Functions and Triggers

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaboration_sessions_updated_at BEFORE UPDATE ON collaboration_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cicd_pipelines_updated_at BEFORE UPDATE ON cicd_pipelines 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON pipeline_stages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployment_targets_updated_at BEFORE UPDATE ON deployment_targets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_settings_updated_at BEFORE UPDATE ON project_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update AI model usage statistics
CREATE OR REPLACE FUNCTION update_ai_model_usage(
  model_name VARCHAR(100),
  tokens_used INTEGER,
  response_time INTEGER,
  success BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_model_usage (model, total_requests, total_tokens, avg_response_time, last_used)
  VALUES (model_name, 1, tokens_used, response_time, NOW())
  ON CONFLICT (model) DO UPDATE SET
    total_requests = ai_model_usage.total_requests + 1,
    total_tokens = ai_model_usage.total_tokens + tokens_used,
    avg_response_time = (ai_model_usage.avg_response_time + response_time) / 2,
    success_rate = CASE 
      WHEN success THEN 
        (ai_model_usage.success_rate * ai_model_usage.total_requests + 100) / (ai_model_usage.total_requests + 1)
      ELSE 
        (ai_model_usage.success_rate * ai_model_usage.total_requests) / (ai_model_usage.total_requests + 1)
    END,
    last_used = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old collaboration data
CREATE OR REPLACE FUNCTION cleanup_old_collaboration_data()
RETURNS VOID AS $$
BEGIN
  -- Mark users as inactive if they haven't been seen for 30 minutes
  UPDATE collaboration_users 
  SET is_active = false 
  WHERE last_seen < NOW() - INTERVAL '30 minutes' AND is_active = true;
  
  -- Delete sessions with no active users for 24 hours
  DELETE FROM collaboration_sessions 
  WHERE id NOT IN (
    SELECT DISTINCT session_id 
    FROM collaboration_users 
    WHERE is_active = true
  ) AND updated_at < NOW() - INTERVAL '24 hours';
  
  -- Delete old changes (keep last 1000 per session)
  DELETE FROM collaboration_changes 
  WHERE id NOT IN (
    SELECT id FROM (
      SELECT id, 
        ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp DESC) as rn
      FROM collaboration_changes
    ) ranked
    WHERE rn <= 1000
  );
END;
$$ LANGUAGE plpgsql;

-- Insert default AI model configurations
INSERT INTO ai_model_usage (model, total_requests, total_tokens, success_rate, avg_response_time) VALUES
  ('gpt-4-turbo', 0, 0, 0, 0),
  ('claude-3-opus', 0, 0, 0, 0),
  ('gemini-pro', 0, 0, 0, 0),
  ('codellama-34b', 0, 0, 0, 0),
  ('mistral-large', 0, 0, 0, 0)
ON CONFLICT (model) DO NOTHING;

-- Insert default deployment targets (examples)
INSERT INTO deployment_targets (name, provider, environment, status, health) VALUES
  ('Vercel Production', 'Vercel', 'production', 'disconnected', 'unknown'),
  ('Netlify Staging', 'Netlify', 'staging', 'disconnected', 'unknown'),
  ('AWS Development', 'AWS', 'development', 'disconnected', 'unknown')
ON CONFLICT DO NOTHING;

-- Create a scheduled job to cleanup old data (requires pg_cron extension)
-- This would typically be set up separately
-- SELECT cron.schedule('cleanup-collaboration-data', '0 */6 * * *', 'SELECT cleanup_old_collaboration_data();');

COMMENT ON TABLE ai_conversations IS 'Stores AI conversation history with context and usage metrics';
COMMENT ON TABLE ai_model_usage IS 'Tracks usage statistics and performance metrics for each AI model';
COMMENT ON TABLE collaboration_sessions IS 'Real-time collaborative editing sessions';
COMMENT ON TABLE collaboration_users IS 'Users participating in collaborative sessions with presence info';
COMMENT ON TABLE collaboration_changes IS 'Operational transform changes for collaborative editing';
COMMENT ON TABLE cicd_pipelines IS 'CI/CD pipeline configurations and execution history';
COMMENT ON TABLE pipeline_stages IS 'Individual stages within CI/CD pipelines';
COMMENT ON TABLE deployment_targets IS 'Deployment target configurations and health status';
COMMENT ON TABLE deployment_history IS 'Historical record of all deployments';
COMMENT ON TABLE project_settings IS 'Project-specific settings for AI, collaboration, and CI/CD features';