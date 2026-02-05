# Phase 02: Constants Extraction - Research

**Researched:** 2026-02-05
**Domain:** TypeScript Constants Extraction & Code Refactoring
**Confidence:** HIGH

## Summary

Constants extraction is the practice of replacing "magic numbers" (numeric literals scattered throughout code) with named constants in a centralized location. This refactoring improves code maintainability by establishing a single source of truth, making the code's intent clearer, and simplifying future changes.

This phase focuses on extracting layout calculations, positioning values, and timing constants from three files (layout-calculator.ts, dashboard-background.tsx, achievement-node.tsx) into a centralized lib/layout-constants.ts file. The codebase uses TypeScript 5, Next.js 16, React 19, with Framer Motion for animations and @xyflow/react for graph visualization.

The standard approach for TypeScript/React projects in 2026 is domain-based constant organization using named exports with UPPER_SNAKE_CASE naming for true constants. Modern tooling supports tree-shaking, making centralized constant files efficient.

**Primary recommendation:** Create lib/layout-constants.ts with domain-grouped constant objects (SAFE_AREA, ACHIEVEMENT_LAYOUT, REVEAL_TIMING) using named exports, following TypeScript naming conventions.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library    | Version                     | Purpose                        | Why Standard                                                     |
| ---------- | --------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| TypeScript | 5.x                         | Type-safe constant definitions | Industry standard for type safety, prevents accidental mutations |
| ESLint     | 9.x with @typescript-eslint | Enforce no-magic-numbers rule  | Automated detection of magic numbers during development          |

### Supporting

| Library             | Version        | Purpose                | When to Use                                                 |
| ------------------- | -------------- | ---------------------- | ----------------------------------------------------------- |
| Prettier            | 3.8.x          | Consistent formatting  | Already in project, ensures consistent constant formatting  |
| as const assertions | TypeScript 5.x | Literal type narrowing | For readonly object/array constants requiring precise types |

### Alternatives Considered

| Instead of            | Could Use                 | Tradeoff                                                                   |
| --------------------- | ------------------------- | -------------------------------------------------------------------------- |
| Single constants file | Separate files per domain | Current project size (3 files) doesn't warrant split; use single file      |
| UPPER_SNAKE_CASE      | camelCase                 | UPPER_SNAKE_CASE clearly indicates immutability and compile-time constants |
| Named exports         | Default export object     | Named exports enable better tree-shaking and explicit imports              |

**Installation:**
No additional packages needed - TypeScript and ESLint already configured.

## Architecture Patterns

### Recommended Project Structure

```
lib/
├── layout-constants.ts    # NEW: All layout, positioning, timing constants
├── layout-calculator.ts   # MODIFIED: Import and use constants
├── graph-utils.ts
├── debounce.ts
└── utils.ts
```

### Pattern 1: Domain-Grouped Constants with Named Exports

**What:** Group related constants into domain objects, export as const, use named exports
**When to use:** When constants are related by domain (layout, timing, positioning)
**Example:**

```typescript
// lib/layout-constants.ts

/**
 * Safe area dimensions - viewport space reserved for UI elements
 * Defines boundaries where graph nodes should NOT be placed
 */
export const SAFE_AREA = {
  HEADER_HEIGHT: 140, // Top header space (px)
  METRICS_HEIGHT: 220, // Bottom metrics panel (px)
  LEFT_MARGIN: 240, // Left sidebar/margin (px)
  RIGHT_MARGIN: 100, // Right margin (px)
} as const;

/**
 * Achievement node positioning configuration
 * Controls vertical spacing and horizontal stagger of achievement cards
 */
export const ACHIEVEMENT_LAYOUT = {
  VERTICAL_SPACING: 200, // Space between achievement nodes (px)
  INITIAL_OFFSET_Y: 250, // Distance below parent company node (px)
  HORIZONTAL_STAGGER: 150, // Zigzag offset for visual interest (px)
} as const;

/**
 * Reveal animation timing sequence
 * Controls when each stage of the graph appears (milliseconds)
 */
export const REVEAL_TIMING = {
  EDUCATION_DELAY_MS: 1200, // When Bilkent appears
  LAYERMARK_DELAY_MS: 1700, // When Layermark appears
  INTENSEYE_DELAY_MS: 2200, // When Intenseye appears
} as const;
```

### Pattern 2: Import and Use Constants

**What:** Import specific constant groups, reference with dot notation
**When to use:** In consuming files (layout-calculator.ts, dashboard-background.tsx)
**Example:**

```typescript
// lib/layout-calculator.ts
import { SAFE_AREA } from "./layout-constants";

export function calculateSafeArea(
  viewport: ViewportSize,
  headerHeight = SAFE_AREA.HEADER_HEIGHT,
  metricsHeight = SAFE_AREA.METRICS_HEIGHT,
  leftMargin = SAFE_AREA.LEFT_MARGIN,
  rightMargin = SAFE_AREA.RIGHT_MARGIN,
): SafeArea {
  // function body uses parameters
}
```

```typescript
// components/dashboard-background.tsx
import { REVEAL_TIMING } from "@/lib/layout-constants";

setTimeout(() => {
  addNodeAndEdges("Bilkent");
  fitViewSmooth();
}, REVEAL_TIMING.EDUCATION_DELAY_MS);
```

### Pattern 3: Naming Convention for Constants

**What:** Use UPPER_SNAKE_CASE for constant names, include units in name where relevant
**When to use:** All compile-time immutable values
**Example:**

```typescript
// GOOD: Clear, includes unit, uppercase
export const REVEAL_TIMING = {
  EDUCATION_DELAY_MS: 1200, // "_MS" suffix indicates milliseconds
  LAYERMARK_DELAY_MS: 1700,
} as const;

// BAD: Unclear units, camelCase
export const revealTiming = {
  educationDelay: 1200, // Is this seconds or milliseconds?
  layermarkDelay: 1700,
};
```

### Anti-Patterns to Avoid

- **Global barrel export object:** Don't create a single `CONSTANTS` object with all values. Use domain-specific objects instead for better organization and tree-shaking.
- **Constants in component files:** Don't define constants where they're used if they're shared or might be reused. Extract to centralized file.
- **Unclear units:** Don't use `TIMEOUT: 1200` - include unit in name `TIMEOUT_MS: 1200` or add JSDoc comment.
- **Default exports:** Don't use `export default { SAFE_AREA, ... }`. Use named exports for explicit imports and better IDE autocomplete.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                    | Don't Build         | Use Instead                                     | Why                                                             |
| -------------------------- | ------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| Detecting magic numbers    | Manual code review  | ESLint @typescript-eslint/no-magic-numbers rule | Automated, catches new violations in CI/CD                      |
| Type-safe constants        | Plain objects       | TypeScript `as const` assertion                 | Prevents accidental mutation, provides literal types            |
| Constant grouping strategy | Custom architecture | Domain-based organization pattern               | Proven pattern for 2026, balances organization and tree-shaking |

**Key insight:** Constants extraction is a well-solved problem with established tooling (ESLint) and patterns (domain-grouped named exports). Don't invent custom validation or organization schemes.

## Common Pitfalls

### Pitfall 1: Over-Extraction (Extracting Every Number)

**What goes wrong:** Extracting numbers that are self-documenting or truly one-off values (e.g., `const ARRAY_INDEX_ZERO = 0`)
**Why it happens:** Overzealous application of "no magic numbers" rule
**How to avoid:** Only extract numbers that are: (1) used multiple times, (2) might change, or (3) whose meaning isn't obvious from context
**Warning signs:** Constants with names like `ONE`, `TWO`, or single-use values that are clearer inline

### Pitfall 2: Inconsistent Naming Between Constant and Usage Site

**What goes wrong:** Constant named `HEADER_HEIGHT` but parameter still called `headerHeight` with different default
**Why it happens:** Not updating function signatures when extracting constants
**How to avoid:** Update default parameter values to reference the constant, maintain naming alignment
**Warning signs:** Functions with hardcoded defaults that duplicate constant values

### Pitfall 3: Missing `as const` Assertion

**What goes wrong:** TypeScript widens types to `number` instead of literal `140`, losing type precision
**Why it happens:** Forgetting to add `as const` to constant object declarations
**How to avoid:** Always add `as const` after constant object literals to preserve literal types
**Warning signs:** IDE showing `number` instead of `140` in type hints

### Pitfall 4: Breaking Existing Default Parameter Behavior

**What goes wrong:** Changing function signatures in a way that breaks calling code
**Why it happens:** Misunderstanding how default parameters work when extracting constants
**How to avoid:** Keep function signatures compatible - default parameters can reference constants without changing the function's public API
**Warning signs:** TypeScript errors in calling code after extraction

### Pitfall 5: Confusing Configuration vs True Constants

**What goes wrong:** Treating runtime configuration (user-adjustable) same as compile-time constants
**Why it happens:** Not distinguishing between "will never change" vs "can be configured"
**How to avoid:** For this phase, all values are true constants. If future phases add user configuration, create separate config files
**Warning signs:** Comments like "user should be able to change this" near constant definitions

## Code Examples

Verified patterns from current codebase analysis:

### Extract Safe Area Constants

**Current state (layout-calculator.ts):**

```typescript
// Before: Magic numbers in default parameters
export function calculateSafeArea(
  viewport: ViewportSize,
  headerHeight = 140, // Magic number
  metricsHeight = 220, // Magic number
  leftMargin = 100, // Magic number (requirement says 240)
  rightMargin = 100, // Magic number
): SafeArea {
  // ...
}
```

**After extraction:**

```typescript
// lib/layout-constants.ts
export const SAFE_AREA = {
  HEADER_HEIGHT: 140,
  METRICS_HEIGHT: 220,
  LEFT_MARGIN: 240, // Updated to match CONST-01 requirement
  RIGHT_MARGIN: 100,
} as const;

// lib/layout-calculator.ts
import { SAFE_AREA } from "./layout-constants";

export function calculateSafeArea(
  viewport: ViewportSize,
  headerHeight = SAFE_AREA.HEADER_HEIGHT,
  metricsHeight = SAFE_AREA.METRICS_HEIGHT,
  leftMargin = SAFE_AREA.LEFT_MARGIN,
  rightMargin = SAFE_AREA.RIGHT_MARGIN,
): SafeArea {
  // Function body unchanged - uses parameters
}
```

### Extract Achievement Positioning Constants

**Current state (layout-calculator.ts):**

```typescript
// Before: Inline numeric literals
const achievementSpacing = 200; // Line 212 - Magic number
const achievementOffsetY = 250; // Line 213 - Magic number
const staggerX = 150; // Line 214 - Magic number

const y = companyPos.y + achievementOffsetY + index * achievementSpacing;
```

**After extraction:**

```typescript
// lib/layout-constants.ts
export const ACHIEVEMENT_LAYOUT = {
  VERTICAL_SPACING: 200,
  INITIAL_OFFSET_Y: 250,
  HORIZONTAL_STAGGER: 150,
} as const;

// lib/layout-calculator.ts
import { ACHIEVEMENT_LAYOUT } from "./layout-constants";

const achievementSpacing = ACHIEVEMENT_LAYOUT.VERTICAL_SPACING;
const achievementOffsetY = ACHIEVEMENT_LAYOUT.INITIAL_OFFSET_Y;
const staggerX = ACHIEVEMENT_LAYOUT.HORIZONTAL_STAGGER;

const y = companyPos.y + achievementOffsetY + index * achievementSpacing;
```

### Extract Reveal Timing Constants

**Current state (dashboard-background.tsx):**

```typescript
// Before: Magic numbers in setTimeout calls
setTimeout(() => {
  addNodeAndEdges("Bilkent");
  fitViewSmooth();
}, 1200); // Magic number - Line 194

setTimeout(() => {
  addNodeAndEdges("Layermark");
  fitViewSmooth();
}, 1700); // Magic number - Line 199

setTimeout(() => {
  addNodeAndEdges("Intenseye");
  fitViewSmooth();
}, 2200); // Magic number - Line 205
```

**After extraction:**

```typescript
// lib/layout-constants.ts
export const REVEAL_TIMING = {
  EDUCATION_DELAY_MS: 1200,
  LAYERMARK_DELAY_MS: 1700,
  INTENSEYE_DELAY_MS: 2200,
} as const;

// components/dashboard-background.tsx
import { REVEAL_TIMING } from "@/lib/layout-constants";

setTimeout(() => {
  addNodeAndEdges("Bilkent");
  fitViewSmooth();
}, REVEAL_TIMING.EDUCATION_DELAY_MS);

setTimeout(() => {
  addNodeAndEdges("Layermark");
  fitViewSmooth();
}, REVEAL_TIMING.LAYERMARK_DELAY_MS);

setTimeout(() => {
  addNodeAndEdges("Intenseye");
  fitViewSmooth();
}, REVEAL_TIMING.INTENSEYE_DELAY_MS);
```

## State of the Art

| Old Approach            | Current Approach             | When Changed          | Impact                                    |
| ----------------------- | ---------------------------- | --------------------- | ----------------------------------------- |
| camelCase constants     | UPPER_SNAKE_CASE constants   | TypeScript 2.x era    | Clearer immutability signals              |
| Single CONSTANTS object | Domain-grouped named exports | ~2024-2025            | Better tree-shaking, clearer organization |
| Manual code review      | ESLint no-magic-numbers rule | ESLint 6.0+ (2019)    | Automated enforcement                     |
| const objects           | as const assertions          | TypeScript 3.4 (2019) | Literal type preservation                 |

**Deprecated/outdated:**

- **enum for constants:** While still valid, plain objects with `as const` are preferred in 2026 for simpler JavaScript output and better interop
- **Separate constants per file:** For small projects (<10 constant groups), single domain-organized file is cleaner
- **SCREAMING_SNAKE_CASE for everything:** Reserved for compile-time constants; runtime configuration uses camelCase

## Open Questions

Things that couldn't be fully resolved:

1. **Should leftMargin value be 100 or 240?**
   - What we know: Code currently has `leftMargin = 100`, but CONST-01 requirement states 240
   - What's unclear: Whether 100 is a bug or requirement is incorrect
   - Recommendation: Use 240 per requirement CONST-01; if visual regression occurs, requirement should be updated

2. **Are there other magic numbers in these files?**
   - What we know: Requirements specify extraction of specific values (140, 220, 240, 200, 250, 150, 1200, 1700, 2200)
   - What's unclear: Whether other numbers (100, 220, -125, 0.22, 400, etc.) should also be extracted
   - Recommendation: Extract only values specified in requirements; avoid over-extraction pitfall

3. **Should responsive spacing percentages be extracted?**
   - What we know: layout-calculator.ts has values like `0.22` (22%) and `0.3` (30%) in `getResponsiveSpacing`
   - What's unclear: Whether these are "magic numbers" that should be extracted
   - Recommendation: Leave percentages inline for now - they're self-documenting in context and not mentioned in requirements

## Sources

### Primary (HIGH confidence)

- TypeScript official documentation - Language features and const assertions
- Codebase analysis - /Users/sunny/Desktop/Sunny/portfolio/lib/layout-calculator.ts, components/dashboard-background.tsx, components/nodes/achievement-node.tsx
- [@typescript-eslint/no-magic-numbers documentation](https://typescript-eslint.io/rules/no-magic-numbers/) - Official ESLint TypeScript plugin docs

### Secondary (MEDIUM confidence)

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) - Industry standard style recommendations
- [Tips to Use Constants File in TypeScript](https://dev.to/amirfakour/tips-to-use-constants-file-in-typescript-27je) - Domain grouping patterns
- [Replace Magic Number with Symbolic Constant](https://refactoring.guru/replace-magic-number-with-symbolic-constant) - Classic refactoring pattern
- [TypeScript/Angular const variable name uppercase or lowercase](https://edengoforit.medium.com/typescript-angular-const-variable-name-uppercase-or-lowercase-ae5c670ed130) - Naming convention analysis

### Tertiary (LOW confidence, verified by cross-reference)

- [The Constants file is an anti-pattern](https://www.hacklewayne.com/the-constants-file-is-an-anti-pattern-so-is-the-interface-folder-placement-by-functionality-not-technical-concerns) - Arguments against over-centralization (balanced against current project size)
- [Optimizing Constants in JavaScript & TypeScript](https://dev.to/kenzo_tenma/optimizing-constants-in-javascript-typescript-separate-vs-grouped-exports-2119) - Tree-shaking considerations

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - TypeScript and ESLint are de facto standards, no special libraries needed
- Architecture: HIGH - Domain-grouped named exports with UPPER_SNAKE_CASE is well-documented 2026 pattern
- Pitfalls: HIGH - Common refactoring mistakes well-documented in literature and codebase analysis

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable domain, established patterns)
