---
phase: 10-client-boundary-extraction
plan: 01
subsystem: ui
tags: [react, server-components, next.js, css-animations, performance]

# Dependency graph
requires:
  - phase: 09-server-side-github-fetching
    provides: Server wrapper pattern and client boundary split approach
provides:
  - Three server-compatible components (twinkling-stars, css-preloader, graph-legend)
  - CSS animation infrastructure (twinkle, legend-slide-in keyframes)
  - Module-level computation pattern for deterministic static rendering
affects: [11-section-component-boundaries, page.tsx-server-migration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Module-level computation with seeded PRNG for deterministic SSR
    - CSS animations replacing React hooks for static components
    - Server component extraction from client boundaries

key-files:
  created: []
  modified:
    - components/twinkling-stars.tsx
    - components/css-preloader.tsx
    - components/graph-legend.tsx
    - app/globals.css

key-decisions:
  - "Use module-level computation for deterministic star generation (no useMemo needed)"
  - "Move @keyframes animations from inline styles to globals.css (avoid hydration warnings)"
  - "Replace framer-motion with CSS animations for static entrance effects"

patterns-established:
  - "Seeded PRNG + module-level computation pattern: deterministic SSR without React hooks"
  - "CSS animation keyframes in globals.css: centralized, no hydration issues"

# Metrics
duration: 2min
completed: 2026-02-06
---

# Phase 10 Plan 01: Static Component Server Migration Summary

**Three pure-static components converted to server components: twinkling-stars (seeded PRNG + CSS), css-preloader (trivial conversion), graph-legend (CSS entrance animation)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-06T22:59:37Z
- **Completed:** 2026-02-06T23:01:43Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- TwinklingStars converted to server component using module-level star generation with seeded PRNG
- CSSPreloader converted by simply removing "use client" directive
- GraphLegend converted by replacing framer-motion with CSS animation
- All CSS animations centralized in globals.css

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert TwinklingStars to server component** - `c1e8e3f` (refactor)
2. **Task 2: Convert CSSPreloader and GraphLegend to server components** - `135b1e6` (refactor)

## Files Created/Modified

- `components/twinkling-stars.tsx` - Removed "use client", useMemo; moved star generation to module-level using seeded PRNG (mulberry32); removed inline <style> tag
- `components/css-preloader.tsx` - Removed "use client" directive (only change needed)
- `components/graph-legend.tsx` - Removed "use client" and framer-motion; replaced motion.div with CSS animation
- `app/globals.css` - Added @keyframes twinkle and @keyframes legend-slide-in

## Decisions Made

**1. Module-level computation for deterministic rendering**

- TwinklingStars uses seeded PRNG (mulberry32 with seed 42) which produces identical output every call
- Moving computation from useMemo to module-level achieves same determinism without React hooks
- Server renders once at import time, sends static HTML to client

**2. CSS animations in globals.css instead of inline styles**

- Inline `<style>` tags cause hydration warnings in server components
- globals.css already contains preloader keyframes
- Centralized animation definitions prevent duplication

**3. CSS animation for GraphLegend entrance**

- Original framer-motion used whileInView (triggers on viewport entry)
- GraphLegend only renders inside GraphSection which loads via dynamic import (ssr: false)
- CSS animation triggers on render, which happens when user scrolls to graph
- Visual effect equivalent, no client-side JS needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all conversions straightforward. Build passed on first try.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Phase 11 (section component boundaries). Three components now server-compatible:

- twinkling-stars: deterministic module-level rendering
- css-preloader: pure static component
- graph-legend: CSS entrance animation

**Blockers:** None

**Concerns:** Hydration mismatch risk remains medium (from STATE.md), but seeded PRNG + module-level computation should eliminate it for twinkling-stars.

---

_Phase: 10-client-boundary-extraction_
_Completed: 2026-02-06_
