import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';
import { PLATFORM_CONFIGS } from '../../constants/creator-content-pipeline';

interface PlatformSelectionProps {
  selectedPlatforms: string[];
  handlePlatformToggle: (platformId: string) => void;
  onGenerateContent: () => void;
  canGenerate: boolean;
  isGenerating: boolean;
}

export function PlatformSelection({
  selectedPlatforms,
  handlePlatformToggle,
  onGenerateContent,
  canGenerate,
  isGenerating
}: PlatformSelectionProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {Object.entries(PLATFORM_CONFIGS).map(([id, platform]) => {
          const IconComponent = platform.icon;
          return (
            <Card
              key={id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-300 hover:shadow-lg",
                selectedPlatforms.includes(id) && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => handlePlatformToggle(id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold">{platform.name}</h3>
                </div>
                {selectedPlatforms.includes(id) && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Will generate:</p>
                <div className="flex flex-wrap gap-1">
                  {platform.outputs.map((output) => (
                    <Badge key={output} variant="outline" className="text-xs">
                      {output}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      <div className="flex justify-center">
        <Button
          onClick={onGenerateContent}
          disabled={!canGenerate || isGenerating}
          className="ff-btn-primary px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Content Pipeline
            </>
          )}
        </Button>
      </div>
    </>
  );
}