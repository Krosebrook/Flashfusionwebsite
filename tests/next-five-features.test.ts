import { describe, expect, it } from 'vitest';
import { getFeatureRisk, getProgressLabel, nextFiveFeatures } from '../src/components/roadmap/NextFiveFeatures';

describe('NextFiveFeatures helper utilities', () => {
  it('computes risk based on status and progress', () => {
    expect(getFeatureRisk({ ...nextFiveFeatures[0], progress: 20 })).toBe('high');
    expect(getFeatureRisk({ ...nextFiveFeatures[1], status: 'at-risk', progress: 55 })).toBe('medium');
    expect(getFeatureRisk({ ...nextFiveFeatures[2], status: 'on-track', progress: 70 })).toBe('low');
    expect(getFeatureRisk({ ...nextFiveFeatures[4], status: 'blocked' })).toBe('high');
  });

  it('labels progress stages correctly', () => {
    expect(getProgressLabel(10)).toBe('Discovery');
    expect(getProgressLabel(25)).toBe('Design');
    expect(getProgressLabel(45)).toBe('Integration');
    expect(getProgressLabel(65)).toBe('Build');
    expect(getProgressLabel(90)).toBe('Execution');
  });
});
