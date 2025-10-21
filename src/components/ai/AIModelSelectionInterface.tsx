import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { 
  Brain,
  Zap,
  Code,
  Palette,
  MessageSquare,
  Image,
  FileText,
  Music,
  Video,
  Globe,
  Lock,
  Unlock,
  Star,
  Crown,
  Sparkles,
  ChevronRight,
  Settings,
  TrendingUp,
  Clock,
  Cpu,
  Database,
  Key,
  Save,
  TestTube,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  DollarSign,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AIService, { type AIModel, type AIProvider, AI_MODELS } from '../../services/AIService';

interface ModelCapability {
  id: string;
  name: string;
  description: string;
  agentColor: string;
  proficiency: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
  pricing: {
    inputTokens: number;
    outputTokens: number;
    unit: string;
  };
  performance: {
    speed: number;
    accuracy: number;
    creativity: number;
    reasoning: number;
  };
  capabilities: ModelCapability[];
  limits: {
    requestsPerMinute: number;
    tokensPerRequest: number;
    contextWindow: number;
  };
  features: string[];
  usageStats?: {
    requestsToday: number;
    tokensUsed: number;
    successRate: number;
  };
}

const MODEL_CAPABILITIES: ModelCapability[] = [
  {
    id: 'text-generation',
    name: 'Text Generation',
    description: 'Creating written content, articles, and documentation',
    agentColor: '#61dafb', // Researcher
    proficiency: 95,
    icon: FileText
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Writing, debugging, and optimizing source code',
    agentColor: '#d14d21', // Creator
    proficiency: 90,
    icon: Code
  },
  {
    id: 'image-analysis',
    name: 'Image Analysis',
    description: 'Understanding and describing visual content',
    agentColor: '#10b981', // Optimizer
    proficiency: 85,
    icon: Image
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Storytelling, poetry, and creative content',
    agentColor: '#764ba2', // Automator
    proficiency: 88,
    icon: Palette
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Processing and interpreting complex datasets',
    agentColor: '#667eea', // Analyzer
    proficiency: 92,
    icon: Database
  },
  {
    id: 'conversation',
    name: 'Conversation',
    description: 'Natural dialogue and interactive communication',
    agentColor: '#2a5298', // Orchestrator
    proficiency: 96,
    icon: MessageSquare
  }
];

// Remove old models array since we're using the real AI service

export function AIModelSelectionInterface() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
    anthropic: '',
    google: '',
    meta: '',
    local: ''
  });
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [usageStats, setUsageStats] = useState(null);

  useEffect(() => {
    loadAvailableModels();
    loadCurrentSelection();
    loadUsageStats();
  }, []);

  const loadAvailableModels = () => {
    const models = AIService.getAvailableModels();
    setAvailableModels(models);
  };

  const loadCurrentSelection = () => {
    const currentModel = AIService.getCurrentModel();
    setSelectedModel(currentModel?.id || null);
  };

  const loadUsageStats = () => {
    const stats = AIService.getUsageStats();
    setUsageStats(stats);
  };

  const handleModelSelect = async (modelId: string) => {
    try {
      AIService.setModel(modelId);
      setSelectedModel(modelId);
      toast.success(`Switched to ${AI_MODELS.find(m => m.id === modelId)?.name}`);
      loadUsageStats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to select model');
    }
  };

  const handleApiKeyUpdate = (provider: AIProvider, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }));
  };

  const saveApiKey = (provider: AIProvider) => {
    const key = apiKeys[provider];
    if (!key) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      AIService.setApiKey(provider, key);
      toast.success(`${provider.toUpperCase()} API key saved`);
      loadAvailableModels();
      setShowApiKeySetup(false);
    } catch (error) {
      toast.error('Failed to save API key');
    }
  };

  const testModel = async () => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }

    setIsTestingModel(true);
    try {
      const testCode = await AIService.generateCode({
        type: 'component',
        framework: 'react',
        requirements: 'Create a simple Hello World button component with TypeScript',
        options: {
          includeTypeScript: true
        }
      });

      toast.success('Model test successful!');
      console.log('Generated test code:', testCode);
    } catch (error) {
      toast.error(`Model test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingModel(false);
    }
  };

  const getProviderColor = (provider: AIProvider) => {
    switch (provider) {
      case 'openai':
        return '#00B4D8';
      case 'anthropic':
        return '#FF7B00';
      case 'google':
        return '#E91E63';
      case 'meta':
        return '#1877F2';
      case 'local':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getProviderIcon = (provider: AIProvider) => {
    switch (provider) {
      case 'openai':
        return Brain;
      case 'anthropic':
        return Sparkles;
      case 'google':
        return Globe;
      case 'meta':
        return Star;
      case 'local':
        return Cpu;
      default:
        return Brain;
    }
  };

  const ModelCard = ({ model }: { model: AIModel }) => {
    const isSelected = selectedModel === model.id;
    const ProviderIcon = getProviderIcon(model.provider);
    const providerColor = getProviderColor(model.provider);
    const hasApiKey = AIService.hasValidApiKey(model.provider);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-300 ff-card-interactive ${
            isSelected ? 'ring-2 ring-ff-primary' : 'hover:shadow-lg'
          } ${!hasApiKey ? 'opacity-60' : ''}`}
          onClick={() => hasApiKey && handleModelSelect(model.id)}
        >
          {/* Provider gradient border */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${providerColor}, var(--ff-secondary))`
            }}
          />

          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-ff-text-primary truncate">
                    {model.name}
                  </h3>
                  <Badge 
                    className="flex items-center space-x-1 ff-badge-glow"
                    style={{
                      backgroundColor: `${providerColor}15`,
                      color: providerColor,
                      border: `1px solid ${providerColor}30`
                    }}
                  >
                    <ProviderIcon className="h-3 w-3" />
                    <span className="capitalize">{model.provider}</span>
                  </Badge>
                  {!hasApiKey && (
                    <Badge variant="destructive" className="text-xs">
                      <Key className="h-3 w-3 mr-1" />
                      No API Key
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-ff-text-secondary mb-2">{model.description}</p>
                <div className="flex items-center gap-2 text-xs text-ff-text-muted">
                  <span>Max Tokens: {model.maxTokens.toLocaleString()}</span>
                  <span>•</span>
                  <span>Speed: {model.speedRating}/5</span>
                  <span>•</span>
                  <span>Quality: {model.qualityRating}/5</span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {isSelected && (
                  <Badge className="ff-btn-primary text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                )}
                <div className="text-right">
                  <div className="text-xs text-ff-text-muted">Cost per 1K</div>
                  <div className="text-sm font-semibold text-ff-text-primary">
                    ${model.costPer1k}
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ff-text-primary">Capabilities</span>
                <span className="text-xs text-ff-text-muted">
                  {model.capabilities.length} available
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {model.capabilities.map((capability) => (
                  <Badge 
                    key={capability}
                    variant="secondary" 
                    className="text-xs ff-btn-secondary"
                  >
                    {capability.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-ff-text-muted">Speed</span>
                    <span className="text-xs font-semibold text-ff-text-primary">{model.speedRating}/5</span>
                  </div>
                  <div className="w-full bg-ff-surface rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full ff-progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(model.speedRating / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-ff-text-muted">Quality</span>
                    <span className="text-xs font-semibold text-ff-text-primary">{model.qualityRating}/5</span>
                  </div>
                  <div className="w-full bg-ff-surface rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full ff-progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(model.qualityRating / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 bg-ff-surface rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-ff-text-primary">Pricing</div>
                  <div className="text-xs text-ff-text-muted">
                    ${model.costPer1k} per 1K tokens
                  </div>
                  <div className="text-xs text-ff-text-muted">
                    Max: {model.maxTokens.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-ff-secondary" />
                    <span className="text-sm font-semibold text-ff-text-primary">
                      {model.costPer1k < 0.01 ? 'Low Cost' : model.costPer1k < 0.05 ? 'Medium' : 'Premium'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    model.available ? 'bg-ff-success' : 'bg-ff-warning'
                  }`} />
                  <span className="text-sm font-medium text-ff-text-primary">
                    {model.available ? 'Available' : 'Setup Required'}
                  </span>
                </div>
                {hasApiKey && (
                  <div className="flex items-center gap-1 text-ff-success">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs">Configured</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {hasApiKey ? (
                <>
                  <Button 
                    className={`flex-1 ${isSelected ? 'ff-btn-primary' : 'ff-btn-secondary'}`}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModelSelect(model.id);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select Model'}
                    {isSelected ? <CheckCircle2 className="ml-2 h-3 w-3" /> : <ChevronRight className="ml-2 h-3 w-3" />}
                  </Button>
                </>
              ) : (
                <Button 
                  className="flex-1 ff-btn-accent"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowApiKeySetup(true);
                  }}
                >
                  Setup API Key
                  <Key className="ml-2 h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Additional Details */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-ff-surface-light"
                >
                  <div className="text-sm font-medium text-ff-text-primary mb-2">Model Details</div>
                  <div className="space-y-2 text-xs text-ff-text-muted">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="text-ff-text-primary">{model.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Tokens:</span>
                      <span className="text-ff-text-primary">{model.maxTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed Rating:</span>
                      <span className="text-ff-text-primary">{model.speedRating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Rating:</span>
                      <span className="text-ff-text-primary">{model.qualityRating}/5</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-bold ff-text-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            AI Model Selection
          </motion.h1>
          <motion.p 
            className="text-ff-text-secondary mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Choose and configure AI models for your FlashFusion workflows
          </motion.p>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowApiKeySetup(true)}
            className="ff-focus-ring"
          >
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="ff-focus-ring"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare
          </Button>
          {selectedModel && (
            <Button 
              onClick={testModel}
              disabled={isTestingModel}
              className="ff-btn-primary"
              size="sm"
            >
              {isTestingModel ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Model
            </Button>
          )}
        </div>
      </div>

      {/* Current Model & Usage Stats */}
      {usageStats && (
        <Card className="ff-glass ff-card-interactive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ff-text-primary">
              <Brain className="h-5 w-5 text-ff-primary" />
              AI Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ff-text-primary">
                  {availableModels.length}
                </div>
                <div className="text-sm text-ff-text-muted">Available Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ff-primary">
                  {usageStats.requestCount}
                </div>
                <div className="text-sm text-ff-text-muted">Requests Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ff-secondary">
                  ${usageStats.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-ff-text-muted">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ff-accent">
                  {selectedModel ? AI_MODELS.find(m => m.id === selectedModel)?.name : 'None'}
                </div>
                <div className="text-sm text-ff-text-muted">Selected Model</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Models */}
      <Card className="ff-glass">
        <CardHeader>
          <CardTitle className="text-ff-text-primary">Available AI Models</CardTitle>
          <CardDescription className="text-ff-text-muted">
            Configure and select AI models for code generation and assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableModels.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No AI models are available. Please configure your API keys to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Key Setup Modal */}
      {showApiKeySetup && (
        <Card className="fixed inset-4 z-50 bg-ff-bg-dark border border-ff-surface-light shadow-2xl ff-glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-ff-text-primary">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-ff-primary" />
                API Key Configuration
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowApiKeySetup(false)}
                className="ff-focus-ring"
              >
                ✕
              </Button>
            </CardTitle>
            <CardDescription className="text-ff-text-muted">
              Configure your AI provider API keys to enable model access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 max-h-96 overflow-y-auto">
            {(['openai', 'anthropic', 'google'] as AIProvider[]).map((provider) => (
              <div key={provider} className="space-y-2">
                <Label htmlFor={`${provider}-key`} className="text-ff-text-primary">
                  {provider.toUpperCase()} API Key
                  {AIService.hasValidApiKey(provider) && (
                    <Badge className="ml-2 ff-btn-secondary text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Configured
                    </Badge>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`${provider}-key`}
                    type="password"
                    placeholder={`Enter your ${provider.toUpperCase()} API key`}
                    value={apiKeys[provider]}
                    onChange={(e) => handleApiKeyUpdate(provider, e.target.value)}
                    className="ff-focus-ring"
                  />
                  <Button
                    onClick={() => saveApiKey(provider)}
                    disabled={!apiKeys[provider]}
                    className="ff-btn-primary"
                    size="sm"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-ff-text-muted">
                  {provider === 'openai' && 'Get your API key from platform.openai.com'}
                  {provider === 'anthropic' && 'Get your API key from console.anthropic.com'}
                  {provider === 'google' && 'Get your API key from console.cloud.google.com'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}