# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** The portfolio must remain visually polished and performant -- changes should improve code quality without degrading the user experience.
**Current focus:** v1.2 SSR Migration milestone complete — all 12 phases shipped

## Current Position

Phase: 12 of 12 (PPR Image Optimization) -- v1.2 SSR Migration complete
Plan: 3 of 3 in current phase (all completed)
Status: Milestone complete
Last activity: 2026-02-07 -- Completed 12-03-PLAN.md (PPR shell visibility gap closure)

Progress: [█████████████████████] 100% (7/7 v1.2 plans complete, 12/12 phases complete across all milestones)

## Performance Metrics

**v1.0 Milestone:**

- Total plans: 6
- Average duration: 3.7 min/plan
- Total execution time: 22 min
- Phases: 5

**v1.1 Milestone:**

- Total plans: 6
- Average duration: 2.5 min/plan
- Total execution time: 15 min
- Phases: 3

**v1.2 Milestone (complete):**

- Total plans: 9
- Plans complete: 9
- Average duration: 4.2 min
- Total execution time: 38.5 min
- Phases: 4

**By Phase (cumulative):**

| Phase                          | Milestone | Plans | Total   | Avg/Plan |
| ------------------------------ | --------- | ----- | ------- | -------- |
| 01-dead-code-removal           | v1.0      | 1     | 3min    | 3min     |
| 02-constants-extraction        | v1.0      | 1     | 3min    | 3min     |
| 03-type-safety                 | v1.0      | 1     | 4min    | 4min     |
| 04-state-management-refactor   | v1.0      | 1     | 4min    | 4min     |
| 05-performance-optimization    | v1.0      | 2     | 8min    | 4min     |
| 06-dead-code-directory-cleanup | v1.1      | 1     | 1min    | 1min     |
| 07-code-splitting              | v1.1      | 2     | 7min    | 3.5min   |
| 08-technical-debt              | v1.1      | 3     | 7min    | 2.3min   |
| 09-server-side-github-fetching | v1.2      | 1     | 4min    | 4min     |
| 10-client-boundary-extraction  | v1.2      | 5     | 21.5min | 4.3min   |
| 11-server-component-page       | v1.2      | 1     | 3min    | 3min     |
| 12-ppr-image-optimization      | v1.2      | 3     | 20min   | 6.7min   |

## Accumulated Context

### Decisions

Key decisions logged in PROJECT.md.
Recent decisions affecting current work:

- [v1.1]: Extract sections to components (enables per-section SSR migration)
- [v1.1]: Memory cache over localStorage (will be replaced by ISR in v1.2)
- [v1.2]: Keep framer-motion for all animations -- CSS animation-timeline: view() proved unreliable in UAT
- [v1.2]: Use client boundary wrappers to isolate framer-motion in "use client" files while making page.tsx a server component
- [v1.2]: Strategy pivot -- achieve SSR benefits through component architecture (client boundaries) rather than animation replacement
- [09-01]: Use fetch-level ISR instead of segment-level revalidate (cacheComponents conflict)
- [09-01]: Split page.tsx into server wrapper + client PageContent (SSR + client interactivity)
- [09-01]: Export RedactedCommit type from lib/github.ts as single source of truth
- [10-01]: Use module-level computation for deterministic star generation (no useMemo needed)
- [10-01]: Move @keyframes animations from inline styles to globals.css (avoid hydration warnings)
- [10-01]: Replace framer-motion with CSS animations for static entrance effects
- [10-02]: Convert simple infinite translate animations (marquee) from framer-motion to CSS @keyframes
- [10-02]: Use IntersectionObserver threshold 0.1 for viewport-triggered animations (one-shot pattern)
- [10-02]: Avoid synchronous setState in useEffect (React best practice, ESLint compliance)
- [10-03]: Revert marquee to framer-motion (honors v1.2 strategy pivot after UAT)
- [10-03]: Use nullable timestamp parameter to avoid Date.now() during Next.js 16 SSR prerendering
- [10-03]: Show static date format during SSR (better caching), "ago" text appears after hydration
- [10-04]: Extract Hero section with MotionValue props (parallax hooks stay in page-content)
- [10-04]: Extract About section with backgroundPattern prop (module-level PRNG stays in page-content)
- [10-05]: Moved categoryOffsets computation inside TechAndCodeSection component (cheap O(n) operation on 5 categories)
- [10-05]: Used type-only imports for ExperienceItem and TechCategory (types erased at build time)
- [10-05]: Section wrapper components accept data via props (not internal imports)
- [11-01]: Internalized scroll parallax in HeroSection using section-aware tracking (offset: ["start start", "end start"])
- [11-01]: Created graph-section-loader.tsx client wrapper to satisfy Next.js 16 Turbopack constraint (no dynamic ssr:false in server components)
- [11-01]: Changed scroll transform range from [0, 0.15] to [0, 1] because tracking is now section-relative instead of page-relative
- [12-01]: Split TechAndCodeSection into TechStackSection (static) and GitHubActivityStream (dynamic) to enable PPR split point
- [12-01]: Made Page function synchronous - async data fetching moved to stream component
- [12-01]: PPR enabled via cacheComponents: true (Next.js 16 flag, replaces experimental.ppr)
- [12-02]: Use unoptimized prop for SVG icons with next/image (vectors don't need optimization pipeline)
- [12-02]: dangerouslyAllowSVG with strict CSP for SVG security in next.config.ts
- [12-03]: Hero SSR renders name + title only; orange bar conditionally renders after hydration with slide-in
- [12-03]: Below-fold sections use initial={isHydrated ? {...} : false} + key remount pattern for PPR visibility
- [12-03]: Created useHydrated hook as standard hydration detection utility

### Pending Todos

None yet.

### Blockers/Concerns

- Hydration mismatch risk medium -- twinkling-stars already uses seeded PRNG for deterministic rendering

## Session Continuity

Last session: 2026-02-07
Stopped at: v1.2 SSR Migration milestone complete (all 12 phases, 9 v1.2 plans shipped)
Resume file: None

---

_State initialized: 2026-02-05_
_Last updated: 2026-02-07 -- Phase 12 fully complete (3/3 plans: PPR streaming, next/image, shell visibility fix), v1.2 SSR Migration milestone complete_
