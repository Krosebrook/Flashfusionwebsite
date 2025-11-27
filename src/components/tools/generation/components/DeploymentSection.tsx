import React, { useState, useCallback } from 'react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Separator } from '../../../ui/separator';
import { 
  CloudUpload, 
  ExternalLink, 
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Globe,
  Server,
  Database,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import type { GeneratedApp } from '../../../../types/full-stack-builder';
import { deployProject, deploymentService } from '../../../../services/deployment';
import type { DeploymentResult, DeploymentStatus } from '../../../../services/deployment';

interface DeploymentSectionProps {
  generatedApp: GeneratedApp;
}

const DEPLOYMENT_PLATFORMS = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deploy frontend with serverless functions',
    icon: '▲',
    color: 'text-black dark:text-white',
    recommended: true,
    requiresApiKey: true
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Static site hosting with edge functions',
    icon: '🌍',
    color: 'text-blue-600',
    requiresApiKey: true
  },
  {
    id: 'railway',
    name: 'Railway',
    description: 'Modern full-stack hosting',
    icon: '🚄',
    color: 'text-purple-500',
    requiresApiKey: true
  },
  {
    id: 'render',
    name: 'Render',
    description: 'Full-stack application deployment',
    icon: '🔧',
    color: 'text-green-600',
    requiresApiKey: true
  }
];

export function DeploymentSection({ generatedApp }: DeploymentSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('vercel');
  const [apiKey, setApiKey] = useState('');
  const [deploymentConfig, setDeploymentConfig] = useState({
    envVars: {} as Record<string, string>,
    buildCommand: 'npm run build',
    outputDir: generatedApp.stack.frontend === 'nextjs' ? '.next' : 'build',
    nodeVersion: '18'
  });
  const [deployments, setDeployments] = useState<Array<DeploymentResult & { createdAt: string }>>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<Record<string, DeploymentStatus>>({});

  const handleDeploy = useCallback(async () => {
    const platform = DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform);
    
    if (!platform) {
      toast.error('Please select a deployment platform');
      return;
    }

    if (platform.requiresApiKey && !apiKey.trim()) {
      toast.error(`${platform.name} API key is required`);
      return;
    }

    setIsDeploying(true);
    
    try {
      toast.info(`Starting deployment to ${platform.name}...`);
      
      // Deploy using real deployment service
      const result = await deployProject(generatedApp, selectedPlatform as any, {
        apiKey: apiKey.trim(),
        environmentVariables: deploymentConfig.envVars,
        buildCommand: deploymentConfig.buildCommand,
        outputDirectory: deploymentConfig.outputDir,
        nodeVersion: deploymentConfig.nodeVersion
      });
      
      // Add to deployments list
      const newDeployment = {
        ...result,
        createdAt: new Date().toISOString()
      };
      
      setDeployments(prev => [newDeployment, ...prev]);
      
      // Start polling for status updates
      if (result.status === 'deploying') {
        pollDeploymentStatus(result.id, selectedPlatform);
      }
      
      if (result.status === 'deployed') {
        toast.success(`Successfully deployed to ${platform.name}!`);
      } else if (result.status === 'failed') {
        toast.error(`Deployment failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Deployment failed:', error);
      toast.error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  }, [selectedPlatform, apiKey, deploymentConfig, generatedApp]);

  const pollDeploymentStatus = useCallback(async (deploymentId: string, platform: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('Deployment status check timed out');
        return;
      }

      try {
        const status = await deploymentService.getDeploymentStatus(deploymentId, platform);
        
        setDeploymentStatus(prev => ({
          ...prev,
          [deploymentId]: status
        }));

        if (status.status === 'deployed') {
          toast.success('Deployment completed successfully!');
          
          // Update the deployment in the list
          setDeployments(prev => prev.map(dep => 
            dep.id === deploymentId 
              ? { ...dep, status: 'deployed', url: status.url }
              : dep
          ));
          
        } else if (status.status === 'failed') {
          toast.error(`Deployment failed: ${status.error || 'Unknown error'}`);
          
          setDeployments(prev => prev.map(dep => 
            dep.id === deploymentId 
              ? { ...dep, status: 'failed', error: status.error }
              : dep
          ));
          
        } else {
          // Continue polling
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
        
      } catch (error) {
        console.error('Error polling deployment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 5000);
  }, []);

  const addEnvironmentVariable = useCallback(() => {
    const key = prompt('Environment variable name:');
    const value = prompt('Environment variable value:');
    
    if (key && value) {
      setDeploymentConfig(prev => ({
        ...prev,
        envVars: {
          ...prev.envVars,
          [key]: value
        }
      }));
    }
  }, []);

  const removeEnvironmentVariable = useCallback((key: string) => {
    setDeploymentConfig(prev => ({
      ...prev,
      envVars: Object.fromEntries(
        Object.entries(prev.envVars).filter(([k]) => k !== key)
      )
    }));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'deploying':
      case 'building':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'deploying':
      case 'building':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <Tabs defaultValue="deploy" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="deploy">Deploy Project</TabsTrigger>
        <TabsTrigger value="deployments">Active Deployments</TabsTrigger>
      </TabsList>

      <TabsContent value="deploy" className="space-y-6">
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-primary" />
              Deploy Your Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Choose Deployment Platform</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPLOYMENT_PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${platform.color}`}>
                            {platform.name}
                          </h3>
                          {platform.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.requiresApiKey && (
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.name} API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="ff-focus-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored securely and only used for deployment.
                </p>
              </div>
            )}

            {/* Build Configuration */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Build Configuration</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildCommand">Build Command</Label>
                  <Input
                    id="buildCommand"
                    value={deploymentConfig.buildCommand}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      buildCommand: e.target.value
                    }))}
                    className="ff-focus-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outputDir">Output Directory</Label>
                  <Input
                    id="outputDir"
                    value={deploymentConfig.outputDir}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      outputDir: e.target.value
                    }))}
                    className="ff-focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Environment Variables</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEnvironmentVariable}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Variable
                </Button>
              </div>
              
              {Object.entries(deploymentConfig.envVars).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(deploymentConfig.envVars).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <code className="flex-1 text-sm">{key}={value}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEnvironmentVariable(key)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No environment variables configured. Add variables for database URLs, API keys, etc.
                </p>
              )}
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full ff-btn-primary"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Deploying to {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.name}...
                </>
              ) : (
                <>
                  <CloudUpload className="w-5 h-5 mr-2" />
                  Deploy to {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deployments" className="space-y-6">
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Active Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deployments.length > 0 ? (
              <div className="space-y-4">
                {deployments.map((deployment) => {
                  const platform = DEPLOYMENT_PLATFORMS.find(p => p.id === deployment.platform);
                  const status = deploymentStatus[deployment.id]?.status || deployment.status;
                  
                  return (
                    <div key={deployment.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{platform?.icon}</span>
                          <div>
                            <h3 className="font-semibold">{platform?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(deployment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                      
                      {deployment.url && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(deployment.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Deployment
                          </Button>
                          <code className="text-sm bg-muted/50 px-2 py-1 rounded">
                            {deployment.url}
                          </code>
                        </div>
                      )}
                      
                      {deployment.error && (
                        <div className="p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {deployment.error}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CloudUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Deployments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Deploy your application to see it listed here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}