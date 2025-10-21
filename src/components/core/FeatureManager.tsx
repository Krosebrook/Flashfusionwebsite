import { createContext, useContext, ReactNode } from 'react';
import { useConfiguration } from './ConfigurationManager';

interface FeatureFlags {
  // Core Features
  analytics: boolean;
  gamification: boolean;
  collaboration: boolean;
  multiAgent: boolean;
  subscriptions: boolean;
  
  // UI Features
  darkMode: boolean;
  animations: boolean;
  notifications: boolean;
  
  // Advanced Features
  aiAssistant: boolean;
  voiceCommands: boolean;
  realTimeSync: boolean;
  
  // Experimental Features
  betaFeatures: boolean;
  advancedAnalytics: boolean;
  customThemes: boolean;
}

interface FeatureContextValue {
  features: FeatureFlags;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
}

const FeatureContext = createContext<FeatureContextValue | null>(null);

interface FeatureManagerProps {
  children: ReactNode;
}

/**
 * Feature manager that provides centralized feature flag management
 * for controlling FlashFusion's feature rollout and experimentation
 */
export function FeatureManager({ children }: FeatureManagerProps) {
  const { features: configFeatures, updateFeature } = useConfiguration();
  
  // Combine configuration features with additional UI features
  const features: FeatureFlags = {
    // From configuration
    analytics: configFeatures.analytics,
    gamification: configFeatures.gamification,
    collaboration: configFeatures.collaboration,
    multiAgent: configFeatures.multiAgent,
    subscriptions: configFeatures.subscriptions,
    
    // UI Features (can be toggled independently)
    darkMode: true,
    animations: true,
    notifications: true,
    
    // Advanced Features
    aiAssistant: true,
    voiceCommands: false, // Experimental
    realTimeSync: true,
    
    // Experimental Features
    betaFeatures: process.env.NODE_ENV === 'development',
    advancedAnalytics: configFeatures.analytics,
    customThemes: false, // Coming soon
  };

  const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    return features[feature] === true;
  };

  const enableFeature = (feature: keyof FeatureFlags) => {
    // Update configuration features if they exist there
    if (feature in configFeatures) {
      updateFeature(feature as keyof typeof configFeatures, true);
    }
    
    console.log(`Feature enabled: ${feature}`);
  };

  const disableFeature = (feature: keyof FeatureFlags) => {
    // Update configuration features if they exist there
    if (feature in configFeatures) {
      updateFeature(feature as keyof typeof configFeatures, false);
    }
    
    console.log(`Feature disabled: ${feature}`);
  };

  const contextValue: FeatureContextValue = {
    features,
    isFeatureEnabled,
    enableFeature,
    disableFeature,
  };

  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
}

/**
 * Hook to access feature flags and controls
 */
export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureManager');
  }
  return context;
}

/**
 * Component wrapper for conditional feature rendering
 */
interface FeatureGateProps {
  feature: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { isFeatureEnabled } = useFeatures();
  
  return isFeatureEnabled(feature) ? <>{children}</> : <>{fallback}</>;
}