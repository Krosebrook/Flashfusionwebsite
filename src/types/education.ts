/**
 * @fileoverview Educational Content Type Definitions
 * @chunk education
 * @category types
 * @version 1.0.0
 * @author FlashFusion Team
 */

import type { 
  EducationalStandard, 
  GradeLevel, 
  SubjectArea, 
  ContentType, 
  AssessmentType,
  FileFormat,
  ToolCategory,
  EducationalPlatform,
  GenerationPreset
} from '../constants/education';

// Core Educational Content Interface
export interface EducationalContent {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  subject: SubjectArea;
  gradeLevel: GradeLevel;
  standard?: EducationalStandard;
  topic: string;
  
  // Content Structure
  objectives: LearningObjective[];
  content: ContentSection[];
  assessments: Assessment[];
  resources: Resource[];
  
  // Metadata
  metadata: ContentMetadata;
  
  // Generation Info
  generatedAt: Date;
  generatedBy: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
}

export interface LearningObjective {
  id: string;
  description: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  measurable: boolean;
  timeframe?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'introduction' | 'instruction' | 'activity' | 'assessment' | 'closure' | 'extension';
  content: string;
  duration?: number; // in minutes
  materials?: string[];
  instructions?: string[];
  differentiation?: DifferentiationStrategy[];
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  description: string;
  questions: AssessmentQuestion[];
  rubric?: Rubric;
  pointsTotal: number;
  timeLimit?: number; // in minutes
  attempts?: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false' | 'matching' | 'fill-blank';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Rubric {
  id: string;
  title: string;
  criteria: RubricCriterion[];
  scale: RubricScale[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage
}

export interface RubricScale {
  level: number;
  label: string;
  description: string;
  points: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'url' | 'file' | 'book' | 'video' | 'image' | 'interactive';
  url?: string;
  description?: string;
  required: boolean;
}

export interface ContentMetadata {
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  keywords: string[];
  tags: string[];
  language: string;
  accessibility: AccessibilityFeature[];
  lastModified: Date;
  collaborators?: string[];
}

export interface AccessibilityFeature {
  type: 'screen-reader' | 'high-contrast' | 'large-text' | 'keyboard-nav' | 'alt-text' | 'captions';
  implemented: boolean;
  description?: string;
}

export interface DifferentiationStrategy {
  type: 'content' | 'process' | 'product' | 'environment';
  learnerType: 'advanced' | 'on-level' | 'struggling' | 'ell' | 'special-needs';
  strategy: string;
  description: string;
}

// Content Generation Request
export interface ContentGenerationRequest {
  // Basic Info
  type: ContentType;
  subject: SubjectArea;
  gradeLevel: GradeLevel;
  topic: string;
  
  // Optional Parameters
  standard?: EducationalStandard;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  // Content Specifications
  objectives?: string[];
  requirements?: string[];
  differentiation?: boolean;
  assessment?: boolean;
  
  // Output Preferences
  format: FileFormat[];
  platform?: EducationalPlatform;
  preset?: GenerationPreset;
  
  // AI Settings
  creativity: number; // 0-100
  formality: number; // 0-100
  detail: number; // 0-100
}

// Content Generation Response
export interface ContentGenerationResponse {
  id: string;
  request: ContentGenerationRequest;
  content: EducationalContent;
  files: GeneratedFile[];
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
  warnings?: string[];
  processingTime: number; // in seconds
  tokensUsed?: number;
}

export interface GeneratedFile {
  id: string;
  filename: string;
  format: FileFormat;
  size: number; // in bytes
  url: string;
  downloadUrl: string;
  previewUrl?: string;
  createdAt: Date;
}

// Educational Tool Definition
export interface EducationalTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  
  // Functionality
  supportedSubjects: SubjectArea[];
  supportedGrades: GradeLevel[];
  inputTypes: string[];
  outputTypes: FileFormat[];
  
  // Metadata
  popularity: number; // 0-100
  rating: number; // 0-5
  complexity: 'simple' | 'moderate' | 'advanced';
  estimatedTime: number; // in minutes
  
  // Availability
  freeTier: boolean;
  proTier: boolean;
  enterpriseTier: boolean;
}

// Study Path for Students
export interface StudyPath {
  id: string;
  title: string;
  description: string;
  subject: SubjectArea;
  gradeLevel: GradeLevel;
  
  // Path Structure
  modules: StudyModule[];
  totalDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Progress Tracking
  progress: StudyProgress;
  
  // Customization
  adaptable: boolean;
  prerequisites: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

export interface StudyModule {
  id: string;
  title: string;
  description: string;
  order: number;
  
  // Content
  lessons: StudyLesson[];
  quiz?: Assessment;
  project?: StudyProject;
  
  // Requirements
  duration: number; // in minutes
  required: boolean;
}

export interface StudyLesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'practice' | 'discussion';
  content: string;
  resources: Resource[];
  duration: number; // in minutes
  completed: boolean;
}

export interface StudyProject {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'presentation' | 'research' | 'creative';
  requirements: string[];
  rubric: Rubric;
  dueDate?: Date;
  submitted: boolean;
}

export interface StudyProgress {
  userId: string;
  pathId: string;
  startedAt: Date;
  lastAccessedAt: Date;
  completedModules: string[];
  currentModule?: string;
  overallProgress: number; // 0-100
  timeSpent: number; // in minutes
  scores: { [moduleId: string]: number };
}

// Marketplace Content for Sellers
export interface MarketplaceContent {
  id: string;
  title: string;
  description: string;
  
  // Content Info
  content: EducationalContent;
  previewImages: string[];
  sampleFiles: GeneratedFile[];
  
  // Marketplace Info
  price: number;
  currency: string;
  category: string;
  tags: string[];
  
  // Seller Info
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  
  // Performance
  downloads: number;
  rating: number;
  reviews: MarketplaceReview[];
  
  // Status
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  helpful: boolean;
  createdAt: Date;
}

// Parent Communication
export interface ParentCommunication {
  id: string;
  type: 'newsletter' | 'progress-report' | 'announcement' | 'meeting-request' | 'behavior-update';
  title: string;
  content: string;
  
  // Recipients
  recipients: ParentContact[];
  sentAt?: Date;
  
  // Student Info
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  
  // Metadata
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requiresResponse: boolean;
  dueDate?: Date;
  
  // Tracking
  opened: boolean;
  responded: boolean;
  responseContent?: string;
}

export interface ParentContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: 'parent' | 'guardian' | 'caregiver' | 'emergency-contact';
  primary: boolean;
  studentIds: string[];
}

// Analytics and Reporting
export interface EducationalAnalytics {
  // Content Analytics
  contentCreated: number;
  contentDownloaded: number;
  popularSubjects: { subject: SubjectArea; count: number }[];
  popularGrades: { grade: GradeLevel; count: number }[];
  
  // Usage Analytics
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number; // in minutes
  toolUsage: { toolId: string; usage: number }[];
  
  // Performance Analytics
  generationSuccess: number; // percentage
  userSatisfaction: number; // 1-5 rating
  averageGenerationTime: number; // in seconds
  
  // Time-based Data
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

// Export Types
export type { EducationalStandard, GradeLevel, SubjectArea, ContentType, AssessmentType, FileFormat, ToolCategory, EducationalPlatform, GenerationPreset };