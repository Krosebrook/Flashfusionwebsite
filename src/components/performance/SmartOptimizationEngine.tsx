import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { 
  Zap, 
  TrendingUp,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Rocket,
  Shield,
  Globe,
  Smartphone,
  Image,
  Code,
  Database,
  Server,
  Users,
  DollarSign,
  Clock,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Share,
  ArrowRight,
  ChevronRight,
  Star,
  Gauge,
  Brain,
  Wand2,
  Sparkles,
  BarChart3,
  LineChart,
  Activity
} from 'lucide-react';

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'seo' | 'ux' | 'security' | 'accessibility' | 'conversion';
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: {
    performance: number;
    user_experience: number;
    business_value: number;
    difficulty: number;
  };
  estimated_improvement: string;
  implementation_time: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  steps: string[];
  technical_details: string;
  metrics_affected: string[];
  estimated_savings?: string;
  confidence_score: number;
}

interface PerformanceScore {
  overall: number;
  categories: {
    speed: number;
    accessibility: number;
    seo: number;
    best_practices: number;
    pwa: number;
    security: number;
  };
}

interface OptimizationPlan {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
  estimated_impact: string;
  timeline: string;
  cost_estimate: string;
  roi_projection: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
}

const SmartOptimizationEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [performanceScore, setPerformanceScore] = useState<PerformanceScore>({
    overall: 78,
    categories: {
      speed: 82,
      accessibility: 74,
      seo: 89,
      best_practices: 71,
      pwa: 65,
      security: 85
    }
  });
  const [optimizationPlans, setOptimizationPlans] = useState<OptimizationPlan[]>([]);

  // Initialize recommendations
  const initializeRecommendations = useCallback(() => {
    const baseRecommendations: OptimizationRecommendation[] = [
      {
        id: 'opt-001',
        title: 'Implement Advanced Image Optimization',
        description: 'Convert images to next-gen formats (WebP, AVIF) and implement lazy loading to reduce initial page load time by 35-45%',
        category: 'performance',
        priority: 'high',
        impact: {
          performance: 85,
          user_experience: 75,
          business_value: 70,
          difficulty: 40
        },
        estimated_improvement: '35-45% faster loading',
        implementation_time: '1-2 weeks',
        status: 'pending',
        steps: [
          'Audit current image usage and formats',
          'Set up automated image conversion pipeline',
          'Implement responsive image loading',
          'Add lazy loading for below-the-fold images',
          'Configure CDN for optimized delivery'
        ],
        technical_details: 'Utilize modern image formats and implement intersection observer for lazy loading',
        metrics_affected: ['LCP', 'CLS', 'Page Load Time', 'Bandwidth Usage'],
        estimated_savings: '$2,400/month in bandwidth costs',
        confidence_score: 92
      },
      {
        id: 'opt-002',
        title: 'Advanced Code Splitting Strategy',
        description: 'Implement route-based and component-based code splitting to reduce initial bundle size and improve Time to Interactive',
        category: 'performance',
        priority: 'high',
        impact: {
          performance: 80,
          user_experience: 70,
          business_value: 65,
          difficulty: 60
        },
        estimated_improvement: '25-35% smaller bundles',
        implementation_time: '2-3 weeks',
        status: 'pending',
        steps: [
          'Analyze current bundle composition',
          'Identify optimal split points',
          'Implement dynamic imports for routes',
          'Set up component-level code splitting',
          'Configure preloading strategies'
        ],
        technical_details: 'Use webpack bundle analyzer and implement strategic dynamic imports',
        metrics_affected: ['FCP', 'TTI', 'Bundle Size', 'Cache Efficiency'],
        confidence_score: 88
      },
      {
        id: 'opt-003',
        title: 'Enhanced Accessibility Compliance',
        description: 'Improve accessibility score from 74% to 95%+ by implementing ARIA labels, keyboard navigation, and screen reader optimization',
        category: 'accessibility',
        priority: 'medium',
        impact: {
          performance: 20,
          user_experience: 90,
          business_value: 55,
          difficulty: 45
        },
        estimated_improvement: '21-point accessibility increase',
        implementation_time: '1-2 weeks',
        status: 'pending',
        steps: [
          'Conduct accessibility audit',
          'Implement semantic HTML structure',
          'Add comprehensive ARIA labels',
          'Ensure keyboard navigation support',
          'Optimize for screen readers'
        ],
        technical_details: 'Follow WCAG 2.1 AA guidelines and implement proper focus management',
        metrics_affected: ['Accessibility Score', 'User Engagement', 'Legal Compliance'],
        confidence_score: 95
      },
      {
        id: 'opt-004',
        title: 'Intelligent Caching Strategy',
        description: 'Implement multi-layered caching including service workers, CDN optimization, and intelligent cache invalidation',
        category: 'performance',
        priority: 'critical',
        impact: {
          performance: 90,
          user_experience: 85,
          business_value: 80,
          difficulty: 55
        },
        estimated_improvement: '60-70% faster repeat visits',
        implementation_time: '2-4 weeks',
        status: 'pending',
        steps: [
          'Design caching architecture',
          'Implement service worker with intelligent caching',
          'Configure CDN with optimal cache headers',
          'Set up cache invalidation strategies',
          'Monitor cache hit rates and performance'
        ],
        technical_details: 'Combine browser caching, service workers, and CDN for optimal performance',
        metrics_affected: ['Page Load Time', 'Server Load', 'User Retention', 'Bandwidth Usage'],
        estimated_savings: '$3,200/month in server costs',
        confidence_score: 90
      },
      {
        id: 'opt-005',
        title: 'Mobile-First UX Optimization',
        description: 'Optimize mobile user experience to reduce bounce rate by 25% and improve mobile conversion rates',
        category: 'ux',
        priority: 'high',
        impact: {
          performance: 60,
          user_experience: 95,
          business_value: 85,
          difficulty: 50
        },
        estimated_improvement: '25% reduction in mobile bounce rate',
        implementation_time: '3-4 weeks',
        status: 'pending',
        steps: [
          'Analyze mobile user behavior patterns',
          'Redesign mobile navigation and interactions',
          'Implement touch-friendly interface elements',
          'Optimize mobile form experiences',
          'Test across various mobile devices'
        ],
        technical_details: 'Focus on touch targets, thumb-friendly navigation, and mobile-specific interactions',
        metrics_affected: ['Mobile Bounce Rate', 'Mobile Conversion Rate', 'User Engagement'],
        confidence_score: 87
      },
      {
        id: 'opt-006',
        title: 'Advanced SEO Technical Implementation',
        description: 'Implement structured data, improve Core Web Vitals, and optimize for featured snippets to increase organic traffic by 30-40%',
        category: 'seo',
        priority: 'medium',
        impact: {
          performance: 40,
          user_experience: 50,
          business_value: 90,
          difficulty: 35
        },
        estimated_improvement: '30-40% organic traffic increase',
        implementation_time: '2-3 weeks',
        status: 'pending',
        steps: [
          'Implement comprehensive structured data',
          'Optimize for Core Web Vitals',
          'Create content for featured snippets',
          'Improve internal linking structure',
          'Set up advanced analytics tracking'
        ],
        technical_details: 'Use JSON-LD structured data and optimize for Google page experience signals',
        metrics_affected: ['Organic Traffic', 'Search Rankings', 'Click-Through Rate'],
        confidence_score: 85
      }
    ];

    const plans: OptimizationPlan[] = [
      {
        id: 'plan-001',
        name: 'Performance Boost Initiative',
        description: 'Comprehensive performance optimization focusing on Core Web Vitals and user experience improvements',
        recommendations: ['opt-001', 'opt-002', 'opt-004'],
        estimated_impact: '45-60% performance improvement',
        timeline: '6-8 weeks',
        cost_estimate: '$12,000 - $18,000',
        roi_projection: '280% ROI within 6 months',
        status: 'draft'
      },
      {
        id: 'plan-002',
        name: 'Accessibility & UX Enhancement',
        description: 'Focus on making the platform more accessible and user-friendly across all devices',
        recommendations: ['opt-003', 'opt-005'],
        estimated_impact: 'WCAG 2.1 AA compliance + 25% mobile improvement',
        timeline: '4-5 weeks',
        cost_estimate: '$8,000 - $12,000',
        roi_projection: '150% ROI through increased user retention',
        status: 'approved'
      }
    ];

    setRecommendations(baseRecommendations);
    setOptimizationPlans(plans);
  }, []);

  // Simulate analysis process
  const performAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setAnalysisProgress(i);
    }

    // Update performance scores with slight improvements
    setPerformanceScore(prev => ({
      overall: Math.min(100, prev.overall + Math.random() * 5),
      categories: {
        speed: Math.min(100, prev.categories.speed + Math.random() * 3),
        accessibility: Math.min(100, prev.categories.accessibility + Math.random() * 4),
        seo: Math.min(100, prev.categories.seo + Math.random() * 2),
        best_practices: Math.min(100, prev.categories.best_practices + Math.random() * 6),
        pwa: Math.min(100, prev.categories.pwa + Math.random() * 8),
        security: Math.min(100, prev.categories.security + Math.random() * 3)
      }
    }));

    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }, []);

  // Initialize data
  useEffect(() => {
    initializeRecommendations();
  }, [initializeRecommendations]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false;
      return true;
    });
  }, [recommendations, selectedCategory, selectedPriority]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'seo': return <Globe className="h-4 w-4" />;
      case 'ux': return <Users className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'accessibility': return <Eye className="h-4 w-4" />;
      case 'conversion': return <Target className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const updateRecommendationStatus = (id: string, status: OptimizationRecommendation['status']) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, status } : rec
    ));
  };

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="ff-text-2xl font-bold ff-text-gradient font-sora">
                Smart Optimization Engine
              </h1>
              <p className="ff-text-sm text-muted-foreground font-inter">
                AI-powered recommendations for performance, UX, and business optimization
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="default" className="ff-badge-glow">
            <Star className="h-3 w-3 mr-1" />
            Overall Score: {Math.round(performanceScore.overall)}%
          </Badge>
          
          <Button
            onClick={performAnalysis}
            disabled={isAnalyzing}
            className="ff-btn-primary ff-hover-glow"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-medium font-sora">
                      AI Analysis in Progress
                    </span>
                    <span className="ff-text-sm text-muted-foreground">
                      {analysisProgress}%
                    </span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                  <p className="ff-text-xs text-muted-foreground font-inter">
                    Analyzing performance metrics, user behavior, and optimization opportunities...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Score Dashboard */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sora">
            <Gauge className="h-5 w-5 text-blue-500" />
            Performance Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className={`ff-text-3xl font-bold ${getScoreColor(performanceScore.overall)} font-sora`}>
                {Math.round(performanceScore.overall)}
              </div>
              <p className="ff-text-sm text-muted-foreground font-inter">Overall</p>
              <div className="mt-2">
                <Progress value={performanceScore.overall} className="h-2" />
              </div>
            </div>
            
            {Object.entries(performanceScore.categories).map(([category, score]) => {
              const icons = {
                speed: Zap,
                accessibility: Eye,
                seo: Globe,
                best_practices: CheckCircle,
                pwa: Smartphone,
                security: Shield
              };
              const Icon = icons[category as keyof typeof icons];
              
              return (
                <div key={category} className="text-center p-4 rounded-lg bg-muted/30">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${getScoreColor(score)}`} />
                  <div className={`ff-text-2xl font-bold ${getScoreColor(score)} font-sora`}>
                    {Math.round(score)}
                  </div>
                  <p className="ff-text-xs text-muted-foreground capitalize font-inter">
                    {category.replace('_', ' ')}
                  </p>
                  <div className="mt-2">
                    <Progress value={score} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="ff-text-sm font-medium font-sora">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 rounded-md border bg-background ff-text-sm font-inter"
          >
            <option value="all">All Categories</option>
            <option value="performance">Performance</option>
            <option value="seo">SEO</option>
            <option value="ux">User Experience</option>
            <option value="security">Security</option>
            <option value="accessibility">Accessibility</option>
            <option value="conversion">Conversion</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="ff-text-sm font-medium font-sora">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1 rounded-md border bg-background ff-text-sm font-inter"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <Badge variant="outline" className="ff-text-xs">
          {filteredRecommendations.length} recommendations
        </Badge>
      </div>

      {/* Optimization Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="plans">Optimization Plans</TabsTrigger>
          <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(recommendation.category)}
                            <h3 className="font-semibold font-sora">{recommendation.title}</h3>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority}
                            </Badge>
                            <Badge variant="outline" className="ff-text-xs">
                              {recommendation.confidence_score}% confidence
                            </Badge>
                          </div>
                          <p className="ff-text-sm text-muted-foreground font-inter">
                            {recommendation.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="ff-hover-scale">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="ff-btn-primary ff-hover-glow"
                            onClick={() => updateRecommendationStatus(recommendation.id, 'in_progress')}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Implement
                          </Button>
                        </div>
                      </div>

                      {/* Impact Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                        {Object.entries(recommendation.impact).map(([metric, value]) => (
                          <div key={metric} className="text-center">
                            <div className={`ff-text-lg font-bold ${getScoreColor(value)} font-sora`}>
                              {value}%
                            </div>
                            <p className="ff-text-xs text-muted-foreground capitalize font-inter">
                              {metric.replace('_', ' ')}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Key Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ff-text-sm">
                        <div className="space-y-1">
                          <p className="font-medium font-sora">Estimated Improvement</p>
                          <p className="text-green-600 font-semibold">{recommendation.estimated_improvement}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium font-sora">Implementation Time</p>
                          <p className="text-muted-foreground font-inter">{recommendation.implementation_time}</p>
                        </div>
                        {recommendation.estimated_savings && (
                          <div className="space-y-1">
                            <p className="font-medium font-sora">Estimated Savings</p>
                            <p className="text-green-600 font-semibold">{recommendation.estimated_savings}</p>
                          </div>
                        )}
                      </div>

                      {/* Implementation Steps */}
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold font-sora">Implementation Steps</h4>
                        <div className="space-y-2">
                          {recommendation.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary ff-text-xs font-bold mt-0.5">
                                {stepIndex + 1}
                              </div>
                              <p className="ff-text-sm text-muted-foreground font-inter">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metrics Affected */}
                      <div className="flex flex-wrap gap-2">
                        <span className="ff-text-sm font-medium font-sora">Metrics affected:</span>
                        {recommendation.metrics_affected.map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="ff-text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="space-y-4">
            {optimizationPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="font-sora">{plan.name}</CardTitle>
                        <p className="ff-text-sm text-muted-foreground font-inter">
                          {plan.description}
                        </p>
                      </div>
                      <Badge 
                        variant={plan.status === 'approved' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {plan.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="ff-text-sm font-medium font-sora">Estimated Impact</p>
                        <p className="ff-text-sm text-green-600 font-semibold">{plan.estimated_impact}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="ff-text-sm font-medium font-sora">Timeline</p>
                        <p className="ff-text-sm text-muted-foreground font-inter">{plan.timeline}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="ff-text-sm font-medium font-sora">Cost Estimate</p>
                        <p className="ff-text-sm text-muted-foreground font-inter">{plan.cost_estimate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="ff-text-sm font-medium font-sora">ROI Projection</p>
                        <p className="ff-text-sm text-green-600 font-semibold">{plan.roi_projection}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <p className="ff-text-sm font-medium font-sora">
                        Included Recommendations ({plan.recommendations.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plan.recommendations.map((recId) => {
                          const rec = recommendations.find(r => r.id === recId);
                          return rec ? (
                            <Badge key={recId} variant="outline" className="ff-text-xs">
                              {rec.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" className="ff-hover-scale">
                        <Share className="h-4 w-4 mr-2" />
                        Share Plan
                      </Button>
                      <Button size="sm" className="ff-btn-primary ff-hover-glow">
                        <Rocket className="h-4 w-4 mr-2" />
                        Start Implementation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="ff-text-base font-sora">Potential Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="ff-text-3xl font-bold text-green-500 font-sora">+45%</div>
                    <p className="ff-text-sm text-muted-foreground font-inter">Performance Improvement</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between ff-text-sm">
                      <span className="font-inter">Current Score</span>
                      <span className="font-sora">{Math.round(performanceScore.overall)}%</span>
                    </div>
                    <Progress value={performanceScore.overall} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="ff-text-base font-sora">Business Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Monthly Savings</span>
                    <span className="ff-text-sm font-bold text-green-600 font-sora">$5,600</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Revenue Increase</span>
                    <span className="ff-text-sm font-bold text-green-600 font-sora">$18,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Annual ROI</span>
                    <span className="ff-text-sm font-bold text-green-600 font-sora">285%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="ff-text-base font-sora">Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Total Items</span>
                    <span className="ff-text-sm font-bold font-sora">{recommendations.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">High Priority</span>
                    <span className="ff-text-sm font-bold text-orange-600 font-sora">
                      {recommendations.filter(r => r.priority === 'high').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ff-text-sm font-inter">Est. Timeline</span>
                    <span className="ff-text-sm font-bold font-sora">6-8 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartOptimizationEngine;