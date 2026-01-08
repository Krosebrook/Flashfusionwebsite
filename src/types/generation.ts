/**
 * Type definitions for AI Creation Workflow
 */

import { LucideIcon } from 'lucide-react';

export interface CreationType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  models: string[];
  estimatedTime: string;
  category: 'code' | 'content' | 'design' | 'data';
  features?: string[];
}

export interface GenerationTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  prompt: string;
  model: string;
  tags: string[];
  popularity: number;
  exampleOutput?: string;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  customInstructions?: string;
}

export interface ExportOptions {
  format: 'zip' | 'github' | 'cloud';
  destination?: string;
  includeReadme?: boolean;
  includeTests?: boolean;
}

export type GenerationStep = 'select' | 'configure' | 'generate' | 'complete';

export interface WorkflowState {
  currentStep: GenerationStep;
  selectedType: string;
  prompt: string;
  model: string;
  options: GenerationOptions;
  template?: GenerationTemplate;
}
