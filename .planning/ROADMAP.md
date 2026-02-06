# Roadmap: Portfolio

## Milestones

- v1.0 Portfolio Cleanup - Phases 1-5 (shipped 2026-02-05)
- **v1.1 Codebase Polish** - Phases 6-8 (in progress)

## Phases

<details>
<summary>v1.0 Portfolio Cleanup (Phases 1-5) - SHIPPED 2026-02-05</summary>

Systematic cleanup of technical debt in the interactive graph visualization — dead code removal, centralized constants, type safety, state consolidation, and performance optimization.

See `.planning/MILESTONES.md` for details.

</details>

### v1.1 Codebase Polish (In Progress)

**Milestone Goal:** Remove dead code, clean up file structure, implement proper code splitting, and address technical debt from CONCERNS.md audit.

- [x] **Phase 6: Dead Code & Directory Cleanup** - Remove unused files and empty scaffolded directories
- [x] **Phase 7: Code Splitting** - Extract inline components to separate files
- [x] **Phase 8: Technical Debt** - Fix async patterns and update documentation

## Phase Details

### Phase 6: Dead Code & Directory Cleanup

**Goal**: Eliminate unused code and empty directory scaffolds to reduce codebase noise
**Depends on**: Nothing (first phase of v1.1)
**Requirements**: DEAD-01, DEAD-02, DEAD-03, DIR-01, DIR-02
**Plans:** 1 plan

Plans:

- [x] 06-01-PLAN.md — Remove unused components and empty scaffolded directories

### Phase 7: Code Splitting

**Goal**: Extract inline components from page.tsx into dedicated files for maintainability
**Depends on**: Phase 6 (clean slate after dead code removal)
**Requirements**: SPLIT-01, SPLIT-02, SPLIT-03, SPLIT-04
**Success Criteria** (what must be TRUE):

1. MarqueeText component lives in its own file under components/
2. AnimatedCounter component lives in its own file under components/
3. GitHubActivity component lives in its own file under components/
4. techStack data lives in data/tech-stack.ts, imported by page.tsx
5. page.tsx is significantly smaller (target: under 400 lines)

**Plans:** 2 plans

Plans:

- [x] 07-01-PLAN.md — Extract techStack data and inline components (MarqueeText, AnimatedCounter, GitHubActivity) to dedicated files
- [x] 07-02-PLAN.md — Gap closure: Extract Experience timeline and Metrics sections to reach 400-line target

### Phase 8: Technical Debt

**Goal**: Fix async cleanup patterns and ensure documentation reflects current state
**Depends on**: Phase 7 (code splitting complete for accurate docs)
**Requirements**: DEBT-01, DEBT-02, DEBT-03, DEBT-04
**Success Criteria** (what must be TRUE):

1. All setTimeout chains in graph reveal have cleanup functions
2. Debounce utility returns cleanup function and is used correctly
3. GitHub API calls have caching or deduplication to prevent redundant fetches
4. PROJECT.md accurately describes current codebase structure

**Plans:** 3 plans

Plans:

- [x] 08-01-PLAN.md — Fix debounce cleanup and graph timer tracking
- [x] 08-02-PLAN.md — Add GitHub API caching with 5-minute TTL
- [x] 08-03-PLAN.md — Update documentation to reflect current structure

## Progress

**Execution Order:** Phases 6 -> 7 -> 8

| Phase                            | Milestone | Plans Complete | Status   | Completed  |
| -------------------------------- | --------- | -------------- | -------- | ---------- |
| 1-5                              | v1.0      | 6/6            | Complete | 2026-02-05 |
| 6. Dead Code & Directory Cleanup | v1.1      | 1/1            | Complete | 2026-02-06 |
| 7. Code Splitting                | v1.1      | 2/2            | Complete | 2026-02-06 |
| 8. Technical Debt                | v1.1      | 3/3            | Complete | 2026-02-06 |

---

_Roadmap created: 2026-02-06_
_Last updated: 2026-02-06 — Phase 8 complete (v1.1 shipped)_
