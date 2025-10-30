/**
 * @fileoverview Creator content pipeline type definitions
 * @module types/creator-content-pipeline
 */

/**
 * Generated content output for a specific platform
 * @interface ContentOutput
 * @property {string} id - Unique output identifier
 * @property {string} platform - Target platform
 * @property {string} type - Content type
 * @property {string} content - Generated content
 * @property {'generating' | 'completed' | 'error'} status - Generation status
 * @property {number} [wordCount] - Word count
 * @property {number} [characterCount] - Character count
 * @property {number} [estimatedEngagement] - Estimated engagement score
 */
export interface ContentOutput {
  id: string;
  platform: string;
  type: string;
  content: string;
  status: 'generating' | 'completed' | 'error';
  wordCount?: number;
  characterCount?: number;
  estimatedEngagement?: number;
}

/**
 * AI model for content generation
 * @interface AIModel
 * @property {string} id - Unique model identifier
 * @property {string} name - Model name
 * @property {string} description - Model description
 * @property {string[]} strengths - Model strengths
 * @property {React.ComponentType<{ className?: string }>} icon - Icon component
 * @property {string} color - Brand color
 */
export interface AIModel {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/**
 * Platform-specific configuration
 * @interface PlatformConfig
 * @property {string} name - Platform name
 * @property {React.ComponentType<{ className?: string }>} icon - Platform icon component
 * @property {string} color - Platform brand color
 * @property {string[]} outputs - Supported output types
 */
export interface PlatformConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  outputs: string[];
}

/**
 * Content generation settings
 * @interface ContentSettings
 * @property {string} tone - Content tone
 * @property {string} targetAudience - Target audience
 * @property {boolean} seoOptimization - SEO optimization enabled
 * @property {boolean} autoPosting - Auto-posting enabled
 */
export interface ContentSettings {
  tone: string;
  targetAudience: string;
  seoOptimization: boolean;
  autoPosting: boolean;
}

/**
 * Content generation state tracker
 * @interface GenerationState
 * @property {boolean} isGenerating - Whether content is currently being generated
 * @property {number} progress - Generation progress (0-100)
 * @property {ContentOutput[]} outputs - Generated outputs
 */
export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  outputs: ContentOutput[];
}