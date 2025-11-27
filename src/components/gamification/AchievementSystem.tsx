import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Crown, 
  Sparkles, 
  X,
  CheckCircle,
  Lock,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'projects' | 'tools' | 'streak' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  current_progress?: number;
  unlocked: boolean;
  unlocked_at?: string;
}

interface AchievementSystemProps {
  userId: string;
  achievements: Achievement[];
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const achievementIcons: Record<string, React.ComponentType<any>> = {
  'trophy': Trophy,
  'star': Star,
  'zap': Zap,
  'target': Target,
  'award': Award,
  'crown': Crown,
  'sparkles': Sparkles,
  'gift': Gift
};

const tierColors = {
  bronze: 'from-orange-700 to-yellow-600',
  silver: 'from-gray-400 to-gray-200',
  gold: 'from-yellow-400 to-orange-400',
  platinum: 'from-purple-400 to-pink-400'
};

const tierGlow = {
  bronze: '0 0 20px rgba(234, 88, 12, 0.5)',
  silver: '0 0 20px rgba(156, 163, 175, 0.5)',
  gold: '0 0 20px rgba(251, 191, 36, 0.5)',
  platinum: '0 0 20px rgba(168, 85, 247, 0.5)'
};

export function AchievementToast({ achievement, onClose }: { 
  achievement: Achievement; 
  onClose: () => void;
}) {
  const IconComponent = achievementIcons[achievement.icon] || Trophy;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: -50 }}
      className="ff-glass rounded-lg border-2 border-primary/20 p-4 min-w-[320px] relative overflow-hidden"
      style={{ boxShadow: tierGlow[achievement.tier] }}
    >
      {/* Confetti background effect */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 100,
              scale: 0 
            }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 360],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierColors[achievement.tier]} flex items-center justify-center ff-level-up`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">Achievement Unlocked!</h4>
              <Badge className={`bg-gradient-to-r ${tierColors[achievement.tier]} text-white border-0`}>
                {achievement.tier.toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-lg font-bold ff-text-gradient">{achievement.name}</h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-3">{achievement.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary font-medium">
            +{achievement.xp_reward} XP
          </span>
          <span className="text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const categorizedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryNames = {
    projects: 'Project Master',
    tools: 'AI Specialist',
    streak: 'Consistency Champion',
    social: 'Community Builder',
    special: 'Special Edition'
  };

  return (
    <>
      <div className="space-y-8">
        {Object.entries(categorizedAchievements).map(([category, categoryAchievements]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="ff-text-gradient">{categoryNames[category as keyof typeof categoryNames]}</span>
              <Badge variant="secondary">
                {categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length}
              </Badge>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryAchievements.map((achievement) => {
                const IconComponent = achievementIcons[achievement.icon] || Trophy;
                const progress = achievement.current_progress || 0;
                const progressPercent = Math.min((progress / achievement.condition_value) * 100, 100);

                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className={`ff-card-interactive cursor-pointer transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-card to-primary/5 border-primary/20' 
                          : 'opacity-60 grayscale'
                      }`}
                      onClick={() => setSelectedAchievement(achievement)}
                      style={achievement.unlocked ? { boxShadow: tierGlow[achievement.tier] } : {}}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                            achievement.unlocked ? tierColors[achievement.tier] : 'from-muted to-muted-foreground'
                          } flex items-center justify-center relative`}>
                            {achievement.unlocked ? (
                              <IconComponent className="w-5 h-5 text-white" />
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                            {achievement.unlocked && (
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-white/30"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              />
                            )}
                          </div>
                          
                          <Badge 
                            className={`bg-gradient-to-r ${tierColors[achievement.tier]} text-white border-0 text-xs`}
                          >
                            {achievement.tier}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-sm line-clamp-2">
                          {achievement.name}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {achievement.description}
                        </p>
                        
                        {!achievement.unlocked && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>{progress}/{achievement.condition_value}</span>
                            </div>
                            <Progress value={progressPercent} className="h-1.5" />
                          </div>
                        )}
                        
                        {achievement.unlocked && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-primary font-medium">+{achievement.xp_reward} XP</span>
                            <span className="text-muted-foreground">
                              {achievement.unlocked_at && new Date(achievement.unlocked_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Detail Dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                    selectedAchievement.unlocked ? tierColors[selectedAchievement.tier] : 'from-muted to-muted-foreground'
                  } flex items-center justify-center`}>
                    {selectedAchievement.unlocked ? (
                      React.createElement(achievementIcons[selectedAchievement.icon] || Trophy, { 
                        className: "w-6 h-6 text-white" 
                      })
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
                    <Badge className={`bg-gradient-to-r ${tierColors[selectedAchievement.tier]} text-white border-0`}>
                      {selectedAchievement.tier.toUpperCase()}
                    </Badge>
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Achievement details for {selectedAchievement.name}. {selectedAchievement.unlocked ? 'This achievement has been unlocked.' : 'This achievement is still locked.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedAchievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Reward</span>
                    <span className="text-primary font-bold">+{selectedAchievement.xp_reward} XP</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Category</span>
                    <span className="capitalize">{selectedAchievement.category}</span>
                  </div>
                  
                  {selectedAchievement.unlocked ? (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Unlocked</span>
                      <span className="text-primary flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {selectedAchievement.unlocked_at && new Date(selectedAchievement.unlocked_at).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Progress</span>
                        <span>{selectedAchievement.current_progress || 0}/{selectedAchievement.condition_value}</span>
                      </div>
                      <Progress 
                        value={Math.min(((selectedAchievement.current_progress || 0) / selectedAchievement.condition_value) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AchievementSystem({ userId, achievements, onAchievementUnlocked }: AchievementSystemProps) {
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  // Show achievement toast when new ones are unlocked
  useEffect(() => {
    const newAchievements = achievements.filter(a => 
      a.unlocked && 
      a.unlocked_at && 
      new Date(a.unlocked_at).getTime() > Date.now() - 5000 // Last 5 seconds
    );

    newAchievements.forEach(achievement => {
      if (!recentAchievements.find(r => r.id === achievement.id)) {
        // Show toast notification
        const toastId = toast.custom((t) => (
          <AchievementToast 
            achievement={achievement} 
            onClose={() => toast.dismiss(t)}
          />
        ), {
          duration: 8000,
          position: 'top-right'
        });

        setRecentAchievements(prev => [...prev, achievement]);
        onAchievementUnlocked?.(achievement);
      }
    });
  }, [achievements, recentAchievements, onAchievementUnlocked]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card className="ff-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Achievements Unlocked</span>
              <span className="font-bold text-primary">{unlockedCount}/{totalCount}</span>
            </div>
            <Progress value={completionPercent} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {completionPercent.toFixed(1)}% Complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <AchievementGrid achievements={achievements} />
    </div>
  );
}