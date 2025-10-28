import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Analytics } from '../Analytics';
import { AuthProvider } from '../auth/AuthSystem';
import { NotificationProvider } from '../notifications/NotificationSystem';
import { ConfigurationManager } from '../core/ConfigurationManager';
import { FeatureManager } from '../core/FeatureManager';

interface AppProviderProps {
  children: ReactNode;
  userId?: string;
}

/**
 * Core application provider that wraps all context providers
 * and global error boundaries for the FlashFusion platform
 * 
 * Provider hierarchy:
 * 1. ErrorBoundary - Global error handling
 * 2. ConfigurationManager - App-wide configuration
 * 3. FeatureManager - Feature flags and controls
 * 4. AuthProvider - Authentication context
 * 5. NotificationProvider - Real-time notifications
 * 6. Analytics - User tracking and analytics
 */
export function AppProvider({ children, userId = "current-user" }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <ConfigurationManager>
        <FeatureManager>
          <AuthProvider>
            <NotificationProvider userId={userId}>
              <Analytics />
              {children}
            </NotificationProvider>
          </AuthProvider>
        </FeatureManager>
      </ConfigurationManager>
    </ErrorBoundary>
  );
}