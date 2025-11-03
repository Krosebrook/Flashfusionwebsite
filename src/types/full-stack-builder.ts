export interface AppStack {
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  deployment: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'frontend' | 'backend' | 'config' | 'database';
  size: number;
}

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface DeploymentConfig {
  frontend: string;
  backend: string;
  database: string;
}

export interface GeneratedApp {
  name: string;
  description: string;
  stack: AppStack;
  files: GeneratedFile[];
  features: string[];
  endpoints: APIEndpoint[];
  deploymentConfig: DeploymentConfig;
}

export interface FrameworkOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

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