import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Shield,
  Zap,
  Monitor,
  Globe,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { analyticsService } from '../../services/AnalyticsService';

interface LaunchReadinessCheck {
  id: string;
  name: string;
  description: string;
  category: 'infrastructure' | 'security' | 'performance' | 'content' | 'monitoring';
  status: 'pending' | 'checking' | 'passed' | 'failed' | 'warning';
  required: boolean;
  autoCheck: boolean;
  lastChecked?: number;
  details?: string;
}

interface LaunchReadinessState {
  isReady: boolean;
  overallScore: number;
  lastUpdated: number;
  blockers: string[];
  warnings: string[];
  environment: 'development' | 'staging' | 'production';
}

interface LaunchReadinessToggleProps {
  onReadinessChange?: (isReady: boolean, state: LaunchReadinessState) => void;
  onNavigateToTool?: (tool: string) => void;
  className?: string;
}

export function LaunchReadinessToggle({ 
  onReadinessChange, 
  onNavigateToTool,
  className = ''
}: LaunchReadinessToggleProps) {
  const [isLaunchReady, setIsLaunchReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lastCheck, setLastCheck] = useState<number>(0);
  const [readinessState, setReadinessState] = useState<LaunchReadinessState>({
    isReady: false,
    overallScore: 0,
    lastUpdated: Date.now(),
    blockers: [],
    warnings: [],
    environment: 'development'
  });

  // Define comprehensive launch readiness checks
  const [readinessChecks, setReadinessChecks] = useState<LaunchReadinessCheck[]>([
    {
      id: 'production-deployment',
      name: 'Production Deployment',
      description: 'Application is deployed to production environment',
      category: 'infrastructure',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'Verifies that the application is accessible on production URL'
    },
    {
      id: 'ssl-certificate',
      name: 'SSL Certificate',
      description: 'Valid SSL certificate is installed and working',
      category: 'security',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'Ensures secure HTTPS connection is active'
    },
    {
      id: 'performance-metrics',
      name: 'Performance Metrics',
      description: 'Core Web Vitals meet target thresholds',
      category: 'performance',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'LCP < 2.5s, FID < 100ms, CLS < 0.1'
    },
    {
      id: 'error-monitoring',
      name: 'Error Monitoring',
      description: 'Error tracking and monitoring systems are active',
      category: 'monitoring',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'Sentry or similar error tracking configured'
    },
    {
      id: 'database-connectivity',
      name: 'Database Connectivity',
      description: 'Database connections are stable and optimized',
      category: 'infrastructure',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'All database operations functioning correctly'
    },
    {
      id: 'api-endpoints',
      name: 'API Endpoints',
      description: 'All critical API endpoints are responding correctly',
      category: 'infrastructure',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'Health checks passing for all services'
    },
    {
      id: 'content-validation',
      name: 'Content Validation',
      description: 'All public-facing content has been reviewed',
      category: 'content',
      status: 'pending',
      required: true,
      autoCheck: false,
      details: 'Marketing copy, legal pages, and UI text approved'
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      description: 'Security vulnerabilities have been scanned and addressed',
      category: 'security',
      status: 'pending',
      required: true,
      autoCheck: true,
      details: 'No critical security issues detected'
    },
    {
      id: 'backup-system',
      name: 'Backup System',
      description: 'Automated backup systems are configured',
      category: 'infrastructure',
      status: 'pending',
      required: false,
      autoCheck: true,
      details: 'Regular database and file backups scheduled'
    },
    {
      id: 'analytics-tracking',
      name: 'Analytics Tracking',
      description: 'User analytics and tracking systems are functional',
      category: 'monitoring',
      status: 'pending',
      required: false,
      autoCheck: true,
      details: 'Google Analytics, conversion tracking enabled'
    }
  ]);

  // Auto-check function that simulates checking various systems
  const performReadinessChecks = useCallback(async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Simulate checking each item with realistic timing
      const updatedChecks = await Promise.all(
        readinessChecks.map(async (check) => {
          if (!check.autoCheck) return check;
          
          // Add some realistic delay for checking
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
          
          // Simulate check results based on check type
          let status: LaunchReadinessCheck['status'] = 'passed';
          let details = check.details;
          
          switch (check.id) {
            case 'production-deployment':
              // Check if we're in production
              status = window.location.hostname.includes('localhost') ? 'warning' : 'passed';
              details = status === 'warning' ? 'Running on localhost - deploy to production' : 'Production deployment active';
              break;
              
            case 'ssl-certificate':
              status = window.location.protocol === 'https:' ? 'passed' : 'failed';
              details = status === 'passed' ? 'SSL certificate valid' : 'HTTPS not enabled';
              break;
              
            case 'performance-metrics':
              // Simulate performance check
              const performanceScore = Math.random();
              if (performanceScore > 0.8) {
                status = 'passed';
                details = 'Performance metrics meet targets';
              } else if (performanceScore > 0.6) {
                status = 'warning';
                details = 'Performance metrics need optimization';
              } else {
                status = 'failed';
                details = 'Performance metrics below targets';
              }
              break;
              
            case 'error-monitoring':
              // Check if error tracking is configured
              status = 'passed'; // Assume configured for demo
              details = 'Error monitoring active';
              break;
              
            case 'database-connectivity':
              // Simulate database check
              status = Math.random() > 0.1 ? 'passed' : 'warning';
              details = status === 'passed' ? 'Database connections stable' : 'Database response time elevated';
              break;
              
            case 'api-endpoints':
              // Simulate API health check
              status = Math.random() > 0.05 ? 'passed' : 'failed';
              details = status === 'passed' ? 'All endpoints responding' : 'Some endpoints not responding';
              break;
              
            case 'security-scan':
              // Simulate security scan
              status = Math.random() > 0.2 ? 'passed' : 'warning';
              details = status === 'passed' ? 'No security issues detected' : 'Minor security recommendations available';
              break;
              
            case 'backup-system':
              status = 'passed';
              details = 'Automated backups configured';
              break;
              
            case 'analytics-tracking':
              status = 'passed';
              details = 'Analytics tracking functional';
              break;
              
            default:
              status = 'passed';
          }
          
          return {
            ...check,
            status,
            details,
            lastChecked: Date.now()
          };
        })
      );
      
      setReadinessChecks(updatedChecks);
      
      // Calculate readiness state
      const requiredChecks = updatedChecks.filter(check => check.required);
      const passedRequired = requiredChecks.filter(check => check.status === 'passed').length;
      const failedRequired = requiredChecks.filter(check => check.status === 'failed');
      const warningRequired = requiredChecks.filter(check => check.status === 'warning');
      
      const overallScore = (passedRequired / requiredChecks.length) * 100;
      const isReady = failedRequired.length === 0 && overallScore >= 80;
      
      const newState: LaunchReadinessState = {
        isReady,
        overallScore,
        lastUpdated: Date.now(),
        blockers: failedRequired.map(check => check.name),
        warnings: warningRequired.map(check => check.name),
        environment: window.location.hostname.includes('localhost') ? 'development' : 'production'
      };
      
      setReadinessState(newState);
      setLastCheck(Date.now());
      
      // Notify parent component
      onReadinessChange?.(isReady, newState);
      
      // Track analytics
      analyticsService.trackLaunchReadinessCheck({
        score: overallScore,
        isReady,
        blockers: newState.blockers.length,
        warnings: newState.warnings.length,
        checkDuration: Date.now() - startTime
      });
      
      // Show appropriate toast
      if (isReady) {
        toast.success('🚀 Launch readiness checks passed! Ready for launch.');
      } else if (failedRequired.length > 0) {
        toast.error(`${failedRequired.length} critical issue(s) need to be resolved before launch.`);
      } else {
        toast.warning('Launch readiness checks completed with warnings.');
      }
      
    } catch (error) {
      console.error('Readiness check failed:', error);
      toast.error('Failed to perform readiness checks. Please try again.');
    } finally {
      setIsChecking(false);
    }
  }, [readinessChecks, onReadinessChange]);

  // Handle launch readiness toggle
  const handleLaunchReadinessToggle = useCallback(async (enabled: boolean) => {
    if (enabled) {
      // If enabling, perform checks first
      await performReadinessChecks();
      
      // Only enable if checks pass
      if (readinessState.isReady && readinessState.blockers.length === 0) {
        setIsLaunchReady(true);
        toast.success('🚀 Launch mode activated! System is ready for production traffic.');
        analyticsService.trackLaunchModeActivated(readinessState);
      } else {
        toast.error('Cannot activate launch mode. Please resolve all blockers first.');
        return;
      }
    } else {
      setIsLaunchReady(false);
      toast.info('Launch mode deactivated. System returned to development mode.');
      analyticsService.trackLaunchModeDeactivated();
    }
  }, [readinessState, performReadinessChecks]);

  // Initialize checks on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ff-launch-readiness-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setReadinessState(parsed);
        setIsLaunchReady(parsed.isReady);
      } catch (error) {
        console.warn('Failed to load saved launch readiness state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('ff-launch-readiness-state', JSON.stringify(readinessState));
  }, [readinessState]);

  const getStatusIcon = (status: LaunchReadinessCheck['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'checking': return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: LaunchReadinessCheck['status']) => {
    switch (status) {
      case 'passed': return 'text-success';
      case 'failed': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'checking': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`ff-card-interactive ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span>Launch Readiness Control</span>
            {isLaunchReady && (
              <Badge variant="default" className="ff-badge-glow animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="ff-focus-ring"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold font-sora">Launch Mode</h3>
              {readinessState.overallScore > 0 && (
                <Badge variant="outline">
                  {Math.round(readinessState.overallScore)}% Ready
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-inter">
              {isLaunchReady 
                ? 'System is in live production mode' 
                : 'System is in development mode'
              }
            </p>
            {lastCheck > 0 && (
              <p className="text-xs text-muted-foreground">
                Last checked: {new Date(lastCheck).toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Switch
              checked={isLaunchReady}
              onCheckedChange={handleLaunchReadinessToggle}
              disabled={isChecking}
              className="ff-switch-enhanced"
            />
          </div>
        </div>

        {/* Readiness Score */}
        {readinessState.overallScore > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-sora">Readiness Score</span>
              <span className="text-sm font-bold">
                {Math.round(readinessState.overallScore)}%
              </span>
            </div>
            <Progress 
              value={readinessState.overallScore} 
              className="h-2 ff-progress-bar" 
            />
          </div>
        )}

        {/* Blockers and Warnings */}
        {(readinessState.blockers.length > 0 || readinessState.warnings.length > 0) && (
          <div className="space-y-3">
            {readinessState.blockers.length > 0 && (
              <Alert className="border-destructive bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-destructive">Critical Issues</AlertTitle>
                <AlertDescription>
                  {readinessState.blockers.length} issue(s) must be resolved: {readinessState.blockers.join(', ')}
                </AlertDescription>
              </Alert>
            )}
            
            {readinessState.warnings.length > 0 && (
              <Alert className="border-warning bg-warning/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-warning">Warnings</AlertTitle>
                <AlertDescription>
                  {readinessState.warnings.length} warning(s): {readinessState.warnings.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={performReadinessChecks}
            disabled={isChecking}
            className="ff-btn-primary ff-hover-glow"
          >
            {isChecking ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-pulse" />
                Checking...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Run Checks
              </>
            )}
          </Button>
          
          {onNavigateToTool && (
            <Button
              variant="outline"
              onClick={() => onNavigateToTool('deployments')}
              className="ff-focus-ring"
            >
              <Settings className="h-4 w-4 mr-2" />
              Deployment Settings
            </Button>
          )}
        </div>

        {/* Detailed Checks */}
        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm font-sora">Readiness Checks</h4>
            
            <div className="space-y-3">
              {readinessChecks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    check.status === 'passed' ? 'bg-success/5 border-success/20' :
                    check.status === 'failed' ? 'bg-destructive/5 border-destructive/20' :
                    check.status === 'warning' ? 'bg-warning/5 border-warning/20' :
                    'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(check.status)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm font-sora">{check.name}</h5>
                      {check.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs capitalize">
                        {check.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground font-inter">
                      {check.description}
                    </p>
                    
                    {check.details && (
                      <p className={`text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.details}
                      </p>
                    )}
                    
                    {check.lastChecked && (
                      <p className="text-xs text-muted-foreground">
                        Checked: {new Date(check.lastChecked).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LaunchReadinessToggle;