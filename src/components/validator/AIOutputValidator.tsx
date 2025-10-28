import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Shield,
  Eye,
  Zap,
  Settings,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Award,
  Target,
  FileText,
  Image,
  Code,
  MessageSquare,
  Sparkles,
  Clock,
  Filter,
  Download,
  Share2,
  Layers,
  Activity,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIValidationResult {
  id: string;
  modelName: string;
  outputType: 'text' | 'code' | 'image' | 'audio' | 'design';
  content: string;
  qualityScore: number;
  confidenceLevel: number;
  biasDetection: number;
  factualAccuracy: number;
  creativityScore: number;
  relevanceScore: number;
  lastValidation: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  issues: string[];
  recommendations: string[];
  usage: string;
  approvalStatus: 'approved' | 'pending' | 'rejected' | 'review_required';
}

interface BiasAnalysis {
  category: string;
  score: number;
  examples: string[];
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface QualityMetric {
  name: string;
  score: number;
  weight: number;
  description: string;
  benchmark: number;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'llm' | 'vision' | 'audio' | 'code';
  version: string;
  trustScore: number;
  totalOutputs: number;
  averageQuality: number;
  lastUsed: string;
  status: 'active' | 'deprecated' | 'testing';
}

export function AIOutputValidator() {
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [validationResults, setValidationResults] = useState<AIValidationResult[]>([]);
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState({
    overallQuality: 87,
    totalValidations: 1247,
    approvedOutputs: 1089,
    flaggedOutputs: 158,
    averageConfidence: 92,
    biasScore: 15
  });

  // Initialize data
  useEffect(() => {
    const initialResults: AIValidationResult[] = [
      {
        id: 'validation-1',
        modelName: 'GPT-4',
        outputType: 'text',
        content: 'Product description for Creator Commerce platform focusing on empowering content creators...',
        qualityScore: 94,
        confidenceLevel: 96,
        biasDetection: 8,
        factualAccuracy: 98,
        creativityScore: 88,
        relevanceScore: 92,
        lastValidation: '2 minutes ago',
        status: 'excellent',
        issues: [],
        recommendations: ['Consider adding more specific metrics'],
        usage: 'Product Marketing',
        approvalStatus: 'approved'
      },
      {
        id: 'validation-2',
        modelName: 'Claude-3',
        outputType: 'code',
        content: 'React component for validation dashboard with TypeScript support...',
        qualityScore: 89,
        confidenceLevel: 91,
        biasDetection: 5,
        factualAccuracy: 95,
        creativityScore: 85,
        relevanceScore: 94,
        lastValidation: '5 minutes ago',
        status: 'good',
        issues: ['Minor type safety concerns'],
        recommendations: ['Add more comprehensive error handling', 'Improve accessibility features'],
        usage: 'Code Generation',
        approvalStatus: 'approved'
      },
      {
        id: 'validation-3',
        modelName: 'DALL-E 3',
        outputType: 'image',
        content: 'Brand logo design for FlashFusion with orange and cyan color scheme...',
        qualityScore: 76,
        confidenceLevel: 82,
        biasDetection: 22,
        factualAccuracy: 88,
        creativityScore: 91,
        relevanceScore: 79,
        lastValidation: '8 minutes ago',
        status: 'warning',
        issues: ['Potential cultural bias in design elements', 'Brand consistency concerns'],
        recommendations: ['Review cultural sensitivity', 'Align with brand guidelines'],
        usage: 'Brand Design',
        approvalStatus: 'review_required'
      },
      {
        id: 'validation-4',
        modelName: 'Gemini Pro',
        outputType: 'text',
        content: 'Technical documentation for API integration with third-party platforms...',
        qualityScore: 91,
        confidenceLevel: 88,
        biasDetection: 12,
        factualAccuracy: 94,
        creativityScore: 72,
        relevanceScore: 96,
        lastValidation: '12 minutes ago',
        status: 'good',
        issues: ['Some technical jargon could be simplified'],
        recommendations: ['Add more examples', 'Include troubleshooting section'],
        usage: 'Documentation',
        approvalStatus: 'pending'
      }
    ];

    const initialModels: AIModel[] = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        type: 'llm',
        version: '1.0.0',
        trustScore: 94,
        totalOutputs: 456,
        averageQuality: 91,
        lastUsed: '1 minute ago',
        status: 'active'
      },
      {
        id: 'claude-3',
        name: 'Claude-3 Opus',
        provider: 'Anthropic',
        type: 'llm',
        version: '3.0.1',
        trustScore: 92,
        totalOutputs: 298,
        averageQuality: 89,
        lastUsed: '3 minutes ago',
        status: 'active'
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: 'OpenAI',
        type: 'vision',
        version: '3.0.0',
        trustScore: 78,
        totalOutputs: 89,
        averageQuality: 82,
        lastUsed: '8 minutes ago',
        status: 'testing'
      },
      {
        id: 'codex',
        name: 'GitHub Codex',
        provider: 'GitHub',
        type: 'code',
        version: '2.1.0',
        trustScore: 88,
        totalOutputs: 234,
        averageQuality: 86,
        lastUsed: '15 minutes ago',
        status: 'active'
      }
    ];

    const initialBiasAnalysis: BiasAnalysis[] = [
      {
        category: 'Gender Bias',
        score: 12,
        examples: ['Use of gendered language in role descriptions'],
        severity: 'low',
        recommendations: ['Use inclusive language patterns', 'Review gendered assumptions']
      },
      {
        category: 'Cultural Bias',
        score: 18,
        examples: ['Western-centric examples in documentation', 'Limited cultural representation in designs'],
        severity: 'medium',
        recommendations: ['Include diverse cultural perspectives', 'Test with global audiences']
      },
      {
        category: 'Technical Bias',
        score: 8,
        examples: ['Assumption of advanced technical knowledge'],
        severity: 'low',
        recommendations: ['Provide beginner-friendly explanations', 'Include glossary terms']
      }
    ];

    setValidationResults(initialResults);
    setAiModels(initialModels);
    setBiasAnalysis(initialBiasAnalysis);
  }, []);

  const runAIValidation = async () => {
    setIsRunningValidation(true);
    setValidationProgress(0);

    // Simulate validation process
    for (let i = 0; i <= 100; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setValidationProgress(i);
    }

    // Update some results after validation
    setValidationResults(prev => prev.map(result => ({
      ...result,
      lastValidation: 'just now',
      qualityScore: Math.min(100, result.qualityScore + Math.floor(Math.random() * 6) - 2)
    })));

    setQualityMetrics(prev => ({
      ...prev,
      overallQuality: Math.min(100, prev.overallQuality + Math.floor(Math.random() * 4) - 1)
    }));

    setIsRunningValidation(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'warning':
      case 'review_required':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'poor':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOutputTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'audio':
        return <MessageSquare className="w-4 h-4" />;
      case 'design':
        return <Layers className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const excellentOutputs = validationResults.filter(result => result.status === 'excellent').length;
  const warningOutputs = validationResults.filter(result => result.status === 'warning' || result.status === 'poor').length;
  const averageBias = biasAnalysis.reduce((sum, bias) => sum + bias.score, 0) / biasAnalysis.length;

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
          <h1 className="ff-text-gradient">AI Output Validator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive quality assurance for AI-generated content with bias detection, factual accuracy scoring, and automated approval workflows.
        </p>
      </motion.div>

      {/* Quality Metrics Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        <Card className="ff-card-interactive col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(qualityMetrics.overallQuality)}`}>
                    {qualityMetrics.overallQuality}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary" 
                     style={{ 
                       background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${qualityMetrics.overallQuality * 3.6}deg, transparent ${qualityMetrics.overallQuality * 3.6}deg)`
                     }}
                />
              </div>
              <div>
                <h3 className="font-medium">Quality Score</h3>
                <p className="text-sm text-muted-foreground">Overall AI output quality</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    High Quality
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
                <p className="text-sm text-muted-foreground">Excellent</p>
                <p className="text-2xl font-bold text-green-500">{excellentOutputs}</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Top Quality
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold text-yellow-500">{warningOutputs}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Review Needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold text-secondary">{qualityMetrics.averageConfidence}%</p>
              </div>
              <Target className="w-8 h-8 text-secondary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                High Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bias Score</p>
                <p className="text-2xl font-bold text-green-500">{Math.round(averageBias)}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500">
                Low Bias
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
          onClick={runAIValidation} 
          disabled={isRunningValidation}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningValidation ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Validating... {validationProgress}%
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Validate AI Outputs
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Auto-Approve Safe
        </Button>

        <Button variant="outline" size="lg">
          <Filter className="w-5 h-5 mr-2" />
          Filter Results
        </Button>

        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Validation Progress */}
      <AnimatePresence>
        {isRunningValidation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">Validating AI Output Quality</span>
                  </div>
                  <Progress value={validationProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing quality, bias, accuracy, and creativity metrics...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Validation Results</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
            <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
          </TabsList>

          {/* Validation Results Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              {validationResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getOutputTypeIcon(result.outputType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(result.status)}
                              <h4 className="font-medium">{result.modelName}</h4>
                              <Badge variant="outline">
                                {result.outputType.toUpperCase()}
                              </Badge>
                              <Badge className={
                                result.approvalStatus === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                result.approvalStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                result.approvalStatus === 'review_required' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                'bg-red-500/10 text-red-500 border-red-500/20'
                              }>
                                {result.approvalStatus.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {result.content}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Quality</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={result.qualityScore} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${getScoreColor(result.qualityScore)}`}>
                                    {result.qualityScore}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Confidence</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={result.confidenceLevel} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${getScoreColor(result.confidenceLevel)}`}>
                                    {result.confidenceLevel}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Accuracy</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={result.factualAccuracy} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${getScoreColor(result.factualAccuracy)}`}>
                                    {result.factualAccuracy}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Bias Risk</p>
                                <div className="flex items-center space-x-2">
                                  <Progress value={100 - result.biasDetection} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${result.biasDetection < 20 ? 'text-green-500' : result.biasDetection < 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {result.biasDetection}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {result.issues.length > 0 && (
                              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-3">
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Issues Found:</p>
                                <ul className="text-sm space-y-1">
                                  {result.issues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                      <span className="text-yellow-500 mt-0.5">•</span>
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Usage: {result.usage} • Last validated: {result.lastValidation}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          {result.approvalStatus === 'review_required' && (
                            <Button size="sm" className="ff-btn-primary">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="ff-card-interactive">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.provider} • v{model.version}</p>
                          </div>
                        </div>
                        <Badge variant={model.status === 'active' ? "outline" : model.status === 'testing' ? "secondary" : "destructive"}>
                          {model.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Trust Score:</span>
                          <span className={`font-medium ${getScoreColor(model.trustScore)}`}>
                            {model.trustScore}
                          </span>
                        </div>
                        <Progress value={model.trustScore} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Outputs:</span>
                            <p className="font-medium">{model.totalOutputs}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Quality:</span>
                            <p className="font-medium">{model.averageQuality}</p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Last used: {model.lastUsed}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Monitor
                        </Button>
                        <Button size="sm" className="ff-btn-secondary flex-1">
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Bias Analysis Tab */}
          <TabsContent value="bias" className="space-y-6">
            <div className="space-y-4">
              {biasAnalysis.map((bias, index) => (
                <motion.div
                  key={bias.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`ff-card-interactive ${
                    bias.severity === 'high' ? 'border-red-500/20 bg-red-500/5' :
                    bias.severity === 'medium' ? 'border-yellow-500/20 bg-yellow-500/5' :
                    'border-green-500/20 bg-green-500/5'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{bias.category}</h4>
                            <Badge className={
                              bias.severity === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              bias.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                              'bg-green-500/10 text-green-500 border-green-500/20'
                            }>
                              {bias.severity.toUpperCase()} RISK
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Bias Score:</span>
                              <span className={`font-medium ${bias.score < 20 ? 'text-green-500' : bias.score < 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {bias.score}%
                              </span>
                            </div>
                            <Progress value={bias.score} className="h-2" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium mb-2">Examples:</p>
                              <ul className="text-sm space-y-1">
                                {bias.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <span className="text-muted-foreground mt-0.5">•</span>
                                    <span>{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="text-sm font-medium mb-2">Recommendations:</p>
                              <ul className="text-sm space-y-1">
                                {bias.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" className="ff-btn-primary">
                          <Zap className="w-3 h-3 mr-1" />
                          Mitigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Quality Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                  <CardDescription>AI output quality over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-2">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Quality metrics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                  <CardDescription>Comparative analysis across AI models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-2">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Performance comparison</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}