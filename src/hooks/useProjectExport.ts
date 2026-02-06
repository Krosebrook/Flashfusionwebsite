import { useCallback, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { CodeProject, GeneratedFile } from '../types/code-generation';

const DEFAULT_EXPORT_NAME = 'flashfusion-project';

const sanitizeProjectName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return DEFAULT_EXPORT_NAME;
  return trimmed.replace(/[^a-z0-9-_]/gi, '-').replace(/-+/g, '-').toLowerCase();
};

const sanitizeFilePath = (path: string): string => {
  const normalized = path.replace(/\\/g, '/').replace(/^\/*/, '');
  const segments = normalized
    .split('/')
    .filter(segment => segment && segment !== '.' && segment !== '..');
  return segments.join('/');
};

const addProjectFile = (zip: JSZip, file: GeneratedFile) => {
  const safePath = sanitizeFilePath(file.path);
  if (!safePath) return;
  zip.file(safePath, file.content);
};

export const createProjectZip = async (project: CodeProject): Promise<Blob> => {
  if (!project) {
    throw new Error('No project available for export.');
  }

  if (!project.files || project.files.length === 0) {
    throw new Error('Project has no files to export.');
  }

  const zip = new JSZip();
  project.files.forEach(file => addProjectFile(zip, file));

  const exportName = sanitizeProjectName(project.name || DEFAULT_EXPORT_NAME);
  zip.comment = `FlashFusion export: ${exportName}`;

  return zip.generateAsync({ type: 'blob' });
};

export const useProjectExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadProjectZip = useCallback(async (project: CodeProject) => {
    setIsExporting(true);
    setError(null);

    try {
      const blob = await createProjectZip(project);
      const exportName = sanitizeProjectName(project.name || DEFAULT_EXPORT_NAME);
      saveAs(blob, `${exportName}.zip`);
      return { success: true } as const;
    } catch (err) {
      const exportError = err instanceof Error ? err : new Error('Failed to export project.');
      setError(exportError);
      return { success: false, error: exportError } as const;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    error,
    downloadProjectZip
  };
};
