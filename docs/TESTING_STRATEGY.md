# Testing Strategy

**Last Updated:** January 8, 2026  
**Coverage Target:** 70% (Current: ~15%)  
**Status:** In Progress

## Overview

This document outlines the comprehensive testing strategy for the FlashFusion project.

## Test Infrastructure

### Framework
- **Vitest**: Fast unit testing framework with Vite integration
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM testing

### Configuration
- Location: `vite.config.ts` (test section)
- Setup file: `src/test/setup.ts`
- Coverage: v8 provider with text, JSON, and HTML reports

## Test Categories

### 1. Unit Tests
Test individual functions, hooks, and utilities in isolation.

**Location**: Adjacent to source files in `__tests__` directories

**Examples**:
- `src/hooks/__tests__/useAuthentication.test.ts`
- `src/hooks/__tests__/useRouter.test.ts`
- `src/components/__tests__/ErrorBoundary.test.tsx`

**Coverage Target**: 80% for utilities and hooks

### 2. Component Tests
Test React components with user interactions and state changes.

**Location**: `src/components/__tests__/`

**What to Test**:
- Rendering with different props
- User interactions (clicks, inputs)
- State changes and side effects
- Error boundaries and loading states
- Accessibility (ARIA attributes, keyboard navigation)

**Coverage Target**: 70% for UI components

### 3. Integration Tests
Test interactions between multiple components or systems.

**Location**: `src/features/__tests__/`

**What to Test**:
- Feature workflows
- API integration
- State management across components
- Navigation flows
- Authentication flows

**Coverage Target**: 60% for integrated features

### 4. E2E Tests (Planned)
Test complete user journeys through the application.

**Framework**: Playwright (already configured)

**What to Test**:
- Critical user paths
- Authentication flows
- Payment flows
- Cross-browser compatibility

**Coverage Target**: Critical paths only

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- useAuthentication.test.ts

# Run tests matching pattern
npm test -- --grep "authentication"
```

### Coverage Reports

After running `npm run test:coverage`, view reports:
- **Terminal**: Summary in console
- **HTML**: Open `coverage/index.html` in browser
- **JSON**: `coverage/coverage-final.json` for CI/CD

## Writing Tests

### Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentToTest } from '../ComponentToTest';

describe('ComponentToTest', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<ComponentToTest />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const onClickMock = vi.fn();
    render(<ComponentToTest onClick={onClickMock} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(onClickMock).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Test behavior, not implementation**: Focus on user-facing functionality
3. **Use Testing Library queries**: Prefer `getByRole`, `getByLabelText`
4. **Mock external dependencies**: Use `vi.mock()` for APIs, services
5. **Test error states**: Don't only test happy paths
6. **Keep tests focused**: One concept per test

### Common Patterns

#### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react';

it('should update state', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.updateState('new value');
  });
  
  expect(result.current.state).toBe('new value');
});
```

#### Testing Async Operations
```typescript
it('should load data', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

#### Testing Error Boundaries
```typescript
const ThrowError = () => {
  throw new Error('Test error');
};

it('should catch errors', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

## Coverage Goals

### Current Status
- Total: ~15% (baseline with critical tests)
- Hooks: ~25%
- Components: ~10%
- Features: ~5%

### Target Coverage
- **P0 (2 weeks)**: 40% overall, 70% on critical paths
- **P1 (4 weeks)**: 60% overall, 80% on critical paths
- **P2 (6 weeks)**: 70% overall, 90% on critical paths

### Critical Paths (Must Test)
- Authentication (login, logout, session)
- Navigation and routing
- Error boundaries
- Core hooks (useAuthentication, useRouter, useSystem)
- Payment flows (when implemented)

## CI/CD Integration

### Pre-commit Hook
Tests run automatically on commit via lint-staged:
```json
{
  "*.{ts,tsx}": [
    "npm test -- --run --passWithNoTests"
  ]
}
```

### GitHub Actions
Automated testing on:
- Pull requests
- Commits to main branch
- Release tags

## Debugging Tests

### VS Code Integration
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Common Issues

1. **Tests timeout**: Increase timeout in test or use `waitFor`
2. **Act warnings**: Wrap state updates in `act()`
3. **Module not found**: Check path aliases in `tsconfig.json`
4. **DOM not available**: Ensure `environment: 'jsdom'` in config

## Maintenance

### Regular Tasks
- **Weekly**: Review coverage reports
- **Monthly**: Update test infrastructure
- **Per feature**: Add tests for new code
- **Before release**: Run full test suite

### Test Hygiene
- Remove obsolete tests
- Refactor brittle tests
- Keep test utilities DRY
- Update snapshots when intentional

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
