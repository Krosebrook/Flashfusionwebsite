# FlashFusion Supabase Setup Guide

This guide will help you set up Supabase as the backend database for FlashFusion.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Name: `FlashFusion`
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: Your anonymous key for client-side access

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Schema

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy the entire contents of `/database/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create:
- All necessary tables (users, projects, user_stats, etc.)
- Row Level Security policies
- Database functions for XP management and task completion
- Triggers for automatic timestamps

## Step 5: Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your Site URL:
   - For development: `http://localhost:5173`
   - For production: Your deployed app URL

3. (Optional) Enable Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

## Step 6: Install Dependencies

Make sure you have the Supabase client installed:

```bash
npm install @supabase/supabase-js
```

## Step 7: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your app
3. Try signing up with a new account
4. Check your Supabase Dashboard → Authentication → Users to see if the user was created

## Features Included

With this Supabase setup, FlashFusion now includes:

### ✅ Real Authentication
- Email/password authentication
- Google OAuth (optional)
- Secure user sessions
- Profile management

### ✅ User Management
- User profiles with roles (free, pro, enterprise)
- Credit system
- User statistics (level, XP, projects, etc.)
- Badge system

### ✅ Project Management
- Create, update, delete projects
- Project status tracking
- Framework and configuration storage
- Real-time updates

### ✅ Gamification
- Daily task system
- XP and leveling
- Achievement badges
- Streak tracking
- Leaderboards

### ✅ Tool Usage Tracking
- Credit consumption
- Usage analytics
- Tool configuration storage

### ✅ Deployments & Integrations
- Deployment tracking
- Integration status
- Platform connections

### ✅ Real-time Features
- Live updates using Supabase subscriptions
- Real-time leaderboards
- Live project status

## Row Level Security

The database is configured with Row Level Security (RLS) to ensure users can only access their own data:

- Users can only view/edit their own profile
- Users can only see their own projects, stats, badges
- All operations are secured by user authentication

## Database Functions

Several PostgreSQL functions are included:

- `add_user_xp(user_id, xp_amount)` - Safely add XP and update level
- `complete_daily_task(user_id, task_id, xp_reward)` - Complete tasks and award XP
- `use_tool_credits(user_id, tool_id, credits_needed)` - Consume credits for tool usage

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure you're using the correct URL and keys

### Authentication Problems
- Check your Site URL configuration in Supabase
- Verify RLS policies are enabled
- Make sure the user table trigger is working

### Data Not Appearing
- Check browser console for errors
- Verify RLS policies allow the operation
- Ensure the user is properly authenticated

## Production Deployment

When deploying to production:

1. Update your environment variables on your hosting platform
2. Configure the Site URL in Supabase to match your production domain
3. Consider upgrading your Supabase plan based on usage
4. Set up proper monitoring and backups

## Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Review the SQL schema in `/database/schema.sql`

---

You now have a fully functional backend for FlashFusion! 🚀