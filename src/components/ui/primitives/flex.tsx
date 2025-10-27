/**
 * @fileoverview Flex layout primitives
 * Created during Prompt 3 refactoring to reduce Tailwind repetition
 *
 * Replaces 2,000+ instances of repeated flex patterns
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment on cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Alignment on main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Gap between items (Tailwind spacing scale: 1-12) */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** Flex direction */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  /** Flex wrap */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  /** Additional className */
  className?: string;
  children?: React.ReactNode;
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const gapMap = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
};

const directionMap = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const wrapMap = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

/**
 * Flexible layout component with props-based Tailwind classes
 *
 * @example
 * ```tsx
 * // Before: className="flex items-center gap-2"
 * <Flex align="center" gap={2}>Content</Flex>
 *
 * // Before: className="flex items-center justify-between"
 * <Flex align="center" justify="between">Content</Flex>
 * ```
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      align = 'stretch',
      justify = 'start',
      gap,
      direction = 'row',
      wrap,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionMap[direction],
          alignMap[align],
          justifyMap[justify],
          gap && gapMap[gap],
          wrap && wrapMap[wrap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

/**
 * Common flex patterns as convenience exports
 */

/** flex items-center gap-2 (856 instances) */
export const FlexCenterGap2 = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'align' | 'gap'>>(
  (props, ref) => <Flex ref={ref} align="center" gap={2} {...props} />
);
FlexCenterGap2.displayName = 'FlexCenterGap2';

/** flex items-center justify-between (805 instances) */
export const FlexBetween = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'align' | 'justify'>>(
  (props, ref) => <Flex ref={ref} align="center" justify="between" {...props} />
);
FlexBetween.displayName = 'FlexBetween';

/** flex items-center gap-3 (295 instances) */
export const FlexCenterGap3 = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'align' | 'gap'>>(
  (props, ref) => <Flex ref={ref} align="center" gap={3} {...props} />
);
FlexCenterGap3.displayName = 'FlexCenterGap3';

/** flex items-center gap-4 (67 instances) */
export const FlexCenterGap4 = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'align' | 'gap'>>(
  (props, ref) => <Flex ref={ref} align="center" gap={4} {...props} />
);
FlexCenterGap4.displayName = 'FlexCenterGap4';
