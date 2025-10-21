import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { LaunchReadinessToggle } from '../launch/LaunchReadinessToggle';
import { 
  Rocket, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Settings
} from 'lucide-react';

interface LaunchReadinessDemoProps {
  onNavigateToTool?: (tool: string) => void;
}

export function LaunchReadinessDemo({ onNavigateToTool }: LaunchReadinessDemoProps) {
  const [launchState, setLaunchState] = useState<any>(null);

  const handleReadinessChange = (isReady: boolean, state: any) => {
    setLaunchState(state);
    console.log('Launch readiness changed:', { isReady, state });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold ff-text-gradient font-sora">
            Launch Readiness System Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
            FlashFusion's comprehensive launch readiness system ensures your application is 
            production-ready before going live. Test the toggle and see real-time validation.
          </p>
        </div>

        {/* Info Card */}
        <Card className="ff-card-interactive border-info/20 bg-info/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-info">
              <Info className="h-5 w-5" />
              About the Launch Readiness Toggle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground font-inter">
              The Launch Readiness Toggle is a critical component of FlashFusion that validates 
              your application's production readiness across multiple categories:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm font-sora">Automated Checks:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-inter">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Production deployment status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    SSL certificate validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Performance metrics analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Security vulnerability scanning
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm font-sora">Manual Validations:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-inter">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    Content review and approval
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Analytics tracking setup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Error monitoring systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Database optimization
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current State Display */}
        {launchState && (
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Current Launch State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(launchState.overallScore)}%
                  </div>
                  <div className="text-sm text-muted-foreground font-sora">
                    Readiness Score
                  </div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-destructive mb-1">
                    {launchState.blockers.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-sora">
                    Critical Blockers
                  </div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-warning mb-1">
                    {launchState.warnings.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-sora">
                    Warnings
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={launchState.isReady ? 'default' : 'destructive'}>
                    {launchState.isReady ? 'READY FOR LAUNCH' : 'NOT READY'}
                  </Badge>
                  <Badge variant="outline">
                    {launchState.environment.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(launchState.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold font-sora">Try the Launch Readiness Toggle</h2>
            <p className="text-muted-foreground font-inter">
              Click "Run Checks" to validate your application's launch readiness, then use 
              the toggle to activate launch mode.
            </p>
            
            <LaunchReadinessToggle
              onReadinessChange={handleReadinessChange}
              onNavigateToTool={onNavigateToTool}
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-sora">Integration Guide</h3>
            <Card className="ff-card-interactive">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm font-sora">Implementation Steps:</h4>
                  
                  <ol className="space-y-2 text-sm text-muted-foreground font-inter">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                      <span>Import the LaunchReadinessToggle component</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                      <span>Add readiness change handler to track state</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                      <span>Configure navigation handler for tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                      <span>Position component for optimal accessibility</span>
                    </li>
                  </ol>
                  
                  <div className="bg-muted/50 p-3 rounded-lg mt-4">
                    <code className="text-xs font-mono">
                      {'<LaunchReadinessToggle'}<br/>
                      {'  onReadinessChange={handleReadinessChange}'}<br/>
                      {'  onNavigateToTool={handlePageChange}'}<br/>
                      {'  className="fixed bottom-4 right-4"'}<br/>
                      {'/>'}<br/>
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {onNavigateToTool && (
                <>
                  <Button
                    onClick={() => onNavigateToTool('deployments')}
                    className="ff-btn-primary"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    View Deployments
                  </Button>
                  
                  <Button
                    onClick={() => onNavigateToTool('settings')}
                    variant="outline"
                    className="ff-focus-ring"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="ff-card-interactive">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-sora">Automated Validation</h3>
              <p className="text-sm text-muted-foreground font-inter">
                Comprehensive automated checks for infrastructure, security, and performance.
              </p>
            </CardContent>
          </Card>
          
          <Card className="ff-card-interactive">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-sora">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground font-inter">
                Live monitoring of system health and readiness status with instant feedback.
              </p>
            </CardContent>
          </Card>
          
          <Card className="ff-card-interactive">
            <CardContent className="p-6 text-center">
              <Rocket className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2 font-sora">Confident Launches</h3>
              <p className="text-sm text-muted-foreground font-inter">
                Launch with confidence knowing all critical systems have been validated.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LaunchReadinessDemo;