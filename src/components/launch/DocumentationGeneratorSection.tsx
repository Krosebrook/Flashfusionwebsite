import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import {
  BookOpen,
  Code,
  Download,
  FileText,
  HelpCircle,
  Loader2,
  Terminal,
  Video,
} from 'lucide-react';
import type { DocumentationGeneratorSectionProps } from './LaunchPreparationHub.types';

/**
 * Documentation generation controls and progress tracking.
 */
export function DocumentationGeneratorSection({
  isGenerating,
  generationProgress,
  onGenerateDocumentation,
}: DocumentationGeneratorSectionProps) {
  return (
    <>
      <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
        <FileText className="h-4 w-4 text-[var(--ff-secondary)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-secondary)]">Documentation Generation:</strong> Create comprehensive user guides,
          API documentation, tutorials, and troubleshooting resources.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              User Documentation
            </CardTitle>
            <CardDescription className="text-[var(--ff-text-secondary)]">
              Complete user guides and getting started resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => onGenerateDocumentation('user-manual')}
              disabled={isGenerating}
              className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate User Manual
                </>
              )}
            </Button>
            <Button
              onClick={() => onGenerateDocumentation('tutorials')}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-[var(--border)]"
            >
              <Video className="w-4 h-4 mr-2" />
              Generate Tutorial Scripts
            </Button>
            <Button
              onClick={() => onGenerateDocumentation('faq')}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-[var(--border)]"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Generate FAQ Guide
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
              <Code className="w-5 h-5" />
              Developer Resources
            </CardTitle>
            <CardDescription className="text-[var(--ff-text-secondary)]">
              Technical documentation and API references
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => onGenerateDocumentation('api-docs')}
              disabled={isGenerating}
              className="w-full bg-[var(--ff-secondary)] hover:bg-[var(--ff-secondary-600)] text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate API Documentation
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Code className="w-4 h-4 mr-2" />
              SDK Documentation
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Terminal className="w-4 h-4 mr-2" />
              CLI Documentation
            </Button>
          </CardContent>
        </Card>
      </div>

      {isGenerating && (
        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--ff-text-primary)]">Generating documentation...</span>
              <span className="text-[var(--ff-text-muted)]">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-[var(--ff-text-muted)] mt-2">
              Creating comprehensive documentation with examples and best practices...
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
