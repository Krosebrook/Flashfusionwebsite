import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Users, 
  Code,
  Download,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { awardXP } from '../../services/GamificationInitializer';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export function AchievementUnlockDemo() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const achievements: Achievement[] = [
    {
      id: 'first_generation',
      name: 'Code Generator',
      description: 'Generated your first piece of code',
      icon: <Code className="h-5 w-5" />,
      xp: 50,
      rarity: 'common',
      category: 'Generation'
    },
    {
      id: 'full_stack_master',
      name: 'Full-Stack Master',
      description: 'Built a complete full-stack application',
      icon: <Target className="h-5 w-5" />,
      xp: 250,
      rarity: 'rare',
      category: 'Projects'
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Generated 5 applications in one day',
      icon: <Zap className="h-5 w-5" />,
      xp: 500,
      rarity: 'epic',
      category: 'Speed'
    },
    {
      id: 'download_master',
      name: 'Download Master',
      description: 'Downloaded 10 complete projects',
      icon: <Download className="h-5 w-5" />,
      xp: 200,
      rarity: 'rare',
      category: 'Export'
    },
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'One of the first 100 FlashFusion users',
      icon: <Star className="h-5 w-5" />,
      xp: 1000,
      rarity: 'legendary',
      category: 'Special'
    },
    {
      id: 'collaborator',
      name: 'Team Player',
      description: 'Collaborated on a project with others',
      icon: <Users className="h-5 w-5" />,
      xp: 300,
      rarity: 'epic',
      category: 'Social'
    },
    {
      id: 'innovator',
      name: 'AI Innovator',
      description: 'Used advanced AI features in generation',
      icon: <Sparkles className="h-5 w-5" />,
      xp: 400,
      rarity: 'epic',
      category: 'Innovation'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Generated code with 100% quality score',
      icon: <Trophy className="h-5 w-5" />,
      xp: 750,
      rarity: 'legendary',
      category: 'Quality'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-muted bg-muted/5';
      case 'rare':
        return 'border-info bg-info/5';
      case 'epic':
        return 'border-accent bg-accent/5';
      case 'legendary':
        return 'border-warning bg-warning/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Badge variant="secondary">Common</Badge>;
      case 'rare':
        return <Badge className="bg-info text-white">Rare</Badge>;
      case 'epic':
        return <Badge className="bg-accent text-white">Epic</Badge>;
      case 'legendary':
        return <Badge className="bg-warning text-black">Legendary</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUnlockAchievement = async (achievement: Achievement) => {
    if (unlockedAchievements.includes(achievement.id)) {
      toast.info('Achievement already unlocked!');
      return;
    }

    // Add to unlocked achievements
    setUnlockedAchievements(prev => [...prev, achievement.id]);

    // Award XP
    await awardXP(achievement.xp, `Unlocked achievement: ${achievement.name}`);

    // Show achievement unlock notification
    toast.success(`🏆 Achievement Unlocked!`, {
      description: `${achievement.name}: ${achievement.description}`,
      duration: 6000,
      className: 'ff-confetti'
    });

    // Show XP gain
    toast.success(`+${achievement.xp} XP`, {
      description: `From ${achievement.name} achievement`,
      duration: 3000
    });
  };

  const handleUnlockAll = async () => {
    const lockedAchievements = achievements.filter(a => !unlockedAchievements.includes(a.id));
    
    if (lockedAchievements.length === 0) {
      toast.info('All achievements already unlocked!');
      return;
    }

    const totalXP = lockedAchievements.reduce((sum, a) => sum + a.xp, 0);
    
    // Unlock all achievements
    setUnlockedAchievements(prev => [...prev, ...lockedAchievements.map(a => a.id)]);
    
    // Award total XP
    await awardXP(totalXP, `Unlocked ${lockedAchievements.length} achievements`);
    
    // Show massive unlock notification
    toast.success(`🎊 ${lockedAchievements.length} Achievements Unlocked!`, {
      description: `Earned ${totalXP} total XP!`,
      duration: 8000,
      className: 'ff-level-up'
    });
  };

  const categorizedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const unlockedXP = achievements
    .filter(a => unlockedAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 ff-text-gradient">
            <Trophy className="h-6 w-6" />
            Achievement System Demo
          </CardTitle>
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-primary">{unlockedCount}/{totalCount}</div>
            <div className="text-xs text-muted-foreground">Unlocked</div>
            <div className="text-sm font-medium text-warning">+{unlockedXP} XP</div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleUnlockAll}
            className="ff-btn-primary"
            disabled={unlockedCount === totalCount}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Unlock All Demo
          </Button>
          
          <Button
            onClick={() => {
              setUnlockedAchievements([]);
              toast.info('Reset all achievements for demo');
            }}
            variant="outline"
            className="ff-hover-scale"
          >
            Reset Demo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(categorizedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <h3 className="font-semibold text-lg">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {categoryAchievements.filter(a => unlockedAchievements.includes(a.id)).length}/
                {categoryAchievements.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 border rounded-lg transition-all duration-300 ${
                      getRarityColor(achievement.rarity)
                    } ${isUnlocked ? 'opacity-100' : 'opacity-60 hover:opacity-80'} ${
                      isUnlocked ? 'ff-hover-glow' : 'ff-hover-lift'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isUnlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {isUnlocked && (
                        <Trophy className="h-5 w-5 text-warning" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRarityBadge(achievement.rarity)}
                        <Badge variant="outline" className="text-xs">
                          +{achievement.xp} XP
                        </Badge>
                      </div>
                      
                      {!isUnlocked && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnlockAchievement(achievement)}
                          className="ff-hover-scale text-xs"
                        >
                          Unlock
                        </Button>
                      )}
                      
                      {isUnlocked && (
                        <Badge className="bg-success text-white text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Demo Stats */}
        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-success">{unlockedCount}</div>
              <div className="text-xs text-muted-foreground">Unlocked</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-warning">{unlockedXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-accent">
                {achievements.filter(a => a.rarity === 'legendary' && unlockedAchievements.includes(a.id)).length}
              </div>
              <div className="text-xs text-muted-foreground">Legendary</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-info">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementUnlockDemo;