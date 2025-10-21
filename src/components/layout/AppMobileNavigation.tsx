import { MobileBottomNav, MobileHeader, GestureHints } from '../mobile/MobileEnhancements';
import { NotificationBell } from '../notifications/NotificationSystem';
import { AuthButton } from '../auth/AuthSystem';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageType } from '../../types';
import { MOBILE_NAV_ITEMS, PAGE_TITLES } from '../../lib/app-constants';

interface AppMobileNavigationProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isAuthenticated: boolean;
}

export function AppMobileNavigation({ 
  currentPage, 
  setCurrentPage, 
  isAuthenticated 
}: AppMobileNavigationProps) {
  return (
    <>
      {/* Mobile Header */}
      <MobileHeader
        title={PAGE_TITLES[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
        showBackButton={currentPage !== 'home' && !isAuthenticated}
        onBack={() => setCurrentPage('home')}
        actions={
          <div className="flex items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <ErrorBoundary>
              <AuthButton />
            </ErrorBoundary>
          </div>
        }
      />

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          items={MOBILE_NAV_ITEMS}
        />
      )}

      {/* Gesture Hints for Mobile */}
      <GestureHints />
    </>
  );
}