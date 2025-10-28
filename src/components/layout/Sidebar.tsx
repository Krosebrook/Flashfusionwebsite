import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Home, 
  Zap,
  Layers3,
  Palette,
  Rocket,
  BarChart3,
  Users,
  Puzzle,
  GitBranch,
  Settings,
  Star,
  Trophy,
  Target,
  Calendar,
  Sparkles,
  Wand2,
  Camera,
  ShoppingBag,
  Bot,
  MessageSquare,
  Shield,
  Activity,
  Workflow,
  FileCheck,
  CheckCircle,
  Crown,
  ChevronRight,
  ChevronDown,
  Flame,
  Brain
} from 'lucide-react';
import { cn } from '../ui/utils';
import { PageType, UserStats, DailyTask } from '../../types';

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  userStats: UserStats | null;
  setShowWizard: (show: boolean) => void;
  dailyTasks: DailyTask[];
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  tier?: 'free' | 'pro' | 'enterprise';
  new?: boolean;
  hot?: boolean;
  comingSoon?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
      { id: 'projects', label: 'Projects', icon: <Layers3 className="h-4 w-4" /> },
      { id: 'tools', label: 'AI Tools', icon: <Zap className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Creator Suite',
    collapsible: true,
    defaultExpanded: true,
    items: [
      { id: 'creator-content-pipeline', label: 'Content Pipeline', icon: <Flame className="h-4 w-4" />, tier: 'pro', hot: true },
      { id: 'creator-mode', label: 'Creator Hub', icon: <Palette className="h-4 w-4" />, tier: 'free' },
      { id: 'influencer-suite', label: 'Influencer Suite', icon: <Crown className="h-4 w-4" />, tier: 'pro' },
      { id: 'print-on-demand', label: 'Print Design', icon: <Camera className="h-4 w-4" />, tier: 'pro' },
      { id: 'marketplace-manager', label: 'Marketplace Hub', icon: <ShoppingBag className="h-4 w-4" />, tier: 'enterprise' },
    ]
  },
  {
    title: 'Development',
    collapsible: true,
    defaultExpanded: false,
    items: [
      { id: 'templates', label: 'Templates', icon: <Layers3 className="h-4 w-4" /> },
      { id: 'deployments', label: 'Deployments', icon: <Rocket className="h-4 w-4" /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'cicd', label: 'CI/CD', icon: <GitBranch className="h-4 w-4" />, tier: 'pro' },
    ]
  },
  {
    title: 'AI & Automation',
    collapsible: true,
    defaultExpanded: false,
    items: [
      { id: 'multi-agent-orchestration', label: 'Multi-Agent Orchestration', icon: <Brain className="h-4 w-4" />, tier: 'enterprise', new: true },
      { id: 'agents', label: 'AI Agents', icon: <Bot className="h-4 w-4" />, tier: 'pro' },
      { id: 'workflows', label: 'No-Code Builder', icon: <Workflow className="h-4 w-4" />, tier: 'pro', new: true },
      { id: 'ai-trust', label: 'AI Verification', icon: <Shield className="h-4 w-4" />, tier: 'enterprise', new: true },
    ]
  },
  {
    title: 'Management',
    collapsible: true,
    defaultExpanded: false,
    items: [
      { id: 'content-rights', label: 'Content Rights', icon: <FileCheck className="h-4 w-4" />, tier: 'pro', new: true },
      { id: 'wellness', label: 'AI Wellness', icon: <Activity className="h-4 w-4" />, tier: 'free', new: true },
      { id: 'performance', label: 'Performance', icon: <Target className="h-4 w-4" />, tier: 'pro' },
      { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" />, tier: 'enterprise' },
    ]
  },
  {
    title: 'Community',
    collapsible: true,
    defaultExpanded: false,
    items: [
      { id: 'collaboration', label: 'Team', icon: <Users className="h-4 w-4" /> },
      { id: 'community', label: 'Community', icon: <MessageSquare className="h-4 w-4" /> },
      { id: 'integrations', label: 'Integrations', icon: <Puzzle className="h-4 w-4" /> },
      { id: 'gamification', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
    ]
  }
];

export function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  sidebarOpen, 
  setSidebarOpen,
  isAuthenticated,
  userStats,
  setShowWizard,
  dailyTasks
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    NAV_SECTIONS.filter(section => section.defaultExpanded).map(section => section.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleNavigation = (pageId: PageType) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  const completedTasks = dailyTasks?.filter(task => task.completed).length || 0;
  const totalTasks = dailyTasks?.length || 0;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (!isAuthenticated) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sidebar-foreground">FlashFusion</h2>
              <p className="text-xs text-sidebar-foreground/60">Creator Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {userStats && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {userStats.level}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  Creator Level {userStats.level}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {userStats.xp.toLocaleString()} XP
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {userStats.subscription}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-sidebar-foreground/60">Progress to Level {userStats.level + 1}</span>
                <span className="text-sidebar-foreground/60">
                  {((userStats.xp / userStats.xpToNext) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2" />
            </div>
          </div>
        )}

        {/* Daily Tasks Quick View */}
        {dailyTasks && dailyTasks.length > 0 && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-foreground">Daily Tasks</span>
              <Badge variant="outline" className="text-xs">
                {completedTasks}/{totalTasks}
              </Badge>
            </div>
            <Progress value={taskProgress} className="h-2 mb-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('gamification')}
              className="w-full justify-start text-xs h-8"
            >
              <Target className="h-3 w-3 mr-2" />
              View All Tasks
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {section.collapsible ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-8 px-2 mb-1 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => toggleSection(section.title)}
                  >
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {section.title}
                    </span>
                    {expandedSections.includes(section.title) ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {expandedSections.includes(section.title) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 space-y-1"
                      >
                        {section.items.map((item) => (
                          <NavItem
                            key={item.id}
                            item={item}
                            isActive={currentPage === item.id}
                            onClick={() => handleNavigation(item.id)}
                            userTier={userStats?.subscription}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div>
                  <div className="px-2 py-1 mb-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
                      {section.title}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        isActive={currentPage === item.id}
                        onClick={() => handleNavigation(item.id)}
                        userTier={userStats?.subscription}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            onClick={() => setShowWizard(true)}
            className="w-full ff-btn-primary justify-start"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            New Project
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => handleNavigation('settings')}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  userTier?: 'free' | 'pro' | 'enterprise';
}

function NavItem({ item, isActive, onClick, userTier = 'free' }: NavItemProps) {
  const hasAccess = !item.tier || 
    item.tier === 'free' ||
    (item.tier === 'pro' && ['pro', 'enterprise'].includes(userTier)) ||
    (item.tier === 'enterprise' && userTier === 'enterprise');

  const isLocked = !hasAccess && !item.comingSoon;
  const isComingSoon = item.comingSoon;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-9 px-3 relative group",
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        (isLocked || isComingSoon) && "opacity-60"
      )}
      onClick={onClick}
      disabled={isLocked || isComingSoon}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          {item.icon}
          <span className="text-sm">{item.label}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {item.hot && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-auto">
              🔥
            </Badge>
          )}
          {item.new && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
              NEW
            </Badge>
          )}
          {item.badge && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
              {item.badge}
            </Badge>
          )}
          {isComingSoon && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
              Soon
            </Badge>
          )}
          {isLocked && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
              {item.tier?.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>
      
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary rounded-r-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Button>
  );
}