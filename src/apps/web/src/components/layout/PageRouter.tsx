import React from 'react';
import type { PageType } from '@flashfusion/types';

interface PageRouterProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
}

export function PageRouter({ currentPage, isAuthenticated, onPageChange }: PageRouterProps) {
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to FlashFusion</h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI-powered development platform for building production-ready applications
            </p>
            <button 
              onClick={() => onPageChange('tools')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              Explore Tools
            </button>
          </div>
        );
      
      case 'tools':
        return (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">AI Development Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Tool {i}</h3>
                  <p className="text-muted-foreground mb-4">
                    Description of AI tool {i} capabilities
                  </p>
                  <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80">
                    Use Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'dashboard':
        if (!isAuthenticated) {
          return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground">Please sign in to access the dashboard.</p>
            </div>
          );
        }
        return (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your FlashFusion dashboard!</p>
          </div>
        );
      
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
            <button 
              onClick={() => onPageChange('home')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen">
      {renderPage()}
    </main>
  );
}