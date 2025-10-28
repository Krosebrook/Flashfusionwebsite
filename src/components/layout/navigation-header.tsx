/**
 * FlashFusion Navigation Header
 * Professional navigation component with branding and user actions
 */

import React, { memo } from 'react';
import { Button } from '../ui/button';

interface NavigationHeaderProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

export const NavigationHeader = memo(({ currentRoute, onRouteChange }: NavigationHeaderProps) => {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tools', label: 'AI Tools', icon: '🤖' },
    { id: 'workflows', label: 'Workflows', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'deployments', label: 'Deploy', icon: '🚀' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'collaboration', label: 'Collaboration', icon: '👥' },
  ];

  return (
    <nav className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span 
                className="text-white font-bold text-lg" 
                style={{ fontFamily: 'var(--ff-font-primary)' }}
              >
                FF
              </span>
            </div>
            <div>
              <h1 
                className="ff-text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" 
                style={{ fontFamily: 'var(--ff-font-primary)' }}
              >
                FlashFusion
              </h1>
              <p className="ff-text-xs text-muted-foreground">AI Development Platform</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ff-text-sm transition-all duration-200 ${
                  currentRoute === item.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                style={{ 
                  fontFamily: 'var(--ff-font-primary)', 
                  fontWeight: 'var(--ff-weight-medium)' 
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex ff-btn-outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
            <Button className="ff-btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});

NavigationHeader.displayName = 'NavigationHeader';