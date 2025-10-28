import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@flashfusion/utils';

interface FullPageLoaderProps {
  message?: string;
  className?: string;
}

export function FullPageLoader({ message = "Loading...", className }: FullPageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'checking';
  className?: string;
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  if (status === 'connected') return null;

  const statusConfig = {
    connecting: {
      icon: Loader2,
      text: "Connecting...",
      color: "text-warning",
      animate: "animate-spin"
    },
    disconnected: {
      icon: WifiOff,
      text: "Connection lost",
      color: "text-destructive",
      animate: ""
    },
    checking: {
      icon: Wifi,
      text: "Checking connection...",
      color: "text-muted-foreground",
      animate: "animate-pulse"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border p-2 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center justify-center gap-2 text-sm">
        <Icon className={cn("h-4 w-4", config.color, config.animate)} />
        <span className={config.color}>{config.text}</span>
      </div>
    </div>
  );
}