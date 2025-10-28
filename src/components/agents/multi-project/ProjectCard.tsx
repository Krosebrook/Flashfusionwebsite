import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Users, Clock, Eye } from 'lucide-react';
import { cn } from '../../ui/utils';
import { getProjectStatusColor, getPriorityColor } from '../../../utils/multi-project-orchestrator';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: string;
    progress: number;
    priority: string;
    agentsAssigned: number;
    deadline: Date;
    type: string;
  };
  isSelected: boolean;
  onSelect: (projectId: string) => void;
  index: number;
}

export function ProjectCard({ project, isSelected, onSelect, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        "p-4 transition-all duration-300",
        isSelected && "ring-2 ring-primary"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{project.name}</h3>
            <Badge className={cn("text-xs", getProjectStatusColor(project.status))}>
              {project.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {project.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelect(project.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Badge 
              variant="outline" 
              className={cn("text-xs", getPriorityColor(project.priority))}
            >
              {project.priority} priority
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.agentsAssigned} agents
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {project.deadline.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}