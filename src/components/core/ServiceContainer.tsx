import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { CONFIG } from '../../lib/config';

// Service interfaces
interface DatabaseService {
  client: typeof supabase;
  isConnected: boolean;
}

interface AnalyticsService {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, properties?: Record<string, any>) => void;
}

interface NotificationService {
  send: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  subscribe: (userId: string, callback: (notification: any) => void) => () => void;
}

interface Services {
  database: DatabaseService;
  analytics: AnalyticsService;
  notifications: NotificationService;
}

interface ServiceContainerContextValue {
  services: Services;
  getService: <T extends keyof Services>(serviceName: T) => Services[T];
}

const ServiceContainerContext = createContext<ServiceContainerContextValue | null>(null);

interface ServiceContainerProps {
  children: ReactNode;
}

/**
 * Service container that provides dependency injection
 * for FlashFusion services and utilities
 */
export function ServiceContainer({ children }: ServiceContainerProps) {
  // Initialize services
  const services: Services = {
    database: {
      client: supabase,
      isConnected: true, // TODO: Add actual connection check
    },
    
    analytics: {
      track: (event: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', event, properties);
        }
        console.log('Analytics Event:', event, properties);
      },
      
      identify: (userId: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', CONFIG.GA_MEASUREMENT_ID, {
            user_id: userId,
            custom_map: properties,
          });
        }
        console.log('Analytics Identify:', userId, properties);
      },
    },
    
    notifications: {
      send: (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        // TODO: Implement toast notifications
        console.log(`Notification [${type}]:`, message);
      },
      
      subscribe: (userId: string, callback: (notification: any) => void) => {
        // TODO: Implement real-time subscription
        console.log('Subscribing to notifications for user:', userId);
        return () => console.log('Unsubscribing from notifications');
      },
    },
  };

  const getService = <T extends keyof Services>(serviceName: T): Services[T] => {
    return services[serviceName];
  };

  const contextValue: ServiceContainerContextValue = {
    services,
    getService,
  };

  return (
    <ServiceContainerContext.Provider value={contextValue}>
      {children}
    </ServiceContainerContext.Provider>
  );
}

/**
 * Hook to access services from the container
 */
export function useServices() {
  const context = useContext(ServiceContainerContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceContainer');
  }
  return context;
}

/**
 * Hook to get a specific service
 */
export function useService<T extends keyof Services>(serviceName: T): Services[T] {
  const { getService } = useServices();
  return getService(serviceName);
}