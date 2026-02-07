---
phase: 12-ppr-image-optimization
plan: 03
subsystem: rendering
tags: [ppr, hydration, framer-motion, ssr, animation]

requires:
  - phase: 12-ppr-image-optimization
    plan: 01
    provides: "PPR static shell with Suspense streaming"
provides:
  - "Hydration-aware animation pattern for PPR shell visibility"
  - "useHydrated hook for hydration detection"
  - "Visible PPR static shell (no inline opacity: 0 from framer-motion)"
affects: []

tech-stack:
  added: []
  patterns:
    - "useHydrated hook for SSR/hydration detection"
    - "Conditional initial={isHydrated ? {...} : false} to prevent framer-motion SSR inline styles"
    - "Key remount pattern for below-fold entrance animations"
    - "Conditional rendering for above-fold hydration-triggered animations"

key-files:
  created:
    - "lib/use-hydrated.ts"
  modified:
    - "components/sections/hero-section.tsx"
    - "components/sections/about-section.tsx"
    - "components/sections/metrics-section.tsx"
    - "components/sections/experience-timeline.tsx"
    - "components/sections/tech-stack-section.tsx"
    - "components/sections/graph-section.tsx"

key-decisions:
  - "Hero SSR renders name + title only; orange bar conditionally renders after hydration with slide-in animation"
  - "Below-fold sections use initial={isHydrated ? {...} : false} + key remount pattern"
  - "Switched from framer-motion keyframe settle animations to conditional render for hero bar (framer-motion skips keyframes during hydration when values match end state)"
  - "Unique keys per sibling motion element to avoid React key collisions"

patterns-established:
  - "useHydrated hook as standard hydration detection utility"
  - "Above-fold: conditional render pattern (show content SSR, add elements post-hydration)"
  - "Below-fold: conditional initial + key remount (invisible during SSR, animate on scroll after hydration)"

duration: ~15min (iterative with user feedback)
completed: 2026-02-07
gap_closure: true
---

# Phase 12 Plan 03: PPR Static Shell Visibility (Gap Closure) Summary

**Fixed PPR static shell being visually empty by creating hydration-aware animation patterns for all framer-motion section components**

## Performance

- **Duration:** ~15 min (iterative, multiple rounds of user feedback on hero animation)
- **Started:** 2026-02-07
- **Completed:** 2026-02-07
- **Tasks:** 1 auto + 1 checkpoint (user-verified)
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments

- Created `useHydrated` hook for lightweight hydration detection across all section components
- PPR static shell now shows all section content visibly before JS loads (no inline `opacity: 0`)
- Below-fold sections (about, metrics, timeline, tech stack, graph) use conditional `initial` + key remount pattern — content visible in SSR, entrance animations play on scroll after hydration
- Hero section renders name + title in SSR; orange bar slides in from left after hydration via framer-motion `scaleX: 0 → 1`
- No visual regression — all entrance animations preserved

## Task Commits

Iterative development with user feedback produced 8 commits:

1. **feat(12-03): fix PPR static shell visibility with hydration-aware animations** — `48d4bb4`
2. **fix(12-03): use unique keys for sibling motion elements in about-section** — `1f86844`
3. **fix(12-03): defer hero settle animations until after hydration** — `ef49045`
4. **fix(12-03): switch hero settle to CSS @keyframes animations** — `5ed5881`
5. **fix(12-03): change hero settle to expand-then-contract pulse** — `c81ea89`
6. **fix(12-03): center orange bar pulse to expand equally on both sides** — `9817653`
7. **fix(12-03): sync bar pulse delay with name (both 0.3s)** — `e79ad91`
8. **fix(12-03): hero bar slides in from left on hydration** — `eefe7b0` (final approach)

**Checkpoint:** User verified PPR shell visibility and hero animation — approved

## Files Created/Modified

- `lib/use-hydrated.ts` — New hook: returns false during SSR/first render, true after mount
- `components/sections/hero-section.tsx` — SSR shows name + title; bar conditionally renders post-hydration with slide-in
- `components/sections/about-section.tsx` — Conditional initial + unique keys per sibling (label, heading, p1, p2)
- `components/sections/metrics-section.tsx` — Conditional initial + key with metric.id
- `components/sections/experience-timeline.tsx` — Conditional initial + key with item.id
- `components/sections/tech-stack-section.tsx` — Conditional initial for category headers and tech items
- `components/sections/graph-section.tsx` — Conditional initial for graph container motion.div

## Decisions Made

- **Hero approach evolved through user feedback:** Started with settle keyframes (framer-motion), then CSS @keyframes, then pulse animations, finally settled on conditional render — SSR shows name + title only, bar slides in from left after hydration
- **framer-motion hydration quirk discovered:** Keyframe arrays in `animate` are skipped when element already matches end state during hydration (works on navigation but not reload)
- **Unique keys required:** Multiple sibling motion elements with same key caused React warnings — each gets a unique key suffix (label, heading, p1, p2)

## Deviations from Plan

- Hero section deviated significantly from planned "settle keyframe" approach. Plan specified `initial={false}` + settle keyframes for above-fold. Final implementation uses conditional rendering (bar only appears after hydration) instead. This was driven by:
  1. framer-motion keyframe animations not firing during hydration
  2. User preference for a cleaner slide-in rather than settle/pulse effect

## Issues Encountered

- React duplicate key warnings when multiple sibling motion elements shared same key value
- framer-motion skips keyframe animations during hydration when current values match end state
- Multiple iterations needed to match user's vision for hero animation behavior

## User Setup Required

None

## Next Phase Readiness

- Phase 12 fully complete with all 3 plans executed
- All v1.2 SSR Migration requirements fulfilled
- Ready for milestone audit (`/gsd:audit-milestone`)

---

_Phase: 12-ppr-image-optimization_
_Completed: 2026-02-07_
