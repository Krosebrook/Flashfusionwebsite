/**
 * @fileoverview ContentAnalyzer - FlashFusion Feature Component
 * @version 1.0.0
 * @category analysis
 * 
 * A production-ready feature component following FlashFusion best practices.
 * Replace placeholders with your feature-specific implementation.
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles
} from 'lucide-react';

// Import feature-specific store
import { useFeatureStore } from '../stores/FeatureStore';

// Import feature service
import { FeatureService } from '../services/FeatureService';

// Import types
import type {
  FeatureData,
  FeatureConfig,
  FeatureResult,
  FeatureStatus
} from '../types/feature.types';

/**
 * Feature component props interface
 */
export interface FeatureTemplateProps {
  /**
   * Initial configuration for the feature
   */
  config?: Partial<FeatureConfig>;
  
  /**
   * Callback when feature completes successfully
   */
  onComplete?: (result: FeatureResult) => void;
  
  /**
   * Callback when feature encounters an error
   */
  onError?: (error: Error) => void;
  
  /**
   * Initial data to populate the feature with
   */
  initialData?: FeatureData;
  
  /**
   * Whether to show debug information
   */
  debug?: boolean;
  
  /**
   * Custom CSS class for the container
   */
  className?: string;
}

/**
 * Loading component displayed while feature initializes
 */
const FeatureLoading: React.FC = () => (
  <div 
    className="flex items-center justify-center py-12"
    role="status"
    aria-label="Loading feature"
  >
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--ff-primary)]" />
      <p className="text-[var(--ff-text-secondary)] text-sm">
        Initializing feature...
      </p>
    </div>
  </div>
);

/**
 * Error component displayed when feature encounters an error
 */
interface FeatureErrorProps {
  error: Error;
  onRetry?: () => void;
}

const FeatureError: React.FC<FeatureErrorProps> = ({ error, onRetry }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>{error.message}</span>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="ml-4"
        >
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

/**
 * Status badge component
 */
interface StatusBadgeProps {
  status: FeatureStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<FeatureStatus, { color: string; icon: React.ReactNode }> = {
    idle: { color: 'bg-gray-500', icon: <Info className="w-3 h-3" /> },
    loading: { color: 'bg-blue-500', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    processing: { color: 'bg-yellow-500', icon: <Sparkles className="w-3 h-3" /> },
    success: { color: 'bg-green-500', icon: <CheckCircle2 className="w-3 h-3" /> },
    error: { color: 'bg-red-500', icon: <AlertCircle className="w-3 h-3" /> }
  };

  const variant = variants[status] || variants.idle;

  return (
    <Badge className={`${variant.color} flex items-center gap-1`}>
      {variant.icon}
      {status.toUpperCase()}
    </Badge>
  );
};

/**
 * Main feature component
 * 
 * This is a production-ready template demonstrating:
 * - State management with Zustand
 * - Service layer integration
 * - Error handling and loading states
 * - Accessible UI components
 * - Performance optimizations
 * - TypeScript type safety
 * 
 * @example
 * ```tsx
 * <FeatureTemplate
 *   config={{ option1: true }}
 *   onComplete={(result) => console.log('Done!', result)}
 *   initialData={myData}
 * />
 * ```
 */
export const FeatureTemplate: React.FC<FeatureTemplateProps> = ({
  config = {},
  onComplete,
  onError,
  initialData,
  debug = false,
  className = ''
}) => {
  // Initialize feature service (singleton)
  const service = useMemo(() => FeatureService.getInstance(), []);
  
  // Local component state
  const [localInput, setLocalInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Global feature state from Zustand store
  const {
    data,
    status,
    error,
    result,
    initialize,
    processData,
    reset,
    updateConfig
  } = useFeatureStore();
  
  // Initialize feature on mount
  useEffect(() => {
    initialize(config, initialData);
    
    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [initialize, reset, config, initialData]);
  
  // Handle completion callback
  useEffect(() => {
    if (status === 'success' && result && onComplete) {
      onComplete(result);
    }
  }, [status, result, onComplete]);
  
  // Handle error callback
  useEffect(() => {
    if (status === 'error' && error && onError) {
      onError(error);
    }
  }, [status, error, onError]);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localInput.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process data through the service and store
      await processData({ input: localInput });
      
      // Clear input on success
      if (status === 'success') {
        setLocalInput('');
      }
    } catch (err) {
      console.error('Feature processing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [localInput, processData, status]);
  
  /**
   * Handle retry action
   */
  const handleRetry = useCallback(() => {
    reset();
    initialize(config, initialData);
  }, [reset, initialize, config, initialData]);
  
  /**
   * Memoized processing indicator
   */
  const isProcessing = useMemo(() => 
    status === 'loading' || status === 'processing' || isSubmitting,
    [status, isSubmitting]
  );
  
  return (
    <div className={`feature-template ${className}`}>
      <Card
        style={{
          backgroundColor: 'var(--ff-surface)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--ff-radius-lg)'
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle
                className="text-[var(--ff-text-primary)]"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-2xl)',
                  fontWeight: 'var(--ff-weight-bold)'
                }}
              >
                ContentAnalyzer
              </CardTitle>
              <CardDescription className="text-[var(--ff-text-secondary)]">
                AI-powered content analysis and insights
              </CardDescription>
            </div>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Display */}
          {status === 'error' && error && (
            <FeatureError error={error} onRetry={handleRetry} />
          )}
          
          {/* Success Display */}
          {status === 'success' && result && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Feature completed successfully! {result.message}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Main Feature UI */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="feature-input"
                className="text-sm font-medium text-[var(--ff-text-primary)]"
              >
                Input Data
              </label>
              <Input
                id="feature-input"
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Enter your input here..."
                disabled={isProcessing}
                className="bg-[var(--ff-bg-dark)] text-[var(--ff-text-primary)] border-[var(--ff-border)]"
                aria-label="Feature input field"
              />
            </div>
            
            {/* Data Display */}
            {data && (
              <div className="p-4 rounded-md bg-[var(--ff-bg-dark)] border border-[var(--ff-border)]">
                <h4 className="text-sm font-medium text-[var(--ff-text-primary)] mb-2">
                  Current Data:
                </h4>
                <pre className="text-xs text-[var(--ff-text-secondary)] overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isProcessing || !localInput.trim()}
                className="flex-1"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary), var(--ff-secondary))',
                  color: 'white'
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={isProcessing}
                className="border-[var(--ff-border)] text-[var(--ff-text-primary)]"
              >
                Reset
              </Button>
            </div>
          </form>
          
          {/* Debug Information */}
          {debug && (
            <details className="text-xs text-[var(--ff-text-secondary)]">
              <summary className="cursor-pointer hover:text-[var(--ff-text-primary)]">
                Debug Information
              </summary>
              <pre className="mt-2 p-2 bg-[var(--ff-bg-dark)] rounded overflow-auto">
                {JSON.stringify({ status, data, error: error?.message, result }, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Export memoized version for performance
export default React.memo(FeatureTemplate);
