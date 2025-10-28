import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Rocket } from 'lucide-react';

interface EmptyStateProps {
  onCreateDeployment: () => void;
  hasProjects: boolean;
}

export function EmptyState({ onCreateDeployment, hasProjects }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">No deployments yet</h3>
        <p className="text-muted-foreground mb-6">
          {hasProjects 
            ? 'Deploy your first project to get started with hosting.'
            : 'Create a project first, then deploy it to your favorite platform.'
          }
        </p>
        {hasProjects ? (
          <Button className="ff-btn-primary" onClick={onCreateDeployment}>
            <Rocket className="h-4 w-4 mr-2" />
            Deploy First Project
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Create a project to enable deployments
          </p>
        )}
      </CardContent>
    </Card>
  );
}