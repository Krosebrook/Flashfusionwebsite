import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  Bell, Activity, Settings, Filter, Search, MoreHorizontal,
  Clock, CheckCircle, AlertTriangle, Info, X, Star,
  Users, Code, Rocket, Shield, Zap, TrendingUp,
  MessageSquare, GitBranch, Database, Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'system' | 'project' | 'team' | 'achievement' | 'deployment' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionable: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

interface ActivityEvent {
  id: string;
  type: 'user_action' | 'system_event' | 'team_activity' | 'integration_event';
  actor: string;
  action: string;
  target: string;
  timestamp: Date;
  details: string;
  icon: string;
  color: string;
}

interface NotificationActivityCenterProps {
  onClose?: () => void;
}

// Mock data - replace with real data from Supabase
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deployment',
    title: 'Deployment Successful',
    message: 'Your e-commerce app has been successfully deployed to Vercel',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high',
    actionable: true,
    actionUrl: '/deployments',
    actionLabel: 'View Deployment'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'Code Master - Generated 50+ components',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'medium',
    actionable: true,
    actionUrl: '/achievements',
    actionLabel: 'View Badge'
  },
  {
    id: '3',
    type: 'team',
    title: 'New Team Member',
    message: 'Sarah Johnson joined your workspace',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    actionable: true,
    actionUrl: '/team',
    actionLabel: 'View Team'
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM UTC',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'medium',
    actionable: false
  },
  {
    id: '5',
    type: 'project',
    title: 'Build Failed',
    message: 'React Dashboard build failed - TypeScript errors detected',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    priority: 'urgent',
    actionable: true,
    actionUrl: '/projects/react-dashboard/builds',
    actionLabel: 'View Errors'
  },
  {
    id: '6',
    type: 'security',
    title: 'Security Alert',
    message: 'Unusual login activity detected from new device',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    priority: 'high',
    actionable: true,
    actionUrl: '/security/sessions',
    actionLabel: 'Review Session'
  }
];

const mockActivities: ActivityEvent[] = [
  {
    id: '1',
    type: 'user_action',
    actor: 'You',
    action: 'generated',
    target: 'React component library',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    details: 'Created a UI component library with 15 components',
    icon: '⚛️',
    color: 'text-primary'
  },
  {
    id: '2',
    type: 'team_activity',
    actor: 'Alex Chen',
    action: 'deployed',
    target: 'E-commerce storefront',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    details: 'Successfully deployed to production on Vercel',
    icon: '🚀',
    color: 'text-success'
  },
  {
    id: '3',
    type: 'system_event',
    actor: 'System',
    action: 'completed',
    target: 'automated backup',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    details: 'Daily backup completed successfully - 2.3 GB archived',
    icon: '💾',
    color: 'text-info'
  },
  {
    id: '4',
    type: 'integration_event',
    actor: 'GitHub Integration',
    action: 'synchronized',
    target: '3 repositories',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: 'Code repositories synced with latest commits',
    icon: '🔄',
    color: 'text-secondary'
  },
  {
    id: '5',
    type: 'user_action',
    actor: 'You',
    action: 'optimized',
    target: 'API performance',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    details: 'Improved API response times by 40% using caching',
    icon: '⚡',
    color: 'text-warning'
  }
];

export function NotificationActivityCenter({ onClose }: NotificationActivityCenterProps) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activities] = useState(mockActivities);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [priorityFilter, setPriorityFilter] = useState('medium');

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(notification => !notification.read);
      } else if (selectedFilter === 'actionable') {
        filtered = filtered.filter(notification => notification.actionable);
      } else {
        filtered = filtered.filter(notification => notification.type === selectedFilter);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications, searchQuery, selectedFilter]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activities, searchQuery]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const urgentCount = useMemo(() => {
    return notifications.filter(n => !n.read && n.priority === 'urgent').length;
  }, [notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    toast.success('All notifications marked as read');
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  }, []);

  const handleAction = useCallback((notification: Notification) => {
    if (notification.actionUrl) {
      // In a real app, this would navigate to the action URL
      console.log('Navigating to:', notification.actionUrl);
      toast.success(`Opening ${notification.actionLabel}`);
    }
    markAsRead(notification.id);
  }, [markAsRead]);

  const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const iconProps = {
      className: `w-5 h-5 ${
        priority === 'urgent' ? 'text-destructive' :
        priority === 'high' ? 'text-warning' :
        priority === 'medium' ? 'text-info' :
        'text-muted-foreground'
      }`
    };

    switch (type) {
      case 'system':
        return <Settings {...iconProps} />;
      case 'project':
        return <Code {...iconProps} />;
      case 'team':
        return <Users {...iconProps} />;
      case 'achievement':
        return <Star {...iconProps} />;
      case 'deployment':
        return <Rocket {...iconProps} />;
      case 'security':
        return <Shield {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-destructive bg-destructive/5';
      case 'high':
        return 'border-l-warning bg-warning/5';
      case 'medium':
        return 'border-l-info bg-info/5';
      case 'low':
        return 'border-l-muted-foreground bg-muted/30';
      default:
        return 'border-l-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notifications & Activity</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread {urgentCount > 0 && `• ${urgentCount} urgent`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="ff-hover-scale"
          >
            <Settings className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ff-hover-scale">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showSettings && (
        <Card className="m-4 mb-0 border-info/20 bg-info/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Digest Frequency</Label>
                <Select value={digestFrequency} onValueChange={setDigestFrequency}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Minimum Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low & above</SelectItem>
                    <SelectItem value="medium">Medium & above</SelectItem>
                    <SelectItem value="high">High & above</SelectItem>
                    <SelectItem value="urgent">Urgent only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notifications and activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 ff-focus-ring"
            />
          </div>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="actionable">Actionable</SelectItem>
              <Separator />
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="achievement">Achievements</SelectItem>
              <SelectItem value="deployment">Deployments</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              className="ff-hover-scale"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all as read ({unreadCount})
            </Button>
          </div>
        )}

        {/* Tabs for Notifications and Activity */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 transition-all duration-200 ff-hover-lift cursor-pointer ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-muted/30' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            <Badge variant="outline" className="text-xs h-5">
                              {notification.type}
                            </Badge>
                            {notification.priority !== 'low' && (
                              <Badge
                                variant={
                                  notification.priority === 'urgent' ? 'destructive' :
                                  notification.priority === 'high' ? 'destructive' :
                                  'secondary'
                                }
                                className="text-xs h-5"
                              >
                                {notification.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification);
                            }}
                            className="text-xs ff-hover-scale"
                          >
                            {notification.actionLabel || 'View'}
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="ff-hover-scale opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4 space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`text-lg flex-shrink-0 ${activity.color}`}>
                        {activity.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm mb-1">
                          <span className="font-medium">{activity.actor}</span>
                          <span className="text-muted-foreground"> {activity.action} </span>
                          <span className="font-medium">{activity.target}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.details}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                          <Badge variant="outline" className="text-xs h-5">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default NotificationActivityCenter;