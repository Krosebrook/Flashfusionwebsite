/**
 * @fileoverview Repository Debug & Refactor System for FlashFusion
 * @chunk repository
 * @category debug
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Advanced debugging, refactoring, and code analysis tools
 * for repository management and optimization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ProfessionalIcon } from '../ui/professional-icon-system';
import {
  Terminal,
  Bug,
  Code,
  FileCode,
  Settings,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  Play,
  Pause,
  Stop,
  Zap,
  Activity,
  BarChart3,
  Monitor,
  Shield,
  Key,
  Lock,
  Unlock,
  Database,
  Server,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Package,
  Tag,
  Users,
  Bell,
  Mail,
  Phone,
  Home,
  Building,
  Briefcase,
  Github,
  GitBranch,
  GitCommit,
  Workflow,
  Layers,
  Box,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Warning,
  Target,
  Crosshair,
  Wrench,
  Microscope,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCheck,
  Clock4,
  FileText,
  FolderOpen,
  Command
} from 'lucide-react';

// Debug Types
interface DebugSession {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  issues: DebugIssue[];
  metrics: PerformanceMetrics;
  logs: LogEntry[];
}

interface DebugIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'syntax' | 'performance' | 'security' | 'style' | 'dependency' | 'accessibility';
  title: string;
  description: string;
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  suggestion?: string;
  autoFixable: boolean;
  fixed: boolean;
}

interface PerformanceMetrics {
  bundleSize: {
    total: number;
    javascript: number;
    css: number;
    images: number;
    other: number;
  };
  loadTime: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
  complexity: {
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    maintainabilityIndex: number;
    technicalDebt: number;
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
    unused: number;
  };
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  details?: any;
}

interface RefactorSuggestion {
  id: string;
  type: 'extract-component' | 'optimize-performance' | 'improve-readability' | 'reduce-complexity' | 'update-dependency';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  benefits: string[];
  risks: string[];
  preview?: string;
}

export function RepositoryDebugSystem() {
  const [debugSessions, setDebugSessions] = useState<DebugSession[]>([]);
  const [refactorSuggestions, setRefactorSuggestions] = useState<RefactorSuggestion[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock debug data
  useEffect(() => {
    const mockSessions: DebugSession[] = [
      {
        id: 'session-1',
        name: 'FlashFusion App Analysis',
        repository: 'flashfusion-app',
        branch: 'main',
        status: 'completed',
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 1800000),
        issues: [
          {
            id: 'issue-1',
            severity: 'high',
            category: 'performance',
            title: 'Large bundle size detected',
            description: 'Bundle size exceeds recommended threshold of 250KB',
            file: 'src/components/Dashboard.tsx',
            line: 45,
            rule: 'bundle-size-analyzer',
            suggestion: 'Consider code splitting and lazy loading',
            autoFixable: false,
            fixed: false
          },
          {
            id: 'issue-2',
            severity: 'medium',
            category: 'accessibility',
            title: 'Missing alt text for images',
            description: 'Images should have descriptive alt text for screen readers',
            file: 'src/components/ImageGallery.tsx',
            line: 23,
            rule: 'img-redundant-alt',
            suggestion: 'Add meaningful alt attribute to img elements',
            autoFixable: true,
            fixed: false
          },
          {
            id: 'issue-3',
            severity: 'critical',
            category: 'security',
            title: 'Vulnerable dependency detected',
            description: 'lodash version 4.17.20 has known security vulnerabilities',
            file: 'package.json',
            line: 23,
            rule: 'audit',
            suggestion: 'Update lodash to version 4.17.21 or higher',
            autoFixable: true,
            fixed: false
          }
        ],
        metrics: {
          bundleSize: {
            total: 487.3,
            javascript: 245.8,
            css: 89.2,
            images: 134.7,
            other: 17.6
          },
          loadTime: {
            firstContentfulPaint: 1.2,
            largestContentfulPaint: 2.8,
            cumulativeLayoutShift: 0.15,
            firstInputDelay: 45
          },
          complexity: {
            cyclomaticComplexity: 8.4,
            cognitiveComplexity: 12.7,
            maintainabilityIndex: 73.2,
            technicalDebt: 2.3
          },
          dependencies: {
            total: 847,
            outdated: 23,
            vulnerable: 3,
            unused: 12
          }
        },
        logs: [
          {
            id: 'log-1',
            timestamp: new Date(Date.now() - 3000000),
            level: 'info',
            source: 'analyzer',
            message: 'Starting code analysis...',
            details: { repository: 'flashfusion-app', branch: 'main' }
          },
          {
            id: 'log-2',
            timestamp: new Date(Date.now() - 2800000),
            level: 'warn',
            source: 'security-scanner',
            message: 'Found 3 vulnerable dependencies',
            details: { vulnerabilities: ['lodash', 'minimist', 'acorn'] }
          },
          {
            id: 'log-3',
            timestamp: new Date(Date.now() - 2600000),
            level: 'error',
            source: 'performance-analyzer',
            message: 'Bundle size exceeds threshold',
            details: { size: '487.3KB', threshold: '250KB' }
          }
        ]
      }
    ];

    const mockRefactorSuggestions: RefactorSuggestion[] = [
      {
        id: 'refactor-1',
        type: 'extract-component',
        priority: 'high',
        title: 'Extract reusable Dashboard Card component',
        description: 'Multiple components use similar card patterns that could be extracted into a reusable component',
        file: 'src/components/Dashboard.tsx',
        impact: 'Reduces code duplication by ~200 lines',
        effort: 'medium',
        benefits: ['Improved maintainability', 'Consistent UI', 'Easier testing'],
        risks: ['Breaking changes if not done carefully'],
        preview: `export function DashboardCard({ title, children, actions }) {
  return (
    <Card className="ff-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}`
      },
      {
        id: 'refactor-2',
        type: 'optimize-performance',
        priority: 'high',
        title: 'Implement lazy loading for heavy components',
        description: 'Several components are loading eagerly when they could be lazy loaded',
        file: 'src/App.tsx',
        impact: 'Reduces initial bundle size by ~150KB',
        effort: 'low',
        benefits: ['Faster initial load', 'Better Core Web Vitals', 'Improved UX'],
        risks: ['Potential loading states to handle'],
        preview: `const Dashboard = lazy(() => import('./components/Dashboard'));
const Analytics = lazy(() => import('./components/Analytics'));`
      },
      {
        id: 'refactor-3',
        type: 'update-dependency',
        priority: 'medium',
        title: 'Migrate from React 17 to React 18',
        description: 'Upgrade to React 18 for improved performance and new features',
        file: 'package.json',
        impact: 'Access to concurrent features and automatic batching',
        effort: 'high',
        benefits: ['Better performance', 'New concurrent features', 'Future-proofing'],
        risks: ['Potential breaking changes', 'Extensive testing required']
      }
    ];

    setDebugSessions(mockSessions);
    setRefactorSuggestions(mockRefactorSuggestions);
  }, []);

  const currentSession = selectedSession ? debugSessions.find(s => s.id === selectedSession) : null;

  const filteredIssues = currentSession?.issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    return matchesSearch && matchesSeverity && matchesCategory;
  }) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error border-error/20 bg-error/10';
      case 'high': return 'text-warning border-warning/20 bg-warning/10';
      case 'medium': return 'text-info border-info/20 bg-info/10';
      case 'low': return 'text-success border-success/20 bg-success/10';
      case 'info': return 'text-muted border-muted/20 bg-muted/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'high': return XCircle;
      case 'medium': return AlertCircle;
      case 'low': return Info;
      case 'info': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Gauge;
      case 'security': return Shield;
      case 'accessibility': return Users;
      case 'style': return Eye;
      case 'dependency': return Package;
      case 'syntax': return Code;
      default: return Bug;
    }
  };

  const handleStartDebugSession = async () => {
    setIsRunning(true);
    // Simulate debug session
    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
  };

  const handleAutoFix = async (issueId: string) => {
    setDebugSessions(prev => prev.map(session => ({
      ...session,
      issues: session.issues.map(issue => 
        issue.id === issueId ? { ...issue, fixed: true } : issue
      )
    })));
  };

  const handleApplyRefactor = async (suggestionId: string) => {
    console.log(`Applying refactor suggestion: ${suggestionId}`);
    // Implement refactor application logic
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Responsive Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-2">
              <h1 className="ff-text-display text-2xl sm:text-3xl lg:text-4xl">
                Repository Debug & Refactor
              </h1>
              <p className="ff-text-body text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                Advanced code analysis, debugging, and automated refactoring
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleStartDebugSession}
                disabled={isRunning}
                className="ff-btn-primary w-full sm:w-auto"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span className="sm:hidden">Analyzing...</span>
                    <span className="hidden sm:inline">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    <span className="sm:hidden">Analyze</span>
                    <span className="hidden sm:inline">Start Analysis</span>
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Config</span>
                <span className="hidden sm:inline">Configure</span>
              </Button>
            </div>
          </div>

          {/* Responsive Debug Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="ff-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="ff-text-caption text-muted-foreground text-xs sm:text-sm truncate">Sessions</p>
                    <p className="ff-text-title text-lg sm:text-2xl font-bold">{debugSessions.length}</p>
                  </div>
                  <ProfessionalIcon 
                    icon={Terminal} 
                    size="md" 
                    variant="functional" 
                    context="primary"
                    className="hidden sm:block"
                  />
                </div>
              </CardContent>
            </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Total Issues</p>
                  <p className="ff-text-title text-2xl font-bold">
                    {debugSessions.reduce((sum, session) => sum + session.issues.length, 0)}
                  </p>
                </div>
                <ProfessionalIcon 
                  icon={Bug} 
                  size="lg" 
                  variant="functional" 
                  context="warning" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Auto-Fixable</p>
                  <p className="ff-text-title text-2xl font-bold">
                    {debugSessions.reduce((sum, session) => 
                      sum + session.issues.filter(i => i.autoFixable && !i.fixed).length, 0
                    )}
                  </p>
                </div>
                <ProfessionalIcon 
                  icon={Wrench} 
                  size="lg" 
                  variant="functional" 
                  context="success" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="ff-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ff-text-caption text-muted-foreground">Refactor Suggestions</p>
                  <p className="ff-text-title text-2xl font-bold">{refactorSuggestions.length}</p>
                </div>
                <ProfessionalIcon 
                  icon={TrendingUp} 
                  size="lg" 
                  variant="functional" 
                  context="accent" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="sessions" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                <span className="sm:hidden">Sessions</span>
                <span className="hidden sm:inline">Debug Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                Issues
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                Metrics
              </TabsTrigger>
              <TabsTrigger value="refactor" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
                Refactor
              </TabsTrigger>
            </TabsList>

          {/* Debug Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {debugSessions.map((session) => {
                const criticalIssues = session.issues.filter(i => i.severity === 'critical').length;
                const highIssues = session.issues.filter(i => i.severity === 'high').length;
                
                return (
                  <Card 
                    key={session.id} 
                    className={`ff-card-interactive ${selectedSession === session.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="ff-text-title text-lg">{session.name}</CardTitle>
                          <p className="ff-text-caption text-muted-foreground">
                            {session.repository} • {session.branch}
                          </p>
                        </div>
                        
                        <Badge className={
                          session.status === 'completed' ? 'text-success border-success/20 bg-success/10' :
                          session.status === 'running' ? 'text-warning border-warning/20 bg-warning/10' :
                          session.status === 'failed' ? 'text-error border-error/20 bg-error/10' :
                          'text-muted border-muted/20 bg-muted/10'
                        }>
                          {session.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Total Issues</p>
                          <p className="ff-text-body font-semibold">{session.issues.length}</p>
                        </div>
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Critical</p>
                          <p className="ff-text-body font-semibold text-error">{criticalIssues}</p>
                        </div>
                        <div>
                          <p className="ff-text-caption text-muted-foreground">High</p>
                          <p className="ff-text-body font-semibold text-warning">{highIssues}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="ff-text-caption text-muted-foreground">Started</p>
                          <p className="ff-text-body">{session.startTime.toLocaleString()}</p>
                        </div>
                        {session.endTime && (
                          <div>
                            <p className="ff-text-caption text-muted-foreground">Duration</p>
                            <p className="ff-text-body">
                              {Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)}m
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                        
                        {session.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Re-run
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            {currentSession ? (
              <>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search issues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-md text-sm"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="info">Info</option>
                  </select>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                    <option value="accessibility">Accessibility</option>
                    <option value="style">Style</option>
                  </select>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                  {filteredIssues.map((issue) => {
                    const SeverityIcon = getSeverityIcon(issue.severity);
                    const CategoryIcon = getCategoryIcon(issue.category);
                    
                    return (
                      <Card key={issue.id} className="ff-card">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex items-center gap-2 mt-1">
                                <SeverityIcon className="w-5 h-5" />
                                <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="ff-text-title text-lg">{issue.title}</h3>
                                  <Badge className={getSeverityColor(issue.severity)}>
                                    {issue.severity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {issue.category}
                                  </Badge>
                                  {issue.fixed && (
                                    <Badge className="text-success border-success/20 bg-success/10">
                                      <CheckCheck className="w-3 h-3 mr-1" />
                                      Fixed
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="ff-text-body text-muted-foreground mb-3">
                                  {issue.description}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                  <div>
                                    <p className="ff-text-caption text-muted-foreground">File</p>
                                    <p className="ff-text-body font-mono text-xs">{issue.file}</p>
                                  </div>
                                  {issue.line && (
                                    <div>
                                      <p className="ff-text-caption text-muted-foreground">Line</p>
                                      <p className="ff-text-body">{issue.line}</p>
                                    </div>
                                  )}
                                  {issue.rule && (
                                    <div>
                                      <p className="ff-text-caption text-muted-foreground">Rule</p>
                                      <p className="ff-text-body">{issue.rule}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="ff-text-caption text-muted-foreground">Auto-Fix</p>
                                    <p className="ff-text-body">
                                      {issue.autoFixable ? 'Available' : 'Manual'}
                                    </p>
                                  </div>
                                </div>
                                
                                {issue.suggestion && (
                                  <div className="bg-muted/20 border border-muted/20 rounded-lg p-3">
                                    <p className="ff-text-caption font-medium mb-1">Suggestion:</p>
                                    <p className="ff-text-caption text-muted-foreground">{issue.suggestion}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {issue.autoFixable && !issue.fixed && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAutoFix(issue.id)}
                                >
                                  <Wrench className="w-3 h-3 mr-1" />
                                  Auto Fix
                                </Button>
                              )}
                              
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3 mr-1" />
                                View Code
                              </Button>
                              
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <Card className="ff-card text-center py-12">
                <CardContent>
                  <Bug className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="ff-text-title text-xl mb-2">Select a Debug Session</h3>
                  <p className="ff-text-body text-muted-foreground">
                    Choose a debug session from the Sessions tab to view its issues.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            {currentSession ? (
              <MetricsPanel metrics={currentSession.metrics} />
            ) : (
              <Card className="ff-card text-center py-12">
                <CardContent>
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="ff-text-title text-xl mb-2">Select a Debug Session</h3>
                  <p className="ff-text-body text-muted-foreground">
                    Choose a debug session to view its performance metrics.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Refactor Tab */}
          <TabsContent value="refactor" className="space-y-6">
            <RefactorPanel 
              suggestions={refactorSuggestions}
              onApply={handleApplyRefactor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Metrics Panel Component
interface MetricsPanelProps {
  metrics: PerformanceMetrics;
}

function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Bundle Size */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">Bundle Size Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="ff-text-title text-2xl font-bold">{metrics.bundleSize.total}KB</p>
              <p className="ff-text-caption text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold">{metrics.bundleSize.javascript}KB</p>
              <p className="ff-text-caption text-muted-foreground">JavaScript</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold">{metrics.bundleSize.css}KB</p>
              <p className="ff-text-caption text-muted-foreground">CSS</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold">{metrics.bundleSize.images}KB</p>
              <p className="ff-text-caption text-muted-foreground">Images</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold">{metrics.bundleSize.other}KB</p>
              <p className="ff-text-caption text-muted-foreground">Other</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="ff-text-body">First Contentful Paint</span>
              <Badge className={metrics.loadTime.firstContentfulPaint <= 1.8 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.loadTime.firstContentfulPaint}s
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Largest Contentful Paint</span>
              <Badge className={metrics.loadTime.largestContentfulPaint <= 2.5 ? 'text-success border-success/20 bg-success/10' : 'text-error border-error/20 bg-error/10'}>
                {metrics.loadTime.largestContentfulPaint}s
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Cumulative Layout Shift</span>
              <Badge className={metrics.loadTime.cumulativeLayoutShift <= 0.1 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.loadTime.cumulativeLayoutShift}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">First Input Delay</span>
              <Badge className={metrics.loadTime.firstInputDelay <= 100 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.loadTime.firstInputDelay}ms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">Code Complexity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Cyclomatic Complexity</span>
              <Badge className={metrics.complexity.cyclomaticComplexity <= 10 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.complexity.cyclomaticComplexity}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Cognitive Complexity</span>
              <Badge className={metrics.complexity.cognitiveComplexity <= 15 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.complexity.cognitiveComplexity}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Maintainability Index</span>
              <Badge className={metrics.complexity.maintainabilityIndex >= 70 ? 'text-success border-success/20 bg-success/10' : 'text-warning border-warning/20 bg-warning/10'}>
                {metrics.complexity.maintainabilityIndex}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="ff-text-body">Technical Debt (hours)</span>
              <Badge className={metrics.complexity.technicalDebt <= 5 ? 'text-success border-success/20 bg-success/10' : 'text-error border-error/20 bg-error/10'}>
                {metrics.complexity.technicalDebt}h
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dependencies */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">Dependencies Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="ff-text-title text-2xl font-bold">{metrics.dependencies.total}</p>
              <p className="ff-text-caption text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold text-warning">{metrics.dependencies.outdated}</p>
              <p className="ff-text-caption text-muted-foreground">Outdated</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold text-error">{metrics.dependencies.vulnerable}</p>
              <p className="ff-text-caption text-muted-foreground">Vulnerable</p>
            </div>
            <div className="text-center">
              <p className="ff-text-title text-xl font-bold text-info">{metrics.dependencies.unused}</p>
              <p className="ff-text-caption text-muted-foreground">Unused</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Refactor Panel Component
interface RefactorPanelProps {
  suggestions: RefactorSuggestion[];
  onApply: (suggestionId: string) => void;
}

function RefactorPanel({ suggestions, onApply }: RefactorPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error border-error/20 bg-error/10';
      case 'medium': return 'text-warning border-warning/20 bg-warning/10';
      case 'low': return 'text-success border-success/20 bg-success/10';
      default: return 'text-muted border-muted/20 bg-muted/10';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="ff-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="ff-text-title text-lg">{suggestion.title}</CardTitle>
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority} priority
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {suggestion.type.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="ff-text-body text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="ff-text-caption text-muted-foreground">File</p>
                <p className="ff-text-body font-mono text-xs">{suggestion.file}</p>
              </div>
              <div>
                <p className="ff-text-caption text-muted-foreground">Effort</p>
                <p className={`ff-text-body capitalize ${getEffortColor(suggestion.effort)}`}>
                  {suggestion.effort}
                </p>
              </div>
              <div>
                <p className="ff-text-caption text-muted-foreground">Impact</p>
                <p className="ff-text-body">{suggestion.impact}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="ff-text-caption font-medium mb-2">Benefits:</p>
                <ul className="space-y-1">
                  {suggestion.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span className="ff-text-caption text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="ff-text-caption font-medium mb-2">Risks:</p>
                <ul className="space-y-1">
                  {suggestion.risks.map((risk, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-3 h-3 text-warning" />
                      <span className="ff-text-caption text-muted-foreground">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {suggestion.preview && (
              <div>
                <p className="ff-text-caption font-medium mb-2">Preview:</p>
                <div className="bg-muted border border-muted/20 rounded-lg p-3">
                  <pre className="ff-text-caption font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                    {suggestion.preview}
                  </pre>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApply(suggestion.id)}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Apply Refactor
                </Button>
                
                <Button variant="outline" size="sm">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview Changes
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}