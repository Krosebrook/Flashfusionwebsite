import { useState } from 'react';
import type { ValidationIdea, ValidationAnalysis } from '../types/core';

interface ValidationContextState {
  currentIdeaId?: string;
  analysisId?: string;
}

export function useValidationContext() {
  const [validationContext, setValidationContext] = useState<ValidationContextState>({});

  const handleIdeaSubmit = (idea: Partial<ValidationIdea>) => {
    // In a real app, this would save to database and get an ID
    const ideaId = `idea-${Date.now()}`;
    setValidationContext({ currentIdeaId: ideaId });
    return ideaId;
  };

  const handleAnalysisComplete = (analysis: ValidationAnalysis) => {
    setValidationContext(prev => ({ 
      ...prev, 
      analysisId: analysis.id 
    }));
  };

  const resetValidationContext = () => {
    setValidationContext({});
  };

  return {
    validationContext,
    handleIdeaSubmit,
    handleAnalysisComplete,
    resetValidationContext
  };
}