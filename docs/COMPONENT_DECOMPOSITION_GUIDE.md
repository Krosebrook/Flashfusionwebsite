# Component Decomposition Guide

**Created**: 2025-10-26
**Refactoring Phase**: Prompt 1
**Purpose**: Systematic pattern for breaking down oversized components (>1,000 lines)

---

## Problem Statement

The codebase contains **29 components exceeding 1,000 lines**, with the largest at **1,976 lines**. These monolithic components violate:
- **Single Responsibility Principle** - Components handle too many concerns
- **Maintainability** - Hard to understand and modify
- **Testability** - Difficult to test individual features
- **Reusability** - Logic and UI tightly coupled

---

## Decomposition Strategy

### 1. Identify Seams

Before refactoring, analyze the component to find natural separation points:

**UI Sections**: Self-contained visual regions
```typescript
// Before: All in one component
<Card>
  <DocumentationSection />  // ← Extract this
  <MarketingSection />      // ← Extract this
  <SupportSection />        // ← Extract this
</Card>
```

**Stateful Logic**: State management and side effects
```typescript
// Before: Inline useState/useEffect
const [assets, setAssets] = useState(mockAssets);

// After: Extract to hook
const { assets, updateAsset, deleteAsset } = useLaunchAssets();
```

**Business Logic**: Pure functions, data transformations
```typescript
// Before: Inline in component
const processData = (data) => { /* complex logic */ };

// After: Extract to module
import { processLaunchData } from './launch.logic';
```

**Mock Data**: Inline fixtures and sample data
```typescript
// Before: Inline arrays/objects
const [items] = useState([{ id: 1, ... }, { id: 2, ... }]);

// After: Import from fixtures
import { mockLaunchAssets } from '@/fixtures/launch.fixtures';
```

---

### 2. Extraction Pattern

Follow this systematic approach for each oversized component:

#### Step 1: Create Type Definitions

**File**: `ComponentName.types.ts`

```typescript
/**
 * Shared type definitions for ComponentName
 * Extracted during decomposition
 */

export interface ComponentData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface ComponentProps {
  data: ComponentData[];
  onUpdate: (id: string, data: ComponentData) => void;
}

export type ComponentMode = 'view' | 'edit' | 'create';
```

#### Step 2: Extract Mock Data

**File**: `fixtures/component-domain.fixtures.ts`

```typescript
/**
 * @internal - Development/testing only
 * @provenance ComponentName.tsx lines X-Y
 */

import type { ComponentData } from '../components/path/ComponentName.types';

export const mockComponentData: ComponentData[] = [
  { id: '1', name: 'Example', status: 'active' },
  // ... more mock data
];
```

#### Step 3: Extract Business Logic

**File**: `ComponentName.logic.ts`

```typescript
/**
 * Business logic for ComponentName
 * Pure functions with no React dependencies
 */

import type { ComponentData } from './ComponentName.types';

export function processComponentData(data: ComponentData[]): ComponentData[] {
  return data.filter(item => item.status === 'active');
}

export function validateComponentData(data: ComponentData): boolean {
  return data.id !== '' && data.name.length > 0;
}

export function calculateComponentMetrics(data: ComponentData[]) {
  return {
    total: data.length,
    active: data.filter(d => d.status === 'active').length,
  };
}
```

#### Step 4: Extract Custom Hooks

**File**: `useComponentFeature.ts`

```typescript
/**
 * Custom hook for ComponentName feature logic
 * Encapsulates state management and side effects
 */

import { useState, useCallback, useEffect } from 'react';
import type { ComponentData } from './ComponentName.types';
import { processComponentData } from './ComponentName.logic';

export function useComponentFeature(initialData: ComponentData[]) {
  const [data, setData] = useState<ComponentData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = useCallback((id: string, updates: Partial<ComponentData>) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteData = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    // Side effects like data fetching
  }, []);

  return {
    data: processComponentData(data),
    isLoading,
    updateData,
    deleteData,
  };
}
```

#### Step 5: Extract UI Sections

**File**: `ComponentName.Section.tsx`

```typescript
/**
 * Extracted UI section from ComponentName
 * Self-contained presentational component
 */

import type { ComponentData } from './ComponentName.types';
import { Card, CardHeader, CardContent } from '../ui/card';

interface SectionProps {
  data: ComponentData[];
  onItemClick: (id: string) => void;
}

export function ComponentSection({ data, onItemClick }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <h3>Section Title</h3>
      </CardHeader>
      <CardContent>
        {data.map(item => (
          <div key={item.id} onClick={() => onItemClick(item.id)}>
            {item.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

#### Step 6: Refactor Main Component

**File**: `ComponentName.tsx` (updated)

```typescript
/**
 * Main component - now < 200 lines
 * Composition layer using extracted modules
 */

import { useComponentFeature } from './useComponentFeature';
import { ComponentSection } from './ComponentName.Section';
import { mockComponentData } from '@/fixtures/component-domain.fixtures';
import type { ComponentProps } from './ComponentName.types';

export function ComponentName({ initialData = mockComponentData }: ComponentProps) {
  const { data, isLoading, updateData, deleteData } = useComponentFeature(initialData);

  const handleItemClick = (id: string) => {
    updateData(id, { status: 'active' });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ComponentSection
        data={data}
        onItemClick={handleItemClick}
      />
    </div>
  );
}
```

---

### 3. File Organization

After decomposition, the component directory should look like:

```
components/
└── feature/
    ├── ComponentName.tsx          # Main component (< 200 lines)
    ├── ComponentName.types.ts     # Shared types
    ├── ComponentName.logic.ts     # Business logic
    ├── ComponentName.Section.tsx  # UI section component
    ├── ComponentName.Header.tsx   # Another UI section
    ├── useComponentFeature.ts     # Custom hook
    └── useComponentData.ts        # Another hook

fixtures/
└── component-domain.fixtures.ts   # Mock data
```

---

### 4. Acceptance Criteria

After decomposition, verify:

- ✅ **Main component < 500 lines** (ideally < 200)
- ✅ **Each extracted module < 400 lines**
- ✅ **All mock data moved to fixtures/**
- ✅ **Types centralized in .types.ts file**
- ✅ **Business logic separated from UI**
- ✅ **State management in custom hooks**
- ✅ **No behavior changes** (tests still pass)
- ✅ **Imports use barrel exports** where appropriate

---

### 5. Testing Strategy

Add tests for extracted modules:

```typescript
// ComponentName.logic.test.ts
import { processComponentData, validateComponentData } from './ComponentName.logic';

describe('processComponentData', () => {
  it('filters inactive items', () => {
    const result = processComponentData([
      { id: '1', name: 'Active', status: 'active' },
      { id: '2', name: 'Inactive', status: 'inactive' },
    ]);
    expect(result).toHaveLength(1);
  });
});

// useComponentFeature.test.ts
import { renderHook, act } from '@testing-library/react';
import { useComponentFeature } from './useComponentFeature';

describe('useComponentFeature', () => {
  it('updates data correctly', () => {
    const { result } = renderHook(() => useComponentFeature([]));
    act(() => {
      result.current.updateData('1', { status: 'active' });
    });
    expect(result.current.data).toMatchSnapshot();
  });
});
```

---

### 6. Migration Checklist

For each oversized component:

- [ ] Read component and identify seams
- [ ] Create `.types.ts` file with interfaces
- [ ] Extract mock data to `fixtures/`
- [ ] Extract pure logic to `.logic.ts`
- [ ] Extract state management to `useComponentName.ts` hooks
- [ ] Extract large UI sections to `.Section.tsx` files
- [ ] Update main component to use extracted modules
- [ ] Update imports in parent components
- [ ] Add unit tests for logic and hooks
- [ ] Verify no broken imports with `npm run type-check`
- [ ] Run tests: `npm run test`
- [ ] Update component documentation
- [ ] Log changes in migration-notes.md
- [ ] Commit with descriptive message

---

## Priority Components for Decomposition

Based on size analysis, decompose these components first:

| Component | Lines | Priority | Estimated Effort |
|-----------|-------|----------|------------------|
| LaunchPreparationHub.tsx | 1,976 | **Critical** | 4-6 hours |
| CodeGeneratorTool.tsx | 1,753 | **Critical** | 4-6 hours |
| FullStackAppBuilder.tsx | 1,726 | **Critical** | 4-6 hours |
| UserPersonaCards.tsx | 1,692 | **Critical** | 3-4 hours |
| AgentDesignerTool.tsx | 1,682 | **Critical** | 4-6 hours |
| PrintDesignSuite.tsx | 1,590 | High | 3-4 hours |
| LaunchMarketingCampaign.tsx | 1,344 | High | 2-3 hours |
| OneClickDeployTool.tsx | 1,303 | High | 2-3 hours |
| LaunchDayPreparationChecklist.tsx | 1,301 | High | 2-3 hours |
| UserProfileSettingsHub.tsx | 1,270 | High | 2-3 hours |

**Total estimated effort**: 35-45 hours for top 10 components

---

## Benefits

After systematic decomposition:

1. **Maintainability**: Each file has single, clear responsibility
2. **Testability**: Pure logic and hooks easily unit tested
3. **Reusability**: Extracted logic/components reusable elsewhere
4. **Collaboration**: Smaller files easier for team members to work on
5. **Performance**: Easier to optimize and lazy-load sections
6. **Type Safety**: Centralized types reduce duplication
7. **Bundle Size**: Easier to tree-shake unused code

---

## Related Documentation

- `/migration-notes.md` - Detailed refactoring changelog
- `/reports/components-decomposition.json` - Machine-readable progress report
- `/src/fixtures/README.md` - Fixture usage guidelines
