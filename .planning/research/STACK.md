# Technology Stack: Cinematic Graph Improvements

**Project:** Portfolio Graph Improvements (v1.3)
**Researched:** 2026-02-07
**Confidence:** HIGH (verified from installed library type definitions)

## Executive Summary

The cinematic graph improvements require **zero new dependencies**. Every capability needed -- smooth camera panning, custom animated edges with particles, polished node cards, and click-to-expand interactions -- is achievable with the existing stack: React Flow 12.10.0, Framer Motion 12.31.0, and Tailwind CSS 4.x.

The key insight is that React Flow already has a rich viewport API (`setCenter`, `fitBounds`, `setViewport`) with built-in `duration` and `ease` animation options, and its custom edge system renders edges as SVG `<path>` elements that can be animated with CSS or SVG animation techniques. Framer Motion handles the node-level animations. No particle library, no camera library, no animation library beyond what already exists.

---

## Current Stack (No Changes Needed)

### Core Dependencies (Existing)

| Technology     | Installed Version | Role in Graph Improvements                                |
| -------------- | ----------------- | --------------------------------------------------------- |
| @xyflow/react  | 12.10.0           | Camera API, custom edges, custom nodes, edge path utils   |
| framer-motion  | 12.31.0           | Node entrance/expand animations, hover micro-interactions |
| zustand        | 5.0.11            | Reveal sequence state machine, camera tour state          |
| tailwind-merge | 3.4.0             | Conditional class composition for node variants           |
| lucide-react   | 0.563.0           | Icons for node cards                                      |

### What Each Library Provides

#### React Flow 12.10.0 -- Camera and Edge System

**Verified from installed `@xyflow/system@0.0.74` type definitions.**

Camera/viewport methods available on `useReactFlow()`:

| Method           | Signature                                  | Animation Support             | Use Case                                 |
| ---------------- | ------------------------------------------ | ----------------------------- | ---------------------------------------- |
| `setCenter`      | `(x, y, options?) => Promise<boolean>`     | `duration`, `ease`, `zoom`    | Pan to specific node position            |
| `fitBounds`      | `(bounds, options?) => Promise<boolean>`   | `duration`, `ease`, `padding` | Zoom to region (e.g., a company cluster) |
| `setViewport`    | `(viewport, options?) => Promise<boolean>` | `duration`, `ease`            | Full viewport control (x, y, zoom)       |
| `fitView`        | `(options?) => Promise`                    | `duration`, `ease`, `nodes[]` | Fit to specific nodes or all nodes       |
| `zoomTo`         | `(level, options?) => Promise<boolean>`    | `duration`, `ease`            | Zoom to specific level                   |
| `getNodesBounds` | `(nodes[]) => Rect`                        | N/A                           | Calculate bounds for a group of nodes    |

**`ViewportHelperFunctionOptions` type:**

```typescript
type ViewportHelperFunctionOptions = {
  duration?: number; // ms - enables smooth animation
  ease?: (t: number) => number; // custom easing function
  interpolate?: "smooth" | "linear";
};
```

**`SetCenterOptions` extends this with `zoom?: number`.**

This means the cinematic camera tour is fully supported natively:

- Pan to root node: `setCenter(rootX, rootY, { duration: 1200, zoom: 0.9 })`
- Pan to company cluster: `fitBounds(companyBounds, { duration: 1000, padding: 0.3 })`
- These return `Promise<boolean>`, enabling sequential `await`-based choreography.

**Custom edge system:**

Custom edges receive `EdgeProps` which include:

- `sourceX`, `sourceY`, `targetX`, `targetY`, `sourcePosition`, `targetPosition`
- `data` (any custom data from edge definition)
- `style`, `markerStart`, `markerEnd`

Path generation utilities exported:

- `getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })` returns `[path, labelX, labelY, offsetX, offsetY]`
- `getBezierPath(...)` -- same pattern
- `BaseEdge` component -- renders the SVG path, handles interaction area and labels

The custom edge pattern is:

```tsx
function AnimatedEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props);
  return (
    <>
      <BaseEdge path={edgePath} {...props} />
      {/* Custom SVG elements along the path */}
    </>
  );
}
```

Edges are rendered inside an SVG context, so any standard SVG animation technique works: `<animate>`, `<animateMotion>` along the path, CSS `stroke-dasharray` / `stroke-dashoffset` animations, SVG `<linearGradient>` with animated stops.

**`EdgeLabelRenderer`** -- portal for rendering HTML/React content positioned alongside edges (useful for edge labels that need rich formatting).

#### Framer Motion 12.31.0 -- Node Animations

Already used extensively in the codebase. Key capabilities for graph improvements:

| Feature                           | Status                           | Use Case                          |
| --------------------------------- | -------------------------------- | --------------------------------- |
| `variants` + `initial`/`animate`  | Already in use                   | Node entrance animations          |
| `whileHover`                      | Already in use                   | Node hover micro-interactions     |
| `layout`                          | Already in use (AchievementNode) | Expand/collapse animation         |
| `AnimatePresence`                 | Available (not yet used)         | Node removal animations if needed |
| Spring physics (`type: "spring"`) | Already in use                   | Bounce/overshoot effects          |
| Custom easing arrays              | Already in use                   | Cinematic entrance curves         |
| `animate` prop with keyframes     | Already in use (root node pulse) | Complex multi-step animations     |

The existing `custom-node.tsx` already demonstrates sophisticated animation patterns: keyframe arrays for pulsing, custom cubic-bezier curves, staggered delays, and infinite loops. No additional animation capability is needed.

#### Zustand 5.0.11 -- State Machine

Currently manages: `expandedNodes`, `hasStartedReveal`, `revealedCompanies`.

Needs extension for camera tour state:

- `currentTourStep` (which stop in the guided tour)
- `isTourActive` (whether camera tour is playing)
- `tourCompleted` (whether user has completed or skipped tour)

This is a state shape change, not a library change.

---

## Capability Matrix: What Existing Stack Supports

### Cinematic Camera/Reveal Sequence

| Requirement           | How to Achieve                                                  | Confidence                         |
| --------------------- | --------------------------------------------------------------- | ---------------------------------- |
| Smooth pan to node    | `setCenter(x, y, { duration: 1200 })`                           | HIGH -- verified from types        |
| Zoom into region      | `fitBounds(rect, { duration: 1000, padding: 0.2 })`             | HIGH -- verified from types        |
| Sequential tour stops | `await setCenter(...); await setCenter(...)` (Promise-based)    | HIGH -- returns `Promise<boolean>` |
| Custom easing         | `ease: (t) => cubicBezier(t)` in options                        | HIGH -- verified from types        |
| Fit to specific nodes | `fitView({ nodes: ['Intenseye', 'Layermark'], duration: 800 })` | HIGH -- verified from types        |
| Zoom level control    | `setCenter(x, y, { zoom: 1.2, duration: 1000 })`                | HIGH -- verified from types        |

### Edge Animations

| Requirement                 | How to Achieve                                           | Confidence                          |
| --------------------------- | -------------------------------------------------------- | ----------------------------------- |
| Flowing particle along edge | SVG `<circle>` with `<animateMotion>` on the edge `path` | HIGH -- standard SVG, edges are SVG |
| Gradient along edge path    | SVG `<linearGradient>` or animated `stroke-dasharray`    | HIGH -- standard SVG                |
| Edge draw-in animation      | CSS `stroke-dasharray` + `stroke-dashoffset` transition  | HIGH -- standard SVG technique      |
| Glowing edge effect         | CSS `filter: drop-shadow()` or duplicate path with blur  | HIGH -- standard SVG/CSS            |
| Edge color transitions      | CSS transition on `stroke` color                         | HIGH -- standard CSS                |

### Polished Node Cards

| Requirement        | How to Achieve                                              | Confidence             |
| ------------------ | ----------------------------------------------------------- | ---------------------- |
| Better typography  | Tailwind classes (`font-semibold`, `tracking-tight`, etc.)  | HIGH -- already in use |
| Premium shadows    | Tailwind `shadow-2xl` + custom `boxShadow` in Framer Motion | HIGH -- already in use |
| Gradient borders   | Tailwind `bg-gradient-to-*` with border technique           | HIGH -- standard CSS   |
| Glow effects       | Framer Motion `boxShadow` keyframes (already done for root) | HIGH -- already in use |
| Micro-interactions | Framer Motion `whileHover` (already done)                   | HIGH -- already in use |

### Click-to-Expand Interactions

| Requirement               | How to Achieve                                                        | Confidence                  |
| ------------------------- | --------------------------------------------------------------------- | --------------------------- |
| Expand/collapse animation | Framer Motion `layout` + `variants` (already done in AchievementNode) | HIGH -- already implemented |
| Camera follow on expand   | `setCenter` on the expanded node + `fitBounds` around it              | HIGH -- verified from types |
| Z-index management        | Already implemented via `expandedNodes` + `zIndex: 1000`              | HIGH -- already in code     |

---

## What NOT to Add (and Why)

### Do NOT Add: GSAP / GreenSock

**Why not:** Framer Motion already handles all node animation needs. GSAP would add ~30KB+ gzipped, introduce a second animation paradigm, and conflict with React's rendering model. The imperative animation model of GSAP is unnecessary when Framer Motion's declarative approach already works well in the existing codebase.

### Do NOT Add: D3.js (beyond what React Flow bundles)

**Why not:** React Flow internally uses d3-zoom, d3-selection, and d3-transition for its viewport transitions. Adding d3 directly would bypass React Flow's abstraction and create maintenance burden. Use React Flow's API which wraps d3 correctly.

### Do NOT Add: react-particles / tsparticles

**Why not:** The "particle" effect on edges is achievable with a single SVG `<circle>` element and `<animateMotion>` using the edge's path data. A full particle library adds 50KB+ for a single visual effect. SVG `animateMotion` is built into every browser and requires zero JS.

### Do NOT Add: Lottie / Rive

**Why not:** The animations needed are geometric (paths, circles, gradients) not illustrative. SVG animations and Framer Motion cover the entire scope. Lottie/Rive would require creating animation assets externally and add significant bundle weight.

### Do NOT Add: @react-spring/web

**Why not:** Framer Motion is already the animation library. Adding a second spring-physics library would create confusion about which to use where. Framer Motion 12.x has all spring physics capabilities needed.

### Do NOT Add: anime.js or motion-one

**Why not:** Same reasoning as GSAP -- Framer Motion is sufficient and already integrated. Adding a competing library adds complexity without capability gain.

---

## Implementation Patterns (Using Existing Stack)

### Pattern 1: Cinematic Camera Tour with Promise Chaining

```typescript
// Using existing useReactFlow() hook
const { setCenter, fitBounds, getNodesBounds, fitView } = useReactFlow();

async function playCameraTour() {
  // Step 1: Zoom into root node
  await setCenter(rootPos.x, rootPos.y, {
    duration: 1200,
    zoom: 1.0,
    ease: easeInOutCubic,
  });

  // Step 2: Pan to first company
  await setCenter(companyPos.x, companyPos.y, {
    duration: 1000,
    zoom: 0.9,
  });

  // Step 3: Fit to show all nodes
  await fitView({
    duration: 1500,
    padding: 0.15,
    maxZoom: 0.85,
  });
}
```

### Pattern 2: Custom Animated Edge (SVG-only, zero deps)

```tsx
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

function AnimatedEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props);
  const edgeColor = props.data?.color ?? "#3b82f6";

  return (
    <>
      {/* Base visible edge */}
      <BaseEdge path={edgePath} style={{ stroke: edgeColor, strokeWidth: 2 }} />

      {/* Flowing particle */}
      <circle r="3" fill={edgeColor}>
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Glow effect (blurred duplicate) */}
      <path
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth="6"
        opacity="0.15"
        filter="url(#glow)"
      />
    </>
  );
}
```

### Pattern 3: Edge Draw-In Animation (CSS-only)

```tsx
function DrawInEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath(props);

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: props.data?.color ?? "#3b82f6",
        strokeWidth: 2,
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        animation: "draw-edge 1.5s ease-out forwards",
      }}
    />
  );
}

// In global CSS:
// @keyframes draw-edge {
//   to { stroke-dashoffset: 0; }
// }
```

### Pattern 4: Node Card Polish (Tailwind + Framer Motion)

```tsx
// Enhanced company node with gradient border and premium shadow
<motion.div
  className={cn(
    "relative rounded-xl border bg-gradient-to-br from-stone-900 to-stone-950",
    "shadow-[0_8px_32px_rgba(59,130,246,0.15)]",
    "ring-1 ring-blue-500/20",
  )}
  whileHover={{
    boxShadow: "0 12px 40px rgba(59,130,246,0.25)",
    scale: 1.02,
    transition: { duration: 0.2 },
  }}
>
```

---

## Versions and Compatibility

All verified from `package.json` and installed `node_modules`:

| Package         | Installed | Locked?          | Notes                                   |
| --------------- | --------- | ---------------- | --------------------------------------- |
| `@xyflow/react` | 12.10.0   | `^12.10.0`       | Uses `@xyflow/system@0.0.74` internally |
| `framer-motion` | 12.31.0   | `^12.31.0`       | React 19 compatible                     |
| `zustand`       | 5.0.11    | `^5.0.11`        | React 19 compatible                     |
| `react`         | 19.2.3    | `19.2.3` (exact) | Pinned                                  |
| `tailwindcss`   | 4.x       | `^4`             | v4 (CSS-first config)                   |
| `next`          | 16.1.6    | `16.1.6` (exact) | Pinned                                  |

No version bumps needed. No new installs needed.

---

## Integration Points

### React Flow + Framer Motion Coordination

Current codebase already handles this well. Key integration points:

1. **Node components** use Framer Motion for animations but live inside React Flow's node rendering pipeline. This works because React Flow custom nodes are just React components.

2. **Edge components** live in SVG context (React Flow renders edges in `<svg>`). Framer Motion's `motion.path` can animate SVG paths, but for edge animations, native SVG `<animateMotion>` is more appropriate because it handles path-following natively.

3. **Camera animations** use React Flow's viewport API (d3-based internally). These are separate from Framer Motion and do not conflict. The camera tour and node entrance animations can run simultaneously without issues.

4. **State coordination** via Zustand store. The reveal sequence (timer-based) triggers both node additions (which trigger Framer Motion entrance animations) and camera movements (which use React Flow viewport API). These coordinate through the same state machine.

### Potential Friction Point

The one area to watch: Framer Motion's `layout` animations on nodes can trigger React Flow to recalculate edge paths. The existing AchievementNode already uses `layout` for expand/collapse. When expanding a node, the node dimensions change, React Flow re-renders connected edges, and if the camera is also moving, there could be a brief visual jitter.

**Mitigation:** Sequence operations: expand node first, wait for layout settle (~300ms), then move camera. Do not run layout animation and camera animation simultaneously on the same node.

---

## Sources

All findings verified directly from installed package type definitions:

- `node_modules/@xyflow/react/dist/esm/types/instance.d.ts` -- ReactFlowInstance methods (GeneralHelpers + ViewportHelperFunctions)
- `node_modules/@xyflow/react/dist/esm/types/general.d.ts` -- ViewportHelperFunctions type (setCenter, fitBounds, setViewport with duration/ease/interpolate)
- `node_modules/.pnpm/@xyflow+system@0.0.74/.../types/general.d.ts` -- ViewportHelperFunctionOptions, SetCenterOptions, FitBoundsOptions
- `node_modules/@xyflow/react/dist/esm/types/edges.d.ts` -- EdgeProps, BaseEdgeProps, custom edge interface
- `node_modules/@xyflow/react/dist/esm/components/Edges/BaseEdge.d.ts` -- BaseEdge component (path, label, interaction area)
- `node_modules/@xyflow/react/dist/esm/index.d.ts` -- All exports including getSmoothStepPath, getBezierPath, EdgeLabelRenderer
- `components/custom-node.tsx` -- Existing Framer Motion animation patterns
- `components/nodes/achievement-node.tsx` -- Existing expand/collapse with layout animation
- `components/sections/graph-section.tsx` -- Existing useReactFlow usage, fitView with duration
- `lib/stores/graph-store.tsx` -- Existing Zustand store shape
- `lib/graph-utils.ts` -- Existing edge creation with smoothstep type and static styling
- `package.json` -- Installed dependency versions
