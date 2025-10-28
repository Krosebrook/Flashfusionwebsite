import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Copy, 
  ExternalLink, 
  FileText, 
  Terminal, 
  Code, 
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Zap,
  Download
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const ENV_TEMPLATE = `# FlashFusion AI Configuration
# Copy this template to your .env file and add your API keys

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Configuration  
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI Configuration
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: Meta AI Configuration (coming soon)
VITE_META_API_KEY=your_meta_api_key_here

# Note: Never commit your .env file to version control
# Add .env to your .gitignore file
`;

const GITIGNORE_TEMPLATE = `# Environment variables
.env
.env.local
.env.production

# API Keys and secrets
*.key
*.pem

# Build outputs
dist/
build/

# Dependencies
node_modules/

# Logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
`;

interface ProviderSetupInfo {
  id: string;
  name: string;
  description: string;
  signupUrl: string;
  docsUrl: string;
  keyLocation: string;
  envVar: string;
  instructions: string[];
  color: string;
}

const PROVIDER_SETUP: ProviderSetupInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Access to GPT-4, GPT-3.5 Turbo, and other OpenAI models',
    signupUrl: 'https://platform.openai.com/signup',
    docsUrl: 'https://platform.openai.com/docs/quickstart',
    keyLocation: 'https://platform.openai.com/api-keys',
    envVar: 'VITE_OPENAI_API_KEY',
    color: '#00B4D8',
    instructions: [
      'Sign up or log in to OpenAI Platform',
      'Navigate to the API Keys section',
      'Click "Create new secret key"',
      'Copy the key (you won\'t be able to see it again)',
      'Paste it in your .env file as VITE_OPENAI_API_KEY'
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Access to Claude 3.5 Sonnet and other Anthropic models',
    signupUrl: 'https://console.anthropic.com/',
    docsUrl: 'https://docs.anthropic.com/claude/docs/getting-started',
    keyLocation: 'https://console.anthropic.com/account/keys',
    envVar: 'VITE_ANTHROPIC_API_KEY',
    color: '#FF7B00',
    instructions: [
      'Create an account on Anthropic Console',
      'Go to Account Settings and then API Keys',
      'Click "Create Key"',
      'Give your key a name and copy it',
      'Add it to your .env file as VITE_ANTHROPIC_API_KEY'
    ]
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Access to Gemini Pro and other Google AI models',
    signupUrl: 'https://console.cloud.google.com/ai/platform',
    docsUrl: 'https://ai.google.dev/docs',
    keyLocation: 'https://console.cloud.google.com/apis/credentials',
    envVar: 'VITE_GOOGLE_AI_API_KEY',
    color: '#E91E63',
    instructions: [
      'Go to Google Cloud Console',
      'Enable the AI Platform API',
      'Create credentials (API Key)',
      'Restrict the key to AI Platform services',
      'Copy the API key to your .env file as VITE_GOOGLE_AI_API_KEY'
    ]
  }
];

export function EnvironmentSetupGuide() {
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  // Shell commands with proper text handling to avoid JSX escaping issues
  const gitignoreCommand = 'echo ".env" >> .gitignore';

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, itemId]));
      toast.success('Copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded successfully!`);
  };

  const selectedProviderInfo = PROVIDER_SETUP.find(p => p.id === selectedProvider);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-ff-text-primary">Environment Setup Guide</h2>
        <p className="text-ff-text-secondary">
          Configure your environment variables to enable AI features
        </p>
      </div>

      <Tabs defaultValue="quick-setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick-setup">Quick Setup</TabsTrigger>
          <TabsTrigger value="providers">Get API Keys</TabsTrigger>
          <TabsTrigger value="manual">Manual Setup</TabsTrigger>
        </TabsList>

        {/* Quick Setup Tab */}
        <TabsContent value="quick-setup" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-ff-primary" />
                Quick Environment Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create template files for your environment configuration.
                  You'll still need to add your actual API keys.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-ff-surface rounded-lg">
                  <div>
                    <div className="font-medium text-ff-text-primary">.env Template</div>
                    <div className="text-sm text-ff-text-muted">
                      Environment variables template with all AI provider keys
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ENV_TEMPLATE, 'env-template')}
                    >
                      {copiedItems.has('env-template') ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 text-ff-success" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(ENV_TEMPLATE, '.env.template')}
                      className="ff-btn-primary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-ff-surface rounded-lg">
                  <div>
                    <div className="font-medium text-ff-text-primary">.gitignore Addition</div>
                    <div className="text-sm text-ff-text-muted">
                      Prevent accidentally committing your API keys
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(GITIGNORE_TEMPLATE, 'gitignore')}
                    >
                      {copiedItems.has('gitignore') ? (
                        <CheckCircle2 className="w-4 h-4 mr-2 text-ff-success" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(GITIGNORE_TEMPLATE, '.gitignore.addition')}
                      className="ff-btn-secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-ff-text-primary">Next Steps:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">1</Badge>
                    <span className="text-sm text-ff-text-secondary">Download or copy the .env template</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">2</Badge>
                    <span className="text-sm text-ff-text-secondary">Rename .env.template to .env in your project root</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">3</Badge>
                    <span className="text-sm text-ff-text-secondary">Get API keys from the "Get API Keys" tab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">4</Badge>
                    <span className="text-sm text-ff-text-secondary">Replace the placeholder values with your real API keys</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROVIDER_SETUP.map((provider) => (
              <motion.button
                key={provider.id}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  selectedProvider === provider.id
                    ? 'border-ff-primary bg-ff-primary/5 ring-2 ring-ff-primary/20'
                    : 'border-ff-surface-light bg-ff-surface hover:bg-ff-surface-light'
                }`}
                onClick={() => setSelectedProvider(provider.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="space-y-2">
                  <div className="font-semibold text-ff-text-primary">{provider.name}</div>
                  <div className="text-xs text-ff-text-muted">{provider.description}</div>
                  <Badge 
                    className="text-xs" 
                    style={{ 
                      backgroundColor: `${provider.color}15`,
                      color: provider.color 
                    }}
                  >
                    {provider.envVar}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>

          {selectedProviderInfo && (
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle 
                  className="flex items-center gap-2"
                  style={{ color: selectedProviderInfo.color }}
                >
                  <Key className="w-5 h-5" />
                  {selectedProviderInfo.name} API Key Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-ff-text-secondary">{selectedProviderInfo.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-ff-text-primary">Step-by-step instructions:</h4>
                  <div className="space-y-2">
                    {selectedProviderInfo.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge 
                          variant="outline" 
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center shrink-0"
                        >
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-ff-text-secondary">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-ff-surface-light">
                  <Button
                    onClick={() => window.open(selectedProviderInfo.signupUrl, '_blank')}
                    className="ff-btn-primary"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Sign Up / Login
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedProviderInfo.keyLocation, '_blank')}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Get API Key
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedProviderInfo.docsUrl, '_blank')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedProviderInfo.envVar + '=your_api_key_here', `env-${selectedProviderInfo.id}`)}
                  >
                    {copiedItems.has(`env-${selectedProviderInfo.id}`) ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-ff-success" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy Env Variable
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Keep your API keys secure and never commit them to version control.
                    Add your .env file to .gitignore.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Manual Setup Tab */}
        <TabsContent value="manual" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-ff-primary" />
                Manual Environment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">1. Create .env file</h3>
                  <p className="text-sm text-ff-text-muted mb-2">
                    Create a .env file in your project root directory:
                  </p>
                  <div className="bg-ff-surface p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ff-text-secondary">touch .env</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('touch .env', 'touch-env')}
                      >
                        {copiedItems.has('touch-env') ? (
                          <CheckCircle2 className="w-4 h-4 text-ff-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">2. Add environment variables</h3>
                  <p className="text-sm text-ff-text-muted mb-2">
                    Add your API keys to the .env file:
                  </p>
                  <div className="bg-ff-surface p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <pre className="text-sm text-ff-text-secondary font-mono whitespace-pre-wrap">
                        {ENV_TEMPLATE.trim()}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(ENV_TEMPLATE, 'env-manual')}
                      >
                        {copiedItems.has('env-manual') ? (
                          <CheckCircle2 className="w-4 h-4 text-ff-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">3. Secure your .env file</h3>
                  <p className="text-sm text-ff-text-muted mb-2">
                    Add .env to your .gitignore to prevent committing secrets:
                  </p>
                  <div className="bg-ff-surface p-3 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ff-text-secondary">{gitignoreCommand}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(gitignoreCommand, 'gitignore-cmd')}
                      >
                        {copiedItems.has('gitignore-cmd') ? (
                          <CheckCircle2 className="w-4 h-4 text-ff-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-ff-text-primary mb-2">4. Restart your development server</h3>
                  <p className="text-sm text-ff-text-muted">
                    After adding environment variables, restart your development server to load them.
                  </p>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Best Practices:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Never commit .env files to version control</li>
                    <li>Use different API keys for development and production</li>
                    <li>Regularly rotate your API keys</li>
                    <li>Monitor your API usage and costs</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EnvironmentSetupGuide;