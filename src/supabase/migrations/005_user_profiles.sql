-- Migration: User Profiles for Authentication
-- Description: Create user profiles table for extended user data
-- Version: 005
-- Date: 2024-01-20

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create user_sessions table for session tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Enable RLS on sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE
);

-- Create indexes for verification tokens
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- Enable RLS on verification tokens
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Only the user can view their own verification tokens
CREATE POLICY "Users can view own verification tokens" ON email_verification_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE
);

-- Create indexes for reset tokens
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable RLS on reset tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Only the user can view their own reset tokens
CREATE POLICY "Users can view own reset tokens" ON password_reset_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Insert default admin user (optional)
-- Uncomment and modify if you want to create a default admin
/*
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'admin@flashfusion.ai',
    crypt('your-secure-password', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"name": "FlashFusion Admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;
*/

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_verification_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON password_reset_tokens TO authenticated;

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON TABLE user_sessions IS 'User session tracking for security';
COMMENT ON TABLE email_verification_tokens IS 'Email verification tokens for signup';
COMMENT ON TABLE password_reset_tokens IS 'Password reset tokens for recovery';

COMMENT ON COLUMN user_profiles.role IS 'User role: user, admin, or moderator';
COMMENT ON COLUMN user_profiles.subscription_tier IS 'Subscription level: free, pro, or enterprise';
COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Whether user has completed onboarding flow';
COMMENT ON COLUMN user_profiles.preferences IS 'User preferences and settings';
COMMENT ON COLUMN user_profiles.metadata IS 'Additional user metadata and analytics';