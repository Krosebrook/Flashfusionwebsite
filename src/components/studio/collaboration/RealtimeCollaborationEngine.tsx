import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { 
  Users, 
  Phone, 
  MessageSquare, 
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  History,
  UserPlus,
  Settings,
  Activity,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface CollaborationSession {
  sessionId: string;
  participants: Participant[];
  projectId: string;
  projectName: string;
  startedAt: string;
  cursors: Map<string, CursorPosition>;
  changes: OperationalTransform[];
  voiceChannelActive: boolean;
  videoChannelActive: boolean;
}

interface Participant {
  userId: string;
  username: string;
  avatar: string;
  color: string;
  cursor: { x: number; y: number };
  activeTrack: number | null;
  isTyping: boolean;
  lastActivity: string;
  permissions: 'owner' | 'editor' | 'viewer';
}

interface CursorPosition {
  x: number;
  y: number;
  element: string;
}

interface OperationalTransform {
  id: string;
  userId: string;
  timestamp: string;
  operation: 'insert' | 'delete' | 'modify';
  path: string;
  data: any;
  applied: boolean;
}

interface VersionHistoryItem {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  description: string;
  changes: string[];
}

const RealtimeCollaborationEngine: React.FC = () => {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    initializeSession();
    return () => {
      cleanupSession();
    };
  }, []);

  const initializeSession = async () => {
    // Simulate WebSocket connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockSession: CollaborationSession = {
      sessionId: 'collab-001',
      projectId: 'proj-studio-001',
      projectName: 'Summer Vibes EP',
      startedAt: new Date().toISOString(),
      participants: [
        {
          userId: 'user-1',
          username: 'Alex Producer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          color: '#FF7B00',
          cursor: { x: 0, y: 0 },
          activeTrack: 1,
          isTyping: false,
          lastActivity: new Date().toISOString(),
          permissions: 'owner'
        },
        {
          userId: 'user-2',
          username: 'Sarah Vocalist',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          color: '#00B4D8',
          cursor: { x: 0, y: 0 },
          activeTrack: 2,
          isTyping: true,
          lastActivity: new Date().toISOString(),
          permissions: 'editor'
        },
        {
          userId: 'user-3',
          username: 'Mike Engineer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          color: '#E91E63',
          cursor: { x: 0, y: 0 },
          activeTrack: null,
          isTyping: false,
          lastActivity: new Date(Date.now() - 300000).toISOString(),
          permissions: 'editor'
        }
      ],
      cursors: new Map(),
      changes: [],
      voiceChannelActive: false,
      videoChannelActive: false
    };

    const mockHistory: VersionHistoryItem[] = [
      {
        id: 'v1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'user-1',
        username: 'Alex Producer',
        description: 'Added drum pattern to track 1',
        changes: ['Track 1: Added kick drum', 'Track 1: Added hi-hat pattern']
      },
      {
        id: 'v2',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: 'user-2',
        username: 'Sarah Vocalist',
        description: 'Recorded vocal take',
        changes: ['Track 2: Recorded verse 1', 'Track 2: Added harmonies']
      },
      {
        id: 'v3',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        userId: 'user-3',
        username: 'Mike Engineer',
        description: 'Mixed tracks 1-3',
        changes: ['Applied EQ to vocals', 'Added reverb to drums', 'Adjusted levels']
      }
    ];

    setSession(mockSession);
    setVersionHistory(mockHistory);
    setIsConnected(true);
  };

  const cleanupSession = () => {
    setIsConnected(false);
    // Close WebSocket connections
  };

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    // Implement Agora/Twilio audio toggle
  }, []);

  const toggleVideo = useCallback(() => {
    setVideoEnabled(prev => !prev);
    // Implement Agora/Twilio video toggle
  }, []);

  const inviteCollaborator = useCallback(async () => {
    if (!inviteEmail) return;

    // Send invitation
    console.log('Inviting:', inviteEmail);
    setInviteEmail('');
  }, [inviteEmail]);

  const rollbackToVersion = useCallback((versionId: string) => {
    console.log('Rolling back to version:', versionId);
    // Implement CRDT rollback
  }, []);

  const getTimeSince = (timestamp: string) => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin mx-auto text-[#FF7B00]" />
          <p className="text-[#CBD5E1]">Connecting to collaboration session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6 ff-stagger-fade">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Sora'] ff-text-gradient">
              Realtime Collaboration
            </h1>
            <p className="text-[#CBD5E1] mt-2 font-['Inter']">
              Working on: <span className="text-white font-semibold">{session.projectName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={isConnected ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
              <Activity className="h-3 w-3 mr-1" />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Collaboration Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Participants */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#FF7B00]" />
                  Active Participants ({session.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {session.participants.map((participant, index) => (
                  <div
                    key={participant.userId}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A] border border-[#334155] ff-fade-in-up ff-hover-lift"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      borderLeft: `4px solid ${participant.color}`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} alt={participant.username} />
                        <AvatarFallback>{participant.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold font-['Sora']">
                            {participant.username}
                          </span>
                          {participant.isTyping && (
                            <Badge className="bg-[#FF7B00]/10 text-[#FF7B00] border-[#FF7B00]/20 text-xs">
                              typing...
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#94A3B8]">
                            {participant.activeTrack ? `Editing Track ${participant.activeTrack}` : 'Viewing'}
                          </span>
                          <span className="text-xs text-[#94A3B8]">•</span>
                          <span className="text-xs text-[#94A3B8]">
                            {getTimeSince(participant.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      participant.permissions === 'owner' 
                        ? 'bg-[#FF7B00]/10 text-[#FF7B00] border-[#FF7B00]/20'
                        : participant.permissions === 'editor'
                        ? 'bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/20'
                        : 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20'
                    }>
                      {participant.permissions}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Voice & Video Controls */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-white font-['Sora']">
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={toggleAudio}
                    className={audioEnabled ? 'ff-btn-primary' : 'ff-btn-secondary'}
                  >
                    {audioEnabled ? (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Mute
                      </>
                    ) : (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Unmute
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={toggleVideo}
                    className={videoEnabled ? 'ff-btn-primary' : 'ff-btn-secondary'}
                  >
                    {videoEnabled ? (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Stop Video
                      </>
                    ) : (
                      <>
                        <VideoOff className="h-4 w-4 mr-2" />
                        Start Video
                      </>
                    )}
                  </Button>

                  <Button className="ff-btn-secondary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>

                  <Button className="ff-btn-secondary">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Screen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Version History */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
                    <History className="h-5 w-5 text-[#00B4D8]" />
                    Version History
                  </CardTitle>
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    className="ff-btn-secondary"
                    size="sm"
                  >
                    {showHistory ? 'Hide' : 'Show'} All
                  </Button>
                </div>
              </CardHeader>
              {showHistory && (
                <CardContent className="space-y-3">
                  {versionHistory.map((version, index) => (
                    <div
                      key={version.id}
                      className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] ff-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold font-['Sora']">
                              {version.username}
                            </span>
                            <span className="text-xs text-[#94A3B8]">
                              {getTimeSince(version.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-[#CBD5E1] mt-1">
                            {version.description}
                          </p>
                        </div>
                        <Button
                          onClick={() => rollbackToVersion(version.id)}
                          className="ff-btn-secondary"
                          size="sm"
                        >
                          <History className="h-4 w-4 mr-1" />
                          Rollback
                        </Button>
                      </div>
                      <div className="space-y-1 mt-3">
                        {version.changes.map((change, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invite Collaborators */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#E91E63]" />
                  Invite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="ff-focus-ring bg-[#0F172A] border-[#334155] text-white"
                />
                <Button
                  onClick={inviteCollaborator}
                  className="w-full ff-btn-primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-white font-['Sora']">
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#94A3B8]">Duration</span>
                    <span className="text-white font-semibold">
                      {getTimeSince(session.startedAt)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#94A3B8]">Changes Made</span>
                    <span className="text-white font-semibold">
                      {versionHistory.reduce((sum, v) => sum + v.changes.length, 0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#94A3B8]">Active Users</span>
                    <span className="text-white font-semibold">
                      {session.participants.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#00B4D8]" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full ff-btn-secondary">
                  Configure Permissions
                </Button>
                <Button className="w-full ff-btn-secondary">
                  Notification Settings
                </Button>
                <Button className="w-full ff-btn-secondary text-red-500 hover:text-red-400">
                  End Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeCollaborationEngine;
