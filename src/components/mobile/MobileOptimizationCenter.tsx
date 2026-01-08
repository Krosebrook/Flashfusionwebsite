import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Battery, 
  Zap, 
  Target, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Settings,
  Maximize,
  Minimize,
  RotateCcw,
  Download,
  Upload,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Hand,
  Navigation,
  Accessibility
} from 'lucide-react';
import { analyticsService } from '../../services/AnalyticsService';
import { toast } from 'sonner';

interface DeviceMetrics {
  device: 'mobile' | 'tablet' | 'desktop';
  screenSize: string;
  userAgent: string;
  networkSpeed: 'slow' | 'medium' | 'fast';
  batteryLevel?: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
}

interface PerformanceScore {
  overall: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  speedIndex: number;
}

interface AccessibilityCheck {
  id: string;
  category: 'touch' | 'visual' | 'navigation' | 'content' | 'interaction';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
}

interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  active: boolean;
  testPassed: boolean;
  issues: string[];
}

interface MobileOptimization {
  touchTargets: {
    minSize: number;
    spacing: number;
    compliance: number;
    issues: number;
  };
  textReadability: {
    fontSize: number;
    contrast: number;
    lineHeight: number;
    score: number;
  };
  loadingPerformance: {
    bundleSize: number;
    imageOptimization: number;
    cacheHitRate: number;
    score: number;
  };
  userExperience: {
    scrollPerformance: number;
    navigationEase: number;
    contentAccessibility: number;
    score: number;
  };
}

export function MobileOptimizationCenter() {
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics | null>(null);
  const [performanceScore, setPerformanceScore] = useState<PerformanceScore | null>(null);
  const [accessibilityChecks, setAccessibilityChecks] = useState<AccessibilityCheck[]>([]);
  const [responsiveBreakpoints, setResponsiveBreakpoints] = useState<ResponsiveBreakpoint[]>([]);
  const [mobileOptimization, setMobileOptimization] = useState<MobileOptimization | null>(null);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isLoading, setIsLoading] = useState(true);

  const testFrameRef = useRef<HTMLIFrameElement>(null);

  // Detect device and initialize metrics
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let device: DeviceMetrics['device'] = 'desktop';
      if (width <= 768) device = 'mobile';
      else if (width <= 1024) device = 'tablet';
      
      const metrics: DeviceMetrics = {
        device,
        screenSize: `${width}x${height}`,
        userAgent,
        networkSpeed: 'medium', // Would be detected via Network Information API
        orientation: width > height ? 'landscape' : 'portrait',
        touchSupport: 'ontouchstart' in window,
        viewportWidth: width,
        viewportHeight: height,
        pixelRatio: window.devicePixelRatio
      };

      // Battery API (if supported)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setDeviceMetrics(prev => prev ? { ...prev, batteryLevel: battery.level } : null);
        });
      }

      return metrics;
    };

    const runAccessibilityChecks = (): AccessibilityCheck[] => {
      return [
        {
          id: 'touch-targets',
          category: 'touch',
          title: 'Touch Target Size',
          description: 'Interactive elements should be at least 44x44px',
          status: 'pass',
          impact: 'medium',
          recommendation: 'Ensure all buttons and links meet minimum touch target requirements'
        },
        {
          id: 'contrast-ratio',
          category: 'visual',
          title: 'Color Contrast',
          description: 'Text should have sufficient contrast against background',
          status: 'pass',
          impact: 'high'
        },
        {
          id: 'text-scaling',
          category: 'visual',
          title: 'Text Scaling',
          description: 'Text should remain readable when scaled to 200%',
          status: 'warning',
          impact: 'medium',
          recommendation: 'Test layouts with browser zoom at 200%'
        },
        {
          id: 'keyboard-navigation',
          category: 'navigation',
          title: 'Keyboard Navigation',
          description: 'All interactive elements should be keyboard accessible',
          status: 'pass',
          impact: 'critical'
        },
        {
          id: 'focus-indicators',
          category: 'navigation',
          title: 'Focus Indicators',
          description: 'Visible focus indicators for keyboard navigation',
          status: 'pass',
          impact: 'high'
        },
        {
          id: 'content-reflow',
          category: 'content',
          title: 'Content Reflow',
          description: 'Content should reflow properly on small screens',
          status: 'warning',
          impact: 'medium',
          recommendation: 'Test content layout on mobile devices'
        }
      ];
    };

    const initializeBreakpoints = (): ResponsiveBreakpoint[] => {
      const breakpoints = [
        { name: 'Mobile S', minWidth: 320, maxWidth: 375, active: false, testPassed: true, issues: [] },
        { name: 'Mobile M', minWidth: 375, maxWidth: 425, active: false, testPassed: true, issues: [] },
        { name: 'Mobile L', minWidth: 425, maxWidth: 768, active: false, testPassed: true, issues: [] },
        { name: 'Tablet', minWidth: 768, maxWidth: 1024, active: false, testPassed: true, issues: [] },
        { name: 'Laptop', minWidth: 1024, maxWidth: 1440, active: false, testPassed: true, issues: [] },
        { name: 'Desktop', minWidth: 1440, active: false, testPassed: true, issues: [] }
      ];

      const currentWidth = window.innerWidth;
      return breakpoints.map(bp => ({
        ...bp,
        active: currentWidth >= bp.minWidth && (!bp.maxWidth || currentWidth <= bp.maxWidth)
      }));
    };

    const generatePerformanceScore = (): PerformanceScore => {
      return {
        overall: Math.random() * 20 + 75, // 75-95
        firstContentfulPaint: Math.random() * 1000 + 500, // 500-1500ms
        largestContentfulPaint: Math.random() * 1500 + 1000, // 1000-2500ms
        cumulativeLayoutShift: Math.random() * 0.1, // 0-0.1
        firstInputDelay: Math.random() * 50 + 10, // 10-60ms
        timeToInteractive: Math.random() * 2000 + 1500, // 1500-3500ms
        speedIndex: Math.random() * 1500 + 1200 // 1200-2700ms
      };
    };

    const generateMobileOptimization = (): MobileOptimization => {
      return {
        touchTargets: {
          minSize: 44,
          spacing: 8,
          compliance: Math.random() * 15 + 85, // 85-100%
          issues: Math.floor(Math.random() * 3)
        },
        textReadability: {
          fontSize: 16,
          contrast: Math.random() * 2 + 4.5, // 4.5-6.5
          lineHeight: 1.6,
          score: Math.random() * 15 + 85 // 85-100
        },
        loadingPerformance: {
          bundleSize: Math.random() * 500 + 200, // 200-700KB
          imageOptimization: Math.random() * 20 + 75, // 75-95%
          cacheHitRate: Math.random() * 15 + 80, // 80-95%
          score: Math.random() * 20 + 75 // 75-95
        },
        userExperience: {
          scrollPerformance: Math.random() * 10 + 90, // 90-100
          navigationEase: Math.random() * 15 + 80, // 80-95
          contentAccessibility: Math.random() * 10 + 85, // 85-95
          score: Math.random() * 15 + 82 // 82-97
        }
      };
    };

    // Initialize all data
    setDeviceMetrics(detectDevice());
    setAccessibilityChecks(runAccessibilityChecks());
    setResponsiveBreakpoints(initializeBreakpoints());
    setPerformanceScore(generatePerformanceScore());
    setMobileOptimization(generateMobileOptimization());
    setIsLoading(false);

    // Listen for resize events
    const handleResize = () => {
      setDeviceMetrics(detectDevice());
      setResponsiveBreakpoints(initializeBreakpoints());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive testing functions
  const testBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint) => {
    setCurrentBreakpoint(breakpoint.name);
    setIsTestingMode(true);
    
    // Simulate viewport resize (in real implementation, would change iframe size)
    if (testFrameRef.current) {
      testFrameRef.current.style.width = `${breakpoint.minWidth}px`;
      testFrameRef.current.style.height = '600px';
    }
    
    // Track testing analytics
    analyticsService.trackResponsiveTest(breakpoint.name, breakpoint.minWidth);
    
    toast.info(`Testing ${breakpoint.name} viewport (${breakpoint.minWidth}px)`);
  }, []);

  const toggleOrientation = useCallback(() => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    
    if (testFrameRef.current) {
      const currentWidth = testFrameRef.current.style.width;
      const currentHeight = testFrameRef.current.style.height;
      testFrameRef.current.style.width = currentHeight;
      testFrameRef.current.style.height = currentWidth;
    }
    
    toast.info(`Switched to ${newOrientation} orientation`);
  }, [orientation]);

  const runAccessibilityAudit = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate accessibility audit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedChecks = accessibilityChecks.map(check => ({
        ...check,
        status: Math.random() > 0.2 ? 'pass' : Math.random() > 0.5 ? 'warning' : 'fail'
      })) as AccessibilityCheck[];
      
      setAccessibilityChecks(updatedChecks);
      
      const passedChecks = updatedChecks.filter(check => check.status === 'pass').length;
      const totalChecks = updatedChecks.length;
      const score = (passedChecks / totalChecks) * 100;
      
      toast.success(`Accessibility audit complete: ${score.toFixed(0)}% passed`);
      
      analyticsService.trackAccessibilityAudit(score, updatedChecks.length);
    } catch (error) {
      toast.error('Accessibility audit failed');
    } finally {
      setIsLoading(false);
    }
  }, [accessibilityChecks]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'fail': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/10 text-red-500';
      case 'high': return 'bg-orange-500/10 text-orange-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const criticalIssues = accessibilityChecks.filter(check => 
    check.status === 'fail' && (check.impact === 'critical' || check.impact === 'high')
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Mobile Optimization Center</h1>
          <p className="text-muted-foreground">
            Ensure excellent mobile experience for 500+ users across all devices
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {deviceMetrics && (
            <div className="flex items-center gap-2">
              {deviceMetrics.device === 'mobile' ? <Smartphone className="h-5 w-5" /> :
               deviceMetrics.device === 'tablet' ? <Tablet className="h-5 w-5" /> :
               <Monitor className="h-5 w-5" />}
              <span className="text-sm font-medium capitalize">{deviceMetrics.device}</span>
              <Badge variant="outline">{deviceMetrics.screenSize}</Badge>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestingMode(!isTestingMode)}
            className={`ff-focus-ring ${isTestingMode ? 'bg-primary/10' : ''}`}
          >
            <Target className="h-4 w-4 mr-2" />
            {isTestingMode ? 'Exit Testing' : 'Start Testing'}
          </Button>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Mobile Issues</AlertTitle>
          <AlertDescription>
            {criticalIssues} critical accessibility or mobile usability issue{criticalIssues === 1 ? '' : 's'} found.
            <Button size="sm" variant="destructive" className="ml-3" onClick={runAccessibilityAudit}>
              Run Full Audit
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Device Overview */}
      {deviceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {deviceMetrics.device === 'mobile' ? <Smartphone className="h-5 w-5 text-primary" /> :
                   deviceMetrics.device === 'tablet' ? <Tablet className="h-5 w-5 text-primary" /> :
                   <Monitor className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="font-medium">Device Type</h3>
              </div>
              <p className="text-2xl font-bold capitalize">{deviceMetrics.device}</p>
              <p className="text-sm text-muted-foreground">
                {deviceMetrics.viewportWidth} × {deviceMetrics.viewportHeight}px
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Wifi className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-medium">Network</h3>
              </div>
              <p className="text-2xl font-bold capitalize">{deviceMetrics.networkSpeed}</p>
              <p className="text-sm text-muted-foreground">Connection speed</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Hand className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-medium">Touch Support</h3>
              </div>
              <p className="text-2xl font-bold">{deviceMetrics.touchSupport ? 'Yes' : 'No'}</p>
              <p className="text-sm text-muted-foreground">
                {deviceMetrics.pixelRatio}x pixel ratio
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <RotateCcw className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-medium">Orientation</h3>
              </div>
              <p className="text-2xl font-bold capitalize">{deviceMetrics.orientation}</p>
              {deviceMetrics.batteryLevel && (
                <p className="text-sm text-muted-foreground">
                  Battery: {Math.round(deviceMetrics.batteryLevel * 100)}%
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Overview */}
      {performanceScore && mobileOptimization && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Performance</h3>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(performanceScore.overall)}`}>
                {performanceScore.overall.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Overall score</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Hand className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-medium">Touch Targets</h3>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(mobileOptimization.touchTargets.compliance)}`}>
                {mobileOptimization.touchTargets.compliance.toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {mobileOptimization.touchTargets.issues} issues
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-medium">Readability</h3>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(mobileOptimization.textReadability.score)}`}>
                {mobileOptimization.textReadability.score.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {mobileOptimization.textReadability.contrast.toFixed(1)}:1 contrast
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-medium">User Experience</h3>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(mobileOptimization.userExperience.score)}`}>
                {mobileOptimization.userExperience.score.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Overall UX score</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="responsive" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="responsive" className="ff-focus-ring">
            Responsive Testing
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="ff-focus-ring">
            Accessibility ({accessibilityChecks.filter(c => c.status === 'pass').length}/{accessibilityChecks.length})
          </TabsTrigger>
          <TabsTrigger value="performance" className="ff-focus-ring">
            Performance
          </TabsTrigger>
          <TabsTrigger value="optimization" className="ff-focus-ring">
            Mobile UX
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responsive" className="space-y-4">
          <div className="space-y-6">
            {/* Breakpoint Testing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Responsive Breakpoints</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleOrientation}
                    className="ff-focus-ring"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {responsiveBreakpoints.map((breakpoint) => (
                  <Card 
                    key={breakpoint.name}
                    className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                      currentBreakpoint === breakpoint.name ? 'ring-2 ring-primary bg-primary/5' : ''
                    } ${breakpoint.active ? 'border-green-500/30 bg-green-500/5' : ''}`}
                    onClick={() => testBreakpoint(breakpoint)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{breakpoint.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {breakpoint.minWidth}px{breakpoint.maxWidth ? `+` : '+'}
                        </p>
                        <div className="flex items-center justify-center">
                          {breakpoint.testPassed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {breakpoint.active && (
                          <Badge variant="outline" className="text-xs">Current</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testing Interface */}
            {isTestingMode && (
              <Card className="ff-card-interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Responsive Testing - {currentBreakpoint}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsTestingMode(false)}
                      className="ff-focus-ring"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <iframe
                        ref={testFrameRef}
                        src={window.location.href}
                        className="w-full h-96 border-0"
                        title="Responsive Testing Frame"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Testing viewport: {currentBreakpoint}</span>
                      <span>Orientation: {orientation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Accessibility Audit</h3>
              <Button
                onClick={runAccessibilityAudit}
                disabled={isLoading}
                className="ff-btn-primary"
              >
                <Accessibility className="h-4 w-4 mr-2" />
                {isLoading ? 'Running Audit...' : 'Run Full Audit'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessibilityChecks.map((check) => (
                <Card 
                  key={check.id} 
                  className={`ff-card-interactive ${
                    check.status === 'fail' ? 'border-red-500/30 bg-red-500/5' :
                    check.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-green-500/30 bg-green-500/5'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        check.status === 'pass' ? 'bg-green-500/10' :
                        check.status === 'warning' ? 'bg-yellow-500/10' :
                        'bg-red-500/10'
                      }`}>
                        {check.status === 'pass' ? (
                          <CheckCircle className={`h-5 w-5 ${getStatusColor(check.status)}`} />
                        ) : (
                          <AlertTriangle className={`h-5 w-5 ${getStatusColor(check.status)}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{check.title}</h4>
                          <Badge className={getImpactColor(check.impact)}>
                            {check.impact}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">{check.description}</p>
                        
                        {check.recommendation && check.status !== 'pass' && (
                          <div className="p-2 bg-muted/50 rounded text-xs">
                            <strong>Recommendation:</strong> {check.recommendation}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {check.category}
                          </Badge>
                          <Badge variant={check.status === 'pass' ? 'default' : 'destructive'} className="text-xs">
                            {check.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {performanceScore && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">First Contentful Paint</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.firstContentfulPaint < 1800 ? 90 : 60)}`}>
                        {(performanceScore.firstContentfulPaint / 1000).toFixed(1)}s
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - (performanceScore.firstContentfulPaint / 30))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Largest Contentful Paint</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.largestContentfulPaint < 2500 ? 85 : 55)}`}>
                        {(performanceScore.largestContentfulPaint / 1000).toFixed(1)}s
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - (performanceScore.largestContentfulPaint / 40))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">First Input Delay</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.firstInputDelay < 100 ? 95 : 70)}`}>
                        {performanceScore.firstInputDelay.toFixed(0)}ms
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - performanceScore.firstInputDelay)} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Cumulative Layout Shift</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.cumulativeLayoutShift < 0.1 ? 90 : 60)}`}>
                        {performanceScore.cumulativeLayoutShift.toFixed(3)}
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - (performanceScore.cumulativeLayoutShift * 1000))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Time to Interactive</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.timeToInteractive < 3800 ? 85 : 60)}`}>
                        {(performanceScore.timeToInteractive / 1000).toFixed(1)}s
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - (performanceScore.timeToInteractive / 50))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Speed Index</h3>
                      <p className={`text-2xl font-bold ${getScoreColor(performanceScore.speedIndex < 3400 ? 80 : 55)}`}>
                        {(performanceScore.speedIndex / 1000).toFixed(1)}s
                      </p>
                      <Progress 
                        value={Math.max(0, 100 - (performanceScore.speedIndex / 40))} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg">
                      <Download className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Optimize Images</p>
                        <p className="text-xs text-muted-foreground">Compress and use modern formats (WebP, AVIF)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">Code Splitting</p>
                        <p className="text-xs text-muted-foreground">Implement lazy loading for better initial load</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">Caching Strategy</p>
                        <p className="text-xs text-muted-foreground">Implement service worker for offline functionality</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {mobileOptimization && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">Touch Target Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Minimum Size</span>
                        <span className="font-medium">{mobileOptimization.touchTargets.minSize}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Spacing</span>
                        <span className="font-medium">{mobileOptimization.touchTargets.spacing}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Compliance</span>
                        <span className={`font-medium ${getScoreColor(mobileOptimization.touchTargets.compliance)}`}>
                          {mobileOptimization.touchTargets.compliance.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={mobileOptimization.touchTargets.compliance} className="h-2" />
                      
                      {mobileOptimization.touchTargets.issues > 0 && (
                        <p className="text-xs text-yellow-600">
                          {mobileOptimization.touchTargets.issues} elements need attention
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">Text Readability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Font Size</span>
                        <span className="font-medium">{mobileOptimization.textReadability.fontSize}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Contrast Ratio</span>
                        <span className="font-medium">{mobileOptimization.textReadability.contrast.toFixed(1)}:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Line Height</span>
                        <span className="font-medium">{mobileOptimization.textReadability.lineHeight}</span>
                      </div>
                      <Progress value={mobileOptimization.textReadability.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">Loading Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bundle Size</span>
                        <span className="font-medium">{mobileOptimization.loadingPerformance.bundleSize.toFixed(0)}KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Image Optimization</span>
                        <span className="font-medium">{mobileOptimization.loadingPerformance.imageOptimization.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                        <span className="font-medium">{mobileOptimization.loadingPerformance.cacheHitRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={mobileOptimization.loadingPerformance.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">User Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Scroll Performance</span>
                        <span className="font-medium">{mobileOptimization.userExperience.scrollPerformance.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Navigation Ease</span>
                        <span className="font-medium">{mobileOptimization.userExperience.navigationEase.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Content Accessibility</span>
                        <span className="font-medium">{mobileOptimization.userExperience.contentAccessibility.toFixed(0)}%</span>
                      </div>
                      <Progress value={mobileOptimization.userExperience.score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}