import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  Code,
  Download,
  Copy,
  FileText,
  Folder,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
  Zap,
  RefreshCw,
  GitBranch,
  Package,
  Terminal,
  Globe,
  Brain,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import AIService, { type AIModel } from '../../../services/AIService';
import { AISetupWizard } from '../../onboarding/AISetupWizard';
import { useProjectExport } from '../../../hooks/useProjectExport';
import type { CodeProject } from '../../../types/code-generation';
import {
  generateDependencies,
  generateEslintConfig,
  generatePackageJson,
  generateScripts,
  generateTsConfig,
  getMainFileName,
  getTestFileName
} from '../../../services/codeGenerationTemplates';

interface CodeGeneratorToolProps {
  onBack?: () => void;
}

const PROGRAMMING_LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', icon: '🔷', popular: true },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', popular: true },
  { id: 'python', name: 'Python', icon: '🐍', popular: true },
  { id: 'java', name: 'Java', icon: '☕', popular: true },
  { id: 'csharp', name: 'C#', icon: '🔷', popular: false },
  { id: 'go', name: 'Go', icon: '🐹', popular: false },
  { id: 'rust', name: 'Rust', icon: '🦀', popular: false },
  { id: 'php', name: 'PHP', icon: '🐘', popular: false },
  { id: 'ruby', name: 'Ruby', icon: '💎', popular: false },
  { id: 'swift', name: 'Swift', icon: '🍎', popular: false },
  { id: 'kotlin', name: 'Kotlin', icon: '🎯', popular: false },
  { id: 'dart', name: 'Dart', icon: '🎯', popular: false },
];

const CODE_TYPES = [
  { id: 'component', name: 'React Component', icon: '⚛️', description: 'Reusable UI components' },
  { id: 'api', name: 'REST API', icon: '🌐', description: 'Backend API endpoints' },
  { id: 'function', name: 'Function/Method', icon: '⚡', description: 'Utility functions' },
  { id: 'class', name: 'Class/Object', icon: '🏗️', description: 'Object-oriented structures' },
  { id: 'hook', name: 'React Hook', icon: '🪝', description: 'Custom React hooks' },
  { id: 'middleware', name: 'Middleware', icon: '🔗', description: 'Server middleware' },
  { id: 'schema', name: 'Database Schema', icon: '🗄️', description: 'Database structures' },
  { id: 'config', name: 'Configuration', icon: '⚙️', description: 'Config files' },
  { id: 'test', name: 'Test Suite', icon: '🧪', description: 'Unit and integration tests' },
  { id: 'utility', name: 'Utility Library', icon: '🔧', description: 'Helper utilities' },
];

const FRAMEWORKS = [
  { id: 'react', name: 'React', icon: '⚛️', language: 'typescript' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', language: 'typescript' },
  { id: 'vue', name: 'Vue.js', icon: '💚', language: 'typescript' },
  { id: 'angular', name: 'Angular', icon: '🅰️', language: 'typescript' },
  { id: 'svelte', name: 'Svelte', icon: '🧡', language: 'typescript' },
  { id: 'express', name: 'Express.js', icon: '🚂', language: 'javascript' },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', language: 'python' },
  { id: 'django', name: 'Django', icon: '🎸', language: 'python' },
  { id: 'spring', name: 'Spring Boot', icon: '🍃', language: 'java' },
  { id: 'laravel', name: 'Laravel', icon: '🔺', language: 'php' },
];

const FEATURE_OPTIONS = [
  'TypeScript Support',
  'ESLint Configuration',
  'Prettier Formatting',
  'Unit Tests',
  'Integration Tests',
  'API Documentation',
  'Error Handling',
  'Logging',
  'Authentication',
  'Database Integration',
  'Caching',
  'Rate Limiting',
  'Validation',
  'Swagger/OpenAPI',
  'Docker Support',
  'CI/CD Pipeline',
];

export function CodeGeneratorTool({ onBack }: CodeGeneratorToolProps) {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { isExporting, downloadProjectZip } = useProjectExport();
  
  // Form state
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [codeType, setCodeType] = useState('component');
  const [framework, setFramework] = useState('react');
  const [projectName, setProjectName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [includeTests, setIncludeTests] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [outputFormat, setOutputFormat] = useState('project');
  
  // Repository integration state
  const [useRepository, setUseRepository] = useState(false);
  const [connectedRepositories, setConnectedRepositories] = useState<any[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);
  
  // Generated state
  const [generatedProject, setGeneratedProject] = useState<CodeProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const availableFrameworks = useMemo(() => {
    return FRAMEWORKS.filter(f => f.language === language || language === 'typescript' || language === 'javascript');
  }, [language]);

  const handleFeatureToggle = useCallback((feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  }, []);

  // AI state management
  const [aiModelAvailable, setAiModelAvailable] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null);
  const [showAiSetup, setShowAiSetup] = useState(false);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);

  useEffect(() => {
    loadAiStatus();
    loadConnectedRepositories();
    
    // Refresh AI status periodically
    const interval = setInterval(loadAiStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadConnectedRepositories = () => {
    const saved = localStorage.getItem('ff_connected_repositories');
    if (saved) {
      try {
        const repos = JSON.parse(saved);
        setConnectedRepositories(repos.filter((repo: any) => repo.status === 'connected'));
      } catch (error) {
        console.error('Failed to load repositories:', error);
      }
    }
  };

  const loadAiStatus = () => {
    const model = AIService.getCurrentModel();
    const models = AIService.getAvailableModels();
    const stats = AIService.getUsageStats();
    
    setCurrentModel(model);
    setAvailableModels(models);
    setUsageStats(stats);
    setAiModelAvailable(!!model && models.length > 0);
  };

  const normalizeProjectName = useCallback((name: string) => {
    const trimmed = name.trim();
    const baseName = trimmed || `${codeType}-${Date.now()}`;
    const sanitized = baseName.replace(/[^a-z0-9-_]/gi, '-').replace(/-+/g, '-');
    return sanitized || `${codeType}-${Date.now()}`;
  }, [codeType]);

  const generateCode = useCallback(async () => {
    if (!description.trim()) {
      toast.error('Please provide a description of what you want to generate');
      return;
    }

    if (!aiModelAvailable) {
      toast.error('Please configure an AI model first');
      setShowAiSetup(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Update progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 90) return prev + Math.random() * 10;
          return prev;
        });
      }, 500);

      toast.info('Starting AI-powered code generation...');

      // Prepare repository context if selected
      const selectedRepo = useRepository && selectedRepository 
        ? connectedRepositories.find(repo => repo.id === selectedRepository)
        : null;

      // Generate the main code using AI with repository context
      const codeRequest = {
        type: codeType as any,
        framework,
        requirements: description,
        context: {
          dependencies: selectedFeatures,
          styleGuide: 'Use FlashFusion design system with brand colors and animations',
          repository: selectedRepo ? {
            url: selectedRepo.url,
            branch: selectedRepo.branch,
            accessToken: selectedRepo.accessToken,
            provider: selectedRepo.provider,
            isPrivate: selectedRepo.isPrivate
          } : undefined
        },
        options: {
          includeTypeScript: selectedFeatures.includes('TypeScript Support'),
          includeDocumentation: includeDocs,
          includeTests: includeTests,
          optimizeForPerformance: true,
          analyzeRepository: useRepository && !!selectedRepo
        }
      };

      const mainCode = useRepository && selectedRepo 
        ? await AIService.generateCodeWithRepository(codeRequest)
        : await AIService.generateCode(codeRequest);

      clearInterval(progressInterval);
      setGenerationProgress(90);

      // Generate additional files based on type and features
      const files = [];
      
      // Main file
      const safeProjectName = normalizeProjectName(projectName);
      const mainFileName = getMainFileName(codeType, safeProjectName, language);
      files.push({
        path: mainFileName,
        content: mainCode,
        language: language === 'typescript' ? 'typescript' : 'javascript',
        size: new Blob([mainCode]).size
      });

      // Generate tests if requested
      if (includeTests) {
        const testCode = await AIService.generateCode({
          type: 'test',
          framework,
          requirements: `Generate comprehensive unit tests for: ${description}`,
          context: {
            existingCode: mainCode
          },
          options: {
            includeTypeScript: selectedFeatures.includes('TypeScript Support')
          }
        });

        files.push({
          path: getTestFileName(codeType, safeProjectName, language),
          content: testCode,
          language: language === 'typescript' ? 'typescript' : 'javascript',
          size: new Blob([testCode]).size
        });
      }

      // Generate documentation if requested
      if (includeDocs) {
        const documentation = await AIService.generateDocumentation(mainCode, codeType as any);
        files.push({
          path: 'README.md',
          content: documentation,
          language: 'markdown',
          size: new Blob([documentation]).size
        });
      }

      // Generate configuration files based on features
      if (selectedFeatures.includes('ESLint Configuration')) {
        files.push({
          path: '.eslintrc.json',
          content: generateEslintConfig(),
          language: 'json',
          size: 256
        });
      }

      if (selectedFeatures.includes('TypeScript Support')) {
        files.push({
          path: 'tsconfig.json',
          content: generateTsConfig(),
          language: 'json',
          size: 256
        });
      }

      // Generate package.json
      files.push({
        path: 'package.json',
        content: generatePackageJson(safeProjectName || 'ai-generated-project', framework, selectedFeatures),
        language: 'json',
        size: 512
      });

      const project: CodeProject = {
        name: safeProjectName,
        description,
        files,
        dependencies: generateDependencies(framework, selectedFeatures),
        scripts: generateScripts(framework),
        framework,
        language,
        features: selectedFeatures
      };

      setGenerationProgress(100);
      setGeneratedProject(project);
      setSelectedFile(project.files[0]?.path || null);
      setActiveTab('preview');
      
      toast.success(`🎉 AI-generated ${codeType} is ready!`);
      toast.info(`Generated using ${currentModel?.name}`);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [description, language, codeType, framework, projectName, selectedFeatures, includeTests, includeDocs, aiModelAvailable, currentModel, normalizeProjectName]);

  const downloadProject = useCallback(async () => {
    if (!generatedProject) return;

    const result = await downloadProjectZip(generatedProject);
    if (result.success) {
      toast.success('Project downloaded successfully!');
    } else {
      toast.error(result.error.message);
    }
  }, [generatedProject, downloadProjectZip]);

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Setup Wizard */}
      {showAiSetup && (
        <AISetupWizard
          onComplete={() => {
            setShowAiSetup(false);
            loadAiStatus();
            toast.success('AI setup complete! You can now generate code.');
          }}
          onClose={() => setShowAiSetup(false)}
        />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedProject} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="download" disabled={!generatedProject} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* AI Status Card */}
          <Card className={`ff-card-interactive ${!aiModelAvailable ? 'border-ff-warning/50 bg-ff-warning/5' : 'border-ff-success/50 bg-ff-success/5'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className={`w-5 h-5 ${aiModelAvailable ? 'text-ff-success' : 'text-ff-warning'}`} />
                  AI Service Status
                </div>
                <div className="flex items-center gap-2">
                  {currentModel && (
                    <Badge className="ff-btn-primary">
                      {currentModel.name}
                    </Badge>
                  )}
                  <div className={`w-2 h-2 rounded-full ${aiModelAvailable ? 'bg-ff-success' : 'bg-ff-warning'}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiModelAvailable ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-success">{availableModels.length}</div>
                    <div className="text-xs text-ff-text-muted">Models Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-primary">{currentModel?.name}</div>
                    <div className="text-xs text-ff-text-muted">Selected Model</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-secondary">
                      {usageStats?.requestCount || 0}
                    </div>
                    <div className="text-xs text-ff-text-muted">Requests Made</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-accent">
                      ${(usageStats?.totalCost || 0).toFixed(4)}
                    </div>
                    <div className="text-xs text-ff-text-muted">Total Cost</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No AI models are configured. Set up your AI providers to start generating code.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAiSetup(true)}
                      className="ff-btn-primary"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Setup AI Models
                    </Button>
                    <Button
                      variant="outline"
                      onClick={loadAiStatus}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Code Generation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  What do you want to build? *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the component, function, or feature you want to generate. Be as specific as possible..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] ff-focus-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "A reusable button component with variants for primary, secondary, and destructive actions"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Code Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CODE_TYPES.slice(0, 6).map(type => (
                      <Button
                        key={type.id}
                        variant={codeType === type.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCodeType(type.id)}
                        className="justify-start p-3 h-auto"
                      >
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span className="font-medium text-xs">{type.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Language & Framework */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Programming Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Popular</div>
                        {PROGRAMMING_LANGUAGES.filter(lang => lang.popular).map(lang => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <div className="flex items-center gap-2">
                              <span>{lang.icon}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <Separator className="my-1" />
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Others</div>
                        {PROGRAMMING_LANGUAGES.filter(lang => !lang.popular).map(lang => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <div className="flex items-center gap-2">
                              <span>{lang.icon}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Framework (Optional)</Label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFrameworks.map(fw => (
                          <SelectItem key={fw.id} value={fw.id}>
                            <div className="flex items-center gap-2">
                              <span>{fw.icon}</span>
                              <span>{fw.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-sm font-medium">
                  Project/Component Name (Optional)
                </Label>
                <Input
                  id="projectName"
                  placeholder="my-awesome-component"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="ff-focus-ring"
                />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Features & Configurations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FEATURE_OPTIONS.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Switch
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-xs cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeTests"
                    checked={includeTests}
                    onCheckedChange={setIncludeTests}
                  />
                  <Label htmlFor="includeTests" className="text-sm cursor-pointer">
                    Include Tests
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeDocs"
                    checked={includeDocs}
                    onCheckedChange={setIncludeDocs}
                  />
                  <Label htmlFor="includeDocs" className="text-sm cursor-pointer">
                    Include Documentation
                  </Label>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Generating your code...</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    This may take a few moments depending on complexity
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-4">
                <Button
                  onClick={generateCode}
                  disabled={isGenerating || !description.trim()}
                  className="ff-btn-primary flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
                
                {generatedProject && (
                  <Button variant="outline" onClick={() => setActiveTab('preview')}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {generatedProject && (
            <>
              {/* Project Overview */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      {generatedProject.name}
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {generatedProject.framework}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{generatedProject.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">{generatedProject.files.length}</div>
                      <div className="text-xs text-muted-foreground">Files</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-secondary">{generatedProject.dependencies.length}</div>
                      <div className="text-xs text-muted-foreground">Dependencies</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-accent">{generatedProject.features.length}</div>
                      <div className="text-xs text-muted-foreground">Features</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-warning">
                        {Math.round(generatedProject.files.reduce((acc, file) => acc + file.size, 0) / 1024)}KB
                      </div>
                      <div className="text-xs text-muted-foreground">Total Size</div>
                    </div>
                  </div>
                  
                  {generatedProject.features.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Included Features</Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedProject.features.map(feature => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* File Explorer and Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* File Tree */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Folder className="w-4 h-4" />
                      Project Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {generatedProject.files.map(file => (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file.path)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${
                            selectedFile === file.path ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono">{file.path}</span>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(file.size / 1024)}KB
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Code Editor */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Code className="w-4 h-4" />
                        {selectedFile || 'Select a file'}
                      </CardTitle>
                      {selectedFile && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const file = generatedProject.files.find(f => f.path === selectedFile);
                            if (file) copyToClipboard(file.content);
                          }}
                          className="ff-hover-scale"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {selectedFile ? (
                      <div className="relative">
                        <pre className="bg-muted/30 p-4 rounded-lg overflow-auto max-h-[500px] text-sm">
                          <code>
                            {generatedProject.files.find(f => f.path === selectedFile)?.content}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Select a file from the project tree to view its contents
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          {generatedProject && (
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Export Your Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Download Options</h3>
                    
                    <Button onClick={downloadProject} className="w-full ff-btn-primary" disabled={isExporting}>
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Preparing ZIP...
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4 mr-2" />
                          Download as ZIP
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <GitBranch className="w-4 h-4 mr-2" />
                      Push to GitHub
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Terminal className="w-4 h-4 mr-2" />
                      Copy CLI Commands
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Next Steps</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5" />
                        <div>
                          <p className="font-medium">Install Dependencies</p>
                          <p className="text-muted-foreground">Run <code>npm install</code> or <code>yarn install</code></p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5" />
                        <div>
                          <p className="font-medium">Start Development</p>
                          <p className="text-muted-foreground">Run <code>npm run dev</code> to start the development server</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5" />
                        <div>
                          <p className="font-medium">Run Tests</p>
                          <p className="text-muted-foreground">Execute <code>npm test</code> to run the test suite</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Package.json Scripts</h4>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <pre className="text-sm">
                      {JSON.stringify(generatedProject.scripts, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CodeGeneratorTool;
