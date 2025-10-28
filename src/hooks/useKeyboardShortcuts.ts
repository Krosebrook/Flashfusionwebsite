import { useEffect } from 'react';
import type { PageType } from '../types/core';

interface UseKeyboardShortcutsOptions {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
  onError?: (error: { type: string; message: string; code: string }) => void;
}

export function useKeyboardShortcuts({
  currentPage,
  isAuthenticated,
  onPageChange,
  onError
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.tagName === 'SELECT' ||
          target.contentEditable === 'true' ||
          target.isContentEditable) {
        return;
      }
      
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifierKey) {
        let handled = false;
        
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            onPageChange('search');
            handled = true;
            break;
          case ',':
            e.preventDefault();
            if (isAuthenticated) {
              onPageChange('settings');
            } else {
              onError?.({
                type: 'permission',
                message: 'Please log in to access settings',
                code: 'AUTH_REQUIRED_SETTINGS'
              });
            }
            handled = true;
            break;
          case 'h':
            e.preventDefault();
            onPageChange('home');
            handled = true;
            break;
          case '/':
            e.preventDefault();
            onPageChange('tools');
            handled = true;
            break;
          case 'd':
            e.preventDefault();
            if (isAuthenticated) {
              onPageChange('dashboard');
            }
            handled = true;
            break;
        }
        
        if (handled) {
          // Add visual feedback for keyboard shortcuts
          document.body.classList.add('ff-fade-in-up');
          setTimeout(() => document.body.classList.remove('ff-fade-in-up'), 300);
        }
      }
      
      // Escape key to close modals/search
      if (e.key === 'Escape') {
        if (currentPage === 'search') {
          onPageChange('home');
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAuthenticated, onPageChange, onError]);
}