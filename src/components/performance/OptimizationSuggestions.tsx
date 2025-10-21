import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, Lightbulb, Zap, ArrowRight } from 'lucide-react';
import { OptimizationSuggestion } from './types';
import { getImpactColor, getEffortColor, getCategoryIcon, prioritizeSuggestions } from './utils';
import { toast } from 'sonner@2.0.3';

interface OptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[];
  onImplement: (suggestionId: string) => void;
}

export function OptimizationSuggestions({ suggestions, onImplement }: OptimizationSuggestionsProps) {
  const [implementingId, setImplementingId] = useState<string | null>(null);
  const prioritizedSuggestions = prioritizeSuggestions(suggestions);

  const handleImplement = async (suggestion: OptimizationSuggestion) => {
    if (!suggestion.autoImplementable) {
      toast.info('This optimization requires manual implementation');
      return;
    }

    setImplementingId(suggestion.id);
    try {
      // Simulate implementation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onImplement(suggestion.id);
      toast.success(`${suggestion.title} implemented successfully!`);
    } catch (error) {
      toast.error('Implementation failed. Please try again.');
    } finally {
      setImplementingId(null);
    }
  };

  const getImplementationProgress = () => {
    const implemented = suggestions.filter(s => s.isImplemented).length;
    return (implemented / suggestions.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Implementation Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Optimization Progress
          </h3>
          <Badge variant="outline">
            {suggestions.filter(s => s.isImplemented).length} / {suggestions.length} Complete
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Implementation</span>
            <span>{Math.round(getImplementationProgress())}%</span>
          </div>
          <Progress value={getImplementationProgress()} className="ff-progress-bar" />
        </div>
      </Card>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prioritizedSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 transition-all duration-300 ${
              suggestion.isImplemented 
                ? 'border-green-500/20 bg-green-500/5' 
                : 'ff-card-interactive'
            }`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {suggestion.title}
                        {suggestion.isImplemented && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getImpactColor(suggestion.impact)}`}
                  >
                    {suggestion.impact} impact
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getEffortColor(suggestion.effort)}`}
                  >
                    {suggestion.effort} effort
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {suggestion.category}
                  </Badge>
                  {suggestion.autoImplementable && (
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Auto-fix
                    </Badge>
                  )}
                </div>

                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Potential savings:</strong> {suggestion.potentialSavings}
                  </p>
                </div>

                <div className="flex gap-2">
                  {suggestion.isImplemented ? (
                    <Button variant="outline" disabled className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Implemented
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleImplement(suggestion)}
                        disabled={implementingId === suggestion.id || !suggestion.autoImplementable}
                        className="flex-1 ff-btn-primary"
                      >
                        {implementingId === suggestion.id ? (
                          'Implementing...'
                        ) : suggestion.autoImplementable ? (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Auto-implement
                          </>
                        ) : (
                          'Manual Setup Required'
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => {
              const autoFixable = suggestions.filter(s => !s.isImplemented && s.autoImplementable);
              autoFixable.forEach(s => handleImplement(s));
            }}
          >
            <div className="flex items-center gap-2 w-full">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">Auto-fix All</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Automatically implement {suggestions.filter(s => !s.isImplemented && s.autoImplementable).length} optimizations
            </span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-start gap-2"
          >
            <div className="flex items-center gap-2 w-full">
              <ArrowRight className="h-5 w-5 text-secondary" />
              <span className="font-medium">View Guide</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Step-by-step optimization guide
            </span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-start gap-2"
          >
            <div className="flex items-center gap-2 w-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Run Audit</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Comprehensive performance audit
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
}