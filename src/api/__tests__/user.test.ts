/**
 * Tests for user API validation functions
 */

import { describe, it, expect } from 'vitest';
import { validateProfilePicture, UPLOAD_CONSTRAINTS } from '../user';

describe('User API - File Upload Validation', () => {
  describe('validateProfilePicture', () => {
    it('should accept valid JPEG file under size limit', () => {
      const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid PNG file under size limit', () => {
      const file = new File(['test'], 'profile.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // 2MB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid WebP file under size limit', () => {
      const file = new File(['test'], 'profile.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file exceeding size limit', () => {
      const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File size must be less than');
      expect(result.error).toContain('5MB');
    });

    it('should reject invalid file type (PDF)', () => {
      const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type must be one of');
    });

    it('should reject invalid file type (SVG)', () => {
      const file = new File(['test'], 'icon.svg', { type: 'image/svg+xml' });
      Object.defineProperty(file, 'size', { value: 100 * 1024 }); // 100KB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type must be one of');
    });

    it('should reject invalid file type (text)', () => {
      const file = new File(['test'], 'file.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 }); // 1KB
      
      const result = validateProfilePicture(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type must be one of');
    });

    it('should have correct upload constraints', () => {
      expect(UPLOAD_CONSTRAINTS.MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
      expect(UPLOAD_CONSTRAINTS.ALLOWED_TYPES).toContain('image/jpeg');
      expect(UPLOAD_CONSTRAINTS.ALLOWED_TYPES).toContain('image/png');
      expect(UPLOAD_CONSTRAINTS.ALLOWED_TYPES).toContain('image/gif');
      expect(UPLOAD_CONSTRAINTS.ALLOWED_TYPES).toContain('image/webp');
    });
  });
});
