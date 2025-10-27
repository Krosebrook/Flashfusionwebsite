/**
 * Test file generators (frontend tests, backend tests, auth tests, etc.)
 */

import type { GeneratedApp } from './types';

/**
 * Generate frontend test files
 */
export function generateFrontendTests(app: GeneratedApp): string {
  return `import { render, screen } from '@testing-library/react';
import App from '../App';

describe('${app.name} Frontend', () => {
  test('renders main application', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('displays application title', () => {
    render(<App />);
    expect(screen.getByText('${app.name}')).toBeInTheDocument();
  });
});`;
}

/**
 * Generate backend test files
 */
export function generateBackendTests(app: GeneratedApp): string {
  return `import request from 'supertest';
import app from '../app';

describe('${app.name} Backend API', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
  });

  test('GET /api/users requires authentication', async () => {
    await request(app)
      .get('/api/users')
      .expect(401);
  });
});`;
}

/**
 * Generate authentication test files
 */
export function generateAuthTests(_app: GeneratedApp): string {
  return `import request from 'supertest';
import app from '../app';

describe('Authentication', () => {
  test('POST /api/auth/login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test('POST /api/auth/login with invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
  });
});`;
}
