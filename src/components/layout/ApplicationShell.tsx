import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../components/ui/utils';
import { ErrorBoundary } from '../ErrorBoundary';

// Layout components
import { AppHeader } from './AppHeader';
import { AppMobileNavigation } from './AppMobileNavigation';
import { AppFooter } from './AppFooter';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';

// State and hooks
import { useLayoutState } from './LayoutStateManager';
import { useAppData } from '../../hooks/useAppData';

// Simple routing utilities
const shouldShowSidebar = (currentPage: string, isMobile: boolean, isAuthenticated: boolean) => {
  const publicPages = ['home', 'about', 'features', 'pricing', 'contact', 'testimonials', 'faq', 'demo', 'terms', 'privacy'];
  return !publicPages.includes(currentPage) && isAuthenticated;
};

const shouldShowFooter = (currentPage: string) => {
  const publicPages = ['home', 'about', 'features', 'pricing', 'contact', 'testimonials', 'faq', 'demo', 'terms', 'privacy'];
  return publicPages.includes(currentPage);
};

interface ApplicationShellProps {
  children: React.ReactNode;
}

/**
 * Application shell that provides the main layout structure
 * including header, sidebar, navigation, and footer
 */
export function ApplicationShell({ children }: ApplicationShellProps) {
  const {
    currentPage,
    sidebarOpen,
    setCurrentPage,
    setSidebarOpen,
    setShowWizard,
    toggleSidebar
  } = useLayoutState();
  
  const { 
    dailyTasks, 
    userStats, 
    isAuthenticated,
    user
  } = useAppData();
  
  // Simple mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Layout calculations
  const showSidebar = shouldShowSidebar(currentPage, isMobile, isAuthenticated);
  const showFooter = shouldShowFooter(currentPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Navigation */}
      {isMobile && (
        <AppMobileNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <AppHeader
          showSidebar={showSidebar}
          isAuthenticated={isAuthenticated}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setShowWizard={setShowWizard}
        />
      )}

      <div className="flex flex-1">
        {/* Mobile Menu Button */}
        {showSidebar && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-40 lg:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Sidebar Overlay */}
        {sidebarOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {showSidebar && (
          <ErrorBoundary>
            <Sidebar 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isAuthenticated={isAuthenticated}
              userStats={userStats}
              setShowWizard={setShowWizard}
              dailyTasks={dailyTasks}
            />
          </ErrorBoundary>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <main className={cn(
            "flex-1",
            showSidebar ? "container mx-auto px-6 py-8 lg:px-8" : "px-0 py-0",
            isMobile && "pb-20"
          )}>
            {/* Breadcrumb */}
            {showSidebar && !isMobile && (
              <ErrorBoundary>
                <Breadcrumb currentPage={currentPage} />
              </ErrorBoundary>
            )}
            
            {/* Page Content */}
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>

          {/* Footer */}
          {showFooter && (
            <ErrorBoundary>
              <AppFooter 
                setCurrentPage={setCurrentPage}
                isAuthenticated={isAuthenticated}
              />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}