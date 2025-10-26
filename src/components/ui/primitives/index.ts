/**
 * @fileoverview Tailwind primitive components
 * Barrel export for all layout primitives
 *
 * Created during Prompt 3 refactoring
 * Reduces 2,400+ instances of repeated Tailwind patterns
 */

export {
  Flex,
  FlexCenterGap2,
  FlexBetween,
  FlexCenterGap3,
  FlexCenterGap4,
} from './flex';

export {
  Grid,
  GridResponsive2Cols,
  GridResponsive2ColsGap4,
  GridResponsive3Cols,
} from './grid';

export type { FlexProps } from './flex';
export type { GridProps } from './grid';
