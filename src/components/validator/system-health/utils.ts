import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Server,
  Monitor,
  Shield,
  Database,
  Wifi
} from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'excellent':
    case 'resolved':
      return CheckCircle;
    case 'warning':
    case 'good':
    case 'monitoring':
    case 'identified':
      return AlertTriangle;
    case 'critical':
    case 'poor':
    case 'investigating':
      return XCircle;
    default:
      return Activity;
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'performance':
      return TrendingUp;
    case 'infrastructure':
      return Server;
    case 'application':
      return Monitor;
    case 'security':
      return Shield;
    case 'user':
      return Activity;
    case 'frontend':
      return Monitor;
    case 'backend':
      return Server;
    case 'database':
      return Database;
    case 'network':
      return Wifi;
    case 'auth':
      return Shield;
    default:
      return Activity;
  }
};

export const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'stable':
      return Minus;
    default:
      return Activity;
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 95) return 'text-green-500';
  if (score >= 85) return 'text-yellow-500';
  if (score >= 70) return 'text-orange-500';
  return 'text-red-500';
};

export const getStatusIconProps = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'excellent':
    case 'resolved':
      return { className: "w-4 h-4 text-green-500" };
    case 'warning':
    case 'good':
    case 'monitoring':
    case 'identified':
      return { className: "w-4 h-4 text-yellow-500" };
    case 'critical':
    case 'poor':
    case 'investigating':
      return { className: "w-4 h-4 text-red-500" };
    default:
      return { className: "w-4 h-4 text-gray-500" };
  }
};

export const getCategoryIconProps = (category: string) => {
  return { className: "w-4 h-4" };
};

export const getTrendIconProps = (trend: string) => {
  switch (trend) {
    case 'up':
      return { className: "w-3 h-3 text-red-500" };
    case 'down':
      return { className: "w-3 h-3 text-green-500" };
    case 'stable':
      return { className: "w-3 h-3 text-gray-500" };
    default:
      return { className: "w-3 h-3 text-gray-500" };
  }
};