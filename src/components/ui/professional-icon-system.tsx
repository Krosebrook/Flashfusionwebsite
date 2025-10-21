/**
 * @fileoverview Professional Icon System for FlashFusion
 * @chunk ui-system
 * @category design-system
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Professional icon system that follows design best practices:
 * - Consistent sizing and spacing
 * - Semantic usage patterns
 * - Accessibility compliance
 * - FlashFusion brand alignment
 * - Performance optimized
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

// Professional icon size scale following 4px grid system
export const ICON_SIZES = {
  xs: 12,    // Micro icons (badges, inline text)
  sm: 16,    // Small icons (buttons, form elements)  
  md: 20,    // Medium icons (navigation, cards)
  lg: 24,    // Large icons (section headers, primary actions)
  xl: 32,    // Extra large icons (feature highlights)
  '2xl': 40, // Hero icons (major sections)
  '3xl': 48  // Display icons (empty states, illustrations)
} as const;

export type IconSize = keyof typeof ICON_SIZES;

// Professional icon usage patterns
export type IconVariant = 
  | 'functional'    // Interactive elements (buttons, links)
  | 'informational' // Status indicators, metrics
  | 'decorative'    // Visual enhancement
  | 'navigational'  // Menu items, breadcrumbs
  | 'semantic';     // Content meaning (success, error, warning)

// Icon context for semantic meaning
export type IconContext = 
  | 'primary'   // Brand primary color
  | 'secondary' // Brand secondary color  
  | 'accent'    // Brand accent color
  | 'success'   // Success states
  | 'warning'   // Warning states
  | 'error'     // Error states
  | 'neutral'   // Default/neutral
  | 'muted';    // Subdued/secondary content

interface ProfessionalIconProps {
  icon: LucideIcon;
  size?: IconSize;
  variant?: IconVariant;
  context?: IconContext;
  className?: string;
  label?: string; // For accessibility
  decorative?: boolean; // If true, hidden from screen readers
  onClick?: () => void;
}

/**
 * Professional Icon Component
 * 
 * Renders icons following FlashFusion design system standards
 */
export const ProfessionalIcon: React.FC<ProfessionalIconProps> = ({
  icon: Icon,
  size = 'md',
  variant = 'functional',
  context = 'neutral',
  className,
  label,
  decorative = false,
  onClick,
  ...props
}) => {
  const iconSize = ICON_SIZES[size];
  
  // Generate professional styling classes
  const iconClasses = cn(
    // Base styles
    'flex-shrink-0 transition-colors duration-200',
    
    // Size-specific alignment
    {
      'inline-block align-text-bottom': size === 'xs' || size === 'sm',
      'inline-flex items-center': size === 'md' || size === 'lg',
      'block': size === 'xl' || size === '2xl' || size === '3xl'
    },
    
    // Context-based colors
    {
      'text-primary': context === 'primary',
      'text-secondary': context === 'secondary', 
      'text-accent': context === 'accent',
      'text-success': context === 'success',
      'text-warning': context === 'warning',
      'text-error': context === 'error',
      'text-foreground': context === 'neutral',
      'text-muted-foreground': context === 'muted'
    },
    
    // Interactive states for functional icons
    {
      'hover:opacity-80 cursor-pointer': variant === 'functional' && onClick,
      'hover:text-primary': variant === 'navigational' && !onClick
    },
    
    // Variant-specific styles
    {
      'font-medium': variant === 'functional',
      'opacity-90': variant === 'informational',
      'opacity-70': variant === 'decorative',
      'font-semibold': variant === 'semantic'
    },
    
    className
  );
  
  return (
    <Icon
      size={iconSize}
      className={iconClasses}
      onClick={onClick}
      aria-label={!decorative ? label : undefined}
      aria-hidden={decorative}
      role={onClick ? 'button' : decorative ? 'presentation' : 'img'}
      {...props}
    />
  );
};

// Professional icon-text combinations
interface IconTextProps {
  icon: LucideIcon;
  children: React.ReactNode;
  iconSize?: IconSize;
  iconContext?: IconContext;
  variant?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const IconText: React.FC<IconTextProps> = ({
  icon,
  children,
  iconSize = 'sm',
  iconContext = 'neutral',
  variant = 'horizontal',
  alignment = 'center',
  spacing = 'normal',
  className
}) => {
  const containerClasses = cn(
    'flex',
    {
      // Layout variants
      'flex-row': variant === 'horizontal',
      'flex-col': variant === 'vertical',
      
      // Alignment
      'items-start': alignment === 'start',
      'items-center': alignment === 'center', 
      'items-end': alignment === 'end',
      'justify-center': variant === 'vertical',
      
      // Spacing
      'gap-1': spacing === 'tight',
      'gap-2': spacing === 'normal', 
      'gap-3': spacing === 'loose'
    },
    className
  );
  
  return (
    <div className={containerClasses}>
      <ProfessionalIcon 
        icon={icon}
        size={iconSize}
        context={iconContext}
        variant="functional"
        decorative={false}
      />
      <span className="flex-1">{children}</span>
    </div>
  );
};

// Status icon with semantic meaning
interface StatusIconProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: IconSize;
  showBackground?: boolean;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'sm',
  showBackground = false,
  className
}) => {
  // Map status to appropriate icons
  const statusConfig = {
    success: { 
      icon: 'CheckCircle2' as const,
      context: 'success' as const,
      bgClass: 'bg-success/10'
    },
    warning: { 
      icon: 'AlertTriangle' as const,
      context: 'warning' as const,
      bgClass: 'bg-warning/10'
    },
    error: { 
      icon: 'XCircle' as const,
      context: 'error' as const,
      bgClass: 'bg-error/10'
    },
    info: { 
      icon: 'Info' as const,
      context: 'secondary' as const,
      bgClass: 'bg-secondary/10'
    },
    neutral: { 
      icon: 'Circle' as const,
      context: 'muted' as const,
      bgClass: 'bg-muted/10'
    }
  };
  
  const config = statusConfig[status];
  const iconSize = ICON_SIZES[size];
  
  // Import the specific icon dynamically
  const getIcon = async () => {
    const iconModule = await import('lucide-react');
    return iconModule[config.icon] as LucideIcon;
  };
  
  const [Icon, setIcon] = React.useState<LucideIcon | null>(null);
  
  React.useEffect(() => {
    getIcon().then(setIcon);
  }, [config.icon]);
  
  if (!Icon) return null;
  
  const containerClasses = cn(
    'inline-flex items-center justify-center',
    {
      'rounded-full p-1': showBackground,
      [config.bgClass]: showBackground
    },
    className
  );
  
  return (
    <div className={containerClasses}>
      <ProfessionalIcon
        icon={Icon}
        size={size}
        context={config.context}
        variant="semantic"
        label={`${status} status`}
      />
    </div>
  );
};

// Navigation icon with active states
interface NavigationIconProps {
  icon: LucideIcon;
  isActive?: boolean;
  size?: IconSize;
  className?: string;
}

export const NavigationIcon: React.FC<NavigationIconProps> = ({
  icon,
  isActive = false,
  size = 'md',
  className
}) => {
  return (
    <ProfessionalIcon
      icon={icon}
      size={size}
      context={isActive ? 'primary' : 'muted'}
      variant="navigational"
      className={cn(
        'transition-all duration-200',
        {
          'text-primary font-semibold': isActive,
          'hover:text-foreground': !isActive
        },
        className
      )}
    />
  );
};

// Metric icon for dashboard displays
interface MetricIconProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  size?: IconSize;
  className?: string;
}

export const MetricIcon: React.FC<MetricIconProps> = ({
  icon,
  value,
  label,
  trend = 'neutral',
  size = 'lg',
  className
}) => {
  const trendConfig = {
    up: { context: 'success' as const, indicator: '↗' },
    down: { context: 'error' as const, indicator: '↘' },
    neutral: { context: 'neutral' as const, indicator: '→' }
  };
  
  const config = trendConfig[trend];
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="ff-glass rounded-lg p-3">
        <ProfessionalIcon
          icon={icon}
          size={size}
          context={config.context}
          variant="informational"
          label={`${label} metric`}
        />
      </div>
      <div className="flex-1">
        <div className="ff-text-title text-2xl font-sora">{value}</div>
        <div className="ff-text-caption text-muted-foreground flex items-center gap-1">
          <span>{label}</span>
          <span className={`text-${config.context}`}>{config.indicator}</span>
        </div>
      </div>
    </div>
  );
};

// Action icon for buttons and interactive elements
interface ActionIconProps {
  icon: LucideIcon;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: IconSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const ActionIcon: React.FC<ActionIconProps> = ({
  icon,
  children,
  variant = 'primary',
  size = 'sm',
  onClick,
  disabled = false,
  loading = false,
  className
}) => {
  const buttonClasses = cn(
    'ff-btn ff-interactive',
    {
      'ff-btn-primary': variant === 'primary',
      'ff-btn-secondary': variant === 'secondary',
      'ff-btn-ghost': variant === 'ghost',
      'ff-btn-outline': variant === 'outline'
    },
    {
      'opacity-50 cursor-not-allowed': disabled,
      'animate-pulse': loading
    },
    className
  );
  
  const iconContext: IconContext = variant === 'ghost' ? 'muted' : 'neutral';
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
    >
      <ProfessionalIcon
        icon={icon}
        size={size}
        context={iconContext}
        variant="functional"
        decorative={!!children}
      />
      {children && <span className="ml-2">{children}</span>}
    </button>
  );
};

// Export all icon utilities
export {
  ICON_SIZES,
  type IconSize,
  type IconVariant,
  type IconContext
};

// Common icon sets for consistent usage
export const COMMON_ICONS = {
  // Navigation
  home: 'Home',
  dashboard: 'LayoutDashboard', 
  settings: 'Settings',
  profile: 'User',
  
  // Actions
  create: 'Plus',
  edit: 'Edit',
  delete: 'Trash2',
  save: 'Save',
  download: 'Download',
  upload: 'Upload',
  
  // Status
  success: 'CheckCircle2',
  warning: 'AlertTriangle', 
  error: 'XCircle',
  info: 'Info',
  
  // Content
  file: 'File',
  folder: 'Folder',
  image: 'Image',
  video: 'Video',
  
  // Business
  analytics: 'BarChart3',
  revenue: 'DollarSign',
  growth: 'TrendingUp',
  security: 'Shield'
} as const;