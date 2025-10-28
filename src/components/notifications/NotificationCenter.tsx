import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  Bell, 
  BellOff,
  CheckCircle, 
  AlertTriangle, 
  Info,
  XCircle,
  Settings,
  Filter,
  Mail,
  Trash2,
  Volume2,
  VolumeX,
  Smartphone,
  Calendar,
  Clock,
  User,
  Zap,
  Activity,
  Star,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Notification, NotificationSettings } from '../../types/core';

interface NotificationGroup {
  type: string;
  label: string;
  icon: any;
  color: string;
  notifications: Notification[];
}

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    inApp: true,
    frequency: 'immediate',
    types: ['system', 'projects', 'collaboration', 'security']
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  // Initialize notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'success',
        title: 'Deployment Successful',
        message: 'Your FlashFusion Creator Commerce app has been deployed successfully to Vercel.',
        timestamp: '2 minutes ago',
        read: false,
        actionUrl: '/deployments',
        metadata: { project: 'creator-commerce-v2', platform: 'vercel' }
      },
      {
        id: 'notif-2',
        type: 'warning',
        title: 'AI Model Limits Approaching',
        message: 'You have used 85% of your monthly AI generation credits. Consider upgrading to Pro.',
        timestamp: '15 minutes ago',
        read: false,
        actionUrl: '/pricing',
        metadata: { usage: 85, limit: 100 }
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'New Team Member Added',
        message: 'Sarah Chen has joined your Creator Commerce project as a collaborator.',
        timestamp: '1 hour ago',
        read: true,
        actionUrl: '/projects/creator-commerce',
        metadata: { user: 'sarah.chen@example.com', role: 'collaborator' }
      },
      {
        id: 'notif-4',
        type: 'error',
        title: 'Security Alert',
        message: 'Suspicious login attempt detected from new device. Please verify your account.',
        timestamp: '2 hours ago',
        read: false,
        actionUrl: '/settings/security',
        metadata: { ip: '192.168.1.100', location: 'San Francisco, CA' }
      },
      {
        id: 'notif-5',
        type: 'info',
        title: 'System Maintenance Scheduled',
        message: 'Planned maintenance will occur on Sunday, March 24th from 2-4 AM UTC.',
        timestamp: '3 hours ago',
        read: true,
        metadata: { maintenanceDate: '2024-03-24', duration: '2 hours' }
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const groupNotifications = (): NotificationGroup[] => {
    const groups: Record<string, NotificationGroup> = {
      system: {
        type: 'system',
        label: 'System & Updates',
        icon: Settings,
        color: 'text-blue-500',
        notifications: []
      },
      projects: {
        type: 'projects',
        label: 'Projects & Deployments',
        icon: Zap,
        color: 'text-green-500',
        notifications: []
      },
      collaboration: {
        type: 'collaboration',
        label: 'Team & Collaboration',
        icon: User,
        color: 'text-purple-500',
        notifications: []
      },
      security: {
        type: 'security',
        label: 'Security & Privacy',
        icon: AlertTriangle,
        color: 'text-red-500',
        notifications: []
      }
    };

    notifications.forEach(notification => {
      const category = notification.metadata?.category || 'system';
      if (groups[category]) {
        groups[category].notifications.push(notification);
      } else {
        groups.system.notifications.push(notification);
      }
    });

    return Object.values(groups).filter(group => group.notifications.length > 0);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.type === 'error' || notification.type === 'warning';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.type === 'error' || n.type === 'warning').length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Notification & Activity Center</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with real-time notifications, system alerts, project updates, and team activities across your FlashFusion ecosystem.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-yellow-500">{unreadCount}</p>
              </div>
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Important</p>
                <p className="text-2xl font-bold text-red-500">{importantCount}</p>
              </div>
              <Star className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-secondary">
                  {notifications.filter(n => n.timestamp.includes('hour') || n.timestamp.includes('minute')).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        <Button 
          onClick={markAllAsRead}
          className="ff-btn-primary"
          disabled={unreadCount === 0}
        >
          <Mail className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>

        <Button 
          variant="outline"
          onClick={clearAll}
          disabled={notifications.length === 0}
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive All
        </Button>

        <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'important' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('important')}
          >
            Important
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="grouped">By Category</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* All Notifications Tab */}
          <TabsContent value="all" className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found.`}
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`ff-card-interactive ${!notification.read ? 'border-primary/20 bg-primary/5' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{notification.timestamp}</span>
                                </span>
                                {notification.metadata && (
                                  <span>Category: {notification.metadata.category || 'General'}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {notification.actionUrl && (
                          <div className="mt-4">
                            <Button size="sm" className="ff-btn-secondary">
                              View Details
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Grouped Notifications Tab */}
          <TabsContent value="grouped" className="space-y-6">
            {groupNotifications().map((group, index) => (
              <motion.div
                key={group.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <group.icon className={`w-5 h-5 ${group.color}`} />
                      <span>{group.label}</span>
                      <Badge variant="outline">{group.notifications.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.notifications.map(notification => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.email}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.push}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.inApp}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, inApp: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  {[
                    { id: 'system', label: 'System Updates', icon: Settings },
                    { id: 'projects', label: 'Project Activities', icon: Zap },
                    { id: 'collaboration', label: 'Team Collaboration', icon: User },
                    { id: 'security', label: 'Security Alerts', icon: AlertTriangle }
                  ].map(type => (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <type.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{type.label}</span>
                      </div>
                      <Switch 
                        checked={settings.types.includes(type.id)}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({
                            ...prev,
                            types: checked 
                              ? [...prev.types, type.id]
                              : prev.types.filter(t => t !== type.id)
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}