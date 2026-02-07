# Domain Pitfalls: Cinematic Graph Reveal & Edge Animations

**Domain:** React Flow cinematic animations, camera control, edge effects
**Researched:** 2026-02-07
**Context:** Existing React Flow v12.10.0 graph with Framer Motion v12.31.0 nodes, Zustand state, timer-based reveal, debounced fitView, ~23 nodes, ~22 edges

---

## Critical Pitfalls

Mistakes that cause broken animations, janky camera, or require rearchitecting the reveal system.

### Pitfall 1: fitView Prop and Programmatic setCenter/setViewport Fighting for Viewport Control

**What goes wrong:** The existing `<ReactFlow fitView fitViewOptions={...} />` prop (graph-section.tsx line 294-300) runs fitView on every node/edge change. When you add programmatic camera panning via `setCenter()` or `setViewport()` to follow nodes during reveal, the `fitView` prop immediately overrides your camera position, snapping the viewport back to "fit all nodes." The camera appears to jank or rubber-band between your intended position and the auto-fit position.

**Why it happens:** React Flow's `fitView` prop is declarative -- it tells the library "always fit to all visible nodes." It triggers on node additions, removals, and dimension changes. The existing code also calls `debouncedFitView()` manually after reveal steps (lines 137, 208, 254). Both the prop AND the manual calls will interrupt any ongoing programmatic camera animation.

**Specific conflict in current codebase:**

- `fitView` prop (line 294) fires on every `setNodes` call
- `debouncedFitView()` called after achievement reveal (line 137) and after timeline nodes (line 208)
- Both use 800ms duration transitions via d3-zoom internally
- If you call `setCenter(nodeX, nodeY, { duration: 600 })` during reveal, the debounced fitView fires 150ms later and overrides it

**Consequences:**

- Camera snaps to "all nodes" view instead of staying focused on newly revealed node
- Viewport jitters as d3-zoom transitions compete (two transitions running on same d3-selection)
- On mobile, the jank is especially noticeable because viewport is smaller and zoom changes are more dramatic

**Prevention:**

1. **Remove the `fitView` prop entirely.** Replace with manual `fitView()` calls only at specific moments (initial render, final reveal completion). Use `setCenter()` or `fitBounds()` for mid-sequence camera control.
2. **Remove ALL debouncedFitView calls during reveal sequence.** Replace with targeted `setCenter(x, y, { duration, zoom })` that focuses on the specific node being revealed.
3. **Use React Flow's `setCenter()` with the Promise return** -- it returns `Promise<boolean>`, so you can chain camera movements: `await setCenter(x1, y1, { duration: 500 }); await setCenter(x2, y2, { duration: 500 });`
4. **Only call fitView once at the end** of the complete reveal sequence to show the full graph.

**Warning signs:**

- Camera snaps to a wide view immediately after you programmatically zoom to a node
- Two d3 transitions run simultaneously (visible as stuttering/oscillation)
- The viewport "bounces" during reveal

**Phase recommendation:** Must be the FIRST thing addressed. Remove fitView prop before adding any camera animation.

**Confidence:** HIGH -- verified from React Flow v12.10.0 types: `fitView` prop triggers on node changes; `setCenter`, `setViewport`, `fitBounds` all return `Promise<boolean>` and accept `{ duration, ease }` options.

---

### Pitfall 2: Framer Motion `layout` Prop Triggering React Flow Edge Recalculation Storm

**What goes wrong:** The AchievementNode (achievement-node.tsx line 66) uses `<motion.div layout>` for its expand/collapse animation. When `layout` is true, Framer Motion measures the element's bounding box before and after state changes, then animates between them using FLIP (First, Last, Invert, Play). This changes the node's actual DOM dimensions mid-animation. React Flow watches node dimensions (via ResizeObserver internally) to recalculate edge paths. Every frame of the Framer Motion layout animation triggers React Flow's edge path recalculation, causing:

- Edges flicker as their path recalculates 60 times per second during expand
- React Flow fires onNodesChange rapidly, triggering re-renders
- If animated edges (gradients, particles) are running, they restart on every edge recalculation

**Why it happens:** React Flow v12 uses InternalNode with measured dimensions. When Framer Motion's `layout` animates width from 250px to 400px over 300ms, React Flow detects ~18 dimension changes (60fps \* 0.3s) and recalculates all edge paths connected to that node each time.

**Current codebase evidence:**

- `achievement-node.tsx` line 66: `<motion.div layout ...>`
- `EXPAND_COLLAPSE_VARIANTS` line 16: `{ collapsed: { width: 250, height: 80 }, expanded: { width: 400, height: "auto", minHeight: 300 } }`
- The comment on line 68 says "use only opacity/scale to avoid edge path calculation issues" -- this is ALREADY a known issue, but `layout` is still enabled

**Consequences:**

- Edge animations (particles, gradients) restart every frame during node expand
- Performance drops noticeably during expand/collapse (especially with 10+ achievement nodes visible)
- SVG gradient `<defs>` elements get recreated on each edge recalculation, causing visual flicker

**Prevention:**

1. **Replace `layout` with `animate` variants that use `transform: scale()` for the expand effect.** Scale transforms don't change the DOM bounding box, so React Flow doesn't recalculate. The tradeoff: text inside will be scaled (blurry), so you need a two-phase approach -- scale up, then switch to actual dimensions.
2. **Alternative: Use `layout="position"` instead of `layout`.** This tells Framer Motion to only animate position changes, not size changes. Combine with a CSS transition on width/height instead.
3. **Disconnect edge recalculation during animation** by temporarily hiding edges connected to the animating node (`setEdges` to remove, then re-add after animation completes).
4. **Best approach: Animate with `width`/`height` CSS transitions** on the inner content div, NOT via Framer Motion `layout`. Keep the outer node container at a fixed size, and let the inner content expand within it (overflow: visible). React Flow only watches the outer container dimensions.

**Warning signs:**

- Open DevTools Performance tab -- hundreds of "recalculate edge" events during expand
- Edges visually stutter or flash during node expand/collapse
- Edge particle animations reset to starting position during expand

**Phase recommendation:** Address when implementing edge animations. If edges are static (current state), this pitfall is cosmetic. Once edges have animations/particles, it becomes critical.

**Confidence:** HIGH -- the existing code comment (line 68) confirms this was already encountered. The `layout` prop is still present and will compound with edge animations.

---

### Pitfall 3: setTimeout Chain Reveal Becomes Unrecoverable After User Interruption

**What goes wrong:** The current reveal uses chained `setTimeout` calls (graph-section.tsx lines 184-209) with hardcoded delays. This is a fire-and-forget system. If the user scrolls away mid-reveal, navigates, resizes the window, or clicks a node during reveal, the timeouts continue firing. Nodes appear in the wrong order, camera targets nodes that are off-screen, and the state becomes inconsistent.

**Why it happens:** `setTimeout` chains have no awareness of:

- Whether the component is still mounted (the cleanup in line 267-269 helps, but only on full unmount)
- Whether a previous animation completed (next step fires regardless)
- Whether the user interacted (click on a company node during reveal starts a SECOND parallel reveal sequence for achievements, overlapping with the main reveal)
- Whether a camera animation is in progress (new `setCenter` call interrupts ongoing one)

**Current timing chain:**

```
t=0:     soft skill nodes (3x, 200ms stagger)
t=1200:  Bilkent (education)
t=1700:  Layermark (company)
t=2200:  Intenseye (company)
t=2700:  fitView
```

This 2.7-second sequence has no pause, skip, or recovery mechanism.

**Consequences:**

- User hovers Layermark at t=1800 (before Intenseye reveals) -- achievement reveal interleaves with main reveal, camera fights between two targets
- User resizes window at t=1500 -- the ResizeObserver fires `debouncedFitView` while reveal is still adding nodes, causing layout recalculation mid-sequence
- Fast scroll past graph -- timeouts fire but nodes are added to a section the user can't see, wasting CPU
- The `hasStartedReveal` flag (line 180) prevents restart but doesn't prevent interruption

**Prevention:**

1. **Replace setTimeout chain with a state machine.** Define states: `idle`, `revealing-skills`, `revealing-education`, `revealing-companies`, `complete`. Each state transition triggers the next animation. If interrupted (user click, resize), the machine can pause, skip, or gracefully recover.
2. **Use an async generator or async/await chain** instead of nested timeouts:
   ```typescript
   async function revealSequence() {
     await revealSoftSkills();
     await panToEducation();
     await revealNode("Bilkent");
     // ... etc
   }
   ```
   This is cancellable via AbortController and awaits completion of each step.
3. **Lock user interaction during reveal** (disable hover-to-expand on company nodes until reveal completes). This prevents the parallel reveal sequence conflict.
4. **Make reveal sequence skippable** -- if user clicks, fast-forward to complete state (add all nodes instantly, fitView).

**Warning signs:**

- Two camera animations running simultaneously (viewport oscillates between two targets)
- Achievement nodes appear before their parent company node has finished revealing
- Console logs show setNodes being called from multiple setTimeout callbacks in rapid succession

**Phase recommendation:** Must be replaced BEFORE implementing camera animation. Camera animation makes the timing issues catastrophically worse because each step now involves a 500-1000ms viewport transition that can be interrupted.

**Confidence:** HIGH -- directly observed in codebase. The `timersRef` cleanup (line 267) only fires on unmount, not on interruption.

---

### Pitfall 4: SVG Edge Animations (Particles/Gradients) Killing Performance on 22+ Edges

**What goes wrong:** Adding animated SVG effects to edges -- moving particles (`<circle>` with `<animateMotion>`), animated gradients (`<linearGradient>` with animated `offset`), or glowing effects (`<feGaussianBlur>` filters) -- on all 22 edges simultaneously causes significant frame drops. Each animated SVG element triggers independent repaints in the browser's SVG rendering pipeline.

**Why it happens:**

- SVG animations are NOT composited on the GPU by default. Each `<animateMotion>` or CSS animation on an SVG path triggers a main-thread repaint.
- SVG `<filter>` elements (blur, glow) are extremely expensive -- `<feGaussianBlur>` rerenders on every frame.
- React Flow renders ALL edges in a single SVG container (`<svg class="react-flow__edges">`). Animating any edge triggers repaint of the entire SVG layer.
- With 22 edges, that's 22 simultaneous SVG animations, each causing repaints.

**Scale of the problem in this codebase:**

- 6 structural edges (career, education, soft-skill) -- always visible after reveal
- ~16 project edges (appear on hover) -- up to 10 visible simultaneously after hovering Intenseye
- If all are animated: 16-22 concurrent SVG animations

**Consequences:**

- Frame rate drops below 30fps on mid-range mobile devices
- Scrolling becomes janky because SVG repaints block main thread
- Battery drain on mobile (constant GPU/CPU activity for decorative animations)
- Framer Motion node animations (hover effects, floating soft skills) become choppy because main thread is saturated

**Prevention:**

1. **Tier the animation intensity:**
   - Career/education edges (6): Full animation (gradients, particles) -- these are always visible and structurally important
   - Project edges (16): Subtle animation only (opacity pulse, dash-offset) -- these appear on hover and are secondary
   - Soft-skill edges (3): Static or very subtle -- decorative only
2. **Use CSS animations on SVG, not SMIL (`<animate>`) or JS.** CSS `stroke-dashoffset` animation with `will-change: stroke-dashoffset` gets composited on GPU:
   ```css
   .animated-edge path {
     stroke-dasharray: 5 5;
     animation: dash-flow 1s linear infinite;
     will-change: stroke-dashoffset;
   }
   @keyframes dash-flow {
     to {
       stroke-dashoffset: -10;
     }
   }
   ```
3. **Avoid SVG filters entirely.** Replace `<feGaussianBlur>` glow effects with `box-shadow` on a positioned HTML overlay, or use a CSS `filter: blur()` on a pseudo-element (GPU-composited).
4. **Animate only visible edges.** Use IntersectionObserver or React Flow's viewport bounds to disable animation on edges outside the current viewport.
5. **For particle effects: Use a single Canvas overlay** instead of individual SVG `<circle>` elements. One canvas with 22 particles is vastly cheaper than 22 SVG circles with individual animations.

**Warning signs:**

- Open DevTools Performance tab -- look for "Paint" events > 10ms per frame
- Frame rate drops when scrolling near the graph section
- Mobile users report heat/battery drain
- Lighthouse Performance score drops > 10 points after adding edge animations

**Phase recommendation:** Implement edge animations in a dedicated phase AFTER the reveal/camera system works. Start with CSS dash-offset (cheapest), measure performance, then add gradient/particles only if budget allows.

**Confidence:** HIGH -- SVG animation performance is well-documented. The edge count (22) is moderate but the combination with Framer Motion node animations on the same page creates compounding cost.

---

## Moderate Pitfalls

Mistakes that cause visual glitches, technical debt, or suboptimal UX.

### Pitfall 5: d3-zoom Transition Easing Mismatch With Framer Motion Easing

**What goes wrong:** React Flow uses d3-zoom for viewport transitions (`setCenter`, `setViewport`, `fitView` with `duration`). The `ease` parameter accepts a `(t: number) => number` function. Framer Motion uses its own easing system (spring physics, cubic-bezier arrays, named easings like "easeOut"). When the camera pans with d3-zoom's default easing while nodes animate in with Framer Motion's spring/cubic-bezier, the motions feel disconnected -- the camera arrives at a node before the node finishes its entrance animation, or the node pops in while the camera is still traveling.

**Why it happens:**

- d3-zoom default easing: `d3.easeCubicInOut` (symmetric S-curve)
- Framer Motion spring: Overdamped physics sim (overshoots, settles)
- Framer Motion cubic-bezier: Custom curves like `[0.34, 1.56, 0.64, 1]` (current hero-entrance, line 45)
- These have fundamentally different timing characteristics -- d3 is time-based (always exactly X ms), Framer Motion springs are physics-based (duration varies with stiffness/damping)

**Current mismatch evidence:**

- `fitView` uses 800ms d3 transition (line 48)
- Node entrance uses Framer Motion with custom easings: `[0.34, 1.56, 0.64, 1]` for hero, `[0.25, 0.46, 0.45, 0.94]` for slide-up (lines 45-56)
- Achievement expand uses spring: `{ stiffness: 300, damping: 30 }` (line 79)

**Consequences:**

- Camera pans to a node position, but the node hasn't appeared yet (camera arrives early)
- Node pops in with spring overshoot while camera is still sliding (feels disconnected)
- The "cinematic" feel is broken because camera and content aren't synchronized

**Prevention:**

1. **Match easing curves between camera and node animations.** Pass a custom `ease` function to `setCenter()` that matches the Framer Motion curve:
   ```typescript
   const cubicBezier = (p1x, p1y, p2x, p2y) => {
     // Convert cubic-bezier to (t) => number for d3
     // Use a library like bezier-easing
   };
   await setCenter(x, y, {
     duration: 600,
     ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
   });
   ```
2. **Use a consistent easing library** for both camera and node animations. The `bezier-easing` npm package creates functions compatible with both d3 and Framer Motion.
3. **Sequence, don't overlap.** Move camera first (300ms), THEN animate node in (300ms). This avoids the synchronization problem entirely and creates a natural "look here, now see this" cinematic feel.
4. **Use `interpolate: 'smooth'`** in ViewportHelperFunctionOptions (available in React Flow v12) for built-in smooth interpolation.

**Warning signs:**

- Camera arrives at a position where no node is visible yet
- Node appears and "catches up" to the camera position
- The overall sequence feels like a slideshow, not a smooth cinematic reveal

**Phase recommendation:** Address during camera animation implementation. This is about polish, not functionality.

**Confidence:** HIGH -- verified from @xyflow/system types that `ViewportHelperFunctionOptions` accepts `ease?: (t: number) => number` and `interpolate?: 'smooth' | 'linear'`.

---

### Pitfall 6: Mobile/Responsive Cinematic Sequence Breaks at Small Viewports

**What goes wrong:** The graph container is 500px tall on mobile (`h-[500px]`) vs 700px on desktop (`md:h-[700px]`) (graph-section.tsx line 284). The node layout uses absolute pixel positions calculated from `calculateSafeArea()` (layout-calculator.ts). At 375px width, the safe area becomes extremely constrained. Camera panning to individual nodes requires high zoom levels where text overflows, nodes overlap, and edges cross confusingly. The "cinematic" experience degrades to a claustrophobic, jerky sequence.

**Why it happens:**

- Node positions are calculated with margins: leftMargin=240px, rightMargin=100px (layout-constants.ts lines 16-18). On a 375px screen, safe area width = 375 - 240 - 100 = 35px. This is unusable.
- `companySpacing` in layout-calculator.ts line 196: `Math.min(spacing.horizontal * 3.5, 800)` -- on small viewports, this collapses to near zero
- `setCenter(x, y, { zoom: 1.2 })` on a 375px-wide container clips most of the node
- Touch interactions (pinch-to-zoom, swipe) conflict with cinematic camera control

**Current state:** The graph currently works on mobile because `fitView` with `minZoom: 0.65` zooms out enough to show everything. But focused camera panning (zoom into individual nodes) will break this.

**Consequences:**

- On mobile, camera pans reveal nodes that are too small to read
- Zooming into a node clips its neighbors, losing context
- Touch events (pinch zoom) interrupt the camera animation
- Achievement node expand (250px to 400px) extends beyond viewport on mobile

**Prevention:**

1. **Skip cinematic camera panning on mobile.** Detect viewport width and fall back to the current fitView-based behavior. Reserve cinematic reveal for `min-width: 1024px`.
2. **Recalculate safe area margins for mobile.** The current 240px left margin and 100px right margin are desktop-appropriate. Mobile should use 20px margins:
   ```typescript
   const isMobile = viewport.width < 768;
   const leftMargin = isMobile ? 20 : 240;
   const rightMargin = isMobile ? 20 : 100;
   ```
3. **Disable user zoom/pan during cinematic reveal** on mobile to prevent conflicts:
   ```tsx
   <ReactFlow
     zoomOnScroll={!isRevealing}
     panOnDrag={!isRevealing}
     zoomOnPinch={!isRevealing}
   />
   ```
4. **Use a different layout algorithm for mobile** -- vertical stack instead of horizontal spread, which naturally fits narrow viewports.

**Warning signs:**

- Graph appears as tiny unreadable dots on mobile
- Camera pans to a position where the target node is off-screen
- Touch interactions feel broken during reveal
- Achievement nodes extend beyond the container on expand

**Phase recommendation:** Address mobile AFTER desktop cinematic is working. Design the responsive degradation strategy before implementation. The existing `useResponsiveLayout` hook (hooks/use-responsive-layout.ts) provides breakpoint detection.

**Confidence:** HIGH -- verified from layout-constants.ts that margins are hardcoded at 240px/100px, and from graph-section.tsx that container is 500px tall on mobile. Math confirms 35px usable width on 375px screens with current margins.

---

### Pitfall 7: Zustand Store Complexity Explosion With Reveal State Machine

**What goes wrong:** The current Zustand store (graph-store.tsx) has 7 state fields and 5 actions -- simple and manageable. Adding a state machine for cinematic reveal requires: current state (`idle`/`revealing-skills`/`panning-to-education`/etc.), queue of pending transitions, camera target position, animation completion callbacks, user interaction lock, and skip/fast-forward state. This easily triples the store size and introduces race conditions between state transitions.

**Why it happens:**

- State machines need transition guards ("can I move from state A to state B?")
- Camera animations are async (Promise-based in React Flow) but Zustand is synchronous
- Multiple consumers read the store: graph-section.tsx (reveal), custom-node.tsx (animations), achievement-node.tsx (expand/collapse)
- A state update from achievement-node.tsx (expand) can conflict with a reveal transition in progress

**Current store state:**

```typescript
{
  expandedNodes: string[];       // UI state
  hasStartedReveal: boolean;     // Simple flag
  revealedCompanies: string[];   // Tracking
}
```

**Required state machine state (estimated):**

```typescript
{
  expandedNodes: string[];
  revealPhase: 'idle' | 'soft-skills' | 'education' | 'layermark' | 'intenseye' | 'complete';
  cameraTarget: { x: number; y: number; zoom: number } | null;
  isAnimating: boolean;           // Camera animation in progress
  interactionLocked: boolean;     // Prevent user interaction during reveal
  revealedCompanies: string[];
  revealQueue: RevealStep[];      // Pending steps
  skipRequested: boolean;         // User wants to skip ahead
}
```

**Consequences:**

- Store becomes the most complex file in the codebase
- Bugs from stale closures: setTimeout callbacks read old state, trigger wrong transitions
- Race condition: user clicks "skip" while camera is mid-animation -- what state should we be in?
- Multiple components subscribing to many fields causes unnecessary re-renders

**Prevention:**

1. **Use XState or a dedicated state machine library** instead of raw Zustand for the reveal state machine. Zustand is for reactive state, not state machines. XState handles transitions, guards, and async effects natively.
2. **If staying with Zustand: Separate stores.** Keep the existing `useGraphStore` for UI state (expandedNodes). Create a new `useRevealStore` for reveal machine state. This prevents cross-contamination.
3. **Use Zustand selectors aggressively** to prevent re-render cascading:
   ```typescript
   // Bad: subscribes to entire store
   const store = useGraphStore();
   // Good: subscribes to single field
   const revealPhase = useGraphStore((state) => state.revealPhase);
   ```
4. **Keep async logic OUTSIDE the store.** The reveal sequence orchestrator should be a custom hook or utility function that reads/writes the store, not an action inside the store. This keeps the store synchronous and predictable.

**Warning signs:**

- Store file grows beyond 100 lines
- Actions that call other actions (cascading updates)
- `useGraphStore.getState()` called inside setTimeout callbacks (stale closure risk)
- Multiple `set()` calls in a single action (batching issues)

**Phase recommendation:** Decide architecture (XState vs separate Zustand stores vs hook-based orchestration) BEFORE implementing the reveal sequence. This is a structural decision that affects all subsequent phases.

**Confidence:** MEDIUM -- the complexity estimate is based on the feature requirements. The actual complexity depends on how many reveal states are needed and whether XState or Zustand is used.

---

### Pitfall 8: Custom Edge Components Re-mount on Every Edge Array Update

**What goes wrong:** The current code uses `setEdges((prev) => [...prev, ...newEdges])` to add edges during reveal (graph-section.tsx lines 130-136, 166-169). When React Flow receives a new edges array, it diffs and re-renders changed edges. If custom edge components (with animated gradients, particles) are used, React may unmount and remount edge components when the array reference changes, resetting animation state. An edge that was mid-particle-animation suddenly restarts from the beginning.

**Why it happens:**

- React Flow uses edge `id` for reconciliation, but if the edge component is a function that creates new JSX each render, React may not preserve instance state
- `setEdges((prev) => [...prev, ...newEdges])` creates a new array every time, triggering React reconciliation
- Custom edge components with internal `useState` (for animation progress) or `useRef` (for requestAnimationFrame) lose state on remount
- The reveal sequence adds edges in batches (soft-skills first, then career, then project), each batch triggering a full edges re-render

**Consequences:**

- Edge particle animations visibly reset (jump back to start) whenever new edges are added
- Gradient animations flicker during reveal as edges remount
- Performance degrades because remounting re-initializes SVG elements, animation timers, and React state

**Prevention:**

1. **Use stable edge IDs** (already done: `edge-${index}`) and ensure custom edge components are properly memoized with `React.memo()`.
2. **Avoid internal state in custom edge components.** Use CSS animations (which survive React remounts) instead of JS-driven animation state. CSS `stroke-dashoffset` animation continues even if the React component re-renders, as long as the DOM element is preserved.
3. **Use `onEdgesChange` middleware** to detect additions vs updates, and only animate newly added edges:
   ```typescript
   // Mark new edges with a "justAdded" flag
   setEdges((prev) => [
     ...prev,
     ...newEdges.map((e) => ({ ...e, data: { ...e.data, justAdded: true } })),
   ]);
   ```
4. **Add edges all at once** instead of in batches if possible. This reduces the number of reconciliation cycles.

**Warning signs:**

- Particle animations visibly restart when a new node is revealed (because new edges get added for that node)
- Console shows component mount/unmount logs for edge components during reveal
- Edge animations are smooth only when no nodes are being added

**Phase recommendation:** Address during edge animation implementation. Test by adding a `console.log` in edge component lifecycle to verify edges aren't remounting.

**Confidence:** MEDIUM -- depends on implementation details of custom edge components. If edges use only CSS animations (not React state), this is less of an issue.

---

### Pitfall 9: React 19 + React Compiler + Framer Motion Memoization Breakage

**What goes wrong:** The project uses `babel-plugin-react-compiler` (devDependencies in package.json, line 39). React Compiler automatically memoizes components and hooks. Framer Motion relies on specific re-render patterns and ref mutations that the compiler may over-optimize. A component that should re-render on animation state change (e.g., `isExpanded` toggling from the Zustand store) may be skipped by the compiler's memoization, causing animations to not trigger.

**Why it happens:**

- React Compiler analyzes component dependencies and adds automatic `useMemo`/`useCallback` wrapping
- Framer Motion's `animate` prop accepts object literals that change identity every render -- the compiler may memoize these, preventing Framer Motion from detecting the change
- Zustand selectors return stable references for primitive values, but the compiler may further optimize the subscription
- The existing pattern of `useGraphStore((state) => state.expandedNodes)` returns an array -- compiler may compare by reference and skip re-renders even when array contents change

**Specific risk in current codebase:**

- `achievement-node.tsx` line 47: `const { expandedNodes, expandNode, collapseNode } = useGraphStore()` -- destructuring the entire store may be "optimized" by the compiler to only subscribe to used fields
- `custom-node.tsx` line 136: `animate={{ ...variants.animate, scale: [1, 1.05, 1], boxShadow: [...] }}` -- this object literal changes identity every render, which is how Framer Motion detects it should animate. Compiler may memoize it.

**Consequences:**

- Node entrance animations don't play (Framer Motion doesn't see prop change)
- Expand/collapse doesn't trigger visual change (component skips re-render)
- Intermittent: works in dev mode (compiler less aggressive) but breaks in production build

**Prevention:**

1. **Test with and without React Compiler.** Add `"use no memo"` directive to Framer Motion components if compiler causes issues:
   ```typescript
   // At top of component file
   "use no memo";
   ```
2. **Avoid inline object literals for `animate` props.** Use refs or state to hold animation values, which the compiler can track correctly.
3. **Watch for React Compiler compatibility announcements** from both React and Framer Motion teams. As of the installed versions (React 19.2.3, framer-motion 12.31.0), the integration may have known issues.
4. **Use Framer Motion's `useAnimate` hook** for imperative animations instead of declarative `animate` prop -- imperative calls aren't affected by component memoization.

**Warning signs:**

- Animations work in `next dev` but not in `next build` output
- Clicking expand does nothing visually, but state updates (DevTools shows expandedNodes change)
- Some nodes animate on first render but not on subsequent state changes

**Phase recommendation:** Test early. After adding any new Framer Motion animation, verify it works in production build (`pnpm build && pnpm start`), not just dev mode.

**Confidence:** MEDIUM -- React Compiler + Framer Motion interaction is not yet widely documented. The risk is real but may have been resolved in framer-motion v12.31.0.

---

### Pitfall 10: Camera Panning to Nodes That Haven't Measured Yet

**What goes wrong:** When you call `setCenter(node.position.x, node.position.y, { duration: 600 })` immediately after `setNodes(prev => [...prev, newNode])`, the node's DOM element may not have been measured by React Flow yet. React Flow needs at least one render cycle to measure node dimensions and calculate the InternalNode position. If you `setCenter` before measurement, you're panning to the raw position from your layout calculator, which may not match where React Flow actually placed the node (especially with handles, padding, or CSS margins).

**Why it happens:**

- `setNodes` triggers a React state update (batched in React 19)
- React Flow's internal ResizeObserver needs to measure the new node's DOM element
- The measured position includes node width/height adjustments
- `setCenter` called synchronously after `setNodes` uses stale node dimensions
- React 19's automatic batching makes this worse: `setNodes` + `setCenter` in the same event handler are batched, so the DOM update hasn't happened when `setCenter` reads positions

**Consequences:**

- Camera pans to a position slightly off from the actual node center
- On first reveal, camera targets raw layout position; after resize/re-render, it targets correct position -- visible jump
- `getNodesBounds([nodeId])` returns `{ x: 0, y: 0, width: 0, height: 0 }` if called before measurement

**Prevention:**

1. **Use `useNodesInitialized()` hook** or the `onNodesChange` callback to detect when nodes have been measured:
   ```typescript
   // Wait for node measurement before panning
   const unsubscribe = reactFlowInstance.onNodesChange((changes) => {
     const dimensionChange = changes.find(
       (c) => c.type === "dimensions" && c.id === newNodeId,
     );
     if (dimensionChange) {
       reactFlowInstance.setCenter(x, y, { duration: 600 });
       unsubscribe();
     }
   });
   ```
2. **Add a small delay** (requestAnimationFrame or setTimeout(0)) between `setNodes` and `setCenter`:
   ```typescript
   setNodes((prev) => [...prev, newNode]);
   requestAnimationFrame(() => {
     requestAnimationFrame(() => {
       // Double-rAF ensures React has committed and RF has measured
       setCenter(x, y, { duration: 600 });
     });
   });
   ```
3. **Pre-calculate node center positions** in the layout calculator (accounting for node width/height) so that `setCenter` targets are correct even before measurement. This works if node sizes are known and consistent.
4. **Use `getInternalNode(id)` to check measurement status** before panning -- if it returns undefined or has zero dimensions, wait.

**Warning signs:**

- Camera pans to slightly wrong positions (offset by ~half the node width/height)
- First reveal animation is off-center; subsequent viewport interactions correct it
- `getNodesBounds` returns zero-size rect for just-added nodes

**Phase recommendation:** Address during camera animation implementation. The double-rAF approach is the simplest reliable fix.

**Confidence:** HIGH -- React Flow's measurement lifecycle is observable in the types (InternalNode has `measured` property) and this is a common issue in the React Flow community.

---

## Minor Pitfalls

Mistakes that cause annoyance, visual imperfections, or minor technical debt.

### Pitfall 11: Edge Gradient `<defs>` ID Collisions in SVG

**What goes wrong:** SVG `<linearGradient>` elements are defined in `<defs>` and referenced by `id`. If multiple custom edges use gradients with the same `id` (e.g., `id="edge-gradient"`), all edges share one gradient definition. Changing the gradient on one edge changes it on all.

**Why it happens:** React Flow renders all edges in a single `<svg>`. All `<defs>` share the same namespace. If custom edge components each create `<linearGradient id="gradient">`, there's only one `id="gradient"` in the DOM.

**Prevention:** Use edge ID in gradient ID: `id={`gradient-${props.id}`}`. Reference with `url(#gradient-${props.id})`.

**Phase recommendation:** Address during custom edge component creation. Simple to prevent, hard to debug after the fact.

**Confidence:** HIGH -- standard SVG behavior, well-documented limitation.

---

### Pitfall 12: onMouseEnter Reveal Trigger Fires During Camera Pan

**What goes wrong:** The current reveal triggers on `onMouseEnter` of the graph container (graph-section.tsx line 285). During camera panning, if the mouse happens to be over a company node (because the viewport moved under the cursor), it triggers `handleNodeHover`, starting achievement reveal for that company. This creates an unintended cascade where camera movement triggers hover-based reveals.

**Why it happens:** Mouse events fire relative to viewport, not graph coordinates. When the camera pans, nodes move under the cursor. The browser fires `mouseenter` on nodes that arrive under the static cursor position.

**Prevention:**

1. **Disable hover-based reveals during camera animation** (set a flag in reveal state machine)
2. **Switch from hover-trigger to click-trigger for achievement reveal** (the milestone description already mentions "click-triggered cinematic reveal")
3. **Use `pointer-events: none`** on nodes during camera animation to suppress all mouse events

**Phase recommendation:** Address when switching to click-triggered reveal. Current hover behavior will be replaced anyway.

**Confidence:** HIGH -- standard DOM event behavior. Camera panning moves elements under cursor, triggering mouse events.

---

### Pitfall 13: Animated Edge `strokeDashoffset` Not Consistent Across SmoothStep Path Lengths

**What goes wrong:** CSS `stroke-dashoffset` animation creates a "flowing" effect along edges. But SmoothStep edges have variable path lengths (longer paths for edges that need to route around obstacles). A fixed `stroke-dasharray: 5 5` with animation `stroke-dashoffset: -10` runs at different apparent speeds on different edges -- short edges look fast, long edges look slow.

**Why it happens:** `stroke-dashoffset` is an absolute pixel value, not relative to path length. A 100px path completes one dash cycle 5x faster than a 500px path.

**Prevention:**

1. **Calculate path length in custom edge component** using `pathElement.getTotalLength()` and set `stroke-dasharray` proportionally
2. **Use `pathLength` SVG attribute** to normalize: `<path pathLength="100" />` makes `stroke-dashoffset: 100` always equal to one full path length, regardless of actual pixel length
3. **Accept the inconsistency** for subtle effects (flowing dots) where speed variation is barely noticeable

**Phase recommendation:** Address during edge animation implementation if consistent speed matters for the visual design.

**Confidence:** HIGH -- standard SVG path animation behavior.

---

## Phase-Specific Warnings

| Phase Topic                                    | Likely Pitfall                                                                               | Mitigation                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Remove fitView prop, add manual camera control | Pitfall 1 (fitView fighting programmatic control)                                            | Remove fitView prop first, replace with manual calls      |
| State machine for reveal sequence              | Pitfall 3 (setTimeout chain), Pitfall 7 (store complexity)                                   | Decide XState vs Zustand architecture before coding       |
| Camera pan following nodes                     | Pitfall 5 (easing mismatch), Pitfall 10 (unmeasured nodes)                                   | Sequence camera then node animation; use double-rAF       |
| Animated edge components                       | Pitfall 4 (SVG performance), Pitfall 8 (remount resets), Pitfall 11 (gradient ID collisions) | Tier animation intensity; use CSS not JS; unique IDs      |
| Achievement node expand with edge animations   | Pitfall 2 (layout prop + edge recalculation)                                                 | Replace `layout` with CSS transitions or scale transforms |
| Click-triggered reveal                         | Pitfall 12 (hover fires during pan)                                                          | Lock interaction during camera animation                  |
| Mobile responsive                              | Pitfall 6 (small viewport)                                                                   | Skip cinematic on mobile; recalculate margins             |
| React Compiler interaction                     | Pitfall 9 (memoization breakage)                                                             | Test production builds early and often                    |

---

## Confidence Assessment

| Pitfall                               | Confidence | Source                                                                      |
| ------------------------------------- | ---------- | --------------------------------------------------------------------------- |
| 1: fitView vs setCenter conflict      | HIGH       | Verified from React Flow v12.10.0 types and existing codebase usage         |
| 2: Framer Motion layout + edge recalc | HIGH       | Existing code comment confirms issue; `layout` prop still present           |
| 3: setTimeout chain fragility         | HIGH       | Directly observed in graph-section.tsx lines 184-209                        |
| 4: SVG edge animation performance     | HIGH       | SVG rendering pipeline is well-documented; 22 edges is quantified           |
| 5: d3-zoom vs Framer Motion easing    | HIGH       | Verified both easing systems from installed type definitions                |
| 6: Mobile viewport constraints        | HIGH       | Math verified: 375px - 240px - 100px = 35px usable width                    |
| 7: Zustand state machine complexity   | MEDIUM     | Complexity estimate based on requirements; depends on implementation choice |
| 8: Custom edge remounting             | MEDIUM     | Depends on implementation details of custom edge components                 |
| 9: React Compiler + Framer Motion     | MEDIUM     | Known risk area but may be resolved in current versions                     |
| 10: Unmeasured node camera targeting  | HIGH       | React Flow measurement lifecycle confirmed in InternalNode types            |
| 11: SVG gradient ID collisions        | HIGH       | Standard SVG behavior                                                       |
| 12: Hover triggers during pan         | HIGH       | Standard DOM event behavior                                                 |
| 13: strokeDashoffset speed variance   | HIGH       | Standard SVG path animation behavior                                        |

---

## Sources

**Primary sources (HIGH confidence):**

- Codebase analysis: `/Users/sunny/Desktop/Sunny/portfolio/` (all component and library files)
- React Flow v12.10.0 installed types: `@xyflow/react/dist/esm/types/` (ViewportHelperFunctions, SetCenter, FitView, ReactFlowInstance)
- `@xyflow/system@0.0.74` types: ViewportHelperFunctionOptions `{ duration, ease, interpolate }`, d3-zoom usage in xypanzoom
- Framer Motion animation variants in custom-node.tsx, achievement-node.tsx (existing easing definitions)

**Key codebase files analyzed:**

- `components/sections/graph-section.tsx` -- reveal sequence, fitView, timer management
- `components/custom-node.tsx` -- Framer Motion animation variants and easing curves
- `components/nodes/achievement-node.tsx` -- `layout` prop, expand/collapse variants
- `lib/stores/graph-store.tsx` -- current store shape (7 fields, 5 actions)
- `lib/layout-calculator.ts` -- safe area calculation, node positioning
- `lib/layout-constants.ts` -- margin constants (240px left, 100px right)
- `lib/graph-utils.ts` -- edge creation (22 edges with types and styles)
- `data/resume-data.ts` -- node/edge counts (7 graph nodes + ~16 achievement nodes + 22 edges)

**Domain knowledge (MEDIUM confidence):**

- SVG animation performance characteristics (main-thread repaints vs GPU compositing)
- d3-zoom transition internals (d3-transition library)
- React 19 automatic batching behavior with state updates
- React Compiler memoization patterns (documented but rapidly evolving)
