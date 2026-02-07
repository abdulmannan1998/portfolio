# Feature Landscape: Cinematic Graph Improvements (v1.3)

**Domain:** Interactive career graph visualization with cinematic reveal, camera choreography, and premium interaction design
**Researched:** 2026-02-07
**Confidence:** HIGH for React Flow API capabilities (verified from installed @xyflow/react@12.10.0 and @xyflow/system@0.0.74 type definitions), MEDIUM for interaction design patterns (based on established UX principles and training knowledge)

## Executive Summary

This portfolio already has a functional interactive career graph with React Flow, Framer Motion, and Zustand. The current reveal is triggered by mouseEnter on the graph container, nodes appear via setTimeout sequences, and fitView handles camera globally. The v1.3 goal is to transform this from a "mechanical node spawning" experience into a **cinematic guided story** -- click the name node, watch the career unfold reverse-chronologically, with the camera following each new reveal.

The core challenge: React Flow's viewport API (`setCenter`, `fitView`, `fitBounds`) supports animated transitions with `duration` and custom `ease` functions (verified from type definitions), but orchestrating a multi-step sequence of "add node + pan camera + pause + repeat" requires careful timing coordination. Framer Motion v12.31.0's `useAnimate` with `AnimationSequence` can orchestrate the node-level animations, while React Flow's promise-based viewport methods (`setCenter` returns `Promise<boolean>`) enable async/await sequencing for camera movement.

**Current state:** Mouse-enter trigger, setTimeout cascades, fitView-only camera, hover-to-spawn achievements, floating soft-skill nodes
**Target state:** Click-to-trigger, async sequence orchestration, camera-follows-story, click-to-expand cards, badge-style skills, animated edges

---

## Table Stakes

Features that MUST work correctly for the graph to feel "cinematic" rather than "mechanical." Missing any of these makes the improvement feel half-done.

### 1. Click-to-Trigger Reveal (Replace Mouse-Enter)

**Why expected:** The current mouseEnter trigger fires accidentally when scrolling past the graph section. A cinematic experience must be intentional -- the user chooses to start it.
**Complexity:** Low
**Dependencies on existing:** Modify `handleGraphEnter` trigger in `graph-section.tsx`; update root node in `custom-node.tsx` to be the trigger point
**What exists now:** `onMouseEnter={handleGraphEnter}` on the graph container div (line 286 of graph-section.tsx); `startRevealSequence` function with setTimeout cascades
**Implementation approach:**

- Remove `onMouseEnter` from the container div
- Add `onClick` handler to the root ("Mannan Abdul") node
- Root node should have a visual "click me" affordance (pulse animation + subtle label like "Click to explore")
- After click, root node transitions from "inviting" state to "activated" state
- Store the trigger state in graph-store (already has `hasStartedReveal`)

**Confidence:** HIGH -- straightforward event handler change, existing state management supports it

### 2. Reverse-Chronological Narrative Ordering

**Why expected:** Career stories are told most impactfully from most recent (most impressive) to earliest. Recruiters care about your latest role first.
**Complexity:** Low
**Dependencies on existing:** Reorder the `startRevealSequence` function in `graph-section.tsx`; update `REVEAL_TIMING` in `layout-constants.ts`
**What exists now:** Reveal order is soft-skills -> Bilkent -> Layermark -> Intenseye (chronological). Timing constants define delays in ms.
**Implementation approach:**

- New order: Intenseye (most recent) -> Layermark -> Bilkent (education)
- Each step in the sequence: add node + edges -> camera pan -> pause -> next
- Keep soft skills for later or fold them into a different treatment (see badge feature below)

**Confidence:** HIGH -- reordering existing constants

### 3. Camera Follows Each New Node (setCenter Choreography)

**Why expected:** This IS the cinematic feel. Without camera following, nodes just appear at the edges of the viewport and the user has to manually find them. That is the antithesis of a guided experience.
**Complexity:** Medium
**Dependencies on existing:** React Flow `useReactFlow()` hook already used in `graph-section.tsx`; need to use `setCenter(x, y, { zoom, duration, ease })` instead of `fitView`
**What exists now:** `debouncedFitView()` called after node additions -- zooms to fit ALL nodes, not focusing on the new one
**Implementation approach (verified from installed types):**

The `setCenter` API signature (from `@xyflow/system@0.0.74`):

```typescript
type SetCenter = (
  x: number,
  y: number,
  options?: SetCenterOptions,
) => Promise<boolean>;
type SetCenterOptions = ViewportHelperFunctionOptions & { zoom?: number };
type ViewportHelperFunctionOptions = {
  duration?: number;
  ease?: (t: number) => number;
  interpolate?: "smooth" | "linear";
};
```

Sequence per node reveal:

1. Add node to state (`setNodes`)
2. Wait a tick for React Flow to measure the node
3. Get node position from the node data (already known from layout-calculator)
4. Call `reactFlowInstance.setCenter(nodeX, nodeY, { zoom: 0.9, duration: 800 })`
5. Wait for the promise to resolve (camera transition complete)
6. Add edges (`setEdges`) with a short delay for visual stagger
7. Pause (e.g. 600ms) to let the user absorb
8. Proceed to next node

Use `async/await` instead of nested `setTimeout` for the entire sequence. The promise-based API makes this natural.

Also available: `fitBounds(bounds, { padding, duration, ease })` -- useful for the final "zoom out to show everything" step at the end of the reveal.

**Confidence:** HIGH -- API signatures verified from installed type definitions; `setCenter` returns `Promise<boolean>` enabling clean async orchestration

### 4. Click-to-Expand Achievement Cards (Replace Hover-to-Spawn)

**Why expected:** Hover-to-spawn is fragile (accidental triggers, touch-device incompatible, no undo). Click-to-expand is the standard pattern for progressive disclosure in node-based UIs.
**Complexity:** Medium
**Dependencies on existing:** `achievement-node.tsx` already has click-to-expand with Framer Motion `layout` animation and expand/collapse variants; `graph-store.tsx` already has `expandNode/collapseNode/expandedNodes`
**What exists now:** Company nodes spawn achievement nodes on hover (`handleNodeHover`). Achievement nodes click-to-expand an inline card showing description, impact, and technologies.
**Implementation approach:**

- **Phase 1:** Achievement nodes are pre-placed (hidden or collapsed) in the graph from the start of the reveal sequence, instead of being spawned dynamically on hover
- **Phase 2:** Company node click (not hover) triggers the achievement nodes to become visible with staggered entrance animation
- **Phase 3:** Each achievement node can then be clicked for its expanded detail view (already implemented)
- This creates a two-level progressive disclosure: company click -> achievements appear -> achievement click -> detail card

Benefits:

- No more "spawn on hover" jank where nodes pop in unexpectedly
- Camera can pan to the achievement cluster after they appear
- Touch-device compatible
- User feels in control

**Confidence:** HIGH -- existing expand/collapse infrastructure handles this; main change is trigger mechanism

### 5. Polished Node Card Design (Typography, Borders, Shadows)

**Why expected:** The visual quality of node cards defines the premium feel. Current nodes are functional but minimal -- small text, thin borders, basic shadows.
**Complexity:** Medium
**Dependencies on existing:** `custom-node.tsx` renders all non-achievement nodes; `achievement-node.tsx` renders achievement cards
**What exists now:** Root node has orange gradient border + pulsing shadow; company/education nodes have colored borders with icons; soft-skill nodes are rounded pills
**Implementation approach:**

- **Root node:** Add a "call to action" state before click (pulsing glow + "Click to explore" label). After activation, transition to a "hub" appearance (still prominent but no longer calling for attention)
- **Company nodes:** Increase padding, improve typography hierarchy (title larger, period more visible, add role title from resume data). Consider adding company logo placeholder or emoji.
- **Education node:** Same treatment as company but with academic details
- **Achievement cards (collapsed):** Improve the 250x80 card -- category color stripe on left edge, clearer title/company hierarchy, impact metric visible at a glance
- **Achievement cards (expanded):** Already well-designed; minor polish on spacing and tech badge styling

Design principles aligned with DESIGN.md brutalist aesthetic:

- High contrast on dark backgrounds
- Bold typography for titles
- Orange accent for interactive/emphasis elements
- Subtle shadows suggesting depth without breaking flat design

**Confidence:** HIGH -- CSS/design changes within existing component structure

### 6. Animated Edge Connections (Gradient + Flow Effect)

**Why expected:** Static colored lines feel dead. In a cinematic reveal where nodes appear sequentially, edges should visually "connect" -- drawing from source to target, with an ongoing subtle animation suggesting data/energy flow.
**Complexity:** Medium-High
**Dependencies on existing:** Currently using `type: "smoothstep"` built-in edges with static `style` (stroke color, width, opacity). Need custom edge component.
**What exists now:** `getInitialEdges()` in `graph-utils.ts` creates edges with `type: "smoothstep"`, static stroke colors (blue/violet/orange/emerald), and fixed opacity

**Implementation approach (two levels):**

**Level 1 - Animated Drawing (table stakes):**
Custom edge component using `getSmoothStepPath` (exported by @xyflow/react) that:

- Renders an SVG `<path>` with a CSS `stroke-dasharray` + `stroke-dashoffset` animation
- When the edge first appears, it animates from 0% to 100% draw (the "connecting" effect)
- After drawing completes, stays as a solid line
- Uses React Flow's `EdgeProps` which provides `sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition`

```typescript
// Custom edge pseudocode
function AnimatedEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: props.sourceX, sourceY: props.sourceY,
    targetX: props.targetX, targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  return (
    <path d={edgePath}
      stroke={color}
      strokeWidth={2}
      fill="none"
      className="animate-edge-draw" // CSS: stroke-dashoffset animation
    />
  );
}
```

**Level 2 - Flowing Gradient (differentiator, see below):**
SVG `<linearGradient>` with `<animate>` tag to shift gradient position, or CSS animation on gradient stops. Creates a "data flowing through the pipe" feel.

**Confidence:** HIGH for Level 1 (CSS stroke-dasharray is well-established SVG technique); MEDIUM for Level 2 (SVG gradient animation requires careful cross-browser testing)

---

## Differentiators

Features that elevate this graph from "good interactive visualization" to "memorable cinematic portfolio piece." Not all need to be built, but each adds meaningfully to the premium feel.

### 1. Flowing Edge Particles/Gradient

**Value proposition:** Edges that feel alive -- subtle animation suggesting energy/data flowing from one node to the next. This is what separates a "graph diagram" from a "living story."
**Complexity:** Medium-High
**Dependencies:** Custom edge component from Table Stakes #6
**Implementation approach:**

Option A -- SVG Animated Gradient:

- Define `<linearGradient>` in SVG `<defs>` with two color stops (e.g., transparent -> edge color -> transparent)
- Use SVG `<animate>` element or CSS `@keyframes` to shift the gradient offset along the path
- Lightweight, pure SVG, no JS overhead per frame
- Looks like a "pulse" traveling along the edge

Option B -- Dot Particle on Path:

- Small circle element positioned using `getPointAtLength()` on the SVG path
- Animate the circle's position along the path using requestAnimationFrame
- More visually distinct but higher performance cost
- Best limited to 3-5 "active" edges at a time

Option C -- Dash Animation (simplest):

- `stroke-dasharray: 5 5` with animated `stroke-dashoffset`
- Creates a "marching ants" effect
- Very lightweight but less premium than gradient

**Recommendation:** Option A (animated gradient) -- best balance of visual impact and performance. Option C as fallback if SVG gradients cause issues.

**Confidence:** MEDIUM -- SVG gradient animation is well-established but cross-browser rendering of animated gradients on complex paths can vary. Needs testing.

### 2. Reveal Sequence with Zoom Choreography

**Value proposition:** Beyond just "camera follows node," the zoom level should change meaningfully during the reveal -- start zoomed in tight on the name, gradually zoom out as more nodes appear, ending with a dramatic pullback to show the full story.
**Complexity:** Medium
**Dependencies:** Camera choreography from Table Stakes #3
**Implementation approach:**

Sequence design:

1. **Opening:** Zoomed in on root node at zoom 1.2 -- intimate, personal
2. **First company (Intenseye):** Pan right/down, zoom stays at ~1.0 -- focused on this role
3. **Achievement reveal:** Slight zoom out to 0.85 to accommodate achievement cluster
4. **Second company (Layermark):** Pan left, zoom stays at ~0.85
5. **Education (Bilkent):** Pan to education area, zoom at 0.8
6. **Course sub-nodes:** Slight zoom out to 0.75
7. **Finale:** Smooth `fitView` with `duration: 1200` to show the complete career graph -- the "pulling back to see the full picture" moment
8. **After finale:** Enable user free-pan/zoom, disable camera control

Easing: Use a gentle ease-in-out for pans, slightly sharper ease-out for the final pullback. The `ease` parameter in `SetCenterOptions` accepts `(t: number) => number`, so custom cubic-bezier functions work:

```typescript
const cinematicEase = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic
```

**Confidence:** HIGH -- all APIs verified from type definitions; creative design of the sequence is the main effort

### 3. "Story Complete" State with Interaction Cue

**Value proposition:** After the cinematic reveal finishes, the graph should clearly communicate "now it's your turn to explore." Without this, users might think the graph is view-only.
**Complexity:** Low
**Dependencies:** Reveal sequence completion
**Implementation approach:**

- After the final fitView pullback, show a brief overlay or toast: "Click any node to explore details"
- Or: Achievement nodes get a subtle "breathing" pulse after reveal completes, inviting clicks
- Company nodes could show a small indicator (badge count) showing how many achievements are inside
- Root node transitions to a neutral "hub" state (stop pulsing CTA)

**Confidence:** HIGH -- standard UX pattern, no technical unknowns

### 4. Subtle Skill Badges (Replace Floating Soft-Skill Nodes)

**Value proposition:** Current soft-skill nodes (Problem-Solving, Collaboration, Quick-Learner) are full floating nodes with edges, taking up valuable graph real estate. As badges/labels on the root node or as floating labels without full node treatment, they become context rather than clutter.
**Complexity:** Low-Medium
**Dependencies:** Root node redesign, resume-data structure
**Implementation approach:**

Option A -- Badges on Root Node:

- Render skill labels as small emerald-colored badges below/around the root node
- Part of the root node's React component, not separate React Flow nodes
- No edges needed, no layout calculation needed
- Cleanest approach, reduces visual noise

Option B -- Floating Labels (no edges):

- Keep them as positioned elements near the root, but remove edges
- Style them as small label pills that orbit/float near the root
- Less connected to the root, but still present in the graph space

Option C -- Inline in Node Cards:

- Show relevant soft skills as badges inside company node cards
- "Collaboration" badge on Intenseye card, etc.
- Contextual but loses the "overview of skills" aspect

**Recommendation:** Option A -- badges directly on the root node. Eliminates 3 nodes + 3 edges from the graph, making the career story cleaner. The root node already needs redesign for the click-to-trigger feature.

**Confidence:** HIGH -- removing complexity, not adding it

### 5. Course Sub-Nodes Under Bilkent

**Value proposition:** The education section currently has 3 project achievements (NITO, RISK Game, Hospital DB) under Bilkent. Adding course nodes (Data Structures, Algorithms, etc.) provides academic depth for recruiters evaluating technical foundations.
**Complexity:** Low
**Dependencies:** `resume-data.ts` data additions, `layout-calculator.ts` positioning
**Implementation approach:**

- Add course entries to `resume-data.ts` (either as a new node type or as achievement-like nodes with `category: "course"`)
- New course node type: smaller than achievement nodes, showing just course name + possibly a relevant icon
- Position in a row or cluster below/beside the Bilkent node
- Reveal during the education phase of the cinematic sequence

**Data to add:**

- Relevant CS courses (based on typical Bilkent CS curriculum): Algorithms, Data Structures, Database Systems, Software Engineering, Operating Systems, etc.
- Keep it selective -- 4-6 courses max to avoid clutter

**Confidence:** HIGH -- follows existing patterns for achievement nodes

### 6. Edge Connection Drawing Animation During Reveal

**Value proposition:** When a node appears and its edge connects, the edge should visually "draw" from the source node to the new target node, not just appear fully formed. This is a key cinematic moment -- the story is literally being connected.
**Complexity:** Medium
**Dependencies:** Custom edge component, reveal sequence timing
**Implementation approach:**

- Custom edge component with `stroke-dasharray` set to the total path length
- Initial `stroke-dashoffset` equals path length (edge invisible)
- Animate `stroke-dashoffset` to 0 over 400-600ms (edge draws in)
- Use CSS animation triggered by a `data-drawing` attribute or CSS class
- Requires knowing the path length: `pathRef.current.getTotalLength()` in the custom edge's `useEffect`

Timing integration with reveal sequence:

1. Node appears (Framer Motion entrance: 400ms)
2. Short pause (200ms)
3. Edge draws in (500ms)
4. Camera begins panning to next position

**Confidence:** HIGH -- `stroke-dasharray`/`stroke-dashoffset` is a well-established SVG animation technique used across the web

### 7. Achievement Count Badge on Company Nodes

**Value proposition:** After the reveal, company nodes should hint at their hidden depth. A small badge showing "9 projects" or similar tells the recruiter there is more to discover.
**Complexity:** Low
**Dependencies:** Company node redesign
**Implementation approach:**

- Add a small counter badge to company node card (e.g., orange circle with number)
- Number derived from `achievementsByCompany` data in layout-calculator
- Badge pulses or has attention-drawing treatment after reveal completes
- Clicking the company node reveals the achievements (already planned)

**Confidence:** HIGH -- simple data-driven badge

---

## Anti-Features

Features to explicitly NOT build. Common overengineering traps in graph visualization projects.

### 1. 3D Graph / WebGL / Three.js Effects

**Why avoid:** Massively increases complexity, bundle size (three.js is 150KB+ gzipped), requires different rendering pipeline. React Flow is SVG/HTML-based. The brutalist portfolio aesthetic is 2D by nature.
**What to do instead:** Use subtle 2D depth cues -- shadows, z-index layering, opacity layers -- to create the illusion of depth without leaving the 2D plane.

### 2. Physics-Based Node Layout (d3-force, elkjs)

**Why avoid:** The career graph has a known, fixed structure. Physics simulation adds runtime computation, non-deterministic positioning, and jittery settling. The current manual layout in `layout-calculator.ts` gives precise control over positioning.
**What to do instead:** Keep the manual layout calculator. For the cinematic reveal, manually choreographed positions create a more intentional story than physics-driven placement.

### 3. User-Editable Graph (Drag Nodes to Reposition)

**Why avoid:** This is a portfolio presentation, not a graph editor. Allowing node dragging breaks the curated layout and creates a "so what?" moment. Users don't need to rearrange your career.
**What to do instead:** Disable node dragging (`draggable: false` on nodes). Keep pan/zoom for viewport exploration. Click-to-expand for information disclosure.

### 4. Real-Time Data Updates / WebSocket Connections

**Why avoid:** The career graph shows static resume data. There is nothing to update in real time. Adding dynamic data sources introduces complexity for zero user value.
**What to do instead:** Keep using `resume-data.ts` as single source of truth. Update the file when career changes happen.

### 5. Full Animation Timeline Editor / Keyframe UI

**Why avoid:** Over-engineering the reveal sequence configuration. The sequence is authored once and tweaked occasionally. A visual timeline editor would take weeks to build and save minutes of maintenance.
**What to do instead:** Define the sequence as a simple array of step objects in code:

```typescript
const REVEAL_SEQUENCE = [
  { nodeId: "Intenseye", delay: 0, cameraDuration: 800 },
  { nodeId: "Layermark", delay: 1200, cameraDuration: 800 },
  { nodeId: "Bilkent", delay: 2400, cameraDuration: 800 },
];
```

### 6. Particle System on Canvas Overlay

**Why avoid:** Canvas particle overlays (tsParticles, particles.js) add significant CPU load, fight with React Flow's own event handling, and create z-index/interaction conflicts. The "particles flowing along edges" effect can be achieved with SVG animation at a fraction of the cost.
**What to do instead:** Use SVG-based edge animations (gradient shift, dash animation) for the "alive" feel.

### 7. Sound Effects / Audio Narration

**Why avoid:** Autoplaying audio is hostile UX. Sound requires user consent, adds media loading, and is inappropriate for a developer portfolio typically viewed in office environments.
**What to do instead:** Let the visual choreography speak for itself. The camera movement and timed reveals create rhythm without sound.

### 8. Minimap with Live Updates During Reveal

**Why avoid:** React Flow's `<MiniMap>` component shows the full graph from the start, spoiling the cinematic reveal. If the user can see all nodes in the minimap before they appear in the main view, the storytelling effect is ruined.
**What to do instead:** Either hide the minimap entirely during reveal and show it after completion, or don't use minimap at all (the graph is small enough that fitView handles orientation).

### 9. Infinite Loop / Auto-Replay of Reveal Sequence

**Why avoid:** The reveal should happen once and then hand control to the user. Auto-replay forces the user to sit through the animation again, making the graph feel like a presentation slide rather than an interactive tool.
**What to do instead:** One-time reveal triggered by click. After reveal, full user control. Optionally: a small "replay" button in the corner for those who want to see it again.

### 10. Complex Multi-Path Edge Routing (orthogonal routing, avoiding overlaps)

**Why avoid:** The graph has a simple tree structure (root -> companies/education -> achievements). SmoothStep edges handle this well. Orthogonal routing algorithms (like those from elkjs) add significant computation for marginal visual improvement on a simple tree.
**What to do instead:** Keep SmoothStep edges. Use `pathOptions: { offset }` to fine-tune edge paths if they overlap. Manual adjustment of node positions in layout-calculator is more predictable than algorithmic routing.

---

## Feature Dependencies

```
Click-to-Trigger Reveal (TS-1)
  |
  +--> Reverse-Chronological Ordering (TS-2)
  |       |
  |       +--> Camera Follows Nodes (TS-3)
  |       |       |
  |       |       +--> Zoom Choreography (D-2)
  |       |       |       |
  |       |       |       +--> Story Complete State (D-3)
  |       |       |
  |       |       +--> Edge Drawing Animation (D-6)
  |       |
  |       +--> Click-to-Expand Achievements (TS-4)
  |               |
  |               +--> Achievement Count Badge (D-7)
  |
  +--> Polished Node Design (TS-5)
  |       |
  |       +--> Subtle Skill Badges (D-4)
  |
  +--> Animated Edge Connections (TS-6)
  |       |
  |       +--> Flowing Edge Effect (D-1)
  |
  +--> Course Sub-Nodes (D-5) [independent, can be done in any order]
```

**Critical path:** TS-1 -> TS-2 -> TS-3 -> D-2 -> D-3

This critical path builds the cinematic reveal experience sequentially. Each step depends on the previous one being functional.

**Independent work streams:**

- TS-5 (polished node design) + D-4 (skill badges) can be done in parallel with the reveal sequence
- TS-6 (animated edges) + D-1 (flowing effect) can be done in parallel
- D-5 (course sub-nodes) is fully independent

---

## Technical API Reference (Verified)

Key APIs from the installed packages, verified from type definition files.

### React Flow Viewport Control (@xyflow/react@12.10.0, @xyflow/system@0.0.74)

| Method           | Signature                                                                            | Use                                |
| ---------------- | ------------------------------------------------------------------------------------ | ---------------------------------- |
| `setCenter`      | `(x, y, { zoom?, duration?, ease?, interpolate? }) => Promise<boolean>`              | Pan camera to specific coordinates |
| `fitView`        | `({ padding?, nodes?, minZoom?, maxZoom?, duration?, ease?, interpolate? }) => void` | Fit viewport to nodes              |
| `fitBounds`      | `(bounds: Rect, { padding?, duration?, ease? }) => Promise<boolean>`                 | Fit viewport to rectangle          |
| `setViewport`    | `({ x, y, zoom }, { duration?, ease? }) => Promise<boolean>`                         | Set exact viewport state           |
| `getNode`        | `(id: string) => Node \| undefined`                                                  | Look up node by ID                 |
| `getNodesBounds` | `(nodes: (Node \| string)[]) => Rect`                                                | Get bounding box of nodes          |
| `updateNode`     | `(id, update, { replace? }) => void`                                                 | Update a single node               |
| `updateNodeData` | `(id, dataUpdate, { replace? }) => void`                                             | Update node data only              |

All viewport methods that accept `duration` return `Promise<boolean>`, enabling clean async orchestration:

```typescript
await reactFlow.setCenter(nodeX, nodeY, { zoom: 1.0, duration: 800 });
// Camera transition is complete, proceed to next step
```

### Framer Motion Sequence Control (framer-motion@12.31.0)

| API                 | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `useAnimate()`      | Returns `[scope, animate]` for imperative animation control |
| `AnimationSequence` | Array of animation segments for sequential execution        |
| `animate(sequence)` | Execute animation sequence, returns playback controls       |
| `stagger(delay)`    | Create staggered timing for array of elements               |

### React Flow Custom Edges (@xyflow/react@12.10.0)

| Export              | Purpose                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| `BaseEdge`          | Base component for custom edges (handles interaction area + labels)             |
| `getSmoothStepPath` | Calculate SVG path for smooth step edges                                        |
| `getBezierPath`     | Calculate SVG path for bezier edges                                             |
| `EdgeProps`         | Type for custom edge component props (sourceX, sourceY, targetX, targetY, etc.) |
| `EdgeLabelRenderer` | Portal renderer for edge labels positioned in flow space                        |

Custom edge components receive full position data and can render arbitrary SVG, enabling stroke-dasharray animations, gradient fills, and particle effects.

---

## MVP Recommendation

**Phase 1 -- Core Cinematic Reveal (highest priority):**

1. Click-to-trigger on root node (TS-1)
2. Reverse-chronological ordering (TS-2)
3. Camera follows each node with setCenter (TS-3)
4. Company click reveals achievements (TS-4 -- trigger change only)
5. Polished node card design (TS-5)

**Phase 2 -- Edge Polish + Skill Treatment:** 6. Custom animated edge component with draw-in effect (TS-6 + D-6) 7. Subtle skill badges replacing floating nodes (D-4) 8. Achievement count badges on company nodes (D-7)

**Phase 3 -- Cinematic Polish:** 9. Zoom choreography across the full reveal (D-2) 10. Story-complete state with interaction cue (D-3) 11. Flowing edge gradient animation (D-1)

**Phase 4 -- Content Expansion:** 12. Course sub-nodes under Bilkent (D-5)

**Defer to post-v1.3:**

- Advanced particle effects on edges (complex, marginal value)
- Any 3D/WebGL effects
- Minimap integration

---

## Risk Assessment

| Feature                    | Risk Level  | Primary Risk                                                                      | Mitigation                                                                   |
| -------------------------- | ----------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Click-to-trigger           | Low         | None significant                                                                  | Straightforward event change                                                 |
| Camera choreography        | Medium      | Timing coordination between React Flow viewport and Framer Motion node animations | Use async/await with React Flow's Promise-based API; test timing extensively |
| Custom animated edges      | Medium      | SVG path length calculation timing, cross-browser rendering of animated gradients | Fallback to simple dash animation; test on Safari/Firefox/Chrome             |
| Skill badge redesign       | Low         | Layout shift when removing 3 nodes + 3 edges                                      | Adjust safe area calculations in layout-calculator                           |
| Achievement trigger change | Low         | Existing expand/collapse logic is solid                                           | Minimal refactor of trigger mechanism                                        |
| Course sub-nodes           | Low         | Data addition only                                                                | Follow existing achievement pattern                                          |
| Zoom choreography          | Medium      | Finding the right zoom levels and durations requires iteration                    | Define sequence as data (array of steps), easy to tune                       |
| Flowing edge gradient      | Medium-High | SVG gradient animation performance with multiple simultaneous edges               | Limit animated gradient to "active" edges only (2-3 at a time)               |

---

## Confidence Assessment

| Area                            | Confidence | Reasoning                                                                                                                                                                          |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Flow camera API           | HIGH       | Verified from installed @xyflow/system@0.0.74 type definitions: `setCenter`, `fitView`, `fitBounds` all support `duration` and `ease`, return `Promise<boolean>`                   |
| Framer Motion orchestration     | HIGH       | Verified `useAnimate` and `AnimationSequence` exports from framer-motion@12.31.0 type definitions                                                                                  |
| Custom edge components          | HIGH       | Verified `BaseEdge`, `EdgeProps`, `getSmoothStepPath` exports; custom edge rendering is a documented React Flow pattern                                                            |
| SVG stroke animation            | HIGH       | `stroke-dasharray`/`stroke-dashoffset` animation is a well-established web standard                                                                                                |
| SVG gradient animation on edges | MEDIUM     | Technique is sound but performance with many concurrent animated gradients on complex paths needs real-device testing                                                              |
| Interaction design patterns     | MEDIUM     | Based on established UX principles (progressive disclosure, guided reveal, intentional triggering) and training knowledge; not verified against specific 2026 portfolio benchmarks |
| Reveal sequence timing          | MEDIUM     | The "right" timing (duration, pauses, zoom levels) is subjective and requires iteration; the API supports it, but the creative tuning is trial-and-error                           |

**Overall confidence:** HIGH for technical feasibility, MEDIUM for creative execution (timing, visual polish). The APIs support everything described; the challenge is tuning the sequence to feel cinematic rather than mechanical.

---

## Sources

**Primary (verified from installed packages):**

- `@xyflow/react@12.10.0` type definitions at `/node_modules/@xyflow/react/dist/esm/`
- `@xyflow/system@0.0.74` type definitions at `/node_modules/.pnpm/@xyflow+system@0.0.74/`
- `framer-motion@12.31.0` type definitions
- Existing codebase: `graph-section.tsx`, `custom-node.tsx`, `achievement-node.tsx`, `graph-utils.ts`, `layout-calculator.ts`, `layout-constants.ts`, `graph-store.tsx`, `resume-data.ts`

**Design context:**

- `DESIGN.md` -- brutalist aesthetic guidelines, color palette, typography rules
- `PROJECT.md` -- v1.3 target features, existing decisions, constraints

**Training knowledge (MEDIUM confidence, not independently verified for 2026):**

- SVG stroke-dasharray/dashoffset animation patterns
- Progressive disclosure UX patterns for node-based UIs
- Camera choreography techniques in data visualization
- Cinematic reveal timing principles (film editing rhythm)
