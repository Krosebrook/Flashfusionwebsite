import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Users, 
  MessageCircle, 
  Code2, 
  Play, 
  Save, 
  Share, 
  Settings,
  Copy,
  Download,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CollaborationSession {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  participants: User[];
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'paused' | 'ended';
}

interface User {
  id: string;
  username: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  cursor?: {
    line: number;
    column: number;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

interface CodeChange {
  type: 'insert' | 'delete' | 'replace';
  position: {
    line: number;
    column: number;
  };
  content: string;
  userId: string;
  timestamp: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'Alice',
    avatar: '/api/placeholder/32/32',
    color: '#FF7B00',
    isOnline: true,
    cursor: { line: 15, column: 23 }
  },
  {
    id: '2',
    username: 'Bob',
    avatar: '/api/placeholder/32/32',
    color: '#00B4D8',
    isOnline: true,
    cursor: { line: 8, column: 12 }
  },
  {
    id: '3',
    username: 'Charlie',
    avatar: '/api/placeholder/32/32',
    color: '#E91E63',
    isOnline: false
  }
];

const INITIAL_CODE = `// FlashFusion Collaborative Editor
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function CollaborativeApp() {
  const [message, setMessage] = useState('Hello World!');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log('Message sent:', message);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Collaborative Project</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message..."
        className="w-full p-2 border rounded"
      />
      <Button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-primary text-white"
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
}

export default CollaborativeApp;`;

export function LiveCodeCollaborationHub() {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [participants, setParticipants] = useState<User[]>(MOCK_USERS);
  const [code, setCode] = useState(INITIAL_CODE);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [showPresence, setShowPresence] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize collaboration session
  useEffect(() => {
    async function initializeSession() {
      setLoading(true);
      try {
        // Simulate session creation
        const mockSession: CollaborationSession = {
          id: 'session_' + Date.now(),
          projectId: 'project_1',
          title: 'React Component Builder',
          description: 'Building a collaborative React component with real-time features',
          participants: MOCK_USERS,
          createdBy: '1',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          status: 'active'
        };

        setSession(mockSession);
        setIsConnected(true);
        
        // Simulate receiving some chat messages
        const mockMessages: ChatMessage[] = [
          {
            id: '1',
            userId: '1',
            username: 'Alice',
            message: 'Hey everyone! Ready to build something amazing?',
            timestamp: '2 minutes ago'
          },
          {
            id: '2',
            userId: '2',
            username: 'Bob',
            message: 'Absolutely! I love the collaborative features in FlashFusion.',
            timestamp: '1 minute ago'
          }
        ];
        setChatMessages(mockMessages);

      } catch (error) {
        console.error('Failed to initialize session:', error);
        toast.error('Failed to connect to collaboration session');
      } finally {
        setLoading(false);
      }
    }

    initializeSession();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle code changes with debouncing
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setIsTyping(true);

    // Simulate real-time sync (in real app, this would use WebSockets)
    const timeoutId = setTimeout(() => {
      setIsTyping(false);
      // Here you would send the code change to the collaboration server
      console.log('Code synchronized:', newCode.length, 'characters');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Send chat message
  const sendChatMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user
      username: 'You',
      message: newMessage,
      timestamp: 'just now'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // In real app, send to collaboration server
    toast.success('Message sent');
  }, [newMessage]);

  // Handle Enter key in chat
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Copy code to clipboard
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }, [code]);

  // Save session
  const saveSession = useCallback(async () => {
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Session saved successfully');
    } catch (error) {
      toast.error('Failed to save session');
    }
  }, []);

  // Get user color for cursor/presence
  const getUserColor = (userId: string) => {
    const user = participants.find(u => u.id === userId);
    return user?.color || '#94A3B8';
  };

  if (loading) {
    return (
      <div className="space-y-6 ff-fade-in-up animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ff-text-headline">Live Collaboration</h1>
          <p className="ff-text-body">
            Real-time collaborative coding with your team
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Connection Status */}
          <Badge 
            variant={isConnected ? 'default' : 'secondary'}
            className={isConnected ? 'bg-success text-success-foreground' : ''}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          
          {/* Session Actions */}
          <Button variant="outline" onClick={saveSession} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={copyCode} size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Participants Bar */}
      <Card className="ff-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="ff-text-sm font-medium">Participants ({participants.length})</h3>
              <div className="flex items-center space-x-2">
                {participants.map((user) => (
                  <div key={user.id} className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback 
                        className="text-xs"
                        style={{ backgroundColor: user.color + '20', color: user.color }}
                      >
                        {user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        user.isOnline ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPresence(!showPresence)}
              >
                {showPresence ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Collaboration Interface */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Code Editor Section */}
        <div className="lg:col-span-3">
          <Card className="ff-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Code2 className="h-5 w-5" />
                  <span>{session?.title || 'Collaborative Editor'}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {isTyping && (
                    <Badge variant="outline" className="text-xs">
                      Syncing...
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                </div>
              </div>
              {session?.description && (
                <CardDescription>{session.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Start coding collaboratively..."
                  className="min-h-[400px] font-mono text-sm resize-none ff-input"
                  style={{ lineHeight: '1.5' }}
                />
                
                {/* Live Cursors (simulated) */}
                {showPresence && participants.filter(u => u.isOnline && u.cursor).map((user) => (
                  <div
                    key={user.id}
                    className="absolute pointer-events-none"
                    style={{
                      top: `${(user.cursor!.line - 1) * 1.5 + 2}rem`,
                      left: `${user.cursor!.column * 0.6}rem`,
                      zIndex: 10
                    }}
                  >
                    <div
                      className="w-0.5 h-5 animate-pulse"
                      style={{ backgroundColor: user.color }}
                    />
                    <div
                      className="absolute -top-6 -left-1 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.username}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Code Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{code.split('\n').length} lines</span>
                  <span>{code.length} characters</span>
                  <span>JavaScript/React</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Last saved: 2 minutes ago</span>
                  <span>•</span>
                  <span>Auto-save enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat & Tools */}
        <div className="space-y-6">
          {/* Chat Panel */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Team Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80 px-4">
                <div className="space-y-4 pb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="ff-text-xs font-medium">
                            {message.username}
                          </span>
                          <span className="ff-text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="ff-text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 ff-input"
                  />
                  <Button 
                    onClick={sendChatMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="ff-btn-primary"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start ff-btn-outline">
                <Download className="h-4 w-4 mr-2" />
                Export Code
              </Button>
              <Button variant="outline" className="w-full justify-start ff-btn-outline">
                <Users className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
              <Button variant="outline" className="w-full justify-start ff-btn-outline">
                <Settings className="h-4 w-4 mr-2" />
                Session Settings
              </Button>
              <Button variant="outline" className="w-full justify-start ff-btn-outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More Options
              </Button>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-base">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="ff-text-xs text-muted-foreground">Created by</span>
                  <span className="ff-text-xs">Alice</span>
                </div>
                <div className="flex justify-between">
                  <span className="ff-text-xs text-muted-foreground">Started</span>
                  <span className="ff-text-xs">15 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="ff-text-xs text-muted-foreground">Language</span>
                  <span className="ff-text-xs">JavaScript</span>
                </div>
                <div className="flex justify-between">
                  <span className="ff-text-xs text-muted-foreground">Active users</span>
                  <span className="ff-text-xs">
                    {participants.filter(u => u.isOnline).length} online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LiveCodeCollaborationHub;