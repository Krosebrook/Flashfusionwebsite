import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { 
  Heart,
  Brain,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Moon,
  Sun,
  Coffee,
  Pause,
  Play,
  Timer,
  Target,
  Award,
  Lightbulb,
  RefreshCw,
  Settings,
  BarChart3,
  Calendar,
  Zap,
  Smile,
  Frown,
  Meh,
  CheckCircle2,
  X
} from 'lucide-react';

interface UsageSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  toolsUsed: string[];
  mood: 'energized' | 'focused' | 'creative' | 'tired' | 'frustrated' | 'overwhelmed';
  productivity: number; // 1-10 scale
  breaks: number;
  type: 'focused' | 'exploration' | 'creation' | 'learning';
}

interface WellnessMetrics {
  dailyUsage: number; // minutes
  weeklyUsage: number; // minutes
  averageSessionLength: number; // minutes
  totalSessions: number;
  breaksToday: number;
  moodTrend: string[];
  productivityTrend: number[];
  healthScore: number; // 0-100
}

interface WellnessAlert {
  id: string;
  type: 'usage_limit' | 'break_reminder' | 'mood_concern' | 'dependency_warning' | 'productivity_dip';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action?: string;
  timestamp: Date;
  dismissed?: boolean;
}

const WELLNESS_GOALS = {
  maxDailyUsage: 480, // 8 hours
  maxSessionLength: 90, // 90 minutes
  minBreakFrequency: 60, // every hour
  minBreakDuration: 10, // 10 minutes
  targetProductivity: 7, // 7/10
  maxConsecutiveDays: 5 // 5 days without a break
};

const MOOD_ICONS = {
  energized: { icon: Zap, color: '#10B981', label: 'Energized' },
  focused: { icon: Target, color: '#3B82F6', label: 'Focused' },
  creative: { icon: Lightbulb, color: '#F59E0B', label: 'Creative' },
  tired: { icon: Moon, color: '#6B7280', label: 'Tired' },
  frustrated: { icon: Frown, color: '#EF4444', label: 'Frustrated' },
  overwhelmed: { icon: AlertTriangle, color: '#DC2626', label: 'Overwhelmed' }
};

export function AIWellnessMonitor() {
  const [currentSession, setCurrentSession] = useState<UsageSession | null>(null);
  const [sessions, setSessions] = useState<UsageSession[]>([]);
  const [alerts, setAlerts] = useState<WellnessAlert[]>([]);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [settings, setSettings] = useState({
    enableWellnessAlerts: true,
    autoBreakReminders: true,
    usageLimits: true,
    moodTracking: true,
    productivityInsights: true
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'insights' | 'settings'>('dashboard');

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: UsageSession[] = [
      {
        id: '1',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        duration: 60,
        toolsUsed: ['Content Creator', 'Image Generator', 'Code Assistant'],
        mood: 'focused',
        productivity: 8,
        breaks: 1,
        type: 'creation'
      },
      {
        id: '2',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        duration: 120,
        toolsUsed: ['Research Assistant', 'Data Analyzer'],
        mood: 'energized',
        productivity: 9,
        breaks: 2,
        type: 'focused'
      },
      {
        id: '3',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
        duration: 90,
        toolsUsed: ['Video Editor', 'Audio Processor'],
        mood: 'creative',
        productivity: 7,
        breaks: 1,
        type: 'creation'
      }
    ];

    const mockAlerts: WellnessAlert[] = [
      {
        id: '1',
        type: 'break_reminder',
        severity: 'medium',
        title: 'Time for a break!',
        message: "You've been working for 90 minutes. Take a 10-minute break to maintain focus.",
        action: 'Take Break',
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '2',
        type: 'mood_concern',
        severity: 'low',
        title: 'Mood tracking notice',
        message: "You've reported feeling frustrated in your last 2 sessions. Consider taking longer breaks.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    setSessions(mockSessions);
    setAlerts(mockAlerts);
  }, []);

  const calculateMetrics = (): WellnessMetrics => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessions.filter(s => s.startTime >= today);
    const weekSessions = sessions.filter(s => s.startTime >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const dailyUsage = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const weeklyUsage = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const averageSessionLength = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0;
    const breaksToday = todaySessions.reduce((sum, s) => sum + s.breaks, 0);
    
    const moodTrend = sessions.slice(-7).map(s => s.mood);
    const productivityTrend = sessions.slice(-7).map(s => s.productivity);
    
    // Calculate health score based on various factors
    const usageScore = Math.max(0, 100 - (dailyUsage / WELLNESS_GOALS.maxDailyUsage) * 100);
    const breakScore = Math.min(100, (breaksToday / Math.max(1, dailyUsage / 60)) * 100);
    const moodScore = productivityTrend.length > 0 ? (productivityTrend.reduce((sum, p) => sum + p, 0) / productivityTrend.length) * 10 : 70;
    const healthScore = (usageScore + breakScore + moodScore) / 3;

    return {
      dailyUsage,
      weeklyUsage,
      averageSessionLength,
      totalSessions: sessions.length,
      breaksToday,
      moodTrend,
      productivityTrend,
      healthScore
    };
  };

  const metrics = calculateMetrics();

  const startBreak = (duration: number = 10) => {
    setIsBreakTime(true);
    setBreakTimer(duration * 60); // Convert to seconds
    
    const interval = setInterval(() => {
      setBreakTimer(prev => {
        if (prev <= 1) {
          setIsBreakTime(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getMoodIcon = (mood: keyof typeof MOOD_ICONS) => {
    const moodConfig = MOOD_ICONS[mood];
    return moodConfig;
  };

  const SessionCard = ({ session }: { session: UsageSession }) => {
    const moodConfig = getMoodIcon(session.mood);
    const MoodIcon = moodConfig.icon;

    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${moodConfig.color}15` }}
            >
              <MoodIcon className="h-5 w-5" style={{ color: moodConfig.color }} />
            </div>
            <div>
              <div className="font-medium capitalize">{session.type} Session</div>
              <div className="text-sm text-gray-600">
                {session.startTime.toLocaleTimeString()} - {session.endTime?.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold">{session.duration}m</div>
            <div className="text-sm text-gray-600">{session.breaks} breaks</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mood:</span>
            <Badge style={{ backgroundColor: `${moodConfig.color}15`, color: moodConfig.color }}>
              {moodConfig.label}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Productivity:</span>
            <div className="flex items-center space-x-2">
              <Progress value={session.productivity * 10} className="w-16" />
              <span className="text-sm font-medium">{session.productivity}/10</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tools Used:</span>
            <div className="text-sm text-gray-600">{session.toolsUsed.length}</div>
          </div>
        </div>
      </Card>
    );
  };

  const AlertCard = ({ alert }: { alert: WellnessAlert }) => {
    if (alert.dismissed) return null;

    const getSeverityColor = (severity: WellnessAlert['severity']) => {
      switch (severity) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        default: return '#3B82F6';
      }
    };

    const severityColor = getSeverityColor(alert.severity);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Card 
          className="p-4 border-l-4"
          style={{ borderLeftColor: severityColor }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4" style={{ color: severityColor }} />
                <h4 className="font-medium text-gray-900">{alert.title}</h4>
                <Badge style={{ backgroundColor: `${severityColor}15`, color: severityColor }}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
              <div className="text-xs text-gray-500">
                {alert.timestamp.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {alert.action && (
                <Button size="sm" style={{ backgroundColor: severityColor, color: 'white' }}>
                  {alert.action}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Wellness Monitor
          </h1>
          <p className="text-muted-foreground mt-2">
            Maintain healthy AI usage patterns and prevent digital burnout
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge 
            className="text-lg px-4 py-2"
            style={{
              backgroundColor: `${getHealthScoreColor(metrics.healthScore)}15`,
              color: getHealthScoreColor(metrics.healthScore),
              border: `1px solid ${getHealthScoreColor(metrics.healthScore)}30`
            }}
          >
            <Heart className="h-5 w-5 mr-2" />
            {metrics.healthScore.toFixed(0)}% Health Score
          </Badge>
        </div>
      </div>

      {/* Break Timer Modal */}
      <AnimatePresence>
        {isBreakTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md mx-4 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Coffee className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Break Time!</h3>
              <p className="text-gray-600 mb-6">
                Take a moment to rest your mind and recharge
              </p>
              <div className="text-4xl font-bold text-green-600 mb-6">
                {Math.floor(breakTimer / 60)}:{(breakTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Look away from your screen<br/>
                  • Take deep breaths<br/>
                  • Stretch or walk around
                </div>
                <Button 
                  onClick={() => setIsBreakTime(false)}
                  variant="outline"
                  size="sm"
                >
                  End Break Early
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wellness Alerts */}
      {alerts.filter(alert => !alert.dismissed).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Wellness Alerts</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {alerts.filter(alert => !alert.dismissed).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center space-x-3">
        <Button 
          onClick={() => startBreak(5)}
          className="ff-btn-secondary"
        >
          <Coffee className="h-4 w-4 mr-2" />
          5-min Break
        </Button>
        <Button 
          onClick={() => startBreak(15)}
          className="ff-btn-primary"
        >
          <Moon className="h-4 w-4 mr-2" />
          15-min Break
        </Button>
        <Button variant="outline">
          <Pause className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Today's Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.dailyUsage}m</div>
              <div className="text-sm text-gray-600">Today's Usage</div>
              <Progress 
                value={(metrics.dailyUsage / WELLNESS_GOALS.maxDailyUsage) * 100} 
                className="mt-2" 
              />
              <div className="text-xs text-gray-500 mt-1">
                Limit: {WELLNESS_GOALS.maxDailyUsage}m
              </div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.breaksToday}</div>
              <div className="text-sm text-gray-600">Breaks Today</div>
              <div className="text-xs text-gray-500 mt-2">
                Recommended: {Math.ceil(metrics.dailyUsage / 60)} breaks
              </div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.averageSessionLength.toFixed(0)}m</div>
              <div className="text-sm text-gray-600">Avg Session</div>
              <div className="text-xs text-gray-500 mt-2">
                Target: {WELLNESS_GOALS.maxSessionLength}m max
              </div>
            </Card>
          </div>

          {/* Recent Sessions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sessions.slice(0, 4).map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          {/* Mood & Productivity Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
              <div className="flex items-center space-x-2">
                {metrics.moodTrend.slice(-5).map((mood, index) => {
                  const moodConfig = getMoodIcon(mood as keyof typeof MOOD_ICONS);
                  const MoodIcon = moodConfig.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${moodConfig.color}15` }}
                      >
                        <MoodIcon className="h-4 w-4" style={{ color: moodConfig.color }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Day {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Productivity Trend</h3>
              <div className="flex items-end space-x-2 h-20">
                {metrics.productivityTrend.slice(-7).map((productivity, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${productivity * 10}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {productivity}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Wellness Insights</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <strong>Optimal Session Length:</strong> Your most productive sessions average 75 minutes with a 10-minute break.
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <strong>Best Mood Correlation:</strong> You're most creative during morning sessions (9-11 AM).
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <strong>Break Reminder:</strong> Consider setting automatic break reminders every 60 minutes.
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Usage Patterns</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Peak Usage Hours</span>
                    <span>9 AM - 11 AM</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Most Used Tools</span>
                    <span>Content Creator</span>
                  </div>
                  <Progress value={70} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Break Adherence</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Wellness Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Wellness Alerts</div>
                  <div className="text-sm text-gray-600">Get notified about usage patterns and break reminders</div>
                </div>
                <Switch 
                  checked={settings.enableWellnessAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableWellnessAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Break Reminders</div>
                  <div className="text-sm text-gray-600">Automatic reminders to take breaks during long sessions</div>
                </div>
                <Switch 
                  checked={settings.autoBreakReminders}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBreakReminders: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Usage Limits</div>
                  <div className="text-sm text-gray-600">Set daily and session time limits</div>
                </div>
                <Switch 
                  checked={settings.usageLimits}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, usageLimits: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Daily Usage Limit (minutes)</div>
                  <Slider
                    value={[WELLNESS_GOALS.maxDailyUsage]}
                    onValueChange={([value]) => {
                      // Update goals here
                    }}
                    max={720}
                    min={60}
                    step={30}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    Current: {WELLNESS_GOALS.maxDailyUsage} minutes
                  </div>
                </div>

                <div>
                  <div className="font-medium mb-2">Break Reminder Frequency (minutes)</div>
                  <Slider
                    value={[WELLNESS_GOALS.minBreakFrequency]}
                    onValueChange={([value]) => {
                      // Update goals here
                    }}
                    max={120}
                    min={30}
                    step={15}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    Current: {WELLNESS_GOALS.minBreakFrequency} minutes
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}