/**
 * @fileoverview Smart Code Review AI Tool
 * @chunk tools
 * @category analysis
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * FLASHFUSION - SMART CODE REVIEW AI
 * 
 * Advanced AI-powered code analysis tool that provides comprehensive
 * code review, security scanning, performance optimization suggestions,
 * and best practice recommendations based on current industry standards.
 * 
 * Features:
 * - Multi-language code analysis
 * - Security vulnerability detection
 * - Performance optimization suggestions
 * - Code quality metrics
 * - Best practice recommendations
 * - Automated fix suggestions
 * - Team standards enforcement
 * - Learning mode for beginners
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { 
  Shield, 
  Zap, 
  BookOpen, 
  Bug, 
  AlertTriangle, 
  CheckCircle,
  FileCode,
  Target,
  TrendingUp,
  Users,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Copy,
  Star,
  Clock,
  BarChart3,
  Lightbulb,
  Settings,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Code Review Result Interface
 */
interface CodeReviewResult {
  overall_score: number;
  security_issues: SecurityIssue[];
  performance_issues: PerformanceIssue[];
  quality_issues: QualityIssue[];
  best_practices: BestPracticeIssue[];
  suggestions: AutoFixSuggestion[];
  metrics: CodeMetrics;
  learning_points: LearningPoint[];
}

interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  line: number;
  description: string;
  fix_suggestion: string;
  cwe_id?: string;
  references: string[];
}

interface PerformanceIssue {
  id: string;
  impact: 'high' | 'medium' | 'low';
  type: string;
  line: number;
  description: string;
  suggestion: string;
  estimated_improvement: string;
}

interface QualityIssue {
  id: string;
  category: 'maintainability' | 'readability' | 'complexity' | 'duplication';
  severity: 'error' | 'warning' | 'info';
  line: number;
  description: string;
  suggestion: string;
}

interface BestPracticeIssue {
  id: string;
  practice: string;
  description: string;
  line?: number;
  recommendation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface AutoFixSuggestion {
  id: string;
  type: 'security' | 'performance' | 'quality';
  description: string;
  before: string;
  after: string;
  confidence: number;
}

interface CodeMetrics {
  lines_of_code: number;
  cyclomatic_complexity: number;
  maintainability_index: number;
  test_coverage: number;
  code_duplication: number;
  technical_debt: string;
}

interface LearningPoint {
  concept: string;
  explanation: string;
  resources: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C#', icon: '🔷' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'kotlin', label: 'Kotlin', icon: '🟣' },
  { value: 'swift', label: 'Swift', icon: '🍎' },
  { value: 'dart', label: 'Dart', icon: '🎯' },
  { value: 'scala', label: 'Scala', icon: '⚖️' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'sql', label: 'SQL', icon: '🗄️' }
];

const REVIEW_STANDARDS = [
  { value: 'general', label: 'General Best Practices', description: 'Universal coding standards' },
  { value: 'enterprise', label: 'Enterprise Standards', description: 'Corporate development guidelines' },
  { value: 'security_first', label: 'Security-First', description: 'Enhanced security scanning' },
  { value: 'performance', label: 'Performance-Focused', description: 'Optimization priority' },
  { value: 'maintainability', label: 'Maintainability', description: 'Long-term code health' },
  { value: 'team_standards', label: 'Team Standards', description: 'Consistent team coding style' }
];

export function SmartCodeReviewTool(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [reviewStandard, setReviewStandard] = useState<string>('general');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [results, setResults] = useState<CodeReviewResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [learningMode, setLearningMode] = useState<boolean>(true);
  const [autoFix, setAutoFix] = useState<boolean>(false);
  const [teamMode, setTeamMode] = useState<boolean>(false);

  /**
   * Handle code analysis
   */
  const handleAnalyzeCode = useCallback(async (): Promise<void> => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResults(null);

    try {
      // Simulate progressive analysis
      const steps = [
        'Parsing code structure...',
        'Analyzing security vulnerabilities...',
        'Checking performance patterns...',
        'Evaluating code quality...',
        'Generating suggestions...',
        'Finalizing report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setAnalysisProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate mock analysis results
      const mockResults: CodeReviewResult = await generateMockAnalysis(code, language, reviewStandard);
      setResults(mockResults);
      setActiveTab('overview');
      
      toast.success('Code analysis completed successfully!');

    } catch (error) {
      console.error('Code analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [code, language, reviewStandard]);

  /**
   * Handle copying code fixes
   */
  const handleCopyFix = useCallback(async (fix: AutoFixSuggestion): Promise<void> => {
    await navigator.clipboard.writeText(fix.after);
    toast.success('Fix copied to clipboard');
  }, []);

  /**
   * Handle downloading report
   */
  const handleDownloadReport = useCallback((): void => {
    if (!results) return;

    const report = generateReport(results, code, language);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-review-report-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully');
  }, [results, code, language]);

  /**
   * Get severity color
   */
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  /**
   * Get score color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const selectedLanguage = PROGRAMMING_LANGUAGES.find(lang => lang.value === language);
  const selectedStandard = REVIEW_STANDARDS.find(std => std.value === reviewStandard);

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--ff-secondary)] to-[var(--ff-primary)]">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-['Sora'] text-2xl font-bold text-[var(--ff-text-primary)]">
              Smart Code Review AI
            </h1>
            <p className="text-[var(--ff-text-secondary)] text-sm">
              Advanced AI-powered code analysis with security scanning and optimization
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {PROGRAMMING_LANGUAGES.length} Languages Supported
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="ff-btn-ghost"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--ff-primary)]" />
            Analysis Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="ff-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <span>{lang.icon}</span>
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Review Standard */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Review Standard</Label>
              <Select value={reviewStandard} onValueChange={setReviewStandard}>
                <SelectTrigger className="ff-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REVIEW_STANDARDS.map((standard) => (
                    <SelectItem key={standard.value} value={standard.value}>
                      <div>
                        <div className="font-medium">{standard.label}</div>
                        <div className="text-xs text-[var(--ff-text-muted)]">{standard.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mode Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Learning Mode</Label>
                <Switch
                  checked={learningMode}
                  onCheckedChange={setLearningMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Auto-Fix</Label>
                <Switch
                  checked={autoFix}
                  onCheckedChange={setAutoFix}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Team Mode</Label>
                <Switch
                  checked={teamMode}
                  onCheckedChange={setTeamMode}
                />
              </div>
            </div>
          </div>

          {selectedStandard && (
            <div className="bg-[var(--ff-surface)]/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-[var(--ff-primary)]" />
                <span className="font-semibold text-sm">Active Standard: {selectedStandard.label}</span>
              </div>
              <p className="text-xs text-[var(--ff-text-secondary)]">{selectedStandard.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Input */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-[var(--ff-secondary)]" />
            Code Input
            {selectedLanguage && (
              <Badge variant="outline" className="ml-2">
                {selectedLanguage.icon} {selectedLanguage.label}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={`Paste your ${selectedLanguage?.label || 'code'} here for analysis...

Example:
function calculateTotal(items) {
  let total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="ff-input min-h-[300px] font-mono text-sm"
              style={{ fontFamily: 'var(--ff-font-mono)' }}
            />
            
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.js,.ts,.py,.java,.cs,.cpp,.go,.rs,.php,.rb,.kt,.swift,.dart,.scala,.html,.css,.sql';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setCode(e.target?.result as string);
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="ff-btn-ghost"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-[var(--ff-text-muted)]">
              <span>{code.length} characters</span>
              <span>{code.split('\n').length} lines</span>
              {code.length > 0 && (
                <span className="text-[var(--ff-success)]">✓ Code ready for analysis</span>
              )}
            </div>

            <Button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing || !code.trim()}
              className="ff-btn-primary font-['Sora'] font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={analysisProgress} className="w-full" />
              <div className="text-center text-sm text-[var(--ff-text-muted)]">
                {analysisProgress < 20 && 'Parsing code structure...'}
                {analysisProgress >= 20 && analysisProgress < 40 && 'Analyzing security vulnerabilities...'}
                {analysisProgress >= 40 && analysisProgress < 60 && 'Checking performance patterns...'}
                {analysisProgress >= 60 && analysisProgress < 80 && 'Evaluating code quality...'}
                {analysisProgress >= 80 && analysisProgress < 95 && 'Generating suggestions...'}
                {analysisProgress >= 95 && 'Finalizing report...'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ff-accent)]" />
                Analysis Results
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                    <span className={getScoreColor(results.overall_score)}>
                      {results.overall_score}/100
                    </span>
                  </div>
                  <div className="text-xs text-[var(--ff-text-muted)]">Overall Score</div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReport}
                  className="ff-btn-ghost"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="ff-nav-item">
                  <Eye className="h-4 w-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="security" className="ff-nav-item">
                  <Shield className="h-4 w-4 mr-1" />
                  Security ({results.security_issues.length})
                </TabsTrigger>
                <TabsTrigger value="performance" className="ff-nav-item">
                  <Zap className="h-4 w-4 mr-1" />
                  Performance ({results.performance_issues.length})
                </TabsTrigger>
                <TabsTrigger value="quality" className="ff-nav-item">
                  <Star className="h-4 w-4 mr-1" />
                  Quality ({results.quality_issues.length})
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="ff-nav-item">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Fixes ({results.suggestions.length})
                </TabsTrigger>
                {learningMode && (
                  <TabsTrigger value="learning" className="ff-nav-item">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Learn
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="ff-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Security Issues</p>
                          <p className="text-2xl font-bold text-red-600">{results.security_issues.length}</p>
                        </div>
                        <Shield className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Performance</p>
                          <p className="text-2xl font-bold text-orange-600">{results.performance_issues.length}</p>
                        </div>
                        <Zap className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Quality Issues</p>
                          <p className="text-2xl font-bold text-yellow-600">{results.quality_issues.length}</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Auto-Fixes</p>
                          <p className="text-2xl font-bold text-green-600">{results.suggestions.length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Code Metrics */}
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle className="text-base">Code Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.lines_of_code}
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Lines of Code</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.cyclomatic_complexity}
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Complexity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.maintainability_index}
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Maintainability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.test_coverage}%
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Test Coverage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.code_duplication}%
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Duplication</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--ff-text-primary)]">
                          {results.metrics.technical_debt}
                        </div>
                        <div className="text-sm text-[var(--ff-text-muted)]">Tech Debt</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                {results.security_issues.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-green-600 mb-2">No Security Issues Found</h3>
                    <p className="text-[var(--ff-text-secondary)]">Your code appears to be secure!</p>
                  </div>
                ) : (
                  results.security_issues.map((issue) => (
                    <Card key={issue.id} className="ff-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {issue.type}
                              </Badge>
                              <span className="text-xs text-[var(--ff-text-muted)]">Line {issue.line}</span>
                            </div>
                            <h4 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                              {issue.description}
                            </h4>
                            <p className="text-sm text-[var(--ff-text-secondary)] mb-3">
                              {issue.fix_suggestion}
                            </p>
                            {issue.references.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--ff-text-muted)]">References:</span>
                                {issue.references.map((ref, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {ref}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Auto-Fix Suggestions Tab */}
              <TabsContent value="suggestions" className="space-y-4">
                {results.suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="ff-card">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                            <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                              {suggestion.confidence}% confidence
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                            {suggestion.description}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-red-600 mb-2">Before:</div>
                              <pre className="text-xs bg-red-50 p-3 rounded border overflow-x-auto">
                                {suggestion.before}
                              </pre>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-green-600 mb-2">After:</div>
                              <pre className="text-xs bg-green-50 p-3 rounded border overflow-x-auto">
                                {suggestion.after}
                              </pre>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyFix(suggestion)}
                          className="ff-btn-ghost ml-4"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Learning Tab */}
              {learningMode && (
                <TabsContent value="learning" className="space-y-4">
                  {results.learning_points.map((point, index) => (
                    <Card key={index} className="ff-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-[var(--ff-accent)] mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-[var(--ff-text-primary)]">
                                {point.concept}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${
                                point.difficulty === 'beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                                point.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {point.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--ff-text-secondary)] mb-3">
                              {point.explanation}
                            </p>
                            {point.resources.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-[var(--ff-text-muted)] mb-1">
                                  Learn More:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {point.resources.map((resource, i) => (
                                    <Badge key={i} variant="outline" className="text-xs cursor-pointer hover:bg-[var(--ff-primary)]/10">
                                      {resource}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Generate mock analysis results for demonstration
 */
async function generateMockAnalysis(
  code: string, 
  language: string, 
  standard: string
): Promise<CodeReviewResult> {
  // This would call actual AI analysis services in production
  const mockResults: CodeReviewResult = {
    overall_score: Math.floor(Math.random() * 40) + 60,
    security_issues: [
      {
        id: '1',
        severity: 'high',
        type: 'Input Validation',
        line: 5,
        description: 'Potential XSS vulnerability due to unvalidated user input',
        fix_suggestion: 'Sanitize and validate all user inputs before processing',
        cwe_id: 'CWE-79',
        references: ['OWASP XSS Prevention', 'CWE-79']
      },
      {
        id: '2',
        severity: 'medium',
        type: 'Weak Cryptography',
        line: 12,
        description: 'Using weak hashing algorithm MD5',
        fix_suggestion: 'Use SHA-256 or bcrypt for password hashing',
        references: ['OWASP Cryptographic Storage']
      }
    ],
    performance_issues: [
      {
        id: '1',
        impact: 'high',
        type: 'Inefficient Loop',
        line: 8,
        description: 'Nested loop creating O(n²) complexity',
        suggestion: 'Consider using a hash map for O(n) lookup',
        estimated_improvement: '75% faster execution'
      }
    ],
    quality_issues: [
      {
        id: '1',
        category: 'maintainability',
        severity: 'warning',
        line: 15,
        description: 'Function exceeds maximum recommended length',
        suggestion: 'Break down into smaller, focused functions'
      },
      {
        id: '2',
        category: 'readability',
        severity: 'info',
        line: 3,
        description: 'Variable name is not descriptive',
        suggestion: 'Use meaningful variable names like "userCount" instead of "n"'
      }
    ],
    best_practices: [
      {
        id: '1',
        practice: 'Error Handling',
        description: 'Missing error handling for async operations',
        line: 20,
        recommendation: 'Add try-catch blocks for async functions',
        difficulty: 'beginner'
      }
    ],
    suggestions: [
      {
        id: '1',
        type: 'security',
        description: 'Replace innerHTML with textContent',
        before: 'element.innerHTML = userInput;',
        after: 'element.textContent = userInput;',
        confidence: 95
      },
      {
        id: '2',
        type: 'performance',
        description: 'Use const instead of var for better performance',
        before: 'var items = [];',
        after: 'const items = [];',
        confidence: 85
      }
    ],
    metrics: {
      lines_of_code: code.split('\n').length,
      cyclomatic_complexity: Math.floor(Math.random() * 10) + 1,
      maintainability_index: Math.floor(Math.random() * 40) + 60,
      test_coverage: Math.floor(Math.random() * 60) + 20,
      code_duplication: Math.floor(Math.random() * 20),
      technical_debt: `${Math.floor(Math.random() * 5) + 1}h`
    },
    learning_points: [
      {
        concept: 'Input Validation',
        explanation: 'Always validate and sanitize user inputs to prevent security vulnerabilities like XSS and injection attacks.',
        resources: ['OWASP Input Validation Guide', 'JavaScript Input Sanitization'],
        difficulty: 'beginner'
      },
      {
        concept: 'Time Complexity',
        explanation: 'Understanding Big O notation helps you write more efficient algorithms. Nested loops often indicate O(n²) complexity.',
        resources: ['Big O Cheat Sheet', 'Algorithm Complexity Guide'],
        difficulty: 'intermediate'
      }
    ]
  };

  return mockResults;
}

/**
 * Generate markdown report
 */
function generateReport(results: CodeReviewResult, code: string, language: string): string {
  return `# Code Review Report

**Language:** ${language}
**Generated:** ${new Date().toLocaleString()}
**Overall Score:** ${results.overall_score}/100

## Summary

- **Security Issues:** ${results.security_issues.length}
- **Performance Issues:** ${results.performance_issues.length}
- **Quality Issues:** ${results.quality_issues.length}
- **Auto-Fix Suggestions:** ${results.suggestions.length}

## Code Metrics

- **Lines of Code:** ${results.metrics.lines_of_code}
- **Cyclomatic Complexity:** ${results.metrics.cyclomatic_complexity}
- **Maintainability Index:** ${results.metrics.maintainability_index}
- **Test Coverage:** ${results.metrics.test_coverage}%
- **Code Duplication:** ${results.metrics.code_duplication}%
- **Technical Debt:** ${results.metrics.technical_debt}

## Security Issues

${results.security_issues.map(issue => `
### ${issue.type} (Line ${issue.line}) - ${issue.severity.toUpperCase()}

**Description:** ${issue.description}

**Fix Suggestion:** ${issue.fix_suggestion}

${issue.references.length > 0 ? `**References:** ${issue.references.join(', ')}` : ''}
`).join('')}

## Performance Issues

${results.performance_issues.map(issue => `
### ${issue.type} (Line ${issue.line}) - ${issue.impact.toUpperCase()} Impact

**Description:** ${issue.description}

**Suggestion:** ${issue.suggestion}

**Estimated Improvement:** ${issue.estimated_improvement}
`).join('')}

## Auto-Fix Suggestions

${results.suggestions.map(suggestion => `
### ${suggestion.description} (${suggestion.confidence}% confidence)

**Before:**
\`\`\`${language}
${suggestion.before}
\`\`\`

**After:**
\`\`\`${language}
${suggestion.after}
\`\`\`
`).join('')}

---
Generated by FlashFusion Smart Code Review AI`;
}

export default SmartCodeReviewTool;