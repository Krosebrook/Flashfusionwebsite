import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { config } from '../../lib/config';
import { monitorPerformance } from '../../lib/monitoring';

interface ConfigurationState {
  isInitialized: boolean;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    gamification: boolean;
    collaboration: boolean;
    multiAgent: boolean;
    subscriptions: boolean;
  };
  monitoring: {
    performance: boolean;
    errors: boolean;
    userTracking: boolean;
  };
}

interface ConfigurationContextValue extends ConfigurationState {
  updateFeature: (feature: keyof ConfigurationState['features'], enabled: boolean) => void;
  updateMonitoring: (monitor: keyof ConfigurationState['monitoring'], enabled: boolean) => void;
}

const ConfigurationContext = createContext<ConfigurationContextValue | null>(null);

interface ConfigurationManagerProps {
  children: ReactNode;
}

/**
 * Configuration manager that handles app-wide configuration
 * including feature flags, monitoring settings, and environment setup
 */
export function ConfigurationManager({ children }: ConfigurationManagerProps) {
  const [configState, setConfigState] = useState<ConfigurationState>({
    isInitialized: false,
    environment: 'development',
    features: {
      analytics: true,
      gamification: true,
      collaboration: true,
      multiAgent: true,
      subscriptions: true,
    },
    monitoring: {
      performance: true,
      errors: true,
      userTracking: true,
    }
  });

  // Initialize configuration on mount
  useEffect(() => {
    const initializeConfiguration = async () => {
      try {
        // Determine environment
        const environment = process.env.NODE_ENV === 'production' 
          ? 'production' 
          : process.env.NODE_ENV === 'staging' 
            ? 'staging' 
            : 'development';

        // Initialize monitoring if enabled
        if (configState.monitoring.performance) {
          monitorPerformance();
        }

        // Update configuration state
        setConfigState(prev => ({
          ...prev,
          isInitialized: true,
          environment,
        }));

        console.log(`FlashFusion initialized in ${environment} mode`);
      } catch (error) {
        console.error('Configuration initialization failed:', error);
      }
    };

    initializeConfiguration();
  }, []);

  const updateFeature = (feature: keyof ConfigurationState['features'], enabled: boolean) => {
    setConfigState(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled,
      },
    }));
  };

  const updateMonitoring = (monitor: keyof ConfigurationState['monitoring'], enabled: boolean) => {
    setConfigState(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [monitor]: enabled,
      },
    }));
  };

  const contextValue: ConfigurationContextValue = {
    ...configState,
    updateFeature,
    updateMonitoring,
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}

/**
 * Hook to access configuration state and actions
 */
export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationManager');
  }
  return context;
}