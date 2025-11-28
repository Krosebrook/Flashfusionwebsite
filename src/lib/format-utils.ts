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
  
  const bytesPerUnit = 1024;
  const sizeUnits = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(bytesPerUnit));
  
  return parseFloat((bytes / Math.pow(bytesPerUnit, unitIndex)).toFixed(decimals)) + ' ' + sizeUnits[unitIndex];
};

/**
 * Format a date to relative time ago string
 * @param date - Date to format
 * @returns Formatted string (e.g., "5m ago", "2h ago", "3d ago")
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const timeDifferenceMs = now.getTime() - date.getTime();
  
  const minutesElapsed = Math.floor(timeDifferenceMs / (1000 * 60));
  const hoursElapsed = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  const daysElapsed = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  
  if (minutesElapsed < 1) return 'Just now';
  if (minutesElapsed < 60) return `${minutesElapsed}m ago`;
  if (hoursElapsed < 24) return `${hoursElapsed}h ago`;
  return `${daysElapsed}d ago`;
};
