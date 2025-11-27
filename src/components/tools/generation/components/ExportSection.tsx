import React, { useState } from 'react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Download, Package, GitBranch, Terminal, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { MultiFormatDownloadSelector } from '../../../ui/multi-format-download-selector';
import type { GeneratedApp } from '../../../../types/full-stack-builder';

interface ExportSectionProps {
  generatedApp: GeneratedApp;
  onDownload: () => void;
}

export function ExportSection({ generatedApp, onDownload }: ExportSectionProps) {
  const [showAdvancedDownload, setShowAdvancedDownload] = useState(false);

  const handleQuickDownload = () => {
    onDownload();
  };

  const handleDownloadStart = () => {
    toast.info('Preparing your download...');
  };

  const handleDownloadComplete = () => {
    toast.success('🎉 Your project has been downloaded successfully!');
  };

  const handleDownloadError = (error: string) => {
    toast.error(`Download failed: ${error}`);
  };

  const createGitHubRepo = async () => {
    toast.info('GitHub integration coming soon!');
    // TODO: Implement GitHub repository creation
  };

  const showSetupCommands = () => {
    const commands = `# Quick Setup Commands for ${generatedApp.name}

# 1. Extract the downloaded project
unzip ${generatedApp.name.toLowerCase().replace(/\s+/g, '-')}-fullstack-project.zip

# 2. Navigate to project directory
cd ${generatedApp.name.toLowerCase().replace(/\s+/g, '-')}

# 3. Install all dependencies (root, frontend, backend)
npm run setup

# 4. Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 5. Start development servers
npm run dev

# Your app will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001

# Alternative: Use Docker (if Docker is installed)
# docker-compose up -d
`;

    navigator.clipboard.writeText(commands);
    toast.success('Setup commands copied to clipboard!');
  };

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Quick Actions Card */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 ff-text-gradient">
              <Download className="w-5 h-5 text-ff-primary" />
              Export Your Full-Stack Application
            </CardTitle>
            <Badge variant="secondary" className="ff-badge-glow">
              {generatedApp.files.length} files ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-ff-text-primary">Quick Actions</h3>
              
              <Button 
                onClick={handleQuickDownload} 
                className="w-full ff-btn-primary ff-hover-glow" 
                size="lg"
              >
                <Package className="w-4 h-4 mr-2" />
                Quick Download (ZIP)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full ff-focus-ring" 
                size="lg"
                onClick={createGitHubRepo}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Create GitHub Repository
                <Badge variant="secondary" className="ml-2 text-xs">Soon</Badge>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full ff-focus-ring" 
                size="lg"
                onClick={showSetupCommands}
              >
                <Terminal className="w-4 h-4 mr-2" />
                Copy Setup Commands
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-ff-text-primary">Quick Start Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-ff-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ff-text-primary">Extract Project Files</p>
                    <p className="text-ff-text-muted">Unzip the downloaded project to your workspace</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-ff-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ff-text-primary">Install Dependencies</p>
                    <p className="text-ff-text-muted">Run <code className="bg-ff-surface px-1 rounded text-ff-primary">npm run setup</code> for complete installation</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-ff-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ff-text-primary">Setup Environment</p>
                    <p className="text-ff-text-muted">Configure your <code className="bg-ff-surface px-1 rounded text-ff-primary">.env</code> files with your credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-ff-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ff-text-primary">Start Development</p>
                    <p className="text-ff-text-muted">Run <code className="bg-ff-surface px-1 rounded text-ff-primary">npm run dev</code> to launch both servers</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-ff-primary/10 border border-ff-primary/20 rounded-lg">
                <p className="text-xs text-ff-text-primary flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-ff-primary" />
                  Your app will be available at localhost:3000 (frontend) and localhost:3001 (backend)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <p className="text-sm text-ff-text-muted">
              Need more download options or formats?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedDownload(!showAdvancedDownload)}
              className="ff-btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              {showAdvancedDownload ? 'Hide' : 'Show'} Advanced Options
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Download Options */}
      {showAdvancedDownload && (
        <div className="ff-fade-in-up">
          <MultiFormatDownloadSelector
            app={generatedApp}
            onDownloadStart={handleDownloadStart}
            onDownloadComplete={handleDownloadComplete}
            onDownloadError={handleDownloadError}
          />
        </div>
      )}

      {/* Additional Export Information */}
      <Card className="ff-glass">
        <CardHeader>
          <CardTitle className="text-base text-ff-text-primary">What's Included in Your Export?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">Frontend</h4>
              <ul className="text-ff-text-muted space-y-1">
                <li>• {generatedApp.stack.frontend} application</li>
                <li>• Component structure</li>
                <li>• Routing setup</li>
                <li>• Styling configuration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">Backend</h4>
              <ul className="text-ff-text-muted space-y-1">
                <li>• {generatedApp.stack.backend} API</li>
                <li>• Authentication setup</li>
                <li>• Database integration</li>
                <li>• API endpoints</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">Database</h4>
              <ul className="text-ff-text-muted space-y-1">
                <li>• {generatedApp.stack.database} schema</li>
                <li>• Migration files</li>
                <li>• Seed data</li>
                <li>• Connection config</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ff-text-primary">DevOps</h4>
              <ul className="text-ff-text-muted space-y-1">
                <li>• Docker configuration</li>
                <li>• Environment templates</li>
                <li>• Deployment scripts</li>
                <li>• CI/CD workflows</li>
              </ul>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ff-text-muted">Features included:</span>
            {generatedApp.features.slice(0, 6).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {generatedApp.features.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{generatedApp.features.length - 6} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}