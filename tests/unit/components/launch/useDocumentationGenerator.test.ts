import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentationGenerator } from '@/components/launch/useDocumentationGenerator';

declare global {
  interface URL {
    createObjectURL?: (blob: Blob) => string;
    revokeObjectURL?: (url: string) => void;
  }
}

describe('useDocumentationGenerator', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalAnchorClick = HTMLAnchorElement.prototype.click;

  beforeEach(() => {
    vi.useFakeTimers();
    HTMLAnchorElement.prototype.click = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:mock-url'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
    });
    HTMLAnchorElement.prototype.click = originalAnchorClick;
  });

  it('should generate documentation with progressive state updates', async () => {
    const { result } = renderHook(() => useDocumentationGenerator());

    expect(result.current.isGenerating).toBe(false);

    let generatedId: string | undefined;

    await act(async () => {
      const generationPromise = result.current.generateDocumentation('user-manual');
      await vi.runAllTimersAsync();
      const generatedDoc = await generationPromise;
      generatedId = generatedDoc.id;
      expect(generatedDoc.type).toBe('user-manual');
      expect(generatedDoc.filename).toContain('User-Manual');
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generatedDocs.some((doc) => doc.id === generatedId)).toBe(true);
    expect(result.current.generationProgress).toBe(0);
  });

  it('should manage press kit generation and document lifecycle', () => {
    const { result } = renderHook(() => useDocumentationGenerator());

    let pressKitId = '';

    act(() => {
      const pressKit = result.current.generatePressKit();
      pressKitId = pressKit.id;
      expect(pressKit.type).toBe('press-kit');
      expect(pressKit.filename).toBe('FlashFusion-Press-Kit.md');
    });

    const pressKitDoc = result.current.generatedDocs.find((doc) => doc.id === pressKitId);
    expect(pressKitDoc).toBeDefined();
    expect(result.current.getDocsByType('press-kit')).toHaveLength(1);
    expect(result.current.previewDocumentation(pressKitDoc!)).toContain('# FlashFusion Press Kit');

    act(() => {
      result.current.downloadDocumentation(pressKitDoc!);
    });
    expect(URL.createObjectURL).toHaveBeenCalled();

    act(() => {
      result.current.deleteGeneratedDoc(pressKitId);
    });
    expect(result.current.generatedDocs.some((doc) => doc.id === pressKitId)).toBe(false);

    act(() => {
      result.current.clearAllDocs();
    });
    expect(result.current.generatedDocs).toHaveLength(0);
  });
});
