# Coding Conventions

**Analysis Date:** 2026-02-05

## Naming Patterns

**Files:**

- **Components:** PascalCase with file extension matching purpose (e.g., `DashboardBackground.tsx`, `LiveMetricWidget.tsx`, `achievement-node.tsx`)
  - Exception: Component folders use kebab-case (e.g., `nodes/`, `ui/`)
- **Hooks:** camelCase with `use` prefix (e.g., `use-responsive-layout.ts`)
- **Utilities/Libraries:** camelCase (e.g., `debounce.ts`, `graph-utils.ts`, `layout-calculator.ts`)
- **Data files:** camelCase (e.g., `resume-data.ts`)
- **Configuration:** kebab-case for config files in root (e.g., `.prettierrc`, `eslint.config.mjs`)

**Functions:**

- **React Components:** PascalCase exported function (e.g., `export function DashboardBackground()`, `export function LiveMetricWidget()`)
- **Helper/Utility Functions:** camelCase (e.g., `debounce()`, `getInitialNodes()`, `getEdgeColor()`)
- **Type predicates/guards:** camelCase starting with `is` or `get` (e.g., `getTimelinePositions()`)

**Variables:**

- **Constants:** camelCase or UPPER_SNAKE_CASE for module-level constants
  - Example: `const nodeTypes = { custom: CustomNode, achievement: AchievementNode };` (line 21-24 in `/Users/sunny/Desktop/Sunny/portfolio/components/dashboard-background.tsx`)
  - Data objects: camelCase (e.g., `softSkillNodes`, `expandedNodes`)
- **State variables:** camelCase (e.g., `isMobile`, `isExpanded`, `graphDimensions`)
- **Props objects:** camelCase (e.g., `MetricProps`, `DashboardBackgroundProps`)

**Types:**

- **Exported types:** PascalCase (e.g., `export type ViewportSize`, `export type ResponsiveLayout`, `export type AchievementNode`)
- **Inline/Local types:** PascalCase (e.g., `type AchievementNodeProps`, `type FilterState`)
- **Type imports:** Use `type` keyword for type-only imports (e.g., `import type { Node, Edge } from "@xyflow/react"`)

## Code Style

**Formatting:**

- **Tool:** Prettier v3.8.1
- **Key settings:** (`/Users/sunny/Desktop/Sunny/portfolio/.prettierrc`)
  - `semi: true` - Semicolons required
  - `trailingComma: "all"` - Trailing commas in multi-line objects/arrays
  - `singleQuote: false` - Double quotes for strings
  - `printWidth: 80` - Line length limit
  - `tabWidth: 2` - 2 spaces per indent
  - `useTabs: false` - Spaces, not tabs
  - `arrowParens: "always"` - Always wrap arrow function parameters in parens
  - `bracketSpacing: true` - Space inside braces `{ key: value }`
  - `jsxSingleQuote: false` - Double quotes in JSX
  - `endOfLine: "lf"` - Unix line endings

**Linting:**

- **Tool:** ESLint v9 with TypeScript support
- **Config file:** `/Users/sunny/Desktop/Sunny/portfolio/eslint.config.mjs` (flat config format)
- **Key rules enforced:**
  - `no-console`: warn (allow console.warn and console.error)
  - `prefer-const`: warn
  - `no-var`: error (enforce const/let)
  - `eqeqeq: ["error", "always"]` - Strict equality checks
  - `@typescript-eslint/no-unused-vars`: warn (ignore leading `_`)
  - `@typescript-eslint/no-explicit-any`: warn
  - `@typescript-eslint/consistent-type-imports`: warn (prefer type-only imports with inline style)
  - `react/self-closing-comp`: warn
  - `react-hooks/rules-of-hooks`: error
  - `react-hooks/exhaustive-deps`: warn

## Import Organization

**Order:**

1. React and Next.js imports (e.g., `import { useState } from "react"`, `import dynamic from "next/dynamic"`)
2. Third-party libraries (e.g., `import { motion } from "framer-motion"`, `import { create } from "zustand"`)
3. Internal absolute imports using `@/` alias (e.g., `import { RESUME_DATA } from "@/data/resume-data"`)
4. Type imports with `type` keyword grouped separately (e.g., `import type { Node } from "@xyflow/react"`)

**Example from `/Users/sunny/Desktop/Sunny/portfolio/components/dashboard-background.tsx`:**

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getInitialNodes, getInitialEdges } from "@/lib/graph-utils";
import { CustomNode } from "@/components/custom-node";
import { AchievementNode } from "@/components/nodes/achievement-node";
import { useGraphStore } from "@/lib/stores/graph-store";
```

**Path Aliases:**

- `@/` points to project root (configured in `tsconfig.json`: `"@/*": ["./*"]`)
- Used throughout codebase for absolute imports

## Error Handling

**Patterns:**

- No explicit try-catch patterns found in production code
- Defensive null checks and optional chaining used where applicable
  - Example: `data.onHoverChange?.(id, entering)` (line 107 in `/Users/sunny/Desktop/Sunny/portfolio/components/nodes/achievement-node.tsx`)
- Ref guards: `if (!graphContainerRef.current) return;` pattern
- State validation before operations: `if (graphDimensions.width === 0 || graphDimensions.height === 0) return;` (line 241 in dashboard-background.tsx)
- Boundary checks in React Flow interactions: Filter checks before state updates

**Recommended approach for new code:**

- Use optional chaining (`?.`) for property access on potentially null values
- Use nullish coalescing (`??`) for default values
- Validate refs before using them
- Return early from hooks/functions on invalid conditions
- No throwing errors in component code (use state/UI feedback instead)

## Logging

**Framework:** `console` object (not abstracted)

**Patterns:**

- ESLint `no-console` rule set to warn with allowlist: `["warn", "error"]`
- Only `console.warn()` and `console.error()` allowed in production code
- `console.log()` discouraged (will be caught as warning by linter)

**When to log:**

- Use `console.error()` for error conditions that should be tracked
- Use `console.warn()` for non-critical issues or deprecation warnings
- Prefer explicit error UI over logging for user-facing issues

## Comments

**When to Comment:**

- Explain the "why" not the "what" - code should be self-documenting
- Comment complex logic that isn't immediately clear from reading the code
- Example from `/Users/sunny/Desktop/Sunny/portfolio/components/dashboard-background.tsx`:
  - Line 38: `// Track the graph container dimensions`
  - Line 45: `// Fit view smoothly`
  - Line 84: `// Note: edge.type is "smoothstep" (ReactFlow type), original type is in edge.data.edgeType`
- Use inline comments for non-obvious calculations or workarounds
- Link to related code or external documentation when helpful

**JSDoc/TSDoc:**

- Used sparingly for exported functions and types
- Type signatures are self-documenting (full type information visible)
- Example pattern in `/Users/sunny/Desktop/Sunny/portfolio/lib/debounce.ts`:
  ```typescript
  export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
  ```

## Function Design

**Size:**

- Keep functions focused and reasonably sized (20-50 lines preferred)
- Larger functions like `DashboardBackgroundInner` (331 lines) are component-specific and contain multiple concerns (state, rendering, event handling)
- Extract utility functions when complexity reaches 100+ lines

**Parameters:**

- Use object destructuring for multiple parameters (especially in components)
- Example: `function CustomNode({ data, selected, id }: ComponentProps)`
- Single parameters without destructuring acceptable for simple values (e.g., `debounce(func, wait)`)
- Type each parameter explicitly

**Return Values:**

- Explicitly type return values for public/exported functions
- Use `void` for functions that don't return values
- React components return `React.ReactNode` implicitly (via JSX)
- Utility functions should be clear about what they return

**Callbacks:**

- Type callbacks with `(args: Type) => ReturnType` signature
- Example from achievement-node.tsx: `onHoverChange?: (nodeId: string, isEntering: boolean) => void`
- Pass callbacks through props when crossing component boundaries
- Use `useCallback` hook to memoize callbacks (see dashboard-background.tsx extensively)

## Module Design

**Exports:**

- **Components:** Export as named functions (`export function ComponentName()`)
- **Hooks:** Export as named functions (`export function useHookName()`)
- **Utilities:** Export as named functions/constants (`export function utilName()`, `export const CONSTANT = ...`)
- **Types:** Export as type-only (`export type TypeName = ...`)
- Avoid default exports for components/functions; use named exports

**Barrel Files:**

- Not used in this codebase
- Each file exports its specific functionality

**Example structure from `/Users/sunny/Desktop/Sunny/portfolio/lib/graph-utils.ts`:**

```typescript
export const getInitialNodes = (...): Node[] => { ... };

function getEdgeColor(edgeType?: string): string { ... }  // private helper

function getEdgeWidth(edgeType?: string): number { ... }  // private helper

export const getInitialEdges = (): Edge[] => { ... };
```

## TypeScript Specific

**Type Imports:**

- Always use `import type` for type-only imports (ESLint enforced)
- Inline style preferred: `import type { Node, Edge } from "@xyflow/react"`
- Never import types with regular `import` unless also importing values

**Any Type:**

- `@typescript-eslint/no-explicit-any` set to warn
- Avoid `any` type - use generics or union types instead
- If forced to use `any`, add explanatory comment

**Non-null Assertions:**

- `@typescript-eslint/no-non-null-assertion` set to warn
- Prefer type guards and optional chaining over `!`
- Use only when certainty is absolute and unrefactorable

## Responsive/Conditional Styles

**Tailwind CSS:**

- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` for breakpoints
- Example from page.tsx: `className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl"`
- Use `clsx` and `cn()` utility for conditional classes
- Tool: `tailwindcss` v4 with `@tailwindcss/postcss`

## Component Patterns

**Client Components:**

- Marked with `"use client"` directive when using hooks or browser APIs
- Example: All interactive components in `/Users/sunny/Desktop/Sunny/portfolio/components/` start with `"use client"`

**Server Components:**

- Default in Next.js 13+
- Used in layouts and data-fetching components
- Example: `/Users/sunny/Desktop/Sunny/portfolio/app/layout.tsx` is a server component

**State Management:**

- Zustand stores for global state (`/Users/sunny/Desktop/Sunny/portfolio/lib/stores/graph-store.tsx`)
- Local React state (useState) for component-level state
- Zustand pattern: `const useStore = create<StateType>((set) => ({ ... }))`

---

_Convention analysis: 2026-02-05_
