# Technology Stack

**Analysis Date:** 2026-02-05

## Languages

**Primary:**

- TypeScript 5.x - All source code uses strict TypeScript for type safety

**Secondary:**

- JavaScript (ES2017+) - Used in configuration files (`.mjs` modules)
- CSS - Utility-first with Tailwind CSS

## Runtime

**Environment:**

- Node.js 20+ (inferred from `@types/node: ^20`)

**Package Manager:**

- pnpm - Primary package manager (referenced in documentation)
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**

- Next.js 16.1.6 - Full-stack React framework with App Router
  - Configuration: `next.config.ts`
  - Features enabled: React Compiler, Partial Prerendering (PPR), cacheComponents
  - Experimental features: `optimizePackageImports`, `staleTimes` for client router cache

**UI & Visualization:**

- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**Component Libraries:**

- Radix UI 1.4.3 - Unstyled accessible component primitives
- Base UI 1.1.0 - Additional UI primitives
- Lucide React 0.563.0 - Icon library (880+ icons)

**Animation & Motion:**

- Framer Motion 12.31.0 - Motion and animation library for micro-interactions

**Graph Visualization:**

- @xyflow/react 12.10.0 - React Flow library for interactive graph rendering
  - Used in `DashboardBackground` component for resume data visualization

**Styling:**

- Tailwind CSS 4 - Utility-first CSS framework
- PostCSS 4 - CSS processing (via `@tailwindcss/postcss`)
- class-variance-authority 0.7.1 - Variant management for styled components
- tailwind-merge 3.4.0 - Utility merge helper (prevents class conflicts)
- tw-animate-css 1.4.0 - Animation utilities for Tailwind

**State Management:**

- Zustand 5.0.11 - Lightweight state management store
  - Usage: `GraphState` in `lib/stores/graph-store.tsx` (view modes, filters, highlighting, expanded nodes)

**Testing & Development:**

- ESLint 9 - Linting (flat config with `eslint.config.mjs`)
  - `@typescript-eslint/parser`: ^8.54.0
  - `@typescript-eslint/eslint-plugin`: ^8.54.0
  - Configured for Next.js core web vitals and TypeScript best practices
- Prettier 3.8.1 - Code formatter
  - Config: `.prettierrc` (semicolons, trailing commas, 80 char width)
  - Integration: via `eslint-plugin-prettier`
- Husky 9.1.7 - Git hooks framework
  - Configured in `.husky/_` directory
- lint-staged 16.2.7 - Run linters on staged files
  - Config: `.lintstagedrc`
- TypeScript compiler plugins: Babel React Compiler (^1.0.0) for optimizations

**Type Definitions:**

- @types/react: ^19 - React type definitions
- @types/react-dom: ^19 - React DOM types
- @types/node: ^20 - Node.js types

**UI Component Generator:**

- shadcn 3.8.2 - UI component CLI (for adding pre-built components)

## Key Dependencies

**Critical:**

- Next.js (16.1.6) - Server-side rendering, static generation, API routes support
- React (19.2.3) - Core UI framework
- TypeScript (5.x) - Type safety across codebase
- Tailwind CSS (4) - Styling infrastructure

**Visualization & Interactivity:**

- @xyflow/react (12.10.0) - Interactive graph/node visualization (primary graph component)
- Framer Motion (12.31.0) - Smooth animations and transitions
- Zustand (5.0.11) - State management for graph interactions, filters, view modes

**UI Infrastructure:**

- Radix UI (1.4.3) - Accessible component primitives
- Base UI (1.1.0) - Additional primitive components
- Lucide React (0.563.0) - Icon set

**Build & Development:**

- Babel React Compiler (1.0.0) - Automatic component memoization
- PostCSS (4) - CSS transformation pipeline

## Configuration

**Environment:**

- No external environment variables detected in source code
- No `.env*` files detected (all data is static)
- Not deployed to require secrets/API keys

**Build:**

- Build config: `next.config.ts` with React Compiler and package import optimization
- TypeScript config: `tsconfig.json`
  - Target: ES2017
  - Module: esnext
  - Path aliases: `@/*` maps to root directory
  - Strict mode enabled
- ESLint config: `eslint.config.mjs` (flat config format)
- PostCSS config: `postcss.config.mjs`
- Component generation: `components.json` (shadcn/ui configuration)
  - Style: radix-lyra
  - Icon library: lucide
  - Base color: stone
  - RSC: enabled (React Server Components)

**Code Quality:**

- Prettier settings in `.prettierrc`:
  - Print width: 80 characters
  - Semicolons: enabled
  - Single quotes: disabled (double quotes)
  - Tab width: 2 spaces
  - Trailing commas: all
- Ignore files: `.prettierignore`, `.gitignore` (standard Next.js ignores)

## Platform Requirements

**Development:**

- Node.js 20+
- pnpm package manager
- macOS/Linux/Windows (cross-platform compatible)

**Production:**

- Deployment target: Vercel (configured via `.vercel/project.json`)
- Next.js serverless functions supported
- Static export capable (no API routes in use)
- Project ID: `prj_NUzrygDa4ReYYjuWu1XeWOTDMNAj`
- Organization: Vercel team deployment

---

_Stack analysis: 2026-02-05_
