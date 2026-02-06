# Phase 10: Section Animation Migration - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace framer-motion entrance animations with CSS across four static content sections (about, metrics, timeline, tech stack). Each section must animate on scroll using the CSS keyframe infrastructure and IO polyfill from Phase 9. No visual regression — animations should feel the same or better. No framer-motion imports remain in these four sections after migration.

</domain>

<decisions>
## Implementation Decisions

### Animation fidelity

- Current animations across all four sections feel good — convert them, don't redesign
- Fidelity level is Claude's discretion per section: match closely where CSS can, use best CSS-native alternatives where spring physics don't translate
- Easing fallback for spring curves: Claude picks best approach per animation (closest cubic-bezier or clean ease-out)
- Each section keeps or unifies its animation style at Claude's discretion based on what works best in CSS

### Stagger choreography

- Stagger timing (delays between items): Claude's discretion per section based on item count and layout
- Stagger order: Claude's discretion per section layout (DOM order, current framer-motion order, or most natural)
- About section left/right entrance: Claude matches or improves on current framer-motion behavior
- Timeline entries: Claude picks between all-at-once with stagger delays vs per-entry scroll triggers based on what current framer-motion does and what works best in CSS

### Scroll trigger tuning

- Use the same -10% rootMargin from Phase 9 animation foundation as the baseline trigger threshold
- Already-visible-on-load behavior: Claude's discretion based on scroll position and section context
- Trigger config consistency: Claude uses uniform config unless a section clearly needs different treatment
- Replay behavior (animate on scroll back up): Claude matches current framer-motion behavior or picks most natural approach

### Reduced motion

- Approach per section: Claude's discretion — follow Phase 9 patterns (opacity-only fade at 0.4s, no transforms) as the baseline
- Stagger in reduced-motion mode: Claude's discretion on whether to keep stagger delays or show all items at once
- Testing level: Claude judges appropriate testing level for reduced-motion
- Standards: Claude follows best practices appropriate for a portfolio site

### Claude's Discretion

- Animation fidelity level per section (match exactly vs feels-the-same)
- Easing curve choices (cubic-bezier approximation vs standard ease-out)
- Whether sections keep distinct animation types or unify
- Stagger timing, order, and overlap per section
- About section simultaneous vs sequential column entrance
- Timeline per-entry vs section-level animation trigger
- Scroll replay behavior
- Already-in-view handling on page load
- Per-section trigger threshold variation
- Reduced-motion stagger behavior
- Reduced-motion testing depth

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User confirmed all current animations feel good and should be converted as-is. Phase 9's -10% rootMargin should be the scroll trigger baseline.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 10-section-animation-migration_
_Context gathered: 2026-02-07_
