# Phase 9: Animation Foundation - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

CSS keyframe animation infrastructure and hero parallax extraction. This phase creates the foundation (keyframes, polyfill, hero wrapper) so Phases 10-12 can migrate animations off framer-motion without touching page-level concerns. No section animations are migrated here -- only the infrastructure and hero extraction.

</domain>

<decisions>
## Implementation Decisions

### Animation timing & feel

- Trigger-based animations (enter viewport -> play at fixed duration), not progress-based scroll mapping
- Stagger approach, easing, and duration at Claude's discretion -- match current framer-motion character, with freedom to refine slightly if CSS feels better

### Scroll trigger behavior

- Trigger-based: element enters viewport, animation plays at fixed duration
- Replay behavior, trigger threshold, and reversal at Claude's discretion -- pick what feels natural for a portfolio site

### Polyfill strategy

- animation-timeline: view() for Chrome, Intersection Observer fallback for Safari/Firefox
- Polyfill source (custom vs library), fidelity level, browser support scope, and bundle size tradeoffs at Claude's discretion
- Balance polish vs bundle size based on current project state

### Hero parallax extraction

- Extract parallax scroll logic from page.tsx into its own client wrapper component
- Hero wrapper must accept server-rendered children (component API pattern at Claude's discretion)
- Parallax intensity and mobile behavior at Claude's discretion -- match current feel, adjust if extraction reveals improvement opportunities
- Standard GPU-acceleration best practices for performance

### Claude's Discretion

- Animation timing: exact durations, easing curves, stagger delays
- Reduced-motion handling approach
- Polyfill implementation choice (custom IO wrapper vs npm package)
- Browser support targets (modern evergreen baseline)
- Hero component API pattern (children vs props)
- Parallax mobile behavior (disable vs keep)
- Performance optimization approach

</decisions>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches. User expressed trust in Claude's judgment across all areas with one explicit choice: trigger-based animations over progress-based scroll mapping.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

_Phase: 09-animation-foundation_
_Context gathered: 2026-02-07_
