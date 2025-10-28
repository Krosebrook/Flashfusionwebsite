import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  Puzzle, Search, Filter, Star, Download, Settings, 
  Power, AlertCircle, Check, X, RefreshCw, Eye,
  Package, Shield, Zap, Code, Palette, Database,
  Cloud, Globe, Users, TrendingUp, Clock, ChevronRight,
  Github, Slack, Discord, Twitter, Facebook, Figma,
  ExternalLink, Play, Pause, Trash2, Upload, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PluginManagerIntegrationHubProps {
  onClose?: () => void;
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'development' | 'design' | 'productivity' | 'analytics' | 'automation' | 'security';
  icon: string;
  price: number;
  rating: number;
  downloads: number;
  verified: boolean;
  installed: boolean;
  enabled: boolean;
  updatesAvailable: boolean;
  size: number;
  permissions: string[];
  screenshots: string[];
  lastUpdated: Date;
  compatibility: string[];
  tags: string[];
}

interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: 'development' | 'design' | 'communication' | 'storage' | 'analytics' | 'deployment';
  icon: string;
  connected: boolean;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync: Date;
  features: string[];
  setupComplexity: 'easy' | 'medium' | 'advanced';
  documentation: string;
  webhookUrl?: string;
  apiKey?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
}

const mockPlugins: Plugin[] = [
  {
    id: 'eslint-formatter',
    name: 'ESLint Auto-Formatter',
    description: 'Automatically format and fix JavaScript/TypeScript code according to ESLint rules',
    version: '2.1.4',
    author: 'FlashFusion Team',
    category: 'development',
    icon: '🔧',
    price: 0,
    rating: 4.8,
    downloads: 15420,
    verified: true,
    installed: true,
    enabled: true,
    updatesAvailable: false,
    size: 2.4,
    permissions: ['Read/Write files', 'Execute commands'],
    screenshots: [],
    lastUpdated: new Date('2024-11-01'),
    compatibility: ['VSCode', 'WebStorm', 'Sublime'],
    tags: ['linting', 'formatting', 'javascript', 'typescript']
  },
  {
    id: 'figma-sync',
    name: 'Figma Design Sync',
    description: 'Import designs directly from Figma and convert them to React components',
    version: '1.3.2',
    author: 'Design Tools Inc.',
    category: 'design',
    icon: '🎨',
    price: 9.99,
    rating: 4.6,
    downloads: 8932,
    verified: true,
    installed: false,
    enabled: false,
    updatesAvailable: false,
    size: 5.2,
    permissions: ['Access Figma API', 'Read/Write files', 'Network access'],
    screenshots: [],
    lastUpdated: new Date('2024-10-28'),
    compatibility: ['Figma', 'React', 'Vue'],
    tags: ['figma', 'design', 'components', 'sync']
  },
  {
    id: 'ai-code-reviewer',
    name: 'AI Code Reviewer',
    description: 'Get AI-powered code reviews with suggestions for improvements and bug detection',
    version: '3.0.1',
    author: 'AI Tools Co.',
    category: 'development',
    icon: '🤖',
    price: 19.99,
    rating: 4.9,
    downloads: 12567,
    verified: true,
    installed: true,
    enabled: false,
    updatesAvailable: true,
    size: 8.7,
    permissions: ['Read files', 'AI API access', 'Network access'],
    screenshots: [],
    lastUpdated: new Date('2024-11-15'),
    compatibility: ['All IDEs', 'Git'],
    tags: ['ai', 'code-review', 'analysis', 'bugs']
  },
  {
    id: 'performance-monitor',
    name: 'Performance Monitor',
    description: 'Real-time performance monitoring and optimization suggestions for your applications',
    version: '1.5.7',
    author: 'Performance Labs',
    category: 'analytics',
    icon: '📊',
    price: 14.99,
    rating: 4.4,
    downloads: 6891,
    verified: false,
    installed: false,
    enabled: false,
    updatesAvailable: false,
    size: 3.8,
    permissions: ['Monitor performance', 'Network access', 'System metrics'],
    screenshots: [],
    lastUpdated: new Date('2024-10-20'),
    compatibility: ['Web', 'Node.js', 'React'],
    tags: ['performance', 'monitoring', 'optimization', 'metrics']
  },
  {
    id: 'docker-manager',
    name: 'Docker Container Manager',
    description: 'Manage Docker containers and deployments directly from your development environment',
    version: '2.2.0',
    author: 'DevOps Tools',
    category: 'automation',
    icon: '🐳',
    price: 24.99,
    rating: 4.7,
    downloads: 4523,
    verified: true,
    installed: true,
    enabled: true,
    updatesAvailable: false,
    size: 12.4,
    permissions: ['Docker access', 'System commands', 'Network access'],
    screenshots: [],
    lastUpdated: new Date('2024-11-10'),
    compatibility: ['Docker', 'Kubernetes'],
    tags: ['docker', 'containers', 'devops', 'deployment']
  }
];

const mockIntegrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect your GitHub repositories for seamless code management and CI/CD',
    provider: 'GitHub Inc.',
    category: 'development',
    icon: '🔗',
    connected: true,
    status: 'active',
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    features: ['Repository sync', 'Issue tracking', 'Pull requests', 'Actions'],
    setupComplexity: 'easy',
    documentation: 'https://docs.github.com/api',
    syncFrequency: 'realtime'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and updates directly in your Slack workspace',
    provider: 'Slack Technologies',
    category: 'communication',
    icon: '💬',
    connected: true,
    status: 'active',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    features: ['Notifications', 'Bot commands', 'File sharing', 'Status updates'],
    setupComplexity: 'easy',
    documentation: 'https://api.slack.com/',
    syncFrequency: 'realtime'
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Import designs and maintain design-development synchronization',
    provider: 'Figma Inc.',
    category: 'design',
    icon: '🎨',
    connected: false,
    status: 'inactive',
    lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    features: ['Design import', 'Asset export', 'Component sync', 'Version control'],
    setupComplexity: 'medium',
    documentation: 'https://www.figma.com/developers/api',
    syncFrequency: 'daily'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    description: 'Deploy and manage your applications on AWS cloud infrastructure',
    provider: 'Amazon',
    category: 'deployment',
    icon: '☁️',
    connected: false,
    status: 'inactive',
    lastSync: new Date(0),
    features: ['S3 Storage', 'EC2 Instances', 'Lambda Functions', 'CloudFormation'],
    setupComplexity: 'advanced',
    documentation: 'https://docs.aws.amazon.com/',
    syncFrequency: 'manual'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Share updates and collaborate with your team on Discord',
    provider: 'Discord Inc.',
    category: 'communication',
    icon: '🎮',
    connected: false,
    status: 'inactive',
    lastSync: new Date(0),
    features: ['Webhooks', 'Bot notifications', 'File sharing', 'Voice channels'],
    setupComplexity: 'easy',
    documentation: 'https://discord.com/developers/docs/',
    syncFrequency: 'realtime'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track and analyze user behavior and application performance',
    provider: 'Google',
    category: 'analytics',
    icon: '📈',
    connected: true,
    status: 'error',
    lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
    features: ['User tracking', 'Event analytics', 'Conversion tracking', 'Reports'],
    setupComplexity: 'medium',
    documentation: 'https://developers.google.com/analytics/',
    syncFrequency: 'hourly'
  }
];

const categories = [
  { id: 'all', name: 'All Categories', count: mockPlugins.length },
  { id: 'development', name: 'Development', count: mockPlugins.filter(p => p.category === 'development').length },
  { id: 'design', name: 'Design', count: mockPlugins.filter(p => p.category === 'design').length },
  { id: 'productivity', name: 'Productivity', count: mockPlugins.filter(p => p.category === 'productivity').length },
  { id: 'analytics', name: 'Analytics', count: mockPlugins.filter(p => p.category === 'analytics').length },
  { id: 'automation', name: 'Automation', count: mockPlugins.filter(p => p.category === 'automation').length },
  { id: 'security', name: 'Security', count: mockPlugins.filter(p => p.category === 'security').length }
];

const integrationCategories = [
  { id: 'all', name: 'All Services', count: mockIntegrations.length },
  { id: 'development', name: 'Development', count: mockIntegrations.filter(i => i.category === 'development').length },
  { id: 'design', name: 'Design', count: mockIntegrations.filter(i => i.category === 'design').length },
  { id: 'communication', name: 'Communication', count: mockIntegrations.filter(i => i.category === 'communication').length },
  { id: 'storage', name: 'Storage', count: mockIntegrations.filter(i => i.category === 'storage').length },
  { id: 'analytics', name: 'Analytics', count: mockIntegrations.filter(i => i.category === 'analytics').length },
  { id: 'deployment', name: 'Deployment', count: mockIntegrations.filter(i => i.category === 'deployment').length }
];

export function PluginManagerIntegrationHub({ onClose }: PluginManagerIntegrationHubProps) {
  const [activeTab, setActiveTab] = useState('plugins');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [plugins, setPlugins] = useState(mockPlugins);
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Filter plugins
  const filteredPlugins = useMemo(() => {
    let filtered = plugins;

    if (searchQuery) {
      filtered = filtered.filter(plugin =>
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plugin => plugin.category === selectedCategory);
    }

    // Sort plugins
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [plugins, searchQuery, selectedCategory, sortBy]);

  // Filter integrations
  const filteredIntegrations = useMemo(() => {
    let filtered = integrations;

    if (searchQuery) {
      filtered = filtered.filter(integration =>
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(integration => integration.category === selectedCategory);
    }

    return filtered;
  }, [integrations, searchQuery, selectedCategory]);

  const installedCount = useMemo(() => plugins.filter(p => p.installed).length, [plugins]);
  const updatesAvailable = useMemo(() => plugins.filter(p => p.updatesAvailable).length, [plugins]);
  const connectedCount = useMemo(() => integrations.filter(i => i.connected).length, [integrations]);

  const handleInstallPlugin = useCallback(async (pluginId: string) => {
    setPlugins(prev => prev.map(plugin =>
      plugin.id === pluginId ? { ...plugin, installed: true, enabled: true } : plugin
    ));
    toast.success('Plugin installed successfully!');
  }, []);

  const handleUninstallPlugin = useCallback(async (pluginId: string) => {
    setPlugins(prev => prev.map(plugin =>
      plugin.id === pluginId ? { ...plugin, installed: false, enabled: false } : plugin
    ));
    toast.success('Plugin uninstalled successfully!');
  }, []);

  const handleTogglePlugin = useCallback(async (pluginId: string) => {
    setPlugins(prev => prev.map(plugin =>
      plugin.id === pluginId ? { ...plugin, enabled: !plugin.enabled } : plugin
    ));
    const plugin = plugins.find(p => p.id === pluginId);
    toast.success(`Plugin ${plugin?.enabled ? 'disabled' : 'enabled'}!`);
  }, [plugins]);

  const handleUpdatePlugin = useCallback(async (pluginId: string) => {
    setPlugins(prev => prev.map(plugin =>
      plugin.id === pluginId ? { ...plugin, updatesAvailable: false } : plugin
    ));
    toast.success('Plugin updated successfully!');
  }, []);

  const handleConnectIntegration = useCallback(async (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId 
        ? { ...integration, connected: true, status: 'active', lastSync: new Date() }
        : integration
    ));
    toast.success('Integration connected successfully!');
  }, []);

  const handleDisconnectIntegration = useCallback(async (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId 
        ? { ...integration, connected: false, status: 'inactive' }
        : integration
    ));
    toast.success('Integration disconnected!');
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development':
        return <Code className="w-4 h-4" />;
      case 'design':
        return <Palette className="w-4 h-4" />;
      case 'productivity':
        return <Zap className="w-4 h-4" />;
      case 'analytics':
        return <TrendingUp className="w-4 h-4" />;
      case 'automation':
        return <Settings className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'communication':
        return <Users className="w-4 h-4" />;
      case 'storage':
        return <Database className="w-4 h-4" />;
      case 'deployment':
        return <Cloud className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Puzzle className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">Plugin Manager & Integration Hub</h1>
            <p className="text-sm text-muted-foreground">
              Extend functionality and connect with external services
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{installedCount}</div>
              <div className="text-xs text-muted-foreground">Installed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">{connectedCount}</div>
              <div className="text-xs text-muted-foreground">Connected</div>
            </div>
            {updatesAvailable > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-warning">{updatesAvailable}</div>
                <div className="text-xs text-muted-foreground">Updates</div>
              </div>
            )}
          </div>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ff-hover-scale">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plugins" className="flex items-center gap-2">
              <Puzzle className="w-4 h-4" />
              Plugin Marketplace
              {updatesAvailable > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {updatesAvailable}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Developer Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plugins" className="mt-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 ff-focus-ring"
                />
              </div>

              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.id)}
                          <span>{category.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {category.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="recent">Recently Updated</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="ff-hover-scale"
                >
                  {getCategoryIcon(category.id)}
                  <span className="ml-2">{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Plugin Grid */}
            {filteredPlugins.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No plugins found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlugins.map((plugin) => (
                  <Card key={plugin.id} className="ff-card-interactive ff-hover-lift">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{plugin.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm line-clamp-1">{plugin.name}</h3>
                              {plugin.verified && (
                                <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                                  <Check className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{plugin.author}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {plugin.updatesAvailable && (
                            <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                              Update
                            </Badge>
                          )}
                          {plugin.installed && (
                            <Badge variant="default" className="text-xs bg-primary/10 text-primary">
                              Installed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plugin.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          {plugin.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {plugin.downloads.toLocaleString()}
                        </div>
                        <div>v{plugin.version}</div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {plugin.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                        </div>

                        <div className="flex items-center gap-2">
                          {plugin.installed ? (
                            <>
                              {plugin.updatesAvailable && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdatePlugin(plugin.id)}
                                  className="text-xs"
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Update
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTogglePlugin(plugin.id)}
                                className="text-xs"
                              >
                                {plugin.enabled ? (
                                  <>
                                    <Pause className="w-3 h-3 mr-1" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 mr-1" />
                                    Enable
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedPlugin(plugin)}
                                className="text-xs"
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedPlugin(plugin)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleInstallPlugin(plugin.id)}
                                className="ff-btn-primary text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Install
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="integrations" className="mt-6 space-y-6">
            {/* Integration Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 ff-focus-ring"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] ff-focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {integrationCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category.id)}
                        <span>{category.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="ff-card-interactive">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">{integration.provider}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        {integration.connected && (
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {integration.description}
                    </p>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Features</Label>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.slice(0, 4).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{integration.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {integration.connected && (
                      <div className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync.toLocaleString()}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge 
                          variant="outline" 
                          className={
                            integration.setupComplexity === 'easy' ? 'border-success/20 text-success' :
                            integration.setupComplexity === 'medium' ? 'border-warning/20 text-warning' :
                            'border-destructive/20 text-destructive'
                          }
                        >
                          {integration.setupComplexity}
                        </Badge>
                        <span>setup</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIntegration(integration)}
                          className="text-xs"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                        {integration.connected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnectIntegration(integration.id)}
                            className="text-xs text-destructive"
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnectIntegration(integration.id)}
                            className="ff-btn-primary text-xs"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="developer" className="mt-6 space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Developer Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Plugin Development</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="w-4 h-4 mr-2" />
                        Plugin SDK Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="w-4 h-4 mr-2" />
                        Create New Plugin
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Plugin
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Integration Development</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        API Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Webhook Configuration
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Integration Examples
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Testing & Debugging</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Play className="w-4 h-4 mr-2" />
                      Test Environment
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Debug Console
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Performance Monitor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Plugin Detail Modal */}
      {selectedPlugin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto ff-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedPlugin.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPlugin.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedPlugin.author}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPlugin(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{selectedPlugin.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{selectedPlugin.rating}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{selectedPlugin.downloads.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{formatFileSize(selectedPlugin.size * 1024 * 1024)}</div>
                  <div className="text-xs text-muted-foreground">Size</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">v{selectedPlugin.version}</div>
                  <div className="text-xs text-muted-foreground">Version</div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Permissions Required</Label>
                <div className="space-y-2">
                  {selectedPlugin.permissions.map(permission => (
                    <div key={permission} className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-warning" />
                      {permission}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Compatibility</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedPlugin.compatibility.map(comp => (
                    <Badge key={comp} variant="outline">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {selectedPlugin.installed ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleUninstallPlugin(selectedPlugin.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Uninstall
                    </Button>
                    <Button
                      onClick={() => handleTogglePlugin(selectedPlugin.id)}
                      className="flex-1 ff-btn-primary"
                    >
                      {selectedPlugin.enabled ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleInstallPlugin(selectedPlugin.id)}
                    className="flex-1 ff-btn-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install Plugin
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto ff-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedIntegration.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedIntegration.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedIntegration.provider}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIntegration(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{selectedIntegration.description}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge className={getStatusColor(selectedIntegration.status)}>
                    {selectedIntegration.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sync Frequency</span>
                  <span className="text-sm">{selectedIntegration.syncFrequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Setup Complexity</span>
                  <Badge 
                    variant="outline"
                    className={
                      selectedIntegration.setupComplexity === 'easy' ? 'border-success/20 text-success' :
                      selectedIntegration.setupComplexity === 'medium' ? 'border-warning/20 text-warning' :
                      'border-destructive/20 text-destructive'
                    }
                  >
                    {selectedIntegration.setupComplexity}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Available Features</Label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedIntegration.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {selectedIntegration.connected && (
                <div className="space-y-3">
                  <Label>Configuration</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <Select defaultValue={selectedIntegration.syncFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Every hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                {selectedIntegration.connected ? (
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnectIntegration(selectedIntegration.id)}
                    className="flex-1 text-destructive"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnectIntegration(selectedIntegration.id)}
                    className="flex-1 ff-btn-primary"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PluginManagerIntegrationHub;