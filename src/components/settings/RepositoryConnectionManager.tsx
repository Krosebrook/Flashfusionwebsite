import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Github, GitBranch, Lock, Unlock, CheckCircle, XCircle, RefreshCw, Link, Unlink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AIService, type RepositoryInfo } from '../../services/AIService';

interface ConnectedRepository extends RepositoryInfo {
  id: string;
  name: string;
  lastAnalyzed?: string;
  status: 'connected' | 'analyzing' | 'error' | 'disconnected';
  analysisResult?: {
    technologies: string[];
    summary: string;
    recommendations: string[];
  };
}

export function RepositoryConnectionManager() {
  const [repositories, setRepositories] = useState<ConnectedRepository[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newRepoForm, setNewRepoForm] = useState({
    url: '',
    branch: 'main',
    accessToken: '',
    provider: 'github' as 'github' | 'gitlab' | 'bitbucket',
    isPrivate: false
  });
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadConnectedRepositories();
  }, []);

  const loadConnectedRepositories = () => {
    const saved = localStorage.getItem('ff_connected_repositories');
    if (saved) {
      try {
        setRepositories(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load repositories:', error);
      }
    }
  };

  const saveRepositories = (repos: ConnectedRepository[]) => {
    localStorage.setItem('ff_connected_repositories', JSON.stringify(repos));
    setRepositories(repos);
  };

  const handleConnectRepository = async () => {
    if (!newRepoForm.url) {
      toast.error('Please enter a repository URL');
      return;
    }

    if (newRepoForm.isPrivate && !newRepoForm.accessToken) {
      toast.error('Access token is required for private repositories');
      return;
    }

    setIsConnecting(true);

    try {
      // Extract repository name from URL
      const repoName = newRepoForm.url.split('/').pop()?.replace('.git', '') || 'Unknown Repository';
      
      const newRepo: ConnectedRepository = {
        id: `repo_${Date.now()}`,
        name: repoName,
        url: newRepoForm.url,
        branch: newRepoForm.branch,
        accessToken: newRepoForm.accessToken,
        provider: newRepoForm.provider,
        isPrivate: newRepoForm.isPrivate,
        status: 'connected',
        lastAnalyzed: new Date().toISOString()
      };

      // Test connection by analyzing the repository
      const analysisResult = await AIService.analyzeRepository(
        newRepoForm.url,
        newRepoForm.branch,
        newRepoForm.accessToken || undefined
      );

      newRepo.analysisResult = {
        technologies: analysisResult.technologies,
        summary: analysisResult.codebase_summary,
        recommendations: analysisResult.recommendations
      };

      const updatedRepos = [...repositories, newRepo];
      saveRepositories(updatedRepos);

      // Reset form
      setNewRepoForm({
        url: '',
        branch: 'main',
        accessToken: '',
        provider: 'github',
        isPrivate: false
      });

      toast.success(`Successfully connected ${repoName}`);
    } catch (error) {
      console.error('Failed to connect repository:', error);
      toast.error(`Failed to connect repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectRepository = (repoId: string) => {
    const updatedRepos = repositories.filter(repo => repo.id !== repoId);
    saveRepositories(updatedRepos);
    toast.success('Repository disconnected');
  };

  const handleReanalyzeRepository = async (repo: ConnectedRepository) => {
    setIsAnalyzing(true);

    try {
      const analysisResult = await AIService.analyzeRepository(
        repo.url,
        repo.branch,
        repo.accessToken || undefined
      );

      const updatedRepos = repositories.map(r => 
        r.id === repo.id 
          ? {
              ...r,
              status: 'connected' as const,
              lastAnalyzed: new Date().toISOString(),
              analysisResult: {
                technologies: analysisResult.technologies,
                summary: analysisResult.codebase_summary,
                recommendations: analysisResult.recommendations
              }
            }
          : r
      );

      saveRepositories(updatedRepos);
      toast.success('Repository re-analyzed successfully');
    } catch (error) {
      console.error('Failed to reanalyze repository:', error);
      
      const updatedRepos = repositories.map(r => 
        r.id === repo.id ? { ...r, status: 'error' as const } : r
      );
      saveRepositories(updatedRepos);
      
      toast.error('Failed to reanalyze repository');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status: ConnectedRepository['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'disconnected':
        return <Unlink className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'gitlab':
        return <div className="h-4 w-4 bg-orange-500 rounded" />;
      case 'bitbucket':
        return <div className="h-4 w-4 bg-blue-600 rounded" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 ff-stagger-fade">
      <div>
        <h2 className="ff-text-gradient mb-2">Repository Connections</h2>
        <p className="text-ff-text-secondary">
          Connect your repositories to enable AI-powered code analysis and context-aware generation.
          FlashFusion can analyze your codebase structure and provide intelligent suggestions.
        </p>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connected" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Connected Repositories
          </TabsTrigger>
          <TabsTrigger value="connect" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            Connect New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {repositories.length === 0 ? (
            <Card className="ff-card-interactive text-center p-12">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                  <Github className="h-8 w-8 text-ff-text-muted" />
                </div>
                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">No repositories connected</h3>
                  <p className="text-ff-text-muted mb-4">
                    Connect your first repository to enable AI-powered code analysis
                  </p>
                  <Button 
                    onClick={() => setSelectedRepo('connect')}
                    className="ff-btn-primary"
                  >
                    Connect Repository
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {repositories.map((repo) => (
                <Card key={repo.id} className="ff-card-interactive">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getProviderIcon(repo.provider)}
                        <div>
                          <CardTitle className="text-lg font-semibold text-ff-text-primary flex items-center gap-2">
                            {repo.name}
                            {repo.isPrivate && <Lock className="h-4 w-4 text-ff-text-muted" />}
                          </CardTitle>
                          <p className="text-sm text-ff-text-muted">{repo.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(repo.status)}
                        <Badge variant={repo.status === 'connected' ? 'default' : 'destructive'}>
                          {repo.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {repo.branch}
                        </span>
                        {repo.lastAnalyzed && (
                          <span className="text-ff-text-muted">
                            Last analyzed: {new Date(repo.lastAnalyzed).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReanalyzeRepository(repo)}
                          disabled={isAnalyzing}
                          className="ff-hover-scale"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Re-analyze
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDisconnectRepository(repo.id)}
                          className="ff-hover-scale"
                        >
                          <Unlink className="h-3 w-3" />
                          Disconnect
                        </Button>
                      </div>
                    </div>

                    {repo.analysisResult && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Technologies Detected</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {repo.analysisResult.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Summary</Label>
                          <p className="text-sm text-ff-text-secondary mt-1">
                            {repo.analysisResult.summary}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">AI Recommendations</Label>
                          <ul className="text-sm text-ff-text-secondary mt-1 space-y-1">
                            {repo.analysisResult.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-ff-primary mt-1">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connect" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="ff-text-gradient">Connect New Repository</CardTitle>
              <p className="text-ff-text-secondary">
                Add a repository to enable AI-powered code analysis and generation with full codebase context.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert>
                <Github className="h-4 w-4" />
                <AlertDescription>
                  <strong>Supported platforms:</strong> GitHub, GitLab (more coming soon)
                  <br />
                  <strong>Privacy:</strong> Repository access tokens are stored locally and never sent to our servers.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="repo-url">Repository URL</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository"
                    value={newRepoForm.url}
                    onChange={(e) => setNewRepoForm(prev => ({ ...prev, url: e.target.value }))}
                    className="ff-focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Platform</Label>
                    <Select 
                      value={newRepoForm.provider} 
                      onValueChange={(value: 'github' | 'gitlab' | 'bitbucket') => 
                        setNewRepoForm(prev => ({ ...prev, provider: value }))
                      }
                    >
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="github">
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            GitHub
                          </div>
                        </SelectItem>
                        <SelectItem value="gitlab">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-orange-500 rounded" />
                            GitLab
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      placeholder="main"
                      value={newRepoForm.branch}
                      onChange={(e) => setNewRepoForm(prev => ({ ...prev, branch: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private-repo"
                    checked={newRepoForm.isPrivate}
                    onCheckedChange={(checked) => setNewRepoForm(prev => ({ ...prev, isPrivate: checked }))}
                  />
                  <Label htmlFor="private-repo" className="flex items-center gap-2">
                    {newRepoForm.isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    Private Repository
                  </Label>
                </div>

                {newRepoForm.isPrivate && (
                  <div>
                    <Label htmlFor="access-token">Access Token</Label>
                    <Input
                      id="access-token"
                      type="password"
                      placeholder="Enter your personal access token"
                      value={newRepoForm.accessToken}
                      onChange={(e) => setNewRepoForm(prev => ({ ...prev, accessToken: e.target.value }))}
                      className="ff-focus-ring"
                    />
                    <p className="text-xs text-ff-text-muted mt-1">
                      Required for private repositories. Create a token with 'repo' scope.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleConnectRepository} 
                  disabled={isConnecting || !newRepoForm.url}
                  className="ff-btn-primary w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting & Analyzing...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Connect Repository
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RepositoryConnectionManager;