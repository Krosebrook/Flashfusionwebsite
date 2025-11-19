# Supabase Setup Guide

**Purpose**: Configure Supabase for FlashFusion Website
**Estimated Time**: 2-4 hours
**Prerequisites**: Supabase account, project admin access

---

## Overview

FlashFusion currently runs in **demo mode** using localStorage fallback. This guide enables:
- Real user authentication (email, OAuth)
- Persistent data storage (PostgreSQL)
- Serverless edge functions
- File storage
- Real-time subscriptions

---

## Part 1: Create Supabase Project

### Step 1: Sign Up / Log In
1. Visit [supabase.com](https://supabase.com)
2. Create account or sign in
3. Click "New Project"

### Step 2: Configure Project
**Organization**: Select or create
**Project Name**: `flashfusion-website` (or your choice)
**Database Password**: Generate strong password (save securely!)
**Region**: Choose closest to your users
**Pricing Plan**: Free tier works for development

### Step 3: Wait for Provisioning
- Usually takes 1-2 minutes
- You'll see a loading screen
- Don't close the browser

---

## Part 2: Get API Credentials

### Step 1: Navigate to Project Settings
1. Click your project name
2. Go to **Settings** (gear icon)
3. Select **API**

### Step 2: Copy Credentials
You need two values:

**Project URL:**
```
https://your-project-id.supabase.co
```

**Anon Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

⚠️ **Security Notes:**
- The `anon` key is safe to expose in client-side code
- It has Row Level Security (RLS) restrictions
- Never expose the `service_role` key in client code

---

## Part 3: Configure Local Environment

### Step 1: Create .env.local File
```bash
cd /path/to/flashfusion-website
cp src/_env_example.sh .env.local
```

### Step 2: Edit .env.local
```bash
# FlashFusion Environment Configuration

# Supabase Configuration (REQUIRED for real auth/data)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Configuration
VITE_APP_ENV=development
VITE_APP_NAME=FlashFusion
VITE_APP_VERSION=0.1.0
```

### Step 3: Verify Configuration
```bash
# Start dev server
pnpm run dev

# Check browser console
# Should see: "Supabase client initialized" (no demo mode warning)
```

---

## Part 4: Set Up Database Schema

### Authentication Tables
Supabase provides auth tables out of the box:
- `auth.users` - User accounts
- `auth.sessions` - Active sessions
- `auth.refresh_tokens` - Token storage

**No manual setup needed for basic auth!**

### Application Tables

#### Create Gamification Tables
Navigate to **SQL Editor** in Supabase dashboard:

```sql
-- User XP and Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  xp_reward INTEGER DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements (unlocked)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Create Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Seed Initial Achievements
```sql
INSERT INTO achievements (key, name, description, icon, xp_reward, category) VALUES
  ('first_login', 'Welcome Aboard', 'Logged in for the first time', '🎉', 100, 'onboarding'),
  ('first_project', 'Creator', 'Created your first project', '🚀', 250, 'projects'),
  ('five_projects', 'Productive', 'Created 5 projects', '💪', 500, 'projects'),
  ('week_streak', 'Consistent', 'Logged in 7 days in a row', '🔥', 750, 'engagement'),
  ('level_10', 'Experienced', 'Reached level 10', '⭐', 1000, 'progression'),
  ('ai_master', 'AI Wizard', 'Used AI tools 50 times', '🧙', 1500, 'ai');
```

---

## Part 5: Configure Authentication

### Step 1: Enable Auth Providers
Navigate to **Authentication > Providers** in Supabase dashboard:

#### Email Authentication
- Already enabled by default
- Configure email templates (optional)
- Set redirect URLs

#### OAuth Providers (Optional)
**GitHub:**
1. Create GitHub OAuth App
2. Copy Client ID and Secret
3. Add to Supabase Auth > Providers > GitHub
4. Set callback URL: `https://your-project.supabase.co/auth/v1/callback`

**Google:**
1. Create Google OAuth Client
2. Copy Client ID and Secret
3. Add to Supabase Auth > Providers > Google
4. Set callback URL: `https://your-project.supabase.co/auth/v1/callback`

### Step 2: Configure Redirect URLs
**Site URL**: `http://localhost:5173` (development)
**Redirect URLs**:
- `http://localhost:5173`
- `http://localhost:5173/auth/callback`
- Your production domain (when deployed)

### Step 3: Email Templates (Optional)
Customize in **Authentication > Email Templates**:
- Confirmation email
- Password reset
- Magic link

---

## Part 6: Storage Configuration

### Step 1: Create Storage Buckets
Navigate to **Storage** in Supabase dashboard:

**Bucket: user-avatars**
- Public: Yes
- File size limit: 2MB
- Allowed MIME types: image/jpeg, image/png, image/webp

**Bucket: project-files**
- Public: No (requires auth)
- File size limit: 10MB
- Allowed MIME types: *

### Step 2: Storage Policies
```sql
-- user-avatars bucket policies
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- project-files bucket policies
CREATE POLICY "Users can view their project files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload project files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Part 7: Edge Functions (Optional)

### Deploy Existing Functions
FlashFusion has edge functions in `src/supabase/functions/`:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-id

# Deploy functions
supabase functions deploy
```

### Available Functions
- `server/` - Main Hono server with health endpoint

---

## Part 8: Testing

### Test Authentication
```bash
# Start dev server
pnpm run dev

# Navigate to http://localhost:5173
# Click "Sign Up"
# Enter email and password
# Check email for confirmation link
# Click link and verify redirect
```

**Expected behavior:**
- No "demo mode" console warning
- Successful sign up creates user in Supabase
- Session persists on page reload
- Sign out clears session

### Test Database
```typescript
// In browser console after signing in
const { data, error } = await supabase
  .from('projects')
  .insert({ name: 'Test Project', description: 'Testing Supabase' })
  .select()

console.log(data, error)
```

**Expected:**
- New project appears in Supabase dashboard (Database > projects table)
- Data persists on page reload
- Only visible to the authenticated user

### Test Gamification
```typescript
// Check user progress
const { data: progress } = await supabase
  .from('user_progress')
  .select('*')
  .single()

console.log('XP:', progress.xp, 'Level:', progress.level)
```

---

## Part 9: Production Configuration

### Environment Variables
Add to your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=production
```

### Update Redirect URLs
In Supabase dashboard > Authentication > URL Configuration:
- Add production domain
- Add production callback URLs

### Database Backups
Navigate to **Settings > Database**:
- Enable automatic backups (Pro plan)
- Or manually export via SQL Editor

---

## Part 10: Monitoring & Maintenance

### Dashboard Monitoring
**Database:**
- Check table sizes
- Monitor query performance
- Review slow queries

**Auth:**
- Track sign-ups
- Monitor active users
- Review failed login attempts

**Storage:**
- Monitor storage usage
- Review file uploads
- Check bandwidth

### Logs
Navigate to **Logs** in Supabase dashboard:
- API requests
- Database queries
- Auth events
- Function invocations

---

## Troubleshooting

### "Supabase client in demo mode"
**Cause:** Missing or invalid credentials
**Fix:** Verify `.env.local` has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### "Failed to fetch" on auth requests
**Cause:** CORS or redirect URL mismatch
**Fix:** Add `http://localhost:5173` to allowed redirect URLs

### "Row Level Security violation"
**Cause:** RLS policies not set up correctly
**Fix:** Review and run RLS policy SQL from Part 4

### "Storage upload failed"
**Cause:** Missing storage policies
**Fix:** Run storage policy SQL from Part 6

### "Email not sending"
**Cause:** Supabase email rate limits on free tier
**Fix:** Use custom SMTP provider (Settings > Auth > SMTP Settings)

---

## Security Best Practices

### ✅ Do's
- Enable RLS on all tables
- Use `auth.uid()` in RLS policies
- Keep `service_role` key secret
- Use HTTPS in production
- Validate user input
- Limit file upload sizes
- Set appropriate CORS origins

### ❌ Don'ts
- Don't expose `service_role` key in client code
- Don't disable RLS without good reason
- Don't trust client-side data
- Don't store sensitive data unencrypted
- Don't use wildcard CORS in production

---

## Resources

**Official Docs:**
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Edge Functions](https://supabase.com/docs/guides/functions)

**FlashFusion Specific:**
- `src/lib/supabase.ts` - Client implementation
- `src/services/GamificationService.ts` - Gamification logic
- `src/components/auth/AuthProvider.tsx` - Auth context

---

**Setup Complete!** 🎉

Your FlashFusion app now has:
- ✅ Real user authentication
- ✅ Persistent database storage
- ✅ Gamification system
- ✅ File storage capabilities
- ✅ Row-level security

**Next Steps:**
- Test all auth flows
- Create a test project
- Verify gamification XP tracking
- Deploy to production
