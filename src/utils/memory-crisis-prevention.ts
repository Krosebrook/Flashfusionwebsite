/**
 * DISABLED MEMORY CRISIS PREVENTION - CRISIS MODE
 * 
 * This file has been disabled to reduce memory usage during crisis mode.
 * All functions return safe defaults to prevent errors.
 */

// Safe stub implementations
export const memoryCrisisPrevention = {
  onCrisis: () => () => {},
  destroy: () => {},
  initialize: () => {}
};

export const crisisUtils = {
  getCurrentLevel: () => 'normal' as const
};

export default memoryCrisisPrevention;