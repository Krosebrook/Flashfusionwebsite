/**
 * @fileoverview {{FEATURE_NAME}} - FlashFusion Tool Component
 * @version 1.0.0
 * @category {{FEATURE_CATEGORY}}
 * @type tool
 * 
 * A production-ready tool component optimized for interactive processing,
 * AI integration, and real-time user interactions.
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  Settings,
  Info
} from 'lucide-react';

// Import tool-specific store
import { useFeatureStore } from '../stores/FeatureStore';

// Import tool service
import { FeatureService } from '../services/FeatureService';

// Import types
import type {
  FeatureData,
  FeatureConfig,
  FeatureResult,
  FeatureStatus,
  ProcessingOptions
} from '../types/feature.types';

/**
 * Tool component props interface
 */
export interface FeatureToolProps {
  /**
   * Initial configuration for the tool
   */
  config?: Partial<FeatureConfig>;
  
  /**
   * Callback when tool completes processing
   */
  onComplete?: (result: FeatureResult) => void;
  
  /**
   * Callback when tool encounters an error
   */
  onError?: (error: Error) => void;
  
  /**
   * Initial input data
   */
  initialInput?: string;
  
  /**
   * Enable/disable export functionality
   */
  enableExport?: boolean;
  
  /**
   * Enable/disable copy functionality
   */
  enableCopy?: boolean;
  
  /**
   * Show advanced options
   */
  showAdvancedOptions?: boolean;
  
  /**
   * Custom CSS class for the container
   */
  className?: string;
}

/**
 * Loading component displayed during processing
 */
const ToolLoading: React.FC<{ message?: string }> = ({ message = 'Processing...' }) => (
  <div 
    className="flex flex-col items-center justify-center py-12 space-y-4"
    role="status"
    aria-label="Processing"
  >
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

/**
 * Error component displayed when processing fails
 */
const ToolError: React.FC<{ 
  error: Error; 
  onRetry?: () => void;
  onDismiss?: () => void;
}> = ({ error, onRetry, onDismiss }) => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="ml-2">
      <div className="flex flex-col space-y-2">
        <p className="font-medium">Processing Error</p>
        <p className="text-sm">{error.message}</p>
        <div className="flex gap-2 mt-2">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </AlertDescription>
  </Alert>
);

/**
 * Success component displayed when processing completes
 */
const ToolSuccess: React.FC<{ message?: string }> = ({ 
  message = 'Processing completed successfully!' 
}) => (
  <Alert className="my-4 border-green-500 bg-green-50 dark:bg-green-950">
    <CheckCircle2 className="h-4 w-4 text-green-600" />
    <AlertDescription className="ml-2 text-green-800 dark:text-green-200">
      {message}
    </AlertDescription>
  </Alert>
);

/**
 * {{FEATURE_NAME}} Tool Component
 * 
 * Interactive tool for {{FEATURE_DESCRIPTION}}
 * 
 * Features:
 * - Real-time processing
 * - Export/download results
 * - Copy to clipboard
 * - Advanced configuration options
 * - AI-powered processing (if applicable)
 * 
 * @example
 * ```tsx
 * <{{FEATURE_NAME}}Tool
 *   config={{ settings: { quality: 'high' } }}
 *   onComplete={(result) => console.log('Done:', result)}
 *   enableExport={true}
 * />
 * ```
 */
export const {{FEATURE_NAME}}Tool: React.FC<FeatureToolProps> = ({
  config,
  onComplete,
  onError,
  initialInput = '',
  enableExport = true,
  enableCopy = true,
  showAdvancedOptions = false,
  className = ''
}) => {
  // Get service instance
  const service = useMemo(() => FeatureService.getInstance(), []);
  
  // Local component state
  const [input, setInput] = useState(initialInput);
  const [activeTab, setActiveTab] = useState('input');
  const [showAdvanced, setShowAdvanced] = useState(showAdvancedOptions);
  
  // Store state and actions
  const {
    data,
    status,
    error,
    result,
    config: storeConfig,
    processData,
    updateConfig,
    clearError,
    reset
  } = useFeatureStore();
  
  /**
   * Initialize tool with configuration
   */
  useEffect(() => {
    if (config) {
      updateConfig(config);
    }
  }, [config, updateConfig]);
  
  /**
   * Handle processing completion
   */
  useEffect(() => {
    if (status === 'success' && result && onComplete) {
      onComplete(result);
    }
  }, [status, result, onComplete]);
  
  /**
   * Handle processing errors
   */
  useEffect(() => {
    if (error && onError) {
      onError(new Error(error.message));
    }
  }, [error, onError]);
  
  /**
   * Process input data
   */
  const handleProcess = useCallback(async () => {
    if (!input.trim()) {
      return;
    }
    
    try {
      setActiveTab('output');
      await processData({
        id: crypto.randomUUID(),
        input: input.trim(),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          tags: []
        }
      });
    } catch (err) {
      console.error('Processing failed:', err);
    }
  }, [input, processData]);
  
  /**
   * Copy result to clipboard
   */
  const handleCopy = useCallback(async () => {
    if (!result?.output) return;
    
    try {
      await navigator.clipboard.writeText(result.output);
      // Could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [result]);
  
  /**
   * Download result as file
   */
  const handleDownload = useCallback(() => {
    if (!result?.output) return;
    
    const blob = new Blob([result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `{{FEATURE_NAME}}-result-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result]);
  
  /**
   * Handle retry after error
   */
  const handleRetry = useCallback(() => {
    clearError();
    handleProcess();
  }, [clearError, handleProcess]);
  
  /**
   * Reset tool to initial state
   */
  const handleReset = useCallback(() => {
    reset();
    setInput(initialInput);
    setActiveTab('input');
  }, [reset, initialInput]);
  
  // Compute whether processing can be started
  const canProcess = useMemo(() => {
    return input.trim().length > 0 && status !== 'processing';
  }, [input, status]);
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>{{FEATURE_NAME}}</CardTitle>
            <Badge variant="secondary">Tool</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            {showAdvanced ? 'Hide' : 'Show'} Options
          </Button>
        </div>
        <CardDescription>
          {{FEATURE_DESCRIPTION}}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            {/* Input Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Data</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
                className="min-h-[200px] font-mono text-sm"
                disabled={status === 'processing'}
              />
            </div>
            
            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4" />
                  Advanced Options
                </div>
                {/* Add your advanced options here */}
                <p className="text-sm text-muted-foreground">
                  Configure advanced processing options here...
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleProcess}
                disabled={!canProcess}
                className="gap-2"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Process
                  </>
                )}
              </Button>
              
              {(status === 'success' || status === 'error') && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            {/* Processing State */}
            {status === 'processing' && (
              <ToolLoading message="Processing your input..." />
            )}
            
            {/* Error State */}
            {error && (
              <ToolError
                error={new Error(error.message)}
                onRetry={handleRetry}
                onDismiss={clearError}
              />
            )}
            
            {/* Success State */}
            {status === 'success' && result && (
              <>
                <ToolSuccess message="Processing completed!" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Result</label>
                    <div className="flex gap-2">
                      {enableCopy && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopy}
                          className="gap-2"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      )}
                      {enableExport && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDownload}
                          className="gap-2"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-muted/50 min-h-[200px]">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                      {result.output || 'No output generated'}
                    </pre>
                  </div>
                </div>
                
                {/* Result Metadata */}
                {result.metadata && (
                  <div className="p-3 border rounded-lg bg-background text-xs space-y-1">
                    <div className="flex items-center gap-2 font-medium mb-2">
                      <Info className="h-3 w-3" />
                      Processing Information
                    </div>
                    {result.metadata.processingTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span>{result.metadata.processingTime}ms</span>
                      </div>
                    )}
                    {result.metadata.tokensUsed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tokens Used:</span>
                        <span>{result.metadata.tokensUsed}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Idle State */}
            {status === 'idle' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Enter your input and click Process to get started
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Export as default
export default {{FEATURE_NAME}}Tool;
