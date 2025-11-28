/**
 * Common formatting utility functions used across the application
 */

/**
 * Format bytes to human-readable file size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const BYTES_PER_UNIT = 1024;
  const SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT));
  
  return parseFloat((bytes / Math.pow(BYTES_PER_UNIT, unitIndex)).toFixed(decimals)) + ' ' + SIZE_UNITS[unitIndex];
};

/**
 * Format a date to relative time ago string
 * @param date - Date to format
 * @returns Formatted string (e.g., "5m ago", "2h ago", "3d ago")
 */
export const formatTimeAgo = (date: Date): string => {
  const currentTime = new Date();
  const timeDifferenceMs = currentTime.getTime() - date.getTime();
  
  const MILLISECONDS_PER_MINUTE = 1000 * 60;
  const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
  const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
  
  const minutesElapsed = Math.floor(timeDifferenceMs / MILLISECONDS_PER_MINUTE);
  const hoursElapsed = Math.floor(timeDifferenceMs / MILLISECONDS_PER_HOUR);
  const daysElapsed = Math.floor(timeDifferenceMs / MILLISECONDS_PER_DAY);
  
  if (minutesElapsed < 1) return 'Just now';
  if (minutesElapsed < 60) return `${minutesElapsed}m ago`;
  if (hoursElapsed < 24) return `${hoursElapsed}h ago`;
  return `${daysElapsed}d ago`;
};
