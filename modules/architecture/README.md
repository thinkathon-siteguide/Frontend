# Architecture Module

This module handles all architecture-related functionality in the SiteGuard application, including generating, saving, and managing architecture plans for workspaces.

## Structure

```
architecture/
├── services/
│   └── architecture.api.ts      # API calls for architecture operations
├── hooks/
│   ├── useArchitecture.ts       # Main architecture plan operations
│   ├── useArchitectureSections.ts   # Manage architecture sections
│   ├── useArchitectureMaterials.ts  # Manage materials
│   ├── useArchitectureStages.ts     # Manage construction stages
│   └── index.ts                 # Hook exports
├── index.ts                     # Module exports
└── README.md                    # This file
```

## API Service (`architecture.api.ts`)

Provides methods for interacting with the backend architecture endpoints:

### Architecture Plan Operations

- `getArchitecturePlan(workspaceId)` - Get the architecture plan for a workspace
- `saveArchitecturePlan(workspaceId, plan)` - Save a new architecture plan
- `updateArchitecturePlan(workspaceId, plan)` - Update an existing plan
- `deleteArchitecturePlan(workspaceId)` - Delete an architecture plan

### Sections Operations

- `getArchitectureSections(workspaceId)` - Get all sections
- `addArchitectureSection(workspaceId, section)` - Add a new section

### Materials Operations

- `getArchitectureMaterials(workspaceId)` - Get all materials
- `addArchitectureMaterial(workspaceId, material)` - Add a new material

### Stages Operations

- `getArchitectureStages(workspaceId)` - Get all construction stages
- `addArchitectureStage(workspaceId, stage)` - Add a new stage

## Hooks

### `useArchitecture(workspaceId)`

Main hook for managing architecture plans.

```typescript
const {
  architecture, // Current architecture plan
  isLoading, // Loading state
  isError, // Error state
  error, // Error object
  saveArchitecture, // Function to save a new plan
  isSaving, // Saving state
  updateArchitecture, // Function to update existing plan
  isUpdating, // Updating state
  deleteArchitecture, // Function to delete plan
  isDeleting, // Deleting state
} = useArchitecture(workspaceId);
```

**Example Usage:**

```typescript
import { useArchitecture } from '../modules/architecture';

function ArchitectureGenerator() {
  const { activeWorkspaceId } = useApp();
  const { architecture, saveArchitecture, isSaving } = useArchitecture(activeWorkspaceId);

  const handleSave = () => {
    saveArchitecture({
      summary: 'Modern residential building',
      costEstimate: '₦50,000,000',
      timeline: '12 months',
      sections: [...],
      materials: [...],
      stages: [...]
    });
  };

  return (
    <button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save Plan'}
    </button>
  );
}
```

### `useArchitectureSections(workspaceId)`

Hook for managing architecture sections.

```typescript
const {
  sections, // Array of sections
  isLoading, // Loading state
  isError, // Error state
  error, // Error object
  addSection, // Function to add a section
  isAdding, // Adding state
} = useArchitectureSections(workspaceId);
```

**Example Usage:**

```typescript
const { sections, addSection, isAdding } = useArchitectureSections(workspaceId);

const handleAddSection = () => {
  addSection({
    title: 'Foundation',
    description: 'Deep foundation with reinforced concrete',
  });
};
```

### `useArchitectureMaterials(workspaceId)`

Hook for managing materials list.

```typescript
const {
  materials, // Array of materials
  isLoading, // Loading state
  isError, // Error state
  error, // Error object
  addMaterial, // Function to add a material
  isAdding, // Adding state
} = useArchitectureMaterials(workspaceId);
```

**Example Usage:**

```typescript
const { materials, addMaterial, isAdding } =
  useArchitectureMaterials(workspaceId);

const handleAddMaterial = () => {
  addMaterial({
    name: 'Cement',
    quantity: '500 bags',
    specification: 'Grade 42.5',
  });
};
```

### `useArchitectureStages(workspaceId)`

Hook for managing construction stages.

```typescript
const {
  stages, // Array of stages
  isLoading, // Loading state
  isError, // Error state
  error, // Error object
  addStage, // Function to add a stage
  isAdding, // Adding state
} = useArchitectureStages(workspaceId);
```

**Example Usage:**

```typescript
const { stages, addStage, isAdding } = useArchitectureStages(workspaceId);

const handleAddStage = () => {
  addStage({
    phase: 'Foundation Phase',
    duration: '4 weeks',
    tasks: ['Site excavation', 'Concrete pouring', 'Reinforcement'],
  });
};
```

## Integration with Pages

### ArchitectureGenerator Page

The `ArchitectureGenerator` page has been updated to use the architecture module:

```typescript
import { useArchitecture } from '../modules/architecture';

function ArchitectureGenerator() {
  const { activeWorkspaceId } = useApp();
  const { architecture, saveArchitecture, isSaving } =
    useArchitecture(activeWorkspaceId);

  // Generate plan using AI
  const handleGenerate = async () => {
    const plan = await generateArchitecturePlan(formData);
    setResult(plan);
  };

  // Save to backend
  const handleSave = () => {
    if (result) {
      saveArchitecture(result);
    }
  };
}
```

## Data Types

```typescript
interface GeneratedArchitecture {
  summary: string;
  costEstimate: string;
  timeline: string;
  sections: Array<{
    title: string;
    description: string;
  }>;
  materials:
    | Array<{
        name: string;
        quantity: string;
        specification: string;
      }>
    | string[]; // Can be array of strings or objects
  stages: Array<{
    name?: string; // For display
    phase?: string; // For backend
    duration: string;
    description?: string;
    tasks?: string[];
  }>;
}
```

## Benefits of This Approach

1. **Separation of Concerns**: API logic is separated from UI components
2. **Reusability**: Hooks can be used across multiple components
3. **Type Safety**: TypeScript types ensure data consistency
4. **Caching**: React Query automatically caches API responses
5. **Optimistic Updates**: UI updates immediately with toast notifications
6. **Error Handling**: Centralized error handling with user-friendly messages
7. **Loading States**: Built-in loading states for better UX

## Backend Integration

All API calls are made to these backend endpoints:

- `GET/POST/PUT/DELETE /workspaces/:workspaceId/architecture` - Main plan operations
- `GET/POST /workspaces/:workspaceId/architecture/sections` - Sections management
- `GET/POST /workspaces/:workspaceId/architecture/materials` - Materials management
- `GET/POST /workspaces/:workspaceId/architecture/stages` - Stages management

The backend automatically:

- Validates user authentication
- Verifies workspace ownership
- Handles data persistence
- Manages relationships between workspaces and plans
