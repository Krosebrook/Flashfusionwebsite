/**
 * @fileoverview AI-Powered Code Intelligence System
 * @chunk ai-intelligence
 * @category ai-code-analysis
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Advanced AI code analysis and generation system with intelligent code review,
 * predictive bug detection, smart refactoring assistance, and context-aware code generation.
 * 
 * Features:
 * - Intelligent code review with AI-powered suggestions
 * - Predictive bug detection using machine learning
 * - Smart refactoring assistant with automated improvements
 * - Context-aware code generation with project understanding
 * - Code quality analysis with security scanning
 * - Performance optimization recommendations
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { 
  Code, 
  Brain, 
  Zap, 
  Bug,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Settings,
  Bell,
  Flag,
  Award,
  Star,
  BarChart3,
  LineChart,
  PieChart,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Flame,
  Shield,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Upload,
  Terminal,
  FileText,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Layers,
  GitBranch,
  Play,
  Pause,
  FastForward,
  Rewind,
  RotateCcw
} from 'lucide-react';

// AI Intelligence interfaces
interface CodeAnalysis {
  id: string;
  timestamp: Date;
  language: string;
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  duplicateLines: number;
  testCoverage: number;
  securityScore: number;
  performanceScore: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface CodeSuggestion {
  id: string;
  type: 'refactor' | 'optimize' | 'security' | 'bug-fix' | 'style' | 'documentation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentCode: string;
  suggestedCode: string;
  reasoning: string;
  impact: string;
  confidence: number;
  estimatedEffort: string;
  tags: string[];
  autoApplyable: boolean;
}

interface BugPrediction {
  id: string;
  file: string;
  line: number;
  function: string;
  bugType: 'logic' | 'runtime' | 'memory' | 'concurrency' | 'security';
  probability: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  reasoning: string;
  suggestedFix: string;
  historicalData: {
    similarBugs: number;
    previousFixes: number;
    patternMatches: number;
  };
}

interface CodeGeneration {
  id: string;
  prompt: string;
  language: string;
  context: string;
  generatedCode: string;
  explanation: string;
  qualityScore: number;
  testSuggestions: string[];
  improvements: string[];
  timestamp: Date;
}

interface AIMetrics {
  totalAnalyses: number;
  bugsPrevented: number;
  codeQualityImprovement: number;
  timesSaved: number;
  suggestionsApplied: number;
  accuracyRate: number;
  developerSatisfaction: number;
  falsePositiveRate: number;
}

/**
 * AI Code Intelligence System Component
 */
export function AICodeIntelligenceSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'suggestions' | 'predictions' | 'generation'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');

  // AI Metrics
  const [aiMetrics, setAIMetrics] = useState<AIMetrics>({
    totalAnalyses: 15847,
    bugsPrevented: 2341,
    codeQualityImprovement: 23.5,
    timesSaved: 487,
    suggestionsApplied: 8934,
    accuracyRate: 94.2,
    developerSatisfaction: 4.7,
    falsePositiveRate: 5.8
  });

  // Latest code analysis
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis>({
    id: 'analysis-001',
    timestamp: new Date(),
    language: 'TypeScript',
    linesOfCode: 1247,
    complexity: 7.2,
    maintainabilityIndex: 82,
    duplicateLines: 45,
    testCoverage: 87,
    securityScore: 91,
    performanceScore: 85,
    qualityGrade: 'A'
  });

  // Code suggestions
  const codeSuggestions: CodeSuggestion[] = useMemo(() => [
    {
      id: 'suggestion-001',
      type: 'refactor',
      severity: 'medium',
      title: 'Extract Complex Function',
      description: 'Function `processUserData` has high complexity (CC: 15). Consider extracting sub-functions.',
      currentCode: `function processUserData(user: User, options: ProcessOptions) {
  if (user.isActive && user.permissions.length > 0) {
    if (options.validateEmail && !isValidEmail(user.email)) {
      throw new Error('Invalid email');
    }
    // ... 50+ more lines of complex logic
  }
}`,
      suggestedCode: `function processUserData(user: User, options: ProcessOptions) {
  validateUser(user, options);
  return transformUserData(user, options);
}

function validateUser(user: User, options: ProcessOptions) {
  if (!user.isActive || user.permissions.length === 0) {
    throw new Error('User validation failed');
  }
  if (options.validateEmail && !isValidEmail(user.email)) {
    throw new Error('Invalid email');
  }
}`,
      reasoning: 'Breaking down complex functions improves readability, testability, and maintainability. Each function should have a single responsibility.',
      impact: 'Reduces complexity from 15 to 4, improves test coverage potential by 25%',
      confidence: 92,
      estimatedEffort: '30 minutes',
      tags: ['complexity', 'maintainability', 'testing'],
      autoApplyable: false
    },
    {
      id: 'suggestion-002',
      type: 'optimize',
      severity: 'high',
      title: 'Optimize Database Query',
      description: 'N+1 query detected in user listing. Use JOIN or batch loading to improve performance.',
      currentCode: `const users = await User.findAll();
for (const user of users) {
  user.profile = await Profile.findByUserId(user.id);
}`,
      suggestedCode: `const users = await User.findAll({
  include: [{ model: Profile, as: 'profile' }]
});`,
      reasoning: 'N+1 queries cause exponential performance degradation with dataset size. Single JOIN query is much more efficient.',
      impact: 'Reduces database calls from N+1 to 1, improves response time by 85%',
      confidence: 98,
      estimatedEffort: '10 minutes',
      tags: ['performance', 'database', 'optimization'],
      autoApplyable: true
    },
    {
      id: 'suggestion-003',
      type: 'security',
      severity: 'critical',
      title: 'SQL Injection Vulnerability',
      description: 'Direct string interpolation in SQL query. Use parameterized queries to prevent injection attacks.',
      currentCode: `const query = \`SELECT * FROM users WHERE id = \${userId}\`;
const result = await db.query(query);`,
      suggestedCode: `const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.query(query, [userId]);`,
      reasoning: 'String interpolation in SQL queries allows attackers to inject malicious SQL code. Parameterized queries prevent this vulnerability.',
      impact: 'Eliminates critical security vulnerability, prevents potential data breaches',
      confidence: 99,
      estimatedEffort: '5 minutes',
      tags: ['security', 'sql-injection', 'critical'],
      autoApplyable: true
    }
  ], []);

  // Bug predictions
  const bugPredictions: BugPrediction[] = useMemo(() => [
    {
      id: 'prediction-001',
      file: 'src/utils/dateHelper.ts',
      line: 42,
      function: 'formatDateRange',
      bugType: 'logic',
      probability: 87,
      severity: 'high',
      description: 'Potential null reference error when handling edge case dates',
      reasoning: 'Function does not check for null/undefined inputs before calling date methods. Historical data shows 15 similar bugs in date handling functions.',
      suggestedFix: 'Add null checks and input validation before processing dates',
      historicalData: {
        similarBugs: 15,
        previousFixes: 12,
        patternMatches: 8
      }
    },
    {
      id: 'prediction-002',
      file: 'src/api/userController.ts',
      line: 128,
      function: 'updateUserProfile',
      bugType: 'security',
      probability: 94,
      severity: 'critical',
      description: 'Insufficient authorization check before profile update',
      reasoning: 'Function updates user profile without verifying if the requesting user has permission to modify the target profile.',
      suggestedFix: 'Implement authorization check to verify user permissions before allowing profile modifications',
      historicalData: {
        similarBugs: 23,
        previousFixes: 21,
        patternMatches: 12
      }
    },
    {
      id: 'prediction-003',
      file: 'src/components/DataTable.tsx',
      line: 89,
      function: 'handleSort',
      bugType: 'runtime',
      probability: 72,
      severity: 'medium',
      description: 'Potential memory leak in event listener registration',
      reasoning: 'Event listeners are added in useEffect without proper cleanup, leading to accumulating listeners on re-renders.',
      suggestedFix: 'Add cleanup function in useEffect to remove event listeners',
      historicalData: {
        similarBugs: 9,
        previousFixes: 8,
        patternMatches: 5
      }
    }
  ], []);

  // Recent code generations
  const [codeGenerations, setCodeGenerations] = useState<CodeGeneration[]>([
    {
      id: 'generation-001',
      prompt: 'Create a React hook for managing form validation with TypeScript',
      language: 'TypeScript',
      context: 'React project with form handling requirements',
      generatedCode: `import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  validator: (value: T) => boolean;
  message: string;
}

interface FormField<T> {
  value: T;
  errors: string[];
  touched: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
) {
  const [fields, setFields] = useState<Record<keyof T, FormField<T[keyof T]>>>(
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key],
        errors: [],
        touched: false
      }
    }), {} as Record<keyof T, FormField<T[keyof T]>>)
  );

  const validateField = useCallback((fieldName: keyof T, value: T[keyof T]) => {
    const rules = validationRules[fieldName] || [];
    const errors = rules
      .filter(rule => !rule.validator(value))
      .map(rule => rule.message);
    
    return errors;
  }, [validationRules]);

  const setFieldValue = useCallback((fieldName: keyof T, value: T[keyof T]) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        errors: validateField(fieldName, value),
        touched: true
      }
    }));
  }, [validateField]);

  const isValid = Object.values(fields).every(field => field.errors.length === 0);

  return {
    fields,
    setFieldValue,
    isValid,
    reset: () => setFields(Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key],
        errors: [],
        touched: false
      }
    }), {} as Record<keyof T, FormField<T[keyof T]>>))
  };
}`,
      explanation: 'This hook provides type-safe form validation with flexible validation rules, error tracking, and touch state management.',
      qualityScore: 92,
      testSuggestions: [
        'Test with various validation rules',
        'Test field value updates and error states',
        'Test form reset functionality',
        'Test TypeScript type safety'
      ],
      improvements: [
        'Add async validation support',
        'Include field-level validation debouncing',
        'Add validation on form submission'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  // Real-time AI metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAIMetrics(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + Math.floor(Math.random() * 3),
        bugsPrevented: prev.bugsPrevented + (Math.random() > 0.8 ? 1 : 0),
        timesSaved: prev.timesSaved + (Math.random() > 0.9 ? Math.floor(Math.random() * 5) : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Code analysis handler
  const handleCodeAnalysis = useCallback(async () => {
    if (!codeInput.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update analysis results
      setCodeAnalysis(prev => ({
        ...prev,
        timestamp: new Date(),
        linesOfCode: codeInput.split('\n').length,
        complexity: Math.random() * 10 + 2,
        maintainabilityIndex: Math.floor(Math.random() * 30 + 70),
        securityScore: Math.floor(Math.random() * 20 + 80),
        performanceScore: Math.floor(Math.random() * 25 + 75),
        qualityGrade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as any
      }));
      
      setAIMetrics(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + 1
      }));
      
    } finally {
      setIsAnalyzing(false);
    }
  }, [codeInput]);

  // Code generation handler
  const handleCodeGeneration = useCallback(async () => {
    if (!generationPrompt.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI code generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newGeneration: CodeGeneration = {
        id: `generation-${Date.now()}`,
        prompt: generationPrompt,
        language: 'TypeScript',
        context: 'Current project context',
        generatedCode: `// Generated code based on: ${generationPrompt}
// This is a simulated response - actual AI would generate real code
function generatedFunction() {
  // AI-generated implementation here
  return "Generated code based on your prompt";
}`,
        explanation: 'This code was generated based on your prompt and project context.',
        qualityScore: Math.floor(Math.random() * 20 + 80),
        testSuggestions: ['Add unit tests', 'Test edge cases', 'Validate inputs'],
        improvements: ['Add error handling', 'Optimize performance', 'Add documentation'],
        timestamp: new Date()
      };
      
      setCodeGenerations(prev => [newGeneration, ...prev]);
      setGenerationPrompt('');
      
    } finally {
      setIsAnalyzing(false);
    }
  }, [generationPrompt]);

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'var(--ff-success)';
      case 'B': return 'var(--ff-secondary)';
      case 'C': return 'var(--ff-warning)';
      case 'D': case 'F': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'refactor': return Wrench;
      case 'optimize': return Zap;
      case 'security': return Shield;
      case 'bug-fix': return Bug;
      case 'style': return Eye;
      case 'documentation': return FileText;
      default: return Code;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-accent mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI Code Intelligence
          </Badge>
          
          <h1 className="ff-text-display">
            Code
            <span className="ff-text-gradient"> Intelligence</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Advanced AI-powered code analysis with intelligent review, predictive bug detection, 
            smart refactoring assistance, and context-aware code generation for enhanced development productivity.
          </p>
        </div>

        {/* AI Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Brain className="w-5 h-5 text-[var(--ff-success)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {aiMetrics.accuracyRate.toFixed(1)}%
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">AI Accuracy</div>
            <div className="flex justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-[var(--ff-success)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bug className="w-5 h-5 text-[var(--ff-primary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {aiMetrics.bugsPrevented.toLocaleString()}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Bugs Prevented</div>
            <div className="flex justify-center mt-1">
              <Shield className="w-4 h-4 text-[var(--ff-primary)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-[var(--ff-secondary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {aiMetrics.timesSaved}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Hours Saved</div>
            <div className="flex justify-center mt-1">
              <Clock className="w-4 h-4 text-[var(--ff-secondary)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-[var(--ff-accent)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {aiMetrics.developerSatisfaction.toFixed(1)}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Developer Rating</div>
            <div className="flex justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-[var(--ff-accent)]" />
            </div>
          </Card>
        </div>

        {/* AI Intelligence Controls */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--ff-accent)]" />
              AI Intelligence Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Code Analysis
                </h4>
                <Textarea
                  placeholder="Paste your code here for AI analysis..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
                <Button
                  onClick={handleCodeAnalysis}
                  disabled={isAnalyzing || !codeInput.trim()}
                  className="w-full ff-btn-accent"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Code Generation
                </h4>
                <Textarea
                  placeholder="Describe what code you want to generate..."
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button
                  onClick={handleCodeGeneration}
                  disabled={isAnalyzing || !generationPrompt.trim()}
                  className="w-full ff-btn-primary"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed AI Intelligence Tabs */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="predictions" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Bug Predictions
                  </TabsTrigger>
                  <TabsTrigger value="generation" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Generation
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Code Analysis Tab */}
              <TabsContent value="analysis" className="p-6 space-y-6">
                <h3 className="ff-text-title">Latest Code Analysis Results</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="ff-card text-center p-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: getQualityColor(codeAnalysis.qualityGrade) + '20' }}
                    >
                      <div 
                        className="ff-text-xl" 
                        style={{ 
                          fontWeight: 'var(--ff-weight-bold)',
                          color: getQualityColor(codeAnalysis.qualityGrade)
                        }}
                      >
                        {codeAnalysis.qualityGrade}
                      </div>
                    </div>
                    <div className="ff-text-sm text-[var(--ff-text-muted)]">Quality Grade</div>
                  </Card>
                  
                  <Card className="ff-card text-center p-4">
                    <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                      {codeAnalysis.maintainabilityIndex}
                    </div>
                    <div className="ff-text-sm text-[var(--ff-text-muted)]">Maintainability</div>
                    <Progress value={codeAnalysis.maintainabilityIndex} className="h-2 mt-2" />
                  </Card>
                  
                  <Card className="ff-card text-center p-4">
                    <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                      {codeAnalysis.securityScore}
                    </div>
                    <div className="ff-text-sm text-[var(--ff-text-muted)]">Security Score</div>
                    <Progress value={codeAnalysis.securityScore} className="h-2 mt-2" />
                  </Card>
                  
                  <Card className="ff-card text-center p-4">
                    <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                      {codeAnalysis.testCoverage}%
                    </div>
                    <div className="ff-text-sm text-[var(--ff-text-muted)]">Test Coverage</div>
                    <Progress value={codeAnalysis.testCoverage} className="h-2 mt-2" />
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardContent className="p-4">
                      <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-3" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        Code Metrics
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Lines of Code</span>
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{codeAnalysis.linesOfCode.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Complexity</span>
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{codeAnalysis.complexity.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Duplicate Lines</span>
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{codeAnalysis.duplicateLines}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Performance Score</span>
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{codeAnalysis.performanceScore}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardContent className="p-4">
                      <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-3" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        Analysis Summary
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Good maintainability index</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Strong security practices</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-[var(--ff-warning)]" />
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Some duplicate code detected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                          <span className="ff-text-sm text-[var(--ff-text-muted)]">Excellent test coverage</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Code Suggestions Tab */}
              <TabsContent value="suggestions" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">AI Code Suggestions</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-error">
                      {codeSuggestions.filter(s => s.severity === 'critical').length} Critical
                    </Badge>
                    <Badge className="ff-badge-warning">
                      {codeSuggestions.filter(s => s.severity === 'high').length} High
                    </Badge>
                    <Badge className="ff-badge-success">
                      {codeSuggestions.filter(s => s.autoApplyable).length} Auto-Fixable
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {codeSuggestions.map((suggestion) => {
                    const TypeIcon = getTypeIcon(suggestion.type);
                    
                    return (
                      <Card key={suggestion.id} className="ff-card">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: getSeverityColor(suggestion.severity) + '20' }}
                              >
                                <TypeIcon className="w-5 h-5" style={{ color: getSeverityColor(suggestion.severity) }} />
                              </div>
                              <div>
                                <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {suggestion.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    className={`ff-badge-${suggestion.severity === 'critical' ? 'error' : suggestion.severity === 'high' ? 'warning' : 'secondary'} text-xs`}
                                  >
                                    {suggestion.severity}
                                  </Badge>
                                  <Badge className="ff-badge-secondary text-xs">
                                    {suggestion.type}
                                  </Badge>
                                  {suggestion.autoApplyable && (
                                    <Badge className="ff-badge-success text-xs">
                                      Auto-Fix Available
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {suggestion.confidence}%
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Confidence</div>
                            </div>
                          </div>
                          
                          <p className="ff-text-sm text-[var(--ff-text-muted)] mb-4">
                            {suggestion.description}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h5 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                Current Code
                              </h5>
                              <pre className="bg-[var(--ff-surface)] p-3 rounded text-xs overflow-x-auto">
                                <code>{suggestion.currentCode}</code>
                              </pre>
                            </div>
                            <div>
                              <h5 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                Suggested Code
                              </h5>
                              <pre className="bg-[var(--ff-surface)] p-3 rounded text-xs overflow-x-auto">
                                <code>{suggestion.suggestedCode}</code>
                              </pre>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                Reasoning:
                              </span>
                              <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">{suggestion.reasoning}</p>
                            </div>
                            
                            <div>
                              <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                Impact:
                              </span>
                              <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">{suggestion.impact}</p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Estimated Effort: </span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]">{suggestion.estimatedEffort}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                {suggestion.autoApplyable ? (
                                  <Button
                                    className="ff-btn-success"
                                    size="sm"
                                    style={{
                                      fontFamily: 'var(--ff-font-primary)',
                                      fontWeight: 'var(--ff-weight-semibold)',
                                      fontSize: 'var(--ff-text-sm)'
                                    }}
                                  >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Auto-Apply
                                  </Button>
                                ) : (
                                  <Button
                                    className="ff-btn-outline"
                                    size="sm"
                                    style={{
                                      fontFamily: 'var(--ff-font-primary)',
                                      fontWeight: 'var(--ff-weight-semibold)',
                                      fontSize: 'var(--ff-text-sm)'
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Bug Predictions Tab */}
              <TabsContent value="predictions" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Predictive Bug Detection</h3>
                  <Badge className="ff-badge-warning">
                    {bugPredictions.filter(p => p.probability > 80).length} High Probability
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {bugPredictions.map((prediction) => (
                    <Card key={prediction.id} className="ff-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: getSeverityColor(prediction.severity) + '20' }}
                            >
                              <Bug className="w-5 h-5" style={{ color: getSeverityColor(prediction.severity) }} />
                            </div>
                            <div>
                              <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {prediction.file}:{prediction.line}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  className={`ff-badge-${prediction.severity === 'critical' ? 'error' : prediction.severity === 'high' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {prediction.severity}
                                </Badge>
                                <Badge className="ff-badge-secondary text-xs">
                                  {prediction.bugType}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="ff-text-xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {prediction.probability}%
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Bug Probability</div>
                          </div>
                        </div>
                        
                        <p className="ff-text-sm text-[var(--ff-text-muted)] mb-4">
                          <strong>Function:</strong> {prediction.function} - {prediction.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              AI Reasoning:
                            </span>
                            <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">{prediction.reasoning}</p>
                          </div>
                          
                          <div>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              Suggested Fix:
                            </span>
                            <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">{prediction.suggestedFix}</p>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 pt-3 border-t border-[var(--border)]">
                            <div className="text-center">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {prediction.historicalData.similarBugs}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Similar Bugs</div>
                            </div>
                            <div className="text-center">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {prediction.historicalData.previousFixes}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Previous Fixes</div>
                            </div>
                            <div className="text-center">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {prediction.historicalData.patternMatches}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Pattern Matches</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Code Generation Tab */}
              <TabsContent value="generation" className="p-6 space-y-6">
                <h3 className="ff-text-title">Recent Code Generations</h3>
                
                <div className="space-y-4">
                  {codeGenerations.map((generation) => (
                    <Card key={generation.id} className="ff-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {generation.prompt}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="ff-badge-secondary text-xs">
                                {generation.language}
                              </Badge>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">
                                {generation.timestamp.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {generation.qualityScore}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Quality Score</div>
                          </div>
                        </div>
                        
                        <p className="ff-text-sm text-[var(--ff-text-muted)] mb-4">
                          {generation.explanation}
                        </p>
                        
                        <div className="mb-4">
                          <h5 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Generated Code
                          </h5>
                          <pre className="bg-[var(--ff-surface)] p-4 rounded text-xs overflow-x-auto max-h-64">
                            <code>{generation.generatedCode}</code>
                          </pre>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              Test Suggestions
                            </h5>
                            <ul className="space-y-1">
                              {generation.testSuggestions.map((suggestion, index) => (
                                <li key={index} className="ff-text-sm text-[var(--ff-text-muted)] flex items-start gap-2">
                                  <span className="w-1 h-1 bg-[var(--ff-primary)] rounded-full mt-2 flex-shrink-0"></span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              Possible Improvements
                            </h5>
                            <ul className="space-y-1">
                              {generation.improvements.map((improvement, index) => (
                                <li key={index} className="ff-text-sm text-[var(--ff-text-muted)] flex items-start gap-2">
                                  <span className="w-1 h-1 bg-[var(--ff-accent)] rounded-full mt-2 flex-shrink-0"></span>
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AICodeIntelligenceSystem;