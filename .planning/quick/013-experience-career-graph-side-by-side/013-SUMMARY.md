---
phase: quick
plan: "013"
subsystem: ui
tags: [layout, responsive-design, grid, tailwind]

# Dependency graph
requires:
  - phase: quick-011
    provides: Full-width brutalist grid layout pattern
  - phase: quick-012
    provides: Side-by-side layout pattern reference
provides:
  - Side-by-side layout for Experience timeline and Career Graph on desktop
  - Panel-based component architecture (components without section wrappers)
  - Responsive grid layout with mobile stacking
affects: [future layout decisions, component architecture patterns]

# Tech tracking
tech-stack:
  added: []
  patterns: [panel components without section wrappers, shared container layout]

key-files:
  created: []
  modified:
    - app/page.tsx
    - components/sections/experience-timeline.tsx
    - components/sections/graph-section.tsx

key-decisions:
  - "Panel component pattern: components render as divs without section wrappers, parent handles layout"
  - "Grid layout: lg:grid-cols-[minmax(300px,400px)_1fr] gives Experience constrained width, Graph remaining space"
  - "Removed duplicate Career Graph header from page.tsx, kept header in GraphSection component"

patterns-established:
  - "Panel components: sections can be converted to divs for embedding in grid layouts"
  - "Shared container pattern: single section wrapper with grid for multiple panels"

# Metrics
duration: 2min
completed: 2026-02-06
---

# Quick Task 013: Experience & Career Graph Side-by-Side Summary

**Desktop layout with Experience (left, 300-400px) and Career Graph (right, remaining space) side-by-side using panel components and responsive grid**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-06T18:02:45Z
- **Completed:** 2026-02-06T18:04:47Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Converted ExperienceTimeline and GraphSection from full sections to panel components
- Created side-by-side layout on desktop (lg+ breakpoint) with Experience left, Graph right
- Maintained vertical stacking on mobile/tablet
- Removed duplicate Career Graph header, kept single header in GraphSection component
- Better horizontal space utilization on wide screens

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert ExperienceTimeline from section to panel** - `8d6ab27` (refactor)
   - Removed section wrapper, bg-stone-950, and py-24
   - Removed max-w-4xl mx-auto px wrapper
   - Component now renders as plain div for grid embedding

2. **Task 2: Convert GraphSection from section to panel and adjust height** - `7f997ce` (refactor)
   - Removed section wrapper, py-16, px padding
   - Removed gradient overlay
   - Removed max-w-7xl mx-auto wrapper
   - Kept id="graph" for anchor links and section header

3. **Task 3: Create shared side-by-side container in page.tsx** - `c91fad6` (feat)
   - Replaced separate sections with shared container
   - Grid layout: lg:grid-cols-[minmax(300px,400px)_1fr]
   - gap-12 lg:gap-16 for spacing between panels
   - Removed duplicate Career Graph header from page.tsx

## Files Created/Modified

- `app/page.tsx` - Added shared section wrapper with responsive grid layout
- `components/sections/experience-timeline.tsx` - Converted to panel component (div instead of section)
- `components/sections/graph-section.tsx` - Converted to panel component (div instead of section)

## Decisions Made

**Panel component pattern**

- Components render as divs without section wrappers when embedded in grid layouts
- Parent section in page.tsx handles background, padding, and layout
- Enables flexible composition and reuse

**Grid layout sizing**

- `lg:grid-cols-[minmax(300px,400px)_1fr]` gives Experience a constrained width (300-400px) since it's text content
- Career Graph gets remaining space (1fr) to maximize interactive canvas width
- This layout optimizes for content type: narrow text vs wide graph

**Removed duplicate header**

- Career Graph header existed in both page.tsx and GraphSection component
- Kept header in GraphSection component (the real header with proper styling)
- Removed wrapper header from page.tsx

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Layout pattern established for future side-by-side sections. Panel component pattern can be applied to other sections as needed.

---

_Phase: quick_
_Completed: 2026-02-06_
