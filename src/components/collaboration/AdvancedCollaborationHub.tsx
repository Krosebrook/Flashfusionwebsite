/**
 * @fileoverview Advanced Collaboration & Real-Time Features Hub
 * @chunk collaboration
 * @category real-time-collaboration
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive collaboration platform with real-time multi-user editing, advanced team
 * workspaces, intelligent task orchestration, and integrated communication hub.
 * 
 * Features:
 * - Real-time multi-user editing with conflict resolution
 * - Advanced team workspaces with multi-project coordination
 * - Intelligent task orchestration with AI-powered assignments
 * - Live communication hub with chat, video, and screen sharing
 * - Collaborative code review and pair programming
 * - Team activity tracking and performance analytics
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Video, 
  Share, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Settings,
  Bell,
  Flag,
  Award,
  Star,
  BarChart3,
  LineChart,
  PieChart,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Flame,
  Zap,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Terminal,
  FileText,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Code,
  GitBranch,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Layers,
  Calendar,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneCall,
  ScreenShare,
  Mouse,
  Keyboard,
  Headphones,
  Volume2,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  UserCheck,
  MessageCircle,
  Phone,
  Archive,
  Bookmark
} from 'lucide-react';

// Collaboration interfaces
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'developer' | 'designer' | 'product-manager' | 'qa';
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentActivity: string;
  skills: string[];
  workload: number;
  timezone: string;
  isTyping?: boolean;
}

interface CollaborationSession {
  id: string;
  type: 'editing' | 'review' | 'meeting' | 'pair-programming';
  title: string;
  participants: TeamMember[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'scheduled' | 'completed' | 'cancelled';
  document?: string;
  changes: number;
  conflictsResolved: number;
}

interface TeamWorkspace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: number;
  activeTasks: number;
  completionRate: number;
  lastActivity: Date;
  isPrivate: boolean;
  channels: WorkspaceChannel[];
}

interface WorkspaceChannel {
  id: string;
  name: string;
  type: 'general' | 'development' | 'design' | 'qa' | 'announcements';
  members: number;
  lastMessage: Date;
  unreadCount: number;
  isPinned: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'mention';
  reactions: { emoji: string; count: number; users: string[] }[];
  isEdited: boolean;
  replyTo?: string;
}

interface TaskAssignment {
  id: string;
  title: string;
  description: string;
  assignee: TeamMember;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  aiRecommendation: string;
  skillMatch: number;
}

interface CollaborationMetrics {
  activeUsers: number;
  sessionsToday: number;
  avgSessionDuration: number;
  conflictsResolved: number;
  codeChanges: number;
  messageSent: number;
  teamProductivity: number;
  collaborationScore: number;
}

/**
 * Advanced Collaboration Hub Component
 */
export function AdvancedCollaborationHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'workspace' | 'communication' | 'sessions' | 'analytics'>('overview');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('main');
  const [isInCall, setIsInCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Collaboration metrics
  const [collaborationMetrics, setCollaborationMetrics] = useState<CollaborationMetrics>({
    activeUsers: 12,
    sessionsToday: 34,
    avgSessionDuration: 45,
    conflictsResolved: 23,
    codeChanges: 187,
    messageSent: 456,
    teamProductivity: 87,
    collaborationScore: 92
  });

  // Team members
  const teamMembers: TeamMember[] = useMemo(() => [
    {
      id: 'user-1',
      name: 'Alice Chen',
      email: 'alice@flashfusion.dev',
      avatar: '👩‍💻',
      role: 'developer',
      status: 'online',
      lastSeen: new Date(),
      currentActivity: 'Editing UserService.ts',
      skills: ['React', 'TypeScript', 'Node.js'],
      workload: 85,
      timezone: 'PST',
      isTyping: false
    },
    {
      id: 'user-2',
      name: 'Bob Wilson',
      email: 'bob@flashfusion.dev',
      avatar: '👨‍🎨',
      role: 'designer',
      status: 'online',
      lastSeen: new Date(),
      currentActivity: 'Reviewing design components',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      workload: 72,
      timezone: 'EST',
      isTyping: true
    },
    {
      id: 'user-3',
      name: 'Carol Rodriguez',
      email: 'carol@flashfusion.dev',
      avatar: '👩‍💼',
      role: 'product-manager',
      status: 'busy',
      lastSeen: new Date(Date.now() - 1000 * 60 * 5),
      currentActivity: 'Sprint planning meeting',
      skills: ['Product Strategy', 'Analytics', 'Agile'],
      workload: 95,
      timezone: 'MST',
      isTyping: false
    },
    {
      id: 'user-4',
      name: 'David Kim',
      email: 'david@flashfusion.dev',
      avatar: '👨‍🔬',
      role: 'qa',
      status: 'away',
      lastSeen: new Date(Date.now() - 1000 * 60 * 15),
      currentActivity: 'Running test automation',
      skills: ['Test Automation', 'Quality Assurance', 'Selenium'],
      workload: 60,
      timezone: 'PST',
      isTyping: false
    }
  ], []);

  // Active collaboration sessions
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([
    {
      id: 'session-1',
      type: 'editing',
      title: 'API Documentation Update',
      participants: [teamMembers[0], teamMembers[2]],
      startTime: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
      document: 'api-docs.md',
      changes: 15,
      conflictsResolved: 2
    },
    {
      id: 'session-2',
      type: 'pair-programming',
      title: 'Authentication Service Refactor',
      participants: [teamMembers[0], teamMembers[3]],
      startTime: new Date(Date.now() - 1000 * 60 * 45),
      status: 'active',
      document: 'auth-service.ts',
      changes: 28,
      conflictsResolved: 1
    },
    {
      id: 'session-3',
      type: 'meeting',
      title: 'Design Review Session',
      participants: [teamMembers[1], teamMembers[2]],
      startTime: new Date(Date.now() + 1000 * 60 * 15),
      status: 'scheduled',
      changes: 0,
      conflictsResolved: 0
    }
  ]);

  // Team workspaces
  const teamWorkspaces: TeamWorkspace[] = useMemo(() => [
    {
      id: 'main',
      name: 'FlashFusion Core',
      description: 'Main development workspace for the FlashFusion platform',
      members: teamMembers,
      projects: 3,
      activeTasks: 24,
      completionRate: 78,
      lastActivity: new Date(),
      isPrivate: false,
      channels: [
        { id: 'general', name: 'general', type: 'general', members: 4, lastMessage: new Date(), unreadCount: 0, isPinned: true },
        { id: 'dev', name: 'development', type: 'development', members: 2, lastMessage: new Date(Date.now() - 1000 * 60 * 5), unreadCount: 3, isPinned: false },
        { id: 'design', name: 'design', type: 'design', members: 2, lastMessage: new Date(Date.now() - 1000 * 60 * 15), unreadCount: 1, isPinned: false }
      ]
    },
    {
      id: 'ai-tools',
      name: 'AI Tools Development',
      description: 'Dedicated workspace for AI-powered development tools',
      members: [teamMembers[0], teamMembers[3]],
      projects: 1,
      activeTasks: 8,
      completionRate: 92,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      isPrivate: true,
      channels: [
        { id: 'ai-general', name: 'general', type: 'general', members: 2, lastMessage: new Date(Date.now() - 1000 * 60 * 30), unreadCount: 0, isPinned: true },
        { id: 'ai-dev', name: 'development', type: 'development', members: 2, lastMessage: new Date(Date.now() - 1000 * 60 * 45), unreadCount: 5, isPinned: false }
      ]
    }
  ], [teamMembers]);

  // Chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'user-1',
      senderName: 'Alice Chen',
      content: 'Just finished the authentication service refactor. Ready for review!',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: 'text',
      reactions: [{ emoji: '👍', count: 2, users: ['user-2', 'user-3'] }],
      isEdited: false
    },
    {
      id: 'msg-2',
      senderId: 'user-2',
      senderName: 'Bob Wilson',
      content: 'const validateUser = (user: User) => {\n  return user.isActive && user.permissions.length > 0;\n};',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      type: 'code',
      reactions: [],
      isEdited: false
    },
    {
      id: 'msg-3',
      senderId: 'user-3',
      senderName: 'Carol Rodriguez',
      content: 'Great work team! The sprint is looking good. @Alice the new features are testing well.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'mention',
      reactions: [{ emoji: '🎉', count: 1, users: ['user-1'] }],
      isEdited: false
    }
  ]);

  // Task assignments
  const taskAssignments: TaskAssignment[] = useMemo(() => [
    {
      id: 'task-1',
      title: 'Implement real-time collaboration',
      description: 'Add WebSocket support for real-time document editing',
      assignee: teamMembers[0],
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      estimatedHours: 16,
      actualHours: 8,
      dependencies: ['task-3'],
      aiRecommendation: 'Perfect match for Alice\'s WebSocket expertise',
      skillMatch: 95
    },
    {
      id: 'task-2',
      title: 'Design collaboration UI components',
      description: 'Create user interface components for team collaboration features',
      assignee: teamMembers[1],
      priority: 'medium',
      status: 'review',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      estimatedHours: 12,
      actualHours: 14,
      dependencies: [],
      aiRecommendation: 'Bob\'s design skills are ideal for this UI work',
      skillMatch: 98
    },
    {
      id: 'task-3',
      title: 'Set up WebSocket infrastructure',
      description: 'Configure WebSocket server and connection management',
      assignee: teamMembers[0],
      priority: 'critical',
      status: 'done',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      estimatedHours: 8,
      actualHours: 6,
      dependencies: [],
      aiRecommendation: 'Alice completed this efficiently with her backend skills',
      skillMatch: 92
    }
  ], [teamMembers]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time collaboration activity
      setCollaborationMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        messageSent: prev.messageSent + Math.floor(Math.random() * 3),
        codeChanges: prev.codeChanges + Math.floor(Math.random() * 2)
      }));

      // Update session activity
      setCollaborationSessions(prev => prev.map(session => ({
        ...session,
        changes: session.status === 'active' ? session.changes + Math.floor(Math.random() * 3) : session.changes
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--ff-success)';
      case 'away': return 'var(--ff-warning)';
      case 'busy': return 'var(--ff-error)';
      case 'offline': return 'var(--ff-text-muted)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'var(--ff-error)';
      case 'developer': return 'var(--ff-primary)';
      case 'designer': return 'var(--ff-accent)';
      case 'product-manager': return 'var(--ff-secondary)';
      case 'qa': return 'var(--ff-warning)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <Users className="w-4 h-4 mr-2" />
            Advanced Collaboration
          </Badge>
          
          <h1 className="ff-text-display">
            Collaboration
            <span className="ff-text-gradient"> Hub</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Enterprise-grade collaboration platform with real-time multi-user editing, advanced team workspaces, 
            intelligent task orchestration, and integrated communication hub for seamless team coordination.
          </p>
        </div>

        {/* Collaboration Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-[var(--ff-success)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {collaborationMetrics.activeUsers}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Active Users</div>
            <div className="flex justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-[var(--ff-success)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5 text-[var(--ff-primary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {collaborationMetrics.messageSent}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Messages Today</div>
            <div className="flex justify-center mt-1">
              <Activity className="w-4 h-4 text-[var(--ff-primary)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Edit className="w-5 h-5 text-[var(--ff-secondary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {collaborationMetrics.codeChanges}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Code Changes</div>
            <div className="flex justify-center mt-1">
              <Code className="w-4 h-4 text-[var(--ff-secondary)]" />
            </div>
          </Card>

          <Card className="ff-card text-center p-4">
            <div className="w-10 h-10 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5 text-[var(--ff-accent)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {collaborationMetrics.collaborationScore}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Collab Score</div>
            <div className="flex justify-center mt-1">
              <Star className="w-4 h-4 text-[var(--ff-accent)]" />
            </div>
          </Card>
        </div>

        {/* Team Status & Quick Actions */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--ff-primary)]" />
                Team Status & Quick Actions
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className="ff-badge-success text-xs">
                  {teamMembers.filter(m => m.status === 'online').length} Online
                </Badge>
                <Button
                  onClick={() => setIsInCall(!isInCall)}
                  className={isInCall ? 'ff-btn-error' : 'ff-btn-success'}
                  size="sm"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {isInCall ? (
                    <>
                      <PhoneCall className="w-4 h-4 mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Start Call
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="ff-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-[var(--ff-surface)] rounded-full flex items-center justify-center text-lg">
                          {member.avatar}
                        </div>
                        <div 
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--ff-bg-dark)]"
                          style={{ backgroundColor: getStatusColor(member.status) }}
                        />
                        {member.isTyping && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--ff-primary)] rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {member.name}
                        </h4>
                        <Badge 
                          className="text-xs"
                          style={{ backgroundColor: getRoleColor(member.role) + '20', color: getRoleColor(member.role) }}
                        >
                          {member.role.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="ff-text-xs text-[var(--ff-text-muted)]">
                        {member.status === 'online' ? 'Active now' : formatTimeAgo(member.lastSeen)}
                      </div>
                      
                      <div className="ff-text-xs text-[var(--ff-text-secondary)]">
                        {member.currentActivity}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="ff-text-xs text-[var(--ff-text-muted)]">Workload</span>
                          <span className="ff-text-xs text-[var(--ff-text-primary)]">{member.workload}%</span>
                        </div>
                        <Progress 
                          value={member.workload} 
                          className="h-1"
                          style={{
                            '--progress-background': member.workload > 90 ? 'var(--ff-error)' : 
                                                  member.workload > 70 ? 'var(--ff-warning)' : 
                                                  'var(--ff-success)'
                          } as React.CSSProperties}
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} className="ff-badge-secondary text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 2 && (
                          <Badge className="ff-badge-secondary text-xs">
                            +{member.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Collaboration Tabs */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="workspace" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Workspaces
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Sessions
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Workspaces Tab */}
              <TabsContent value="workspace" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Team Workspaces</h3>
                  <Button
                    className="ff-btn-primary"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Workspace
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {teamWorkspaces.map((workspace) => (
                    <Card 
                      key={workspace.id} 
                      className={`ff-card cursor-pointer transition-all duration-200 ${
                        selectedWorkspace === workspace.id 
                          ? 'border-[var(--ff-primary)] bg-[var(--ff-surface-light)]' 
                          : 'hover:border-[var(--ff-primary)]/30'
                      }`}
                      onClick={() => setSelectedWorkspace(workspace.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center">
                              <Layers className="w-6 h-6 text-[var(--ff-primary)]" />
                            </div>
                            <div>
                              <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {workspace.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="ff-badge-secondary text-xs">
                                  {workspace.members.length} members
                                </Badge>
                                {workspace.isPrivate && (
                                  <Badge className="ff-badge-error text-xs">Private</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {workspace.completionRate}%
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Completion</div>
                          </div>
                        </div>
                        
                        <p className="ff-text-sm text-[var(--ff-text-muted)] mb-4">
                          {workspace.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {workspace.projects}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Projects</div>
                          </div>
                          <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {workspace.activeTasks}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Active Tasks</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Channels
                          </h5>
                          <div className="space-y-1">
                            {workspace.channels.map((channel) => (
                              <div key={channel.id} className="flex items-center justify-between p-2 bg-[var(--ff-surface)] rounded">
                                <div className="flex items-center gap-2">
                                  <span className="ff-text-sm text-[var(--ff-text-primary)]">#{channel.name}</span>
                                  {channel.isPinned && <Star className="w-3 h-3 text-[var(--ff-warning)]" />}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="ff-text-xs text-[var(--ff-text-muted)]">{channel.members}</span>
                                  {channel.unreadCount > 0 && (
                                    <Badge className="ff-badge-error text-xs">
                                      {channel.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Communication Tab */}
              <TabsContent value="communication" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Team Communication</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={isScreenSharing ? 'ff-btn-error' : 'ff-btn-outline'}
                      size="sm"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        fontSize: 'var(--ff-text-sm)'
                      }}
                    >
                      <ScreenShare className="w-4 h-4 mr-2" />
                      {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                    </Button>
                    <Button
                      className="ff-btn-primary"
                      size="sm"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        fontSize: 'var(--ff-text-sm)'
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      New Thread
                    </Button>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="ff-card h-[500px] flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            #general
                          </h4>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[var(--ff-text-muted)]" />
                            <span className="ff-text-sm text-[var(--ff-text-muted)]">4 members</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-4">
                        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                          {chatMessages.map((message) => (
                            <div key={message.id} className="flex gap-3">
                              <div className="w-8 h-8 bg-[var(--ff-surface)] rounded-full flex items-center justify-center text-sm">
                                {teamMembers.find(m => m.id === message.senderId)?.avatar || '👤'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    {message.senderName}
                                  </span>
                                  <span className="ff-text-xs text-[var(--ff-text-muted)]">
                                    {formatTimeAgo(message.timestamp)}
                                  </span>
                                  {message.isEdited && (
                                    <Badge className="ff-badge-secondary text-xs">edited</Badge>
                                  )}
                                </div>
                                <div className={`ff-text-sm ${
                                  message.type === 'code' 
                                    ? 'bg-[var(--ff-surface)] p-2 rounded font-mono text-[var(--ff-text-secondary)]' 
                                    : 'text-[var(--ff-text-secondary)]'
                                }`}>
                                  {message.type === 'code' ? (
                                    <pre className="whitespace-pre-wrap">{message.content}</pre>
                                  ) : (
                                    message.content
                                  )}
                                </div>
                                {message.reactions.length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {message.reactions.map((reaction, index) => (
                                      <Badge key={index} className="ff-badge-secondary text-xs">
                                        {reaction.emoji} {reaction.count}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="flex-1 flex items-center gap-2 p-2 bg-[var(--ff-surface)] rounded">
                            <input 
                              type="text" 
                              placeholder="Type a message..."
                              className="flex-1 bg-transparent border-none outline-none ff-text-sm text-[var(--ff-text-primary)]"
                            />
                            <Button size="sm" className="ff-btn-outline p-1">
                              <Paperclip className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="ff-btn-outline p-1">
                              <Smile className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button className="ff-btn-primary">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="ff-card">
                      <CardHeader>
                        <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          Active Voice Call
                        </h4>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isInCall ? (
                          <>
                            <div className="text-center p-4 bg-[var(--ff-success)]/10 rounded-lg">
                              <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Phone className="w-6 h-6 text-[var(--ff-success)]" />
                              </div>
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">Call Active</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">2 participants</div>
                            </div>
                            
                            <div className="flex justify-center gap-2">
                              <Button size="sm" className="ff-btn-outline">
                                <Mic className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="ff-btn-outline">
                                <Camera className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="ff-btn-error">
                                <PhoneCall className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <div className="ff-text-sm text-[var(--ff-text-muted)]">No active call</div>
                            <Button className="ff-btn-success mt-2" size="sm">
                              <Video className="w-4 h-4 mr-2" />
                              Start Call
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="ff-card">
                      <CardHeader>
                        <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          Online Members
                        </h4>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {teamMembers.filter(m => m.status === 'online').map((member) => (
                          <div key={member.id} className="flex items-center gap-2 p-2 rounded hover:bg-[var(--ff-surface)]">
                            <div className="relative">
                              <div className="w-6 h-6 bg-[var(--ff-surface)] rounded-full flex items-center justify-center text-xs">
                                {member.avatar}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[var(--ff-success)] rounded-full" />
                            </div>
                            <div className="flex-1">
                              <div className="ff-text-sm text-[var(--ff-text-primary)]">{member.name}</div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">{member.currentActivity}</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Collaboration Sessions Tab */}
              <TabsContent value="sessions" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Active Collaboration Sessions</h3>
                  <Button
                    className="ff-btn-primary"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {collaborationSessions.map((session) => (
                    <Card key={session.id} className="ff-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ 
                                backgroundColor: session.status === 'active' ? 'var(--ff-success)20' : 'var(--ff-secondary)20'
                              }}
                            >
                              {session.type === 'editing' && <Edit className="w-5 h-5 text-[var(--ff-success)]" />}
                              {session.type === 'review' && <Eye className="w-5 h-5 text-[var(--ff-warning)]" />}
                              {session.type === 'meeting' && <Video className="w-5 h-5 text-[var(--ff-secondary)]" />}
                              {session.type === 'pair-programming' && <Code className="w-5 h-5 text-[var(--ff-primary)]" />}
                            </div>
                            <div>
                              <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {session.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  className={`ff-badge-${session.status === 'active' ? 'success' : session.status === 'scheduled' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {session.status}
                                </Badge>
                                <Badge className="ff-badge-secondary text-xs">
                                  {session.type.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="ff-text-sm text-[var(--ff-text-muted)]">
                              {session.status === 'active' ? 'Started' : session.status === 'scheduled' ? 'Starts' : 'Duration'}: {formatTimeAgo(session.startTime)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <span className="ff-text-sm text-[var(--ff-text-muted)]">Participants:</span>
                            <div className="flex items-center gap-2 mt-1">
                              {session.participants.map((participant) => (
                                <div key={participant.id} className="flex items-center gap-1">
                                  <div className="w-6 h-6 bg-[var(--ff-surface)] rounded-full flex items-center justify-center text-xs">
                                    {participant.avatar}
                                  </div>
                                  <span className="ff-text-sm text-[var(--ff-text-primary)]">{participant.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {session.document && (
                            <div>
                              <span className="ff-text-sm text-[var(--ff-text-muted)]">Document:</span>
                              <div className="ff-text-sm text-[var(--ff-text-primary)] mt-1 font-mono">
                                {session.document}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {session.status === 'active' && (
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                            <div className="text-center">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {session.changes}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Changes Made</div>
                            </div>
                            <div className="text-center">
                              <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                {session.conflictsResolved}
                              </div>
                              <div className="ff-text-xs text-[var(--ff-text-muted)]">Conflicts Resolved</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdvancedCollaborationHub;