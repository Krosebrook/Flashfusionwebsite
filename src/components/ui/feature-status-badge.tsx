import React from 'react';
import { Badge } from './badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FeatureStatusBadgeProps {
  feature: string;
  status: 'working' | 'partial' | 'not-working' | 'testing';
  description?: string;
  className?: string;
}

export function FeatureStatusBadge({ 
  feature, 
  status, 
  description, 
  className = '' 
}: FeatureStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'working':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Functional',
          variant: 'default' as const,
          color: 'text-success'
        };
      case 'partial':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Partial',
          variant: 'secondary' as const,
          color: 'text-warning'
        };
      case 'not-working':
        return {
          icon: <XCircle className="h-3 w-3" />,
          text: 'Needs Work',
          variant: 'destructive' as const,
          color: 'text-destructive'
        };
      case 'testing':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Testing',
          variant: 'outline' as const,
          color: 'text-primary'
        };
      default:
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Unknown',
          variant: 'outline' as const,
          color: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium">{feature}:</span>
      <Badge variant={config.variant} className="flex items-center gap-1">
        <span className={config.color}>
          {config.icon}
        </span>
        {config.text}
      </Badge>
      {description && (
        <span className="text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </div>
  );
}

export default FeatureStatusBadge;