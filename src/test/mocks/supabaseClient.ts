/**
 * Supabase client mock shared across unit tests.
 */
import { vi } from 'vitest';
import { createAuthenticatedSession, getUnauthenticatedSession } from './auth';

export interface SupabaseAuthMock {
  getSession: ReturnType<typeof vi.fn>;
  onAuthStateChange: ReturnType<typeof vi.fn>;
  signInWithPassword: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
  resetPasswordForEmail: ReturnType<typeof vi.fn>;
  resend: ReturnType<typeof vi.fn>;
}

export interface SupabaseClientMock {
  auth: SupabaseAuthMock;
  from: ReturnType<typeof vi.fn>;
  rpc: ReturnType<typeof vi.fn>;
  channel: ReturnType<typeof vi.fn>;
}

const createQueryBuilderMock = () => {
  const builder: Record<string, ReturnType<typeof vi.fn>> & {
    single: ReturnType<typeof vi.fn>;
  } = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return builder;
};

const createAuthMock = (): SupabaseAuthMock => ({
  getSession: vi.fn().mockResolvedValue(getUnauthenticatedSession()),
  onAuthStateChange: vi.fn().mockImplementation((callback?: Function) => {
    const subscription = { unsubscribe: vi.fn() };
    if (callback) {
      callback('SIGNED_OUT', { session: null });
    }
    return { data: { subscription } };
  }),
  signInWithPassword: vi.fn().mockResolvedValue({ data: createAuthenticatedSession().data, error: null }),
  signUp: vi.fn().mockResolvedValue({ data: createAuthenticatedSession().data, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
  resend: vi.fn().mockResolvedValue({ data: {}, error: null }),
});

const createSupabaseClientMock = (): SupabaseClientMock => ({
  auth: createAuthMock(),
  from: vi.fn(() => createQueryBuilderMock()),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    })),
  })),
});

export const supabaseClientMock: SupabaseClientMock = createSupabaseClientMock();

export const resetSupabaseClientMock = () => {
  const fresh = createSupabaseClientMock();

  supabaseClientMock.auth = fresh.auth;
  supabaseClientMock.from = fresh.from;
  supabaseClientMock.rpc = fresh.rpc;
  supabaseClientMock.channel = fresh.channel;
};
