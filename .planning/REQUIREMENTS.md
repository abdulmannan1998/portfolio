# Requirements: v1.3 Graph Improvements

## Milestone Requirements

### Reveal System

- [ ] **REVEAL-01**: User can click the root name node to start the career reveal sequence (replacing mouse-enter trigger)
- [ ] **REVEAL-02**: Career nodes appear in reverse-chronological order (Intenseye → Layermark → Bilkent)
- [ ] **REVEAL-03**: Camera smoothly pans to each new node as it appears during the reveal
- [ ] **REVEAL-04**: Camera zoom tightens on root node (~1.2x) and gradually loosens across the reveal, ending with a dramatic pullback showing the full graph
- [ ] **REVEAL-05**: User sees a clear "now explore" cue after the reveal sequence completes

### Interaction Model

- [ ] **INTERACT-01**: User can click a company/education node to reveal its achievement nodes (replacing hover-to-spawn)
- [ ] **INTERACT-02**: User can see an achievement count badge on company nodes indicating hidden content

### Visual Polish

- [ ] **VISUAL-01**: User sees polished node cards with improved typography, gradient borders, and refined shadows
- [ ] **VISUAL-02**: User sees edges draw in from source to target during the reveal sequence (not appearing instantly)
- [ ] **VISUAL-03**: User sees subtle flowing gradient animation on career edges after they're drawn
- [ ] **VISUAL-04**: User sees soft skills as compact badges on the root node (replacing 3 floating nodes and their edges)

### Content

- [ ] **CONTENT-01**: User can see course sub-nodes under Bilkent education (Algorithms, Application Lifecycle Management, Software Verification and Validation, Database Systems, Data Structures, Object-Oriented Software Engineering, Machine Learning)

## Future Requirements

(None deferred — all features in scope for v1.3)

## Out of Scope

- 3D/WebGL effects — wrong aesthetic, massive bundle cost
- Physics-based layout (d3-force, elkjs) — graph is curated, not organic
- Canvas particle overlays (tsParticles) — SVG-native is sufficient
- Minimap — spoils the reveal; graph is small enough without it
- Sound effects / audio narration — hostile UX for office environments
- Auto-replay / infinite loop — reveal plays once, user takes control
- Node dragging — portfolio presentation, not a graph editor
- Any new runtime dependencies — existing stack covers everything

## Traceability

| REQ-ID      | Phase | Status  |
| ----------- | ----- | ------- |
| REVEAL-01   | 13    | Pending |
| REVEAL-02   | 13    | Pending |
| REVEAL-03   | 14    | Pending |
| REVEAL-04   | 14    | Pending |
| REVEAL-05   | 14    | Pending |
| INTERACT-01 | 15    | Pending |
| INTERACT-02 | 15    | Pending |
| VISUAL-01   | 15    | Pending |
| VISUAL-02   | 16    | Pending |
| VISUAL-03   | 16    | Pending |
| VISUAL-04   | 15    | Pending |
| CONTENT-01  | 17    | Pending |

---

_12 requirements across 4 categories_
_Created: 2026-02-07_
