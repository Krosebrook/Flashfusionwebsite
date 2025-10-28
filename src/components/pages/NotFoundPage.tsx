import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundPageProps {
  onPageChange?: (page: string) => void;
}

export function NotFoundPage({ onPageChange }: NotFoundPageProps) {
  const handleGoHome = () => {
    if (onPageChange) {
      onPageChange('home');
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const popularPages = [
    { name: 'AI Tools', path: 'tools', icon: Compass },
    { name: 'Features', path: 'features', icon: Search },
    { name: 'Pricing', path: 'pricing', icon: Home }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Graphic */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-9xl font-bold ff-text-gradient opacity-20"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-6xl">🚀</div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Lost in Space
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Looks like this page took a detour through a black hole. 
              Let's get you back on course!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="ff-btn-primary"
              onClick={handleGoHome}
            >
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Or explore these popular pages:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularPages.map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card 
                    className="ff-card-interactive cursor-pointer"
                    onClick={() => onPageChange?.(page.path)}
                  >
                    <CardHeader className="pb-2">
                      <page.icon className="w-6 h-6 text-primary mx-auto" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardTitle className="text-sm font-medium text-center">
                        {page.name}
                      </CardTitle>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 text-sm text-muted-foreground"
          >
            <p>
              Still having trouble? 
              <button 
                onClick={() => onPageChange?.('contact')}
                className="text-primary hover:underline ml-1"
              >
                Contact our support team
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Default export for lazy loading
export default NotFoundPage;