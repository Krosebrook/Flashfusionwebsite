import { useState } from 'react';
import { AdvancedTemplates } from '../templates/AdvancedTemplates';
import { PageType } from '../../types';

interface TemplatesPageProps {
  setCurrentPage: (page: PageType) => void;
  userRole?: string;
  onProjectCreated?: () => void;
}

export function TemplatesPage({ setCurrentPage, userRole = 'free', onProjectCreated }: TemplatesPageProps) {
  const handleCreateProject = async (template: any, customizations: any) => {
    try {
      // Handle project creation
      console.log('Creating project from template:', template, customizations);
      
      // Navigate to projects page after creation
      setCurrentPage('projects');
      onProjectCreated?.();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="ff-stagger-fade">
        <AdvancedTemplates 
          onCreateProject={handleCreateProject}
          userRole={userRole}
        />
      </div>
    </div>
  );
}