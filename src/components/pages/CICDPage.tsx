import { useState } from 'react';
import { CICDPipelineIntegration } from '../cicd/CICDPipelineIntegration';

interface CICDPageProps {
  projectId?: string;
}

export function CICDPage({ projectId = 'current-project' }: CICDPageProps) {
  const handlePipelineCreate = (pipeline: any) => {
    console.log('Pipeline created:', pipeline);
  };

  const handlePipelineTrigger = (pipelineId: string) => {
    console.log('Pipeline triggered:', pipelineId);
  };

  return (
    <div className="space-y-8">
      <CICDPipelineIntegration
        projectId={projectId}
        onPipelineCreate={handlePipelineCreate}
        onPipelineTrigger={handlePipelineTrigger}
      />
    </div>
  );
}