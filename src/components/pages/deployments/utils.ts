import { 
  CheckCircle2,
  XCircle,
  Loader2,
  Pause,
  Clock
} from 'lucide-react';
import { deploymentPlatforms } from '../../../data/constants';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'deployed': return 'text-green-500';
    case 'deploying': return 'text-yellow-500';
    case 'failed': return 'text-destructive';
    case 'paused': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'deployed': return CheckCircle2;
    case 'deploying': return Loader2;
    case 'failed': return XCircle;
    case 'paused': return Pause;
    default: return Clock;
  }
};

export const getPlatformIcon = (platform: string): string => {
  const platformData = deploymentPlatforms.find(p => 
    p.name.toLowerCase() === platform.toLowerCase()
  );
  return platformData?.icon || '🚀';
};

export const getStatusCardStyle = (status: string): string => {
  switch (status) {
    case 'deployed': 
      return 'border-green-500/50 bg-green-500/5';
    case 'failed': 
      return 'border-destructive/50 bg-destructive/5';
    case 'deploying':
      return 'border-yellow-500/50 bg-yellow-500/5';
    default: 
      return '';
  }
};

export const formatDeploymentTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getDeploymentProgress = (status: string): number => {
  switch (status) {
    case 'deploying': return Math.floor(Math.random() * 80) + 10; // 10-90%
    case 'deployed': return 100;
    case 'failed': return 0;
    default: return 0;
  }
};