/**
 * ID Generation Utilities
 * 
 * Provides secure and efficient ID generation functions.
 * Uses crypto.randomUUID() when available for better performance and security.
 */

/**
 * Generate a unique ID using the Web Crypto API when available,
 * falling back to a timestamp + random string combination.
 * 
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateId(prefix?: string): string {
  // Use crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const uuid = crypto.randomUUID();
    return prefix ? `${prefix}_${uuid}` : uuid;
  }
  
  // Fallback for older browsers
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Generate a short random ID (for non-critical uses)
 * 
 * @param length - Length of the random string (default: 8)
 * @returns A random string
 */
export function generateShortId(length: number = 8): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36)).join('').substring(0, length);
  }
  
  // Fallback
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a session ID
 * 
 * @returns A unique session ID
 */
export function generateSessionId(): string {
  return generateId('session');
}

/**
 * Generate a request ID
 * 
 * @returns A unique request ID
 */
export function generateRequestId(): string {
  return generateId('req');
}

/**
 * Generate a user ID
 * 
 * @returns A unique user ID
 */
export function generateUserId(): string {
  return generateId('user');
}
