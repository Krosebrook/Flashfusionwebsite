import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { 
  Brain, AlertTriangle, CheckCircle, Info, Zap, 
  Code, Shield, Performance, Accessibility, 
  TrendingUp, Bug, Lightbulb, FileCode
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'info';
  category: 'performance' | 'security' | 'accessibility' | 'best-practices' | 'bugs';
  title: string;
  description: string;
  file: string;
  line: number;
  column?: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  codeSnippet: string;
  fixedCode?: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

interface CodeMetrics {
  overall: number;
  performance: number;
  security: number;
  accessibility: number;
  maintainability: number;
  testCoverage: number;
  complexity: number;
  duplicateCode: number;
}

interface AICodeReviewProps {
  projectId: string;
  files?: string[];
}

export function AICodeReview({ projectId, files = [] }: AICodeReviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);

  useEffect(() => {
    if (projectId) {
      analyzeCode();
    }
  }, [projectId]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI code analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockIssues: CodeIssue[] = [
        {
          id: '1',
          type: 'error',
          category: 'bugs',
          title: 'Potential null pointer exception',
          description: 'Variable "user" may be null when accessing properties',
          file: 'components/UserProfile.tsx',
          line: 45,
          column: 12,
          severity: 'high',
          suggestion: 'Add null check before accessing user properties',
          codeSnippet: `const userName = user.name; // Potential issue
const userEmail = user.email;`,
          fixedCode: `const userName = user?.name || 'Unknown';
const userEmail = user?.email || '';`,
          impact: 'Could cause runtime errors and poor user experience',
          effort: 'low'
        },
        {
          id: '2',
          type: 'warning',
          category: 'performance',
          title: 'Inefficient state update pattern',
          description: 'Multiple setState calls in useEffect could cause unnecessary re-renders',
          file: 'components/Dashboard.tsx',
          line: 28,
          severity: 'medium',
          suggestion: 'Batch state updates or use a reducer for complex state',
          codeSnippet: `useEffect(() => {
  setLoading(true);
  setError(null);
  setData(null);
}, []);`,
          fixedCode: `useEffect(() => {
  setState({
    loading: true,
    error: null,
    data: null
  });
}, []);`,
          impact: 'May cause performance issues with frequent re-renders',
          effort: 'medium'
        },
        {
          id: '3',
          type: 'suggestion',
          category: 'accessibility',
          title: 'Missing ARIA labels',
          description: 'Interactive elements should have descriptive ARIA labels',
          file: 'components/Button.tsx',
          line: 15,
          severity: 'medium',
          suggestion: 'Add aria-label or aria-describedby attributes',
          codeSnippet: `<button onClick={handleClick}>
  <Icon />
</button>`,
          fixedCode: `<button 
  onClick={handleClick}
  aria-label="Save changes"
>
  <Icon />
</button>`,
          impact: 'Reduces accessibility for screen reader users',
          effort: 'low'
        },
        {
          id: '4',
          type: 'info',
          category: 'best-practices',
          title: 'Consider using React.memo',
          description: 'Component re-renders frequently with same props',
          file: 'components/ListItem.tsx',
          line: 8,
          severity: 'low',
          suggestion: 'Wrap component with React.memo to prevent unnecessary re-renders',
          codeSnippet: `export function ListItem({ item }: Props) {
  return <div>{item.name}</div>;
}`,
          fixedCode: `export const ListItem = React.memo(({ item }: Props) => {
  return <div>{item.name}</div>;
});`,
          impact: 'Minor performance improvement in list rendering',
          effort: 'low'
        },
        {
          id: '5',
          type: 'warning',
          category: 'security',
          title: 'Potential XSS vulnerability',
          description: 'Using dangerouslySetInnerHTML without sanitization',
          file: 'components/ContentRenderer.tsx',
          line: 22,
          severity: 'critical',
          suggestion: 'Sanitize HTML content before rendering',
          codeSnippet: `<div dangerouslySetInnerHTML={{ __html: content }} />`,
          fixedCode: `import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(content) 
}} />`,
          impact: 'Critical security vulnerability - could allow XSS attacks',
          effort: 'low'
        }
      ];

      const mockMetrics: CodeMetrics = {
        overall: 78,
        performance: 82,
        security: 65,
        accessibility: 71,
        maintainability: 85,
        testCoverage: 68,
        complexity: 6.2,
        duplicateCode: 12
      };

      setIssues(mockIssues);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return AlertTriangle;
      case 'warning': return Info;
      case 'suggestion': return Lightbulb;
      case 'info': return CheckCircle;
      default: return Info;
    }
  };

  const getIssueColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Performance;
      case 'security': return Shield;
      case 'accessibility': return Accessibility;
      case 'best-practices': return TrendingUp;
      case 'bugs': return Bug;
      default: return Code;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isAnalyzing) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Code Analysis in Progress</h3>
            <p className="text-muted-foreground mb-4">
              Analyzing your code for performance, security, and best practices...
            </p>
            <Progress value={65} className="w-64 mx-auto" />
          </div>
        </div>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getScoreColor(metrics.overall)}`}>
                {metrics.overall}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{issues.length}</p>
              <p className="text-sm text-muted-foreground">Issues Found</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{issues.filter(i => i.effort === 'low').length}</p>
              <p className="text-sm text-muted-foreground">Quick Fixes</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{issues.filter(i => i.category === 'performance').length}</p>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Code Quality Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Performance', value: metrics.performance, icon: Performance },
                  { label: 'Security', value: metrics.security, icon: Shield },
                  { label: 'Accessibility', value: metrics.accessibility, icon: Accessibility },
                  { label: 'Maintainability', value: metrics.maintainability, icon: TrendingUp }
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={metric.value} className="w-20" />
                        <span className={`text-sm font-medium ${getScoreColor(metric.value)}`}>
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Issue Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Issue Categories</h3>
              <div className="space-y-3">
                {['bugs', 'performance', 'security', 'accessibility', 'best-practices'].map(category => {
                  const categoryIssues = issues.filter(i => i.category === category);
                  const Icon = getCategoryIcon(category);
                  return (
                    <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="capitalize">{category.replace('-', ' ')}</span>
                      </div>
                      <Badge variant={categoryIssues.length > 0 ? 'destructive' : 'secondary'}>
                        {categoryIssues.length}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => analyzeCode()}
              className="ff-btn-primary"
            >
              <Brain className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Code Issues</h3>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {issues.map((issue) => {
                    const Icon = getIssueIcon(issue.type);
                    return (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedIssue?.id === issue.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${getIssueColor(issue.severity)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{issue.title}</h4>
                              <Badge 
                                variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {issue.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {issue.file}:{issue.line}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {issue.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>

            {/* Issue Detail */}
            <Card className="p-6">
              {selectedIssue ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{selectedIssue.description}</p>
                    <p className="text-sm"><strong>Impact:</strong> {selectedIssue.impact}</p>
                    <p className="text-sm"><strong>Effort:</strong> {selectedIssue.effort}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Current Code:</h4>
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      className="rounded-lg text-xs"
                    >
                      {selectedIssue.codeSnippet}
                    </SyntaxHighlighter>
                  </div>

                  {selectedIssue.fixedCode && (
                    <div>
                      <h4 className="font-medium mb-2">Suggested Fix:</h4>
                      <SyntaxHighlighter
                        language="typescript"
                        style={vscDarkPlus}
                        className="rounded-lg text-xs"
                      >
                        {selectedIssue.fixedCode}
                      </SyntaxHighlighter>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>AI Suggestion:</strong> {selectedIssue.suggestion}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="ff-btn-primary">
                      Apply Fix
                    </Button>
                    <Button variant="outline" size="sm">
                      Ignore
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an issue to view details and suggestions
                  </p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-medium mb-2">Test Coverage</h4>
              <div className="flex items-center gap-2">
                <Progress value={metrics.testCoverage} className="flex-1" />
                <span className="text-sm font-medium">{metrics.testCoverage}%</span>
              </div>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-medium mb-2">Code Complexity</h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{metrics.complexity}</span>
                <span className="text-sm text-muted-foreground">avg cyclomatic</span>
              </div>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-medium mb-2">Duplicate Code</h4>
              <div className="flex items-center gap-2">
                <Progress value={100 - metrics.duplicateCode} className="flex-1" />
                <span className="text-sm font-medium">{metrics.duplicateCode}%</span>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI-Powered Recommendations
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Implement Error Boundaries',
                  description: 'Add error boundaries to prevent crashes and improve user experience',
                  priority: 'high',
                  impact: 'Improves app stability and user experience'
                },
                {
                  title: 'Add Loading States',
                  description: 'Implement skeleton loaders and loading indicators for better UX',
                  priority: 'medium',
                  impact: 'Better perceived performance'
                },
                {
                  title: 'Optimize Bundle Size',
                  description: 'Use dynamic imports and code splitting to reduce initial bundle size',
                  priority: 'high',
                  impact: 'Faster initial page load'
                },
                {
                  title: 'Add Unit Tests',
                  description: 'Increase test coverage for critical components and functions',
                  priority: 'medium',
                  impact: 'Reduces bugs and improves maintainability'
                }
              ].map((suggestion, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                  <p className="text-sm"><strong>Impact:</strong> {suggestion.impact}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}