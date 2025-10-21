import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  BarChart3,
  Shield,
  Award,
  Lightbulb,
  Search,
  Database,
  Globe,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Activity,
  Layers,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ValidationAnalysis, ValidationAgent, ValidationWorkflow } from '../../types/core';

interface AIValidationEngineProps {
  ideaId: string;
  onAnalysisComplete?: (analysis: ValidationAnalysis) => void;
  onBack?: () => void;
}

export function AIValidationEngine({ ideaId, onAnalysisComplete, onBack }: AIValidationEngineProps) {
  const [analysisPhase, setAnalysisPhase] = useState<'initializing' | 'analyzing' | 'completed'>('initializing');
  const [currentStage, setCurrentStage] = useState(0);
  const [agents, setAgents] = useState<ValidationAgent[]>([]);
  const [analysis, setAnalysis] = useState<Partial<ValidationAnalysis>>({});
  const [totalProgress, setTotalProgress] = useState(0);

  const analysisStages = [
    {
      id: 'problem-validation',
      name: 'Problem Validation',
      description: 'Analyzing problem clarity and market need',
      agent: 'Problem Validator Pro',
      duration: 3000,
      metrics: ['painPointClarity', 'targetAudienceSize', 'urgencyLevel', 'evidenceStrength']
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis', 
      description: 'Evaluating market size and competition',
      agent: 'Market Intelligence',
      duration: 4000,
      metrics: ['marketSize', 'competitionLevel', 'marketTrends', 'entryBarriers']
    },
    {
      id: 'revenue-modeling',
      name: 'Revenue Model Analysis',
      description: 'Assessing monetization strategies',
      agent: 'Revenue Architect',
      duration: 3500,
      metrics: ['monetizationViability', 'pricingStrategy', 'scalabilityPotential']
    },
    {
      id: 'distribution-analysis',
      name: 'Distribution Strategy',
      description: 'Analyzing go-to-market pathways',
      agent: 'Distribution Strategist',
      duration: 3000,
      metrics: ['channelAccessibility', 'acquisitionCost', 'networkEffects']
    }
  ];

  // Initialize agents
  useEffect(() => {
    const initialAgents: ValidationAgent[] = [
      {
        id: 'agent-1',
        name: 'Problem Validator Pro',
        type: 'problem-validator',
        status: 'idle',
        progress: 0,
        capabilities: ['Problem clarity analysis', 'Pain point validation', 'Target audience sizing'],
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-2',
        name: 'Market Intelligence',
        type: 'market-analyzer',
        status: 'idle',
        progress: 0,
        capabilities: ['Market size estimation', 'Competitive analysis', 'Trend identification'],
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-3',
        name: 'Revenue Architect',
        type: 'revenue-modeler',
        status: 'idle',
        progress: 0,
        capabilities: ['Business model validation', 'Pricing strategy', 'Revenue forecasting'],
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-4',
        name: 'Distribution Strategist',
        type: 'distribution-strategist',
        status: 'idle',
        progress: 0,
        capabilities: ['Channel optimization', 'Go-to-market strategy', 'Partnership identification'],
        lastActive: new Date().toISOString()
      }
    ];

    setAgents(initialAgents);
    
    // Start analysis after brief delay
    setTimeout(() => {
      setAnalysisPhase('analyzing');
      runAnalysis();
    }, 2000);
  }, [ideaId]);

  const runAnalysis = async () => {
    for (let i = 0; i < analysisStages.length; i++) {
      const stage = analysisStages[i];
      setCurrentStage(i);
      
      // Update agent status
      setAgents(prev => prev.map(agent => 
        agent.name === stage.agent 
          ? { ...agent, status: 'working', currentTask: stage.description, progress: 0 }
          : agent
      ));

      // Simulate analysis progress
      await new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            resolve(undefined);
          }
          
          setAgents(prev => prev.map(agent => 
            agent.name === stage.agent 
              ? { ...agent, progress, status: progress === 100 ? 'completed' : 'working' }
              : agent
          ));
          
          setTotalProgress((i / analysisStages.length) * 100 + (progress / analysisStages.length));
        }, stage.duration / 20);
      });

      // Generate analysis results for this stage
      generateStageResults(stage.id);
    }

    // Complete analysis
    setAnalysisPhase('completed');
    setTotalProgress(100);
    completeAnalysis();
  };

  const generateStageResults = (stageId: string) => {
    switch (stageId) {
      case 'problem-validation':
        setAnalysis(prev => ({
          ...prev,
          problemValidation: {
            score: Math.floor(Math.random() * 30) + 70,
            confidence: Math.floor(Math.random() * 20) + 80,
            analysis: 'Strong problem-market fit identified with clear pain points and well-defined target audience. The problem shows urgency and has substantial evidence of market need.',
            painPointClarity: Math.floor(Math.random() * 20) + 80,
            targetAudienceSize: Math.floor(Math.random() * 25) + 70,
            urgencyLevel: Math.floor(Math.random() * 20) + 75,
            evidenceStrength: Math.floor(Math.random() * 15) + 80
          }
        }));
        break;
      
      case 'market-analysis':
        setAnalysis(prev => ({
          ...prev,
          marketAnalysis: {
            score: Math.floor(Math.random() * 25) + 65,
            confidence: Math.floor(Math.random() * 15) + 80,
            analysis: 'Market shows strong growth potential with moderate competition. Entry barriers are manageable for well-executed solution with proper positioning.',
            marketSize: Math.floor(Math.random() * 20) + 75,
            competitionLevel: Math.floor(Math.random() * 30) + 60,
            marketTrends: Math.floor(Math.random() * 15) + 80,
            entryBarriers: Math.floor(Math.random() * 25) + 65
          }
        }));
        break;
      
      case 'revenue-modeling':
        setAnalysis(prev => ({
          ...prev,
          revenueModelAnalysis: {
            score: Math.floor(Math.random() * 20) + 75,
            confidence: Math.floor(Math.random() * 15) + 85,
            analysis: 'Multiple viable monetization strategies identified with strong scalability potential. Subscription model shows highest promise for recurring revenue.',
            monetizationViability: Math.floor(Math.random() * 15) + 80,
            pricingStrategy: Math.floor(Math.random() * 20) + 75,
            scalabilityPotential: Math.floor(Math.random() * 10) + 85,
            revenueStreams: ['Subscription plans', 'Premium features', 'Partner commissions', 'Enterprise licensing']
          }
        }));
        break;
      
      case 'distribution-analysis':
        setAnalysis(prev => ({
          ...prev,
          distributionAnalysis: {
            score: Math.floor(Math.random() * 25) + 70,
            confidence: Math.floor(Math.random() * 20) + 75,
            analysis: 'Strong digital distribution opportunities with potential for viral growth. Customer acquisition costs appear manageable with proper channel optimization.',
            channelAccessibility: Math.floor(Math.random() * 20) + 75,
            acquisitionCost: Math.floor(Math.random() * 25) + 65,
            networkEffects: Math.floor(Math.random() * 20) + 70,
            recommendedChannels: ['Content marketing', 'Social media', 'Partner referrals', 'App store optimization']
          }
        }));
        break;
    }
  };

  const completeAnalysis = () => {
    // Calculate overall score
    const scores = [
      analysis.problemValidation?.score || 0,
      analysis.marketAnalysis?.score || 0,
      analysis.revenueModelAnalysis?.score || 0,
      analysis.distributionAnalysis?.score || 0
    ];
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Determine recommendation
    let recommendation: 'pursue' | 'refine' | 'pivot' | 'abandon';
    if (overallScore >= 80) recommendation = 'pursue';
    else if (overallScore >= 65) recommendation = 'refine';
    else if (overallScore >= 45) recommendation = 'pivot';
    else recommendation = 'abandon';

    const completedAnalysis: ValidationAnalysis = {
      id: `analysis-${Date.now()}`,
      ideaId,
      problemValidation: analysis.problemValidation!,
      marketAnalysis: analysis.marketAnalysis!,
      revenueModelAnalysis: analysis.revenueModelAnalysis!,
      distributionAnalysis: analysis.distributionAnalysis!,
      overallScore,
      recommendation,
      keyInsights: [
        'Strong problem-market fit with validated pain points',
        'Growing market with room for differentiation',
        'Multiple viable monetization strategies available',
        'Digital-first distribution strategy recommended'
      ],
      actionItems: [
        'Develop minimum viable product (MVP)',
        'Conduct user interviews for validation',
        'Research competitor pricing strategies',
        'Build strategic partnerships for distribution'
      ],
      competitorAnalysis: [],
      benchmarkData: {
        industry: 'Technology',
        averageTimeToMarket: 12,
        typicalFundingRequired: '$500K - $2M',
        successRate: 35,
        commonFailureReasons: ['Poor product-market fit', 'Insufficient funding', 'Strong competition'],
        keyMetrics: { 'Customer Acquisition Cost': 50, 'Monthly Churn Rate': 5.2, 'Customer Lifetime Value': 1200 },
        industryTrends: ['AI integration', 'Mobile-first approach', 'Subscription models']
      },
      createdAt: new Date().toISOString(),
      creditsUsed: 5
    };

    setAnalysis(completedAnalysis);
    onAnalysisComplete?.(completedAnalysis);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 65) return 'text-yellow-500';
    if (score >= 45) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'pursue':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'refine':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'pivot':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'abandon':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">AI Validation Engine</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI agents are analyzing your idea across multiple dimensions to provide comprehensive validation insights.
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Validation Progress</h3>
                <Badge variant={analysisPhase === 'completed' ? 'default' : 'outline'}>
                  {analysisPhase === 'initializing' && 'Initializing'}
                  {analysisPhase === 'analyzing' && 'Analyzing'}
                  {analysisPhase === 'completed' && 'Completed'}
                </Badge>
              </div>
              <Progress value={totalProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {analysisPhase === 'completed' 
                    ? 'Analysis complete' 
                    : `Stage ${currentStage + 1} of ${analysisStages.length}`
                  }
                </span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Stages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {analysisStages.map((stage, index) => {
          const agent = agents.find(a => a.name === stage.agent);
          const isActive = index === currentStage && analysisPhase === 'analyzing';
          const isCompleted = index < currentStage || analysisPhase === 'completed';
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${isActive ? 'border-primary/50 bg-primary/5' : ''} transition-colors`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : isActive ? (
                          <Activity className="w-4 h-4 text-primary animate-pulse" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    
                    {agent && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{agent.name}</span>
                          <span className="font-medium">{Math.round(agent.progress)}%</span>
                        </div>
                        {isActive && (
                          <Progress value={agent.progress} className="h-1" />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Live Agent Activity */}
      <AnimatePresence>
        {analysisPhase === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Workflow className="w-5 h-5 text-secondary" />
                  <span>Agent Activity</span>
                </CardTitle>
                <CardDescription>
                  Real-time view of AI agents working on your validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.filter(agent => agent.status === 'working').map(agent => (
                    <div key={agent.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-sm text-muted-foreground">{Math.round(agent.progress)}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisPhase === 'completed' && analysis.overallScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Validation Complete</h3>
                    <p className="text-muted-foreground">Here's your comprehensive idea analysis</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge 
                        className={`text-lg px-4 py-2 ${getRecommendationColor(analysis.recommendation!)}`}
                      >
                        {analysis.recommendation?.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">Recommendation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="breakdown" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                <TabsTrigger value="insights">Key Insights</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
                <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              </TabsList>

              <TabsContent value="breakdown" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Problem Validation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span>Problem Validation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(analysis.problemValidation!.score)}`}>
                          {analysis.problemValidation!.score}
                        </span>
                      </div>
                      <Progress value={analysis.problemValidation!.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {analysis.problemValidation!.analysis}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pain Point Clarity</span>
                          <span>{analysis.problemValidation!.painPointClarity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target Audience Size</span>
                          <span>{analysis.problemValidation!.targetAudienceSize}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Urgency Level</span>
                          <span>{analysis.problemValidation!.urgencyLevel}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-secondary" />
                        <span>Market Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(analysis.marketAnalysis!.score)}`}>
                          {analysis.marketAnalysis!.score}
                        </span>
                      </div>
                      <Progress value={analysis.marketAnalysis!.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {analysis.marketAnalysis!.analysis}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Market Size</span>
                          <span>{analysis.marketAnalysis!.marketSize}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Competition Level</span>
                          <span>{analysis.marketAnalysis!.competitionLevel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Market Trends</span>
                          <span>{analysis.marketAnalysis!.marketTrends}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Revenue Model */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        <span>Revenue Model</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(analysis.revenueModelAnalysis!.score)}`}>
                          {analysis.revenueModelAnalysis!.score}
                        </span>
                      </div>
                      <Progress value={analysis.revenueModelAnalysis!.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {analysis.revenueModelAnalysis!.analysis}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Revenue Streams:</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.revenueModelAnalysis!.revenueStreams.map((stream, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {stream}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Distribution Strategy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span>Distribution Strategy</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(analysis.distributionAnalysis!.score)}`}>
                          {analysis.distributionAnalysis!.score}
                        </span>
                      </div>
                      <Progress value={analysis.distributionAnalysis!.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {analysis.distributionAnalysis!.analysis}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommended Channels:</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.distributionAnalysis!.recommendedChannels.map((channel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span>Key Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.keyInsights?.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Recommended Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.actionItems?.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <p className="text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benchmarks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <span>Industry Benchmarks</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Average Time to Market</p>
                        <p className="text-2xl font-bold">{analysis.benchmarkData?.averageTimeToMarket} months</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Typical Funding Required</p>
                        <p className="text-2xl font-bold">{analysis.benchmarkData?.typicalFundingRequired}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Success Rate</p>
                        <p className="text-2xl font-bold">{analysis.benchmarkData?.successRate}%</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Industry</p>
                        <p className="text-2xl font-bold">{analysis.benchmarkData?.industry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" onClick={onBack}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Hub
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button className="ff-btn-primary">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}