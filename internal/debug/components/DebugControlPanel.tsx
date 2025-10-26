/**
 * @fileoverview Debug Control Panel - Toggleable Debug Interface
 * @category Development Tools
 * @version 1.0.0
 * 
 * Compact, out-of-the-way debug control system for development mode.
 * Provides individual toggles for all debug panels with persistent state.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Bug, 
  Settings, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Navigation,
  Layers,
  AlertTriangle,
  Minimize2,
  Maximize2
} from 'lucide-react';

// Debug panel configuration
interface DebugPanelConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultEnabled: boolean;
  color: string;
}

const DEBUG_PANELS: DebugPanelConfig[] = [
  {
    id: 'navigation',
    name: 'Navigation Debug',
    description: 'Navigation events, routing, and performance metrics',
    icon: Navigation,
    defaultEnabled: false,
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  },
  {
    id: 'lazyLoading',
    name: 'Lazy Loading Debug',
    description: 'Component loading status, memory usage, and cache stats',
    icon: Layers,
    defaultEnabled: false,
    color: 'bg-green-500/10 border-green-500/20 text-green-400'
  },
  {
    id: 'errorAnalytics',
    name: 'Error Analytics',
    description: 'Error tracking, recovery rates, and debug information',
    icon: AlertTriangle,
    defaultEnabled: false,
    color: 'bg-red-500/10 border-red-500/20 text-red-400'
  }
];

// Debug state management
interface DebugState {
  [key: string]: boolean;
}

const DEBUG_STORAGE_KEY = 'ff-debug-panels';
const PANEL_VISIBILITY_KEY = 'ff-debug-panel-visible';
const PANEL_MINIMIZED_KEY = 'ff-debug-panel-minimized';

/**
 * Hook for managing debug panel state
 */
function useDebugPanelState() {
  const [debugState, setDebugState] = useState<DebugState>(() => {
    try {
      const stored = localStorage.getItem(DEBUG_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load debug panel state:', error);
    }
    
    // Default state
    return DEBUG_PANELS.reduce((acc, panel) => {
      acc[panel.id] = panel.defaultEnabled;
      return acc;
    }, {} as DebugState);
  });

  const updateDebugState = useCallback((panelId: string, enabled: boolean) => {
    setDebugState(prev => {
      const newState = { ...prev, [panelId]: enabled };
      
      try {
        localStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save debug panel state:', error);
      }
      
      return newState;
    });
  }, []);

  const togglePanel = useCallback((panelId: string) => {
    updateDebugState(panelId, !debugState[panelId]);
  }, [debugState, updateDebugState]);

  const toggleAll = useCallback((enabled: boolean) => {
    const newState = DEBUG_PANELS.reduce((acc, panel) => {
      acc[panel.id] = enabled;
      return acc;
    }, {} as DebugState);
    
    setDebugState(newState);
    
    try {
      localStorage.setItem(DEBUG_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn('Failed to save debug panel state:', error);
    }
  }, []);

  return {
    debugState,
    togglePanel,
    toggleAll,
    isAnyEnabled: Object.values(debugState).some(Boolean),
    enabledCount: Object.values(debugState).filter(Boolean).length
  };
}

/**
 * Compact Debug Control Panel
 */
export const DebugControlPanel: React.FC = () => {
  const { debugState, togglePanel, toggleAll, isAnyEnabled, enabledCount } = useDebugPanelState();
  
  const [isPanelVisible, setIsPanelVisible] = useState(() => {
    try {
      return localStorage.getItem(PANEL_VISIBILITY_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem(PANEL_MINIMIZED_KEY) === 'true';
    } catch {
      return true;
    }
  });

  // Persist panel visibility
  useEffect(() => {
    try {
      localStorage.setItem(PANEL_VISIBILITY_KEY, isPanelVisible.toString());
    } catch (error) {
      console.warn('Failed to save panel visibility:', error);
    }
  }, [isPanelVisible]);

  // Persist minimized state
  useEffect(() => {
    try {
      localStorage.setItem(PANEL_MINIMIZED_KEY, isMinimized.toString());
    } catch (error) {
      console.warn('Failed to save minimized state:', error);
    }
  }, [isMinimized]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Hide panel completely if not visible
  if (!isPanelVisible) {
    return (
      <Button
        onClick={() => setIsPanelVisible(true)}
        className="fixed top-4 left-4 z-[9999] bg-black/80 hover:bg-black/90 border border-white/10 text-white p-2 h-8 w-8"
        size="sm"
      >
        <Bug className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-[9999] max-w-sm">
      <Card className="bg-black/95 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-orange-400" />
              <CardTitle className="text-sm font-semibold text-white">
                Debug Controls
              </CardTitle>
              {enabledCount > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-300 border-orange-500/30">
                  {enabledCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              
              <Button
                onClick={() => setIsPanelVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="pt-0 space-y-3">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => toggleAll(true)}
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
              >
                <Eye className="h-3 w-3 mr-1" />
                All On
              </Button>
              <Button
                onClick={() => toggleAll(false)}
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <EyeOff className="h-3 w-3 mr-1" />
                All Off
              </Button>
            </div>

            {/* Individual Panel Controls */}
            <div className="space-y-2">
              {DEBUG_PANELS.map((panel) => {
                const Icon = panel.icon;
                const isEnabled = debugState[panel.id];
                
                return (
                  <div
                    key={panel.id}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                      isEnabled 
                        ? panel.color 
                        : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">
                          {panel.name}
                        </div>
                        <div className="text-xs opacity-70 truncate">
                          {panel.description}
                        </div>
                      </div>
                    </div>
                    
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => togglePanel(panel.id)}
                      className="ml-2 flex-shrink-0 scale-75"
                    />
                  </div>
                );
              })}
            </div>

            {/* Status Summary */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Status:</span>
                <span className={isAnyEnabled ? 'text-green-400' : 'text-gray-500'}>
                  {isAnyEnabled ? `${enabledCount} panel${enabledCount !== 1 ? 's' : ''} active` : 'All panels disabled'}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

/**
 * Hook to check if a specific debug panel is enabled
 */
export function useDebugPanel(panelId: string): boolean {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (process.env.NODE_ENV !== 'development') return false;
    
    try {
      const stored = localStorage.getItem(DEBUG_STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        return state[panelId] || false;
      }
    } catch (error) {
      console.warn('Failed to load debug panel state:', error);
    }
    
    const panel = DEBUG_PANELS.find(p => p.id === panelId);
    return panel?.defaultEnabled || false;
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEBUG_STORAGE_KEY && e.newValue) {
        try {
          const state = JSON.parse(e.newValue);
          setIsEnabled(state[panelId] || false);
        } catch (error) {
          console.warn('Failed to parse debug panel state:', error);
        }
      }
    };

    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', handleStorageChange);

    // Also listen for local storage changes within the same tab
    const checkState = () => {
      try {
        const stored = localStorage.getItem(DEBUG_STORAGE_KEY);
        if (stored) {
          const state = JSON.parse(stored);
          setIsEnabled(state[panelId] || false);
        }
      } catch (error) {
        console.warn('Failed to check debug panel state:', error);
      }
    };

    // Poll for changes every second (lightweight check)
    const interval = setInterval(checkState, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [panelId]);

  return isEnabled;
}

/**
 * Debug Panel Wrapper Component
 */
interface DebugPanelWrapperProps {
  panelId: string;
  children: React.ReactNode;
}

export const DebugPanelWrapper: React.FC<DebugPanelWrapperProps> = ({ 
  panelId, 
  children 
}) => {
  const isEnabled = useDebugPanel(panelId);
  
  if (!isEnabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <>{children}</>;
};

export default DebugControlPanel;