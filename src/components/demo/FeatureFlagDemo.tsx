import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  FeatureFlag, 
  FeatureFlagToggle, 
  useFeatureFlag, 
  useFeatureFlagToggle,
  useFeatureFlagContext,
  ExperimentalFeatures,
  PremiumFeatures,
  BetaFeatures 
} from '../patterns/FeatureFlag';
import { 
  Sparkles, 
  Zap, 
  Crown, 
  TestTube, 
  AlertTriangle,
  CheckCircle,
  Info,
  Settings
} from 'lucide-react';

export function FeatureFlagDemo() {
  const debugMode = useFeatureFlag('debugMode');
  const { isEnabled: experimentalUI, toggle: toggleExperimental, isOverridden } = useFeatureFlagToggle('experimentalUI');
  const { flags } = useFeatureFlagContext();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold ff-text-gradient mb-2">
          Feature Flag System Demo
        </h2>
        <p className="text-muted-foreground">
          Experience how feature flags control functionality in real-time
        </p>
      </motion.div>

      {/* Status Overview */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-ff-primary" />
            Current Feature Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Badge variant={debugMode ? "default" : "secondary"} className="mb-2">
                {debugMode ? "Active" : "Inactive"}
              </Badge>
              <p className="text-sm font-medium">Debug Mode</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Badge variant={experimentalUI ? "default" : "secondary"} className="mb-2">
                {experimentalUI ? "Active" : "Inactive"}
              </Badge>
              <p className="text-sm font-medium">Experimental UI</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Badge variant={isOverridden ? "outline" : "secondary"} className="mb-2">
                {isOverridden ? "Overridden" : "Default"}
              </Badge>
              <p className="text-sm font-medium">Override Status</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Button
                size="sm"
                onClick={toggleExperimental}
                className="mb-2 w-full ff-btn-primary"
              >
                Toggle
              </Button>
              <p className="text-sm font-medium">Quick Toggle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature-Gated Content Examples */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Experimental Features */}
        <ExperimentalFeatures>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ff-fade-in-up"
          >
            <Card className="ff-card-interactive border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  Experimental Feature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <TestTube className="h-4 w-4" />
                  <AlertDescription>
                    This content is only visible when "Experimental UI" is enabled! 
                    You're seeing cutting-edge features in development.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <h4 className="font-medium mb-2">🚀 Experimental UI Elements</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Advanced animations and transitions</li>
                    <li>• Cutting-edge component designs</li>
                    <li>• Beta user interface patterns</li>
                    <li>• Experimental workflows</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ExperimentalFeatures>

        {/* Premium Features */}
        <PremiumFeatures 
          fallback={
            <Card className="ff-card-interactive border-warning/30 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Crown className="h-5 w-5" />
                  Premium Feature (Locked)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Premium features are currently disabled. Enable "Premium Features" 
                    in the feature flags to access advanced functionality.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg opacity-50">
                  <h4 className="font-medium mb-2">🔒 Premium Content</h4>
                  <p className="text-sm text-muted-foreground">
                    This content would show advanced premium features when unlocked.
                  </p>
                </div>
              </CardContent>
            </Card>
          }
        >
          <Card className="ff-card-interactive border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Crown className="h-5 w-5" />
                Premium Feature (Active)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Premium features are enabled! You have access to advanced tools and capabilities.
                </AlertDescription>
              </Alert>
              <div className="mt-4 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
                <h4 className="font-medium mb-2">👑 Premium Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Advanced AI model access</li>
                  <li>• Priority support</li>
                  <li>• Enhanced export options</li>
                  <li>• Team collaboration tools</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </PremiumFeatures>
      </div>

      {/* Beta Features */}
      <BetaFeatures>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="ff-card-interactive border-secondary/30 bg-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Zap className="h-5 w-5" />
                Beta Deployment Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <TestTube className="h-4 w-4" />
                <AlertDescription>
                  Beta deployment features are active! You can test the latest deployment 
                  platforms and experimental cloud integrations.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Badge variant="outline" className="mb-2">Beta</Badge>
                  <p className="text-sm font-medium">Railway Deploy</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Badge variant="outline" className="mb-2">Beta</Badge>
                  <p className="text-sm font-medium">Fly.io Deploy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </BetaFeatures>

      {/* Debug Information */}
      <FeatureFlag flag="debugMode">
        <Card className="ff-card-interactive border-info/30 bg-info/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-info">
              <Info className="h-5 w-5" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Debug mode is active. You can see the feature flag debug panel in the bottom-right corner.
              </AlertDescription>
            </Alert>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureFlagToggle
                flag="performanceMonitoring"
                label="Performance Monitoring"
                description="Track app performance"
                size="sm"
              />
              <FeatureFlagToggle
                flag="errorReporting"
                label="Error Reporting"
                description="Enhanced error tracking"
                size="sm"
              />
            </div>
          </CardContent>
        </Card>
      </FeatureFlag>

      {/* Instructions */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle>How to Use Feature Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">🎛️ Toggle Controls</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use the debug panel (bottom-right)</li>
                <li>• Visit Settings → Features tab</li>
                <li>• Use individual toggle components</li>
                <li>• Toggle via keyboard shortcuts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💾 Persistence</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Settings saved to localStorage</li>
                <li>• Persist across browser sessions</li>
                <li>• Export/import configurations</li>
                <li>• Reset to defaults anytime</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Try toggling different features to see how they affect the interface! 
              Changes are applied immediately and persist across page reloads.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeatureFlagDemo;