/**
 * @fileoverview Custom Hook for AI Image Generation
 * @chunk hooks
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * FLASHFUSION - IMAGE GENERATION HOOK
 * 
 * Comprehensive React hook for managing AI image generation state,
 * API calls, caching, and error handling with optimistic updates
 * and real-time progress tracking.
 * 
 * Features:
 * - Multi-model AI integration
 * - Real-time generation tracking
 * - Local caching and persistence
 * - Error recovery and retries
 * - Batch processing management
 * - Generation history tracking
 * 
 * @example
 * ```tsx
 * const {
 *   generateImages,
 *   generatedImages,
 *   isLoading,
 *   error
 * } = useImageGeneration();
 * 
 * const handleGenerate = async () => {
 *   const images = await generateImages({
 *     prompt: "A beautiful sunset",
 *     model: "dall-e-3",
 *     style: "photorealistic"
 *   });
 * }
 * ```
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';
import { 
  type ImageGenerationRequest,
  type GeneratedImage,
  type GenerationHistoryEntry,
  type BatchGenerationJob,
  type GenerationError,
  type ImageGenerationPreferences
} from '../types/image-generation';
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Hook Configuration Interface
 */
interface UseImageGenerationConfig {
  /** Maximum number of concurrent generations */
  maxConcurrent?: number;
  /** Enable automatic retry on failure */
  autoRetry?: boolean;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Cache generated images locally */
  enableCaching?: boolean;
  /** Save generation history */
  saveHistory?: boolean;
  /** User preferences */
  preferences?: Partial<ImageGenerationPreferences>;
}

/**
 * Hook Return Interface
 */
interface UseImageGenerationReturn {
  /** Generate images from request */
  generateImages: (request: ImageGenerationRequest) => Promise<GeneratedImage[]>;
  /** Currently generated images */
  generatedImages: GeneratedImage[];
  /** Generation history */
  generationHistory: GenerationHistoryEntry[];
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: GenerationError | null;
  /** Generation progress (0-100) */
  progress: number;
  /** Current batch job */
  currentJob: BatchGenerationJob | null;
  /** Generate batch of images */
  generateBatch: (requests: ImageGenerationRequest[]) => Promise<BatchGenerationJob>;
  /** Cancel current generation */
  cancelGeneration: () => void;
  /** Clear generation history */
  clearHistory: () => void;
  /** Retry failed generation */
  retryGeneration: (historyId: string) => Promise<GeneratedImage[]>;
  /** Get generation statistics */
  getStats: () => Promise<any>;
  /** Update user preferences */
  updatePreferences: (preferences: Partial<ImageGenerationPreferences>) => void;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: UseImageGenerationConfig = {
  maxConcurrent: 3,
  autoRetry: true,
  maxRetries: 3,
  enableCaching: true,
  saveHistory: true,
  preferences: {
    defaultModel: 'dall-e-3',
    defaultStyle: 'photorealistic',
    defaultAspectRatio: '1:1',
    defaultQuality: 80,
    autoEnhancePrompts: false,
    saveHistory: true,
    nsfwFilter: true
  }
};

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  GENERATED_IMAGES: 'ff_generated_images',
  GENERATION_HISTORY: 'ff_generation_history',
  USER_PREFERENCES: 'ff_image_preferences'
} as const;

/**
 * Custom hook for AI image generation management
 * 
 * Provides comprehensive image generation capabilities with state management,
 * error handling, progress tracking, and local persistence.
 * 
 * @param config - Configuration options for the hook
 * @returns Image generation interface and state
 * 
 * @example
 * ```tsx
 * function ImageGenerator() {
 *   const {
 *     generateImages,
 *     generatedImages,
 *     isLoading,
 *     error,
 *     progress
 *   } = useImageGeneration({
 *     maxConcurrent: 2,
 *     autoRetry: true,
 *     enableCaching: true
 *   });
 * 
 *   const handleGenerate = async () => {
 *     try {
 *       const images = await generateImages({
 *         prompt: "Beautiful landscape",
 *         model: "dall-e-3",
 *         style: "photorealistic",
 *         aspectRatio: "16:9",
 *         quality: 90,
 *         batchCount: 2
 *       });
 *       console.log('Generated:', images);
 *     } catch (err) {
 *       console.error('Generation failed:', err);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleGenerate} disabled={isLoading}>
 *         {isLoading ? `Generating... ${progress}%` : 'Generate Images'}
 *       </button>
 *       {error && <div>Error: {error.message}</div>}
 *       <div className="grid grid-cols-2 gap-4">
 *         {generatedImages.map(image => (
 *           <img key={image.id} src={image.url} alt={image.prompt} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useImageGeneration(config: UseImageGenerationConfig = {}): UseImageGenerationReturn {
  // Merge configuration with defaults
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Core state management
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<GenerationError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentJob, setCurrentJob] = useState<BatchGenerationJob | null>(null);
  const [preferences, setPreferences] = useState<ImageGenerationPreferences>(
    finalConfig.preferences as ImageGenerationPreferences
  );
  
  // Refs for cleanup and cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Load cached data from local storage on mount
   */
  useEffect(() => {
    if (finalConfig.enableCaching) {
      try {
        const cachedImages = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
        if (cachedImages) {
          setGeneratedImages(JSON.parse(cachedImages));
        }
        
        const cachedHistory = localStorage.getItem(STORAGE_KEYS.GENERATION_HISTORY);
        if (cachedHistory) {
          setGenerationHistory(JSON.parse(cachedHistory));
        }
        
        const cachedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (cachedPreferences) {
          setPreferences(prev => ({ ...prev, ...JSON.parse(cachedPreferences) }));
        }
      } catch (error) {
        console.warn('Failed to load cached image generation data:', error);
      }
    }
  }, [finalConfig.enableCaching]);
  
  /**
   * Save data to local storage when state changes
   */
  useEffect(() => {
    if (finalConfig.enableCaching && generatedImages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(generatedImages));
      } catch (error) {
        console.warn('Failed to cache generated images:', error);
      }
    }
  }, [generatedImages, finalConfig.enableCaching]);
  
  useEffect(() => {
    if (finalConfig.enableCaching && generationHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(generationHistory));
      } catch (error) {
        console.warn('Failed to cache generation history:', error);
      }
    }
  }, [generationHistory, finalConfig.enableCaching]);
  
  useEffect(() => {
    if (finalConfig.enableCaching) {
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      } catch (error) {
        console.warn('Failed to cache user preferences:', error);
      }
    }
  }, [preferences, finalConfig.enableCaching]);
  
  /**
   * Generate images using AI models
   */
  const generateImages = useCallback(async (request: ImageGenerationRequest): Promise<GeneratedImage[]> => {
    // Validate request
    if (!request.prompt?.trim()) {
      throw new Error('Prompt is required for image generation');
    }
    
    if (request.prompt.trim().length < 3) {
      throw new Error('Prompt must be at least 3 characters long');
    }
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    const startTime = Date.now();
    let images: GeneratedImage[] = [];
    
    try {
      // Enhance prompt if enabled
      let enhancedPrompt = request.prompt;
      if (preferences.autoEnhancePrompts) {
        enhancedPrompt = await enhancePromptWithAI(request.prompt);
      }
      
      // Apply NSFW filter if enabled
      if (preferences.nsfwFilter) {
        await validateContentSafety(enhancedPrompt);
      }
      
      const finalRequest = {
        ...request,
        prompt: enhancedPrompt,
        userId: request.userId || 'anonymous',
        sessionId: request.sessionId || generateSessionId()
      };
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10, 90));
      }, 500);
      
      // Make API call to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-88829a40/generate-images`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(finalRequest),
          signal: abortControllerRef.current.signal
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      images = result.images || [];
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Update state with new images
      setGeneratedImages(prev => [...images, ...prev]);
      
      // Add to history
      if (finalConfig.saveHistory) {
        const historyEntry: GenerationHistoryEntry = {
          id: generateId(),
          request: finalRequest,
          images,
          timestamp: Date.now(),
          totalCost: images.reduce((sum, img) => sum + (img.cost || 0), 0),
          totalTime: Date.now() - startTime,
          successRate: images.length / request.batchCount,
          tags: extractTagsFromPrompt(request.prompt)
        };
        
        setGenerationHistory(prev => [historyEntry, ...prev].slice(0, 100)); // Keep last 100 entries
      }
      
      return images;
      
    } catch (error) {
      console.error('Image generation failed:', error);
      
      const generationError: GenerationError = {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { request, timestamp: Date.now() },
        retryCount: 0,
        maxRetries: finalConfig.maxRetries || 3,
        isRecoverable: true,
        suggestedActions: [
          'Try a different prompt',
          'Reduce batch size',
          'Check your internet connection',
          'Try a different AI model'
        ]
      };
      
      setError(generationError);
      
      // Auto-retry if enabled
      if (finalConfig.autoRetry && generationError.retryCount < generationError.maxRetries) {
        console.log(`Retrying generation (attempt ${generationError.retryCount + 1}/${generationError.maxRetries})`);
        
        retryTimeoutRef.current = setTimeout(() => {
          generateImages({ ...request, timestamp: Date.now() });
        }, Math.pow(2, generationError.retryCount) * 1000); // Exponential backoff
        
        generationError.retryCount++;
      }
      
      throw generationError;
      
    } finally {
      setIsLoading(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  }, [preferences, finalConfig, projectId, publicAnonKey]);
  
  /**
   * Generate batch of images
   */
  const generateBatch = useCallback(async (requests: ImageGenerationRequest[]): Promise<BatchGenerationJob> => {
    const job: BatchGenerationJob = {
      id: generateId(),
      name: `Batch Generation ${new Date().toLocaleString()}`,
      baseRequest: requests[0],
      promptVariations: requests.map(r => r.prompt),
      status: 'queued',
      progress: 0,
      completedImages: [],
      failedGenerations: [],
      startTime: Date.now(),
      totalCost: 0
    };
    
    setCurrentJob(job);
    
    try {
      job.status = 'running';
      
      const results = await Promise.allSettled(
        requests.map(request => generateImages(request))
      );
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          job.completedImages.push(...result.value);
        } else {
          job.failedGenerations.push(requests[index].prompt);
        }
      });
      
      job.status = 'completed';
      job.endTime = Date.now();
      job.totalCost = job.completedImages.reduce((sum, img) => sum + (img.cost || 0), 0);
      
    } catch (error) {
      job.status = 'failed';
      job.endTime = Date.now();
    }
    
    setCurrentJob(job);
    return job;
  }, [generateImages]);
  
  /**
   * Cancel current generation
   */
  const cancelGeneration = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    setIsLoading(false);
    setProgress(0);
    setError(null);
    
    if (currentJob && currentJob.status === 'running') {
      setCurrentJob(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
    
    toast.info('Generation cancelled');
  }, [currentJob]);
  
  /**
   * Clear generation history
   */
  const clearHistory = useCallback((): void => {
    setGenerationHistory([]);
    if (finalConfig.enableCaching) {
      localStorage.removeItem(STORAGE_KEYS.GENERATION_HISTORY);
    }
    toast.success('Generation history cleared');
  }, [finalConfig.enableCaching]);
  
  /**
   * Retry failed generation from history
   */
  const retryGeneration = useCallback(async (historyId: string): Promise<GeneratedImage[]> => {
    const historyEntry = generationHistory.find(entry => entry.id === historyId);
    if (!historyEntry) {
      throw new Error('History entry not found');
    }
    
    return generateImages({
      ...historyEntry.request,
      timestamp: Date.now()
    });
  }, [generationHistory, generateImages]);
  
  /**
   * Get generation statistics
   */
  const getStats = useCallback(async () => {
    const totalGenerated = generationHistory.reduce((sum, entry) => sum + entry.images.length, 0);
    const totalCost = generationHistory.reduce((sum, entry) => sum + entry.totalCost, 0);
    const totalTime = generationHistory.reduce((sum, entry) => sum + entry.totalTime, 0);
    const successRate = generationHistory.length > 0 
      ? generationHistory.reduce((sum, entry) => sum + entry.successRate, 0) / generationHistory.length
      : 0;
    
    return {
      totalGenerated,
      totalCost,
      totalTime,
      successRate,
      historyCount: generationHistory.length,
      favoriteCount: generatedImages.filter(img => img.likeCount > 0).length,
      downloadCount: generatedImages.reduce((sum, img) => sum + img.downloadCount, 0)
    };
  }, [generationHistory, generatedImages]);
  
  /**
   * Update user preferences
   */
  const updatePreferences = useCallback((newPreferences: Partial<ImageGenerationPreferences>): void => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    toast.success('Preferences updated');
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    generateImages,
    generatedImages,
    generationHistory,
    isLoading,
    error,
    progress,
    currentJob,
    generateBatch,
    cancelGeneration,
    clearHistory,
    retryGeneration,
    getStats,
    updatePreferences
  };
}

/**
 * Utility Functions
 */

/**
 * Generate unique ID
 */
function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract tags from prompt
 */
function extractTagsFromPrompt(prompt: string): string[] {
  const commonWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const words = prompt.toLowerCase().split(/\s+/).filter(word => 
    word.length > 2 && !commonWords.has(word) && /^[a-zA-Z]+$/.test(word)
  );
  return [...new Set(words)].slice(0, 10); // Return unique words, max 10
}

/**
 * Enhance prompt with AI (placeholder - would call actual AI service)
 */
async function enhancePromptWithAI(prompt: string): Promise<string> {
  // This would call an AI service to enhance the prompt
  // For now, return the original prompt with some enhancements
  const enhancements = [
    'highly detailed',
    'professional quality',
    'vibrant colors',
    'sharp focus'
  ];
  
  return `${prompt}, ${enhancements.join(', ')}`;
}

/**
 * Validate content safety (placeholder - would call content moderation API)
 */
async function validateContentSafety(prompt: string): Promise<void> {
  // This would call a content moderation API
  // For now, just check for obvious inappropriate content
  const blockedTerms = ['nsfw', 'adult', 'explicit'];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const term of blockedTerms) {
    if (lowerPrompt.includes(term)) {
      throw new Error('Content does not meet our community guidelines');
    }
  }
}

export default useImageGeneration;