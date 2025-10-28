/**
 * FlashFusion Loading Component
 * Enhanced loading component with branding and animations
 */

import React, { memo } from 'react';

interface FlashFusionLoaderProps {
  message?: string;
  detail?: string;
}

export const FlashFusionLoader = memo(({ 
  message = "FlashFusion AI Platform", 
  detail 
}: FlashFusionLoaderProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-6 max-w-md mx-auto p-8">
      {/* Animated FlashFusion logo */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 ff-pulse">
          <span 
            className="text-white font-bold text-2xl" 
            style={{ fontFamily: 'var(--ff-font-primary)' }}
          >
            FF
          </span>
        </div>
        <div className="absolute inset-0 w-20 h-20 border-2 border-primary/30 rounded-2xl mx-auto animate-spin"></div>
      </div>
      
      <div className="space-y-3">
        <h2 className="ff-text-title bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {message}
        </h2>
        {detail && (
          <p className="ff-text-caption">{detail}</p>
        )}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  </div>
));

FlashFusionLoader.displayName = 'FlashFusionLoader';