#!/usr/bin/env ts-node

/**
 * FlashFusion Analytics Events Contract Validator
 * 
 * Scans the repository for analytics event calls and validates them against
 * the events contract defined in docs/events.contract.json
 * 
 * Fails CI if:
 * - Unknown events are found
 * - Malformed event calls are detected
 * - PII is potentially being tracked
 */

import fs from "node:fs";
import path from "node:path";

type EventContract = {
  events: Record<string, {
    description: string;
    params: Record<string, string>;
    required: string[];
    examples?: any[];
  }>;
  validation_rules: {
    event_naming: string;
    param_naming: string;
    max_params: number;
    forbidden_pii: string[];
  };
};

const ROOT = process.cwd();
const CONTRACT_PATH = path.join(ROOT, "docs", "events.contract.json");

// Load contract
const contract: EventContract = JSON.parse(
  fs.readFileSync(CONTRACT_PATH, "utf8")
);

const ALLOWED_EVENTS = new Set(Object.keys(contract.events));
const FORBIDDEN_PII = new Set(contract.validation_rules.forbidden_pii);

// Track violations
const violations: string[] = [];
const warnings: string[] = [];

/**
 * Recursively walk directory and collect files
 */
function walkDirectory(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip node_modules, build outputs, tests
    if (
      entry.name.startsWith(".") ||
      [
        "node_modules",
        ".turbo",
        ".next",
        "dist",
        "build",
        "coverage",
        "__tests__",
        "test-results",
        "playwright-report"
      ].includes(entry.name)
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      walkDirectory(fullPath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Regular expressions to match analytics calls
 */
const EVENT_PATTERNS = [
  // track('event_name', { ... })
  /track\(\s*['"`]([a-z0-9_]+)['"`]\s*(?:,\s*\{([^}]*)\})?\s*\)/g,
  
  // gtag('event', 'event_name', { ... })
  /gtag\(\s*['"`]event['"`]\s*,\s*['"`]([a-z0-9_]+)['"`]\s*(?:,\s*\{([^}]*)\})?\s*\)/g,
  
  // (window as any).gtag('event', 'event_name', { ... })
  /\(window\s+as\s+any\)\.gtag\(\s*['"`]event['"`]\s*,\s*['"`]([a-z0-9_]+)['"`]\s*(?:,\s*\{([^}]*)\})?\s*\)/g,
];

/**
 * Extract parameter names from params string
 */
function extractParams(paramsStr: string): string[] {
  if (!paramsStr) return [];
  
  const paramPattern = /(\w+)\s*:/g;
  const params: string[] = [];
  let match;

  while ((match = paramPattern.exec(paramsStr)) !== null) {
    params.push(match[1]);
  }

  return params;
}

/**
 * Check if param might contain PII
 */
function containsPII(paramName: string): boolean {
  const lowerParam = paramName.toLowerCase();
  for (const pii of FORBIDDEN_PII) {
    if (lowerParam.includes(pii)) {
      return true;
    }
  }
  return false;
}

/**
 * Validate events in a single file
 */
function validateFile(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(ROOT, filePath);

  for (const pattern of EVENT_PATTERNS) {
    // Reset regex
    pattern.lastIndex = 0;
    
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const eventName = match[1];
      const paramsStr = match[2] || "";
      const lineNum = content.substring(0, match.index).split("\n").length;

      // Check if event exists in contract
      if (!ALLOWED_EVENTS.has(eventName)) {
        violations.push(
          `${relativePath}:${lineNum} - Unknown event "${eventName}"`
        );
        continue;
      }

      // Extract and validate parameters
      const params = extractParams(paramsStr);
      const eventDef = contract.events[eventName];

      // Check for PII in params
      for (const param of params) {
        if (containsPII(param)) {
          violations.push(
            `${relativePath}:${lineNum} - Event "${eventName}" may contain PII in param "${param}"`
          );
        }
      }

      // Check required params
      for (const required of eventDef.required || []) {
        if (!params.includes(required)) {
          warnings.push(
            `${relativePath}:${lineNum} - Event "${eventName}" missing required param "${required}"`
          );
        }
      }

      // Check param count
      if (params.length > contract.validation_rules.max_params) {
        warnings.push(
          `${relativePath}:${lineNum} - Event "${eventName}" has too many params (${params.length} > ${contract.validation_rules.max_params})`
        );
      }
    }
  }
}

/**
 * Main validation logic
 */
async function validateEvents() {
  console.log("📊 FlashFusion Analytics Events Validator\n");
  console.log(`Contract: ${CONTRACT_PATH}`);
  console.log(`Allowed events: ${ALLOWED_EVENTS.size}\n`);

  // Get all files
  const files = walkDirectory(ROOT);
  console.log(`Scanning ${files.length} files...\n`);

  // Validate each file
  for (const file of files) {
    validateFile(file);
  }

  // Report results
  console.log("━".repeat(60));
  console.log("\n📋 Validation Results:\n");

  if (violations.length === 0 && warnings.length === 0) {
    console.log("✅ All analytics events are valid!\n");
    console.log(`Events validated against contract version ${contract.version || '1.0.0'}`);
    return;
  }

  // Show violations (errors)
  if (violations.length > 0) {
    console.error(`❌ Found ${violations.length} violation(s):\n`);
    violations.forEach((v) => console.error(`  - ${v}`));
    console.error("");
  }

  // Show warnings
  if (warnings.length > 0) {
    console.warn(`⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach((w) => console.warn(`  - ${w}`));
    console.warn("");
  }

  // Fail if violations found
  if (violations.length > 0) {
    console.error("━".repeat(60));
    console.error("\n💡 How to fix:");
    console.error("  1. Add unknown events to docs/events.contract.json");
    console.error("  2. Remove PII from event parameters");
    console.error("  3. Use only allowed event names from contract\n");
    process.exit(1);
  }

  // Pass with warnings
  if (warnings.length > 0) {
    console.log("━".repeat(60));
    console.log("\n✅ Validation passed with warnings");
    console.log("   Consider addressing warnings to improve tracking quality\n");
  }
}

// Run validator
validateEvents().catch((error) => {
  console.error("❌ Validation failed with error:", error);
  process.exit(1);
});
