# File Generators Utility Split Plan

**Source**: `src/utils/file-generators.ts` (2,316 lines)
**Goal**: Split into domain-specific modules under `src/utils/generators/`

---

## Current Structure Analysis

The monolithic file contains:
- **30+ exported functions**
- **Multiple concerns**: Documentation, configs, CI/CD, tests, Docker, download
- **Poor cohesion**: Unrelated functions in same file
- **Hard to maintain**: 2,316 lines is unmaintainable

---

## Proposed Module Structure

```
src/utils/generators/
├── index.ts                        # Barrel export
├── types.ts                        # Shared types
├── download.ts                     # Core download/zip functions
├── documentation.ts                # README, guides, docs generation
├── configuration.ts                # Config files (package.json, tsconfig, eslint)
├── docker.ts                       # Docker and docker-compose files
├── ci-cd.ts                        # GitHub Actions, CI/CD pipelines
├── testing.ts                      # Test file generation
└── project-structure.ts            # Project scaffolding logic
```

---

## Module Breakdown

### 1. `types.ts` (New)
**Lines**: ~50
**Purpose**: Centralize shared interfaces
**Exports**:
```typescript
export interface ProjectFileStructure {
  [path: string]: string | ProjectFileStructure;
}

export interface DownloadOptions {
  format: 'zip' | 'individual';
  includeNodeModules?: boolean;
  includeGitIgnore?: boolean;
}

export interface EnhancedDownloadOptions extends DownloadOptions {
  includeDocker?: boolean;
  includeCI?: boolean;
  includeTests?: boolean;
  includeDocs?: boolean;
}
```

### 2. `download.ts`
**Lines**: ~100
**Source Lines**: 23-69, 924-956
**Purpose**: Core download and ZIP functionality
**Functions**:
- `generateDownloadableProject()`
- `downloadFile()`
- `downloadMultipleFiles()`
- `addFilesToZip()` (helper)

### 3. `documentation.ts`
**Lines**: ~900
**Source Lines**: 180-497, 1102-1450
**Purpose**: Generate all documentation files
**Functions**:
- `generateProjectReadme()`
- `generateDeploymentGuide()`
- `generateDevelopmentGuide()`
- `generateArchitectureGuide()`
- `generateAPIDocumentation()`
- `generateContributingGuide()`
- `generateEnhancedReadme()`

### 4. `configuration.ts`
**Lines**: ~350
**Source Lines**: 122-180, 1489-1822
**Purpose**: Generate config files
**Functions**:
- `generateRootPackageJson()`
- `generateEnhancedRootPackageJson()`
- `generateTSConfig()`
- `generateESLintConfig()`
- `generatePrettierConfig()`
- `generateJestConfig()`
- `generateEnvExample()`
- `generateGitIgnore()`

### 5. `docker.ts`
**Lines**: ~200
**Source Lines**: 1619-1752
**Purpose**: Docker-related file generation
**Functions**:
- `generateDockerCompose()`
- `generateEnhancedDockerCompose()`
- `generateProductionDockerCompose()`
- `generateDockerfile()` (if exists)

### 6. `ci-cd.ts`
**Lines**: ~250
**Source Lines**: 1889-2100+
**Purpose**: CI/CD pipeline generation
**Functions**:
- `generateGitHubActionsCI()`
- `generateGitHubActionsDeploy()`
- Additional CI/CD generators

### 7. `testing.ts`
**Lines**: ~150
**Source Lines**: 1822-1889
**Purpose**: Test file generation
**Functions**:
- `generateFrontendTests()`
- `generateBackendTests()`
- `generateAuthTests()`
- `generateE2ETests()` (if exists)

### 8. `project-structure.ts`
**Lines**: ~300
**Source Lines**: 70-122, 1079-1102
**Purpose**: Project scaffolding and structure
**Functions**:
- `createProjectStructure()`
- `createEnhancedProjectStructure()`
- `generateInstallablePackage()`

### 9. `index.ts` (New)
**Lines**: ~20
**Purpose**: Barrel export for public API
**Content**:
```typescript
// Re-export all public functions
export * from './download';
export * from './documentation';
export * from './configuration';
export * from './docker';
export * from './ci-cd';
export * from './testing';
export * from './project-structure';
export * from './types';
```

---

## Migration Strategy

### Phase 1: Create Module Structure
1. Create `src/utils/generators/` directory
2. Create `types.ts` with shared interfaces
3. Create empty module files

### Phase 2: Extract Functions
For each module:
1. Copy relevant functions from `file-generators.ts`
2. Update imports (add `import type { GeneratedApp } from '../../types/full-stack-builder'`)
3. Export functions
4. Test function extraction

### Phase 3: Create Barrel Export
1. Create `index.ts` with re-exports
2. Update consumer imports from `@/utils/file-generators` to `@/utils/generators`

### Phase 4: Clean Up
1. Delete original `file-generators.ts`
2. Run type-check: `npm run type-check`
3. Fix any broken imports

### Phase 5: Verify
1. Test download functionality end-to-end
2. Verify all generators still work
3. Check bundle size (should be similar or smaller)

---

## Import Path Updates

**Before**:
```typescript
import { generateDownloadableProject, generateProjectReadme } from '@/utils/file-generators';
```

**After (Option 1 - Specific imports)**:
```typescript
import { generateDownloadableProject } from '@/utils/generators/download';
import { generateProjectReadme } from '@/utils/generators/documentation';
```

**After (Option 2 - Barrel import)**:
```typescript
import { generateDownloadableProject, generateProjectReadme } from '@/utils/generators';
```

**Recommendation**: Use Option 2 for backward compatibility

---

## Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Largest file** | 2,316 lines | ~900 lines | -61% |
| **Files** | 1 monolith | 9 modules | +800% modularity |
| **Cohesion** | Low (mixed concerns) | High (single responsibility) | ✅ |
| **Maintainability** | Hard (find functions in 2K lines) | Easy (navigate by domain) | ✅ |
| **Testability** | Hard (mock entire file) | Easy (test per module) | ✅ |
| **Bundle size** | All or nothing | Tree-shakeable modules | ✅ |

---

## Acceptance Criteria

- [ ] All 9 modules created under `src/utils/generators/`
- [ ] Each module < 400 lines (exception: documentation.ts ~900 lines with rationale)
- [ ] Barrel export at `index.ts`
- [ ] All imports updated to use new paths
- [ ] Type-check passes: `npm run type-check`
- [ ] Original `file-generators.ts` removed
- [ ] No broken imports in codebase
- [ ] Download functionality still works end-to-end

---

## Estimated Effort

- **Phase 1** (structure): 30 minutes
- **Phase 2** (extraction): 3-4 hours
- **Phase 3** (barrel export): 30 minutes
- **Phase 4** (cleanup): 1 hour
- **Phase 5** (verify): 1 hour

**Total**: 5-7 hours

---

## Files Created After Completion

```
src/utils/generators/
├── index.ts
├── types.ts
├── download.ts
├── documentation.ts
├── configuration.ts
├── docker.ts
├── ci-cd.ts
├── testing.ts
└── project-structure.ts
```

**Total lines**: ~2,320 (same content, better organized)
**Largest module**: documentation.ts (~900 lines - acceptable given content is mostly templates)
