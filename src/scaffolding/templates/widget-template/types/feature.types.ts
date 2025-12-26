/**
 * @fileoverview Type definitions for {{FEATURE_NAME}} Widget
 * @version 1.0.0
 * @type widget
 * 
 * Lightweight TypeScript types optimized for reusable widget components:
 * - Props and configuration types
 * - Minimal dependencies
 * - Composition-friendly types
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Widget size variants
 */
export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Widget visual variants
 */
export type WidgetVariant = 'default' | 'outline' | 'ghost' | 'filled';

/**
 * Badge variants
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Widget data interface
 * Generic data structure for widget content
 */
export interface WidgetData<T = unknown> {
  /**
   * Data value
   */
  value: T;
  
  /**
   * Data label
   */
  label?: string;
  
  /**
   * Optional icon
   */
  icon?: LucideIcon;
  
  /**
   * Format string (for numbers, dates, etc.)
   */
  format?: string;
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Widget stat configuration
 * For displaying statistics or metrics
 */
export interface WidgetStat {
  /**
   * Stat label
   */
  label: string;
  
  /**
   * Stat value
   */
  value: string | number;
  
  /**
   * Change indicator (e.g., +5%, -2%)
   */
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  
  /**
   * Icon for the stat
   */
  icon?: LucideIcon;
  
  /**
   * Trend data for sparkline (optional)
   */
  trend?: number[];
}

/**
 * Widget action configuration
 * For buttons or links in widget header
 */
export interface WidgetAction {
  /**
   * Action label
   */
  label: string;
  
  /**
   * Action icon
   */
  icon?: LucideIcon;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Action href (for links)
   */
  href?: string;
  
  /**
   * Whether action is disabled
   */
  disabled?: boolean;
  
  /**
   * Action variant
   */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Widget configuration options
 */
export interface WidgetConfig {
  /**
   * Auto-refresh interval (ms)
   */
  refreshInterval?: number;
  
  /**
   * Enable animations
   */
  animated?: boolean;
  
  /**
   * Collapsible widget
   */
  collapsible?: boolean;
  
  /**
   * Initially collapsed
   */
  defaultCollapsed?: boolean;
  
  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;
  
  /**
   * Maximum height (for scrolling)
   */
  maxHeight?: string;
}

/**
 * Widget list item
 * For displaying lists of items
 */
export interface WidgetListItem {
  /**
   * Item ID
   */
  id: string;
  
  /**
   * Item label/title
   */
  label: string;
  
  /**
   * Item description
   */
  description?: string;
  
  /**
   * Item icon
   */
  icon?: LucideIcon;
  
  /**
   * Item value (right side)
   */
  value?: string | number;
  
  /**
   * Badge label
   */
  badge?: string;
  
  /**
   * Badge variant
   */
  badgeVariant?: BadgeVariant;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Whether item is active
   */
  active?: boolean;
  
  /**
   * Whether item is disabled
   */
  disabled?: boolean;
}

/**
 * Widget chart data point
 * For simple chart widgets
 */
export interface WidgetChartData {
  /**
   * X-axis label
   */
  label: string;
  
  /**
   * Y-axis value
   */
  value: number;
  
  /**
   * Data color
   */
  color?: string;
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Widget state
 * For stateful widgets
 */
export type WidgetState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Widget theme configuration
 */
export interface WidgetTheme {
  /**
   * Primary color
   */
  primary?: string;
  
  /**
   * Secondary color
   */
  secondary?: string;
  
  /**
   * Background color
   */
  background?: string;
  
  /**
   * Text color
   */
  text?: string;
  
  /**
   * Border color
   */
  border?: string;
  
  /**
   * Border radius
   */
  radius?: string;
}

/**
 * Widget layout options
 */
export interface WidgetLayout {
  /**
   * Widget width
   */
  width?: 'full' | 'auto' | string;
  
  /**
   * Widget height
   */
  height?: 'auto' | string;
  
  /**
   * Widget padding
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Content alignment
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Content justification
   */
  justify?: 'start' | 'center' | 'end' | 'between';
}

/**
 * Responsive grid configuration
 */
export interface GridConfig {
  /**
   * Default columns (mobile)
   */
  default?: number;
  
  /**
   * Small screens
   */
  sm?: number;
  
  /**
   * Medium screens
   */
  md?: number;
  
  /**
   * Large screens
   */
  lg?: number;
  
  /**
   * Extra large screens
   */
  xl?: number;
}

/**
 * Widget event handlers
 */
export interface WidgetEventHandlers {
  /**
   * Widget mounted
   */
  onMount?: () => void;
  
  /**
   * Widget unmounted
   */
  onUnmount?: () => void;
  
  /**
   * Widget clicked
   */
  onClick?: (event: React.MouseEvent) => void;
  
  /**
   * Widget hovered
   */
  onHover?: (event: React.MouseEvent) => void;
  
  /**
   * Widget focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  
  /**
   * Widget blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
}

/**
 * Widget accessibility props
 */
export interface WidgetAccessibility {
  /**
   * ARIA label
   */
  'aria-label'?: string;
  
  /**
   * ARIA described by
   */
  'aria-describedby'?: string;
  
  /**
   * ARIA live region
   */
  'aria-live'?: 'off' | 'polite' | 'assertive';
  
  /**
   * Tab index
   */
  tabIndex?: number;
  
  /**
   * Role
   */
  role?: string;
}

/**
 * Widget animation configuration
 */
export interface WidgetAnimation {
  /**
   * Animation type
   */
  type?: 'fade' | 'slide' | 'scale' | 'none';
  
  /**
   * Animation duration (ms)
   */
  duration?: number;
  
  /**
   * Animation delay (ms)
   */
  delay?: number;
  
  /**
   * Animation easing
   */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Widget skeleton configuration
 */
export interface WidgetSkeleton {
  /**
   * Number of skeleton lines
   */
  lines?: number;
  
  /**
   * Skeleton height
   */
  height?: string;
  
  /**
   * Enable animation
   */
  animated?: boolean;
}

/**
 * Widget error state
 */
export interface WidgetError {
  /**
   * Error message
   */
  message: string;
  
  /**
   * Error code
   */
  code?: string;
  
  /**
   * Whether error is recoverable
   */
  recoverable?: boolean;
  
  /**
   * Retry action
   */
  onRetry?: () => void;
}

/**
 * Widget metadata
 */
export interface WidgetMetadata {
  /**
   * Widget ID
   */
  id?: string;
  
  /**
   * Widget version
   */
  version?: string;
  
  /**
   * Widget author
   */
  author?: string;
  
  /**
   * Widget tags
   */
  tags?: string[];
  
  /**
   * Widget category
   */
  category?: string;
  
  /**
   * Last updated timestamp
   */
  updatedAt?: Date;
}
