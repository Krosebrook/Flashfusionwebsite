import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Zap, 
  Users, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  HelpCircle,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface UserAction {
  id: string;
  type: 'click' | 'hover' | 'focus' | 'input' | 'scroll' | 'keyboard';
  target: string;
  timestamp: number;
  context: Record<string, any>;
  value?: string;
}

interface UserSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  actions: UserAction[];
  goals: string[];
  completedTasks: string[];
  currentWorkflow?: string;
  engagement: {
    timeSpent: number;
    actionsCount: number;
    toolsUsed: string[];
    featuresDiscovered: string[];
  };
}

interface InteractionPattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: Array<{
    type: 'highlight' | 'tooltip' | 'modal' | 'guide' | 'suggestion';
    target: string;
    content: string;
    timing: number;
  }>;
  priority: 'high' | 'medium' | 'low';
}

interface UserInteractionEngineProps {
  currentPage: string;
  isAuthenticated: boolean;
  userPersona?: string;
  onActionTrigger: (action: string, context?: any) => void;
  onHelpRequest: () => void;
  onFeedbackSubmit: (feedback: string, rating: number) => void;
}

export function UserInteractionEngine({
  currentPage,
  isAuthenticated,
  userPersona,
  onActionTrigger,
  onHelpRequest,
  onFeedbackSubmit
}: UserInteractionEngineProps) {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [activeInteractions, setActiveInteractions] = useState<InteractionPattern[]>([]);
  const [showTooltip, setShowTooltip] = useState<{
    target: string;
    content: string;
    position: { x: number; y: number };
  } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userEngagement, setUserEngagement] = useState({
    sessionTime: 0,
    actionsPerMinute: 0,
    currentStreak: 0,
    helpRequestsToday: 0
  });

  const sessionRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Define interaction patterns based on user behavior
  const INTERACTION_PATTERNS: InteractionPattern[] = [
    {
      id: 'first-time-user',
      name: 'First Time User Guide',
      description: 'Guide new users through key features',
      triggers: ['page:home', 'auth:true', 'session:new'],
      actions: [
        {
          type: 'highlight',
          target: '.ff-nav-item',
          content: 'Navigate between different sections here',
          timing: 2000
        },
        {
          type: 'tooltip',
          target: '.ff-btn-primary',
          content: 'Primary actions are highlighted in orange',
          timing: 4000
        },
        {
          type: 'suggestion',
          target: '.tools-section',
          content: 'Start with tools that match your goals',
          timing: 6000
        }
      ],
      priority: 'high'
    },
    {
      id: 'tool-discovery',
      name: 'Tool Discovery Helper',
      description: 'Help users find relevant tools',
      triggers: ['page:tools', 'idle:30s'],
      actions: [
        {
          type: 'modal',
          target: 'body',
          content: 'Need help finding the right tool? Try our AI recommendation system!',
          timing: 30000
        }
      ],
      priority: 'medium'
    },
    {
      id: 'productivity-boost',
      name: 'Productivity Enhancement',
      description: 'Suggest productivity features to active users',
      triggers: ['actions:50+', 'session:15min+'],
      actions: [
        {
          type: 'suggestion',
          target: '.keyboard-shortcuts',
          content: 'Use Ctrl+K for quick navigation to boost your productivity!',
          timing: 1000
        }
      ],
      priority: 'low'
    },
    {
      id: 'feature-announcement',
      name: 'New Feature Highlight',
      description: 'Introduce new features to existing users',
      triggers: ['version:new', 'returning:true'],
      actions: [
        {
          type: 'badge',
          target: '.new-feature',
          content: 'NEW',
          timing: 500
        }
      ],
      priority: 'medium'
    }
  ];

  // Initialize user session
  useEffect(() => {
    const initSession = () => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userId = localStorage.getItem('ff-user-id') || 'anonymous';
      
      const session: UserSession = {
        id: sessionId,
        userId,
        startTime: Date.now(),
        actions: [],
        goals: [],
        completedTasks: [],
        engagement: {
          timeSpent: 0,
          actionsCount: 0,
          toolsUsed: [],
          featuresDiscovered: []
        }
      };

      setCurrentSession(session);
      
      // Update session time every second
      sessionRef.current = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return null;
          
          const timeSpent = Date.now() - prev.startTime;
          return {
            ...prev,
            engagement: {
              ...prev.engagement,
              timeSpent
            }
          };
        });
        
        setUserEngagement(prev => ({
          ...prev,
          sessionTime: prev.sessionTime + 1000
        }));
      }, 1000);
    };

    initSession();

    return () => {
      if (sessionRef.current) {
        clearInterval(sessionRef.current);
      }
    };
  }, []);

  // Track user actions
  const trackAction = useCallback((action: UserAction) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      
      const updatedActions = [...prev.actions, action];
      const actionsPerMinute = (updatedActions.length / ((Date.now() - prev.startTime) / 60000)) || 0;
      
      setUserEngagement(prev => ({
        ...prev,
        actionsPerMinute: Math.round(actionsPerMinute * 10) / 10
      }));
      
      return {
        ...prev,
        actions: updatedActions,
        engagement: {
          ...prev.engagement,
          actionsCount: updatedActions.length
        }
      };
    });
  }, []);

  // Set up global event listeners for interaction tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const targetSelector = target.className || target.tagName.toLowerCase();
      
      trackAction({
        id: `action-${Date.now()}`,
        type: 'click',
        target: targetSelector,
        timestamp: Date.now(),
        context: {
          page: currentPage,
          position: { x: e.clientX, y: e.clientY },
          authenticated: isAuthenticated
        }
      });

      // Check for interaction triggers
      checkInteractionTriggers('click', targetSelector);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      trackAction({
        id: `action-${Date.now()}`,
        type: 'keyboard',
        target: e.key,
        timestamp: Date.now(),
        context: {
          page: currentPage,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey
        }
      });

      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            onActionTrigger('search-open');
            break;
          case '/':
            e.preventDefault();
            onHelpRequest();
            break;
        }
      }
    };

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      trackAction({
        id: `action-${Date.now()}`,
        type: 'scroll',
        target: 'window',
        timestamp: Date.now(),
        context: {
          page: currentPage,
          scrollPercentage: Math.round(scrollPercentage)
        }
      });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage, isAuthenticated, trackAction, onActionTrigger, onHelpRequest]);

  // Check for interaction pattern triggers
  const checkInteractionTriggers = useCallback((eventType: string, target: string) => {
    const sessionTime = currentSession ? Date.now() - currentSession.startTime : 0;
    const actionCount = currentSession?.actions.length || 0;
    
    const context = {
      page: currentPage,
      auth: isAuthenticated,
      sessionTime,
      actionCount,
      userPersona
    };

    INTERACTION_PATTERNS.forEach(pattern => {
      const shouldTrigger = pattern.triggers.some(trigger => {
        if (trigger.startsWith('page:')) {
          return trigger.includes(currentPage);
        }
        if (trigger.startsWith('auth:')) {
          return trigger.includes(isAuthenticated.toString());
        }
        if (trigger.startsWith('actions:')) {
          const threshold = parseInt(trigger.replace('actions:', '').replace('+', ''));
          return actionCount >= threshold;
        }
        if (trigger.startsWith('session:')) {
          const timeMatch = trigger.match(/(\d+)(min|s)/);
          if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2];
            const thresholdMs = unit === 'min' ? value * 60000 : value * 1000;
            return sessionTime >= thresholdMs;
          }
        }
        if (trigger.startsWith('idle:')) {
          // Check for idle time (would need additional idle detection logic)
          return false;
        }
        return false;
      });

      if (shouldTrigger && !activeInteractions.find(ai => ai.id === pattern.id)) {
        setActiveInteractions(prev => [...prev, pattern]);
        executeInteractionPattern(pattern);
      }
    });
  }, [currentPage, isAuthenticated, userPersona, currentSession, activeInteractions]);

  // Execute interaction pattern actions
  const executeInteractionPattern = useCallback((pattern: InteractionPattern) => {
    pattern.actions.forEach(action => {
      setTimeout(() => {
        switch (action.type) {
          case 'highlight':
            highlightElement(action.target);
            break;
          case 'tooltip':
            showTooltipForElement(action.target, action.content);
            break;
          case 'modal':
            // Show modal (would integrate with actual modal system)
            break;
          case 'suggestion':
            showSuggestion(action.content);
            break;
        }
      }, action.timing);
    });
  }, []);

  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('ff-pulse-glow');
      setTimeout(() => {
        element.classList.remove('ff-pulse-glow');
      }, 3000);
    }
  };

  const showTooltipForElement = (selector: string, content: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setShowTooltip({
        target: selector,
        content,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        }
      });

      setTimeout(() => {
        setShowTooltip(null);
      }, 5000);
    }
  };

  const showSuggestion = (content: string) => {
    // Could integrate with a toast notification system
    console.log('Suggestion:', content);
  };

  // Performance analytics
  const getEngagementLevel = () => {
    const { sessionTime, actionsPerMinute } = userEngagement;
    const sessionMinutes = sessionTime / 60000;
    
    if (sessionMinutes < 1) return 'warming-up';
    if (actionsPerMinute > 10) return 'highly-engaged';
    if (actionsPerMinute > 5) return 'engaged';
    if (actionsPerMinute > 2) return 'moderately-engaged';
    return 'low-engagement';
  };

  const getProductivityScore = () => {
    const { actionsPerMinute, currentStreak } = userEngagement;
    const engagementMultiplier = actionsPerMinute * 10;
    const streakBonus = currentStreak * 5;
    return Math.min(100, Math.round(engagementMultiplier + streakBonus));
  };

  return (
    <>
      {/* Real-time User Interaction Overlay */}
      {showTooltip && (
        <div
          className="fixed z-50 bg-primary text-primary-foreground text-sm px-3 py-2 rounded-md shadow-lg pointer-events-none"
          style={{
            left: showTooltip.position.x,
            top: showTooltip.position.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {showTooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
        </div>
      )}

      {/* Floating Help Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <Card className="ff-glass w-80 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Session Insights
              <Badge variant="outline" className="ml-auto text-xs">
                {getEngagementLevel()}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.floor(userEngagement.sessionTime / 60000)}m
                </div>
                <div className="text-xs text-muted-foreground">Session Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {userEngagement.actionsPerMinute}
                </div>
                <div className="text-xs text-muted-foreground">Actions/Min</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Productivity Score</span>
                <span className="font-bold">{getProductivityScore()}%</span>
              </div>
              <Progress value={getProductivityScore()} className="h-2" />
            </div>

            <Tabs defaultValue="help" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="help" className="text-xs">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Help
                </TabsTrigger>
                <TabsTrigger value="feedback" className="text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Feedback
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="help" className="space-y-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={onHelpRequest}
                >
                  <HelpCircle className="w-3 h-3 mr-2" />
                  Get Help (Ctrl+/)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => onActionTrigger('search-open')}
                >
                  <Target className="w-3 h-3 mr-2" />
                  Search Tools (Ctrl+K)
                </Button>
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-2 mt-3">
                <div className="text-xs text-muted-foreground mb-2">
                  How's your experience so far?
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-auto"
                      onClick={() => onFeedbackSubmit('Quick rating', rating)}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <div className="fixed bottom-6 left-6 z-30">
        <Card className="ff-glass">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd>
                <span>Quick Search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+/</kbd>
                <span>Get Help</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UserInteractionEngine;