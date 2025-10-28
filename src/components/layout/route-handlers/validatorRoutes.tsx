import { lazy } from 'react';
import type { PageType } from '../../../types/core';

// Lazy load validator pages
const ValidatorHub = lazy(() => import('../../validator/ValidatorHub'));
const AIOutputValidator = lazy(() => import('../../validator/AIOutputValidator'));
const CrossAppDataValidator = lazy(() => import('../../validator/CrossAppDataValidator'));
const SecurityComplianceMonitor = lazy(() => import('../../validator/SecurityComplianceMonitor'));
const CollaborationTrustManager = lazy(() => import('../../validator/CollaborationTrustManager'));
const SyncIntegrityChecker = lazy(() => import('../../validator/SyncIntegrityChecker'));
const SystemHealthMonitor = lazy(() => import('../../validator/SystemHealthMonitor'));
const PluginSecurityScanner = lazy(() => import('../../validator/PluginSecurityScanner'));

export function handleValidatorRoutes(
  currentPage: PageType,
  isAuthenticated: boolean
) {
  // Validator routes require authentication
  if (!isAuthenticated) {
    return null;
  }

  switch (currentPage) {
    case 'validator-hub':
      return <ValidatorHub />;
    
    case 'ai-output-validator':
      return <AIOutputValidator />;
    
    case 'cross-app-validation':
      return <CrossAppDataValidator />;
    
    case 'security-compliance':
      return <SecurityComplianceMonitor />;
    
    case 'collaboration-trust':
      return <CollaborationTrustManager />;
    
    case 'sync-integrity':
      return <SyncIntegrityChecker />;
    
    case 'system-health':
      return <SystemHealthMonitor />;
    
    case 'plugin-security':
      return <PluginSecurityScanner />;
    
    default:
      return null;
  }
}

export const validatorRoutes: PageType[] = [
  'validator-hub',
  'ai-output-validator',
  'cross-app-validation',
  'security-compliance',
  'collaboration-trust',
  'sync-integrity',
  'system-health',
  'plugin-security'
];