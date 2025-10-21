import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink,
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
  Package
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { APIKeyService, type APIProvider } from '../../services/APIKeyService';
import { IntegrationService, type IntegrationStatus } from '../../services/IntegrationService';

export function APIKeyManager() {
  const [keyStatus, setKeyStatus] = useState<Record<string, { available: boolean; required: boolean; description: string }>>({});
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadAPIKeyStatus();
  }, []);

  const loadAPIKeyStatus = async () => {
    try {
      setIsLoading(true);
      
      // Get API key status from our service
      const status = await APIKeyService.getKeyStatus();
      setKeyStatus(status);
      
      // Get integration statuses
      const integrations = await IntegrationService.getAllStatuses();
      setIntegrationStatuses(integrations);
      
    } catch (error) {
      console.error('Failed to load API key status:', error);
      toast.error('Failed to load API key configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      setIsRefreshing(true);
      await APIKeyService.refresh();
      await IntegrationService.refreshAllStatuses();
      await loadAPIKeyStatus();
      toast.success('API key status refreshed');
    } catch (error) {
      console.error('Failed to refresh status:', error);
      toast.error('Failed to refresh API key status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const testConnection = async (provider: APIProvider) => {
    try {
      toast.info('Testing connection...');
      const status = await IntegrationService.checkIntegration(provider);
      
      if (status.connected) {
        toast.success(`${provider} connection successful`);
      } else {
        toast.error(`${provider} connection failed: ${status.error || 'Unknown error'}`);
      }
      
      // Refresh status after test
      await loadAPIKeyStatus();
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
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
        return <Key className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (provider: APIProvider) => {
    const integration = integrationStatuses.find(i => i.provider === provider);
    const keyAvailable = keyStatus[provider]?.available;
    
    if (keyAvailable && integration?.connected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (keyAvailable && !integration?.connected) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (provider: APIProvider) => {
    const integration = integrationStatuses.find(i => i.provider === provider);
    const keyAvailable = keyStatus[provider]?.available;
    
    if (keyAvailable && integration?.connected) {
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    } else if (keyAvailable && !integration?.connected) {
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    } else {
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (provider: APIProvider) => {
    const integration = integrationStatuses.find(i => i.provider === provider);
    const keyAvailable = keyStatus[provider]?.available;
    
    if (keyAvailable && integration?.connected) {
      return 'Connected';
    } else if (keyAvailable && !integration?.connected) {
      return 'Key Present';
    } else {
      return 'Not Configured';
    }
  };

  const getDocumentationUrl = (provider: APIProvider): string => {
    const urls: Record<APIProvider, string> = {
      openai: 'https://platform.openai.com/docs',
      anthropic: 'https://docs.anthropic.com/',
      google: 'https://ai.google.dev/docs',
      github: 'https://docs.github.com/en/authentication',
      xai: 'https://docs.x.ai/',
      deepseek: 'https://api-docs.deepseek.com/',
      vercel: 'https://vercel.com/docs/rest-api',
      firecrawl: 'https://docs.firecrawl.dev/',
      leap: 'https://docs.tryleap.ai/',
      openrouter: 'https://openrouter.ai/docs',
      notion: 'https://developers.notion.com/',
      printify: 'https://developers.printify.com/',
      elevenlabs: 'https://docs.elevenlabs.io/',
      stripe: 'https://stripe.com/docs/api',
      gemini: 'https://ai.google.dev/docs'
    };
    return urls[provider] || '#';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 ff-stagger-fade">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading API configurations from Supabase...</p>
        </div>
      </div>
    );
  }

  const requiredKeys = Object.entries(keyStatus).filter(([_, config]) => config.required);
  const optionalKeys = Object.entries(keyStatus).filter(([_, config]) => !config.required);
  const activeCount = Object.entries(keyStatus).filter(([_, config]) => config.available).length;
  const connectedCount = integrationStatuses.filter(status => status.connected).length;

  return (
    <div className="space-y-6 ff-stagger-fade">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-gradient mb-2 text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">
            Manage your API keys and service integrations. All keys are securely stored in Supabase.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshStatus}
          disabled={isRefreshing}
          className="ff-hover-scale"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Keys</p>
                <p className="text-2xl font-bold">{Object.keys(keyStatus).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Available</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-2xl font-bold">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Security</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="required" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="required" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Required Keys ({requiredKeys.length})
          </TabsTrigger>
          <TabsTrigger value="optional" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Optional Keys ({optionalKeys.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              These API keys are required for core FlashFusion functionality. 
              Some features may not work without them.
            </AlertDescription>
          </Alert>

          {requiredKeys.map(([provider, config]) => (
            <Card key={provider} className="ff-card-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(provider as APIProvider)}
                      {getStatusIcon(provider as APIProvider)}
                      <CardTitle className="text-lg capitalize">{provider}</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(provider as APIProvider)}
                    >
                      {getStatusText(provider as APIProvider)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(getDocumentationUrl(provider as APIProvider), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testConnection(provider as APIProvider)}
                      disabled={!config.available}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Status:</span>
                  <span className={`${config.available ? 'text-green-500' : 'text-gray-500'}`}>
                    {config.available ? 'Configured in Supabase' : 'Not configured'}
                  </span>
                </div>

                {integrationStatuses.find(i => i.provider === provider as APIProvider)?.error && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
                    Error: {integrationStatuses.find(i => i.provider === provider as APIProvider)?.error}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="optional" className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              These API keys unlock additional features and integrations. 
              FlashFusion works without them, but you'll have access to more capabilities with them configured.
            </AlertDescription>
          </Alert>

          {optionalKeys.map(([provider, config]) => (
            <Card key={provider} className="ff-card-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(provider as APIProvider)}
                      {getStatusIcon(provider as APIProvider)}
                      <CardTitle className="text-lg capitalize">{provider}</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(provider as APIProvider)}
                    >
                      {getStatusText(provider as APIProvider)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(getDocumentationUrl(provider as APIProvider), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testConnection(provider as APIProvider)}
                      disabled={!config.available}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Status:</span>
                  <span className={`${config.available ? 'text-green-500' : 'text-gray-500'}`}>
                    {config.available ? 'Configured in Supabase' : 'Not configured'}
                  </span>
                </div>

                {integrationStatuses.find(i => i.provider === provider as APIProvider)?.error && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
                    Error: {integrationStatuses.find(i => i.provider === provider as APIProvider)?.error}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <Card className="ff-card-interactive bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Security Information</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• All API keys are encrypted and stored securely in Supabase environment variables</p>
                <p>• Keys are never exposed in client-side code or logs</p>
                <p>• Server-side functions access keys from secure environment variables</p>
                <p>• Regular key rotation and monitoring is recommended</p>
                <p>• Connection tests validate key functionality without exposing values</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status Summary */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Integration Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {integrationStatuses.map((status) => (
              <div key={status.provider} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                <div className="flex items-center gap-2">
                  {getProviderIcon(status.provider)}
                  <span className="capitalize font-medium">{status.provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  {status.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {new Date(status.lastChecked).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}