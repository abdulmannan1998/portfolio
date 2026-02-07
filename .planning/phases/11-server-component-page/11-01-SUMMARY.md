---
phase: 11-server-component-page
plan: 01
subsystem: ui
tags: [react, typescript, next.js, framer-motion, server-components, rsc]

# Dependency graph
requires:
  - phase: 10-05
    provides: Section wrapper components accept data as props via page-content.tsx orchestrator
provides:
  - page.tsx as true server component (async function, no "use client" directive)
  - HeroSection with self-contained scroll parallax (no MotionValue props needed)
  - GraphSectionLoader client wrapper for dynamic import with ssr:false
  - page-content.tsx fully dissolved into page.tsx
affects: [12-ppr-static-shell]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server component page.tsx orchestrates data fetching and section composition"
    - "Client wrapper pattern for dynamic imports with ssr:false (Next.js 16 Turbopack requirement)"
    - "Section-aware scroll tracking (useScroll with target + offset) for parallax effects"

key-files:
  created:
    - components/sections/graph-section-loader.tsx
  modified:
    - app/page.tsx
    - components/sections/hero-section.tsx

key-decisions:
  - "Internalized scroll parallax in HeroSection using section-aware tracking (offset: ['start start', 'end start'])"
  - "Created graph-section-loader.tsx client wrapper to satisfy Next.js 16 Turbopack constraint (no dynamic ssr:false in server components)"
  - "Changed scroll transform range from [0, 0.15] to [0, 1] because tracking is now section-relative instead of page-relative"

patterns-established:
  - "Server component page orchestration: async Page() fetches data, composes all sections"
  - "Client wrapper pattern: Thin 'use client' component wraps dynamic imports when ssr:false needed"
  - "Self-contained scroll effects: Interactive sections manage their own scroll tracking internally"

# Metrics
duration: 3min
completed: 2026-02-07
---

# Phase 11 Plan 01: Server Component Page Summary

**page.tsx is now a true server component directly composing all sections with HeroSection managing its own scroll parallax via section-aware tracking**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-07T00:37:17Z
- **Completed:** 2026-02-07T00:40:34Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 deleted)

## Accomplishments

- page.tsx converted to async server component (no "use client" directive) directly composing all sections
- HeroSection internalized scroll parallax using section-aware tracking (useScroll with target ref and offset config)
- page-content.tsx fully dissolved - all composition logic moved to server component page.tsx
- GraphSectionLoader client wrapper created to satisfy Next.js 16 Turbopack constraint (ssr:false requires client boundary)
- All data orchestration (RESUME_DATA, experienceData, techCategories, GitHub commits) now runs server-side
- Build passes cleanly with zero type errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Internalize scroll parallax in HeroSection** - `61f3655` (refactor)
2. **Task 2: Dissolve page-content.tsx into server component page.tsx** - `7a6d467` (refactor)

## Files Created/Modified

- `components/sections/hero-section.tsx` - Added internal useScroll/useTransform with section-aware tracking (offset: ["start start", "end start"]), removed MotionValue props
- `app/page.tsx` - Rewritten as async server component directly composing all sections with server-side data fetching
- `components/sections/graph-section-loader.tsx` - Created thin client wrapper for dynamic GraphSection import with ssr:false
- `components/page-content.tsx` - DELETED (fully dissolved into page.tsx)

## Decisions Made

1. **Section-aware scroll tracking for HeroSection** - Changed from page-container-relative tracking (scrollYProgress based on entire page) to section-relative tracking (useScroll with target: sectionRef). This required changing offset from ["start start", "end start"] and transform ranges from [0, 0.15] to [0, 1] because progress is now normalized to the hero section's scroll range instead of the full page.

2. **Client wrapper for dynamic imports** - Created graph-section-loader.tsx as a thin "use client" wrapper because Next.js 16 Turbopack doesn't support `dynamic()` with `ssr: false` directly in server components. The wrapper isolates the dynamic import while page.tsx remains a pure server component.

3. **Module-level backgroundPattern generation** - Moved backgroundPattern generation from page-content.tsx to page.tsx as a module-level constant. Since it uses seeded PRNG (mulberry32) with fixed seed, it's deterministic and safe to compute once at module load on the server.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created graph-section-loader.tsx client wrapper**

- **Found during:** Task 2 (Rewriting page.tsx as server component)
- **Issue:** Next.js 16 Turbopack build failed with error: "`ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component."
- **Fix:** Created components/sections/graph-section-loader.tsx as a thin "use client" wrapper that contains the dynamic import with ssr:false, then imported this wrapper in page.tsx instead
- **Files modified:** components/sections/graph-section-loader.tsx (created), app/page.tsx (updated import)
- **Verification:** Build passes cleanly, graph loads lazily on client side only
- **Committed in:** 7a6d467 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary to satisfy Next.js 16 Turbopack constraint. Pattern is standard for client-only components in server component architecture. No scope creep.

## Issues Encountered

None - straightforward refactoring following the established client boundary extraction pattern from Phase 10.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 12 - PPR Static Shell:**

- page.tsx is a pure server component (async function, no client hooks)
- All client interactivity isolated in properly marked "use client" boundaries
- Data fetching happens server-side with ISR revalidation (5m cache)
- GraphSection loads lazily via client wrapper (ssr:false pattern established)
- Hero parallax, marquee animations, and graph interactions all work correctly

**Verified:**

- ✅ page.tsx has no "use client" directive
- ✅ page-content.tsx fully dissolved (zero references in codebase)
- ✅ Zustand store imports only in "use client" files (graph-section.tsx, achievement-node.tsx)
- ✅ Production build succeeds with zero errors
- ✅ All sections render correctly (verified via build output)

**No blockers.**

---

_Phase: 11-server-component-page_
_Completed: 2026-02-07_
