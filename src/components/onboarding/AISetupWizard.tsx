import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { 
  Brain,
  Sparkles,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Key,
  TestTube,
  Zap,
  Code,
  Globe,
  Star,
  Cpu,
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AIService, { type AIProvider, type AIModel, AI_MODELS } from '../../services/AIService';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<WizardStepProps>;
}

interface WizardStepProps {
  onNext: (data?: any) => void;
  onPrev: () => void;
  onComplete: (data?: any) => void;
  stepData: any;
  updateStepData: (data: any) => void;
}

interface SetupData {
  selectedProviders: AIProvider[];
  apiKeys: Record<AIProvider, string>;
  preferredModel: string;
  useCase: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
}

// Welcome Step
const WelcomeStep: React.FC<WizardStepProps> = ({ onNext }) => {
  const [selectedUseCase, setSelectedUseCase] = useState('');

  const useCases = [
    {
      id: 'development',
      title: 'Code Development',
      description: 'Generate React components, APIs, and full applications',
      icon: '💻',
      popular: true
    },
    {
      id: 'content',
      title: 'Content Creation',
      description: 'Create articles, documentation, and marketing copy',
      icon: '✍️',
      popular: true
    },
    {
      id: 'analysis',
      title: 'Data Analysis',
      description: 'Process and analyze data, create reports',
      icon: '📊',
      popular: false
    },
    {
      id: 'creative',
      title: 'Creative Projects',
      description: 'Design layouts, generate ideas, creative writing',
      icon: '🎨',
      popular: false
    },
    {
      id: 'automation',
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and processes',
      icon: '⚡',
      popular: false
    },
    {
      id: 'learning',
      title: 'Learning & Research',
      description: 'Educational content and research assistance',
      icon: '📚',
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 bg-ff-primary/10 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Brain className="w-8 h-8 text-ff-primary" />
        </motion.div>
        
        <div>
          <h2 className="text-2xl font-bold text-ff-text-primary">Welcome to AI-Powered FlashFusion</h2>
          <p className="text-ff-text-secondary mt-2">
            Let's get you set up with AI models to supercharge your productivity
          </p>
        </div>
      </div>

      <div>
        <Label className="text-ff-text-primary text-base mb-4 block">
          What will you primarily use AI for?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {useCases.map((useCase) => (
            <motion.button
              key={useCase.id}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                selectedUseCase === useCase.id
                  ? 'border-ff-primary bg-ff-primary/5 ring-2 ring-ff-primary/20'
                  : 'border-ff-surface-light bg-ff-surface hover:bg-ff-surface-light'
              }`}
              onClick={() => setSelectedUseCase(useCase.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{useCase.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-ff-text-primary">{useCase.title}</h3>
                    {useCase.popular && (
                      <Badge className="ff-btn-accent text-xs">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-ff-text-muted">{useCase.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onNext({ useCase: selectedUseCase })}
          disabled={!selectedUseCase}
          className="ff-btn-primary"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Experience Level Step
const ExperienceStep: React.FC<WizardStepProps> = ({ onNext, onPrev, stepData, updateStepData }) => {
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const experienceLevels = [
    {
      id: 'beginner' as const,
      title: 'Beginner',
      description: 'New to AI tools, want guided experience',
      icon: '🌱',
      features: ['Guided setup', 'Recommended settings', 'Built-in tutorials']
    },
    {
      id: 'intermediate' as const,
      title: 'Intermediate',
      description: 'Some experience with AI, want flexibility',
      icon: '🚀',
      features: ['Balanced configuration', 'Multiple model options', 'Custom workflows']
    },
    {
      id: 'advanced' as const,
      title: 'Advanced',
      description: 'Experienced user, need full control',
      icon: '⚡',
      features: ['Full customization', 'Advanced settings', 'All providers']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ff-text-primary">What's your experience level?</h2>
        <p className="text-ff-text-secondary mt-2">
          This helps us customize the setup process for you
        </p>
      </div>

      <div className="space-y-4">
        {experienceLevels.map((level) => (
          <motion.button
            key={level.id}
            className={`w-full p-6 rounded-lg border text-left transition-all duration-200 ${
              experience === level.id
                ? 'border-ff-primary bg-ff-primary/5 ring-2 ring-ff-primary/20'
                : 'border-ff-surface-light bg-ff-surface hover:bg-ff-surface-light'
            }`}
            onClick={() => setExperience(level.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{level.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ff-text-primary mb-2">{level.title}</h3>
                <p className="text-ff-text-secondary mb-3">{level.description}</p>
                <div className="flex flex-wrap gap-2">
                  {level.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => {
            updateStepData({ experience });
            onNext({ experience });
          }}
          className="ff-btn-primary"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Provider Selection Step
const ProviderStep: React.FC<WizardStepProps> = ({ onNext, onPrev, stepData, updateStepData }) => {
  const [selectedProviders, setSelectedProviders] = useState<AIProvider[]>([]);

  const providers = [
    {
      id: 'openai' as AIProvider,
      name: 'OpenAI',
      description: 'GPT-4 Turbo, GPT-3.5 - Most popular and versatile',
      icon: Brain,
      color: '#00B4D8',
      pricing: 'From $0.002/1K tokens',
      recommended: true,
      models: ['GPT-4 Turbo', 'GPT-3.5 Turbo']
    },
    {
      id: 'anthropic' as AIProvider,
      name: 'Anthropic Claude',
      description: 'Claude 3.5 Sonnet - Excellent reasoning and coding',
      icon: Sparkles,
      color: '#FF7B00',
      pricing: 'From $0.015/1K tokens',
      recommended: true,
      models: ['Claude 3.5 Sonnet', 'Claude 3 Haiku']
    },
    {
      id: 'google' as AIProvider,
      name: 'Google AI',
      description: 'Gemini Pro - Multimodal capabilities',
      icon: Globe,
      color: '#E91E63',
      pricing: 'From $0.0025/1K tokens',
      recommended: false,
      models: ['Gemini Pro']
    }
  ];

  const toggleProvider = (providerId: AIProvider) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ff-text-primary">Choose AI Providers</h2>
        <p className="text-ff-text-secondary mt-2">
          Select the AI providers you'd like to use. You can add more later.
        </p>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => {
          const ProviderIcon = provider.icon;
          const isSelected = selectedProviders.includes(provider.id);
          
          return (
            <motion.button
              key={provider.id}
              className={`w-full p-6 rounded-lg border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-ff-primary bg-ff-primary/5 ring-2 ring-ff-primary/20'
                  : 'border-ff-surface-light bg-ff-surface hover:bg-ff-surface-light'
              }`}
              onClick={() => toggleProvider(provider.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${provider.color}15` }}
                  >
                    <ProviderIcon 
                      className="w-6 h-6" 
                      style={{ color: provider.color }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-ff-text-primary">
                        {provider.name}
                      </h3>
                      {provider.recommended && (
                        <Badge className="ff-btn-accent text-xs">Recommended</Badge>
                      )}
                    </div>
                    
                    <p className="text-ff-text-secondary mb-3">{provider.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-ff-text-muted">{provider.pricing}</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.models.map((model) => (
                          <Badge key={model} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-ff-primary" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You'll need to provide API keys for selected providers in the next step. 
          Don't worry - we'll guide you through getting them!
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => {
            updateStepData({ selectedProviders });
            onNext({ selectedProviders });
          }}
          disabled={selectedProviders.length === 0}
          className="ff-btn-primary"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// API Key Setup Step
const APIKeyStep: React.FC<WizardStepProps> = ({ onNext, onPrev, stepData, updateStepData }) => {
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    openai: '',
    anthropic: '',
    google: '',
    meta: '',
    local: ''
  });
  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({
    openai: false,
    anthropic: false,
    google: false,
    meta: false,
    local: false
  });
  const [testingProviders, setTestingProviders] = useState<Set<AIProvider>>(new Set());
  const [completedProviders, setCompletedProviders] = useState<Set<AIProvider>>(new Set());

  const selectedProviders = stepData.selectedProviders || [];

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      signupUrl: 'https://platform.openai.com/api-keys',
      instructions: 'Sign up or log in, go to API Keys section, and create a new secret key'
    },
    anthropic: {
      name: 'Anthropic',
      signupUrl: 'https://console.anthropic.com/',
      instructions: 'Create account, go to API Keys, and generate a new key'
    },
    google: {
      name: 'Google AI',
      signupUrl: 'https://console.cloud.google.com/ai/platform',
      instructions: 'Enable the AI Platform API and create credentials'
    }
  };

  const saveAndTestKey = async (provider: AIProvider) => {
    const key = apiKeys[provider];
    if (!key.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setTestingProviders(prev => new Set([...prev, provider]));
    
    try {
      // Save the key
      AIService.setApiKey(provider, key.trim());
      
      // Test the key
      const testModel = AI_MODELS.find(model => model.provider === provider);
      if (testModel) {
        AIService.setModel(testModel.id);
        
        await AIService.generateCode({
          type: 'function',
          framework: 'javascript',
          requirements: 'Create a simple hello world function',
          options: { includeTypeScript: false, includeDocumentation: false, includeTests: false }
        });
      }
      
      setCompletedProviders(prev => new Set([...prev, provider]));
      toast.success(`${providerInfo[provider as keyof typeof providerInfo]?.name} API key verified!`);
      
    } catch (error) {
      console.error('API key test failed:', error);
      toast.error(`Failed to verify ${provider} API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingProviders(prev => {
        const newSet = new Set(prev);
        newSet.delete(provider);
        return newSet;
      });
    }
  };

  const skipProvider = (provider: AIProvider) => {
    setCompletedProviders(prev => new Set([...prev, provider]));
  };

  const allCompleted = selectedProviders.every((p: AIProvider) => completedProviders.has(p));
  const hasAtLeastOne = completedProviders.size > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ff-text-primary">Configure API Keys</h2>
        <p className="text-ff-text-secondary mt-2">
          Add your API keys to start using AI features
        </p>
      </div>

      <div className="space-y-4">
        {selectedProviders.map((provider: AIProvider) => {
          const info = providerInfo[provider as keyof typeof providerInfo];
          if (!info) return null;
          
          const isCompleted = completedProviders.has(provider);
          const isTesting = testingProviders.has(provider);
          
          return (
            <Card key={provider} className={`${isCompleted ? 'border-ff-success bg-ff-success/5' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-ff-text-primary">{info.name}</h3>
                    <p className="text-sm text-ff-text-muted">{info.instructions}</p>
                  </div>
                  
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-ff-success" />
                  )}
                </div>
                
                {!isCompleted && (
                  <>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={showKeys[provider] ? "text" : "password"}
                            placeholder={`Enter ${info.name} API key...`}
                            value={apiKeys[provider]}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                            className="ff-focus-ring pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))}
                          >
                            {showKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => saveAndTestKey(provider)}
                          disabled={!apiKeys[provider].trim() || isTesting}
                          className="ff-btn-primary"
                        >
                          {isTesting ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4 mr-2" />
                          )}
                          Test
                        </Button>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(info.signupUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Get API Key
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => skipProvider(provider)}
                          className="text-ff-text-muted"
                        >
                          Skip for now
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Progress 
          value={(completedProviders.size / selectedProviders.length) * 100} 
          className="w-full max-w-sm mx-auto"
        />
        <p className="text-sm text-ff-text-muted mt-2">
          {completedProviders.size} of {selectedProviders.length} providers configured
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => {
            updateStepData({ apiKeys: Object.fromEntries(
              Object.entries(apiKeys).filter(([_, value]) => value.trim())
            )});
            onNext();
          }}
          disabled={!hasAtLeastOne}
          className="ff-btn-primary"
        >
          {allCompleted ? 'Complete Setup' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Complete Step
const CompleteStep: React.FC<WizardStepProps> = ({ onComplete, stepData }) => {
  const configuredProviders = Object.keys(stepData.apiKeys || {}).length;
  const availableModels = AIService.getAvailableModels();
  
  return (
    <div className="space-y-6 text-center">
      <motion.div
        className="mx-auto w-20 h-20 bg-ff-success/10 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <CheckCircle2 className="w-10 h-10 text-ff-success" />
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-bold text-ff-text-primary">Setup Complete! 🎉</h2>
        <p className="text-ff-text-secondary mt-2">
          You're all set to start using AI-powered features in FlashFusion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="p-4 bg-ff-surface rounded-lg">
          <div className="text-2xl font-bold text-ff-primary">{configuredProviders}</div>
          <div className="text-sm text-ff-text-muted">Providers Configured</div>
        </div>
        <div className="p-4 bg-ff-surface rounded-lg">
          <div className="text-2xl font-bold text-ff-secondary">{availableModels.length}</div>
          <div className="text-sm text-ff-text-muted">Models Available</div>
        </div>
        <div className="p-4 bg-ff-surface rounded-lg">
          <div className="text-2xl font-bold text-ff-accent">∞</div>
          <div className="text-sm text-ff-text-muted">Possibilities</div>
        </div>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          Ready to generate your first AI-powered code? Try the Code Generator tool to get started!
        </AlertDescription>
      </Alert>

      <Button
        onClick={() => onComplete()}
        className="ff-btn-primary ff-hover-glow"
        size="lg"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Start Creating
      </Button>
    </div>
  );
};

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Choose your primary use case',
    icon: Brain,
    component: WelcomeStep
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Tell us your experience level',
    icon: Star,
    component: ExperienceStep
  },
  {
    id: 'providers',
    title: 'Providers',
    description: 'Select AI providers',
    icon: Globe,
    component: ProviderStep
  },
  {
    id: 'apikeys',
    title: 'API Keys',
    description: 'Configure your credentials',
    icon: Key,
    component: APIKeyStep
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Ready to go!',
    icon: CheckCircle2,
    component: CompleteStep
  }
];

interface AISetupWizardProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export function AISetupWizard({ onComplete, onClose }: AISetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<Partial<SetupData>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStepData = WIZARD_STEPS[currentStep];
  const StepComponent = currentStepData.component;

  const handleNext = (data?: any) => {
    if (data) {
      setSetupData(prev => ({ ...prev, ...data }));
    }
    
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    toast.success('AI setup completed successfully!');
    onComplete?.();
  };

  const updateStepData = (data: any) => {
    setSetupData(prev => ({ ...prev, ...data }));
  };

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-ff-bg-dark rounded-xl border border-ff-surface-light shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-ff-surface-light">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-ff-text-primary">AI Setup Wizard</h1>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-ff-text-muted">
              <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                onNext={handleNext}
                onPrev={handlePrev}
                onComplete={handleComplete}
                stepData={setupData}
                updateStepData={updateStepData}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default AISetupWizard;