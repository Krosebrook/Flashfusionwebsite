/**
 * @fileoverview AI Integration Testing Component
 * @chunk test
 * @category testing
 * 
 * Comprehensive testing interface for all AI models, endpoints,
 * and integration features in FlashFusion.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Play,
  Settings,
  Download,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  available: boolean;
  status: 'available' | 'no_api_key' | 'error';
}

interface TestResult {
  modelId: string;
  success: boolean;
  responseTime: number;
  tokensUsed: number;
  confidence: number;
  error?: string;
  response?: string;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  successRate: number;
  totalRequests: number;
  totalTokens: number;
}

const TEST_PROMPTS = [
  {
    id: 'simple',
    name: 'Simple Code Generation',
    prompt: 'Create a React component that displays "Hello World" with a button',
    category: 'code-generation'
  },
  {
    id: 'complex',
    name: 'Complex Full-Stack',
    prompt: 'Generate a complete CRUD API with authentication using Node.js and Express',
    category: 'full-stack'
  },
  {
    id: 'analysis',
    name: 'Code Analysis',
    prompt: 'Analyze this code for potential security vulnerabilities: function login(user, pass) { return user === "admin" && pass === "password"; }',
    category: 'analysis'
  },
  {
    id: 'optimization',
    name: 'Code Optimization',
    prompt: 'Optimize this React component for better performance: function App() { const [data, setData] = useState([]); useEffect(() => { fetch("/api/data").then(r => r.json()).then(setData); }, []); return <div>{data.map(item => <div key={Math.random()}>{item.name}</div>)}</div>; }',
    category: 'optimization'
  }
];

export function AIIntegrationTest() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(TEST_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgResponseTime: 0,
    successRate: 0,
    totalRequests: 0,
    totalTokens: 0
  });
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  // Load available models
  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetch('/api/ai/models');
        if (response.ok) {
          const data = await response.json();
          setModels(data.models || []);
        } else {
          toast.error('Failed to load AI models');
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        // Use mock data for demonstration
        const mockModels: AIModel[] = [
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', available: true, status: 'available' },
          { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', available: true, status: 'available' },
          { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', available: true, status: 'available' },
          { id: 'codellama-34b', name: 'CodeLlama 34B', provider: 'Meta', available: true, status: 'available' },
          { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', available: false, status: 'no_api_key' }
        ];
        setModels(mockModels);
      }
    }

    loadModels();
  }, []);

  // Test single model
  const testModel = async (modelId: string, prompt: string): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      setCurrentTest(modelId);
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || 'demo-key'}`
        },
        body: JSON.stringify({
          model: modelId,
          prompt: prompt,
          maxTokens: 500
        })
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          modelId,
          success: true,
          responseTime,
          tokensUsed: data.tokensUsed || 0,
          confidence: data.confidence || 0,
          response: data.content
        };
      } else {
        const errorData = await response.json();
        return {
          modelId,
          success: false,
          responseTime,
          tokensUsed: 0,
          confidence: 0,
          error: errorData.message || `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        modelId,
        success: false,
        responseTime: Date.now() - startTime,
        tokensUsed: 0,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setCurrentTest(null);
    }
  };

  // Test all available models
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const prompt = customPrompt || selectedPrompt.prompt;
    const availableModels = models.filter(m => m.available);
    
    if (availableModels.length === 0) {
      toast.error('No available models to test');
      setIsRunning(false);
      return;
    }

    const results: TestResult[] = [];
    
    for (const model of availableModels) {
      try {
        const result = await testModel(model.id, prompt);
        results.push(result);
        setTestResults([...results]);
        
        if (result.success) {
          toast.success(`${model.name} test completed`);
        } else {
          toast.error(`${model.name} test failed: ${result.error}`);
        }
        
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Test failed for ${model.name}:`, error);
      }
    }

    // Calculate metrics
    const successfulTests = results.filter(r => r.success);
    const newMetrics: PerformanceMetrics = {
      avgResponseTime: successfulTests.length > 0 
        ? Math.round(successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length)
        : 0,
      successRate: results.length > 0 ? (successfulTests.length / results.length) * 100 : 0,
      totalRequests: results.length,
      totalTokens: results.reduce((sum, r) => sum + r.tokensUsed, 0)
    };
    
    setMetrics(newMetrics);
    setIsRunning(false);
    
    toast.success(`Testing completed: ${successfulTests.length}/${results.length} models successful`);
  };

  // Test specific model
  const testSpecificModel = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model || !model.available) {
      toast.error('Model not available');
      return;
    }

    setIsRunning(true);
    const prompt = customPrompt || selectedPrompt.prompt;
    
    try {
      const result = await testModel(modelId, prompt);
      setTestResults(prev => [...prev.filter(r => r.modelId !== modelId), result]);
      
      if (result.success) {
        toast.success(`${model.name} test successful`);
      } else {
        toast.error(`${model.name} test failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Export test results
  const exportResults = () => {
    const exportData = {
      testDate: new Date().toISOString(),
      prompt: customPrompt || selectedPrompt,
      models: models,
      results: testResults,
      metrics: metrics
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-integration-test-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Test results exported');
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.success) {
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  const getModelStatus = (model: AIModel) => {
    switch (model.status) {
      case 'available':
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'no_api_key':
        return <Badge variant="secondary">No API Key</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ff-text-headline">AI Integration Testing</h1>
          <p className="ff-text-body">
            Test and validate all AI models and integrations
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="ff-btn-primary"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          {testResults.length > 0 && (
            <Button variant="outline" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics.totalRequests > 0 && (
        <div className="grid md:grid-cols-4 gap-6 ff-stagger-fade">
          <Card className="ff-card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="ff-text-sm">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="ff-text-2xl font-bold text-success">
                {metrics.successRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {testResults.filter(r => r.success).length}/{metrics.totalRequests} models
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="ff-text-sm">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="ff-text-2xl font-bold text-primary">
                {metrics.avgResponseTime}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Across successful tests
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="ff-text-sm">Total Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="ff-text-2xl font-bold text-secondary">
                {metrics.totalTokens.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Tokens consumed
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardHeader className="pb-2">
              <CardTitle className="ff-text-sm">Models Tested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="ff-text-2xl font-bold text-accent">
                {metrics.totalRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {models.filter(m => m.available).length} available
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Testing Interface */}
      <Tabs defaultValue="test" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test">Run Tests</TabsTrigger>
          <TabsTrigger value="models">Model Status</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-2">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle>Test Configuration</CardTitle>
                  <CardDescription>
                    Configure your AI integration test parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prompt Selection */}
                  <div>
                    <label className="ff-text-sm font-medium mb-2 block">
                      Test Prompt
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {TEST_PROMPTS.map((prompt) => (
                        <Button
                          key={prompt.id}
                          variant={selectedPrompt.id === prompt.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedPrompt(prompt)}
                          className="text-left justify-start"
                        >
                          {prompt.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Prompt */}
                  <div>
                    <label className="ff-text-sm font-medium mb-2 block">
                      Custom Prompt (Optional)
                    </label>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Enter a custom prompt to test..."
                      className="min-h-24 ff-input"
                    />
                  </div>

                  {/* Selected Prompt Preview */}
                  {!customPrompt && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Selected prompt:</strong> {selectedPrompt.prompt}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={runAllTests} 
                    disabled={isRunning}
                    className="w-full ff-btn-primary"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Test All Models
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setTestResults([])}
                    className="w-full ff-btn-outline"
                  >
                    Clear Results
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full ff-btn-outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Test Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle>Available AI Models</CardTitle>
              <CardDescription>
                Status and configuration of all AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="ff-text-base font-medium">{model.name}</h4>
                        <p className="ff-text-sm text-muted-foreground">{model.provider}</p>
                      </div>
                      {getModelStatus(model)}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {currentTest === model.id && (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="ff-text-sm">Testing...</span>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSpecificModel(model.id)}
                        disabled={!model.available || isRunning}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {testResults.length > 0 ? (
            <div className="space-y-4">
              {testResults.map((result) => {
                const model = models.find(m => m.id === result.modelId);
                return (
                  <Card key={result.modelId} className="ff-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          {getStatusIcon(result)}
                          <span>{model?.name || result.modelId}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{result.responseTime}ms</span>
                          <span>{result.tokensUsed} tokens</span>
                          {result.confidence > 0 && (
                            <span>{(result.confidence * 100).toFixed(1)}% confidence</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.success ? (
                        <div className="space-y-2">
                          <h5 className="ff-text-sm font-medium">Response:</h5>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <pre className="ff-text-sm whitespace-pre-wrap overflow-auto max-h-40">
                              {result.response}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Error:</strong> {result.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="ff-card">
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="ff-text-lg font-medium mb-2">No Test Results</h3>
                <p className="ff-text-sm text-muted-foreground mb-4">
                  Run tests to see detailed results and performance metrics
                </p>
                <Button onClick={() => runAllTests()} disabled={isRunning}>
                  <Play className="h-4 w-4 mr-2" />
                  Run First Test
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIIntegrationTest;