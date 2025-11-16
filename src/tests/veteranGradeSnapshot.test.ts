/**
 * @fileoverview Tests for Veteran Grade Snapshot Service
 * @category tests
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VeteranGradeSnapshotService } from '../services/VeteranGradeSnapshotService';

describe('VeteranGradeSnapshotService', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('createSnapshot', () => {
    it('should create a new snapshot successfully', async () => {
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran',
        includeHistory: false,
        source: 'manual'
      });

      expect(response.success).toBe(true);
      expect(response.snapshot).toBeDefined();
      expect(response.snapshot?.userId).toBe(testUserId);
      expect(response.snapshot?.experienceLevel).toBe('veteran');
    });

    it('should generate metrics for all categories', async () => {
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      expect(response.snapshot?.metrics).toBeDefined();
      expect(response.snapshot?.metrics.length).toBe(6); // 6 categories

      const categories = response.snapshot?.metrics.map(m => m.category);
      expect(categories).toContain('performance');
      expect(categories).toContain('optimization');
      expect(categories).toContain('code-quality');
      expect(categories).toContain('deployment');
      expect(categories).toContain('collaboration');
      expect(categories).toContain('security');
    });

    it('should calculate overall score correctly', async () => {
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      expect(response.snapshot?.overallScore).toBeGreaterThanOrEqual(0);
      expect(response.snapshot?.overallScore).toBeLessThanOrEqual(100);
      expect(response.snapshot?.overallGrade).toBeDefined();
      expect(response.snapshot?.overallStatus).toBeDefined();
    });

    it('should include summary statistics', async () => {
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      const summary = response.snapshot?.summary;
      expect(summary).toBeDefined();
      expect(summary?.totalMetrics).toBe(6);
      expect(summary?.averageScore).toBeGreaterThanOrEqual(0);
      expect(summary?.averageScore).toBeLessThanOrEqual(100);
    });
  });

  describe('getLatestSnapshot', () => {
    it('should return null when no snapshots exist', async () => {
      const snapshot = await VeteranGradeSnapshotService.getLatestSnapshot(testUserId);
      expect(snapshot).toBeNull();
    });

    it('should return the latest snapshot after creation', async () => {
      // Create a snapshot
      await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      // Retrieve it
      const snapshot = await VeteranGradeSnapshotService.getLatestSnapshot(testUserId);
      expect(snapshot).toBeDefined();
      expect(snapshot?.userId).toBe(testUserId);
    });
  });

  describe('getSnapshotHistory', () => {
    it('should return empty history when no snapshots exist', async () => {
      const history = await VeteranGradeSnapshotService.getSnapshotHistory(testUserId);
      
      expect(history.snapshots).toEqual([]);
      expect(history.totalCount).toBe(0);
      expect(history.trends.overallTrend).toBe('stable');
    });

    it('should return snapshots in chronological order', async () => {
      // Create multiple snapshots
      await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      const history = await VeteranGradeSnapshotService.getSnapshotHistory(testUserId);
      
      expect(history.snapshots.length).toBe(2);
      expect(history.totalCount).toBe(2);
      
      // Verify chronological order (newest first)
      const timestamps = history.snapshots.map(s => s.timestamp.getTime());
      expect(timestamps[0]).toBeGreaterThanOrEqual(timestamps[1]);
    });

    it('should calculate trends correctly', async () => {
      // Create multiple snapshots
      for (let i = 0; i < 3; i++) {
        await VeteranGradeSnapshotService.createSnapshot({
          userId: testUserId,
          experienceLevel: 'veteran'
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const history = await VeteranGradeSnapshotService.getSnapshotHistory(testUserId);
      
      expect(history.trends).toBeDefined();
      expect(history.trends.overallTrend).toMatch(/improving|stable|declining/);
      expect(history.trends.categoryTrends).toBeDefined();
    });
  });

  describe('deleteUserSnapshots', () => {
    it('should delete all snapshots for a user', async () => {
      // Create snapshots
      await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran'
      });

      // Verify they exist
      let snapshot = await VeteranGradeSnapshotService.getLatestSnapshot(testUserId);
      expect(snapshot).toBeDefined();

      // Delete them
      const success = await VeteranGradeSnapshotService.deleteUserSnapshots(testUserId);
      expect(success).toBe(true);

      // Verify they're gone
      snapshot = await VeteranGradeSnapshotService.getLatestSnapshot(testUserId);
      expect(snapshot).toBeNull();
    });
  });

  describe('snapshot with comparison', () => {
    it('should include comparison data when includeHistory is true', async () => {
      // Create first snapshot
      await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran',
        includeHistory: false
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Create second snapshot with history
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: testUserId,
        experienceLevel: 'veteran',
        includeHistory: true
      });

      expect(response.snapshot?.comparison).toBeDefined();
      expect(response.snapshot?.comparison?.previousSnapshotId).toBeDefined();
      expect(response.snapshot?.comparison?.previousScore).toBeDefined();
      expect(response.snapshot?.comparison?.scoreDelta).toBeDefined();
      expect(response.snapshot?.comparison?.trend).toMatch(/improving|stable|declining/);
    });
  });
});
