// Unified configuration management system for FlashFusion
import { getEnvironmentMode, getEnvironmentVariable, isDevelopment, isProduction } from '../utils/environment';

export interface AppConfig {
  // Environment
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildTime: string;
  
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    rateLimit: {
      requests: number;
      windowMs: number;
    };
  };
  
  // Authentication
  auth: {
    tokenStorage: 'localStorage' | 'sessionStorage' | 'memory';
    tokenRefreshThreshold: number;
    sessionTimeout: number;
  };
  
  // Performance
  performance: {
    enableMetrics: boolean;
    enableCodeSplitting: boolean;
    enablePreloading: boolean;
    bundleAnalysis: boolean;
    lazyLoadThreshold: number;
  };
  
  // UI/UX
  ui: {
    theme: 'dark' | 'light' | 'auto';
    animations: boolean;
    reducedMotion: boolean;
    pageTransitions: boolean;
    loadingDelay: number;
  };
  
  // Features
  features: {
    aiTools: boolean;
    multiAgent: boolean;
    realTimeSync: boolean;
    collaboration: boolean;
    analytics: boolean;
    monitoring: boolean;
  };
  
  // Analytics
  analytics: {
    enabled: boolean;
    trackingId?: string;
    trackPageViews: boolean;
    trackUserInteractions: boolean;
    trackPerformance: boolean;
    trackErrors: boolean;
  };
  
  // Storage
  storage: {
    cacheTTL: number;
    maxCacheSize: number;
    enablePersistence: boolean;
    compressionEnabled: boolean;
  };
  
  // Development
  development: {
    enableDebugging: boolean;
    showErrorDetails: boolean;
    enableHotReload: boolean;
    enableDevTools: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
  
  // Security
  security: {
    enableCSP: boolean;
    enableHSTS: boolean;
    trustedDomains: string[];
    apiKeyEncryption: boolean;
  };
  
  // Deployment
  deployment: {
    platform: string;
    region: string;
    cdnEnabled: boolean;
    compressionEnabled: boolean;
  };
}

// Default configuration using centralized environment utilities
const defaultConfig: AppConfig = {
  environment: getEnvironmentMode(),
  version: getEnvironmentVariable('VITE_APP_VERSION', '1.0.0'),
  buildTime: getEnvironmentVariable('VITE_BUILD_TIME', new Date().toISOString()),
  
  api: {
    baseUrl: getEnvironmentVariable('VITE_API_BASE_URL', '/api'),
    timeout: 30000,
    retryAttempts: 3,
    rateLimit: {
      requests: 100,
      windowMs: 60000
    }
  },
  
  auth: {
    tokenStorage: 'localStorage',
    tokenRefreshThreshold: 300000, // 5 minutes
    sessionTimeout: 3600000 // 1 hour
  },
  
  performance: {
    enableMetrics: true,
    enableCodeSplitting: true,
    enablePreloading: true,
    bundleAnalysis: isDevelopment(),
    lazyLoadThreshold: 100
  },
  
  ui: {
    theme: 'dark',
    animations: true,
    reducedMotion: false,
    pageTransitions: true,
    loadingDelay: 200
  },
  
  features: {
    aiTools: true,
    multiAgent: true,
    realTimeSync: true,
    collaboration: true,
    analytics: true,
    monitoring: isProduction()
  },
  
  analytics: {
    enabled: isProduction(),
    trackingId: getEnvironmentVariable('VITE_GA_TRACKING_ID'),
    trackPageViews: true,
    trackUserInteractions: true,
    trackPerformance: true,
    trackErrors: true
  },
  
  storage: {
    cacheTTL: 3600000, // 1 hour
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    enablePersistence: true,
    compressionEnabled: true
  },
  
  development: {
    enableDebugging: isDevelopment(),
    showErrorDetails: isDevelopment(),
    enableHotReload: isDevelopment(),
    enableDevTools: isDevelopment(),
    logLevel: isDevelopment() ? 'debug' : 'error'
  },
  
  security: {
    enableCSP: isProduction(),
    enableHSTS: isProduction(),
    trustedDomains: [
      'flashfusion.com',
      'api.flashfusion.com',
      'cdn.flashfusion.com'
    ],
    apiKeyEncryption: true
  },
  
  deployment: {
    platform: getEnvironmentVariable('VITE_DEPLOYMENT_PLATFORM', 'unknown'),
    region: getEnvironmentVariable('VITE_DEPLOYMENT_REGION', 'unknown'),
    cdnEnabled: isProduction(),
    compressionEnabled: isProduction()
  }
};

// Configuration validation schema
const configSchema = {
  environment: ['development', 'staging', 'production'],
  'auth.tokenStorage': ['localStorage', 'sessionStorage', 'memory'],
  'ui.theme': ['dark', 'light', 'auto'],
  'development.logLevel': ['error', 'warn', 'info', 'debug']
};

// Configuration service
export class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;
  private overrides: Partial<AppConfig> = {};
  private listeners: Array<(config: AppConfig) => void> = [];

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    try {
      // Start with default config
      let config = { ...defaultConfig };

      // Apply environment-specific overrides
      const envOverrides = this.getEnvironmentOverrides();
      config = this.mergeConfig(config, envOverrides);

      // Apply user preferences (stored in localStorage)
      const userPreferences = this.getUserPreferences();
      config = this.mergeConfig(config, userPreferences);

      // Apply runtime overrides
      config = this.mergeConfig(config, this.overrides);

      // Validate configuration
      this.validateConfig(config);

      return config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      return defaultConfig;
    }
  }

  private getEnvironmentOverrides(): Partial<AppConfig> {
    const overrides: Partial<AppConfig> = {};
    const env = getEnvironmentMode();

    // Production overrides
    if (env === 'production') {
      overrides.development = {
        enableDebugging: false,
        showErrorDetails: false,
        enableHotReload: false,
        enableDevTools: false,
        logLevel: 'error'
      };
      overrides.analytics = {
        ...defaultConfig.analytics,
        enabled: true
      };
    }

    // Staging overrides
    if (env === 'staging') {
      overrides.development = {
        ...defaultConfig.development,
        logLevel: 'warn'
      };
    }

    return overrides;
  }

  private getUserPreferences(): Partial<AppConfig> {
    try {
      const stored = localStorage.getItem('ff-user-preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        return {
          ui: {
            theme: preferences.theme || defaultConfig.ui.theme,
            animations: preferences.animations ?? defaultConfig.ui.animations,
            reducedMotion: preferences.reducedMotion ?? defaultConfig.ui.reducedMotion
          }
        };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return {};
  }

  private mergeConfig(base: AppConfig, override: Partial<AppConfig>): AppConfig {
    return this.deepMerge(base, override) as AppConfig;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  private validateConfig(config: AppConfig): void {
    for (const [path, validValues] of Object.entries(configSchema)) {
      const value = this.getNestedValue(config, path);
      if (value !== undefined && !validValues.includes(value)) {
        console.warn(`Invalid config value for ${path}: ${value}. Valid values: ${validValues.join(', ')}`);
      }
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Public API
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getNestedConfig<T = any>(path: string): T {
    return this.getNestedValue(this.config, path);
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.overrides[key] = value;
    this.config = this.loadConfig();
    this.notifyListeners();
  }

  setNested(path: string, value: any): void {
    const keys = path.split('.');
    let current = this.overrides as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    this.config = this.loadConfig();
    this.notifyListeners();
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  reset(): void {
    this.overrides = {};
    this.config = this.loadConfig();
    this.notifyListeners();
  }

  subscribe(listener: (config: AppConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.config);
      } catch (error) {
        console.error('Config listener error:', error);
      }
    });
  }

  // Utility methods
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  getApiConfig() {
    return this.config.api;
  }

  getPerformanceConfig() {
    return this.config.performance;
  }

  getUIConfig() {
    return this.config.ui;
  }

  // Export configuration for debugging
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Import configuration (for testing)
  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      this.overrides = importedConfig;
      this.config = this.loadConfig();
      this.notifyListeners();
    } catch (error) {
      throw new Error(`Invalid configuration JSON: ${error}`);
    }
  }

  // Save user preferences
  saveUserPreferences(): void {
    try {
      const preferences = {
        theme: this.config.ui.theme,
        animations: this.config.ui.animations,
        reducedMotion: this.config.ui.reducedMotion,
        lastUpdated: Date.now()
      };
      localStorage.setItem('ff-user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }
}

// Export singleton instance
export const configService = ConfigService.getInstance();

// React hook for using configuration
import React, { useState, useEffect } from 'react';

export function useConfig(): AppConfig {
  const [config, setConfig] = useState(configService.getAll());

  useEffect(() => {
    const unsubscribe = configService.subscribe(setConfig);
    return unsubscribe;
  }, []);

  return config;
}

export function useConfigValue<T = any>(path: string): T {
  const [value, setValue] = useState<T>(configService.getNestedConfig(path));

  useEffect(() => {
    const unsubscribe = configService.subscribe((newConfig) => {
      setValue(configService.getNestedConfig(path));
    });
    return unsubscribe;
  }, [path]);

  return value;
}

// Configuration context for React
const ConfigContext = React.createContext<AppConfig | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = useConfig();
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext(): AppConfig {
  const context = React.useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
}