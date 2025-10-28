export interface SystemMetric {
  id: string;
  name: string;
  category: 'performance' | 'infrastructure' | 'application' | 'security' | 'user';
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  description: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  service: string;
  message: string;
  stackTrace?: string;
  userId?: string;
  sessionId?: string;
  count: number;
  resolved: boolean;
  category: 'frontend' | 'backend' | 'database' | 'network' | 'auth';
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  benchmark: number;
  status: 'excellent' | 'good' | 'poor';
  impact: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedServices: string[];
  startTime: string;
  resolvedTime?: string;
  description: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  message: string;
  status: string;
}

export interface HealthScore {
  overall: number;
  performance: number;
  infrastructure: number;
  application: number;
  security: number;
  user: number;
}