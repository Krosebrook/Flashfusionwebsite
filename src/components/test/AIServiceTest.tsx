import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  TestTube, 
  Code,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AIService, { type AIModel } from '../../services/AIService';

export function AIServiceTest() {
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadAIStatus();
  }, []);

  const loadAIStatus = () => {
    try {
      const model = AIService.getCurrentModel();
      const models = AIService.getAvailableModels();
      const stats = AIService.getUsageStats();
      
      setCurrentModel(model);
      setAvailableModels(models);
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load AI status:', error);
      toast.error('Failed to load AI service status');
    }
  };

  const testAIGeneration = async () => {
    if (!currentModel) {
      toast.error('No AI model selected');
      return;
    }

    setIsTestingAI(true);
    setTestResult(null);

    try {
      const result = await AIService.generateCode({
        type: 'component',
        framework: 'react',
        requirements: 'Create a simple Hello World button component with TypeScript and FlashFusion styling',
        options: {
          includeTypeScript: true,
          includeDocumentation: false,
          includeTests: false
        }
      });

      setTestResult(result);
      toast.success('AI generation test successful!');
    } catch (error) {
      console.error('AI generation test failed:', error);
      toast.error(`AI test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTestResult('Test failed');
    } finally {
      setIsTestingAI(false);
      loadAIStatus(); // Refresh stats
    }
  };

  return (
    <div className="space-y-6">
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-ff-primary" />
            AI Service Status Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-ff-surface rounded-lg">
              <div className="text-lg font-bold text-ff-primary">
                {availableModels.length}
              </div>
              <div className="text-xs text-ff-text-muted">Available Models</div>
            </div>
            
            <div className="text-center p-3 bg-ff-surface rounded-lg">
              <div className="text-lg font-bold text-ff-secondary">
                {currentModel ? 'Selected' : 'None'}
              </div>
              <div className="text-xs text-ff-text-muted">Current Model</div>
            </div>
            
            <div className="text-center p-3 bg-ff-surface rounded-lg">
              <div className="text-lg font-bold text-ff-accent">
                {usageStats?.requestCount || 0}
              </div>
              <div className="text-xs text-ff-text-muted">Total Requests</div>
            </div>
            
            <div className="text-center p-3 bg-ff-surface rounded-lg">
              <div className="text-lg font-bold text-ff-success">
                ${(usageStats?.totalCost || 0).toFixed(4)}
              </div>
              <div className="text-xs text-ff-text-muted">Total Cost</div>
            </div>
          </div>

          {/* Current Model Info */}
          {currentModel ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Model:</strong> {currentModel.name} ({currentModel.provider})
                <br />
                <small>Speed: {currentModel.speedRating}/5 | Quality: {currentModel.qualityRating}/5 | Max Tokens: {currentModel.maxTokens.toLocaleString()}</small>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No AI model is currently selected. Please configure your API keys and select a model.
              </AlertDescription>
            </Alert>
          )}

          {/* Available Models */}
          {availableModels.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">Available Models:</h4>
              <div className="flex flex-wrap gap-2">
                {availableModels.map((model) => (
                  <Badge 
                    key={model.id} 
                    variant={model.id === currentModel?.id ? "default" : "outline"}
                    className={model.id === currentModel?.id ? "ff-btn-primary" : ""}
                  >
                    {model.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Test Buttons */}
          <div className="flex gap-3 pt-4 border-t border-ff-surface-light">
            <Button
              onClick={testAIGeneration}
              disabled={!currentModel || isTestingAI}
              className="ff-btn-primary"
            >
              {isTestingAI ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Test AI Generation
            </Button>
            
            <Button
              onClick={loadAIStatus}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">Test Result:</h4>
              <div className="bg-ff-surface p-3 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-sm text-ff-text-secondary whitespace-pre-wrap">
                  {testResult}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIServiceTest;