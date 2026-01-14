import { useEffect, useCallback } from 'react';
import type { PageType } from '@flashfusion/types';

interface KeyboardShortcutsOptions {
  currentPage: PageType;
  isAuthenticated: boolean;
  onPageChange: (page: PageType) => void;
  onError: (error: { type: string; message: string; code?: string }) => void;
  onOpenSearch?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts({
  currentPage,
  isAuthenticated,
  onPageChange,
  onError,
  onOpenSearch,
  onCloseModal
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields (except for Escape and Cmd+K)
      const isInInput =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement;

      // Cmd/Ctrl + K for global search (works even in inputs)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (onOpenSearch) {
          onOpenSearch();
        } else {
          // Dispatch custom event for global search if no handler provided
          window.dispatchEvent(new CustomEvent('flashfusion:open-search'));
        }
        return;
      }

      // Escape to close modals/overlays (works even in inputs)
      if (event.key === 'Escape') {
        if (onCloseModal) {
          event.preventDefault();
          onCloseModal();
        } else {
          // Dispatch custom event for modal close if no handler provided
          window.dispatchEvent(new CustomEvent('flashfusion:close-modal'));
        }
        return;
      }

      // Don't handle other shortcuts in input fields
      if (isInInput) {
        return;
      }

      // Navigation shortcuts with Alt key
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
          case 'n':
            event.preventDefault();
            // New project shortcut
            window.dispatchEvent(new CustomEvent('flashfusion:new-project'));
            break;
        }
      }

      // Quick actions with Ctrl/Cmd + Shift
      if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
        switch (event.key) {
          case 'N':
            event.preventDefault();
            // New project
            window.dispatchEvent(new CustomEvent('flashfusion:new-project'));
            break;
          case 'P':
            event.preventDefault();
            // Command palette (same as search but for commands)
            if (onOpenSearch) {
              onOpenSearch();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAuthenticated, onPageChange, onError, onOpenSearch, onCloseModal]);
}

// Hook for listening to FlashFusion custom events
export function useFlashFusionEvent(
  eventName: string,
  handler: (event: CustomEvent) => void
) {
  useEffect(() => {
    const listener = (event: Event) => handler(event as CustomEvent);
    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  }, [eventName, handler]);
}

// Utility to dispatch FlashFusion events
export function dispatchFlashFusionEvent(eventName: string, detail?: any) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}