import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Users, UserPlus, MessageSquare, Share2, Crown, 
  Eye, Edit, Trash2, Clock, Send, MoreHorizontal,
  GitBranch, History, Bell, Settings
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthSystem';
import { toast } from 'sonner@2.0.3';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  status: 'active' | 'invited' | 'offline';
  lastActive: string;
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  createdAt: string;
  replies?: Comment[];
  mentions?: string[];
  edited?: boolean;
}

interface ProjectShare {
  id: string;
  projectId: string;
  sharedWith: TeamMember[];
  permissions: 'view' | 'edit' | 'admin';
  createdAt: string;
  expiresAt?: string;
  shareLink?: string;
}

interface TeamCollaborationProps {
  projectId: string;
  currentUserId: string;
}

export function TeamCollaboration({ projectId, currentUserId }: TeamCollaborationProps) {
  const [activeTab, setActiveTab] = useState('team');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [shares, setShares] = useState<ProjectShare[]>([]);
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    loadCollaborationData();
  }, [projectId]);

  const loadCollaborationData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Alex Chen',
          email: 'alex@example.com',
          avatar: '/api/placeholder/32/32',
          role: 'owner',
          joinedAt: '2024-01-15',
          status: 'active',
          lastActive: '2 minutes ago'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          avatar: '/api/placeholder/32/32',
          role: 'admin',
          joinedAt: '2024-02-01',
          status: 'active',
          lastActive: '1 hour ago'
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          email: 'mike@example.com',
          role: 'member',
          joinedAt: '2024-02-15',
          status: 'offline',
          lastActive: '3 days ago'
        }
      ];

      const mockComments: Comment[] = [
        {
          id: '1',
          author: mockTeamMembers[0],
          content: 'Great work on the new component! The animation feels smooth.',
          createdAt: '2024-08-20T10:30:00Z',
          replies: [
            {
              id: '2',
              author: mockTeamMembers[1],
              content: 'Thanks! I spent some time tweaking the timing.',
              createdAt: '2024-08-20T11:00:00Z'
            }
          ]
        },
        {
          id: '3',
          author: mockTeamMembers[1],
          content: 'Should we consider adding error handling to the API calls?',
          createdAt: '2024-08-20T14:15:00Z',
          mentions: ['@alex']
        }
      ];

      setTeamMembers(mockTeamMembers);
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading collaboration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) return;
    
    setIsInviting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'member',
        joinedAt: new Date().toISOString(),
        status: 'invited',
        lastActive: 'Never'
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      toast.success(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author: teamMembers.find(m => m.id === currentUserId) || teamMembers[0],
        content: newComment,
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-500';
      case 'admin': return 'text-blue-500';
      case 'member': return 'text-green-500';
      case 'viewer': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Settings;
      case 'member': return Users;
      case 'viewer': return Eye;
      default: return Users;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      {/* Collaboration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{comments.length}</p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Share2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shares.length}</p>
              <p className="text-sm text-muted-foreground">Active Shares</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Collaboration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="ff-btn-primary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleInviteMember}
                      disabled={isInviting || !inviteEmail}
                      className="w-full ff-btn-primary"
                    >
                      {isInviting ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                          member.status === 'active' ? 'bg-green-500' :
                          member.status === 'invited' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          <RoleIcon className={`h-4 w-4 ${getRoleColor(member.role)}`} />
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {member.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Discussion</h3>
            
            {/* New Comment */}
            <div className="space-y-3 mb-6">
              <Textarea
                placeholder="Share your thoughts, ask questions, or provide feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="ff-btn-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-muted/30 border"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{comment.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(comment.createdAt)}
                          </p>
                          {comment.edited && (
                            <Badge variant="secondary" className="text-xs">edited</Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        
                        {comment.mentions && (
                          <div className="flex gap-1 mb-2">
                            {comment.mentions.map((mention, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {mention}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            React
                          </Button>
                        </div>
                        
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-muted space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {reply.author.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-xs">{reply.author.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatTime(reply.createdAt)}
                                    </p>
                                  </div>
                                  <p className="text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { user: 'Alex Chen', action: 'updated the header component', time: '2 minutes ago', type: 'edit' },
                { user: 'Sarah Johnson', action: 'added a new comment', time: '1 hour ago', type: 'comment' },
                { user: 'Mike Rodriguez', action: 'joined the project', time: '2 days ago', type: 'join' },
                { user: 'Alex Chen', action: 'deployed to staging', time: '3 days ago', type: 'deploy' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'edit' ? 'bg-blue-500' :
                    activity.type === 'comment' ? 'bg-green-500' :
                    activity.type === 'join' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}