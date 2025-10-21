/**
 * @fileoverview Responsive CTA Button Components for FlashFusion
 * @chunk ui-system
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Optimized CTA buttons that handle text overflow and responsive layouts
 * specifically for promotional content and marketing CTAs.
 */

import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from './utils';
import { 
  Gift, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Percent,
  Clock 
} from 'lucide-react';

interface ResponsiveCTAProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

// Primary promotional CTA with 50% off offer
export function PromoStartBuildingButton({ 
  onClick, 
  disabled, 
  loading, 
  className 
}: ResponsiveCTAProps) {
  return (
    <div className="relative group">
      <Button 
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          // Base styling
          'ff-btn-primary relative overflow-hidden group',
          'min-h-[3.5rem] sm:min-h-[4rem]',
          'px-4 sm:px-8 py-3 sm:py-4',
          'rounded-xl border-0',
          'transition-all duration-300',
          'hover:scale-105 active:scale-95',
          'ff-hover-glow',
          
          // Text handling
          'text-left sm:text-center',
          
          className
        )}
      >
        {/* Button Content */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 relative z-10 w-full">
          
          {/* Icon */}
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white" />
          
          {/* Text Content */}
          <div className="flex flex-col items-start sm:items-center flex-1 min-w-0">
            {/* Main text - responsive */}
            <div className="font-bold text-white leading-tight">
              <span className="block sm:hidden text-base">
                Get 50% Off
              </span>
              <span className="hidden sm:block text-lg lg:text-xl">
                Get 50% Off - Start Building
              </span>
            </div>
            
            {/* Secondary text */}
            <div className="text-xs sm:text-sm text-white/90 leading-tight">
              <span className="block sm:hidden">
                4 months promo
              </span>
              <span className="hidden sm:block">
                4 months promotional pricing
              </span>
            </div>
          </div>
          
          {/* Arrow Icon */}
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white group-hover:translate-x-1 transition-transform" />
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Button>
      
      {/* Discount Badge - Desktop Only */}
      <Badge className="absolute -top-2 -right-2 z-30 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold border-2 border-background hidden sm:flex items-center gap-1 animate-pulse">
        <Percent className="w-3 h-3" />
        50% OFF
      </Badge>
    </div>
  );
}

// Demo CTA button 
export function TryInteractiveDemoButton({ 
  onClick, 
  disabled, 
  loading, 
  className 
}: ResponsiveCTAProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || loading}
      variant="outline"
      className={cn(
        // Base styling
        'ff-btn-outline relative overflow-hidden group',
        'min-h-[3.5rem] sm:min-h-[4rem]',
        'px-4 sm:px-8 py-3 sm:py-4',
        'rounded-xl',
        'border-2 border-primary/30 hover:border-primary/60',
        'transition-all duration-300',
        'hover:scale-105 active:scale-95',
        'ff-hover-glow-secondary',
        
        // Background
        'bg-transparent hover:bg-primary/5',
        
        className
      )}
    >
      {/* Button Content */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 relative z-10 w-full">
        
        {/* Play Icon */}
        <Play className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
        
        {/* Text Content */}
        <div className="flex flex-col items-start sm:items-center flex-1 min-w-0">
          {/* Main text - responsive */}
          <div className="font-semibold text-primary leading-tight">
            <span className="block sm:hidden text-base">
              Try Demo
            </span>
            <span className="hidden sm:block text-lg lg:text-xl">
              Try Interactive Demo
            </span>
          </div>
          
          {/* Secondary text */}
          <div className="text-xs sm:text-sm text-primary/80 leading-tight">
            <span className="block sm:hidden">
              Free preview
            </span>
            <span className="hidden sm:block">
              No signup required
            </span>
          </div>
        </div>
        
        {/* Sparkles Icon */}
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-primary group-hover:rotate-12 transition-transform" />
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Button>
  );
}

// Compact mobile-first versions
export function CompactPromoButton({ 
  onClick, 
  disabled, 
  loading, 
  className 
}: ResponsiveCTAProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'ff-btn-primary w-full relative overflow-hidden',
        'min-h-[3rem] px-4 py-2 rounded-lg',
        'transition-all duration-300 hover:scale-105',
        'ff-hover-glow',
        className
      )}
    >
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-white" />
          <div className="text-left">
            <div className="text-sm font-bold text-white leading-tight">Get 50% Off</div>
            <div className="text-xs text-white/90 leading-tight">Start Building</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full font-bold">
            50% OFF
          </Badge>
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Button>
  );
}

export function CompactDemoButton({ 
  onClick, 
  disabled, 
  loading, 
  className 
}: ResponsiveCTAProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || loading}
      variant="outline"
      className={cn(
        'ff-btn-outline w-full relative overflow-hidden',
        'min-h-[3rem] px-4 py-2 rounded-lg',
        'border-primary/30 hover:border-primary/60',
        'transition-all duration-300 hover:scale-105',
        'ff-hover-glow-secondary',
        className
      )}
    >
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          <div className="text-left">
            <div className="text-sm font-semibold text-primary leading-tight">Try Demo</div>
            <div className="text-xs text-primary/80 leading-tight">Free Preview</div>
          </div>
        </div>
        
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Button>
  );
}

// Container for responsive button groups
export function ResponsiveCTAGroup({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      // Base layout
      'flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6',
      'w-full max-w-4xl mx-auto',
      
      // Mobile optimization
      'px-4 sm:px-0',
      
      className
    )}>
      {children}
    </div>
  );
}