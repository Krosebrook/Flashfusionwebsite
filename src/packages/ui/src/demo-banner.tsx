import React from 'react';
import { Info, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@flashfusion/utils';

interface DemoBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function DemoBanner({ onDismiss, className }: DemoBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <div className={cn(
      "bg-primary/10 border-b border-primary/20 text-primary",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4" />
            <span>
              You're viewing the FlashFusion demo. 
              <a href="#pricing" className="underline font-medium ml-1">
                Get started with full access
              </a>
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 hover:bg-primary/20"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Dismiss banner</span>
          </Button>
        </div>
      </div>
    </div>
  );
}