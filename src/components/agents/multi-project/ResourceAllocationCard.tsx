import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { cn } from '../../ui/utils';
import { getBottleneckRiskColor } from '../../../utils/multi-project-orchestrator';

interface ResourceAllocationCardProps {
  resource: {
    agentId: string;
    agentName: string;
    currentAllocation: number;
    recommendedAllocation: number;
    projectDistribution: Array<{ projectId: string; percentage: number }>;
    efficiency: number;
    utilization: number;
    bottleneckRisk: string;
  };
  projects: any[];
}

export function ResourceAllocationCard({ resource, projects }: ResourceAllocationCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">{resource.agentName}</span>
          <Badge 
            variant="outline" 
            className={cn("text-xs", getBottleneckRiskColor(resource.bottleneckRisk))}
          >
            {resource.bottleneckRisk} risk
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {Math.round(resource.utilization)}% utilized
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Current Allocation</div>
          <Progress value={resource.currentAllocation} className="h-2 mt-1" />
        </div>
        <div>
          <div className="text-muted-foreground">Recommended</div>
          <Progress value={resource.recommendedAllocation} className="h-2 mt-1" />
        </div>
        <div>
          <div className="text-muted-foreground">Efficiency</div>
          <Progress value={resource.efficiency} className="h-2 mt-1" />
        </div>
      </div>

      <div className="flex gap-1">
        {resource.projectDistribution.map(dist => {
          const project = projects.find(p => p.id === dist.projectId);
          return project ? (
            <div 
              key={dist.projectId}
              className="text-xs px-2 py-1 bg-muted rounded text-center"
              style={{ width: `${dist.percentage}%` }}
            >
              {project.name}: {Math.round(dist.percentage)}%
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}