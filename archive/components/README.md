# Archived Components

**Date**: 2025-10-26
**Refactoring Phase**: Prompt 2 - Duplicate Resolution

## Purpose

This directory contains component versions that have been **superseded** or are **no longer active** in the codebase. These files are archived rather than deleted to maintain:

1. **Historical reference** - Ability to review previous implementations
2. **Code recovery** - Easy restoration if needed
3. **Audit trail** - Full traceability of refactoring decisions

## Archived Files

### 1. LaunchDayCommand.original.tsx

**Reason**: Superseded by LaunchDayCommandFixed.tsx (now renamed to canonical LaunchDayCommand.tsx)

**Import Analysis**:
- ❌ **Not imported** in any active production code
- ✅ **Active version**: LaunchDayCommandFixed.tsx → LaunchDayCommand.tsx
- 📍 **Used in**: `src/components/layout/PageRouter.tsx:113`

**Rationale**: The "Fixed" version contains bug fixes and improvements that were never backported to the original. The Fixed version is the actively maintained implementation.

---

### 2. ErrorRecoverySystem.original.tsx

**Reason**: Superseded by ErrorRecoverySystemFixed.tsx (now renamed to canonical ErrorRecoverySystem.tsx)

**Import Analysis**:
- ❌ **Not imported** in any active production code
- ✅ **Active version**: ErrorRecoverySystemFixed.tsx → ErrorRecoverySystem.tsx
- 📍 **Used in**: `src/components/layout/PageRouter.tsx:108`

**Rationale**: The "Fixed" version includes enhanced error recovery mechanisms and better state management that were never merged back to the original.

---

### 3. EnhancedWorkflowBuilderFixed.tsx

**Reason**: Canonical EnhancedWorkflowBuilder.tsx is the active version

**Import Analysis**:
- ❌ **Not imported** in any production code
- ✅ **Active version**: `src/components/tools/EnhancedWorkflowBuilder.tsx`
- 📍 **Used in**: `src/components/tools/AIToolsHub.tsx:29`

**Rationale**: The canonical version (without "Fixed" suffix) is the actively used implementation. The Fixed variant appears to be a temporary duplicate that was never integrated.

---

### 4. AdvancedProductionDeploymentFixed.tsx

**Reason**: Canonical AdvancedProductionDeployment.tsx is the active version

**Import Analysis**:
- ❌ **Not imported** in any production code
- ✅ **Active version**: `src/components/deployment/AdvancedProductionDeployment.tsx`
- 📍 **Used in**: `src/components/tools/AIToolsHub.tsx:31`

**Rationale**: The canonical version is actively imported and maintained. The Fixed variant appears to be an experimental version that was never promoted to production.

---

### 5. App-fixed.tsx

**Reason**: No imports found - appears to be unused experimental code

**Import Analysis**:
- ❌ **Not imported** anywhere in the codebase
- ✅ **Active version**: `src/App.tsx` (canonical)

**Rationale**: Static analysis found zero imports of this file. It appears to be an experimental or debugging version that was never integrated into the application.

---

## Recovery Instructions

To restore an archived component:

1. **Review the archived file** to understand its implementation
2. **Compare with current implementation** to identify differences
3. **If restoration is needed**:
   ```bash
   # Copy back to source location
   git mv archive/components/ComponentName.original.tsx src/components/path/ComponentName.tsx

   # Update imports if needed
   # Test thoroughly

   # Commit with clear rationale
   git commit -m "Restore ComponentName from archive - [reason]"
   ```

## Deletion Policy

Archived files should be retained for **at least 6 months** after archival. After this period:
- Review usage analytics to confirm no restoration requests
- Consider permanent deletion if confirmed unnecessary
- Document deletion in migration notes

## Related Documentation

- `/migration-notes.md` - Full refactoring changelog
- `/reports/duplicates-resolution.json` - Machine-readable resolution report
