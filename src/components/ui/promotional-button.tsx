/**
 * @fileoverview Promotional Button Component for FlashFusion
 * @chunk ui-system
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Specialized button component designed for promotional CTAs with
 * multi-line text, discount badges, and responsive layouts.
 */

import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { ProfessionalIcon, type IconSize } from './professional-icon-system';
import { cn } from './utils';
import type { LucideIcon } from 'lucide-react';

interface PromotionalButtonProps {
  // Main content
  primaryText: string;
  secondaryText?: string;
  
  // Discount/promotional info
  discountText?: string;
  discountBadge?: string;
  
  // Button configuration
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'default' | 'lg' | 'xl';
  
  // Icons
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconSize?: IconSize;
  
  // Layout
  layout?: 'horizontal' | 'vertical' | 'responsive';
  fullWidth?: boolean;
  
  // Styling
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  
  // Analytics
  trackingId?: string;
}

export function PromotionalButton({
  primaryText,
  secondaryText,
  discountText,
  discountBadge,
  onClick,
  variant = 'primary',
  size = 'lg',
  leftIcon,
  rightIcon,
  iconSize = 'md',
  layout = 'responsive',
  fullWidth = false,
  className,
  disabled = false,
  loading = false,
  trackingId
}: PromotionalButtonProps) {
  
  const handleClick = () => {
    if (disabled || loading) return;
    
    // Analytics tracking
    if (trackingId) {
      console.log(`🎯 Promotional button clicked: ${trackingId}`);
    }
    
    onClick?.();
  };
  
  // Determine layout classes based on screen size and layout prop
  const getLayoutClasses = () => {
    if (layout === 'vertical') {
      return 'flex-col items-center text-center';
    }
    
    if (layout === 'horizontal') {
      return 'flex-row items-center justify-center';
    }
    
    // Responsive layout - stack on mobile, horizontal on desktop
    return 'flex-col sm:flex-row items-center justify-center text-center sm:text-left';
  };
  
  // Get size-specific padding and text sizes
  const getSizeClasses = () => {
    switch (size) {
      case 'xl':
        return {
          container: 'px-8 py-4 min-h-[4rem]',
          primary: 'text-lg sm:text-xl font-bold',
          secondary: 'text-sm sm:text-base',
          spacing: 'gap-3 sm:gap-4'
        };
      case 'lg':
        return {
          container: 'px-6 py-3 min-h-[3.5rem]',
          primary: 'text-base sm:text-lg font-bold',
          secondary: 'text-xs sm:text-sm',
          spacing: 'gap-2 sm:gap-3'
        };
      default:
        return {
          container: 'px-4 py-2 min-h-[3rem]',
          primary: 'text-sm sm:text-base font-semibold',
          secondary: 'text-xs',
          spacing: 'gap-2'
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div className="relative inline-block">
      <Button
        onClick={handleClick}
        variant={variant}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'relative overflow-hidden group transition-all duration-300',
          'hover:scale-105 active:scale-95',
          
          // Size and layout
          sizeClasses.container,
          fullWidth ? 'w-full' : 'w-auto',
          
          // Custom styles
          className
        )}
      >
        <div className={cn(
          'flex relative z-10',
          getLayoutClasses(),
          sizeClasses.spacing
        )}>
          
          {/* Left Icon */}
          {leftIcon && (
            <ProfessionalIcon
              icon={leftIcon}
              size={iconSize}
              variant="functional"
              context={variant === 'outline' ? 'primary' : 'neutral'}
              className="flex-shrink-0"
            />
          )}
          
          {/* Text Content */}
          <div className="flex flex-col min-w-0 flex-1">
            {/* Primary Text */}
            <span className={cn(
              sizeClasses.primary,
              'leading-tight truncate sm:whitespace-normal',
              'font-sora'
            )}>
              {primaryText}
            </span>
            
            {/* Secondary Text */}
            {secondaryText && (
              <span className={cn(
                sizeClasses.secondary,
                'opacity-90 leading-tight',
                'font-inter text-white/90'
              )}>
                {secondaryText}
              </span>
            )}
            
            {/* Discount Text - Mobile only */}
            {discountText && (
              <span className={cn(
                'text-xs font-medium opacity-95 leading-tight',
                'sm:hidden', // Hide on desktop (will be shown in badge)
                'text-current'
              )}>
                {discountText}
              </span>
            )}
          </div>
          
          {/* Right Icon */}
          {rightIcon && (
            <ProfessionalIcon
              icon={rightIcon}
              size={iconSize}
              variant="functional"
              context={variant === 'outline' ? 'primary' : 'neutral'}
              className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
            />
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Button>
      
      {/* Discount Badge - Desktop only */}
      {discountBadge && (
        <Badge className={cn(
          'absolute -top-2 -right-2 z-20',
          'bg-accent text-accent-foreground',
          'text-xs font-bold px-2 py-1 rounded-full',
          'hidden sm:flex', // Only show on desktop
          'animate-pulse'
        )}>
          {discountBadge}
        </Badge>
      )}
    </div>
  );
}

// Import icons at the top level
import { Gift, ArrowRight, Play, Sparkles } from 'lucide-react';

// Specialized promotional button variants
export function GetStartedPromoButton({
  onClick,
  className,
  ...props
}: Partial<PromotionalButtonProps>) {
  return (
    <PromotionalButton
      primaryText="Get 50% Off - Start Building"
      secondaryText="4 months promotional pricing"
      discountBadge="50% OFF"
      discountText="50% OFF for 4 months"
      variant="primary"
      size="lg"
      leftIcon={Gift}
      rightIcon={ArrowRight}
      onClick={onClick}
      trackingId="promo-get-started"
      className={className}
      {...props}
    />
  );
}

export function TryDemoButton({
  onClick,
  className,
  ...props
}: Partial<PromotionalButtonProps>) {
  return (
    <PromotionalButton
      primaryText="Try Interactive Demo"
      secondaryText="No signup required"
      variant="outline"
      size="lg"
      leftIcon={Play}
      rightIcon={Sparkles}
      onClick={onClick}
      trackingId="try-demo"
      className={className}
      {...props}
    />
  );
}

// Mobile-optimized versions
export function MobilePromoButton({
  onClick,
  className,
  ...props
}: Partial<PromotionalButtonProps>) {
  return (
    <PromotionalButton
      primaryText="Get 50% Off"
      secondaryText="Start Building Now"
      discountText="4 months promo pricing"
      variant="primary"
      size="default"
      layout="vertical"
      fullWidth={true}
      leftIcon={Gift}
      onClick={onClick}
      trackingId="mobile-promo-get-started"
      className={cn('sm:hidden', className)}
      {...props}
    />
  );
}

export function MobileDemoButton({
  onClick,
  className,
  ...props
}: Partial<PromotionalButtonProps>) {
  return (
    <PromotionalButton
      primaryText="Try Demo"
      secondaryText="Free Preview"
      variant="outline"
      size="default"
      layout="vertical"
      fullWidth={true}
      leftIcon={Play}
      onClick={onClick}
      trackingId="mobile-try-demo"
      className={cn('sm:hidden', className)}
      {...props}
    />
  );
}