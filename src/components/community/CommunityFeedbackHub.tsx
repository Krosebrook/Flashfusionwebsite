import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Send, 
  Users, 
  TrendingUp,
  Lightbulb,
  Bug,
  Heart,
  ChevronUp,
  ChevronDown,
  Filter,
  Search,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  BookOpen,
  Share2,
  Flag,
  Reply,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { analyticsService } from '../../services/AnalyticsService';

interface FeedbackItem {
  id: string;
  type: 'feature-request' | 'bug-report' | 'feedback' | 'question' | 'idea';
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badge?: string;
    verified: boolean;
  };
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  votes: {
    up: number;
    down: number;
    userVote?: 'up' | 'down' | null;
  };
  tags: string[];
  category: string;
  createdAt: number;
  updatedAt: number;
  comments: Comment[];
  adminResponse?: {
    message: string;
    timestamp: number;
    author: string;
  };
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badge?: string;
  };
  content: string;
  timestamp: number;
  votes: {
    up: number;
    down: number;
    userVote?: 'up' | 'down' | null;
  };
  replies?: Comment[];
}

interface CommunityStats {
  totalFeedback: number;
  activeUsers: number;
  featuresImplemented: number;
  avgResponseTime: number;
  satisfactionScore: number;
  topContributors: {
    id: string;
    name: string;
    avatar?: string;
    contributions: number;
    points: number;
  }[];
}

interface FeedbackFilters {
  type: string;
  status: string;
  priority: string;
  category: string;
  sortBy: 'newest' | 'oldest' | 'votes' | 'trending';
  searchQuery: string;
}

export function CommunityFeedbackHub() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'newest',
    searchQuery: ''
  });
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    type: 'feedback' as FeedbackItem['type'],
    title: '',
    description: '',
    category: 'general'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user
  const currentUser = {
    id: 'user-1',
    name: 'John Doe',
    avatar: '',
    verified: true
  };

  // Initialize feedback data
  useEffect(() => {
    const initializeFeedbackData = async () => {
      try {
        // Mock feedback items
        const mockFeedback: FeedbackItem[] = [
          {
            id: 'feedback-1',
            type: 'feature-request',
            title: 'Add Dark Mode Support',
            description: 'It would be great to have a dark mode option for better user experience during night coding sessions.',
            author: {
              id: 'user-2',
              name: 'Sarah Chen',
              avatar: '',
              badge: 'Beta Tester',
              verified: true
            },
            status: 'in-progress',
            priority: 'medium',
            votes: { up: 47, down: 3, userVote: null },
            tags: ['ui', 'accessibility', 'user-experience'],
            category: 'interface',
            createdAt: Date.now() - 172800000, // 2 days ago
            updatedAt: Date.now() - 86400000, // 1 day ago
            comments: [
              {
                id: 'comment-1',
                author: {
                  id: 'admin-1',
                  name: 'FlashFusion Team',
                  avatar: '',
                  badge: 'Team'
                },
                content: 'Thanks for the suggestion! We\'re actively working on dark mode support. It will be included in the next major update.',
                timestamp: Date.now() - 86400000,
                votes: { up: 12, down: 0 }
              }
            ],
            adminResponse: {
              message: 'We\'re planning to implement this in Q1 2024. Thanks for the feedback!',
              timestamp: Date.now() - 86400000,
              author: 'Product Team'
            }
          },
          {
            id: 'feedback-2',
            type: 'bug-report',
            title: 'Code Generator Sometimes Produces Invalid Syntax',
            description: 'When generating React components with complex props, the code generator occasionally produces invalid TypeScript syntax that doesn\'t compile.',
            author: {
              id: 'user-3',
              name: 'Mike Rodriguez',
              avatar: '',
              verified: false
            },
            status: 'open',
            priority: 'high',
            votes: { up: 23, down: 1, userVote: 'up' },
            tags: ['bug', 'code-generator', 'typescript'],
            category: 'tools',
            createdAt: Date.now() - 259200000, // 3 days ago
            updatedAt: Date.now() - 172800000, // 2 days ago
            comments: [
              {
                id: 'comment-2',
                author: {
                  id: 'user-4',
                  name: 'Alex Thompson',
                  avatar: '',
                  badge: 'Pro User'
                },
                content: 'I\'ve experienced this too. It happens specifically with union types and generic constraints.',
                timestamp: Date.now() - 172800000,
                votes: { up: 8, down: 0 }
              }
            ]
          },
          {
            id: 'feedback-3',
            type: 'idea',
            title: 'AI-Powered Code Review Assistant',
            description: 'What if FlashFusion had an AI assistant that could review generated code and suggest improvements, optimizations, and best practices?',
            author: {
              id: 'user-5',
              name: 'Emily Davis',
              avatar: '',
              badge: 'Community Leader',
              verified: true
            },
            status: 'open',
            priority: 'low',
            votes: { up: 67, down: 8, userVote: null },
            tags: ['ai', 'code-review', 'enhancement'],
            category: 'features',
            createdAt: Date.now() - 432000000, // 5 days ago
            updatedAt: Date.now() - 259200000, // 3 days ago
            comments: []
          },
          {
            id: 'feedback-4',
            type: 'feedback',
            title: 'Amazing Platform! Minor UI Suggestions',
            description: 'FlashFusion has been a game-changer for our team. The AI tools are incredibly powerful. Just a few minor UI improvements could make it even better.',
            author: {
              id: 'user-6',
              name: 'David Park',
              avatar: '',
              verified: true
            },
            status: 'open',
            priority: 'low',
            votes: { up: 34, down: 2, userVote: null },
            tags: ['praise', 'ui', 'suggestions'],
            category: 'general',
            createdAt: Date.now() - 518400000, // 6 days ago
            updatedAt: Date.now() - 345600000, // 4 days ago
            comments: [
              {
                id: 'comment-3',
                author: {
                  id: 'admin-2',
                  name: 'Design Team',
                  avatar: '',
                  badge: 'Team'
                },
                content: 'Thank you for the kind words! We\'d love to hear your specific UI suggestions.',
                timestamp: Date.now() - 345600000,
                votes: { up: 5, down: 0 }
              }
            ]
          },
          {
            id: 'feedback-5',
            type: 'question',
            title: 'How to Integrate Custom AI Models?',
            description: 'Is there a way to integrate our own trained AI models with FlashFusion? We have some domain-specific models that could enhance our workflow.',
            author: {
              id: 'user-7',
              name: 'Lisa Zhang',
              avatar: '',
              badge: 'Enterprise',
              verified: true
            },
            status: 'open',
            priority: 'medium',
            votes: { up: 19, down: 0, userVote: null },
            tags: ['integration', 'ai-models', 'enterprise'],
            category: 'integration',
            createdAt: Date.now() - 604800000, // 7 days ago
            updatedAt: Date.now() - 432000000, // 5 days ago
            comments: []
          }
        ];

        const mockStats: CommunityStats = {
          totalFeedback: 127,
          activeUsers: 89,
          featuresImplemented: 23,
          avgResponseTime: 18, // hours
          satisfactionScore: 4.7,
          topContributors: [
            { id: 'user-5', name: 'Emily Davis', avatar: '', contributions: 15, points: 890 },
            { id: 'user-2', name: 'Sarah Chen', avatar: '', contributions: 12, points: 720 },
            { id: 'user-8', name: 'James Wilson', avatar: '', contributions: 9, points: 540 },
            { id: 'user-9', name: 'Anna Kim', avatar: '', contributions: 8, points: 480 },
            { id: 'user-10', name: 'Carlos Silva', avatar: '', contributions: 7, points: 420 }
          ]
        };

        setFeedbackItems(mockFeedback);
        setCommunityStats(mockStats);

      } catch (error) {
        console.error('Failed to load feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFeedbackData();
  }, []);

  // Filter and sort feedback items
  const filteredFeedback = useMemo(() => {
    let filtered = feedbackItems.filter(item => {
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesSearch = filters.searchQuery === '' || 
        item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesType && matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });

    // Sort filtered items
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'votes':
        filtered.sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
        break;
      case 'trending':
        // Simple trending algorithm based on recent votes and comments
        filtered.sort((a, b) => {
          const aScore = (a.votes.up - a.votes.down) * (1 + a.comments.length) / ((Date.now() - a.updatedAt) / 86400000 + 1);
          const bScore = (b.votes.up - b.votes.down) * (1 + b.comments.length) / ((Date.now() - b.updatedAt) / 86400000 + 1);
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  }, [feedbackItems, filters]);

  const handleVote = useCallback((feedbackId: string, voteType: 'up' | 'down') => {
    setFeedbackItems(prev => prev.map(item => {
      if (item.id === feedbackId) {
        const currentVote = item.votes.userVote;
        let newVotes = { ...item.votes };

        if (currentVote === voteType) {
          // Remove vote
          newVotes.userVote = null;
          if (voteType === 'up') newVotes.up -= 1;
          else newVotes.down -= 1;
        } else {
          // Add or change vote
          if (currentVote) {
            // Change vote
            if (currentVote === 'up') newVotes.up -= 1;
            else newVotes.down -= 1;
          }
          newVotes.userVote = voteType;
          if (voteType === 'up') newVotes.up += 1;
          else newVotes.down += 1;
        }

        analyticsService.trackFeedbackVote(feedbackId, voteType, newVotes.userVote !== null);
        return { ...item, votes: newVotes };
      }
      return item;
    }));
  }, []);

  const handleSubmitFeedback = useCallback(async () => {
    if (!newFeedback.title.trim() || !newFeedback.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const feedbackItem: FeedbackItem = {
        id: `feedback-${Date.now()}`,
        type: newFeedback.type,
        title: newFeedback.title,
        description: newFeedback.description,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          verified: currentUser.verified
        },
        status: 'open',
        priority: 'medium',
        votes: { up: 0, down: 0, userVote: null },
        tags: [],
        category: newFeedback.category,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        comments: []
      };

      setFeedbackItems(prev => [feedbackItem, ...prev]);
      setNewFeedback({
        type: 'feedback',
        title: '',
        description: '',
        category: 'general'
      });

      toast.success('Feedback submitted successfully!');
      analyticsService.trackFeedbackSubmitted(newFeedback.type, newFeedback.category);

    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  }, [newFeedback, currentUser]);

  const getTypeIcon = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'feature-request': return Target;
      case 'bug-report': return Bug;
      case 'feedback': return MessageSquare;
      case 'question': return BookOpen;
      case 'idea': return Lightbulb;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'feature-request': return 'bg-blue-500/10 text-blue-500';
      case 'bug-report': return 'bg-red-500/10 text-red-500';
      case 'feedback': return 'bg-green-500/10 text-green-500';
      case 'question': return 'bg-purple-500/10 text-purple-500';
      case 'idea': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'closed': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: FeedbackItem['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-500';
      case 'high': return 'bg-orange-500/10 text-orange-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Community Feedback Hub</h1>
          <p className="text-muted-foreground">
            Share ideas, report issues, and help shape FlashFusion's future
          </p>
        </div>
        
        <Button
          onClick={() => setSelectedFeedback(null)}
          className="ff-btn-primary"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      </div>

      {/* Community Stats */}
      {communityStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-sm">Total Feedback</h3>
              </div>
              <p className="text-2xl font-bold">{communityStats.totalFeedback}</p>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-secondary" />
                <h3 className="font-medium text-sm">Active Users</h3>
              </div>
              <p className="text-2xl font-bold">{communityStats.activeUsers}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-medium text-sm">Implemented</h3>
              </div>
              <p className="text-2xl font-bold">{communityStats.featuresImplemented}</p>
              <p className="text-xs text-muted-foreground">Features delivered</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-medium text-sm">Response Time</h3>
              </div>
              <p className="text-2xl font-bold">{communityStats.avgResponseTime}h</p>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium text-sm">Satisfaction</h3>
              </div>
              <p className="text-2xl font-bold">{communityStats.satisfactionScore}/5</p>
              <p className="text-xs text-muted-foreground">User rating</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feedback" className="ff-focus-ring">
            Feedback & Ideas ({filteredFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="submit" className="ff-focus-ring">
            Submit New
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="ff-focus-ring">
            Top Contributors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          {/* Filters */}
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="ff-focus-ring w-64"
                  />
                </div>

                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-40 ff-focus-ring">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="bug-report">Bug Report</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-40 ff-focus-ring">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}>
                  <SelectTrigger className="w-40 ff-focus-ring">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="votes">Most Voted</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <Card className="ff-card-interactive">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No feedback found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or be the first to submit feedback!</p>
                </CardContent>
              </Card>
            ) : (
              filteredFeedback.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                
                return (
                  <Card key={item.id} className="ff-card-interactive hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Vote Column */}
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <Button
                            size="sm"
                            variant={item.votes.userVote === 'up' ? 'default' : 'ghost'}
                            onClick={() => handleVote(item.id, 'up')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <span className="font-bold text-lg">
                            {item.votes.up - item.votes.down}
                          </span>
                          <Button
                            size="sm"
                            variant={item.votes.userVote === 'down' ? 'destructive' : 'ghost'}
                            onClick={() => handleVote(item.id, 'down')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getTypeColor(item.type)}>
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {item.type.replace('-', ' ')}
                                </Badge>
                                <Badge className={getStatusColor(item.status)} variant="outline">
                                  {item.status}
                                </Badge>
                                <Badge className={getPriorityColor(item.priority)} variant="outline">
                                  {item.priority}
                                </Badge>
                                {item.category && (
                                  <Badge variant="secondary">{item.category}</Badge>
                                )}
                              </div>
                              
                              <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>

                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {item.adminResponse && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="default" className="text-xs">Official Response</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.adminResponse.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{item.adminResponse.message}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={item.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {item.author.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{item.author.name}</span>
                                {item.author.badge && (
                                  <Badge variant="secondary" className="text-xs">{item.author.badge}</Badge>
                                )}
                                {item.author.verified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                )}
                              </div>

                              <span>•</span>
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              
                              {item.comments.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{item.comments.length}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" className="text-xs">
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                              <Button size="sm" variant="ghost" className="text-xs">
                                <Share2 className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">Submit New Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newFeedback.type} onValueChange={(value) => setNewFeedback(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feedback">General Feedback</SelectItem>
                      <SelectItem value="feature-request">Feature Request</SelectItem>
                      <SelectItem value="bug-report">Bug Report</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="idea">Idea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newFeedback.category} onValueChange={(value) => setNewFeedback(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="interface">User Interface</SelectItem>
                      <SelectItem value="tools">AI Tools</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Brief, descriptive title for your feedback"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                  className="ff-focus-ring"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {newFeedback.title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Provide detailed information about your feedback, including steps to reproduce (for bugs), use cases (for features), or specific suggestions."
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                  className="ff-focus-ring resize-none"
                  rows={6}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {newFeedback.description.length}/1000 characters
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback || !newFeedback.title.trim() || !newFeedback.description.trim()}
                  className="ff-btn-primary"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          {communityStats && (
            <div className="space-y-4">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityStats.topContributors.map((contributor, index) => (
                      <div key={contributor.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback>
                            {contributor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{contributor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {contributor.contributions} contributions
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">{contributor.points}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Be respectful and constructive</p>
                        <p className="text-muted-foreground">Keep discussions professional and helpful</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Provide detailed information</p>
                        <p className="text-muted-foreground">Include steps to reproduce bugs and clear use cases for features</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Search before posting</p>
                        <p className="text-muted-foreground">Check if similar feedback already exists and add your vote</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Use appropriate categories and tags</p>
                        <p className="text-muted-foreground">Help us organize feedback effectively</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}