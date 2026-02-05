# Architecture

**Analysis Date:** 2026-02-05

## Pattern Overview

**Overall:** Component-driven Next.js app with React Flow graph visualization and Zustand state management.

**Key Characteristics:**

- Single-page responsive portfolio with interactive graph visualization
- Lazy-loaded components to minimize initial bundle (React Flow is client-only)
- Responsive design with separate mobile/desktop rendering strategies
- Zustand store for graph state (expand/collapse, filters, view modes)
- Timeline-based graph layout with staggered reveal animations

## Layers

**Presentation Layer:**

- Purpose: React components responsible for rendering UI and handling user interactions
- Location: `components/` directory (e.g., `dashboard-background.tsx`, `custom-node.tsx`, `mobile-hero.tsx`)
- Contains: Client components using Framer Motion for animations, ReactFlow for graph visualization, Lucide icons
- Depends on: Data layer (`data/resume-data.ts`), utilities layer (`lib/`), state management (`lib/stores/`)
- Used by: Next.js page component (`app/page.tsx`)

**State Management Layer:**

- Purpose: Zustand store for graph-related state (expanded nodes, filters, view modes, hover states)
- Location: `lib/stores/graph-store.tsx`
- Contains: Single store with actions for node expansion, highlighting, filtering
- Depends on: Nothing external (self-contained)
- Used by: Components like `achievement-node.tsx`, `dashboard-background.tsx`

**Data Layer:**

- Purpose: Resume data structure and achievement/role definitions
- Location: `data/resume-data.ts`
- Contains: Personal info, metrics, roles, achievements, graph nodes/edges
- Depends on: TypeScript types defined in same file
- Used by: Layout calculator, graph utilities, and presentation components

**Layout & Calculation Layer:**

- Purpose: Algorithmic positioning of graph nodes based on viewport and layout rules
- Location: `lib/layout-calculator.ts`, `lib/graph-utils.ts`
- Contains: Timeline positioning algorithm, safe area calculation, responsive spacing
- Depends on: Data layer (resume data), React Flow types
- Used by: Dashboard component, graph initialization

**Utilities Layer:**

- Purpose: Shared helper functions and hooks
- Location: `lib/` (e.g., `utils.ts`, `debounce.ts`), `hooks/` (e.g., `use-responsive-layout.ts`)
- Contains: Class merging (`cn`), debounce, viewport tracking
- Depends on: Nothing external
- Used by: Various components and hooks

## Data Flow

**Initial Page Load:**

1. `app/page.tsx` renders and checks `useResponsiveLayout()` hook
2. Page determines mobile vs. desktop path
3. **Desktop path:** Dynamic import of `DashboardBackground` component
4. `DashboardBackground` initializes React Flow with minimal nodes (only root visible)
5. All nodes/edges fetched from `getInitialNodes()` and `getInitialEdges()` (which use `RESUME_DATA`)
6. Graph dimensions are tracked via ResizeObserver for responsive repositioning

**Graph Reveal Sequence (Desktop):**

1. User hovers over graph container → `handleGraphEnter()` triggers
2. `startRevealSequence()` executes staggered reveal:
   - Stage 1 (0-600ms): Soft skills appear sequentially, left to right
   - Stage 2 (1200ms): Education (Bilkent)
   - Stage 3 (1700ms): Layermark company
   - Stage 4 (2200ms): Intenseye company
3. Each node triggers `addNodeAndEdges()` which:
   - Adds node to graph with animation handler
   - Delays edges by 500ms for smooth appearance
   - Calls `fitViewSmooth()` to center graph
4. After complete reveal, `fitView` animates smoothly over 800ms

**Achievement Expansion (on hover):**

1. User hovers over company/education node
2. `handleNodeHover()` detects achievement edges connected to that node
3. Achievement nodes are added with staggered animation delays (100ms each)
4. Edges added after nodes animate in (calculated delay based on node count)
5. Z-index managed via Zustand store to layer expanded nodes on top

**Mobile Path:**

1. `MobileHero` component renders simplified card-based timeline
2. No graph visualization
3. Metrics displayed as a grid
4. Content ready callback triggers after 500ms

**State Management Flow:**

1. `useGraphStore` tracks:
   - `expandedNodes`: Set of node IDs currently expanded
   - `highlightedConnections`: For future connection highlighting
   - `activeFilters`: Technology/company/category filters (unused but structured for future)
   - `viewMode`: "timeline" | "technology" | "impact" | "compact" (not currently used)
   - `hoveredNode`: Current hovered node (reserved for future)
2. Achievement node clicks dispatch `expandNode(id)` or `collapseNode(id)`
3. Z-index updated via effect listening to `expandedNodes` changes

## Key Abstractions

**Graph Timeline Layout:**

- Purpose: Positions nodes in a 3-level hierarchy (root → timeline → achievements) with responsive spacing
- Examples: `layout-calculator.ts`
- Pattern: Functional algorithm that takes viewport, safe area, and nodes → returns positioned Node[] array
  - Level 1: Root node centered at top
  - Level 2: Soft skills around root, timeline nodes (companies/education) horizontally spread
  - Level 3: Achievement nodes staggered below their parent company

**Node Types:**

- Purpose: Define different node representations in graph
- Examples: `CustomNode` (root, company, education, soft-skill), `AchievementNode` (expandable achievement cards)
- Pattern: React components receiving `data`, `selected`, and `id` props
  - `CustomNode` has multiple render paths based on `data.type`
  - `AchievementNode` integrates with Zustand store for expand/collapse

**Animation Variants:**

- Purpose: Reusable Framer Motion animation definitions
- Examples: `hero-entrance`, `bloom-in`, `slide-up`, `fade-drop`, `pop-in` in `custom-node.tsx`
- Pattern: Function mapping animation type string to Framer Motion configuration object

**Responsive Layout Hook:**

- Purpose: Centralize viewport tracking and breakpoint logic
- Examples: `useResponsiveLayout()` in `hooks/use-responsive-layout.ts`
- Pattern: Returns `{ isMobile, isTablet, isDesktop, viewport }` with debounced resize listener

## Entry Points

**Root Page Component:**

- Location: `app/page.tsx`
- Triggers: Direct page navigation
- Responsibilities:
  - Determine responsive layout (mobile vs. desktop)
  - Manage loading state and content-ready transitions
  - Pass header, legend, and metrics to desktop view
  - Route to `MobileHero` or `DashboardBackground`

**React Layout:**

- Location: `app/layout.tsx`
- Triggers: All pages (applies to entire app)
- Responsibilities:
  - Load Google fonts (Geist Sans/Mono)
  - Set metadata and favicon
  - Wrap with global styles

**CSS Preloader:**

- Location: `components/css-preloader.tsx`
- Triggers: Page load (while `loading` state is true)
- Responsibilities: Display loading animation before content renders

## Error Handling

**Strategy:** Graceful degradation with minimal error handling visible

**Patterns:**

- No explicit error boundaries visible in code
- React's strict mode enabled (`reactStrictMode: true`)
- Dynamic imports for client-only components use fallback (implicit: renders nothing if failed)
- No error logging infrastructure visible

## Cross-Cutting Concerns

**Logging:** None detected - no logging framework in use

**Validation:** Minimal - data types defined in TypeScript, no runtime validation

**Authentication:** None - static portfolio site

**Performance:**

- Dynamic imports with SSR disabled for React Flow (browser-only)
- Package import optimization in Next.js config (lucide-react, framer-motion, @xyflow/react)
- React Compiler enabled (`reactCompiler: true`)
- Component caching enabled (`cacheComponents: true`)
- Debounced resize handler (300ms) for graph repositioning
- Layout calculations memoized via `useCallback` in dashboard component

---

_Architecture analysis: 2026-02-05_
