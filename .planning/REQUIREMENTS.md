# Requirements: Portfolio Cleanup

**Defined:** 2026-02-05
**Core Value:** Clean, maintainable code without breaking the interactive graph visualization

## v1 Requirements

Requirements for this cleanup milestone, derived from `.planning/codebase/CONCERNS.md`.

### Dead Code Removal

- [x] **DEAD-01**: Remove unused graph store features (filters, highlighting, view modes) from `graph-store.tsx`
- [x] **DEAD-02**: Remove unused imports and variables across all source files
- [x] **DEAD-03**: Audit and remove any unused component props or function parameters

### Constants & Magic Numbers

- [ ] **CONST-01**: Extract safe area constants from `layout-calculator.ts` (header: 140, metrics: 220, left margin: 240)
- [ ] **CONST-02**: Extract achievement positioning constants (spacing: 200, offset: 250, stagger: 150)
- [ ] **CONST-03**: Extract reveal timing constants from `dashboard-background.tsx` (1200ms, 1700ms, 2200ms)
- [ ] **CONST-04**: Create centralized `lib/layout-constants.ts` for all extracted values

### State Management

- [ ] **STATE-01**: Consolidate ref management in DashboardBackground — reduce from 8+ refs
- [ ] **STATE-02**: Move `allNodes`, `allEdges`, `addedAchievements` tracking to graph store or simplify
- [ ] **STATE-03**: Clean up stale closure patterns around `handleNodeHoverRef`

### Type Safety

- [ ] **TYPE-01**: Replace implicit `any` in layout-calculator.ts line 83 with proper discriminated union
- [ ] **TYPE-02**: Create strict `AchievementNodeDisplayData` type for achievement node data
- [ ] **TYPE-03**: Fix Zustand store Set<string> serialization issue — use arrays instead

### Performance

- [ ] **PERF-01**: Batch fitView calls — reduce from 7+ calls during reveal to single debounced call
- [ ] **PERF-02**: Optimize reveal sequence — replace sequential setTimeout chain with cleaner pattern
- [ ] **PERF-03**: Extract animation variants to module-level constants (avoid recreation per render)
- [ ] **PERF-04**: Add memoization to `getTimelinePositions` for unchanged viewport sizes

## v2 Requirements

Deferred to future milestones — valuable but out of scope for cleanup.

### Testing Infrastructure

- **TEST-01**: Add Vitest setup with React Testing Library
- **TEST-02**: Write tests for layout-calculator positioning logic
- **TEST-03**: Write tests for graph store actions

### Accessibility

- **A11Y-01**: Add keyboard navigation for graph nodes
- **A11Y-02**: Add ARIA labels and descriptions
- **A11Y-03**: Ensure sufficient color contrast

### Error Handling

- **ERR-01**: Add ErrorBoundary around DashboardBackground
- **ERR-02**: Add validation for resume-data structure
- **ERR-03**: Add try-catch in layout calculations

## Out of Scope

| Feature       | Reason                                     |
| ------------- | ------------------------------------------ |
| New features  | Cleanup only — features are next milestone |
| Mobile graph  | Separate design decision, not cleanup      |
| CI/CD changes | Infrastructure work, not code cleanup      |
| Documentation | Can document after cleanup stabilizes      |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| DEAD-01     | Phase 1 | Complete |
| DEAD-02     | Phase 1 | Complete |
| DEAD-03     | Phase 1 | Complete |
| CONST-01    | Phase 2 | Pending  |
| CONST-02    | Phase 2 | Pending  |
| CONST-03    | Phase 2 | Pending  |
| CONST-04    | Phase 2 | Pending  |
| TYPE-01     | Phase 3 | Pending  |
| TYPE-02     | Phase 3 | Pending  |
| TYPE-03     | Phase 3 | Pending  |
| STATE-01    | Phase 4 | Pending  |
| STATE-02    | Phase 4 | Pending  |
| STATE-03    | Phase 4 | Pending  |
| PERF-01     | Phase 5 | Pending  |
| PERF-02     | Phase 5 | Pending  |
| PERF-03     | Phase 5 | Pending  |
| PERF-04     | Phase 5 | Pending  |

**Coverage:**

- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---

_Requirements defined: 2026-02-05_
_Last updated: 2026-02-05 after Phase 1 complete - DEAD-01, DEAD-02, DEAD-03 satisfied_
