# Research Summary: v1.3 Graph Improvements

**Synthesized:** 2026-02-07
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Confidence:** HIGH

## Key Findings

### Stack Additions

**None.** Zero new dependencies. The existing stack covers every requirement:

- **@xyflow/react 12.10.0** -- Camera API (`setCenter`, `fitBounds`) with `duration`/`ease` + `Promise<boolean>` return; custom edges via `EdgeProps` + `getSmoothStepPath` + `BaseEdge`
- **framer-motion 12.31.0** -- Node entrance/expand animations, `whileHover`, `layout` for expand/collapse
- **zustand 5.0.11** -- State machine via discriminated union `RevealPhase` type (no XState needed for linear sequence)
- **SVG-native** -- `<animateMotion>` for edge particles, `stroke-dasharray`/`stroke-dashoffset` for draw-in, `<linearGradient>` for gradient edges

Do NOT add: GSAP, D3 directly, tsparticles, Lottie/Rive, react-spring, anime.js, XState.

### Feature Table Stakes

Six must-haves for the improvement to feel complete:

1. **Click-to-trigger reveal** -- Replace accidental `onMouseEnter` with intentional root node click
2. **Reverse-chronological ordering** -- Intenseye -> Layermark -> Bilkent (recruiter-optimized)
3. **Camera follows each node** -- `setCenter()` with Promise chaining. THE cinematic differentiator.
4. **Click-to-expand achievements** -- Replace hover-to-spawn with click-triggered progressive disclosure
5. **Polished node card design** -- Better typography, gradient borders, premium shadows
6. **Animated edge connections** -- Custom edge with `stroke-dasharray` draw-in on reveal

### Feature Differentiators

- **Zoom choreography** -- Zoom tightens on root (1.2x), loosens across reveal, finale fitView pullback
- **Flowing edge gradient/particles** -- SVG animated gradient or `<animateMotion>` circle on career edges
- **Story-complete state** -- Clear "now explore" cue after reveal finishes
- **Skill badges** -- Soft skills as compact badges on root node (eliminates 3 nodes + 3 edges)
- **Achievement count badges** -- "9 projects" indicator on company nodes
- **Course sub-nodes** -- Academic depth under Bilkent for technical recruiter evaluation

### Architecture

Replace `setTimeout` cascade with **state machine + camera sequencer**:

- `RevealPhase` discriminated union in Zustand drives two consumers
- `graph-section.tsx` adds nodes/edges per phase transition
- New `useCameraSequencer` hook subscribes to phase, calls `setCenter()`/`fitBounds()` with AbortController
- Phase advances only after camera settles + dwell time elapses (no race conditions)

Only **2 new files** needed:

1. `lib/hooks/use-camera-sequencer.ts` (~60 lines) -- camera animation hook
2. `components/edges/animated-edge.tsx` (~80 lines) -- custom edge with gradient + particle

Heavy rewrites: `graph-store.tsx`, `graph-section.tsx`. Moderate changes: `custom-node.tsx`, `layout-constants.ts`, `layout-calculator.ts`, `graph-utils.ts`. Minor: `achievement-node.tsx`, `resume-data.ts`.

### Watch Out For

1. **fitView prop vs programmatic setCenter** -- `<ReactFlow fitView>` overrides every `setCenter()` call on node changes. **Remove `fitView` prop and all `debouncedFitView()` calls FIRST, before any camera work.**
2. **Framer Motion `layout` + edge recalculation storm** -- AchievementNode's `layout` animation causes 18+ edge recalcs per expand. **Replace with CSS transitions on inner content div.**
3. **setTimeout chain cannot be interrupted** -- Current timer cascade has no pause, skip, or camera-awareness. **State machine + async/await + AbortController.**
4. **SVG animation performance on 22+ edges** -- Full effects on all edges kills mobile FPS. **Tier: full animation on 6 career edges, subtle dash on project edges, no SVG filters.**
5. **Camera panning to unmeasured nodes** -- `setCenter()` right after `setNodes()` targets stale positions. **Double `requestAnimationFrame` between add and pan.**

## Recommendations

### Build Order (5 phases)

**Phase 1: State Machine Foundation**

- Rewrite `graph-store.tsx` with `RevealPhase` discriminated union
- Replace `layout-constants.ts` timing model
- Click-to-trigger on root node, reverse-chronological order
- Remove `fitView` prop and all `debouncedFitView()` calls
- Avoids: Pitfalls 1, 3, 7

**Phase 2: Camera Choreography**

- Create `use-camera-sequencer.ts` hook
- `setCenter()` per reveal step with zoom levels and dwell timing
- Finale fitView pullback, story-complete state
- Disable user interaction during reveal
- Avoids: Pitfalls 5, 10, 12

**Phase 3: Interaction Model and Node Polish**

- Company click -> achievement reveal (replace hover-to-spawn)
- Polished node card design (typography, shadows, gradient borders)
- Soft-skill badges on root node (remove 3 nodes + 3 edges)
- Achievement count badges on company nodes
- Plan mobile fallback (skip cinematic on small viewports)
- Avoids: Pitfalls 2, 6

**Phase 4: Animated Edges**

- Create `animated-edge.tsx` custom edge component
- Draw-in effect during reveal (`stroke-dasharray` animation)
- Flowing gradient on career edges, subtle dash on project edges
- Unique gradient IDs per edge
- Avoids: Pitfalls 4, 8, 11, 13

**Phase 5: Content and Tuning**

- Course sub-nodes under Bilkent (resume-data + layout-calculator)
- Final timing/easing/zoom tuning across all phases
- Mobile margin recalculation
- Production build testing (React Compiler + Framer Motion)

### What to Skip/Defer

- 3D/WebGL -- wrong aesthetic, massive bundle
- Physics-based layout -- graph is curated, not organic
- Canvas particle overlay -- SVG-native is sufficient
- Minimap -- spoils reveal; graph is small
- Sound effects, auto-replay, complex edge routing
- Any new runtime dependency

### Research Flags

- **Phase 4 needs testing:** SVG animated gradient cross-browser behavior (Safari/Firefox/Chrome)
- **Phase 3 needs validation:** React Compiler + Framer Motion memoization in production builds
- **Phases 1, 2, 5 are standard patterns** -- APIs verified from installed type definitions, no phase research needed

## Risk Assessment

| Risk                                | Level  | Mitigation                                                     |
| ----------------------------------- | ------ | -------------------------------------------------------------- |
| fitView/setCenter viewport fighting | High   | Remove fitView prop in Phase 1 before any camera work          |
| Layout prop edge recalc storm       | Medium | Address in Phase 3 before edge animations arrive in Phase 4    |
| SVG animation mobile perf           | Medium | Tier animation intensity; career edges only get full treatment |
| Creative timing tuning              | Low    | Define sequence as data array, easy to iterate                 |
| React Compiler memoization          | Medium | Test production builds early; `"use no memo"` escape hatch     |
| Mobile viewport constraints         | Medium | Skip cinematic on small viewports; recalculate margins         |

## Confidence Assessment

| Area         | Confidence  | Notes                                                      |
| ------------ | ----------- | ---------------------------------------------------------- |
| Stack        | HIGH        | All APIs verified from installed type definitions          |
| Features     | HIGH/MEDIUM | APIs support everything; timing tuning is subjective       |
| Architecture | HIGH        | Linear state machine, clear dependency graph               |
| Pitfalls     | HIGH        | 10 of 13 verified from codebase analysis + installed types |

**Overall:** HIGH

### Gaps

- **Timing values** -- Pan durations, dwell times, zoom levels need iterative tuning (define as data)
- **Mobile margins** -- 240px left + 100px right = 35px usable on 375px screen; need mobile-specific config
- **React Compiler** -- Potential memoization breakage; test prod builds early

---

_Research complete. Ready for requirements definition._
