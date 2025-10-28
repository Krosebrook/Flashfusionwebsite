import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageCircle,
  Users,
  Trophy,
  Star,
  Heart,
  Share2,
  MessageSquare,
  Bookmark,
  ExternalLink,
  Crown,
  Gift,
  Calendar,
  Bell,
  Hash,
  Plus,
  ThumbsUp,
  Eye,
  Code,
  Lightbulb,
  HelpCircle,
  Megaphone,
  Zap
} from 'lucide-react';
import { cn } from '../ui/utils';
import { useAuth } from '../auth/AuthSystem';
import { toast } from 'sonner';

// Community data interfaces
interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    isVerified: boolean;
  };
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  isBookmarked: boolean;
  isLiked: boolean;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributions: number;
  joinDate: string;
  isOnline: boolean;
  badges: string[];
}

interface DiscordChannel {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isActive: boolean;
  lastMessage: string;
}

// Mock community data
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      badge: 'Pro Developer',
      isVerified: true,
    },
    title: 'How I built a SaaS app in 30 minutes with FlashFusion',
    content: 'Just wanted to share my experience building a complete customer management system using FlashFusion\'s AI tools. The speed of development was incredible...',
    category: 'Success Stories',
    tags: ['saas', 'tutorial', 'ai-tools'],
    likes: 47,
    replies: 12,
    views: 234,
    createdAt: '2 hours ago',
    isBookmarked: false,
    isLiked: true,
  },
  {
    id: '2',
    author: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      badge: 'Community Champion',
      isVerified: true,
    },
    title: 'Best practices for AI-powered code generation',
    content: 'After using FlashFusion for several projects, here are my top tips for getting the most out of AI code generation...',
    category: 'Tips & Tricks',
    tags: ['best-practices', 'ai', 'code-generation'],
    likes: 32,
    replies: 8,
    views: 156,
    createdAt: '4 hours ago',
    isBookmarked: true,
    isLiked: false,
  },
];

const mockMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: '/avatars/alex.jpg',
    role: 'Community Leader',
    contributions: 245,
    joinDate: 'January 2025',
    isOnline: true,
    badges: ['Early Adopter', 'Top Contributor', 'Pro Developer'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    role: 'Beta Tester',
    contributions: 189,
    joinDate: 'January 2025',
    isOnline: true,
    badges: ['Community Champion', 'Beta Tester'],
  },
];

const discordChannels: DiscordChannel[] = [
  {
    id: 'general',
    name: 'general',
    description: 'General discussion about FlashFusion',
    members: 1247,
    category: 'Community',
    isActive: true,
    lastMessage: '2 minutes ago',
  },
  {
    id: 'showcase',
    name: 'showcase',
    description: 'Show off your FlashFusion creations',
    members: 892,
    category: 'Community',
    isActive: true,
    lastMessage: '15 minutes ago',
  },
  {
    id: 'help-support',
    name: 'help-support',
    description: 'Get help with FlashFusion features',
    members: 567,
    category: 'Support',
    isActive: true,
    lastMessage: '5 minutes ago',
  },
  {
    id: 'feature-requests',
    name: 'feature-requests',
    description: 'Suggest new features and improvements',
    members: 423,
    category: 'Feedback',
    isActive: false,
    lastMessage: '1 hour ago',
  },
  {
    id: 'ai-tools',
    name: 'ai-tools',
    description: 'Discuss AI tools and techniques',
    members: 334,
    category: 'Technical',
    isActive: true,
    lastMessage: '8 minutes ago',
  },
];

interface CommunityHubProps {
  className?: string;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ className }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [members, setMembers] = useState<CommunityMember[]>(mockMembers);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 1247,
    onlineMembers: 334,
    totalPosts: 2845,
    activeDiscussions: 45,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityStats(prev => ({
        ...prev,
        onlineMembers: prev.onlineMembers + Math.floor(Math.random() * 10 - 5),
        totalPosts: prev.totalPosts + Math.floor(Math.random() * 3),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: user?.user_metadata?.name || 'You',
        avatar: user?.user_metadata?.avatar_url || '',
        badge: 'Community Member',
        isVerified: false,
      },
      title: newPostTitle,
      content: newPostContent,
      category: selectedCategory,
      tags: [],
      likes: 0,
      replies: 0,
      views: 0,
      createdAt: 'just now',
      isBookmarked: false,
      isLiked: false,
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    toast.success('Post created successfully!');
  };

  const joinDiscord = () => {
    window.open('https://discord.gg/flashfusion', '_blank');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Success Stories':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'Tips & Tricks':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'Help':
        return <HelpCircle className="w-4 h-4 text-green-500" />;
      case 'Feature Requests':
        return <Megaphone className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Community Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold ff-text-gradient">FlashFusion Community</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow developers, share your creations, get help, and stay updated 
          with the latest FlashFusion features and best practices.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {communityStats.totalMembers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {communityStats.onlineMembers}
            </div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">
              {communityStats.totalPosts.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {communityStats.activeDiscussions}
            </div>
            <div className="text-sm text-muted-foreground">Active Discussions</div>
          </CardContent>
        </Card>
      </div>

      {/* Discord Integration */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            <span>Join Our Discord Community</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Join over 1,200+ developers in our Discord server for real-time discussions, 
                support, and exclusive updates.
              </p>
              <Button onClick={joinDiscord} className="ff-btn-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Discord Server
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Popular Channels:</h4>
              {discordChannels.slice(0, 3).map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{channel.name}</span>
                    {channel.isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {channel.members} members
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Tabs */}
      <Tabs defaultValue="discussions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="showcase">Showcase</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          {/* Create New Post */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Start a Discussion</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="What's your discussion about?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Share your thoughts, questions, or insights..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border bg-background"
                  >
                    <option>General</option>
                    <option>Success Stories</option>
                    <option>Tips & Tricks</option>
                    <option>Help</option>
                    <option>Feature Requests</option>
                  </select>
                  <Button onClick={handleCreatePost} className="ff-btn-primary">
                    Create Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discussion Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="ff-hover-lift">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{post.author.name}</span>
                              {post.author.isVerified && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {post.author.badge}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              {getCategoryIcon(post.category)}
                              <span>{post.category}</span>
                              <span>•</span>
                              <span>{post.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmarkPost(post.id)}
                        >
                          <Bookmark className={cn(
                            'w-4 h-4',
                            post.isBookmarked ? 'fill-current text-primary' : ''
                          )} />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground">{post.content}</p>
                      </div>

                      {/* Post Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={cn(
                              post.isLiked ? 'text-red-500' : 'text-muted-foreground'
                            )}
                          >
                            <Heart className={cn(
                              'w-4 h-4 mr-1',
                              post.isLiked ? 'fill-current' : ''
                            )} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.replies}
                          </Button>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="showcase" className="space-y-4">
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Project Showcase</h3>
            <p className="text-muted-foreground mb-4">
              Share your amazing FlashFusion creations with the community
            </p>
            <Button className="ff-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Share Your Project
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{member.name}</span>
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.role} • {member.contributions} contributions
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.badges.slice(0, 2).map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Joined {member.joinDate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Events</h3>
            <p className="text-muted-foreground mb-4">
              Join our virtual meetups, hackathons, and learning sessions
            </p>
            <Button className="ff-btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              Get Notified
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityHub;