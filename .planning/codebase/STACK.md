# Technology Stack

**Analysis Date:** 2026-02-06

## Languages

**Primary:**

- TypeScript 5 - Application code, components, utilities, and configuration
- CSS/Tailwind - Styling and layout

**Secondary:**

- JavaScript (JSX/TSX) - React component files
- MDX - Documentation (potential future use)

## Runtime

**Environment:**

- Node.js (version not explicitly pinned, inferred as LTS from Next.js 16 compatibility)

**Package Manager:**

- npm (implied by package.json)
- Lockfile: present (implied by pnpm-lock.yaml reference in .eslintignore)

## Frameworks

**Core:**

- Next.js 16.1.6 - Full-stack React framework for server-side rendering, API routes, and deployment
- React 19.2.3 - UI library and component framework
- React DOM 19.2.3 - DOM rendering for React

**UI & Styling:**

- Tailwind CSS 4 - Utility-first CSS framework with PostCSS
- Shadcn 3.8.2 - Pre-built component library built on Radix UI
- Class Variance Authority 0.7.1 - Type-safe component variants
- Tailwind Merge 3.4.0 - Merge conflicting Tailwind classes
- Lucide React 0.563.0 - Icon library with React components

**Animation & Interaction:**

- Framer Motion 12.31.0 - Production animation library
- tw-animate-css 1.4.0 - Tailwind animation utilities

**UI Primitives:**

- Radix UI 1.4.3 - Low-level accessible component primitives
- Base UI React 1.1.0 - React component foundation library

**State Management:**

- Zustand 5.0.11 - Lightweight state management

**Data Visualization & Graphs:**

- @xyflow/react 12.10.0 (React Flow) - Interactive graph/diagram library with node-based editing
- Konva (referenced in code) - Canvas library for drawing and visualization

**Utilities:**

- clsx 2.1.1 - Conditional classname utility

## Build & Development

**Compiler & Bundler:**

- Babel Plugin React Compiler 1.0.0 - React compiler optimization plugin for Next.js

**Code Quality:**

- ESLint 9 - JavaScript/TypeScript linter
- @typescript-eslint/parser 8.54.0 - TypeScript parser for ESLint
- @typescript-eslint/eslint-plugin 8.54.0 - TypeScript-specific ESLint rules
- Prettier 3.8.1 - Code formatter
- eslint-config-prettier 10.1.8 - Disable ESLint rules that conflict with Prettier
- eslint-plugin-prettier 5.5.5 - Prettier as ESLint plugin
- eslint-config-next 16.1.6 - Next.js ESLint configuration

**Git Hooks:**

- Husky 9.1.7 - Git hooks manager
- Lint-staged 16.2.7 - Run linters on staged files

**PostCSS:**

- @tailwindcss/postcss 4 - Tailwind CSS PostCSS plugin

## Key Dependencies

**Critical:**

- Next.js 16.1.6 - Core framework enabling Server Components, optimization, and deployment
- React 19.2.3 - UI rendering engine
- TypeScript 5 - Type safety across codebase

**UI & Components:**

- Shadcn 3.8.2 - Design system component library (Radix-based)
- Tailwind CSS 4 - Styling backbone
- Lucide React 0.563.0 - Icon primitives

**Visualization & Interaction:**

- Framer Motion 12.31.0 - Complex animations (hero section, transitions, scroll effects)
- @xyflow/react 12.10.0 - Interactive career graph visualization with node editing
- Zustand 5.0.11 - Graph state management (`/lib/stores/graph-store.tsx`)

**Infrastructure:**

- Vercel (deployment platform - `.vercel/project.json` present)

## Configuration Files

**TypeScript:**

- `tsconfig.json` - TypeScript compiler options
  - Target: ES2017
  - Module: esnext
  - Strict mode enabled
  - Path aliases: `@/*` maps to project root
  - JSX: react-jsx (automatic JSX transform)

**Next.js:**

- `next.config.ts` - Next.js configuration
  - React Compiler enabled (`reactCompiler: true`)
  - Component caching enabled (`cacheComponents: true`)
  - Package imports optimized for Lucide React, Framer Motion, @xyflow/react
  - Static cache: 180s, dynamic cache: 30s (staleTimes)
  - Image formats: AVIF and WebP
  - React strict mode enabled

**ESLint:**

- `eslint.config.mjs` - Flat config format (ESLint 9+)
  - Next.js Core Web Vitals rules
  - Next.js TypeScript rules
  - TypeScript-specific rules with warnings for unused vars (argsIgnorePattern: `^_`)
  - React hooks enforcement
  - No var, prefer const, strict equality (`eqeqeq`)

**PostCSS:**

- `postcss.config.mjs` - Tailwind CSS plugin configuration

**Formatting:**

- `.prettierrc` - Prettier configuration (referenced but content controlled via eslint-config-prettier)

## Development Workflow

**Commands (from `package.json`):**

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting without modifying
npm run prepare      # Husky setup hook
```

**Git Integration:**

- Husky pre-commit hooks with lint-staged (enforces linting/formatting on staged files)

## Platform Requirements

**Development:**

- Node.js (LTS recommended for Next.js 16)
- npm or compatible package manager
- Git (for Husky hooks)

**Production:**

- Vercel deployment platform (primary target - `.vercel/project.json` configured)
- Alternative: Any Node.js 18+ compatible environment

**Environment:**

- No environment variables detected in codebase (portfolio uses public GitHub API)
- Optional: GitHub API access (used for public activity feed, no auth key required)

## Build Output

- `.next/` - Next.js build artifacts (included in .eslintignore)
- `out/` - Static export target (if configured)
- `dist/` or `build/` - Alternative build outputs

---

_Stack analysis: 2026-02-06_
