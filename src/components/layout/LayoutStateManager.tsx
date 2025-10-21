import { useState, ReactNode, createContext, useContext } from 'react';
import { PageType } from '../../types/core';

interface LayoutState {
  currentPage: PageType;
  sidebarOpen: boolean;
  showWizard: boolean;
  selectedTool: string;
}

interface LayoutActions {
  setCurrentPage: (page: PageType) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowWizard: (show: boolean) => void;
  setSelectedTool: (tool: string) => void;
  toggleSidebar: () => void;
}

interface LayoutContextValue extends LayoutState, LayoutActions {}

const LayoutContext = createContext<LayoutContextValue | null>(null);

interface LayoutStateManagerProps {
  children: ReactNode;
  initialPage?: PageType;
}

/**
 * Layout state manager that provides centralized state management
 * for all layout-related concerns in FlashFusion
 */
export function LayoutStateManager({ 
  children, 
  initialPage = 'home' 
}: LayoutStateManagerProps) {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const contextValue: LayoutContextValue = {
    // State
    currentPage,
    sidebarOpen,
    showWizard,
    selectedTool,
    // Actions
    setCurrentPage,
    setSidebarOpen,
    setShowWizard,
    setSelectedTool,
    toggleSidebar,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Hook to access layout state and actions
 */
export function useLayoutState() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutState must be used within a LayoutStateManager');
  }
  return context;
}