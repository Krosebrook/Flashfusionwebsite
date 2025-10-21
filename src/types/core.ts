// Enhanced Core Type Definitions for FlashFusion
export type PageType = 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
                       'analytics' | 'collaboration' | 'templates' | 'integrations' | 
                       'settings' | 'about' | 'pricing' | 'pricing-wireframe' | 'user-personas' | 'contact' | 'ai-models' | 
                       'live-collaboration' | 'cicd-pipeline' | 'responsive-ui-kit' | 'backend-architecture' | 'infrastructure-strategy' |
                       'notifications' | 'profile' | 'search' | 'plugins' | 'data-hub' | 'insights' | 'business-intelligence' | 'workspace' | 'external-integrations' | 'repository-hub' |
                       'creator-hub' | 'creator-content-pipeline' | 'creator-commerce' | 'brand-kit' | 'content-creation' | 'education';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  xp: number;
  level: number;
  achievements: Achievement[];
  projects: string[];
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
  lastPage?: PageType;
  favoriteTools: string[];
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  achievements: boolean;
  projectUpdates: boolean;
  deployments: boolean;
  security: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'creation' | 'deployment' | 'collaboration' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: string;
  progress?: {
    current: number;
    total: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'webapp' | 'mobile' | 'api' | 'ecommerce' | 'content';
  framework: string;
  status: 'draft' | 'development' | 'testing' | 'deployed' | 'archived';
  visibility: 'private' | 'public' | 'team';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deployedAt?: string;
  deploymentUrl?: string;
  repository?: {
    provider: 'github' | 'gitlab' | 'bitbucket';
    url: string;
    branch: string;
  };
  collaborators: ProjectCollaborator[];
  analytics: ProjectAnalytics;
}

export interface ProjectCollaborator {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
  permissions: string[];
}

export interface ProjectAnalytics {
  views: number;
  deployments: number;
  errors: number;
  performance: {
    buildTime: number;
    bundleSize: number;
    lighthouse: LighthouseScore;
  };
}

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  version: string;
  rating: number;
  downloads: number;
  isPremium: boolean;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  capabilities: ToolCapability[];
  requiredInputs: ToolInput[];
  outputFormats: OutputFormat[];
  integrations: Integration[];
  documentation: Documentation;
}

export type ToolCategory = 
  | 'development'
  | 'ecommerce'
  | 'content'
  | 'design'
  | 'mobile'
  | 'deployment'
  | 'ai'
  | 'analytics';

export interface ToolCapability {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface ToolInput {
  id: string;
  name: string;
  type: 'text' | 'select' | 'multiselect' | 'file' | 'number' | 'boolean';
  required: boolean;
  validation?: InputValidation;
  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export interface InputValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface OutputFormat {
  type: 'code' | 'file' | 'url' | 'data';
  format: string;
  downloadable: boolean;
  previewable: boolean;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'deployment' | 'storage' | 'analytics' | 'payment' | 'communication';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
}

export interface Documentation {
  quickStart: string;
  examples: Example[];
  apiReference?: string;
  troubleshooting: FAQ[];
}

export interface Example {
  title: string;
  description: string;
  code?: string;
  demo?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export interface Deployment {
  id: string;
  projectId: string;
  platform: DeploymentPlatform;
  status: 'pending' | 'building' | 'deploying' | 'success' | 'failed' | 'cancelled';
  environment: 'development' | 'staging' | 'production';
  branch: string;
  commit: string;
  buildLogs: BuildLog[];
  deployedAt?: string;
  url?: string;
  preview?: boolean;
  metrics: DeploymentMetrics;
}

export type DeploymentPlatform = 
  | 'vercel'
  | 'netlify'
  | 'heroku'
  | 'aws'
  | 'digitalocean'
  | 'railway'
  | 'render'
  | 'firebase';

export interface BuildLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
}

export interface DeploymentMetrics {
  buildTime: number;
  bundleSize: number;
  memoryUsage: number;
  cpuUsage: number;
  bandwidth: number;
  requests: number;
  errors: number;
}

export interface Analytics {
  pageViews: PageView[];
  userSessions: UserSession[];
  toolUsage: ToolUsage[];
  conversions: Conversion[];
  performance: PerformanceMetric[];
}

export interface PageView {
  page: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  referrer?: string;
  country?: string;
  device: string;
  browser: string;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageCount: number;
  bounced: boolean;
  converted: boolean;
}

export interface ToolUsage {
  toolId: string;
  userId?: string;
  timestamp: string;
  duration: number;
  completed: boolean;
  outputGenerated: boolean;
  errorOccurred: boolean;
}

export interface Conversion {
  type: 'signup' | 'upgrade' | 'download' | 'deploy' | 'share';
  timestamp: string;
  userId?: string;
  value?: number;
  metadata: Record<string, any>;
}

export interface PerformanceMetric {
  page: string;
  timestamp: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'project' | 'deployment' | 'achievement' | 'collaboration';
}

export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: FeatureFlag[];
  api: ApiConfig;
  analytics: AnalyticsConfig;
  authentication: AuthConfig;
  storage: StorageConfig;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  targetUsers?: string[];
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
  };
}

export interface AnalyticsConfig {
  enabled: boolean;
  googleAnalyticsId?: string;
  mixpanelToken?: string;
  hotjarId?: string;
  trackingConsent: boolean;
}

export interface AuthConfig {
  providers: AuthProvider[];
  sessionTimeout: number;
  refreshTokenRotation: boolean;
  mfaEnabled: boolean;
}

export interface AuthProvider {
  name: string;
  enabled: boolean;
  clientId?: string;
  scopes?: string[];
}

export interface StorageConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  cdnUrl?: string;
  compressionEnabled: boolean;
}

// Error types for better error handling
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  userId?: string;
  context?: Record<string, any>;
  stack?: string;
}

// Search and filtering types
export interface SearchResult {
  type: 'tool' | 'project' | 'template' | 'documentation' | 'user';
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  category?: string;
  relevance: number;
  metadata?: Record<string, any>;
}

export interface FilterOptions {
  categories: string[];
  tags: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  difficulty?: string[];
  rating?: {
    min: number;
    max: number;
  };
}

// Collaboration types
export interface Collaboration {
  id: string;
  projectId: string;
  participants: CollaborationParticipant[];
  type: 'realtime' | 'asynchronous';
  status: 'active' | 'paused' | 'ended';
  startedAt: string;
  endedAt?: string;
  changes: CollaborationChange[];
}

export interface CollaborationParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  isOnline: boolean;
  cursor?: {
    x: number;
    y: number;
    color: string;
  };
}

export interface CollaborationChange {
  id: string;
  userId: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'move';
  target: string;
  before?: any;
  after?: any;
  description: string;
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};