import React from 'react';
import { Loader2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { cn } from './utils';

interface FullPageLoaderProps {
  message?: string;
  className?: string;
}

export function FullPageLoader({ message = "Loading...", className }: FullPageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary/40 animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

interface ConnectionStatusProps {
  status: 'online' | 'offline' | 'checking';
  className?: string;
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  if (status === 'online') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'offline':
        return {
          icon: WifiOff,
          message: 'No internet connection',
          bgColor: 'bg-destructive/90',
          textColor: 'text-destructive-foreground'
        };
      case 'checking':
        return {
          icon: Wifi,
          message: 'Checking connection...',
          bgColor: 'bg-warning/90',
          textColor: 'text-warning-foreground'
        };
      default:
        return {
          icon: AlertTriangle,
          message: 'Connection status unknown',
          bgColor: 'bg-muted/90',
          textColor: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 p-2 backdrop-blur-sm",
      config.bgColor,
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <IconComponent className={cn("h-4 w-4", config.textColor)} />
        <span className={cn("text-sm font-medium", config.textColor)}>
          {config.message}
        </span>
        {status === 'checking' && (
          <Loader2 className={cn("h-3 w-3 animate-spin", config.textColor)} />
        )}
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  label = "Loading" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded",
            i === lines - 1 && lines > 1 && "w-3/4", // Last line shorter
            className
          )}
        />
      ))}
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ 
  title = "Loading content...", 
  description,
  className 
}: LoadingCardProps) {
  return (
    <div className={cn(
      "p-6 border rounded-lg bg-card text-card-foreground space-y-4",
      className
    )}>
      <div className="flex items-center gap-3">
        <LoadingSpinner size="sm" />
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  );
}

interface ProgressLoaderProps {
  progress: number;
  message?: string;
  className?: string;
}

export function ProgressLoader({ 
  progress, 
  message = "Loading...", 
  className 
}: ProgressLoaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="ff-progress-bar h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Loading states for specific use cases
export function TableLoadingState({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardGridLoadingState({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}

// Default export for main component
export default FullPageLoader;