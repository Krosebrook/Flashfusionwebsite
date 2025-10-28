import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Settings,
  Zap,
  Rocket,
  Trophy,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Gift,
  Target,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'xp_gain' | 'achievement' | 'deployment' | 'project' | 'social' | 'system' | 'reminder';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  expires_at?: string;
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
  icon?: string;
  image?: string;
  user_id: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Notification Provider
export function NotificationProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode; 
  userId?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`ff_notifications_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out expired notifications
      const valid = parsed.filter((n: Notification) => 
        !n.expires_at || new Date(n.expires_at) > new Date()
      );
      setNotifications(valid);
    }
  }, [userId]);

  // Save to localStorage when notifications change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`ff_notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      read: false,
      user_id: userId || ''
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      showNotificationToast(newNotification);
    }

    // Limit to 50 notifications
    setNotifications(prev => prev.slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Toast notification for high priority items
function showNotificationToast(notification: Notification) {
  const icons = {
    xp_gain: Zap,
    achievement: Trophy,
    deployment: Rocket,
    project: Target,
    social: Users,
    system: Info,
    reminder: Clock
  };

  const Icon = icons[notification.type] || Bell;

  toast.custom((t) => (
    <Card className="ff-glass border-primary/20 min-w-[320px]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
            {notification.action && (
              <Button
                size="sm"
                className="mt-2 h-6 text-xs ff-btn-primary"
                onClick={() => {
                  notification.action!.onClick?.();
                  toast.dismiss(t);
                }}
              >
                {notification.action.label}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.dismiss(t)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ), {
    duration: 5000,
    position: 'top-right'
  });
}

// Main notification bell component
export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const recentNotifications = notifications.slice(0, 10);

  const getNotificationIcon = (type: string) => {
    const icons = {
      xp_gain: Zap,
      achievement: Trophy,
      deployment: Rocket,
      project: Target,
      social: Users,
      system: Info,
      reminder: Clock
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-muted-foreground',
      medium: 'text-primary',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || 'text-muted-foreground';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <DialogDescription className="sr-only">
              View and manage your FlashFusion notifications. {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'All notifications are read.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="px-6 pb-6">
              {recentNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No notifications yet</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {recentNotifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all hover:bg-muted/50 ${
                              !notification.read ? 'bg-primary/5 border-primary/20' : ''
                            }`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                              notification.action?.onClick?.();
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={`text-sm font-medium line-clamp-1 ${
                                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(notification.created_at)}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeNotification(notification.id);
                                        }}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  
                                  {notification.action && (
                                    <Button
                                      size="sm"
                                      className="mt-2 h-6 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        notification.action!.onClick?.();
                                      }}
                                    >
                                      {notification.action.label}
                                      {notification.action.url && (
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                      )}
                                    </Button>
                                  )}
                                  
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary rounded-full absolute top-4 right-4" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {notifications.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All Notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Real-time notification hooks
export function useRealTimeNotifications(userId: string) {
  const { addNotification } = useNotifications();

  // Simulate real-time updates (in production, use WebSocket or Server-Sent Events)
  useEffect(() => {
    // Mock real-time events
    const interval = setInterval(() => {
      // Random chance of getting a notification
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const mockNotifications = [
          {
            type: 'xp_gain' as const,
            title: 'XP Earned!',
            message: 'You earned 25 XP for using the Code Generator',
            priority: 'medium' as const,
            user_id: userId
          },
          {
            type: 'deployment' as const,
            title: 'Deployment Complete',
            message: 'Your project "My App" has been successfully deployed',
            priority: 'high' as const,
            user_id: userId,
            action: {
              label: 'View Deployment',
              onClick: () => console.log('Navigate to deployment')
            }
          },
          {
            type: 'achievement' as const,
            title: 'Achievement Unlocked!',
            message: 'You unlocked "First Deployment" achievement',
            priority: 'high' as const,
            user_id: userId
          }
        ];

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, addNotification]);
}

// Notification utilities
export const NotificationUtils = {
  createXPNotification: (amount: number, reason: string) => ({
    type: 'xp_gain' as const,
    title: `+${amount} XP Earned!`,
    message: reason,
    priority: 'medium' as const,
    data: { xp: amount, reason }
  }),

  createAchievementNotification: (achievement: any) => ({
    type: 'achievement' as const,
    title: 'Achievement Unlocked!',
    message: `You unlocked "${achievement.name}" achievement`,
    priority: 'high' as const,
    data: { achievement },
    action: {
      label: 'View Achievement',
      onClick: () => console.log('View achievement', achievement)
    }
  }),

  createDeploymentNotification: (project: any, status: 'success' | 'failed') => ({
    type: 'deployment' as const,
    title: status === 'success' ? 'Deployment Successful!' : 'Deployment Failed',
    message: status === 'success' 
      ? `Your project "${project.name}" is now live` 
      : `Deployment of "${project.name}" failed`,
    priority: status === 'success' ? 'high' as const : 'urgent' as const,
    data: { project, status },
    action: {
      label: status === 'success' ? 'View Live App' : 'View Logs',
      onClick: () => console.log('Handle deployment action')
    }
  }),

  createSystemNotification: (title: string, message: string) => ({
    type: 'system' as const,
    title,
    message,
    priority: 'medium' as const
  })
};