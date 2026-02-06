# Portfolio

## What This Is

A brutalist personal portfolio site showcasing career timeline, achievements, and skills through multiple sections including an interactive graph visualization. Built with Next.js 16, React 19, React Flow, and Framer Motion. Features hero, marquee, about, tech stack, experience timeline, metrics, career graph, and GitHub activity sections.

## Core Value

The portfolio must remain visually polished and performant — changes should improve code quality without degrading the user experience.

## Current Milestone: v1.1 Codebase Polish - COMPLETE

**Goal:** Remove dead code, clean up file structure, implement proper code splitting, and address technical debt from CONCERNS.md audit.

**Target areas (all complete):**

- ✓ Dead code removal (~517 lines in unused components) - Phase 1
- ✓ Empty directory cleanup (31 scaffolded but empty theme dirs) - Phase 1
- ✓ Code splitting (page.tsx reduced from 826 to 390 lines) - Phase 7
- ✓ Technical debt fixes (setTimeout cleanup, API caching, debounce cancel) - Phase 8

## Current State

**Shipped:** v1.1 Codebase Polish (2026-02-06)

- 390-line main page.tsx (reduced from 826 lines via modular components)
- Extracted components: graph-section, metrics-section, experience-timeline
- Extracted data files: tech-stack.ts, experience.ts
- Clean graph store (31 lines, single responsibility)
- Centralized constants in lib/layout-constants.ts
- Type-safe graph nodes with discriminated unions
- Optimized animations with module-level variants
- Debounced fitView (7+ calls → 1-2)
- Timer cleanup pattern with useRef tracking
- Debounce utility with .cancel() method
- GitHub API memory cache with 5-minute TTL

**Tech stack:** Next.js 16, React 19, React Flow, Zustand, Framer Motion, Tailwind CSS

## Requirements

### Validated

- ✓ Interactive career graph with reveal animation — v1.0
- ✓ Achievement nodes that expand on hover — v1.0
- ✓ Responsive layout (desktop graph, mobile timeline) — v1.0
- ✓ Smooth animations via Framer Motion — v1.0
- ✓ Static resume data driving all content — v1.0
- ✓ Clean graph store with minimal state — v1.0
- ✓ Centralized layout constants — v1.0
- ✓ Type-safe node structures — v1.0
- ✓ Optimized animation performance — v1.0
- ✓ Brutalist hero section with scroll animation — pre-GSD
- ✓ Marquee text banner — pre-GSD
- ✓ About section (split screen layout) — pre-GSD
- ✓ Tech stack grid (18 technologies) — pre-GSD
- ✓ Experience timeline (vertical) — pre-GSD
- ✓ Metrics section with animated counters — pre-GSD
- ✓ GitHub activity live feed — pre-GSD
- ✓ Labs page (coming soon placeholder) — pre-GSD
- ✓ DEBT-01: Timer cleanup in graph-section — v1.1 Phase 8
- ✓ DEBT-02: Debounce .cancel() method — v1.1 Phase 8
- ✓ DEBT-03: GitHub API caching — v1.1 Phase 8
- ✓ DEBT-04: Code splitting to modular components — v1.1 Phase 7

### Active

None - v1.1 milestone complete.

### Out of Scope

- Mobile-specific graph view — PWA works well on mobile
- Video/media content — static portfolio is sufficient
- CMS integration — resume-data.ts is source of truth

## File Structure

```
/app
  /page.tsx           # Main portfolio page (~390 lines, imports sections)
  /labs/page.tsx      # Labs coming soon page

/components
  /sections/
    /graph-section.tsx      # Interactive career graph
    /metrics-section.tsx    # Impact metrics with animated counters
    /experience-timeline.tsx # Vertical career timeline
  /github-activity.tsx      # Live GitHub feed widget
  /graph-legend.tsx         # React Flow legend
  /custom-node.tsx          # React Flow custom node
  /nodes/
    /achievement-node.tsx   # Achievement expansion node

/data
  /resume-data.ts       # Portfolio content (bio, skills, companies)
  /tech-stack.ts        # Tech stack grid data (18 technologies)
  /experience.ts        # Experience timeline data

/lib
  /debounce.ts          # Debounce utility with cancel method
  /graph-utils.ts       # Graph node/edge generation
  /layout-constants.ts  # Layout and timing constants
  /stores/
    /graph-store.tsx    # Zustand graph state

/public
  /llms.txt             # Machine-readable site info
```

## Constraints

- **Preserve UX quality**: Changes can improve visuals but shouldn't degrade them
- **No new dependencies**: Use existing stack unless compelling reason
- **Atomic commits**: Each change should be independently revertible

## Key Decisions

| Decision                           | Rationale                         | Outcome |
| ---------------------------------- | --------------------------------- | ------- |
| Systematic cleanup via CONCERNS.md | Ensures comprehensive coverage    | ✓ Good  |
| Domain-grouped constants           | Related values organized together | ✓ Good  |
| Discriminated union for node types | Enables type narrowing            | ✓ Good  |
| Array instead of Set in store      | JSON serializability              | ✓ Good  |
| store.getState() for callbacks     | Avoids stale closures             | ✓ Good  |
| useMemo for debounced fitView      | React Compiler compatibility      | ✓ Good  |
| Extract sections to components     | Maintainability, reusability      | ✓ Good  |
| Extract data to typed files        | Single source of truth, reuse     | ✓ Good  |
| Timer tracking with useRef         | Prevents memory leaks on unmount  | ✓ Good  |
| Memory cache over localStorage     | Simplicity, session-based data    | ✓ Good  |

---

_Last updated: 2026-02-06 after v1.1 milestone (Phases 7-8 complete)_
