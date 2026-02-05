# Codebase Concerns

**Analysis Date:** 2026-02-05

## Tech Debt

**Hardcoded Timeline Reveal Sequence:**

- Issue: Node reveal timing is hardcoded with magic numbers (1200ms, 1700ms, 2200ms for specific companies) in `DashboardBackgroundInner`
- Files: `components/dashboard-background.tsx` (lines 177-206)
- Impact: Cannot easily add new companies or reorder them without editing component logic. Timeline becomes brittle if node load times vary
- Fix approach: Extract reveal timing to configuration object keyed by node ID, make timing data-driven from resume-data.ts

**Magic Spacing Values Scattered Across Layout Calculator:**

- Issue: Hardcoded numeric values for safe area calculation (140 header, 220 metrics, 240 left margin) and achievement positioning (200 spacing, 250 offset, 150 stagger)
- Files: `lib/layout-calculator.ts` (lines 13-18, 144-145, 212-214), `lib/graph-utils.ts` (lines 13-18)
- Impact: Difficult to maintain responsive behavior across viewport sizes. Changes to header/metrics height require hunting through multiple files
- Fix approach: Create centralized constants file (e.g., `lib/layout-constants.ts`) with all spacing, margins, and positioning values

**Manual Ref Management for Graph State:**

- Issue: Component uses multiple refs to track state that could be managed in Zustand store: `allNodesRef`, `allEdgesRef`, `addedAchievementsRef`, `handleNodeHoverRef`
- Files: `components/dashboard-background.tsx` (lines 46-51, 60-63)
- Impact: Difficult to debug state flow, stale closure issues (partially addressed with ref updates in line 135-137), and graph state not synchronized with store
- Fix approach: Move `allNodes`, `allEdges`, `addedAchievements` tracking to `useGraphStore` in `lib/stores/graph-store.tsx`

**Unused Graph Store Features:**

- Issue: `useGraphStore` has complete filter, highlighting, and view mode infrastructure that is never used in UI
- Files: `lib/stores/graph-store.tsx` (lines 21-31, 66-95), no corresponding component implementation
- Impact: Dead code increases bundle size; unclear if filtering/highlighting was planned feature or abandoned
- Fix approach: Either implement filter UI or remove unused reducer functions from store

## Performance Bottlenecks

**ResizeObserver with 100ms Debounce in Layout Calculator:**

- Problem: `DashboardBackgroundInner` uses `ResizeObserver` with 100ms debounce for every graph dimension change, which retriggers node position calculations via `getTimelinePositions`
- Files: `components/dashboard-background.tsx` (lines 217-237, 240-260)
- Cause: Layout recalculates all 50+ achievement node positions on resize instead of incremental updates
- Improvement path: Separate viewport changes from layout calculations; cache positioned nodes and only update changed ones

**Sequential setTimeout Chain for Node Reveal:**

- Problem: 7+ sequential `setTimeout` calls with 200-500ms intervals mean initial reveal takes 2.2+ seconds before final fitView
- Files: `components/dashboard-background.tsx` (lines 173-206)
- Cause: Each stage (soft skills, education, companies) waits for previous stage completion
- Improvement path: Use Promise.all for parallel revealing where timing permits, or CSS animation-delay for hardware-accelerated timing

**Multiple fitViewSmooth Calls with setTimeout:**

- Problem: `fitViewSmooth` is called 7+ times during reveal sequence, each wrapped in 50ms setTimeout, plus called again on dimension change
- Files: `components/dashboard-background.tsx` (lines 68-75, 127, 186, 193, 199, 205, 259)
- Cause: Inefficient React Flow animation batching
- Improvement path: Batch fitView calls into single debounced operation after all node additions complete

**getTimelinePositions Recalculates All Nodes:**

- Problem: Function accepts all nodes including achievements but recalculates positions for all 50+ nodes on every dimension change
- Files: `lib/layout-calculator.ts` (lines 92-254)
- Cause: No memoization or incremental update logic
- Improvement path: Memoize node positions by viewport size, only recalculate when safe area dimensions change significantly

**Dynamic Framer Motion Animations on Every Render:**

- Problem: `CustomNode` and `AchievementNode` create animation objects on render, each with unique timing
- Files: `components/custom-node.tsx` (lines 12-54), `components/nodes/achievement-node.tsx` (lines 76-87)
- Cause: Animations defined within component body instead of memoized outside
- Improvement path: Extract animation variants to module-level constants, use `useMemo` for dynamic delays

## Fragile Areas

**DashboardBackground Component - Complex State Management:**

- Files: `components/dashboard-background.tsx` (331 lines)
- Why fragile: Uses 8+ refs, 3 useState hooks, 2 useCallback handlers, 4 useEffect blocks with interdependencies. Node expansion logic depends on ref tracking that bypasses React state
- Safe modification: Add tests for reveal sequence before refactoring; extract ref management into custom hook; move achieved-nodes tracking to store
- Test coverage: Zero test coverage for reveal sequence timing, hover-to-expand logic, dimension-dependent positioning

**Layout Calculator - Magic Numbers and No Input Validation:**

- Files: `lib/layout-calculator.ts` (254 lines)
- Why fragile: 10+ numeric constants control layout; no validation of node type values; grid layout for achievements assumes specific ordering (even/odd index logic at lines 230-231)
- Safe modification: Add JSDoc with rationale for each constant; validate node.type against enum; add bounds checking for viewport dimensions
- Test coverage: No tests for edge cases (small viewports, many achievements, missing companies)

**Achievement Node Click Handler - Event Bubbling:**

- Files: `components/nodes/achievement-node.tsx` (line 49-56)
- Why fragile: Uses `e.stopPropagation()` to prevent graph pan/zoom; ReactFlow may have conflicting pointer handlers
- Safe modification: Verify ReactFlow pointer event handling hasn't changed in @xyflow/react 12.10.0; test click on achievement doesn't pan graph
- Test coverage: No integration tests for node click within ReactFlow graph

**Custom Node Hover Handler - Ref Closure Issue:**

- Files: `components/dashboard-background.tsx` (lines 79-137, 145-151)
- Why fragile: `handleNodeHoverRef` must be kept in sync with `handleNodeHover` callback via useEffect; if out of sync, hover reveals wrong achievements
- Safe modification: Strongly type ref callback; add warning if ref gets stale (e.g., via exhaustive deps check)
- Test coverage: No tests for hover reveal edge cases (rapid hover, hover multiple companies)

**Resume Data - Single Source of Truth:**

- Files: `data/resume-data.ts` (488 lines)
- Why fragile: All graph structure, achievements, and metrics tied to single file; changes require coordinating IDs across graph.nodes, graph.edges, achievements arrays
- Safe modification: Add validation function that checks edge.source/target exist in nodes; validate achievement IDs match edge targets
- Test coverage: No validation that data structure is consistent

## Type Safety Concerns

**Implicit any in Layout Calculator:**

- Issue: Line 83 uses `[key: string]: any` to allow flexible node data
- Files: `lib/layout-calculator.ts` (line 83)
- Impact: Type checker can't catch missing `label` or `title` properties on achievement nodes
- Recommendation: Replace with discriminated union: `type GraphNode = { id: string; type: string } & (RootNodeData | CompanyNodeData | AchievementNodeData)`

**Generic Achievement Node Data Spread:**

- Issue: `layout-calculator.ts` spreads all properties from achievement node into Node position data without type validation
- Files: `lib/layout-calculator.ts` (lines 240-245)
- Impact: Extra properties bloat Redux state; component data prop type is inferred as `any`
- Recommendation: Create strict `AchievementNodeDisplayData` type with only needed fields

**Zustand Store Uses Set<string> Without Serialization:**

- Issue: `expandedNodes` and `highlightedConnections` are `Set<string>`, not JSON-serializable
- Files: `lib/stores/graph-store.tsx` (lines 15, 21)
- Impact: State persisting/debugging tools won't work; hydration from localStorage/URL will fail
- Recommendation: Use `string[]` arrays instead of `Set`; filter duplicates in actions

## Security Considerations

**No Input Validation on Resume Data:**

- Risk: If resume-data.ts is ever user-generated or fetched from API, malformed data (missing IDs, circular edges, XSS in titles) could break UI
- Files: `data/resume-data.ts` (entire file), `lib/layout-calculator.ts` (lines 92-254)
- Current mitigation: Data is hardcoded, but no validation function exists
- Recommendations: Add `validateResumeData()` function; sanitize strings through a whitelist of allowed HTML; validate edge source/target exist in node set

**Dynamic Content in motion.div:**

- Risk: Achievement titles and descriptions rendered in motion.div without sanitization if ever user-provided
- Files: `components/nodes/achievement-node.tsx` (lines 145-146, 159-161, 168-170)
- Current mitigation: Content is hardcoded; React escapes by default
- Recommendations: If achievement data becomes dynamic, use `dangerouslySetInnerHTML` only after sanitizing with DOMPurify

## Missing Critical Features

**No Test Coverage:**

- Problem: Zero test files despite complex graph layout logic and state management
- Blocks: Confidence in refactoring; hard to catch regressions in animation timing, reveal sequence, responsive behavior
- Recommendation: Add Jest setup; write tests for layout-calculator positioning (snapshot + unit tests for spacing math); test graph reveal sequence timing

**No Accessibility Support (a11y):**

- Problem: Graph navigation is mouse-only; no keyboard support, no ARIA labels, low contrast text on some states
- Blocks: Keyboard users, screen readers, high-contrast mode users cannot use graph
- Recommendation: Add keyboard navigation (arrow keys to select nodes, Enter to expand); add ARIA roles and descriptions

**No Error Boundaries:**

- Problem: If `getInitialNodes()` or `getTimelinePositions()` throws, entire page crashes with no fallback
- Blocks: Silent failures if resume-data structure changes unexpectedly
- Recommendation: Wrap DashboardBackground with ErrorBoundary; add try-catch in layout calculation with console warning

**No Mobile Graph Fallback:**

- Problem: ReactFlow hidden on mobile; MobileHero component has static role/achievement list with no graph visualization
- Blocks: Mobile users cannot explore career graph structure (only see timeline list)
- Recommendation: Either render simplified reactive graph on mobile, or document why graph cannot work on small screens

## Test Coverage Gaps

**Layout Calculation - No Tests:**

- What's not tested: `getTimelinePositions()` positioning logic; responsive spacing calculations; edge cases (0 width/height, 1 node, 50 nodes)
- Files: `lib/layout-calculator.ts` (entire file)
- Risk: Changes to layout algorithm could break without immediate feedback; regression on viewport size changes hard to catch
- Priority: High - core to visual integrity

**Graph Reveal Sequence - No Tests:**

- What's not tested: Timing of node reveals; hover-expand behavior; fitView animation batching; node addition order
- Files: `components/dashboard-background.tsx` (entire file)
- Risk: Accidental changes to setTimeout timings or reveal order go unnoticed; user experience regresses subtly
- Priority: High - core to interaction

**Store Actions - No Tests:**

- What's not tested: Expand/collapse node; add/remove from expanded set; filter state mutations
- Files: `lib/stores/graph-store.tsx` (entire file)
- Risk: Store logic bugs cascade through multiple components; state mutations can cause stale closures
- Priority: Medium - good integration test candidates

**Responsive Behavior - No Tests:**

- What's not tested: Hook breakpoint detection; layout calculation on resize; mobile vs desktop branch selection
- Files: `hooks/use-responsive-layout.ts`, `components/dashboard-background.tsx` (dimension handling)
- Risk: Responsive issues only caught manually; regression on small viewports goes unnoticed
- Priority: Medium - impacts mobile users

## Dependencies at Risk

**Zustand 5.0.11 - Imminent Major Version (6.x):**

- Risk: Zustand 6.0 may introduce breaking changes to store pattern used here
- Impact: Requires rewrite of all Zustand hooks if migration enforces new API
- Migration plan: Pin version to ^5.0.11; monitor Zustand releases; create wrapper hook `useGraphStoreCompat` for easy migration

**@xyflow/react 12.10.0 - Pointer Events Fragile:**

- Risk: ReactFlow's pointer event handling depends on DOM event flow; custom stopPropagation in achievement nodes could conflict with future versions
- Impact: Node clicks or pans may behave unexpectedly after ReactFlow update
- Migration plan: Add integration tests for click/pan behavior before updating; keep detailed notes on why stopPropagation is needed

**Framer Motion 12.31.0 - Animation Timing Sensitive:**

- Risk: Framer Motion layout animations depend on internal React reconciliation; layout prop may change in future versions
- Impact: Achievement node expand/collapse animation could break or perform differently
- Migration plan: Test animation behavior after React/Framer Motion updates; capture initial animation in snapshot test

## Scaling Limits

**Node Count - Rendering Performance:**

- Current capacity: ~50 achievement nodes + 5 timeline nodes render smoothly on desktop
- Limit: Adding 200+ achievement nodes will cause perceptible lag due to:
  1. getTimelinePositions recalculating all positions
  2. All nodes passed to ReactFlow at once (no virtualization)
  3. Multiple animation variants created per render
- Scaling path: Implement virtual scrolling with React Flow; lazy-load achievements; batch position calculations; use requestAnimationFrame

**Graph Complexity - Layout Stability:**

- Current capacity: 3 companies with ~10 achievements each works well; edges layout is staggered
- Limit: 10+ companies will create visual sprawl; achievement node stagger logic assumes 3 companies (lines 220-225)
- Scaling path: Implement multi-column layout; make stagger pattern adaptive; add zoom-focus on selected company

**Viewport Changes - Resize Performance:**

- Current capacity: ResizeObserver handles frequent resizes down to 100ms
- Limit: Very rapid resizes (e.g., dragging window edge) will queue up expensive position recalculations
- Scaling path: Use ResizeObserver with requestAnimationFrame instead of setTimeout; batch updates; measure and debounce more aggressively

---

_Concerns audit: 2026-02-05_
