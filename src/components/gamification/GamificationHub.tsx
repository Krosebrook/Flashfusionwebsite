import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Trophy, Medal, Crown, Star, Zap, Target, 
  Users, Calendar, Flame, TrendingUp, Gift,
  Award, ChevronRight, Timer, MapPin
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LeaderboardEntry {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    title?: string;
  };
  score: number;
  rank: number;
  change: number; // Position change from last period
  streak: number;
  achievements: number;
}

interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prize: {
    type: 'xp' | 'badge' | 'premium' | 'custom';
    value: string;
    description: string;
  };
  tasks: Array<{
    id: string;
    description: string;
    target: number;
    current: number;
    xp: number;
  }>;
  status: 'upcoming' | 'active' | 'completed';
  userParticipating: boolean;
  userRank?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

interface SocialActivity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  type: 'achievement' | 'level_up' | 'project' | 'competition';
}

interface GamificationHubProps {
  userId: string;
}

export function GamificationHub({ userId }: GamificationHubProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGamificationData();
  }, [userId]);

  const loadGamificationData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          id: '1',
          user: { id: '1', name: 'Alex Chen', avatar: '/api/placeholder/32/32', level: 25, title: 'Code Master' },
          score: 12450,
          rank: 1,
          change: 2,
          streak: 15,
          achievements: 48
        },
        {
          id: '2',
          user: { id: '2', name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', level: 23, title: 'UI Wizard' },
          score: 11890,
          rank: 2,
          change: -1,
          streak: 12,
          achievements: 42
        },
        {
          id: '3',
          user: { id: '3', name: 'Mike Rodriguez', avatar: '/api/placeholder/32/32', level: 22 },
          score: 11340,
          rank: 3,
          change: 1,
          streak: 8,
          achievements: 38
        },
        {
          id: userId,
          user: { id: userId, name: 'You', level: 18 },
          score: 8750,
          rank: 7,
          change: 3,
          streak: 5,
          achievements: 24
        }
      ];

      const mockCompetitions: Competition[] = [
        {
          id: '1',
          title: 'Summer Code Sprint',
          description: 'Build the most innovative web app this summer!',
          type: 'monthly',
          startDate: '2024-08-01',
          endDate: '2024-08-31',
          participants: 1247,
          maxParticipants: 2000,
          prize: {
            type: 'premium',
            value: '3 months',
            description: '3 months of FlashFusion Pro'
          },
          tasks: [
            { id: '1', description: 'Create 5 projects', target: 5, current: 2, xp: 500 },
            { id: '2', description: 'Use 10 different AI tools', target: 10, current: 7, xp: 300 },
            { id: '3', description: 'Deploy 3 applications', target: 3, current: 1, xp: 400 }
          ],
          status: 'active',
          userParticipating: true,
          userRank: 23
        },
        {
          id: '2',
          title: 'Daily Streak Master',
          description: 'Maintain the longest coding streak!',
          type: 'daily',
          startDate: '2024-08-20',
          endDate: '2024-08-20',
          participants: 892,
          prize: {
            type: 'xp',
            value: '200',
            description: '200 bonus XP points'
          },
          tasks: [
            { id: '1', description: 'Complete daily tasks', target: 1, current: 0, xp: 100 }
          ],
          status: 'active',
          userParticipating: false
        }
      ];

      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Created your first project',
          icon: '🎯',
          rarity: 'common',
          category: 'Getting Started',
          unlockedAt: '2024-07-15'
        },
        {
          id: '2',
          name: 'Speed Demon',
          description: 'Completed a project in under 1 hour',
          icon: '⚡',
          rarity: 'rare',
          category: 'Performance',
          unlockedAt: '2024-08-10'
        },
        {
          id: '3',
          name: 'Tool Master',
          description: 'Used all AI tools at least once',
          icon: '🛠️',
          rarity: 'epic',
          category: 'Exploration',
          progress: { current: 45, target: 60 }
        },
        {
          id: '4',
          name: 'Legendary Creator',
          description: 'Create 100 successful projects',
          icon: '👑',
          rarity: 'legendary',
          category: 'Mastery',
          progress: { current: 23, target: 100 }
        }
      ];

      const mockActivities: SocialActivity[] = [
        {
          id: '1',
          user: { name: 'Alex Chen', avatar: '/api/placeholder/32/32' },
          action: 'unlocked achievement',
          target: 'Speed Demon',
          timestamp: '2 minutes ago',
          type: 'achievement'
        },
        {
          id: '2',
          user: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32' },
          action: 'reached level',
          target: '25',
          timestamp: '1 hour ago',
          type: 'level_up'
        },
        {
          id: '3',
          user: { name: 'Mike Rodriguez' },
          action: 'won competition',
          target: 'Daily Challenge',
          timestamp: '3 hours ago',
          type: 'competition'
        }
      ];

      setLeaderboard(mockLeaderboard);
      setCompetitions(mockCompetitions);
      setAchievements(mockAchievements);
      setActivities(mockActivities);
      setUserStats(mockLeaderboard.find(entry => entry.id === userId));
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10';
      case 'rare': return 'bg-blue-500/10';
      case 'epic': return 'bg-purple-500/10';
      case 'legendary': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const joinCompetition = async (competitionId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompetitions(prev => 
        prev.map(comp => 
          comp.id === competitionId 
            ? { ...comp, userParticipating: true, participants: comp.participants + 1 }
            : comp
        )
      );
    } catch (error) {
      console.error('Error joining competition:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">#{userStats?.rank || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats?.streak || 0}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats?.achievements || 0}</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Star className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userStats?.score.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gamification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Competitions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Active Competitions
              </h3>
              <div className="space-y-4">
                {competitions.filter(c => c.status === 'active').slice(0, 2).map((competition) => (
                  <div key={competition.id} className="p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{competition.title}</h4>
                        <p className="text-sm text-muted-foreground">{competition.description}</p>
                      </div>
                      <Badge variant={competition.userParticipating ? 'default' : 'outline'}>
                        {competition.userParticipating ? 'Joined' : 'Available'}
                      </Badge>
                    </div>
                    
                    {competition.userParticipating && competition.tasks.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {competition.tasks.slice(0, 2).map((task) => (
                          <div key={task.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{task.description}</span>
                              <span>{task.current}/{task.target}</span>
                            </div>
                            <Progress value={(task.current / task.target) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{competition.participants} participants</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Community Activity
              </h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span> {activity.action} {activity.target && (
                          <span className="font-medium text-primary">{activity.target}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    {activity.type === 'achievement' && <Award className="h-4 w-4 text-yellow-500" />}
                    {activity.type === 'level_up' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'competition' && <Trophy className="h-4 w-4 text-purple-500" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Global Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    entry.id === userId ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-white' :
                      entry.rank === 2 ? 'bg-gray-400 text-white' :
                      entry.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? <Crown className="h-4 w-4" /> :
                        entry.rank === 2 ? <Medal className="h-4 w-4" /> :
                        <Trophy className="h-4 w-4" />
                      ) : entry.rank}
                    </div>
                    <Avatar>
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback>
                        {entry.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{entry.user.name}</p>
                      {entry.user.title && (
                        <Badge variant="secondary" className="text-xs">{entry.user.title}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">Level {entry.user.level}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{entry.score.toLocaleString()} XP</span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {entry.streak} streak
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {entry.achievements} achievements
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm ${
                      entry.change > 0 ? 'text-green-500' : 
                      entry.change < 0 ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {entry.change > 0 && '↗'}
                      {entry.change < 0 && '↘'}
                      {entry.change !== 0 && Math.abs(entry.change)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="competitions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.map((competition) => (
              <Card key={competition.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{competition.title}</h3>
                    <p className="text-sm text-muted-foreground">{competition.description}</p>
                  </div>
                  <Badge variant={
                    competition.status === 'active' ? 'default' :
                    competition.status === 'upcoming' ? 'secondary' :
                    'outline'
                  }>
                    {competition.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.participants} participants</span>
                    {competition.maxParticipants && (
                      <span className="text-muted-foreground">/ {competition.maxParticipants} max</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.prize.description}</span>
                  </div>
                </div>

                {competition.userParticipating && competition.userRank && (
                  <div className="mb-4 p-3 rounded-lg bg-primary/10">
                    <p className="text-sm font-medium">Your current rank: #{competition.userRank}</p>
                  </div>
                )}

                {competition.userParticipating && competition.tasks.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-sm">Your Progress:</h4>
                    {competition.tasks.map((task) => (
                      <div key={task.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{task.description}</span>
                          <span>{task.current}/{task.target}</span>
                        </div>
                        <Progress value={(task.current / task.target) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {!competition.userParticipating && competition.status === 'active' && (
                    <Button 
                      onClick={() => joinCompetition(competition.id)}
                      className="ff-btn-primary"
                    >
                      Join Competition
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className={`p-6 transition-all duration-300 ${
                  achievement.unlockedAt ? 'border-primary/20' : 'opacity-60'
                } group-hover:shadow-lg group-hover:border-primary/40`}>
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto ${
                      getRarityBg(achievement.rarity)
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                        {achievement.rarity}
                      </Badge>
                    </div>

                    {achievement.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress.current}/{achievement.progress.target}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress.current / achievement.progress.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {achievement.unlockedAt && (
                      <div className="text-xs text-muted-foreground">
                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}