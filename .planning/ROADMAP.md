# Roadmap: Portfolio

## Milestones

- v1.0 Portfolio Cleanup - Phases 1-5 (shipped 2026-02-05)
- v1.1 Codebase Polish - Phases 6-8 (shipped 2026-02-07)
- v1.2 SSR Migration - Phases 9-12 (shipped 2026-02-07)
- **v1.3 Graph Improvements** - Phases 13-17 (in progress)

## Phases

### v1.3 Graph Improvements (In Progress)

**Milestone Goal:** Transform the graph from a mechanical node reveal into a cinematic, recruiter-optimized guided career story.

- [ ] **Phase 13: State Machine Foundation** - Replace setTimeout cascade with state machine; click-to-trigger reveal in reverse-chronological order
- [ ] **Phase 14: Camera Choreography** - Camera follows the career story with zoom transitions and a dramatic finale
- [ ] **Phase 15: Interaction Model and Node Polish** - Click-to-expand achievements, polished node cards, and soft-skill badges
- [ ] **Phase 16: Animated Edges** - Edges draw in during reveal and flow with gradient animation after
- [ ] **Phase 17: Content and Tuning** - Course sub-nodes under Bilkent education and final timing passes

## Phase Details

### Phase 13: State Machine Foundation

**Goal**: User can intentionally trigger a career reveal that plays nodes in recruiter-optimized order
**Depends on**: Nothing (first phase of v1.3)
**Requirements**: REVEAL-01, REVEAL-02
**Success Criteria** (what must be TRUE):

1. User can click the root name node to start the reveal (mouse-enter no longer triggers it)
2. Career nodes appear in reverse-chronological order: Intenseye first, then Layermark, then Bilkent
3. The reveal sequence can be interrupted/aborted without leaving the graph in a broken state
4. No fitView prop or debouncedFitView calls remain (prerequisite for camera work)
   **Plans**: TBD

Plans:

- [ ] 13-01: TBD
- [ ] 13-02: TBD

### Phase 14: Camera Choreography

**Goal**: Camera follows the career narrative, creating a cinematic guided tour of the graph
**Depends on**: Phase 13
**Requirements**: REVEAL-03, REVEAL-04, REVEAL-05
**Success Criteria** (what must be TRUE):

1. Camera smoothly pans to each new node as it appears during the reveal sequence
2. Zoom starts tight on the root node (~1.2x) and gradually loosens as more of the graph is revealed
3. Reveal ends with a dramatic pullback showing the complete graph
4. User sees a clear visual cue after the reveal completes indicating the graph is now explorable
5. User panning/zooming is disabled during the reveal and re-enabled after completion
   **Plans**: TBD

Plans:

- [ ] 14-01: TBD

### Phase 15: Interaction Model and Node Polish

**Goal**: Users can explore achievements through click interaction on polished, premium-feeling node cards
**Depends on**: Phase 14
**Requirements**: INTERACT-01, INTERACT-02, VISUAL-01, VISUAL-04
**Success Criteria** (what must be TRUE):

1. User can click a company or education node to reveal its achievement nodes (hover-to-spawn is removed)
2. Company nodes display an achievement count badge (e.g., "9 projects") indicating hidden content
3. Node cards have visibly improved typography, gradient borders, and refined shadows
4. Soft skills appear as compact badges on the root node (the 3 separate floating skill nodes and their edges are gone)
   **Plans**: TBD

Plans:

- [ ] 15-01: TBD
- [ ] 15-02: TBD

### Phase 16: Animated Edges

**Goal**: Edge connections feel alive -- drawing in during the reveal and flowing with subtle animation after
**Depends on**: Phase 14
**Requirements**: VISUAL-02, VISUAL-03
**Success Criteria** (what must be TRUE):

1. Edges draw in progressively from source to target during the reveal sequence (not appearing instantly)
2. Career edges display a subtle flowing gradient animation after the reveal completes
3. Animation performance is smooth on desktop and does not degrade mobile experience (tiered intensity)
   **Plans**: TBD

Plans:

- [ ] 16-01: TBD

### Phase 17: Content and Tuning

**Goal**: Academic depth is visible under Bilkent and the entire reveal feels polished end-to-end
**Depends on**: Phase 15, Phase 16
**Requirements**: CONTENT-01
**Success Criteria** (what must be TRUE):

1. User can see 7 course sub-nodes under Bilkent education (Algorithms, ALM, SVV, Database Systems, Data Structures, OO Software Engineering, Machine Learning)
2. Course nodes integrate cleanly into the reveal sequence and camera choreography
3. Full reveal sequence plays smoothly from click through finale with no timing glitches or visual jank
   **Plans**: TBD

Plans:

- [ ] 17-01: TBD

## Progress

**Execution Order:** 13 -> 14 -> 15 -> 16 -> 17

| Phase                                 | Milestone | Plans Complete | Status      | Completed |
| ------------------------------------- | --------- | -------------- | ----------- | --------- |
| 13. State Machine Foundation          | v1.3      | 0/TBD          | Not started | -         |
| 14. Camera Choreography               | v1.3      | 0/TBD          | Not started | -         |
| 15. Interaction Model and Node Polish | v1.3      | 0/TBD          | Not started | -         |
| 16. Animated Edges                    | v1.3      | 0/TBD          | Not started | -         |
| 17. Content and Tuning                | v1.3      | 0/TBD          | Not started | -         |

---

_Created: 2026-02-07_
_Milestone: v1.3 Graph Improvements (12 requirements, 5 phases)_
