/**
 * @fileoverview External App Integration Hub for FlashFusion
 * @chunk integrations
 * @category external-apps
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive system for integrating apps built on external platforms
 * like Bolt.new, App.base.44, Replit, Loveable.dev, Leap.new, etc.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ProfessionalIcon } from '../ui/professional-icon-system';
import {
  ExternalLink,
  Plus,
  Settings,
  Link as LinkIcon,
  Database,
  Webhook,
  Key,
  Zap,
  Globe,
  Code,
  Download,
  Upload,
  Sync,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Monitor,
  Cloud,
  Server,
  GitBranch,
  FileCode,
  Box,
  Layers,
  Network,
  Shield,
  Clock,
  BarChart3,
  MessageSquare,
  Bell,
  Share,
  Trash2,
  Edit,
  Copy,
  Save,
  Power,
  Target,
  Workflow,
  Cpu,
  HardDrive,
  Activity,
  Users,
  Lock,
  Unlock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Tag,
  Calendar,
  MapPin,
  Info
} from 'lucide-react';

// Supported Platforms Configuration
const SUPPORTED_PLATFORMS = {
  'bolt.new': {
    name: 'Bolt.new',
    description: 'Full-stack web applications with AI',
    icon: Zap,
    color: '#FF6B35',
    category: 'AI Development',
    integrationMethods: ['api', 'webhook', 'embed', 'export'],
    authTypes: ['oauth', 'api-key'],
    features: ['Real-time sync', 'Component export', 'Live preview', 'Deploy hooks'],
    documentation: 'https://docs.bolt.new/api'
  },
  'app.base.44': {
    name: 'App.base.44',
    description: 'No-code app builder platform',
    icon: Box,
    color: '#4F46E5',
    category: 'No-Code',
    integrationMethods: ['api', 'webhook', 'database'],
    authTypes: ['oauth', 'api-key'],
    features: ['Database sync', 'User management', 'Workflow automation'],
    documentation: 'https://docs.app.base.44/integration'
  },
  'replit.com': {
    name: 'Replit',
    description: 'Online IDE and hosting platform',
    icon: Code,
    color: '#F26207',
    category: 'Development',
    integrationMethods: ['api', 'git', 'embed'],
    authTypes: ['oauth', 'token'],
    features: ['Git integration', 'Live collaboration', 'Environment sync'],
    documentation: 'https://docs.replit.com/api'
  },
  'loveable.dev': {
    name: 'Loveable.dev',
    description: 'GPT-powered app development',
    icon: Globe,
    color: '#E91E63',
    category: 'AI Development',
    integrationMethods: ['api', 'webhook', 'export'],
    authTypes: ['api-key'],
    features: ['AI code generation', 'Component library', 'Theme sync'],
    documentation: 'https://docs.loveable.dev/api'
  },
  'leap.new': {
    name: 'Leap.new',
    description: 'AI-powered development platform',
    icon: Target,
    color: '#00B4D8',
    category: 'AI Development',
    integrationMethods: ['api', 'webhook'],
    authTypes: ['oauth', 'api-key'],
    features: ['Model training', 'API deployment', 'Analytics'],
    documentation: 'https://docs.leap.new/integration'
  },
  'vercel.com': {
    name: 'Vercel',
    description: 'Frontend deployment platform',
    icon: Cloud,
    color: '#000000',
    category: 'Deployment',
    integrationMethods: ['api', 'webhook', 'git'],
    authTypes: ['oauth', 'token'],
    features: ['Auto-deploy', 'Analytics', 'Edge functions'],
    documentation: 'https://vercel.com/docs/api'
  },
  'netlify.com': {
    name: 'Netlify',
    description: 'Web development platform',
    icon: Network,
    color: '#00C7B7',
    category: 'Deployment',
    integrationMethods: ['api', 'webhook', 'git'],
    authTypes: ['oauth', 'token'],
    features: ['Form handling', 'Functions', 'Identity'],
    documentation: 'https://docs.netlify.com/api/get-started/'
  },
  'railway.app': {
    name: 'Railway',
    description: 'Infrastructure platform',
    icon: Server,
    color: '#0B0D0E',
    category: 'Infrastructure',
    integrationMethods: ['api', 'webhook'],
    authTypes: ['token'],
    features: ['Database hosting', 'Service deployment', 'Environment variables'],
    documentation: 'https://docs.railway.app/reference/public-api'
  }
};

// Integration Status Types
type IntegrationStatus = 'connected' | 'connecting' | 'error' | 'disconnected';

interface ExternalApp {
  id: string;
  platform: keyof typeof SUPPORTED_PLATFORMS;
  name: string;
  url: string;
  description?: string;
  status: IntegrationStatus;
  lastSync?: Date;
  integrationMethod: string;
  authType: string;
  metadata: {
    version?: string;
    deployUrl?: string;
    repository?: string;
    framework?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  settings: {
    autoSync: boolean;
    notifications: boolean;
    webhookUrl?: string;
    apiKey?: string;
    accessToken?: string;
  };
  analytics: {
    totalSyncs: number;
    lastActivity: Date;
    errorCount: number;
    uptime: number;
  };
}

export function ExternalAppIntegrationHub() {
  const [connectedApps, setConnectedApps] = useState<ExternalApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof SUPPORTED_PLATFORMS | null>(null);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock connected apps data
  useEffect(() => {
    const mockApps: ExternalApp[] = [
      {
        id: '1',
        platform: 'bolt.new',
        name: 'AI SaaS Dashboard',
        url: 'https://my-app.bolt.new',
        description: 'Full-stack dashboard with AI features',
        status: 'connected',
        lastSync: new Date('2024-01-15T10:30:00'),
        integrationMethod: 'api',
        authType: 'oauth',
        metadata: {
          version: '1.2.0',
          deployUrl: 'https://my-app.vercel.app',
          repository: 'github.com/user/ai-saas-dashboard',
          framework: 'React + Node.js',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        settings: {
          autoSync: true,
          notifications: true,
          webhookUrl: 'https://flashfusion.app/webhooks/bolt-new',
          apiKey: 'bolt_***********'
        },
        analytics: {
          totalSyncs: 247,
          lastActivity: new Date('2024-01-15T10:30:00'),
          errorCount: 3,
          uptime: 99.2
        }
      },
      {
        id: '2',
        platform: 'replit.com',
        name: 'Python API Service',
        url: 'https://my-api.replit.dev',
        description: 'Backend API for mobile app',
        status: 'connected',
        lastSync: new Date('2024-01-15T09:15:00'),
        integrationMethod: 'git',
        authType: 'token',
        metadata: {
          version: '2.1.3',
          repository: 'github.com/user/python-api',
          framework: 'FastAPI',
          createdAt: new Date('2023-12-15'),
          updatedAt: new Date('2024-01-15')
        },
        settings: {
          autoSync: false,
          notifications: true,
          accessToken: 'replit_***********'
        },
        analytics: {
          totalSyncs: 156,
          lastActivity: new Date('2024-01-15T09:15:00'),
          errorCount: 1,
          uptime: 98.7
        }
      }
    ];
    
    setConnectedApps(mockApps);
  }, []);

  // Filter apps based on search and category
  const filteredApps = connectedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           SUPPORTED_PLATFORMS[app.platform].category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(Object.values(SUPPORTED_PLATFORMS).map(p => p.category))];

  const handleConnectApp = async (platform: keyof typeof SUPPORTED_PLATFORMS) => {
    setIsLoading(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const newApp: ExternalApp = {
        id: Date.now().toString(),
        platform,
        name: `New ${SUPPORTED_PLATFORMS[platform].name} App`,
        url: `https://app.${platform}`,
        status: 'connected',
        lastSync: new Date(),
        integrationMethod: SUPPORTED_PLATFORMS[platform].integrationMethods[0],
        authType: SUPPORTED_PLATFORMS[platform].authTypes[0],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date()
        },
        settings: {
          autoSync: true,
          notifications: true
        },
        analytics: {
          totalSyncs: 0,
          lastActivity: new Date(),
          errorCount: 0,
          uptime: 100
        }
      };
      
      setConnectedApps(prev => [...prev, newApp]);
      setShowConnectionDialog(false);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncApp = async (appId: string) => {
    setConnectedApps(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, status: 'connecting' as IntegrationStatus }
        : app
    ));

    // Simulate sync
    setTimeout(() => {
      setConnectedApps(prev => prev.map(app => 
        app.id === appId 
          ? { 
              ...app, 
              status: 'connected' as IntegrationStatus,
              lastSync: new Date(),
              analytics: {
                ...app.analytics,
                totalSyncs: app.analytics.totalSyncs + 1,
                lastActivity: new Date()
              }
            }
          : app
      ));
    }, 1500);
  };

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return 'text-success border-success/20 bg-success/10';
      case 'connecting': return 'text-warning border-warning/20 bg-warning/10';
      case 'error': return 'text-error border-error/20 bg-error/10';
      case 'disconnected': return 'text-muted border-muted/20 bg-muted/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'connecting': return RefreshCw;
      case 'error': return XCircle;
      case 'disconnected': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="ff-text-display text-4xl mb-2">
              External App Integration Hub
            </h1>
            <p className="ff-text-body text-lg text-muted-foreground">
              Connect and manage apps from Bolt.new, Replit, Loveable.dev, and other platforms
            </p>
          </div>
          
          <Button
            onClick={() => setShowConnectionDialog(true)}
            className="ff-btn-primary"
          >
            <ProfessionalIcon icon={Plus} size="sm" />
            Connect New App
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Connected Apps</p>
                  <p className="ff-text-title text-2xl font-bold">{connectedApps.length}</p>
                </div>
                <ProfessionalIcon 
                  icon={Network} 
                  size="lg" 
                  variant="functional" 
                  context="primary" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Active Syncs</p>
                  <p className="ff-text-title text-2xl font-bold">
                    {connectedApps.filter(app => app.status === 'connected').length}
                  </p>
                </div>
                <ProfessionalIcon 
                  icon={Sync} 
                  size="lg" 
                  variant="functional" 
                  context="success" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Total Syncs</p>
                  <p className="ff-text-title text-2xl font-bold">
                    {connectedApps.reduce((sum, app) => sum + app.analytics.totalSyncs, 0)}
                  </p>
                </div>
                <ProfessionalIcon 
                  icon={BarChart3} 
                  size="lg" 
                  variant="functional" 
                  context="secondary" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Avg. Uptime</p>
                  <p className="ff-text-title text-2xl font-bold">
                    {connectedApps.length > 0 
                      ? Math.round(connectedApps.reduce((sum, app) => sum + app.analytics.uptime, 0) / connectedApps.length)
                      : 0}%
                  </p>
                </div>
                <ProfessionalIcon 
                  icon={Activity} 
                  size="lg" 
                  variant="functional" 
                  context="accent" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connected">Connected Apps</TabsTrigger>
            <TabsTrigger value="platforms">Available Platforms</TabsTrigger>
            <TabsTrigger value="settings">Integration Settings</TabsTrigger>
          </TabsList>

          {/* Connected Apps Tab */}
          <TabsContent value="connected" className="space-y-6">
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search connected apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-card border border-border rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Connected Apps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApps.map((app) => {
                const platform = SUPPORTED_PLATFORMS[app.platform];
                const StatusIcon = getStatusIcon(app.status);
                
                return (
                  <Card key={app.id} className="ff-card-interactive">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${platform.color}20` }}
                          >
                            <ProfessionalIcon 
                              icon={platform.icon} 
                              size="md" 
                              style={{ color: platform.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="ff-text-title text-lg">{app.name}</CardTitle>
                            <p className="ff-text-caption text-muted-foreground">{platform.name}</p>
                          </div>
                        </div>
                        
                        <Badge 
                          className={`${getStatusColor(app.status)} capitalize`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {app.description && (
                        <p className="ff-text-caption text-muted-foreground">
                          {app.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Integration</p>
                          <p className="ff-text-body capitalize">{app.integrationMethod}</p>
                        </div>
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Last Sync</p>
                          <p className="ff-text-body">
                            {app.lastSync ? app.lastSync.toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Total Syncs</p>
                          <p className="ff-text-body">{app.analytics.totalSyncs}</p>
                        </div>
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Uptime</p>
                          <p className="ff-text-body">{app.analytics.uptime}%</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(app.url, '_blank')}
                          >
                            <ProfessionalIcon icon={ExternalLink} size="xs" />
                            Open App
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSyncApp(app.id)}
                            disabled={app.status === 'connecting'}
                          >
                            <ProfessionalIcon 
                              icon={RefreshCw} 
                              size="xs" 
                              className={app.status === 'connecting' ? 'animate-spin' : ''}
                            />
                            Sync
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <ProfessionalIcon icon={Settings} size="xs" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredApps.length === 0 && (
              <Card className="ff-card text-center py-12">
                <CardContent>
                  <ProfessionalIcon 
                    icon={Network} 
                    size="xl" 
                    variant="functional" 
                    context="muted" 
                    className="mx-auto mb-4"
                  />
                  <h3 className="ff-text-title text-xl mb-2">No Connected Apps</h3>
                  <p className="ff-text-body text-muted-foreground mb-6">
                    Connect your first external app to get started with platform integrations.
                  </p>
                  <Button onClick={() => setShowConnectionDialog(true)}>
                    <ProfessionalIcon icon={Plus} size="sm" />
                    Connect First App
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Available Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(SUPPORTED_PLATFORMS).map(([key, platform]) => (
                <Card key={key} className="ff-card-interactive">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}20` }}
                      >
                        <ProfessionalIcon 
                          icon={platform.icon} 
                          size="lg" 
                          style={{ color: platform.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="ff-text-title">{platform.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {platform.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="ff-text-caption text-muted-foreground">
                      {platform.description}
                    </p>
                    
                    <div>
                      <p className="ff-text-caption font-medium mb-2">Integration Methods:</p>
                      <div className="flex flex-wrap gap-1">
                        {platform.integrationMethods.map(method => (
                          <Badge key={method} variant="secondary" className="text-xs">
                            {method.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="ff-text-caption font-medium mb-2">Features:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {platform.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => {
                          setSelectedPlatform(key as keyof typeof SUPPORTED_PLATFORMS);
                          setShowConnectionDialog(true);
                        }}
                        className="flex-1"
                      >
                        <ProfessionalIcon icon={LinkIcon} size="xs" />
                        Connect
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => window.open(platform.documentation, '_blank')}
                      >
                        <ProfessionalIcon icon={ExternalLink} size="xs" />
                        Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Integration Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Global Integration Settings</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="ff-text-body font-semibold">Sync Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-sync">Auto-sync all apps</Label>
                        <input type="checkbox" id="auto-sync" defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sync-interval">Sync interval (minutes)</Label>
                        <Input 
                          id="sync-interval" 
                          type="number" 
                          defaultValue="15" 
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="ff-text-body font-semibold">Notification Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sync-notifications">Sync notifications</Label>
                        <input type="checkbox" id="sync-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="error-notifications">Error notifications</Label>
                        <input type="checkbox" id="error-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekly-reports">Weekly reports</Label>
                        <input type="checkbox" id="weekly-reports" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="ff-text-body font-semibold">Webhook Configuration</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="webhook-url">Global webhook URL</Label>
                      <Input 
                        id="webhook-url" 
                        placeholder="https://your-app.com/webhooks/flashfusion"
                        defaultValue="https://flashfusion.app/webhooks/external-apps"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="webhook-secret">Webhook secret</Label>
                      <Input 
                        id="webhook-secret" 
                        type="password"
                        placeholder="Enter webhook secret"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connection Dialog */}
        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="ff-text-title">
                Connect External App
                {selectedPlatform && ` - ${SUPPORTED_PLATFORMS[selectedPlatform].name}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {!selectedPlatform ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(SUPPORTED_PLATFORMS).map(([key, platform]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => setSelectedPlatform(key as keyof typeof SUPPORTED_PLATFORMS)}
                    >
                      <ProfessionalIcon 
                        icon={platform.icon} 
                        size="md" 
                        style={{ color: platform.color }}
                      />
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <ConnectionForm 
                  platform={selectedPlatform}
                  onConnect={handleConnectApp}
                  isLoading={isLoading}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Connection Form Component
interface ConnectionFormProps {
  platform: keyof typeof SUPPORTED_PLATFORMS;
  onConnect: (platform: keyof typeof SUPPORTED_PLATFORMS) => void;
  isLoading: boolean;
}

function ConnectionForm({ platform, onConnect, isLoading }: ConnectionFormProps) {
  const platformInfo = SUPPORTED_PLATFORMS[platform];
  const [connectionMethod, setConnectionMethod] = useState(platformInfo.integrationMethods[0]);
  const [authType, setAuthType] = useState(platformInfo.authTypes[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${platformInfo.color}20` }}
        >
          <ProfessionalIcon 
            icon={platformInfo.icon} 
            size="lg" 
            style={{ color: platformInfo.color }}
          />
        </div>
        <div>
          <h3 className="ff-text-title">{platformInfo.name}</h3>
          <p className="ff-text-caption text-muted-foreground">{platformInfo.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="connection-method">Integration Method</Label>
          <select
            id="connection-method"
            value={connectionMethod}
            onChange={(e) => setConnectionMethod(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
          >
            {platformInfo.integrationMethods.map(method => (
              <option key={method} value={method}>
                {method.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="auth-type">Authentication</Label>
          <select
            id="auth-type"
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
          >
            {platformInfo.authTypes.map(type => (
              <option key={type} value={type}>
                {type.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="app-name">App Name</Label>
          <Input 
            id="app-name" 
            placeholder={`My ${platformInfo.name} App`}
          />
        </div>
        
        <div>
          <Label htmlFor="app-url">App URL</Label>
          <Input 
            id="app-url" 
            placeholder={`https://my-app.${platform}`}
          />
        </div>
        
        {authType === 'api-key' && (
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input 
              id="api-key" 
              type="password"
              placeholder="Enter your API key"
            />
          </div>
        )}
        
        {connectionMethod === 'webhook' && (
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input 
              id="webhook-url" 
              placeholder="https://your-app.com/webhooks"
              defaultValue="https://flashfusion.app/webhooks/external-apps"
            />
          </div>
        )}
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This will establish a {connectionMethod} connection with {authType} authentication. 
          You can modify these settings later in the app management panel.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {}}>
          <ProfessionalIcon icon={ExternalLink} size="xs" />
          View Documentation
        </Button>
        
        <Button 
          onClick={() => onConnect(platform)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ProfessionalIcon icon={RefreshCw} size="xs" className="animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ProfessionalIcon icon={LinkIcon} size="xs" />
              Connect App
            </>
          )}
        </Button>
      </div>
    </div>
  );
}