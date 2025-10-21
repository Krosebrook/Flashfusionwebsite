import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { 
  Code2, 
  Rocket, 
  Download, 
  Copy, 
  Eye, 
  Settings, 
  Database,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  FileCode,
  FolderTree,
  Play
} from 'lucide-react';
import { aiServiceManager } from '../../services/AIServiceManager';

interface ProjectConfig {
  name: string;
  description: string;
  framework: string;
  styling: string;
  database: string;
  authentication: boolean;
  features: string[];
  deploymentPlatform: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

interface GenerationProgress {
  step: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
  duration?: number;
}

const FRAMEWORKS = [
  { value: 'react', label: 'React', description: 'Modern React with TypeScript' },
  { value: 'nextjs', label: 'Next.js', description: 'Full-stack React framework' },
  { value: 'vue', label: 'Vue.js', description: 'Progressive JavaScript framework' },
  { value: 'nuxt', label: 'Nuxt.js', description: 'Vue.js production framework' },
  { value: 'svelte', label: 'Svelte', description: 'Compile-time optimized framework' },
  { value: 'angular', label: 'Angular', description: 'Enterprise TypeScript framework' }
];

const STYLING_OPTIONS = [
  { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS framework' },
  { value: 'styled-components', label: 'Styled Components', description: 'CSS-in-JS styling' },
  { value: 'emotion', label: 'Emotion', description: 'CSS-in-JS library' },
  { value: 'chakra', label: 'Chakra UI', description: 'Component library' },
  { value: 'mui', label: 'Material-UI', description: 'React component library' }
];

const DATABASE_OPTIONS = [
  { value: 'supabase', label: 'Supabase', description: 'PostgreSQL with real-time' },
  { value: 'firebase', label: 'Firebase', description: 'NoSQL real-time database' },
  { value: 'mongodb', label: 'MongoDB', description: 'Document database' },
  { value: 'prisma', label: 'Prisma + PostgreSQL', description: 'Type-safe database access' },
  { value: 'none', label: 'No Database', description: 'Frontend only' }
];

const FEATURE_OPTIONS = [
  { id: 'auth', label: 'User Authentication', description: 'Login/signup system' },
  { id: 'dashboard', label: 'Admin Dashboard', description: 'Analytics and management' },
  { id: 'api', label: 'REST API', description: 'Backend API endpoints' },
  { id: 'realtime', label: 'Real-time Updates', description: 'Live data synchronization' },
  { id: 'payments', label: 'Payment Integration', description: 'Stripe payment processing' },
  { id: 'notifications', label: 'Push Notifications', description: 'User notifications' },
  { id: 'search', label: 'Search Functionality', description: 'Full-text search' },
  { id: 'analytics', label: 'Analytics Tracking', description: 'User behavior tracking' }
];

const DEPLOYMENT_PLATFORMS = [
  { value: 'vercel', label: 'Vercel', description: 'Optimal for React/Next.js' },
  { value: 'netlify', label: 'Netlify', description: 'JAMstack deployment' },
  { value: 'railway', label: 'Railway', description: 'Full-stack hosting' },
  { value: 'render', label: 'Render', description: 'Cloud application platform' },
  { value: 'aws', label: 'AWS', description: 'Amazon Web Services' }
];

export function FullStackBuilderTool() {
  const [config, setConfig] = useState<ProjectConfig>({
    name: '',
    description: '',
    framework: 'react',
    styling: 'tailwind',
    database: 'supabase',
    authentication: true,
    features: ['auth', 'dashboard'],
    deploymentPlatform: 'vercel'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<GenerationProgress[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');

  const generateProject = async () => {
    if (!config.name.trim() || !config.description.trim()) {
      alert('Please provide project name and description');
      return;
    }

    setIsGenerating(true);
    setGeneratedFiles([]);
    setSelectedFile(null);

    const steps: GenerationProgress[] = [
      { step: 'Project Setup', progress: 0, status: 'pending', message: 'Initializing project structure' },
      { step: 'Core Components', progress: 0, status: 'pending', message: 'Generating main components' },
      { step: 'Styling & Layout', progress: 0, status: 'pending', message: 'Setting up styling system' },
      { step: 'Database Schema', progress: 0, status: 'pending', message: 'Creating database structure' },
      { step: 'API Routes', progress: 0, status: 'pending', message: 'Building backend endpoints' },
      { step: 'Configuration', progress: 0, status: 'pending', message: 'Setting up configs and deployment' }
    ];

    setGenerationSteps(steps);

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const startTime = Date.now();

        // Update step to in-progress
        setGenerationSteps(prev => prev.map((s, index) => 
          index === i ? { ...s, status: 'in-progress' as const, progress: 0 } : s
        ));

        // Generate files for this step
        const stepFiles = await generateStepFiles(step.step, config);

        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          setGenerationSteps(prev => prev.map((s, index) => 
            index === i ? { ...s, progress } : s
          ));
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Complete the step
        const duration = Date.now() - startTime;
        setGenerationSteps(prev => prev.map((s, index) => 
          index === i ? { 
            ...s, 
            status: 'completed' as const, 
            progress: 100, 
            duration,
            message: `Generated ${stepFiles.length} files`
          } : s
        ));

        // Add files to generated files
        setGeneratedFiles(prev => [...prev, ...stepFiles]);
      }

    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationSteps(prev => prev.map(s => 
        s.status === 'in-progress' ? { ...s, status: 'error' as const, message: 'Generation failed' } : s
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateStepFiles = async (step: string, config: ProjectConfig): Promise<GeneratedFile[]> => {
    const files: GeneratedFile[] = [];

    switch (step) {
      case 'Project Setup':
        files.push(...await generateProjectSetup(config));
        break;
      case 'Core Components':
        files.push(...await generateCoreComponents(config));
        break;
      case 'Styling & Layout':
        files.push(...await generateStyling(config));
        break;
      case 'Database Schema':
        if (config.database !== 'none') {
          files.push(...await generateDatabase(config));
        }
        break;
      case 'API Routes':
        files.push(...await generateAPIRoutes(config));
        break;
      case 'Configuration':
        files.push(...await generateConfiguration(config));
        break;
    }

    return files;
  };

  const generateProjectSetup = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    const prompt = `Generate a complete project setup for a ${config.framework} application named "${config.name}".

Description: ${config.description}

Generate these files:
1. package.json with all necessary dependencies
2. tsconfig.json for TypeScript configuration
3. README.md with setup instructions
4. .env.example with required environment variables
5. .gitignore for the project

Framework: ${config.framework}
Styling: ${config.styling}
Database: ${config.database}
Features: ${config.features.join(', ')}

Make sure all dependencies are compatible and up-to-date.`;

    try {
      const response = await aiServiceManager.generateCode(prompt, 'json');
      
      return [
        {
          path: 'package.json',
          content: extractFileContent(response.content, 'package.json'),
          language: 'json',
          size: 1024
        },
        {
          path: 'tsconfig.json',
          content: extractFileContent(response.content, 'tsconfig.json'),
          language: 'json',
          size: 512
        },
        {
          path: 'README.md',
          content: extractFileContent(response.content, 'README.md'),
          language: 'markdown',
          size: 2048
        },
        {
          path: '.env.example',
          content: extractFileContent(response.content, '.env.example'),
          language: 'bash',
          size: 256
        },
        {
          path: '.gitignore',
          content: extractFileContent(response.content, '.gitignore'),
          language: 'text',
          size: 128
        }
      ];
    } catch (error) {
      console.error('Error generating project setup:', error);
      return [];
    }
  };

  const generateCoreComponents = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    // Simplified generation for now
    return [
      {
        path: 'src/App.tsx',
        content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>${config.name}</h1>
      <p>${config.description}</p>
    </div>
  );
}

export default App;`,
        language: 'typescript',
        size: 512
      }
    ];
  };

  const generateStyling = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    return [];
  };

  const generateDatabase = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    return [];
  };

  const generateAPIRoutes = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    return [];
  };

  const generateConfiguration = async (config: ProjectConfig): Promise<GeneratedFile[]> => {
    return [];
  };

  // Helper functions to extract content from AI responses
  const extractFileContent = (content: string, filename: string): string => {
    // Try to extract specific file content from AI response
    const fileStart = content.indexOf(`// ${filename}`) || content.indexOf(`/* ${filename}`);
    if (fileStart !== -1) {
      const nextFileStart = content.indexOf('// ', fileStart + 1);
      return nextFileStart !== -1 ? content.slice(fileStart, nextFileStart) : content.slice(fileStart);
    }
    
    // Fallback: return relevant portion of content
    return content.slice(0, 2000) + (content.length > 2000 ? '...' : '');
  };

  const downloadProject = () => {
    // Create and download zip file
    const zip = generateProjectZip(generatedFiles);
    const blob = new Blob([zip], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateProjectZip = (files: GeneratedFile[]): string => {
    // Simplified zip generation - in production, use JSZip library
    return files.map(file => `${file.path}:\n${file.content}`).join('\n\n---\n\n');
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Show success message
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold ff-text-gradient">
            Full-Stack Application Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate complete, production-ready applications with AI. From idea to deployment in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="ff-card-interactive sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Project Configuration
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome App"
                      className="ff-focus-ring"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your application will do..."
                      className="ff-focus-ring"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Framework Selection */}
                <div>
                  <Label>Frontend Framework</Label>
                  <Select value={config.framework} onValueChange={(value) => setConfig(prev => ({ ...prev, framework: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAMEWORKS.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          <div>
                            <div className="font-medium">{framework.label}</div>
                            <div className="text-xs text-muted-foreground">{framework.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Styling */}
                <div>
                  <Label>Styling Solution</Label>
                  <Select value={config.styling} onValueChange={(value) => setConfig(prev => ({ ...prev, styling: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateProject}
                  disabled={isGenerating || !config.name.trim() || !config.description.trim()}
                  className="w-full ff-btn-primary"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Generate Application
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {isGenerating && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                    Generation Progress
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {generationSteps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-success" />}
                          {step.status === 'in-progress' && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
                          {step.status === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                          {step.status === 'pending' && <Clock className="w-4 h-4 text-muted-foreground" />}
                          
                          <span className="font-medium">{step.step}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {step.duration && <span>{step.duration}ms</span>}
                          <span>{step.progress}%</span>
                        </div>
                      </div>
                      
                      <Progress value={step.progress} className="h-2" />
                      
                      {step.message && (
                        <p className="text-sm text-muted-foreground">{step.message}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {generatedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-primary" />
                      Generated Files ({generatedFiles.length})
                    </CardTitle>
                    <Button onClick={downloadProject} className="ff-btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Project
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedFiles.map((file, index) => (
                      <div key={index} className="border rounded p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{file.path}</span>
                          <Badge variant="outline">{file.language}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {file.size} bytes
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedFile(file)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(file.content)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedFile && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-primary" />
                    {selectedFile.path}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedFile.content}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for compatibility
export default FullStackBuilderTool;