import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Settings,
  Monitor,
  Rocket,
  AlertTriangle
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Deployment {
  id: string;
  projectId: string;
  platform: string;
  status: 'in_progress' | 'completed' | 'failed';
  steps: string[];
  currentStep: number;
  url?: string;
  logs: Array<{
    timestamp: string;
    message: string;
    level: 'info' | 'warning' | 'error';
  }>;
  createdAt: string;
}

function CICDPipelineIntegration() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { value: 'vercel', label: 'Vercel', icon: '▲' },
    { value: 'netlify', label: 'Netlify', icon: '🌐' },
    { value: 'heroku', label: 'Heroku', icon: '🚀' },
    { value: 'aws', label: 'AWS', icon: '☁️' },
    { value: 'digitalocean', label: 'DigitalOcean', icon: '🌊' },
    { value: 'railway', label: 'Railway', icon: '🚂' },
    { value: 'render', label: 'Render', icon: '🎨' },
    { value: 'firebase', label: 'Firebase', icon: '🔥' }
  ];

  const mockProjects = [
    { id: '1', name: 'My React App', framework: 'react' },
    { id: '2', name: 'Next.js Store', framework: 'nextjs' },
    { id: '3', name: 'Vue Dashboard', framework: 'vue' }
  ];

  const handleDeploy = async () => {
    if (!selectedProject || !selectedPlatform) {
      setError('Please select a project and platform');
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('ff-auth-token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-88829a40/cicd/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify({
          projectId: selectedProject,
          platform: selectedPlatform,
          config: {
            buildCommand: 'npm run build',
            outputDirectory: 'dist',
            nodeVersion: '18.x'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Deployment failed');
      }

      const { deploymentId } = await response.json();
      
      // Start polling for deployment status
      startPollingDeployment(deploymentId);
      
    } catch (error) {
      console.error('Deployment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start deployment');
      setIsDeploying(false);
    }
  };

  const startPollingDeployment = (deploymentId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-88829a40/cicd/deployments/${deploymentId}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });

        if (response.ok) {
          const { deployment } = await response.json();
          
          setDeployments(prev => {
            const existing = prev.find(d => d.id === deploymentId);
            if (existing) {
              return prev.map(d => d.id === deploymentId ? deployment : d);
            } else {
              return [deployment, ...prev];
            }
          });

          if (deployment.status === 'completed' || deployment.status === 'failed') {
            clearInterval(pollInterval);
            setIsDeploying(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
        setIsDeploying(false);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsDeploying(false);
    }, 300000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold ff-text-gradient">CI/CD Pipeline Integration</h1>
        <p className="text-lg text-muted-foreground">
          Deploy your applications to multiple platforms with automated CI/CD pipelines
        </p>
      </div>

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Deployment Configuration */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Deploy Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue placeholder="Choose a project to deploy" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name} ({project.framework})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Deployment Platform</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue placeholder="Choose deployment platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center gap-2">
                            <span>{platform.icon}</span>
                            {platform.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Build Configuration</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Build Command</Label>
                      <Input defaultValue="npm run build" className="ff-focus-ring" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Output Directory</Label>
                      <Input defaultValue="dist" className="ff-focus-ring" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying || !selectedProject || !selectedPlatform}
                  className="w-full ff-btn-primary"
                >
                  {isDeploying ? (
                    <>
                      <Clock className="h-4 w-4 animate-pulse mr-2" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Deploy Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Platform Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-secondary" />
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {platforms.slice(0, 4).map((platform) => (
                    <div 
                      key={platform.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlatform === platform.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPlatform(platform.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <h4 className="font-semibold">{platform.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {platform.value === 'vercel' && 'Edge functions, automatic SSL, global CDN'}
                            {platform.value === 'netlify' && 'Form handling, split testing, edge functions'}
                            {platform.value === 'heroku' && 'Add-ons, buildpacks, horizontal scaling'}
                            {platform.value === 'aws' && 'Full AWS integration, auto-scaling, CloudFront'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">Auto Deploy</Badge>
                        <Badge variant="outline" className="text-xs">SSL</Badge>
                        <Badge variant="outline" className="text-xs">CDN</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <div className="space-y-4">
            {deployments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No deployments yet</p>
                  <p className="text-sm text-muted-foreground">Deploy your first application to get started</p>
                </CardContent>
              </Card>
            ) : (
              deployments.map((deployment) => (
                <Card key={deployment.id} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(deployment.status)}
                        <div>
                          <h3 className="font-semibold">
                            {mockProjects.find(p => p.id === deployment.projectId)?.name || 'Unknown Project'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Deploying to {deployment.platform}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(deployment.status)}>
                        {deployment.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {deployment.status === 'in_progress' && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{deployment.currentStep + 1} of {deployment.steps.length}</span>
                        </div>
                        <Progress value={(deployment.currentStep + 1) / deployment.steps.length * 100} />
                        <p className="text-sm text-muted-foreground">
                          {deployment.steps[deployment.currentStep]}
                        </p>
                      </div>
                    )}

                    {deployment.status === 'completed' && deployment.url && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-800">
                          Deployment successful! 
                        </span>
                        <Button size="sm" variant="outline" className="ml-auto">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Site
                        </Button>
                      </div>
                    )}

                    {deployment.logs.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Build Logs</Label>
                        <div className="bg-black/90 text-green-400 p-3 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
                          {deployment.logs.map((log, index) => (
                            <div key={index} className="flex gap-2">
                              <span className="text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className={
                                log.level === 'error' ? 'text-red-400' :
                                log.level === 'warning' ? 'text-yellow-400' :
                                'text-green-400'
                              }>
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Frontend Pipeline', status: 'active', builds: 24, success: 95 },
              { name: 'API Pipeline', status: 'active', builds: 18, success: 100 },
              { name: 'Mobile Pipeline', status: 'paused', builds: 8, success: 87 }
            ].map((pipeline) => (
              <Card key={pipeline.name} className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{pipeline.name}</h3>
                    <Badge variant={pipeline.status === 'active' ? 'default' : 'secondary'}>
                      {pipeline.status}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Builds</span>
                      <span>{pipeline.builds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="text-green-600">{pipeline.success}%</span>
                    </div>
                    <Progress value={pipeline.success} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Uptime', value: '99.9%', status: 'good' },
              { label: 'Response Time', value: '245ms', status: 'good' },
              { label: 'Error Rate', value: '0.1%', status: 'good' },
              { label: 'Deployments', value: '12', status: 'warning' }
            ].map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    {metric.status === 'good' ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Named export for internal use
export { CICDPipelineIntegration };

// Default export for lazy loading
export default CICDPipelineIntegration;