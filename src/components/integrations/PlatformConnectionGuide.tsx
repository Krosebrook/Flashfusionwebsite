/**
 * @fileoverview Platform-Specific Connection Guides
 * @chunk integrations
 * @category guides
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Step-by-step guides for connecting apps from various platforms
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ProfessionalIcon } from '../ui/professional-icon-system';
import {
  ExternalLink,
  Copy,
  CheckCircle,
  Info,
  AlertCircle,
  Play,
  Code,
  Key,
  Globe,
  Zap,
  Box,
  Target,
  Cloud,
  Network,
  Server,
  ArrowRight,
  Clock,
  Shield,
  Webhook,
  Git,
  Download,
  Upload,
  Settings,
  Link as LinkIcon
} from 'lucide-react';

interface ConnectionStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  code?: string;
  url?: string;
  warning?: string;
  tip?: string;
}

interface PlatformGuide {
  platform: string;
  name: string;
  icon: any;
  color: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  methods: {
    oauth?: ConnectionStep[];
    apiKey?: ConnectionStep[];
    webhook?: ConnectionStep[];
    git?: ConnectionStep[];
  };
  troubleshooting: {
    issue: string;
    solution: string;
  }[];
  examples: {
    title: string;
    description: string;
    code: string;
  }[];
}

const PLATFORM_GUIDES: Record<string, PlatformGuide> = {
  'bolt.new': {
    platform: 'bolt.new',
    name: 'Bolt.new',
    icon: Zap,
    color: '#FF6B35',
    difficulty: 'Easy',
    estimatedTime: '5 minutes',
    prerequisites: ['Bolt.new account', 'Published app'],
    methods: {
      oauth: [
        {
          id: '1',
          title: 'Navigate to FlashFusion Integrations',
          description: 'In your FlashFusion dashboard, go to Settings > Integrations',
          action: 'Click "External Integrations" in the sidebar'
        },
        {
          id: '2',
          title: 'Select Bolt.new',
          description: 'Find Bolt.new in the available platforms list',
          action: 'Click "Connect" on the Bolt.new card'
        },
        {
          id: '3',
          title: 'Authorize FlashFusion',
          description: 'You\'ll be redirected to Bolt.new to authorize access',
          action: 'Click "Authorize" on the Bolt.new OAuth page',
          tip: 'Make sure you\'re logged into the correct Bolt.new account'
        },
        {
          id: '4',
          title: 'Select Your Apps',
          description: 'Choose which Bolt.new apps to sync with FlashFusion',
          action: 'Select apps and configure sync settings'
        },
        {
          id: '5',
          title: 'Configure Webhooks',
          description: 'Enable real-time updates from Bolt.new',
          action: 'Enable webhook notifications for deployments and updates'
        }
      ],
      webhook: [
        {
          id: '1',
          title: 'Get Webhook URL',
          description: 'Copy your FlashFusion webhook endpoint',
          code: 'https://flashfusion.app/webhooks/bolt-new',
          action: 'Copy this URL to your clipboard'
        },
        {
          id: '2',
          title: 'Configure in Bolt.new',
          description: 'Add the webhook URL to your Bolt.new app settings',
          action: 'Go to your app settings in Bolt.new and add webhook URL'
        },
        {
          id: '3',
          title: 'Select Events',
          description: 'Choose which events to send to FlashFusion',
          action: 'Enable: app.deployed, app.updated, build.completed'
        }
      ]
    },
    troubleshooting: [
      {
        issue: 'OAuth authorization fails',
        solution: 'Clear browser cookies for Bolt.new and try again. Ensure popup blockers are disabled.'
      },
      {
        issue: 'Apps not appearing after connection',
        solution: 'Check if your apps are published and you have the correct permissions.'
      },
      {
        issue: 'Webhooks not working',
        solution: 'Verify the webhook URL is correctly configured and your app has webhook permissions.'
      }
    ],
    examples: [
      {
        title: 'Auto-sync on deployment',
        description: 'Automatically sync your app when deployed on Bolt.new',
        code: `// This happens automatically once connected
// FlashFusion will receive webhook notifications
// and sync your app data in real-time`
      },
      {
        title: 'Export to FlashFusion',
        description: 'Export your Bolt.new app to FlashFusion format',
        code: `// Use the FlashFusion integration API
const exportData = await fetch('/api/integrations/bolt-new/export', {
  method: 'POST',
  body: JSON.stringify({ appId: 'your-app-id' })
});`
      }
    ]
  },

  'replit.com': {
    platform: 'replit.com',
    name: 'Replit',
    icon: Code,
    color: '#F26207',
    difficulty: 'Medium',
    estimatedTime: '10 minutes',
    prerequisites: ['Replit account', 'API token from Replit settings'],
    methods: {
      apiKey: [
        {
          id: '1',
          title: 'Get Replit API Token',
          description: 'Generate an API token from your Replit account settings',
          action: 'Go to Replit Settings > Developer and create a new token',
          url: 'https://replit.com/account#developer'
        },
        {
          id: '2',
          title: 'Add Token to FlashFusion',
          description: 'Enter your Replit API token in FlashFusion',
          action: 'Select "API Key" authentication and paste your token'
        },
        {
          id: '3',
          title: 'Select Repositories',
          description: 'Choose which Replit projects to sync',
          action: 'Browse and select your public and private repls'
        },
        {
          id: '4',
          title: 'Configure Sync Settings',
          description: 'Set up how often to sync your Replit projects',
          action: 'Choose sync frequency: real-time, hourly, or daily'
        }
      ],
      git: [
        {
          id: '1',
          title: 'Enable Git in Replit',
          description: 'Make sure your Replit project has Git enabled',
          action: 'In your Repl, click Shell and run: git init'
        },
        {
          id: '2',
          title: 'Connect to GitHub',
          description: 'Link your Replit project to a GitHub repository',
          action: 'Use the Git panel in Replit to connect to GitHub'
        },
        {
          id: '3',
          title: 'Sync via Git',
          description: 'FlashFusion can now sync using the GitHub integration',
          action: 'Configure GitHub integration in FlashFusion'
        }
      ]
    },
    troubleshooting: [
      {
        issue: 'API token not working',
        solution: 'Make sure you copied the full token and it has the required permissions for reading repls.'
      },
      {
        issue: 'Private repls not showing',
        solution: 'Ensure your API token has permissions to access private repositories.'
      },
      {
        issue: 'Git sync issues',
        solution: 'Check that your Replit project is properly connected to GitHub and has recent commits.'
      }
    ],
    examples: [
      {
        title: 'List all repls',
        description: 'Get a list of all your Replit projects',
        code: `// FlashFusion automatically fetches your repls
// You can also use the Replit GraphQL API directly
query {
  user {
    repls {
      id
      title
      language
      isPrivate
    }
  }
}`
      },
      {
        title: 'Deploy from Replit',
        description: 'Deploy your Replit project to other platforms',
        code: `// Export from Replit and deploy to Vercel
const replData = await fetch('/api/integrations/replit/export', {
  method: 'POST',
  body: JSON.stringify({ replId: 'your-repl-id' })
});

// Deploy to Vercel
await fetch('/api/integrations/vercel/deploy', {
  method: 'POST',
  body: replData
});`
      }
    ]
  },

  'loveable.dev': {
    platform: 'loveable.dev',
    name: 'Loveable.dev',
    icon: Globe,
    color: '#E91E63',
    difficulty: 'Easy',
    estimatedTime: '3 minutes',
    prerequisites: ['Loveable.dev account', 'Generated app'],
    methods: {
      apiKey: [
        {
          id: '1',
          title: 'Get Loveable API Key',
          description: 'Find your API key in Loveable.dev settings',
          action: 'Go to Settings > API Keys and copy your key',
          url: 'https://loveable.dev/settings/api'
        },
        {
          id: '2',
          title: 'Connect to FlashFusion',
          description: 'Add your Loveable.dev API key to FlashFusion',
          action: 'Select Loveable.dev and choose "API Key" authentication'
        },
        {
          id: '3',
          title: 'Sync Your Apps',
          description: 'Import your Loveable-generated apps',
          action: 'Click "Sync Now" to import all your apps'
        }
      ]
    },
    troubleshooting: [
      {
        issue: 'API key invalid',
        solution: 'Make sure you copied the complete API key without any extra spaces.'
      },
      {
        issue: 'No apps found',
        solution: 'Ensure you have created and saved apps in your Loveable.dev account.'
      }
    ],
    examples: [
      {
        title: 'Import components',
        description: 'Import AI-generated components from Loveable',
        code: `// FlashFusion can import Loveable components
// and convert them to your preferred framework
const components = await fetch('/api/integrations/loveable/components');
const reactComponents = await convertToReact(components);`
      }
    ]
  },

  'vercel.com': {
    platform: 'vercel.com',
    name: 'Vercel',
    icon: Cloud,
    color: '#000000',
    difficulty: 'Easy',
    estimatedTime: '5 minutes',
    prerequisites: ['Vercel account', 'Deployed projects'],
    methods: {
      oauth: [
        {
          id: '1',
          title: 'Connect via OAuth',
          description: 'Use Vercel\'s OAuth for secure authentication',
          action: 'Click "Connect with Vercel" in FlashFusion'
        },
        {
          id: '2',
          title: 'Authorize FlashFusion',
          description: 'Grant FlashFusion access to your Vercel projects',
          action: 'Click "Authorize" in the Vercel OAuth dialog'
        },
        {
          id: '3',
          title: 'Select Projects',
          description: 'Choose which Vercel projects to sync',
          action: 'Select projects and configure deployment tracking'
        }
      ],
      webhook: [
        {
          id: '1',
          title: 'Add Webhook to Vercel',
          description: 'Configure webhook in your Vercel project settings',
          action: 'Go to Project Settings > Git > Deploy Hooks',
          code: 'https://flashfusion.app/webhooks/vercel'
        },
        {
          id: '2',
          title: 'Configure Events',
          description: 'Select which deployment events to track',
          action: 'Enable: deployment.created, deployment.ready, deployment.error'
        }
      ]
    },
    troubleshooting: [
      {
        issue: 'OAuth connection fails',
        solution: 'Make sure you\'re logged into the correct Vercel account and have team permissions.'
      },
      {
        issue: 'Webhooks not firing',
        solution: 'Check that the webhook URL is correctly configured in your Vercel project settings.'
      }
    ],
    examples: [
      {
        title: 'Auto-deploy tracking',
        description: 'Track deployment status in FlashFusion',
        code: `// FlashFusion automatically tracks Vercel deployments
// You'll see real-time status updates in your dashboard
// including build logs, deployment URLs, and performance metrics`
      }
    ]
  }
};

interface PlatformConnectionGuideProps {
  platform?: string;
  onClose?: () => void;
}

export function PlatformConnectionGuide({ platform, onClose }: PlatformConnectionGuideProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(platform || 'bolt.new');
  const [selectedMethod, setSelectedMethod] = useState<string>('oauth');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const guide = PLATFORM_GUIDES[selectedPlatform];
  const methods = Object.keys(guide.methods);
  const currentSteps = guide.methods[selectedMethod as keyof typeof guide.methods] || [];

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success border-success/20 bg-success/10';
      case 'Medium': return 'text-warning border-warning/20 bg-warning/10';
      case 'Advanced': return 'text-error border-error/20 bg-error/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ff-text-display text-4xl mb-2">
            Platform Connection Guides
          </h1>
          <p className="ff-text-body text-lg text-muted-foreground">
            Step-by-step instructions for connecting your external apps
          </p>
        </div>
        
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Back to Integrations
          </Button>
        )}
      </div>

      {/* Platform Selector */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">Select Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(PLATFORM_GUIDES).map(([key, platformGuide]) => (
              <Button
                key={key}
                variant={selectedPlatform === key ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => {
                  setSelectedPlatform(key);
                  setCompletedSteps(new Set());
                  setSelectedMethod(Object.keys(platformGuide.methods)[0]);
                }}
              >
                <ProfessionalIcon 
                  icon={platformGuide.icon} 
                  size="md" 
                  style={{ color: platformGuide.color }}
                />
                <span className="text-sm">{platformGuide.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Platform Guide */}
      {guide && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Guide Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Platform Info */}
            <Card className="ff-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${guide.color}20` }}
                  >
                    <ProfessionalIcon 
                      icon={guide.icon} 
                      size="xl" 
                      style={{ color: guide.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="ff-text-title text-2xl">{guide.name}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {guide.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="ff-text-body font-semibold mb-2">Prerequisites:</h4>
                  <ul className="space-y-1">
                    {guide.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Connection Methods */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Connection Method</CardTitle>
              </CardHeader>
              
              <CardContent>
                <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                  <TabsList className="grid w-full grid-cols-4">
                    {methods.map(method => (
                      <TabsTrigger 
                        key={method} 
                        value={method}
                        className="capitalize"
                        disabled={!guide.methods[method as keyof typeof guide.methods]}
                      >
                        {method === 'oauth' && <Shield className="w-4 h-4 mr-1" />}
                        {method === 'apiKey' && <Key className="w-4 h-4 mr-1" />}
                        {method === 'webhook' && <Webhook className="w-4 h-4 mr-1" />}
                        {method === 'git' && <Git className="w-4 h-4 mr-1" />}
                        {method.replace('apiKey', 'API Key')}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {methods.map(method => (
                    <TabsContent key={method} value={method} className="space-y-4 mt-6">
                      {currentSteps.map((step, index) => (
                        <div key={step.id} className="space-y-3">
                          <div className="flex items-start gap-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`w-8 h-8 rounded-full p-0 ${
                                completedSteps.has(step.id) 
                                  ? 'bg-success text-success-foreground' 
                                  : ''
                              }`}
                              onClick={() => toggleStepComplete(step.id)}
                            >
                              {completedSteps.has(step.id) ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm">{index + 1}</span>
                              )}
                            </Button>
                            
                            <div className="flex-1">
                              <h4 className="ff-text-body font-semibold">{step.title}</h4>
                              <p className="ff-text-caption text-muted-foreground mb-2">
                                {step.description}
                              </p>
                              
                              {step.action && (
                                <div className="bg-muted/20 border border-muted/20 rounded-lg p-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4 text-primary" />
                                    <span className="ff-text-caption font-medium">Action:</span>
                                  </div>
                                  <p className="ff-text-caption mt-1">{step.action}</p>
                                </div>
                              )}
                              
                              {step.code && (
                                <div className="bg-muted border border-muted/20 rounded-lg p-3 mb-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="ff-text-caption font-medium">Code/URL:</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(step.code!)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <code className="ff-text-caption text-muted-foreground font-mono">
                                    {step.code}
                                  </code>
                                </div>
                              )}
                              
                              {step.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(step.url, '_blank')}
                                  className="mb-2"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Open Link
                                </Button>
                              )}
                              
                              {step.warning && (
                                <Alert className="border-warning/20 bg-warning/10">
                                  <AlertCircle className="h-4 w-4 text-warning" />
                                  <AlertDescription className="text-warning">
                                    {step.warning}
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              {step.tip && (
                                <Alert className="border-info/20 bg-info/10">
                                  <Info className="h-4 w-4 text-info" />
                                  <AlertDescription className="text-info">
                                    <strong>Tip:</strong> {step.tip}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                          
                          {index < currentSteps.length - 1 && (
                            <div className="ml-4 border-l-2 border-muted/20 h-4" />
                          )}
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Progress */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed Steps</span>
                    <span>{completedSteps.size}/{currentSteps.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ 
                        width: `${currentSteps.length > 0 ? (completedSteps.size / currentSteps.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  {completedSteps.size === currentSteps.length && currentSteps.length > 0 && (
                    <Alert className="border-success/20 bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription className="text-success">
                        <strong>Congratulations!</strong> You've completed all steps.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.troubleshooting.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="ff-text-caption font-semibold text-warning">
                      {item.issue}
                    </h4>
                    <p className="ff-text-caption text-muted-foreground">
                      {item.solution}
                    </p>
                    {index < guide.troubleshooting.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Examples */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Code Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="ff-text-caption font-semibold">
                      {example.title}
                    </h4>
                    <p className="ff-text-caption text-muted-foreground text-xs">
                      {example.description}
                    </p>
                    <div className="bg-muted border border-muted/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="ff-text-caption font-medium text-xs">Example:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(example.code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <code className="ff-text-caption text-muted-foreground font-mono text-xs whitespace-pre-wrap">
                        {example.code}
                      </code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}