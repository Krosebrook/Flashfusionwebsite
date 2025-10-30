/**
 * Shared auth-related test fixtures and helpers.
 */
export interface MockAuthUser {
  id: string;
  email: string;
  username?: string;
  user_metadata?: Record<string, unknown>;
  role?: string;
  stats?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MockSessionResult {
  data: { session: Record<string, unknown> | null };
  error: { message: string } | null;
}

const unauthenticatedSession: MockSessionResult = {
  data: { session: null },
  error: null,
};

export const createMockAuthUser = (
  overrides: Partial<MockAuthUser> = {},
): MockAuthUser => ({
  id: 'user_123',
  email: 'user@example.com',
  username: 'user',
  user_metadata: { name: 'Test User' },
  role: 'free',
  stats: {
    level: 1,
    xp: 0,
    total_xp: 0,
    current_streak: 0,
  },
  ...overrides,
});

export const createAuthenticatedSession = (
  sessionOverrides: Record<string, unknown> = {},
): MockSessionResult => ({
  data: {
    session: {
      user: createMockAuthUser(),
      ...sessionOverrides,
    },
  },
  error: null,
});

export const getUnauthenticatedSession = (): MockSessionResult => ({
  ...unauthenticatedSession,
});
