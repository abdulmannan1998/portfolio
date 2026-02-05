# Codebase Structure

**Analysis Date:** 2026-02-05

## Directory Layout

```
portfolio/
├── app/                    # Next.js app directory (SSR entry points)
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main portfolio page
│   ├── loading.tsx        # Loading skeleton
│   ├── globals.css        # Global Tailwind styles
│   ├── icon.svg           # Favicon
│   └── [other routes]     # (none currently)
├── components/            # React UI components
│   ├── dashboard-background.tsx    # Main desktop layout with React Flow
│   ├── custom-node.tsx             # Root/company/education/soft-skill node renderer
│   ├── mobile-hero.tsx             # Mobile timeline and metrics view
│   ├── graph-legend.tsx            # Legend explaining node and edge types
│   ├── live-metric-widget.tsx      # Achievement metric card component
│   ├── css-preloader.tsx           # Loading animation component
│   ├── nodes/                      # Specialized node components
│   │   └── achievement-node.tsx    # Expandable achievement card with details
│   └── ui/                         # shadcn UI component library
│       └── [shadcn components]     # Pre-built UI primitives
├── data/                  # Static data and constants
│   └── resume-data.ts     # All portfolio content (personal, roles, achievements, graph structure)
├── lib/                   # Utility functions and logic
│   ├── graph-utils.ts            # Graph node/edge initialization
│   ├── layout-calculator.ts      # Timeline layout algorithm for node positioning
│   ├── debounce.ts               # Debounce utility
│   ├── utils.ts                  # Class merging utility (cn)
│   └── stores/                   # Zustand state stores
│       └── graph-store.tsx       # Graph state (expanded nodes, filters, view mode)
├── hooks/                 # Custom React hooks
│   └── use-responsive-layout.ts  # Viewport tracking and breakpoint detection
├── public/               # Static assets
│   └── [SVG/images]      # Portfolio graphics
├── .next/               # Next.js build output (excluded from git)
├── node_modules/        # npm dependencies (excluded from git)
├── .github/             # GitHub workflows and config
├── .husky/              # Git hooks
├── package.json         # npm dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
├── eslint.config.mjs    # ESLint configuration
├── tailwind.config.ts   # Tailwind CSS configuration (inferred)
└── .gitignore           # Git exclusions
```

## Directory Purposes

**app/**

- Purpose: Next.js App Router directory - contains route handlers and layouts
- Contains: Page components (`.tsx`), CSS globals, and metadata
- Key files: `page.tsx` (entry point), `layout.tsx` (wrapper)

**components/**

- Purpose: Reusable React UI components
- Contains: Client-side interactive components using Framer Motion, React Flow, Tailwind
- Key files:
  - `dashboard-background.tsx`: Main desktop layout orchestrating graph + header + legend + metrics
  - `custom-node.tsx`: Flexible node renderer for different data types
  - `mobile-hero.tsx`: Simplified mobile view
  - `achievement-node.tsx`: Expandable achievement details card
  - `ui/`: shadcn library for primitive UI elements (buttons, dropdowns, etc.)

**data/**

- Purpose: Single source of truth for portfolio content
- Contains: Resume data structure with personal info, roles, achievements, graph nodes/edges
- Key files: `resume-data.ts` (1000+ lines, heavily typed)

**lib/**

- Purpose: Pure utility functions, algorithms, and state management
- Contains: Graph positioning logic, Zustand store, helper functions
- Key files:
  - `graph-utils.ts`: Converts resume data to React Flow node/edge arrays
  - `layout-calculator.ts`: Algorithm for positioning nodes on a 3-level timeline
  - `stores/graph-store.tsx`: Zustand store for UI state (expanded nodes, filters)

**hooks/**

- Purpose: Custom React hooks for shared logic
- Contains: Viewport tracking, responsive breakpoints
- Key files: `use-responsive-layout.ts` (tracks window size with debounce)

**public/**

- Purpose: Static assets served at root URL
- Contains: SVG icons, images, fonts (minimal)

## Key File Locations

**Entry Points:**

- `app/page.tsx`: Main page component (chooses mobile vs. desktop rendering)
- `app/layout.tsx`: Root layout (metadata, fonts, body wrapper)
- `components/dashboard-background.tsx`: Main desktop app (React Flow orchestrator)

**Configuration:**

- `tsconfig.json`: TypeScript config with `@/*` path alias
- `next.config.ts`: React Compiler enabled, package import optimization
- `eslint.config.mjs`: Linting rules
- `package.json`: Dependencies (Next.js 16, React 19, Zustand 5, Framer Motion, React Flow)

**Core Logic:**

- `data/resume-data.ts`: All content (personal, metrics, roles, achievements, graph nodes/edges)
- `lib/layout-calculator.ts`: Timeline layout algorithm (calculate positions for all nodes)
- `lib/graph-utils.ts`: Converts data to React Flow format
- `lib/stores/graph-store.tsx`: Zustand store (node expansion, filters, view modes)

**Testing:**

- No test files found in codebase

**Components:**

- `components/custom-node.tsx`: Root/company/education/soft-skill nodes (handles animations)
- `components/nodes/achievement-node.tsx`: Expandable achievement cards
- `components/mobile-hero.tsx`: Mobile-only timeline view
- `components/graph-legend.tsx`: Legend explaining graph types

## Naming Conventions

**Files:**

- **Components:** Kebab-case with `.tsx` (e.g., `dashboard-background.tsx`, `custom-node.tsx`)
- **Utilities:** Kebab-case with `.ts` (e.g., `graph-utils.ts`, `layout-calculator.ts`)
- **Hooks:** Kebab-case with `use-` prefix (e.g., `use-responsive-layout.ts`)
- **Data/Constants:** Kebab-case with `.ts` (e.g., `resume-data.ts`)
- **Stores:** Kebab-case ending in `-store.tsx` (e.g., `graph-store.tsx`)

**Directories:**

- **Component folders:** Kebab-case descriptive (e.g., `nodes/`, `ui/`)
- **Utility folders:** Kebab-case plural where applicable (e.g., `hooks/`, `stores/`)

**Variables/Functions:**

- **PascalCase:** React components, types, interfaces (e.g., `CustomNode`, `DashboardBackground`, `GraphState`)
- **camelCase:** Regular functions and variables (e.g., `getInitialNodes`, `handleNodeHover`, `calculateSafeArea`)
- **UPPER_SNAKE_CASE:** Constants and exported data (e.g., `RESUME_DATA`)

**Type Names:**

- **Props types:** Suffix with `Props` (e.g., `DashboardBackgroundProps`, `AchievementNodeProps`)
- **Data types:** Semantic names (e.g., `GraphNode`, `SafeArea`, `ViewportSize`, `ResponsiveLayout`)

## Where to Add New Code

**New Component (presentational):**

- **File location:** `components/[name].tsx` (if top-level) or `components/[category]/[name].tsx` (if specialized)
- **Pattern:** Use `"use client"` directive, export as named function, use Framer Motion for animations
- **Example:** `components/skill-card.tsx` for a new reusable skill display card

**New Specialized Node:**

- **File location:** `components/nodes/[node-type]-node.tsx`
- **Pattern:** Accept `id`, `data`, `selected` props; integrate with React Flow via `Handle` and `Position`
- **Example:** `components/nodes/project-node.tsx` for a new graph node type

**New Hook:**

- **File location:** `hooks/use-[feature].ts`
- **Pattern:** Start with "use" prefix, export typed return value
- **Example:** `hooks/use-graph-animations.ts` for animation orchestration

**New Utility Function:**

- **File location:** `lib/[category].ts` (if fits existing category) or `lib/[new-category].ts`
- **Pattern:** Pure function, well-typed, exported as named export
- **Example:** `lib/color-utils.ts` for color transformation functions

**Extending Resume Data:**

- **File location:** `data/resume-data.ts`
- **Pattern:** Add to existing arrays (metrics, roles, achievements, graph.nodes, graph.edges)
- **Important:** Must match TypeScript types defined at top of file

**New Store:**

- **File location:** `lib/stores/[feature]-store.tsx`
- **Pattern:** Use Zustand with `create<State>((set) => ({...}))`
- **Example:** `lib/stores/filter-store.tsx` for advanced filtering logic

## Special Directories

**`.next/`**

- Purpose: Next.js build output and cache
- Generated: Yes (created by `npm run build`)
- Committed: No (in .gitignore)

**`node_modules/`**

- Purpose: npm package dependencies
- Generated: Yes (created by `npm install`)
- Committed: No (in .gitignore)

**`public/`**

- Purpose: Static assets served at root URL
- Generated: No (manually added)
- Committed: Yes
- Access: Can reference in code as `/filename.svg`

**`.github/`**

- Purpose: GitHub workflows and configuration
- Generated: No (manually configured)
- Committed: Yes
- Contains: CI/CD workflows, issue templates, PR templates

**`.husky/`**

- Purpose: Git hooks for automated checks
- Generated: Semi (git hooks created by husky package)
- Committed: Yes
- Runs: Pre-commit linting and formatting via `lint-staged`

---

_Structure analysis: 2026-02-05_
