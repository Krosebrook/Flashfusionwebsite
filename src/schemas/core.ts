import { z } from 'zod';

/**
 * @fileoverview Core validation schemas for FlashFusion application
 * @description Contains Zod schemas for validating core application types including
 * users, authentication, navigation, and basic system entities
 */

/**
 * Validation schema for page navigation types
 * @description Validates all possible page routes in the FlashFusion application
 */
export const PageTypeSchema = z.enum([
  // Public pages
  'home', 'about', 'features', 'pricing', 'contact', 'testimonials', 'faq', 'demo', 'terms', 'privacy',
  // Creator Mode pages
  'creator-mode', 'brand-kit-generator', 'content-creation-hub',
  // Protected pages
  'dashboard', 'projects', 'tools', 'tool-detail', 'analytics', 'production-analytics', 'settings',
  'integrations', 'deployments', 'templates', 'collaboration', 'cicd', 'subscription', 'launch-campaign',
  // Print-on-Demand pages
  'print-designer', 'marketplace-manager', 'product-catalog', 'order-management', 'fulfillment-center'
]);

/**
 * Validation schema for subscription tiers
 * @description Defines the available subscription levels with increasing feature access
 */
export const SubscriptionTierSchema = z.enum(['free', 'pro', 'enterprise']);

/**
 * Brand colors validation schema
 * @description Validates hex color codes for brand color palette
 */
export const BrandColorsSchema = z.object({
  /** Primary brand color (hex format) */
  primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  /** Secondary brand color (hex format) */
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  /** Accent color for highlights (hex format) */
  accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  /** Background color (hex format) */
  background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  /** Text color (hex format) */
  text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  /** Muted text color (hex format) */
  muted: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color')
}).strict();

/**
 * Font configuration validation schema
 * @description Validates typography settings for brand consistency
 */
export const BrandFontSchema = z.object({
  /** Font family name */
  name: z.string().min(1, 'Font name is required'),
  /** Font category classification */
  category: z.enum(['serif', 'sans-serif', 'display', 'monospace']),
  /** Available font weights */
  weight: z.array(z.string()).min(1, 'At least one font weight is required'),
  /** CSS fallback font stack */
  fallback: z.string().min(1, 'Fallback font is required')
}).strict();

/**
 * Complete brand fonts validation schema
 * @description Validates heading and body font configurations
 */
export const BrandFontsSchema = z.object({
  /** Font configuration for headings */
  heading: BrandFontSchema,
  /** Font configuration for body text */
  body: BrandFontSchema
}).strict();

/**
 * Brand persona validation schema
 * @description Validates brand voice and personality attributes
 */
export const BrandPersonaSchema = z.object({
  /** Brand tone attributes */
  tone: z.array(z.string()).min(1, 'At least one tone is required'),
  /** Core brand values */
  values: z.array(z.string()).min(1, 'At least one value is required'),
  /** Brand voice description */
  voice: z.string().min(10, 'Voice description must be at least 10 characters'),
  /** Personality traits */
  personality: z.array(z.string()).min(1, 'At least one personality trait is required'),
  /** Key brand messages */
  messaging: z.array(z.string()).min(1, 'At least one key message is required')
}).strict();

/**
 * Brand asset validation schema
 * @description Validates downloadable brand assets
 */
export const BrandAssetSchema = z.object({
  /** Asset type classification */
  type: z.enum(['logo', 'icon', 'pattern', 'template']),
  /** Human-readable asset name */
  name: z.string().min(1, 'Asset name is required'),
  /** Asset description */
  description: z.string().min(1, 'Asset description is required'),
  /** Available file formats */
  formats: z.array(z.string()).min(1, 'At least one format is required'),
  /** Download URL */
  download_url: z.string().url('Must be a valid URL')
}).strict();

/**
 * Complete brand kit validation schema
 * @description Validates the entire brand identity package
 */
export const BrandKitSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Brand name */
  brand_name: z.string().min(1, 'Brand name is required').max(100, 'Brand name too long'),
  /** Industry classification */
  industry: z.string().min(1, 'Industry is required').max(100, 'Industry name too long'),
  /** Target audience description */
  target_audience: z.string().min(1, 'Target audience is required').max(200, 'Target audience description too long'),
  /** Optional brand description */
  description: z.string().max(1000, 'Description too long').optional(),
  /** Brand color palette */
  colors: BrandColorsSchema,
  /** Typography settings */
  fonts: BrandFontsSchema,
  /** Brand personality and voice */
  persona: BrandPersonaSchema,
  /** Downloadable brand assets */
  assets: z.array(BrandAssetSchema),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Social media platform validation schema
 * @description Validates supported social media platforms with metrics
 */
export const PlatformSchema = z.object({
  /** Platform name */
  name: z.enum(['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube', 'pinterest', 'facebook']),
  /** Platform handle/username */
  handle: z.string().min(1, 'Handle is required').max(50, 'Handle too long'),
  /** Follower count */
  followers: z.number().int().min(0, 'Followers cannot be negative'),
  /** Engagement rate percentage */
  engagement_rate: z.number().min(0, 'Engagement rate cannot be negative').max(100, 'Engagement rate cannot exceed 100%'),
  /** Whether this is the primary platform */
  is_primary: z.boolean()
}).strict();

/**
 * Time slot validation schema for content scheduling
 * @description Validates scheduled posting times
 */
export const TimeSlotSchema = z.object({
  /** Hour (0-23) */
  hour: z.number().int().min(0).max(23, 'Hour must be between 0-23'),
  /** Minute (0-59) */
  minute: z.number().int().min(0).max(59, 'Minute must be between 0-59'),
  /** Target platform */
  platform: z.string().min(1, 'Platform is required'),
  /** Content type */
  content_type: z.string().min(1, 'Content type is required')
}).strict();

/**
 * Weekly posting schedule validation schema
 * @description Validates content posting schedule for each day of the week
 */
export const PostingScheduleSchema = z.object({
  monday: z.array(TimeSlotSchema),
  tuesday: z.array(TimeSlotSchema),
  wednesday: z.array(TimeSlotSchema),
  thursday: z.array(TimeSlotSchema),
  friday: z.array(TimeSlotSchema),
  saturday: z.array(TimeSlotSchema),
  sunday: z.array(TimeSlotSchema)
}).strict();

/**
 * Creator profile validation schema
 * @description Validates creator profile information and preferences
 */
export const CreatorProfileSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Creator type classification */
  creator_type: z.enum(['blogger', 'influencer', 'entrepreneur', 'artist', 'educator', 'other']),
  /** Active social media platforms */
  platforms: z.array(PlatformSchema).min(1, 'At least one platform is required'),
  /** Creator niche/industry */
  niche: z.string().min(1, 'Niche is required').max(100, 'Niche description too long'),
  /** Total audience size across platforms */
  audience_size: z.number().int().min(0, 'Audience size cannot be negative'),
  /** Content style preferences */
  content_style: z.array(z.string()).min(1, 'At least one content style is required'),
  /** How often content is posted */
  posting_frequency: z.enum(['daily', 'weekly', 'monthly']),
  /** Creator goals and objectives */
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Content preferences validation schema
 * @description Validates user content creation preferences and settings
 */
export const ContentPreferencesSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Preferred content types */
  preferred_content_types: z.array(z.string()).min(1, 'At least one content type is required'),
  /** Weekly posting schedule */
  posting_schedule: PostingScheduleSchema,
  /** Hashtag strategy preference */
  hashtag_strategy: z.enum(['trending', 'niche', 'branded', 'mixed']),
  /** Core content themes */
  content_pillars: z.array(z.string()).min(1, 'At least one content pillar is required'),
  /** Topics to avoid */
  avoid_topics: z.array(z.string()),
  /** Brand voice keywords */
  brand_voice_keywords: z.array(z.string()),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * User validation schema
 * @description Validates core user account information and associated data
 */
export const UserSchema = z.object({
  /** Unique user identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** User email address */
  email: z.string().email('Must be a valid email address'),
  /** User display name */
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  /** Optional avatar image URL */
  avatar_url: z.string().url('Must be a valid URL').optional(),
  /** Subscription tier level */
  subscription_tier: SubscriptionTierSchema,
  /** Available credits for AI tools */
  credits: z.number().int().min(0, 'Credits cannot be negative'),
  /** Account creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last account update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Optional brand kit information */
  brand_kit: BrandKitSchema.optional(),
  /** Optional creator profile */
  creator_profile: CreatorProfileSchema.optional(),
  /** Optional content preferences */
  content_preferences: ContentPreferencesSchema.optional()
}).strict();

/**
 * User statistics validation schema
 * @description Validates gamification and progress tracking data
 */
export const UserStatsSchema = z.object({
  /** Unique identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Current user level */
  level: z.number().int().min(1, 'Level must be at least 1'),
  /** Total experience points */
  xp: z.number().int().min(0, 'XP cannot be negative'),
  /** Progress to next level (0-100) */
  xp_progress: z.number().min(0).max(100, 'XP progress must be between 0-100'),
  /** Current streak in days */
  streak_days: z.number().int().min(0, 'Streak cannot be negative'),
  /** Total projects created */
  projects_created: z.number().int().min(0, 'Projects created cannot be negative'),
  /** Total AI tools used */
  tools_used: z.number().int().min(0, 'Tools used cannot be negative'),
  /** Total achievements unlocked */
  achievements_unlocked: z.number().int().min(0, 'Achievements cannot be negative'),
  /** User subscription tier */
  subscription_tier: SubscriptionTierSchema,
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Notification validation schema
 * @description Validates system notifications and alerts
 */
export const NotificationSchema = z.object({
  /** Unique notification identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Notification title */
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  /** Notification message content */
  message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
  /** Notification type/severity */
  type: z.enum(['info', 'success', 'warning', 'error']),
  /** Whether notification has been read */
  read: z.boolean(),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Optional action URL */
  action_url: z.string().url('Must be a valid URL').optional(),
  /** Optional action button label */
  action_label: z.string().max(50, 'Action label too long').optional()
}).strict();

// Export individual schemas for specific validation needs
export {
  PageTypeSchema as PageType,
  SubscriptionTierSchema as SubscriptionTier,
  BrandColorsSchema as BrandColors,
  BrandFontsSchema as BrandFonts,
  BrandPersonaSchema as BrandPersona,
  BrandAssetSchema as BrandAsset,
  BrandKitSchema as BrandKit,
  PlatformSchema as Platform,
  TimeSlotSchema as TimeSlot,
  PostingScheduleSchema as PostingSchedule,
  CreatorProfileSchema as CreatorProfile,
  ContentPreferencesSchema as ContentPreferences,
  UserSchema as User,
  UserStatsSchema as UserStats,
  NotificationSchema as Notification
};