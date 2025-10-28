import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  GitBranch, 
  Github, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';

interface RepositoryIntegrationCardProps {
  useRepository: boolean;
  setUseRepository: (use: boolean) => void;
  connectedRepositories: any[];
  selectedRepository: string | null;
  setSelectedRepository: (id: string | null) => void;
  onRefreshRepositories: () => void;
}

export function RepositoryIntegrationCard({
  useRepository,
  setUseRepository,
  connectedRepositories,
  selectedRepository,
  setSelectedRepository,
  onRefreshRepositories
}: RepositoryIntegrationCardProps) {
  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-ff-secondary" />
            Repository Integration
          </div>
          <Switch
            checked={useRepository}
            onCheckedChange={setUseRepository}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ff-text-secondary">
            Enable AI to analyze your repository for context-aware code generation
          </p>
          <Badge variant={useRepository ? 'default' : 'outline'}>
            {useRepository ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        {useRepository && (
          <div className="space-y-4 pt-4 border-t">
            {connectedRepositories.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>No repositories connected. Connect a repository to enable this feature.</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/settings?tab=repositories'}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Repository</Label>
                <Select value={selectedRepository || ''} onValueChange={setSelectedRepository}>
                  <SelectTrigger className="ff-focus-ring">
                    <SelectValue placeholder="Choose a connected repository..." />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedRepositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        <div className="flex items-center gap-2 w-full">
                          <Github className="h-4 w-4" />
                          <span className="flex-1">{repo.name}</span>
                          {repo.isPrivate && <Lock className="h-3 w-3 text-ff-text-muted" />}
                          <CheckCircle2 className="h-3 w-3 text-ff-success" />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedRepository && (
                  <div className="bg-ff-surface/50 p-3 rounded-lg space-y-2">
                    {(() => {
                      const repo = connectedRepositories.find(r => r.id === selectedRepository);
                      return repo ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-ff-text-primary">
                              {repo.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {repo.isPrivate ? (
                                <Lock className="h-3 w-3 text-ff-text-muted" />
                              ) : (
                                <Unlock className="h-3 w-3 text-ff-text-muted" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {repo.branch}
                              </Badge>
                            </div>
                          </div>
                          
                          {repo.analysisResult && (
                            <div className="space-y-1">
                              <p className="text-xs text-ff-text-muted">
                                Technologies: {repo.analysisResult.technologies.slice(0, 3).join(', ')}
                                {repo.analysisResult.technologies.length > 3 && '...'}
                              </p>
                              <p className="text-xs text-ff-text-secondary line-clamp-2">
                                {repo.analysisResult.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-ff-text-muted">
                    ✨ AI will analyze your repository structure and coding patterns
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onRefreshRepositories}
                  >
                    <GitBranch className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RepositoryIntegrationCard;