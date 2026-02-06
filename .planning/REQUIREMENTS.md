# Requirements: Portfolio v1.1

**Defined:** 2026-02-06
**Core Value:** The portfolio must remain visually polished and performant — changes should improve code quality without degrading the user experience.

## v1.1 Requirements

Cleanup and polish requirements based on codebase audit.

### Dead Code Removal

- [x] **DEAD-01**: Remove unused `dashboard-background.tsx` (355 lines)
- [x] **DEAD-02**: Remove unused `mobile-hero.tsx` (~125 lines)
- [x] **DEAD-03**: Remove unused `live-metric-widget.tsx` (37 lines)

### Directory Cleanup

- [x] **DIR-01**: Remove empty `app/designs/` scaffolded directories (15 dirs)
- [x] **DIR-02**: Remove empty `components/designs/` scaffolded directories (16 dirs)

### Code Splitting

- [x] **SPLIT-01**: Extract `MarqueeText` component to own file
- [x] **SPLIT-02**: Extract `AnimatedCounter` component to own file
- [x] **SPLIT-03**: Extract `GitHubActivity` component to own file (~130 lines)
- [x] **SPLIT-04**: Extract `techStack` data to `data/tech-stack.ts`

### Technical Debt

- [x] **DEBT-01**: Add cleanup to setTimeout chains in graph reveal sequence
- [x] **DEBT-02**: Fix debounce to return cleanup function
- [x] **DEBT-03**: Add caching/deduplication for GitHub API calls
- [x] **DEBT-04**: Update PROJECT.md/codebase docs to reflect current state

## Future Requirements

None — v1.1 is focused cleanup.

## Out of Scope

| Feature                     | Reason                                             |
| --------------------------- | -------------------------------------------------- |
| Design theme implementation | Removed scaffolds; will re-add when ready to build |
| New features                | Cleanup-only milestone                             |
| Test infrastructure         | Separate milestone                                 |

## Traceability

| Requirement | Phase | Status   |
| ----------- | ----- | -------- |
| DEAD-01     | 6     | Complete |
| DEAD-02     | 6     | Complete |
| DEAD-03     | 6     | Complete |
| DIR-01      | 6     | Complete |
| DIR-02      | 6     | Complete |
| SPLIT-01    | 7     | Complete |
| SPLIT-02    | 7     | Complete |
| SPLIT-03    | 7     | Complete |
| SPLIT-04    | 7     | Complete |
| DEBT-01     | 8     | Complete |
| DEBT-02     | 8     | Complete |
| DEBT-03     | 8     | Complete |
| DEBT-04     | 8     | Complete |

**Coverage:**

- v1.1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---

_Requirements defined: 2026-02-06_
_Last updated: 2026-02-06 — Phase 8 requirements complete (v1.1 shipped)_
