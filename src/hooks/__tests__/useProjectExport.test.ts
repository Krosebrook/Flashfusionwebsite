import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { createProjectZip } from '../useProjectExport';
import type { CodeProject } from '../../types/code-generation';

describe('createProjectZip', () => {
  it('creates a zip with project files', async () => {
    const project: CodeProject = {
      name: 'Sample Project',
      description: 'Test project',
      files: [
        {
          path: 'src/index.ts',
          content: 'console.log("hello");',
          language: 'typescript',
          size: 24
        },
        {
          path: 'README.md',
          content: '# Sample',
          language: 'markdown',
          size: 8
        }
      ],
      dependencies: [],
      scripts: {},
      framework: 'react',
      language: 'typescript',
      features: []
    };

    const blob = await createProjectZip(project);
    const zip = await JSZip.loadAsync(blob);

    expect(zip.file('src/index.ts')).toBeTruthy();
    expect(zip.file('README.md')).toBeTruthy();
  });

  it('throws when project has no files', async () => {
    const project: CodeProject = {
      name: 'Empty Project',
      description: 'No files',
      files: [],
      dependencies: [],
      scripts: {},
      framework: 'react',
      language: 'typescript',
      features: []
    };

    await expect(createProjectZip(project)).rejects.toThrow('Project has no files');
  });
});
