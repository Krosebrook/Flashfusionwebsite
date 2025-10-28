/**
 * DISABLED PERFORMANCE BUDGET - CRISIS MODE
 * 
 * This file has been disabled to reduce memory usage during crisis mode.
 * All functions return safe defaults to prevent errors.
 */

// Safe stub implementations
export const performanceBudget = {
  onBudgetViolation: () => () => {},
  destroy: () => {},
  initialize: () => {}
};

export const budgetUtils = {
  enforceBudget: () => {},
  getCurrentStatus: () => 'normal' as const
};

export default performanceBudget;