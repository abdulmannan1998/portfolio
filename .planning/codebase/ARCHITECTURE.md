# Architecture

**Analysis Date:** 2026-02-06

## Pattern Overview

**Overall:** Next.js 16 full-stack portfolio application with client-side interactive features, progressive component loading, and state management via Zustand.

**Key Characteristics:**

- Next.js App Router with client-side rendering for interactive sections
- Brutalist design language with motion primitives (Framer Motion)
- Lazy-loaded React Flow graph visualization
- Zustand for client state (graph expansion, reveal tracking)
- Static data-driven content from centralized resume data structure
- Component-driven architecture with shared UI primitives

## Layers

**Page/Route Layer:**

- Purpose: Define application routes and entry points
- Location: `app/`
- Contains: Page components, layouts, and route segments
- Depends on: Sections, designs, data
- Used by: Next.js router

**Section Layer:**

- Purpose: Compose full-page sections with specific functionality
- Location: `components/sections/`
- Contains: GraphSection (interactive career graph visualization)
- Depends on: Custom nodes, stores, utilities, Framer Motion
- Used by: Page components

**Component Layer:**

- Purpose: Reusable UI components and feature components
- Location: `components/`
- Contains: CustomNode, AchievementNode, MobileHero, DashboardBackground, GraphLegend, LiveMetricWidget
- Depends on: UI primitives, libraries (lucide-react, framer-motion, @xyflow/react)
- Used by: Sections, pages, designs

**Design System Layer:**

- Purpose: Encapsulate design variants for different portfolio themes
- Location: `components/designs/`
- Contains: 16+ design directories (artdeco, bento, blueprint, brutalist, editorial, glass, isometric, newspaper, noir, organic, pixel, synthwave, terminal, vaporwave, zen, shared)
- Depends on: UI components, CSS utilities
- Used by: App routes for design switching

**UI Primitives Layer:**

- Purpose: Low-level reusable components (form controls, feedback, etc.)
- Location: `components/ui/`
- Contains: Button, Input, Textarea, Select, Combobox, Badge, Field, Label, AlertDialog, Dropdown, Separator, InputGroup, Card
- Depends on: Tailwind CSS, Base UI, Radix UI
- Used by: Feature components, sections

**Data Layer:**

- Purpose: Static content structure for resume, metrics, graph nodes/edges
- Location: `data/`
- Contains: `resume-data.ts` - centralized resume, achievement, metric, graph structure definitions
- Depends on: None
- Used by: Components, sections, utilities

**State Management Layer:**

- Purpose: Client-side state for graph interactions
- Location: `lib/stores/`
- Contains: `graph-store.tsx` (Zustand store for node expansion, reveal tracking)
- Depends on: Zustand
- Used by: GraphSection, CustomNode

**Utility/Helper Layer:**

- Purpose: Shared logic for graph calculations, responsive behavior, styling
- Location: `lib/`
- Contains: Graph utilities, layout calculator, layout constants, debounce, responsive layout hook, utils
- Depends on: Types from @xyflow/react
- Used by: Sections, components

**Hooks Layer:**

- Purpose: Custom React hooks for specialized behavior
- Location: `hooks/`
- Contains: `useResponsiveLayout` - track viewport changes with debouncing
- Depends on: Debounce utility, React hooks
- Used by: Responsive components

## Data Flow

**Page Initialization:**

1. User navigates to `/` → `app/page.tsx` renders
2. Page imports static `RESUME_DATA` from `data/resume-data.ts`
3. Page renders static sections (hero, marquee, about, tech stack, experience, metrics)
4. GraphSection dynamically imported with no SSR (`ssr: false`)
5. GitHub activity fetched client-side from GitHub API

**Graph Visualization Flow:**

1. GraphSection mounted → ReactFlowProvider wraps GraphSectionInner
2. `getInitialNodes()` and `getInitialEdges()` compute positions using viewport dimensions
3. Only root node initially rendered
4. User hovers over graph container → `handleGraphEnter()` triggers
5. `startRevealSequence()` runs via useGraphStore:
   - Soft skill nodes added (Problem-Solving, Collaboration, Quick-Learner)
   - Education node added (Bilkent) at EDUCATION_DELAY_MS
   - Company nodes added (Layermark, Intenseye) at specified delays
6. Hovering company/education node → `handleNodeHover()`:
   - Achievement nodes for that company added to state
   - Related edges added after animation completes
   - `debouncedFitView()` refits viewport
7. ResizeObserver watches container → recalculates dimensions → rerenders graph

**State Management Flow:**

1. Zustand `useGraphStore` maintains:
   - `expandedNodes`: array of expanded node IDs
   - `revealedCompanies`: tracks which companies have been hovered
   - `hasStartedReveal`: prevents re-triggering reveal sequence
2. Store accessed via `useGraphStore.getState()` in callbacks
3. State changes trigger re-renders of affected components

**Component Rendering Flow:**

Static sections render directly from page component with Framer Motion animations:

- Hero: Scale/opacity transforms on scroll
- Marquee: Infinite scroll animation
- About: Split grid with motion variants
- Tech Stack: Grid with staggered item animations
- Experience: Timeline with left-to-right slide animations
- Metrics: Horizontal scroll cards with AnimatedCounter
- GitHub Activity: Fetched and formatted client-side

## Key Abstractions

**CustomNode:**

- Purpose: Render React Flow nodes with type-specific styling and animations
- Examples: `components/custom-node.tsx`
- Pattern: Type-based conditional rendering with Framer Motion variants. Different types (root, company, education, soft-skill) get distinct visual treatments, animations, and interactivity patterns.

**Layout Calculator:**

- Purpose: Compute node positions within safe viewport area avoiding layout overlap
- Examples: `lib/layout-calculator.ts`
- Pattern: Viewport-aware positioning that calculates timeline x-positions and safe area bounds to prevent nodes from rendering outside visible area.

**Resume Data Schema:**

- Purpose: Single source of truth for all content
- Examples: `data/resume-data.ts`
- Pattern: Typed data structure with achievements, metrics, graph nodes/edges. Referenced throughout components avoiding hardcoded content.

**Graph Store (Zustand):**

- Purpose: Client-side state for interactive graph behavior
- Examples: `lib/stores/graph-store.tsx`
- Pattern: Immutable state updates with getState() for outside-component access. Tracks expand/collapse and reveal progression.

**Motion Variants:**

- Purpose: Encapsulate animation configurations
- Examples: `components/custom-node.tsx` (HERO_ENTRANCE_VARIANTS, BLOOM_IN_VARIANTS, etc.)
- Pattern: Module-level constants for variants/transitions preventing recreation on each render. Switch case for type-based animation selection.

## Entry Points

**Main App Entry:**

- Location: `app/layout.tsx`
- Triggers: Server startup
- Responsibilities: Set up root HTML structure, load fonts (Geist), apply CSS globals, provide metadata

**Main Page:**

- Location: `app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Render full-page portfolio with all sections (hero, about, tech, experience, metrics, graph, github), manage scroll state for hero animations, fetch GitHub events client-side

**Graph Section:**

- Location: `components/sections/graph-section.tsx`
- Triggers: User scrolls to graph section
- Responsibilities: Initialize React Flow with nodes/edges, manage reveal sequence, handle viewport resizing and node hover interactions

## Error Handling

**Strategy:** Graceful degradation for optional features, silent failures for non-critical API calls.

**Patterns:**

- GitHub API fetch wrapped in try-catch with error state and fallback UI ("Unable to load activity")
- Graph initially renders with only root node; missing nodes/edges don't break rendering
- Dynamic imports use loading fallback UI ("Loading graph...")
- ResizeObserver errors don't break component (wrapped in effect cleanup)

## Cross-Cutting Concerns

**Logging:** Console-only, no structured logging infrastructure. Errors in GitHub API fetch logged implicitly via try-catch.

**Validation:** TypeScript provides compile-time validation. Runtime validation minimal. Resume data and graph structure validated by TypeScript types.

**Authentication:** Not applicable - portfolio is public. No auth layer needed.

**Performance Optimization:**

- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- Component-level code splitting with dynamic imports
- Package import optimization (`optimizePackageImports` for lucide-react, framer-motion, @xyflow/react)
- Debounced resize handler (300ms) and fitView (150ms)
- useMemo for expensive graph calculations
- ResizeObserver for responsive layout recalculation

---

_Architecture analysis: 2026-02-06_
