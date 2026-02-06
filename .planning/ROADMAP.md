# Roadmap: Portfolio

## Milestones

- ✅ **v1.0 Portfolio Cleanup** - Phases 1-5 (shipped 2026-02-05)
- ✅ **v1.1 Codebase Polish** - Phases 6-8 (shipped 2026-02-07)
- 🚧 **v1.2 SSR Migration** - Phases 9-14 (in progress)

## Phases

<details>
<summary>v1.0 Portfolio Cleanup (Phases 1-5) - SHIPPED 2026-02-05</summary>

See MILESTONES.md for details.

</details>

<details>
<summary>v1.1 Codebase Polish (Phases 6-8) - SHIPPED 2026-02-07</summary>

See MILESTONES.md for details.

</details>

### v1.2 SSR Migration (In Progress)

**Milestone Goal:** Restructure the portfolio from a fully client-rendered app to a server-first architecture, leveraging server components, ISR, CSS animations, and Partial Prerendering.

- [x] **Phase 9: Animation Foundation** - CSS keyframe infrastructure and hero parallax extraction
- [ ] **Phase 10: Section Animation Migration** - Replace framer-motion entrance animations with CSS across four sections
- [ ] **Phase 11: Server-side GitHub Fetching** - Move GitHub data to server with ISR, eliminate loading flash
- [ ] **Phase 12: Utility Component Conversion** - Convert marquee, stars, counter, legend, preloader to server/CSS
- [ ] **Phase 13: Server Component Page** - Remove "use client" from page.tsx with clean client boundaries
- [ ] **Phase 14: PPR & Image Optimization** - Enable Partial Prerendering with streaming and next/image

## Phase Details

### Phase 9: Animation Foundation

**Goal**: CSS animation infrastructure exists and hero parallax is isolated so subsequent phases can migrate animations without touching page-level concerns
**Depends on**: Phase 8 (v1.1 complete)
**Requirements**: ANIM-01, ANIM-06, ANIM-07, RSC-02
**Plans**: 2 plans
**Success Criteria** (what must be TRUE):

1. CSS keyframe animations (fade-in-up, fade-in-down, fade-in-left, scale-in) are defined in globals.css and can be applied to any element via class names
2. Hero section parallax scroll effect works identically to current behavior but the scroll logic lives in its own client wrapper component, not in page.tsx
3. A test element with animation-timeline: view() animates on scroll in Chrome, and an Intersection Observer polyfill activates the same animation in Safari/Firefox
4. Hero wrapper accepts server-rendered children (static content passed as props/children, not rendered inside the client component)

Plans:

- [x] 09-01-PLAN.md -- CSS keyframe animations, scroll-driven utility classes, and IO polyfill hook
- [x] 09-02-PLAN.md -- Hero parallax extraction into client wrapper component

### Phase 10: Section Animation Migration

**Goal**: All four static content sections (about, metrics, timeline, tech stack) animate on scroll using CSS instead of framer-motion, with no visual regression
**Depends on**: Phase 9 (keyframes and polyfill available)
**Requirements**: ANIM-02, ANIM-03, ANIM-04, ANIM-05
**Success Criteria** (what must be TRUE):

1. About section fades in with staggered left/right entrance when scrolled into view, matching current framer-motion timing and easing
2. Metrics section cards scale in with staggered delay when scrolled into view
3. Experience timeline entries fade in sequentially as user scrolls down the page
4. Tech stack grid items animate in when the section enters the viewport
5. None of these four sections import or reference framer-motion
   **Plans**: TBD

Plans:

- [ ] 10-01: TBD
- [ ] 10-02: TBD

### Phase 11: Server-side GitHub Fetching

**Goal**: GitHub activity data loads instantly on page render with no client-side fetch or loading flash, refreshed via ISR
**Depends on**: Phase 9 (foundation complete)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):

1. GitHub activity section shows real data on first paint with zero loading spinners or skeleton flash
2. GitHub data refreshes automatically every 5 minutes via ISR (stale page triggers background revalidation)
3. The github-activity component is purely presentational -- it receives data as props and has no fetch logic or caching logic
4. No module-level Map cache exists in any GitHub-related component file
   **Plans**: TBD

Plans:

- [ ] 11-01: TBD

### Phase 12: Utility Component Conversion

**Goal**: Five utility components (marquee, twinkling-stars, css-preloader, graph-legend, animated-counter) are converted to server components or CSS-only implementations so they no longer require page-level "use client"
**Depends on**: Phase 9 (CSS keyframes available for graph-legend)
**Requirements**: ANIM-08, RSC-03, RSC-04, RSC-05, CBH-01
**Success Criteria** (what must be TRUE):

1. Marquee text banner scrolls continuously using CSS animation with no framer-motion import
2. Twinkling-stars renders as a server component with no "use client" directive and no useEffect/useState
3. CSS-preloader renders as a server component with no client APIs
4. Graph-legend entrance animation uses CSS instead of framer-motion and renders as a server component
5. AnimatedCounter animates numbers only when scrolled into view (Intersection Observer), not on page mount
   **Plans**: TBD

Plans:

- [ ] 12-01: TBD
- [ ] 12-02: TBD

### Phase 13: Server Component Page

**Goal**: page.tsx is a server component with "use client" removed, and all client-side code lives inside properly isolated boundary files
**Depends on**: Phase 10, Phase 11, Phase 12 (all animation migrations, GitHub ISR, and utility conversions complete)
**Requirements**: RSC-01, CBH-02, CBH-03
**Success Criteria** (what must be TRUE):

1. page.tsx has no "use client" directive and renders on the server
2. GraphSection loads via dynamic import with ssr:false inside a client boundary wrapper -- graph interactions work identically to before
3. Zustand store imports (graph-store) appear only inside files that have "use client" at the top
   **Plans**: TBD

Plans:

- [ ] 13-01: TBD

### Phase 14: PPR & Image Optimization

**Goal**: The portfolio uses Partial Prerendering to serve a static shell instantly while streaming dynamic content, and all images use next/image optimization
**Depends on**: Phase 13 (server component page is prerequisite for PPR)
**Requirements**: PPR-01, PPR-02, PPR-03, PPR-04, IMG-01, IMG-02
**Success Criteria** (what must be TRUE):

1. Hero, about, metrics, and timeline sections render as static HTML in the initial response (visible in view-source before JS loads)
2. GitHub activity section streams in via Suspense with a skeleton fallback visible during loading
3. Every Suspense boundary has a paired ErrorBoundary that shows a meaningful fallback on failure
4. Tech stack icons use next/image with explicit width/height and produce no layout shift on load
   **Plans**: TBD

Plans:

- [ ] 14-01: TBD
- [ ] 14-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 9, 10, 11, 12, 13, 14.
Note: Phases 10, 11, and 12 can run in parallel after Phase 9 completes. Phase 13 requires 10+11+12 done. Phase 14 requires 13 done.
Critical path: 9 -> 10 -> 12 -> 13 -> 14 (Phase 11 merges at 13)

| Phase                            | Milestone | Plans Complete | Status      | Completed  |
| -------------------------------- | --------- | -------------- | ----------- | ---------- |
| 9. Animation Foundation          | v1.2      | 2/2            | Complete    | 2026-02-07 |
| 10. Section Animation Migration  | v1.2      | 0/2            | Not started | -          |
| 11. Server-side GitHub Fetching  | v1.2      | 0/1            | Not started | -          |
| 12. Utility Component Conversion | v1.2      | 0/2            | Not started | -          |
| 13. Server Component Page        | v1.2      | 0/1            | Not started | -          |
| 14. PPR & Image Optimization     | v1.2      | 0/2            | Not started | -          |

---

_Last updated: 2026-02-07 -- Phase 9 complete_
