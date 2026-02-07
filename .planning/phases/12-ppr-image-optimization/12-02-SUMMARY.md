---
phase: 12-ppr-image-optimization
plan: 02
subsystem: ui
tags: [next-image, svg, layout-shift, optimization]

requires:
  - phase: 10-client-boundary-extraction
    provides: "TechAndCodeSection with framer-motion animations"
provides:
  - "next/image for all tech stack SVG icons with explicit dimensions"
  - "No layout shift on icon load"
affects: []

tech-stack:
  added: []
  patterns:
    - "next/image with unoptimized prop for SVG icons"

key-files:
  created: []
  modified:
    - "components/sections/tech-stack-section.tsx"
    - "next.config.ts"

key-decisions:
  - "Use unoptimized prop for SVGs (vectors don't need optimization pipeline)"
  - "width=28/height=28 matches md:w-7 (largest rendered size)"
  - "dangerouslyAllowSVG with strict CSP for SVG security"

duration: 2min
completed: 2026-02-07
---

# Phase 12 Plan 02: next/image for Tech Stack Icons Summary

**Replaced all 27 raw img tags with next/image using explicit width/height and unoptimized prop for SVG icons**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-07
- **Completed:** 2026-02-07
- **Tasks:** 1 (+ 1 checkpoint verified)
- **Files modified:** 2

## Accomplishments

- All tech stack SVG icons now use next/image with explicit width={28} height={28}
- Removed eslint-disable comment for no-img-element rule
- Added dangerouslyAllowSVG with strict content security policy to next.config.ts
- No layout shift on icon load — explicit dimensions prevent CLS
- Visual verification confirmed: all 27 icons render identically to before

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace img with next/image for tech stack icons** - `29c7caf` (feat)

**Checkpoint:** Visual verification approved by user

**Plan metadata:** (bundled with phase completion commit)

## Files Created/Modified

- `components/sections/tech-stack-section.tsx` - next/image with width={28} height={28} unoptimized for all SVG icons
- `next.config.ts` - Added images config with dangerouslyAllowSVG and strict CSP

## Decisions Made

- Used `unoptimized` prop since SVGs are resolution-independent vectors — optimization would rasterize or add unnecessary overhead
- Set width=28/height=28 matching md:w-7 (28px, the largest responsive breakpoint size)
- Added dangerouslyAllowSVG with sandbox CSP to prevent script execution in SVGs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 12 complete with both PPR streaming and image optimization
- All v1.2 SSR Migration requirements fulfilled

---

_Phase: 12-ppr-image-optimization_
_Completed: 2026-02-07_
