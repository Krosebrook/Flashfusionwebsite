import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Users, 
  Star, 
  Gift,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Share2,
  BookOpen,
  Award,
  Flame,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { analyticsService } from '../../services/AnalyticsService';

interface EngagementMetrics {
  dailyActiveUsers: number;
  averageSessionDuration: number;
  toolsUsedPerSession: number;
  returnUserRate: number;
  featureAdoptionRate: number;
  userSatisfactionScore: number;
  churnRisk: number;
  growthRate: number;
}

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpReward: number;
  category: 'usage' | 'creation' | 'collaboration' | 'growth' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  xpReward: number;
  timeLimit: number; // hours
  progress: number;
  maxProgress: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface UserStreak {
  type: 'daily_login' | 'tool_usage' | 'project_creation' | 'collaboration';
  current: number;
  longest: number;
  lastUpdate: number;
  multiplier: number;
}

interface EngagementBooster {
  id: string;
  type: 'tip' | 'challenge' | 'tutorial' | 'feature' | 'reward';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  estimatedTime: number; // minutes
  xpReward?: number;
  dismissed: boolean;
  expires?: number;
}

export function UserEngagementHub() {
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    dailyActiveUsers: 0,
    averageSessionDuration: 0,
    toolsUsedPerSession: 0,
    returnUserRate: 0,
    featureAdoptionRate: 0,
    userSatisfactionScore: 0,
    churnRisk: 0,
    growthRate: 0
  });

  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [userStreaks, setUserStreaks] = useState<UserStreak[]>([]);
  const [engagementBoosters, setEngagementBoosters] = useState<EngagementBooster[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [xpToNextLevel, setXPToNextLevel] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize engagement data
  useEffect(() => {
    const initializeEngagementData = async () => {
      try {
        // Simulate loading engagement metrics
        const mockMetrics: EngagementMetrics = {
          dailyActiveUsers: Math.floor(Math.random() * 200) + 300,
          averageSessionDuration: Math.random() * 20 + 15, // 15-35 minutes
          toolsUsedPerSession: Math.random() * 3 + 2, // 2-5 tools
          returnUserRate: Math.random() * 30 + 65, // 65-95%
          featureAdoptionRate: Math.random() * 25 + 70, // 70-95%
          userSatisfactionScore: Math.random() * 1 + 4, // 4-5 stars
          churnRisk: Math.random() * 15 + 5, // 5-20%
          growthRate: Math.random() * 5 + 8 // 8-13%
        };

        const mockAchievements: UserAchievement[] = [
          {
            id: 'first-project',
            title: 'First Steps',
            description: 'Create your first project with FlashFusion',
            icon: Sparkles,
            progress: 1,
            maxProgress: 1,
            unlocked: true,
            xpReward: 100,
            category: 'creation',
            rarity: 'common',
            unlockedAt: Date.now() - 86400000
          },
          {
            id: 'speed-demon',
            title: 'Speed Demon',
            description: 'Generate 10 projects in a single day',
            icon: Zap,
            progress: 7,
            maxProgress: 10,
            unlocked: false,
            xpReward: 500,
            category: 'usage',
            rarity: 'rare'
          },
          {
            id: 'collaborator',
            title: 'Team Player',
            description: 'Collaborate on 5 projects with other users',
            icon: Users,
            progress: 2,
            maxProgress: 5,
            unlocked: false,
            xpReward: 300,
            category: 'collaboration',
            rarity: 'common'
          },
          {
            id: 'tool-master',
            title: 'Tool Master',
            description: 'Use all 60+ AI tools at least once',
            icon: Trophy,
            progress: 23,
            maxProgress: 60,
            unlocked: false,
            xpReward: 1000,
            category: 'usage',
            rarity: 'epic'
          },
          {
            id: 'streak-legend',
            title: 'Streak Legend',
            description: 'Maintain a 30-day login streak',
            icon: Flame,
            progress: 12,
            maxProgress: 30,
            unlocked: false,
            xpReward: 1500,
            category: 'growth',
            rarity: 'legendary'
          }
        ];

        const mockChallenges: DailyChallenge[] = [
          {
            id: 'daily-creator',
            title: 'Content Creator',
            description: 'Generate 3 pieces of content using different AI tools',
            icon: BookOpen,
            xpReward: 150,
            timeLimit: 24,
            progress: 1,
            maxProgress: 3,
            completed: false,
            difficulty: 'easy',
            category: 'content'
          },
          {
            id: 'full-stack-build',
            title: 'Full-Stack Builder',
            description: 'Create and deploy a complete application',
            icon: Target,
            xpReward: 300,
            timeLimit: 24,
            progress: 0,
            maxProgress: 1,
            completed: false,
            difficulty: 'hard',
            category: 'development'
          },
          {
            id: 'social-share',
            title: 'Social Butterfly',
            description: 'Share your project on 2 social platforms',
            icon: Share2,
            xpReward: 100,
            timeLimit: 24,
            progress: 0,
            maxProgress: 2,
            completed: false,
            difficulty: 'easy',
            category: 'social'
          }
        ];

        const mockStreaks: UserStreak[] = [
          {
            type: 'daily_login',
            current: 12,
            longest: 15,
            lastUpdate: Date.now() - 3600000,
            multiplier: 1.2
          },
          {
            type: 'tool_usage',
            current: 8,
            longest: 12,
            lastUpdate: Date.now() - 1800000,
            multiplier: 1.1
          },
          {
            type: 'project_creation',
            current: 5,
            longest: 7,
            lastUpdate: Date.now() - 7200000,
            multiplier: 1.05
          }
        ];

        const mockBoosters: EngagementBooster[] = [
          {
            id: 'new-feature-tip',
            type: 'tip',
            title: 'Try Multi-Agent Orchestration',
            description: 'Automate complex workflows with our new AI agent system',
            action: 'Explore Feature',
            priority: 'high',
            category: 'feature',
            estimatedTime: 5,
            xpReward: 50,
            dismissed: false
          },
          {
            id: 'tutorial-suggestion',
            type: 'tutorial',
            title: 'Master the Full-Stack Builder',
            description: 'Learn advanced techniques to create production-ready apps',
            action: 'Start Tutorial',
            priority: 'medium',
            category: 'learning',
            estimatedTime: 15,
            xpReward: 200,
            dismissed: false
          },
          {
            id: 'collaboration-boost',
            type: 'feature',
            title: 'Invite Your Team',
            description: 'Collaborate with teammates and unlock team achievements',
            action: 'Invite Team',
            priority: 'medium',
            category: 'collaboration',
            estimatedTime: 3,
            xpReward: 100,
            dismissed: false
          }
        ];

        setMetrics(mockMetrics);
        setAchievements(mockAchievements);
        setDailyChallenges(mockChallenges);
        setUserStreaks(mockStreaks);
        setEngagementBoosters(mockBoosters);
        
        // Set user progress
        setUserLevel(Math.floor(Math.random() * 5) + 5);
        setUserXP(Math.floor(Math.random() * 800) + 200);
        setXPToNextLevel(1000);

      } catch (error) {
        console.error('Failed to load engagement data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeEngagementData();
  }, []);

  const handleAchievementProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId) {
        const newProgress = Math.min(progress, achievement.maxProgress);
        const wasUnlocked = achievement.unlocked;
        const isNowUnlocked = newProgress >= achievement.maxProgress;
        
        if (!wasUnlocked && isNowUnlocked) {
          // Achievement unlocked!
          toast.success(`Achievement Unlocked: ${achievement.title}!`, {
            description: `You earned ${achievement.xpReward} XP`
          });
          
          setUserXP(prev => prev + achievement.xpReward);
          
          analyticsService.trackAchievementUnlocked(achievement.id, achievement.category);
          
          return {
            ...achievement,
            progress: newProgress,
            unlocked: true,
            unlockedAt: Date.now()
          };
        }
        
        return { ...achievement, progress: newProgress };
      }
      return achievement;
    }));
  }, []);

  const handleChallengeProgress = useCallback((challengeId: string, progress: number) => {
    setDailyChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const newProgress = Math.min(progress, challenge.maxProgress);
        const wasCompleted = challenge.completed;
        const isNowCompleted = newProgress >= challenge.maxProgress;
        
        if (!wasCompleted && isNowCompleted) {
          toast.success(`Challenge Complete: ${challenge.title}!`, {
            description: `You earned ${challenge.xpReward} XP`
          });
          
          setUserXP(prev => prev + challenge.xpReward);
          
          analyticsService.trackChallengeCompleted(challenge.id, challenge.category);
          
          return {
            ...challenge,
            progress: newProgress,
            completed: true
          };
        }
        
        return { ...challenge, progress: newProgress };
      }
      return challenge;
    }));
  }, []);

  const handleBoosterAction = useCallback((boosterId: string) => {
    const booster = engagementBoosters.find(b => b.id === boosterId);
    if (!booster) return;
    
    // Award XP if applicable
    if (booster.xpReward) {
      setUserXP(prev => prev + booster.xpReward);
      toast.success(`+${booster.xpReward} XP earned!`);
    }
    
    // Mark as dismissed
    setEngagementBoosters(prev => prev.map(b => 
      b.id === boosterId ? { ...b, dismissed: true } : b
    ));
    
    analyticsService.trackEngagementBoosterAction(booster.type, booster.category);
    
    // Simulate action (in real app, this would navigate or trigger the action)
    toast.info(`${booster.action} - Feature coming soon!`);
  }, [engagementBoosters]);

  const dismissBooster = useCallback((boosterId: string) => {
    setEngagementBoosters(prev => prev.map(b => 
      b.id === boosterId ? { ...b, dismissed: true } : b
    ));
  }, []);

  // Level progression
  useEffect(() => {
    if (userXP >= xpToNextLevel) {
      const newLevel = userLevel + 1;
      setUserLevel(newLevel);
      setUserXP(prev => prev - xpToNextLevel);
      setXPToNextLevel(newLevel * 1000);
      
      toast.success(`Level Up! You're now level ${newLevel}!`, {
        description: 'You unlocked new features and rewards'
      });
      
      analyticsService.trackLevelUp(newLevel, userXP);
    }
  }, [userXP, xpToNextLevel, userLevel]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-500/5';
      case 'high': return 'border-orange-500 bg-orange-500/5';
      case 'medium': return 'border-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-blue-500 bg-blue-500/5';
      default: return 'border-muted';
    }
  };

  const activeBoosters = engagementBoosters.filter(b => !b.dismissed);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const availableChallenges = dailyChallenges.filter(c => !c.completed);
  const completedChallenges = dailyChallenges.filter(c => c.completed);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">User Engagement Hub</h1>
          <p className="text-muted-foreground">
            Maximize user retention and platform growth
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">Level {userLevel}</span>
            </div>
            <div className="space-y-1">
              <Progress value={(userXP / xpToNextLevel) * 100} className="h-2 w-24" />
              <p className="text-xs text-muted-foreground">{userXP}/{xpToNextLevel} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-sm">Daily Active Users</h3>
            </div>
            <p className="text-2xl font-bold">{metrics.dailyActiveUsers}</p>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +{metrics.growthRate.toFixed(1)}% this week
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-secondary" />
              <h3 className="font-medium text-sm">Avg Session</h3>
            </div>
            <p className="text-2xl font-bold">{metrics.averageSessionDuration.toFixed(1)}m</p>
            <p className="text-xs text-muted-foreground">
              {metrics.toolsUsedPerSession.toFixed(1)} tools/session
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-5 w-5 text-accent" />
              <h3 className="font-medium text-sm">Satisfaction</h3>
            </div>
            <p className="text-2xl font-bold">{metrics.userSatisfactionScore.toFixed(1)}/5</p>
            <p className="text-xs text-muted-foreground">
              {metrics.returnUserRate.toFixed(0)}% return rate
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-sm">Retention Risk</h3>
            </div>
            <p className="text-2xl font-bold">{metrics.churnRisk.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {metrics.featureAdoptionRate.toFixed(0)}% feature adoption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Boosters */}
      {activeBoosters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Engagement Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBoosters.map((booster) => {
              const Icon = booster.type === 'tip' ? AlertCircle :
                         booster.type === 'tutorial' ? BookOpen :
                         booster.type === 'feature' ? Sparkles :
                         booster.type === 'challenge' ? Target : Gift;
              
              return (
                <Card key={booster.id} className={`ff-card-interactive ${getPriorityColor(booster.priority)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{booster.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {booster.estimatedTime}m
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">{booster.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleBoosterAction(booster.id)}
                            className="ff-btn-primary text-xs"
                          >
                            {booster.action}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                          
                          {booster.xpReward && (
                            <Badge variant="secondary" className="text-xs">
                              +{booster.xpReward} XP
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissBooster(booster.id)}
                            className="text-xs ml-auto"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges" className="ff-focus-ring">
            Daily Challenges ({availableChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="achievements" className="ff-focus-ring">
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </TabsTrigger>
          <TabsTrigger value="streaks" className="ff-focus-ring">
            Streaks
          </TabsTrigger>
          <TabsTrigger value="insights" className="ff-focus-ring">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="space-y-6">
            {availableChallenges.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableChallenges.map((challenge) => {
                    const Icon = challenge.icon;
                    const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
                    
                    return (
                      <Card key={challenge.id} className="ff-card-interactive">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${
                              challenge.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' :
                              challenge.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium">{challenge.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {challenge.timeLimit}h left
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress: {challenge.progress}/{challenge.maxProgress}</span>
                                  <span className="font-medium">+{challenge.xpReward} XP</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleChallengeProgress(challenge.id, challenge.progress + 1)}
                                className="ff-focus-ring"
                              >
                                Simulate Progress
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {completedChallenges.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Completed Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {completedChallenges.map((challenge) => {
                    const Icon = challenge.icon;
                    
                    return (
                      <Card key={challenge.id} className="ff-card-interactive bg-green-500/5 border-green-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                              <Icon className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{challenge.title}</h4>
                              <p className="text-xs text-muted-foreground">+{challenge.xpReward} XP earned</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`ff-card-interactive ${
                    achievement.unlocked ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            {achievement.unlocked && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                            <span className="font-medium">+{achievement.xpReward} XP</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                        
                        {achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        
                        {!achievement.unlocked && achievement.progress < achievement.maxProgress && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAchievementProgress(achievement.id, achievement.progress + 1)}
                            className="ff-focus-ring"
                          >
                            Simulate Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userStreaks.map((streak) => {
              const getStreakIcon = (type: string) => {
                switch (type) {
                  case 'daily_login': return Calendar;
                  case 'tool_usage': return Zap;
                  case 'project_creation': return Target;
                  case 'collaboration': return Users;
                  default: return Flame;
                }
              };
              
              const Icon = getStreakIcon(streak.type);
              const streakTitle = streak.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <Card key={streak.type} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="p-4 rounded-full bg-primary/10">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{streakTitle}</h3>
                        <p className="text-sm text-muted-foreground">Current streak</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Flame className="h-5 w-5 text-orange-500" />
                          <span className="text-3xl font-bold">{streak.current}</span>
                          <span className="text-sm text-muted-foreground">days</span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Best: {streak.longest} days
                          </p>
                          <p className="text-xs text-muted-foreground">
                            XP Multiplier: {streak.multiplier}x
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="ff-badge-glow">
                        {Math.floor((Date.now() - streak.lastUpdate) / 3600000)}h ago
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Feature Adoption</span>
                    <span className="font-medium">{metrics.featureAdoptionRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={metrics.featureAdoptionRate} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">User Satisfaction</span>
                    <span className="font-medium">{metrics.userSatisfactionScore.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(metrics.userSatisfactionScore / 5) * 100} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Return Rate</span>
                    <span className="font-medium">{metrics.returnUserRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={metrics.returnUserRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Growth Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Daily Active Users Growing</p>
                      <p className="text-xs text-muted-foreground">+{metrics.growthRate.toFixed(1)}% this week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Session Duration Improved</p>
                      <p className="text-xs text-muted-foreground">{metrics.averageSessionDuration.toFixed(1)} minutes average</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Churn Risk Monitor</p>
                      <p className="text-xs text-muted-foreground">{metrics.churnRisk.toFixed(1)}% of users at risk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}