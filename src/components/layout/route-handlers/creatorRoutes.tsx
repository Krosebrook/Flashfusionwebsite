import { lazy } from 'react';
import type { PageType } from '../../../types/core';

// Lazy load creator pages
const CreatorModeHub = lazy(() => import('../../creator/CreatorModeHub'));
const CreatorContentPipelinePage = lazy(() => import('../../pages/CreatorContentPipelinePage'));
const CreatorCommerceHub = lazy(() => import('../../creator/CreatorCommerceHub'));
const BrandKitGenerator = lazy(() => import('../../creator/BrandKitGenerator'));
const ContentCreationHub = lazy(() => import('../../creator/ContentCreationHub'));
const EducationPage = lazy(() => import('../../pages/EducationPage'));

export function handleCreatorRoutes(
  currentPage: PageType,
  isAuthenticated: boolean
) {
  // Most creator routes require authentication
  if (!isAuthenticated && currentPage !== 'creator-hub') {
    return null;
  }

  switch (currentPage) {
    case 'creator-hub':
      return <CreatorModeHub />;
    
    case 'creator-content-pipeline':
      return <CreatorContentPipelinePage />;
    
    case 'creator-commerce':
      return <CreatorCommerceHub />;
    
    case 'brand-kit':
      return <BrandKitGenerator />;
    
    case 'content-creation':
      return <ContentCreationHub />;
    
    case 'education':
      return <EducationPage />;
    
    default:
      return null;
  }
}

export const creatorRoutes: PageType[] = [
  'creator-hub',
  'creator-content-pipeline',
  'creator-commerce',
  'brand-kit',
  'content-creation',
  'education'
];