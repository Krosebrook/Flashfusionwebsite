import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock,
  Hash,
  Globe,
  Image,
  Video,
  Link,
  Settings,
  Send,
  Trash2,
  Edit,
  Copy,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

interface SocialMediaManagerProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  media: string[];
  hashtags: string[];
  scheduledDate?: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  followers: number;
  color: string;
  lastPost?: string;
}

export function SocialMediaManager({ user, userTier }: SocialMediaManagerProps) {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      content: 'Just discovered this amazing AI tool for content creation! 🤖✨ Game-changer for creators who want to scale their content production while maintaining quality.',
      platforms: ['instagram', 'twitter', 'linkedin'],
      media: [],
      hashtags: ['AI', 'ContentCreation', 'CreatorEconomy', 'Innovation'],
      scheduledDate: '2024-03-15T14:00:00',
      status: 'Scheduled',
      engagement: {
        likes: 245,
        comments: 18,
        shares: 12,
        views: 2400
      }
    },
    {
      id: '2',
      content: 'Behind the scenes of my latest project! Building an AI-powered web application using FlashFusion. The speed of development is incredible! 🚀',
      platforms: ['youtube', 'instagram'],
      media: ['video_thumbnail.jpg'],
      hashtags: ['WebDevelopment', 'AI', 'TechTutorial', 'Innovation'],
      scheduledDate: '2024-03-16T10:30:00',
      status: 'Scheduled'
    },
    {
      id: '3',
      content: 'Working on some exciting new content about the future of AI in creative industries. What would you like to see covered?',
      platforms: ['twitter', 'linkedin'],
      media: [],
      hashtags: ['AI', 'Creative', 'FutureOfWork'],
      status: 'Draft'
    }
  ]);

  const [platforms] = useState<Platform[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      connected: true,
      followers: 18500,
      color: 'from-pink-500 to-purple-500',
      lastPost: '2 hours ago'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '🎥',
      connected: true,
      followers: 12300,
      color: 'from-red-500 to-red-600',
      lastPost: '1 day ago'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      connected: true,
      followers: 8900,
      color: 'from-blue-400 to-blue-600',
      lastPost: '4 hours ago'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      connected: true,
      followers: 5500,
      color: 'from-blue-600 to-blue-700',
      lastPost: '1 day ago'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      connected: false,
      followers: 0,
      color: 'from-black to-gray-800'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      connected: false,
      followers: 0,
      color: 'from-red-600 to-red-700'
    }
  ]);

  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    content: '',
    platforms: [],
    media: [],
    hashtags: [],
    status: 'Draft'
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'scheduled' | 'published'>('compose');

  const handleCreatePost = () => {
    if (!newPost.content) return;

    const post: SocialPost = {
      id: Date.now().toString(),
      content: newPost.content,
      platforms: newPost.platforms || [],
      media: newPost.media || [],
      hashtags: newPost.hashtags || [],
      scheduledDate: selectedDate ? selectedDate.toISOString() : undefined,
      status: selectedDate ? 'Scheduled' : 'Draft'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      content: '',
      platforms: [],
      media: [],
      hashtags: [],
      status: 'Draft'
    });
    setSelectedDate(undefined);
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms?.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...(prev.platforms || []), platformId]
    }));
  };

  const PostCard = ({ post }: { post: SocialPost }) => {
    const connectedPlatforms = platforms.filter(p => post.platforms.includes(p.id));
    
    return (
      <Card className="p-6 ff-card-interactive">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={
                post.status === 'Published' ? 'default' :
                post.status === 'Scheduled' ? 'secondary' : 'outline'
              }
            >
              {post.status}
            </Badge>
            {post.scheduledDate && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(new Date(post.scheduledDate), 'MMM dd, HH:mm')}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed">{post.content}</p>

        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {connectedPlatforms.map((platform) => (
              <div
                key={platform.id}
                className={`w-8 h-8 rounded bg-gradient-to-r ${platform.color} flex items-center justify-center text-white text-sm`}
                title={platform.name}
              >
                {platform.icon}
              </div>
            ))}
          </div>

          {post.engagement && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{post.engagement.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{post.engagement.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{post.engagement.shares}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{post.engagement.views}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            {post.status === 'Draft' && (
              <>
                <Button size="sm" variant="outline">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Send className="h-3 w-3 mr-1" />
                  Publish Now
                </Button>
              </>
            )}
            {post.status === 'Scheduled' && (
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3 mr-1" />
                Edit Schedule
              </Button>
            )}
            {post.status === 'Published' && (
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                View Analytics
              </Button>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Social Media Manager</h2>
          <p className="text-muted-foreground">
            Create, schedule, and manage your social media content across all platforms
          </p>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.id} className={`p-4 ${platform.connected ? 'ff-card-interactive' : 'opacity-60'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded bg-gradient-to-r ${platform.color} flex items-center justify-center text-white`}>
                {platform.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{platform.name}</div>
                <div className="text-xs text-muted-foreground">
                  {platform.connected ? (
                    <>
                      {platform.followers.toLocaleString()} followers
                      {platform.lastPost && (
                        <div className="text-xs">{platform.lastPost}</div>
                      )}
                    </>
                  ) : (
                    'Not connected'
                  )}
                </div>
              </div>
            </div>
            
            {!platform.connected && (
              <Button size="sm" variant="outline" className="w-full mt-3">
                Connect
              </Button>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Composer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Create New Post</h3>
            
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share your thoughts, insights, or updates..."
                value={newPost.content || ''}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-24 resize-none"
              />

              {/* Platform Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.filter(p => p.connected).map((platform) => (
                    <Button
                      key={platform.id}
                      variant={newPost.platforms?.includes(platform.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className="flex items-center space-x-2"
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Hashtags (optional)</label>
                <Input
                  placeholder="AI, ContentCreation, Tech (separate with commas)"
                  onChange={(e) => setNewPost(prev => ({ 
                    ...prev, 
                    hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                />
              </div>

              {/* Media Upload */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
                <Button variant="outline" size="sm">
                  <Link className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>

              {/* Scheduling */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {selectedDate ? format(selectedDate, 'MMM dd, HH:mm') : 'Schedule'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {selectedDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCreatePost}
                    disabled={!newPost.content || !newPost.platforms?.length}
                  >
                    Save Draft
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-secondary"
                    onClick={handleCreatePost}
                    disabled={!newPost.content || !newPost.platforms?.length}
                  >
                    {selectedDate ? 'Schedule Post' : 'Publish Now'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              {['compose', 'scheduled', 'published'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab as any)}
                  className="capitalize"
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {posts
                .filter(post => {
                  if (activeTab === 'scheduled') return post.status === 'Scheduled';
                  if (activeTab === 'published') return post.status === 'Published';
                  return post.status === 'Draft';
                })
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Posts Published</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Reach</span>
                <span className="font-semibold">45.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement Rate</span>
                <span className="font-semibold">4.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Followers</span>
                <span className="font-semibold">+127</span>
              </div>
            </div>
          </Card>

          {/* Content Suggestions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Content Suggestions</h3>
            <div className="space-y-3">
              {[
                'Share your latest project milestone',
                'Behind-the-scenes of your workflow',
                'Tips for aspiring creators',
                'Industry trend analysis'
              ].map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{suggestion}</span>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Best Times to Post */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Best Times to Post</h3>
            <div className="space-y-2">
              {[
                { platform: 'Instagram', time: '2:00 PM - 4:00 PM' },
                { platform: 'YouTube', time: '10:00 AM - 12:00 PM' },
                { platform: 'Twitter', time: '9:00 AM - 11:00 AM' },
                { platform: 'LinkedIn', time: '8:00 AM - 10:00 AM' }
              ].map((item) => (
                <div key={item.platform} className="flex justify-between text-sm">
                  <span className="font-medium">{item.platform}</span>
                  <span className="text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}