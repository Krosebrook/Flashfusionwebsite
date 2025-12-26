import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  CheckCircle, Sparkles, Code, FileText, Download, Share2, Wand2, Zap, 
  Brain, Palette, X, History, Star, StarOff, Search, Trash2, Clock, AlertCircle 
} from 'lucide-react';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import { useGenerationHistory } from '../../hooks/useGenerationHistory';
import { GENERATION_TEMPLATES, getTemplatesByType, getPopularTemplates } from '../../data/generation-templates';
import type { CreationType } from '../../types/generation';

interface AICreationWorkflowProps {
  onComplete?: () => void;
}

export function AICreationWorkflow({ onComplete }: AICreationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCreationType, setSelectedCreationType] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  
  // Use custom hooks
  const { isGenerating, progress, error, result, generate, cancel, reset } = useAIGeneration();
  const { 
    history, 
    addToHistory, 
    removeFromHistory, 
    clearHistory, 
    toggleFavorite,
    searchHistory,
    getFavorites 
  } = useGenerationHistory();

  const creationTypes: CreationType[] = [
    {
      id: 'fullstack-app',
      title: 'Full-Stack Application',
      description: 'Complete web application with frontend, backend, and database',
      icon: Code,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Pro'],
      estimatedTime: '2-5 minutes',
      category: 'code',
      features: ['Authentication', 'Database', 'API', 'Responsive UI']
    },
    {
      id: 'content-suite',
      title: 'Content Marketing Suite',
      description: 'Blog posts, social media content, and marketing materials',
      icon: FileText,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Pro'],
      estimatedTime: '30 seconds - 2 minutes',
      category: 'content',
      features: ['Blog Posts', 'Social Media', 'Email Templates', 'SEO']
    },
    {
      id: 'visual-assets',
      title: 'Visual Assets & Branding',
      description: 'Logos, images, brand kits, and visual identity',
      icon: Palette,
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      models: ['DALL-E 3', 'Midjourney', 'Stable Diffusion XL'],
      estimatedTime: '1-3 minutes',
      category: 'design',
      features: ['Logos', 'Brand Colors', 'Typography', 'Templates']
    },
    {
      id: 'code-components',
      title: 'Code Components & APIs',
      description: 'Reusable components, API endpoints, and integrations',
      icon: Brain,
      color: 'bg-gradient-to-r from-green-500 to-teal-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'CodeLlama'],
      estimatedTime: '1-2 minutes',
      category: 'code',
      features: ['Components', 'Hooks', 'Tests', 'Documentation']
    }
  ];

  const selectedType = creationTypes.find(type => type.id === selectedCreationType);
  const availableTemplates = selectedCreationType ? getTemplatesByType(selectedCreationType) : [];
  const displayHistory = historySearchQuery ? searchHistory(historySearchQuery) : history;

  // Handle generation
  const handleGenerate = useCallback(async () => {
    if (!selectedCreationType || !userPrompt.trim() || !selectedModel) return;
    
    setCurrentStep(3);
    const generationResult = await generate({
      type: selectedCreationType,
      prompt: userPrompt,
      model: selectedModel,
    });

    if (generationResult) {
      addToHistory(generationResult);
      setCurrentStep(4);
    }
  }, [selectedCreationType, userPrompt, selectedModel, generate, addToHistory]);

  // Handle template selection
  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = GENERATION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setUserPrompt(template.prompt);
      setSelectedModel(template.model);
    }
  }, []);

  // Handle history item restore
  const handleRestoreFromHistory = useCallback((historyId: string) => {
    const historyItem = history.find(h => h.id === historyId);
    if (historyItem) {
      setSelectedCreationType(historyItem.type);
      setUserPrompt(historyItem.prompt);
      setSelectedModel(historyItem.model);
      setShowHistory(false);
      setCurrentStep(2);
    }
  }, [history]);

  // Cancel generation
  const handleCancel = useCallback(() => {
    cancel();
    setCurrentStep(2);
  }, [cancel]);

  // Reset workflow
  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setSelectedCreationType('');
    setUserPrompt('');
    setSelectedModel('');
    setSelectedTemplate(null);
    reset();
  }, [reset]);

  // Auto-advance when generation completes
  useEffect(() => {
    if (result && !isGenerating) {
      setCurrentStep(4);
    }
  }, [result, isGenerating]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">AI-Powered Creation</h2>
                <p className="ff-text-body">Generate stunning content, code, and creative assets in seconds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                      selectedCreationType === type.id 
                        ? 'ring-2 ring-orange-500 bg-orange-500/10' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedCreationType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${type.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="ff-text-title text-lg">{type.title}</h3>
                          <p className="ff-text-body text-sm">{type.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Zap className="w-4 h-4" />
                            <span>{type.estimatedTime}</span>
                          </div>
                        </div>
                        {selectedCreationType === type.id && (
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!selectedCreationType}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Configuration
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Configure Your Creation</h2>
              <p className="ff-text-body">Customize the AI generation for your specific needs</p>
            </div>

            {selectedType && (
              <Card className="ff-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${selectedType.color}`}>
                      <selectedType.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedType.title}</CardTitle>
                      <p className="text-sm text-gray-400">{selectedType.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="ff-text-title text-sm">Describe what you want to create</label>
                    <Textarea
                      placeholder={`Describe your ${selectedType.title.toLowerCase()} requirements...`}
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="ff-input min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500">
                      Be specific about features, style, target audience, and any special requirements.
                    </p>
                  </div>

                  {/* Templates Section */}
                  {availableTemplates.length > 0 && (
                    <div className="space-y-3">
                      <label className="ff-text-title text-sm flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>Quick Start Templates</span>
                      </label>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {availableTemplates.slice(0, 3).map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedTemplate === template.id
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white">{template.name}</h4>
                                <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {selectedTemplate === template.id && (
                                <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="ff-text-title text-sm">AI Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="ff-input">
                        <SelectValue placeholder="Choose AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedType.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            <div className="flex items-center space-x-2">
                              <Brain className="w-4 h-4" />
                              <span>{model}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Estimated Generation Time</span>
                    </div>
                    <p className="text-sm text-blue-300">{selectedType.estimatedTime}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="ff-btn-outline"
              >
                Back to Selection
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!userPrompt.trim() || !selectedModel}
                className="ff-btn-primary ff-btn-lg"
              >
                Generate with AI
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">AI is Creating Your {selectedType?.title}</h2>
                <p className="ff-text-body">Using {selectedModel} to generate your custom creation</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="ff-text-title text-sm">Generation Progress</span>
                    <span className="ff-text-title text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="space-y-3">
                  <h3 className="ff-text-title">Your Prompt:</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border">
                    <p className="ff-text-body text-sm">{userPrompt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-orange-500 font-semibold">AI Model</div>
                    <div className="text-sm text-gray-300">{selectedModel}</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-500 font-semibold">Creation Type</div>
                    <div className="text-sm text-gray-300">{selectedType?.title}</div>
                  </div>
                </div>

                {/* Cancel Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="ff-btn-outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Generation
                  </Button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Generation Error</span>
                    </div>
                    <p className="text-sm text-red-300 mt-2">{error.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Creation Complete!</h2>
                <p className="ff-text-body">Your AI-powered creation is ready to use</p>
              </div>
            </div>

            {result && (
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {selectedType?.icon && (
                      <selectedType.icon className="w-6 h-6 text-orange-500" />
                    )}
                    <span>{result.title}</span>
                  </CardTitle>
                  <p className="ff-text-body">{result.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="files" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="files">Generated Files</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="files" className="space-y-4">
                      <div className="space-y-2">
                        {result.files.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              {file.type === 'folder' ? (
                                <div className="w-4 h-4 text-yellow-500">📁</div>
                              ) : (
                                <div className="w-4 h-4 text-blue-500">📄</div>
                              )}
                              <span className="ff-text-body">{file.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {file.size}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="space-y-4">
                      {result.preview && (
                        <div className="space-y-4">
                          {result.preview.features && (
                            <div>
                              <h4 className="ff-text-title mb-3">Features Included:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {result.preview.features.map((feature, index) => (
                                  <div key={`feature-${feature}-${index}`} className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {result.preview.techStack && (
                            <div>
                              <h4 className="ff-text-title mb-3">Technology Stack:</h4>
                              <div className="flex flex-wrap gap-2">
                                {result.preview.techStack.map((tech, index) => (
                                  <Badge key={`tech-${tech}-${index}`} className="ff-badge-primary">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {result.preview.pieces && (
                            <div>
                              <h4 className="ff-text-title mb-3">Content Pieces:</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {result.preview.pieces.map((piece, index) => (
                                  <div key={`piece-${piece}-${index}`} className="flex items-center space-x-2 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                                    <FileText className="w-4 h-4 text-cyan-500" />
                                    <span className="text-sm">{piece}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="ff-btn-primary ff-btn-lg">
                          <Download className="w-4 h-4 mr-2" />
                          Download All Files
                        </Button>
                        <Button variant="outline" className="ff-btn-outline ff-btn-lg">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Creation
                        </Button>
                        <Button variant="outline" className="ff-btn-secondary ff-btn-lg">
                          <Code className="w-4 h-4 mr-2" />
                          Deploy to Platform
                        </Button>
                        <Button variant="outline" className="ff-btn-accent ff-btn-lg">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Refine with AI
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="ff-btn-outline"
              >
                Create Another
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Publishing
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with History Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="ff-text-headline">AI Creation Workflow</h1>
          <p className="ff-text-body text-sm">Generate content, code, and creative assets with AI</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="ff-btn-outline"
        >
          <History className="w-4 h-4 mr-2" />
          History ({history.length})
        </Button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <Card className="ff-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Generation History</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="ff-input"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {displayHistory.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  No generation history yet. Create something to get started!
                </p>
              ) : (
                displayHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {creationTypes.find(t => t.id === item.type)?.title || item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          </span>
                          <span>{item.model}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          {item.favorite ? (
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreFromHistory(item.id)}
                        >
                          <Wand2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromHistory(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-sm text-gray-400">
                  {history.length} generations saved
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-orange-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}