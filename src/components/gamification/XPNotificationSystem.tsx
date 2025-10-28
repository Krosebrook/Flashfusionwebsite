import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';

interface XPNotification {
  id: string;
  type: 'xp_gain' | 'level_up' | 'achievement' | 'streak';
  title: string;
  description: string;
  points?: number;
  level?: number;
  icon?: React.ReactNode;
  duration?: number;
}

export function XPNotificationSystem() {
  const [notifications, setNotifications] = useState<XPNotification[]>([]);
  const { userStats, error } = useGamification();

  // Add notification
  const addNotification = (notification: Omit<XPNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    const duration = notification.duration || 3000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Listen for XP changes and show notifications
  useEffect(() => {
    // This would be triggered by gamification events
    // For now, we'll create a global notification system
    window.showXPNotification = addNotification;
    
    return () => {
      delete window.showXPNotification;
    };
  }, []);

  const getNotificationIcon = (type: string, icon?: React.ReactNode) => {
    if (icon) return icon;
    
    switch (type) {
      case 'xp_gain':
        return <Star className="h-5 w-5 text-warning" />;
      case 'level_up':
        return <Crown className="h-5 w-5 text-accent" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-success" />;
      case 'streak':
        return <Zap className="h-5 w-5 text-primary" />;
      default:
        return <Star className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'xp_gain':
        return 'border-warning/20 bg-warning/5';
      case 'level_up':
        return 'border-accent/20 bg-accent/5 ff-level-up';
      case 'achievement':
        return 'border-success/20 bg-success/5 ff-confetti';
      case 'streak':
        return 'border-primary/20 bg-primary/5 ff-pulse-glow';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className={`
              p-4 rounded-lg border backdrop-blur-sm shadow-lg cursor-pointer
              ${getNotificationClass(notification.type)}
              ff-card-interactive
            `}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type, notification.icon)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-foreground">
                    {notification.title}
                  </h4>
                  {notification.points && (
                    <Badge variant="secondary" className="text-xs">
                      +{notification.points} XP
                    </Badge>
                  )}
                  {notification.level && (
                    <Badge variant="default" className="text-xs">
                      Level {notification.level}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {notification.description}
                </p>
                
                {/* Show XP progress if user stats available */}
                {userStats && notification.type === 'xp_gain' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Level {userStats.level}</span>
                      <span>{userStats.current_level_xp}/{userStats.next_level_xp} XP</span>
                    </div>
                    <Progress 
                      value={(userStats.current_level_xp / userStats.next_level_xp) * 100} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Mini XP counter */}
      {userStats && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            p-3 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm 
            text-center ff-glass
          "
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Crown className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Level {userStats.level}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{userStats.current_level_xp} XP</span>
              <span>{userStats.next_level_xp} XP</span>
            </div>
            <Progress 
              value={userStats.next_level_xp > 0 ? (userStats.current_level_xp / userStats.next_level_xp) * 100 : 0} 
              className="h-1"
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{userStats.streak_days}d</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span>{userStats.achievements_unlocked?.length || 0}</span>
            </div>
          </div>
          
          {/* Offline mode indicator */}
          <div className="mt-1 text-xs text-muted-foreground opacity-60">
            Demo Mode
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Utility functions for triggering notifications
export const showXPGain = (points: number, action: string) => {
  if (window.showXPNotification) {
    window.showXPNotification({
      type: 'xp_gain',
      title: `+${points} XP`,
      description: action,
      points,
      duration: 2000
    });
  }
};

export const showLevelUp = (newLevel: number) => {
  if (window.showXPNotification) {
    window.showXPNotification({
      type: 'level_up',
      title: 'Level Up!',
      description: `You reached level ${newLevel}!`,
      level: newLevel,
      duration: 5000
    });
  }
};

export const showAchievementUnlock = (name: string, description: string) => {
  if (window.showXPNotification) {
    window.showXPNotification({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: `${name}: ${description}`,
      duration: 6000
    });
  }
};

export const showStreakBonus = (days: number) => {
  if (window.showXPNotification) {
    window.showXPNotification({
      type: 'streak',
      title: 'Streak Bonus!',
      description: `${days} day streak maintained`,
      duration: 3000
    });
  }
};

// Global type definitions
declare global {
  interface Window {
    showXPNotification?: (notification: Omit<XPNotification, 'id'>) => void;
  }
}

export default XPNotificationSystem;