/**
 * @fileoverview FlashFusion Error State Component (Simplified)
 * @chunk core
 * @category components
 * @version 1.1.0
 * @author FlashFusion Team
 * 
 * Simplified error state component with FlashFusion design system compliance.
 * Handles app initialization errors with recovery options.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { RefreshCw, AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Error state props interface (simplified)
 */
interface ErrorStateProps {
  /** Error message to display */
  error: string;
  /** Current app mode */
  mode?: string;
  /** Retry handler function */
  onRetry?: () => void;
  /** Page refresh handler */
  onRefresh?: () => void;
}

/**
 * FlashFusion Error State Component (Simplified)
 * 
 * Displays error information with recovery options.
 * Follows FlashFusion design system patterns and provides actionable solutions.
 * 
 * @param props - Error state configuration
 * @returns Error state JSX
 */
export function ErrorState({ 
  error, 
  mode = 'lite',
  onRetry,
  onRefresh = () => window.location.reload()
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full ff-fade-in-up">
        <Card className="ff-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--ff-warning)] to-[var(--ff-error)] rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="ff-text-title text-[var(--ff-text-primary)]">
                Initialization Issue
              </CardTitle>
              <p className="ff-text-body text-[var(--ff-text-secondary)]">
                FlashFusion encountered an issue during startup.
              </p>
              <Badge variant="outline" className="ff-badge-warning">
                Mode: {mode}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            <Card className="bg-[var(--ff-error)]/5 border-[var(--ff-error)]/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[var(--ff-error)] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="ff-text-sm font-semibold text-[var(--ff-error)] mb-1">
                      Error Details
                    </h4>
                    <p className="ff-text-sm text-[var(--ff-text-secondary)]">
                      {error}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="ff-btn-primary flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              
              <Button
                onClick={onRefresh}
                variant="outline"
                className="ff-btn-outline flex-1 sm:flex-initial"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="ff-text-xs text-[var(--ff-text-muted)]">
                If issues persist, try refreshing the page or clearing your browser cache.
                <br />
                FlashFusion is designed to work even with limited system resources.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}