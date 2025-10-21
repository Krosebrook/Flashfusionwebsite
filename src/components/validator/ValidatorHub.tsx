import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Activity,
  Database,
  Users,
  Brain,
  RefreshCw,
  Plug,
  Eye,
  GitBranch,
  Smartphone,
  Globe,
  Key,
  Lock,
  UserCheck,
  Zap,
  TrendingUp,
  AlertCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock,
  Target,
  Award,
  FileCheck,
  Layers,
  Network,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValidationResult {
  id: string;
  category: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'running';
  score: number;
  lastCheck: string;
  details: string;
  critical: boolean;
}

interface ValidationCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  results: ValidationResult[];
  overallScore: number;
  critical: number;
  warnings: number;
  passed: number;
}

export function ValidatorHub() {
  const [isRunningFullScan, setIsRunningFullScan] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState<ValidationCategory[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    overall: 87,
    uptime: '99.8%',
    lastIncident: '3 days ago',
    activeIssues: 2
  });

  // Initialize validation categories
  useEffect(() => {
    const initialCategories: ValidationCategory[] = [
      {
        id: 'cross-app',
        name: 'Cross-App Interoperability',
        icon: Database,
        description: 'Data consistency and schema validation across all tools',
        overallScore: 85,
        critical: 0,
        warnings: 2,
        passed: 8,
        results: [
          {
            id: 'schema-sync',
            category: 'cross-app',
            name: 'Schema Synchronization',
            status: 'passed',
            score: 95,
            lastCheck: '2 minutes ago',
            details: 'All database schemas are synchronized across 12 applications',
            critical: false
          },
          {
            id: 'data-integrity',
            category: 'cross-app',
            name: 'Data Integrity Check',
            status: 'warning',
            score: 78,
            lastCheck: '5 minutes ago',
            details: 'Minor inconsistencies found in user preferences across Creator Suite',
            critical: false
          },
          {
            id: 'api-compatibility',
            category: 'cross-app',
            name: 'API Compatibility',
            status: 'passed',
            score: 92,
            lastCheck: '1 minute ago',
            details: 'All internal APIs are compatible and responding correctly',
            critical: false
          }
        ]
      },
      {
        id: 'security',
        name: 'Security & Compliance',
        icon: Shield,
        description: 'Encryption, authentication, and compliance validation',
        overallScore: 92,
        critical: 0,
        warnings: 1,
        passed: 9,
        results: [
          {
            id: 'encryption',
            category: 'security',
            name: 'Data Encryption',
            status: 'passed',
            score: 98,
            lastCheck: '30 seconds ago',
            details: 'All sensitive data encrypted with AES-256, keys rotated regularly',
            critical: true
          },
          {
            id: 'auth-flows',
            category: 'security',
            name: 'Authentication Flows',
            status: 'passed',
            score: 94,
            lastCheck: '1 minute ago',
            details: 'OAuth2, Supabase Auth, and MFA working correctly',
            critical: true
          },
          {
            id: 'gdpr-compliance',
            category: 'security',
            name: 'GDPR Compliance',
            status: 'warning',
            score: 88,
            lastCheck: '10 minutes ago',
            details: 'Data deletion workflows need optimization for faster processing',
            critical: false
          }
        ]
      },
      {
        id: 'collaboration',
        name: 'Collaboration Layer',
        icon: Users,
        description: 'Real-time collaboration and permissions validation',
        overallScore: 76,
        critical: 1,
        warnings: 3,
        passed: 6,
        results: [
          {
            id: 'realtime-sync',
            category: 'collaboration',
            name: 'Real-time Synchronization',
            status: 'failed',
            score: 45,
            lastCheck: '2 minutes ago',
            details: 'CRDT implementation needs optimization for large documents',
            critical: true
          },
          {
            id: 'permissions',
            category: 'collaboration',
            name: 'Role-based Permissions',
            status: 'warning',
            score: 82,
            lastCheck: '5 minutes ago',
            details: 'Some edge cases in permission inheritance need addressing',
            critical: false
          }
        ]
      },
      {
        id: 'ai',
        name: 'AI Augmentation',
        icon: Brain,
        description: 'AI service reliability and output quality validation',
        overallScore: 89,
        critical: 0,
        warnings: 2,
        passed: 12,
        results: [
          {
            id: 'ai-service-health',
            category: 'ai',
            name: 'AI Service Health',
            status: 'passed',
            score: 94,
            lastCheck: '1 minute ago',
            details: 'All AI services responding within acceptable latency limits',
            critical: true
          },
          {
            id: 'output-quality',
            category: 'ai',
            name: 'Output Quality Metrics',
            status: 'warning',
            score: 84,
            lastCheck: '3 minutes ago',
            details: 'Content generation quality scores below target in 2 categories',
            critical: false
          }
        ]
      },
      {
        id: 'sync',
        name: 'Offline-Cloud Sync',
        icon: RefreshCw,
        description: 'Data synchronization and conflict resolution validation',
        overallScore: 81,
        critical: 0,
        warnings: 3,
        passed: 7,
        results: [
          {
            id: 'sync-integrity',
            category: 'sync',
            name: 'Sync Integrity',
            status: 'passed',
            score: 88,
            lastCheck: '2 minutes ago',
            details: 'No data corruption detected in sync operations',
            critical: true
          },
          {
            id: 'conflict-resolution',
            category: 'sync',
            name: 'Conflict Resolution',
            status: 'warning',
            score: 75,
            lastCheck: '4 minutes ago',
            details: 'Merge strategies need improvement for concurrent edits',
            critical: false
          }
        ]
      },
      {
        id: 'plugins',
        name: 'Plugin Security',
        icon: Plug,
        description: 'Third-party integration security and compatibility',
        overallScore: 79,
        critical: 0,
        warnings: 4,
        passed: 8,
        results: [
          {
            id: 'plugin-sandbox',
            category: 'plugins',
            name: 'Plugin Sandboxing',
            status: 'passed',
            score: 91,
            lastCheck: '5 minutes ago',
            details: 'All plugins running in secure isolated environments',
            critical: true
          },
          {
            id: 'api-quotas',
            category: 'plugins',
            name: 'API Rate Limiting',
            status: 'warning',
            score: 73,
            lastCheck: '8 minutes ago',
            details: 'Some third-party APIs approaching rate limits',
            critical: false
          }
        ]
      },
      {
        id: 'observability',
        name: 'System Observability',
        icon: Eye,
        description: 'Monitoring, logging, and error tracking validation',
        overallScore: 93,
        critical: 0,
        warnings: 1,
        passed: 11,
        results: [
          {
            id: 'error-tracking',
            category: 'observability',
            name: 'Error Tracking',
            status: 'passed',
            score: 96,
            lastCheck: '30 seconds ago',
            details: 'All errors being captured and categorized correctly',
            critical: true
          },
          {
            id: 'performance-metrics',
            category: 'observability',
            name: 'Performance Metrics',
            status: 'passed',
            score: 91,
            lastCheck: '1 minute ago',
            details: 'All performance indicators within acceptable ranges',
            critical: false
          }
        ]
      },
      {
        id: 'cicd',
        name: 'CI/CD Pipeline',
        icon: GitBranch,
        description: 'Build, test, and deployment pipeline validation',
        overallScore: 88,
        critical: 0,
        warnings: 2,
        passed: 10,
        results: [
          {
            id: 'build-health',
            category: 'cicd',
            name: 'Build Pipeline Health',
            status: 'passed',
            score: 92,
            lastCheck: '15 minutes ago',
            details: 'All builds passing, deployment times within targets',
            critical: true
          },
          {
            id: 'test-coverage',
            category: 'cicd',
            name: 'Test Coverage',
            status: 'warning',
            score: 84,
            lastCheck: '20 minutes ago',
            details: 'Test coverage at 84%, target is 90%',
            critical: false
          }
        ]
      },
      {
        id: 'mobile',
        name: 'Mobile Compatibility',
        icon: Smartphone,
        description: 'Cross-platform mobile validation and optimization',
        overallScore: 77,
        critical: 1,
        warnings: 3,
        passed: 6,
        results: [
          {
            id: 'responsive-design',
            category: 'mobile',
            name: 'Responsive Design',
            status: 'passed',
            score: 89,
            lastCheck: '10 minutes ago',
            details: 'All breakpoints working correctly across devices',
            critical: false
          },
          {
            id: 'offline-functionality',
            category: 'mobile',
            name: 'Offline Functionality',
            status: 'failed',
            score: 52,
            lastCheck: '12 minutes ago',
            details: 'Service worker needs updates for better offline support',
            critical: true
          }
        ]
      },
      {
        id: 'ecosystem',
        name: 'Ecosystem Features',
        icon: Globe,
        description: 'Cross-system features and global functionality validation',
        overallScore: 74,
        critical: 0,
        warnings: 5,
        passed: 7,
        results: [
          {
            id: 'global-search',
            category: 'ecosystem',
            name: 'Global Search',
            status: 'warning',
            score: 76,
            lastCheck: '6 minutes ago',
            details: 'Search indexing needs optimization for better performance',
            critical: false
          },
          {
            id: 'notification-center',
            category: 'ecosystem',
            name: 'Notification Center',
            status: 'passed',
            score: 85,
            lastCheck: '3 minutes ago',
            details: 'All notification channels working correctly',
            critical: false
          }
        ]
      }
    ];

    setCategories(initialCategories);
  }, []);

  const runFullScan = async () => {
    setIsRunningFullScan(true);
    setScanProgress(0);

    // Simulate comprehensive scanning
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setScanProgress(i);
    }

    // Update some results after scan
    setCategories(prev => prev.map(category => ({
      ...category,
      results: category.results.map(result => ({
        ...result,
        lastCheck: 'just now',
        score: Math.min(100, result.score + Math.floor(Math.random() * 10) - 5)
      }))
    })));

    setIsRunningFullScan(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const overallSystemScore = categories.reduce((sum, cat) => sum + cat.overallScore, 0) / categories.length;
  const totalCritical = categories.reduce((sum, cat) => sum + cat.critical, 0);
  const totalWarnings = categories.reduce((sum, cat) => sum + cat.warnings, 0);
  const totalPassed = categories.reduce((sum, cat) => sum + cat.passed, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Shield className="w-10 h-10 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold ff-text-gradient">The Validator</h1>
              <p className="text-sm text-muted-foreground font-medium">Check anything, trust everything. 🔑</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Universal trust and validation system ensuring quality, security, and reliability across the entire FlashFusion ecosystem. Your single source of truth for system integrity.
          </p>
        </motion.div>

        {/* System Health Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          <Card className="ff-card-interactive col-span-1 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getScoreColor(overallSystemScore)}`}>
                      {Math.round(overallSystemScore)}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary" 
                       style={{ 
                         background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${overallSystemScore * 3.6}deg, transparent ${overallSystemScore * 3.6}deg)`
                       }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">System Health Score</h3>
                  <p className="text-sm text-muted-foreground">Overall validation status</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {systemHealth.uptime} uptime
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-500">{totalCritical}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="mt-2">
                <Badge variant={totalCritical === 0 ? "outline" : "destructive"}>
                  {totalCritical === 0 ? 'All Clear' : 'Action Required'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-500">{totalWarnings}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  Monitor Closely
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Checks</p>
                  <p className="text-2xl font-bold text-green-500">{totalPassed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Operating Normal
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <Button 
            onClick={runFullScan} 
            disabled={isRunningFullScan}
            className="ff-btn-primary"
            size="lg"
          >
            {isRunningFullScan ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Scanning... {scanProgress}%
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Full System Scan
              </>
            )}
          </Button>

          <Button variant="outline" size="lg">
            <Target className="w-5 h-5 mr-2" />
            Focus Mode
          </Button>

          <Button variant="outline" size="lg">
            <Settings className="w-5 h-5 mr-2" />
            Validation Settings
          </Button>

          <Button variant="outline" size="lg">
            <FileCheck className="w-5 h-5 mr-2" />
            Generate Report
          </Button>
        </motion.div>

        {/* Scanning Progress */}
        <AnimatePresence>
          {isRunningFullScan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-primary animate-pulse" />
                      <span className="font-medium">Running Comprehensive System Validation</span>
                    </div>
                    <Progress value={scanProgress} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Scanning {Math.floor(scanProgress / 10) + 1} of 10 validation categories...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="critical">Critical Issues</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive group h-full">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <category.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-primary transition-colors">
                                {category.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Overall Score</span>
                            <span className={`font-bold ${getScoreColor(category.overallScore)}`}>
                              {category.overallScore}
                            </span>
                          </div>
                          <Progress value={category.overallScore} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{category.passed} passed</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-3 h-3 text-yellow-500" />
                              <span>{category.warnings} warnings</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span>{category.critical} critical</span>
                            </div>
                          </div>
                        </div>

                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <category.icon className="w-6 h-6 text-primary" />
                        <span>{category.name}</span>
                        <Badge variant={category.critical > 0 ? "destructive" : category.warnings > 0 ? "secondary" : "outline"}>
                          Score: {category.overallScore}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.results.map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <p className="font-medium">{result.name}</p>
                                <p className="text-sm text-muted-foreground">{result.details}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${getScoreColor(result.score)}`}>
                                {result.score}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {result.lastCheck}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Critical Issues Tab */}
            <TabsContent value="critical" className="space-y-6">
              <div className="space-y-4">
                {categories.flatMap(category => 
                  category.results.filter(result => result.critical && result.status === 'failed')
                ).map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-red-500/20 bg-red-500/5">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-500">{result.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                              <div className="flex items-center space-x-4 mt-3 text-sm">
                                <span className="text-muted-foreground">Score: {result.score}</span>
                                <span className="text-muted-foreground">Last checked: {result.lastCheck}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Recheck
                            </Button>
                            <Button size="sm" className="ff-btn-primary">
                              <Zap className="w-3 h-3 mr-1" />
                              Fix Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {categories.every(category => category.results.every(result => !result.critical || result.status !== 'failed')) && (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Critical Issues Found</h3>
                    <p className="text-muted-foreground">All critical systems are operating normally</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Health Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <div className="text-center space-y-2">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Health trend visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Issue Resolution Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <div className="text-center space-y-2">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Resolution rate metrics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h4 className="font-medium">System validation complete</h4>
              <p className="text-sm text-muted-foreground">
                Trust level: {overallSystemScore >= 90 ? 'High' : overallSystemScore >= 80 ? 'Good' : 'Needs Attention'} • 
                Next scheduled scan in 1 hour
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Monitor className="w-4 h-4 mr-2" />
                View Monitoring
              </Button>
              <Button className="ff-btn-primary">
                <Shield className="w-4 h-4 mr-2" />
                Configure Alerts
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}