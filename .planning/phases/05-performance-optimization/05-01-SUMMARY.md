---
phase: 05-performance-optimization
plan: 01
subsystem: ui
tags: [react, framer-motion, performance, memoization, animation]

# Dependency graph
requires:
  - phase: 04-state-management-refactor
    provides: useGraphStore with imperatively accessed state
provides:
  - Module-level animation variants eliminating per-render object recreation
  - Memoized position calculations preventing redundant recalculation
  - Primitive dependencies for stable memoization
affects: [future animation work, performance optimization patterns]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Module-level animation variants with Variants type"
    - "useMemo with primitive dependencies for stable memoization"
    - "Destructuring state objects for primitive dependency tracking"

key-files:
  created: []
  modified:
    - components/custom-node.tsx
    - components/nodes/achievement-node.tsx
    - components/dashboard-background.tsx

key-decisions:
  - "Used Variants type from framer-motion for animation constants"
  - "Destructured graphDimensions to enable primitive dependencies [width, height]"
  - "Used as const assertion for ENTRANCE_VARIANTS to satisfy TypeScript types"

patterns-established:
  - "Animation variants: Define at module level with Variants type, reference in components"
  - "Position calculations: Use useMemo with primitive dependencies, not object references"
  - "React Compiler compatibility: Destructure objects before useMemo to enable primitive deps"

# Metrics
duration: 5min
completed: 2026-02-05
---

# Phase 05 Plan 01: Animation Optimization Summary

**Module-level animation variants and memoized position calculations eliminate per-render object recreation for framer-motion animations**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-05T16:28:05Z
- **Completed:** 2026-02-05T16:33:08Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extracted all animation variants to module-level constants in custom-node.tsx and achievement-node.tsx
- Replaced per-render getEntranceAnimation function with getAnimationConfig returning constant references
- Added useMemo to getInitialNodes and getInitialEdges with primitive dependencies
- Eliminated redundant position calculations when viewport dimensions unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract animation variants to module-level constants in custom-node.tsx** - `7a6b46a` (perf)
2. **Task 2: Extract animation variants to module-level in achievement-node.tsx** - `458ac0a` (perf)
3. **Task 3: Add useMemo for getInitialNodes position calculations** - `8cc5589` (perf)

## Files Created/Modified

- `components/custom-node.tsx` - Module-level animation variants (HERO_ENTRANCE_VARIANTS, BLOOM_IN_VARIANTS, SLIDE_UP_VARIANTS, FADE_DROP_VARIANTS, POP_IN_VARIANTS, DEFAULT_VARIANTS) and transitions; getAnimationConfig returns references
- `components/nodes/achievement-node.tsx` - Module-level ENTRANCE_VARIANTS and EXPAND_COLLAPSE_VARIANTS constants
- `components/dashboard-background.tsx` - useMemo wraps getInitialNodes with [graphWidth, graphHeight] and getInitialEdges with []

## Decisions Made

**1. Used Variants type from framer-motion for animation constants**

- Rationale: Provides proper TypeScript typing for animation variant objects
- Implementation: `const HERO_ENTRANCE_VARIANTS: Variants = { initial: ..., animate: ... }`

**2. Destructured graphDimensions for primitive dependencies**

- Rationale: React Compiler requires matching object access patterns with dependency arrays
- Implementation: `const { width: graphWidth, height: graphHeight } = graphDimensions;` then `[graphWidth, graphHeight]`
- Benefit: Avoids false recalculations while satisfying compiler constraints

**3. Used as const assertion for ENTRANCE_VARIANTS in achievement-node**

- Rationale: TypeScript type error when using Variants type with both initial/animate props and variants prop
- Implementation: `const ENTRANCE_VARIANTS = { initial: { ... } as const, animate: { ... } as const }`
- Fixes: TS2322 error about Variant not assignable to TargetAndTransition

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed React Compiler memoization preservation error**

- **Found during:** Task 3 (useMemo implementation)
- **Issue:** React Compiler eslint rule blocked commit - "Inferred dependency was graphDimensions, but source dependencies were [graphDimensions.width, graphDimensions.height]"
- **Fix:** Destructured graphDimensions before useMemo to align object access with primitive dependencies
- **Files modified:** components/dashboard-background.tsx
- **Verification:** Commit successful with no lint errors
- **Committed in:** 8cc5589 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix necessary to satisfy React Compiler constraints while maintaining primitive dependencies as specified. No scope creep.

## Issues Encountered

**TypeScript type error in achievement-node.tsx**

- Initial approach used `initial={ENTRANCE_VARIANTS.initial}` with `Variants` type
- TypeScript error: Variant not assignable to TargetAndTransition
- Resolution: Changed to `as const` assertion instead of Variants type for ENTRANCE_VARIANTS
- Root cause: Framer-motion expects different types when both initial/animate and variants props used

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Performance optimization foundation established:

- Animation variants pattern can be replicated across other components
- Memoization pattern with primitive dependencies proven effective
- Ready for additional performance optimizations (code splitting, lazy loading, etc.)

No blockers for future phases.

---

_Phase: 05-performance-optimization_
_Completed: 2026-02-05_
