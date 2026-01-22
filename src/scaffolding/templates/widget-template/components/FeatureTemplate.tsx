/**
 * @fileoverview {{FEATURE_NAME}} - FlashFusion Widget Component
 * @version 1.0.0
 * @category {{FEATURE_CATEGORY}}
 * @type widget
 * 
 * A lightweight, reusable widget component optimized for composition
 * and minimal dependencies.
 */

import React, { forwardRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * Widget size variants
 */
export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Widget variant types
 */
export type WidgetVariant = 'default' | 'outline' | 'ghost' | 'filled';

/**
 * Widget component props interface
 */
export interface FeatureWidgetProps {
  /**
   * Widget title
   */
  title?: string;
  
  /**
   * Widget description
   */
  description?: string;
  
  /**
   * Widget icon
   */
  icon?: LucideIcon;
  
  /**
   * Widget size
   */
  size?: WidgetSize;
  
  /**
   * Widget variant
   */
  variant?: WidgetVariant;
  
  /**
   * Badge label (optional)
   */
  badge?: string;
  
  /**
   * Badge variant
   */
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  
  /**
   * Widget content
   */
  children?: React.ReactNode;
  
  /**
   * Header actions (buttons, etc.)
   */
  actions?: React.ReactNode;
  
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Whether widget is loading
   */
  loading?: boolean;
  
  /**
   * Whether widget is disabled
   */
  disabled?: boolean;
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  /**
   * Custom CSS class
   */
  className?: string;
  
  /**
   * Data attributes for testing
   */
  'data-testid'?: string;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Get size-specific classes
 */
const getSizeClasses = (size: WidgetSize): string => {
  const sizeMap: Record<WidgetSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  return sizeMap[size];
};

/**
 * Get variant-specific classes
 */
const getVariantClasses = (variant: WidgetVariant): string => {
  const variantMap: Record<WidgetVariant, string> = {
    default: '',
    outline: 'border-2',
    ghost: 'border-0 shadow-none',
    filled: 'bg-muted'
  };
  return variantMap[variant];
};

/**
 * Loading skeleton for widget
 */
const WidgetSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-3 bg-muted rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded"></div>
      <div className="h-2 bg-muted rounded w-5/6"></div>
    </div>
  </div>
);

/**
 * {{FEATURE_NAME}} Widget Component
 * 
 * A reusable widget for {{FEATURE_DESCRIPTION}}
 * 
 * Features:
 * - Lightweight and composable
 * - Multiple size variants
 * - Customizable styling
 * - Loading states
 * - Accessible
 * - Responsive
 * 
 * @example
 * ```tsx
 * <{{FEATURE_NAME}}Widget
 *   title="Widget Title"
 *   description="Widget description"
 *   icon={Icon}
 *   size="md"
 *   badge="New"
 * >
 *   <p>Widget content</p>
 * </{{FEATURE_NAME}}Widget>
 * ```
 */
export const {{FEATURE_NAME}}Widget = forwardRef<HTMLDivElement, FeatureWidgetProps>(
  (
    {
      title,
      description,
      icon: Icon,
      size = 'md',
      variant = 'default',
      badge,
      badgeVariant = 'secondary',
      children,
      actions,
      footer,
      loading = false,
      disabled = false,
      onClick,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Compute classes
    const cardClasses = useMemo(
      () =>
        cn(
          'transition-all duration-200',
          getSizeClasses(size),
          getVariantClasses(variant),
          onClick && !disabled && 'cursor-pointer hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        ),
      [size, variant, onClick, disabled, className]
    );
    
    // Handle click
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) return;
      onClick?.(event);
    };
    
    return (
      <Card
        ref={ref}
        className={cardClasses}
        onClick={handleClick}
        data-testid={dataTestId}
        aria-label={ariaLabel || title}
        aria-disabled={disabled}
        {...props}
      >
        {/* Header */}
        {(title || description || Icon || badge || actions) && (
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                {/* Title Row */}
                {(title || Icon || badge) && (
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-primary flex-shrink-0" />}
                    {title && <CardTitle className="line-clamp-1">{title}</CardTitle>}
                    {badge && (
                      <Badge variant={badgeVariant} className="ml-auto">
                        {badge}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Description */}
                {description && (
                  <CardDescription className="line-clamp-2">
                    {description}
                  </CardDescription>
                )}
              </div>
              
              {/* Actions */}
              {actions && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </CardHeader>
        )}
        
        {/* Content */}
        <CardContent>
          {loading ? (
            <WidgetSkeleton />
          ) : (
            <div className="space-y-4">
              {children}
            </div>
          )}
        </CardContent>
        
        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </Card>
    );
  }
);

{{FEATURE_NAME}}Widget.displayName = '{{FEATURE_NAME}}Widget';

// Export as default
export default {{FEATURE_NAME}}Widget;

/**
 * Widget Grid Container
 * Helper component for arranging widgets in a responsive grid
 */
export interface WidgetGridProps {
  /**
   * Grid columns configuration
   */
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  /**
   * Gap between widgets
   */
  gap?: number;
  
  /**
   * Child widgets
   */
  children: React.ReactNode;
  
  /**
   * Custom CSS class
   */
  className?: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  children,
  className
}) => {
  const gridClasses = useMemo(() => {
    const colClasses = [
      `grid`,
      `gap-${gap}`,
      cols.default && `grid-cols-${cols.default}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`
    ]
      .filter(Boolean)
      .join(' ');
    
    return cn(colClasses, className);
  }, [cols, gap, className]);
  
  return <div className={gridClasses}>{children}</div>;
};
