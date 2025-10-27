/**
 * Mock data fixtures for CodeGeneratorTool
 * Extracted from components/tools/generation/CodeGeneratorTool.tsx
 */

export const PROGRAMMING_LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', icon: '🔷', popular: true },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', popular: true },
  { id: 'python', name: 'Python', icon: '🐍', popular: true },
  { id: 'java', name: 'Java', icon: '☕', popular: true },
  { id: 'csharp', name: 'C#', icon: '🔷', popular: false },
  { id: 'go', name: 'Go', icon: '🐹', popular: false },
  { id: 'rust', name: 'Rust', icon: '🦀', popular: false },
  { id: 'php', name: 'PHP', icon: '🐘', popular: false },
  { id: 'ruby', name: 'Ruby', icon: '💎', popular: false },
  { id: 'swift', name: 'Swift', icon: '🍎', popular: false },
  { id: 'kotlin', name: 'Kotlin', icon: '🎯', popular: false },
  { id: 'dart', name: 'Dart', icon: '🎯', popular: false },
];

export const CODE_TYPES = [
  { id: 'component', name: 'React Component', icon: '⚛️', description: 'Reusable UI components' },
  { id: 'api', name: 'REST API', icon: '🌐', description: 'Backend API endpoints' },
  { id: 'function', name: 'Function/Method', icon: '⚡', description: 'Utility functions' },
  { id: 'class', name: 'Class/Object', icon: '🏗️', description: 'Object-oriented structures' },
  { id: 'hook', name: 'React Hook', icon: '🪝', description: 'Custom React hooks' },
  { id: 'middleware', name: 'Middleware', icon: '🔗', description: 'Server middleware' },
  { id: 'schema', name: 'Database Schema', icon: '🗄️', description: 'Database structures' },
  { id: 'config', name: 'Configuration', icon: '⚙️', description: 'Config files' },
  { id: 'test', name: 'Test Suite', icon: '🧪', description: 'Unit and integration tests' },
  { id: 'utility', name: 'Utility Library', icon: '🔧', description: 'Helper utilities' },
];

export const FRAMEWORKS = [
  { id: 'react', name: 'React', icon: '⚛️', language: 'typescript' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', language: 'typescript' },
  { id: 'vue', name: 'Vue.js', icon: '💚', language: 'typescript' },
  { id: 'angular', name: 'Angular', icon: '🅰️', language: 'typescript' },
  { id: 'svelte', name: 'Svelte', icon: '🧡', language: 'typescript' },
  { id: 'express', name: 'Express.js', icon: '🚂', language: 'javascript' },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', language: 'python' },
  { id: 'django', name: 'Django', icon: '🎸', language: 'python' },
  { id: 'spring', name: 'Spring Boot', icon: '🍃', language: 'java' },
  { id: 'laravel', name: 'Laravel', icon: '🔺', language: 'php' },
];

export const FEATURE_OPTIONS = [
  'TypeScript Support',
  'ESLint Configuration',
  'Prettier Formatting',
  'Unit Tests',
  'Integration Tests',
  'API Documentation',
  'Error Handling',
  'Logging',
  'Authentication',
  'Database Integration',
  'Caching',
  'Rate Limiting',
  'Validation',
  'Swagger/OpenAPI',
  'Docker Support',
  'CI/CD Pipeline',
];
