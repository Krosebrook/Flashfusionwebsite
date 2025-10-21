/**
 * @fileoverview FlashFusion Loading State Component
 * @chunk core
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Loading state component with FlashFusion design system compliance.
 * Shows branded loading animation and system status information.
 */

import React from 'react';
import { FlashFusionLoader } from '../../ui/flash-fusion-loader';

/**
 * Loading state props interface
 */
interface LoadingStateProps {
  /** Loading message to display */
  message?: string;
  /** Additional detail text */
  detail?: string;
  /** Whether recovery mode is active */
  isRecovering?: boolean;
  /** Current retry count for recovery */
  retryCount?: number;
}

/**
 * FlashFusion Loading State Component
 * 
 * Displays a branded loading screen with progress indicators
 * and system status information during app initialization.
 * 
 * @param props - Loading state configuration
 * @returns Loading state JSX
 */
export function LoadingState({ 
  message = "FlashFusion AI Platform",
  detail,
  isRecovering = false,
  retryCount = 0 
}: LoadingStateProps) {
  const loadingDetail = detail || 
    (isRecovering 
      ? `Recovering system... (Attempt ${retryCount}/3)`
      : "Initializing intelligent development environment..."
    );

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center ff-fade-in-up">
      <FlashFusionLoader 
        message={message}
        detail={loadingDetail}
      />
    </div>
  );
}