import React from 'react';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Separator } from '../../../ui/separator';
import { Server, Globe, Database, Shield, CloudUpload } from 'lucide-react';
import type { 
  FrameworkOption, 
  DatabaseOption, 
  AuthProviderOption, 
  DeploymentOption 
} from '../../../../types/full-stack-builder';

interface TechStackSectionProps {
  frontend: string;
  setFrontend: (frontend: string) => void;
  backend: string;
  setBackend: (backend: string) => void;
  database: string;
  setDatabase: (database: string) => void;
  auth: string;
  setAuth: (auth: string) => void;
  deployment: string;
  setDeployment: (deployment: string) => void;
  frontendFrameworks: FrameworkOption[];
  backendFrameworks: FrameworkOption[];
  databases: DatabaseOption[];
  authProviders: AuthProviderOption[];
  deploymentPlatforms: DeploymentOption[];
}

export function TechStackSection({
  frontend,
  setFrontend,
  backend,
  setBackend,
  database,
  setDatabase,
  auth,
  setAuth,
  deployment,
  setDeployment,
  frontendFrameworks,
  backendFrameworks,
  databases,
  authProviders,
  deploymentPlatforms
}: TechStackSectionProps) {
  return (
    <>
      <Separator />
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Server className="w-5 h-5" />
          Technology Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Frontend */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4" />
              Frontend Framework
            </Label>
            <Select value={frontend} onValueChange={setFrontend}>
              <SelectTrigger className="ff-focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frontendFrameworks.map(fw => (
                  <SelectItem key={fw.id} value={fw.id}>
                    <div className="flex items-center gap-2">
                      <span>{fw.icon}</span>
                      <div>
                        <div className="font-medium">{fw.name}</div>
                        <div className="text-xs text-muted-foreground">{fw.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Backend */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Server className="w-4 h-4" />
              Backend Framework
            </Label>
            <Select value={backend} onValueChange={setBackend}>
              <SelectTrigger className="ff-focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backendFrameworks.map(fw => (
                  <SelectItem key={fw.id} value={fw.id}>
                    <div className="flex items-center gap-2">
                      <span>{fw.icon}</span>
                      <div>
                        <div className="font-medium">{fw.name}</div>
                        <div className="text-xs text-muted-foreground">{fw.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Database */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-4 h-4" />
              Database
            </Label>
            <Select value={database} onValueChange={setDatabase}>
              <SelectTrigger className="ff-focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {databases.map(db => (
                  <SelectItem key={db.id} value={db.id}>
                    <div className="flex items-center gap-2">
                      <span>{db.icon}</span>
                      <div>
                        <div className="font-medium">{db.name}</div>
                        <div className="text-xs text-muted-foreground">{db.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Authentication */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4" />
              Authentication
            </Label>
            <Select value={auth} onValueChange={setAuth}>
              <SelectTrigger className="ff-focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {authProviders.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <span>{provider.icon}</span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">{provider.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deployment */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <CloudUpload className="w-4 h-4" />
              Deployment Platform
            </Label>
            <Select value={deployment} onValueChange={setDeployment}>
              <SelectTrigger className="ff-focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {deploymentPlatforms.map(platform => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center gap-2">
                      <span>{platform.icon}</span>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">{platform.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}