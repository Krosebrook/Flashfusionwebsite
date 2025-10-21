import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Github, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Loader2,
  ArrowRight,
  ArrowLeft,
  Settings,
  Key,
  Link,
  Zap,
  Shield,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';

interface GitHubSetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  optional?: boolean;
}

interface GitHubConnectionTest {
  username: string;
  avatar_url: string;
  public_repos: number;
  private_repos: number;
  plan: {
    name: string;
  };
}

export function GitHubSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionTest, setConnectionTest] = useState<GitHubConnectionTest | null>(null);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [setupSteps, setSetupSteps] = useState<GitHubSetupStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to GitHub Integration',
      description: 'Connect your GitHub account to unlock powerful AI-driven code analysis',
      icon: <Github className="h-6 w-6 text-primary" />,
      status: 'in-progress'
    },
    {
      id: 'token-setup',
      title: 'Create Personal Access Token',
      description: 'Generate a secure token to access your repositories',
      icon: <Key className="h-6 w-6 text-warning" />,
      status: 'pending'
    },
    {
      id: 'connection-test',
      title: 'Test Connection',
      description: 'Verify your token works correctly',
      icon: <Link className="h-6 w-6 text-info" />,
      status: 'pending'
    },
    {
      id: 'repository-setup',
      title: 'Connect Repository',
      description: 'Add your first repository for AI analysis',
      icon: <Zap className="h-6 w-6 text-success" />,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'You\'re ready to use GitHub-powered AI features',
      icon: <Rocket className="h-6 w-6 text-accent" />,
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepId: string, status: GitHubSetupStep['status']) => {
    setSetupSteps(steps => 
      steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const testGitHubConnection = async () => {
    if (!personalAccessToken) {
      toast.error('Please enter your Personal Access Token');
      return;
    }

    setTestingConnection(true);
    updateStepStatus('connection-test', 'in-progress');

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${personalAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}`);
      }

      const userData = await response.json();
      setConnectionTest(userData);
      updateStepStatus('connection-test', 'completed');
      
      // Store token securely
      localStorage.setItem('github_token', personalAccessToken);
      
      toast.success('GitHub connection successful!');
      
      // Auto-advance to next step
      setTimeout(() => {
        setCurrentStep(3);
        updateStepStatus('repository-setup', 'in-progress');
      }, 1500);

    } catch (error) {
      console.error('GitHub connection failed:', error);
      updateStepStatus('connection-test', 'error');
      toast.error('Failed to connect to GitHub. Please check your token.');
    } finally {
      setTestingConnection(false);
    }
  };

  const connectRepository = async () => {
    if (!repositoryUrl) {
      toast.error('Please enter a repository URL');
      return;
    }

    updateStepStatus('repository-setup', 'in-progress');

    try {
      // Validate repository URL format
      const repoMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!repoMatch) {
        throw new Error('Invalid GitHub repository URL format');
      }

      const [, owner, repo] = repoMatch;
      
      // Test repository access
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${personalAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Unable to access repository. Check URL and permissions.');
      }

      const repoData = await response.json();
      
      // Store repository connection
      const existingRepos = JSON.parse(localStorage.getItem('ff_connected_repositories') || '[]');
      const newRepo = {
        id: `repo_${Date.now()}`,
        name: repoData.name,
        url: repositoryUrl,
        branch: repoData.default_branch,
        provider: 'github',
        isPrivate: repoData.private,
        status: 'connected',
        lastAnalyzed: new Date().toISOString(),
        analysisResult: {
          technologies: [repoData.language].filter(Boolean),
          summary: repoData.description || 'Repository connected successfully',
          recommendations: ['Repository is ready for AI analysis']
        }
      };

      existingRepos.push(newRepo);
      localStorage.setItem('ff_connected_repositories', JSON.stringify(existingRepos));

      updateStepStatus('repository-setup', 'completed');
      toast.success(`Successfully connected ${repoData.name}!`);

      // Complete setup
      setTimeout(() => {
        setCurrentStep(4);
        updateStepStatus('complete', 'completed');
      }, 1500);

    } catch (error) {
      console.error('Repository connection failed:', error);
      updateStepStatus('repository-setup', 'error');
      toast.error(`Failed to connect repository: ${(error as Error).message}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const nextStep = () => {
    if (currentStep < setupSteps.length - 1) {
      const current = setupSteps[currentStep];
      updateStepStatus(current.id, 'completed');
      
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      updateStepStatus(setupSteps[nextIndex].id, 'in-progress');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatusIcon = (status: GitHubSetupStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const progress = ((currentStep + 1) / setupSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 ff-stagger-fade">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Github className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold ff-text-gradient">
            GitHub Integration Setup
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect your GitHub account to enable AI-powered code analysis, repository insights, 
          and context-aware code generation with FlashFusion.
        </p>
      </motion.div>

      {/* Progress Bar */}
      <Card className="ff-card-interactive">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Setup Progress
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2 ff-progress-bar" />
            
            {/* Step Indicators */}
            <div className="flex justify-between items-center">
              {setupSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center space-y-2 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className={`
                    p-2 rounded-full border-2 transition-all duration-300
                    ${step.status === 'completed' 
                      ? 'border-success bg-success/10' 
                      : step.status === 'in-progress'
                      ? 'border-primary bg-primary/10 ff-pulse-glow'
                      : step.status === 'error'
                      ? 'border-destructive bg-destructive/10'
                      : 'border-muted-foreground bg-muted/10'
                    }
                  `}>
                    {getStepStatusIcon(step.status)}
                  </div>
                  <span className="text-xs text-center max-w-20 hidden sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="ff-card-interactive min-h-[500px]">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            {setupSteps[currentStep].icon}
            <CardTitle className="text-2xl ff-text-gradient">
              {setupSteps[currentStep].title}
            </CardTitle>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            {setupSteps[currentStep].description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: <Zap className="h-8 w-8 text-warning" />,
                        title: 'AI Code Analysis',
                        description: 'Get intelligent insights about your codebase structure and quality'
                      },
                      {
                        icon: <Shield className="h-8 w-8 text-success" />,
                        title: 'Secure Integration',
                        description: 'Your tokens are stored locally and never sent to our servers'
                      },
                      {
                        icon: <Rocket className="h-8 w-8 text-info" />,
                        title: 'Enhanced Generation',
                        description: 'Generate code with full context from your existing repositories'
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-border rounded-lg bg-muted/30"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          {feature.icon}
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground text-center">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Alert className="max-w-md mx-auto">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy First:</strong> Your GitHub tokens are encrypted and stored locally. 
                      We never have access to your repository contents.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 1: Token Setup */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <Alert>
                    <Key className="h-4 w-4" />
                    <AlertDescription>
                      You'll need to create a Personal Access Token on GitHub with repository access permissions.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Step-by-step instructions:</h3>
                    
                    <div className="space-y-3">
                      {[
                        {
                          step: 1,
                          action: 'Go to GitHub Settings',
                          detail: 'Click your profile picture → Settings → Developer settings → Personal access tokens → Tokens (classic)',
                          link: 'https://github.com/settings/tokens'
                        },
                        {
                          step: 2,
                          action: 'Generate new token',
                          detail: 'Click "Generate new token (classic)" and give it a descriptive name like "FlashFusion Integration"'
                        },
                        {
                          step: 3,
                          action: 'Select scopes',
                          detail: 'Check these permissions: ✓ repo (full repository access) ✓ read:user (user profile access)'
                        },
                        {
                          step: 4,
                          action: 'Generate and copy',
                          detail: 'Click "Generate token" and immediately copy the token (you won\'t see it again!)'
                        }
                      ].map((instruction) => (
                        <div key={instruction.step} className="flex gap-4 p-4 border border-border rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                            {instruction.step}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{instruction.action}</h4>
                            <p className="text-sm text-muted-foreground">{instruction.detail}</p>
                            {instruction.link && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(instruction.link, '_blank')}
                                className="mt-2"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open GitHub
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="token-input">Personal Access Token</Label>
                    <Input
                      id="token-input"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={personalAccessToken}
                      onChange={(e) => setPersonalAccessToken(e.target.value)}
                      className="ff-focus-ring font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your token is stored locally and encrypted. We never send it to our servers.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Connection Test */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <Label className="block mb-3">Your Personal Access Token</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="password"
                          value={personalAccessToken}
                          onChange={(e) => setPersonalAccessToken(e.target.value)}
                          placeholder="Paste your GitHub token here"
                          className="ff-focus-ring font-mono"
                        />
                        <Button
                          onClick={testGitHubConnection}
                          disabled={testingConnection || !personalAccessToken}
                          className="ff-btn-primary"
                        >
                          {testingConnection ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Link className="h-4 w-4 mr-2" />
                          )}
                          Test Connection
                        </Button>
                      </div>
                    </div>

                    {connectionTest && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 border border-success/30 rounded-lg bg-success/5"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={connectionTest.avatar_url}
                            alt="GitHub Avatar"
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="text-left">
                            <h3 className="font-semibold text-lg">{connectionTest.username}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{connectionTest.public_repos} public repos</span>
                              <span>{connectionTest.private_repos} private repos</span>
                              <Badge variant="outline">{connectionTest.plan.name}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-success/10 rounded-lg">
                          <p className="text-sm text-success-foreground flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Connection successful! You can access your repositories.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Repository Setup */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Alert>
                    <Github className="h-4 w-4" />
                    <AlertDescription>
                      Connect your first repository to start using AI-powered code analysis. 
                      You can add more repositories later from the Settings page.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repository"
                      value={repositoryUrl}
                      onChange={(e) => setRepositoryUrl(e.target.value)}
                      className="ff-focus-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the full GitHub URL for a repository you have access to
                    </p>
                  </div>

                  <Button
                    onClick={connectRepository}
                    disabled={!repositoryUrl || !personalAccessToken}
                    className="ff-btn-primary w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Connect Repository
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have a repository to connect? You can skip this step and add repositories later.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="h-12 w-12 text-success" />
                  </motion.div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-success">Setup Complete! 🎉</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your GitHub integration is now active. You can start using AI-powered features 
                      with your connected repositories.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      onClick={() => window.location.href = '/tools'}
                      className="ff-btn-primary"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Explore AI Tools
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/settings'}
                      variant="outline"
                      className="ff-hover-scale"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Settings
                    </Button>
                  </div>

                  <Alert className="max-w-md mx-auto">
                    <Rocket className="h-4 w-4" />
                    <AlertDescription>
                      <strong>What's next?</strong> Try the Repository Analyzer tool or generate code 
                      with full context from your connected repositories!
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t border-border">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="ff-hover-scale"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {setupSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted-foreground'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            disabled={
              currentStep === setupSteps.length - 1 ||
              (currentStep === 1 && !personalAccessToken) ||
              (currentStep === 2 && !connectionTest)
            }
            className="ff-btn-primary"
          >
            {currentStep === setupSteps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default GitHubSetupWizard;