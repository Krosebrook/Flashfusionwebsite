import { lazy } from 'react';
import type { PageType } from '../../../types/core';

// Lazy load validation pages
const ValidationNexusHub = lazy(() => import('../../validation/ValidationNexusHub'));
const AIValidationEngine = lazy(() => import('../../validation/AIValidationEngine'));

export function handleValidationRoutes(
  currentPage: PageType,
  isAuthenticated: boolean
) {
  // Validation routes require authentication
  if (!isAuthenticated) {
    return null;
  }

  switch (currentPage) {
    case 'validation':
      return <ValidationNexusHub />;
    
    case 'ai-validation':
      return <AIValidationEngine />;
    
    default:
      return null;
  }
}

export const validationRoutes: PageType[] = [
  'validation',
  'ai-validation'
];