import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Layers, Users, Zap, Globe, Calendar, Clock, 
  Plus, MoreHorizontal, Play, Pause, Settings,
  TrendingUp, AlertCircle, CheckCircle, X
} from 'lucide-react';

interface CrossAppWorkspaceDashboardProps {
  onClose?: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'planning';
  progress: number;
  team: TeamMember[];
  lastActivity: Date;
  tools: string[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'offline';
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  type: 'create' | 'update' | 'deploy' | 'collaborate';
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: '',
    role: 'Lead Developer',
    status: 'online'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: '',
    role: 'Designer',
    status: 'online'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    avatar: '',
    role: 'Product Manager',
    status: 'away'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: '',
    role: 'Developer',
    status: 'offline'
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    status: 'active',
    progress: 75,
    team: mockTeam.slice(0, 3),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    tools: ['Full-Stack Builder', 'Payment Gateway', 'Logo Generator'],
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Content Management System',
    description: 'Modern CMS with AI-powered content generation',
    status: 'active',
    progress: 45,
    team: mockTeam.slice(0, 2),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tools: ['Content Generator', 'Database Builder', 'API Generator'],
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Marketing Landing Page',
    description: 'High-conversion landing page with analytics',
    status: 'completed',
    progress: 100,
    team: [mockTeam[1], mockTeam[3]],
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tools: ['Website Builder', 'SEO Optimizer', 'Analytics'],
    priority: 'low'
  },
  {
    id: '4',
    name: 'Mobile App Prototype',
    description: 'Cross-platform mobile application prototype',
    status: 'planning',
    progress: 15,
    team: mockTeam.slice(2, 4),
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    tools: ['Mobile Builder', 'UI Components', 'Design System'],
    priority: 'medium'
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    user: 'Alex Johnson',
    action: 'deployed',
    target: 'E-commerce Platform v2.1',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'deploy'
  },
  {
    id: '2',
    user: 'Sarah Chen',
    action: 'updated design system for',
    target: 'Marketing Landing Page',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'update'
  },
  {
    id: '3',
    user: 'Mike Rodriguez',
    action: 'created new project',
    target: 'Customer Portal',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'create'
  },
  {
    id: '4',
    user: 'Emma Wilson',
    action: 'started collaboration on',
    target: 'API Documentation',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'collaborate'
  }
];

export function CrossAppWorkspaceDashboard({ onClose }: CrossAppWorkspaceDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const activeProjects = useMemo(() => 
    mockProjects.filter(p => p.status === 'active' || p.status === 'planning'), 
    []
  );

  const completedProjects = useMemo(() => 
    mockProjects.filter(p => p.status === 'completed').length, 
    []
  );

  const onlineTeamMembers = useMemo(() => 
    mockTeam.filter(m => m.status === 'online').length, 
    []
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-success" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-warning" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'planning':
        return <Clock className="w-4 h-4 text-info" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'paused':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'planning':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'deploy':
        return '🚀';
      case 'collaborate':
        return '👥';
      default:
        return '📝';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Layers className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">Cross-App Workspace</h1>
            <p className="text-sm text-muted-foreground">
              Unified dashboard for all your projects and team collaboration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{activeProjects.length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{completedProjects}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">{onlineTeamMembers}</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
          </div>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ff-hover-scale">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockProjects.length}</p>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockTeam.length}</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-muted-foreground">Tools Used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Projects Overview */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Projects</h2>
              <Button className="ff-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="space-y-4">
              {activeProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                    selectedProject === project.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedProject(
                    selectedProject === project.id ? null : project.id
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(project.status)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs">+{project.team.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {project.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {formatTimeAgo(project.dueDate)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(project.lastActivity)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tools.map(tool => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTeam.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        member.status === 'online' ? 'bg-success' :
                        member.status === 'away' ? 'bg-warning' :
                        'bg-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        member.status === 'online' ? 'border-success/20 text-success' :
                        member.status === 'away' ? 'border-warning/20 text-warning' :
                        'border-muted text-muted-foreground'
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="text-lg mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-warning" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start ff-hover-scale">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
                <Button variant="outline" className="w-full justify-start ff-hover-scale">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team Member
                </Button>
                <Button variant="outline" className="w-full justify-start ff-hover-scale">
                  <Zap className="w-4 h-4 mr-2" />
                  Launch AI Tool
                </Button>
                <Button variant="outline" className="w-full justify-start ff-hover-scale">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrossAppWorkspaceDashboard;