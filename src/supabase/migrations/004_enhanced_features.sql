-- Enhanced FlashFusion Features Database Schema
-- Adds tables for improved AI integration and collaboration

-- AI Usage Logs Table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    prompt_length INTEGER NOT NULL DEFAULT 0,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    response_time INTEGER NOT NULL DEFAULT 0,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enhanced Collaboration Sessions
CREATE TABLE IF NOT EXISTS collaboration_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "projectId" VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    participants UUID[] DEFAULT '{}',
    "createdBy" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastActivity" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended'))
);

-- Collaboration Session Data
CREATE TABLE IF NOT EXISTS collaboration_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    content TEXT DEFAULT '',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Collaboration Events
CREATE TABLE IF NOT EXISTS collaboration_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cursor_move', 'text_change', 'user_join', 'user_leave', 'chat_message')),
    session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB DEFAULT '{}'
);

-- Collaboration Chat
CREATE TABLE IF NOT EXISTS collaboration_chat (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "sessionId" UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table (Enhanced)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) DEFAULT 'web-app',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    tech_stack JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    collaborators UUID[] DEFAULT '{}'
);

-- Project Files
CREATE TABLE IF NOT EXISTS project_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    content TEXT,
    language VARCHAR(50),
    size_bytes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(project_id, filepath)
);

-- Deployments Table
CREATE TABLE IF NOT EXISTS deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'deployed', 'failed')),
    build_log TEXT,
    environment JSONB DEFAULT '{}',
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Analytics
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Feature Usage Tracking
CREATE TABLE IF NOT EXISTS feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_time_seconds INTEGER DEFAULT 0,
    UNIQUE(user_id, feature_name)
);

-- API Keys Management
CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    encrypted_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, service_name, key_name)
);

-- Gamification - User XP and Levels
CREATE TABLE IF NOT EXISTS user_gamification (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_xp_earned INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    achievements TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{}'
);

-- XP Transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON ai_usage_logs(model);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_participants ON collaboration_sessions USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_created_by ON collaboration_sessions("createdBy");
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_last_activity ON collaboration_sessions("lastActivity");

CREATE INDEX IF NOT EXISTS idx_collaboration_events_session_id ON collaboration_events(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_events_timestamp ON collaboration_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_collaboration_events_type ON collaboration_events(type);

CREATE INDEX IF NOT EXISTS idx_collaboration_chat_session_id ON collaboration_chat("sessionId");
CREATE INDEX IF NOT EXISTS idx_collaboration_chat_timestamp ON collaboration_chat(timestamp);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_updated_at ON project_files(updated_at);

CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at);

CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);

CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_name ON feature_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_last_used ON feature_usage(last_used);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_service_name ON user_api_keys(service_name);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- AI Usage Logs - Users can only see their own logs
CREATE POLICY "Users can view own AI usage logs" ON ai_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage logs" ON ai_usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collaboration Sessions - Users can see sessions they're part of
CREATE POLICY "Users can view collaboration sessions they participate in" ON collaboration_sessions
    FOR SELECT USING (
        auth.uid() = "createdBy" OR 
        auth.uid() = ANY(participants)
    );

CREATE POLICY "Users can create collaboration sessions" ON collaboration_sessions
    FOR INSERT WITH CHECK (auth.uid() = "createdBy");

CREATE POLICY "Users can update collaboration sessions they created or participate in" ON collaboration_sessions
    FOR UPDATE USING (
        auth.uid() = "createdBy" OR 
        auth.uid() = ANY(participants)
    );

-- Projects - Users can see projects they own or collaborate on
CREATE POLICY "Users can view own projects and collaborations" ON projects
    FOR SELECT USING (
        auth.uid() = created_by OR 
        auth.uid() = ANY(collaborators)
    );

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (
        auth.uid() = created_by OR 
        auth.uid() = ANY(collaborators)
    );

-- User Analytics - Users can only see their own analytics
CREATE POLICY "Users can view own analytics" ON user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON user_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feature Usage - Users can only see their own usage
CREATE POLICY "Users can view own feature usage" ON feature_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feature usage" ON feature_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feature usage" ON feature_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- API Keys - Users can only see their own keys
CREATE POLICY "Users can view own API keys" ON user_api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON user_api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON user_api_keys
    FOR UPDATE USING (auth.uid() = user_id);

-- Gamification - Users can see their own gamification data
CREATE POLICY "Users can view own gamification data" ON user_gamification
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification data" ON user_gamification
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data" ON user_gamification
    FOR UPDATE USING (auth.uid() = user_id);

-- XP Transactions - Users can see their own transactions
CREATE POLICY "Users can view own XP transactions" ON xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP transactions" ON xp_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications - Users can see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON project_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Realtime subscriptions for collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_events;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;