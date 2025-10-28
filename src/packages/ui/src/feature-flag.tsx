import React from 'react';
import { Flag, Settings } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Switch } from './switch';
import { Badge } from './badge';

interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  category?: string;
}

interface FeatureFlagContextType {
  flags: FeatureFlag[];
  isEnabled: (key: string) => boolean;
  toggle: (key: string) => void;
}

const FeatureFlagContext = React.createContext<FeatureFlagContextType | undefined>(undefined);

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  initialFlags?: FeatureFlag[];
}

export function FeatureFlagProvider({ children, initialFlags = [] }: FeatureFlagProviderProps) {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(initialFlags);

  const isEnabled = React.useCallback((key: string) => {
    const flag = flags.find(f => f.key === key);
    return flag?.enabled ?? false;
  }, [flags]);

  const toggle = React.useCallback((key: string) => {
    setFlags(prev => prev.map(flag => 
      flag.key === key ? { ...flag, enabled: !flag.enabled } : flag
    ));
  }, []);

  const value = React.useMemo(() => ({
    flags,
    isEnabled,
    toggle
  }), [flags, isEnabled, toggle]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function FeatureFlagDebugPanel() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { flags, toggle } = useFeatureFlags();

  if (!import.meta.env.DEV) return null;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="fixed bottom-16 right-4 z-50 bg-background/80 backdrop-blur-sm border"
      >
        <Flag className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Feature Flags
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
        
        <CardContent className="space-y-3">
          {flags.length === 0 ? (
            <p className="text-xs text-muted-foreground">No feature flags configured</p>
          ) : (
            flags.map((flag) => (
              <div key={flag.key} className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate">{flag.name}</span>
                    {flag.category && (
                      <Badge variant="outline" className="text-xs">
                        {flag.category}
                      </Badge>
                    )}
                  </div>
                  {flag.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {flag.description}
                    </p>
                  )}
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => toggle(flag.key)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}