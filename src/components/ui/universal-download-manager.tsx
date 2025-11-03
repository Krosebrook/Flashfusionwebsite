import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Switch } from './switch';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { Input } from './input';
import { 
  Download, 
  Archive, 
  FileText, 
  Code, 
  Settings, 
  Docker, 
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
  Loader2,
  Copy,
  ExternalLink,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Universal Download Manager for FlashFusion
 * Works with any type of generated content - code, configurations, documents, images, etc.
 */

export interface DownloadableContent {
  id: string;
  name: string;
  description?: string;
  type: 'code' | 'config' | 'document' | 'image' | 'data' | 'other';
  content: string | Blob | ArrayBuffer;
  filename: string;
  mimeType?: string;
  size?: number;
  metadata?: Record<string, any>;
}

export interface DownloadPackageConfig {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  license?: string;
  repository?: string;
  homepage?: string;
  tags?: string[];
}

export type UniversalDownloadFormat = 
  | 'zip' 
  | 'tar' 
  | 'individual' 
  | 'json' 
  | 'yaml' 
  | 'csv'
  | 'pdf'
  | 'markdown'
  | 'html'
  | 'npm-package'
  | 'github-gist'
  | 'codepen';

export interface UniversalDownloadOptions {
  format: UniversalDownloadFormat;
  compression?: 'none' | 'low' | 'medium' | 'high' | 'maximum';
  includeMetadata?: boolean;
  includeIndex?: boolean;
  includeReadme?: boolean;
  customFilename?: string;
  preserveStructure?: boolean;
  addTimestamp?: boolean;
  filterByType?: string[];
  sortBy?: 'name' | 'type' | 'size' | 'date';
  sortOrder?: 'asc' | 'desc';
}

interface UniversalDownloadManagerProps {
  content: DownloadableContent[];
  packageConfig?: DownloadPackageConfig;
  onDownloadStart?: (format: UniversalDownloadFormat) => void;
  onDownloadComplete?: (format: UniversalDownloadFormat, filename: string) => void;
  onDownloadError?: (error: string) => void;
  onExternalShare?: (platform: string, content: DownloadableContent[]) => void;
  className?: string;
  showExternalSharing?: boolean;
  allowCustomFilename?: boolean;
  showPreview?: boolean;
}

const formatOptions = [
  {
    format: 'zip' as UniversalDownloadFormat,
    title: 'ZIP Archive',
    description: 'Compressed archive with all files',
    icon: Archive,
    category: 'archive',
    recommended: true
  },
  {
    format: 'individual' as UniversalDownloadFormat,
    title: 'Individual Files',
    description: 'Download each file separately',
    icon: Folder,
    category: 'archive'
  },
  {
    format: 'json' as UniversalDownloadFormat,
    title: 'JSON Export',
    description: 'Structured JSON format',
    icon: Code,
    category: 'data'
  },
  {
    format: 'markdown' as UniversalDownloadFormat,
    title: 'Markdown Document',
    description: 'Combined markdown file',
    icon: FileText,
    category: 'document'
  },
  {
    format: 'html' as UniversalDownloadFormat,
    title: 'HTML Package',
    description: 'Web-viewable HTML files',
    icon: ExternalLink,
    category: 'document'
  },
  {
    format: 'npm-package' as UniversalDownloadFormat,
    title: 'NPM Package',
    description: 'Installable NPM package',
    icon: Package,
    category: 'platform'
  }
];

const externalPlatforms = [
  { id: 'github-gist', name: 'GitHub Gist', icon: Github, description: 'Create a GitHub Gist' },
  { id: 'codepen', name: 'CodePen', icon: Code, description: 'Open in CodePen' },
  { id: 'codesandbox', name: 'CodeSandbox', icon: Code, description: 'Open in CodeSandbox' }
];

export function UniversalDownloadManager({
  content,
  packageConfig,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  onExternalShare,
  className = '',
  showExternalSharing = true,
  allowCustomFilename = true,
  showPreview = true
}: UniversalDownloadManagerProps) {
  const [selectedFormat, setSelectedFormat] = useState<UniversalDownloadFormat>('zip');
  const [options, setOptions] = useState<UniversalDownloadOptions>({
    format: 'zip',
    compression: 'medium',
    includeMetadata: true,
    includeIndex: true,
    includeReadme: true,
    preserveStructure: true,
    addTimestamp: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [customFilename, setCustomFilename] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredContent = useMemo(() => {
    let filtered = filterType === 'all' ? content : content.filter(item => item.type === filterType);
    
    // Sort content
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (options.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return options.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [content, filterType, options.sortBy, options.sortOrder]);

  const totalSize = useMemo(() => {
    return filteredContent.reduce((total, item) => {
      return total + (item.size || getContentSize(item.content));
    }, 0);
  }, [filteredContent]);

  const contentTypes = useMemo(() => {
    const types = new Set(content.map(item => item.type));
    return Array.from(types);
  }, [content]);

  const handleDownload = useCallback(async () => {
    if (isDownloading || filteredContent.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    onDownloadStart?.(selectedFormat);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      await downloadContent(filteredContent, selectedFormat, options, packageConfig, customFilename);

      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      const filename = generateFilename(selectedFormat, options, packageConfig, customFilename);
      
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
        onDownloadComplete?.(selectedFormat, filename);
      }, 1000);

    } catch (error) {
      setIsDownloading(false);
      setDownloadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      onDownloadError?.(errorMessage);
    }
  }, [filteredContent, selectedFormat, options, packageConfig, customFilename, isDownloading]);

  const handleExternalShare = useCallback((platformId: string) => {
    if (onExternalShare) {
      onExternalShare(platformId, filteredContent);
    } else {
      toast.info(`${platformId} sharing will be implemented soon!`);
    }
  }, [filteredContent, onExternalShare]);

  const copyContentToClipboard = useCallback(async () => {
    try {
      if (filteredContent.length === 1) {
        const content = await getStringContent(filteredContent[0].content);
        await navigator.clipboard.writeText(content);
        toast.success('Content copied to clipboard!');
      } else {
        const combined = await Promise.all(
          filteredContent.map(async item => {
            const content = await getStringContent(item.content);
            return `// ${item.filename}\n${content}\n\n`;
          })
        );
        await navigator.clipboard.writeText(combined.join(''));
        toast.success('All content copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }, [filteredContent]);

  const selectedOption = useMemo(
    () => formatOptions.find(opt => opt.format === selectedFormat),
    [selectedFormat]
  );

  return (
    <div className={`ff-stagger-fade ${className}`}>
      <Card className="ff-card-interactive ff-glass">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 ff-text-gradient">
                <Download className="h-6 w-6 text-ff-primary" />
                Universal Download Manager
              </CardTitle>
              <CardDescription className="text-ff-text-secondary mt-2">
                {packageConfig?.name 
                  ? `Download ${packageConfig.name} in your preferred format`
                  : `Download ${filteredContent.length} items in various formats`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="ff-badge-glow">
                {filteredContent.length} items
              </Badge>
              <Badge variant="outline" className="text-ff-text-muted">
                {formatBytes(totalSize)}
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyContentToClipboard}
              className="ff-focus-ring"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy All
            </Button>
            
            {showExternalSharing && externalPlatforms.map(platform => (
              <Button
                key={platform.id}
                variant="outline"
                size="sm"
                onClick={() => handleExternalShare(platform.id)}
                className="ff-focus-ring"
              >
                <platform.icon className="h-3 w-3 mr-1" />
                {platform.name}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ff-text-primary">Download Format</h3>
              {selectedOption?.recommended && (
                <Badge className="ff-btn-secondary">Recommended</Badge>
              )}
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formatOptions.map((option) => (
                <Card
                  key={option.format}
                  className={`cursor-pointer transition-all duration-300 ff-hover-lift ${
                    selectedFormat === option.format
                      ? 'ring-2 ring-ff-primary bg-ff-primary/5'
                      : 'hover:bg-ff-surface-light/50'
                  }`}
                  onClick={() => {
                    setSelectedFormat(option.format);
                    setOptions(prev => ({ ...prev, format: option.format }));
                  }}
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
                        <h4 className="font-medium text-ff-text-primary text-sm mb-1">
                          {option.title}
                        </h4>
                        <p className="text-xs text-ff-text-muted line-clamp-2">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Options and Filters */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-ff-text-primary">Content Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-type">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="filter-type" className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types ({content.length})</SelectItem>
                      {contentTypes.map(type => {
                        const count = content.filter(item => item.type === type).length;
                        return (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-metadata">Include Metadata</Label>
                  <Switch
                    id="include-metadata"
                    checked={options.includeMetadata}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeMetadata: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-readme">Include README</Label>
                  <Switch
                    id="include-readme"
                    checked={options.includeReadme}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeReadme: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="add-timestamp">Add Timestamp</Label>
                  <Switch
                    id="add-timestamp"
                    checked={options.addTimestamp}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, addTimestamp: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-ff-text-primary">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="compression">Compression Level</Label>
                  <Select
                    value={options.compression}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      compression: value as typeof options.compression 
                    }))}
                  >
                    <SelectTrigger id="compression" className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="maximum">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={options.sortBy}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      sortBy: value as typeof options.sortBy 
                    }))}
                  >
                    <SelectTrigger id="sort-by" className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {allowCustomFilename && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-filename">Custom Filename</Label>
                    <Input
                      id="custom-filename"
                      placeholder="Enter custom filename"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      className="ff-focus-ring"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-ff-text-primary">
                  <Info className="h-4 w-4" />
                  Download Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-ff-text-primary">Package Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ff-text-muted">Format:</span>
                        <span className="text-ff-text-primary">{selectedOption?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ff-text-muted">Files:</span>
                        <span className="text-ff-text-primary">{filteredContent.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ff-text-muted">Size:</span>
                        <span className="text-ff-text-primary">{formatBytes(totalSize)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-ff-text-primary">Content Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {contentTypes.map(type => {
                        const count = filteredContent.filter(item => item.type === type).length;
                        return (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type} ({count})
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Download Action */}
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
                      {filteredContent.length} files • {formatBytes(totalSize)}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloading || filteredContent.length === 0}
              size="lg"
              className="ff-btn-primary ff-hover-glow min-w-[140px]"
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
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

// Utility functions
function getContentSize(content: string | Blob | ArrayBuffer): number {
  if (typeof content === 'string') {
    return new Blob([content]).size;
  } else if (content instanceof Blob) {
    return content.size;
  } else if (content instanceof ArrayBuffer) {
    return content.byteLength;
  }
  return 0;
}

async function getStringContent(content: string | Blob | ArrayBuffer): Promise<string> {
  if (typeof content === 'string') {
    return content;
  } else if (content instanceof Blob) {
    return await content.text();
  } else if (content instanceof ArrayBuffer) {
    return new TextDecoder().decode(content);
  }
  return '';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateFilename(
  format: UniversalDownloadFormat,
  options: UniversalDownloadOptions,
  packageConfig?: DownloadPackageConfig,
  customFilename?: string
): string {
  const base = customFilename || 
               packageConfig?.name || 
               'flashfusion-export';
  
  const timestamp = options.addTimestamp 
    ? `-${new Date().toISOString().split('T')[0]}` 
    : '';
  
  const extension = getFileExtension(format);
  
  return `${base}${timestamp}.${extension}`;
}

function getFileExtension(format: UniversalDownloadFormat): string {
  const extensions: Record<UniversalDownloadFormat, string> = {
    'zip': 'zip',
    'tar': 'tar.gz',
    'individual': 'files',
    'json': 'json',
    'yaml': 'yaml',
    'csv': 'csv',
    'pdf': 'pdf',
    'markdown': 'md',
    'html': 'html',
    'npm-package': 'tgz',
    'github-gist': 'gist',
    'codepen': 'pen'
  };
  
  return extensions[format] || 'zip';
}

async function downloadContent(
  content: DownloadableContent[],
  format: UniversalDownloadFormat,
  options: UniversalDownloadOptions,
  packageConfig?: DownloadPackageConfig,
  customFilename?: string
): Promise<void> {
  const filename = generateFilename(format, options, packageConfig, customFilename);

  switch (format) {
    case 'zip':
      return await downloadAsZip(content, options, filename);
    case 'individual':
      return await downloadIndividual(content);
    case 'json':
      return await downloadAsJSON(content, options, filename);
    case 'markdown':
      return await downloadAsMarkdown(content, filename);
    case 'html':
      return await downloadAsHTML(content, filename);
    default:
      throw new Error(`Format ${format} not implemented yet`);
  }
}

async function downloadAsZip(
  content: DownloadableContent[],
  options: UniversalDownloadOptions,
  filename: string
): Promise<void> {
  const zip = new JSZip();

  for (const item of content) {
    const stringContent = await getStringContent(item.content);
    zip.file(item.filename, stringContent);
  }

  if (options.includeMetadata) {
    zip.file('_metadata.json', JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalFiles: content.length,
      totalSize: content.reduce((sum, item) => sum + getContentSize(item.content), 0)
    }, null, 2));
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, filename);
}

async function downloadIndividual(content: DownloadableContent[]): Promise<void> {
  for (let i = 0; i < content.length; i++) {
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const item = content[i];
    if (item.content instanceof Blob) {
      saveAs(item.content, item.filename);
    } else {
      const stringContent = await getStringContent(item.content);
      const blob = new Blob([stringContent], { type: item.mimeType || 'text/plain' });
      saveAs(blob, item.filename);
    }
  }
}

async function downloadAsJSON(
  content: DownloadableContent[],
  options: UniversalDownloadOptions,
  filename: string
): Promise<void> {
  const jsonData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: content.length,
      format: 'json'
    },
    content: await Promise.all(content.map(async item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      filename: item.filename,
      mimeType: item.mimeType,
      size: item.size || getContentSize(item.content),
      content: await getStringContent(item.content),
      metadata: item.metadata
    })))
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
}

async function downloadAsMarkdown(
  content: DownloadableContent[],
  filename: string
): Promise<void> {
  let markdown = '# Generated Content\n\n';
  
  for (const item of content) {
    markdown += `## ${item.name}\n\n`;
    if (item.description) {
      markdown += `${item.description}\n\n`;
    }
    
    const stringContent = await getStringContent(item.content);
    markdown += `\`\`\`${getLanguageFromFilename(item.filename)}\n${stringContent}\n\`\`\`\n\n`;
  }

  const blob = new Blob([markdown], { type: 'text/markdown' });
  saveAs(blob, filename);
}

async function downloadAsHTML(
  content: DownloadableContent[],
  filename: string
): Promise<void> {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
    .content-item { margin-bottom: 2rem; border: 1px solid #ddd; padding: 1rem; border-radius: 8px; }
    .content-header { margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .content-body { background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    pre { margin: 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Generated Content</h1>
`;

  for (const item of content) {
    const stringContent = await getStringContent(item.content);
    html += `
  <div class="content-item">
    <div class="content-header">
      <h2>${item.name}</h2>
      ${item.description ? `<p>${item.description}</p>` : ''}
      <small>Type: ${item.type} | File: ${item.filename}</small>
    </div>
    <div class="content-body">
      <pre><code>${stringContent.replace(/</g, '<').replace(/>/g, '>')}</code></pre>
    </div>
  </div>
`;
  }

  html += `
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  saveAs(blob, filename);
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'jsx',
    'tsx': 'tsx',
    'py': 'python',
    'css': 'css',
    'html': 'html',
    'json': 'json',
    'yml': 'yaml',
    'yaml': 'yaml',
    'md': 'markdown'
  };
  return langMap[ext || ''] || 'text';
}

export {
  type DownloadableContent,
  type DownloadPackageConfig,
  type UniversalDownloadFormat,
  type UniversalDownloadOptions
};