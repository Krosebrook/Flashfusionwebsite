# Contributing to FlashFusion

Thank you for your interest in contributing to FlashFusion! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/flashfusion-app.git
   cd flashfusion-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch for integration
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes for production

### Creating a Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns and conventions
   - Add tests for new functionality

3. **Test your changes**
   ```bash
   npm run test:run
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Standards

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper typing instead of `any`
- Export types from appropriate modules

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Avoid
type UserProfile = {
  id: any;
  name: any;
  email: any;
}
```

### React Components

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components small and focused
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button 
      className={`ff-btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow FlashFusion design system
- Use CSS custom properties for consistent values
- Prefer FlashFusion animation utilities

```typescript
// Good - Using design system classes
<div className="ff-card-interactive ff-hover-glow">
  <h3 className="ff-text-gradient">Title</h3>
</div>

// Avoid - Custom styles without system
<div style={{ background: 'linear-gradient(...)' }}>
```

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Use React Testing Library for component tests
- Mock external dependencies
- Aim for good test coverage

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:ci
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples for components

```typescript
/**
 * Formats a date according to FlashFusion standards
 * @param date - The date to format
 * @param format - The format type ('short' | 'long')
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  // Implementation
}
```

### Component Documentation

- Document component usage
- Include prop descriptions
- Provide examples

```typescript
/**
 * Primary button component for FlashFusion
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button text or content */
  children: React.ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'accent';
  /** Click handler */
  onClick?: () => void;
}
```

## 🔍 Code Review Process

### Submitting a PR

1. **Fill out the PR template completely**
2. **Link related issues**
3. **Add screenshots for UI changes**
4. **Ensure CI passes**
5. **Request review from maintainers**

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added for new functionality
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Accessibility considerations addressed

### Review Criteria

- **Functionality**: Does it work as expected?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Does it impact performance?
- **Security**: Are there security implications?
- **Testing**: Is it adequately tested?

## 🚨 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)
- **Console errors** if any

### Feature Requests

For feature requests, please provide:

- **Problem statement** - what problem does this solve?
- **Proposed solution** - how should it work?
- **Alternatives considered** - other approaches?
- **Additional context** - mockups, examples, etc.

## 🎯 Areas for Contribution

### High Priority

- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Test coverage improvements
- [ ] Documentation enhancements

### Good First Issues

- [ ] UI component improvements
- [ ] Bug fixes in existing features
- [ ] Adding missing tests
- [ ] Improving error messages

### Advanced Contributions

- [ ] New AI tool integrations
- [ ] Advanced animation features
- [ ] Backend optimizations
- [ ] Mobile experience improvements

## 📞 Getting Help

If you need help:

1. **Check existing issues** and discussions
2. **Join our Discord** for community support
3. **Create a discussion** for questions
4. **Tag maintainers** for urgent issues

## 🏆 Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes
- Invited to our Discord community
- Eligible for contributor badges

Thank you for contributing to FlashFusion! 🚀

---

*This document is living and will be updated as the project evolves.*