import React from 'react';
import type { PageType } from '@flashfusion/types';

interface NavigationProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
  onAuthToggle: () => void;
}

export function Navigation({ currentPage, isAuthenticated, onPageChange, onAuthToggle }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold ff-text-gradient">FlashFusion</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onPageChange('home')}
              className={`px-3 py-2 rounded-md text-sm ${currentPage === 'home' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onPageChange('tools')}
              className={`px-3 py-2 rounded-md text-sm ${currentPage === 'tools' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Tools
            </button>
            <button 
              onClick={onAuthToggle}
              className="px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}