import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Users, 
  MessageSquare, 
  GitBranch, 
  Code, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  Share2, 
  Download, 
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Bell,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MoreHorizontal,
  Plus,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  currentActivity?: string;
  permissionLevel: number;
}

interface CollaborationSession {
  id: string;
  name: string;
  repository?: {
    url: string;
    branch: string;
    provider: 'github' | 'gitlab' | 'bitbucket';
  };
  members: TeamMember[];
  status: 'active' | 'paused' | 'ended';
  startTime: Date;
  lastActivity: Date;
  sharedState: {
    currentTool?: string;
    generatedCode?: string;
    analysisResults?: any;
    comments: Array<{
      id: string;
      author: string;
      content: string;
      timestamp: Date;
      type: 'comment' | 'suggestion' | 'approval' | 'concern';
    }>;
  };
}

interface TeamDevelopmentDashboardProps {
  userId: string;
  onSessionCreate?: (session: CollaborationSession) => void;
  onSessionJoin?: (sessionId: string) => void;
}

export function TeamDevelopmentDashboard({ 
  userId, 
  onSessionCreate, 
  onSessionJoin 
}: TeamDevelopmentDashboardProps) {
  const [activeSessions, setActiveSessions] = useState<CollaborationSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedTab, setSelectedTab] = useState('sessions');

  // Mock data initialization
  useEffect(() => {
    // Initialize with mock data
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@flashfusion.com',
        role: 'admin',
        status: 'online',
        lastSeen: new Date(),
        currentActivity: 'Analyzing React components',
        permissionLevel: 8
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        email: 'marcus@flashfusion.com',
        role: 'developer',
        status: 'online',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        currentActivity: 'Generating API endpoints',
        permissionLevel: 6
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@flashfusion.com',
        role: 'developer',
        status: 'away',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000),
        currentActivity: 'Code review',
        permissionLevel: 6
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@flashfusion.com',
        role: 'viewer',
        status: 'offline',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        permissionLevel: 3
      }
    ];

    const mockSessions: CollaborationSession[] = [
      {
        id: 'session-1',
        name: 'E-commerce Platform Development',
        repository: {
          url: 'https://github.com/team/ecommerce-platform',
          branch: 'main',
          provider: 'github'
        },
        members: mockTeamMembers.slice(0, 3),
        status: 'active',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastActivity: new Date(),
        sharedState: {
          currentTool: 'enhanced-code-generator',
          comments: [
            {
              id: 'comment-1',
              author: 'Sarah Chen',
              content: 'The generated payment component looks great! Can we add error handling for failed transactions?',
              timestamp: new Date(Date.now() - 10 * 60 * 1000),
              type: 'suggestion'
            },
            {
              id: 'comment-2',
              author: 'Marcus Johnson',
              content: 'Agreed on the error handling. Also suggest adding loading states for better UX.',
              timestamp: new Date(Date.now() - 5 * 60 * 1000),
              type: 'comment'
            }
          ]
        }
      },
      {
        id: 'session-2',
        name: 'Mobile App Architecture Review',
        members: mockTeamMembers.slice(1, 4),
        status: 'paused',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        sharedState: {
          currentTool: 'repository-analyzer',
          comments: []
        }
      }
    ];

    setTeamMembers(mockTeamMembers);
    setActiveSessions(mockSessions);
  }, []);

  const createNewSession = useCallback(async () => {
    const sessionName = prompt('Enter session name:');
    if (!sessionName) return;

    const newSession: CollaborationSession = {
      id: `session-${Date.now()}`,
      name: sessionName,
      members: [teamMembers.find(m => m.id === userId) || teamMembers[0]],
      status: 'active',
      startTime: new Date(),
      lastActivity: new Date(),
      sharedState: {
        comments: []
      }
    };

    setActiveSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
    
    if (onSessionCreate) {
      onSessionCreate(newSession);
    }

    toast.success(`Created collaboration session: ${sessionName}`);
  }, [teamMembers, userId, onSessionCreate]);

  const joinSession = useCallback((session: CollaborationSession) => {
    setCurrentSession(session);
    
    if (onSessionJoin) {
      onSessionJoin(session.id);
    }

    toast.success(`Joined session: ${session.name}`);
  }, [onSessionJoin]);

  const leaveSession = useCallback(() => {
    if (currentSession) {
      toast.info(`Left session: ${currentSession.name}`);
      setCurrentSession(null);
    }
  }, [currentSession]);

  const toggleVideoCall = useCallback(() => {
    setIsVideoCallActive(prev => !prev);
    toast.info(isVideoCallActive ? 'Video call ended' : 'Video call started');
  }, [isVideoCallActive]);

  const toggleMic = useCallback(() => {
    setIsMicMuted(prev => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOff(prev => !prev);
  }, []);

  const toggleScreenShare = useCallback(() => {
    setIsScreenSharing(prev => !prev);
    toast.info(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  }, [isScreenSharing]);

  const addComment = useCallback(() => {
    if (!newComment.trim() || !currentSession) return;

    const comment = {
      id: `comment-${Date.now()}`,
      author: teamMembers.find(m => m.id === userId)?.name || 'Unknown User',
      content: newComment,
      timestamp: new Date(),
      type: 'comment' as const
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      sharedState: {
        ...prev.sharedState,
        comments: [...prev.sharedState.comments, comment]
      }
    } : null);

    setNewComment('');
    toast.success('Comment added');
  }, [newComment, currentSession, teamMembers, userId]);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-ff-success';
      case 'away': return 'bg-ff-warning';
      case 'offline': return 'bg-ff-text-muted';
    }
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return 'bg-ff-accent/10 text-ff-accent';
      case 'admin': return 'bg-ff-primary/10 text-ff-primary';
      case 'developer': return 'bg-ff-secondary/10 text-ff-secondary';
      case 'viewer': return 'bg-ff-text-muted/10 text-ff-text-muted';
    }
  };

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Zap className="w-3 h-3 text-ff-warning" />;
      case 'approval': return <CheckCircle2 className="w-3 h-3 text-ff-success" />;
      case 'concern': return <AlertCircle className="w-3 h-3 text-ff-error" />;
      default: return <MessageSquare className="w-3 h-3 text-ff-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ff-text-gradient">Team Development Hub</h1>
          <p className="text-ff-text-secondary mt-1">
            Real-time collaboration for AI-powered development
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {currentSession && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ff-success rounded-full animate-pulse" />
              <span className="text-sm text-ff-text-secondary">
                In session: {currentSession.name}
              </span>
            </div>
          )}
          
          <Button 
            onClick={createNewSession}
            className="ff-btn-primary ff-hover-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {currentSession ? (
        /* Active Session View */
        <div className="space-y-6">
          {/* Session Header */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-ff-primary" />
                    {currentSession.name}
                    <Badge className={`${
                      currentSession.status === 'active' ? 'ff-btn-secondary' : 'bg-ff-warning/10 text-ff-warning'
                    }`}>
                      {currentSession.status}
                    </Badge>
                  </CardTitle>
                  {currentSession.repository && (
                    <div className="flex items-center gap-2 text-sm text-ff-text-muted mt-1">
                      <GitBranch className="w-3 h-3" />
                      {currentSession.repository.url.split('/').slice(-2).join('/')}
                      <span>•</span>
                      <span>{currentSession.repository.branch}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Video Call Controls */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      size="sm"
                      variant={isVideoCallActive ? "default" : "outline"}
                      onClick={toggleVideoCall}
                      className="h-8 w-8 p-0"
                    >
                      <Video className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={isMicMuted ? "outline" : "default"}
                      onClick={toggleMic}
                      className="h-8 w-8 p-0"
                    >
                      {isMicMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={isScreenSharing ? "default" : "outline"}
                      onClick={toggleScreenShare}
                      className="h-8 w-8 p-0"
                    >
                      <Monitor className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={leaveSession}
                    variant="outline"
                    size="sm"
                    className="ff-focus-ring"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Leave
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-ff-primary">
                    {currentSession.members.length}
                  </div>
                  <div className="text-xs text-ff-text-muted">Active Members</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-ff-secondary">
                    {Math.round((Date.now() - currentSession.startTime.getTime()) / (1000 * 60))}m
                  </div>
                  <div className="text-xs text-ff-text-muted">Session Duration</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-ff-accent">
                    {currentSession.sharedState.comments.length}
                  </div>
                  <div className="text-xs text-ff-text-muted">Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Collaboration Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shared Workspace */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-ff-secondary" />
                    Shared Workspace
                    {currentSession.sharedState.currentTool && (
                      <Badge variant="outline" className="ml-auto">
                        {currentSession.sharedState.currentTool}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentSession.sharedState.generatedCode ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Generated Code</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-ff-surface rounded-lg p-4 max-h-64 overflow-auto">
                        <pre className="text-sm text-ff-text-primary">
                          <code>{currentSession.sharedState.generatedCode}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Code className="w-12 h-12 text-ff-text-muted mx-auto mb-3" />
                      <p className="text-ff-text-muted">
                        No shared code yet. Start generating code to collaborate!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments & Discussions */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-ff-accent" />
                    Team Discussion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Comment List */}
                  <div className="space-y-3 max-h-64 overflow-auto">
                    {currentSession.sharedState.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-ff-surface/50 rounded-lg">
                        <div className="shrink-0">
                          {getCommentTypeIcon(comment.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-ff-text-primary">
                              {comment.author}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {comment.type}
                            </Badge>
                            <span className="text-xs text-ff-text-muted ml-auto">
                              {comment.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-ff-text-secondary">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment, suggestion, or concern..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 ff-focus-ring resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="ff-btn-primary"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Sidebar */}
            <div className="space-y-6">
              {/* Active Members */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-ff-primary" />
                    Team Members
                    <Badge variant="outline" className="ml-auto">
                      {currentSession.members.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentSession.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-ff-surface/30 transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ff-text-primary truncate">
                            {member.name}
                          </span>
                          <Badge className={`${getRoleColor(member.role)} text-xs`}>
                            {member.role}
                          </Badge>
                        </div>
                        
                        {member.currentActivity && (
                          <p className="text-xs text-ff-text-muted truncate">
                            {member.currentActivity}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Session Tools */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-ff-secondary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start ff-focus-ring">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Session Link
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start ff-focus-ring">
                    <Download className="w-4 h-4 mr-2" />
                    Export Session Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start ff-focus-ring">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Repository
                  </Button>
                  
                  <Separator />
                  
                  <Button variant="outline" className="w-full justify-start text-ff-error hover:text-ff-error ff-focus-ring">
                    <X className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Sessions Overview */
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            {activeSessions.length > 0 ? (
              <div className="grid gap-4">
                {activeSessions.map((session) => (
                  <Card key={session.id} className="ff-card-interactive ff-hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-ff-text-primary">
                              {session.name}
                            </h3>
                            <Badge className={`${
                              session.status === 'active' ? 'ff-btn-secondary' : 'bg-ff-warning/10 text-ff-warning'
                            }`}>
                              {session.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-ff-text-muted">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {session.members.length} members
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Started {session.startTime.toLocaleTimeString()}
                            </div>
                            
                            {session.repository && (
                              <div className="flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                {session.repository.url.split('/').slice(-1)[0]}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            {session.members.slice(0, 4).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {session.members.length > 4 && (
                              <div className="text-xs text-ff-text-muted">
                                +{session.members.length - 4} more
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => joinSession(session)}
                          className="ff-btn-primary ff-hover-glow"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-ff-text-muted mx-auto mb-4" />
                <h3 className="font-semibold text-ff-text-primary mb-2">No Active Sessions</h3>
                <p className="text-ff-text-muted mb-4">
                  Create a new collaboration session to start working with your team.
                </p>
                <Button onClick={createNewSession} className="ff-btn-primary ff-hover-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Session
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-ff-text-primary">{member.name}</h3>
                          <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                        </div>
                        
                        <p className="text-sm text-ff-text-muted">{member.email}</p>
                        
                        {member.currentActivity && (
                          <p className="text-sm text-ff-text-secondary mt-1">
                            {member.currentActivity}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-ff-text-primary">
                          {member.status}
                        </div>
                        <div className="text-xs text-ff-text-muted">
                          {member.status === 'online' ? 'Active now' : 
                           `Last seen ${member.lastSeen.toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-ff-text-muted mx-auto mb-4" />
              <h3 className="font-semibold text-ff-text-primary mb-2">Session History</h3>
              <p className="text-ff-text-muted">
                Previous collaboration sessions will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default TeamDevelopmentDashboard;