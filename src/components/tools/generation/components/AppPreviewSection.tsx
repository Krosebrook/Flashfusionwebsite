import React from 'react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { FileText, Package, Copy, Folder, Server, Globe, Database, Shield, CloudUpload } from 'lucide-react';
import type { GeneratedApp } from '../../../../types/full-stack-builder';

interface AppPreviewSectionProps {
  generatedApp: GeneratedApp;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  onCopyToClipboard: (content: string) => void;
}

export function AppPreviewSection({
  generatedApp,
  selectedFile,
  setSelectedFile,
  onCopyToClipboard
}: AppPreviewSectionProps) {
  return (
    <>
      {/* App Overview */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {generatedApp.name}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              Full-Stack
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{generatedApp.description}</p>
          
          {/* Tech Stack */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Globe className="w-6 h-6 mx-auto mb-1 text-primary" />
              <div className="text-sm font-medium">{generatedApp.stack.frontend}</div>
              <div className="text-xs text-muted-foreground">Frontend</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Server className="w-6 h-6 mx-auto mb-1 text-secondary" />
              <div className="text-sm font-medium">{generatedApp.stack.backend}</div>
              <div className="text-xs text-muted-foreground">Backend</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-1 text-accent" />
              <div className="text-sm font-medium">{generatedApp.stack.database}</div>
              <div className="text-xs text-muted-foreground">Database</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Shield className="w-6 h-6 mx-auto mb-1 text-warning" />
              <div className="text-sm font-medium">{generatedApp.stack.auth}</div>
              <div className="text-xs text-muted-foreground">Auth</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <CloudUpload className="w-6 h-6 mx-auto mb-1 text-success" />
              <div className="text-sm font-medium">{generatedApp.stack.deployment}</div>
              <div className="text-xs text-muted-foreground">Deploy</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <div className="text-xl font-bold text-primary">{generatedApp.files.length}</div>
              <div className="text-xs text-muted-foreground">Files Generated</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg">
              <div className="text-xl font-bold text-secondary">{generatedApp.endpoints.length}</div>
              <div className="text-xs text-muted-foreground">API Endpoints</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-accent/10 to-warning/10 rounded-lg">
              <div className="text-xl font-bold text-accent">{generatedApp.features.length}</div>
              <div className="text-xs text-muted-foreground">Features</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-warning/10 to-success/10 rounded-lg">
              <div className="text-xl font-bold text-warning">
                {Math.round(generatedApp.files.reduce((acc, file) => acc + file.size, 0) / 1024)}KB
              </div>
              <div className="text-xs text-muted-foreground">Total Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Explorer and Code View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Folder className="w-4 h-4" />
              Project Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {generatedApp.files.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file.path)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors ff-hover-scale ${
                    selectedFile === file.path ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{file.path}</span>
                    <Badge variant="outline" className="text-xs">
                      {file.type}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-4 h-4" />
                {selectedFile || 'Select a file'}
              </CardTitle>
              {selectedFile && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const file = generatedApp.files.find(f => f.path === selectedFile);
                    if (file) onCopyToClipboard(file.content);
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
              <pre className="bg-muted/30 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                <code>
                  {generatedApp.files.find(f => f.path === selectedFile)?.content}
                </code>
              </pre>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Select a file to view its contents
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            API Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {generatedApp.endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={endpoint.method === 'GET' ? 'secondary' : 
                           endpoint.method === 'POST' ? 'default' : 
                           endpoint.method === 'PUT' ? 'outline' : 'destructive'}
                    className="font-mono text-xs"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
                <span className="text-sm text-muted-foreground">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}