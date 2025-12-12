/**
 * @fileoverview Custom hook for documentation generation
 * @chunk launch
 * @category marketing
 *
 * Extracted during Step 3: Component Decomposition - Phase 3
 * Manages state and operations for documentation generation
 */

import { useState, useCallback } from 'react';
import {
  getDocumentationContent,
  getDocumentationFilename,
  generatePressKitContent,
  type DocumentationType,
} from '../LaunchPreparationHub.logic';

/**
 * Generated document metadata
 */
interface GeneratedDocument {
  id: string;
  type: DocumentationType | 'press-kit';
  filename: string;
  content: string;
  generatedAt: Date;
}

/**
 * Custom hook for documentation generation
 * @returns Documentation generation state and functions
 */
export function useDocumentationGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);
  const [currentDocType, setCurrentDocType] = useState<DocumentationType | 'press-kit' | null>(
    null
  );

  /**
   * Generate comprehensive documentation
   */
  const generateDocumentation = useCallback(async (type: DocumentationType) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentDocType(type);

    try {
      const progressSteps = [20, 40, 60, 80, 100];

      // Simulate progressive generation with visual feedback
      for (let i = 0; i < progressSteps.length; i++) {
        setGenerationProgress(progressSteps[i]);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Generate content using logic functions
      const content = getDocumentationContent(type);
      const filename = getDocumentationFilename(type);

      // Store generated document
      const generatedDoc: GeneratedDocument = {
        id: `${type}-${Date.now()}`,
        type,
        filename,
        content,
        generatedAt: new Date(),
      };

      setGeneratedDocs((prev) => [...prev, generatedDoc]);

      // Create download
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`✅ Generated ${type} documentation successfully`);
      return generatedDoc;
    } catch (error) {
      console.error(`❌ Failed to generate ${type} documentation:`, error);
      throw error;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentDocType(null);
    }
  }, []);

  /**
   * Generate press kit
   */
  const generatePressKit = useCallback(() => {
    setCurrentDocType('press-kit');

    try {
      // Generate content using logic function
      const content = generatePressKitContent();
      const filename = 'FlashFusion-Press-Kit.md';

      // Store generated document
      const generatedDoc: GeneratedDocument = {
        id: `press-kit-${Date.now()}`,
        type: 'press-kit',
        filename,
        content,
        generatedAt: new Date(),
      };

      setGeneratedDocs((prev) => [...prev, generatedDoc]);

      // Create download
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Generated press kit successfully');
      return generatedDoc;
    } catch (error) {
      console.error('❌ Failed to generate press kit:', error);
      throw error;
    } finally {
      setCurrentDocType(null);
    }
  }, []);

  /**
   * Download a previously generated document
   */
  const downloadDocumentation = useCallback((doc: GeneratedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  /**
   * Preview documentation content (returns content for display)
   */
  const previewDocumentation = useCallback((doc: GeneratedDocument) => {
    return doc.content;
  }, []);

  /**
   * Delete a generated document from history
   */
  const deleteGeneratedDoc = useCallback((docId: string) => {
    setGeneratedDocs((prev) => prev.filter((doc) => doc.id !== docId));
  }, []);

  /**
   * Clear all generated documents
   */
  const clearAllDocs = useCallback(() => {
    setGeneratedDocs([]);
  }, []);

  /**
   * Get generated documents by type
   */
  const getDocsByType = useCallback(
    (type: DocumentationType | 'press-kit') => {
      return generatedDocs.filter((doc) => doc.type === type);
    },
    [generatedDocs]
  );

  return {
    // State
    isGenerating,
    generationProgress,
    generatedDocs,
    currentDocType,

    // Generation functions
    generateDocumentation,
    generatePressKit,

    // Document management
    downloadDocumentation,
    previewDocumentation,
    deleteGeneratedDoc,
    clearAllDocs,
    getDocsByType,
  };
}
