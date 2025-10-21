import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { CheckCircle, Sparkles, Code, Image, FileText, Download, Share2, Wand2, Zap, Brain, Palette } from 'lucide-react';

interface AICreationWorkflowProps {
  onComplete?: () => void;
}

export function AICreationWorkflow({ onComplete }: AICreationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCreationType, setSelectedCreationType] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const creationTypes = [
    {
      id: 'fullstack-app',
      title: 'Full-Stack Application',
      description: 'Complete web application with frontend, backend, and database',
      icon: Code,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Pro'],
      estimatedTime: '2-5 minutes'
    },
    {
      id: 'content-suite',
      title: 'Content Marketing Suite',
      description: 'Blog posts, social media content, and marketing materials',
      icon: FileText,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Pro'],
      estimatedTime: '30 seconds - 2 minutes'
    },
    {
      id: 'visual-assets',
      title: 'Visual Assets & Branding',
      description: 'Logos, images, brand kits, and visual identity',
      icon: Palette,
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      models: ['DALL-E 3', 'Midjourney', 'Stable Diffusion XL'],
      estimatedTime: '1-3 minutes'
    },
    {
      id: 'code-components',
      title: 'Code Components & APIs',
      description: 'Reusable components, API endpoints, and integrations',
      icon: Brain,
      color: 'bg-gradient-to-r from-green-500 to-teal-500',
      models: ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'CodeLlama'],
      estimatedTime: '1-2 minutes'
    }
  ];

  const selectedType = creationTypes.find(type => type.id === selectedCreationType);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(3);
    
    // Simulate AI generation process
    for (let i = 0; i <= 100; i += 5) {
      setGenerationProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Simulate completion
    setGeneratedContent({
      type: selectedCreationType,
      title: getGeneratedTitle(),
      description: getGeneratedDescription(),
      files: getGeneratedFiles(),
      preview: getGeneratedPreview()
    });
    
    setIsGenerating(false);
    setCurrentStep(4);
  };

  const getGeneratedTitle = () => {
    switch (selectedCreationType) {
      case 'fullstack-app':
        return 'TaskFlow Pro - Project Management App';
      case 'content-suite':
        return 'Content Marketing Campaign - "AI Revolution 2024"';
      case 'visual-assets':
        return 'TechStart Brand Identity Package';
      case 'code-components':
        return 'Advanced React Component Library';
      default:
        return 'Generated Creation';
    }
  };

  const getGeneratedDescription = () => {
    switch (selectedCreationType) {
      case 'fullstack-app':
        return 'Complete project management application with React frontend, Node.js backend, PostgreSQL database, and real-time collaboration features.';
      case 'content-suite':
        return 'Complete marketing campaign including blog posts, social media content, email templates, and promotional materials focused on AI innovation.';
      case 'visual-assets':
        return 'Professional brand identity package including logo variations, color palette, typography guide, and marketing materials.';
      case 'code-components':
        return 'Production-ready React component library with TypeScript, Storybook documentation, and comprehensive testing suite.';
      default:
        return 'AI-generated creation ready for use.';
    }
  };

  const getGeneratedFiles = () => {
    switch (selectedCreationType) {
      case 'fullstack-app':
        return [
          { name: 'frontend/', type: 'folder', size: '15 files' },
          { name: 'backend/', type: 'folder', size: '12 files' },
          { name: 'database/', type: 'folder', size: '5 files' },
          { name: 'docker-compose.yml', type: 'file', size: '2.1 KB' },
          { name: 'README.md', type: 'file', size: '4.3 KB' },
          { name: 'package.json', type: 'file', size: '1.8 KB' }
        ];
      case 'content-suite':
        return [
          { name: 'blog-posts/', type: 'folder', size: '8 files' },
          { name: 'social-media/', type: 'folder', size: '15 files' },
          { name: 'email-templates/', type: 'folder', size: '6 files' },
          { name: 'content-calendar.xlsx', type: 'file', size: '156 KB' },
          { name: 'brand-guidelines.pdf', type: 'file', size: '2.3 MB' }
        ];
      case 'visual-assets':
        return [
          { name: 'logos/', type: 'folder', size: '12 files' },
          { name: 'brand-colors.pdf', type: 'file', size: '890 KB' },
          { name: 'typography-guide.pdf', type: 'file', size: '1.2 MB' },
          { name: 'marketing-materials/', type: 'folder', size: '8 files' },
          { name: 'social-media-templates/', type: 'folder', size: '20 files' }
        ];
      case 'code-components':
        return [
          { name: 'src/components/', type: 'folder', size: '25 files' },
          { name: 'src/hooks/', type: 'folder', size: '8 files' },
          { name: 'src/utils/', type: 'folder', size: '12 files' },
          { name: 'storybook/', type: 'folder', size: '15 files' },
          { name: 'tests/', type: 'folder', size: '30 files' },
          { name: 'package.json', type: 'file', size: '3.2 KB' }
        ];
      default:
        return [];
    }
  };

  const getGeneratedPreview = () => {
    switch (selectedCreationType) {
      case 'fullstack-app':
        return {
          type: 'app',
          features: ['User Authentication', 'Project Dashboard', 'Real-time Chat', 'File Upload', 'API Integration', 'Responsive Design'],
          techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'JWT Auth', 'Docker']
        };
      case 'content-suite':
        return {
          type: 'content',
          pieces: ['5 Blog Posts', '20 Social Media Posts', '6 Email Templates', '1 Content Calendar', '1 Brand Guide'],
          platforms: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'Medium', 'Newsletter']
        };
      case 'visual-assets':
        return {
          type: 'visual',
          assets: ['Primary Logo', '6 Logo Variations', 'Color Palette', 'Typography System', '8 Marketing Templates', '20 Social Templates'],
          formats: ['SVG', 'PNG', 'PDF', 'AI', 'PSD', 'Figma']
        };
      case 'code-components':
        return {
          type: 'code',
          components: ['UI Components', 'Custom Hooks', 'Utility Functions', 'Test Suite', 'Storybook Docs', 'TypeScript Types'],
          features: ['TypeScript', 'Responsive', 'Accessible', 'Tested', 'Documented', 'Tree-shakable']
        };
      default:
        return null;
    }
  };

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
                    <span className="ff-text-title text-sm">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-3" />
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

            {generatedContent && (
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    {selectedType?.icon && (
                      <selectedType.icon className="w-6 h-6 text-orange-500" />
                    )}
                    <span>{generatedContent.title}</span>
                  </CardTitle>
                  <p className="ff-text-body">{generatedContent.description}</p>
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
                        {generatedContent.files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
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
                      {generatedContent.preview && (
                        <div className="space-y-4">
                          {generatedContent.preview.features && (
                            <div>
                              <h4 className="ff-text-title mb-3">Features Included:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {generatedContent.preview.features.map((feature: string, index: number) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {generatedContent.preview.techStack && (
                            <div>
                              <h4 className="ff-text-title mb-3">Technology Stack:</h4>
                              <div className="flex flex-wrap gap-2">
                                {generatedContent.preview.techStack.map((tech: string, index: number) => (
                                  <Badge key={index} className="ff-badge-primary">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {generatedContent.preview.pieces && (
                            <div>
                              <h4 className="ff-text-title mb-3">Content Pieces:</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {generatedContent.preview.pieces.map((piece: string, index: number) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
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
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedCreationType('');
                  setUserPrompt('');
                  setSelectedModel('');
                  setGenerationProgress(0);
                  setGeneratedContent(null);
                }}
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