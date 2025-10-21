/**
 * @fileoverview Image Generation Types and Interfaces
 * @chunk types
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * FLASHFUSION - IMAGE GENERATION TYPES
 * 
 * Comprehensive type definitions for the AI image generation system,
 * including model configurations, generation parameters, and output formats.
 */

/**
 * Available AI Models for Image Generation
 */
export interface AIModel {
  /** Unique model identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model description */
  description: string;
  /** Model provider (OpenAI, Stability AI, etc.) */
  provider: string;
  /** Model version */
  version: string;
  /** Current status */
  status: 'active' | 'maintenance' | 'deprecated';
  /** Premium model flag */
  isPremium: boolean;
  /** Supported features */
  features: ModelFeature[];
  /** Cost per generation */
  costPerGeneration: number;
  /** Maximum resolution */
  maxResolution: string;
  /** Supported aspect ratios */
  supportedAspectRatios: string[];
  /** Generation speed (seconds) */
  avgGenerationTime: number;
}

/**
 * Model Feature Capabilities
 */
export type ModelFeature = 
  | 'text-to-image'
  | 'image-to-image' 
  | 'inpainting'
  | 'outpainting'
  | 'upscaling'
  | 'style-transfer'
  | 'batch-generation'
  | 'custom-training';

/**
 * Style Preset Configuration
 */
export interface StylePreset {
  /** Unique style identifier */
  id: string;
  /** Display name */
  name: string;
  /** Style description */
  description: string;
  /** Style category */
  category: StyleCategory;
  /** Preview image URL */
  previewUrl: string;
  /** Style tags */
  tags: string[];
  /** Popularity score */
  popularity: number;
  /** Premium style flag */
  isPremium: boolean;
  /** Recommended settings */
  recommendedSettings?: {
    steps?: number;
    guidanceScale?: number;
    negativePrompt?: string;
  };
  /** Style-specific prompt enhancements */
  promptEnhancements?: string[];
}

/**
 * Style Categories
 */
export type StyleCategory =
  | 'photorealistic'
  | 'artistic'
  | 'anime'
  | 'digital-art'
  | 'concept-art'
  | 'portrait'
  | 'landscape'
  | 'abstract'
  | 'vintage'
  | 'minimalist'
  | 'cyberpunk'
  | 'fantasy'
  | 'sci-fi'
  | 'architecture'
  | 'fashion';

/**
 * Aspect Ratio Configuration
 */
export interface AspectRatio {
  /** Ratio value (e.g., "16:9") */
  value: string;
  /** Display label */
  label: string;
  /** Pixel dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** Usage category */
  category: 'square' | 'landscape' | 'portrait' | 'panoramic';
  /** Common use cases */
  useCases: string[];
}

/**
 * Quality Setting Configuration
 */
export interface QualitySetting {
  /** Quality level */
  level: number;
  /** Display label */
  label: string;
  /** Description */
  description: string;
  /** Estimated generation time multiplier */
  timeMultiplier: number;
  /** Cost multiplier */
  costMultiplier: number;
}

/**
 * Export Format Configuration
 */
export interface ExportFormat {
  /** Format identifier */
  id: string;
  /** Format name */
  name: string;
  /** File extension */
  extension: string;
  /** MIME type */
  mimeType: string;
  /** Supports transparency */
  supportsTransparency: boolean;
  /** Supports compression */
  supportsCompression: boolean;
  /** Maximum quality */
  maxQuality: number;
  /** Use cases */
  useCases: string[];
}

/**
 * Image Generation Request
 */
export interface ImageGenerationRequest {
  /** Primary prompt */
  prompt: string;
  /** Negative prompt (what to avoid) */
  negativePrompt?: string;
  /** Selected AI model */
  model: string;
  /** Style preset */
  style: string;
  /** Aspect ratio */
  aspectRatio: string;
  /** Quality level (0-100) */
  quality: number;
  /** Number of images to generate */
  batchCount: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Number of inference steps */
  steps?: number;
  /** Guidance scale */
  guidanceScale?: number;
  /** Custom width (overrides aspect ratio) */
  width?: number;
  /** Custom height (overrides aspect ratio) */
  height?: number;
  /** Request timestamp */
  timestamp: number;
  /** User ID */
  userId?: string;
  /** Session ID */
  sessionId?: string;
}

/**
 * Generated Image Result
 */
export interface GeneratedImage {
  /** Unique image identifier */
  id: string;
  /** Image URL */
  url: string;
  /** Thumbnail URL */
  thumbnailUrl: string;
  /** Original prompt */
  prompt: string;
  /** Model used */
  model: string;
  /** Style applied */
  style: string;
  /** Image dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** File size in bytes */
  fileSize: number;
  /** Generation timestamp */
  createdAt: number;
  /** Generation parameters */
  parameters: Partial<ImageGenerationRequest>;
  /** Download count */
  downloadCount: number;
  /** Like count */
  likeCount: number;
  /** User ratings */
  averageRating: number;
  /** Generation cost */
  cost: number;
  /** Status */
  status: ImageStatus;
  /** Error message if failed */
  error?: string;
  /** Enhancement history */
  enhancements?: ImageEnhancement[];
}

/**
 * Image Status Types
 */
export type ImageStatus = 
  | 'generating'
  | 'completed'
  | 'failed'
  | 'processing'
  | 'enhancing'
  | 'queued';

/**
 * Image Enhancement Configuration
 */
export interface ImageEnhancement {
  /** Enhancement type */
  type: EnhancementType;
  /** Enhancement timestamp */
  timestamp: number;
  /** Parameters used */
  parameters: Record<string, any>;
  /** Result URL */
  resultUrl: string;
  /** Processing time */
  processingTime: number;
}

/**
 * Enhancement Types
 */
export type EnhancementType = 
  | 'upscale'
  | 'super-resolution'
  | 'face-enhance'
  | 'color-correction'
  | 'noise-reduction'
  | 'style-transfer'
  | 'background-removal'
  | 'object-removal'
  | 'lighting-adjustment';

/**
 * Generation History Entry
 */
export interface GenerationHistoryEntry {
  /** Entry ID */
  id: string;
  /** Generation request */
  request: ImageGenerationRequest;
  /** Generated images */
  images: GeneratedImage[];
  /** Generation timestamp */
  timestamp: number;
  /** Total cost */
  totalCost: number;
  /** Total generation time */
  totalTime: number;
  /** Success rate */
  successRate: number;
  /** User rating */
  userRating?: number;
  /** User notes */
  notes?: string;
  /** Tags */
  tags: string[];
}

/**
 * Batch Generation Job
 */
export interface BatchGenerationJob {
  /** Job ID */
  id: string;
  /** Job name */
  name: string;
  /** Base request template */
  baseRequest: ImageGenerationRequest;
  /** Prompt variations */
  promptVariations: string[];
  /** Current status */
  status: BatchJobStatus;
  /** Progress (0-100) */
  progress: number;
  /** Completed images */
  completedImages: GeneratedImage[];
  /** Failed generations */
  failedGenerations: string[];
  /** Start time */
  startTime: number;
  /** End time */
  endTime?: number;
  /** Estimated completion time */
  estimatedCompletion?: number;
  /** Total cost */
  totalCost: number;
}

/**
 * Batch Job Status
 */
export type BatchJobStatus = 
  | 'queued'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Image Generation Statistics
 */
export interface GenerationStats {
  /** Total images generated */
  totalGenerated: number;
  /** Total cost spent */
  totalCost: number;
  /** Total time spent */
  totalTime: number;
  /** Favorite count */
  favoriteCount: number;
  /** Download count */
  downloadCount: number;
  /** Success rate */
  successRate: number;
  /** Most used model */
  mostUsedModel: string;
  /** Most used style */
  mostUsedStyle: string;
  /** Average quality setting */
  averageQuality: number;
  /** Recent activity */
  recentActivity: GenerationHistoryEntry[];
}

/**
 * User Preferences for Image Generation
 */
export interface ImageGenerationPreferences {
  /** Default model */
  defaultModel: string;
  /** Default style */
  defaultStyle: string;
  /** Default aspect ratio */
  defaultAspectRatio: string;
  /** Default quality */
  defaultQuality: number;
  /** Default batch size */
  defaultBatchSize: number;
  /** Auto-enhance prompts */
  autoEnhancePrompts: boolean;
  /** Save generation history */
  saveHistory: boolean;
  /** Auto-download results */
  autoDownload: boolean;
  /** Preferred export format */
  preferredExportFormat: string;
  /** NSFW content filter */
  nsfwFilter: boolean;
  /** Watermark preference */
  addWatermark: boolean;
  /** Custom negative prompts */
  customNegativePrompts: string[];
}

/**
 * Image Generation Error
 */
export interface GenerationError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error details */
  details?: Record<string, any>;
  /** Retry count */
  retryCount: number;
  /** Max retries */
  maxRetries: number;
  /** Is recoverable */
  isRecoverable: boolean;
  /** Suggested actions */
  suggestedActions: string[];
}

// Predefined Constants

/**
 * Available AI Models
 */
export const AI_MODELS: AIModel[] = [
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    description: 'OpenAI\'s latest image generation model with improved quality and prompt adherence',
    provider: 'OpenAI',
    version: '3.0',
    status: 'active',
    isPremium: true,
    features: ['text-to-image', 'batch-generation'],
    costPerGeneration: 0.040,
    maxResolution: '1024x1024',
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    avgGenerationTime: 15
  },
  {
    id: 'dall-e-2',
    name: 'DALL-E 2',
    description: 'OpenAI\'s versatile image generation model',
    provider: 'OpenAI',
    version: '2.0',
    status: 'active',
    isPremium: false,
    features: ['text-to-image', 'image-to-image', 'inpainting', 'batch-generation'],
    costPerGeneration: 0.020,
    maxResolution: '1024x1024',
    supportedAspectRatios: ['1:1'],
    avgGenerationTime: 12
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    description: 'High-resolution image generation with fine-tuned control',
    provider: 'Stability AI',
    version: '1.0',
    status: 'active',
    isPremium: false,
    features: ['text-to-image', 'image-to-image', 'inpainting', 'upscaling', 'batch-generation'],
    costPerGeneration: 0.015,
    maxResolution: '1024x1024',
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16', '3:2', '2:3'],
    avgGenerationTime: 8
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6',
    description: 'Artistic image generation with unique aesthetic styles',
    provider: 'Midjourney',
    version: '6.0',
    status: 'active',
    isPremium: true,
    features: ['text-to-image', 'style-transfer', 'upscaling', 'batch-generation'],
    costPerGeneration: 0.025,
    maxResolution: '2048x2048',
    supportedAspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2', '5:4', '4:5'],
    avgGenerationTime: 20
  }
];

/**
 * Style Presets
 */
export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'Realistic photography style with natural lighting',
    category: 'photorealistic',
    previewUrl: '/styles/photorealistic.jpg',
    tags: ['realistic', 'photography', 'natural'],
    popularity: 95,
    isPremium: false,
    recommendedSettings: {
      steps: 30,
      guidanceScale: 7.5,
      negativePrompt: 'blurry, low quality, distorted, cartoon, anime'
    },
    promptEnhancements: ['professional photography', 'high resolution', 'detailed', 'realistic lighting']
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Modern digital illustration style',
    category: 'digital-art',
    previewUrl: '/styles/digital-art.jpg',
    tags: ['digital', 'illustration', 'modern'],
    popularity: 88,
    isPremium: false,
    recommendedSettings: {
      steps: 25,
      guidanceScale: 8.0
    },
    promptEnhancements: ['digital art', 'vibrant colors', 'detailed illustration']
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese animation style artwork',
    category: 'anime',
    previewUrl: '/styles/anime.jpg',
    tags: ['anime', 'manga', 'japanese'],
    popularity: 92,
    isPremium: false,
    recommendedSettings: {
      steps: 28,
      guidanceScale: 7.0
    },
    promptEnhancements: ['anime style', 'manga art', 'detailed anime']
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classic oil painting artistic style',
    category: 'artistic',
    previewUrl: '/styles/oil-painting.jpg',
    tags: ['painting', 'artistic', 'classical'],
    popularity: 76,
    isPremium: true,
    recommendedSettings: {
      steps: 35,
      guidanceScale: 8.5
    },
    promptEnhancements: ['oil painting', 'brushstrokes', 'artistic masterpiece']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon-lit urban aesthetic',
    category: 'cyberpunk',
    previewUrl: '/styles/cyberpunk.jpg',
    tags: ['cyberpunk', 'futuristic', 'neon', 'sci-fi'],
    popularity: 84,
    isPremium: true,
    recommendedSettings: {
      steps: 30,
      guidanceScale: 9.0
    },
    promptEnhancements: ['cyberpunk style', 'neon lights', 'futuristic city', 'high-tech']
  }
];

/**
 * Aspect Ratios
 */
export const ASPECT_RATIOS: AspectRatio[] = [
  {
    value: '1:1',
    label: 'Square',
    dimensions: { width: 1024, height: 1024 },
    category: 'square',
    useCases: ['Social media posts', 'Profile pictures', 'Logos']
  },
  {
    value: '4:3',
    label: 'Classic',
    dimensions: { width: 1024, height: 768 },
    category: 'landscape',
    useCases: ['Traditional displays', 'Print media', 'Presentations']
  },
  {
    value: '3:4',
    label: 'Portrait',
    dimensions: { width: 768, height: 1024 },
    category: 'portrait',
    useCases: ['Mobile screens', 'Book covers', 'Posters']
  },
  {
    value: '16:9',
    label: 'Widescreen',
    dimensions: { width: 1024, height: 576 },
    category: 'landscape',
    useCases: ['YouTube thumbnails', 'Desktop wallpapers', 'TV displays']
  },
  {
    value: '9:16',
    label: 'Mobile',
    dimensions: { width: 576, height: 1024 },
    category: 'portrait',
    useCases: ['Instagram stories', 'TikTok videos', 'Mobile wallpapers']
  },
  {
    value: '3:2',
    label: 'Photo',
    dimensions: { width: 1024, height: 683 },
    category: 'landscape',
    useCases: ['Photography', 'Print photos', 'Camera formats']
  },
  {
    value: '2:3',
    label: 'Photo Portrait',
    dimensions: { width: 683, height: 1024 },
    category: 'portrait',
    useCases: ['Portrait photography', 'Book pages', 'Magazine covers']
  }
];

/**
 * Quality Settings
 */
export const QUALITY_SETTINGS: QualitySetting[] = [
  {
    level: 30,
    label: 'Draft',
    description: 'Quick generation for testing ideas',
    timeMultiplier: 0.5,
    costMultiplier: 0.5
  },
  {
    level: 50,
    label: 'Standard',
    description: 'Good quality for general use',
    timeMultiplier: 1.0,
    costMultiplier: 1.0
  },
  {
    level: 80,
    label: 'High',
    description: 'High quality for professional use',
    timeMultiplier: 1.5,
    costMultiplier: 1.5
  },
  {
    level: 100,
    label: 'Maximum',
    description: 'Highest quality for premium results',
    timeMultiplier: 2.0,
    costMultiplier: 2.0
  }
];

/**
 * Export Formats
 */
export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'png',
    name: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
    supportsTransparency: true,
    supportsCompression: false,
    maxQuality: 100,
    useCases: ['Web graphics', 'Logos', 'Images with transparency']
  },
  {
    id: 'jpg',
    name: 'JPEG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    supportsTransparency: false,
    supportsCompression: true,
    maxQuality: 100,
    useCases: ['Photography', 'Web optimization', 'Print media']
  },
  {
    id: 'webp',
    name: 'WebP',
    extension: 'webp',
    mimeType: 'image/webp',
    supportsTransparency: true,
    supportsCompression: true,
    maxQuality: 100,
    useCases: ['Modern web', 'Fast loading', 'Google services']
  },
  {
    id: 'svg',
    name: 'SVG',
    extension: 'svg',
    mimeType: 'image/svg+xml',
    supportsTransparency: true,
    supportsCompression: false,
    maxQuality: 100,
    useCases: ['Vector graphics', 'Scalable images', 'Icons']
  }
];