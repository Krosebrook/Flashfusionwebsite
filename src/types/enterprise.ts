/**
 * Enterprise Features Type Definitions
 * Types for SSO, RBAC, Audit Logging, Multi-Tenancy, and SLA Management
 */

// SSO & Identity Management
export type IdentityProvider = 'saml' | 'oidc' | 'ldap' | 'ad' | 'oauth';
export type AuthenticationMethod = 'password' | 'mfa' | 'biometric' | 'sso';

export interface SSOConfiguration {
  id: string;
  provider: IdentityProvider;
  name: string;
  enabled: boolean;
  config: SAMLConfig | OIDCConfig | LDAPConfig;
  mapping: AttributeMapping;
  createdAt: Date;
  updatedAt: Date;
}

export interface SAMLConfig {
  entryPoint: string;
  issuer: string;
  certificate: string;
  spEntityId: string;
  acsUrl: string;
  sloUrl?: string;
  signatureAlgorithm?: string;
}

export interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  scopes: string[];
  redirectUris: string[];
}

export interface LDAPConfig {
  url: string;
  baseDN: string;
  bindDN: string;
  bindPassword: string;
  searchFilter: string;
  attributes: string[];
}

export interface AttributeMapping {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  groups?: string;
  roles?: string;
  customAttributes?: Record<string, string>;
}

// RBAC (Role-Based Access Control)
export type Action = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'admin';
export type Effect = 'allow' | 'deny';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: string[];
  conditions?: AccessCondition[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resource: string;
  actions: Action[];
  effect: Effect;
  constraints?: Constraint[];
}

export interface Constraint {
  type: 'time' | 'ip' | 'location' | 'attribute';
  operator: 'equals' | 'contains' | 'matches' | 'in' | 'between';
  value: any;
}

export interface AccessCondition {
  attribute: string;
  operator: string;
  value: any;
}

export interface AccessContext {
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  attributes?: Record<string, any>;
}

// Audit Logging
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'access' | 'modify';
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  severity: AuditSeverity;
  status: 'success' | 'failure';
  details: AuditDetails;
  metadata: AuditMetadata;
}

export interface AuditDetails {
  description: string;
  changes?: Change[];
  context?: Record<string, any>;
}

export interface Change {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditMetadata {
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  location?: GeoLocation;
  requestId?: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ComplianceReport {
  id: string;
  type: 'soc2' | 'gdpr' | 'hipaa' | 'iso27001';
  period: DateRange;
  findings: Finding[];
  summary: ComplianceSummary;
  generatedAt: Date;
}

export interface Finding {
  id: string;
  severity: 'info' | 'warning' | 'error';
  category: string;
  description: string;
  recommendation: string;
  evidence: string[];
}

export interface ComplianceSummary {
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  complianceScore: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Multi-Tenancy
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  resources: TenantResources;
  configuration: TenantConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'deleted';

export interface TenantResources {
  database?: string;
  storage?: string;
  compute?: string;
  limits: ResourceLimits;
  usage: ResourceUsage;
}

export interface ResourceLimits {
  users: number;
  projects: number;
  storage: number; // bytes
  apiCalls: number;
  computeHours: number;
}

export interface ResourceUsage {
  users: number;
  projects: number;
  storage: number;
  apiCalls: number;
  computeHours: number;
  lastUpdated: Date;
}

export interface TenantConfiguration {
  branding?: BrandingConfig;
  features?: string[];
  integrations?: IntegrationConfig[];
  security?: SecurityConfig;
}

export interface BrandingConfig {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
}

export interface IntegrationConfig {
  type: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface SecurityConfig {
  mfaRequired: boolean;
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  ipWhitelist?: string[];
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays?: number;
}

// SLA Management
export interface SLA {
  id: string;
  tenantId: string;
  name: string;
  tier: SLATier;
  metrics: SLAMetric[];
  period: 'monthly' | 'quarterly' | 'annual';
  status: 'active' | 'breached' | 'at_risk';
  currentCompliance: number;
}

export type SLATier = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface SLAMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  critical: boolean;
}

export interface SLABreach {
  id: string;
  slaId: string;
  metric: string;
  timestamp: Date;
  severity: 'minor' | 'major' | 'critical';
  details: string;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  slaDeadline: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
