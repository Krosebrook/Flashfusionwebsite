#!/usr/bin/env ts-node

/**
 * FlashFusion Repository Inventory Generator
 * 
 * Scans pnpm workspace and generates inventory of all packages
 * with ownership, deployment targets, and metadata.
 */

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

type FlashFusionMetadata = {
  owner?: string;
  purpose?: string;
  deploy_target?: string;
  env_keys?: string[];
  data_access?: string;
  telemetry_events?: string[];
};

type PackageJson = {
  name?: string;
  private?: boolean;
  version?: string;
  flashfusion?: FlashFusionMetadata;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type InventoryPackage = {
  name: string;
  path: string;
  owner: string;
  purpose: string;
  deploy_target: string;
  env_keys: string[];
  data_access: string;
  telemetry_events: string[];
  version?: string;
  dependencies?: string[];
};

const ROOT = process.cwd();
const WORKSPACE_FILE = path.join(ROOT, "pnpm-workspace.yaml");
const ROOT_PKG_FILE = path.join(ROOT, "package.json");
const OUTPUT_FILE = path.join(ROOT, "docs", "repo-inventory.json");

function readJSON<T = any>(filepath: string): T {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function safeRead<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function getPackageJson(dir: string): PackageJson | null {
  const pkgPath = path.join(ROOT, dir, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  return safeRead(() => readJSON<PackageJson>(pkgPath), null);
}

function expandGlobPatterns(globs: string[]): string[] {
  const directories: string[] = [];
  
  for (const glob of globs) {
    if (glob.endsWith("/*")) {
      // Match pattern like "apps/*" or "packages/*"
      const baseDir = glob.slice(0, -2);
      const fullPath = path.join(ROOT, baseDir);
      
      if (fs.existsSync(fullPath)) {
        const entries = fs.readdirSync(fullPath);
        for (const entry of entries) {
          const entryPath = path.join(baseDir, entry);
          const fullEntryPath = path.join(ROOT, entryPath);
          
          if (fs.statSync(fullEntryPath).isDirectory()) {
            directories.push(entryPath);
          }
        }
      }
    } else if (fs.existsSync(path.join(ROOT, glob))) {
      directories.push(glob);
    }
  }
  
  return directories;
}

function getWorkspaceDependencies(pkg: PackageJson): string[] {
  const deps: string[] = [];
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  
  for (const [name, version] of Object.entries(allDeps || {})) {
    if (name.startsWith('@flashfusion/') || version === 'workspace:*') {
      deps.push(name);
    }
  }
  
  return deps;
}

async function generateInventory() {
  console.log("🔍 Generating FlashFusion repository inventory...\n");
  
  // Read workspace configuration
  const workspaceYaml = fs.readFileSync(WORKSPACE_FILE, "utf8");
  const workspace = YAML.parse(workspaceYaml);
  const rootPkg = readJSON<PackageJson>(ROOT_PKG_FILE);
  
  // Get all package directories
  const packageDirs = expandGlobPatterns(workspace.packages || ["apps/*", "packages/*"]);
  
  console.log(`Found ${packageDirs.length} packages:\n`);
  
  const packages: InventoryPackage[] = [];
  
  for (const dir of packageDirs) {
    const pkg = getPackageJson(dir);
    if (!pkg?.name) {
      console.log(`⚠️  Skipping ${dir} - no package.json or name`);
      continue;
    }
    
    const meta = pkg.flashfusion || {};
    const workspaceDeps = getWorkspaceDependencies(pkg);
    
    const inventoryEntry: InventoryPackage = {
      name: pkg.name,
      path: dir,
      owner: meta.owner ?? "Kyle Rosebrook",
      purpose: meta.purpose ?? "TBD - needs documentation",
      deploy_target: meta.deploy_target ?? "TBD",
      env_keys: meta.env_keys ?? [],
      data_access: meta.data_access ?? "none",
      telemetry_events: meta.telemetry_events ?? [],
      version: pkg.version,
      dependencies: workspaceDeps.length > 0 ? workspaceDeps : undefined
    };
    
    packages.push(inventoryEntry);
    
    console.log(`✅ ${pkg.name}`);
    console.log(`   Path: ${dir}`);
    console.log(`   Owner: ${inventoryEntry.owner}`);
    console.log(`   Deploy: ${inventoryEntry.deploy_target}`);
    if (workspaceDeps.length > 0) {
      console.log(`   Deps: ${workspaceDeps.join(', ')}`);
    }
    console.log();
  }
  
  const result = {
    monorepo: rootPkg.name ?? path.basename(ROOT),
    generated_at: new Date().toISOString(),
    packages: packages.sort((a, b) => a.name.localeCompare(b.name))
  };
  
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  
  // Write inventory
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + "\n");
  
  console.log("━".repeat(60));
  console.log(`\n✨ Inventory generated successfully!`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📦 Total packages: ${packages.length}`);
  console.log(`🕒 Generated: ${result.generated_at}`);
  console.log("\n💡 Next steps:");
  console.log("   1. Review inventory and add 'flashfusion' metadata to package.json files");
  console.log("   2. Commit the inventory: git add docs/repo-inventory.json");
  console.log("   3. Add to CI: pnpm inventory && git diff --exit-code docs/repo-inventory.json");
  console.log();
}

// Run generator
generateInventory().catch((error) => {
  console.error("❌ Failed to generate inventory:", error);
  process.exit(1);
});
