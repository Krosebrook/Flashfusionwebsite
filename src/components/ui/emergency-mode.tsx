/**
 * FlashFusion Emergency Mode Component
 * Critical system failure recovery interface
 */

import React, { memo } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export const EmergencyMode = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="ff-card w-full max-w-md border-destructive/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <CardTitle className="ff-text-title text-destructive">System Resources Critical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="ff-text-caption">
          FlashFusion has detected critically low system resources and activated emergency mode.
        </p>
        <div className="space-y-2">
          <Button 
            onClick={() => {
              localStorage.removeItem('ff-emergency-mode');
              window.location.reload();
            }}
            className="ff-btn-primary w-full"
            variant="destructive"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="ff-btn-outline w-full"
          >
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
));

EmergencyMode.displayName = 'EmergencyMode';