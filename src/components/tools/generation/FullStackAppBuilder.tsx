import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import { 
  Layers, CloudUpload, Download, Monitor, Settings,
  Loader2, Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Import constants and types
import {
  FRONTEND_FRAMEWORKS,
  BACKEND_FRAMEWORKS,
  DATABASES,
  AUTH_PROVIDERS,
  DEPLOYMENT_PLATFORMS,
  APP_TYPES,
  FEATURES
} from '../../../constants/full-stack-builder';

import type {
  GeneratedApp,
  AppStack
} from '../../../types/full-stack-builder';

// Import utility functions
import {
  generateFrontendPackageJson,
  generateBackendPackageJson,
  generateFrontendHomePage,
  generateLayoutComponent,
  generateBackendApp,
  generateUserRoutes,
  generateAuthConfig,
  generateAuthMiddleware
} from '../../../utils/full-stack-code-generators';

// Import AI Service for real code generation
import AIService from '../../../services/AIService';
import { GamificationService } from '../../../services/GamificationService';

import {
  generateDatabaseSchema,
  generateInitialMigration,
  generateDockerCompose,
  generateEnvExample,
  generateProjectReadme,
  generateAPIEndpoints,
  generateDeploymentConfig
} from '../../../utils/full-stack-config-generators';

import {
  generateFrontendDockerfile,
  generateBackendDockerfile,
  generateGitHubActions
} from '../../../utils/docker-generators';

// Additional generator functions for enhanced file creation
const generateUIComponent = (componentName: string, framework: string): string => {
  return `import React from 'react';

interface ${componentName}Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function ${componentName}({ 
  children, 
  className = '', 
  onClick, 
  disabled = false,
  variant = 'primary',
  ...props 
}: ${componentName}Props) {
  const baseClasses = 'ff-btn-base transition-all duration-300';
  const variantClasses = {
    primary: 'ff-btn-primary',
    secondary: 'ff-btn-secondary', 
    accent: 'ff-btn-accent'
  };

  return (
    <${componentName.toLowerCase()}
      className={\`\${baseClasses} \${variantClasses[variant]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </${componentName.toLowerCase()}>
  );
}

export default ${componentName};`;
};

const generateAuthHook = (authType: string): string => {
  return `import { useState, useEffect, useContext, createContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const { user, token } = await response.json();
      localStorage.setItem('auth_token', token);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const { user, token } = await response.json();
      localStorage.setItem('auth_token', token);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const response = await fetch('/api/auth/refresh', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      
      if (response.ok) {
        const { user, token: newToken } = await response.json();
        localStorage.setItem('auth_token', newToken);
        setUser(user);
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshToken();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}`;
};

const generateAPIService = (backendType: string): string => {
  return `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class APIService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: \`Bearer \${token}\` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || \`HTTP \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async getProfile() {
    return this.request<any>('/api/auth/me');
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new APIService();
export default apiService;`;
};

const generateTailwindConfig = (): string => {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7B00',
        secondary: '#00B4D8', 
        accent: '#E91E63',
        background: '#0F172A',
        surface: '#1E293B',
        'surface-light': '#334155',
        'text-primary': '#FFFFFF',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'scale-pop': 'scalePop 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 123, 0, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 123, 0, 0)' },
        },
        scalePop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};`;
};

const generateViteConfig = (): string => {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});`;
};

const generateCORSMiddleware = (): string => {
  return `import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});`;
};

const generateUserModel = (database: string): string => {
  return `export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    // Database-specific implementation for ${database}
    throw new Error('Not implemented');
  }

  static async findById(id: string): Promise<User | null> {
    // Database-specific implementation for ${database}
    throw new Error('Not implemented');
  }

  static async findByEmail(email: string): Promise<User | null> {
    // Database-specific implementation for ${database}
    throw new Error('Not implemented');
  }

  static async update(id: string, data: UpdateUserData): Promise<User> {
    // Database-specific implementation for ${database}
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<void> {
    // Database-specific implementation for ${database}
    throw new Error('Not implemented');
  }
}`;
};

const generateValidationUtils = (): string => {
  return `import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  avatar: Joi.string().uri().optional(),
});

export function validateRequest<T>(schema: Joi.ObjectSchema<T>, data: any): T {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(\`Validation error: \${error.details[0].message}\`);
  }
  return value;
}`;
};

const generateDatabaseConfig = (database: string): string => {
  return `import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool;`;
};

const generateBackendTSConfig = (): string => {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`;
};

const generateUserSeeds = (): string => {
  return `-- User seeds for development
INSERT INTO users (id, email, name, password, email_verified, created_at, updated_at) VALUES
  (gen_random_uuid(), 'admin@example.com', 'Admin User', '$2b$10$hash', true, NOW(), NOW()),
  (gen_random_uuid(), 'user@example.com', 'Test User', '$2b$10$hash', true, NOW(), NOW());`;
};

const generateProductionDockerCompose = (stack: any): string => {
  return `version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - NEXT_PUBLIC_API_URL=\${API_URL}
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - database

  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=\${DB_NAME}
      - POSTGRES_USER=\${DB_USER}
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`;
};

const generateGitIgnore = (): string => {
  return `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
/build
/dist
/.next

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Database
*.sqlite
*.db

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Temporary folders
tmp/
temp/

# Generated files
coverage/
.nyc_output

# Cache
.cache/
.parcel-cache/`;
};

const generateRootPackageJson = (appName: string, appDescription: string): string => {
  return JSON.stringify({
    name: appName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: appDescription,
    private: true,
    workspaces: ['frontend', 'backend'],
    scripts: {
      dev: 'concurrently "npm run dev:backend" "npm run dev:frontend"',
      'dev:frontend': 'cd frontend && npm run dev',
      'dev:backend': 'cd backend && npm run dev',
      build: 'npm run build:backend && npm run build:frontend',
      'build:frontend': 'cd frontend && npm run build',
      'build:backend': 'cd backend && npm run build',
      start: 'npm run start:backend',
      'start:backend': 'cd backend && npm start',
      test: 'npm run test:frontend && npm run test:backend',
      'test:frontend': 'cd frontend && npm test',
      'test:backend': 'cd backend && npm test',
      setup: 'npm install && cd frontend && npm install && cd ../backend && npm install'
    },
    devDependencies: {
      concurrently: '^8.2.0'
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    }
  }, null, 2);
};

// Import sub-components
import { AppConfigurationSection } from './components/AppConfigurationSection';
import { TechStackSection } from './components/TechStackSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AppPreviewSection } from './components/AppPreviewSection';
import { DeploymentSection } from './components/DeploymentSection';
import { ExportSection } from './components/ExportSection';
import { RealTimeCodePreview } from './components/RealTimeCodePreview';

interface FullStackAppBuilderProps {
  onBack?: () => void;
}

export function FullStackAppBuilder({ onBack }: FullStackAppBuilderProps) {
  const [activeTab, setActiveTab] = useState('configure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [userId] = useState(() => {
    const existingUserId = localStorage.getItem('ff_user_id') || localStorage.getItem('user_id');
    if (existingUserId) {
      return existingUserId;
    }
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ff_user_id', newUserId);
    localStorage.setItem('user_id', newUserId); // Backwards compatibility
    return newUserId;
  });
  
  // Configuration state
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appType, setAppType] = useState('saas');
  const [frontend, setFrontend] = useState('nextjs');
  const [backend, setBackend] = useState('nodejs-express');
  const [database, setDatabase] = useState('postgresql');
  const [auth, setAuth] = useState('nextauth');
  const [deployment, setDeployment] = useState('vercel');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'User Authentication & Authorization',
    'Admin Dashboard',
    'API Documentation'
  ]);
  
  // Generated state
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFeatureToggle = useCallback((feature: string) => {
    setSelectedFeatures(prev => {
      const wasSelected = prev.includes(feature);
      const newFeatures = wasSelected 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      
      // Award XP for feature selection (non-blocking)
      if (!wasSelected) {
        GamificationService.addXP(
          userId,
          5,
          'tool_usage',
          `Selected feature: ${feature}`,
          { feature_name: feature }
        ).catch(() => {});
      }
      
      return newFeatures;
    });
  }, [userId]);

  const generateFullStackApp = useCallback(async (): Promise<GeneratedApp> => {
    const stack: AppStack = { frontend, backend, database, auth, deployment };
    
    // Check if AI service is available
    const currentModel = AIService.getCurrentModel();
    if (!currentModel) {
      throw new Error('No AI model selected. Please configure an AI model first.');
    }

    try {
      // Award XP for starting generation (non-blocking)
      GamificationService.recordToolUsage(userId, 'Full-Stack App Builder', false).catch(() => {
        // Silently handle gamification errors
      });
      
      // Generate files using AI for critical components
      const [
        frontendHomePage,
        layoutComponent,
        backendApp,
        userRoutes,
        authConfigContent,
        authMiddlewareContent
      ] = await Promise.all([
        // Generate frontend home page with AI
        AIService.generateCode({
          type: 'page',
          framework: frontend,
          requirements: `Create a professional home page for ${appName}. 
            Description: ${appDescription}
            Features to highlight: ${selectedFeatures.join(', ')}
            
            IMPORTANT: Use FlashFusion design system exactly:
            - Brand colors: Primary Orange (#FF7B00), Secondary Cyan (#00B4D8), Accent Magenta (#E91E63)
            - Fonts: Sora for headings, Inter for body text
            - Animations: ff-fade-in-up, ff-hover-glow, ff-card-interactive
            - Include hero section, features overview, and call-to-action
            - Make it fully responsive and accessible
            - Use proper FlashFusion CSS classes and animations
            
            Structure:
            - Hero section with gradient background
            - Features grid with cards
            - Statistics section
            - Call-to-action section
            
            Include proper TypeScript interfaces and export default.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true,
            optimizeForPerformance: true
          }
        }),

        // Generate layout component with AI
        AIService.generateCode({
          type: 'component',
          framework: frontend,
          requirements: `Create a responsive layout component with:
            
            CRITICAL: Follow FlashFusion design system:
            - Use ff-btn-primary, ff-btn-secondary classes for buttons
            - Use ff-nav-item for navigation items
            - Use ff-text-gradient for headings
            - Use ff-card-interactive for cards
            - Include proper focus states with ff-focus-ring
            
            Structure:
            - Navigation header with brand logo and menu
            - Mobile hamburger menu with smooth transitions
            - Main content area with proper spacing
            - Footer with links and social media icons
            - Sticky navigation on scroll
            - Dark theme with FlashFusion colors
            
            Features:
            - Mobile-responsive design with breakpoints
            - Accessibility attributes (ARIA labels, semantic HTML)
            - Keyboard navigation support
            - Smooth animations and transitions
            
            Export as default TypeScript React component.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true
          }
        }),

        // Generate backend app with AI
        AIService.generateCode({
          type: 'api',
          framework: backend,
          requirements: `Create a production-ready ${backend} application with:
            
            Core Setup:
            - Express.js server with TypeScript
            - CORS configuration for frontend origin
            - Body parser and security middleware (helmet, express-rate-limit)
            - Morgan logging middleware
            - Error handling middleware
            - Graceful shutdown handling
            
            Database Integration:
            - ${database} connection setup
            - Connection pooling and retry logic
            - Database health checks
            
            Authentication:
            - ${auth} integration
            - JWT token handling
            - Password hashing with bcrypt
            - Rate limiting for auth endpoints
            
            API Structure:
            - Health check endpoint: GET /health
            - User endpoints: /api/users/*
            - Auth endpoints: /api/auth/*
            - Protected route middleware
            
            Features: ${selectedFeatures.join(', ')}
            
            Include proper TypeScript interfaces, error handling, and environment configuration.
            Make it production-ready with proper logging and monitoring.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true,
            optimizeForPerformance: true
          }
        }),

        // Generate user routes with AI
        AIService.generateCode({
          type: 'api',
          framework: backend,
          requirements: `Create comprehensive user management API routes:
            
            Endpoints:
            - POST /api/auth/register - User registration
            - POST /api/auth/login - User login  
            - POST /api/auth/logout - User logout
            - GET /api/auth/me - Get current user
            - PUT /api/auth/profile - Update user profile
            - POST /api/auth/forgot-password - Password reset request
            - POST /api/auth/reset-password - Password reset
            
            Security Features:
            - Input validation with Joi or express-validator
            - Password hashing with bcrypt
            - JWT token generation and verification
            - Rate limiting (5 attempts per 15 minutes)
            - SQL injection prevention
            - XSS protection
            - CSRF protection
            
            Database: ${database}
            Auth Strategy: ${auth}
            
            Include proper error responses, status codes, and TypeScript types.
            Add comprehensive logging and monitoring.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true
          }
        }),

        // Generate auth config
        AIService.generateCode({
          type: 'config',
          framework: frontend,
          requirements: `Create ${auth} authentication configuration:
            
            Configuration includes:
            - Auth provider setup (Google, GitHub, etc.)
            - JWT session strategy
            - Callback URLs and redirects
            - PKCE security settings
            - Environment variable configuration
            - TypeScript interfaces for user/session types
            
            Security Features:
            - Secure cookie settings
            - CSRF protection
            - Session encryption
            - Proper token handling
            
            For ${auth} specifically:
            - Provider configurations
            - Scope definitions
            - Custom signin/signout pages
            - Database adapter setup
            
            Export proper configuration object with TypeScript types.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true
          }
        }),

        // Generate auth middleware
        AIService.generateCode({
          type: 'api',
          framework: backend,
          requirements: `Create authentication middleware for ${auth}:
            
            Middleware Functions:
            - verifyToken: JWT token verification
            - requireAuth: Route protection middleware
            - requireRole: Role-based access control
            - refreshToken: Token refresh logic
            - validateSession: Session validation
            
            Security Features:
            - Token expiration handling
            - Blacklist support for logout
            - Rate limiting for auth attempts
            - Proper error responses
            - Security headers (HSTS, CSP, etc.)
            - Request sanitization
            
            Integration:
            - ${database} user lookup
            - Caching for performance
            - Audit logging
            - Multi-factor authentication support
            
            Error Handling:
            - Proper HTTP status codes
            - Detailed error messages for development
            - Sanitized errors for production
            - Retry mechanisms
            
            Export middleware functions with proper TypeScript types.`,
          options: {
            includeTypeScript: true,
            includeDocumentation: true
          }
        })
      ]);

      // Award XP for each major code generation milestone (non-blocking)
      GamificationService.addXP(userId, 100, 'tool_usage', 'Generated frontend components', { component_count: 2 }).catch(() => {});
      GamificationService.addXP(userId, 100, 'tool_usage', 'Generated backend API', { endpoint_count: 4 }).catch(() => {});
      
      const files = [
        // Frontend files (AI-generated)
        {
          path: 'frontend/package.json',
          content: generateFrontendPackageJson(appName, frontend, selectedFeatures),
          type: 'frontend' as const,
          size: new Blob([generateFrontendPackageJson(appName, frontend, selectedFeatures)]).size
        },
        {
          path: 'frontend/src/pages/index.tsx',
          content: frontendHomePage,
          type: 'frontend' as const,
          size: new Blob([frontendHomePage]).size
        },
        {
          path: 'frontend/src/components/Layout.tsx',
          content: layoutComponent,
          type: 'frontend' as const,
          size: new Blob([layoutComponent]).size
        },
        {
          path: 'frontend/src/lib/auth.ts',
          content: authConfigContent,
          type: 'frontend' as const,
          size: new Blob([authConfigContent]).size
        },
        {
          path: 'frontend/src/components/ui/Button.tsx',
          content: generateUIComponent('Button', frontend),
          type: 'frontend' as const,
          size: 1024
        },
        {
          path: 'frontend/src/components/ui/Input.tsx',
          content: generateUIComponent('Input', frontend),
          type: 'frontend' as const,
          size: 768
        },
        {
          path: 'frontend/src/hooks/useAuth.ts',
          content: generateAuthHook(auth),
          type: 'frontend' as const,
          size: 512
        },
        {
          path: 'frontend/src/services/api.ts',
          content: generateAPIService(backend),
          type: 'frontend' as const,
          size: 1536
        },
        {
          path: 'frontend/tailwind.config.js',
          content: generateTailwindConfig(),
          type: 'frontend' as const,
          size: 512
        },
        {
          path: 'frontend/vite.config.ts',
          content: generateViteConfig(),
          type: 'frontend' as const,
          size: 384
        },
        
        // Backend files (AI-generated)
        {
          path: 'backend/package.json',
          content: generateBackendPackageJson(appName, backend, selectedFeatures),
          type: 'backend' as const,
          size: new Blob([generateBackendPackageJson(appName, backend, selectedFeatures)]).size
        },
        {
          path: 'backend/src/app.ts',
          content: backendApp,
          type: 'backend' as const,
          size: new Blob([backendApp]).size
        },
        {
          path: 'backend/src/routes/auth.ts',
          content: userRoutes,
          type: 'backend' as const,
          size: new Blob([userRoutes]).size
        },
        {
          path: 'backend/src/middleware/auth.ts',
          content: authMiddlewareContent,
          type: 'backend' as const,
          size: new Blob([authMiddlewareContent]).size
        },
        {
          path: 'backend/src/middleware/cors.ts',
          content: generateCORSMiddleware(),
          type: 'backend' as const,
          size: 384
        },
        {
          path: 'backend/src/models/User.ts',
          content: generateUserModel(database),
          type: 'backend' as const,
          size: 768
        },
        {
          path: 'backend/src/utils/validation.ts',
          content: generateValidationUtils(),
          type: 'backend' as const,
          size: 512
        },
        {
          path: 'backend/src/config/database.ts',
          content: generateDatabaseConfig(database),
          type: 'backend' as const,
          size: 640
        },
        {
          path: 'backend/tsconfig.json',
          content: generateBackendTSConfig(),
          type: 'backend' as const,
          size: 256
        },
        
        // Database files (enhanced)
        {
          path: 'database/schema.sql',
          content: generateDatabaseSchema(database, selectedFeatures),
          type: 'database' as const,
          size: new Blob([generateDatabaseSchema(database, selectedFeatures)]).size
        },
        {
          path: 'database/migrations/001_initial.sql',
          content: generateInitialMigration(selectedFeatures),
          type: 'database' as const,
          size: new Blob([generateInitialMigration(selectedFeatures)]).size
        },
        {
          path: 'database/seeds/users.sql',
          content: generateUserSeeds(),
          type: 'database' as const,
          size: 384
        },
        
        // Configuration files (enhanced)
        {
          path: 'docker-compose.yml',
          content: generateDockerCompose(stack, selectedFeatures),
          type: 'config' as const,
          size: new Blob([generateDockerCompose(stack, selectedFeatures)]).size
        },
        {
          path: 'docker-compose.prod.yml',
          content: generateProductionDockerCompose(stack),
          type: 'config' as const,
          size: 1024
        },
        {
          path: '.env.example',
          content: generateEnvExample(stack),
          type: 'config' as const,
          size: new Blob([generateEnvExample(stack)]).size
        },
        {
          path: 'README.md',
          content: generateProjectReadme(appName, appDescription, stack, selectedFeatures),
          type: 'config' as const,
          size: new Blob([generateProjectReadme(appName, appDescription, stack, selectedFeatures)]).size
        },
        {
          path: '.gitignore',
          content: generateGitIgnore(),
          type: 'config' as const,
          size: 768
        },
        {
          path: 'package.json',
          content: generateRootPackageJson(appName, appDescription),
          type: 'config' as const,
          size: 512
        },
      ];

    // Add CI/CD files if selected
    if (selectedFeatures.includes('CI/CD Pipeline')) {
      files.push({
        path: '.github/workflows/deploy.yml',
        content: generateGitHubActions(stack),
        type: 'config' as const,
        size: 1024
      });
    }

    // Add Docker files if selected
    if (selectedFeatures.includes('Docker Containerization')) {
      files.push(
        {
          path: 'frontend/Dockerfile',
          content: generateFrontendDockerfile(frontend),
          type: 'config' as const,
          size: 512
        },
        {
          path: 'backend/Dockerfile',
          content: generateBackendDockerfile(backend),
          type: 'config' as const,
          size: 512
        }
      );
    }

    const endpoints = generateAPIEndpoints(selectedFeatures);

    return {
      name: appName,
      description: appDescription,
      stack,
        files,
        features: selectedFeatures,
        endpoints,
        deploymentConfig: generateDeploymentConfig(stack)
      };
    } catch (error) {
      console.error('AI-powered generation failed:', error);
      throw new Error(`Failed to generate application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [appName, appDescription, frontend, backend, database, auth, deployment, selectedFeatures]);

  const generateApp = useCallback(async () => {
    if (!appName.trim() || !appDescription.trim()) {
      toast.error('Please provide app name and description');
      return;
    }

    // Check if AI model is configured
    const currentModel = AIService.getCurrentModel();
    if (!currentModel) {
      toast.error('Please configure an AI model first in the AI Settings');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressSteps = [
        { progress: 5, message: 'Analyzing requirements...' },
        { progress: 15, message: 'Initializing AI-powered generation...' },
        { progress: 25, message: 'Generating frontend components with AI...' },
        { progress: 40, message: 'Creating backend API with AI...' },
        { progress: 55, message: 'Configuring database schema...' },
        { progress: 70, message: 'Setting up authentication with AI...' },
        { progress: 85, message: 'Configuring deployment...' },
        { progress: 95, message: 'Finalizing AI-generated application...' },
        { progress: 100, message: 'Full-stack app generated successfully with AI!' },
      ];

      // Update progress with shorter delays since AI generation takes time
      const progressInterval = setInterval(() => {
        const currentStep = progressSteps.find(step => step.progress > generationProgress);
        if (currentStep && generationProgress < 90) {
          setGenerationProgress(currentStep.progress);
          toast.info(currentStep.message);
        }
      }, 800);

      const app = await generateFullStackApp();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setGeneratedApp(app);
      setSelectedFile(app.files[0]?.path || null);
      setActiveTab('preview');
      
      // Award XP for full-stack app generation (non-blocking)
      GamificationService.recordProjectCompletion(userId, appName, 'full_stack').catch(() => {});
      
      // Award bonus XP for using advanced features
      let bonusXP = 0;
      if (selectedFeatures.includes('Multi-Agent Orchestration')) bonusXP += 100;
      if (selectedFeatures.includes('Real-time Collaboration')) bonusXP += 75;
      if (selectedFeatures.includes('Advanced Analytics')) bonusXP += 50;
      
      if (bonusXP > 0) {
        GamificationService.addXP(
          userId,
          bonusXP,
          'tool_usage',
          `Advanced Full-Stack App: ${selectedFeatures.filter(f => 
            ['Multi-Agent Orchestration', 'Real-time Collaboration', 'Advanced Analytics'].includes(f)
          ).join(', ')}`,
          { app_name: appName, features: selectedFeatures }
        ).catch(() => {});
      }
      
      toast.success('🎉 Your AI-generated full-stack application is ready!');
      toast.info(`Generated using ${currentModel.name} - Check the preview tab to see your code`);
    } catch (error) {
      console.error('AI-powered generation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate application. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [generateFullStackApp, generationProgress, appName, selectedFeatures]);

  const downloadApp = useCallback(async () => {
    if (!generatedApp) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating project files...');
      
      // Create a ZIP file with all the generated files
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all generated files to the ZIP
      generatedApp.files.forEach(file => {
        const folderPath = file.path.split('/').slice(0, -1).join('/');
        const fileName = file.path.split('/').pop() || 'file';
        
        if (folderPath) {
          zip.folder(folderPath)?.file(fileName, file.content);
        } else {
          zip.file(fileName, file.content);
        }
      });
      
      // Add package.json files if they don't exist
      if (!generatedApp.files.find(f => f.path === 'package.json')) {
        const rootPackageJson = {
          name: generatedApp.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description: generatedApp.description,
          scripts: {
            dev: 'npm run dev:frontend & npm run dev:backend',
            'dev:frontend': 'cd frontend && npm run dev',
            'dev:backend': 'cd backend && npm run dev',
            build: 'npm run build:frontend && npm run build:backend',
            'build:frontend': 'cd frontend && npm run build',
            'build:backend': 'cd backend && npm run build',
            start: 'npm run start:backend',
            'start:backend': 'cd backend && npm start'
          },
          dependencies: {},
          devDependencies: {}
        };
        zip.file('package.json', JSON.stringify(rootPackageJson, null, 2));
      }
      
      // Add README.md
      const readmeContent = `# ${generatedApp.name}

${generatedApp.description}

## Tech Stack

- **Frontend**: ${generatedApp.stack.frontend}
- **Backend**: ${generatedApp.stack.backend}
- **Database**: ${generatedApp.stack.database}
- **Authentication**: ${generatedApp.stack.auth}
- **Deployment**: ${generatedApp.stack.deployment}

## Features

${generatedApp.features.map(feature => `- ${feature}`).join('\n')}

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ${generatedApp.stack.database} database

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Start development servers:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

${generatedApp.endpoints?.map(endpoint => 
  `- **${endpoint.method}** \`${endpoint.path}\` - ${endpoint.description}`
).join('\n') || 'No API endpoints documented.'}

## Deployment

This application is configured for deployment to ${generatedApp.stack.deployment}.

${generatedApp.deploymentConfig ? 
  `### Deployment Configuration\n\n\`\`\`json\n${JSON.stringify(generatedApp.deploymentConfig, null, 2)}\n\`\`\`` :
  'See deployment configuration files for setup instructions.'
}

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project was generated using FlashFusion AI Platform.
`;
      
      zip.file('README.md', readmeContent);
      
      // Add .gitignore
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/build
/dist
/.next

# Environment variables
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Database
*.sqlite
*.db

# Logs
logs/
*.log
`;
      
      zip.file('.gitignore', gitignoreContent);
      
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download the file
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${generatedApp.name.toLowerCase().replace(/\s+/g, '-')}-fullstack-app.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success('🎉 Project downloaded successfully!');
      
      // Award XP for downloading (non-blocking)
      GamificationService.addXP(
        userId,
        50,
        'tool_usage',
        'Downloaded full-stack application',
        { app_name: generatedApp.name, file_count: generatedApp.files.length }
      ).catch(() => {});
      
    } catch (error) {
      console.error('Error downloading project:', error);
      toast.error('Failed to generate project files. Please try again.');
    }
  }, [generatedApp]);

  const copyToClipboard = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
      
      // Award XP for copying code (non-blocking)
      GamificationService.addXP(
        userId,
        5,
        'tool_usage',
        'Copied generated code',
        { content_length: content.length }
      ).catch(() => {});
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, [userId]);

  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath);
    
    // Award XP for file exploration (non-blocking)
    GamificationService.addXP(
      userId,
      2,
      'tool_usage',
      'Explored generated file',
      { file_path: filePath }
    ).catch(() => {});
  }, [userId]);

  const handleDownloadFile = useCallback((filePath: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || 'file.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${filePath.split('/').pop()}`);
      
      // Award XP for individual file download (non-blocking)
      GamificationService.addXP(
        userId,
        10,
        'tool_usage',
        'Downloaded individual file',
        { file_path: filePath, file_size: content.length }
      ).catch(() => {});
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Failed to download file');
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedApp} className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="deploy" disabled={!generatedApp} className="flex items-center gap-2">
            <CloudUpload className="w-4 h-4" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="download" disabled={!generatedApp} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Full-Stack Application Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AppConfigurationSection
                appName={appName}
                setAppName={setAppName}
                appDescription={appDescription}
                setAppDescription={setAppDescription}
                appType={appType}
                setAppType={setAppType}
                appTypes={APP_TYPES}
              />

              <TechStackSection
                frontend={frontend}
                setFrontend={setFrontend}
                backend={backend}
                setBackend={setBackend}
                database={database}
                setDatabase={setDatabase}
                auth={auth}
                setAuth={setAuth}
                deployment={deployment}
                setDeployment={setDeployment}
                frontendFrameworks={FRONTEND_FRAMEWORKS}
                backendFrameworks={BACKEND_FRAMEWORKS}
                databases={DATABASES}
                authProviders={AUTH_PROVIDERS}
                deploymentPlatforms={DEPLOYMENT_PLATFORMS}
              />

              <FeaturesSection
                features={FEATURES}
                selectedFeatures={selectedFeatures}
                onFeatureToggle={handleFeatureToggle}
              />

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-3 p-6 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">Building your full-stack application...</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    This includes frontend, backend, database, and deployment configuration
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-4">
                <Button
                  onClick={generateApp}
                  disabled={isGenerating || !appName.trim() || !appDescription.trim()}
                  className="ff-btn-primary flex-1"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Application...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Build Full-Stack App
                    </>
                  )}
                </Button>
                
                {generatedApp && (
                  <Button variant="outline" onClick={() => setActiveTab('preview')} size="lg">
                    <Monitor className="w-5 h-5 mr-2" />
                    View App
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {generatedApp && (
            <RealTimeCodePreview
              generatedApp={generatedApp}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onCopyCode={copyToClipboard}
              onDownloadFile={handleDownloadFile}
              isLoading={isGenerating}
            />
          )}
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          {generatedApp && (
            <DeploymentSection generatedApp={generatedApp} />
          )}
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          {generatedApp && (
            <ExportSection 
              generatedApp={generatedApp}
              onDownload={downloadApp}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FullStackAppBuilder;