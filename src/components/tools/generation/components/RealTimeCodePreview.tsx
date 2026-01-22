import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { ScrollArea } from '../../../ui/scroll-area';
import { 
  Eye, 
  Code, 
  Download, 
  Copy, 
  RefreshCw, 
  Zap, 
  CheckCircle,
  FileText,
  Image,
  Archive,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { GeneratedApp } from '../../../../types/full-stack-builder';

interface RealTimeCodePreviewProps {
  generatedApp: GeneratedApp;
  selectedFile: string | null;
  onFileSelect: (filePath: string) => void;
  onCopyCode: (content: string) => void;
  onDownloadFile: (filePath: string, content: string) => void;
  isLoading?: boolean;
}

export function RealTimeCodePreview({
  generatedApp,
  selectedFile,
  onFileSelect,
  onCopyCode,
  onDownloadFile,
  isLoading = false
}: RealTimeCodePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'code' | 'visual' | 'structure'>('code');
  const [fileFilter, setFileFilter] = useState<'all' | 'frontend' | 'backend' | 'config' | 'database'>('all');
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [fileLanguage, setFileLanguage] = useState<string>('typescript');

  useEffect(() => {
    if (selectedFile && generatedApp) {
      const file = generatedApp.files.find(f => f.path === selectedFile);
      if (file) {
        setSelectedFileContent(file.content);
        setFileLanguage(getFileLanguage(file.path));
      }
    }
  }, [selectedFile, generatedApp]);

  const getFileLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'tsx': 'tsx',
      'ts': 'typescript',
      'jsx': 'jsx', 
      'js': 'javascript',
      'json': 'json',
      'md': 'markdown',
      'sql': 'sql',
      'yml': 'yaml',
      'yaml': 'yaml',
      'dockerfile': 'docker',
      'env': 'bash',
      'gitignore': 'bash',
      'css': 'css',
      'scss': 'scss',
      'html': 'html'
    };
    return languageMap[extension || ''] || 'text';
  };

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    if (['tsx', 'ts', 'jsx', 'js'].includes(extension || '')) {
      return <Code className="h-4 w-4 text-blue-500" />;
    }
    if (extension === 'json') {
      return <FileText className="h-4 w-4 text-yellow-500" />;
    }
    if (['md', 'txt'].includes(extension || '')) {
      return <FileText className="h-4 w-4 text-green-500" />;
    }
    if (['png', 'jpg', 'svg', 'ico'].includes(extension || '')) {
      return <Image className="h-4 w-4 text-purple-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const filteredFiles = generatedApp.files.filter(file => {
    if (fileFilter === 'all') return true;
    return file.type === fileFilter;
  });

  const getFileTypeColor = (type: string) => {
    const colors = {
      frontend: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      backend: 'bg-green-500/10 text-green-500 border-green-500/20',
      database: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      config: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const calculateProjectStats = () => {
    const totalFiles = generatedApp.files.length;
    const totalSize = generatedApp.files.reduce((sum, file) => sum + (file.size || 0), 0);
    const fileTypes = {
      frontend: generatedApp.files.filter(f => f.type === 'frontend').length,
      backend: generatedApp.files.filter(f => f.type === 'backend').length,
      database: generatedApp.files.filter(f => f.type === 'database').length,
      config: generatedApp.files.filter(f => f.type === 'config').length
    };
    
    return { totalFiles, totalSize, fileTypes };
  };

  const handleCopyFile = () => {
    if (selectedFileContent) {
      onCopyCode(selectedFileContent);
    }
  };

  const handleDownloadCurrentFile = () => {
    if (selectedFile && selectedFileContent) {
      onDownloadFile(selectedFile, selectedFileContent);
    }
  };

  const projectStats = calculateProjectStats();

  if (isLoading) {
    return (
      <Card className="ff-card-interactive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <CardTitle>Generating Your Application...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-xl font-bold">{projectStats.totalFiles}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Project Size</p>
              <p className="text-xl font-bold">{formatFileSize(projectStats.totalSize)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Frontend</p>
              <p className="text-xl font-bold">{projectStats.fileTypes.frontend}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Backend</p>
              <p className="text-xl font-bold">{projectStats.fileTypes.backend}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="ff-card-interactive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {generatedApp.name} - Live Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-success" />
                Generated
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/project/${generatedApp.name}`, '_blank')}
                className="ff-hover-scale"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Preview
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Code View</TabsTrigger>
              <TabsTrigger value="structure">Project Structure</TabsTrigger>
              <TabsTrigger value="visual">Visual Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  {(['all', 'frontend', 'backend', 'config', 'database'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={fileFilter === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFileFilter(type)}
                      className="capitalize"
                    >
                      {type} {type !== 'all' && `(${projectStats.fileTypes[type] || 0})`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* File Explorer */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-sm">Project Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-1">
                        {filteredFiles.map((file) => (
                          <motion.div
                            key={file.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`
                              flex items-center gap-2 p-2 rounded cursor-pointer text-sm
                              transition-colors duration-200
                              ${selectedFile === file.path 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'hover:bg-muted/50'
                              }
                            `}
                            onClick={() => onFileSelect(file.path)}
                          >
                            {getFileIcon(file.path)}
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">
                                {file.path.split('/').pop()}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {file.path}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-1 py-0 ${getFileTypeColor(file.type)}`}
                              >
                                {file.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(file.size || 0)}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Code Editor */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-mono">
                        {selectedFile || 'Select a file to view'}
                      </CardTitle>
                      {selectedFile && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyFile}
                            className="ff-hover-scale"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadCurrentFile}
                            className="ff-hover-scale"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedFile ? (
                      <ScrollArea className="h-96">
                        <SyntaxHighlighter
                          language={fileLanguage}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            background: 'transparent',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                          showLineNumbers
                          wrapLines
                        >
                          {selectedFileContent}
                        </SyntaxHighlighter>
                      </ScrollArea>
                    ) : (
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <Code className="h-12 w-12 mx-auto opacity-50" />
                          <p>Select a file from the explorer to view its code</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tech Stack */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Technology Stack</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Frontend</span>
                          <Badge variant="secondary">{generatedApp.stack.frontend}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Backend</span>
                          <Badge variant="secondary">{generatedApp.stack.backend}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Database</span>
                          <Badge variant="secondary">{generatedApp.stack.database}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Auth</span>
                          <Badge variant="secondary">{generatedApp.stack.auth}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>Deployment</span>
                          <Badge variant="secondary">{generatedApp.stack.deployment}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Included Features</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {generatedApp.features.map((feature, index) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 p-2 bg-muted rounded"
                          >
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* API Endpoints */}
                  {generatedApp.endpoints && generatedApp.endpoints.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold">API Endpoints</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {generatedApp.endpoints.map((endpoint, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <Badge
                              variant="outline"
                              className={
                                endpoint.method === 'GET' ? 'text-blue-500' :
                                endpoint.method === 'POST' ? 'text-green-500' :
                                endpoint.method === 'PUT' ? 'text-yellow-500' :
                                endpoint.method === 'DELETE' ? 'text-red-500' :
                                'text-muted-foreground'
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              {endpoint.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Application Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Eye className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold mb-2">Visual Preview Coming Soon</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Full visual preview and live deployment status will be available here
                        </p>
                        <Button className="ff-btn-primary">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Deploy to Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default RealTimeCodePreview;