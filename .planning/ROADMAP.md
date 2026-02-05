# Roadmap: Portfolio Cleanup

## Overview

This cleanup milestone systematically addresses technical debt in the portfolio's interactive graph visualization. Starting with safe dead code removal, we extract hardcoded values to constants, strengthen type safety, refactor state management, and optimize performance. Each phase preserves the existing user experience while improving code maintainability.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Dead Code Removal** - Remove unused features and imports
- [x] **Phase 2: Constants Extraction** - Replace magic numbers with named constants
- [x] **Phase 3: Type Safety** - Fix implicit any and create strict types
- [ ] **Phase 4: State Management Refactor** - Consolidate ref management and state patterns
- [ ] **Phase 5: Performance Optimization** - Batch animations and optimize layout calculations

## Phase Details

### Phase 1: Dead Code Removal

**Goal**: Codebase contains only features that are actively used, with no dead imports or unused variables
**Depends on**: Nothing (first phase)
**Requirements**: DEAD-01, DEAD-02, DEAD-03
**Success Criteria** (what must be TRUE):

1. Graph store contains only actively used state (no filter/highlight/view mode infrastructure)
2. All source files have zero unused imports or variables (verified by TypeScript compiler)
3. Component props and function parameters match actual usage patterns (no orphaned parameters)

**Plans:** 1 plan

Plans:

- [x] 01-01-PLAN.md — Remove unused graph store features and clean up component props

### Phase 2: Constants Extraction

**Goal**: All magic numbers are replaced with named constants in a centralized location
**Depends on**: Phase 1
**Requirements**: CONST-01, CONST-02, CONST-03, CONST-04
**Success Criteria** (what must be TRUE):

1. Layout calculations use named constants from lib/layout-constants.ts (no inline numeric literals)
2. Safe area dimensions (header, metrics, margins) are defined in single source of truth
3. Achievement positioning values (spacing, offset, stagger) are configurable via constants
4. Reveal timing values are extracted from component logic to configuration

**Plans:** 1 plan

Plans:

- [x] 02-01-PLAN.md — Extract layout, positioning, and timing constants to centralized file

### Phase 3: Type Safety

**Goal**: TypeScript type checking catches all data shape errors without implicit any
**Depends on**: Phase 2
**Requirements**: TYPE-01, TYPE-02, TYPE-03
**Success Criteria** (what must be TRUE):

1. Layout calculator uses discriminated union for node types (no any type escape hatches)
2. Achievement node data has strict type definition with only needed fields
3. Graph store uses serializable data structures (arrays instead of Sets)

**Plans:** 1 plan

Plans:

- [x] 03-01-PLAN.md — Create discriminated union types and fix store serialization

### Phase 4: State Management Refactor

**Goal**: Component state is managed through clear patterns without ref coordination issues
**Depends on**: Phase 3
**Requirements**: STATE-01, STATE-02, STATE-03
**Success Criteria** (what must be TRUE):

1. DashboardBackground uses minimal refs (reduced from 8+ to essential only)
2. Graph-related state (allNodes, allEdges, addedAchievements) lives in appropriate location (store or simplified local state)
3. Node hover handler has no stale closure risks (clean callback pattern)
   **Plans**: TBD

Plans:

- [ ] 04-01: TBD

### Phase 5: Performance Optimization

**Goal**: Animation and layout performance is optimized without perceptible lag
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):

1. FitView calls are batched into single debounced operation during reveal sequence
2. Reveal sequence uses cleaner timing pattern (no sequential setTimeout chains)
3. Animation variants are defined at module level (no recreation per render)
4. Timeline position calculations are memoized for unchanged viewport sizes
   **Plans**: TBD

Plans:

- [ ] 05-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase                        | Plans Complete | Status      | Completed  |
| ---------------------------- | -------------- | ----------- | ---------- |
| 1. Dead Code Removal         | 1/1            | Complete    | 2026-02-05 |
| 2. Constants Extraction      | 1/1            | Complete    | 2026-02-05 |
| 3. Type Safety               | 1/1            | Complete    | 2026-02-05 |
| 4. State Management Refactor | 0/0            | Not started | -          |
| 5. Performance Optimization  | 0/0            | Not started | -          |

---

_Roadmap created: 2026-02-05_
_Last updated: 2026-02-05 after Phase 3 execution complete_
