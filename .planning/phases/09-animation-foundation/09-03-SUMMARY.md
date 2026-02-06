---
phase: 09-animation-foundation
plan: 03
subsystem: ui
tags: [animation, scroll, parallax, requestAnimationFrame, gap-closure]

# Dependency graph
requires:
  - phase: 09-animation-foundation
    provides: HeroParallax client wrapper with requestAnimationFrame parallax
provides:
  - Corrected hero parallax fade speed matching original framer-motion behavior
affects: [10-animation-migration, 13-rsc-migration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Total scroll distance calculation: (scrollHeight - innerHeight) * percentage"

key-files:
  created: []
  modified:
    - components/hero-parallax.tsx

key-decisions:
  - "Use (document.documentElement.scrollHeight - window.innerHeight) * 0.15 to match framer-motion scrollYProgress [0, 0.15] range"

patterns-established:
  - "Scroll progress calculation: total scrollable distance = scrollHeight - viewportHeight"

# Metrics
duration: 1min
completed: 2026-02-07
---

# Phase 09 Plan 03: Hero Parallax Fade Speed Fix Summary

**Corrected hero parallax maxScroll from viewport-relative to total scroll distance, matching original framer-motion fade timing**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-07
- **Completed:** 2026-02-07
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Fixed maxScroll calculation from `window.innerHeight * 0.15` (~135px) to `(document.documentElement.scrollHeight - window.innerHeight) * 0.15` (~615px)
- Hero now fades gradually over first 15% of total scroll distance, matching original framer-motion scrollYProgress behavior
- User-verified: fade timing approved as matching original behavior

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix maxScroll calculation to use total scroll distance** - `1f4a958` (fix)

## Files Created/Modified

- `components/hero-parallax.tsx` - Corrected maxScroll calculation on line 20-21 to use document scroll height instead of viewport height

## Decisions Made

**1. Use scrollable distance formula**

- `(document.documentElement.scrollHeight - window.innerHeight) * 0.15` matches framer-motion's scrollYProgress which represents scroll progress as a 0-1 ratio of total scrollable distance
- This produces ~615px fade distance vs the broken 135px, a 4.5x correction

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 10 (Section Animation Migration):**

- All CSS keyframe animations available (09-01)
- Hero parallax isolated and working correctly (09-02 + 09-03)
- Phase 10 can migrate section entrance animations to CSS without touching parallax logic

**No blockers:** Build passes, hero parallax fade verified by user as matching original behavior.

---

_Phase: 09-animation-foundation_
_Completed: 2026-02-07_
