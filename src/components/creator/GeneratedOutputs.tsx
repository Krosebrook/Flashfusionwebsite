import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Download, 
  Calendar, 
  Copy, 
  Check, 
  Share2, 
  RotateCcw, 
  TrendingUp 
} from 'lucide-react';
import { ContentOutput } from '../../types/creator-content-pipeline';

interface GeneratedOutputsProps {
  isGenerating: boolean;
  generationProgress: number;
  outputs: ContentOutput[];
  copiedId: string;
  onCopyToClipboard: (content: string, id: string) => void;
  onDownloadOutputs: () => void;
}

export function GeneratedOutputs({
  isGenerating,
  generationProgress,
  outputs,
  copiedId,
  onCopyToClipboard,
  onDownloadOutputs
}: GeneratedOutputsProps) {
  return (
    <div className="space-y-6">
      {isGenerating && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Generating Content...</h3>
            <span className="text-sm text-muted-foreground">
              {Math.round(generationProgress)}% Complete
            </span>
          </div>
          <Progress value={generationProgress} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            AI models are working to create optimized content for each platform...
          </p>
        </Card>
      )}

      {outputs.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Generated Content</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onDownloadOutputs}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download All
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Posts
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {outputs.map((output) => (
          <motion.div
            key={output.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {output.platform}
                  </Badge>
                  <span className="text-sm font-medium">{output.type}</span>
                  {output.status === 'generating' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                      <span className="text-xs">Generating...</span>
                    </div>
                  )}
                </div>
                
                {output.status === 'completed' && (
                  <div className="flex items-center gap-2">
                    {output.estimatedEngagement && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {output.estimatedEngagement} est. engagement
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyToClipboard(output.content, output.id)}
                    >
                      {copiedId === output.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {output.status === 'completed' && (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {output.content}
                    </pre>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {output.wordCount && (
                        <span>{output.wordCount} words</span>
                      )}
                      {output.characterCount && (
                        <span>{output.characterCount} characters</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}