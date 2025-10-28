import { z } from 'zod';

/**
 * @fileoverview Creator Mode validation schemas for FlashFusion
 * @description Contains Zod schemas for validating Creator Mode functionality including
 * content ideas, captions, calendar events, modules, and creator analytics
 */

/**
 * Content difficulty levels enum schema
 * @description Validates the complexity level of content creation tasks
 */
export const ContentDifficultySchema = z.enum(['easy', 'medium', 'hard']);

/**
 * Engagement potential levels enum schema
 * @description Validates the expected engagement level for content
 */
export const EngagementPotentialSchema = z.enum(['high', 'medium', 'low']);

/**
 * Content idea validation schema
 * @description Validates AI-generated content ideas with metadata
 */
export const ContentIdeaSchema = z.object({
  /** Unique content idea identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Content title/headline */
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  /** Detailed content description */
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  /** Target platforms for this content */
  platform: z.array(z.string()).min(1, 'At least one platform is required'),
  /** Content category classification */
  category: z.string().min(1, 'Category is required'),
  /** Content creation difficulty */
  difficulty: ContentDifficultySchema,
  /** Estimated time to create */
  estimated_time: z.string().min(1, 'Estimated time is required'),
  /** Expected engagement level */
  engagement_potential: EngagementPotentialSchema,
  /** Whether content is currently trending */
  trending: z.boolean(),
  /** SEO and discovery keywords */
  keywords: z.array(z.string()),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Generated caption validation schema
 * @description Validates AI-generated social media captions with optimization metrics
 */
export const GeneratedCaptionSchema = z.object({
  /** Unique caption identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Caption text content */
  text: z.string().min(10, 'Caption must be at least 10 characters').max(2200, 'Caption too long for most platforms'),
  /** Target platform */
  platform: z.string().min(1, 'Platform is required'),
  /** Content category */
  category: z.string().min(1, 'Category is required'),
  /** Opening hooks used in caption */
  hooks: z.array(z.string()),
  /** Call-to-action text */
  cta: z.string().min(1, 'CTA is required').max(200, 'CTA too long'),
  /** Suggested hashtags */
  hashtags: z.array(z.string()).max(30, 'Too many hashtags'),
  /** Character count for platform limits */
  character_count: z.number().int().min(0, 'Character count cannot be negative'),
  /** Predicted engagement score (0-100) */
  engagement_score: z.number().min(0).max(100, 'Engagement score must be between 0-100'),
  /** Brand alignment score (0-100) */
  brand_alignment_score: z.number().min(0).max(100, 'Brand alignment score must be between 0-100'),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Content calendar event status enum schema
 * @description Validates the current status of scheduled content
 */
export const ContentCalendarEventStatusSchema = z.enum(['draft', 'scheduled', 'published', 'failed']);

/**
 * Engagement metrics validation schema
 * @description Validates post-publication engagement metrics
 */
export const EngagementMetricsSchema = z.object({
  /** Total views/impressions */
  views: z.number().int().min(0, 'Views cannot be negative'),
  /** Total likes/reactions */
  likes: z.number().int().min(0, 'Likes cannot be negative'),
  /** Total comments */
  comments: z.number().int().min(0, 'Comments cannot be negative'),
  /** Total shares */
  shares: z.number().int().min(0, 'Shares cannot be negative'),
  /** Total saves/bookmarks */
  saves: z.number().int().min(0, 'Saves cannot be negative')
}).strict();

/**
 * Content calendar event validation schema
 * @description Validates scheduled content posts with engagement tracking
 */
export const ContentCalendarEventSchema = z.object({
  /** Unique event identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Content title */
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  /** Content text/caption */
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  /** Target platforms */
  platform: z.array(z.string()).min(1, 'At least one platform is required'),
  /** Scheduled publication time */
  scheduled_time: z.string().datetime('Must be a valid ISO datetime'),
  /** Current status */
  status: ContentCalendarEventStatusSchema,
  /** Optional engagement metrics (after publication) */
  engagement_metrics: EngagementMetricsSchema.optional(),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Creator module categories enum schema
 * @description Validates the functional category of creator tools
 */
export const CreatorModuleCategorySchema = z.enum([
  'content', 'branding', 'growth', 'monetization', 'analytics', 'automation'
]);

/**
 * Subscription tier validation schema
 * @description Validates access levels for creator modules
 */
export const ModuleTierSchema = z.enum(['free', 'pro', 'enterprise']);

/**
 * Creator module validation schema
 * @description Validates individual creator tool modules with usage tracking
 */
export const CreatorModuleSchema = z.object({
  /** Unique module identifier */
  id: z.string().min(1, 'Module ID is required'),
  /** Human-readable module name */
  name: z.string().min(1, 'Module name is required').max(100, 'Module name too long'),
  /** Module description and benefits */
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  /** Module functional category */
  category: CreatorModuleCategorySchema,
  /** Required subscription tier */
  tier: ModuleTierSchema,
  /** Pain point this module solves */
  pain_point: z.string().min(5, 'Pain point must be described').max(200, 'Pain point description too long'),
  /** Current usage count */
  usage_count: z.number().int().min(0, 'Usage count cannot be negative'),
  /** Maximum usage limit */
  max_usage: z.number().int().min(1, 'Max usage must be at least 1'),
  /** Whether module is currently active */
  is_active: z.boolean(),
  /** Completed tasks/actions */
  completed_tasks: z.number().int().min(0, 'Completed tasks cannot be negative'),
  /** Total available tasks */
  total_tasks: z.number().int().min(1, 'Total tasks must be at least 1')
}).strict();

/**
 * Viral format categories enum schema
 * @description Validates the longevity type of viral content formats
 */
export const ViralFormatCategorySchema = z.enum(['trend', 'evergreen', 'seasonal']);

/**
 * Viral content format validation schema
 * @description Validates trending content format templates
 */
export const ViralFormatSchema = z.object({
  /** Format name/identifier */
  name: z.string().min(1, 'Format name is required').max(100, 'Format name too long'),
  /** Format description and usage */
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description too long'),
  /** Compatible platforms */
  platforms: z.array(z.string()).min(1, 'At least one platform is required'),
  /** Example implementation */
  example: z.string().min(10, 'Example must be provided').max(500, 'Example too long'),
  /** Format longevity category */
  category: ViralFormatCategorySchema,
  /** Expected engagement potential */
  engagement_potential: EngagementPotentialSchema
}).strict();

/**
 * Reach potential levels enum schema
 * @description Validates the expected reach of hashtag sets
 */
export const ReachPotentialSchema = z.enum(['high', 'medium', 'low']);

/**
 * Hashtag set validation schema
 * @description Validates optimized hashtag combinations for platforms
 */
export const HashtagSetSchema = z.object({
  /** Unique hashtag set identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Target platform */
  platform: z.string().min(1, 'Platform is required'),
  /** Content category */
  category: z.string().min(1, 'Category is required'),
  /** Array of hashtags (without # symbol) */
  hashtags: z.array(z.string().min(1, 'Hashtag cannot be empty')).min(1, 'At least one hashtag is required').max(30, 'Too many hashtags'),
  /** Engagement score (0-100) */
  engagement_score: z.number().min(0).max(100, 'Engagement score must be between 0-100'),
  /** Reach potential level */
  reach_potential: ReachPotentialSchema,
  /** Whether hashtags are currently trending */
  trending: z.boolean(),
  /** Last update timestamp */
  last_updated: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Content template validation schema
 * @description Validates reusable content templates with variables
 */
export const ContentTemplateSchema = z.object({
  /** Unique template identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Template name */
  name: z.string().min(1, 'Template name is required').max(100, 'Template name too long'),
  /** Template description */
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description too long'),
  /** Compatible platforms */
  platform: z.array(z.string()).min(1, 'At least one platform is required'),
  /** Template content with variables */
  template_content: z.string().min(10, 'Template content is required').max(2000, 'Template content too long'),
  /** Available template variables */
  variables: z.array(z.string()),
  /** Content category */
  category: z.string().min(1, 'Category is required'),
  /** Estimated engagement rating */
  estimated_engagement: z.number().min(0).max(100, 'Engagement rating must be between 0-100'),
  /** Template difficulty level */
  difficulty: ContentDifficultySchema,
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Creator insight types enum schema
 * @description Validates the type of creator insights generated
 */
export const CreatorInsightTypeSchema = z.enum(['performance', 'trend', 'audience', 'content']);

/**
 * Insight priority levels enum schema
 * @description Validates the priority level of creator insights
 */
export const InsightPrioritySchema = z.enum(['high', 'medium', 'low']);

/**
 * Creator insight validation schema
 * @description Validates AI-generated insights for creator optimization
 */
export const CreatorInsightSchema = z.object({
  /** Unique insight identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Type of insight */
  insight_type: CreatorInsightTypeSchema,
  /** Insight title */
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  /** Detailed insight description */
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  /** Actionable steps */
  action_items: z.array(z.string()).min(1, 'At least one action item is required'),
  /** Insight priority level */
  priority: InsightPrioritySchema,
  /** Supporting data */
  data: z.record(z.any()),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Brand guideline categories enum schema
 * @description Validates the category of brand guidelines
 */
export const BrandGuidelineCategorySchema = z.enum(['visual', 'voice', 'content', 'social']);

/**
 * Brand guideline validation schema
 * @description Validates brand guideline entries with examples
 */
export const BrandGuidelineSchema = z.object({
  /** Unique guideline identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated brand kit ID */
  brand_kit_id: z.string().uuid('Must be a valid UUID'),
  /** Guideline category */
  category: BrandGuidelineCategorySchema,
  /** Guideline title */
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  /** Guideline description */
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  /** Positive examples */
  do_examples: z.array(z.string()),
  /** Negative examples/things to avoid */
  dont_examples: z.array(z.string()),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Collaboration request types enum schema
 * @description Validates the type of creator collaboration requests
 */
export const CollaborationTypeSchema = z.enum(['content_swap', 'joint_project', 'cross_promotion', 'mentorship']);

/**
 * Collaboration request status enum schema
 * @description Validates the current status of collaboration requests
 */
export const CollaborationStatusSchema = z.enum(['pending', 'accepted', 'declined', 'completed']);

/**
 * Collaboration request validation schema
 * @description Validates creator-to-creator collaboration requests
 */
export const CollaborationRequestSchema = z.object({
  /** Unique request identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** ID of the requesting creator */
  requester_id: z.string().uuid('Must be a valid UUID'),
  /** ID of the target creator */
  target_creator_id: z.string().uuid('Must be a valid UUID'),
  /** Type of collaboration */
  collaboration_type: CollaborationTypeSchema,
  /** Current status */
  status: CollaborationStatusSchema,
  /** Collaboration details and proposal */
  details: z.string().min(10, 'Details must be provided').max(1000, 'Details too long'),
  /** Proposed timeline */
  proposed_timeline: z.string().min(1, 'Timeline is required'),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime'),
  /** Last update timestamp */
  updated_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

/**
 * Creator metrics validation schema
 * @description Validates daily creator performance metrics by platform
 */
export const CreatorMetricsSchema = z.object({
  /** Unique metrics record identifier */
  id: z.string().uuid('Must be a valid UUID'),
  /** Associated user ID */
  user_id: z.string().uuid('Must be a valid UUID'),
  /** Metrics date (YYYY-MM-DD format) */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  /** Platform name */
  platform: z.string().min(1, 'Platform is required'),
  /** Total followers */
  followers: z.number().int().min(0, 'Followers cannot be negative'),
  /** Engagement rate percentage */
  engagement_rate: z.number().min(0).max(100, 'Engagement rate must be between 0-100'),
  /** Total reach */
  reach: z.number().int().min(0, 'Reach cannot be negative'),
  /** Total impressions */
  impressions: z.number().int().min(0, 'Impressions cannot be negative'),
  /** Total clicks */
  clicks: z.number().int().min(0, 'Clicks cannot be negative'),
  /** Total saves */
  saves: z.number().int().min(0, 'Saves cannot be negative'),
  /** Total shares */
  shares: z.number().int().min(0, 'Shares cannot be negative'),
  /** Total comments */
  comments: z.number().int().min(0, 'Comments cannot be negative'),
  /** Total likes */
  likes: z.number().int().min(0, 'Likes cannot be negative'),
  /** Creation timestamp */
  created_at: z.string().datetime('Must be a valid ISO datetime')
}).strict();

// Export individual schemas for specific validation needs
export {
  ContentDifficultySchema as ContentDifficulty,
  EngagementPotentialSchema as EngagementPotential,
  ContentIdeaSchema as ContentIdea,
  GeneratedCaptionSchema as GeneratedCaption,
  ContentCalendarEventStatusSchema as ContentCalendarEventStatus,
  EngagementMetricsSchema as EngagementMetrics,
  ContentCalendarEventSchema as ContentCalendarEvent,
  CreatorModuleCategorySchema as CreatorModuleCategory,
  ModuleTierSchema as ModuleTier,
  CreatorModuleSchema as CreatorModule,
  ViralFormatCategorySchema as ViralFormatCategory,
  ViralFormatSchema as ViralFormat,
  ReachPotentialSchema as ReachPotential,
  HashtagSetSchema as HashtagSet,
  ContentTemplateSchema as ContentTemplate,
  CreatorInsightTypeSchema as CreatorInsightType,
  InsightPrioritySchema as InsightPriority,
  CreatorInsightSchema as CreatorInsight,
  BrandGuidelineCategorySchema as BrandGuidelineCategory,
  BrandGuidelineSchema as BrandGuideline,
  CollaborationTypeSchema as CollaborationType,
  CollaborationStatusSchema as CollaborationStatus,
  CollaborationRequestSchema as CollaborationRequest,
  CreatorMetricsSchema as CreatorMetrics
};