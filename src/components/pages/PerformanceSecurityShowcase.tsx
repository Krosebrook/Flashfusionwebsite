import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Shield, 
  Zap, 
  Brain, 
  BarChart3, 
  Wand2,
  Gauge,
  Eye,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Activity,
  Globe,
  Lock,
  ArrowRight,
  Play,
  Settings,
  Download,
  Star,
  Heart,
  Users,
  Clock
} from 'lucide-react';

interface ShowcaseProps {
  onNavigateToTool?: (toolName: string) => void;
}

const PerformanceSecurityShowcase: React.FC<ShowcaseProps> = ({ onNavigateToTool }) => {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [performanceScore, setPerformanceScore] = useState(87);
  const [securityScore, setSecurityScore] = useState(92);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time score updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPerformanceScore(prev => Math.max(75, Math.min(100, prev + (Math.random() - 0.5) * 3)));
      setSecurityScore(prev => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const features = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Real-Time Performance Monitor',
      description: 'Live performance metrics with Core Web Vitals tracking, intelligent alerting, and optimization recommendations.',
      route: 'performance-monitor',
      highlights: ['Live metrics', 'Core Web Vitals', 'Smart alerts', 'Auto-optimization'],
      score: performanceScore,
      color: 'text-blue-500'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Comprehensive Security Scanner',
      description: 'Advanced threat detection, vulnerability assessment, and compliance monitoring with real-time alerts.',
      route: 'security-scanner',
      highlights: ['Threat detection', 'Vulnerability scan', 'Compliance check', 'Real-time alerts'],
      score: securityScore,
      color: 'text-green-500'
    },
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: 'Premium Micro-Interactions',
      description: 'Sophisticated UI animations and micro-interactions that enhance user experience without overstimulation.',
      route: 'micro-interactions',
      highlights: ['Subtle animations', 'Magnetic buttons', 'Progress rings', 'Morphing icons'],
      score: 95,
      color: 'text-purple-500'
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Intelligent Analytics',
      description: 'AI-powered insights with real-time user behavior analysis, conversion optimization, and business intelligence.',
      route: 'intelligent-analytics',
      highlights: ['AI insights', 'Real-time data', 'User behavior', 'Conversion opt'],
      score: 89,
      color: 'text-orange-500'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Smart Optimization Engine',
      description: 'Automated performance optimization with actionable recommendations and implementation roadmaps.',
      route: 'optimization-engine',
      highlights: ['Auto optimization', 'Smart recommendations', 'Implementation plans', 'ROI tracking'],
      score: 91,
      color: 'text-yellow-500'
    }
  ];

  const metrics = [
    { label: 'Page Load Time', value: '1.2s', improvement: '+45%', icon: <Clock className="h-4 w-4" /> },
    { label: 'Security Score', value: `${securityScore}%`, improvement: '+12%', icon: <Shield className="h-4 w-4" /> },
    { label: 'User Engagement', value: '94%', improvement: '+28%', icon: <Users className="h-4 w-4" /> },
    { label: 'Conversion Rate', value: '3.4%', improvement: '+18%', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const handleFeatureClick = (route: string) => {
    if (onNavigateToTool) {
      onNavigateToTool(route);
    }
  };

  return (
    <div className="space-y-8 ff-stagger-fade">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
            <Sparkles className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="ff-text-3xl font-bold ff-text-gradient font-sora">
              Performance & Security Suite
            </h1>
            <p className="ff-text-lg text-muted-foreground font-inter">
              Next-generation monitoring, optimization, and user experience enhancements
            </p>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4">
          <Badge 
            variant={isLive ? "default" : "secondary"} 
            className="ff-badge-glow px-4 py-2"
          >
            {isLive ? (
              <>
                <div className="ff-status-dot ff-status-active mr-2"></div>
                Live Demo Active
              </>
            ) : (
              <>
                <div className="ff-status-dot ff-status-offline mr-2"></div>
                Demo Paused
              </>
            )}
          </Badge>
          
          <Button
            onClick={() => setIsLive(!isLive)}
            variant="outline"
            size="sm"
            className="ff-hover-scale"
          >
            {isLive ? 'Pause' : 'Resume'} Demo
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <Card className="ff-card-interactive border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sora">
            <BarChart3 className="h-5 w-5 text-primary" />
            Real-Time Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-4 rounded-lg bg-background/50 ff-hover-lift"
              >
                <div className="flex items-center justify-center mb-2">
                  {metric.icon}
                </div>
                <div className="ff-text-2xl font-bold text-foreground font-sora">
                  {metric.value}
                </div>
                <p className="ff-text-sm text-muted-foreground font-inter">
                  {metric.label}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 ff-text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {metric.improvement}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Showcase */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-muted/30 rounded-lg ${feature.color}`}>
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="ff-text-lg font-sora">
                            {feature.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="ff-text-xs">
                              Score: {feature.score}%
                            </Badge>
                            {feature.score >= 90 && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="ff-text-sm text-muted-foreground font-inter">
                      {feature.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="ff-text-xs text-muted-foreground font-inter">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        onClick={() => handleFeatureClick(feature.route)}
                        size="sm"
                        className="ff-btn-primary ff-hover-glow flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Try Live Demo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ff-hover-scale"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <Alert className="border-blue-500/20 bg-blue-500/5">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <strong>Interactive Demo Mode:</strong> Experience real-time monitoring, 
              security scanning, and optimization recommendations in action.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Performance Monitor Demo */}
            <Card className="ff-card-interactive">
              <CardHeader className="pb-3">
                <CardTitle className="ff-text-base font-sora">Live Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Core Web Vitals</span>
                    <Badge variant="default" className="ff-text-xs">
                      Excellent
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between ff-text-xs">
                      <span>LCP: 1.2s</span>
                      <span className="text-green-500">Good</span>
                    </div>
                    <div className="flex justify-between ff-text-xs">
                      <span>FID: 45ms</span>
                      <span className="text-green-500">Good</span>
                    </div>
                    <div className="flex justify-between ff-text-xs">
                      <span>CLS: 0.08</span>
                      <span className="text-green-500">Good</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFeatureClick('performance-monitor')}
                    size="sm"
                    className="w-full ff-btn-primary"
                  >
                    View Full Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Scanner Demo */}
            <Card className="ff-card-interactive">
              <CardHeader className="pb-3">
                <CardTitle className="ff-text-base font-sora">Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Security Score</span>
                    <Badge variant="default" className="ff-text-xs text-green-600">
                      {securityScore}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between ff-text-xs">
                      <span>Vulnerabilities</span>
                      <span className="text-green-500">0 Critical</span>
                    </div>
                    <div className="flex justify-between ff-text-xs">
                      <span>Compliance</span>
                      <span className="text-green-500">GDPR ✓</span>
                    </div>
                    <div className="flex justify-between ff-text-xs">
                      <span>SSL Status</span>
                      <span className="text-green-500">A+ Grade</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFeatureClick('security-scanner')}
                    size="sm"
                    className="w-full ff-btn-secondary"
                  >
                    Run Security Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Micro-Interactions Demo */}
            <Card className="ff-card-interactive">
              <CardHeader className="pb-3">
                <CardTitle className="ff-text-base font-sora">UI Enhancements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Interaction Quality</span>
                    <Badge variant="default" className="ff-text-xs text-purple-600">
                      Premium
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <Button
                    onClick={() => handleFeatureClick('micro-interactions')}
                    size="sm"
                    className="w-full ff-btn-accent"
                  >
                    Explore Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="font-sora">Technical Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold font-sora">Real-Time Monitoring</h4>
                      <p className="ff-text-sm text-muted-foreground font-inter">
                        WebSockets for live updates, Performance Observer API for metrics
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold font-sora">Security Scanning</h4>
                      <p className="ff-text-sm text-muted-foreground font-inter">
                        OWASP Top 10 checks, CSP validation, dependency vulnerability scanning
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-semibold font-sora">AI Optimization</h4>
                      <p className="ff-text-sm text-muted-foreground font-inter">
                        Machine learning for pattern recognition and predictive analysis
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="font-sora">Implementation Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="ff-text-sm font-semibold font-sora">Performance Gain</span>
                    <span className="ff-text-sm text-green-600 font-sora">+45%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="ff-text-sm font-semibold font-sora">Security Score</span>
                    <span className="ff-text-sm text-green-600 font-sora">+12 points</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="ff-text-sm font-semibold font-sora">User Engagement</span>
                    <span className="ff-text-sm text-green-600 font-sora">+28%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="ff-text-sm font-semibold font-sora">Conversion Rate</span>
                    <span className="ff-text-sm text-green-600 font-sora">+18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="font-sora">Next Steps & Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold font-sora">Phase 1: Monitoring</h4>
                  <ul className="space-y-1 ff-text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-inter">Real-time performance tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="font-inter">Security vulnerability scanning</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold font-sora">Phase 2: Optimization</h4>
                  <ul className="space-y-1 ff-text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span className="font-inter">AI-powered recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span className="font-inter">Automated optimizations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold font-sora">Phase 3: Enhancement</h4>
                  <ul className="space-y-1 ff-text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Settings className="h-3 w-3 text-blue-500" />
                      <span className="font-inter">Premium micro-interactions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-3 w-3 text-blue-500" />
                      <span className="font-inter">Advanced analytics dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="ff-card-interactive border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="ff-text-xl font-bold ff-text-gradient font-sora">
              Ready to Experience the Future of Web Development?
            </h3>
            <p className="ff-text-base text-muted-foreground max-w-2xl mx-auto font-inter">
              Take your applications to the next level with our comprehensive performance monitoring, 
              security scanning, and user experience optimization suite.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => handleFeatureClick('performance-monitor')}
                className="ff-btn-primary ff-hover-glow"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="ff-hover-scale"
              >
                <Download className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSecurityShowcase;