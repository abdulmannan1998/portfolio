---
phase: 10-client-boundary-extraction
plan: 03
subsystem: ui
tags: [framer-motion, css, next.js, ssr, client-components]

# Dependency graph
requires:
  - phase: 10-02
    provides: CSS animation conversions that created orphaned keyframes
provides:
  - Dead code removed (loading.tsx, css-preloader, graph-legend)
  - Orphaned @keyframes cleaned from globals.css
  - MarqueeText reverted to framer-motion per project strategy
  - Next.js 16 SSR prerendering compatibility for github-activity
affects: [11-server-component-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Use framer-motion for animations (project-wide decision)"
    - "Handle Next.js 16 Date.now() restrictions with nullable timestamps"

key-files:
  created: []
  modified:
    - app/globals.css
    - components/marquee-text.tsx
    - components/github-activity.tsx
  deleted:
    - app/loading.tsx
    - components/css-preloader.tsx
    - components/graph-legend.tsx

key-decisions:
  - "Revert to framer-motion for marquee animation (honors v1.2 strategy pivot)"
  - "Use nullable timestamp parameter to avoid Date.now() during SSR prerendering"
  - "Show static date format (no 'ago' text) during SSR for better caching"

patterns-established:
  - "SSR-compatible time formatting: null timestamp shows static date, avoiding Date.now()"
  - "Clean up orphaned CSS artifacts when removing components"

# Metrics
duration: 12min
completed: 2026-02-06
---

# Phase 10 Plan 03: UAT Gap Closure Summary

**Eliminated ISR-obsolete loading UI, reverted marquee to framer-motion per strategy pivot, cleaned orphaned CSS animations, and fixed Next.js 16 prerendering compatibility**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-06T23:39:51Z
- **Completed:** 2026-02-06T23:51:28Z
- **Tasks:** 2 planned + 1 deviation
- **Files modified:** 3
- **Files deleted:** 3

## Accomplishments

- Removed dead code: loading.tsx, css-preloader, graph-legend (ISR made them obsolete)
- Cleaned globals.css: removed 5 orphaned @keyframes blocks (preloader-_, legend-_, marquee-scroll)
- Reverted MarqueeText to framer-motion (honors project decision to keep framer-motion)
- Fixed Next.js 16 build blocker with SSR-compatible timestamp handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete obsolete preloader and graph-legend files** - `9c61260` (chore)
   - Deleted app/loading.tsx, components/css-preloader.tsx, components/graph-legend.tsx
   - Removed orphaned @keyframes: preloader-\*, legend-slide-in, marquee-scroll
   - Kept only twinkle @keyframes for twinkling-stars

2. **Task 2: Revert MarqueeText to framer-motion** - `55b41d3` (refactor)
   - Added "use client" directive
   - Restored motion.div with animate/transition props
   - Removed CSS animation reference

3. **Deviation fix: Next.js 16 prerendering compatibility** - `0a3fd5c` (fix)
   - Made formatTimeAgo accept nullable Date parameter
   - Show static date when timestamp unavailable (SSR/prerendering)
   - Avoid Date.now() calls that block Next.js 16 static generation

**Plan metadata:** (pending - will be committed after SUMMARY.md creation)

## Files Created/Modified

**Deleted:**

- `app/loading.tsx` - ISR pre-renders full HTML, making Next.js loading UI obsolete
- `components/css-preloader.tsx` - Only consumer was deleted loading.tsx
- `components/graph-legend.tsx` - Zero imports, pure dead code

**Modified:**

- `app/globals.css` - Removed 5 orphaned @keyframes blocks, kept only twinkle animation
- `components/marquee-text.tsx` - Reverted to framer-motion with "use client" directive
- `components/github-activity.tsx` - SSR-compatible timestamp handling for Next.js 16

## Decisions Made

1. **Revert marquee to framer-motion instead of CSS**: Honor v1.2 strategy pivot after UAT showed CSS animation-timeline unreliable
2. **Show static date during SSR**: Better for caching and SEO, "ago" text appears after client hydration
3. **Delete loading.tsx entirely**: ISR pre-renders complete HTML, Next.js loading UI never shows

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Next.js 16 Date.now() prerendering restriction**

- **Found during:** Task verification (npx next build failed)
- **Issue:** Next.js 16 error: "Route used new Date() inside Client Component without Suspense boundary". Build failed with prerendering error.
- **Root cause:** formatTimeAgo() called `new Date()` to compute current time, which Next.js 16 blocks during static prerendering (new strict constraint in v16)
- **Fix:**
  - Made formatTimeAgo accept nullable Date parameter (Date | null)
  - Return static date format when null (no "ago" text)
  - GitHubActivity accepts optional nowTimestamp prop (defaults to null during SSR)
  - Shows "Jan 15" instead of "2h ago" during prerendering, client hydration adds "ago" if needed
- **Files modified:** components/github-activity.tsx
- **Verification:** `npx next build` succeeds, static prerendering works, ISR caching intact
- **Committed in:** `0a3fd5c` (separate fix commit)
- **Trade-off:** Timestamps show as static dates during SSR (better for caching), "ago" format appears after client hydration

---

**Total deviations:** 1 auto-fixed (Rule 3 - Blocking)
**Impact on plan:** Essential fix to unblock build. Next.js 16 introduced stricter prerendering constraints that weren't anticipated in the plan. The solution maintains functionality while enabling static generation and ISR caching.

## Issues Encountered

**Next.js 16 prerendering strictness:** Build initially failed due to Date.now() usage during static generation. Next.js 16 requires either:

- Accessing dynamic data source (headers, cookies) first, OR
- Wrapping in Suspense boundary, OR
- Avoiding Date.now() entirely

**Resolution:** Chose option 3 (avoid Date.now()) to preserve ISR static generation benefits. Timestamps computed client-side after hydration. Static HTML shows date without "ago" text (SEO-friendly).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ✅ Dead code removed (loading UI, css-preloader, graph-legend)
- ✅ Orphaned CSS animations cleaned from globals.css
- ✅ MarqueeText uses framer-motion per project strategy
- ✅ Build succeeds with Next.js 16 prerendering enabled
- ✅ ISR caching intact (5 min revalidation)
- ✅ Ready for Phase 11: Server Component Page conversion

**No blockers.** Phase 10 gap closure complete. All UAT issues from 10-02-VERIFICATION resolved.

---

_Phase: 10-client-boundary-extraction_
_Completed: 2026-02-06_
