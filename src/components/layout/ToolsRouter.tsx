import React from 'react';
import { PageType } from '../../types';

// Import tool pages
import { ToolsPage } from '../pages/ToolsPage';
import { ToolDetailPage } from '../pages/ToolDetailPage';

interface ToolsRouterProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  isAuthenticated: boolean;
  user: any;
  onToolUsage: (toolId: string) => void;
}

export function ToolsRouter({
  currentPage,
  setCurrentPage,
  selectedTool,
  setSelectedTool,
  isAuthenticated,
  user,
  onToolUsage
}: ToolsRouterProps) {
  
  const renderToolPage = () => {
    switch (currentPage) {
      case 'tools':
        return (
          <ToolsPage
            setSelectedTool={setSelectedTool}
            setCurrentPage={setCurrentPage}
            onToolUsage={onToolUsage}
            isAuthenticated={isAuthenticated}
            userTier={user?.subscription_tier || 'free'}
          />
        );

      case 'tool-detail':
        return (
          <ToolDetailPage
            toolId={selectedTool}
            setCurrentPage={setCurrentPage}
            onToolUsage={onToolUsage}
            isAuthenticated={isAuthenticated}
          />
        );

      default:
        return null;
    }
  };

  return renderToolPage();
}