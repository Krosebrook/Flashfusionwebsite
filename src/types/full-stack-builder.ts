/**
 * @fileoverview Full-stack builder type definitions
 * @module types/full-stack-builder
 */

/**
 * Full-stack application technology stack
 * @interface AppStack
 * @property {string} frontend - Frontend framework/library
 * @property {string} backend - Backend framework
 * @property {string} database - Database system
 * @property {string} auth - Authentication provider
 * @property {string} deployment - Deployment platform
 */
export interface AppStack {
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  deployment: string;
}

/**
 * Generated source code file
 * @interface GeneratedFile
 * @property {string} path - File path relative to project root
 * @property {string} content - File content
 * @property {'frontend' | 'backend' | 'config' | 'database'} type - File category
 * @property {number} size - File size in bytes
 */
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'frontend' | 'backend' | 'config' | 'database';
  size: number;
}

/**
 * API endpoint definition
 * @interface APIEndpoint
 * @property {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @property {string} path - Endpoint path
 * @property {string} description - Endpoint description
 */
export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
}

/**
 * Deployment configuration for full-stack application
 * @interface DeploymentConfig
 * @property {string} frontend - Frontend deployment configuration
 * @property {string} backend - Backend deployment configuration
 * @property {string} database - Database deployment configuration
 */
export interface DeploymentConfig {
  frontend: string;
  backend: string;
  database: string;
}

/**
 * Complete generated application with all files and configuration
 * @interface GeneratedApp
 * @property {string} name - Application name
 * @property {string} description - Application description
 * @property {AppStack} stack - Technology stack
 * @property {GeneratedFile[]} files - Generated source files
 * @property {string[]} features - Implemented features
 * @property {APIEndpoint[]} endpoints - API endpoints
 * @property {DeploymentConfig} deploymentConfig - Deployment configuration
 */
export interface GeneratedApp {
  name: string;
  description: string;
  stack: AppStack;
  files: GeneratedFile[];
  features: string[];
  endpoints: APIEndpoint[];
  deploymentConfig: DeploymentConfig;
}

/**
 * Frontend/backend framework option
 * @interface FrameworkOption
 * @property {string} id - Unique framework identifier
 * @property {string} name - Framework name
 * @property {string} icon - Icon identifier or URL
 * @property {string} description - Framework description
 */
export interface FrameworkOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/**
 * Database system option
 * @interface DatabaseOption
 * @property {string} id - Unique database identifier
 * @property {string} name - Database name
 * @property {string} icon - Icon identifier or URL
 * @property {string} description - Database description
 */
export interface DatabaseOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AuthProviderOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DeploymentOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AppTypeOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}