/**
 * Accessibility Checker Utility
 * 
 * Ensures WCAG 2.1 AA compliance across the application
 * Provides runtime and build-time accessibility validation
 */

// ============================================
// Color Contrast Checker
// ============================================

/**
 * Calculate relative luminance of a color
 * Formula from WCAG 2.1 specification
 */
function getLuminance(color: string): number {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  // Apply gamma correction
  const [rs, gs, bs] = [r, g, b].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // Calculate relative luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio from 1:1 (no contrast) to 21:1 (maximum contrast)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): {
  passes: boolean;
  ratio: number;
  required: number;
} {
  const ratio = getContrastRatio(foreground, background);
  
  // WCAG 2.1 requirements
  const requirements = {
    'AA': isLargeText ? 3.0 : 4.5,
    'AAA': isLargeText ? 4.5 : 7.0,
  };
  
  const required = requirements[level];
  
  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
  };
}

// ============================================
// FlashFusion Color Palette Validation
// ============================================

/**
 * Validate FlashFusion color palette against WCAG 2.1 AA
 */
export function validateFlashFusionPalette() {
  const palette = {
    // Background colors
    bgDark: '#0F172A',
    surface: '#1E293B',
    surfaceLight: '#334155',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    
    // Brand colors
    primary: '#FF7B00',
    secondary: '#00B4D8',
    accent: '#E91E63',
  };
  
  const results: Array<{
    combination: string;
    passes: boolean;
    ratio: number;
    required: number;
  }> = [];
  
  // Test critical combinations
  const testCombinations = [
    { fg: palette.textPrimary, bg: palette.bgDark, name: 'Primary text on dark bg' },
    { fg: palette.textSecondary, bg: palette.bgDark, name: 'Secondary text on dark bg' },
    { fg: palette.textMuted, bg: palette.bgDark, name: 'Muted text on dark bg' },
    { fg: palette.textPrimary, bg: palette.surface, name: 'Primary text on surface' },
    { fg: palette.textPrimary, bg: palette.primary, name: 'White on primary' },
    { fg: palette.textPrimary, bg: palette.secondary, name: 'White on secondary' },
    { fg: palette.textPrimary, bg: palette.accent, name: 'White on accent' },
  ];
  
  testCombinations.forEach(({ fg, bg, name }) => {
    const result = meetsContrastRequirement(fg, bg, 'AA');
    results.push({
      combination: name,
      ...result,
    });
  });
  
  return results;
}

// ============================================
// ARIA Validation
// ============================================

/**
 * Validate ARIA attributes on an element
 */
export function validateARIA(element: HTMLElement): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for required ARIA attributes
  const role = element.getAttribute('role');
  
  if (role) {
    // Button role validation
    if (role === 'button' && !element.hasAttribute('aria-label') && !element.textContent?.trim()) {
      errors.push('Button with role="button" must have accessible name');
    }
    
    // Dialog role validation
    if (role === 'dialog') {
      if (!element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
        errors.push('Dialog must have aria-labelledby or aria-label');
      }
      if (!element.hasAttribute('aria-modal')) {
        warnings.push('Dialog should have aria-modal="true"');
      }
    }
    
    // Tab role validation
    if (role === 'tab') {
      if (!element.hasAttribute('aria-selected')) {
        errors.push('Tab must have aria-selected attribute');
      }
      if (!element.hasAttribute('aria-controls')) {
        warnings.push('Tab should have aria-controls pointing to tabpanel');
      }
    }
  }
  
  // Check for interactive elements
  const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
  const tagName = element.tagName.toLowerCase();
  
  if (interactiveElements.includes(tagName)) {
    // Check for accessible name
    const hasAccessibleName = (
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      (element as HTMLInputElement).labels?.length > 0
    );
    
    if (!hasAccessibleName) {
      errors.push(`${tagName} must have an accessible name`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// Keyboard Navigation Checker
// ============================================

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): {
  accessible: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check if element is focusable
  const tabIndex = element.getAttribute('tabindex');
  const isFocusableElement = [
    'a', 'button', 'input', 'select', 'textarea',
  ].includes(element.tagName.toLowerCase());
  
  const isFocusable = isFocusableElement || (tabIndex !== null && parseInt(tabIndex) >= 0);
  
  if (!isFocusable) {
    const role = element.getAttribute('role');
    const isInteractive = ['button', 'link', 'tab', 'menuitem'].includes(role || '');
    
    if (isInteractive) {
      issues.push('Interactive element is not keyboard focusable');
    }
  }
  
  // Check for positive tabindex (anti-pattern)
  if (tabIndex && parseInt(tabIndex) > 0) {
    issues.push('Avoid positive tabindex values (use tabindex="0")');
  }
  
  // Check for click handlers without keyboard handlers
  const hasClickHandler = element.onclick !== null || element.hasAttribute('onclick');
  const hasKeyHandler = element.onkeydown !== null || element.hasAttribute('onkeydown');
  
  if (hasClickHandler && !hasKeyHandler && !isFocusableElement) {
    issues.push('Element with click handler should also have keyboard handler');
  }
  
  return {
    accessible: issues.length === 0,
    issues,
  };
}

// ============================================
// Heading Hierarchy Checker
// ============================================

/**
 * Validate heading hierarchy (h1 → h2 → h3, no skipping)
 */
export function validateHeadingHierarchy(container: HTMLElement = document.body): {
  valid: boolean;
  issues: string[];
} {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const issues: string[] = [];
  
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    
    // Check for h1
    if (index === 0 && level !== 1) {
      issues.push('Page should start with h1');
    }
    
    // Check for skipped levels
    if (level > previousLevel + 1) {
      issues.push(
        `Heading level skipped: ${heading.tagName} follows h${previousLevel} ` +
        `(should be h${previousLevel + 1})`
      );
    }
    
    previousLevel = level;
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================
// Image Alt Text Checker
// ============================================

/**
 * Validate images have appropriate alt text
 */
export function validateImages(container: HTMLElement = document.body): {
  valid: boolean;
  issues: Array<{
    src: string;
    issue: string;
  }>;
} {
  const images = Array.from(container.querySelectorAll('img'));
  const issues: Array<{ src: string; issue: string }> = [];
  
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    const src = img.src || img.getAttribute('src') || 'unknown';
    
    // Missing alt attribute
    if (alt === null) {
      issues.push({
        src,
        issue: 'Missing alt attribute (use alt="" for decorative images)',
      });
    }
    
    // Suspicious alt text
    if (alt && /^(image|photo|picture|img)/i.test(alt)) {
      issues.push({
        src,
        issue: 'Alt text should describe image content, not say "image of..."',
      });
    }
    
    // Very long alt text (should use longdesc instead)
    if (alt && alt.length > 150) {
      issues.push({
        src,
        issue: 'Alt text is very long (>150 chars). Consider using aria-describedby',
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================
// Form Accessibility Checker
// ============================================

/**
 * Validate form accessibility
 */
export function validateForm(form: HTMLFormElement): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check all inputs have labels
  const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
  
  inputs.forEach((input) => {
    const id = input.id;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const label = id ? form.querySelector(`label[for="${id}"]`) : null;
    
    if (!label && !ariaLabel && !ariaLabelledby) {
      issues.push(`Input "${input.getAttribute('name') || 'unnamed'}" has no label`);
    }
  });
  
  // Check fieldsets have legends
  const fieldsets = Array.from(form.querySelectorAll('fieldset'));
  
  fieldsets.forEach((fieldset) => {
    const legend = fieldset.querySelector('legend');
    if (!legend) {
      issues.push('Fieldset is missing legend element');
    }
  });
  
  // Check required fields are marked
  const requiredInputs = Array.from(form.querySelectorAll('[required]'));
  
  requiredInputs.forEach((input) => {
    const ariaRequired = input.getAttribute('aria-required');
    if (!ariaRequired) {
      issues.push(`Required field should have aria-required="true"`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================
// Live Region Announcer
// ============================================

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Create live region if it doesn't exist
  let liveRegion = document.getElementById('a11y-announcer');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-announcer';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only ff-sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    `;
    document.body.appendChild(liveRegion);
  }
  
  // Update priority if changed
  liveRegion.setAttribute('aria-live', priority);
  
  // Clear previous message
  liveRegion.textContent = '';
  
  // Announce new message (slight delay for screen reader to register)
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
  
  // Clear message after announcement
  setTimeout(() => {
    liveRegion!.textContent = '';
  }, 3000);
}

// ============================================
// Focus Management
// ============================================

/**
 * Trap focus within a container (for modals/dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), ' +
    'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstFocusable?.focus();
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Restore focus to previous element
 */
export function createFocusRestorer() {
  const previouslyFocused = document.activeElement as HTMLElement;
  
  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

// ============================================
// Comprehensive Accessibility Audit
// ============================================

/**
 * Run comprehensive accessibility audit
 */
export function runAccessibilityAudit(container: HTMLElement = document.body) {
  return {
    colorContrast: validateFlashFusionPalette(),
    headingHierarchy: validateHeadingHierarchy(container),
    images: validateImages(container),
    forms: Array.from(container.querySelectorAll('form')).map(form => ({
      id: form.id || 'unnamed',
      ...validateForm(form),
    })),
    timestamp: new Date().toISOString(),
  };
}

// Export all utilities
export default {
  getContrastRatio,
  meetsContrastRequirement,
  validateFlashFusionPalette,
  validateARIA,
  isKeyboardAccessible,
  validateHeadingHierarchy,
  validateImages,
  validateForm,
  announceToScreenReader,
  trapFocus,
  createFocusRestorer,
  runAccessibilityAudit,
};
