/**
 * @fileoverview Documentation generator section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ScrollArea } from '../../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Download, FileText, Loader2, Trash2 } from 'lucide-react';
import type { DocumentationType } from '../LaunchPreparationHub.logic';
import type { GeneratedDocument } from '../useDocumentationGenerator';

interface DocumentationGeneratorSectionProps {
  readonly isGenerating: boolean;
  readonly generationProgress: number;
  readonly currentDocType: DocumentationType | 'press-kit' | null;
  readonly generatedDocs: GeneratedDocument[];
  readonly onGenerate: (type: DocumentationType) => Promise<GeneratedDocument>;
  readonly onGeneratePressKit: () => GeneratedDocument | Promise<GeneratedDocument>;
  readonly onDownload: (doc: GeneratedDocument) => void;
  readonly onPreview: (doc: GeneratedDocument) => string;
  readonly onDelete: (docId: string) => void;
  readonly onClearAll: () => void;
}

const DOCUMENTATION_TYPES: { label: string; value: DocumentationType; description: string }[] = [
  { label: 'User Manual', value: 'user-manual', description: 'Comprehensive onboarding documentation for new customers.' },
  { label: 'API Documentation', value: 'api-docs', description: 'Endpoints, authentication, and integration playbooks.' },
  { label: 'Tutorial Scripts', value: 'tutorials', description: 'Guided product walkthroughs for video content.' },
  { label: 'FAQ Guide', value: 'faq', description: 'Support knowledge base covering top launch questions.' },
];

export function DocumentationGeneratorSection({
  isGenerating,
  generationProgress,
  currentDocType,
  generatedDocs,
  onGenerate,
  onGeneratePressKit,
  onDownload,
  onPreview,
  onDelete,
  onClearAll,
}: DocumentationGeneratorSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentation Generator</CardTitle>
        <CardDescription>Generate and manage launch-critical documentation packages.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGenerating ? (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Generating documentation…</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Preparing {currentDocType?.replace('-', ' ')} package with AI-assisted templates.
              </span>
              <Progress value={generationProgress} className="w-32" />
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {DOCUMENTATION_TYPES.map((option) => (
            <Card key={option.value} className="border-dashed">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{option.label}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={isGenerating}
                  onClick={() => onGenerate(option.value)}
                >
                  <FileText className="mr-2 h-4 w-4" /> Generate {option.label}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Press Kit Package</h3>
              <p className="text-xs text-muted-foreground">Media-ready assets for journalists and influencer partners.</p>
            </div>
            <Button variant="outline" disabled={isGenerating} onClick={onGeneratePressKit}>
              <Download className="mr-2 h-4 w-4" /> Generate Press Kit
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">Generated Deliverables</h3>
            <Button variant="ghost" size="sm" disabled={generatedDocs.length === 0} onClick={onClearAll}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear history
            </Button>
          </div>
          {generatedDocs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No documents generated yet. Use the actions above to create your first asset.</p>
          ) : (
            <ScrollArea className="h-48 rounded-lg border">
              <div className="divide-y">
                {generatedDocs.map((doc) => (
                  <div key={doc.id} className="flex items-start justify-between gap-4 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{doc.filename}</span>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Generated on {doc.generatedAt.toLocaleString()}</p>
                      <pre className="mt-2 max-h-24 overflow-hidden rounded bg-muted/40 p-2 text-xs">
                        {onPreview(doc).slice(0, 320)}{onPreview(doc).length > 320 ? '…' : ''}
                      </pre>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => onDownload(doc)}>
                        <Download className="mr-2 h-3 w-3" /> Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(doc.id)}>
                        <Trash2 className="mr-2 h-3 w-3" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
