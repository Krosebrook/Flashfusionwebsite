import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Target, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Users,
  Brain,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Share2,
  BarChart3,
  Lightbulb,
  Rocket,
  Shield,
  Award,
  ArrowRight,
  Sparkles,
  FileText,
  Mic,
  Upload,
  Settings,
  Layers,
  Database,
  Globe,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ValidationIdea, ValidationAnalysis, ValidationWorkflow, ValidationAgent } from '../../types/core';

interface ValidationNexusHubProps {
  onNavigate?: (page: string) => void;
}

export function ValidationNexusHub({ onNavigate }: ValidationNexusHubProps) {
  const [ideas, setIdeas] = useState<ValidationIdea[]>([]);
  const [analyses, setAnalyses] = useState<ValidationAnalysis[]>([]);
  const [workflows, setWorkflows] = useState<ValidationWorkflow[]>([]);
  const [agents, setAgents] = useState<ValidationAgent[]>([]);
  const [userCredits, setUserCredits] = useState(47);
  const [activeValidations, setActiveValidations] = useState(0);
  const [completedValidations, setCompletedValidations] = useState(23);

  // Sample data initialization
  useEffect(() => {
    const sampleIdeas: ValidationIdea[] = [
      {
        id: '1',
        title: 'AI-Powered Meal Planning App',
        description: 'A SaaS platform that creates personalized meal plans based on dietary restrictions, budget, and local ingredient availability',
        category: 'saas',
        targetAudience: 'Health-conscious millennials and busy families',
        problemStatement: 'People struggle to plan healthy meals that fit their budget and dietary needs',
        proposedSolution: 'AI-driven meal planning with smart grocery integration',
        inputMethod: 'text',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        status: 'completed',
        userId: 'user-1'
      },
      {
        id: '2',
        title: 'Sustainable Packaging Marketplace',
        description: 'An eCommerce platform connecting businesses with eco-friendly packaging suppliers',
        category: 'marketplace',
        targetAudience: 'Small to medium businesses looking for sustainable packaging',
        problemStatement: 'Businesses struggle to find affordable, sustainable packaging options',
        proposedSolution: 'Curated marketplace with supplier verification and bulk pricing',
        inputMethod: 'document',
        createdAt: '2024-01-18T14:30:00Z',
        updatedAt: '2024-01-18T14:30:00Z',
        status: 'analyzing',
        userId: 'user-1'
      },
      {
        id: '3',
        title: 'Digital Creator Collaboration Platform',
        description: 'A content platform enabling seamless collaboration between creators, editors, and brands',
        category: 'content',
        targetAudience: 'Content creators, video editors, and marketing agencies',
        problemStatement: 'Creators waste time on project management instead of creating content',
        proposedSolution: 'Integrated workspace with AI-powered workflow optimization',
        inputMethod: 'voice',
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z',
        status: 'submitted',
        userId: 'user-1'
      }
    ];

    const sampleAnalyses: ValidationAnalysis[] = [
      {
        id: '1',
        ideaId: '1',
        problemValidation: {
          score: 87,
          confidence: 92,
          analysis: 'Strong problem-market fit with validated pain points in meal planning',
          painPointClarity: 90,
          targetAudienceSize: 85,
          urgencyLevel: 82,
          evidenceStrength: 88
        },
        marketAnalysis: {
          score: 78,
          confidence: 85,
          analysis: 'Growing market with room for differentiation despite existing competitors',
          marketSize: 82,
          competitionLevel: 75,
          marketTrends: 88,
          entryBarriers: 70
        },
        revenueModelAnalysis: {
          score: 83,
          confidence: 89,
          analysis: 'Multiple viable monetization strategies with subscription model showing strongest potential',
          monetizationViability: 85,
          pricingStrategy: 80,
          scalabilityPotential: 88,
          revenueStreams: ['Subscription plans', 'Partnership commissions', 'Premium features']
        },
        distributionAnalysis: {
          score: 75,
          confidence: 80,
          analysis: 'Strong digital distribution channels with potential for partnerships',
          channelAccessibility: 78,
          acquisitionCost: 72,
          networkEffects: 75,
          recommendedChannels: ['App stores', 'Social media marketing', 'Health & fitness partnerships']
        },
        overallScore: 81,
        recommendation: 'pursue',
        keyInsights: [
          'High demand for personalized nutrition solutions',
          'Strong potential for recurring revenue',
          'Opportunity to leverage AI for competitive advantage'
        ],
        actionItems: [
          'Develop MVP with core meal planning features',
          'Validate AI recommendations with user testing',
          'Explore partnerships with grocery delivery services'
        ],
        competitorAnalysis: [],
        benchmarkData: {
          industry: 'Health Tech',
          averageTimeToMarket: 12,
          typicalFundingRequired: '$500K - $2M',
          successRate: 35,
          commonFailureReasons: ['Poor user retention', 'High acquisition costs', 'Limited differentiation'],
          keyMetrics: { 'Monthly Active Users': 10000, 'Monthly Churn Rate': 8.5, 'Customer Acquisition Cost': 25 },
          industryTrends: ['AI-powered personalization', 'Integration with wearables', 'Sustainability focus']
        },
        createdAt: '2024-01-15T11:30:00Z',
        creditsUsed: 5
      }
    ];

    const sampleAgents: ValidationAgent[] = [
      {
        id: 'agent-1',
        name: 'Problem Validator Pro',
        type: 'problem-validator',
        status: 'idle',
        progress: 100,
        capabilities: ['Problem clarity analysis', 'Pain point validation', 'Target audience sizing'],
        lastActive: '2024-01-20T10:30:00Z'
      },
      {
        id: 'agent-2',
        name: 'Market Intelligence',
        type: 'market-analyzer',
        status: 'working',
        currentTask: 'Analyzing sustainable packaging market trends',
        progress: 65,
        capabilities: ['Market size estimation', 'Competitive analysis', 'Trend identification'],
        lastActive: '2024-01-20T11:45:00Z'
      },
      {
        id: 'agent-3',
        name: 'Revenue Architect',
        type: 'revenue-modeler',
        status: 'idle',
        progress: 100,
        capabilities: ['Business model validation', 'Pricing strategy', 'Revenue forecasting'],
        lastActive: '2024-01-20T09:15:00Z'
      },
      {
        id: 'agent-4',
        name: 'Distribution Strategist',
        type: 'distribution-strategist',
        status: 'idle',
        progress: 100,
        capabilities: ['Channel optimization', 'Go-to-market strategy', 'Partnership identification'],
        lastActive: '2024-01-20T08:45:00Z'
      }
    ];

    setIdeas(sampleIdeas);
    setAnalyses(sampleAnalyses);
    setAgents(sampleAgents);
    setActiveValidations(sampleIdeas.filter(idea => ['submitted', 'analyzing'].includes(idea.status)).length);
  }, []);

  const getIdeaStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'analyzing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'submitted':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
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

  const handleStartValidation = () => {
    onNavigate?.('idea-validator');
  };

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
              <Target className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
            <h1 className="ff-text-gradient">FlashFusion Validation Nexus</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The intelligent validation hub for SaaS, eCommerce, and content products. Transform raw ideas into actionable business intelligence with AI-driven heuristics and real-time market analysis.
          </p>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <p className="text-2xl font-bold text-primary">{userCredits}</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Premium Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Validations</p>
                  <p className="text-2xl font-bold text-secondary">{activeValidations}</p>
                </div>
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  In Progress
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-accent">{completedValidations}</p>
                </div>
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-purple-500 border-purple-500">
                  All Time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-green-500">73%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Above Average
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Agents Active</p>
                  <p className="text-2xl font-bold text-orange-500">{agents.filter(a => a.status === 'working').length}</p>
                </div>
                <Workflow className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  Processing
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Button 
            onClick={handleStartValidation}
            className="h-16 ff-btn-primary group"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-medium">New Validation</div>
                <div className="text-xs opacity-80">Submit an idea</div>
              </div>
            </div>
          </Button>

          <Button 
            onClick={() => onNavigate?.('market-analyzer')}
            className="h-16 ff-btn-secondary group"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-medium">Market Analysis</div>
                <div className="text-xs opacity-80">Deep dive insights</div>
              </div>
            </div>
          </Button>

          <Button 
            onClick={() => onNavigate?.('validation-reports')}
            className="h-16 ff-btn-accent group"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-medium">View Reports</div>
                <div className="text-xs opacity-80">Generated insights</div>
              </div>
            </div>
          </Button>

          <Button 
            variant="outline"
            className="h-16 border-primary/20 hover:border-primary/40 group"
            size="lg"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <div className="text-left">
                <div className="font-medium">Agent Settings</div>
                <div className="text-xs opacity-60">Configure AI</div>
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="ideas" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="ideas">My Ideas</TabsTrigger>
              <TabsTrigger value="validation">Live Validation</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="research">Research Logs</TabsTrigger>
            </TabsList>

            {/* Ideas Tab */}
            <TabsContent value="ideas" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Your Ideas</h3>
                  <p className="text-sm text-muted-foreground">Track and manage your submitted ideas</p>
                </div>
                <Button onClick={handleStartValidation} className="ff-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Idea
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive group h-full">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                              {idea.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {idea.description}
                            </p>
                          </div>
                          {getIdeaStatusIcon(idea.status)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <Badge variant="outline" className="capitalize">
                              {idea.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Input Method:</span>
                            <div className="flex items-center space-x-1">
                              {idea.inputMethod === 'text' && <FileText className="w-3 h-3" />}
                              {idea.inputMethod === 'voice' && <Mic className="w-3 h-3" />}
                              {idea.inputMethod === 'document' && <Upload className="w-3 h-3" />}
                              <span className="capitalize">{idea.inputMethod}</span>
                            </div>
                          </div>
                        </div>

                        {idea.status === 'completed' && analyses.find(a => a.ideaId === idea.id) && (
                          <div className="pt-3 border-t space-y-2">
                            {(() => {
                              const analysis = analyses.find(a => a.ideaId === idea.id);
                              return analysis ? (
                                <>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Overall Score:</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                                          style={{ width: `${analysis.overallScore}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium">{analysis.overallScore}</span>
                                    </div>
                                  </div>
                                  <Badge 
                                    className={`w-full justify-center ${getRecommendationColor(analysis.recommendation)}`}
                                  >
                                    {analysis.recommendation.toUpperCase()}
                                  </Badge>
                                </>
                              ) : null;
                            })()}
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          {idea.status === 'completed' && (
                            <Button size="sm" className="ff-btn-secondary flex-1">
                              <Download className="w-3 h-3 mr-1" />
                              Report
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Live Validation Tab */}
            <TabsContent value="validation" className="space-y-6">
              <div>
                <h3>Live Validation Pipeline</h3>
                <p className="text-sm text-muted-foreground">Monitor real-time validation processes</p>
              </div>

              <div className="space-y-4">
                {ideas.filter(idea => ['submitted', 'analyzing'].includes(idea.status)).map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{idea.title}</h4>
                            <p className="text-sm text-muted-foreground">{idea.category.toUpperCase()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getIdeaStatusIcon(idea.status)}
                            <span className="text-sm capitalize">{idea.status}</span>
                          </div>
                        </div>

                        {idea.status === 'analyzing' && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Problem Validation</span>
                                <span>Completed</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Market Analysis</span>
                                <span>65% Complete</span>
                              </div>
                              <Progress value={65} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Revenue Modeling</span>
                                <span>Pending</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Distribution Strategy</span>
                                <span>Pending</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Estimated completion: 
                            <span className="font-medium ml-1">
                              {idea.status === 'analyzing' ? '~15 minutes' : '~20 minutes'}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Monitor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {ideas.filter(idea => ['submitted', 'analyzing'].includes(idea.status)).length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Active Validations</h3>
                    <p className="text-muted-foreground mb-4">Submit a new idea to start the validation process</p>
                    <Button onClick={handleStartValidation} className="ff-btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Validation
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="agents" className="space-y-6">
              <div>
                <h3>AI Agent Orchestra</h3>
                <p className="text-sm text-muted-foreground">Monitor and configure your validation agents</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              agent.status === 'working' ? 'bg-green-500 animate-pulse' :
                              agent.status === 'idle' ? 'bg-gray-500' :
                              agent.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <h4 className="font-medium">{agent.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {agent.type.replace('-', ' ')}
                              </p>
                            </div>
                          </div>
                          <Badge variant={agent.status === 'working' ? 'default' : 'outline'}>
                            {agent.status}
                          </Badge>
                        </div>

                        {agent.currentTask && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium mb-2">Current Task:</p>
                            <p className="text-sm text-muted-foreground">{agent.currentTask}</p>
                            <div className="mt-2">
                              <Progress value={agent.progress} className="h-2" />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Capabilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.map((capability, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm">
                          <span className="text-muted-foreground">
                            Last active: {new Date(agent.lastActive).toLocaleDateString()}
                          </span>
                          <Button size="sm" variant="outline">
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

            {/* Benchmarks Tab */}
            <TabsContent value="benchmarks" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Industry Benchmarks</h3>
                  <p className="text-sm text-muted-foreground">Access premium competitive intelligence</p>
                </div>
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                  Premium Feature
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { industry: 'SaaS', companies: 1247, avgScore: 73, trending: 'up' },
                  { industry: 'eCommerce', companies: 892, avgScore: 68, trending: 'up' },
                  { industry: 'Content Platforms', companies: 534, avgScore: 71, trending: 'down' },
                  { industry: 'Marketplaces', companies: 328, avgScore: 69, trending: 'up' },
                  { industry: 'Mobile Apps', companies: 1156, avgScore: 65, trending: 'stable' },
                  { industry: 'AI/ML Tools', companies: 429, avgScore: 78, trending: 'up' }
                ].map((benchmark, index) => (
                  <motion.div
                    key={benchmark.industry}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{benchmark.industry}</h4>
                          <div className={`flex items-center space-x-1 text-sm ${
                            benchmark.trending === 'up' ? 'text-green-500' :
                            benchmark.trending === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            <TrendingUp className={`w-3 h-3 ${
                              benchmark.trending === 'down' ? 'rotate-180' : 
                              benchmark.trending === 'stable' ? 'rotate-45' : ''
                            }`} />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Companies analyzed:</span>
                            <span className="font-medium">{benchmark.companies.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg. validation score:</span>
                            <span className="font-medium">{benchmark.avgScore}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                              style={{ width: `${benchmark.avgScore}%` }}
                            />
                          </div>
                        </div>

                        <Button size="sm" variant="outline" className="w-full mt-4">
                          <Database className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Research Logs Tab */}
            <TabsContent value="research" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Automated Research Logs</h3>
                  <p className="text-sm text-muted-foreground">Notion integration via Zapier</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-blue-500 border-blue-500">
                    <Globe className="w-3 h-3 mr-1" />
                    Notion Connected
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>

              <div className="text-center py-12">
                <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Research Logs Integration</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  All validation research and insights are automatically documented in your connected Notion workspace
                </p>
                <Button className="ff-btn-primary">
                  <Globe className="w-4 h-4 mr-2" />
                  View in Notion
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h4 className="font-medium">Ready to validate your next big idea?</h4>
              <p className="text-sm text-muted-foreground">Get AI-powered insights in minutes, not weeks</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Learn More
              </Button>
              <Button onClick={handleStartValidation} className="ff-btn-primary">
                <Rocket className="w-4 h-4 mr-2" />
                Start Validation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}