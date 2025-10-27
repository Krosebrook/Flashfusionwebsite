import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Performance utilities
export * from './performance';

// File utilities
// Note: File generators have been moved to src/utils/generators/
// Import directly from 'src/utils/generators' if needed

// Creator utilities
export * from './creator-content-pipeline';

// Multi-format download
export * from './multi-format-download';

// Environment utilities
export * from './environment';
