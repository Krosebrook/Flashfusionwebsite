import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';
import { cn } from '../ui/utils';
import { AI_MODELS } from '../../constants/creator-content-pipeline';

interface AIModelSelectionProps {
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
}

export function AIModelSelection({
  selectedModel,
  setSelectedModel
}: AIModelSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4"
    >
      {AI_MODELS.map((model) => {
        const IconComponent = model.icon;
        return (
          <Card
            key={model.id}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 hover:shadow-lg",
              selectedModel === model.id && "ring-2 ring-primary bg-primary/5"
            )}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${model.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {model.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {model.strengths.map((strength) => (
                      <Badge key={strength} variant="secondary" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {selectedModel === model.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </Card>
        );
      })}
    </motion.div>
  );
}