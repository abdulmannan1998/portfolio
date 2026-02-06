# Codebase Concerns

**Analysis Date:** 2026-02-06

## Tech Debt

**Multiple untracked setTimeout/setInterval instances:**

- Issue: Heavy use of setTimeout without consistent cleanup patterns, scattered across components. Creates potential for memory leaks and dangling references after component unmount.
- Files: `app/page.tsx` (lines 197-206), `components/sections/graph-section.tsx` (lines 121-191), `components/dashboard-background.tsx` (lines 140-229), `components/mobile-hero.tsx` (lines 26-29)
- Impact: On repeated navigation or component remounts, timers may continue running in background. Rapid hover interactions over graph nodes trigger cascading setTimeout chains that don't guarantee cleanup.
- Fix approach: Consolidate timeout management using a ref-based cleanup strategy. Create a utility for tracked timeouts with guaranteed cleanup in useEffect returns. Example: track all IDs and clear in cleanup phase.

**Debounce function lacks cleanup signal:**

- Issue: `lib/debounce.ts` implements debounce but timeout reference is never returned or tracked externally. If component unmounts mid-debounce, the pending timeout executes against unmounted state.
- Files: `lib/debounce.ts` (lines 1-10), consumed by `components/sections/graph-section.tsx` (lines 41-52)
- Impact: fitView() may be called on unmounted ReactFlow instance, causing React warnings or silent errors.
- Fix approach: Return cleanup function from debounce or use AbortController pattern. At minimum, check if component is still mounted before executing.

**Large reveal sequence with hardcoded delays:**

- Issue: `components/sections/graph-section.tsx` startRevealSequence (lines 165-192) chains 7+ setTimeout calls with hardcoded delays (200ms, REVEAL_TIMING constants). If any timeout is interrupted, sequence breaks partially visible.
- Files: `components/sections/graph-section.tsx` (lines 165-192), `lib/layout-constants.ts` (timing config)
- Impact: Fragile animation sequence. Browser tab backgrounding suspends timers; switching tabs leaves graph in inconsistent state. No recovery mechanism.
- Fix approach: Replace setTimeout chains with requestAnimationFrame or animation libraries. Consider using Framer Motion's orchestration for sequence control.

**Graph store state not persisted or validated:**

- Issue: `lib/stores/graph-store.tsx` tracks expandedNodes, hasStartedReveal, revealedCompanies in memory only. No validation on state shape. If store gets out of sync with UI nodes, clicking already-revealed companies re-triggers animations.
- Files: `lib/stores/graph-store.tsx` (entire file)
- Impact: User interactions can corrupt state leading to duplicate node reveals or broken UI. No way to recover without page refresh.
- Fix approach: Add state validation on every action. Log state changes in development. Add a "reset" action. Consider sessionStorage for persistence across accidental reloads.

**Inline external API call without rate limiting:**

- Issue: `app/page.tsx` GitHubActivity component (lines 219-240) fetches GitHub API on every component mount without caching or rate limiting. No backoff strategy.
- Files: `app/page.tsx` (lines 225-240)
- Impact: Rapid navigation to page triggers duplicate API calls. GitHub API is public but rate-limited to 60 req/hour for unauthenticated. Multiple portfolio visitors could deplete quota.
- Fix approach: Implement request deduplication using AbortController. Cache response with stale-while-revalidate pattern. Consider server-side caching layer.

## Known Bugs

**Graph dimensions initialize to 0 during initial layout:**

- Symptoms: First graph render shows nodes at origin (0,0) then repositions. ResizeObserver doesn't fire until next frame. Layout calculations use stale dimensions.
- Files: `components/sections/graph-section.tsx` (lines 30-35, 201-221)
- Trigger: Page load or switching to graph section - ResizeObserver async timing
- Workaround: Debounced fitView hides jank but doesn't fix root cause

**Soft skill node animation duration non-deterministic:**

- Symptoms: Floating animation on soft-skill nodes has variable duration per render due to `Math.random()` at module load time.
- Files: `components/custom-node.tsx` (line 9)
- Trigger: Every component mount computes a new random value, creating animation jitter
- Workaround: Animation loop is infinite so users don't notice, but inconsistent

**Company/achievement hover state leaks across rapid interactions:**

- Symptoms: Hovering quickly over multiple companies can cause nodes to remain visible or hide unexpectedly. Store state can get ahead of UI rendering.
- Files: `components/sections/graph-section.tsx` (lines 87-134, handleNodeHover logic)
- Trigger: Mouse over company → leave → hover different company within 200ms
- Workaround: None visible - requires careful clicking

## Security Considerations

**GitHub API endpoint exposes public events without authentication:**

- Risk: Public API call to `https://api.github.com/users/{username}/events/public` sends username in plaintext URL. Response includes repository names and commit messages which could reveal private work details if public repos contain sensitive info.
- Files: `app/page.tsx` (line 228)
- Current mitigation: Only public events are queried, and data is displayed on public portfolio
- Recommendations: Add rate-limit headers check. Log failed requests for monitoring. Consider proxying through own API to add caching and error handling.

**External CDN icons loaded without integrity checks:**

- Risk: Tech stack icons loaded from `cdn.jsdelivr.net` without SRI (Subresource Integrity). CDN compromise could inject malicious SVGs.
- Files: `app/page.tsx` (lines 45-114, techStack array)
- Current mitigation: Icons are purely display assets, not executable
- Recommendations: Add integrity attribute to img tags or download and bundle locally. Validate icon URLs against whitelist.

**No Content Security Policy headers configured:**

- Risk: Missing CSP allows arbitrary script execution. Framer Motion animations + dynamic imports could be injection vector.
- Files: Configuration (next.config.ts has no CSP)
- Current mitigation: None
- Recommendations: Add CSP header in next.config.ts: `'self'` for scripts, `data:` and `blob:` for Framer Motion inline styles. Restrict external domains.

## Performance Bottlenecks

**ResizeObserver thrashing on graph container:**

- Problem: ResizeObserver on graph container (lines 205-220) debounces at 100ms but triggers fitView immediately. Multiple rapid resizes queue up expensive layout recalculations.
- Files: `components/sections/graph-section.tsx` (lines 201-221), `lib/layout-calculator.ts`
- Cause: Every dimension change recalculates all node positions via getTimelinePositions(). No viewport memoization beyond basic dimensions.
- Improvement path: Separate dimension tracking from node repositioning. Cache layout state keyed by (width, height). Batch fitView calls with requestAnimationFrame.

**Achievement node cascade reveals cause frame drops:**

- Problem: Revealing 12+ achievement nodes simultaneously with staggered animations (0.15s between each) causes layout thrashing. Each new node triggers edge calculation and edge drawing.
- Files: `components/sections/graph-section.tsx` (lines 103-117), `lib/layout-calculator.ts` (lines 269-306)
- Cause: setNodes and setEdges called sequentially in setTimeout loops. No batching of state updates.
- Improvement path: Batch all node/edge updates into single React state call. Use createPortal or virtual list for off-screen nodes. Defer edge rendering until nodes settle.

**Large SVG icons re-render on every page load:**

- Problem: techStack array (lines 42-115) with 18 icon URLs creates inline img tags. No lazy loading or virtualization.
- Files: `app/page.tsx` (lines 553-574)
- Cause: All icons load immediately even if below fold. Each icon is separate fetch + decode cycle.
- Improvement path: Virtualize icon grid using react-window. Lazy load with IntersectionObserver. Use SVG sprites instead of individual CDN fetches.

**GitHub Activity component fetches on every mount:**

- Problem: No request memoization or caching. Navigating between pages triggers redundant API calls.
- Files: `app/page.tsx` (lines 219-240)
- Cause: useEffect dependency array is [username] only - no caching layer
- Improvement path: Cache response in component state with timestamp. Implement stale-while-revalidate: serve cache while refetching in background. Add AbortController to cancel in-flight requests on unmount.

## Fragile Areas

**Graph reveal sequence orchestration:**

- Files: `components/sections/graph-section.tsx` (startRevealSequence, lines 165-192)
- Why fragile: Tight coupling between setTimeout delays, store state mutations, and node/edge rendering. If any setTimeout fires out of order or gets skipped, visible graph becomes inconsistent with store state. Mocking store in tests is required or integration breaks.
- Safe modification: Add invariant checks after each reveal step. Log state before/after each setTimeout. Test with slower browsers/networks by increasing delays. Consider creating a reveal state machine instead.
- Test coverage: No visible tests for this sequence. Recommend adding Cypress E2E test that steps through reveal and asserts node visibility at each stage.

**Custom node animation variants computed at render:**

- Files: `components/custom-node.tsx` (lines 74-107, getAnimationConfig)
- Why fragile: Variants object recreated on every invocation. If Framer Motion does reference checks, missing key updates could cause animation to skip. Animation type prop change mid-animation won't update transition config.
- Safe modification: Memoize getAnimationConfig return values. Test animation type changes during flight. Add storybook stories for each node type with animation.
- Test coverage: No unit tests for animation logic.

**Layout calculator position math assumes specific node count and order:**

- Files: `lib/layout-calculator.ts` (getTimelinePositions, lines 143-310)
- Why fragile: Hardcoded timelineConfig keys (lines 202-217) assume exactly 3 companies in specific order (Bilkent, Layermark, Intenseye). Adding a 4th company breaks spacing math. Achievement staggering math (line 281) assumes even/odd pattern.
- Safe modification: Add assertions at function start. Validate against RESUME_DATA schema. Use data-driven positioning instead of hardcoded indexes.
- Test coverage: Layout calculator has no unit tests.

**Zustand store doesn't validate incoming data:**

- Files: `lib/stores/graph-store.tsx` (lines 20-51)
- Why fragile: Store accepts any string for nodeId/companyId without validation. Typos in hover handlers won't be caught. Store can grow unbounded (no max size on arrays).
- Safe modification: Add Zod schema for store state. Validate inputs. Add max length limits. Log all mutations in dev mode.
- Test coverage: No tests.

## Scaling Limits

**Node count ceiling:**

- Current capacity: 1-12 achievement nodes (as deployed). Linear cascade animation means each node adds 100-150ms to reveal sequence. ~15 nodes hits 2.5s delay.
- Limit: Beyond 20-30 nodes, animation becomes laggy and off-screen nodes cause jank.
- Scaling path: Switch to virtual scrolling for node list. Use layer-based rendering (Pixi.js or similar) instead of DOM nodes. Pre-calculate all positions server-side, send as data.

**API rate limiting with public GitHub:**

- Current capacity: 60 requests/hour for unauthenticated public API (GitHub limit)
- Limit: Multiple concurrent visitors each trigger fetch on mount = capacity exhausted quickly
- Scaling path: Proxy through own backend with caching layer (Redis). Implement GitHub OAuth for higher rate limits (5000 req/hour).

**CSS-in-JS runtime calculation on every render:**

- Current capacity: Inline styles for Framer Motion animations work fine for 1 portfolio page
- Limit: If this becomes template for 100 portfolios, runtime animation calculation \* 100 instances = noticeable CPU load
- Scaling path: Extract animation variants to CSS modules or CSS-in-JS library that optimizes at build time (styled-components, emotion). Use CSS animations instead of JS for offscreen nodes.

## Dependencies at Risk

**React Flow @xyflow/react ^12.10.0:**

- Risk: Major version (^12) means auto-upgrade to 12.x. The fitting + layout algorithms are central to graph rendering. Breaking changes in fit/positioning could break layout.
- Impact: Graph could stop rendering correctly after npm upgrade
- Migration plan: Lock to exact version (12.10.0) temporarily. When upgrading, verify fitViewOptions API hasn't changed. Test layout on multiple viewport sizes.

**Zustand ^5.0.11:**

- Risk: State management is critical. Zustand has had API changes between major versions (v3→v4→v5). If TypeScript types change, store could break.
- Impact: Component state becomes unreliable
- Migration plan: Lock version. When upgrading, run full integration tests on graph reveal sequence. Check TypeScript types for breaking changes.

**Framer Motion ^12.31.0:**

- Risk: Animation library. Major version upgrades sometimes change timing calculations or easing curves, causing animations to feel different.
- Impact: Reveals sequence animations could feel broken or out of sync
- Migration plan: Lock version. When upgrading, visually compare animations across browsers using visual regression tests.

## Missing Critical Features

**No error recovery for graph failures:**

- Problem: If ReactFlow fails to initialize or nodes fail to render, no fallback UI. User sees blank space.
- Blocks: Graceful degradation for older browsers
- Recommendation: Add try/catch boundary. Show fallback static text representation of graph. Log errors to monitoring service.

**No loading state for GitHub Activity:**

- Problem: Loading skeleton shows, but if API takes >3s, no indication. User might think it's broken.
- Blocks: Better UX for slow networks
- Recommendation: Show skeleton with timeout fallback. Display "Unable to load - check back later" after 5s. Add retry button.

**No analytics on graph interactions:**

- Problem: No visibility into which nodes users hover over or interact with. Can't measure engagement.
- Blocks: Iterating on portfolio based on what works
- Recommendation: Add basic event tracking (Firebase Analytics or Posthog) for node reveal sequence and hover events.

## Test Coverage Gaps

**No tests for graph reveal sequence:**

- What's not tested: The entire startRevealSequence orchestration. setTimeout chains, state mutations, node/edge additions all untested.
- Files: `components/sections/graph-section.tsx` (lines 165-192)
- Risk: Critical user flow could break silently. Refactoring layout logic could cause regressions.
- Priority: High - this is the main interactive feature

**No tests for layout calculations:**

- What's not tested: getTimelinePositions algorithm. Position math for achievements under companies. Safe area calculations.
- Files: `lib/layout-calculator.ts` (entire file)
- Risk: Layout calculations could drift across viewport sizes. Adding new nodes could break positioning.
- Priority: High - directly affects rendering

**No tests for Zustand store:**

- What's not tested: Store mutations, state transitions, store cleanup
- Files: `lib/stores/graph-store.tsx` (entire file)
- Risk: Store state could become inconsistent with UI. Reveal sequence could enter bad state undetected.
- Priority: Medium

**No tests for GitHub API integration:**

- What's not tested: Error handling, rate limiting, timeout scenarios
- Files: `app/page.tsx` (lines 225-240, GitHubActivity component)
- Risk: API failures crash component or show confusing errors
- Priority: Medium

**No visual regression tests for animations:**

- What's not tested: Animations look correct across browsers. No frame rate regressions.
- Files: `components/custom-node.tsx`, `components/sections/graph-section.tsx`
- Risk: Subtle animation timing issues missed until production
- Priority: Low - visual polish, not critical

---

_Concerns audit: 2026-02-06_
