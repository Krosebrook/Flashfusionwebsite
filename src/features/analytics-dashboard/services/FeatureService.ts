/**
 * @fileoverview Service layer for AnalyticsDashboard
 * @version 1.0.0
 * 
 * Implements business logic, API integration, caching, and error handling.
 * Follows singleton pattern for consistency across the application.
 */

import type {
  FeatureData,
  FeatureConfig,
  FeatureResult,
  FeatureAPIRequest,
  FeatureAPIResponse,
  FeatureError,
  ValidationResult,
  ServiceOptions,
  CacheEntry
} from '../types/feature.types';

/**
 * Feature Service
 * 
 * Singleton service class that handles:
 * - API communication
 * - Data processing and transformation
 * - Caching strategies
 * - Error handling and retry logic
 * - Validation
 * 
 * @example
 * ```typescript
 * const service = FeatureService.getInstance();
 * const result = await service.processData(data, config);
 * ```
 */
export class FeatureService {
  private static instance: FeatureService;
  private cache: Map<string, CacheEntry<unknown>>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes default TTL
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.cache = new Map();
  }
  
  /**
   * Get singleton instance of FeatureService
   */
  public static getInstance(): FeatureService {
    if (!FeatureService.instance) {
      FeatureService.instance = new FeatureService();
    }
    return FeatureService.instance;
  }
  
  /**
   * Initialize feature with configuration
   * @param config - Feature configuration
   */
  public async initialize(config: Partial<FeatureConfig>): Promise<void> {
    try {
      // Perform any necessary initialization
      console.log('[FeatureService] Initializing with config:', config);
      
      // Could make an API call to register the feature
      // await this.makeAPIRequest('initialize', { config });
      
      // Validate configuration
      const validationResult = this.validateConfig(config);
      if (!validationResult.valid) {
        throw this.createError(
          'INVALID_CONFIG',
          'Configuration validation failed',
          { errors: validationResult.errors }
        );
      }
    } catch (error) {
      console.error('[FeatureService] Initialization error:', error);
      throw this.handleError(error);
    }
  }
  
  /**
   * Process data through the feature
   * 
   * @param data - Data to process
   * @param config - Feature configuration
   * @param options - Service options
   * @returns Processing result
   */
  public async processData(
    data: Partial<FeatureData>,
    config: FeatureConfig,
    options: ServiceOptions = {}
  ): Promise<FeatureResult> {
    const startTime = Date.now();
    
    try {
      // Validate input data
      const validationResult = this.validateData(data);
      if (!validationResult.valid) {
        throw this.createError(
          'INVALID_DATA',
          'Data validation failed',
          { errors: validationResult.errors }
        );
      }
      
      // Check cache if enabled
      if (config.enabled.caching && options.cache !== false) {
        const cacheKey = this.getCacheKey('process', data);
        const cachedResult = this.getFromCache<FeatureResult>(cacheKey);
        if (cachedResult) {
          console.log('[FeatureService] Cache hit for:', cacheKey);
          return cachedResult;
        }
      }
      
      // Perform actual processing
      const processedData = await this.performProcessing(data, config, options);
      
      // Create result object
      const result: FeatureResult = {
        success: true,
        message: 'Data processed successfully',
        data: processedData,
        metadata: {
          processingTime: Date.now() - startTime,
          completedAt: new Date(),
          operationCount: 1
        }
      };
      
      // Cache result if enabled
      if (config.enabled.caching) {
        const cacheKey = this.getCacheKey('process', data);
        this.setInCache(cacheKey, result);
      }
      
      // Track analytics if enabled
      if (config.enabled.analytics) {
        this.trackEvent('data_processed', {
          processingTime: result.metadata.processingTime,
          dataSize: JSON.stringify(data).length
        });
      }
      
      return result;
      
    } catch (error) {
      console.error('[FeatureService] Processing error:', error);
      throw this.handleError(error);
    }
  }
  
  /**
   * Perform the actual data processing logic
   * @private
   */
  private async performProcessing(
    data: Partial<FeatureData>,
    config: FeatureConfig,
    options: ServiceOptions
  ): Promise<FeatureData> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example processing: transform input to output
    const processedData: FeatureData = {
      id: this.generateId(),
      input: data.input || '',
      output: `Processed: ${data.input || 'No input'}`,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: data.metadata?.tags || ['processed']
      },
      properties: {
        ...data.properties,
        processedBy: 'FeatureService',
        timestamp: Date.now()
      }
    };
    
    // In a real implementation, this might:
    // - Make API calls
    // - Transform data
    // - Apply business rules
    // - Integrate with external services
    
    return processedData;
  }
  
  /**
   * Validate feature configuration
   * @private
   */
  private validateConfig(config: Partial<FeatureConfig>): ValidationResult {
    const errors: ValidationResult['errors'] = [];
    
    // Add validation logic
    if (config.settings) {
      if (config.settings.timeout && config.settings.timeout < 1000) {
        errors.push({
          field: 'settings.timeout',
          message: 'Timeout must be at least 1000ms',
          code: 'MIN_TIMEOUT'
        });
      }
      
      if (config.settings.retryAttempts && config.settings.retryAttempts < 0) {
        errors.push({
          field: 'settings.retryAttempts',
          message: 'Retry attempts must be non-negative',
          code: 'INVALID_RETRY_ATTEMPTS'
        });
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate input data
   * @private
   */
  private validateData(data: Partial<FeatureData>): ValidationResult {
    const errors: ValidationResult['errors'] = [];
    
    // Add validation logic
    if (!data.input || data.input.trim().length === 0) {
      errors.push({
        field: 'input',
        message: 'Input is required and cannot be empty',
        code: 'REQUIRED_FIELD'
      });
    }
    
    if (data.input && data.input.length > 10000) {
      errors.push({
        field: 'input',
        message: 'Input exceeds maximum length of 10000 characters',
        code: 'MAX_LENGTH_EXCEEDED'
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Make API request with retry logic
   * @private
   */
  private async makeAPIRequest<T = unknown>(
    action: string,
    payload: unknown,
    options: ServiceOptions = {}
  ): Promise<FeatureAPIResponse<T>> {
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // In a real implementation, this would make an actual API call
        const response: FeatureAPIResponse<T> = {
          success: true,
          data: payload as T,
          metadata: {
            requestId: this.generateId(),
            timestamp: new Date(),
            version: '1.0.0'
          }
        };
        
        return response;
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`[FeatureService] Retry attempt ${attempt + 1} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('API request failed');
  }
  
  /**
   * Cache management
   */
  private getCacheKey(operation: string, data: unknown): string {
    return `${operation}:${JSON.stringify(data)}`;
  }
  
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }
    
    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  private setInCache<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('[FeatureService] Cache cleared');
  }
  
  /**
   * Error handling utilities
   */
  private createError(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ): FeatureError {
    const error = new Error(message) as FeatureError;
    error.code = code;
    error.details = details;
    error.retryable = false;
    return error;
  }
  
  private handleError(error: unknown): FeatureError {
    if (this.isFeatureError(error)) {
      return error;
    }
    
    const featureError = new Error(
      error instanceof Error ? error.message : 'Unknown error occurred'
    ) as FeatureError;
    
    featureError.code = 'UNKNOWN_ERROR';
    featureError.retryable = true;
    featureError.details = { originalError: error };
    
    return featureError;
  }
  
  private isFeatureError(error: unknown): error is FeatureError {
    return (
      error instanceof Error &&
      'code' in error &&
      typeof (error as FeatureError).code === 'string'
    );
  }
  
  /**
   * Utility methods
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
  
  private trackEvent(event: string, properties: Record<string, unknown>): void {
    // In a real implementation, this would send to analytics service
    console.log('[FeatureService] Analytics event:', event, properties);
  }
  
  /**
   * Cleanup method (call on feature unmount)
   */
  public cleanup(): void {
    this.clearCache();
    console.log('[FeatureService] Cleanup completed');
  }
}

// Export singleton instance getter as default
export default FeatureService.getInstance;
