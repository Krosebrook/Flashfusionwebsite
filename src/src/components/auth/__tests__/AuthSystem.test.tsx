import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, AuthButton, useAuth } from '@/components/auth/AuthSystem';

function TestComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
    </div>
  );
}

describe('AuthSystem', () => {
  it('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });

  it('renders AuthButton component', () => {
    render(
      <AuthProvider>
        <AuthButton />
      </AuthProvider>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
