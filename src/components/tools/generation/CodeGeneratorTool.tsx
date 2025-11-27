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
  Code, Download, Copy, Play, Settings, FileText, Folder, 
  Loader2, Check, AlertCircle, Sparkles, Zap, RefreshCw,
  GitBranch, Package, Terminal, Globe, Brain, Key, TestTube,
  CheckCircle2, Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import AIService, { type AIModel } from '../../../services/AIService';
import { AISetupWizard } from '../../onboarding/AISetupWizard';
import { RepositoryIntegrationCard } from './RepositoryIntegrationCard';

interface CodeGeneratorToolProps {
  onBack?: () => void;
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

interface CodeProject {
  name: string;
  description: string;
  files: GeneratedFile[];
  dependencies: string[];
  scripts: Record<string, string>;
  framework: string;
  language: string;
  features: string[];
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
      const files: GeneratedFile[] = [];
      
      // Main file
      const mainFileName = getMainFileName(codeType, projectName || 'component', language);
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
          path: getTestFileName(codeType, projectName || 'component', language),
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
        content: generatePackageJson(projectName || 'ai-generated-project', framework, selectedFeatures),
        language: 'json',
        size: 512
      });

      const project: CodeProject = {
        name: projectName || `ai-${codeType}-${Date.now()}`,
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
  }, [description, language, codeType, framework, projectName, selectedFeatures, includeTests, includeDocs, aiModelAvailable, currentModel]);

  // Helper functions for generating config files and project structure
  const generateEslintConfig = () => {
    return JSON.stringify({
      "extends": ["eslint:recommended", "@typescript-eslint/recommended"],
      "parser": "@typescript-eslint/parser",
      "plugins": ["@typescript-eslint"],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn"
      }
    }, null, 2);
  };

  const generateTsConfig = () => {
    return JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    }, null, 2);
  };

  const generatePackageJson = (name: string, framework: string, features: string[]) => {
    const dependencies: Record<string, string> = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    };

    if (features.includes('TypeScript Support')) {
      dependencies["typescript"] = "^5.0.0";
      dependencies["@types/react"] = "^18.2.0";
      dependencies["@types/react-dom"] = "^18.2.0";
    }

    const scripts: Record<string, string> = {
      "dev": framework === 'nextjs' ? 'next dev' : 'vite',
      "build": framework === 'nextjs' ? 'next build' : 'vite build',
      "preview": framework === 'nextjs' ? 'next start' : 'vite preview'
    };

    if (features.includes('Unit Tests')) {
      scripts["test"] = "vitest";
      dependencies["vitest"] = "^0.34.0";
    }

    return JSON.stringify({
      "name": name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": scripts,
      "dependencies": dependencies,
      "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "vite": "^4.4.5"
      }
    }, null, 2);
  };

  const generateDependencies = (framework: string, features: string[]): string[] => {
    const deps = ['react', 'react-dom'];
    
    if (features.includes('TypeScript Support')) {
      deps.push('typescript', '@types/react', '@types/react-dom');
    }
    
    if (framework === 'nextjs') {
      deps.push('next');
    }
    
    if (features.includes('Unit Tests')) {
      deps.push('vitest', '@testing-library/react');
    }
    
    return deps;
  };

  const generateScripts = (framework: string): Record<string, string> => {
    const scripts: Record<string, string> = {
      "dev": framework === 'nextjs' ? 'next dev' : 'vite',
      "build": framework === 'nextjs' ? 'next build' : 'vite build',
      "preview": framework === 'nextjs' ? 'next start' : 'vite preview'
    };
    
    return scripts;
  };

  const generateZipContent = (project: CodeProject): string => {
    // Simple text-based "zip" content for demonstration
    let zipContent = `# ${project.name}\n\n`;
    zipContent += `${project.description}\n\n`;
    zipContent += `## Files:\n\n`;
    
    project.files.forEach(file => {
      zipContent += `### ${file.path}\n`;
      zipContent += `\`\`\`${file.language}\n`;
      zipContent += file.content;
      zipContent += `\n\`\`\`\n\n`;
    });
    
    return zipContent;
  };

  const getMainFileName = (type: string, name: string, lang: string): string => {
    const ext = lang === 'typescript' ? 'ts' : 'js';
    const jsxExt = lang === 'typescript' ? 'tsx' : 'jsx';
    
    switch (type) {
      case 'component':
        return `src/components/${name}.${jsxExt}`;
      case 'hook':
        return `src/hooks/use${name}.${ext}`;
      case 'api':
        return `src/api/${name}.${ext}`;
      case 'function':
        return `src/utils/${name}.${ext}`;
      case 'class':
        return `src/classes/${name}.${ext}`;
      default:
        return `src/${name}.${ext}`;
    }
  };

  const getTestFileName = (type: string, name: string, lang: string): string => {
    const ext = lang === 'typescript' ? 'ts' : 'js';
    const jsxExt = lang === 'typescript' ? 'tsx' : 'jsx';
    
    const testExt = type === 'component' ? jsxExt : ext;
    return `src/__tests__/${name}.test.${testExt}`;
  };

  const generateMockProject = useCallback((): CodeProject => {
    const name = projectName || `${codeType}-${Date.now()}`;
    
    // Generate files based on selection
    const files: GeneratedFile[] = [];
    
    // Main component/file
    if (codeType === 'component' && framework === 'react') {
      files.push({
        path: `src/components/${name}.tsx`,
        content: generateReactComponent(name, description, selectedFeatures),
        language: 'typescript',
        size: 1024
      });
      
      files.push({
        path: `src/components/${name}.module.css`,
        content: generateComponentStyles(name),
        language: 'css',
        size: 512
      });
    }
    
    if (codeType === 'api') {
      files.push({
        path: `src/api/${name}.ts`,
        content: generateAPIEndpoint(name, description, selectedFeatures),
        language: 'typescript',
        size: 2048
      });
    }
    
    if (codeType === 'hook') {
      files.push({
        path: `src/hooks/use${name}.ts`,
        content: generateReactHook(name, description),
        language: 'typescript',
        size: 756
      });
    }

    // Configuration files
    files.push({
      path: 'package.json',
      content: generatePackageJson(name, framework, selectedFeatures),
      language: 'json',
      size: 512
    });

    files.push({
      path: 'tsconfig.json',
      content: generateTsConfig(),
      language: 'json',
      size: 256
    });

    // Tests if requested
    if (includeTests) {
      files.push({
        path: `src/__tests__/${name}.test.tsx`,
        content: generateTestFile(name, codeType),
        language: 'typescript',
        size: 1024
      });
    }

    // Documentation if requested
    if (includeDocs) {
      files.push({
        path: 'README.md',
        content: generateReadme(name, description, framework),
        language: 'markdown',
        size: 2048
      });
    }

    // Additional config files based on features
    if (selectedFeatures.includes('ESLint Configuration')) {
      files.push({
        path: '.eslintrc.json',
        content: generateEslintConfig(),
        language: 'json',
        size: 256
      });
    }

    if (selectedFeatures.includes('Docker Support')) {
      files.push({
        path: 'Dockerfile',
        content: generateDockerfile(framework),
        language: 'dockerfile',
        size: 512
      });
    }

    return {
      name,
      description,
      files,
      dependencies: generateDependencies(framework, selectedFeatures),
      scripts: generateScripts(framework),
      framework,
      language,
      features: selectedFeatures
    };
  }, [codeType, framework, projectName, description, selectedFeatures, includeTests, includeDocs]);

  const downloadProject = useCallback(() => {
    if (!generatedProject) return;

    // Create zip file content
    const zipContent = generateZipContent(generatedProject);
    const blob = new Blob([zipContent], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedProject.name}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Project downloaded successfully!');
  }, [generatedProject]);

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
                    
                    <Button onClick={downloadProject} className="w-full ff-btn-primary">
                      <Package className="w-4 h-4 mr-2" />
                      Download as ZIP
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

// Helper functions for generating code
function generateReactComponent(name: string, description: string, features: string[]): string {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const hasTypeScript = features.includes('TypeScript Support');
  
  return `import React${features.includes('React Hook') ? ', { useState, useEffect }' : ''} from 'react';
${features.includes('CSS Modules') ? `import styles from './${name}.module.css';` : ''}

interface ${componentName}Props {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * ${description}
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ${componentName}({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  onClick
}: ${componentName}Props) {
  ${features.includes('React Hook') ? `
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick?.();
    } finally {
      setIsLoading(false);
    }
  };` : ''}

  return (
    <button
      className={\`\${styles.button} \${styles[variant]} \${className}\`}
      disabled={disabled${features.includes('React Hook') ? ' || isLoading' : ''}}
      onClick={${features.includes('React Hook') ? 'handleClick' : 'onClick'}}
      ${features.includes('Accessibility') ? `
      aria-label="${componentName}"
      role="button"` : ''}
    >
      ${features.includes('React Hook') ? '{isLoading ? "Loading..." : children}' : '{children}'}
    </button>
  );
}

export default ${componentName};`;
}

function generateComponentStyles(name: string): string {
  return `.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;
}

.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}

.secondary:hover:not(:disabled) {
  background-color: var(--secondary-hover);
}

.destructive {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}

.destructive:hover:not(:disabled) {
  background-color: var(--destructive-hover);
}`;
}

function generateAPIEndpoint(name: string, description: string, features: string[]): string {
  return `import { Request, Response, NextFunction } from 'express';
${features.includes('Database Integration') ? "import { db } from '../config/database';" : ''}
${features.includes('Validation') ? "import { z } from 'zod';" : ''}
${features.includes('Authentication') ? "import { authenticate } from '../middleware/auth';" : ''}

${features.includes('Validation') ? `
// Request validation schema
const ${name}Schema = z.object({
  // Add your validation rules here
  name: z.string().min(1),
  email: z.string().email(),
});

type ${name.charAt(0).toUpperCase() + name.slice(1)}Request = z.infer<typeof ${name}Schema>;
` : ''}

/**
 * ${description}
 */
export class ${name.charAt(0).toUpperCase() + name.slice(1)}Controller {
  ${features.includes('Authentication') ? '@authenticate' : ''}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      ${features.includes('Validation') ? `
      // Validate request body
      const validatedData = ${name}Schema.parse(req.body);
      ` : 'const data = req.body;'}
      
      ${features.includes('Database Integration') ? `
      // Save to database
      const result = await db.${name}.create({
        data: ${features.includes('Validation') ? 'validatedData' : 'data'}
      });
      ` : `
      // Process the data
      const result = { id: Date.now(), ...${features.includes('Validation') ? 'validatedData' : 'data'} };
      `}
      
      ${features.includes('Logging') ? `console.log(\`Created new ${name}: \${result.id}\`);` : ''}
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      ${features.includes('Error Handling') ? `
      console.error('Error creating ${name}:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
      ` : 'next(error);'}
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      ${features.includes('Database Integration') ? `
      const items = await db.${name}.findMany({
        orderBy: { createdAt: 'desc' }
      });
      ` : `
      const items = []; // Mock data
      `}
      
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      ${features.includes('Error Handling') ? `
      console.error('Error fetching ${name}s:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
      ` : 'next(error);'}
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      ${features.includes('Database Integration') ? `
      const item = await db.${name}.findUnique({
        where: { id: parseInt(id) }
      });
      ` : `
      const item = null; // Mock data
      `}
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: '${name.charAt(0).toUpperCase() + name.slice(1)} not found'
        });
      }
      
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      ${features.includes('Error Handling') ? `
      console.error('Error fetching ${name}:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
      ` : 'next(error);'}
    }
  }
}

export default new ${name.charAt(0).toUpperCase() + name.slice(1)}Controller();`;
}

function generateReactHook(name: string, description: string): string {
  const hookName = `use${name.charAt(0).toUpperCase() + name.slice(1)}`;
  
  return `import { useState, useEffect, useCallback } from 'react';

interface ${hookName}Options {
  initialValue?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface ${hookName}Return {
  data: any;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  reset: () => void;
}

/**
 * ${description}
 * 
 * @param options - Hook configuration options
 * @returns Hook state and methods
 */
export function ${hookName}(options: ${hookName}Options = {}): ${hookName}Return {
  const { initialValue = null, onSuccess, onError } = options;
  
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Implement your data fetching logic here
      const response = await fetch('/api/${name}');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialValue);
    setError(null);
    setLoading(false);
  }, [initialValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset
  };
}

export default ${hookName};`;
}

function generatePackageJson(name: string, framework: string, features: string[]): string {
  const dependencies: Record<string, string> = {
    react: "^18.2.0",
    "react-dom": "^18.2.0"
  };

  const devDependencies: Record<string, string> = {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  };

  if (framework === 'nextjs') {
    dependencies.next = "^13.4.0";
    delete dependencies["react-dom"];
  }

  if (features.includes('ESLint Configuration')) {
    devDependencies.eslint = "^8.45.0";
    devDependencies["@typescript-eslint/eslint-plugin"] = "^6.0.0";
  }

  if (features.includes('Unit Tests')) {
    devDependencies.vitest = "^0.34.0";
    devDependencies["@testing-library/react"] = "^13.4.0";
  }

  return JSON.stringify({
    name,
    version: "1.0.0",
    description: "Generated by FlashFusion AI Code Generator",
    main: "index.js",
    scripts: {
      dev: framework === 'nextjs' ? "next dev" : "vite",
      build: framework === 'nextjs' ? "next build" : "vite build",
      start: framework === 'nextjs' ? "next start" : "vite preview",
      test: features.includes('Unit Tests') ? "vitest" : "echo 'No tests specified'",
      lint: features.includes('ESLint Configuration') ? "eslint . --ext .ts,.tsx" : "echo 'No linting configured'"
    },
    dependencies,
    devDependencies,
    keywords: ["react", framework, "typescript", "generated"],
    author: "FlashFusion AI",
    license: "MIT"
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  }, null, 2);
}

function generateTestFile(name: string, codeType: string): string {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  
  return `import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ${componentName} from './${name}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName}>Test Content</${componentName}>);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    
    render(
      <${componentName} onClick={handleClick}>
        Click me
      </${componentName}>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    const handleClick = vi.fn();
    
    render(
      <${componentName} disabled onClick={handleClick}>
        Disabled
      </${componentName}>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    render(<${componentName} variant="secondary">Secondary</${componentName}>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
  });
});`;
}

function generateReadme(name: string, description: string, framework: string): string {
  return `# ${name}

${description}

## Overview

This project was generated using FlashFusion AI Code Generator with ${framework} framework.

## Features

- 🚀 Built with ${framework}
- 💎 TypeScript support
- 🎨 Modern CSS styling
- 🧪 Test suite included
- 📦 Ready for production

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm test\` - Run test suite
- \`npm run lint\` - Run linter

## Project Structure

\`\`\`
${name}/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── api/           # API endpoints
│   └── __tests__/     # Test files
├── public/            # Static assets
├── package.json       # Dependencies and scripts
└── README.md         # This file
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Generated by FlashFusion

This project was generated using [FlashFusion AI Code Generator](https://flashfusion.ai) - Build faster with AI-powered development tools.
`;
}

function generateEslintConfig(): string {
  return JSON.stringify({
    env: {
      browser: true,
      es2020: true,
      node: true
    },
    extends: [
      "eslint:recommended",
      "@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-var": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }, null, 2);
}

function generateDockerfile(framework: string): string {
  return `# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
`;
}

function generateDependencies(framework: string, features: string[]): string[] {
  const deps = ['react', 'react-dom'];
  
  if (framework === 'nextjs') deps.push('next');
  if (framework === 'express') deps.push('express');
  if (features.includes('TypeScript Support')) deps.push('typescript');
  if (features.includes('Database Integration')) deps.push('prisma');
  if (features.includes('Authentication')) deps.push('jsonwebtoken');
  if (features.includes('Validation')) deps.push('zod');
  
  return deps;
}

function generateScripts(framework: string): Record<string, string> {
  const scripts: Record<string, string> = {
    dev: framework === 'nextjs' ? 'next dev' : 'vite',
    build: framework === 'nextjs' ? 'next build' : 'vite build',
    start: framework === 'nextjs' ? 'next start' : 'vite preview'
  };
  
  return scripts;
}

function generateZipContent(project: CodeProject): string {
  // This would generate actual zip content in a real implementation
  return `Generated project: ${project.name}\nFiles: ${project.files.length}`;
}

export default CodeGeneratorTool;