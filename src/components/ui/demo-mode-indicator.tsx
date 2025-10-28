import React, { useState, useEffect } from 'react';
import { Badge } from './badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from './alert';

interface DemoModeIndicatorProps {
  className?: string;
}

export function DemoModeIndicator({ className = '' }: DemoModeIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode by testing gamification
    const checkDemoMode = async () => {
      try {
        // Check if gamification is working in offline mode
        const isOffline = !localStorage.getItem('ff_database_connected');
        setShowIndicator(isOffline);
      } catch (error) {
        setShowIndicator(true);
      }
    };

    checkDemoMode();
  }, []);

  if (!showIndicator) {
    return null;
  }

  return (
    <Alert className={`max-w-md ${className}`}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Demo Mode
          </Badge>
          <span className="text-sm">
            Running with local storage. All features work normally!
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default DemoModeIndicator;