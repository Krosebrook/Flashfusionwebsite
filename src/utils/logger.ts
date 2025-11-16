/**
 * Development Logger Utility
 * 
 * Provides logging functions that only execute in development mode,
 * preventing unnecessary console output in production.
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

/**
 * Log a message (only in development)
 */
export function log(...args: any[]): void {
  if (isDevelopment) {
    console.log(...args);
  }
}

/**
 * Log a warning (only in development)
 */
export function warn(...args: any[]): void {
  if (isDevelopment) {
    console.warn(...args);
  }
}

/**
 * Log an error (always logged, even in production)
 */
export function error(...args: any[]): void {
  console.error(...args);
}

/**
 * Log debug information (only in development)
 */
export function debug(...args: any[]): void {
  if (isDevelopment) {
    console.debug(...args);
  }
}

/**
 * Log info (only in development)
 */
export function info(...args: any[]): void {
  if (isDevelopment) {
    console.info(...args);
  }
}

/**
 * Create a time measurement
 */
export function time(label: string): void {
  if (isDevelopment) {
    console.time(label);
  }
}

/**
 * End a time measurement
 */
export function timeEnd(label: string): void {
  if (isDevelopment) {
    console.timeEnd(label);
  }
}

/**
 * Group console logs
 */
export function group(label: string): void {
  if (isDevelopment) {
    console.group(label);
  }
}

/**
 * End a console group
 */
export function groupEnd(): void {
  if (isDevelopment) {
    console.groupEnd();
  }
}

/**
 * Table logging
 */
export function table(data: any): void {
  if (isDevelopment) {
    console.table(data);
  }
}

export default {
  log,
  warn,
  error,
  debug,
  info,
  time,
  timeEnd,
  group,
  groupEnd,
  table,
  isDevelopment
};
