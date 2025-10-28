import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Shuffle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../ui/utils';
import { getSynergyIcon, getImplementationEffortColor } from '../../../utils/multi-project-orchestrator';
import { CrossProjectSynergy } from '../../../types/multi-agent-orchestration';

interface SynergyCardProps {
  synergy: CrossProjectSynergy;
  projects: any[];
  onImplement: (synergyId: string) => void;
  isOptimizing: boolean;
  index: number;
}

export function SynergyCard({ synergy, projects, onImplement, isOptimizing, index }: SynergyCardProps) {
  const IconComponent = getSynergyIcon(synergy.synergyType);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold capitalize">
                  {synergy.synergyType.replace('_', ' ')}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Impact Score: {synergy.impactScore}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {synergy.opportunity}
              </p>
              <div className="flex items-center gap-2">
                {synergy.projectIds.map(projectId => {
                  const project = projects.find(p => p.id === projectId);
                  return project ? (
                    <Badge key={projectId} variant="outline" className="text-xs">
                      {project.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          <div className="text-right">
            <Badge 
              className={cn("text-xs mb-2", getImplementationEffortColor(synergy.implementationEffort))}
            >
              {synergy.implementationEffort} effort
            </Badge>
            <div className="text-xs text-muted-foreground">
              {synergy.timeline}
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 mb-3">
          <h4 className="font-medium text-sm mb-1">Expected Benefits</h4>
          <p className="text-xs text-muted-foreground">
            {synergy.benefitDescription}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Impact Score</div>
            <Progress value={synergy.impactScore} className="w-24 h-2" />
            <div className="text-sm">{synergy.impactScore}%</div>
          </div>

          {synergy.implementationEffort !== 'completed' ? (
            <Button
              onClick={() => onImplement(synergy.projectIds.join('-'))}
              disabled={isOptimizing}
              className="flex items-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Implementing...
                </>
              ) : (
                <>
                  <Shuffle className="h-4 w-4" />
                  Implement Synergy
                </>
              )}
            </Button>
          ) : (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Implemented
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
}