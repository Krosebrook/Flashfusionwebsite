/**
 * @fileoverview Veteran Grade Snapshot Type Definitions
 * @category types
 * @version 1.0.0
 * @author FlashFusion Team
 */

/**
 * Grade levels for veteran/expert users
 */
export type GradeLevel = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';

/**
 * Status indicators for different metrics
 */
export type MetricStatus = 'excellent' | 'very-good' | 'good' | 'fair' | 'needs-improvement' | 'poor';

/**
 * Categories of metrics tracked in veteran grade snapshot
 */
export type MetricCategory = 
  | 'performance' 
  | 'optimization' 
  | 'code-quality' 
  | 'deployment' 
  | 'collaboration' 
  | 'security';

/**
 * Individual metric data point
 */
export interface MetricData {
  id: string;
  name: string;
  category: MetricCategory;
  score: number; // 0-100
  grade: GradeLevel;
  status: MetricStatus;
  timestamp: Date;
  details?: string;
}

/**
 * Veteran grade snapshot containing all metrics
 */
export interface VeteranGradeSnapshot {
  id: string;
  userId: string;
  experienceLevel: 'expert' | 'veteran'; // 10+ years
  timestamp: Date;
  
  // Overall metrics
  overallScore: number; // 0-100
  overallGrade: GradeLevel;
  overallStatus: MetricStatus;
  
  // Category-specific metrics
  metrics: MetricData[];
  
  // Summary statistics
  summary: {
    totalMetrics: number;
    excellentCount: number;
    goodCount: number;
    needsImprovementCount: number;
    averageScore: number;
  };
  
  // Historical comparison
  comparison?: {
    previousSnapshotId?: string;
    previousScore?: number;
    scoreDelta?: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    source: 'manual' | 'automatic' | 'scheduled';
  };
}

/**
 * Request parameters for creating a snapshot
 */
export interface CreateSnapshotRequest {
  userId: string;
  experienceLevel?: 'expert' | 'veteran';
  includeHistory?: boolean;
  source?: 'manual' | 'automatic' | 'scheduled';
}

/**
 * Response from snapshot creation
 */
export interface CreateSnapshotResponse {
  success: boolean;
  snapshot?: VeteranGradeSnapshot;
  error?: string;
  message?: string;
}

/**
 * Snapshot history item for tracking over time
 */
export interface SnapshotHistory {
  snapshots: VeteranGradeSnapshot[];
  totalCount: number;
  period: {
    start: Date;
    end: Date;
  };
  trends: {
    overallTrend: 'improving' | 'stable' | 'declining';
    categoryTrends: {
      [key in MetricCategory]?: {
        trend: 'improving' | 'stable' | 'declining';
        averageScore: number;
      };
    };
  };
}
