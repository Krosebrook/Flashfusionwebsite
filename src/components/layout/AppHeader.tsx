import { Button } from '../ui/button';
import { NotificationBell } from '../notifications/NotificationSystem';
import { AuthButton } from '../auth/AuthSystem';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { PageType } from '../../types';

interface AppHeaderProps {
  showSidebar: boolean;
  isAuthenticated: boolean;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  setShowWizard: (show: boolean) => void;
}

export function AppHeader({ 
  showSidebar, 
  isAuthenticated, 
  currentPage, 
  setCurrentPage, 
  setShowWizard 
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${showSidebar ? 'lg:hidden' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="font-bold ff-text-gradient">FlashFusion</span>
          </div>
          
          {/* Public navigation for marketing pages */}
          {!showSidebar && !isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage('features')}
                className={currentPage === 'features' ? 'text-primary' : ''}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage('pricing')}
                className={currentPage === 'pricing' ? 'text-primary' : ''}
              >
                Pricing
              </Button>
              
              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Resources
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentPage('demo')}>
                    Interactive Demo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage('testimonials')}>
                    Success Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage('faq')}>
                    FAQ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentPage('about')}>
                    About Us
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage('contact')}>
                    Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                onClick={() => setShowWizard(true)}
              >
                Get Started
              </Button>
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <ErrorBoundary>
              <AuthButton />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      
      {/* Footer for public pages */}
      {!showSidebar && !isAuthenticated && (
        <div className="border-t border-border bg-card/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FF</span>
                  </div>
                  <span className="font-bold ff-text-gradient">FlashFusion</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build apps with AI in minutes, not months. The comprehensive platform for modern development.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <div className="space-y-2 text-sm">
                  <button onClick={() => setCurrentPage('features')} className="block text-muted-foreground hover:text-primary">
                    Features
                  </button>
                  <button onClick={() => setCurrentPage('pricing')} className="block text-muted-foreground hover:text-primary">
                    Pricing
                  </button>
                  <button onClick={() => setCurrentPage('demo')} className="block text-muted-foreground hover:text-primary">
                    Demo
                  </button>
                  <button onClick={() => setCurrentPage('testimonials')} className="block text-muted-foreground hover:text-primary">
                    Testimonials
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-sm">
                  <button onClick={() => setCurrentPage('about')} className="block text-muted-foreground hover:text-primary">
                    About Us
                  </button>
                  <button onClick={() => setCurrentPage('contact')} className="block text-muted-foreground hover:text-primary">
                    Contact
                  </button>
                  <button onClick={() => setCurrentPage('faq')} className="block text-muted-foreground hover:text-primary">
                    FAQ
                  </button>
                  <a href="#careers" className="block text-muted-foreground hover:text-primary">
                    Careers
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2 text-sm">
                  <button onClick={() => setCurrentPage('privacy')} className="block text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </button>
                  <button onClick={() => setCurrentPage('terms')} className="block text-muted-foreground hover:text-primary">
                    Terms of Service
                  </button>
                  <a href="#security" className="block text-muted-foreground hover:text-primary">
                    Security
                  </a>
                  <a href="#compliance" className="block text-muted-foreground hover:text-primary">
                    Compliance
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 FlashFusion Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="#twitter" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#github" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">GitHub</span>
                  🐙
                </a>
                <a href="#discord" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Discord</span>
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}