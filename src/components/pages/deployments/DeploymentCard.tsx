import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import { 
  ExternalLink,
  Globe,
  GitBranch,
  MoreHorizontal
} from 'lucide-react';
import { getStatusColor, getStatusIcon, getPlatformIcon, getStatusCardStyle, formatDeploymentTime, getDeploymentProgress } from './utils';

interface DeploymentCardProps {
  deployment: any;
  project: any;
  index: number;
  onToggleAutoDeploy: (deploymentId: string, enabled: boolean) => void;
}

export function DeploymentCard({ 
  deployment, 
  project, 
  index, 
  onToggleAutoDeploy 
}: DeploymentCardProps) {
  const StatusIcon = getStatusIcon(deployment.status);
  const progress = getDeploymentProgress(deployment.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full ${getStatusCardStyle(deployment.status)}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl">
                {getPlatformIcon(deployment.platform)}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {project?.name || 'Unknown Project'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {deployment.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project?.framework}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${getStatusColor(deployment.status)}`}>
                <StatusIcon className={`h-4 w-4 ${deployment.status === 'deploying' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium capitalize">{deployment.status}</span>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Deployment Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Last Deploy</div>
              <div className="font-medium">
                {formatDeploymentTime(deployment.updated_at)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Build Time</div>
              <div className="font-medium">{deployment.build_time || 'N/A'}</div>
            </div>
          </div>

          {/* Deployment URL */}
          {deployment.url && (
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Live URL</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-background px-2 py-1 rounded flex-1 truncate">
                  {deployment.url}
                </code>
                <Button variant="outline" size="sm" asChild>
                  <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Auto Deploy Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Auto Deploy</span>
            </div>
            <Switch 
              checked={deployment.auto_deploy}
              onCheckedChange={(checked) => onToggleAutoDeploy(deployment.id, checked)}
            />
          </div>

          {/* Deployment Progress */}
          {deployment.status === 'deploying' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deploying...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="ff-progress-bar" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}