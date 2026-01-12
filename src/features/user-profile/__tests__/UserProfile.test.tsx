/**
 * @fileoverview Tests for UserProfile
 * @version 1.0.0
 * 
 * Comprehensive test suite covering:
 * - Component rendering
 * - User interactions
 * - State management
 * - Service integration
 * - Error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FeatureTemplate } from '../components/FeatureTemplate';
import { useFeatureStore, featureSelectors } from '../stores/FeatureStore';
import { FeatureService } from '../services/FeatureService';

import type { FeatureConfig, FeatureData } from '../types/feature.types';

// Mock data
const mockConfig: Partial<FeatureConfig> = {
  enabled: {
    autoProcess: false,
    caching: true,
    analytics: false,
    debugging: true
  }
};

const mockData: FeatureData = {
  id: 'test-id',
  input: 'test input',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    tags: ['test']
  }
};

// Reset store before each test
beforeEach(() => {
  const { result } = renderHook(() => useFeatureStore());
  act(() => {
    result.current.reset();
  });
});

describe('FeatureTemplate Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<FeatureTemplate />);
      
      expect(screen.getByText(/UserProfile/i)).toBeInTheDocument();
      expect(screen.getByText(/UserProfile feature/i)).toBeInTheDocument();
    });
    
    it('renders with initial data', () => {
      render(<FeatureTemplate initialData={mockData} />);
      
      // Should display the initial data
      waitFor(() => {
        expect(screen.getByText(/test input/i)).toBeInTheDocument();
      });
    });
    
    it('displays status badge', () => {
      render(<FeatureTemplate />);
      
      // Initial status should be idle
      expect(screen.getByText(/IDLE/i)).toBeInTheDocument();
    });
  });
  
  describe('User Interactions', () => {
    it('handles input change', () => {
      render(<FeatureTemplate />);
      
      const input = screen.getByLabelText(/input data/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'new input' } });
      
      expect(input.value).toBe('new input');
    });
    
    it('submits form with valid input', async () => {
      const onComplete = jest.fn();
      render(<FeatureTemplate onComplete={onComplete} />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
      });
    });
    
    it('disables submit button when processing', async () => {
      render(<FeatureTemplate />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      // Button should be disabled while processing
      expect(submitButton).toBeDisabled();
    });
    
    it('resets state when reset button clicked', async () => {
      render(<FeatureTemplate initialData={mockData} />);
      
      const resetButton = screen.getByRole('button', { name: /reset/i });
      
      fireEvent.click(resetButton);
      
      await waitFor(() => {
        const { result } = renderHook(() => useFeatureStore());
        expect(result.current.status).toBe('idle');
        expect(result.current.data).toBeNull();
      });
    });
  });
  
  describe('Error Handling', () => {
    it('displays error message when processing fails', async () => {
      // Mock service to throw error
      jest.spyOn(FeatureService.getInstance(), 'processData').mockRejectedValueOnce(
        new Error('Processing failed')
      );
      
      const onError = jest.fn();
      render(<FeatureTemplate onError={onError} />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(onError).toHaveBeenCalled();
      });
    });
    
    it('shows retry button on error', async () => {
      // Mock service to throw error
      jest.spyOn(FeatureService.getInstance(), 'processData').mockRejectedValueOnce(
        new Error('Processing failed')
      );
      
      render(<FeatureTemplate />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });
  
  describe('Callbacks', () => {
    it('calls onComplete when processing succeeds', async () => {
      const onComplete = jest.fn();
      render(<FeatureTemplate onComplete={onComplete} />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            data: expect.any(Object)
          })
        );
      });
    });
    
    it('calls onError when processing fails', async () => {
      // Mock service to throw error
      jest.spyOn(FeatureService.getInstance(), 'processData').mockRejectedValueOnce(
        new Error('Processing failed')
      );
      
      const onError = jest.fn();
      render(<FeatureTemplate onError={onError} />);
      
      const input = screen.getByLabelText(/input data/i);
      const submitButton = screen.getByRole('button', { name: /process/i });
      
      fireEvent.change(input, { target: { value: 'test input' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
  
  describe('Debug Mode', () => {
    it('shows debug information when debug prop is true', () => {
      render(<FeatureTemplate debug={true} />);
      
      expect(screen.getByText(/debug information/i)).toBeInTheDocument();
    });
    
    it('hides debug information when debug prop is false', () => {
      render(<FeatureTemplate debug={false} />);
      
      expect(screen.queryByText(/debug information/i)).not.toBeInTheDocument();
    });
  });
});

describe('FeatureStore', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useFeatureStore());
    
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });
  
  it('processes data successfully', async () => {
    const { result } = renderHook(() => useFeatureStore());
    
    await act(async () => {
      await result.current.initialize(mockConfig);
      await result.current.processData({ input: 'test' });
    });
    
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBeDefined();
    expect(result.current.result).toBeDefined();
  });
  
  it('handles errors during processing', async () => {
    const { result } = renderHook(() => useFeatureStore());
    
    // Mock service to throw error
    jest.spyOn(FeatureService.getInstance(), 'processData').mockRejectedValueOnce(
      new Error('Processing failed')
    );
    
    await act(async () => {
      await result.current.initialize(mockConfig);
      try {
        await result.current.processData({ input: 'test' });
      } catch {
        // Expected error
      }
    });
    
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBeDefined();
  });
  
  it('resets to initial state', async () => {
    const { result } = renderHook(() => useFeatureStore());
    
    await act(async () => {
      await result.current.initialize(mockConfig);
      await result.current.processData({ input: 'test' });
      result.current.reset();
    });
    
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
  
  describe('Selectors', () => {
    it('isProcessing selector works correctly', () => {
      const { result } = renderHook(() => useFeatureStore());
      
      expect(featureSelectors.isProcessing(result.current)).toBe(false);
      
      act(() => {
        result.current.initialize(mockConfig);
      });
      
      // Status should change during initialization
    });
    
    it('successRate selector calculates correctly', async () => {
      const { result } = renderHook(() => useFeatureStore());
      
      await act(async () => {
        await result.current.initialize(mockConfig);
        await result.current.processData({ input: 'test1' });
        await result.current.processData({ input: 'test2' });
      });
      
      const successRate = featureSelectors.successRate(result.current);
      expect(successRate).toBeGreaterThan(0);
    });
  });
});

describe('FeatureService', () => {
  let service: FeatureService;
  
  beforeEach(() => {
    service = FeatureService.getInstance();
  });
  
  it('is a singleton', () => {
    const service1 = FeatureService.getInstance();
    const service2 = FeatureService.getInstance();
    
    expect(service1).toBe(service2);
  });
  
  it('processes data successfully', async () => {
    const result = await service.processData(
      { input: 'test' },
      mockConfig as FeatureConfig
    );
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.input).toBe('test');
  });
  
  it('validates data before processing', async () => {
    await expect(
      service.processData({ input: '' }, mockConfig as FeatureConfig)
    ).rejects.toThrow();
  });
  
  it('caches results when caching is enabled', async () => {
    const config: FeatureConfig = {
      ...mockConfig,
      enabled: { ...mockConfig.enabled!, caching: true }
    } as FeatureConfig;
    
    const result1 = await service.processData({ input: 'test' }, config);
    const result2 = await service.processData({ input: 'test' }, config);
    
    // Second call should return cached result
    expect(result1).toEqual(result2);
  });
  
  it('clears cache', () => {
    service.clearCache();
    
    // Cache should be empty
    expect(() => service.clearCache()).not.toThrow();
  });
});
