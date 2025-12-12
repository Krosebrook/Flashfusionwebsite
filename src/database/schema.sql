-- FlashFusion Production Database Schema
-- This schema supports the full gamification system, analytics, and user management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Users table with comprehensive gamification fields
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Gamification fields
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 1000,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  
  -- User preferences
  theme TEXT DEFAULT 'dark',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "achievements": true}',
  preferred_tools TEXT[] DEFAULT '{}',
  
  -- Subscription and limits
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  api_calls_used INTEGER DEFAULT 0,
  api_calls_limit INTEGER DEFAULT 100,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 1073741824, -- 1GB in bytes
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  total_projects INTEGER DEFAULT 0,
  total_deployments INTEGER DEFAULT 0,
  favorite_ai_tools TEXT[] DEFAULT '{}'
);

-- User achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  achievement_category TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress_data JSONB DEFAULT '{}',
  
  UNIQUE(user_id, achievement_id)
);

-- Daily tasks table
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  xp_reward INTEGER DEFAULT 50,
  target_value INTEGER DEFAULT 1,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  expires_at DATE DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Projects table with comprehensive metadata
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'web-app',
  
  -- Project configuration
  framework TEXT DEFAULT 'react',
  styling TEXT DEFAULT 'tailwind',
  features TEXT[] DEFAULT '{}',
  ai_tools_used TEXT[] DEFAULT '{}',
  
  -- Content and files
  project_data JSONB DEFAULT '{}',
  file_structure JSONB DEFAULT '{}',
  generated_code TEXT,
  
  -- Deployment info
  deployment_url TEXT,
  deployment_platform TEXT,
  deployment_status TEXT DEFAULT 'not_deployed',
  
  -- Analytics
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  
  -- Visibility and sharing
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}'
);

-- AI tool usage analytics
CREATE TABLE ai_tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_category TEXT NOT NULL,
  
  -- Usage details
  prompt_text TEXT,
  generated_output TEXT,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  -- Context
  user_level INTEGER,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments table
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Deployment details
  platform TEXT NOT NULL,
  deployment_url TEXT,
  deployment_id TEXT, -- External platform ID
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'success', 'failed', 'cancelled')),
  
  -- Configuration
  environment_variables JSONB DEFAULT '{}',
  build_command TEXT,
  output_directory TEXT DEFAULT 'dist',
  
  -- Logs and metadata
  build_logs TEXT,
  error_logs TEXT,
  deployment_size BIGINT,
  build_time_seconds INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ
);

-- User sessions for analytics
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  
  -- Session data
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Activity tracking
  pages_visited TEXT[] DEFAULT '{}',
  tools_used TEXT[] DEFAULT '{}',
  projects_worked_on UUID[] DEFAULT '{}',
  actions_performed JSONB DEFAULT '[]'
);

-- Community features
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, project_id)
);

CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES project_comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User API keys for external integrations
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_hint TEXT, -- Last 4 characters for display
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  
  UNIQUE(user_id, service_name)
);

-- Integrations table for platform connections
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service TEXT NOT NULL, -- vercel, netlify, railway, etc.
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  config JSONB DEFAULT '{}', -- API keys, tokens, settings
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, service)
);

-- User stats table for detailed analytics
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- XP and level tracking
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  total_images INTEGER DEFAULT 0,
  total_code INTEGER DEFAULT 0,
  daily_tasks_completed INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL, -- identifier for the badge type
  earned BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

-- Tool usage tracking table
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  credits_used INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard materialized view for performance
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.username,
  u.full_name,
  u.avatar_url,
  u.level,
  u.total_xp,
  u.current_streak,
  u.total_projects,
  u.total_deployments,
  ROW_NUMBER() OVER (ORDER BY u.total_xp DESC) as rank
FROM users u
WHERE u.total_xp > 0
ORDER BY u.total_xp DESC
LIMIT 1000;

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level_xp ON users(level, total_xp);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_daily_tasks_user_expires ON daily_tasks(user_id, expires_at);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_public_featured ON projects(is_public, is_featured);
CREATE INDEX idx_ai_tool_usage_user_tool ON ai_tool_usage(user_id, tool_id);
CREATE INDEX idx_ai_tool_usage_created ON ai_tool_usage(created_at);
CREATE INDEX idx_deployments_project_status ON deployments(project_id, status);
CREATE INDEX idx_user_sessions_user_started ON user_sessions(user_id, started_at);
CREATE INDEX idx_integrations_user_service ON integrations(user_id, service);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_badges_user_earned ON user_badges(user_id, earned);
CREATE INDEX idx_tool_usage_user_tool ON tool_usage(user_id, tool_id);

-- Refresh leaderboard function
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update project count
  UPDATE users 
  SET total_projects = (
    SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_project_stats
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Function to calculate XP for next level
CREATE OR REPLACE FUNCTION calculate_xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Exponential XP curve: 1000 * 1.5^(level-1)
  RETURN FLOOR(1000 * POWER(1.5, level - 1));
END;
$$ LANGUAGE plpgsql;

-- Function to level up user
CREATE OR REPLACE FUNCTION check_level_up(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_level INTEGER;
  current_xp INTEGER;
  xp_needed INTEGER;
  leveled_up BOOLEAN := FALSE;
BEGIN
  SELECT level, total_xp INTO current_level, current_xp
  FROM users WHERE id = user_uuid;
  
  LOOP
    xp_needed := calculate_xp_for_level(current_level + 1);
    
    IF current_xp >= xp_needed THEN
      current_level := current_level + 1;
      leveled_up := TRUE;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  IF leveled_up THEN
    UPDATE users 
    SET 
      level = current_level,
      xp_to_next_level = calculate_xp_for_level(current_level + 1) - current_xp
    WHERE id = user_uuid;
  END IF;
  
  RETURN leveled_up;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on needs)
CREATE POLICY "Users can view own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON daily_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable" ON projects
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can manage own integrations" ON integrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tool usage" ON tool_usage
  FOR ALL USING (auth.uid() = user_id);

-- Function to increment user XP
CREATE OR REPLACE FUNCTION increment_user_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $
DECLARE
  current_xp INTEGER;
  new_xp INTEGER;
BEGIN
  -- Get current XP
  SELECT xp INTO current_xp FROM user_stats WHERE user_id = user_uuid;
  
  -- If no stats record exists, create one
  IF current_xp IS NULL THEN
    INSERT INTO user_stats (user_id, xp) VALUES (user_uuid, xp_amount);
    current_xp := 0;
  END IF;
  
  new_xp := current_xp + xp_amount;
  
  -- Update user stats
  UPDATE user_stats 
  SET 
    xp = new_xp,
    updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Check if user leveled up
  PERFORM check_level_up(user_uuid);
END;
$ LANGUAGE plpgsql;