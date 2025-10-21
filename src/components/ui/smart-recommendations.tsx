import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Star, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  Code,
  Rocket,
  Heart,
  X,
  RefreshCw
} from 'lucide-react';

interface SmartRecommendation {
  id: string;
  type: 'tool' | 'feature' | 'workflow' | 'learning' | 'collaboration';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  confidence: number;
  reason: string;
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  actionText: string;
  actionUrl?: string;
  onAction?: () => void;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  personalization: {
    relevanceScore: number;
    userBehaviorMatch: number;
    trendingScore: number;
    completionLikelihood: number;
  };
}

interface UserContext {
  recentActivities: string[];
  preferences: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  timeAvailable: 'limited' | 'moderate' | 'flexible';
  workingOn: string[];
}

interface SmartRecommendationsProps {
  userContext?: UserContext;
  maxRecommendations?: number;
  showPersonalization?: boolean;
  compact?: boolean;
  onRecommendationClick?: (recommendation: SmartRecommendation) => void;
  onDismiss?: (recommendationId: string) => void;
}

const mockUserContext: UserContext = {
  recentActivities: ['code-generator', 'react-builder', 'full-stack-builder'],
  preferences: ['development', 'ai', 'automation'],
  skillLevel: 'intermediate',
  goals: ['build saas app', 'learn ai integration', 'improve workflow'],
  timeAvailable: 'moderate',
  workingOn: ['e-commerce platform', 'mobile app']
};

const generateSmartRecommendations = (userContext: UserContext): SmartRecommendation[] => {
  const baseRecommendations: Omit<SmartRecommendation, 'personalization'>[] = [
    {
      id: 'ai-multi-agent',
      type: 'feature',
      title: 'Multi-Agent AI Orchestration',
      description: 'Coordinate multiple AI agents for complex development workflows',
      icon: Brain,
      confidence: 92,
      reason: 'Based on your recent AI tool usage and development projects',
      estimatedTime: '30 min setup',
      difficulty: 'advanced',
      category: 'AI & Automation',
      tags: ['ai', 'automation', 'workflow'],
      actionText: 'Explore Multi-Agent',
      actionUrl: '/multi-agent-orchestration',
      priority: 'high'
    },
    {
      id: 'repo-integration',
      type: 'workflow',
      title: 'GitHub Repository Integration',
      description: 'Connect your repositories for context-aware code generation',
      icon: Code,
      confidence: 88,
      reason: 'Perfect for your full-stack development workflow',
      estimatedTime: '15 min',
      difficulty: 'intermediate',
      category: 'Development',
      tags: ['github', 'integration', 'development'],
      actionText: 'Connect Repository',
      actionUrl: '/settings',
      priority: 'high'
    },
    {
      id: 'deployment-pipeline',
      type: 'workflow',
      title: 'Automated CI/CD Pipeline',
      description: 'Set up automated testing and deployment for your projects',
      icon: Rocket,
      confidence: 85,
      reason: 'Recommended for your e-commerce platform project',
      estimatedTime: '45 min',
      difficulty: 'intermediate',
      category: 'DevOps',
      tags: ['cicd', 'deployment', 'automation'],
      actionText: 'Setup Pipeline',
      actionUrl: '/cicd-pipeline',
      priority: 'medium'
    },
    {
      id: 'ai-validation',
      type: 'tool',
      title: 'AI Output Validation',
      description: 'Ensure your AI-generated code meets quality standards',
      icon: Award,
      confidence: 90,
      reason: 'Essential for production-ready AI-generated code',
      estimatedTime: '20 min',
      difficulty: 'intermediate',
      category: 'Quality Assurance',
      tags: ['validation', 'quality', 'ai'],
      actionText: 'Start Validation',
      actionUrl: '/validator-hub',
      priority: 'high'
    },
    {
      id: 'collaboration-setup',
      type: 'feature',
      title: 'Team Collaboration Hub',
      description: 'Set up real-time collaboration for your development team',
      icon: Users,
      confidence: 78,
      reason: 'Great for scaling your development workflow',
      estimatedTime: '25 min',
      difficulty: 'beginner',
      category: 'Collaboration',
      tags: ['team', 'collaboration', 'realtime'],
      actionText: 'Setup Collaboration',
      actionUrl: '/collaboration',
      priority: 'medium'
    },
    {
      id: 'performance-optimization',
      type: 'learning',
      title: 'Performance Optimization Guide',
      description: 'Learn advanced techniques to optimize your applications',
      icon: TrendingUp,
      confidence: 82,
      reason: 'Based on your intermediate skill level and current projects',
      estimatedTime: '1 hour',
      difficulty: 'advanced',
      category: 'Learning',
      tags: ['performance', 'optimization', 'tutorial'],
      actionText: 'Start Learning',
      actionUrl: '/learning/performance',
      priority: 'low'
    }
  ];

  // Calculate personalization scores
  return baseRecommendations.map(rec => ({
    ...rec,
    personalization: {
      relevanceScore: calculateRelevanceScore(rec, userContext),
      userBehaviorMatch: calculateBehaviorMatch(rec, userContext),
      trendingScore: Math.random() * 100, // Mock trending score
      completionLikelihood: calculateCompletionLikelihood(rec, userContext)
    }
  })).sort((a, b) => {
    // Sort by overall personalization score
    const scoreA = (a.personalization.relevanceScore + a.personalization.userBehaviorMatch + a.personalization.completionLikelihood) / 3;
    const scoreB = (b.personalization.relevanceScore + b.personalization.userBehaviorMatch + b.personalization.completionLikelihood) / 3;
    return scoreB - scoreA;
  });
};

const calculateRelevanceScore = (rec: any, context: UserContext): number => {
  let score = 50; // Base score
  
  // Boost for matching preferences
  if (context.preferences.some(pref => rec.tags.includes(pref))) {
    score += 30;
  }
  
  // Boost for matching current work
  if (context.workingOn.some(work => rec.description.toLowerCase().includes(work.toLowerCase()))) {
    score += 20;
  }
  
  // Adjust for skill level
  if (rec.difficulty === context.skillLevel) {
    score += 15;
  } else if (
    (context.skillLevel === 'beginner' && rec.difficulty === 'intermediate') ||
    (context.skillLevel === 'intermediate' && rec.difficulty === 'advanced')
  ) {
    score += 10; // Slight boost for growth opportunities
  }
  
  return Math.min(100, score);
};

const calculateBehaviorMatch = (rec: any, context: UserContext): number => {
  let score = 40; // Base score
  
  // Boost for recent activity patterns
  if (context.recentActivities.some(activity => rec.tags.includes(activity))) {
    score += 40;
  }
  
  // Boost for goal alignment
  if (context.goals.some(goal => rec.description.toLowerCase().includes(goal.toLowerCase()))) {
    score += 20;
  }
  
  return Math.min(100, score);
};

const calculateCompletionLikelihood = (rec: any, context: UserContext): number => {
  let score = 60; // Base score
  
  // Adjust for time available
  const timeMap = { limited: -20, moderate: 0, flexible: 20 };
  score += timeMap[context.timeAvailable];
  
  // Adjust for difficulty vs skill level
  if (rec.difficulty === context.skillLevel) {
    score += 20;
  } else if (rec.difficulty === 'advanced' && context.skillLevel === 'beginner') {
    score -= 30;
  }
  
  return Math.max(0, Math.min(100, score));
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'text-red-500 border-red-500/20 bg-red-500/5';
    case 'high': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
    case 'medium': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    case 'low': return 'text-green-500 border-green-500/20 bg-green-500/5';
    default: return 'text-muted-foreground border-border/20 bg-muted/5';
  }
};

const RecommendationCard = ({ 
  recommendation, 
  onAction, 
  onDismiss, 
  showPersonalization 
}: { 
  recommendation: SmartRecommendation;
  onAction?: () => void;
  onDismiss?: () => void;
  showPersonalization?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = recommendation.icon;
  
  const overallScore = useMemo(() => {
    const { relevanceScore, userBehaviorMatch, completionLikelihood } = recommendation.personalization;
    return Math.round((relevanceScore + userBehaviorMatch + completionLikelihood) / 3);
  }, [recommendation.personalization]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className={`ff-card-interactive h-full transition-all duration-300 ${
        isHovered ? 'ff-hover-glow border-primary/30' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg ${getPriorityColor(recommendation.priority)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {recommendation.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {recommendation.confidence}% match
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {recommendation.description}
                </CardDescription>
              </div>
            </div>
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Recommendation Reason */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <Sparkles className="w-3 h-3 inline mr-1" />
            {recommendation.reason}
          </div>
          
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {recommendation.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recommendation.estimatedTime}
              </div>
            )}
            {recommendation.difficulty && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {recommendation.difficulty}
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={`text-xs px-1.5 py-0.5 ${getPriorityColor(recommendation.priority)}`}
            >
              {recommendation.priority}
            </Badge>
          </div>

          {/* Personalization Scores */}
          {showPersonalization && (
            <div className="space-y-2 p-3 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Personalization Score</span>
                <span className="font-medium">{overallScore}%</span>
              </div>
              <Progress value={overallScore} className="h-1" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Relevance</div>
                  <div className="font-medium">{Math.round(recommendation.personalization.relevanceScore)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Behavior</div>
                  <div className="font-medium">{Math.round(recommendation.personalization.userBehaviorMatch)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Completion</div>
                  <div className="font-medium">{Math.round(recommendation.personalization.completionLikelihood)}%</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button 
            onClick={onAction}
            className="w-full ff-btn-primary group-hover:ff-hover-glow"
            size="sm"
          >
            {recommendation.actionText}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function SmartRecommendations({
  userContext = mockUserContext,
  maxRecommendations = 6,
  showPersonalization = true,
  compact = false,
  onRecommendationClick,
  onDismiss
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const generated = generateSmartRecommendations(userContext);
    setRecommendations(generated.slice(0, maxRecommendations));
  }, [userContext, maxRecommendations]);

  const visibleRecommendations = recommendations.filter(rec => !dismissedIds.has(rec.id));

  const handleDismiss = (recommendationId: string) => {
    setDismissedIds(prev => new Set([...prev, recommendationId]));
    onDismiss?.(recommendationId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const generated = generateSmartRecommendations(userContext);
    setRecommendations(generated.slice(0, maxRecommendations));
    setDismissedIds(new Set());
    setIsRefreshing(false);
  };

  const handleAction = (recommendation: SmartRecommendation) => {
    onRecommendationClick?.(recommendation);
    if (recommendation.actionUrl) {
      window.location.hash = recommendation.actionUrl;
    } else if (recommendation.onAction) {
      recommendation.onAction();
    }
  };

  if (visibleRecommendations.length === 0) {
    return (
      <Card className="ff-card-interactive text-center p-8">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground text-sm">
              No new recommendations at the moment. Keep using FlashFusion to get personalized suggestions.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ff-focus-ring"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold ff-text-gradient flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Smart Recommendations
          </h2>
          <p className="text-sm text-muted-foreground">
            Personalized suggestions based on your activity and goals
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ff-focus-ring"
        >
          {isRefreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className={`grid gap-4 ${
        compact 
          ? 'grid-cols-1 md:grid-cols-2' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        <AnimatePresence>
          {visibleRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAction={() => handleAction(recommendation)}
              onDismiss={() => handleDismiss(recommendation.id)}
              showPersonalization={showPersonalization}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{visibleRecommendations.length}</div>
              <div className="text-xs text-muted-foreground">Active Recommendations</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">
                {Math.round(visibleRecommendations.reduce((acc, rec) => 
                  acc + rec.confidence, 0) / visibleRecommendations.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">
                {visibleRecommendations.filter(rec => rec.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-500">
                {visibleRecommendations.filter(rec => 
                  rec.estimatedTime && parseInt(rec.estimatedTime) <= 30
                ).length}
              </div>
              <div className="text-xs text-muted-foreground">Quick Wins</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SmartRecommendations;