import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Code2, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Trophy,
  Target,
  Flame
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  aiGenerations: number;
  collaborationSessions: number;
  deployments: number;
  xpPoints: number;
  level: number;
  achievements: string[];
}

interface RecentActivity {
  id: string;
  type: 'project' | 'ai_generation' | 'collaboration' | 'deployment';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'error';
}

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress: number;
  lastModified: string;
  collaborators: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    aiGenerations: 0,
    collaborationSessions: 0,
    deployments: 0,
    xpPoints: 0,
    level: 1,
    achievements: []
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For now, we'll use mock data
        const mockStats: DashboardStats = {
          totalProjects: 12,
          activeProjects: 4,
          completedProjects: 8,
          aiGenerations: 156,
          collaborationSessions: 23,
          deployments: 34,
          xpPoints: 2580,
          level: 8,
          achievements: ['First Project', 'AI Master', 'Team Player', 'Deploy Expert']
        };

        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'ai_generation',
            title: 'Full-Stack App Generated',
            description: 'Generated a React + Node.js e-commerce platform',
            timestamp: '2 hours ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'collaboration',
            title: 'Joined Team Session',
            description: 'Collaborated on "Mobile App UI" with Sarah and Mike',
            timestamp: '4 hours ago',
            status: 'success'
          },
          {
            id: '3',
            type: 'deployment',
            title: 'Deployed to Vercel',
            description: 'Successfully deployed "Portfolio Website" to production',
            timestamp: '1 day ago',
            status: 'success'
          },
          {
            id: '4',
            type: 'project',
            title: 'Created New Project',
            description: 'Started working on "AI Chat Bot" project',
            timestamp: '2 days ago',
            status: 'success'
          }
        ];

        const mockProjects: Project[] = [
          {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with React and Node.js',
            type: 'web-app',
            status: 'active',
            progress: 75,
            lastModified: '2 hours ago',
            collaborators: 3
          },
          {
            id: '2',
            name: 'Mobile App UI',
            description: 'React Native mobile application with modern design',
            type: 'mobile-app',
            status: 'active',
            progress: 45,
            lastModified: '4 hours ago',
            collaborators: 2
          },
          {
            id: '3',
            name: 'Portfolio Website',
            description: 'Personal portfolio with Next.js and Tailwind CSS',
            type: 'website',
            status: 'completed',
            progress: 100,
            lastModified: '1 day ago',
            collaborators: 1
          },
          {
            id: '4',
            name: 'AI Chat Bot',
            description: 'Intelligent chatbot with natural language processing',
            type: 'ai-app',
            status: 'draft',
            progress: 15,
            lastModified: '2 days ago',
            collaborators: 1
          }
        ];

        setStats(mockStats);
        setRecentActivity(mockActivity);
        setRecentProjects(mockProjects);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai_generation': return <Zap className="h-4 w-4 text-primary" />;
      case 'collaboration': return <Users className="h-4 w-4 text-secondary" />;
      case 'deployment': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'project': return <Code2 className="h-4 w-4 text-accent" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 ff-fade-in-up animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="ff-text-headline">Dashboard</h1>
        <p className="ff-text-body">
          Welcome back! Here's what's happening with your FlashFusion projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ff-stagger-fade">
        <Card className="ff-card-interactive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ff-text-sm font-medium">Total Projects</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-primary">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active, {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ff-text-sm font-medium">AI Generations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-secondary">{stats.aiGenerations}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ff-text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-accent">{stats.collaborationSessions}</div>
            <p className="text-xs text-muted-foreground">
              Real-time sessions
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ff-text-sm font-medium">XP Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="ff-text-2xl font-bold text-success">{stats.xpPoints}</div>
            <p className="text-xs text-muted-foreground">
              Level {stats.level} • {stats.achievements.length} achievements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code2 className="h-5 w-5" />
                    <span>Recent Projects</span>
                  </CardTitle>
                  <CardDescription>
                    Your most recently updated projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="ff-text-sm font-medium">{project.name}</h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="ff-text-xs text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-4 ff-text-xs text-muted-foreground">
                          <span>{project.lastModified}</span>
                          <span>{project.collaborators} collaborators</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="ff-text-sm font-medium">{project.progress}%</div>
                        <Progress value={project.progress} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full ff-btn-outline">
                      View All Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full ff-btn-primary">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate New Project
                  </Button>
                  <Button variant="outline" className="w-full ff-btn-outline">
                    <Users className="h-4 w-4 mr-2" />
                    Start Collaboration
                  </Button>
                  <Button variant="outline" className="w-full ff-btn-outline">
                    <Code2 className="h-4 w-4 mr-2" />
                    Browse AI Tools
                  </Button>
                  <Button variant="outline" className="w-full ff-btn-outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Level Progress */}
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="h-5 w-5" />
                    <span>Level Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        L{stats.level}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="ff-text-sm font-medium">Level {stats.level}</span>
                        <span className="ff-text-xs text-muted-foreground">
                          {stats.xpPoints} XP
                        </span>
                      </div>
                      <Progress value={75} className="h-2 mt-1" />
                      <p className="ff-text-xs text-muted-foreground mt-1">
                        420 XP to Level {stats.level + 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="ff-text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Recent Achievements
                    </h5>
                    {stats.achievements.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-warning" />
                        <span className="ff-text-xs">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                Manage and track all your FlashFusion projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="ff-text-base font-medium">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                      <p className="ff-text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-6 ff-text-xs text-muted-foreground">
                        <span>Updated {project.lastModified}</span>
                        <span>{project.collaborators} collaborators</span>
                        <span>{project.progress}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Deploy</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates across FlashFusion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="ff-text-sm font-medium">{activity.title}</h4>
                      <p className="ff-text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="ff-text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                    {activity.status && (
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="ff-card">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Your FlashFusion usage over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="ff-text-sm">AI Generations</span>
                  <span className="ff-text-sm font-medium">{stats.aiGenerations}</span>
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="ff-text-sm">Collaboration Hours</span>
                  <span className="ff-text-sm font-medium">42h</span>
                </div>
                <Progress value={60} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="ff-text-sm">Deployments</span>
                  <span className="ff-text-sm font-medium">{stats.deployments}</span>
                </div>
                <Progress value={85} className="h-2" />
              </CardContent>
            </Card>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium">Success Rate</p>
                    <p className="ff-text-xs text-muted-foreground">Project completion</p>
                  </div>
                  <div className="text-right">
                    <p className="ff-text-lg font-bold text-success">96%</p>
                    <p className="ff-text-xs text-success">+2% this week</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium">Avg Response Time</p>
                    <p className="ff-text-xs text-muted-foreground">AI generation speed</p>
                  </div>
                  <div className="text-right">
                    <p className="ff-text-lg font-bold text-primary">2.3s</p>
                    <p className="ff-text-xs text-primary">-0.5s improved</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="ff-text-sm font-medium">Team Efficiency</p>
                    <p className="ff-text-xs text-muted-foreground">Collaboration score</p>
                  </div>
                  <div className="text-right">
                    <p className="ff-text-lg font-bold text-secondary">8.7/10</p>
                    <p className="ff-text-xs text-secondary">Excellent</p>
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

export default DashboardPage;