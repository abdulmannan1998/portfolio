---
phase: 09-animation-foundation
plan: 01
subsystem: ui
tags:
  [
    css-animations,
    scroll-driven-animations,
    intersection-observer,
    accessibility,
  ]

# Dependency graph
requires:
  - phase: 08-technical-debt
    provides: Clean codebase foundation ready for new animation infrastructure
provides:
  - CSS keyframe animations (fade-in-up, fade-in-down, fade-in-left, scale-in) with scroll-driven triggers
  - Intersection Observer polyfill hook for cross-browser compatibility
  - Reduced-motion accessibility support
  - Stagger animation infrastructure via CSS custom properties
affects: [10-hero-extraction, 11-section-migration, 12-animation-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS scroll-driven animations with animation-timeline: view()"
    - "Intersection Observer polyfill pattern for graceful degradation"
    - "CSS custom properties for animation stagger delays"
    - "Reduced-motion media queries for accessibility"

key-files:
  created:
    - hooks/use-scroll-animation.ts
  modified:
    - app/globals.css

key-decisions:
  - "Use animation-timeline: view() for native scroll-driven behavior in Chrome/Safari"
  - "Custom Intersection Observer polyfill over npm package for minimal bundle size"
  - "Longhand animation properties instead of shorthand to prevent animation-timeline reset"
  - "Opacity-only fades for reduced-motion users (0.4s) vs full transform animations (0.6s)"
  - "Paused animations by default, triggered by animation-timeline or .animate class"

patterns-established:
  - "Animation utility classes in globals.css with scroll-driven triggers"
  - "Feature detection pattern: CSS.supports('animation-timeline: view()') before polyfill"
  - "Stagger pattern: --stagger-index CSS variable with calc() for sequential delays"

# Metrics
duration: 2min
completed: 2026-02-07
---

# Phase 9 Plan 1: Animation Foundation Summary

**CSS scroll-driven entrance animations (fade-in-up, fade-in-down, fade-in-left, scale-in) with animation-timeline: view() and Intersection Observer polyfill for Firefox/Safari**

## Performance

- **Duration:** 2 min 6 sec
- **Started:** 2026-02-06T20:35:45Z
- **Completed:** 2026-02-06T20:37:51Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Four CSS keyframe animations available as utility classes for scroll-triggered entrance effects
- Native scroll-driven animation support via animation-timeline: view() for modern browsers (Chrome 115+, Safari 26+)
- Intersection Observer polyfill hook providing fallback for browsers without animation-timeline support
- Reduced-motion accessibility with opacity-only fades (no transforms)
- Stagger animation support via --stagger-index CSS custom property

## Task Commits

Each task was committed atomically:

1. **Task 1: Define CSS keyframe animations and scroll-driven utility classes** - `e360d8a` (feat)
2. **Task 2: Create Intersection Observer polyfill hook** - `f98898d` (feat)

## Files Created/Modified

- `app/globals.css` - Added four @keyframes definitions (fade-in-up, fade-in-down, fade-in-left, scale-in), utility classes with animation-timeline: view(), polyfill .animate trigger rules, stagger support, and reduced-motion accessibility block
- `hooks/use-scroll-animation.ts` - React hook (useScrollAnimation) and standalone function (initScrollAnimations) providing Intersection Observer polyfill for browsers without animation-timeline support

## Decisions Made

**1. Longhand animation properties vs shorthand**

- Used longhand properties (animation-name, animation-duration, etc.) instead of animation shorthand
- Rationale: Research flagged that animation shorthand resets animation-timeline property (Pitfall #1)
- Impact: Prevents timeline reset issues, ensures scroll-driven animations work correctly

**2. Custom polyfill vs npm package**

- Built custom Intersection Observer wrapper instead of using flackr/scroll-timeline polyfill
- Rationale: Custom implementation is ~139 lines vs 10-15KB npm package, sufficient for trigger-based animations
- Impact: Smaller bundle size, simpler debugging, adequate for current needs

**3. Paused by default pattern**

- Animations start with animation-play-state: paused
- Triggered by either animation-timeline (native) or .animate class (polyfill)
- Rationale: Enables unified CSS that works with both native and polyfill approaches
- Impact: Clean separation of animation definition from trigger mechanism

**4. Reduced-motion strategy**

- Replace transform-based animations with opacity-only fades for prefers-reduced-motion users
- Faster duration (0.4s vs 0.6s) for snappier reduced-motion experience
- Rationale: Provides visual feedback without triggering vestibular issues (WCAG 2.3.3 compliance)
- Impact: Accessible to users with motion sensitivity

**5. Negative rootMargin for early trigger**

- Default rootMargin: '0px 0px -10% 0px' (negative bottom margin)
- Rationale: Research Pitfall #5 - positive margins trigger later, negative triggers earlier
- Impact: Animations start slightly before element fully enters viewport, smoother experience

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all CSS and TypeScript compiled without errors. Pre-existing TypeScript errors in app/page.tsx (framer-motion variables) are unrelated to this phase and will be cleaned up in Phase 12.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 10 (Hero Extraction):**

- CSS animation infrastructure complete and tested
- useScrollAnimation hook available for component-level usage
- initScrollAnimations function available for layout-level initialization
- Reduced-motion accessibility in place

**Verified:**

- Next.js build completes successfully
- Four @keyframes definitions confirmed in globals.css
- Four animation-timeline: view() declarations confirmed
- prefers-reduced-motion block confirmed
- .animate polyfill trigger rules confirmed
- Both hook exports (useScrollAnimation, initScrollAnimations) confirmed

**No blockers** - Phase 10 can begin hero parallax extraction using this animation foundation.

---

_Phase: 09-animation-foundation_
_Completed: 2026-02-07_
