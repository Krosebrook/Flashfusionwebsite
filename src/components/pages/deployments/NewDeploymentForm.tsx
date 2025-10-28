import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Loader2, Rocket } from 'lucide-react';
import { deploymentPlatforms } from '../../../data/constants';

interface NewDeploymentFormProps {
  projects: any[];
  newDeployment: {
    project_id: string;
    platform: string;
    auto_deploy: boolean;
  };
  setNewDeployment: (deployment: any) => void;
  onDeploy: () => void;
  onCancel: () => void;
  deploying: string | null;
}

export function NewDeploymentForm({
  projects,
  newDeployment,
  setNewDeployment,
  onDeploy,
  onCancel,
  deploying
}: NewDeploymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy New Project</CardTitle>
        <CardDescription>
          Choose a project and platform to deploy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Project</label>
            <Select 
              value={newDeployment.project_id} 
              onValueChange={(value) => setNewDeployment(prev => ({ ...prev, project_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.framework.charAt(0)}</span>
                      <span>{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <Select 
              value={newDeployment.platform} 
              onValueChange={(value) => setNewDeployment(prev => ({ ...prev, platform: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose platform" />
              </SelectTrigger>
              <SelectContent>
                {deploymentPlatforms.map(platform => (
                  <SelectItem key={platform.id} value={platform.name}>
                    <div className="flex items-center gap-2">
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={newDeployment.auto_deploy}
              onCheckedChange={(checked) => setNewDeployment(prev => ({ ...prev, auto_deploy: checked }))}
            />
            <label className="text-sm font-medium">Enable auto-deploy</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onDeploy}
              disabled={!newDeployment.project_id || !newDeployment.platform || deploying === newDeployment.project_id}
              className="ff-btn-primary"
            >
              {deploying === newDeployment.project_id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}