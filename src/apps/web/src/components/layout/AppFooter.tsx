import React from 'react';
import type { PageType } from '@flashfusion/types';

interface AppFooterProps {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
}

export function AppFooter({ currentPage, isAuthenticated, onPageChange }: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold">FlashFusion</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered development platform for building production-ready applications.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onPageChange('tools')}
                  className="text-muted-foreground hover:text-primary"
                >
                  AI Tools
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('features')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('pricing')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onPageChange('about')}
                  className="text-muted-foreground hover:text-primary"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('contact')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onPageChange('privacy')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('terms')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} FlashFusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}