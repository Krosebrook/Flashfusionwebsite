import React, { useState, useEffect } from 'react';
import { X, Zap, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { isDevelopment, isProduction } from '../../lib/env';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-hide banner after a certain time in development
  useEffect(() => {
    if (isDevelopment) {
      const timer = setTimeout(() => {
        handleClose();
      }, 30000); // Auto-hide after 30 seconds in development

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`relative bg-gradient-to-r from-primary via-secondary to-accent text-white transition-all duration-300 ${
        isAnimating ? 'opacity-0 transform -translate-y-full' : 'opacity-100'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium">
                  ✨ Demo Mode
                </Badge>
                
                <p className="text-sm font-medium">
                  You're exploring FlashFusion Demo
                </p>
                
                <span className="hidden sm:inline text-sm opacity-90">
                  • Experience 60+ AI tools with real outputs
                </span>
              </div>
              
              <p className="text-xs opacity-75 mt-1 hidden md:block">
                Generate production-ready applications across multiple frameworks with full CI/CD integration
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 ml-4">
            {isProduction && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 hidden sm:inline-flex"
                onClick={() => window.open('https://flashfusion.ai', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            )}
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
              aria-label="Close demo banner"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for development mode */}
      {isDevelopment && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
          <div className="h-full bg-white/60 ff-progress-bar" style={{ animationDuration: '30s' }}></div>
        </div>
      )}
    </div>
  );
}

export default DemoBanner;