---
phase: 10-client-boundary-extraction
plan: 02
subsystem: ui
tags: [css-animation, intersection-observer, framer-motion, react, next.js, ssr]

# Dependency graph
requires:
  - phase: 10-01
    provides: Server component conversion pattern and client boundary extraction approach
provides:
  - Pure CSS marquee animation enabling server-side rendering
  - Visibility-triggered counter animation using Intersection Observer API
  - Pattern for converting simple framer-motion animations to CSS
affects: [future animation migrations, performance optimization phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS @keyframes with animation-direction reverse for bidirectional scrolling
    - IntersectionObserver for viewport-triggered animations (one-shot pattern)
    - Client boundary isolation for components requiring browser APIs

key-files:
  created: []
  modified:
    - components/marquee-text.tsx
    - components/animated-counter.tsx
    - app/globals.css

key-decisions:
  - "Remove framer-motion from MarqueeText in favor of pure CSS animation (enables server rendering)"
  - "Use IntersectionObserver threshold 0.1 for counter visibility detection"
  - "Keep AnimatedCounter as client component (genuinely needs useState, useEffect, useRef, IntersectionObserver)"

patterns-established:
  - "Simple infinite translate animations can use CSS @keyframes instead of framer-motion"
  - "IntersectionObserver disconnects after first trigger for one-shot viewport animations"
  - "Animation direction reversal via CSS 'reverse' keyword instead of inverting keyframe values"

# Metrics
duration: 3min
completed: 2026-02-06
---

# Phase 10 Plan 02: Dynamic Component Animation Enhancement Summary

**MarqueeText converted to pure CSS animation (now server component), AnimatedCounter enhanced with Intersection Observer for visibility-triggered counting**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-06T23:00:28Z
- **Completed:** 2026-02-06T23:03:17Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- MarqueeText converted from framer-motion to CSS @keyframes marquee-scroll (now renders as server component)
- AnimatedCounter enhanced with IntersectionObserver to trigger counting only when visible in viewport
- Maintained exact visual behavior and animation timing (20s marquee scroll, 2s counter duration)

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert MarqueeText from framer-motion to CSS animation** - `135b1e6` (refactor) - completed in prior plan execution
2. **Task 2: Add Intersection Observer to AnimatedCounter for visibility-triggered animation** - `2c8cfba` (feat)

## Files Created/Modified

- `components/marquee-text.tsx` - Removed "use client" and framer-motion, replaced motion.div with CSS animation
- `components/animated-counter.tsx` - Added IntersectionObserver for viewport detection, isVisible state to gate animation
- `app/globals.css` - Added @keyframes marquee-scroll (translateX 0 to -50%)

## Decisions Made

**MarqueeText CSS animation approach:**

- Used CSS @keyframes with `animation-direction: reverse` for right-scrolling marquee instead of inverting keyframe values
- Maintained 20s duration for seamless scroll matching framer-motion version

**AnimatedCounter visibility detection:**

- IntersectionObserver threshold set to 0.1 (triggers when 10% of element visible)
- One-shot pattern: observer disconnects after first trigger (counter starts once, stays visible)
- Avoided synchronous setState in effect (ESLint react-hooks/set-state-in-effect compliance)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed synchronous setState in useEffect**

- **Found during:** Task 2 commit (pre-commit hook ESLint check)
- **Issue:** `setCount(0)` called synchronously in effect body triggers ESLint error (react-hooks/set-state-in-effect) and can cause cascading renders
- **Fix:** Removed `setCount(0)` call - counter naturally starts from 0 (useState initial value) on first interval tick
- **Files modified:** components/animated-counter.tsx
- **Verification:** ESLint passes, build succeeds, counter starts at 0 when visible
- **Committed in:** 2c8cfba (Task 2 commit - fixed before final commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Essential fix for React best practices and ESLint compliance. No functional change - counter still starts from 0 as intended.

## Issues Encountered

**Pre-commit hook stash error:**

- During first Task 2 commit attempt, lint-staged encountered git stash cleanup error
- Resolved by re-staging files and committing again after formatter/linter ran
- No code changes needed, just git state management

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next plan:**

- MarqueeText now server-compatible (no client directive, no framer-motion)
- AnimatedCounter animates on visibility (better UX - metrics don't count before user scrolls to them)
- CSS animation pattern established for simple infinite translate animations
- IntersectionObserver pattern established for viewport-triggered animations

**Pattern established for future work:**

- Simple framer-motion animations (infinite translate, fade, etc.) can migrate to CSS
- Components needing browser APIs (IntersectionObserver, ResizeObserver, etc.) correctly isolated as client components
- Build passes with no errors, all verifications green

---

_Phase: 10-client-boundary-extraction_
_Completed: 2026-02-06_
