import { handlePublicRoutes, publicRoutes } from './publicRoutes';
import { handleCreatorRoutes, creatorRoutes } from './creatorRoutes';
import { handleValidationRoutes, validationRoutes } from './validationRoutes';
import { handleValidatorRoutes, validatorRoutes } from './validatorRoutes';
import { handleCoreSystemRoutes, coreSystemRoutes } from './coreSystemRoutes';
import type { PageType } from '../../../types/core';

export function handleAllRoutes(
  currentPage: PageType,
  isAuthenticated: boolean,
  onPageChange: (page: PageType) => void
) {
  // Try core system routes first (new missing components)
  const coreSystemResult = handleCoreSystemRoutes(currentPage, isAuthenticated);
  if (coreSystemResult) return coreSystemResult;

  // Try public routes
  const publicResult = handlePublicRoutes(currentPage, onPageChange);
  if (publicResult) return publicResult;

  // Try creator routes (requires authentication for some)
  const creatorResult = handleCreatorRoutes(currentPage, isAuthenticated);
  if (creatorResult) return creatorResult;

  // Try validation routes
  const validationResult = handleValidationRoutes(currentPage, isAuthenticated);
  if (validationResult) return validationResult;

  // Try validator routes
  const validatorResult = handleValidatorRoutes(currentPage, isAuthenticated);
  if (validatorResult) return validatorResult;

  // Default fallback
  return null;
}

// Export route lists for navigation
export { 
  publicRoutes,
  creatorRoutes,
  validationRoutes,
  validatorRoutes,
  coreSystemRoutes,
  handlePublicRoutes,
  handleCreatorRoutes,
  handleValidationRoutes,
  handleValidatorRoutes,
  handleCoreSystemRoutes
};

// Combined route validation
export function isValidRoute(page: PageType): boolean {
  const allRoutes = [
    ...publicRoutes,
    ...creatorRoutes,
    ...validationRoutes,
    ...validatorRoutes,
    ...coreSystemRoutes
  ];
  
  return allRoutes.includes(page);
}

// Route categorization for navigation
export function getRouteCategory(page: PageType): string {
  if (publicRoutes.includes(page)) return 'public';
  if (creatorRoutes.includes(page)) return 'creator';
  if (validationRoutes.includes(page)) return 'validation';
  if (validatorRoutes.includes(page)) return 'validator';
  if (coreSystemRoutes.includes(page)) return 'system';
  
  return 'unknown';
}

// Authentication requirements
export function requiresAuthentication(page: PageType): boolean {
  const publicPages: PageType[] = [
    'home', 'about', 'features', 'pricing', 'contact', 
    'demo', 'testimonials', 'faq', 'privacy', 'terms',
    'search', 'notifications' // Some core system apps don't require auth
  ];
  
  return !publicPages.includes(page);
}