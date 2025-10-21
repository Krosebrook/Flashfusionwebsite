import React from 'react';
import { Settings, Monitor, Code, Zap } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@flashfusion/utils';

export function ConfigDebugPanel() {
  const [isOpen, setIsOpen] = React.useState(false);

  const debugInfo = {
    version: '1.0.0',
    buildTime: new Date().toISOString(),
    environment: import.meta.env.MODE,
    features: [
      { name: 'AI Tools', enabled: true, status: 'active' },
      { name: 'Real-time Collaboration', enabled: true, status: 'beta' },
      { name: 'Advanced Analytics', enabled: false, status: 'dev' },
    ]
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border"
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Debug Panel
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-3 w-3" />
              <span>Version: {debugInfo.version}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span>Environment: {debugInfo.environment}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Features</h4>
            {debugInfo.features.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <span>{feature.name}</span>
                <Badge 
                  variant={feature.enabled ? "default" : "secondary"}
                  className="text-xs"
                >
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}