# Portfolio Cleanup

## What This Is

A personal portfolio site showcasing career timeline, achievements, and skills through an interactive graph visualization. Built with Next.js 16, React 19, and React Flow. This cleanup milestone addresses technical debt, removes unused code, and improves code quality before adding new features.

## Core Value

The interactive graph visualization must remain functional and visually appealing — cleanup should improve it, not break it.

## Requirements

### Validated

- ✓ Interactive career graph with reveal animation — existing
- ✓ Achievement nodes that expand on hover — existing
- ✓ Responsive layout (desktop graph, mobile timeline) — existing
- ✓ Smooth animations via Framer Motion — existing
- ✓ Static resume data driving all content — existing
- ✓ Vercel deployment — existing

### Active

- [ ] Remove unused graph store features (filters, highlighting, view modes)
- [ ] Extract hardcoded magic numbers to constants file
- [ ] Consolidate ref management in DashboardBackground
- [ ] Fix type safety issues (implicit any, unvalidated spreads)
- [ ] Optimize animation batching (reduce fitView calls)
- [ ] Remove sequential setTimeout chains where possible
- [ ] Clean up unused imports and variables across codebase

### Out of Scope

- Adding new features — cleanup only, new features are next milestone
- Test infrastructure — valuable but separate effort
- Accessibility improvements — important but separate milestone
- Error boundaries — useful but can be added later

## Context

**Current state:** Functional portfolio with complex graph visualization. Code has accumulated tech debt from rapid iteration — magic numbers, unused features, suboptimal patterns.

**Codebase analysis:** See `.planning/codebase/CONCERNS.md` for detailed audit of issues. Key problem areas:

- `components/dashboard-background.tsx` — 331 lines, 8+ refs, complex state
- `lib/layout-calculator.ts` — 10+ magic numbers, no validation
- `lib/stores/graph-store.tsx` — unused filter/highlighting features

**Motivation:** Clean foundation before building new features. Reduce cognitive load when reading code. Improve maintainability.

## Constraints

- **Preserve UX quality**: Changes can improve visuals but shouldn't degrade them
- **No new dependencies**: Use existing stack only
- **Atomic commits**: Each fix should be independently revertible

## Key Decisions

| Decision                           | Rationale                           | Outcome   |
| ---------------------------------- | ----------------------------------- | --------- |
| Systematic cleanup via CONCERNS.md | Ensures comprehensive coverage      | — Pending |
| Allow visual behavior changes      | Enables proper fixes vs workarounds | — Pending |

---

_Last updated: 2026-02-05 after initialization_
