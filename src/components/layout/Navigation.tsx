import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { 
  Menu, 
  Zap, 
  User, 
  Settings, 
  Bell, 
  Search,
  Home,
  Wrench,
  Star,
  HelpCircle,
  LogIn,
  LogOut,
  Crown,
  Shield,
  Sparkles,
  TestTube,
  Activity,
  TrendingUp,
  Rocket,
  BarChart3,
  Brain
} from 'lucide-react';
import { 
  ProfessionalIcon, 
  IconText, 
  NavigationIcon, 
  ActionIcon,
  type IconSize 
} from '../ui/professional-icon-system';
import type { PageType } from '../../types/core';

interface NavigationProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
  onAuthToggle: () => void;
}

export function Navigation({ 
  currentPage, 
  isAuthenticated, 
  onPageChange, 
  onAuthToggle 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, public: true },
    { id: 'showcase', label: 'Platform', icon: Sparkles, public: true, badge: 'New' },
    { id: 'tools', label: 'AI Tools', icon: Wrench, public: true, badge: '60+' },
    { id: 'features', label: 'Features', icon: Star, public: true },
    { id: 'pricing', label: 'Pricing', icon: Crown, public: true },
    { id: 'about', label: 'About', icon: HelpCircle, public: true }
  ] as const;

  const protectedItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projects', icon: Wrench },
    { id: 'business-intelligence', label: 'Business Intelligence', icon: BarChart3, badge: 'New' },
    { id: 'insights', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' }
  ] as const;

  const launchItems = [
    { id: 'stability-testing', label: 'Stability Testing', icon: TestTube },
    { id: 'monitoring-system', label: 'Monitoring', icon: Activity },
    { id: 'marketing-campaign', label: 'Marketing', icon: TrendingUp },
    { id: 'launch-preparation', label: 'Launch Prep', icon: Rocket }
  ] as const;

  const handleNavigation = useCallback((page: PageType) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  }, [onPageChange]);

  const handleAuth = useCallback(() => {
    onAuthToggle();
    setIsMobileMenuOpen(false);
  }, [onAuthToggle]);

  const NavItem = ({ 
    item, 
    onClick 
  }: { 
    item: any; 
    onClick: () => void; 
  }) => (
    <button
      onClick={onClick}
      className={`ff-nav-item flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-all ${
        currentPage === item.id 
          ? 'active bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      <NavigationIcon
        icon={item.icon}
        isActive={currentPage === item.id}
        size="md"
      />
      <span className="font-semibold font-sora">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto ff-text-xs">
          <span className="font-sora">{item.badge}</span>
        </Badge>
      )}
    </button>
  );

  return (
    <nav className="bg-background/95 border-b border-border/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Compact Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 font-bold ff-text-lg ff-text-gradient ff-hover-scale font-sora"
            >
              <ProfessionalIcon
                icon={Zap}
                size="xl"
                context="primary"
                variant="functional"
                label="FlashFusion logo"
              />
              <span className="hidden sm:block">FlashFusion</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.id as PageType)}
                className={`ff-nav-item flex items-center gap-2 px-3 py-2 rounded-lg ff-text-sm font-semibold font-sora transition-all ${
                  currentPage === item.id 
                    ? 'active bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <NavigationIcon
                  icon={item.icon}
                  isActive={currentPage === item.id}
                  size="sm"
                />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-1 ff-text-xs h-5">
                    <span className="font-sora">{item.badge}</span>
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('search')}
              className="ff-focus-ring hover:bg-muted/50"
            >
              <ProfessionalIcon
                icon={Search}
                size="sm"
                context="muted"
                variant="functional"
                label="Search"
              />
            </Button>

            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center gap-1">
                  {protectedItems.slice(0, 2).map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation(item.id as PageType)}
                      className={`ff-focus-ring relative ${
                        currentPage === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                      }`}
                    >
                      <NavigationIcon
                        icon={item.icon}
                        isActive={currentPage === item.id}
                        size="sm"
                      />
                      {item.badge && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 ff-text-xs">
                          <span className="font-sora">{item.badge}</span>
                        </Badge>
                      )}
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAuth}
                  className="ff-focus-ring hover:bg-muted/50"
                >
                  <ProfessionalIcon
                    icon={LogOut}
                    size="sm"
                    context="muted"
                    variant="functional"
                    label="Logout"
                  />
                </Button>
              </>
            ) : (
              <ActionIcon
                icon={LogIn}
                variant="primary"
                size="sm"
                onClick={handleAuth}
                className="px-4"
              >
                <span className="hidden sm:inline">Sign In</span>
              </ActionIcon>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="ff-focus-ring">
                  <ProfessionalIcon
                    icon={Menu}
                    size="md"
                    context="muted"
                    variant="functional"
                    label="Open menu"
                  />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold ff-text-lg ff-text-gradient font-sora">
                      FlashFusion
                    </span>
                  </div>

                  {/* Public Navigation */}
                  <div className="space-y-2">
                    <h3 className="ff-text-sm font-semibold text-muted-foreground font-sora mb-3">
                      Navigation
                    </h3>
                    {navigationItems.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        onClick={() => handleNavigation(item.id as PageType)}
                      />
                    ))}
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <NavItem
                      item={{ id: 'search', label: 'Search', icon: Search }}
                      onClick={() => handleNavigation('search')}
                    />
                  </div>

                  {/* Protected Items (when authenticated) */}
                  {isAuthenticated && (
                    <div className="space-y-2">
                      <h3 className="ff-text-sm font-semibold text-muted-foreground font-sora mb-3">
                        Account
                      </h3>
                      {protectedItems.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          onClick={() => handleNavigation(item.id as PageType)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Auth Button */}
                  <div className="mt-auto pt-6 border-t border-border">
                    <Button
                      onClick={handleAuth}
                      className={isAuthenticated ? 'w-full' : 'ff-btn-primary w-full'}
                      variant={isAuthenticated ? 'outline' : 'default'}
                    >
                      {isAuthenticated ? (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Version Info */}
                  <div className="text-center">
                    <Badge variant="outline" className="ff-text-xs">
                      v1.0.0 Beta
                    </Badge>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;