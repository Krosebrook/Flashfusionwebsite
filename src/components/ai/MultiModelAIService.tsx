import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

// AI Model Configuration
interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  costPerToken: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'standard';
  status: 'available' | 'limited' | 'offline';
}

interface AIResponse {
  content: string;
  model: string;
  tokensUsed: number;
  responseTime: number;
  confidence: number;
}

interface ConversationContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    model?: string;
    timestamp: number;
  }>;
  projectContext?: any;
  codeContext?: string[];
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    capabilities: ['code', 'analysis', 'creative', 'reasoning'],
    maxTokens: 128000,
    costPerToken: 0.00001,
    speed: 'fast',
    quality: 'high',
    status: 'available'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    capabilities: ['code', 'analysis', 'creative', 'reasoning', 'safety'],
    maxTokens: 200000,
    costPerToken: 0.000015,
    speed: 'medium',
    quality: 'high',
    status: 'available'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    capabilities: ['code', 'analysis', 'multimodal', 'reasoning'],
    maxTokens: 32000,
    costPerToken: 0.000005,
    speed: 'fast',
    quality: 'high',
    status: 'available'
  },
  {
    id: 'codellama-34b',
    name: 'CodeLlama 34B',
    provider: 'Meta',
    capabilities: ['code', 'debugging', 'optimization'],
    maxTokens: 16000,
    costPerToken: 0.000002,
    speed: 'fast',
    quality: 'medium',
    status: 'available'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    capabilities: ['code', 'analysis', 'reasoning'],
    maxTokens: 32000,
    costPerToken: 0.000008,
    speed: 'fast',
    quality: 'high',
    status: 'available'
  }
];

const MultiModelAIService: React.FC = memo(() => {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4-turbo');
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    messages: []
  });
  const [autoModelSelection, setAutoModelSelection] = useState<boolean>(true);
  const [costEstimate, setCostEstimate] = useState<number>(0);

  // Calculate cost estimate based on prompt length
  useEffect(() => {
    const model = AI_MODELS.find(m => m.id === selectedModel);
    if (model && prompt) {
      const estimatedTokens = Math.ceil(prompt.length / 4); // Rough token estimation
      setCostEstimate(estimatedTokens * model.costPerToken);
    } else {
      setCostEstimate(0);
    }
  }, [selectedModel, prompt]);

  // Auto-select best model based on task
  const selectOptimalModel = useCallback((taskPrompt: string): string => {
    const lowerPrompt = taskPrompt.toLowerCase();
    
    if (lowerPrompt.includes('code') || lowerPrompt.includes('debug') || lowerPrompt.includes('function')) {
      return 'codellama-34b'; // Specialized for coding
    }
    
    if (lowerPrompt.includes('analyze') || lowerPrompt.includes('review') || lowerPrompt.includes('explain')) {
      return 'claude-3-opus'; // Best for analysis
    }
    
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('design') || lowerPrompt.includes('story')) {
      return 'gpt-4-turbo'; // Best for creative tasks
    }
    
    if (lowerPrompt.includes('multimodal') || lowerPrompt.includes('image') || lowerPrompt.includes('visual')) {
      return 'gemini-pro'; // Multimodal capabilities
    }
    
    // Default to fastest, most cost-effective
    return AI_MODELS.sort((a, b) => 
      (a.costPerToken * (a.speed === 'fast' ? 1 : 2)) - 
      (b.costPerToken * (b.speed === 'fast' ? 1 : 2))
    )[0].id;
  }, []);

  // Generate response with fallback mechanism
  const generateResponse = useCallback(async (useModel?: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    let modelToUse = useModel || selectedModel;
    
    // Auto-select optimal model if enabled
    if (autoModelSelection && !useModel) {
      modelToUse = selectOptimalModel(prompt);
      setSelectedModel(modelToUse);
    }

    try {
      // Call the AI service through Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-88829a40/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          model: modelToUse,
          prompt,
          context: conversationContext,
          maxTokens: AI_MODELS.find(m => m.id === modelToUse)?.maxTokens || 4000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      const aiResponse: AIResponse = {
        content: data.content,
        model: modelToUse,
        tokensUsed: data.tokensUsed || 0,
        responseTime,
        confidence: data.confidence || 0.95
      };

      setResponses(prev => [aiResponse, ...prev]);
      
      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'user', content: prompt, timestamp: Date.now() },
          { role: 'assistant', content: data.content, model: modelToUse, timestamp: Date.now() }
        ]
      }));

      toast.success(`Response generated with ${AI_MODELS.find(m => m.id === modelToUse)?.name}`);
      setPrompt(''); // Clear prompt after successful generation

    } catch (error) {
      console.error('AI generation failed:', error);
      
      // Fallback mechanism - try with different model
      const fallbackModels = AI_MODELS.filter(m => m.id !== modelToUse && m.status === 'available');
      
      if (fallbackModels.length > 0) {
        const fallbackModel = fallbackModels[0];
        toast.warning(`${AI_MODELS.find(m => m.id === modelToUse)?.name} failed, trying ${fallbackModel.name}...`);
        await generateResponse(fallbackModel.id);
        return;
      }

      toast.error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, conversationContext, autoModelSelection, selectOptimalModel]);

  // Compare responses across multiple models
  const compareModels = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to compare models');
      return;
    }

    setIsGenerating(true);
    
    const activeModels = AI_MODELS.filter(m => m.status === 'available').slice(0, 3); // Limit to 3 for cost
    
    try {
      const promises = activeModels.map(async (model) => {
        const startTime = Date.now();
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-88829a40/ai/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            model: model.id,
            prompt,
            context: conversationContext,
            maxTokens: Math.min(model.maxTokens, 1000) // Limit tokens for comparison
          })
        });

        if (!response.ok) {
          throw new Error(`${model.name} failed: ${response.statusText}`);
        }

        const data = await response.json();
        const responseTime = Date.now() - startTime;

        return {
          content: data.content,
          model: model.id,
          tokensUsed: data.tokensUsed || 0,
          responseTime,
          confidence: data.confidence || 0.95
        };
      });

      const results = await Promise.allSettled(promises);
      const successfulResponses = results
        .filter((result): result is PromiseFulfilledResult<AIResponse> => result.status === 'fulfilled')
        .map(result => result.value);

      setResponses(prev => [...successfulResponses, ...prev]);
      toast.success(`Compared ${successfulResponses.length} models successfully`);

    } catch (error) {
      console.error('Model comparison failed:', error);
      toast.error('Model comparison failed');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, conversationContext]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-sora">
          Multi-Model AI Integration
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access multiple AI models with intelligent routing, fallback mechanisms, and cost optimization
        </p>
      </div>

      {/* Model Selection & Configuration */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🤖</span>
              <span>AI Model Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Selected Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{model.name}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant={model.status === 'available' ? 'default' : 'secondary'} className="text-xs">
                              {model.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {model.provider}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-select"
                    checked={autoModelSelection}
                    onChange={(e) => setAutoModelSelection(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="auto-select" className="text-sm font-medium">
                    Auto-select optimal model
                  </label>
                </div>
              </div>
            </div>

            {/* Model Details */}
            {selectedModel && (
              <div className="p-4 bg-muted/30 rounded-lg">
                {(() => {
                  const model = AI_MODELS.find(m => m.id === selectedModel);
                  if (!model) return null;
                  
                  return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Max Tokens:</span>
                        <p className="text-muted-foreground">{model.maxTokens.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Speed:</span>
                        <p className="text-muted-foreground capitalize">{model.speed}</p>
                      </div>
                      <div>
                        <span className="font-medium">Quality:</span>
                        <p className="text-muted-foreground capitalize">{model.quality}</p>
                      </div>
                      <div>
                        <span className="font-medium">Est. Cost:</span>
                        <p className="text-muted-foreground">${costEstimate.toFixed(6)}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Prompt Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here... FlashFusion will automatically select the best model or use your chosen one."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => generateResponse()}
                disabled={isGenerating || !prompt.trim()}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <span className="mr-2">⚡</span>
                    Generate Response
                  </>
                )}
              </Button>

              <Button
                onClick={compareModels}
                disabled={isGenerating || !prompt.trim()}
                variant="outline"
              >
                <span className="mr-2">🔄</span>
                Compare Models
              </Button>

              <Button
                onClick={() => {
                  setResponses([]);
                  setConversationContext({ messages: [] });
                }}
                variant="outline"
              >
                <span className="mr-2">🗑️</span>
                Clear History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Model Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Model Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AI_MODELS.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Badge
                        variant={model.status === 'available' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {model.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {model.capabilities.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responses */}
      {responses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Responses</h2>
          
          <div className="grid gap-4">
            {responses.map((response, index) => {
              const model = AI_MODELS.find(m => m.id === response.model);
              
              return (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20">
                          {model?.name || response.model}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {response.responseTime}ms
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {response.tokensUsed} tokens
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                          Confidence: {(response.confidence * 100).toFixed(1)}%
                        </div>
                        <Button size="sm" variant="outline" onClick={() => {
                          navigator.clipboard.writeText(response.content);
                          toast.success('Response copied to clipboard');
                        }}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {response.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Usage Alert */}
      <Alert>
        <AlertDescription>
          💡 <strong>Pro Tip:</strong> Enable auto-model selection for optimal performance and cost efficiency. 
          FlashFusion automatically chooses the best model based on your task type and requirements.
        </AlertDescription>
      </Alert>
    </div>
  );
});

MultiModelAIService.displayName = 'MultiModelAIService';

export default MultiModelAIService;