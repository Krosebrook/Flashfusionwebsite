import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { 
  Menu, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Home, 
  Search, 
  Plus, 
  User,
  ArrowLeft,
  MoreHorizontal,
  Grip
} from 'lucide-react';
import { cn } from '../ui/utils';

// Mobile-optimized button with touch feedback
export function TouchButton({ 
  children, 
  className = '', 
  haptic = true,
  ...props 
}: React.ComponentProps<typeof Button> & { 
  haptic?: boolean;
}) {
  const handlePress = () => {
    // Haptic feedback for supported devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="touch-none"
    >
      <Button
        {...props}
        className={cn('min-h-[44px] active:bg-muted/50 transition-all', className)}
        onMouseDown={handlePress}
        onTouchStart={handlePress}
      >
        {children}
      </Button>
    </motion.div>
  );
}

// Swipeable card component
export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
  swipeThreshold = 50
}: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  swipeThreshold?: number;
}) {
  const controls = useAnimation();

  const handlePanEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;

    // Determine swipe direction based on offset and velocity
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold || velocity.x > 500) {
        onSwipeRight?.();
      } else if (offset.x < -swipeThreshold || velocity.x < -500) {
        onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (offset.y > swipeThreshold || velocity.y > 500) {
        onSwipeDown?.();
      } else if (offset.y < -swipeThreshold || velocity.y < -500) {
        onSwipeUp?.();
      }
    }

    // Reset position
    controls.start({ x: 0, y: 0 });
  };

  return (
    <motion.div
      drag={!!(onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown)}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onPanEnd={handlePanEnd}
      animate={controls}
      className={cn('cursor-grab active:cursor-grabbing', className)}
      whileDrag={{ scale: 1.02 }}
    >
      <Card className="select-none">
        {children}
      </Card>
    </motion.div>
  );
}

// Mobile-optimized bottom navigation
export function MobileBottomNav({ 
  items, 
  currentPage, 
  onNavigate 
}: {
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }>;
  currentPage: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around px-4 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <TouchButton
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  'flex flex-col items-center justify-center h-12 w-16 relative',
                  isActive && 'text-primary'
                )}
                onClick={() => onNavigate(item.id)}
              >
                <div className="relative">
                  <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  'text-xs mt-1 truncate max-w-full',
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute -top-1 w-6 h-0.5 bg-primary rounded-full"
                  />
                )}
              </TouchButton>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Pull-to-refresh component
export function PullToRefresh({ 
  onRefresh, 
  children,
  refreshThreshold = 80 
}: {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  refreshThreshold?: number;
}) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePan = (_: any, info: PanInfo) => {
    const { offset } = info;
    
    // Only allow pull down when at the top of the container
    if (containerRef.current?.scrollTop === 0 && offset.y > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(offset.y, refreshThreshold * 1.5));
    }
  };

  const handlePanEnd = async (_: any, info: PanInfo) => {
    const { offset } = info;
    
    if (isPulling && offset.y >= refreshThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  };

  const pullProgress = Math.min(pullDistance / refreshThreshold, 1);
  const showRefreshIndicator = isPulling || isRefreshing;

  return (
    <motion.div
      ref={containerRef}
      className="h-full overflow-auto overscroll-none"
      onPan={handlePan}
      onPanEnd={handlePanEnd}
    >
      <AnimatePresence>
        {showRefreshIndicator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 60,
              y: isPulling ? pullDistance * 0.5 : 0
            }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center bg-card/50 border-b"
          >
            <motion.div
              animate={{ 
                rotate: isRefreshing ? 360 : pullProgress * 180,
                scale: Math.max(pullProgress, 0.5)
              }}
              transition={{ 
                rotate: { duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }
              }}
              className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={{ 
          y: showRefreshIndicator ? pullDistance * 0.3 : 0
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Mobile-optimized header
export function MobileHeader({ 
  title, 
  onBack, 
  actions,
  showBackButton = false,
  transparent = false
}: {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  transparent?: boolean;
}) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-40 border-b',
        transparent 
          ? 'bg-background/80 backdrop-blur-sm border-border/50' 
          : 'bg-card border-border'
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBackButton && onBack && (
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-10 h-10 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </TouchButton>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        
        {actions && (
          <div className="flex items-center gap-1">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
}

// Mobile-friendly action sheet
export function MobileActionSheet({ 
  isOpen, 
  onClose, 
  title,
  actions 
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: Array<{
    label: string;
    icon?: React.ComponentType<any>;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }>;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-auto rounded-t-lg border-t-0"
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          {title && (
            <SheetHeader className="pb-4">
              <SheetTitle className="text-center">{title}</SheetTitle>
              <div className="w-10 h-1 bg-muted rounded-full mx-auto" />
            </SheetHeader>
          )}
          
          <div className="space-y-2 pb-safe">
            {actions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <TouchButton
                  key={index}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-12 text-left',
                    action.destructive && 'text-destructive hover:text-destructive',
                    action.disabled && 'opacity-50'
                  )}
                  onClick={() => {
                    if (!action.disabled) {
                      action.onClick();
                      onClose();
                    }
                  }}
                  disabled={action.disabled}
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  {action.label}
                </TouchButton>
              );
            })}
            
            <Separator className="my-2" />
            
            <TouchButton
              variant="outline"
              className="w-full h-12"
              onClick={onClose}
            >
              Cancel
            </TouchButton>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

// Gesture-based navigation hints
export function GestureHints({ 
  hints = [
    "Swipe right to go back",
    "Pull down to refresh", 
    "Long press for more options",
    "Swipe left on items to delete"
  ]
}: {
  hints?: string[];
}) {
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    // Check if user has seen hints
    const hasSeenHints = localStorage.getItem('ff_gesture_hints_seen');
    if (!hasSeenHints && 'ontouchstart' in window) {
      setShowHints(true);
    }
  }, []);

  useEffect(() => {
    if (!showHints) return;
    
    const interval = setInterval(() => {
      setCurrentHint((prev) => (prev + 1) % hints.length);
    }, 3000);

    const timeout = setTimeout(() => {
      setShowHints(false);
      localStorage.setItem('ff_gesture_hints_seen', 'true');
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showHints, hints.length]);

  if (!showHints) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 left-4 right-4 z-50 lg:hidden"
    >
      <Card className="ff-glass border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grip className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {hints[currentHint]}
              </span>
            </div>
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </TouchButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Touch-optimized list with swipe actions
export function SwipeableList({ 
  items, 
  renderItem,
  swipeActions 
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  swipeActions?: {
    left?: Array<{
      label: string;
      icon: React.ComponentType<any>;
      color: 'primary' | 'destructive' | 'secondary';
      onClick: (item: any) => void;
    }>;
    right?: Array<{
      label: string;
      icon: React.ComponentType<any>;
      color: 'primary' | 'destructive' | 'secondary';
      onClick: (item: any) => void;
    }>;
  };
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <SwipeableCard
          key={item.id || index}
          onSwipeLeft={() => {
            // Show right actions
            swipeActions?.right?.[0]?.onClick(item);
          }}
          onSwipeRight={() => {
            // Show left actions
            swipeActions?.left?.[0]?.onClick(item);
          }}
          className="w-full"
        >
          <CardContent className="p-0">
            {renderItem(item, index)}
          </CardContent>
        </SwipeableCard>
      ))}
    </div>
  );
}

// Mobile viewport hook
export function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, viewportHeight };
}