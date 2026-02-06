# Requirements: Portfolio v1.1

**Defined:** 2026-02-06
**Core Value:** The portfolio must remain visually polished and performant — changes should improve code quality without degrading the user experience.

## v1.1 Requirements

Cleanup and polish requirements based on codebase audit.

### Dead Code Removal

- [ ] **DEAD-01**: Remove unused `dashboard-background.tsx` (355 lines)
- [ ] **DEAD-02**: Remove unused `mobile-hero.tsx` (~125 lines)
- [ ] **DEAD-03**: Remove unused `live-metric-widget.tsx` (37 lines)

### Directory Cleanup

- [ ] **DIR-01**: Remove empty `app/designs/` scaffolded directories (15 dirs)
- [ ] **DIR-02**: Remove empty `components/designs/` scaffolded directories (16 dirs)

### Code Splitting

- [ ] **SPLIT-01**: Extract `MarqueeText` component to own file
- [ ] **SPLIT-02**: Extract `AnimatedCounter` component to own file
- [ ] **SPLIT-03**: Extract `GitHubActivity` component to own file (~130 lines)
- [ ] **SPLIT-04**: Extract `techStack` data to `data/tech-stack.ts`

### Technical Debt

- [ ] **DEBT-01**: Add cleanup to setTimeout chains in graph reveal sequence
- [ ] **DEBT-02**: Fix debounce to return cleanup function
- [ ] **DEBT-03**: Add caching/deduplication for GitHub API calls
- [ ] **DEBT-04**: Update PROJECT.md/codebase docs to reflect current state

## Future Requirements

None — v1.1 is focused cleanup.

## Out of Scope

| Feature                     | Reason                                             |
| --------------------------- | -------------------------------------------------- |
| Design theme implementation | Removed scaffolds; will re-add when ready to build |
| New features                | Cleanup-only milestone                             |
| Test infrastructure         | Separate milestone                                 |

## Traceability

| Requirement | Phase | Status  |
| ----------- | ----- | ------- |
| DEAD-01     | TBD   | Pending |
| DEAD-02     | TBD   | Pending |
| DEAD-03     | TBD   | Pending |
| DIR-01      | TBD   | Pending |
| DIR-02      | TBD   | Pending |
| SPLIT-01    | TBD   | Pending |
| SPLIT-02    | TBD   | Pending |
| SPLIT-03    | TBD   | Pending |
| SPLIT-04    | TBD   | Pending |
| DEBT-01     | TBD   | Pending |
| DEBT-02     | TBD   | Pending |
| DEBT-03     | TBD   | Pending |
| DEBT-04     | TBD   | Pending |

**Coverage:**

- v1.1 requirements: 13 total
- Mapped to phases: 0
- Unmapped: 13

---

_Requirements defined: 2026-02-06_
_Last updated: 2026-02-06 after initial definition_
