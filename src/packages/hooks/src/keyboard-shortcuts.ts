import { useEffect } from 'react';
import type { PageType } from '@flashfusion/types';

interface KeyboardShortcutsOptions {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
  onError: (error: { type: string; message: string; code?: string }) => void;
}

export function useKeyboardShortcuts({
  currentPage,
  isAuthenticated,
  onPageChange,
  onError
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Cmd/Ctrl + K for global search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        // TODO: Open global search
        console.log('Global search triggered');
        return;
      }

      // Navigation shortcuts
      if (event.altKey) {
        switch (event.key) {
          case 'h':
            event.preventDefault();
            onPageChange('home');
            break;
          case 'd':
            event.preventDefault();
            if (isAuthenticated) {
              onPageChange('dashboard');
            } else {
              onError({
                type: 'AUTH_REQUIRED',
                message: 'Dashboard requires authentication',
                code: 'UNAUTHORIZED'
              });
            }
            break;
          case 't':
            event.preventDefault();
            onPageChange('tools');
            break;
          case 'p':
            event.preventDefault();
            onPageChange('projects');
            break;
          case 's':
            event.preventDefault();
            onPageChange('settings');
            break;
        }
      }

      // Escape to close modals/overlays
      if (event.key === 'Escape') {
        // TODO: Close any open modals
        console.log('Escape pressed');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAuthenticated, onPageChange, onError]);
}