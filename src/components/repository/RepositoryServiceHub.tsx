/**
 * @fileoverview Repository Service Integration Hub for FlashFusion
 * @chunk repository
 * @category services
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Central hub for connecting and managing all external services:
 * GitHub, Vercel, Notion, Supabase, GitHub Actions, and more
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
  Github,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Cloud,
  Database,
  Book,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Sync,
  Webhook,
  Key,
  Lock,
  Unlock,
  Zap,
  Activity,
  BarChart3,
  Code,
  FileCode,
  Globe,
  Link as LinkIcon,
  Monitor,
  Package,
  Server,
  Shield,
  Terminal,
  Users,
  Workflow,
  ArrowRight,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Target,
  Layers,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  MessageSquare,
  Bell,
  Mail,
  Phone,
  Home,
  Building,
  Briefcase
} from 'lucide-react';

// Service Configuration Types
interface ServiceConfig {
  id: string;
  name: string;
  category: 'repository' | 'deployment' | 'database' | 'productivity' | 'monitoring' | 'communication';
  icon: any;
  color: string;
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  description: string;
  features: string[];
  connectionMethods: ('oauth' | 'token' | 'webhook' | 'api-key')[];
  requiredFields: string[];
  endpoints: {
    auth?: string;
    api?: string;
    webhook?: string;
  };
  documentation: string;
  isCore: boolean;
}

interface RepositoryConnection {
  id: string;
  service: string;
  name: string;
  url: string;
  branch: string;
  lastSync: Date;
  status: 'active' | 'syncing' | 'error' | 'paused';
  commits: number;
  contributors: number;
  isPrivate: boolean;
  framework: string;
  deployUrl?: string;
  environment: 'development' | 'staging' | 'production';
  autoSync: boolean;
  webhookUrl?: string;
}

// Core Services Configuration
const CORE_SERVICES: Record<string, ServiceConfig> = {
  github: {
    id: 'github',
    name: 'GitHub',
    category: 'repository',
    icon: Github,
    color: '#24292f',
    status: 'disconnected',
    description: 'Source code management and version control',
    features: ['Repository hosting', 'Version control', 'Issue tracking', 'Pull requests', 'Actions CI/CD'],
    connectionMethods: ['oauth', 'token'],
    requiredFields: ['username', 'repository'],
    endpoints: {
      auth: 'https://github.com/login/oauth/authorize',
      api: 'https://api.github.com',
      webhook: 'https://api.github.com/repos/{owner}/{repo}/hooks'
    },
    documentation: 'https://docs.github.com/en/rest',
    isCore: true
  },
  
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    category: 'deployment',
    icon: Cloud,
    color: '#000000',
    status: 'disconnected',
    description: 'Frontend deployment and hosting platform',
    features: ['Auto-deployment', 'Edge functions', 'Analytics', 'Custom domains', 'Preview deployments'],
    connectionMethods: ['oauth', 'token'],
    requiredFields: ['project-name'],
    endpoints: {
      auth: 'https://vercel.com/oauth/authorize',
      api: 'https://api.vercel.com',
      webhook: 'https://api.vercel.com/v1/integrations/webhooks'
    },
    documentation: 'https://vercel.com/docs/rest-api',
    isCore: true
  },
  
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    icon: Database,
    color: '#3ecf8e',
    status: 'disconnected',
    description: 'Backend as a Service with PostgreSQL database',
    features: ['PostgreSQL database', 'Authentication', 'Real-time subscriptions', 'Edge functions', 'Storage'],
    connectionMethods: ['api-key'],
    requiredFields: ['project-url', 'anon-key', 'service-role-key'],
    endpoints: {
      api: 'https://{project}.supabase.co/rest/v1'
    },
    documentation: 'https://supabase.com/docs/reference/javascript',
    isCore: true
  },
  
  notion: {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    icon: Book,
    color: '#000000',
    status: 'disconnected',
    description: 'Workspace for documentation and project management',
    features: ['Documentation', 'Project planning', 'Knowledge base', 'Team collaboration', 'API integration'],
    connectionMethods: ['oauth', 'token'],
    requiredFields: ['workspace-id'],
    endpoints: {
      auth: 'https://api.notion.com/v1/oauth/authorize',
      api: 'https://api.notion.com/v1',
      webhook: 'https://api.notion.com/v1/webhooks'
    },
    documentation: 'https://developers.notion.com/reference',
    isCore: true
  },
  
  'github-actions': {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'deployment',
    icon: Workflow,
    color: '#2088ff',
    status: 'disconnected',
    description: 'CI/CD automation and workflow management',
    features: ['Automated testing', 'Deployment pipelines', 'Code analysis', 'Custom workflows', 'Matrix builds'],
    connectionMethods: ['token'],
    requiredFields: ['repository', 'workflows'],
    endpoints: {
      api: 'https://api.github.com/repos/{owner}/{repo}/actions'
    },
    documentation: 'https://docs.github.com/en/rest/actions',
    isCore: true
  }
};

export function RepositoryServiceHub() {
  const [services, setServices] = useState<Record<string, ServiceConfig>>(CORE_SERVICES);
  const [repositories, setRepositories] = useState<RepositoryConnection[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [connectionDialog, setConnectionDialog] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock repository connections
  useEffect(() => {
    const mockRepositories: RepositoryConnection[] = [
      {
        id: '1',
        service: 'github',
        name: 'flashfusion-app',
        url: 'https://github.com/user/flashfusion-app',
        branch: 'main',
        lastSync: new Date('2024-01-15T10:30:00'),
        status: 'active',
        commits: 247,
        contributors: 3,
        isPrivate: true,
        framework: 'React + TypeScript',
        deployUrl: 'https://flashfusion-app.vercel.app',
        environment: 'production',
        autoSync: true,
        webhookUrl: 'https://flashfusion.app/webhooks/github'
      },
      {
        id: '2',
        service: 'vercel',
        name: 'flashfusion-staging',
        url: 'https://flashfusion-staging.vercel.app',
        branch: 'develop',
        lastSync: new Date('2024-01-15T09:15:00'),
        status: 'syncing',
        commits: 156,
        contributors: 2,
        isPrivate: false,
        framework: 'Next.js',
        environment: 'staging',
        autoSync: true
      }
    ];
    
    setRepositories(mockRepositories);
    
    // Update service status based on connections
    setServices(prev => ({
      ...prev,
      github: { ...prev.github, status: 'connected' },
      vercel: { ...prev.vercel, status: 'connected' }
    }));
  }, []);

  // Filter services and repositories
  const filteredServices = Object.values(services).filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique categories
  const categories = ['all', ...new Set(Object.values(services).map(s => s.category))];

  const handleServiceConnect = async (serviceId: string) => {
    setServices(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], status: 'connecting' }
    }));

    // Simulate connection process
    setTimeout(() => {
      setServices(prev => ({
        ...prev,
        [serviceId]: { ...prev[serviceId], status: 'connected' }
      }));
      setConnectionDialog(false);
    }, 2000);
  };

  const handleRepositorySync = async (repoId: string) => {
    setRepositories(prev => prev.map(repo =>
      repo.id === repoId ? { ...repo, status: 'syncing' } : repo
    ));

    // Simulate sync process
    setTimeout(() => {
      setRepositories(prev => prev.map(repo =>
        repo.id === repoId 
          ? { ...repo, status: 'active', lastSync: new Date() }
          : repo
      ));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'text-success border-success/20 bg-success/10';
      case 'connecting':
      case 'syncing': return 'text-warning border-warning/20 bg-warning/10';
      case 'error': return 'text-error border-error/20 bg-error/10';
      case 'disconnected':
      case 'paused': return 'text-muted border-muted/20 bg-muted/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return CheckCircle;
      case 'connecting':
      case 'syncing': return RefreshCw;
      case 'error': return XCircle;
      case 'disconnected':
      case 'paused': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first responsive container */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Responsive Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-2">
              <h1 className="ff-text-display text-2xl sm:text-3xl lg:text-4xl">
                Repository & Service Hub
              </h1>
              <p className="ff-text-body text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                Connect and manage GitHub, Vercel, Supabase, Notion, and GitHub Actions
              </p>
            </div>
            
            {/* Mobile-optimized buttons */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <Button
                variant={debugMode ? "default" : "outline"}
                onClick={() => setDebugMode(!debugMode)}
                className="w-full sm:w-auto"
              >
                <Terminal className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Debug</span>
                <span className="hidden sm:inline">Debug Mode</span>
              </Button>
              
              <Button
                onClick={() => setConnectionDialog(true)}
                className="ff-btn-primary w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Connect</span>
                <span className="hidden sm:inline">Connect Service</span>
              </Button>
            </div>
          </div>

          {/* Responsive Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="ff-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">
                      Connected Services
                    </p>
                    <p className="ff-text-title text-lg sm:text-2xl font-bold">
                      {Object.values(services).filter(s => s.status === 'connected').length}
                    </p>
                  </div>
                  <ProfessionalIcon 
                    icon={Network} 
                    size="md" 
                    variant="functional" 
                    context="primary"
                    className="hidden sm:block"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="ff-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">
                      Active Repos
                    </p>
                    <p className="ff-text-title text-lg sm:text-2xl font-bold">
                      {repositories.filter(r => r.status === 'active').length}
                    </p>
                  </div>
                  <ProfessionalIcon 
                    icon={GitBranch} 
                    size="md" 
                    variant="functional" 
                    context="success"
                    className="hidden sm:block"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="ff-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">
                      Total Commits
                    </p>
                    <p className="ff-text-title text-lg sm:text-2xl font-bold">
                      {repositories.reduce((sum, repo) => sum + repo.commits, 0)}
                    </p>
                  </div>
                  <ProfessionalIcon 
                    icon={GitCommit} 
                    size="md" 
                    variant="functional" 
                    context="secondary"
                    className="hidden sm:block"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="ff-card col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">
                      Auto-Sync
                    </p>
                    <p className="ff-text-title text-lg sm:text-2xl font-bold">
                      {repositories.filter(r => r.autoSync).length}
                    </p>
                  </div>
                  <ProfessionalIcon 
                    icon={Sync} 
                    size="md" 
                    variant="functional" 
                    context="accent"
                    className="hidden sm:block"
                  />
                </div>
              </CardContent>
            </Card>
        </div>

          {/* Responsive Tabs */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="services" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="sm:hidden">Services</span>
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="repositories" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="sm:hidden">Repos</span>
                <span className="hidden sm:inline">Repositories</span>
              </TabsTrigger>
              <TabsTrigger value="workflows" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="sm:hidden">Flows</span>
                <span className="hidden sm:inline">Workflows</span>
              </TabsTrigger>
              <TabsTrigger value="debug" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="sm:hidden">Debug</span>
                <span className="hidden sm:inline">Debug & Logs</span>
              </TabsTrigger>
            </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            
            {/* Responsive Search and Filters */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-9"
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto min-w-[160px] px-3 py-2 bg-card border border-border rounded-md text-sm h-10 sm:h-9"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Responsive Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredServices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                
                return (
                  <Card key={service.id} className="ff-card-interactive">
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${service.color}20` }}
                          >
                            <ProfessionalIcon 
                              icon={service.icon} 
                              size="md" 
                              style={{ color: service.color }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="ff-text-title text-base sm:text-lg truncate">{service.name}</CardTitle>
                            <Badge variant="outline" className="text-xs capitalize mt-1">
                              {service.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <Badge className={`${getStatusColor(service.status)} capitalize flex-shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">{service.status}</span>
                          <span className="sm:hidden">{service.status.charAt(0).toUpperCase()}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 p-4 sm:p-6">
                      <p className="ff-text-caption text-muted-foreground text-sm line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div>
                        <p className="ff-text-caption font-medium mb-2 text-sm">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 2).map(feature => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {service.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="ff-text-caption font-medium mb-2 text-sm">Connection:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.connectionMethods.slice(0, 2).map(method => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method === 'oauth' && <Shield className="w-3 h-3 mr-1" />}
                              {method === 'token' && <Key className="w-3 h-3 mr-1" />}
                              {method === 'webhook' && <Webhook className="w-3 h-3 mr-1" />}
                              {method === 'api-key' && <Lock className="w-3 h-3 mr-1" />}
                              <span className="hidden sm:inline">{method.replace('-', ' ').toUpperCase()}</span>
                              <span className="sm:hidden">{method.charAt(0).toUpperCase()}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex items-center gap-2">
                          {service.status === 'connected' ? (
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                              <Settings className="w-3 h-3 mr-1" />
                              <span className="sm:hidden">Config</span>
                              <span className="hidden sm:inline">Configure</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1 sm:flex-none"
                              onClick={() => {
                                setSelectedService(service.id);
                                setConnectionDialog(true);
                              }}
                            >
                              <LinkIcon className="w-3 h-3 mr-1" />
                              Connect
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(service.documentation, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {service.isCore && (
                          <Badge variant="outline" className="text-xs self-start sm:self-center">
                            Core
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Repositories Tab */}
          <TabsContent value="repositories" className="space-y-6">
            
            {/* Repository Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="ff-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ProfessionalIcon icon={GitBranch} size="md" context="primary" />
                    <div>
                      <p className="ff-text-caption text-muted-foreground">Active Repos</p>
                      <p className="ff-text-title">{repositories.filter(r => r.status === 'active').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ff-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ProfessionalIcon icon={Users} size="md" context="secondary" />
                    <div>
                      <p className="ff-text-caption text-muted-foreground">Contributors</p>
                      <p className="ff-text-title">
                        {repositories.reduce((sum, repo) => sum + repo.contributors, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ff-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ProfessionalIcon icon={Cloud} size="md" context="accent" />
                    <div>
                      <p className="ff-text-caption text-muted-foreground">Deployed</p>
                      <p className="ff-text-title">
                        {repositories.filter(r => r.deployUrl).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Responsive Repositories List */}
            <div className="space-y-4">
              {filteredRepositories.map((repo) => {
                const StatusIcon = getStatusIcon(repo.status);
                const serviceConfig = services[repo.service];
                
                return (
                  <Card key={repo.id} className="ff-card">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${serviceConfig?.color || '#666'}20` }}
                          >
                            <ProfessionalIcon 
                              icon={serviceConfig?.icon || Github} 
                              size="md" 
                              style={{ color: serviceConfig?.color || '#666' }}
                            />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 mb-3">
                              <h3 className="ff-text-title text-lg sm:text-xl truncate">{repo.name}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${getStatusColor(repo.status)} capitalize`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {repo.status}
                                </Badge>
                                {repo.isPrivate && (
                                  <Badge variant="outline" className="text-xs">
                                    <Lock className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">Private</span>
                                    <span className="sm:hidden">Priv</span>
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                              <div className="min-w-0">
                                <p className="ff-text-caption text-muted-foreground text-xs">Branch</p>
                                <p className="ff-text-body truncate">{repo.branch}</p>
                              </div>
                              <div className="min-w-0">
                                <p className="ff-text-caption text-muted-foreground text-xs">Framework</p>
                                <p className="ff-text-body truncate">{repo.framework}</p>
                              </div>
                              <div className="min-w-0">
                                <p className="ff-text-caption text-muted-foreground text-xs">Commits</p>
                                <p className="ff-text-body">{repo.commits}</p>
                              </div>
                              <div className="min-w-0">
                                <p className="ff-text-caption text-muted-foreground text-xs">Last Sync</p>
                                <p className="ff-text-body text-xs sm:text-sm">{repo.lastSync.toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(repo.url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Open Repo</span>
                                <span className="sm:hidden">Repo</span>
                              </Button>
                              
                              {repo.deployUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(repo.deployUrl, '_blank')}
                                >
                                  <Globe className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">View Deploy</span>
                                  <span className="sm:hidden">Deploy</span>
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRepositorySync(repo.id)}
                                disabled={repo.status === 'syncing'}
                              >
                                <RefreshCw className={`w-3 h-3 mr-1 ${repo.status === 'syncing' ? 'animate-spin' : ''}`} />
                                Sync
                              </Button>
                              
                              <Button variant="ghost" size="sm">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between lg:flex-col lg:items-end lg:text-right lg:space-y-2">
                          <Badge variant="outline" className="capitalize">
                            {repo.environment}
                          </Badge>
                          {repo.autoSync && (
                            <div className="flex items-center gap-1 text-xs text-success">
                              <CheckCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">Auto-sync enabled</span>
                              <span className="sm:hidden">Auto-sync</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <WorkflowsPanel />
          </TabsContent>

          {/* Debug Tab */}
          <TabsContent value="debug" className="space-y-6">
            <DebugPanel debugMode={debugMode} services={services} repositories={repositories} />
          </TabsContent>
        </Tabs>

        {/* Responsive Connection Dialog */}
        <Dialog open={connectionDialog} onOpenChange={setConnectionDialog}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="ff-text-title text-lg sm:text-xl">
                Connect Service
                {selectedService && (
                  <span className="block sm:inline sm:ml-1 text-muted-foreground font-normal text-base">
                    {services[selectedService]?.name}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedService && (
              <ServiceConnectionForm 
                service={services[selectedService]}
                onConnect={() => handleServiceConnect(selectedService)}
                onCancel={() => setConnectionDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Service Connection Form Component
interface ServiceConnectionFormProps {
  service: ServiceConfig;
  onConnect: () => void;
  onCancel: () => void;
}

function ServiceConnectionForm({ service, onConnect, onCancel }: ServiceConnectionFormProps) {
  const [selectedMethod, setSelectedMethod] = useState(service.connectionMethods[0]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${service.color}20` }}
        >
          <ProfessionalIcon 
            icon={service.icon} 
            size="lg" 
            style={{ color: service.color }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="ff-text-title text-lg">{service.name}</h3>
          <p className="ff-text-caption text-muted-foreground text-sm line-clamp-2">{service.description}</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="connection-method" className="text-sm">Connection Method</Label>
        <select
          id="connection-method"
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as any)}
          className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm mt-1 h-10"
        >
          {service.connectionMethods.map(method => (
            <option key={method} value={method}>
              {method.replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {service.requiredFields.map(field => (
          <div key={field}>
            <Label htmlFor={field} className="text-sm">
              {field.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Label>
            <Input
              id={field}
              type={field.includes('key') || field.includes('token') ? 'password' : 'text'}
              placeholder={`Enter ${field.replace('-', ' ')}`}
              value={formData[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="mt-1 h-10"
            />
          </div>
        ))}
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          This will establish a secure connection to {service.name} using {selectedMethod} authentication.
          You can modify these settings later in the service configuration panel.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        
        <Button onClick={onConnect} className="w-full sm:w-auto">
          <LinkIcon className="w-4 h-4 mr-2" />
          Connect {service.name}
        </Button>
      </div>
    </div>
  );
}

// Workflows Panel Component
function WorkflowsPanel() {
  return (
    <div className="space-y-6">
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">GitHub Actions Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="ff-text-body font-semibold">CI/CD Pipeline</h4>
                <Badge className="text-success border-success/20 bg-success/10">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="ff-text-caption text-muted-foreground mb-3">
                Automated testing, building, and deployment pipeline
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3 mr-1" />
                  View Logs
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="ff-text-body font-semibold">Security Scan</h4>
                <Badge className="text-warning border-warning/20 bg-warning/10">
                  <Clock className="w-3 h-3 mr-1" />
                  Scheduled
                </Badge>
              </div>
              <p className="ff-text-caption text-muted-foreground mb-3">
                Daily security vulnerability scanning
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Shield className="w-3 h-3 mr-1" />
                  Configure
                </Button>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Reports
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Debug Panel Component
interface DebugPanelProps {
  debugMode: boolean;
  services: Record<string, ServiceConfig>;
  repositories: RepositoryConnection[];
}

function DebugPanel({ debugMode, services, repositories }: DebugPanelProps) {
  const [logs, setLogs] = useState([
    { time: new Date(), level: 'info', service: 'github', message: 'Repository sync completed successfully' },
    { time: new Date(), level: 'warning', service: 'vercel', message: 'Deployment took longer than expected' },
    { time: new Date(), level: 'error', service: 'notion', message: 'API rate limit exceeded' }
  ]);

  return (
    <div className="space-y-6">
      {debugMode && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            Debug mode is enabled. You can see detailed logs and system information.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.values(services).map(service => (
                <div key={service.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfessionalIcon icon={service.icon} size="sm" />
                    <span className="ff-text-body">{service.name}</span>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono p-2 bg-muted rounded">
                    <span className="text-muted-foreground">
                      {log.time.toLocaleTimeString()}
                    </span>
                    <span className={`ml-2 ${
                      log.level === 'error' ? 'text-error' :
                      log.level === 'warning' ? 'text-warning' : 'text-success'
                    }`}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="ml-2 text-primary">{log.service}:</span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}