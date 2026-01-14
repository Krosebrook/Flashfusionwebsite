import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Modal types
type ModalType = 'search' | 'settings' | 'help' | 'confirm' | 'custom';

interface ModalConfig {
  type: ModalType;
  title?: string;
  content?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  data?: any;
}

interface ModalContextValue {
  // Global search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Generic modal management
  activeModal: ModalConfig | null;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  closeAllModals: () => void;

  // Modal stack for nested modals
  modalStack: ModalConfig[];
  pushModal: (config: ModalConfig) => void;
  popModal: () => void;

  // Escape key handling
  registerEscapeHandler: (id: string, handler: () => void, priority?: number) => void;
  unregisterEscapeHandler: (id: string) => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

interface EscapeHandler {
  id: string;
  handler: () => void;
  priority: number;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);
  const [modalStack, setModalStack] = useState<ModalConfig[]>([]);
  const [escapeHandlers, setEscapeHandlers] = useState<EscapeHandler[]>([]);

  // Global search handlers
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  // Modal handlers
  const openModal = useCallback((config: ModalConfig) => {
    setActiveModal(config);
  }, []);

  const closeModal = useCallback(() => {
    if (activeModal?.onCancel) {
      activeModal.onCancel();
    }
    setActiveModal(null);
  }, [activeModal]);

  const closeAllModals = useCallback(() => {
    setIsSearchOpen(false);
    setActiveModal(null);
    setModalStack([]);
  }, []);

  // Modal stack for nested modals
  const pushModal = useCallback((config: ModalConfig) => {
    setModalStack(prev => [...prev, config]);
  }, []);

  const popModal = useCallback(() => {
    setModalStack(prev => {
      const newStack = [...prev];
      const popped = newStack.pop();
      if (popped?.onCancel) {
        popped.onCancel();
      }
      return newStack;
    });
  }, []);

  // Escape key handler registration
  const registerEscapeHandler = useCallback((id: string, handler: () => void, priority: number = 0) => {
    setEscapeHandlers(prev => {
      // Remove existing handler with same id
      const filtered = prev.filter(h => h.id !== id);
      // Add new handler and sort by priority (higher priority first)
      return [...filtered, { id, handler, priority }].sort((a, b) => b.priority - a.priority);
    });
  }, []);

  const unregisterEscapeHandler = useCallback((id: string) => {
    setEscapeHandlers(prev => prev.filter(h => h.id !== id));
  }, []);

  // Global escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Prevent default browser behavior
        event.preventDefault();

        // Check for custom escape handlers first (highest priority)
        if (escapeHandlers.length > 0) {
          escapeHandlers[0].handler();
          return;
        }

        // Then check modal stack
        if (modalStack.length > 0) {
          popModal();
          return;
        }

        // Then check search
        if (isSearchOpen) {
          closeSearch();
          return;
        }

        // Finally check active modal
        if (activeModal) {
          closeModal();
          return;
        }
      }

      // Cmd/Ctrl + K for global search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        // Don't trigger if typing in an input
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement
        ) {
          return;
        }

        event.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [escapeHandlers, modalStack, isSearchOpen, activeModal, popModal, closeSearch, closeModal, toggleSearch]);

  const value: ModalContextValue = {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    activeModal,
    openModal,
    closeModal,
    closeAllModals,
    modalStack,
    pushModal,
    popModal,
    registerEscapeHandler,
    unregisterEscapeHandler,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Convenience hooks
export function useGlobalSearch() {
  const { isSearchOpen, openSearch, closeSearch, toggleSearch } = useModal();
  return { isSearchOpen, openSearch, closeSearch, toggleSearch };
}

export function useEscapeHandler(id: string, handler: () => void, priority: number = 0) {
  const { registerEscapeHandler, unregisterEscapeHandler } = useModal();

  useEffect(() => {
    registerEscapeHandler(id, handler, priority);
    return () => unregisterEscapeHandler(id);
  }, [id, handler, priority, registerEscapeHandler, unregisterEscapeHandler]);
}
