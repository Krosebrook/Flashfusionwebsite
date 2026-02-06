export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface CodeProject {
  name: string;
  description: string;
  files: GeneratedFile[];
  dependencies: string[];
  scripts: Record<string, string>;
  framework: string;
  language: string;
  features: string[];
}
