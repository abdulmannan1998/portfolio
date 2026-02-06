# Coding Conventions

**Analysis Date:** 2026-02-06

## Naming Patterns

**Files:**

- React components: PascalCase (e.g., `CustomNode.tsx`, `GraphSection.tsx`)
- Utility modules: camelCase (e.g., `debounce.ts`, `graph-utils.ts`)
- Data/constants: camelCase or SCREAMING_SNAKE_CASE for module-level constants (e.g., `resume-data.ts`, `REVEAL_TIMING` in `layout-constants.ts`)
- Hooks: camelCase with `use` prefix (e.g., `use-responsive-layout.ts`)
- Directories: kebab-case (e.g., `graph-section`, `ui`, `nodes`)

**Functions:**

- Regular functions: camelCase (e.g., `formatTimeAgo()`, `getCommitMessage()`, `debounce()`)
- React components: PascalCase (e.g., `CustomNode()`, `MarqueeText()`, `GitHubActivity()`)
- Handler functions: camelCase with verb prefix (e.g., `handleResize()`, `expandNode()`, `onMouseEnter()`)
- Getter/selector functions: camelCase starting with `get` or standalone selector names (e.g., `getAnimationConfig()`, `getEdgeColor()`)

**Variables:**

- State variables: camelCase (e.g., `expandedNodes`, `loading`, `events`)
- Constants (module-level): SCREAMING_SNAKE_CASE or camelCase depending on context
  - Animation constants: SCREAMING_SNAKE_CASE (e.g., `HERO_ENTRANCE_VARIANTS`, `BLOOM_TRANSITION`)
  - Regular constants: camelCase (e.g., `nodeTypes`, `softSkillDuration`)
- CSS class names: kebab-case from Tailwind (applied via className prop)

**Types:**

- Type definitions: PascalCase (e.g., `ViewportSize`, `ResponsiveLayout`, `GitHubEvent`)
- Discriminated union types: PascalCase with literal strings (e.g., `Term`, `Highlight`)
- Generic type parameters: Single uppercase letters or descriptive PascalCase (e.g., `T`, `GraphState`)

## Code Style

**Formatting:**

- Tool: Prettier v3.8.1
- Print width: 80 characters
- Tab width: 2 spaces
- Quotes: Double quotes (not single)
- Semicolons: Always included
- Trailing commas: All
- Arrow function parens: Always (even single params)
- End of line: LF

**Linting:**

- Tool: ESLint v9 with TypeScript support
- Parser: @typescript-eslint/parser v8.54.0
- Key plugins: @typescript-eslint, prettier, next
- Notable rules:
  - `@typescript-eslint/consistent-type-imports`: Enforces type-only imports with inline syntax
  - `no-console`: Warns except for `.warn()` and `.error()`
  - `no-var`: Error (use const/let only)
  - `eqeqeq`: Error (strict equality always)
  - `react-hooks/exhaustive-deps`: Warns on missing hook dependencies
  - Unused variables: Warnings allowed if prefixed with underscore

**Configuration Files:**

- `.eslintrc` generated via `eslint.config.mjs` (flat config format)
- `.prettierrc` in JSON format
- `tsconfig.json` with strict mode enabled

## Import Organization

**Order:**

1. React/Next.js core imports
2. Third-party libraries (framer-motion, lucide-react, etc.)
3. Relative imports from `@/` alias (absolute path imports)
4. Type imports (via `type` keyword, inline style)

**Pattern Examples:**

```typescript
// app/page.tsx
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { RESUME_DATA } from "@/data/resume-data";
import type { Metadata } from "next";
```

**Path Aliases:**

- `@/*` maps to root directory (monorepo-style, allows `@/components`, `@/lib`, `@/data`, etc.)

**"use client" Directive:**

- Applied to interactive components (client-side state, event handlers)
- Examples: `app/page.tsx`, `components/custom-node.tsx`, `lib/stores/graph-store.tsx`
- Server components use default export without directive

## Error Handling

**Patterns:**

- Try-catch blocks for async operations (fetch, API calls)
- Null/undefined checks via optional chaining (`?.`)
- Fallback UI for loading/error states

**Examples:**

```typescript
// Async error handling
async function fetchGitHubActivity() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    setEvents(data);
  } catch {
    setError("Unable to load activity");
  } finally {
    setLoading(false);
  }
}

// Optional chaining
const message = event.payload.commits?.[0].message;

// Fallback for conditional rendering
{loading ? <Loading /> : error ? <Error message={error} /> : <Content />}
```

## Logging

**Framework:** `console` (built-in)

**Patterns:**

- ESLint restricts console to `.warn()` and `.error()` only
- No debug-level logging in production code
- Examples in codebase: No direct logging found; typically avoided

**When to Log:**

- Errors and warnings only
- Use console.error for exceptions
- Use console.warn for deprecation notices or unusual conditions

## Comments

**When to Comment:**

- Complex algorithm explanation (e.g., timeline positioning logic in `layout-calculator.ts`)
- Non-obvious business logic (e.g., handle assignments in graph edges)
- Temporary workarounds or hacks (prefix with `TODO`, `FIXME`, `HACK`)

**JSDoc/TSDoc:**

- Not strictly enforced but used for public APIs
- Example from `graph-store.tsx`: Functions documented via type annotations
- Type definitions serve as primary documentation

**Examples:**

```typescript
// layout-calculator.ts - Algorithm comments
const safeArea = calculateSafeArea(
  viewport,
  140, // headerHeight
  220, // metricsHeight
  240, // leftMargin
  100, // rightMargin
);

// graph-utils.ts - Complex logic
if (edge.type === "soft-skill") {
  // Soft skills connect from TOP of root to BOTTOM of soft skill nodes
  sourceHandle = "top";
  targetHandle = "bottom";
}
```

## Function Design

**Size:** Keep functions small and focused. Typical range: 10-50 lines

**Parameters:**

- Prefer object parameters for multiple related values
- Example: `ViewportSize = { width: number; height: number }`
- Optional parameters use default values or trailing `?`

**Return Values:**

- Explicit return type annotations required for public functions
- Example: `function useResponsiveLayout(): ResponsiveLayout`
- Arrow functions infer types from simple return statements

**Examples:**

```typescript
// Utility function with object destructuring
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hook with explicit return type
export function useResponsiveLayout(): ResponsiveLayout {
  // Implementation
  return { isMobile, isTablet, isDesktop, viewport };
}

// Component with typed props
export function CustomNode({
  data,
  selected,
  id,
}: {
  data: {
    label: string;
    type: string;
    animationDelay?: number;
    onHoverChange?: (nodeId: string, isEntering: boolean) => void;
  };
  selected: boolean;
  id: string;
}) {
  // Implementation
}
```

## Module Design

**Exports:**

- Named exports for utilities and types
- Default export for React components (when single component per file)
- Example from `button.tsx`: `export { Button, buttonVariants }`

**Barrel Files:**

- Not used in this codebase; each component has its own import path
- UI components live in `components/ui/` with direct imports like `@/components/ui/button`

**File Organization:**

```
components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── nodes/                 # React Flow node components
│   ├── achievement-node.tsx
│   ├── custom-node.tsx
├── sections/              # Page sections
│   └── graph-section.tsx
└── mobile-hero.tsx        # Standalone components
```

**Private vs Public:**

- Files in `lib/` are utilities (public by convention)
- Files in `data/` hold static data (public constants)
- Files in `components/` are reusable UI (public) or internal (private by context)

## TypeScript-Specific Patterns

**Type Imports:**

- Use inline type-only imports: `import type { ViewportSize } from "@/hooks/use-responsive-layout"`
- Enforced by ESLint rule `@typescript-eslint/consistent-type-imports`

**Discriminated Unions:**

- Used for complex type safety (e.g., `Term` type union in `resume-data.ts`)
- Enable exhaustive pattern matching in switch statements

**Generic Constraints:**

- Used in utility functions like `debounce<T extends (...args: unknown[]) => unknown>`

---

_Convention analysis: 2026-02-06_
