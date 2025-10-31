/**
 * @fileoverview Veteran Grade Snapshot Service
 * @category services
 * @version 1.0.0
 * @author FlashFusion Team
 */

import { generateId } from '../utils/id-generator';
import type {
  VeteranGradeSnapshot,
  MetricData,
  GradeLevel,
  MetricStatus,
  MetricCategory,
  CreateSnapshotRequest,
  CreateSnapshotResponse,
  SnapshotHistory
} from '../types/veteranGrade';

/**
 * Service for managing veteran grade snapshots
 */
class VeteranGradeSnapshotServiceClass {
  private readonly STORAGE_KEY = 'ff_veteran_grade_snapshots';
  private readonly MAX_SNAPSHOTS = 50; // Keep last 50 snapshots

  /**
   * Calculate grade based on score
   */
  private calculateGrade(score: number): GradeLevel {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Determine status based on score
   */
  private calculateStatus(score: number): MetricStatus {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'very-good';
    if (score >= 75) return 'good';
    if (score >= 65) return 'fair';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Generate sample metrics for demonstration
   * In production, these would come from actual system metrics
   */
  private generateSampleMetrics(): MetricData[] {
    const categories: MetricCategory[] = [
      'performance',
      'optimization',
      'code-quality',
      'deployment',
      'collaboration',
      'security'
    ];

    return categories.map((category, index) => {
      // Generate realistic scores with some variance
      const baseScore = 75 + Math.random() * 20; // 75-95 range for veterans
      const score = Math.round(baseScore);

      return {
        id: `metric_${category}_${Date.now()}_${index}`,
        name: this.getCategoryDisplayName(category),
        category,
        score,
        grade: this.calculateGrade(score),
        status: this.calculateStatus(score),
        timestamp: new Date(),
        details: this.getMetricDetails(category, score)
      };
    });
  }

  /**
   * Get display name for category
   */
  private getCategoryDisplayName(category: MetricCategory): string {
    const names: Record<MetricCategory, string> = {
      'performance': 'Performance Optimization',
      'optimization': 'Code Optimization',
      'code-quality': 'Code Quality Standards',
      'deployment': 'Deployment Efficiency',
      'collaboration': 'Team Collaboration',
      'security': 'Security Best Practices'
    };
    return names[category];
  }

  /**
   * Get details for a metric
   */
  private getMetricDetails(category: MetricCategory, score: number): string {
    const details: Record<MetricCategory, string> = {
      'performance': `Application performance score: ${score}/100. Load time optimization and runtime efficiency.`,
      'optimization': `Code optimization level: ${score}/100. Memory usage, algorithm efficiency, and resource management.`,
      'code-quality': `Code quality metrics: ${score}/100. Maintainability, readability, and best practices adherence.`,
      'deployment': `Deployment automation: ${score}/100. CI/CD pipeline efficiency and deployment success rate.`,
      'collaboration': `Team collaboration score: ${score}/100. Code reviews, documentation, and knowledge sharing.`,
      'security': `Security compliance: ${score}/100. Vulnerability management and security best practices.`
    };
    return details[category];
  }

  /**
   * Create a new veteran grade snapshot
   */
  async createSnapshot(request: CreateSnapshotRequest): Promise<CreateSnapshotResponse> {
    try {
      // Generate metrics
      const metrics = this.generateSampleMetrics();

      // Calculate overall statistics
      const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);
      const averageScore = Math.round(totalScore / metrics.length);
      const overallGrade = this.calculateGrade(averageScore);
      const overallStatus = this.calculateStatus(averageScore);

      // Count status types
      const excellentCount = metrics.filter(m => m.status === 'excellent' || m.status === 'very-good').length;
      const goodCount = metrics.filter(m => m.status === 'good' || m.status === 'fair').length;
      const needsImprovementCount = metrics.filter(m => m.status === 'needs-improvement' || m.status === 'poor').length;

      // Get previous snapshot for comparison
      let comparison = undefined;
      if (request.includeHistory) {
        const history = await this.getSnapshotHistory(request.userId);
        if (history.snapshots.length > 0) {
          const previous = history.snapshots[0];
          comparison = {
            previousSnapshotId: previous.id,
            previousScore: previous.overallScore,
            scoreDelta: averageScore - previous.overallScore,
            trend: (averageScore > previous.overallScore ? 'improving' : 
                   averageScore < previous.overallScore ? 'declining' : 'stable') as 'improving' | 'stable' | 'declining'
          };
        }
      }

      // Create snapshot
      const snapshot: VeteranGradeSnapshot = {
        id: generateId('snapshot'),
        userId: request.userId,
        experienceLevel: request.experienceLevel || 'veteran',
        timestamp: new Date(),
        overallScore: averageScore,
        overallGrade,
        overallStatus,
        metrics,
        summary: {
          totalMetrics: metrics.length,
          excellentCount,
          goodCount,
          needsImprovementCount,
          averageScore
        },
        comparison,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: '1.0.0',
          source: request.source || 'manual'
        }
      };

      // Save snapshot
      await this.saveSnapshot(snapshot);

      return {
        success: true,
        snapshot,
        message: 'Veteran grade snapshot created successfully'
      };
    } catch (error) {
      console.error('Error creating veteran grade snapshot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create snapshot'
      };
    }
  }

  /**
   * Save snapshot to local storage
   */
  private async saveSnapshot(snapshot: VeteranGradeSnapshot): Promise<void> {
    try {
      const snapshots = this.loadSnapshots();
      snapshots.unshift(snapshot); // Add to beginning

      // Keep only the latest MAX_SNAPSHOTS
      if (snapshots.length > this.MAX_SNAPSHOTS) {
        snapshots.splice(this.MAX_SNAPSHOTS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshots));
    } catch (error) {
      console.error('Error saving snapshot:', error);
      throw new Error('Failed to save snapshot');
    }
  }

  /**
   * Load all snapshots from storage
   */
  private loadSnapshots(): VeteranGradeSnapshot[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const snapshots = JSON.parse(data);
      // Convert date strings back to Date objects
      return snapshots.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
        metadata: {
          ...s.metadata,
          createdAt: new Date(s.metadata.createdAt),
          updatedAt: new Date(s.metadata.updatedAt)
        },
        metrics: s.metrics.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading snapshots:', error);
      return [];
    }
  }

  /**
   * Get snapshot history for a user
   */
  async getSnapshotHistory(userId: string, limit?: number): Promise<SnapshotHistory> {
    try {
      const allSnapshots = this.loadSnapshots();
      const userSnapshots = allSnapshots.filter(s => s.userId === userId);
      
      // Apply limit if specified
      const snapshots = limit ? userSnapshots.slice(0, limit) : userSnapshots;

      if (snapshots.length === 0) {
        return {
          snapshots: [],
          totalCount: 0,
          period: {
            start: new Date(),
            end: new Date()
          },
          trends: {
            overallTrend: 'stable',
            categoryTrends: {}
          }
        };
      }

      // Calculate trends
      const overallTrend = this.calculateOverallTrend(snapshots);
      const categoryTrends = this.calculateCategoryTrends(snapshots);

      return {
        snapshots,
        totalCount: userSnapshots.length,
        period: {
          start: snapshots[snapshots.length - 1].timestamp,
          end: snapshots[0].timestamp
        },
        trends: {
          overallTrend,
          categoryTrends
        }
      };
    } catch (error) {
      console.error('Error getting snapshot history:', error);
      throw new Error('Failed to retrieve snapshot history');
    }
  }

  /**
   * Calculate overall trend from snapshots
   */
  private calculateOverallTrend(snapshots: VeteranGradeSnapshot[]): 'improving' | 'stable' | 'declining' {
    if (snapshots.length < 2) return 'stable';

    const recent = snapshots.slice(0, Math.min(5, snapshots.length));
    const scores = recent.map(s => s.overallScore);
    
    // Calculate simple linear trend
    let improving = 0;
    let declining = 0;
    
    for (let i = 1; i < scores.length; i++) {
      if (scores[i - 1] > scores[i]) improving++;
      else if (scores[i - 1] < scores[i]) declining++;
    }

    if (improving > declining) return 'improving';
    if (declining > improving) return 'declining';
    return 'stable';
  }

  /**
   * Calculate category-specific trends
   */
  private calculateCategoryTrends(snapshots: VeteranGradeSnapshot[]) {
    const categories: MetricCategory[] = [
      'performance',
      'optimization',
      'code-quality',
      'deployment',
      'collaboration',
      'security'
    ];

    const trends: Record<string, any> = {};

    categories.forEach(category => {
      const categoryMetrics = snapshots.flatMap(s => 
        s.metrics.filter(m => m.category === category)
      );

      if (categoryMetrics.length === 0) return;

      const avgScore = Math.round(
        categoryMetrics.reduce((sum, m) => sum + m.score, 0) / categoryMetrics.length
      );

      // Determine trend
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (categoryMetrics.length >= 2) {
        const recent = categoryMetrics.slice(0, 3);
        const scores = recent.map(m => m.score);
        const first = scores[scores.length - 1];
        const last = scores[0];
        
        if (last > first + 2) trend = 'improving';
        else if (last < first - 2) trend = 'declining';
      }

      trends[category] = {
        trend,
        averageScore: avgScore
      };
    });

    return trends;
  }

  /**
   * Get latest snapshot for a user
   */
  async getLatestSnapshot(userId: string): Promise<VeteranGradeSnapshot | null> {
    try {
      const snapshots = this.loadSnapshots();
      const userSnapshots = snapshots.filter(s => s.userId === userId);
      return userSnapshots.length > 0 ? userSnapshots[0] : null;
    } catch (error) {
      console.error('Error getting latest snapshot:', error);
      return null;
    }
  }

  /**
   * Delete all snapshots for a user
   */
  async deleteUserSnapshots(userId: string): Promise<boolean> {
    try {
      const allSnapshots = this.loadSnapshots();
      const filtered = allSnapshots.filter(s => s.userId !== userId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting user snapshots:', error);
      return false;
    }
  }
}

// Export singleton instance
export const VeteranGradeSnapshotService = new VeteranGradeSnapshotServiceClass();
export default VeteranGradeSnapshotService;
