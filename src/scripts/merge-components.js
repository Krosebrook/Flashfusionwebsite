#!/usr/bin/env node

/**
 * Component Merge Helper
 * Safely merges components from another project while preserving FlashFusion UI
 */

import fs from 'fs';
import path from 'path';

class ComponentMerger {
  constructor(sourcePath, targetPath = './integration/components') {
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;
    this.mergeLog = [];
  }

  async merge() {
    console.log('🔄 Starting component merge...');
    
    // Ensure target directory exists
    if (!fs.existsSync(this.targetPath)) {
      fs.mkdirSync(this.targetPath, { recursive: true });
    }
    
    try {
      await this.copyComponents();
      await this.generateAdapters();
      this.saveMergeLog();
      
      console.log('✅ Component merge complete!');
      console.log('📝 Check integration/merge-log.json for details');
    } catch (error) {
      console.error('❌ Merge failed:', error.message);
    }
  }

  async copyComponents() {
    const componentsPath = path.join(this.sourcePath, 'components');
    
    if (!fs.existsSync(componentsPath)) {
      console.log('⚠️  No components directory found in source project');
      return;
    }
    
    this.copyDirectory(componentsPath, this.targetPath);
  }

  copyDirectory(source, target) {
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        this.copyDirectory(sourcePath, targetPath);
      } else if (item.match(/\.(tsx|jsx|ts|js)$/)) {
        this.copyAndAdaptComponent(sourcePath, targetPath);
      }
    }
  }

  copyAndAdaptComponent(source, target) {
    let content = fs.readFileSync(source, 'utf8');
    const fileName = path.basename(source);
    
    console.log(`📄 Processing: ${fileName}`);
    
    // Adapt imports to use FlashFusion UI components
    content = this.adaptImports(content);
    
    // Adapt styling to use FlashFusion classes
    content = this.adaptStyling(content);
    
    // Add FlashFusion theme compatibility
    content = this.addThemeCompatibility(content);
    
    fs.writeFileSync(target, content);
    
    this.mergeLog.push({
      file: fileName,
      source,
      target,
      adaptations: ['imports', 'styling', 'theme']
    });
  }

  adaptImports(content) {
    // Replace common UI imports with FlashFusion equivalents
    const replacements = [
      { from: /import.*Button.*from.*['"].*button.*['"];?/g, to: "import { Button } from '../../components/ui/button';" },
      { from: /import.*Card.*from.*['"].*card.*['"];?/g, to: "import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';" },
      { from: /import.*Input.*from.*['"].*input.*['"];?/g, to: "import { Input } from '../../components/ui/input';" },
      { from: /import.*Dialog.*from.*['"].*dialog.*['"];?/g, to: "import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';" }
    ];
    
    let adaptedContent = content;
    
    replacements.forEach(({ from, to }) => {
      adaptedContent = adaptedContent.replace(from, to);
    });
    
    return adaptedContent;
  }

  adaptStyling(content) {
    // Replace common CSS classes with FlashFusion equivalents
    const classReplacements = [
      { from: /className=["']([^"']*\b)bg-blue-([^"']*)/g, to: 'className="$1bg-primary$2' },
      { from: /className=["']([^"']*\b)text-blue-([^"']*)/g, to: 'className="$1text-primary$2' },
      { from: /className=["']([^"']*\b)border-blue-([^"']*)/g, to: 'className="$1border-primary$2' },
      { from: /className=["']([^"']*\b)hover:bg-blue-([^"']*)/g, to: 'className="$1ff-hover-glow$2' }
    ];
    
    let adaptedContent = content;
    
    classReplacements.forEach(({ from, to }) => {
      adaptedContent = adaptedContent.replace(from, to);
    });
    
    return adaptedContent;
  }

  addThemeCompatibility(content) {
    // Add FlashFusion theme wrapper if component doesn't have it
    if (!content.includes('ff-') && content.includes('export')) {
      // Find the main component export
      const componentMatch = content.match(/export\s+(?:const|function)\s+(\w+)/);
      
      if (componentMatch) {
        const componentName = componentMatch[1];
        
        // Wrap component with FlashFusion theming
        content = content.replace(
          new RegExp(`export\\s+(?:const|function)\\s+${componentName}`),
          `// FlashFusion theme compatibility wrapper
const Enhanced${componentName} = (props: any) => {
  return (
    <div className="ff-component-wrapper">
      <Original${componentName} {...props} />
    </div>
  );
};

const Original${componentName}`
        );
        
        // Update the export
        content += `\nexport { Enhanced${componentName} as ${componentName} };`;
      }
    }
    
    return content;
  }

  async generateAdapters() {
    console.log('🔧 Generating FlashFusion adapters...');
    
    const adapterTemplate = this.createAdapterTemplate();
    
    fs.writeFileSync(
      path.join(this.targetPath, 'flashfusion-adapters.tsx'),
      adapterTemplate
    );
  }

  createAdapterTemplate() {
    return `
/**
 * FlashFusion Component Adapters
 * Provides unified interface for merged components
 */

import React from 'react';

// FlashFusion Theme Provider for merged components
export const FlashFusionThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="ff-merged-components">
      {children}
    </div>
  );
};

// HOC to apply FlashFusion styling to merged components
export const withFlashFusionTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <FlashFusionThemeProvider>
      <div className="ff-component-adapter">
        <Component {...props} />
      </div>
    </FlashFusionThemeProvider>
  );
};

// Style adapter utilities
export const adaptToFlashFusionStyle = (className: string): string => {
  return className
    .replace(/\\bbg-blue-\\d+\\b/g, 'bg-primary')
    .replace(/\\btext-blue-\\d+\\b/g, 'text-primary')
    .replace(/\\bborder-blue-\\d+\\b/g, 'border-primary')
    .replace(/\\bhover:bg-blue-\\d+\\b/g, 'ff-hover-glow');
};

// Props adapter for common patterns
export const adaptProps = (props: any) => {
  const adapted = { ...props };
  
  // Adapt common prop patterns
  if (adapted.variant === 'primary') {
    adapted.className = \`\${adapted.className || ''} ff-btn-primary\`;
  }
  
  if (adapted.variant === 'secondary') {
    adapted.className = \`\${adapted.className || ''} ff-btn-secondary\`;
  }
  
  return adapted;
};
`;
  }

  saveMergeLog() {
    fs.writeFileSync(
      './integration/merge-log.json',
      JSON.stringify(this.mergeLog, null, 2)
    );
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('Usage: node merge-components.js <path-to-other-project>');
  process.exit(1);
}

const sourcePath = process.argv[2];

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Path does not exist: ${sourcePath}`);
  process.exit(1);
}

const merger = new ComponentMerger(sourcePath);
merger.merge();
`;
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('Usage: node merge-components.js <path-to-other-project>');
  process.exit(1);
}

const sourcePath = process.argv[2];

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Path does not exist: ${sourcePath}`);
  process.exit(1);
}

const merger = new ComponentMerger(sourcePath);
merger.merge();