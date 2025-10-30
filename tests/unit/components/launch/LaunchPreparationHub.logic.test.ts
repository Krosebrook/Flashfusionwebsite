/**
 * @fileoverview Unit tests for LaunchPreparationHub business logic
 * @category test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateLaunchReadiness,
  getCompletionScore,
  calculateOverallProgress,
  getDocumentationFilename,
  generateUserManualContent,
  generateApiDocsContent,
  generateTutorialScriptsContent,
  generateFAQContent,
  generatePressKitContent,
  getDocumentationContent,
  validateDocumentationRequest,
  formatGeneratedContent,
  processMarketingCopy,
  mapAssetsToTimeline,
  calculateCampaignROI,
  aggregateSupportMetrics,
  getAssetStatistics,
  filterAssets,
  type DocumentationType,
} from '@/components/launch/LaunchPreparationHub.logic';
import type {
  LaunchChecklistCategory,
  LaunchAsset,
  MarketingCampaign,
  SupportChannel,
} from '@/components/launch/LaunchPreparationHub.types';

describe('LaunchPreparationHub.logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateLaunchReadiness', () => {
    it('should return 0 for empty checklist', () => {
      const checklist: LaunchChecklistCategory[] = [];
      expect(calculateLaunchReadiness(checklist)).toBe(0);
    });

    it('should calculate readiness percentage for checklist with items', () => {
      const checklist: LaunchChecklistCategory[] = [
        { category: 'Documentation', items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'] },
        { category: 'Marketing', items: ['Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'] },
      ];
      const readiness = calculateLaunchReadiness(checklist);
      expect(readiness).toBeGreaterThanOrEqual(0);
      expect(readiness).toBeLessThanOrEqual(100);
    });

    it('should round readiness percentage for uneven completion estimates', () => {
      const checklist: LaunchChecklistCategory[] = [
        { category: 'Docs', items: ['Item 1'] },
      ];

      expect(calculateLaunchReadiness(checklist)).toBe(78);
    });
  });

  describe('getCompletionScore', () => {
    it('should return 0 for empty items array', () => {
      expect(getCompletionScore([], 0)).toBe(0);
    });

    it('should calculate correct completion percentage', () => {
      const items = Array(10).fill(null);
      expect(getCompletionScore(items, 5)).toBe(50);
      expect(getCompletionScore(items, 10)).toBe(100);
      expect(getCompletionScore(items, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      const items = Array(3).fill(null);
      expect(getCompletionScore(items, 1)).toBe(33); // 33.33... rounded to 33
      expect(getCompletionScore(items, 2)).toBe(67); // 66.66... rounded to 67
    });

    it('should allow completed items to exceed total and reflect percentage', () => {
      const items = Array(4).fill(null);
      expect(getCompletionScore(items, 6)).toBe(150);
    });
  });

  describe('calculateOverallProgress', () => {
    it('should calculate average of all metrics', () => {
      const metrics = {
        assets: 80,
        campaigns: 60,
        support: 70,
        legal: 90,
      };
      expect(calculateOverallProgress(metrics)).toBe(75);
    });

    it('should handle all zeros', () => {
      const metrics = {
        assets: 0,
        campaigns: 0,
        support: 0,
        legal: 0,
      };
      expect(calculateOverallProgress(metrics)).toBe(0);
    });

    it('should handle all 100s', () => {
      const metrics = {
        assets: 100,
        campaigns: 100,
        support: 100,
        legal: 100,
      };
      expect(calculateOverallProgress(metrics)).toBe(100);
    });

    it('should support negative values and round results', () => {
      const metrics = {
        assets: -10,
        campaigns: 20,
        support: 30,
        legal: 40,
      };
      expect(calculateOverallProgress(metrics)).toBe(20);
    });
  });

  describe('getDocumentationFilename', () => {
    it('should return correct filename for user-manual', () => {
      expect(getDocumentationFilename('user-manual')).toBe('FlashFusion-User-Manual.md');
    });

    it('should return correct filename for api-docs', () => {
      expect(getDocumentationFilename('api-docs')).toBe('FlashFusion-API-Documentation.md');
    });

    it('should return correct filename for tutorials', () => {
      expect(getDocumentationFilename('tutorials')).toBe(
        'FlashFusion-Video-Tutorials-Script.md'
      );
    });

    it('should return correct filename for faq', () => {
      expect(getDocumentationFilename('faq')).toBe(
        'FlashFusion-FAQ-and-Troubleshooting.md'
      );
    });

    it('should fall back to default filename for unknown types', () => {
      expect(getDocumentationFilename('unsupported' as DocumentationType)).toBe(
        'FlashFusion-Documentation.md'
      );
    });
  });

  describe('generate documentation content helpers', () => {
    it('should include primary heading in generated user manual', () => {
      const content = generateUserManualContent();
      expect(content).toContain('# FlashFusion User Manual');
      expect(content).toContain('Complete Guide to AI-Powered Development');
    });

    it('should describe API base URL in generated API docs', () => {
      const content = generateApiDocsContent();
      expect(content).toContain('# FlashFusion API Documentation');
      expect(content).toContain('https://api.flashfusion.ai/v1');
    });

    it('should provide tutorial headings in generated scripts', () => {
      const content = generateTutorialScriptsContent();
      expect(content).toContain('# FlashFusion Video Tutorials - Production Scripts');
      expect(content).toContain('## Tutorial 1: Getting Started');
    });

    it('should outline question categories in generated FAQ', () => {
      const content = generateFAQContent();
      expect(content).toContain('# FlashFusion FAQ & Troubleshooting Guide');
      expect(content).toContain('Account & Billing');
    });

    it('should surface press contact information in generated press kit', () => {
      const content = generatePressKitContent();
      expect(content).toContain('# FlashFusion Press Kit');
      expect(content).toContain('press@flashfusion.ai');
    });
  });

  describe('validateDocumentationRequest', () => {
    it('should validate correct documentation types', () => {
      expect(validateDocumentationRequest('user-manual').valid).toBe(true);
      expect(validateDocumentationRequest('api-docs').valid).toBe(true);
      expect(validateDocumentationRequest('tutorials').valid).toBe(true);
      expect(validateDocumentationRequest('faq').valid).toBe(true);
    });

    it('should reject invalid documentation types', () => {
      const result = validateDocumentationRequest('invalid-type' as DocumentationType);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid documentation type');
    });

    it('should ignore optional specs payload when type is valid', () => {
      const result = validateDocumentationRequest('faq', { audience: 'beta-testers' });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('formatGeneratedContent', () => {
    it('should add metadata header to content', () => {
      const content = 'Test content';
      const formatted = formatGeneratedContent(content, 'test-type');

      expect(formatted).toContain('Generated:');
      expect(formatted).toContain('Type: test-type');
      expect(formatted).toContain('Generator: FlashFusion LaunchPreparationHub');
      expect(formatted).toContain(content);
    });

    it('should preserve original content', () => {
      const content = 'Test content with special characters: !@#$%';
      const formatted = formatGeneratedContent(content, 'test');
      expect(formatted).toContain(content);
    });

    it('should include ISO timestamp in metadata header', () => {
      vi.useFakeTimers();
      const timestamp = new Date('2024-06-01T12:34:56.000Z');
      vi.setSystemTime(timestamp);

      const formatted = formatGeneratedContent('content', 'type');

      expect(formatted).toContain(timestamp.toISOString());
    });
  });

  describe('processMarketingCopy', () => {
    it('should replace template variables', () => {
      const template = 'Hello {{name}}, welcome to {{product}}!';
      const variables = { name: 'John', product: 'FlashFusion' };
      const result = processMarketingCopy(template, variables);

      expect(result).toBe('Hello John, welcome to FlashFusion!');
    });

    it('should handle multiple occurrences of same variable', () => {
      const template = '{{name}} is great! {{name}} is awesome!';
      const variables = { name: 'FlashFusion' };
      const result = processMarketingCopy(template, variables);

      expect(result).toBe('FlashFusion is great! FlashFusion is awesome!');
    });

    it('should leave unreplaced variables as is', () => {
      const template = 'Hello {{name}}, {{greeting}}';
      const variables = { name: 'John' };
      const result = processMarketingCopy(template, variables);

      expect(result).toContain('Hello John');
      expect(result).toContain('{{greeting}}');
    });

    it('should return original template when variables map is empty', () => {
      const template = 'Static copy for FlashFusion';
      expect(processMarketingCopy(template, {})).toBe(template);
    });
  });

  describe('calculateCampaignROI', () => {
    const mockCampaign: MarketingCampaign = {
      id: '1',
      name: 'Test Campaign',
      type: 'social',
      status: 'active',
      reach: 10000,
      engagement: 5,
      budget: 1000,
      roi: 0,
      startDate: new Date(),
      endDate: new Date(),
    };

    it('should calculate ROI correctly', () => {
      const result = calculateCampaignROI(mockCampaign);

      expect(result.roi).toBeDefined();
      expect(typeof result.roi).toBe('number');
    });

    it('should calculate profit', () => {
      const result = calculateCampaignROI(mockCampaign);

      expect(result.profit).toBeDefined();
      expect(typeof result.profit).toBe('number');
    });

    it('should calculate cost per engagement', () => {
      const result = calculateCampaignROI(mockCampaign);

      expect(result.costPerEngagement).toBeDefined();
      expect(result.costPerEngagement).toBeGreaterThan(0);
    });

    it('should handle zero budget', () => {
      const zeroBudgetCampaign = { ...mockCampaign, budget: 0 };
      const result = calculateCampaignROI(zeroBudgetCampaign);

      expect(result.roi).toBe(0);
    });

    it('should handle zero engagement safely', () => {
      const noEngagementCampaign = { ...mockCampaign, engagement: 0 };
      const result = calculateCampaignROI(noEngagementCampaign);

      expect(result.costPerEngagement).toBe(0);
      expect(result.profit).toBeCloseTo(-mockCampaign.budget, 5);
    });
  });

  describe('aggregateSupportMetrics', () => {
    const mockChannels: SupportChannel[] = [
      {
        id: '1',
        name: 'Email Support',
        type: 'email',
        status: 'active',
        responseTime: '< 4 hours',
        satisfaction: 4.5,
        volume: 100,
      },
      {
        id: '2',
        name: 'Live Chat',
        type: 'chat',
        status: 'active',
        responseTime: '< 2 minutes',
        satisfaction: 4.8,
        volume: 200,
      },
      {
        id: '3',
        name: 'Phone Support',
        type: 'phone',
        status: 'setup',
        responseTime: '< 1 hour',
        satisfaction: 4.2,
        volume: 50,
      },
    ];

    it('should calculate total volume', () => {
      const result = aggregateSupportMetrics(mockChannels);
      expect(result.totalVolume).toBe(350);
    });

    it('should calculate average satisfaction', () => {
      const result = aggregateSupportMetrics(mockChannels);
      expect(result.averageSatisfaction).toBeCloseTo(4.5, 1);
    });

    it('should count active channels', () => {
      const result = aggregateSupportMetrics(mockChannels);
      expect(result.activeChannels).toBe(2);
    });

    it('should group channels by type', () => {
      const result = aggregateSupportMetrics(mockChannels);
      expect(result.channelsByType.email).toBe(1);
      expect(result.channelsByType.chat).toBe(1);
      expect(result.channelsByType.phone).toBe(1);
    });

    it('should handle empty channels array', () => {
      const result = aggregateSupportMetrics([]);
      expect(result.totalVolume).toBe(0);
      expect(result.averageSatisfaction).toBe(0);
      expect(result.activeChannels).toBe(0);
    });

    it('should count unknown channel types without crashing', () => {
      const result = aggregateSupportMetrics([
        {
          id: '4',
          name: 'Community Hub',
          type: 'community' as SupportChannel['type'],
          status: 'setup',
          responseTime: '< 24 hours',
          satisfaction: 3.2,
          volume: 40,
        },
      ]);

      expect(result.channelsByType.community).toBe(1);
    });
  });

  describe('getAssetStatistics', () => {
    const mockAssets: LaunchAsset[] = [
      {
        id: '1',
        type: 'documentation',
        title: 'User Manual',
        description: 'Complete user guide',
        status: 'approved',
        priority: 'high',
        progress: 100,
        tags: ['docs'],
      },
      {
        id: '2',
        type: 'video',
        title: 'Tutorial Video',
        description: 'Getting started tutorial',
        status: 'review',
        priority: 'medium',
        progress: 75,
        tags: ['video', 'tutorial'],
      },
      {
        id: '3',
        type: 'documentation',
        title: 'API Docs',
        description: 'API reference',
        status: 'draft',
        priority: 'high',
        progress: 50,
        tags: ['docs', 'api'],
      },
    ];

    it('should count total assets', () => {
      const result = getAssetStatistics(mockAssets);
      expect(result.total).toBe(3);
    });

    it('should group assets by status', () => {
      const result = getAssetStatistics(mockAssets);
      expect(result.byStatus.approved).toBe(1);
      expect(result.byStatus.review).toBe(1);
      expect(result.byStatus.draft).toBe(1);
    });

    it('should group assets by type', () => {
      const result = getAssetStatistics(mockAssets);
      expect(result.byType.documentation).toBe(2);
      expect(result.byType.video).toBe(1);
    });

    it('should group assets by priority', () => {
      const result = getAssetStatistics(mockAssets);
      expect(result.byPriority.high).toBe(2);
      expect(result.byPriority.medium).toBe(1);
    });

    it('should calculate average progress', () => {
      const result = getAssetStatistics(mockAssets);
      expect(result.averageProgress).toBe(75); // (100 + 75 + 50) / 3 = 75
    });

    it('should handle empty assets array', () => {
      const result = getAssetStatistics([]);
      expect(result.total).toBe(0);
      expect(result.averageProgress).toBe(0);
    });

    it('should round average progress to nearest integer', () => {
      const result = getAssetStatistics([
        {
          id: 'only',
          type: 'documentation',
          title: 'Single',
          description: 'Test asset',
          status: 'draft',
          priority: 'medium',
          progress: 33.6,
          tags: [],
        },
      ]);

      expect(result.averageProgress).toBe(34);
    });
  });

  describe('filterAssets', () => {
    const mockAssets: LaunchAsset[] = [
      {
        id: '1',
        type: 'documentation',
        title: 'User Manual',
        description: 'Complete user guide',
        status: 'approved',
        priority: 'high',
        progress: 100,
        tags: ['docs'],
      },
      {
        id: '2',
        type: 'video',
        title: 'Tutorial Video',
        description: 'Getting started tutorial',
        status: 'review',
        priority: 'medium',
        progress: 75,
        tags: ['video'],
      },
      {
        id: '3',
        type: 'documentation',
        title: 'API Docs',
        description: 'API reference',
        status: 'draft',
        priority: 'low',
        progress: 30,
        tags: ['docs'],
      },
    ];

    it('should filter by status', () => {
      const filtered = filterAssets(mockAssets, { status: ['approved'] });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('approved');
    });

    it('should filter by type', () => {
      const filtered = filterAssets(mockAssets, { type: ['documentation'] });
      expect(filtered).toHaveLength(2);
      expect(filtered.every((a) => a.type === 'documentation')).toBe(true);
    });

    it('should filter by priority', () => {
      const filtered = filterAssets(mockAssets, { priority: ['high', 'medium'] });
      expect(filtered).toHaveLength(2);
    });

    it('should filter by minimum progress', () => {
      const filtered = filterAssets(mockAssets, { minProgress: 50 });
      expect(filtered).toHaveLength(2);
      expect(filtered.every((a) => a.progress >= 50)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filtered = filterAssets(mockAssets, {
        type: ['documentation'],
        minProgress: 50,
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should return all assets with empty criteria', () => {
      const filtered = filterAssets(mockAssets, {});
      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no assets match criteria', () => {
      const filtered = filterAssets(mockAssets, { status: ['archived' as LaunchAsset['status']] });
      expect(filtered).toHaveLength(0);
    });
  });

  describe('mapAssetsToTimeline', () => {
    it('should map dated assets and sort chronologically', () => {
      const assets: LaunchAsset[] = [
        {
          id: 'doc',
          type: 'documentation',
          title: 'Doc',
          description: 'Doc',
          status: 'approved',
          priority: 'high',
          progress: 100,
          dueDate: new Date('2024-05-10'),
          tags: [],
        },
        {
          id: 'video',
          type: 'video',
          title: 'Video',
          description: 'Video',
          status: 'draft',
          priority: 'medium',
          progress: 20,
          dueDate: new Date('2024-04-15'),
          tags: [],
        },
        {
          id: 'no-date',
          type: 'image',
          title: 'Image',
          description: 'No due date',
          status: 'draft',
          priority: 'low',
          progress: 10,
          tags: [],
        },
      ];

      const timeline = mapAssetsToTimeline(assets);

      expect(timeline).toHaveLength(2);
      expect(timeline[0].title).toBe('Video');
      expect(timeline[1].title).toBe('Doc');
    });
  });

  describe('getDocumentationContent', () => {
    it('should route to specific generators for known types', () => {
      expect(getDocumentationContent('user-manual')).toContain('# FlashFusion User Manual');
      expect(getDocumentationContent('api-docs')).toContain('# FlashFusion API Documentation');
      expect(getDocumentationContent('tutorials')).toContain('# FlashFusion Video Tutorials - Production Scripts');
      expect(getDocumentationContent('faq')).toContain('# FlashFusion FAQ & Troubleshooting Guide');
    });

    it('should return empty string for unsupported type', () => {
      expect(getDocumentationContent('other' as DocumentationType)).toBe('');
    });
  });
});
