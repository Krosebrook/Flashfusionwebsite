/**
 * @fileoverview Tests for useAuthentication hook
 * @module hooks/__tests__
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthentication } from '../useAuthentication';

describe('useAuthentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Clear console mocks
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuthentication());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should complete initialization', async () => {
    const { result } = renderHook(() => useAuthentication());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });
  });

  it('should restore user from localStorage', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      subscription: 'free' as const,
    };

    localStorage.setItem('ff-auth-token', 'mock-token');
    localStorage.setItem('ff-remember-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    await act(async () => {
      const loginResult = await result.current.login(testEmail, testPassword);
      expect(loginResult).toBeDefined();
    });
  });

  it('should handle login errors gracefully', async () => {
    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      try {
        await result.current.login('', '');
      } catch (error) {
        // Expected to fail with invalid credentials
      }
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should handle logout', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      subscription: 'free' as const,
    };

    localStorage.setItem('ff-auth-token', 'mock-token');
    localStorage.setItem('ff-remember-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('ff-auth-token')).toBeNull();
      expect(localStorage.getItem('ff-remember-user')).toBeNull();
    });
  });

  it('should handle invalid stored user data', async () => {
    localStorage.setItem('ff-auth-token', 'mock-token');
    localStorage.setItem('ff-remember-user', 'invalid-json');

    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('ff-auth-token')).toBeNull();
      expect(localStorage.getItem('ff-remember-user')).toBeNull();
    });
  });

  it('should provide signup functionality', async () => {
    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.signup).toBeDefined();
    expect(typeof result.current.signup).toBe('function');
  });

  it('should handle token refresh', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
      subscription: 'free' as const,
    };

    localStorage.setItem('ff-auth-token', 'mock-token');
    localStorage.setItem('ff-remember-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Simulate token refresh
    act(() => {
      localStorage.setItem('ff-auth-token', 'new-mock-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should maintain user role correctly', async () => {
    const adminUser = {
      id: '456',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin' as const,
      subscription: 'enterprise' as const,
    };

    localStorage.setItem('ff-auth-token', 'admin-token');
    localStorage.setItem('ff-remember-user', JSON.stringify(adminUser));

    const { result } = renderHook(() => useAuthentication());

    await waitFor(() => {
      expect(result.current.user?.role).toBe('admin');
      expect(result.current.user?.subscription).toBe('enterprise');
    });
  });
});
