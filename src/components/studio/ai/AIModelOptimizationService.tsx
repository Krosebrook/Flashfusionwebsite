import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Cpu, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Clock,
  ThumbsUp,
  Activity,
  BarChart3,
  Target,
  CheckCircle2
} from 'lucide-react';

interface ModelMetrics {
  modelId: string;
  modelName: string;
  avgGenerationTime: number;
  qualityScore: number;
  userAcceptanceRate: number;
  costPerGeneration: number;
  totalGenerations: number;
  successRate: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface OptimizationResult {
  metric: string;
  before: number;
  after: number;
  improvement: number;
  status: 'completed' | 'in_progress' | 'pending';
}

interface ABTestResult {
  testId: string;
  modelA: string;
  modelB: string;
  winnerModel: string;
  confidenceLevel: number;
  metricsCompared: string[];
  totalTests: number;
}

const AIModelOptimizationService: React.FC = () => {
  const [models, setModels] = useState<ModelMetrics[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([]);
  const [abTests, setAbTests] = useState<ABTestResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    loadModelMetrics();
    loadOptimizationResults();
    loadABTestResults();
  }, []);

  const loadModelMetrics = async () => {
    // Simulate API call
    const mockModels: ModelMetrics[] = [
      {
        modelId: 'music-gen-v3',
        modelName: 'MusicGen V3 (Primary)',
        avgGenerationTime: 8.2,
        qualityScore: 87,
        userAcceptanceRate: 78,
        costPerGeneration: 0.042,
        totalGenerations: 45230,
        successRate: 99.3,
        trend: 'improving'
      },
      {
        modelId: 'music-gen-v2',
        modelName: 'MusicGen V2 (Fallback)',
        avgGenerationTime: 12.5,
        qualityScore: 82,
        userAcceptanceRate: 71,
        costPerGeneration: 0.035,
        totalGenerations: 12450,
        successRate: 98.7,
        trend: 'stable'
      },
      {
        modelId: 'music-gen-fast',
        modelName: 'MusicGen Fast (A/B Test)',
        avgGenerationTime: 5.1,
        qualityScore: 79,
        userAcceptanceRate: 68,
        costPerGeneration: 0.028,
        totalGenerations: 8920,
        successRate: 97.2,
        trend: 'improving'
      }
    ];
    setModels(mockModels);
    setSelectedModel(mockModels[0].modelId);
  };

  const loadOptimizationResults = async () => {
    const mockOptimizations: OptimizationResult[] = [
      {
        metric: 'Generation Speed',
        before: 15.0,
        after: 8.2,
        improvement: 45.3,
        status: 'completed'
      },
      {
        metric: 'Quality Score',
        before: 82,
        after: 87,
        improvement: 6.1,
        status: 'completed'
      },
      {
        metric: 'Cost Efficiency',
        before: 0.062,
        after: 0.042,
        improvement: 32.3,
        status: 'completed'
      },
      {
        metric: 'User Acceptance',
        before: 71,
        after: 78,
        improvement: 9.9,
        status: 'in_progress'
      },
      {
        metric: 'Cache Hit Rate',
        before: 15,
        after: 42,
        improvement: 180.0,
        status: 'completed'
      }
    ];
    setOptimizations(mockOptimizations);
  };

  const loadABTestResults = async () => {
    const mockTests: ABTestResult[] = [
      {
        testId: 'test-001',
        modelA: 'MusicGen V3',
        modelB: 'MusicGen Fast',
        winnerModel: 'MusicGen V3',
        confidenceLevel: 95.2,
        metricsCompared: ['Quality', 'User Satisfaction', 'Completion Rate'],
        totalTests: 5420
      },
      {
        testId: 'test-002',
        modelA: 'MusicGen V2',
        modelB: 'MusicGen V3',
        winnerModel: 'MusicGen V3',
        confidenceLevel: 98.7,
        metricsCompared: ['Speed', 'Quality', 'Cost'],
        totalTests: 8930
      }
    ];
    setAbTests(mockTests);
  };

  const handleOptimizeModel = async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6 ff-stagger-fade">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Sora'] ff-text-gradient">
              AI Model Performance Optimization
            </h1>
            <p className="text-[#CBD5E1] mt-2 font-['Inter']">
              Monitor, optimize, and A/B test AI music generation models
            </p>
          </div>
          <Button
            onClick={handleOptimizeModel}
            disabled={isOptimizing}
            className="ff-btn-primary"
          >
            {isOptimizing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Avg Speed</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">8.2s</p>
                  <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                    -45% from baseline
                  </Badge>
                </div>
                <Clock className="h-8 w-8 text-[#00B4D8]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Quality Score</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">87%</p>
                  <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                    +6.1% improvement
                  </Badge>
                </div>
                <Target className="h-8 w-8 text-[#FF7B00]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">78%</p>
                  <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                    +9.9% increase
                  </Badge>
                </div>
                <ThumbsUp className="h-8 w-8 text-[#E91E63]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Cost Saved</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">32%</p>
                  <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                    $2.3K/month
                  </Badge>
                </div>
                <DollarSign className="h-8 w-8 text-[#00B4D8]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora']">
              Model Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {models.map((model, index) => (
              <div
                key={model.modelId}
                className={`p-6 rounded-lg border ff-fade-in-up ${
                  selectedModel === model.modelId
                    ? 'bg-[#FF7B00]/5 border-[#FF7B00]/20'
                    : 'bg-[#0F172A] border-[#334155]'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedModel(model.modelId)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-[#00B4D8]" />
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Sora']">
                        {model.modelName}
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        {model.totalGenerations.toLocaleString()} generations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(model.trend)}
                    <Badge className={getStatusColor('completed')}>
                      {model.successRate}% success
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Generation Time</p>
                    <p className="text-xl font-bold text-white">{model.avgGenerationTime}s</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Quality Score</p>
                    <p className="text-xl font-bold text-white">{model.qualityScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Acceptance Rate</p>
                    <p className="text-xl font-bold text-white">{model.userAcceptanceRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Cost per Gen</p>
                    <p className="text-xl font-bold text-white">${model.costPerGeneration}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#94A3B8]">Quality</span>
                    <span className="text-white">{model.qualityScore}%</span>
                  </div>
                  <Progress value={model.qualityScore} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#94A3B8]">User Acceptance</span>
                    <span className="text-white">{model.userAcceptanceRate}%</span>
                  </div>
                  <Progress value={model.userAcceptanceRate} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Results */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#FF7B00]" />
              Optimization Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizations.map((opt, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] ff-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {opt.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {opt.status === 'in_progress' && (
                      <Activity className="h-5 w-5 text-yellow-500 animate-spin" />
                    )}
                    <h3 className="text-lg font-semibold text-white font-['Sora']">
                      {opt.metric}
                    </h3>
                  </div>
                  <Badge className={getStatusColor(opt.status)}>
                    {opt.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Before</p>
                    <p className="text-xl font-bold text-[#CBD5E1]">
                      {opt.metric.includes('Cost') ? '$' : ''}
                      {opt.before}
                      {opt.metric.includes('Rate') || opt.metric.includes('Score') ? '%' : ''}
                      {opt.metric.includes('Speed') ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">After</p>
                    <p className="text-xl font-bold text-white">
                      {opt.metric.includes('Cost') ? '$' : ''}
                      {opt.after}
                      {opt.metric.includes('Rate') || opt.metric.includes('Score') ? '%' : ''}
                      {opt.metric.includes('Speed') ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-1">Improvement</p>
                    <p className="text-xl font-bold text-green-500">
                      +{opt.improvement.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <Progress value={opt.improvement} className="h-2 mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* A/B Test Results */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora']">
              A/B Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {abTests.map((test, index) => (
              <div
                key={test.testId}
                className="p-6 rounded-lg bg-[#0F172A] border border-[#334155] ff-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white font-['Sora']">
                    {test.testId.toUpperCase()}
                  </h3>
                  <Badge className="bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/20">
                    {test.confidenceLevel}% confidence
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-[#94A3B8] mb-2">Model A</p>
                    <p className="text-lg font-semibold text-[#CBD5E1]">{test.modelA}</p>
                  </div>
                  <div className="px-4">
                    <span className="text-2xl text-[#94A3B8]">vs</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-[#94A3B8] mb-2">Model B</p>
                    <p className="text-lg font-semibold text-[#CBD5E1]">{test.modelB}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-white font-semibold">Winner: {test.winnerModel}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-[#94A3B8] mb-2">Metrics Compared:</p>
                  <div className="flex flex-wrap gap-2">
                    {test.metricsCompared.map((metric, i) => (
                      <Badge key={i} className="bg-[#FF7B00]/10 text-[#FF7B00] border-[#FF7B00]/20">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-[#94A3B8] mt-4">
                  Based on {test.totalTests.toLocaleString()} test generations
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIModelOptimizationService;
