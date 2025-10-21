import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Shield,
  Zap,
  Database,
  Cloud,
  Brain,
  Code,
  CreditCard,
  Palette,
  Globe,
  Users,
  Package,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { APIKeyService, type APIProvider } from '../../services/APIKeyService';
import { IntegrationService, type IntegrationStatus } from '../../services/IntegrationService';

interface ServiceHealth {
  category: string;
  services: IntegrationStatus[];
  healthScore: number;
  color: string;
}

export function IntegrationStatusDashboard() {
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatus[]>([]);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    loadIntegrationStatuses();
  }, []);

  const loadIntegrationStatuses = async () => {
    try {
      setIsLoading(true);
      
      // Get all integration statuses
      const statuses = await IntegrationService.getAllStatuses();
      setIntegrationStatuses(statuses);
      
      // Calculate service health by category
      const healthByCategory = calculateServiceHealth(statuses);
      setServiceHealth(healthByCategory);
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load integration statuses:', error);
      toast.error('Failed to load integration statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllStatuses = async () => {
    try {
      setIsRefreshing(true);
      toast.info('Refreshing all integration statuses...');
      
      await IntegrationService.refreshAllStatuses();
      await loadIntegrationStatuses();
      
      toast.success('All integration statuses refreshed');
    } catch (error) {
      console.error('Failed to refresh statuses:', error);
      toast.error('Failed to refresh integration statuses');
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateServiceHealth = (statuses: IntegrationStatus[]): ServiceHealth[] => {
    const categories = {
      'AI Models': {
        providers: ['openai', 'anthropic', 'google', 'xai', 'deepseek'],
        color: '#FF7B00'
      },
      'Development': {
        providers: ['github', 'vercel'],
        color: '#00B4D8'
      },
      'Content & Media': {
        providers: ['firecrawl', 'notion', 'leap', 'elevenlabs'],
        color: '#E91E63'
      },
      'E-commerce': {
        providers: ['stripe', 'printify'],
        color: '#10B981'
      },
      'Automation': {
        providers: ['openrouter'],
        color: '#8B5CF6'
      }
    };

    return Object.entries(categories).map(([category, config]) => {
      const categoryStatuses = statuses.filter(status => 
        config.providers.includes(status.provider)
      );
      
      const connectedCount = categoryStatuses.filter(status => status.connected).length;
      const healthScore = categoryStatuses.length > 0 
        ? Math.round((connectedCount / categoryStatuses.length) * 100)
        : 0;

      return {
        category,
        services: categoryStatuses,
        healthScore,
        color: config.color
      };
    });
  };

  const getProviderIcon = (provider: APIProvider) => {
    switch (provider) {
      case 'openai':
      case 'anthropic':
      case 'google':
      case 'xai':
      case 'deepseek':
        return <Brain className="h-4 w-4" />;
      case 'github':
        return <Code className="h-4 w-4" />;
      case 'vercel':
        return <Cloud className="h-4 w-4" />;
      case 'stripe':
        return <CreditCard className="h-4 w-4" />;
      case 'notion':
        return <Database className="h-4 w-4" />;
      case 'leap':
      case 'elevenlabs':
        return <Palette className="h-4 w-4" />;
      case 'firecrawl':
        return <Globe className="h-4 w-4" />;
      case 'printify':
        return <Package className="h-4 w-4" />;
      case 'openrouter':
        return <Users className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    if (status.connected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const overallHealth = serviceHealth.length > 0 
    ? Math.round(serviceHealth.reduce((acc, health) => acc + health.healthScore, 0) / serviceHealth.length)
    : 0;

  const totalServices = integrationStatuses.length;
  const connectedServices = integrationStatuses.filter(status => status.connected).length;
  const errorServices = integrationStatuses.filter(status => status.error && !status.connected).length;

  if (isLoading) {
    return (
      <div className="space-y-6 ff-stagger-fade">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading integration statuses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-gradient mb-2 text-2xl font-bold">Integration Status Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor the health and connectivity of all FlashFusion integrations and services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={refreshAllStatuses}
            disabled={isRefreshing}
            className="ff-hover-scale"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getHealthScoreColor(overallHealth)}`}>
                {overallHealth}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Health</p>
              <Progress value={overallHealth} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-primary">
                {totalServices}
              </div>
              <p className="text-sm text-muted-foreground">Total Services</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-green-500">
                {connectedServices}
              </div>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-red-500">
                {errorServices}
              </div>
              <p className="text-sm text-muted-foreground">With Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Health by Category */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {serviceHealth.map((health, index) => (
          <Card key={health.category} className="ff-card-interactive">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{health.category}</span>
                <Badge 
                  variant="outline" 
                  className={`${getHealthScoreColor(health.healthScore)} border-current`}
                >
                  {health.healthScore}%
                </Badge>
              </CardTitle>
              <Progress 
                value={health.healthScore} 
                className="mt-2"
                style={{ 
                  '--progress-color': health.color 
                } as React.CSSProperties}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              {health.services.map((service) => (
                <div key={service.provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getProviderIcon(service.provider)}
                    <span className="capitalize text-sm font-medium">{service.provider}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(service.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Status List */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Detailed Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrationStatuses.map((status) => (
              <div key={status.provider} className="flex items-center justify-between p-3 border border-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getProviderIcon(status.provider)}
                  <div>
                    <div className="font-medium capitalize">{status.provider}</div>
                    <div className="text-sm text-muted-foreground">
                      Last checked: {new Date(status.lastChecked).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {status.error && (
                    <div className="text-sm text-red-500 max-w-xs truncate">
                      {status.error}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <Badge 
                      variant={status.connected ? "default" : "destructive"}
                      className={status.connected ? "bg-green-500" : ""}
                    >
                      {status.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => IntegrationService.checkIntegration(status.provider).then(() => loadIntegrationStatuses())}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      {errorServices > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Action Required:</strong> {errorServices} service{errorServices > 1 ? 's' : ''} 
            {errorServices > 1 ? ' have' : ' has'} connection issues. Check your API keys and network connectivity.
          </AlertDescription>
        </Alert>
      )}

      {overallHealth < 70 && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Performance Notice:</strong> System health is at {overallHealth}%. 
            Consider reviewing your integration configurations to improve performance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}