/**
 * FlashFusion Lite Mode Indicator
 * Shows when the app is running in optimized performance mode
 */

import React, { memo } from 'react';

export const LiteModeIndicator = memo(() => (
  <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg ff-fade-in-up">
    <div className="flex items-center space-x-2">
      <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span 
        className="ff-text-sm" 
        style={{ 
          fontFamily: 'var(--ff-font-primary)', 
          fontWeight: 'var(--ff-weight-medium)' 
        }}
      >
        Running in Lite Mode for optimal performance
      </span>
    </div>
  </div>
));

LiteModeIndicator.displayName = 'LiteModeIndicator';