---
phase: 09-animation-foundation
plan: 02
subsystem: ui
tags:
  [animation, scroll, parallax, requestAnimationFrame, performance, RSC-prep]

# Dependency graph
requires:
  - phase: 07-code-splitting
    provides: Section components extracted from page.tsx
provides:
  - HeroParallax client wrapper component with requestAnimationFrame-based parallax
  - Hero section isolated from page.tsx client boundary
  - Server-renderable hero content pattern (children prop)
affects: [10-animation-migration, 13-rsc-migration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client wrapper accepting server-rendered children (RSC boundary pattern)"
    - "requestAnimationFrame + passive scroll listener for scroll effects"
    - "Direct DOM manipulation for GPU-accelerated transforms"

key-files:
  created:
    - components/hero-parallax.tsx
  modified:
    - app/page.tsx

key-decisions:
  - "Replace framer-motion useScroll/useTransform with requestAnimationFrame for hero parallax"
  - "Extract parallax logic to client wrapper, keep hero content in page.tsx"
  - "Use window.scrollY with 0.15vh threshold to match framer-motion behavior"

patterns-established:
  - "Client wrapper pattern: Parallax logic in client component, content as server-renderable children"
  - "Scroll optimization: requestAnimationFrame throttle + passive event listener"

# Metrics
duration: 2min
completed: 2026-02-07
---

# Phase 09 Plan 02: Hero Parallax Extraction Summary

**Hero parallax scroll logic extracted to HeroParallax client wrapper using requestAnimationFrame + passive scroll listeners, replacing framer-motion with direct DOM manipulation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-06T20:36:37Z
- **Completed:** 2026-02-06T20:38:46Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created HeroParallax client wrapper component with requestAnimationFrame-based parallax
- Replaced framer-motion useScroll/useTransform with direct DOM style manipulation
- Removed containerRef and scroll hooks from page.tsx (13 lines removed, 5 added)
- Hero content remains in page.tsx as server-renderable children (ready for Phase 13 RSC migration)
- Parallax effect matches original behavior (scale 1→0.8, opacity 1→0 over first 15% scroll)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HeroParallax client wrapper component** - `62ceaee` (feat)
2. **Task 2: Refactor page.tsx to use HeroParallax wrapper** - `1418cc2` (refactor)

## Files Created/Modified

- `components/hero-parallax.tsx` - Client wrapper with requestAnimationFrame scroll effect, accepts children prop for server-renderable content
- `app/page.tsx` - Removed framer-motion scroll hooks (useScroll, useTransform, containerRef), replaced motion.section with HeroParallax wrapper

## Decisions Made

**1. requestAnimationFrame throttle pattern**

- Uses `ticking` flag to prevent multiple rAF callbacks per frame
- Passive scroll listener for better scroll performance
- Calculates progress from `window.scrollY` vs `window.innerHeight * 0.15` threshold

**2. Direct DOM manipulation for transforms**

- Applies `style.transform` and `style.opacity` directly (GPU-accelerated)
- Matches framer-motion behavior: scale 1.0→0.8, opacity 1.0→0.0
- Initial `updateParallax()` call on mount handles page refreshed mid-scroll

**3. Server-renderable content pattern**

- HeroParallax accepts `children: ReactNode`
- All hero content (TwinklingStars, motion.h1, motion.p, scroll indicator) stays in page.tsx
- Only parallax scroll logic lives in client component
- Enables future RSC migration in Phase 13

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - implementation proceeded smoothly. The `window.innerHeight * 0.15` threshold matches the framer-motion `[0, 0.15]` scroll range accurately.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 10 (Animation Migration):**

- Hero parallax logic isolated in its own component
- page.tsx still uses framer-motion for entrance animations (motion.h1, motion.p with initial/animate)
- About section still uses framer-motion whileInView animations
- Phase 10 can now migrate these to CSS keyframes + scroll triggers without touching parallax logic

**Critical for Phase 13 (RSC Migration):**

- Hero content pattern established: client wrapper accepts server-rendered children
- page.tsx framer-motion imports reduced (useScroll/useTransform removed, only motion.\* for entrance anims)
- One step closer to removing "use client" from page.tsx

**No blockers:** Build passes, TypeScript compiles, parallax effect verified visually identical.

---

_Phase: 09-animation-foundation_
_Completed: 2026-02-07_
