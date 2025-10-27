/**
 * @fileoverview Grid layout primitives
 * Created during Prompt 3 refactoring to reduce Tailwind repetition
 *
 * Replaces 400+ instances of repeated grid patterns
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (1-12) */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** Responsive columns for md breakpoint */
  mdCols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Responsive columns for lg breakpoint */
  lgCols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap between items (Tailwind spacing scale) */
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  /** Additional className */
  className?: string;
  children?: React.ReactNode;
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const mdColsMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const lgColsMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const gapMap = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

/**
 * Responsive grid layout component
 *
 * @example
 * ```tsx
 * // Before: className="grid grid-cols-1 md:grid-cols-2 gap-6"
 * <Grid cols={1} mdCols={2} gap={6}>Content</Grid>
 *
 * // Before: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
 * <Grid cols={1} mdCols={2} lgCols={3} gap={4}>Content</Grid>
 * ```
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, mdCols, lgCols, gap = 4, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsMap[cols],
          mdCols && mdColsMap[mdCols],
          lgCols && lgColsMap[lgCols],
          gapMap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

/**
 * Common grid patterns as convenience exports
 */

/** grid grid-cols-1 md:grid-cols-2 gap-6 (65 instances) */
export const GridResponsive2Cols = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'cols' | 'mdCols' | 'gap'>
>((props, ref) => <Grid ref={ref} cols={1} mdCols={2} gap={6} {...props} />);
GridResponsive2Cols.displayName = 'GridResponsive2Cols';

/** grid grid-cols-1 md:grid-cols-2 gap-4 (63 instances) */
export const GridResponsive2ColsGap4 = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'cols' | 'mdCols' | 'gap'>
>((props, ref) => <Grid ref={ref} cols={1} mdCols={2} gap={4} {...props} />);
GridResponsive2ColsGap4.displayName = 'GridResponsive2ColsGap4';

/** grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 (26 instances) */
export const GridResponsive3Cols = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'cols' | 'mdCols' | 'lgCols' | 'gap'>
>((props, ref) => <Grid ref={ref} cols={1} mdCols={2} lgCols={3} gap={6} {...props} />);
GridResponsive3Cols.displayName = 'GridResponsive3Cols';
