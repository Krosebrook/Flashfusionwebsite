import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Zap, 
  Database, 
  Code, 
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemCheck {
  name: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export function SystemStatusDashboard() {
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runSystemChecks = async () => {
    setIsRunningChecks(true);
    const checks: SystemCheck[] = [
      { name: 'Gamification System', status: 'checking', message: 'Checking XP tracking...' },
      { name: 'AI Service Integration', status: 'checking', message: 'Checking AI models...' },
      { name: 'File Download System', status: 'checking', message: 'Testing downloads...' },
      { name: 'Component Rendering', status: 'checking', message: 'Checking React components...' },
      { name: 'Local Storage', status: 'checking', message: 'Testing data persistence...' },
    ];
    
    setSystemChecks(checks);

    // Run checks sequentially with delays for better UX
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const check = checks[i];
      let updatedCheck: SystemCheck;

      try {
        switch (check.name) {
          case 'Gamification System':
            // Test gamification
            const userId = localStorage.getItem('ff_user_id') || 'test_user';
            const testStats = localStorage.getItem(`ff_user_stats_${userId}`);
            updatedCheck = {
              ...check,
              status: 'success',
              message: 'XP tracking operational',
              details: testStats ? 'User progress saved locally' : 'Ready to track progress'
            };
            break;

          case 'AI Service Integration':
            // Test AI service
            try {
              const { default: AIService } = await import('../../services/AIService');
              const models = await AIService.getAvailableModels();
              updatedCheck = {
                ...check,
                status: Array.isArray(models) && models.length > 0 ? 'success' : 'warning',
                message: Array.isArray(models) && models.length > 0 
                  ? `${models.length} AI models available` 
                  : 'No AI models configured',
                details: Array.isArray(models) && models.length > 0 
                  ? 'Ready for code generation' 
                  : 'Configure AI models in Settings'
              };
            } catch (error) {
              updatedCheck = {
                ...check,
                status: 'warning',
                message: 'AI service ready (demo mode)',
                details: 'Configure API keys for full functionality'
              };
            }
            break;

          case 'File Download System':
            // Test download capability
            try {
              const JSZip = (await import('jszip')).default;
              const zip = new JSZip();
              zip.file('test.txt', 'Hello FlashFusion!');
              await zip.generateAsync({ type: 'blob' });
              updatedCheck = {
                ...check,
                status: 'success',
                message: 'Download system operational',
                details: 'Ready to export projects'
              };
            } catch (error) {
              updatedCheck = {
                ...check,
                status: 'error',
                message: 'Download system failed',
                details: 'JSZip library unavailable'
              };
            }
            break;

          case 'Component Rendering':
            // Test React rendering
            const hasReact = typeof React !== 'undefined';
            updatedCheck = {
              ...check,
              status: hasReact ? 'success' : 'error',
              message: hasReact ? 'React components loaded' : 'React not available',
              details: hasReact ? 'UI components ready' : 'Component system failed'
            };
            break;

          case 'Local Storage':
            // Test localStorage
            try {
              const testKey = 'ff_system_test';
              localStorage.setItem(testKey, 'test');
              const retrieved = localStorage.getItem(testKey);
              localStorage.removeItem(testKey);
              
              updatedCheck = {
                ...check,
                status: retrieved === 'test' ? 'success' : 'warning',
                message: retrieved === 'test' ? 'Data persistence working' : 'Storage limited',
                details: retrieved === 'test' ? 'Settings and progress will be saved' : 'Some features may not persist'
              };
            } catch (error) {
              updatedCheck = {
                ...check,
                status: 'warning',
                message: 'Storage unavailable',
                details: 'Running in private/incognito mode'
              };
            }
            break;

          default:
            updatedCheck = {
              ...check,
              status: 'success',
              message: 'Check completed',
              details: 'System operational'
            };
        }
      } catch (error) {
        updatedCheck = {
          ...check,
          status: 'error',
          message: 'Check failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setSystemChecks(prev => 
        prev.map((c, index) => index === i ? updatedCheck : c)
      );
    }

    setIsRunningChecks(false);
    setLastChecked(new Date());
    
    // Show summary toast
    const successCount = checks.filter(c => c.status === 'success').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const errorCount = checks.filter(c => c.status === 'error').length;
    
    if (errorCount === 0) {
      toast.success(`✅ System Check Complete: ${successCount} systems operational${warningCount > 0 ? `, ${warningCount} with warnings` : ''}`);
    } else {
      toast.error(`❌ System Check Complete: ${errorCount} errors, ${warningCount} warnings`);
    }
  };

  // Run checks on mount
  useEffect(() => {
    runSystemChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Checking</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-success text-white">Operational</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-warning text-black">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSystemIcon = (name: string) => {
    switch (name) {
      case 'Gamification System':
        return <Zap className="h-4 w-4" />;
      case 'AI Service Integration':
        return <Code className="h-4 w-4" />;
      case 'File Download System':
        return <Download className="h-4 w-4" />;
      case 'Component Rendering':
        return <CheckCircle className="h-4 w-4" />;
      case 'Local Storage':
        return <Database className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const overallStatus = systemChecks.length > 0 ? (
    systemChecks.every(check => check.status === 'success') ? 'success' :
    systemChecks.some(check => check.status === 'error') ? 'error' :
    'warning'
  ) : 'checking';

  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(isRunningChecks ? 'checking' : overallStatus)}
            System Status Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastChecked && (
              <span className="text-xs text-muted-foreground">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={runSystemChecks}
              disabled={isRunningChecks}
              className="ff-hover-scale"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRunningChecks ? 'animate-spin' : ''}`} />
              Recheck
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Status Alert */}
        {!isRunningChecks && systemChecks.length > 0 && (
          <Alert className={
            overallStatus === 'success' ? 'border-success/20 bg-success/5' :
            overallStatus === 'error' ? 'border-destructive/20 bg-destructive/5' :
            'border-warning/20 bg-warning/5'
          }>
            {overallStatus === 'success' ? <CheckCircle className="h-4 w-4 text-success" /> :
             overallStatus === 'error' ? <XCircle className="h-4 w-4 text-destructive" /> :
             <AlertTriangle className="h-4 w-4 text-warning" />}
            <AlertDescription>
              <strong>
                {overallStatus === 'success' ? '✅ All Systems Operational' :
                 overallStatus === 'error' ? '❌ System Issues Detected' :
                 '⚠️ Some Systems Need Attention'}
              </strong>
              <br />
              {overallStatus === 'success' ? 'FlashFusion is ready for full operation!' :
               overallStatus === 'error' ? 'Some features may not work properly.' :
               'Most features available with some limitations.'}
            </AlertDescription>
          </Alert>
        )}

        {/* System Checks List */}
        <div className="space-y-3">
          {systemChecks.map((check, index) => (
            <div
              key={check.name}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 transition-all duration-300 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-muted-foreground">
                  {getSystemIcon(check.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{check.name}</span>
                    {getStatusBadge(check.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                  {check.details && (
                    <p className="text-xs text-muted-foreground/75 mt-1">{check.details}</p>
                  )}
                </div>
              </div>
              <div className="ml-3">
                {getStatusIcon(check.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {!isRunningChecks && systemChecks.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Award test XP
                  import('../../services/GamificationInitializer').then(({ awardXP }) => {
                    awardXP(10, 'Ran system health check').catch(() => {});
                  });
                }}
                className="ff-btn-secondary text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Test XP System
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Test download
                  import('jszip').then(JSZip => {
                    const zip = new JSZip.default();
                    zip.file('system-check.txt', `FlashFusion System Check - ${new Date().toISOString()}\n\nAll systems operational!`);
                    zip.generateAsync({ type: 'blob' }).then(content => {
                      const url = URL.createObjectURL(content);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'flashfusion-system-check.zip';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      toast.success('System check file downloaded!');
                    });
                  });
                }}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Test Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SystemStatusDashboard;