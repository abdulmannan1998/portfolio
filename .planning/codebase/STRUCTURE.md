# Codebase Structure

**Analysis Date:** 2026-02-06

## Directory Layout

```
portfolio/
├── app/                          # Next.js App Router pages and layouts
│   ├── designs/                  # Design variant route segments (per-design)
│   ├── labs/                     # Labs page (future feature)
│   ├── layout.tsx                # Root layout with fonts and metadata
│   ├── page.tsx                  # Main portfolio page
│   ├── loading.tsx               # Skeleton/loading UI
│   └── globals.css               # Global styles and Tailwind directives
├── components/                   # React components
│   ├── designs/                  # Design system implementations (16+ themes)
│   ├── sections/                 # Full-page section components
│   │   └── graph-section.tsx     # Interactive career graph
│   ├── nodes/                    # React Flow node components
│   │   └── achievement-node.tsx  # Achievement node renderer
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   ├── combobox.tsx
│   │   ├── field.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── separator.tsx
│   │   └── input-group.tsx
│   ├── custom-node.tsx           # Type-aware React Flow node factory
│   ├── graph-legend.tsx          # Legend for graph visualization
│   ├── mobile-hero.tsx           # Mobile-optimized hero section
│   ├── css-preloader.tsx         # CSS utilities preloader
│   ├── dashboard-background.tsx  # Background visualization component
│   └── live-metric-widget.tsx    # Animated metric display
├── data/                         # Static content and data
│   └── resume-data.ts            # Centralized resume, achievements, metrics, graph schema
├── lib/                          # Utilities and helpers
│   ├── stores/                   # State management (Zustand)
│   │   └── graph-store.tsx       # Graph interaction state
│   ├── graph-utils.ts            # Graph node/edge initialization
│   ├── layout-calculator.ts      # Viewport-aware layout calculations
│   ├── layout-constants.ts       # Reveal animation timing constants
│   ├── debounce.ts               # Debounce utility
│   └── utils.ts                  # Tailwind cn() helper
├── hooks/                        # Custom React hooks
│   └── use-responsive-layout.ts  # Viewport tracking hook
├── public/                       # Static assets
│   └── icon.svg
├── .next/                        # Next.js build output
├── .planning/                    # GSD planning documents
│   ├── codebase/                 # Analysis documents
│   ├── phases/                   # Implementation phase plans
│   └── milestones/               # Milestone tracking
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── components.json               # Shadcn component registry
├── package.json                  # NPM dependencies and scripts
└── pnpm-lock.yaml                # Package lock file
```

## Directory Purposes

**app/:**

- Purpose: Next.js App Router routes and layouts
- Contains: Page components, layout wrappers, loading states
- Key files: `layout.tsx` (root), `page.tsx` (main), `globals.css`

**components/:**

- Purpose: All React components used across the app
- Contains: UI primitives, feature components, sections, nodes
- Key files: `custom-node.tsx`, `graph-section.tsx`

**components/designs/:**

- Purpose: Design system theme implementations
- Contains: 16 themed design directories (artdeco, bento, blueprint, brutalist, editorial, glass, isometric, newspaper, noir, organic, pixel, synthwave, terminal, vaporwave, zen, shared utilities)
- Supports: Multiple portfolio aesthetic variants

**components/sections/:**

- Purpose: Full-page section components
- Contains: GraphSection (career graph visualization)
- Key files: `graph-section.tsx` (main interactive feature)

**components/nodes/:**

- Purpose: React Flow node renderer components
- Contains: AchievementNode and related node types
- Key files: `achievement-node.tsx`

**components/ui/:**

- Purpose: Reusable form and UI primitives
- Contains: Button, Input, Select, Combobox, Badge, Card, Field, AlertDialog, etc.
- Pattern: Based on Radix UI and Base UI with Tailwind styling

**data/:**

- Purpose: Static content and schema definitions
- Contains: Centralized resume data
- Key files: `resume-data.ts` (single source of truth for content)

**lib/:**

- Purpose: Utilities, helpers, and business logic
- Contains: Graph calculations, layout computation, state management, debounce
- Key files: `graph-utils.ts`, `layout-calculator.ts`, `graph-store.tsx`

**lib/stores/:**

- Purpose: Zustand state management
- Contains: Graph interaction state
- Key files: `graph-store.tsx` (node expansion, reveal tracking)

**hooks/:**

- Purpose: Custom React hooks
- Contains: Viewport tracking with debouncing
- Key files: `use-responsive-layout.ts`

**public/:**

- Purpose: Static assets served by Next.js
- Contains: SVG icon
- Generated: No
- Committed: Yes

**.planning/codebase/:**

- Purpose: GSD analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md
- Generated: No
- Committed: Yes

## Key File Locations

**Entry Points:**

- `app/layout.tsx`: Root HTML structure, fonts, metadata
- `app/page.tsx`: Main portfolio page with all sections

**Configuration:**

- `next.config.ts`: Next.js optimization settings (React Compiler, package import optimization)
- `tsconfig.json`: TypeScript strict mode, path aliases (@/\*)
- `tailwind.config.ts`: Tailwind CSS configuration
- `eslint.config.mjs`: ESLint rules
- `.prettierrc`: Prettier formatting options

**Core Logic:**

- `data/resume-data.ts`: All content, achievements, metrics, graph data
- `lib/graph-utils.ts`: Converts resume data to React Flow nodes/edges
- `lib/layout-calculator.ts`: Positions nodes to avoid viewport overlap
- `lib/stores/graph-store.tsx`: Tracks expanded nodes and revealed companies
- `components/sections/graph-section.tsx`: Interactive graph container

**Testing:**

- No tests present in current structure

## Naming Conventions

**Files:**

- PascalCase: React components (`CustomNode.tsx`, `GraphSection.tsx`, `AchievementNode.tsx`)
- camelCase: Utilities and hooks (`graph-utils.ts`, `layout-calculator.ts`, `use-responsive-layout.ts`)
- camelCase with hyphens: Store files (`graph-store.tsx`)
- lowercase: Config files (`next.config.ts`, `tailwind.config.ts`)

**Directories:**

- lowercase: Standard directories (`lib`, `data`, `hooks`, `components`)
- PascalCase: Design theme directories (`Artdeco`, `Bento`, `Blueprint`, etc.) - note: actual directories may use lowercase
- descriptive-hyphenated: Feature-specific directories (`components/sections/`, `lib/stores/`, `components/nodes/`)

**React Components:**

- PascalCase: All component files and exports
- Props interfaces: No explicit naming convention, but `{data, selected, id}` pattern observed
- Event handlers: `handle` prefix (`handleNodeHover`, `handleGraphEnter`, `addNodeAndEdges`)

**Types:**

- PascalCase: All TypeScript types (`GraphState`, `AchievementNode`, `ResponsiveLayout`, `ViewportSize`, `Term`, `Highlight`, `Role`)
- Suffixes: `State` for Zustand stores, `Node` for graph nodes

## Where to Add New Code

**New Feature:**

- Primary code: `components/` for UI, `lib/` for logic
- Tests: Not applicable (no test structure present)
- Example: New section → `components/sections/my-section.tsx`, utilities → `lib/my-utils.ts`

**New Component/Module:**

- Implementation: `components/` if UI/presentation, `lib/` if utility
- Naming: PascalCase for components, camelCase for utilities
- Example: Form component → `components/ui/my-form.tsx`, calculation → `lib/my-calculator.ts`

**Utilities:**

- Shared helpers: `lib/utils.ts` or dedicated files like `lib/my-utility.ts`
- Hooks: Always in `hooks/` directory with `use-` prefix
- Example: New hook → `hooks/use-my-hook.ts`

**New Store:**

- Location: `lib/stores/` with descriptive name
- Export: Create in `my-store.tsx`, export Zustand hook directly
- Example: `lib/stores/my-feature-store.tsx` exporting `useMyFeatureStore`

**New Design Theme:**

- Location: `components/designs/my-theme/`
- Pattern: Mirror existing theme structure (copy from similar existing theme)
- Example: New aesthetic → `components/designs/my-new-style/`

**New Data:**

- Location: `data/` with descriptive name
- Pattern: Export typed objects/arrays
- Example: New section content → `data/my-section-data.ts`

**Global Styling:**

- Location: `app/globals.css`
- Use: Tailwind @layer directives for custom utilities
- Example: New animation → add @keyframes in globals.css, reference in Tailwind config

## Special Directories

**components/designs/:**

- Purpose: Theme implementations for portfolio aesthetics
- Generated: No
- Committed: Yes
- Note: 16 themed directories support different visual styles; main app uses brutalist theme

**.next/:**

- Purpose: Next.js build artifacts
- Generated: Yes
- Committed: No (in .gitignore)

**node_modules/:**

- Purpose: NPM dependencies
- Generated: Yes
- Committed: No (in .gitignore)

**.planning/:**

- Purpose: GSD orchestrator output
- Generated: Semi (by GSD commands)
- Committed: Yes

---

_Structure analysis: 2026-02-06_
