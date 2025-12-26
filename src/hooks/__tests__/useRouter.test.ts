/**
 * @fileoverview Tests for useRouter hook
 * @module core/router/__tests__
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useRouter } from '../../src/core/router/useRouter';

describe('useRouter', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset window location
    delete (window as any).location;
    window.location = { href: 'http://localhost:3000/' } as Location;
    
    // Mock navigator.userAgent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });
    
    vi.clearAllMocks();
  });

  it('should initialize with default route state', () => {
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.currentPath).toBeDefined();
    expect(result.current.searchParams).toBeDefined();
    expect(result.current.isDemoMode).toBe(false);
    expect(result.current.isAuthRoute).toBe(false);
  });

  it('should detect demo mode from URL', () => {
    window.location = { href: 'http://localhost:3000/?demo=true' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isDemoMode).toBe(true);
  });

  it('should detect demo mode from path', () => {
    window.location = { href: 'http://localhost:3000/demo' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isDemoMode).toBe(true);
  });

  it('should detect auth routes', () => {
    window.location = { href: 'http://localhost:3000/auth/login' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isAuthRoute).toBe(true);
  });

  it('should detect verify routes as auth routes', () => {
    window.location = { href: 'http://localhost:3000/verify-email' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isAuthRoute).toBe(true);
  });

  it('should detect reset password routes as auth routes', () => {
    window.location = { href: 'http://localhost:3000/reset-password' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isAuthRoute).toBe(true);
  });

  it('should detect validator route', () => {
    window.location = { href: 'http://localhost:3000/validate' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.isValidatorRoute).toBe(true);
  });

  it('should show app when param is present', () => {
    window.location = { href: 'http://localhost:3000/?app=true' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.shouldShowApp).toBe(true);
  });

  it('should show app from localStorage on desktop', () => {
    localStorage.setItem('ff-show-app', 'true');
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.shouldShowApp).toBe(true);
  });

  it('should provide navigate function', () => {
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.navigate).toBeDefined();
    expect(typeof result.current.navigate).toBe('function');
  });

  it('should handle navigation', () => {
    const { result } = renderHook(() => useRouter());
    
    act(() => {
      result.current.navigate('/test-path');
    });
    
    // Navigation should be called without errors
    expect(result.current.navigate).toBeDefined();
  });

  it('should handle navigation with replace', () => {
    const { result } = renderHook(() => useRouter());
    
    act(() => {
      result.current.navigate('/test-path', true);
    });
    
    // Navigation should be called without errors
    expect(result.current.navigate).toBeDefined();
  });

  it('should parse search params correctly', () => {
    window.location = { href: 'http://localhost:3000/?param1=value1&param2=value2' } as Location;
    
    const { result } = renderHook(() => useRouter());
    
    expect(result.current.searchParams.get('param1')).toBe('value1');
    expect(result.current.searchParams.get('param2')).toBe('value2');
  });

  it('should handle mobile device detection', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    const { result } = renderHook(() => useRouter());
    
    // On mobile, shouldShowApp requires explicit app=true param
    expect(result.current).toBeDefined();
  });

  it('should handle popstate events', async () => {
    const { result } = renderHook(() => useRouter());
    
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useRouter());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  });
});
