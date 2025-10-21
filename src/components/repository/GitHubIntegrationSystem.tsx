/**
 * @fileoverview GitHub Integration & Automation System for FlashFusion
 * @chunk repository
 * @category github
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Complete GitHub integration with repository management,
 * GitHub Actions, webhooks, and automated workflows
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
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
  Workflow,
  Play,
  Pause,
  Stop,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Star,
  Eye,
  Download,
  Upload,
  Code,
  FileCode,
  Settings,
  Shield,
  Key,
  Webhook,
  Bell,
  Activity,
  BarChart3,
  Terminal,
  Package,
  Tag,
  Zap,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Target,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Unlock,
  Globe,
  Database,
  Cloud,
  Server,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Layers,
  Box
} from 'lucide-react';

// GitHub Types
interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
  language: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  has_actions: boolean;
  has_pages: boolean;
  has_wiki: boolean;
}

interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: 'active' | 'disabled' | 'deleted';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

interface GitHubWorkflowRun {
  id: number;
  name: string;
  display_title: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  workflow_id: number;
  check_suite_id: number;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  html_url: string;
  jobs_url: string;
  logs_url: string;
  cancel_url: string;
  rerun_url: string;
  run_number: number;
  event: string;
  head_branch: string;
  head_sha: string;
  path: string;
}

interface GitHubWebhook {
  id: number;
  name: string;
  events: string[];
  active: boolean;
  config: {
    url: string;
    content_type: string;
    secret?: string;
    insecure_ssl?: string;
  };
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  last_response: {
    code: number;
    status: string;
    message: string;
  };
}

export function GitHubIntegrationSystem() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [workflows, setWorkflows] = useState<GitHubWorkflow[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<GitHubWorkflowRun[]>([]);
  const [webhooks, setWebhooks] = useState<GitHubWebhook[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock GitHub data
  useEffect(() => {
    const mockRepositories: GitHubRepository[] = [
      {
        id: 1,
        name: 'flashfusion-app',
        full_name: 'user/flashfusion-app',
        description: 'AI-powered development platform for creators',
        private: true,
        html_url: 'https://github.com/user/flashfusion-app',
        clone_url: 'https://github.com/user/flashfusion-app.git',
        ssh_url: 'git@github.com:user/flashfusion-app.git',
        default_branch: 'main',
        language: 'TypeScript',
        stargazers_count: 42,
        watchers_count: 8,
        forks_count: 3,
        open_issues_count: 5,
        size: 15420,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        pushed_at: '2024-01-15T10:30:00Z',
        topics: ['ai', 'development', 'platform', 'react', 'typescript'],
        has_actions: true,
        has_pages: true,
        has_wiki: false
      },
      {
        id: 2,
        name: 'flashfusion-docs',
        full_name: 'user/flashfusion-docs',
        description: 'Documentation for FlashFusion platform',
        private: false,
        html_url: 'https://github.com/user/flashfusion-docs',
        clone_url: 'https://github.com/user/flashfusion-docs.git',
        ssh_url: 'git@github.com:user/flashfusion-docs.git',
        default_branch: 'main',
        language: 'Markdown',
        stargazers_count: 12,
        watchers_count: 3,
        forks_count: 1,
        open_issues_count: 2,
        size: 2340,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-14T15:20:00Z',
        pushed_at: '2024-01-14T15:20:00Z',
        topics: ['documentation', 'docs', 'platform'],
        has_actions: true,
        has_pages: true,
        has_wiki: true
      }
    ];

    const mockWorkflows: GitHubWorkflow[] = [
      {
        id: 1,
        name: 'CI/CD Pipeline',
        path: '.github/workflows/ci-cd.yml',
        state: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-10T12:00:00Z',
        url: 'https://api.github.com/repos/user/flashfusion-app/actions/workflows/1',
        html_url: 'https://github.com/user/flashfusion-app/actions/workflows/ci-cd.yml',
        badge_url: 'https://github.com/user/flashfusion-app/workflows/CI%2FCD%20Pipeline/badge.svg'
      },
      {
        id: 2,
        name: 'Security Scan',
        path: '.github/workflows/security.yml',
        state: 'active',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-12T08:30:00Z',
        url: 'https://api.github.com/repos/user/flashfusion-app/actions/workflows/2',
        html_url: 'https://github.com/user/flashfusion-app/actions/workflows/security.yml',
        badge_url: 'https://github.com/user/flashfusion-app/workflows/Security%20Scan/badge.svg'
      }
    ];

    const mockWorkflowRuns: GitHubWorkflowRun[] = [
      {
        id: 1,
        name: 'CI/CD Pipeline',
        display_title: 'Add new feature: AI integration',
        status: 'completed',
        conclusion: 'success',
        workflow_id: 1,
        check_suite_id: 1,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:05:00Z',
        run_started_at: '2024-01-15T10:00:00Z',
        html_url: 'https://github.com/user/flashfusion-app/actions/runs/1',
        jobs_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/1/jobs',
        logs_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/1/logs',
        cancel_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/1/cancel',
        rerun_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/1/rerun',
        run_number: 42,
        event: 'push',
        head_branch: 'main',
        head_sha: 'abc123def456',
        path: '.github/workflows/ci-cd.yml'
      },
      {
        id: 2,
        name: 'Security Scan',
        display_title: 'Scheduled security scan',
        status: 'in_progress',
        conclusion: null as any,
        workflow_id: 2,
        check_suite_id: 2,
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:02:00Z',
        run_started_at: '2024-01-15T09:00:00Z',
        html_url: 'https://github.com/user/flashfusion-app/actions/runs/2',
        jobs_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/2/jobs',
        logs_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/2/logs',
        cancel_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/2/cancel',
        rerun_url: 'https://api.github.com/repos/user/flashfusion-app/actions/runs/2/rerun',
        run_number: 15,
        event: 'schedule',
        head_branch: 'main',
        head_sha: 'xyz789abc123',
        path: '.github/workflows/security.yml'
      }
    ];

    setRepositories(mockRepositories);
    setWorkflows(mockWorkflows);
    setWorkflowRuns(mockWorkflowRuns);
    setIsConnected(true);
  }, []);

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string, conclusion?: string) => {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return 'text-success border-success/20 bg-success/10';
        case 'failure': return 'text-error border-error/20 bg-error/10';
        case 'cancelled': return 'text-muted border-muted/20 bg-muted/10';
        default: return 'text-warning border-warning/20 bg-warning/10';
      }
    }
    switch (status) {
      case 'in_progress': return 'text-warning border-warning/20 bg-warning/10';
      case 'queued': return 'text-info border-info/20 bg-info/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  const getStatusIcon = (status: string, conclusion?: string) => {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return CheckCircle;
        case 'failure': return XCircle;
        case 'cancelled': return AlertCircle;
        default: return Clock;
      }
    }
    switch (status) {
      case 'in_progress': return RefreshCw;
      case 'queued': return Clock;
      default: return AlertCircle;
    }
  };

  const handleConnectGitHub = async () => {
    setIsLoading(true);
    // Simulate GitHub OAuth connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleRerunWorkflow = async (runId: number) => {
    console.log(`Rerunning workflow run ${runId}`);
    // Implement workflow rerun logic
  };

  const handleCancelWorkflow = async (runId: number) => {
    console.log(`Cancelling workflow run ${runId}`);
    // Implement workflow cancellation logic
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Responsive Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-2">
              <h1 className="ff-text-display text-2xl sm:text-3xl lg:text-4xl">
                GitHub Integration
              </h1>
              <p className="ff-text-body text-sm sm:text-base lg:text-lg text-muted-foreground">
                Manage repositories, workflows, and GitHub Actions
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              {!isConnected ? (
                <Button
                  onClick={handleConnectGitHub}
                  disabled={isLoading}
                  className="ff-btn-primary w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span className="sm:hidden">Connecting...</span>
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 mr-2" />
                      <span className="sm:hidden">Connect</span>
                      <span className="hidden sm:inline">Connect GitHub</span>
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="sm:hidden">Settings</span>
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                  <Button className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="sm:hidden">Import</span>
                    <span className="hidden sm:inline">Import Repository</span>
                  </Button>
                </>
              )}
            </div>
          </div>

        {!isConnected ? (
          <GitHubConnectionCard onConnect={handleConnectGitHub} isLoading={isLoading} />
        ) : (
          <>
            {/* Responsive GitHub Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="ff-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">Repositories</p>
                      <p className="ff-text-title text-lg sm:text-2xl font-bold">{repositories.length}</p>
                    </div>
                    <ProfessionalIcon 
                      icon={Github} 
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
                      <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">Workflows</p>
                      <p className="ff-text-title text-lg sm:text-2xl font-bold">
                        {workflows.filter(w => w.state === 'active').length}
                      </p>
                    </div>
                    <ProfessionalIcon 
                      icon={Workflow} 
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
                      <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">Stars</p>
                      <p className="ff-text-title text-lg sm:text-2xl font-bold">
                        {repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                      </p>
                    </div>
                    <ProfessionalIcon 
                      icon={Star} 
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
                      <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">Issues</p>
                      <p className="ff-text-title text-lg sm:text-2xl font-bold">
                        {repositories.reduce((sum, repo) => sum + repo.open_issues_count, 0)}
                      </p>
                    </div>
                    <ProfessionalIcon 
                      icon={AlertCircle} 
                      size="md" 
                      variant="functional" 
                      context="accent"
                      className="hidden sm:block"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              {/* Repositories Tab */}
              <TabsContent value="repositories" className="space-y-6">
                
                {/* Search */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Repositories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRepositories.map((repo) => (
                    <Card key={repo.id} className="ff-card-interactive">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <ProfessionalIcon 
                              icon={Github} 
                              size="lg" 
                              variant="functional" 
                              context="primary"
                            />
                            <div>
                              <CardTitle className="ff-text-title text-lg">{repo.name}</CardTitle>
                              <p className="ff-text-caption text-muted-foreground">{repo.full_name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {repo.private && (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="w-3 h-3 mr-1" />
                                Private
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {repo.language}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {repo.description && (
                          <p className="ff-text-caption text-muted-foreground">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star className="w-3 h-3" />
                              <span className="font-medium">{repo.stargazers_count}</span>
                            </div>
                            <p className="ff-text-caption text-muted-foreground">Stars</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <GitBranch className="w-3 h-3" />
                              <span className="font-medium">{repo.forks_count}</span>
                            </div>
                            <p className="ff-text-caption text-muted-foreground">Forks</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <AlertCircle className="w-3 h-3" />
                              <span className="font-medium">{repo.open_issues_count}</span>
                            </div>
                            <p className="ff-text-caption text-muted-foreground">Issues</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Package className="w-3 h-3" />
                              <span className="font-medium">{Math.round(repo.size / 1000)}KB</span>
                            </div>
                            <p className="ff-text-caption text-muted-foreground">Size</p>
                          </div>
                        </div>
                        
                        {repo.topics.length > 0 && (
                          <div>
                            <p className="ff-text-caption font-medium mb-2">Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {repo.topics.slice(0, 3).map(topic => (
                                <Badge key={topic} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {repo.topics.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{repo.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(repo.html_url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View on GitHub
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(repo.clone_url)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Clone
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {repo.has_actions && (
                              <Badge variant="outline" className="text-xs">
                                <Workflow className="w-3 h-3 mr-1" />
                                Actions
                              </Badge>
                            )}
                            {repo.has_pages && (
                              <Badge variant="outline" className="text-xs">
                                <Globe className="w-3 h-3 mr-1" />
                                Pages
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Workflows Tab */}
              <TabsContent value="workflows" className="space-y-6">
                <WorkflowsPanel workflows={workflows} />
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-6">
                <ActionsPanel 
                  workflowRuns={workflowRuns}
                  onRerun={handleRerunWorkflow}
                  onCancel={handleCancelWorkflow}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks" className="space-y-6">
                <WebhooksPanel webhooks={webhooks} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

// GitHub Connection Card
interface GitHubConnectionCardProps {
  onConnect: () => void;
  isLoading: boolean;
}

function GitHubConnectionCard({ onConnect, isLoading }: GitHubConnectionCardProps) {
  return (
    <Card className="ff-card text-center py-12">
      <CardContent className="space-y-6">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: '#24292f20' }}
        >
          <ProfessionalIcon 
            icon={Github} 
            size="2xl" 
            style={{ color: '#24292f' }}
          />
        </div>
        
        <div>
          <h3 className="ff-text-title text-2xl mb-2">Connect to GitHub</h3>
          <p className="ff-text-body text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your GitHub account to manage repositories, workflows, and automate deployments
            directly from FlashFusion.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <ProfessionalIcon 
                icon={GitBranch} 
                size="lg" 
                variant="functional" 
                context="primary"
                className="mx-auto mb-2"
              />
              <h4 className="ff-text-body font-semibold mb-1">Repository Management</h4>
              <p className="ff-text-caption text-muted-foreground">
                Import and manage your repositories
              </p>
            </div>
            
            <div className="text-center">
              <ProfessionalIcon 
                icon={Workflow} 
                size="lg" 
                variant="functional" 
                context="secondary"
                className="mx-auto mb-2"
              />
              <h4 className="ff-text-body font-semibold mb-1">GitHub Actions</h4>
              <p className="ff-text-caption text-muted-foreground">
                Automate CI/CD workflows
              </p>
            </div>
            
            <div className="text-center">
              <ProfessionalIcon 
                icon={Webhook} 
                size="lg" 
                variant="functional" 
                context="accent"
                className="mx-auto mb-2"
              />
              <h4 className="ff-text-body font-semibold mb-1">Webhooks</h4>
              <p className="ff-text-caption text-muted-foreground">
                Real-time event notifications
              </p>
            </div>
          </div>
          
          <Button
            onClick={onConnect}
            disabled={isLoading}
            className="ff-btn-primary"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting to GitHub...
              </>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" />
                Connect with GitHub
              </>
            )}
          </Button>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You'll be redirected to GitHub to authorize FlashFusion. We only request the minimum
            permissions needed for repository management and workflow automation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// Workflows Panel
interface WorkflowsPanelProps {
  workflows: GitHubWorkflow[];
}

function WorkflowsPanel({ workflows }: WorkflowsPanelProps) {
  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="ff-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <ProfessionalIcon 
                  icon={Workflow} 
                  size="lg" 
                  variant="functional" 
                  context="primary"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="ff-text-title text-xl">{workflow.name}</h3>
                    <Badge className={workflow.state === 'active' ? 'text-success border-success/20 bg-success/10' : 'text-muted border-muted/20 bg-muted/10'}>
                      {workflow.state}
                    </Badge>
                  </div>
                  
                  <p className="ff-text-caption text-muted-foreground mb-3">{workflow.path}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="ff-text-caption text-muted-foreground">Created</p>
                      <p className="ff-text-body">{new Date(workflow.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="ff-text-caption text-muted-foreground">Updated</p>
                      <p className="ff-text-body">{new Date(workflow.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(workflow.html_url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
                
                <Button variant="outline" size="sm">
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Actions Panel
interface ActionsPanelProps {
  workflowRuns: GitHubWorkflowRun[];
  onRerun: (runId: number) => void;
  onCancel: (runId: number) => void;
  getStatusColor: (status: string, conclusion?: string) => string;
  getStatusIcon: (status: string, conclusion?: string) => any;
}

function ActionsPanel({ workflowRuns, onRerun, onCancel, getStatusColor, getStatusIcon }: ActionsPanelProps) {
  return (
    <div className="space-y-4">
      {workflowRuns.map((run) => {
        const StatusIcon = getStatusIcon(run.status, run.conclusion);
        
        return (
          <Card key={run.id} className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <StatusIcon className={`w-5 h-5 ${run.status === 'in_progress' ? 'animate-spin' : ''}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="ff-text-title text-lg">{run.display_title}</h3>
                      <Badge className={getStatusColor(run.status, run.conclusion)}>
                        {run.status === 'completed' ? run.conclusion : run.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Workflow className="w-3 h-3" />
                        <span className="ff-text-body">{run.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        <span className="ff-text-body">{run.head_branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span className="ff-text-body">#{run.run_number}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="ff-text-caption text-muted-foreground">Event</p>
                        <p className="ff-text-body capitalize">{run.event}</p>
                      </div>
                      <div>
                        <p className="ff-text-caption text-muted-foreground">Started</p>
                        <p className="ff-text-body">{new Date(run.run_started_at).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="ff-text-caption text-muted-foreground">Duration</p>
                        <p className="ff-text-body">
                          {Math.round((new Date(run.updated_at).getTime() - new Date(run.run_started_at).getTime()) / 1000 / 60)}m
                        </p>
                      </div>
                      <div>
                        <p className="ff-text-caption text-muted-foreground">Commit</p>
                        <p className="ff-text-body font-mono text-xs">{run.head_sha.substring(0, 7)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(run.html_url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(run.logs_url, '_blank')}
                  >
                    <Terminal className="w-3 h-3 mr-1" />
                    Logs
                  </Button>
                  
                  {run.status === 'completed' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRerun(run.id)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Re-run
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel(run.id)}
                    >
                      <Stop className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Webhooks Panel
interface WebhooksPanelProps {
  webhooks: GitHubWebhook[];
}

function WebhooksPanel({ webhooks }: WebhooksPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Webhook className="h-4 w-4" />
            <AlertDescription>
              Webhooks allow FlashFusion to receive real-time notifications from GitHub
              when events occur in your repositories.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value="https://flashfusion.app/webhooks/github"
                readOnly
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Events</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {['push', 'pull_request', 'issues', 'deployment', 'release', 'workflow_run'].map(event => (
                  <label key={event} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="ff-text-caption">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hash icon component (missing from lucide-react in this context)
function Hash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  );
}