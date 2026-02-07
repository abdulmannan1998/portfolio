# Architecture Patterns: Cinematic Graph Reveal

**Project:** Portfolio Graph Improvements (Cinematic Reveal)
**Domain:** Interactive graph visualization with sequenced camera animations
**Researched:** 2026-02-07
**Confidence:** HIGH (based on direct codebase analysis and installed @xyflow/react v12.10 type inspection)

## Executive Summary

The cinematic graph reveal replaces the current timer-based `setTimeout` cascade with a **state machine-driven reveal sequence** that coordinates three systems: node/edge rendering, camera animation, and user interaction. The key architectural insight is that React Flow's `setCenter()` and `fitBounds()` APIs natively support `duration` and `ease` parameters, which means smooth camera pans can be achieved without any external animation library -- the camera system is built into the tool we already use.

The existing architecture (graph-section.tsx as orchestrator, Zustand for state, Framer Motion for node animations) is structurally sound but needs its **control flow** replaced, not its component structure. The new architecture introduces a `RevealPhase` state machine in Zustand, a `useCameraSequencer` hook that consumes phase transitions and drives `reactFlowInstance.setCenter()`, and modifications to existing node components (click handlers instead of hover, badges instead of full nodes for soft skills).

**No new dependencies required.** Everything needed is already installed.

## Current Architecture Analysis

### What Works (Preserve)

```
graph-section-loader.tsx  -- Dynamic import boundary (ssr: false) -- KEEP
  |
  v
graph-section.tsx ("use client")  -- Orchestrator -- MODIFY (major)
  |
  +---> ReactFlowProvider + useReactFlow()  -- Camera control -- KEEP
  +---> useNodesState / useEdgesState       -- Node/edge rendering -- KEEP
  +---> useGraphStore (Zustand)             -- State coordination -- MODIFY (major)
  +---> getInitialNodes / getInitialEdges   -- Data generation -- MODIFY (minor)
  +---> CustomNode (Framer Motion)          -- Node rendering -- MODIFY (moderate)
  +---> AchievementNode (Framer Motion)     -- Expandable cards -- MODIFY (minor)
  +---> layout-calculator.ts                -- Positioning -- MODIFY (add course nodes)
  +---> layout-constants.ts                 -- Timing constants -- REPLACE (new timing model)
  +---> resume-data.ts                      -- Static data -- MODIFY (add courses)
```

### What Must Change

| Component              | Current                                                | Target                                                                        | Change Scope                                                    |
| ---------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `graph-section.tsx`    | Timer cascade with `setTimeout`                        | State machine consumer with `useCameraSequencer`                              | **Heavy rewrite** of reveal logic, preserve container/rendering |
| `graph-store.tsx`      | `hasStartedReveal` boolean + `revealedCompanies` array | `RevealPhase` discriminated union state machine                               | **Heavy rewrite**                                               |
| `custom-node.tsx`      | Hover triggers achievement reveal                      | Click triggers achievement reveal; root node click starts sequence            | **Moderate** -- change event handlers, add root clickability    |
| `layout-constants.ts`  | Fixed millisecond delays                               | Phase-based timing config (duration per phase, camera settle time)            | **Replace**                                                     |
| `layout-calculator.ts` | 3 timeline positions (Bilkent, Layermark, Intenseye)   | 4 timeline positions (add Courses under Bilkent) + soft skill badge positions | **Moderate**                                                    |
| `resume-data.ts`       | No course data                                         | Add courses array under education                                             | **Minor addition**                                              |
| `graph-utils.ts`       | Static edge colors/widths                              | Custom edge type registration + gradient edge data                            | **Moderate**                                                    |
| `achievement-node.tsx` | Click to expand/collapse                               | Same, but triggered from company node click not hover                         | **Minor**                                                       |

## Recommended Architecture

### System Overview

```
                    USER INTERACTION
                          |
                    [Click root node]
                          |
                    graph-store.tsx
                    (State Machine)
                          |
              +-----------+-----------+
              |                       |
    graph-section.tsx          useCameraSequencer
    (Node Orchestrator)        (Camera Animator)
              |                       |
    Adds nodes/edges to         Calls setCenter()
    useNodesState/               on reactFlowInstance
    useEdgesState                     |
              |                       |
              +-------+-------+-------+
                      |
                 React Flow
              (Renders everything)
```

### Component Boundaries

| Component                       | Responsibility                                                       | Communicates With                                             |
| ------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `graph-store.tsx`               | State machine: current phase, transitions, expanded nodes            | All graph components (read), graph-section (write)            |
| `graph-section.tsx`             | Orchestrates node/edge addition based on phase, wires click handlers | graph-store, React Flow instance, all node components         |
| `useCameraSequencer` (new hook) | Subscribes to phase changes, animates camera to target positions     | graph-store (read), React Flow instance (setCenter/fitBounds) |
| `custom-node.tsx`               | Renders root/company/education nodes, emits click events             | graph-section (via callbacks), graph-store (reads phase)      |
| `achievement-node.tsx`          | Renders expandable achievement cards                                 | graph-store (expand/collapse)                                 |
| `soft-skill-badge.tsx` (new)    | Renders compact skill badges overlaying root node                    | graph-store (reads phase for visibility)                      |
| `animated-edge.tsx` (new)       | Custom edge with gradient stroke + optional particle                 | React Flow edge system                                        |
| `layout-calculator.ts`          | Pure function: computes all node positions                           | Called by graph-section                                       |
| `resume-data.ts`                | Static data source                                                   | Called by graph-utils                                         |

### Data Flow

```
1. Page loads -> graph-section mounts -> only root node rendered
2. User clicks root node (or hovers name on mobile)
3. graph-store.advancePhase() called
4. Phase transitions: IDLE -> INTRO -> INTENSEYE -> LAYERMARK -> BILKENT -> COURSES -> SKILLS -> COMPLETE
5. Each transition:
   a. graph-section reads new phase, adds appropriate nodes + edges
   b. useCameraSequencer reads new phase, calls setCenter() with target position
   c. After camera settles (duration elapsed), auto-advance to next phase OR wait for user
6. In COMPLETE phase: user can click company nodes to expand achievements
7. Achievement expansion: graph-store.expandNode() -> achievement nodes added -> fitBounds to show them
```

## State Machine Design

### Why a State Machine (Not Timers)

The current approach uses nested `setTimeout` calls:

```typescript
// CURRENT (fragile)
addTimer(() => addNodeAndEdges("Bilkent"), 1200);
addTimer(() => addNodeAndEdges("Layermark"), 1700);
addTimer(() => addNodeAndEdges("Intenseye"), 2200);
```

Problems:

1. **No pause/resume** -- cannot stop mid-sequence
2. **No awareness of camera** -- nodes appear before camera reaches them
3. **Race conditions** -- timer fires regardless of animation state
4. **Untestable** -- depends on real clock
5. **No reverse chronological** -- hardcoded forward order

The state machine solves all of these:

```typescript
// NEW (predictable)
// Phase advances only after:
// 1. Nodes for current phase are rendered
// 2. Camera has settled on target position
// 3. Minimum dwell time has elapsed
```

### Phase Definition

```typescript
// lib/stores/graph-store.tsx

type RevealPhase =
  | { type: "IDLE" } // Initial: only root node visible
  | { type: "INTRO"; startedAt: number } // Root node pulsing, "click to explore" hint
  | {
      type: "REVEALING";
      company: "Intenseye" | "Layermark" | "Bilkent" | "Courses";
    }
  | { type: "SKILLS" } // Soft skill badges fade in
  | { type: "COMPLETE" } // All revealed, free exploration
  | { type: "EXPANDING"; company: string }; // Company clicked, achievements expanding

type GraphState = {
  // Phase state machine
  phase: RevealPhase;
  advancePhase: () => void;
  setPhase: (phase: RevealPhase) => void;

  // Expanded achievements (existing, keep)
  expandedNodes: string[];
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;

  // Revealed companies (tracks what's already been shown)
  revealedCompanies: string[];
  markCompanyRevealed: (companyId: string) => void;
  isCompanyRevealed: (companyId: string) => boolean;
};
```

### Phase Transition Rules

```
IDLE ──[user clicks root]──> INTRO
INTRO ──[after 800ms intro animation]──> REVEALING(Intenseye)
REVEALING(Intenseye) ──[camera settled + dwell]──> REVEALING(Layermark)
REVEALING(Layermark) ──[camera settled + dwell]──> REVEALING(Bilkent)
REVEALING(Bilkent) ──[camera settled + dwell]──> REVEALING(Courses)
REVEALING(Courses) ──[camera settled + dwell]──> SKILLS
SKILLS ──[badges animated in]──> COMPLETE
COMPLETE ──[user clicks company]──> EXPANDING(company)
EXPANDING(company) ──[achievements shown]──> COMPLETE
```

### advancePhase Implementation

```typescript
advancePhase: () => {
  const { phase } = get();

  switch (phase.type) {
    case "IDLE":
      set({ phase: { type: "INTRO", startedAt: Date.now() } });
      break;
    case "INTRO":
      set({ phase: { type: "REVEALING", company: "Intenseye" } });
      break;
    case "REVEALING":
      switch (phase.company) {
        case "Intenseye":
          set({ phase: { type: "REVEALING", company: "Layermark" } });
          break;
        case "Layermark":
          set({ phase: { type: "REVEALING", company: "Bilkent" } });
          break;
        case "Bilkent":
          set({ phase: { type: "REVEALING", company: "Courses" } });
          break;
        case "Courses":
          set({ phase: { type: "SKILLS" } });
          break;
      }
      break;
    case "SKILLS":
      set({ phase: { type: "COMPLETE" } });
      break;
    // COMPLETE and EXPANDING don't auto-advance
  }
},
```

### Why Zustand (Not XState)

XState is the canonical state machine library, but it would be over-engineering here because:

1. **Already using Zustand** -- no new dependency
2. **Linear sequence** -- this is not a complex state graph with parallel regions
3. **Simple transitions** -- each phase has exactly one successor
4. **Small state** -- 6 phases, no guards/actions/services complexity
5. **Bundle size** -- XState adds ~15KB, Zustand already loaded

The discriminated union `RevealPhase` type gives compile-time exhaustiveness checking, which is 90% of XState's value for this use case.

## Camera Animation System

### React Flow Camera API (Verified from Source)

From `@xyflow/system@0.0.74` (installed), the camera control methods accept:

```typescript
type ViewportHelperFunctionOptions = {
  duration?: number;           // Animation duration in ms
  ease?: (t: number) => number; // Custom easing function (0->1 input, 0->1 output)
  interpolate?: 'smooth' | 'linear'; // Interpolation mode
};

type SetCenterOptions = ViewportHelperFunctionOptions & {
  zoom?: number; // Target zoom level
};

// Available methods on reactFlowInstance:
setCenter(x, y, options?: SetCenterOptions): Promise<boolean>
fitBounds(bounds: Rect, options?: FitBoundsOptions): Promise<boolean>
setViewport(viewport: Viewport, options?: ViewportHelperFunctionOptions): Promise<boolean>
```

**Key discovery:** `setCenter` returns a **Promise** that resolves when the animation completes. This means we can `await` camera movements and chain them -- no need for separate timers to wait for camera settlement.

### useCameraSequencer Hook

```typescript
// lib/hooks/use-camera-sequencer.ts
"use client";

import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { useGraphStore } from "@/lib/stores/graph-store";
import { CAMERA_TARGETS } from "@/lib/layout-constants";

// Easing function: ease-out cubic (decelerating)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useCameraSequencer() {
  const reactFlow = useReactFlow();
  const phase = useGraphStore((s) => s.phase);
  const advancePhase = useGraphStore((s) => s.advancePhase);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Abort any in-flight sequence when phase changes
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function animate() {
      const target =
        CAMERA_TARGETS[phase.type === "REVEALING" ? phase.company : phase.type];
      if (!target) return;

      // Pan camera to target
      await reactFlow.setCenter(target.x, target.y, {
        zoom: target.zoom,
        duration: target.panDuration,
        ease: easeOutCubic,
      });

      if (controller.signal.aborted) return;

      // Dwell at target (let user absorb)
      await new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, target.dwellMs);
        controller.signal.addEventListener("abort", () => {
          clearTimeout(id);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

      if (controller.signal.aborted) return;

      // Auto-advance (for reveal phases only)
      if (
        phase.type === "REVEALING" ||
        phase.type === "INTRO" ||
        phase.type === "SKILLS"
      ) {
        advancePhase();
      }
    }

    animate().catch((e) => {
      if (e?.name !== "AbortError") throw e;
    });

    return () => controller.abort();
  }, [phase, reactFlow, advancePhase]);
}
```

### Camera Targets Configuration

```typescript
// lib/layout-constants.ts (replaces REVEAL_TIMING)

type CameraTarget = {
  x: number; // Flow coordinate X (center of target)
  y: number; // Flow coordinate Y (center of target)
  zoom: number; // Target zoom level
  panDuration: number; // ms for camera pan animation
  dwellMs: number; // ms to pause at this position before advancing
};

export const CAMERA_TARGETS: Record<string, CameraTarget> = {
  // INTRO: Zoom in on root node
  INTRO: {
    x: 0,
    y: 0, // Will be computed from layout
    zoom: 1.2,
    panDuration: 800,
    dwellMs: 600,
  },
  // Reverse chronological reveal
  Intenseye: {
    x: 0,
    y: 0, // Computed from layout-calculator
    zoom: 0.9,
    panDuration: 1000,
    dwellMs: 800,
  },
  Layermark: {
    x: 0,
    y: 0,
    zoom: 0.9,
    panDuration: 1000,
    dwellMs: 800,
  },
  Bilkent: {
    x: 0,
    y: 0,
    zoom: 0.9,
    panDuration: 1000,
    dwellMs: 800,
  },
  Courses: {
    x: 0,
    y: 0,
    zoom: 0.85,
    panDuration: 1000,
    dwellMs: 600,
  },
  // SKILLS: Zoom out to show full graph
  SKILLS: {
    x: 0,
    y: 0,
    zoom: 0.75,
    panDuration: 1200,
    dwellMs: 400,
  },
  // COMPLETE: Fit entire graph
  COMPLETE: {
    x: 0,
    y: 0,
    zoom: 0.7,
    panDuration: 800,
    dwellMs: 0,
  },
};
```

**Important:** The x/y values above are placeholders. They must be computed dynamically from `layout-calculator.ts` because positions depend on viewport dimensions. The hook should resolve positions at animation time from the node data in React Flow state, not from static constants.

### Dynamic Position Resolution

Instead of static camera targets, resolve positions from the actual node positions:

```typescript
function getNodeCenter(
  reactFlow: ReactFlowInstance,
  nodeId: string,
): { x: number; y: number } | null {
  const node = reactFlow.getNode(nodeId);
  if (!node) return null;
  // Node position is top-left corner; center requires width/height
  const width = node.measured?.width ?? 200;
  const height = node.measured?.height ?? 80;
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}
```

This approach is more robust than pre-computing camera positions because node positions change with viewport dimensions (the layout calculator is responsive).

## Click-to-Expand Interaction Model

### Current: Hover to Reveal

```
Company node mouse enter -> handleNodeHover() -> add achievement nodes + edges
```

Problems:

- Accidental triggers on touchscreen
- No way to "un-hover" to hide achievements
- Hover conflicts with camera animation (user might hover during auto-pan)

### New: Click to Expand

```
Company node click (in COMPLETE phase) -> graph-store.expandCompany(id)
-> Achievement nodes added to React Flow state
-> Camera fitBounds to show company + its achievements
-> Click again or click another company -> collapse previous, expand new
```

Implementation in `custom-node.tsx`:

```typescript
// Company node onClick handler
const handleCompanyClick = useCallback(() => {
  const { phase } = useGraphStore.getState();
  if (phase.type !== "COMPLETE") return; // Only allow after reveal

  // Toggle: if this company is already expanded, collapse it
  const { expandedCompany, expandCompany, collapseCompany } =
    useGraphStore.getState();
  if (expandedCompany === id) {
    collapseCompany();
  } else {
    expandCompany(id);
  }
}, [id]);
```

### Store Additions for Company Expansion

```typescript
type GraphState = {
  // ... existing phase state ...

  // Company expansion (replaces per-node expandedNodes for the reveal)
  expandedCompany: string | null; // Only one company expanded at a time
  expandCompany: (companyId: string) => void;
  collapseCompany: () => void;

  // Per-achievement expansion (for clicking individual achievement cards)
  expandedAchievement: string | null;
  expandAchievement: (achievementId: string) => void;
  collapseAchievement: () => void;
};
```

**Design decision:** Only one company expanded at a time. Expanding multiple companies simultaneously creates visual chaos with overlapping achievement nodes.

## Edge Animation Integration

### Custom Edge Component

React Flow supports custom edge types via the `edgeTypes` prop (same pattern as `nodeTypes`). A custom edge receives `EdgeProps` including `sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition` and can render arbitrary SVG.

```typescript
// components/edges/animated-edge.tsx
"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

type AnimatedEdgeData = {
  edgeType: string;
  gradient?: { from: string; to: string };
  animated?: boolean;
};

export function AnimatedEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition, targetPosition,
  style,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY,
    targetX, targetY,
    sourcePosition, targetPosition,
  });

  const gradientId = `gradient-${id}`;
  const edgeData = data as AnimatedEdgeData | undefined;

  return (
    <>
      {edgeData?.gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={edgeData.gradient.from} />
            <stop offset="100%" stopColor={edgeData.gradient.to} />
          </linearGradient>
        </defs>
      )}
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          stroke: edgeData?.gradient ? `url(#${gradientId})` : style?.stroke,
        }}
        markerEnd={markerEnd}
      />
      {edgeData?.animated && (
        <circle r="3" fill={edgeData.gradient?.to ?? "#f97316"}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
}
```

### Edge Type Registration

```typescript
// graph-section.tsx
const edgeTypes = {
  animated: AnimatedEdge,
};

// In getInitialEdges(), edges get type: "animated" instead of "smoothstep"
```

### SVG animateMotion for Particles

The `<animateMotion>` SVG element is native browser capability (no library needed). It moves an element along a path. Since React Flow edge paths are already SVG path strings (`getSmoothStepPath` returns them), particles "ride" edges for free.

**Performance note:** Each animated particle is a separate SVG animation. For the number of edges in this graph (~20), this is trivially performant. Would become a concern at 200+ edges.

### Gradient Approach

SVG `<linearGradient>` elements are defined per-edge in `<defs>` and referenced by `url(#id)`. This is standard SVG -- no library needed. The gradient direction follows the edge path visually because we compute `x1/y1/x2/y2` from source-to-target direction.

**Simplification:** For this graph where edges generally flow top-to-bottom (root -> companies -> achievements), a simple `y1="0%" y2="100%"` vertical gradient works well enough. No need for complex angle calculations.

## Soft Skill Badge Integration

### Current: Full Nodes with Edges

Soft skills are currently full React Flow nodes with edges connecting to the root node. They take up significant layout space and are positioned in a triangle above the root.

### New: Compact Badges

Soft skills become small badges positioned around or overlaying the root node area. They are not full graph nodes -- they are decorative elements rendered inside the React Flow canvas but not participating in the edge system.

**Two approaches:**

#### Approach A: Keep as React Flow Nodes (Recommended)

Keep soft skills as React Flow nodes but make them smaller and remove their edges. Position them tightly around the root node. They appear during the SKILLS phase with a staggered pop-in animation.

**Why recommended:** Simplest change. They already work as nodes. Just change:

1. Remove soft-skill edges from graph data
2. Reposition closer to root (in layout-calculator)
3. Restyle to badge-like appearance (in custom-node)
4. Only render them during SKILLS and COMPLETE phases

```typescript
// custom-node.tsx soft-skill rendering
if (data.type === "soft-skill") {
  return (
    <motion.div
      variants={POP_IN_VARIANTS}
      initial="initial"
      animate="animate"
      transition={{ ...POP_IN_TRANSITION, delay }}
      className="rounded-full border border-emerald-500/40 bg-stone-900/90 px-3 py-1.5 shadow-sm"
    >
      {/* No Handle elements -- badges don't connect */}
      <span className="text-xs font-medium text-emerald-400">{data.label}</span>
    </motion.div>
  );
}
```

#### Approach B: React Flow Panel Overlay

Use React Flow's `<Panel>` component to render badges as an overlay. This completely decouples badges from the node/edge system.

**Why not recommended:** Panel content doesn't move with the viewport when the user pans. Badges would stay fixed while the graph moves underneath them. This is the wrong behavior.

**Verdict:** Approach A. Keep as lightweight nodes, remove edges, restyle to badges.

## Course Data Model and Positioning

### Data Model Addition

```typescript
// resume-data.ts additions
export const RESUME_DATA = {
  // ... existing ...
  courses: [
    {
      id: "course-cs101",
      name: "CS 101 - Algorithms",
      type: "course" as const,
    },
    {
      id: "course-cs102",
      name: "CS 102 - Data Structures",
      type: "course" as const,
    },
    {
      id: "course-cs315",
      name: "CS 315 - Programming Languages",
      type: "course" as const,
    },
    // ... more courses
  ],
  graph: {
    nodes: [
      // ... existing nodes ...
      // Courses added during layout, not here (generated from courses array)
    ],
    edges: [
      // ... existing edges ...
      // Add: { source: "Bilkent", target: "course-cs101", type: "course" },
      // Generated from courses array
    ],
  },
};
```

### Layout Positioning

Courses are children of Bilkent, positioned below it similarly to how achievements position below companies. However, courses are simpler (no expand/collapse), so they use a tighter grid layout.

```typescript
// layout-calculator.ts addition
// After positioning Bilkent:
const courseNodes = graphNodes.filter((n) => n.type === "course");
const bilkentPos = timelinePositions["Bilkent"];
if (bilkentPos && courseNodes.length > 0) {
  const cols = 2; // 2-column grid
  const colSpacing = 180;
  const rowSpacing = 80;

  courseNodes.forEach((course, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = bilkentPos.x - colSpacing / 2 + col * colSpacing;
    const y = bilkentPos.y + 200 + row * rowSpacing;

    nodes.push({
      id: course.id,
      type: "custom", // Reuse custom node with "course" type
      position: { x, y },
      data: {
        label: course.name,
        type: "course",
        animationDelay: 0, // Controlled by phase, not delay
      },
    });
  });
}
```

### Course Node Rendering

Courses are simple label nodes. Add a "course" case to `custom-node.tsx`:

```typescript
if (data.type === "course") {
  return (
    <motion.div
      variants={FADE_DROP_VARIANTS}
      initial="initial"
      animate="animate"
      transition={{ ...FADE_DROP_TRANSITION, delay }}
      className="rounded-md border border-purple-500/30 bg-stone-900/80 px-3 py-1.5"
    >
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-2 !h-2" />
      <span className="text-xs text-purple-300">{data.label}</span>
    </motion.div>
  );
}
```

## Integration Points with Existing Components

### graph-section.tsx (Heavy Modification)

**Remove:**

- `timersRef` and `addTimer` -- replaced by state machine + camera sequencer
- `startRevealSequence` -- replaced by `advancePhase()`
- `handleGraphEnter` (onMouseEnter) -- replaced by root node click
- `handleNodeHover` for company nodes -- replaced by click handler
- `debouncedFitView` calls scattered through reveal -- camera sequencer handles this

**Keep:**

- `ReactFlowProvider` wrapper
- `useNodesState` / `useEdgesState`
- `graphContainerRef` + ResizeObserver for responsive layout
- `graphDimensions` state
- `allNodes` / `allEdges` useMemo computations
- `expandedNodes` z-index effect

**Add:**

- `useCameraSequencer()` hook call
- Phase-aware node addition effect (subscribe to `phase`, add appropriate nodes)
- Click handler wiring for root node and company nodes
- `edgeTypes` registration for animated edges

**New structure sketch:**

```typescript
function GraphSectionInner() {
  // ... existing dimension tracking ...

  const phase = useGraphStore((s) => s.phase);
  const advancePhase = useGraphStore((s) => s.advancePhase);

  // Camera sequencer handles all camera movements
  useCameraSequencer();

  // Phase-driven node rendering
  useEffect(() => {
    switch (phase.type) {
      case "IDLE":
        setNodes(allNodes.filter(n => n.data.type === "root"));
        setEdges([]);
        break;
      case "REVEALING": {
        const companyNode = allNodes.find(n => n.id === phase.company);
        if (companyNode) {
          setNodes(prev => [...prev, companyNode]);
          // Add edge from root to this company after short delay
          setTimeout(() => {
            const edge = allEdges.find(e => e.target === phase.company);
            if (edge) setEdges(prev => [...prev, edge]);
          }, 300);
        }
        break;
      }
      // ... other phases ...
    }
  }, [phase, allNodes, allEdges, setNodes, setEdges]);

  // Root node click handler
  const handleRootClick = useCallback(() => {
    if (phase.type === "IDLE") advancePhase();
  }, [phase, advancePhase]);

  // Company node click handler
  const handleCompanyClick = useCallback((companyId: string) => {
    if (phase.type === "COMPLETE") {
      // Toggle achievement expansion
    }
  }, [phase]);

  return (
    <div id="graph" className="relative lg:pt-[9.5rem]">
      {/* Phase-aware hint text */}
      <p className="text-stone-400 mb-4">
        {phase.type === "IDLE" ? "Click the name node to explore" : "Interact with nodes to explore"}
      </p>
      <motion.div ref={graphContainerRef} /* ... */>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}  // NEW
          /* Remove onMouseEnter from container */
          /* ... */
        />
      </motion.div>
    </div>
  );
}
```

### graph-store.tsx (Heavy Rewrite)

Replace flat boolean state with discriminated union phase:

```typescript
// BEFORE
type GraphState = {
  expandedNodes: string[];
  hasStartedReveal: boolean;
  revealedCompanies: string[];
  // ...actions...
};

// AFTER
type RevealPhase = { type: "IDLE" } | { type: "INTRO" } | /* ... */;

type GraphState = {
  phase: RevealPhase;
  advancePhase: () => void;
  setPhase: (phase: RevealPhase) => void;

  expandedCompany: string | null;
  expandCompany: (id: string) => void;
  collapseCompany: () => void;

  expandedAchievement: string | null;
  expandAchievement: (id: string) => void;
  collapseAchievement: () => void;

  // Keep for backward compat during migration
  revealedCompanies: string[];
  markCompanyRevealed: (id: string) => void;
  isCompanyRevealed: (id: string) => boolean;
};
```

### custom-node.tsx (Moderate Modification)

1. **Root node:** Add `onClick` that calls `advancePhase()` when phase is IDLE. Add visual hint (pulsing "click me" indicator).
2. **Company nodes:** Replace `onMouseEnter`/`onMouseLeave` with `onClick` that calls `handleCompanyClick(id)`. Only clickable when phase is COMPLETE.
3. **Soft-skill nodes:** Restyle to compact badges. Remove Handle components and edges.
4. **Add course node:** New rendering case for `type === "course"`.

### layout-constants.ts (Replace)

```typescript
// BEFORE: Fixed millisecond delays
export const REVEAL_TIMING = {
  EDUCATION_DELAY_MS: 1200,
  LAYERMARK_DELAY_MS: 1700,
  INTENSEYE_DELAY_MS: 2200,
};

// AFTER: Phase-based camera configuration
export const PHASE_CAMERA_CONFIG = {
  INTRO: { zoom: 1.2, panDuration: 800, dwellMs: 600 },
  Intenseye: { zoom: 0.9, panDuration: 1000, dwellMs: 800 },
  Layermark: { zoom: 0.9, panDuration: 1000, dwellMs: 800 },
  Bilkent: { zoom: 0.9, panDuration: 1000, dwellMs: 800 },
  Courses: { zoom: 0.85, panDuration: 1000, dwellMs: 600 },
  SKILLS: { zoom: 0.75, panDuration: 1200, dwellMs: 400 },
  COMPLETE: { zoom: 0.7, panDuration: 800, dwellMs: 0 },
} as const;

// Keep existing layout constants
export const SAFE_AREA = {
  /* unchanged */
};
export const ACHIEVEMENT_LAYOUT = {
  /* unchanged */
};
```

## New Files Needed

| File                                 | Purpose                                       | Size Estimate |
| ------------------------------------ | --------------------------------------------- | ------------- |
| `lib/hooks/use-camera-sequencer.ts`  | Camera animation hook consuming phase changes | ~60 lines     |
| `components/edges/animated-edge.tsx` | Custom edge with gradient + particle          | ~80 lines     |

**Note:** Soft skill badges and course nodes do NOT need new files -- they are new rendering cases within the existing `custom-node.tsx`.

## Files Modified

| File                                    | Change Description                                                         | Size of Change                |
| --------------------------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| `lib/stores/graph-store.tsx`            | Replace boolean state with phase state machine                             | Heavy rewrite                 |
| `components/sections/graph-section.tsx` | Replace timer cascade with phase-driven rendering + camera sequencer       | Heavy rewrite of reveal logic |
| `components/custom-node.tsx`            | Add click handlers, course node type, restyle soft-skill badges            | Moderate                      |
| `components/nodes/achievement-node.tsx` | Minor: ensure click-to-expand still works with new company expansion model | Minor                         |
| `lib/layout-constants.ts`               | Replace REVEAL_TIMING with PHASE_CAMERA_CONFIG                             | Moderate                      |
| `lib/layout-calculator.ts`              | Add course node positioning, adjust soft skill positions                   | Moderate                      |
| `lib/graph-utils.ts`                    | Register animated edge type, add course edges                              | Moderate                      |
| `data/resume-data.ts`                   | Add courses data                                                           | Minor                         |

## Suggested Build Order

Dependencies flow determines build order:

```
1. graph-store.tsx (state machine)     -- Foundation, everything depends on this
     |
2. layout-constants.ts (new config)   -- Camera config, used by hook
     |
3. use-camera-sequencer.ts (new hook) -- Depends on 1 + 2
     |
4. graph-section.tsx (orchestrator)    -- Depends on 1 + 3, heavy rewrite
     |
5. custom-node.tsx (click handlers)   -- Depends on 4 (handler wiring)
     |
6. animated-edge.tsx (new edge)       -- Independent, can be parallel with 5
     |
7. resume-data.ts + layout-calculator -- Course data + positioning
     |
8. Integration testing                 -- Everything together
```

### Phase-by-Phase Build Strategy

**Phase 1: State Machine Foundation**

- Rewrite `graph-store.tsx` with RevealPhase type
- Update `layout-constants.ts` with new timing model
- Create `use-camera-sequencer.ts` (stub that logs phase changes)
- **Verification:** Store tests pass, phases advance correctly

**Phase 2: Orchestrator Rewrite**

- Rewrite `graph-section.tsx` reveal logic
- Wire `useCameraSequencer` to actual setCenter calls
- Wire root node click to `advancePhase`
- **Verification:** Click root -> camera pans through companies in reverse chronological order

**Phase 3: Interaction Model**

- Modify `custom-node.tsx`: click-to-expand for companies
- Update `achievement-node.tsx` if needed
- **Verification:** After reveal completes, clicking companies expands achievements

**Phase 4: Visual Polish**

- Create `animated-edge.tsx` with gradients + particles
- Restyle soft-skill nodes as badges
- Add course node rendering
- **Verification:** Edges animate, badges look compact, courses display under Bilkent

**Phase 5: Data + Layout**

- Add course data to `resume-data.ts`
- Update `layout-calculator.ts` for course positioning
- Tune camera timing values
- **Verification:** Full cinematic flow from click to complete

## Anti-Patterns to Avoid

### Anti-Pattern 1: Animating Node Positions via React Flow

**Wrong:** Moving nodes smoothly by updating `position` in state on each frame.
**Why bad:** React Flow re-renders and re-calculates edge paths on every position change. This is expensive and produces janky movement.
**Instead:** Use React Flow's camera system (`setCenter`, `fitBounds`) which operates on the viewport transform (CSS transform on the canvas container), not individual node positions. This is GPU-accelerated and does not trigger React re-renders.

### Anti-Pattern 2: Timer-Based Camera Chaining

**Wrong:** `setTimeout(() => panTo(A), 1000); setTimeout(() => panTo(B), 3000);`
**Why bad:** Timers don't account for actual animation completion. If the browser is slow or the tab is backgrounded, animations pile up.
**Instead:** `await setCenter(A, { duration: 1000 }); await setCenter(B, { duration: 1000 });` -- Promise-based chaining guarantees proper sequencing.

### Anti-Pattern 3: Framer Motion for Edge Animations

**Wrong:** Using Framer Motion to animate SVG edge paths.
**Why bad:** Framer Motion operates on React elements. Edge paths are computed by React Flow and rendered as SVG `<path>` elements. Wrapping them in `motion.path` interferes with React Flow's internal edge rendering pipeline.
**Instead:** Use native SVG `<animateMotion>` for particles and SVG `<linearGradient>` for gradients. These are declarative SVG features that React Flow's rendering doesn't interfere with.

### Anti-Pattern 4: Multiple Expanded Companies

**Wrong:** Allowing multiple companies to be expanded simultaneously.
**Why bad:** Achievement nodes from different companies overlap in layout space. The layout calculator positions achievements relative to their parent company, and two expanded companies create visual chaos.
**Instead:** Only one company expanded at a time. Expanding a new company collapses the previous one.

### Anti-Pattern 5: Storing Camera State in Zustand

**Wrong:** Putting camera position/zoom in Zustand and syncing bidirectionally with React Flow.
**Why bad:** React Flow has its own internal viewport state. Syncing creates race conditions and infinite update loops.
**Instead:** Camera state lives exclusively in React Flow. The camera sequencer calls React Flow methods imperatively. Zustand stores only the phase (what should be happening), not the viewport (where the camera actually is).

## Performance Considerations

### Animation Frame Budget

At 60fps, each frame has 16.7ms. The reveal sequence involves:

1. Adding nodes to React state (~1ms per node, React batches these)
2. React Flow computing edge paths (~0.5ms per edge)
3. Framer Motion animating node entrance (~0ms, delegates to CSS transforms)
4. Camera pan via d3-zoom (~0ms, CSS transform on canvas)

**Total per frame during reveal:** Well under 16.7ms. No performance concerns for this graph size (~30 nodes, ~25 edges).

### SVG Particle Count

Each animated edge can optionally have a particle. With ~25 edges, that is 25 `<animateMotion>` elements. SVG animations are handled by the browser's compositor thread and do not block the main thread. This is negligible.

**Recommendation:** Only add particles to "career" and "education" edge types (the main trunk of the graph), not "project" edges. This keeps the visual hierarchy clean and limits particles to ~6.

### React Re-render Prevention

The biggest performance risk is unnecessary re-renders when the phase changes. Use Zustand selectors to ensure components only re-render when their specific slice of state changes:

```typescript
// GOOD: Only re-renders when phase.type changes
const phaseType = useGraphStore((s) => s.phase.type);

// BAD: Re-renders on ANY store change
const { phase, expandedCompany, advancePhase } = useGraphStore();
```

## Sources

**Codebase analysis (HIGH confidence):**

- `/Users/sunny/Desktop/Sunny/portfolio/components/sections/graph-section.tsx` -- Current orchestrator
- `/Users/sunny/Desktop/Sunny/portfolio/lib/stores/graph-store.tsx` -- Current state management
- `/Users/sunny/Desktop/Sunny/portfolio/components/custom-node.tsx` -- Current node rendering
- `/Users/sunny/Desktop/Sunny/portfolio/components/nodes/achievement-node.tsx` -- Current achievement cards
- `/Users/sunny/Desktop/Sunny/portfolio/lib/layout-calculator.ts` -- Current positioning algorithm
- `/Users/sunny/Desktop/Sunny/portfolio/lib/layout-constants.ts` -- Current timing constants
- `/Users/sunny/Desktop/Sunny/portfolio/lib/graph-utils.ts` -- Current edge generation
- `/Users/sunny/Desktop/Sunny/portfolio/data/resume-data.ts` -- Current data model

**React Flow API verification (HIGH confidence):**

- `@xyflow/react@12.10.0` type definitions at `node_modules/@xyflow/react/dist/esm/types/general.d.ts`
- `@xyflow/system@0.0.74` type definitions at `node_modules/.pnpm/@xyflow+system@0.0.74/.../types/general.d.ts`
- React Flow source implementation at `node_modules/@xyflow/react/dist/esm/index.mjs` (lines 516-547 for camera methods)
- Confirmed: `setCenter()` returns `Promise<boolean>`, accepts `{ duration, ease, zoom, interpolate }`
- Confirmed: `fitBounds()` returns `Promise<boolean>`, accepts `{ duration, ease, padding, interpolate }`
- Confirmed: `ease` parameter type is `(t: number) => number` (custom easing function)

**Architecture patterns (HIGH confidence, from codebase conventions):**

- `/Users/sunny/Desktop/Sunny/portfolio/.planning/codebase/ARCHITECTURE.md` -- Existing patterns
- `/Users/sunny/Desktop/Sunny/portfolio/.planning/codebase/STACK.md` -- Technology versions

---

_Architecture research: 2026-02-07_
