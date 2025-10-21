import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Switch } from './switch';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { 
  Download, 
  Archive, 
  FileText, 
  Code, 
  Settings, 
  Container, 
  Github, 
  Package,
  Folder,
  Database,
  Cloud,
  Zap,
  FileCheck,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  downloadInFormat, 
  type DownloadFormat, 
  type DownloadOptions,
  type CompressionLevel 
} from '../../utils/multi-format-download';
import type { GeneratedApp } from '../../types/full-stack-builder';

interface MultiFormatDownloadSelectorProps {
  app: GeneratedApp;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: string) => void;
  className?: string;
}

interface FormatOption {
  format: DownloadFormat;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'archive' | 'config' | 'platform' | 'development';
  size: 'small' | 'medium' | 'large';
  recommended?: boolean;
  badge?: string;
}

const formatOptions: FormatOption[] = [
  {
    format: 'zip',
    title: 'ZIP Archive',
    description: 'Complete project in a compressed ZIP file',
    icon: Archive,
    category: 'archive',
    size: 'medium',
    recommended: true,
    badge: 'Most Popular'
  },
  {
    format: 'tar',
    title: 'TAR Archive',
    description: 'Unix-style TAR.GZ compressed archive',
    icon: Archive,
    category: 'archive',
    size: 'medium'
  },
  {
    format: 'individual',
    title: 'Individual Files',
    description: 'Download each file separately',
    icon: Folder,
    category: 'archive',
    size: 'small'
  },
  {
    format: 'json',
    title: 'JSON Export',
    description: 'Project configuration and files in JSON format',
    icon: FileText,
    category: 'config',
    size: 'small'
  },
  {
    format: 'yaml',
    title: 'YAML Export',
    description: 'Project configuration in YAML format',
    icon: FileText,
    category: 'config',
    size: 'small'
  },
  {
    format: 'docker',
    title: 'Docker Package',
    description: 'Complete Docker setup with containers',
    icon: Container,
    category: 'platform',
    size: 'large',
    badge: 'Production Ready'
  },
  {
    format: 'github-template',
    title: 'GitHub Template',
    description: 'Repository template with CI/CD workflows',
    icon: Github,
    category: 'platform',
    size: 'large',
    badge: 'Open Source'
  },
  {
    format: 'vscode-workspace',
    title: 'VS Code Workspace',
    description: 'Optimized for Visual Studio Code development',
    icon: Code,
    category: 'development',
    size: 'medium',
    badge: 'Developer Friendly'
  },
  {
    format: 'npm-package',
    title: 'NPM Package',
    description: 'Installable NPM package format',
    icon: Package,
    category: 'platform',
    size: 'medium'
  },
  {
    format: 'code-only',
    title: 'Code Files Only',
    description: 'Source code without configuration files',
    icon: FileCheck,
    category: 'config',
    size: 'small'
  },
  {
    format: 'config-only',
    title: 'Configuration Only',
    description: 'Configuration and setup files only',
    icon: Settings,
    category: 'config',
    size: 'small'
  }
];

const platformOptions = [
  { value: 'vercel', label: 'Vercel', icon: '▲' },
  { value: 'netlify', label: 'Netlify', icon: '🌐' },
  { value: 'railway', label: 'Railway', icon: '🚂' },
  { value: 'heroku', label: 'Heroku', icon: '🟣' },
  { value: 'aws', label: 'AWS', icon: '☁️' },
  { value: 'azure', label: 'Azure', icon: '🔵' },
  { value: 'gcp', label: 'Google Cloud', icon: '🌤️' }
];

export function MultiFormatDownloadSelector({
  app,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  className = ''
}: MultiFormatDownloadSelectorProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('zip');
  const [options, setOptions] = useState<DownloadOptions>({
    format: 'zip',
    compression: 'medium',
    includeDocumentation: true,
    includeTests: false,
    includeDockerFiles: false,
    includeGitFiles: true,
    includeVSCodeConfig: false,
    includeCICD: false,
    includeDependencies: true,
    includeDevDependencies: false
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [lastDownload, setLastDownload] = useState<{ format: DownloadFormat; timestamp: Date } | null>(null);

  const selectedOption = useMemo(
    () => formatOptions.find(opt => opt.format === selectedFormat),
    [selectedFormat]
  );

  const estimatedSize = useMemo(() => {
    const baseSize = app.files.reduce((total, file) => total + file.content.length, 0);
    const multiplier = selectedOption?.size === 'large' ? 3 : 
                      selectedOption?.size === 'medium' ? 1.5 : 1;
    const withOptions = baseSize * multiplier * 
      (options.includeDocumentation ? 1.2 : 1) *
      (options.includeTests ? 1.5 : 1) *
      (options.includeDockerFiles ? 1.3 : 1) *
      (options.includeCICD ? 1.2 : 1);
    
    return Math.round(withOptions / 1024); // Convert to KB
  }, [app.files, selectedOption, options]);

  const formatByCategory = useMemo(() => {
    return formatOptions.reduce((acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = [];
      }
      acc[option.category].push(option);
      return acc;
    }, {} as Record<string, FormatOption[]>);
  }, []);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    onDownloadStart?.();

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      const downloadOptions: DownloadOptions = {
        ...options,
        format: selectedFormat
      };

      await downloadInFormat(app, downloadOptions);

      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      setLastDownload({
        format: selectedFormat,
        timestamp: new Date()
      });

      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
        onDownloadComplete?.();
      }, 1000);

    } catch (error) {
      setIsDownloading(false);
      setDownloadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      onDownloadError?.(errorMessage);
    }
  };

  const handleFormatSelect = (format: DownloadFormat) => {
    setSelectedFormat(format);
    setOptions(prev => ({ ...prev, format }));
  };

  const updateOption = <K extends keyof DownloadOptions>(
    key: K,
    value: DownloadOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`ff-stagger-fade ${className}`}>
      <Card className="ff-card-interactive ff-glass">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 ff-text-gradient">
                <Download className="h-6 w-6 text-ff-primary" />
                Download Project
              </CardTitle>
              <CardDescription className="text-ff-text-secondary mt-2">
                Choose your preferred download format and customize options for {app.name}
              </CardDescription>
            </div>
            {selectedOption?.badge && (
              <Badge variant="secondary" className="ff-badge-glow">
                {selectedOption.badge}
              </Badge>
            )}
          </div>

          {lastDownload && (
            <Alert className="ff-fade-in-up">
              <CheckCircle2 className="h-4 w-4 text-ff-success" />
              <AlertDescription>
                Last downloaded as {formatOptions.find(f => f.format === lastDownload.format)?.title} 
                at {lastDownload.timestamp.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          <Tabs defaultValue="formats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formats" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Formats
              </TabsTrigger>
              <TabsTrigger value="options" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Options
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="formats" className="space-y-6 mt-6">
              {Object.entries(formatByCategory).map(([category, formats]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold capitalize ff-text-gradient">
                    {category === 'archive' ? 'Archive Formats' :
                     category === 'config' ? 'Configuration Exports' :
                     category === 'platform' ? 'Platform Packages' :
                     'Development Tools'}
                  </h3>
                  
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {formats.map((option) => (
                      <Card
                        key={option.format}
                        className={`cursor-pointer transition-all duration-300 ff-hover-lift ${
                          selectedFormat === option.format
                            ? 'ring-2 ring-ff-primary bg-ff-primary/5 ff-glow'
                            : 'hover:bg-ff-surface-light/50'
                        }`}
                        onClick={() => handleFormatSelect(option.format)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              selectedFormat === option.format
                                ? 'bg-ff-primary text-white'
                                : 'bg-ff-surface text-ff-text-secondary'
                            }`}>
                              <option.icon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-ff-text-primary text-sm truncate">
                                  {option.title}
                                </h4>
                                {option.recommended && (
                                  <Badge variant="secondary" className="text-xs">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-xs text-ff-text-muted line-clamp-2">
                                {option.description}
                              </p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {option.size}
                                </Badge>
                                {option.badge && (
                                  <Badge className="text-xs ff-btn-secondary">
                                    {option.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="options" className="space-y-6 mt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Content Options</CardTitle>
                    <CardDescription>Choose what to include in your download</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="documentation" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentation
                      </Label>
                      <Switch
                        id="documentation"
                        checked={options.includeDocumentation}
                        onCheckedChange={(checked) => updateOption('includeDocumentation', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tests" className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        Test Files
                      </Label>
                      <Switch
                        id="tests"
                        checked={options.includeTests}
                        onCheckedChange={(checked) => updateOption('includeTests', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="docker" className="flex items-center gap-2">
                        <Container className="h-4 w-4" />
                        Docker Files
                      </Label>
                      <Switch
                        id="docker"
                        checked={options.includeDockerFiles}
                        onCheckedChange={(checked) => updateOption('includeDockerFiles', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="git" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        Git Files
                      </Label>
                      <Switch
                        id="git"
                        checked={options.includeGitFiles}
                        onCheckedChange={(checked) => updateOption('includeGitFiles', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vscode" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        VS Code Config
                      </Label>
                      <Switch
                        id="vscode"
                        checked={options.includeVSCodeConfig}
                        onCheckedChange={(checked) => updateOption('includeVSCodeConfig', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cicd" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        CI/CD Workflows
                      </Label>
                      <Switch
                        id="cicd"
                        checked={options.includeCICD}
                        onCheckedChange={(checked) => updateOption('includeCICD', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Advanced Options</CardTitle>
                    <CardDescription>Fine-tune your download package</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="compression">Compression Level</Label>
                      <Select
                        value={options.compression}
                        onValueChange={(value) => updateOption('compression', value as CompressionLevel)}
                      >
                        <SelectTrigger id="compression" className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Fastest)</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium (Recommended)</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="maximum">Maximum (Smallest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {options.includeCICD && (
                      <div className="space-y-2">
                        <Label htmlFor="platform">Target Platform</Label>
                        <Select
                          value={options.platformSpecific || ''}
                          onValueChange={(value) => updateOption('platformSpecific', value as any)}
                        >
                          <SelectTrigger id="platform" className="ff-focus-ring">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformOptions.map((platform) => (
                              <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center gap-2">
                                  <span>{platform.icon}</span>
                                  {platform.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label htmlFor="dependencies" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Dependencies
                      </Label>
                      <Switch
                        id="dependencies"
                        checked={options.includeDependencies}
                        onCheckedChange={(checked) => updateOption('includeDependencies', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="devDependencies" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Dev Dependencies
                      </Label>
                      <Switch
                        id="devDependencies"
                        checked={options.includeDevDependencies}
                        onCheckedChange={(checked) => updateOption('includeDevDependencies', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Download Preview
                  </CardTitle>
                  <CardDescription>
                    Review your download configuration before proceeding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium text-ff-text-primary">Package Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ff-text-muted">Format:</span>
                          <span className="text-ff-text-primary">{selectedOption?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ff-text-muted">Estimated Size:</span>
                          <span className="text-ff-text-primary">
                            {estimatedSize > 1024 
                              ? `${(estimatedSize / 1024).toFixed(1)} MB` 
                              : `${estimatedSize} KB`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ff-text-muted">Compression:</span>
                          <span className="text-ff-text-primary capitalize">{options.compression}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ff-text-muted">Total Files:</span>
                          <span className="text-ff-text-primary">{app.files.length}+</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-ff-text-primary">Included Content</h4>
                      <div className="space-y-2">
                        {[
                          { key: 'includeDocumentation', label: 'Documentation', icon: FileText },
                          { key: 'includeTests', label: 'Tests', icon: FileCheck },
                          { key: 'includeDockerFiles', label: 'Docker', icon: Container },
                          { key: 'includeGitFiles', label: 'Git Files', icon: Github },
                          { key: 'includeVSCodeConfig', label: 'VS Code', icon: Code },
                          { key: 'includeCICD', label: 'CI/CD', icon: Zap }
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            <Icon className="h-3 w-3" />
                            <span className={
                              options[key as keyof DownloadOptions] 
                                ? 'text-ff-success' 
                                : 'text-ff-text-muted line-through'
                            }>
                              {label}
                            </span>
                            {options[key as keyof DownloadOptions] && (
                              <CheckCircle2 className="h-3 w-3 text-ff-success ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedFormat === 'docker' && (
                    <Alert>
                      <Container className="h-4 w-4" />
                      <AlertDescription>
                        Docker package includes complete containerization setup with production-ready configurations.
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedFormat === 'github-template' && (
                    <Alert>
                      <Github className="h-4 w-4" />
                      <AlertDescription>
                        GitHub template includes CI/CD workflows, issue templates, and repository configuration files.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedOption && (
                <>
                  <selectedOption.icon className="h-5 w-5 text-ff-primary" />
                  <div>
                    <p className="font-medium text-ff-text-primary text-sm">
                      {selectedOption.title}
                    </p>
                    <p className="text-xs text-ff-text-muted">
                      {estimatedSize > 1024 
                        ? `~${(estimatedSize / 1024).toFixed(1)} MB` 
                        : `~${estimatedSize} KB`}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="lg"
              className="ff-btn-primary ff-hover-glow min-w-[140px]"
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </div>
              )}
            </Button>
          </div>

          {isDownloading && (
            <div className="space-y-2 ff-fade-in-up">
              <div className="flex justify-between text-sm">
                <span className="text-ff-text-muted">Preparing download...</span>
                <span className="text-ff-text-primary">{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2 ff-progress-bar" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}