/**
 * @fileoverview Mobile Optimized Header Component
 * @category mobile
 * @version 1.0.0
 * 
 * Optimized header component specifically designed for mobile devices
 * with better touch targets, simplified navigation, and improved UX.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Menu, 
  X, 
  Play, 
  LogIn, 
  UserPlus, 
  Home,
  Zap,
  Settings,
  HelpCircle,
  ChevronRight 
} from 'lucide-react';

interface MobileOptimizedHeaderProps {
  isScrolled?: boolean;
  onTryDemo?: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export const MobileOptimizedHeader: React.FC<MobileOptimizedHeaderProps> = ({
  isScrolled = false,
  onTryDemo,
  onSignIn,
  onSignUp,
  currentRoute = 'home',
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide header on scroll down, show on scroll up (mobile UX pattern)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide/show if scrolled more than 10px to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'features', label: 'Features', icon: <Zap className="w-5 h-5" /> },
    { id: 'pricing', label: 'Pricing', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: 'Help & FAQ', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  const handleMenuItemClick = (itemId: string) => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(itemId);
    } else {
      // Scroll to section if no navigate handler
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Main Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-[var(--ff-bg-dark)]/95 backdrop-blur-lg border-b border-white/10' 
            : 'bg-transparent'
        }`}
        style={{ fontFamily: 'var(--ff-font-primary)' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">FF</span>
              </div>
              <span className="text-lg font-bold text-white">FlashFusion</span>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2">
              {/* Promotional Badge */}
              <Badge className="bg-[var(--ff-accent)]/20 text-[var(--ff-accent)] border-[var(--ff-accent)]/30 text-xs px-2 py-1 hidden xs:inline-flex">
                50% OFF
              </Badge>

              {/* Try Demo Button */}
              {onTryDemo && (
                <Button 
                  onClick={onTryDemo}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 px-3 py-2 text-sm"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}

              {/* Menu Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Menu Panel */}
          <div 
            className="fixed top-16 left-0 right-0 bg-[var(--ff-bg-dark)] border-b border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto">
              
              {/* Navigation Items */}
              <div className="px-4 py-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-colors ${
                        currentRoute === item.id
                          ? 'bg-[var(--ff-primary)]/20 text-[var(--ff-primary)] border border-[var(--ff-primary)]/30'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="px-4 pb-6 space-y-3 border-t border-white/10 pt-6">
                {/* Try Demo */}
                {onTryDemo && (
                  <Button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onTryDemo();
                    }}
                    variant="outline"
                    className="w-full justify-center border-white/30 text-white hover:bg-white/10 py-3"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Interactive Demo
                  </Button>
                )}

                {/* Sign In */}
                {onSignIn && (
                  <Button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignIn();
                    }}
                    variant="outline"
                    className="w-full justify-center border-white/30 text-white hover:bg-white/10 py-3"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}

                {/* Sign Up with Promo */}
                {onSignUp && (
                  <Button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSignUp();
                    }}
                    className="w-full justify-center bg-gradient-to-r from-[var(--ff-accent)] to-[var(--ff-primary)] hover:opacity-90 text-white py-3 relative"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    <div className="flex flex-col items-center">
                      <span>Get 50% Off</span>
                      <span className="text-xs opacity-90">Sign up now</span>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-[var(--ff-accent)] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      50% OFF
                    </div>
                  </Button>
                )}
              </div>

              {/* Promotional Banner */}
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-r from-[var(--ff-accent)]/20 to-[var(--ff-primary)]/20 border border-[var(--ff-accent)]/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-white mb-1">🎉 Limited Time Offer</div>
                  <div className="text-lg font-bold text-[var(--ff-accent)]">50% OFF for 4 months</div>
                  <div className="text-xs text-white/70">Limited spots available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileOptimizedHeader;