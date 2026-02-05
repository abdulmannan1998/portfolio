# Portfolio

## What This Is

A personal portfolio site showcasing career timeline, achievements, and skills through an interactive graph visualization. Built with Next.js 16, React 19, and React Flow. Now with clean, maintainable code after v1.0 cleanup milestone.

## Core Value

The interactive graph visualization must remain functional and visually appealing — changes should improve it, not break it.

## Current State

**Shipped:** v1.0 Portfolio Cleanup (2026-02-05)

- 3,471 LOC TypeScript
- Clean graph store (31 lines, single responsibility)
- Centralized constants in lib/layout-constants.ts
- Type-safe graph nodes with discriminated unions
- Optimized animations with module-level variants
- Debounced fitView (7+ calls → 1-2)

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

### Active

(None — ready for next milestone planning)

### Out of Scope

- Mobile-specific graph view — PWA works well on mobile
- Video/media content — static portfolio is sufficient
- CMS integration — resume-data.ts is source of truth

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

---

_Last updated: 2026-02-05 after v1.0 milestone_
