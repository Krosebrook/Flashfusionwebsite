-- FlashFusion Initial Data Seeding
-- This adds achievements, templates, and other system data

-- Insert achievement definitions
INSERT INTO public.achievements (id, name, description, icon, category, requirements, points, rarity, is_active) VALUES
  -- First Steps
  (uuid_generate_v4(), 'Welcome Aboard', 'Complete your first code generation', '🎉', 'first_steps', '{"generations": 1}', 10, 'common', true),
  (uuid_generate_v4(), 'Project Pioneer', 'Create your first project', '🚀', 'first_steps', '{"projects_created": 1}', 15, 'common', true),
  (uuid_generate_v4(), 'Deploy Master', 'Successfully deploy your first application', '🌐', 'first_steps', '{"deployments": 1}', 25, 'common', true),
  
  -- Generation Achievements
  (uuid_generate_v4(), 'Code Warrior', 'Generate 10 code snippets', '⚔️', 'generation', '{"generations": 10}', 50, 'common', true),
  (uuid_generate_v4(), 'Full Stack Hero', 'Generate a complete full-stack application', '🏗️', 'generation', '{"full_stack_apps": 1}', 100, 'rare', true),
  (uuid_generate_v4(), 'AI Whisperer', 'Generate code using 5 different AI models', '🤖', 'generation', '{"unique_models": 5}', 75, 'rare', true),
  (uuid_generate_v4(), 'Generation Machine', 'Generate 100 code snippets', '🏭', 'generation', '{"generations": 100}', 200, 'epic', true),
  (uuid_generate_v4(), 'Framework Master', 'Generate code in 10 different frameworks', '🛠️', 'generation', '{"unique_frameworks": 10}', 150, 'epic', true),
  
  -- Collaboration Achievements
  (uuid_generate_v4(), 'Team Player', 'Collaborate on a project with others', '🤝', 'collaboration', '{"collaborations": 1}', 30, 'common', true),
  (uuid_generate_v4(), 'Mentor', 'Help 5 other users with their projects', '👨‍🏫', 'collaboration', '{"helped_users": 5}', 100, 'rare', true),
  (uuid_generate_v4(), 'Community Builder', 'Create a public template used by 10+ users', '🏘️', 'collaboration', '{"template_usage": 10}', 200, 'epic', true),
  
  -- Productivity Achievements
  (uuid_generate_v4(), 'Speed Demon', 'Complete 10 generations in a single day', '⚡', 'productivity', '{"daily_generations": 10}', 75, 'rare', true),
  (uuid_generate_v4(), 'Consistency King', 'Generate code for 7 consecutive days', '📅', 'productivity', '{"consecutive_days": 7}', 100, 'rare', true),
  (uuid_generate_v4(), 'Marathon Runner', 'Generate code for 30 consecutive days', '🏃', 'productivity', '{"consecutive_days": 30}', 300, 'legendary', true),
  
  -- Quality Achievements
  (uuid_generate_v4(), 'Perfectionist', 'Receive 5-star ratings on 10 generations', '⭐', 'quality', '{"five_star_ratings": 10}', 150, 'epic', true),
  (uuid_generate_v4(), 'Bug Hunter', 'Report and help fix 5 bugs', '🐛', 'quality', '{"bugs_reported": 5}', 100, 'rare', true),
  
  -- Deployment Achievements
  (uuid_generate_v4(), 'Multi-Platform Master', 'Deploy to 5 different platforms', '🌍', 'deployment', '{"unique_platforms": 5}', 200, 'epic', true),
  (uuid_generate_v4(), 'Production Ready', 'Have 10 live deployments', '🏭', 'deployment', '{"live_deployments": 10}', 250, 'epic', true),
  
  -- Special Achievements
  (uuid_generate_v4(), 'Early Adopter', 'Join FlashFusion in the first month', '🥇', 'special', '{"early_adopter": true}', 500, 'legendary', true),
  (uuid_generate_v4(), 'Feedback Champion', 'Provide valuable feedback that gets implemented', '💡', 'special', '{"feedback_implemented": 1}', 300, 'legendary', true),
  (uuid_generate_v4(), 'Power User', 'Reach 10,000 total XP', '💪', 'special', '{"total_xp": 10000}', 1000, 'legendary', true);

-- Insert template categories and templates
INSERT INTO public.templates (id, name, description, category, framework, tags, files, config, author_id, is_official, is_public, created_at) VALUES
  -- React Templates
  (uuid_generate_v4(), 'React TypeScript Starter', 'Modern React app with TypeScript, Tailwind CSS, and best practices', 'frontend', 'react', ARRAY['react', 'typescript', 'tailwind', 'starter'], 
   '{"package.json": "{\"name\": \"react-ts-starter\", \"version\": \"1.0.0\", \"dependencies\": {\"react\": \"^18.2.0\", \"react-dom\": \"^18.2.0\", \"typescript\": \"^5.0.0\"}, \"scripts\": {\"dev\": \"vite\", \"build\": \"vite build\"}}", "src/App.tsx": "import React from \"react\";\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n      <h1 className=\"text-4xl font-bold text-gray-900\">Hello FlashFusion!</h1>\n    </div>\n  );\n}\n\nexport default App;", "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>React TS Starter</title>\n</head>\n<body>\n  <div id=\"root\"></div>\n  <script type=\"module\" src=\"/src/main.tsx\"></script>\n</body>\n</html>"}', 
   '{"build_command": "npm run build", "output_directory": "dist", "install_command": "npm install"}', null, true, true, NOW()),
   
  (uuid_generate_v4(), 'React Dashboard', 'Professional dashboard template with charts and tables', 'dashboard', 'react', ARRAY['react', 'dashboard', 'charts', 'admin'], 
   '{"package.json": "{\"name\": \"react-dashboard\", \"version\": \"1.0.0\", \"dependencies\": {\"react\": \"^18.2.0\", \"react-dom\": \"^18.2.0\", \"recharts\": \"^2.8.0\"}, \"scripts\": {\"dev\": \"vite\", \"build\": \"vite build\"}}", "src/App.tsx": "import React from \"react\";\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from \"recharts\";\n\nconst data = [\n  { name: \"Jan\", value: 400 },\n  { name: \"Feb\", value: 300 },\n  { name: \"Mar\", value: 600 },\n  { name: \"Apr\", value: 800 },\n];\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-50 p-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">Dashboard</h1>\n      <div className=\"bg-white p-6 rounded-lg shadow\">\n        <h2 className=\"text-xl font-semibold mb-4\">Analytics</h2>\n        <ResponsiveContainer width=\"100%\" height={300}>\n          <LineChart data={data}>\n            <CartesianGrid strokeDasharray=\"3 3\" />\n            <XAxis dataKey=\"name\" />\n            <YAxis />\n            <Tooltip />\n            <Line type=\"monotone\" dataKey=\"value\" stroke=\"#8884d8\" />\n          </LineChart>\n        </ResponsiveContainer>\n      </div>\n    </div>\n  );\n}\n\nexport default App;"}', 
   '{"build_command": "npm run build", "output_directory": "dist", "install_command": "npm install"}', null, true, true, NOW()),

  -- Next.js Templates
  (uuid_generate_v4(), 'Next.js Blog', 'SEO-optimized blog template with MDX support', 'blog', 'nextjs', ARRAY['nextjs', 'blog', 'mdx', 'seo'], 
   '{"package.json": "{\"name\": \"nextjs-blog\", \"version\": \"1.0.0\", \"dependencies\": {\"next\": \"^14.0.0\", \"react\": \"^18.2.0\", \"react-dom\": \"^18.2.0\"}, \"scripts\": {\"dev\": \"next dev\", \"build\": \"next build\", \"start\": \"next start\"}}", "pages/index.js": "import Head from \"next/head\";\n\nexport default function Home() {\n  return (\n    <div>\n      <Head>\n        <title>My Blog</title>\n        <meta name=\"description\" content=\"A modern blog built with Next.js\" />\n      </Head>\n      <main className=\"container mx-auto px-4 py-8\">\n        <h1 className=\"text-4xl font-bold mb-8\">Welcome to My Blog</h1>\n        <div className=\"grid gap-6 md:grid-cols-2 lg:grid-cols-3\">\n          <article className=\"bg-white p-6 rounded-lg shadow\">\n            <h2 className=\"text-xl font-semibold mb-2\">First Post</h2>\n            <p className=\"text-gray-600\">This is the first post on my blog...</p>\n            <a href=\"#\" className=\"text-blue-600 hover:underline\">Read more</a>\n          </article>\n        </div>\n      </main>\n    </div>\n  );\n}", "next.config.js": "/** @type {import(\"next\").NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n}\n\nmodule.exports = nextConfig"}', 
   '{"build_command": "npm run build", "output_directory": ".next", "install_command": "npm install"}', null, true, true, NOW()),

  -- E-commerce Templates
  (uuid_generate_v4(), 'E-commerce Store', 'Complete e-commerce solution with cart and checkout', 'ecommerce', 'react', ARRAY['ecommerce', 'store', 'cart', 'stripe'], 
   '{"package.json": "{\"name\": \"ecommerce-store\", \"version\": \"1.0.0\", \"dependencies\": {\"react\": \"^18.2.0\", \"react-dom\": \"^18.2.0\", \"@stripe/stripe-js\": \"^2.0.0\"}, \"scripts\": {\"dev\": \"vite\", \"build\": \"vite build\"}}", "src/App.tsx": "import React, { useState } from \"react\";\n\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n  image: string;\n}\n\nconst products: Product[] = [\n  { id: 1, name: \"Awesome Product\", price: 29.99, image: \"https://via.placeholder.com/300\" },\n  { id: 2, name: \"Cool Gadget\", price: 49.99, image: \"https://via.placeholder.com/300\" },\n];\n\nfunction App() {\n  const [cart, setCart] = useState<Product[]>([]);\n\n  const addToCart = (product: Product) => {\n    setCart([...cart, product]);\n  };\n\n  return (\n    <div className=\"min-h-screen bg-gray-100\">\n      <header className=\"bg-white shadow\">\n        <div className=\"max-w-7xl mx-auto px-4 py-6\">\n          <h1 className=\"text-3xl font-bold\">My Store</h1>\n          <p>Cart items: {cart.length}</p>\n        </div>\n      </header>\n      <main className=\"max-w-7xl mx-auto px-4 py-8\">\n        <div className=\"grid gap-6 md:grid-cols-2 lg:grid-cols-3\">\n          {products.map(product => (\n            <div key={product.id} className=\"bg-white rounded-lg shadow p-6\">\n              <img src={product.image} alt={product.name} className=\"w-full h-48 object-cover rounded\" />\n              <h3 className=\"text-xl font-semibold mt-4\">{product.name}</h3>\n              <p className=\"text-2xl font-bold text-green-600\">${product.price}</p>\n              <button \n                onClick={() => addToCart(product)}\n                className=\"mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700\"\n              >\n                Add to Cart\n              </button>\n            </div>\n          ))}\n        </div>\n      </main>\n    </div>\n  );\n}\n\nexport default App;"}', 
   '{"build_command": "npm run build", "output_directory": "dist", "install_command": "npm install"}', null, true, true, NOW()),

  -- Vue.js Templates
  (uuid_generate_v4(), 'Vue 3 Composition API', 'Modern Vue 3 app using Composition API and TypeScript', 'frontend', 'vue', ARRAY['vue', 'composition-api', 'typescript'], 
   '{"package.json": "{\"name\": \"vue3-app\", \"version\": \"1.0.0\", \"dependencies\": {\"vue\": \"^3.3.0\"}, \"scripts\": {\"dev\": \"vite\", \"build\": \"vite build\"}}", "src/App.vue": "<template>\n  <div class=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n    <div class=\"text-center\">\n      <h1 class=\"text-4xl font-bold text-gray-900 mb-4\">{{ message }}</h1>\n      <button \n        @click=\"increment\" \n        class=\"bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700\"\n      >\n        Count: {{ count }}\n      </button>\n    </div>\n  </div>\n</template>\n\n<script setup lang=\"ts\">\nimport { ref } from \"vue\";\n\nconst message = ref(\"Hello Vue 3!\");\nconst count = ref(0);\n\nconst increment = () => {\n  count.value++;\n};\n</script>", "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Vue 3 App</title>\n</head>\n<body>\n  <div id=\"app\"></div>\n  <script type=\"module\" src=\"/src/main.ts\"></script>\n</body>\n</html>"}', 
   '{"build_command": "npm run build", "output_directory": "dist", "install_command": "npm install"}', null, true, true, NOW()),

  -- API Templates
  (uuid_generate_v4(), 'Express.js API', 'RESTful API with Express.js, TypeScript, and JWT auth', 'backend', 'express', ARRAY['express', 'api', 'typescript', 'jwt'], 
   '{"package.json": "{\"name\": \"express-api\", \"version\": \"1.0.0\", \"dependencies\": {\"express\": \"^4.18.0\", \"typescript\": \"^5.0.0\", \"jsonwebtoken\": \"^9.0.0\"}, \"scripts\": {\"dev\": \"ts-node src/index.ts\", \"build\": \"tsc\", \"start\": \"node dist/index.js\"}}", "src/index.ts": "import express from \"express\";\nimport jwt from \"jsonwebtoken\";\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\nconst JWT_SECRET = process.env.JWT_SECRET || \"your-secret-key\";\n\napp.use(express.json());\n\n// Routes\napp.get(\"/api/health\", (req, res) => {\n  res.json({ status: \"OK\", timestamp: new Date().toISOString() });\n});\n\napp.post(\"/api/auth/login\", (req, res) => {\n  const { username, password } = req.body;\n  \n  // In a real app, validate credentials\n  if (username === \"admin\" && password === \"password\") {\n    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: \"1h\" });\n    res.json({ token });\n  } else {\n    res.status(401).json({ error: \"Invalid credentials\" });\n  }\n});\n\napp.get(\"/api/protected\", (req, res) => {\n  const authHeader = req.headers.authorization;\n  const token = authHeader && authHeader.split(\" \")[1];\n  \n  if (!token) {\n    return res.status(401).json({ error: \"Access token required\" });\n  }\n  \n  try {\n    jwt.verify(token, JWT_SECRET);\n    res.json({ message: \"Protected data\", data: [1, 2, 3] });\n  } catch {\n    res.status(403).json({ error: \"Invalid token\" });\n  }\n});\n\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});", "tsconfig.json": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"module\": \"commonjs\",\n    \"outDir\": \"./dist\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true\n  },\n  \"include\": [\"src/**/*\"],\n  \"exclude\": [\"node_modules\"]\n}"}', 
   '{"build_command": "npm run build", "output_directory": "dist", "install_command": "npm install"}', null, true, true, NOW());

-- Insert system announcements
INSERT INTO public.system_announcements (id, title, message, type, target_audience, is_active, created_at) VALUES
  (uuid_generate_v4(), 'Welcome to FlashFusion!', 'Thank you for joining FlashFusion, the ultimate AI-powered development platform. Get started by creating your first project!', 'info', 'new_users', true, NOW()),
  (uuid_generate_v4(), 'New AI Models Available', 'We''ve added support for Claude 3.5 Sonnet and GPT-4 Turbo. Try them out in your next generation!', 'success', 'all', true, NOW()),
  (uuid_generate_v4(), 'Deployment Platforms Expanded', 'You can now deploy to Vercel, Netlify, Heroku, AWS, GCP, Azure, Railway, and Fly.io!', 'info', 'all', true, NOW());

-- Insert default pricing tiers
INSERT INTO public.pricing_tiers (id, name, description, price_monthly, price_yearly, features, limits, is_active, created_at) VALUES
  (uuid_generate_v4(), 'Free', 'Perfect for getting started', 0, 0, 
   '["10 AI generations per month", "2 active projects", "Community templates", "Basic support"]',
   '{"generations_per_month": 10, "projects": 2, "storage_gb": 1, "ai_models": ["gpt-3.5-turbo"], "deployments_per_month": 3}', 
   true, NOW()),
   
  (uuid_generate_v4(), 'Pro', 'For serious developers', 19, 190, 
   '["1,000 AI generations per month", "Unlimited projects", "Premium templates", "Priority support", "Advanced AI models", "Team collaboration", "Custom domains"]',
   '{"generations_per_month": 1000, "projects": -1, "storage_gb": 50, "ai_models": ["gpt-4-turbo", "claude-3-5-sonnet", "gemini-1.5-pro"], "deployments_per_month": 100, "team_members": 5}', 
   true, NOW()),
   
  (uuid_generate_v4(), 'Enterprise', 'For teams and organizations', 99, 990, 
   '["Unlimited AI generations", "Unlimited projects", "Custom templates", "24/7 support", "All AI models", "Advanced team features", "SSO integration", "API access", "White-label options"]',
   '{"generations_per_month": -1, "projects": -1, "storage_gb": 500, "ai_models": ["all"], "deployments_per_month": -1, "team_members": -1, "api_access": true, "sso": true}', 
   true, NOW());

-- Insert default integrations
INSERT INTO public.integration_configs (id, name, provider, category, description, config_schema, is_active, created_at) VALUES
  (uuid_generate_v4(), 'OpenAI GPT Models', 'openai', 'ai', 'Access to GPT-4, GPT-4 Turbo, and GPT-3.5 models', 
   '{"api_key": {"type": "string", "required": true, "description": "OpenAI API key"}}', true, NOW()),
   
  (uuid_generate_v4(), 'Anthropic Claude', 'anthropic', 'ai', 'Access to Claude 3.5 Sonnet, Opus, and Haiku models', 
   '{"api_key": {"type": "string", "required": true, "description": "Anthropic API key"}}', true, NOW()),
   
  (uuid_generate_v4(), 'GitHub Repository', 'github', 'development', 'Repository analysis and code deployment', 
   '{"access_token": {"type": "string", "required": true, "description": "GitHub personal access token"}}', true, NOW()),
   
  (uuid_generate_v4(), 'Vercel Deployment', 'vercel', 'deployment', 'Automated deployment to Vercel platform', 
   '{"access_token": {"type": "string", "required": true, "description": "Vercel API token"}}', true, NOW()),
   
  (uuid_generate_v4(), 'Stripe Payments', 'stripe', 'payments', 'Payment processing and subscription management', 
   '{"secret_key": {"type": "string", "required": true, "description": "Stripe secret key"}, "publishable_key": {"type": "string", "required": true, "description": "Stripe publishable key"}}', true, NOW()),
   
  (uuid_generate_v4(), 'Leap AI Images', 'leap', 'ai', 'AI-powered image generation', 
   '{"api_key": {"type": "string", "required": true, "description": "Leap AI API key"}}', true, NOW()),
   
  (uuid_generate_v4(), 'ElevenLabs Voice', 'elevenlabs', 'ai', 'AI voice synthesis and generation', 
   '{"api_key": {"type": "string", "required": true, "description": "ElevenLabs API key"}}', true, NOW());

-- Create tables that might be missing
CREATE TABLE IF NOT EXISTS public.system_announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  target_audience TEXT DEFAULT 'all',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.integration_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  config_schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collaboration_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_project_id ON public.collaboration_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_created_at ON public.collaboration_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON public.project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_created_at ON public.project_activities(created_at);

-- Add RLS policies for new tables
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaboration messages for their projects" ON public.collaboration_messages FOR SELECT USING (
  project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid() 
    OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Users can view activities for their projects" ON public.project_activities FOR SELECT USING (
  project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid() 
    OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
  )
);

-- Function to award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_id_param UUID)
RETURNS void AS $$
DECLARE
  achievement RECORD;
  user_stats RECORD;
  should_award BOOLEAN;
BEGIN
  -- Get user statistics
  SELECT 
    u.total_generations,
    u.total_deployments,
    u.xp,
    COUNT(DISTINCT p.id) as projects_created,
    COUNT(DISTINCT g.ai_model) as unique_models_used,
    COUNT(DISTINCT p.framework) as unique_frameworks_used
  INTO user_stats
  FROM public.users u
  LEFT JOIN public.projects p ON p.user_id = u.id
  LEFT JOIN public.generations g ON g.user_id = u.id
  WHERE u.id = user_id_param
  GROUP BY u.id, u.total_generations, u.total_deployments, u.xp;

  -- Check each achievement
  FOR achievement IN SELECT * FROM public.achievements WHERE is_active = TRUE LOOP
    -- Check if user already has this achievement
    IF NOT EXISTS (
      SELECT 1 FROM public.user_achievements 
      WHERE user_id = user_id_param AND achievement_id = achievement.id AND completed_at IS NOT NULL
    ) THEN
      should_award := FALSE;
      
      -- Check achievement requirements
      IF achievement.requirements->>'generations' IS NOT NULL THEN
        should_award := user_stats.total_generations >= (achievement.requirements->>'generations')::INTEGER;
      END IF;
      
      IF achievement.requirements->>'projects_created' IS NOT NULL THEN
        should_award := user_stats.projects_created >= (achievement.requirements->>'projects_created')::INTEGER;
      END IF;
      
      IF achievement.requirements->>'deployments' IS NOT NULL THEN
        should_award := user_stats.total_deployments >= (achievement.requirements->>'deployments')::INTEGER;
      END IF;
      
      IF achievement.requirements->>'unique_models' IS NOT NULL THEN
        should_award := user_stats.unique_models_used >= (achievement.requirements->>'unique_models')::INTEGER;
      END IF;
      
      IF achievement.requirements->>'total_xp' IS NOT NULL THEN
        should_award := user_stats.xp >= (achievement.requirements->>'total_xp')::INTEGER;
      END IF;
      
      -- Award achievement if requirements are met
      IF should_award THEN
        INSERT INTO public.user_achievements (user_id, achievement_id, completed_at)
        VALUES (user_id_param, achievement.id, NOW())
        ON CONFLICT (user_id, achievement_id) DO UPDATE SET completed_at = NOW();
        
        -- Award XP points
        UPDATE public.users 
        SET xp = xp + achievement.points 
        WHERE id = user_id_param;
        
        -- Create notification
        INSERT INTO public.notifications (user_id, title, message, type, category)
        VALUES (
          user_id_param,
          'Achievement Unlocked!',
          'You''ve earned the "' || achievement.name || '" achievement and gained ' || achievement.points || ' XP!',
          'success',
          'achievement'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100)) + 1
  -- This means: Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
  RETURN FLOOR(SQRT(xp_amount / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_user_level(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_level_trigger
  BEFORE UPDATE OF xp ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Function to track API usage
CREATE OR REPLACE FUNCTION track_api_usage(
  user_id_param UUID,
  endpoint_param TEXT,
  method_param TEXT,
  status_code_param INTEGER,
  response_time_param INTEGER DEFAULT NULL,
  ai_model_param TEXT DEFAULT NULL,
  tokens_param INTEGER DEFAULT NULL,
  cost_param DECIMAL DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.api_usage (
    user_id,
    endpoint,
    method,
    status_code,
    response_time_ms,
    ai_model,
    tokens_used,
    cost_usd,
    created_at
  ) VALUES (
    user_id_param,
    endpoint_param,
    method_param,
    status_code_param,
    response_time_param,
    ai_model_param,
    tokens_param,
    cost_param,
    NOW()
  );
END;
$$ LANGUAGE plpgsql;