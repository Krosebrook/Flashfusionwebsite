import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { 
  GitBranch, 
  Folder, 
  FileText, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Code,
  Search,
  Zap,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AIService from '../../../services/AIService';

interface RepositoryAnalyzerProps {
  repository: {
    id: string;
    url: string;
    branch: string;
    accessToken?: string;
    provider: 'github' | 'gitlab' | 'bitbucket';
    isPrivate: boolean;
  };
  onAnalysisComplete?: (analysis: any) => void;
}

interface AnalysisResult {
  structure: any[];
  technologies: string[];
  recommendations: string[];
  codebase_summary: string;
  complexity: 'low' | 'medium' | 'high';
  maintainability: number;
  patterns: string[];
  dependencies: Record<string, string>;
  issues: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    file?: string;
  }>;
}

export function RepositoryAnalyzer({ repository, onAnalysisComplete }: RepositoryAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeRepository = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);

    try {
      // Update progress as we analyze
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 85) return prev + Math.random() * 10;
          return prev;
        });
      }, 500);

      toast.info('Starting repository analysis...');

      // Call AI service to analyze repository
      const aiAnalysis = await AIService.analyzeRepository(
        repository.url,
        repository.branch,
        repository.accessToken
      );

      clearInterval(progressInterval);
      setAnalysisProgress(95);

      // Enhanced analysis with additional metrics
      const enhancedAnalysis: AnalysisResult = {
        ...aiAnalysis,
        complexity: calculateComplexity(aiAnalysis.structure),
        maintainability: calculateMaintainability(aiAnalysis.technologies),
        patterns: detectPatterns(aiAnalysis.structure),
        dependencies: extractDependencies(aiAnalysis.structure),
        issues: detectIssues(aiAnalysis)
      };

      setAnalysisProgress(100);
      setAnalysis(enhancedAnalysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(enhancedAnalysis);
      }

      toast.success('Repository analysis completed!');
    } catch (error) {
      console.error('Repository analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  }, [repository, onAnalysisComplete]);

  // Auto-analyze when component mounts
  useEffect(() => {
    if (repository && !analysis) {
      analyzeRepository();
    }
  }, [repository, analysis, analyzeRepository]);

  const calculateComplexity = (structure: any[]): 'low' | 'medium' | 'high' => {
    const fileCount = structure.filter(item => item.type === 'file').length;
    const dirCount = structure.filter(item => item.type === 'dir').length;
    
    if (fileCount < 10 && dirCount < 5) return 'low';
    if (fileCount < 50 && dirCount < 15) return 'medium';
    return 'high';
  };

  const calculateMaintainability = (technologies: string[]): number => {
    // Basic maintainability score based on technology stack
    let score = 70; // Base score
    
    if (technologies.includes('TypeScript')) score += 15;
    if (technologies.includes('ESLint')) score += 10;
    if (technologies.includes('Prettier')) score += 5;
    if (technologies.includes('Jest') || technologies.includes('Vitest')) score += 10;
    
    return Math.min(100, score);
  };

  const detectPatterns = (structure: any[]): string[] => {
    const patterns: string[] = [];
    const files = structure.filter(item => item.type === 'file').map(item => item.name);
    
    if (files.some(f => f.includes('component'))) patterns.push('Component-based Architecture');
    if (files.some(f => f.includes('service'))) patterns.push('Service Layer Pattern');
    if (files.some(f => f.includes('hook'))) patterns.push('Custom Hooks Pattern');
    if (files.some(f => f.includes('util'))) patterns.push('Utility Functions');
    if (files.some(f => f.includes('type'))) patterns.push('Type Definitions');
    
    return patterns;
  };

  const extractDependencies = (structure: any[]): Record<string, string> => {
    // This would be enhanced to actually read package.json if available
    const packageJson = structure.find(item => 
      item.type === 'file' && item.name === 'package.json'
    );
    
    return packageJson ? {} : {}; // Placeholder - would parse actual dependencies
  };

  const detectIssues = (analysis: any): Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    file?: string;
  }> => {
    const issues = [];
    
    if (!analysis.technologies.includes('TypeScript')) {
      issues.push({
        type: 'warning' as const,
        message: 'Consider migrating to TypeScript for better type safety'
      });
    }
    
    if (!analysis.technologies.includes('ESLint')) {
      issues.push({
        type: 'info' as const,
        message: 'Add ESLint for code quality and consistency'
      });
    }
    
    return issues;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-ff-success';
      case 'medium': return 'text-ff-warning';
      case 'high': return 'text-ff-error';
      default: return 'text-ff-text-muted';
    }
  };

  const getMaintainabilityColor = (score: number) => {
    if (score >= 80) return 'text-ff-success';
    if (score >= 60) return 'text-ff-warning';
    return 'text-ff-error';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-ff-primary" />
            Repository Analysis
            {analysis && (
              <Badge className="ff-btn-secondary ml-auto">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-ff-text-secondary">
                Analyzing: {repository.url.split('/').slice(-2).join('/')}
              </p>
              <p className="text-xs text-ff-text-muted">
                Branch: {repository.branch} • Provider: {repository.provider}
              </p>
            </div>
            
            <Button
              onClick={analyzeRepository}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              className="ff-focus-ring"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing repository structure...</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full ff-progress-bar" />
            </div>
          )}

          {error && (
            <Alert className="border-ff-error/20 bg-ff-error/5">
              <AlertCircle className="h-4 w-4 text-ff-error" />
              <AlertDescription className="text-ff-error">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-ff-secondary" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getComplexityColor(analysis.complexity)}`}>
                    {analysis.complexity.toUpperCase()}
                  </div>
                  <div className="text-xs text-ff-text-muted">Complexity</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-lg font-bold ${getMaintainabilityColor(analysis.maintainability)}`}>
                    {analysis.maintainability}%
                  </div>
                  <div className="text-xs text-ff-text-muted">Maintainability</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-ff-text-primary">Project Summary</h4>
                <p className="text-sm text-ff-text-secondary leading-relaxed">
                  {analysis.codebase_summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technologies Card */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-ff-accent" />
                Technologies & Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-ff-text-primary">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologies.map((tech, index) => (
                    <Badge key={index} className="ff-btn-primary text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-ff-text-primary">Detected Patterns</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.patterns.map((pattern, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="ff-card-interactive md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-ff-warning" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-ff-text-primary">Architecture Suggestions</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-ff-text-secondary flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-ff-success mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-ff-text-primary">Issues & Improvements</h4>
                  <ul className="space-y-1">
                    {analysis.issues.map((issue, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertCircle className={`w-3 h-3 mt-0.5 shrink-0 ${
                          issue.type === 'error' ? 'text-ff-error' :
                          issue.type === 'warning' ? 'text-ff-warning' :
                          'text-ff-info'
                        }`} />
                        <span className="text-ff-text-secondary">{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default RepositoryAnalyzer;