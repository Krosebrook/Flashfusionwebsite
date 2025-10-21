import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CheckCircle, Rocket, Globe, Settings, Monitor, Smartphone, Zap, Cloud, Database, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface OneClickPublishingWorkflowProps {
  createdContent?: any;
  onComplete?: () => void;
}

export function OneClickPublishingWorkflow({ createdContent, onComplete }: OneClickPublishingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [deploymentSettings, setDeploymentSettings] = useState<any>({});
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResults, setPublishedResults] = useState<any>(null);

  const platforms = [
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Edge-optimized hosting for web applications',
      icon: '▲',
      category: 'hosting',
      color: 'bg-black',
      features: ['Auto-scaling', 'Global CDN', 'Serverless Functions', 'Analytics'],
      deployTime: '30-60 seconds',
      recommended: true
    },
    {
      id: 'netlify',
      name: 'Netlify',
      description: 'JAMstack deployment with continuous deployment',
      icon: '🌐',
      category: 'hosting',
      color: 'bg-teal-600',
      features: ['Form Handling', 'Split Testing', 'Edge Functions', 'Identity'],
      deployTime: '45-90 seconds'
    },
    {
      id: 'aws',
      name: 'AWS',
      description: 'Amazon Web Services cloud infrastructure',
      icon: '☁️',
      category: 'cloud',
      color: 'bg-orange-600',
      features: ['EC2', 'S3', 'RDS', 'CloudFront', 'Lambda'],
      deployTime: '2-5 minutes'
    },
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      description: 'Free static site hosting from GitHub',
      icon: '🐙',
      category: 'hosting',
      color: 'bg-gray-800',
      features: ['Custom Domains', 'HTTPS', 'Jekyll Support'],
      deployTime: '60-120 seconds'
    },
    {
      id: 'heroku',
      name: 'Heroku',
      description: 'Platform-as-a-Service for full-stack apps',
      icon: '🟣',
      category: 'paas',
      color: 'bg-purple-600',
      features: ['Add-ons', 'Dynos', 'Postgres', 'Redis'],
      deployTime: '2-3 minutes'
    },
    {
      id: 'firebase',
      name: 'Firebase',
      description: 'Google\'s app development platform',
      icon: '🔥',
      category: 'baas',
      color: 'bg-yellow-600',
      features: ['Hosting', 'Database', 'Auth', 'Functions'],
      deployTime: '1-2 minutes'
    },
    {
      id: 'docker-hub',
      name: 'Docker Hub',
      description: 'Container registry and deployment',
      icon: '🐳',
      category: 'containers',
      color: 'bg-blue-600',
      features: ['Container Registry', 'Automated Builds', 'Webhooks'],
      deployTime: '3-5 minutes'
    },
    {
      id: 'cloudflare-pages',
      name: 'Cloudflare Pages',
      description: 'JAMstack platform with edge computing',
      icon: '🔶',
      category: 'hosting',
      color: 'bg-orange-500',
      features: ['Workers', 'Analytics', 'Web3 Gateway'],
      deployTime: '45-75 seconds'
    },
    {
      id: 'railway',
      name: 'Railway',
      description: 'Simplified cloud infrastructure',
      icon: '🚂',
      category: 'paas',
      color: 'bg-indigo-600',
      features: ['Databases', 'Cron Jobs', 'Templates'],
      deployTime: '90-150 seconds'
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Unified cloud to build and run apps',
      icon: '⚡',
      category: 'hosting',
      color: 'bg-green-600',
      features: ['Static Sites', 'Web Services', 'Databases'],
      deployTime: '2-4 minutes'
    }
  ];

  const categories = [
    { id: 'hosting', name: 'Static Hosting', icon: Globe },
    { id: 'paas', name: 'Platform as a Service', icon: Cloud },
    { id: 'baas', name: 'Backend as a Service', icon: Database },
    { id: 'cloud', name: 'Cloud Infrastructure', icon: Monitor },
    { id: 'containers', name: 'Container Platforms', icon: Shield }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setCurrentStep(3);
    
    // Simulate deployment process
    const totalSteps = selectedPlatforms.length * 20;
    for (let i = 0; i <= totalSteps; i++) {
      setPublishingProgress((i / totalSteps) * 100);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate results
    setPublishedResults({
      platforms: selectedPlatforms.map(platformId => {
        const platform = platforms.find(p => p.id === platformId);
        return {
          id: platformId,
          name: platform?.name,
          url: generateDeploymentUrl(platformId),
          status: 'deployed',
          deployTime: platform?.deployTime,
          analytics: generateAnalytics()
        };
      }),
      summary: {
        totalPlatforms: selectedPlatforms.length,
        successfulDeployments: selectedPlatforms.length,
        totalDeployTime: `${Math.floor(Math.random() * 5) + 2} minutes`,
        optimizationsApplied: Math.floor(Math.random() * 8) + 12
      }
    });
    
    setIsPublishing(false);
    setCurrentStep(4);
  };

  const generateDeploymentUrl = (platformId: string) => {
    const baseUrls = {
      'vercel': 'https://flashfusion-creation.vercel.app',
      'netlify': 'https://flashfusion-creation.netlify.app',
      'github-pages': 'https://username.github.io/flashfusion-creation',
      'firebase': 'https://flashfusion-creation.web.app',
      'heroku': 'https://flashfusion-creation.herokuapp.com',
      'railway': 'https://flashfusion-creation.up.railway.app',
      'render': 'https://flashfusion-creation.onrender.com',
      'cloudflare-pages': 'https://flashfusion-creation.pages.dev'
    };
    return baseUrls[platformId as keyof typeof baseUrls] || `https://${platformId}.example.com`;
  };

  const generateAnalytics = () => ({
    performanceScore: Math.floor(Math.random() * 15) + 85,
    buildTime: `${Math.floor(Math.random() * 120) + 30}s`,
    bundleSize: `${Math.floor(Math.random() * 500) + 200}KB`,
    lighthouse: {
      performance: Math.floor(Math.random() * 10) + 90,
      accessibility: Math.floor(Math.random() * 5) + 95,
      bestPractices: Math.floor(Math.random() * 8) + 92,
      seo: Math.floor(Math.random() * 12) + 88
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">One-Click Publishing</h2>
                <p className="ff-text-body">Deploy your creations instantly across 20+ platforms with automated optimization</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Ready to Deploy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-green-500 font-semibold mb-1">Creation Type</div>
                    <div className="text-sm text-gray-300">Full-Stack Application</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-500 font-semibold mb-1">Files Ready</div>
                    <div className="text-sm text-gray-300">32 files, 2.1 MB</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-purple-500 font-semibold mb-1">Optimization</div>
                    <div className="text-sm text-gray-300">Auto-applied</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="ff-text-title">Select Deployment Platforms</h3>
              
              {categories.map(category => {
                const categoryPlatforms = platforms.filter(p => p.category === category.id);
                const Icon = category.icon;
                
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <h4 className="ff-text-title text-base">{category.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryPlatforms.map(platform => (
                        <Card 
                          key={platform.id}
                          className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                            selectedPlatforms.includes(platform.id) 
                              ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                              : 'hover:bg-white/5'
                          }`}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center text-white text-sm`}>
                                  {platform.icon}
                                </div>
                                <div>
                                  <h5 className="font-semibold">{platform.name}</h5>
                                  {platform.recommended && (
                                    <Badge className="ff-badge-primary text-xs">Recommended</Badge>
                                  )}
                                </div>
                              </div>
                              {selectedPlatforms.includes(platform.id) && (
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-3">{platform.description}</p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Deploy Time:</span>
                                <span className="text-gray-300">{platform.deployTime}</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {platform.features.slice(0, 3).map(feature => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {platform.features.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{platform.features.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedPlatforms.length === 0}
                className="ff-btn-primary ff-btn-lg"
              >
                Configure Deployment ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Deployment Configuration</h2>
              <p className="ff-text-body">Customize settings for your selected platforms</p>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle>Selected Platforms ({selectedPlatforms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return (
                      <div key={platformId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded ${platform?.color} flex items-center justify-center text-white text-xs`}>
                            {platform?.icon}
                          </div>
                          <span className="font-medium">{platform?.name}</span>
                        </div>
                        <Badge variant="secondary">{platform?.deployTime}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="ff-text-title text-sm">Project Name</label>
                      <Input 
                        placeholder="flashfusion-creation" 
                        className="ff-input"
                        defaultValue="flashfusion-creation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="ff-text-title text-sm">Environment Variables</label>
                      <Textarea
                        placeholder="NODE_ENV=production&#10;API_URL=https://api.example.com"
                        className="ff-input"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Auto-deploy</div>
                          <div className="text-xs text-gray-400">Deploy on every push</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">HTTPS Redirect</div>
                          <div className="text-xs text-gray-400">Force HTTPS</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="optimization" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Code Splitting</div>
                          <div className="text-xs text-gray-400">Optimize bundle size</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Image Optimization</div>
                          <div className="text-xs text-gray-400">Auto-optimize images</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Compression</div>
                          <div className="text-xs text-gray-400">Gzip/Brotli compression</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Caching</div>
                          <div className="text-xs text-gray-400">Aggressive caching</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="monitoring" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Analytics</div>
                          <div className="text-xs text-gray-400">Web analytics</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Error Tracking</div>
                          <div className="text-xs text-gray-400">Automatic error reporting</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Performance</div>
                          <div className="text-xs text-gray-400">Core Web Vitals</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Uptime Monitor</div>
                          <div className="text-xs text-gray-400">24/7 monitoring</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="ff-btn-outline"
              >
                Back to Platform Selection
              </Button>
              <Button 
                onClick={handlePublish}
                className="ff-btn-primary ff-btn-lg"
              >
                Deploy to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Deploying Your Creation</h2>
                <p className="ff-text-body">Publishing to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} with automated optimization</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="ff-text-title text-sm">Deployment Progress</span>
                    <span className="ff-text-title text-sm">{Math.round(publishingProgress)}%</span>
                  </div>
                  <Progress value={publishingProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    const progress = Math.min(publishingProgress * (Math.random() * 0.3 + 0.8), 100);
                    
                    return (
                      <div key={platformId} className="p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-5 h-5 rounded ${platform?.color} flex items-center justify-center text-white text-xs`}>
                              {platform?.icon}
                            </div>
                            <span className="font-medium text-sm">{platform?.name}</span>
                          </div>
                          {progress >= 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          )}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          {progress >= 100 ? 'Deployed successfully' : 'Deploying...'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Optimization in Progress</span>
                  </div>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Code splitting and tree shaking</li>
                    <li>• Image optimization and compression</li>
                    <li>• CDN configuration and caching</li>
                    <li>• Performance monitoring setup</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Successfully Deployed!</h2>
                <p className="ff-text-body">Your creation is now live across {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {publishedResults && (
              <div className="space-y-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Deployment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{publishedResults.summary.successfulDeployments}</div>
                        <div className="text-sm text-gray-400">Successful Deployments</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">{publishedResults.summary.totalDeployTime}</div>
                        <div className="text-sm text-gray-400">Total Deploy Time</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{publishedResults.summary.optimizationsApplied}</div>
                        <div className="text-sm text-gray-400">Optimizations Applied</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">100%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Live Deployments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {publishedResults.platforms.map((deployment: any) => (
                      <div key={deployment.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{deployment.name}</h4>
                            <p className="text-sm text-gray-400">Deployed in {deployment.deployTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="ff-badge-success">Live</Badge>
                          <Button size="sm" variant="outline" asChild>
                            <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Tabs defaultValue="performance" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="performance" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Performance Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="text-xl font-bold text-green-500">95</div>
                            <div className="text-xs text-gray-400">Performance</div>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-xl font-bold text-blue-500">98</div>
                            <div className="text-xs text-gray-400">Accessibility</div>
                          </div>
                          <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="text-xl font-bold text-purple-500">96</div>
                            <div className="text-xs text-gray-400">Best Practices</div>
                          </div>
                          <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="text-xl font-bold text-orange-500">92</div>
                            <div className="text-xs text-gray-400">SEO</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Analytics Setup</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Google Analytics</div>
                              <div className="text-xs text-gray-400">Web analytics tracking</div>
                            </div>
                            <Badge className="ff-badge-success">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Error Tracking</div>
                              <div className="text-xs text-gray-400">Automatic error reporting</div>
                            </div>
                            <Badge className="ff-badge-success">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Performance Monitoring</div>
                              <div className="text-xs text-gray-400">Core Web Vitals tracking</div>
                            </div>
                            <Badge className="ff-badge-success">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="monitoring" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Uptime Monitoring</h4>
                        <div className="space-y-3">
                          {publishedResults.platforms.map((deployment: any) => (
                            <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{deployment.name}</div>
                                <div className="text-xs text-gray-400">{deployment.url}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-500">Online</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedPlatforms([]);
                  setPublishingProgress(0);
                  setPublishedResults(null);
                }}
                className="ff-btn-outline"
              >
                Deploy Another
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Commerce Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}