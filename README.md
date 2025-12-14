# SiteGuard Frontend

A modern React-based frontend application for construction project management, built with TypeScript, Vite, and React Query. SiteGuard provides comprehensive workspace management, AI-powered architecture generation, safety monitoring, resource tracking, and reporting capabilities.

## Overview

SiteGuard Frontend is the client-side application for managing construction projects. It integrates with Google Gemini AI for intelligent project planning and safety analysis, providing a comprehensive platform for project managers and site engineers to monitor and manage construction workspaces.

## Tech Stack

- **React 19.2.3** - Modern UI library
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Fast build tool and dev server
- **React Router DOM 7.10.1** - Client-side routing
- **React Query (@tanstack/react-query) 5.90.12** - Server state management
- **Axios 1.13.2** - HTTP client
- **React Hot Toast 2.6.0** - Toast notifications
- **Lucide React 0.561.0** - Icon library
- **Recharts 3.5.1** - Data visualization
- **@google/genai 1.33.0** - Google Gemini AI integration
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
frontend/
├── assets/                 # Static assets (logos, images)
│   └── logo.svg
├── components/            # Reusable UI components
│   ├── Layout.tsx         # Main application layout with sidebar
│   └── Logo.tsx           # Logo component
├── context/               # React context providers
│   └── AppContext.tsx     # Global app state (user, workspace)
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   │   ├── components/    # Auth UI components
│   │   ├── hooks/         # Auth hooks (useAuth)
│   │   └── pages/         # Auth pages (AuthPage)
│   ├── architecture/      # Architecture generation module
│   │   ├── hooks/         # Architecture hooks
│   │   └── services/      # Architecture API services
│   ├── resource/          # Resource management module
│   │   ├── hooks/         # Resource hooks
│   │   └── services/      # Resource API services
│   └── workspace/         # Workspace management module
│       ├── hooks/         # Workspace hooks
│       └── services/      # Workspace API services
├── pages/                 # Main application pages
│   ├── Dashboard.tsx      # Main dashboard
│   ├── ArchitectureGenerator.tsx  # AI architecture generator
│   ├── SafetyMonitor.tsx  # Safety monitoring
│   ├── ResourceManagement.tsx     # Resource inventory
│   ├── WorkspaceManagement.tsx    # Workspace CRUD
│   ├── Reports.tsx        # Project reports
│   └── PitchDeck.tsx      # Pitch deck generator
├── services/              # Core services
│   ├── api.ts             # Axios instance with interceptors
│   ├── geminiService.ts   # Google Gemini AI integration
│   └── health.api.ts      # Health check API
├── App.tsx                # Root component with routing
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── index.css              # Global styles
├── types.ts               # TypeScript type definitions
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Features

### 1. Authentication

- User login and signup
- JWT token-based authentication
- Protected routes with authentication guards
- Persistent session management

### 2. Workspace Management

- Create, read, update, and delete workspaces
- Track project progress, status, and safety scores
- Manage multiple construction projects
- Active workspace selection

### 3. AI Architecture Generator

- Generate detailed construction plans using Google Gemini AI
- Configure building type, land size, floors, and budget
- Automatic generation of:
  - Project stages (5 phases)
  - Material specifications
  - Design sections
  - Cost estimates and timelines
- Save and manage architecture plans per workspace

### 4. Safety Monitoring

- Upload site images for AI-powered safety analysis
- Automatic hazard detection and risk scoring
- Severity-based hazard categorization
- Safety recommendations
- Historical safety reports tracking

### 5. Resource Management

- Track inventory items (materials, equipment, labor)
- Quantity and threshold management
- Status indicators (Good, Low, Critical)
- AI-powered resource recommendations
- Bulk operations support

### 6. Reporting

- AI-generated project reports
- Executive summaries
- Progress updates
- Key issues and recommendations
- PDF export capability

### 7. Dashboard

- Overview of all workspaces
- Visual progress and safety metrics
- Charts and statistics
- Quick navigation to key features

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:4000`
- Google Gemini API key

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:
   Create a `.env` file in the frontend directory with your Google Gemini API key (see Environment Variables section below)

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

The API key is used for:

- Architecture plan generation
- Safety image analysis
- Resource recommendations
- Project report generation

## Architecture & Design Patterns

### State Management

- **React Query**: Manages server state (workspaces, resources, architecture plans)
- **React Context**: Manages global UI state (user authentication, active workspace)
- **Local State**: Component-level state using React hooks

### Module Structure

The application follows a modular architecture where each feature is self-contained:

- **Services Layer**: API communication logic
- **Hooks Layer**: React Query hooks for data fetching and mutations
- **Components Layer**: UI components specific to the module
- **Pages Layer**: Full page components that compose modules

### API Integration

- Centralized Axios instance (`services/api.ts`) with:
  - Base URL configuration
  - Request interceptors for JWT tokens
  - Error handling
- React Query for:
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Error and loading states

### Authentication Flow

1. User submits credentials via `useAuth` hook
2. API returns JWT token and user data
3. Token stored in localStorage
4. User data stored in AppContext
5. Protected routes check authentication via `RequireAuth` component

### Routing

- Hash-based routing (HashRouter) for deployment flexibility
- Route protection via `RequireAuth` wrapper
- Nested routes for main application layout

## Key Modules

### Auth Module (`modules/auth/`)

Handles user authentication:

- `useAuth()`: Hook for login and signup mutations
- `AuthPage`: Login/signup page component
- `LoginForm` & `SignupForm`: Form components

### Workspace Module (`modules/workspace/`)

Comprehensive workspace management:

- `useWorkspaces()`: CRUD operations for workspaces
- `useWorkspace(id)`: Fetch single workspace
- `useWorkspaceResources()`: Resource management
- `useWorkspaceArchitecture()`: Architecture plan management
- `useWorkspaceSafety()`: Safety reports management
- `useSafetyReports()`: Safety report operations

### Architecture Module (`modules/architecture/`)

AI-powered architecture generation:

- `useArchitecture(workspaceId)`: Main architecture operations
- `useArchitectureSections()`: Manage design sections
- `useArchitectureMaterials()`: Manage materials
- `useArchitectureStages()`: Manage construction stages
- Integrates with `geminiService.ts` for AI generation

### Resource Module (`modules/resource/`)

Resource inventory management:

- `useResources(workspaceId)`: Resource CRUD operations
- Status tracking (Good/Low/Critical)
- Threshold-based alerts

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- Functional components with hooks
- No inline code comments (code should be self-documenting)
- Consistent naming conventions:
  - Components: PascalCase
  - Hooks: camelCase starting with `use`
  - Services: camelCase
  - Types: PascalCase

### Performance Considerations

- React Query configured with:
  - 5-minute stale time
  - Disabled refetch on window focus
  - Single retry on failure
- Lazy loading for route components (can be implemented)
- Optimized re-renders with proper dependency arrays
- Memoization where appropriate

### UI/UX Principles

- Modern, clean, and premium design
- Balanced spacing and typography
- Minimal clutter
- Smooth, performance-friendly animations
- Fully responsive design
- Accessible components

### Adding New Features

1. Create module directory in `modules/`
2. Add service layer for API calls
3. Create React Query hooks
4. Build UI components
5. Integrate into pages and routing

## API Endpoints

The frontend communicates with the backend API at `http://localhost:4000`:

### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Workspaces

- `GET /workspaces` - Get all workspaces
- `GET /workspaces/:id` - Get workspace by ID
- `POST /workspaces` - Create workspace
- `PUT /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace
- `PATCH /workspaces/:id/progress` - Update progress
- `PATCH /workspaces/:id/status` - Toggle status

### Resources

- `GET /workspaces/:id/resources` - Get all resources
- `POST /workspaces/:id/resources` - Add resource
- `PUT /workspaces/:id/resources/:resourceId` - Update resource
- `DELETE /workspaces/:id/resources/:resourceId` - Delete resource
- `PATCH /workspaces/:id/resources/:resourceId/quantity` - Update quantity

### Architecture

- `GET /workspaces/:id/architecture` - Get architecture plan
- `POST /workspaces/:id/architecture` - Save architecture plan
- `PUT /workspaces/:id/architecture` - Update architecture plan

### Safety Reports

- `GET /workspaces/:id/safety-reports` - Get all safety reports
- `POST /workspaces/:id/safety-reports` - Save safety report
- `GET /workspaces/:id/safety-reports/:reportId` - Get report by ID

## Styling

The application uses Tailwind CSS with custom configuration:

- Custom color palette (ThinkLab brand colors)
- Custom fonts (Inter for body, Merriweather for headings)
- Custom animations (fade-in, slide-in, float)
- Responsive design utilities

Custom colors:

- `thinklab-black`: #111827
- `thinklab-red`: #D0021B
- `thinklab-grey`: #6B7280
- `thinklab-light`: #F3F4F6

## Error Handling

- React Query handles API errors automatically
- Toast notifications for user feedback
- Error boundaries for React component errors
- Graceful degradation for AI service failures

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2022 features required
- No IE11 support

## Deployment

1. Set environment variables in production environment
2. Update API base URL in `services/api.ts` for production
3. Build the application: `npm run build`
4. Serve the `dist/` directory using a web server (nginx, Apache, etc.)
5. Configure server for client-side routing (all routes should serve `index.html`)

## License

Copyright © ThinkLab Group
