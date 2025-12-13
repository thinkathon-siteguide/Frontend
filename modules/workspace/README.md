# Workspace Module - Frontend

This module provides complete workspace management functionality with full backend API integration.

## 📁 Structure

```
modules/workspace/
├── services/
│   └── workspace.api.ts          # API service layer
├── hooks/
│   ├── useWorkspaces.ts          # Workspace CRUD hooks
│   ├── useWorkspaceResources.ts  # Resource management hooks
│   ├── useWorkspaceArchitecture.ts # Architecture hooks
│   ├── useWorkspaceSafety.ts     # Safety reports hooks
│   └── index.ts                  # Barrel exports
└── index.ts                      # Module exports
```

## 🚀 Quick Start

### Import hooks

```typescript
import { useWorkspaces, useWorkspace, useWorkspaceResources } from './modules/workspace';
```

### Use in components

```typescript
function WorkspaceManagement() {
  const { 
    workspaces, 
    isLoading, 
    createWorkspace, 
    updateWorkspace, 
    deleteWorkspace 
  } = useWorkspaces();

  // Create workspace
  const handleCreate = () => {
    createWorkspace({
      name: 'New Project',
      location: 'Lagos, Nigeria',
      stage: 'Planning',
      type: 'Residential',
      budget: '50000000'
    });
  };

  return (
    <div>
      {isLoading ? 'Loading...' : workspaces.map(ws => (
        <div key={ws._id}>{ws.name}</div>
      ))}
    </div>
  );
}
```

## 📖 API Hooks

### `useWorkspaces()`

Manage all workspaces with CRUD operations.

```typescript
const {
  workspaces,          // WorkspaceResponse[]
  isLoading,          // boolean
  error,              // Error | null
  createWorkspace,    // (data: CreateWorkspaceData) => void
  updateWorkspace,    // (id: string, data: UpdateWorkspaceData) => void
  deleteWorkspace,    // (id: string) => void
  updateProgress,     // (id: string, progress: number) => void
  toggleStatus,       // (id: string) => void
  isCreating,         // boolean
  isUpdating,         // boolean
  isDeleting          // boolean
} = useWorkspaces();
```

### `useWorkspace(id)`

Get single workspace details.

```typescript
const {
  workspace,          // WorkspaceResponse | undefined
  isLoading,
  error
} = useWorkspace(workspaceId);
```

### `useWorkspaceResources(workspaceId)`

Manage resources for a specific workspace.

```typescript
const {
  resources,          // ResourceItemResponse[]
  isLoading,
  error,
  addResource,        // (data) => void
  updateResource,     // (resourceId, data) => void
  updateQuantity,     // (resourceId, quantity) => void
  deleteResource,     // (resourceId) => void
  bulkReplaceResources, // (resources[]) => void
  isAdding,
  isUpdating,
  isDeleting
} = useWorkspaceResources(workspaceId);
```

### `useWorkspaceArchitecture(workspaceId)`

Manage architecture plans.

```typescript
const {
  architecturePlan,    // ArchitecturePlanResponse | null
  isLoading,
  error,
  saveArchitecturePlan, // (planData) => void
  isSaving
} = useWorkspaceArchitecture(workspaceId);
```

### `useWorkspaceSafety(workspaceId)`

Manage safety reports.

```typescript
const {
  safetyReports,       // SafetyReportResponse[]
  isLoading,
  error,
  saveSafetyReport,    // (reportData) => void
  isSaving
} = useWorkspaceSafety(workspaceId);
```

## 🔧 Features

- ✅ **Automatic caching** with React Query
- ✅ **Background refetching** for fresh data
- ✅ **Optimistic updates** for better UX
- ✅ **Auto-retry** on network failures
- ✅ **Toast notifications** for all operations
- ✅ **Full TypeScript** support
- ✅ **Query invalidation** after mutations

## 📦 Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `react-hot-toast` - Toast notifications
- `axios` - HTTP client

## 🎯 Backend API Endpoints

All endpoints are prefixed with `/workspaces`:

### Workspace Endpoints
- `GET /workspaces` - Get all workspaces
- `GET /workspaces/:id` - Get single workspace
- `POST /workspaces` - Create workspace
- `PUT /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace
- `PATCH /workspaces/:id/progress` - Update progress
- `PATCH /workspaces/:id/status` - Toggle status

### Resource Endpoints
- `GET /workspaces/:id/resources` - Get all resources
- `POST /workspaces/:id/resources` - Add resource
- `PUT /workspaces/:id/resources` - Bulk replace resources
- `PUT /workspaces/:id/resources/:resourceId` - Update resource
- `DELETE /workspaces/:id/resources/:resourceId` - Delete resource
- `PATCH /workspaces/:id/resources/:resourceId/quantity` - Update quantity

### Architecture Endpoints
- `GET /workspaces/:id/architecture` - Get architecture plan
- `POST /workspaces/:id/architecture` - Save architecture plan

### Safety Report Endpoints
- `GET /workspaces/:id/safety-reports` - Get all reports
- `POST /workspaces/:id/safety-reports` - Save report
- `GET /workspaces/:id/safety-reports/:reportId` - Get single report

## 🔐 Authentication

All API calls automatically include the JWT token from localStorage via the axios interceptor configured in `services/api.ts`.

## 💡 Best Practices

1. **Always use hooks** - Don't call the API service directly
2. **Handle loading states** - Show spinners/skeletons
3. **Handle errors** - Display user-friendly error messages
4. **Optimistic updates** - Update UI immediately, rollback on error
5. **Cache invalidation** - Invalidate related queries after mutations

## 🐛 Error Handling

Errors are automatically caught and displayed as toast notifications. You can also access errors via the hook:

```typescript
const { error } = useWorkspaces();

if (error) {
  console.error('Failed to load workspaces:', error);
}
```

## 🎨 Toast Notifications

Success and error toasts are automatically shown for all mutations:

- ✅ Success: Green toast with success message
- ❌ Error: Red toast with error message from backend

Customize toast behavior in `App.tsx` where the Toaster is configured.

