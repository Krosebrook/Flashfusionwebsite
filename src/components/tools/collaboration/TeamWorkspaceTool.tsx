/**
 * @fileoverview Team Workspace Pro Tool
 * @chunk tools
 * @category collaboration
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * FLASHFUSION - TEAM WORKSPACE PRO
 * 
 * Real-time collaboration with live editing, integrated chat, project management,
 * and AI-powered insights for distributed development teams.
 * 
 * Features:
 * - Real-time collaborative code editing
 * - Integrated team chat and video calls
 * - Project management with Kanban boards
 * - AI-powered team insights and recommendations
 * - Version control integration
 * - Permission and role management
 * - Time tracking and productivity analytics
 * - Code review workflows
 * - Shared environments and debugging
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { 
  Users, 
  MessageCircle, 
  Video, 
  GitBranch, 
  FileText, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Share,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Activity,
  BarChart3,
  CheckCircle,
  AlertCircle,
  User,
  Crown,
  Shield,
  Code,
  Folder,
  File,
  Send,
  Paperclip,
  Smile,
  Phone,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

/**
 * Team Member Interface
 */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'online' | 'busy' | 'away' | 'offline';
  last_seen: number;
  current_file?: string;
  permissions: string[];
  timezone: string;
  joined_at: number;
}

/**
 * Project Interface
 */
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  created_at: number;
  updated_at: number;
  members: string[];
  tasks: Task[];
  files: ProjectFile[];
  repository_url?: string;
  tech_stack: string[];
}

/**
 * Task Interface
 */
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  reviewer?: string;
  created_at: number;
  due_date?: number;
  time_spent: number;
  tags: string[];
  attachments: string[];
}

/**
 * Project File Interface
 */
interface ProjectFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified_at: number;
  modified_by: string;
  is_editing: boolean;
  editors: string[];
  content?: string;
}

/**
 * Chat Message Interface
 */
interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'file' | 'code' | 'system';
  timestamp: number;
  edited: boolean;
  reactions: Record<string, string[]>;
  reply_to?: string;
  attachments?: string[];
}

/**
 * Video Call Interface
 */
interface VideoCall {
  id: string;
  participants: string[];
  status: 'active' | 'ended';
  started_at: number;
  screen_sharing?: string;
  recording: boolean;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: '/api/placeholder/32/32',
    role: 'owner',
    status: 'online',
    last_seen: Date.now(),
    current_file: 'src/components/App.tsx',
    permissions: ['read', 'write', 'admin'],
    timezone: 'PST',
    joined_at: Date.now() - 86400000 * 30
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/api/placeholder/32/32',
    role: 'admin',
    status: 'busy',
    last_seen: Date.now() - 300000,
    current_file: 'src/utils/api.ts',
    permissions: ['read', 'write'],
    timezone: 'EST',
    joined_at: Date.now() - 86400000 * 20
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: '/api/placeholder/32/32',
    role: 'member',
    status: 'away',
    last_seen: Date.now() - 1800000,
    permissions: ['read', 'write'],
    timezone: 'MST',
    joined_at: Date.now() - 86400000 * 15
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Next.js e-commerce platform with Stripe integration',
    status: 'active',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now() - 3600000,
    members: ['1', '2', '3'],
    tasks: [],
    files: [],
    repository_url: 'https://github.com/team/ecommerce-platform',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma']
  },
  {
    id: '2',
    name: 'Mobile App Backend',
    description: 'REST API for mobile application',
    status: 'active',
    created_at: Date.now() - 86400000 * 20,
    updated_at: Date.now() - 7200000,
    members: ['1', '2'],
    tasks: [],
    files: [],
    repository_url: 'https://github.com/team/mobile-backend',
    tech_stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.io']
  }
];

export function TeamWorkspaceTool(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [videoCall, setVideoCall] = useState<VideoCall | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [timeTracking, setTimeTracking] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const currentProject = projects.find(p => p.id === selectedProject);
  const projectMembers = teamMembers.filter(member => 
    currentProject?.members.includes(member.id)
  );

  /**
   * Handle sending chat message
   */
  const handleSendMessage = useCallback((): void => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender_id: '1', // Current user ID
      content: newMessage,
      type: 'text',
      timestamp: Date.now(),
      edited: false,
      reactions: {}
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  }, [newMessage]);

  /**
   * Handle starting video call
   */
  const handleStartVideoCall = useCallback((): void => {
    const call: VideoCall = {
      id: `call_${Date.now()}`,
      participants: ['1'], // Start with current user
      status: 'active',
      started_at: Date.now(),
      recording: false
    };

    setVideoCall(call);
    toast.success('Video call started');
  }, []);

  /**
   * Handle ending video call
   */
  const handleEndVideoCall = useCallback((): void => {
    if (videoCall) {
      setVideoCall({ ...videoCall, status: 'ended' });
      setTimeout(() => setVideoCall(null), 1000);
      toast.success('Video call ended');
    }
  }, [videoCall]);

  /**
   * Handle time tracking
   */
  const handleToggleTimeTracking = useCallback((): void => {
    setTimeTracking(prev => !prev);
    toast.success(timeTracking ? 'Time tracking stopped' : 'Time tracking started');
  }, [timeTracking]);

  /**
   * Get status color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  /**
   * Get role icon
   */
  const getRoleIcon = (role: string): JSX.Element => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'admin': return <Shield className="h-3 w-3 text-blue-500" />;
      case 'member': return <User className="h-3 w-3 text-gray-500" />;
      case 'viewer': return <Eye className="h-3 w-3 text-gray-400" />;
      default: return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--ff-accent)] to-[var(--ff-secondary)]">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-['Sora'] text-2xl font-bold text-[var(--ff-text-primary)]">
              Team Workspace Pro
            </h1>
            <p className="text-[var(--ff-text-secondary)] text-sm">
              Real-time collaboration and project management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {projectMembers.slice(0, 5).map((member) => (
              <div key={member.id} className="relative">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
              </div>
            ))}
            {projectMembers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-[var(--ff-surface)] border-2 border-white flex items-center justify-center text-xs font-medium">
                +{projectMembers.length - 5}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartVideoCall}
            className="ff-btn-ghost"
          >
            <Video className="h-4 w-4 mr-2" />
            Start Call
          </Button>
        </div>
      </div>

      {/* Project Selection */}
      <Card className="ff-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-sm font-semibold">Current Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="ff-input min-w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            project.status === 'active' ? 'bg-green-500' :
                            project.status === 'paused' ? 'bg-yellow-500' :
                            project.status === 'completed' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`} />
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentProject && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentProject.members.length} members
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentProject.tech_stack.length} technologies
                  </Badge>
                  {currentProject.repository_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(currentProject.repository_url, '_blank')}
                      className="ff-btn-ghost"
                    >
                      <GitBranch className="h-4 w-4 mr-1" />
                      Repository
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={timeTracking ? "default" : "outline"}
                size="sm"
                onClick={handleToggleTimeTracking}
                className={timeTracking ? "ff-btn-primary" : "ff-btn-ghost"}
              >
                {timeTracking ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Tracking
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Tracking
                  </>
                )}
              </Button>
              
              <Button variant="outline" size="sm" className="ff-btn-ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="ff-nav-item">
                <BarChart3 className="h-4 w-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tasks" className="ff-nav-item">
                <Target className="h-4 w-4 mr-1" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="files" className="ff-nav-item">
                <FileText className="h-4 w-4 mr-1" />
                Files
              </TabsTrigger>
              <TabsTrigger value="analytics" className="ff-nav-item">
                <TrendingUp className="h-4 w-4 mr-1" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="ai" className="ff-nav-item">
                <Brain className="h-4 w-4 mr-1" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="ff-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Active Tasks</p>
                        <p className="text-2xl font-bold text-[var(--ff-text-primary)]">12</p>
                      </div>
                      <Target className="h-8 w-8 text-[var(--ff-primary)]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Team Members</p>
                        <p className="text-2xl font-bold text-[var(--ff-text-primary)]">{projectMembers.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-[var(--ff-secondary)]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Time Today</p>
                        <p className="text-2xl font-bold text-[var(--ff-text-primary)]">6.5h</p>
                      </div>
                      <Clock className="h-8 w-8 text-[var(--ff-accent)]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--ff-text-secondary)]">Completion</p>
                        <p className="text-2xl font-bold text-[var(--ff-text-primary)]">78%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[var(--ff-primary)]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: 'Alex Chen', action: 'completed task', target: 'User Authentication', time: '2 minutes ago' },
                      { user: 'Sarah Johnson', action: 'updated file', target: 'api.ts', time: '15 minutes ago' },
                      { user: 'Mike Rodriguez', action: 'started task', target: 'Payment Integration', time: '1 hour ago' },
                      { user: 'Alex Chen', action: 'merged pull request', target: '#24', time: '2 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--ff-surface)]/50">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{' '}
                            <span className="text-[var(--ff-text-secondary)]">{activity.action}</span>{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-[var(--ff-text-muted)]">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[var(--ff-primary)]" />
                      Project Tasks
                    </CardTitle>
                    <Button size="sm" className="ff-btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['todo', 'in_progress', 'review', 'done'].map((status) => (
                      <div key={status} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[var(--ff-text-primary)] capitalize">
                            {status.replace('_', ' ')}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 10) + 1}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, index) => (
                            <Card key={index} className="ff-card p-3 cursor-pointer hover:shadow-md transition-shadow">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-[var(--ff-text-primary)]">
                                  {status === 'todo' ? 'Implement user profiles' :
                                   status === 'in_progress' ? 'Fix payment gateway' :
                                   status === 'review' ? 'Update documentation' :
                                   'Setup CI/CD pipeline'}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <Badge className={`text-xs ${
                                    Math.random() > 0.5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {Math.random() > 0.5 ? 'High' : 'Medium'}
                                  </Badge>
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className="text-xs">
                                      {teamMembers[Math.floor(Math.random() * teamMembers.length)].name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[var(--ff-secondary)]" />
                      Project Files
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="ff-btn-ghost">
                        <Plus className="h-4 w-4 mr-2" />
                        New File
                      </Button>
                      <Button variant="outline" size="sm" className="ff-btn-ghost">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'src', type: 'folder', modified: '2 hours ago', editor: 'Alex Chen' },
                      { name: 'components', type: 'folder', modified: '1 hour ago', editor: 'Sarah Johnson' },
                      { name: 'App.tsx', type: 'file', modified: '30 minutes ago', editor: 'Alex Chen', editing: true },
                      { name: 'api.ts', type: 'file', modified: '15 minutes ago', editor: 'Sarah Johnson', editing: true },
                      { name: 'utils.ts', type: 'file', modified: '1 hour ago', editor: 'Mike Rodriguez' },
                      { name: 'package.json', type: 'file', modified: '3 hours ago', editor: 'Alex Chen' }
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--ff-surface)]/50 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          {file.type === 'folder' ? (
                            <Folder className="h-4 w-4 text-blue-500" />
                          ) : (
                            <File className="h-4 w-4 text-[var(--ff-text-muted)]" />
                          )}
                          <div>
                            <p className="font-medium text-[var(--ff-text-primary)]">{file.name}</p>
                            <p className="text-xs text-[var(--ff-text-muted)]">
                              Modified {file.modified} by {file.editor}
                            </p>
                          </div>
                          {file.editing && (
                            <Badge className="text-xs bg-green-100 text-green-700">
                              Editing
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle className="text-base">Team Productivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{Math.floor(Math.random() * 8) + 1}h</div>
                            <div className="text-xs text-[var(--ff-text-muted)]">today</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle className="text-base">Task Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">This Week</span>
                        <span className="font-medium">18/25 tasks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[var(--ff-primary)] h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-[var(--ff-text-muted)]">Completed</div>
                          <div className="font-medium text-green-600">18</div>
                        </div>
                        <div>
                          <div className="text-[var(--ff-text-muted)]">Remaining</div>
                          <div className="font-medium text-orange-600">7</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai" className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[var(--ff-accent)]" />
                    AI-Powered Team Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Performance Insight</h4>
                      <p className="text-sm text-blue-700">
                        Team productivity has increased by 23% this week. Consider maintaining current workflow patterns.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Bottleneck Alert</h4>
                      <p className="text-sm text-yellow-700">
                        Code review process is taking 2x longer than usual. Consider adding more reviewers.
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Collaboration Success</h4>
                      <p className="text-sm text-green-700">
                        Pair programming sessions have reduced bug count by 40%. Continue this practice.
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Skill Development</h4>
                      <p className="text-sm text-purple-700">
                        Recommend TypeScript training for Mike Rodriguez based on recent code patterns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(member.status)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--ff-text-primary)]">{member.name}</p>
                        <p className="text-xs text-[var(--ff-text-muted)]">{member.current_file || 'Idle'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Chat */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Team Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {chatMessages.length === 0 ? (
                    <p className="text-sm text-[var(--ff-text-muted)] text-center py-4">
                      No messages yet
                    </p>
                  ) : (
                    chatMessages.map((message) => {
                      const sender = teamMembers.find(m => m.id === message.sender_id);
                      return (
                        <div key={message.id} className="flex gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={sender?.avatar} alt={sender?.name} />
                            <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-xs">
                              <span className="font-medium">{sender?.name}</span>
                              <span className="text-[var(--ff-text-muted)] ml-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </p>
                            <p className="text-sm text-[var(--ff-text-primary)]">{message.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="ff-input text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="ff-btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Call */}
          {videoCall && (
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-white text-sm">Video call active</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant={isMuted ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant={isVideoOff ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                    >
                      {isVideoOff ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                    >
                      <ScreenShare className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleEndVideoCall}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamWorkspaceTool;