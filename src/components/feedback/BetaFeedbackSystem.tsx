/**
 * @fileoverview Beta Testing & Feedback Collection System
 * @chunk feedback
 * @category analytics
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * BETA FEEDBACK SYSTEM
 * 
 * Comprehensive feedback collection system for beta testing program
 * with user session recording, bug reporting, feature requests, and analytics.
 * 
 * Features:
 * - Real-time feedback collection
 * - Bug reporting with screenshots
 * - Feature request tracking
 * - User satisfaction scoring
 * - Session recording integration
 * - Priority-based feedback routing
 * - Analytics dashboard
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { 
  MessageCircle, 
  Bug, 
  Lightbulb, 
  Star,
  Camera,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Zap,
  Settings,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Heart
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'general' | 'improvement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  rating: number;
  category: string;
  user: {
    id: string;
    email: string;
    role: string;
    experience: string;
  };
  metadata: {
    url: string;
    userAgent: string;
    timestamp: number;
    sessionId: string;
    screenshot?: string;
    steps?: string[];
  };
  responses: FeedbackResponse[];
  votes: number;
  tags: string[];
}

interface FeedbackResponse {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  type: 'team_response' | 'user_update' | 'status_change';
}

interface BetaTester {
  id: string;
  email: string;
  name: string;
  role: string;
  experience: string;
  joinDate: number;
  feedbackCount: number;
  quality_score: number;
  status: 'active' | 'inactive' | 'graduated';
}

const FEEDBACK_CATEGORIES = [
  { value: 'ui_ux', label: 'UI/UX Design', icon: '🎨' },
  { value: 'performance', label: 'Performance', icon: '⚡' },
  { value: 'ai_tools', label: 'AI Tools', icon: '🤖' },
  { value: 'authentication', label: 'Authentication', icon: '🔐' },
  { value: 'dashboard', label: 'Dashboard', icon: '📊' },
  { value: 'deployment', label: 'Deployment', icon: '🚀' },
  { value: 'collaboration', label: 'Collaboration', icon: '👥' },
  { value: 'mobile', label: 'Mobile Experience', icon: '📱' },
  { value: 'onboarding', label: 'Onboarding', icon: '🎯' },
  { value: 'other', label: 'Other', icon: '📝' }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'advanced', label: 'Advanced (5+ years)' },
  { value: 'expert', label: 'Expert (10+ years)' }
];

export function BetaFeedbackSystem(): JSX.Element {
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackData, setFeedbackData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    rating: 5,
    steps: [''],
    allowScreenshot: true,
    email: '',
    experience: 'intermediate'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [betaTesters, setBetaTesters] = useState<BetaTester[]>([]);
  const [analytics, setAnalytics] = useState({
    totalFeedback: 0,
    resolvedFeedback: 0,
    avgRating: 0,
    topCategories: [],
    activeTesters: 0
  });

  /**
   * Initialize feedback system
   */
  useEffect(() => {
    loadFeedbackData();
    loadBetaTesters();
    loadAnalytics();
    setupSessionTracking();
  }, []);

  /**
   * Load feedback data
   */
  const loadFeedbackData = useCallback(async (): Promise<void> => {
    try {
      // In production, this would fetch from your API
      const mockFeedback = generateMockFeedback();
      setFeedbackList(mockFeedback);
    } catch (error) {
      console.error('Failed to load feedback data:', error);
    }
  }, []);

  /**
   * Load beta testers data
   */
  const loadBetaTesters = useCallback(async (): Promise<void> => {
    try {
      const mockTesters = generateMockBetaTesters();
      setBetaTesters(mockTesters);
    } catch (error) {
      console.error('Failed to load beta testers:', error);
    }
  }, []);

  /**
   * Load analytics data
   */
  const loadAnalytics = useCallback(async (): Promise<void> => {
    try {
      const mockAnalytics = {
        totalFeedback: 147,
        resolvedFeedback: 89,
        avgRating: 4.2,
        topCategories: [
          { category: 'AI Tools', count: 34 },
          { category: 'UI/UX Design', count: 28 },
          { category: 'Performance', count: 22 }
        ],
        activeTesters: 42
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  /**
   * Setup session tracking
   */
  const setupSessionTracking = useCallback((): void => {
    // Track user session for context
    const sessionData = {
      sessionId: generateSessionId(),
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };
    
    // Store session data for feedback context
    sessionStorage.setItem('beta_session', JSON.stringify(sessionData));
  }, []);

  /**
   * Handle feedback submission
   */
  const handleSubmitFeedback = useCallback(async (): Promise<void> => {
    if (!feedbackData.title.trim() || !feedbackData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get session data for context
      const sessionData = JSON.parse(sessionStorage.getItem('beta_session') || '{}');
      
      // Capture screenshot if enabled
      let screenshot = null;
      if (feedbackData.allowScreenshot) {
        screenshot = await captureScreenshot();
      }

      const feedbackItem: Partial<FeedbackItem> = {
        type: feedbackType as any,
        title: feedbackData.title,
        description: feedbackData.description,
        priority: feedbackData.priority as any,
        status: 'open',
        rating: feedbackData.rating,
        category: feedbackData.category,
        user: {
          id: generateUserId(),
          email: feedbackData.email,
          role: 'beta_tester',
          experience: feedbackData.experience
        },
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          sessionId: sessionData.sessionId,
          screenshot,
          steps: feedbackData.steps.filter(step => step.trim())
        },
        responses: [],
        votes: 0,
        tags: [feedbackType, feedbackData.category]
      };

      // Submit feedback (in production, this would be an API call)
      await submitFeedbackToAPI(feedbackItem);
      
      // Add to local state for immediate feedback
      setFeedbackList(prev => [{
        ...feedbackItem,
        id: generateFeedbackId()
      } as FeedbackItem, ...prev]);

      // Reset form
      setFeedbackData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        rating: 5,
        steps: [''],
        allowScreenshot: true,
        email: feedbackData.email, // Keep email
        experience: feedbackData.experience // Keep experience
      });

      toast.success('Feedback submitted successfully! Thank you for helping improve FlashFusion.');
      
      // Switch to feedback list tab
      setActiveTab('feedback');
      
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [feedbackData, feedbackType]);

  /**
   * Capture screenshot for feedback
   */
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    try {
      // Using html2canvas or similar library in production
      return 'data:image/png;base64,mock_screenshot_data';
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      return null;
    }
  }, []);

  /**
   * Add step to reproduction steps
   */
  const addStep = useCallback((): void => {
    setFeedbackData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  }, []);

  /**
   * Remove step from reproduction steps
   */
  const removeStep = useCallback((index: number): void => {
    setFeedbackData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  }, []);

  /**
   * Update step content
   */
  const updateStep = useCallback((index: number, value: string): void => {
    setFeedbackData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  }, []);

  /**
   * Vote on feedback item
   */
  const handleVote = useCallback(async (feedbackId: string, voteType: 'up' | 'down'): Promise<void> => {
    try {
      // Update local state immediately
      setFeedbackList(prev => prev.map(item => 
        item.id === feedbackId 
          ? { ...item, votes: item.votes + (voteType === 'up' ? 1 : -1) }
          : item
      ));
      
      // Submit vote to API in production
      toast.success(`Vote ${voteType === 'up' ? 'added' : 'removed'} successfully`);
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  }, []);

  const selectedCategory = FEEDBACK_CATEGORIES.find(cat => cat.value === feedbackData.category);

  return (
    <div className="space-y-6 ff-fade-in-up max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)]">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-['Sora'] text-3xl font-bold text-[var(--ff-text-primary)]">
              Beta Feedback Center
            </h1>
            <p className="text-[var(--ff-text-secondary)] text-lg">
              Help us improve FlashFusion with your valuable feedback
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="secondary" className="ff-badge-primary">
            <Users className="h-3 w-3 mr-1" />
            {analytics.activeTesters} Active Beta Testers
          </Badge>
          <Badge variant="secondary" className="ff-badge-secondary">
            <MessageCircle className="h-3 w-3 mr-1" />
            {analytics.totalFeedback} Total Feedback
          </Badge>
          <Badge variant="secondary" className="ff-badge-success">
            <Star className="h-3 w-3 mr-1" />
            {analytics.avgRating}/5 Average Rating
          </Badge>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="submit" className="ff-nav-item">
            <Send className="h-4 w-4 mr-1" />
            Submit Feedback
          </TabsTrigger>
          <TabsTrigger value="feedback" className="ff-nav-item">
            <MessageCircle className="h-4 w-4 mr-1" />
            Community Feedback
          </TabsTrigger>
          <TabsTrigger value="analytics" className="ff-nav-item">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="testers" className="ff-nav-item">
            <Users className="h-4 w-4 mr-1" />
            Beta Testers
          </TabsTrigger>
        </TabsList>

        {/* Submit Feedback Tab */}
        <TabsContent value="submit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Form */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-[var(--ff-primary)]" />
                  Submit Your Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Feedback Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Feedback Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'bug', label: 'Bug Report', icon: Bug, color: 'from-red-500 to-red-600' },
                      { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'from-blue-500 to-blue-600' },
                      { value: 'improvement', label: 'Improvement', icon: TrendingUp, color: 'from-green-500 to-green-600' },
                      { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'from-purple-500 to-purple-600' }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <Card
                          key={type.value}
                          className={`ff-card-interactive cursor-pointer p-3 ${
                            feedbackType === type.value ? 'ring-2 ring-[var(--ff-primary)]' : ''
                          }`}
                          onClick={() => setFeedbackType(type.value)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-sm">{type.label}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Email</Label>
                    <Input
                      placeholder="your@email.com"
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                      className="ff-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Experience Level</Label>
                    <Select 
                      value={feedbackData.experience} 
                      onValueChange={(value) => setFeedbackData(prev => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger className="ff-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Title</Label>
                  <Input
                    placeholder="Brief description of your feedback"
                    value={feedbackData.title}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, title: e.target.value }))}
                    className="ff-input"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description</Label>
                  <Textarea
                    placeholder="Provide detailed information about your feedback..."
                    value={feedbackData.description}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                    className="ff-input min-h-[120px]"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Category</Label>
                    <Select 
                      value={feedbackData.category} 
                      onValueChange={(value) => setFeedbackData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="ff-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FEEDBACK_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Priority</Label>
                    <Select 
                      value={feedbackData.priority} 
                      onValueChange={(value) => setFeedbackData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="ff-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor issue</SelectItem>
                        <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                        <SelectItem value="high">High - Significant impact</SelectItem>
                        <SelectItem value="critical">Critical - Blocking issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Overall Rating</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[feedbackData.rating]}
                      onValueChange={(value) => setFeedbackData(prev => ({ ...prev, rating: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedbackData.rating 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{feedbackData.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Reproduction Steps (for bugs) */}
                {feedbackType === 'bug' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Steps to Reproduce</Label>
                    <div className="space-y-2">
                      {feedbackData.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-[var(--ff-text-muted)] w-8">{index + 1}.</span>
                          <Input
                            placeholder={`Step ${index + 1}`}
                            value={step}
                            onChange={(e) => updateStep(index, e.target.value)}
                            className="ff-input flex-1"
                          />
                          {feedbackData.steps.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStep(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addStep}
                        className="ff-btn-ghost"
                      >
                        Add Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Screenshot Permission */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Allow Screenshot Capture</Label>
                    <p className="text-xs text-[var(--ff-text-muted)]">
                      Help us understand the issue better
                    </p>
                  </div>
                  <Switch
                    checked={feedbackData.allowScreenshot}
                    onCheckedChange={(checked) => setFeedbackData(prev => ({ ...prev, allowScreenshot: checked }))}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedbackData.title.trim() || !feedbackData.description.trim()}
                  className="ff-btn-primary w-full font-['Sora'] font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Feedback Preview */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[var(--ff-secondary)]" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${
                      feedbackType === 'bug' ? 'bg-red-100 text-red-700' :
                      feedbackType === 'feature' ? 'bg-blue-100 text-blue-700' :
                      feedbackType === 'improvement' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {feedbackType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedCategory?.icon} {selectedCategory?.label}
                    </Badge>
                    <Badge className={`text-xs ${
                      feedbackData.priority === 'critical' ? 'bg-red-500 text-white' :
                      feedbackData.priority === 'high' ? 'bg-orange-500 text-white' :
                      feedbackData.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {feedbackData.priority}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                      {feedbackData.title || 'Your feedback title will appear here'}
                    </h3>
                    <p className="text-sm text-[var(--ff-text-secondary)]">
                      {feedbackData.description || 'Your feedback description will appear here'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--ff-text-muted)]">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{feedbackData.rating}/5</span>
                    </div>
                    <div>Experience: {feedbackData.experience}</div>
                  </div>

                  {feedbackType === 'bug' && feedbackData.steps.some(step => step.trim()) && (
                    <div>
                      <h4 className="font-medium text-[var(--ff-text-primary)] mb-2">Reproduction Steps:</h4>
                      <ol className="text-sm space-y-1">
                        {feedbackData.steps.filter(step => step.trim()).map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-[var(--ff-text-muted)]">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Community Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <Card className="ff-card">
                <CardContent className="pt-6 text-center py-12">
                  <MessageCircle className="h-12 w-12 text-[var(--ff-text-muted)] mx-auto mb-4" />
                  <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                    No feedback yet
                  </h3>
                  <p className="text-[var(--ff-text-secondary)]">
                    Be the first to submit feedback and help improve FlashFusion!
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedbackList.map((feedback) => (
                <Card key={feedback.id} className="ff-card">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${
                              feedback.type === 'bug' ? 'bg-red-100 text-red-700' :
                              feedback.type === 'feature' ? 'bg-blue-100 text-blue-700' :
                              feedback.type === 'improvement' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {feedback.type}
                            </Badge>
                            <Badge className={`text-xs ${
                              feedback.priority === 'critical' ? 'bg-red-500 text-white' :
                              feedback.priority === 'high' ? 'bg-orange-500 text-white' :
                              feedback.priority === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {feedback.priority}
                            </Badge>
                            <Badge className={`text-xs ${
                              feedback.status === 'resolved' ? 'bg-green-500 text-white' :
                              feedback.status === 'in_progress' ? 'bg-blue-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              {feedback.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                            {feedback.title}
                          </h3>
                          <p className="text-sm text-[var(--ff-text-secondary)] mb-3">
                            {feedback.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[var(--ff-text-muted)]">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span>{feedback.rating}/5</span>
                            </div>
                            <span>by {feedback.user.email}</span>
                            <span>{new Date(feedback.metadata.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(feedback.id, 'up')}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">{feedback.votes}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="ff-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-[var(--ff-primary)]">
                  {analytics.totalFeedback}
                </div>
                <div className="text-sm text-[var(--ff-text-muted)]">Total Feedback</div>
              </CardContent>
            </Card>
            <Card className="ff-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.resolvedFeedback}
                </div>
                <div className="text-sm text-[var(--ff-text-muted)]">Resolved</div>
              </CardContent>
            </Card>
            <Card className="ff-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.avgRating}
                </div>
                <div className="text-sm text-[var(--ff-text-muted)]">Avg Rating</div>
              </CardContent>
            </Card>
            <Card className="ff-card">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.activeTesters}
                </div>
                <div className="text-sm text-[var(--ff-text-muted)]">Active Testers</div>
              </CardContent>
            </Card>
          </div>

          <Card className="ff-card">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(category.count / analytics.totalFeedback) * 100} className="w-24" />
                      <span className="text-sm text-[var(--ff-text-muted)]">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Beta Testers Tab */}
        <TabsContent value="testers" className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--ff-accent)]" />
                Beta Testing Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-[var(--ff-text-muted)] mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--ff-text-primary)] mb-2">
                  Beta Tester Management
                </h3>
                <p className="text-[var(--ff-text-secondary)]">
                  Beta tester management and statistics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Helper functions
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateFeedbackId(): string {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function submitFeedbackToAPI(feedback: Partial<FeedbackItem>): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
}

function generateMockFeedback(): FeedbackItem[] {
  return [
    {
      id: 'fb_1',
      type: 'feature',
      title: 'Add dark mode toggle in dashboard',
      description: 'It would be great to have a dark mode toggle in the main dashboard for better user experience during night time work.',
      priority: 'medium',
      status: 'in_progress',
      rating: 4,
      category: 'ui_ux',
      user: {
        id: 'user_1',
        email: 'john@example.com',
        role: 'beta_tester',
        experience: 'intermediate'
      },
      metadata: {
        url: 'https://app.flashfusion.ai/dashboard',
        userAgent: 'Mozilla/5.0...',
        timestamp: Date.now() - 86400000,
        sessionId: 'session_123'
      },
      responses: [],
      votes: 12,
      tags: ['feature', 'ui_ux']
    }
  ];
}

function generateMockBetaTesters(): BetaTester[] {
  return [
    {
      id: 'tester_1',
      email: 'john@example.com',
      name: 'John Doe',
      role: 'frontend_developer',
      experience: 'intermediate',
      joinDate: Date.now() - 7 * 86400000,
      feedbackCount: 5,
      quality_score: 4.2,
      status: 'active'
    }
  ];
}

export default BetaFeedbackSystem;