export const FRONTEND_FRAMEWORKS = [
  { id: 'nextjs', name: 'Next.js', icon: '▲', description: 'React framework with SSR/SSG' },
  { id: 'react-vite', name: 'React + Vite', icon: '⚛️', description: 'Fast React development' },
  { id: 'vue-nuxt', name: 'Nuxt.js', icon: '💚', description: 'Vue.js framework' },
  { id: 'svelte-kit', name: 'SvelteKit', icon: '🧡', description: 'Modern web framework' },
  { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Enterprise framework' },
];

export const BACKEND_FRAMEWORKS = [
  { id: 'nodejs-express', name: 'Node.js + Express', icon: '🚂', description: 'JavaScript backend' },
  { id: 'nodejs-fastify', name: 'Node.js + Fastify', icon: '⚡', description: 'Fast Node.js framework' },
  { id: 'python-fastapi', name: 'Python + FastAPI', icon: '🐍', description: 'Modern Python API' },
  { id: 'python-django', name: 'Python + Django', icon: '🎸', description: 'Full-featured framework' },
  { id: 'go-gin', name: 'Go + Gin', icon: '🐹', description: 'Fast Go framework' },
  { id: 'rust-axum', name: 'Rust + Axum', icon: '🦀', description: 'High-performance Rust' },
];

export const DATABASES = [
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', description: 'Powerful relational DB' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL document DB' },
  { id: 'mysql', name: 'MySQL', icon: '🐬', description: 'Popular relational DB' },
  { id: 'redis', name: 'Redis', icon: '🔴', description: 'In-memory data store' },
  { id: 'supabase', name: 'Supabase', icon: '⚡', description: 'Firebase alternative' },
  { id: 'planetscale', name: 'PlanetScale', icon: '🪐', description: 'Serverless MySQL' },
];

export const AUTH_PROVIDERS = [
  { id: 'auth0', name: 'Auth0', icon: '🔐', description: 'Universal authentication' },
  { id: 'firebase-auth', name: 'Firebase Auth', icon: '🔥', description: 'Google authentication' },
  { id: 'supabase-auth', name: 'Supabase Auth', icon: '⚡', description: 'Open source auth' },
  { id: 'clerk', name: 'Clerk', icon: '👤', description: 'Developer-first auth' },
  { id: 'nextauth', name: 'NextAuth.js', icon: '🔑', description: 'Next.js authentication' },
  { id: 'custom', name: 'Custom JWT', icon: '🎯', description: 'Roll your own auth' },
];

export const DEPLOYMENT_PLATFORMS = [
  { id: 'vercel', name: 'Vercel', icon: '▲', description: 'Frontend + serverless' },
  { id: 'netlify', name: 'Netlify', icon: '🌐', description: 'JAMstack platform' },
  { id: 'aws', name: 'AWS', icon: '☁️', description: 'Amazon Web Services' },
  { id: 'gcp', name: 'Google Cloud', icon: '☁️', description: 'Google Cloud Platform' },
  { id: 'digital-ocean', name: 'DigitalOcean', icon: '🌊', description: 'Simple cloud hosting' },
  { id: 'heroku', name: 'Heroku', icon: '💜', description: 'Platform as a service' },
];

export const APP_TYPES = [
  { id: 'saas', name: 'SaaS Application', icon: '💼', description: 'Software as a Service platform' },
  { id: 'ecommerce', name: 'E-commerce Store', icon: '🛒', description: 'Online shopping platform' },
  { id: 'blog', name: 'Blog/CMS', icon: '📝', description: 'Content management system' },
  { id: 'social', name: 'Social Platform', icon: '👥', description: 'Social networking app' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪', description: 'Multi-vendor platform' },
  { id: 'dashboard', name: 'Admin Dashboard', icon: '📊', description: 'Analytics and management' },
  { id: 'api', name: 'API Service', icon: '🔌', description: 'Backend API only' },
  { id: 'custom', name: 'Custom App', icon: '🎯', description: 'Your unique idea' },
];

export const FEATURES = [
  'User Authentication & Authorization',
  'User Profiles & Management',
  'Real-time Updates (WebSocket)',
  'File Upload & Storage',
  'Email Notifications',
  'Push Notifications',
  'Payment Processing',
  'Subscription Management',
  'Admin Dashboard',
  'Analytics & Reporting',
  'Search Functionality',
  'Caching Layer',
  'Rate Limiting',
  'API Documentation',
  'Unit & Integration Tests',
  'Docker Containerization',
  'CI/CD Pipeline',
  'Monitoring & Logging',
  'SEO Optimization',
  'PWA Support',
];