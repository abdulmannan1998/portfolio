---
phase: 13-state-machine-foundation
plan: 01
subsystem: ui
tags: [state-machine, reactflow, framer-motion, zustand, graph-visualization]

# Dependency graph
requires:
  - phase: 10-client-boundary-extraction
    provides: Client component boundaries and server/client separation
provides:
  - Reveal state machine with idle/revealing/revealed/aborted phases
  - Click-triggered career graph reveal (removed mouse-enter auto-trigger)
  - Reverse-chronological reveal order (Intenseye → Layermark → Bilkent)
  - Clean timer abort handling via centralized registration
  - Removed all fitView/debouncedFitView calls (prep for Phase 14 camera)
affects: [14-camera-choreography, 15-achievement-badges, 16-animated-edges]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - State machine pattern for animation sequencing (idle/revealing/revealed/aborted)
    - Timer registration pattern for clean abort handling
    - Click-to-reveal user interaction (explicit user intent vs auto-trigger)

key-files:
  created: []
  modified:
    - lib/stores/graph-store.tsx
    - lib/layout-constants.ts
    - components/sections/graph-section.tsx
    - components/custom-node.tsx

key-decisions:
  - "Replaced setTimeout cascade with state machine for reveal sequencing"
  - "Removed fitView entirely to prepare for manual camera choreography in Phase 14"
  - "Changed trigger from mouse-enter (automatic) to click (explicit user intent)"
  - "Centralized timer registration in store for clean abort handling"

patterns-established:
  - "State machine pattern: idle → revealing → revealed (or aborted on unmount)"
  - "Timer lifecycle: register on create, abort clears all registered timers"
  - "Root node click handler pattern: data.onClickReveal callback"

# Metrics
duration: 4min
completed: 2026-02-07
---

# Phase 13 Plan 01: State Machine Foundation Summary

**Click-triggered career reveal with state machine sequencing (Intenseye → Layermark → Bilkent) and all fitView calls removed for Phase 14 camera choreography**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-07T12:46:36Z
- **Completed:** 2026-02-07T12:50:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- State machine replaces setTimeout cascade for reveal sequencing with clean abort handling
- Click-to-reveal replaces mouse-enter auto-trigger (explicit user intent, better UX)
- Reverse-chronological reveal order (Intenseye → Layermark → Bilkent) matches career timeline
- All fitView/debouncedFitView removed, preparing for manual camera choreography in Phase 14
- Root node shows "Click to explore career" hint that fades when reveal starts

## Task Commits

Each task was committed atomically:

1. **Task 1: Add reveal state machine to graph store and update timing constants** - `f8ac360` (refactor)
2. **Task 2: Wire click-to-reveal, state machine sequencing, and remove fitView** - `4f5119c` (feat)

## Files Created/Modified

- `lib/stores/graph-store.tsx` - Added RevealPhase state machine (idle/revealing/revealed/aborted) with beginReveal/advanceReveal/abortReveal actions and timer registration
- `lib/layout-constants.ts` - Added REVEAL_SEQUENCE (reverse-chronological order), SOFT_SKILL_NODE_IDS constant, deprecated REVEAL_TIMING
- `components/sections/graph-section.tsx` - Removed fitView/debouncedFitView entirely, removed mouse-enter trigger, added handleClickReveal with state machine sequencing, registers all timers for clean abort
- `components/custom-node.tsx` - Added onClickReveal callback to root node data type, added click handler to root node, added "Click to explore career" hint with fade-out animation

## Decisions Made

- **State machine over setTimeout cascade:** Enables clean interruption handling and clear reveal lifecycle phases
- **Click-to-reveal over mouse-enter:** Explicit user intent prevents accidental triggers, better mobile support
- **Remove fitView entirely:** Phase 14 will implement manual camera choreography, fitView would conflict with custom camera movements
- **Centralized timer registration:** All timers registered in store allow single abortReveal() call to clean up all pending timers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type mismatch in setNodes initial state:**

- **Issue:** Initial node state type was too narrow (only root node with onClickReveal/isRevealing), causing type errors when adding achievement nodes with different data shapes
- **Solution:** Changed useNodesState initialization to use generic Node type, then use effects to layer on onClickReveal and isRevealing props to root node specifically
- **Outcome:** Type-safe, allows heterogeneous node data shapes

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

✅ **Ready for Phase 14 (Camera Choreography):**

- State machine provides clean hooks for camera triggers (beginReveal, advanceReveal, revealed state)
- All fitView removed - no conflicts with manual camera movements
- REVEAL_SEQUENCE provides timing constants for camera coordination

✅ **Ready for Phase 15 (Achievement Badges):**

- Root node click pattern established
- State machine can be extended with badge-specific phases if needed

✅ **Ready for Phase 16 (Animated Edges):**

- revealStep in state machine can trigger edge animations
- Timer registration pattern works for edge animation timers too

---

_Phase: 13-state-machine-foundation_
_Completed: 2026-02-07_

## Self-Check: PASSED
