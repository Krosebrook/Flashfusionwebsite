import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { isDevelopment, isProduction } from '../../utils/environment';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, Settings, RotateCcw, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

// Feature flag types
export interface FeatureFlags {
  // Core Features
  advancedAnalytics: boolean;
  multiAgentOrchestration: boolean;
  realTimeCollaboration: boolean;
  
  // AI Features
  enhancedCodeGeneration: boolean;
  aiValidation: boolean;
  predictiveAnalytics: boolean;
  
  // Platform Features
  betaDeployments: boolean;
  experimentalUI: boolean;
  advancedSecurity: boolean;
  
  // Monetization
  premiumFeatures: boolean;
  enterpriseFeatures: boolean;
  
  // Development
  debugMode: boolean;
  performanceMonitoring: boolean;
  errorReporting: boolean;
}

// Default feature flags using centralized environment detection
const defaultFeatureFlags: FeatureFlags = {
  // Core Features - Generally enabled
  advancedAnalytics: true,
  multiAgentOrchestration: true,
  realTimeCollaboration: true,
  
  // AI Features - Enabled for production
  enhancedCodeGeneration: true,
  aiValidation: true,
  predictiveAnalytics: true,
  
  // Platform Features - Configurable
  betaDeployments: isDevelopment(),
  experimentalUI: isDevelopment(),
  advancedSecurity: true,
  
  // Monetization - Based on environment
  premiumFeatures: true,
  enterpriseFeatures: true,
  
  // Development - Only in dev
  debugMode: isDevelopment(),
  performanceMonitoring: true,
  errorReporting: isProduction()
};

// Feature flag context with toggle functionality
interface FeatureFlagContextType {
  flags: FeatureFlags;
  toggleFlag: (flagName: keyof FeatureFlags) => void;
  setFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
  resetFlags: () => void;
  exportFlags: () => string;
  importFlags: (flagsJson: string) => void;
  isOverridden: (flagName: keyof FeatureFlags) => boolean;
  getBaseValue: (flagName: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);

// Feature flag provider
interface FeatureFlagProviderProps {
  children: ReactNode;
  flags?: Partial<FeatureFlags>;
  userId?: string;
  userTier?: 'free' | 'pro' | 'enterprise';
}

export function FeatureFlagProvider({ 
  children, 
  flags = {}, 
  userId,
  userTier = 'free'
}: FeatureFlagProviderProps) {
  // Storage key for persisting flag overrides
  const STORAGE_KEY = 'ff-feature-flags-overrides';
  
  // State for current flags and overrides
  const [flagOverrides, setFlagOverrides] = useState<Partial<FeatureFlags>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load overrides from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFlagOverrides(parsed);
        }
      } catch (error) {
        console.warn('Failed to load feature flag overrides:', error);
      } finally {
        setIsInitialized(true);
      }
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Save overrides to localStorage when they change (but not on initial load)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flagOverrides));
      } catch (error) {
        console.warn('Failed to save feature flag overrides:', error);
      }
    }
  }, [flagOverrides, isInitialized]);

  // Compute base flags without overrides
  const baseFlags: FeatureFlags = {
    ...defaultFeatureFlags,
    ...getUserSpecificFlags(userId, userTier),
    ...flags
  };

  // Compute final flags with proper precedence
  const computedFlags: FeatureFlags = {
    ...baseFlags,
    ...flagOverrides // Overrides have highest priority
  };

  // Toggle a specific flag
  const toggleFlag = useCallback((flagName: keyof FeatureFlags) => {
    setFlagOverrides(prev => {
      const baseValue = baseFlags[flagName];
      const currentOverride = prev[flagName];
      const newOverrides = { ...prev };
      
      if (currentOverride !== undefined) {
        // If already overridden, remove the override to revert to base
        delete newOverrides[flagName];
        toast.success(`${flagName} reset to default (${baseValue ? 'ON' : 'OFF'})`);
      } else {
        // Create new override with opposite of base value
        const newValue = !baseValue;
        newOverrides[flagName] = newValue;
        toast.success(`${flagName} overridden to ${newValue ? 'ON' : 'OFF'}`);
      }
      
      return newOverrides;
    });
  }, [baseFlags]);

  // Set a specific flag value
  const setFlag = useCallback((flagName: keyof FeatureFlags, value: boolean) => {
    setFlagOverrides(prev => {
      const baseValue = baseFlags[flagName];
      const newOverrides = { ...prev };
      
      if (baseValue === value) {
        // If setting to base value, remove override
        delete newOverrides[flagName];
        toast.success(`${flagName} reset to default`);
      } else {
        // Set override
        newOverrides[flagName] = value;
        toast.success(`${flagName} set to ${value ? 'ON' : 'OFF'}`);
      }
      
      return newOverrides;
    });
  }, [baseFlags]);

  // Reset all flag overrides
  const resetFlags = useCallback(() => {
    setFlagOverrides({});
    toast.success('All feature flags reset to defaults');
  }, []);

  // Export current flag configuration
  const exportFlags = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      userTier,
      userId,
      baseFlags,
      overrides: flagOverrides,
      finalFlags: computedFlags
    };
    return JSON.stringify(exportData, null, 2);
  }, [baseFlags, flagOverrides, computedFlags, userTier, userId]);

  // Import flag configuration
  const importFlags = useCallback((flagsJson: string) => {
    try {
      const imported = JSON.parse(flagsJson);
      if (imported.overrides && typeof imported.overrides === 'object') {
        setFlagOverrides(imported.overrides);
        toast.success('Feature flags imported successfully');
      } else {
        throw new Error('Invalid format: missing overrides');
      }
    } catch (error) {
      toast.error(`Failed to import flags: ${(error as Error).message}`);
    }
  }, []);

  // Check if a flag is overridden
  const isOverridden = useCallback((flagName: keyof FeatureFlags) => {
    return flagName in flagOverrides;
  }, [flagOverrides]);

  // Get the base value of a flag (without overrides)
  const getBaseValue = useCallback((flagName: keyof FeatureFlags) => {
    return baseFlags[flagName];
  }, [baseFlags]);

  const contextValue: FeatureFlagContextType = {
    flags: computedFlags,
    toggleFlag,
    setFlag,
    resetFlags,
    exportFlags,
    importFlags,
    isOverridden,
    getBaseValue
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// Get user-specific feature flags based on tier
function getUserSpecificFlags(userId?: string, userTier?: string): Partial<FeatureFlags> {
  const flags: Partial<FeatureFlags> = {};

  // Tier-based features
  switch (userTier) {
    case 'enterprise':
      flags.enterpriseFeatures = true;
      flags.premiumFeatures = true;
      flags.advancedSecurity = true;
      flags.realTimeCollaboration = true;
      break;
    case 'pro':
      flags.premiumFeatures = true;
      flags.advancedAnalytics = true;
      flags.enhancedCodeGeneration = true;
      break;
    case 'free':
    default:
      flags.premiumFeatures = false;
      flags.enterpriseFeatures = false;
      break;
  }

  // User-specific overrides could go here
  if (userId) {
    // Example: Enable beta features for specific users
    const betaUsers = ['user-123', 'user-456'];
    if (betaUsers.includes(userId)) {
      flags.betaDeployments = true;
      flags.experimentalUI = true;
    }
  }

  return flags;
}

// Hook to use feature flags
export function useFeatureFlags(): FeatureFlags {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context.flags;
}

// Hook to use feature flag context (includes toggle functions)
export function useFeatureFlagContext(): FeatureFlagContextType {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider');
  }
  return context;
}

// Hook to check specific feature flag
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const flags = useFeatureFlags();
  return flags[flagName];
}

// Hook to toggle a specific feature flag
export function useFeatureFlagToggle(flagName: keyof FeatureFlags) {
  const { toggleFlag, setFlag, isOverridden, getBaseValue } = useFeatureFlagContext();
  const isEnabled = useFeatureFlag(flagName);
  const baseValue = getBaseValue(flagName);
  
  return {
    isEnabled,
    baseValue,
    toggle: () => toggleFlag(flagName),
    setEnabled: (value: boolean) => setFlag(flagName, value),
    isOverridden: isOverridden(flagName)
  };
}

// Component to conditionally render based on feature flag
interface FeatureFlagProps {
  flag: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
  invert?: boolean;
}

export function FeatureFlag({ flag, children, fallback = null, invert = false }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(flag);
  const shouldRender = invert ? !isEnabled : isEnabled;
  
  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

// Individual Feature Flag Toggle Component
interface FeatureFlagToggleProps {
  flag: keyof FeatureFlags;
  label?: string | ReactNode;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showOverrideIndicator?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FeatureFlagToggle({
  flag,
  label,
  description,
  size = 'md',
  showOverrideIndicator = true,
  disabled = false,
  className = ''
}: FeatureFlagToggleProps) {
  const { isEnabled, baseValue, toggle, isOverridden: isOverriddenFlag } = useFeatureFlagToggle(flag);
  const [isToggling, setIsToggling] = useState(false);

  // Auto-generate label if not provided
  const displayLabel = label || flag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4'
  };

  const handleToggle = async () => {
    if (disabled || isToggling) return;
    
    setIsToggling(true);
    try {
      toggle();
      // Small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 150));
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div 
      className={`
        flex items-center justify-between rounded-lg border transition-all duration-200
        ${isOverriddenFlag 
          ? 'border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 ff-hover-glow' 
          : 'border-border bg-card hover:border-primary/20 hover:bg-card/50'
        } 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer ff-hover-lift'}
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={handleToggle}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <label 
            htmlFor={`toggle-${flag}`}
            className={`font-semibold text-foreground cursor-pointer select-none ${
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
            }`}
          >
            {displayLabel}
          </label>
          
          {showOverrideIndicator && isOverriddenFlag && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              <Badge 
                variant="outline" 
                className="text-xs border-primary/30 bg-primary/10 text-primary font-medium"
              >
                Override
              </Badge>
              <span className="text-xs text-muted-foreground">
                (was {baseValue ? 'ON' : 'OFF'})
              </span>
            </motion.div>
          )}
        </div>
        
        {description && (
          <p className={`text-muted-foreground leading-tight ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'
          }`}>
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <motion.div
          animate={{ 
            scale: isToggling ? 0.9 : 1,
            rotate: isToggling ? 180 : 0 
          }}
          transition={{ duration: 0.15 }}
        >
          <Switch
            id={`toggle-${flag}`}
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={disabled || isToggling}
            className={`
              transition-all duration-200
              ${isEnabled ? 'data-[state=checked]:bg-primary' : ''}
              ${isOverriddenFlag ? 'ring-2 ring-primary/20' : ''}
            `}
          />
        </motion.div>
        
        <motion.div
          key={isEnabled ? 'on' : 'off'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Badge
            variant={isEnabled ? "default" : "secondary"}
            className={`
              text-xs min-w-[2.5rem] justify-center font-bold transition-all duration-200
              ${isEnabled 
                ? 'bg-gradient-to-r from-success to-success/80 text-white shadow-lg shadow-success/25' 
                : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {isEnabled ? 'ON' : 'OFF'}
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Quick Settings Panel for common flags
export function QuickFeatureFlagPanel() {
  const { flags } = useFeatureFlagContext();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const commonFlags: Array<{ 
    flag: keyof FeatureFlags; 
    label: string; 
    description: string;
    icon: string;
    category: 'development' | 'ui' | 'features' | 'performance';
  }> = [
    {
      flag: 'debugMode',
      label: 'Debug Mode',
      description: 'Show debugging information and development tools',
      icon: '🔧',
      category: 'development'
    },
    {
      flag: 'experimentalUI',
      label: 'Experimental UI',
      description: 'Enable experimental user interface features',
      icon: '🧪',
      category: 'ui'
    },
    {
      flag: 'betaDeployments',
      label: 'Beta Deployments',
      description: 'Access to beta deployment features and platforms',
      icon: '🚀',
      category: 'features'
    },
    {
      flag: 'performanceMonitoring',
      label: 'Performance Monitoring',
      description: 'Track application performance metrics',
      icon: '📊',
      category: 'performance'
    }
  ];

  const activeCount = commonFlags.filter(({ flag }) => flags[flag]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="ff-card-interactive border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base ff-text-gradient flex items-center gap-2">
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 90 }}
                transition={{ duration: 0.2 }}
              >
                <Settings className="h-5 w-5" />
              </motion.div>
              Quick Settings
              
              <Badge 
                variant="outline" 
                className="bg-primary/10 border-primary/30 text-primary font-bold"
              >
                {activeCount}/{commonFlags.length}
              </Badge>
            </CardTitle>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 ff-hover-scale"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </Button>
          </div>
        </CardHeader>
        
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              {commonFlags.map(({ flag, label, description, icon, category }, index) => (
                <motion.div
                  key={flag}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FeatureFlagToggle
                    flag={flag}
                    label={
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{icon}</span>
                        <span>{label}</span>
                      </div>
                    }
                    description={description}
                    size="sm"
                    className="border border-border/50 bg-background/30 hover:bg-background/50 transition-all duration-200"
                  />
                </motion.div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

// Enhanced Feature Flag Debug Panel with Toggle Controls
export function FeatureFlagDebugPanel() {
  const { flags, toggleFlag, resetFlags, exportFlags, importFlags, isOverridden } = useFeatureFlagContext();
  const isDebugMode = useFeatureFlag('debugMode');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [importInput, setImportInput] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Only show in development or when debug mode is enabled
  if (!isDevelopment() && !isDebugMode) {
    return null;
  }

  if (!isVisible) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="ff-hover-glow bg-card/90 backdrop-blur-sm border-primary/20 shadow-lg"
        >
          <Settings className="h-4 w-4 text-primary" />
        </Button>
      </motion.div>
    );
  }

  // Group flags by category
  const flagCategories = {
    'Core Features': ['advancedAnalytics', 'multiAgentOrchestration', 'realTimeCollaboration'],
    'AI Features': ['enhancedCodeGeneration', 'aiValidation', 'predictiveAnalytics'],
    'Platform Features': ['betaDeployments', 'experimentalUI', 'advancedSecurity'],
    'Monetization': ['premiumFeatures', 'enterpriseFeatures'],
    'Development': ['debugMode', 'performanceMonitoring', 'errorReporting']
  };

  const activeFlags = Object.values(flags).filter(Boolean).length;
  const totalFlags = Object.keys(flags).length;
  const overrideCount = Object.keys(flags).filter(key => isOverridden(key as keyof FeatureFlags)).length;

  const handleExport = () => {
    const data = exportFlags();
    navigator.clipboard.writeText(data).then(() => {
      toast.success('Feature flags exported to clipboard');
    }).catch(() => {
      // Fallback for older browsers
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ff-flags-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Feature flags downloaded');
    });
  };

  const handleImport = () => {
    if (importInput.trim()) {
      importFlags(importInput);
      setImportInput('');
      setShowImport(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <Card className="ff-glass border-primary/20 shadow-2xl backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold ff-text-gradient flex items-center gap-2">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="h-4 w-4" />
              </motion.div>
              Feature Flags
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-primary/10 border-primary/30 text-primary font-bold"
                >
                  {activeFlags}/{totalFlags}
                </Badge>
                
                {overrideCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center"
                  >
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-accent/20 border-accent/30 text-accent font-bold"
                    >
                      {overrideCount} Override{overrideCount !== 1 ? 's' : ''}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </CardTitle>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0 ff-hover-scale"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3" />
                </motion.div>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0 ff-hover-scale text-muted-foreground hover:text-foreground"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Control Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetFlags}
                  className="text-xs ff-hover-scale border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExport}
                  className="text-xs ff-hover-scale border-success/20 hover:bg-success/10 hover:border-success/40"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowImport(!showImport)}
                  className="text-xs ff-hover-scale border-info/20 hover:bg-info/10 hover:border-info/40"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Import
                </Button>
              </div>

              {/* Import Section */}
              {showImport && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2 border border-info/20"
                >
                  <textarea
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    placeholder="Paste feature flags JSON here..."
                    className="w-full h-20 text-xs bg-background border border-border rounded resize-none p-2 ff-focus-ring"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleImport} className="text-xs flex-1 ff-btn-primary">
                      Import
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowImport(false)} 
                      className="text-xs flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Feature Flag Categories */}
              <div className="space-y-4 max-h-80 overflow-auto scrollbar-thin">
                {Object.entries(flagCategories).map(([category, flagNames], categoryIndex) => (
                  <motion.div 
                    key={category} 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      {category}
                    </h4>
                    
                    <div className="space-y-1">
                      {flagNames.map((flagName, flagIndex) => {
                        const isEnabled = flags[flagName as keyof FeatureFlags];
                        const isOverriddenFlag = isOverridden(flagName as keyof FeatureFlags);
                        
                        return (
                          <motion.div
                            key={flagName}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (categoryIndex * 0.1) + (flagIndex * 0.05) }}
                            className={`
                              flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer
                              ${isOverriddenFlag 
                                ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 ff-hover-glow' 
                                : 'bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-primary/20'
                              }
                            `}
                            onClick={() => toggleFlag(flagName as keyof FeatureFlags)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground truncate">
                                  {flagName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </span>
                                {isOverriddenFlag && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    <Badge 
                                      variant="secondary" 
                                      className="text-xs px-1.5 py-0.5 bg-accent/20 border-accent/30 text-accent font-bold"
                                    >
                                      Override
                                    </Badge>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={() => toggleFlag(flagName as keyof FeatureFlags)}
                                className={`
                                  transition-all duration-200
                                  ${isEnabled ? 'data-[state=checked]:bg-primary' : ''}
                                  ${isOverriddenFlag ? 'ring-2 ring-primary/30' : ''}
                                `}
                              />
                              
                              <motion.div
                                key={`${flagName}-${isEnabled}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Badge
                                  variant={isEnabled ? "default" : "secondary"}
                                  className={`
                                    text-xs min-w-[2.5rem] justify-center font-bold transition-all duration-200
                                    ${isEnabled 
                                      ? 'bg-gradient-to-r from-success to-success/80 text-white shadow-md shadow-success/25' 
                                      : 'bg-muted text-muted-foreground'
                                    }
                                  `}
                                >
                                  {isEnabled ? 'ON' : 'OFF'}
                                </Badge>
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    {categoryIndex < Object.entries(flagCategories).length - 1 && (
                      <Separator className="opacity-30" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Summary */}
              <motion.div 
                className="mt-4 pt-3 border-t border-border bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Status Summary:</span>
                    <div className="flex items-center gap-2">
                      {isDevelopment() && (
                        <Badge className="bg-warning/20 text-warning border-warning/30 font-bold">
                          DEV MODE
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background/50 rounded px-2 py-1">
                      <div className="text-primary font-bold">{activeFlags}</div>
                      <div className="text-muted-foreground">Active</div>
                    </div>
                    <div className="bg-background/50 rounded px-2 py-1">
                      <div className="text-accent font-bold">{overrideCount}</div>
                      <div className="text-muted-foreground">Override{overrideCount !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="bg-background/50 rounded px-2 py-1">
                      <div className="text-muted-foreground font-bold">{totalFlags - activeFlags}</div>
                      <div className="text-muted-foreground">Disabled</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

// Higher-order component for feature flagging
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flagName: keyof FeatureFlags,
  fallbackComponent?: React.ComponentType<P>
) {
  return function FeatureFlaggedComponent(props: P) {
    const isEnabled = useFeatureFlag(flagName);
    
    if (!isEnabled) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...props} />;
      }
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Utility to get feature flags as object (useful for API calls)
export function getFeatureFlagsSnapshot(): FeatureFlags {
  // This would typically read from your feature flag service
  return defaultFeatureFlags;
}

// Example usage components
export const ExperimentalFeatures = ({ children }: { children: ReactNode }) => (
  <FeatureFlag flag="experimentalUI">
    {children}
  </FeatureFlag>
);

export const PremiumFeatures = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <FeatureFlag flag="premiumFeatures" fallback={fallback}>
    {children}
  </FeatureFlag>
);

export const EnterpriseFeatures = ({ children }: { children: ReactNode }) => (
  <FeatureFlag flag="enterpriseFeatures">
    {children}
  </FeatureFlag>
);

export const BetaFeatures = ({ children }: { children: ReactNode }) => (
  <FeatureFlag flag="betaDeployments">
    {children}
  </FeatureFlag>
);