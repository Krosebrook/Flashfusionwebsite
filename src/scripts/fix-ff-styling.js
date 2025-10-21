#!/usr/bin/env node

/**
 * FlashFusion Styling Auto-Fixer
 * Automatically fixes common styling issues to ensure FlashFusion brand compliance
 */

const fs = require('fs');
const path = require('path');

class FlashFusionStyleFixer {
  constructor() {
    this.fixes = 0;
    this.issues = [];
  }

  async scanAndFix() {
    console.log('🎨 FlashFusion Styling Auto-Fixer\n');
    console.log('=' .repeat(50));

    const componentsDir = './components';
    const files = this.getAllTsxFiles(componentsDir);
    
    console.log(`📁 Found ${files.length} .tsx files to check\n`);

    for (const file of files) {
      await this.fixFile(file);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Total fixes applied: ${this.fixes}`);
    console.log(`📋 Issues found: ${this.issues.length}`);
    
    if (this.issues.length > 0) {
      console.log('\n🔍 Remaining issues:');
      this.issues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }

    if (this.fixes > 0) {
      console.log('\n🎉 FlashFusion styling has been improved!');
      console.log('👀 Please review changes and test components');
    } else {
      console.log('\n✨ All components are already FlashFusion compliant!');
    }
  }

  getAllTsxFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllTsxFiles(fullPath));
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async fixFile(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      let content = originalContent;
      let fileFixes = 0;

      // Fix typography classes
      const typographyFixes = this.fixTypography(content);
      content = typographyFixes.content;
      fileFixes += typographyFixes.fixes;

      // Fix button classes
      const buttonFixes = this.fixButtons(content);
      content = buttonFixes.content;
      fileFixes += buttonFixes.fixes;

      // Fix card classes
      const cardFixes = this.fixCards(content);
      content = cardFixes.content;
      fileFixes += cardFixes.fixes;

      // Fix animation classes
      const animationFixes = this.fixAnimations(content);
      content = animationFixes.content;
      fileFixes += animationFixes.fixes;

      // Fix focus states
      const focusFixes = this.fixFocusStates(content);
      content = focusFixes.content;
      fileFixes += focusFixes.fixes;

      // Write back if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${path.basename(filePath)}: ${fileFixes} fixes applied`);
        this.fixes += fileFixes;
      }

    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  fixTypography(content) {
    let fixes = 0;
    
    // Replace generic text size classes with FlashFusion classes
    const textSizeReplacements = [
      { from: /\btext-xs\b/g, to: 'ff-text-xs' },
      { from: /\btext-sm\b/g, to: 'ff-text-sm' },
      { from: /\btext-base\b/g, to: 'ff-text-base' },
      { from: /\btext-lg\b/g, to: 'ff-text-lg' },
      { from: /\btext-xl\b/g, to: 'ff-text-xl' },
      { from: /\btext-2xl\b/g, to: 'ff-text-2xl' },
      { from: /\btext-3xl\b/g, to: 'ff-text-3xl' }
    ];

    textSizeReplacements.forEach(replacement => {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        fixes += matches.length;
      }
    });

    // Add font-sora to headings that don't have it
    const headingRegex = /<(h[1-6])\s+className="([^"]*)"(?!\s*[^>]*font-sora)/g;
    content = content.replace(headingRegex, (match, tag, classes) => {
      if (!classes.includes('font-sora')) {
        fixes++;
        return `<${tag} className="font-sora ${classes}"`;
      }
      return match;
    });

    // Add font-inter to paragraphs that don't have it
    const paragraphRegex = /<p\s+className="([^"]*)"(?!\s*[^>]*font-inter)/g;
    content = content.replace(paragraphRegex, (match, classes) => {
      if (!classes.includes('font-inter')) {
        fixes++;
        return `<p className="font-inter ${classes}"`;
      }
      return match;
    });

    // Add ff-text-gradient to main headings
    const mainHeadingRegex = /<h1\s+className="([^"]*)"(?!\s*[^>]*ff-text-gradient)/g;
    content = content.replace(mainHeadingRegex, (match, classes) => {
      if (!classes.includes('ff-text-gradient') && (classes.includes('font-bold') || classes.includes('font-semibold'))) {
        fixes++;
        return `<h1 className="${classes} ff-text-gradient"`;
      }
      return match;
    });

    return { content, fixes };
  }

  fixButtons(content) {
    let fixes = 0;

    // Replace generic button backgrounds with FlashFusion classes
    const buttonReplacements = [
      { from: /bg-blue-500/g, to: 'ff-btn-primary' },
      { from: /bg-blue-600/g, to: 'ff-btn-primary' },
      { from: /bg-cyan-500/g, to: 'ff-btn-secondary' },
      { from: /bg-cyan-600/g, to: 'ff-btn-secondary' },
      { from: /bg-pink-500/g, to: 'ff-btn-accent' },
      { from: /bg-pink-600/g, to: 'ff-btn-accent' }
    ];

    buttonReplacements.forEach(replacement => {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        fixes += matches.length;
      }
    });

    // Add font-sora to Button components that don't have it
    const buttonRegex = /<Button\s+([^>]*className="[^"]*")(?!\s*[^>]*font-sora)/g;
    content = content.replace(buttonRegex, (match, attributes) => {
      if (!match.includes('font-sora')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="font-sora $1"');
      }
      return match;
    });

    // Add hover effects to primary buttons
    const primaryButtonRegex = /<Button\s+([^>]*className="[^"]*ff-btn-primary[^"]*")(?!\s*[^>]*ff-hover-glow)/g;
    content = content.replace(primaryButtonRegex, (match, attributes) => {
      if (!match.includes('ff-hover-glow')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="$1 ff-hover-glow"');
      }
      return match;
    });

    return { content, fixes };
  }

  fixCards(content) {
    let fixes = 0;

    // Add ff-card-interactive to Card components that don't have it
    const cardRegex = /<Card\s+([^>]*className="[^"]*")(?!\s*[^>]*ff-card-interactive)/g;
    content = content.replace(cardRegex, (match, attributes) => {
      if (!match.includes('ff-card-interactive') && (match.includes('cursor-pointer') || match.includes('onClick'))) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="ff-card-interactive $1"');
      }
      return match;
    });

    // Add hover effects to interactive cards
    const interactiveCardRegex = /<Card\s+([^>]*className="[^"]*ff-card-interactive[^"]*")(?!\s*[^>]*ff-hover-lift)/g;
    content = content.replace(interactiveCardRegex, (match, attributes) => {
      if (!match.includes('ff-hover-lift') && !match.includes('ff-hover-scale')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="$1 ff-hover-lift"');
      }
      return match;
    });

    return { content, fixes };
  }

  fixAnimations(content) {
    let fixes = 0;

    // Add ff-stagger-fade to container divs with multiple children
    const containerRegex = /<div\s+className="([^"]*)"[^>]*>\s*{[^}]*\.map\(/g;
    content = content.replace(containerRegex, (match, classes) => {
      if (!classes.includes('ff-stagger-fade')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="ff-stagger-fade $1"');
      }
      return match;
    });

    return { content, fixes };
  }

  fixFocusStates(content) {
    let fixes = 0;

    // Add ff-focus-ring to Input components
    const inputRegex = /<Input\s+([^>]*className="[^"]*")(?!\s*[^>]*ff-focus-ring)/g;
    content = content.replace(inputRegex, (match, attributes) => {
      if (!match.includes('ff-focus-ring')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="ff-focus-ring $1"');
      }
      return match;
    });

    // Add ff-focus-ring to Textarea components
    const textareaRegex = /<Textarea\s+([^>]*className="[^"]*")(?!\s*[^>]*ff-focus-ring)/g;
    content = content.replace(textareaRegex, (match, attributes) => {
      if (!match.includes('ff-focus-ring')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="ff-focus-ring $1"');
      }
      return match;
    });

    // Add ff-focus-ring to Button components
    const buttonFocusRegex = /<Button\s+([^>]*className="[^"]*")(?!\s*[^>]*ff-focus-ring)/g;
    content = content.replace(buttonFocusRegex, (match, attributes) => {
      if (!match.includes('ff-focus-ring')) {
        fixes++;
        return match.replace(/className="([^"]*)"/, 'className="$1 ff-focus-ring"');
      }
      return match;
    });

    return { content, fixes };
  }
}

// Run the fixer
async function main() {
  const fixer = new FlashFusionStyleFixer();
  await fixer.scanAndFix();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FlashFusionStyleFixer;