import { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CONFIG } from '../../lib/config';
import { toast } from 'sonner';

// Service interfaces
interface DatabaseService {
  client: typeof supabase;
  isConnected: boolean;
  checkConnection: () => Promise<boolean>;
}

interface AnalyticsService {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, properties?: Record<string, any>) => void;
}

interface NotificationService {
  send: (message: string, type?: 'info' | 'success' | 'warning' | 'error', options?: NotificationOptions) => void;
  promise: <T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) => Promise<T>;
  subscribe: (userId: string, callback: (notification: any) => void) => () => void;
  dismiss: (toastId?: string | number) => void;
}

interface NotificationOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RealtimeService {
  subscribe: <T>(channel: string, event: string, callback: (payload: T) => void) => () => void;
  broadcast: (channel: string, event: string, payload: any) => Promise<void>;
}

interface Services {
  database: DatabaseService;
  analytics: AnalyticsService;
  notifications: NotificationService;
  realtime: RealtimeService;
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
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach((unsubscribe) => unsubscribe());
      subscriptionsRef.current.clear();
    };
  }, []);

  // Initialize services
  const services: Services = {
    database: {
      client: supabase,
      isConnected: isSupabaseConfigured,
      checkConnection: async () => {
        if (!isSupabaseConfigured) {
          return false;
        }
        try {
          // Attempt a simple query to verify connection
          const { error } = await supabase.from('users').select('id').limit(1);
          return !error;
        } catch {
          return false;
        }
      },
    },

    analytics: {
      track: (event: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', event, properties);
        }
        // Also log in development for debugging
        if (import.meta.env.DEV) {
          console.log('📊 Analytics Event:', event, properties);
        }
      },

      identify: (userId: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', CONFIG.GA_MEASUREMENT_ID, {
            user_id: userId,
            custom_map: properties,
          });
        }
        if (import.meta.env.DEV) {
          console.log('📊 Analytics Identify:', userId, properties);
        }
      },
    },

    notifications: {
      send: (
        message: string,
        type: 'info' | 'success' | 'warning' | 'error' = 'info',
        options?: NotificationOptions
      ) => {
        const toastOptions = {
          duration: options?.duration || 4000,
          description: options?.description,
          action: options?.action ? {
            label: options.action.label,
            onClick: options.action.onClick,
          } : undefined,
        };

        switch (type) {
          case 'success':
            toast.success(message, toastOptions);
            break;
          case 'error':
            toast.error(message, toastOptions);
            break;
          case 'warning':
            toast.warning(message, toastOptions);
            break;
          case 'info':
          default:
            toast.info(message, toastOptions);
            break;
        }
      },

      promise: async <T,>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string }
      ): Promise<T> => {
        return toast.promise(promise, {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
        });
      },

      dismiss: (toastId?: string | number) => {
        if (toastId !== undefined) {
          toast.dismiss(toastId);
        } else {
          toast.dismiss();
        }
      },

      subscribe: (userId: string, callback: (notification: any) => void) => {
        if (!isSupabaseConfigured) {
          console.log('⚠️ Real-time notifications not available in demo mode');
          return () => {};
        }

        const channel = supabase
          .channel(`notifications:${userId}`)
          .on(
            'postgres_changes' as any,
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`,
            },
            (payload: any) => {
              callback(payload.new);
              // Auto-show toast for new notifications
              toast.info(payload.new.title || 'New notification', {
                description: payload.new.message,
              });
            }
          )
          .subscribe();

        const unsubscribe = () => {
          supabase.removeChannel(channel);
        };

        subscriptionsRef.current.set(`notifications:${userId}`, unsubscribe);
        return unsubscribe;
      },
    },

    realtime: {
      subscribe: <T,>(channel: string, event: string, callback: (payload: T) => void) => {
        if (!isSupabaseConfigured) {
          console.log('⚠️ Real-time subscriptions not available in demo mode');
          return () => {};
        }

        const channelInstance = supabase
          .channel(channel)
          .on('broadcast' as any, { event }, (payload: any) => {
            callback(payload.payload as T);
          })
          .subscribe();

        const unsubscribe = () => {
          supabase.removeChannel(channelInstance);
          subscriptionsRef.current.delete(channel);
        };

        subscriptionsRef.current.set(channel, unsubscribe);
        return unsubscribe;
      },

      broadcast: async (channel: string, event: string, payload: any) => {
        if (!isSupabaseConfigured) {
          console.log('⚠️ Real-time broadcast not available in demo mode');
          return;
        }

        const channelInstance = supabase.channel(channel);
        await channelInstance.send({
          type: 'broadcast',
          event,
          payload,
        });
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