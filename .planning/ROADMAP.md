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

**Milestone Goal:** Restructure the portfolio from a fully client-rendered app to a server-first architecture, leveraging server components, ISR, client boundary extraction, and Partial Prerendering. Keep framer-motion for animations inside properly isolated client boundaries.

**Strategy pivot:** Phases 9-10 (CSS animation replacement) were reverted after UAT revealed animation-timeline: view() doesn't work reliably. New approach: keep framer-motion, wrap animated sections in client boundary components, and achieve SSR benefits through component architecture rather than animation replacement.

- [ ] **Phase 9: Server-side GitHub Fetching** - Move GitHub data to server with ISR, eliminate loading flash
- [ ] **Phase 10: Client Boundary Extraction** - Extract animated sections and interactive components into client boundary wrappers, convert eligible utilities to server components
- [ ] **Phase 11: Server Component Page** - Remove "use client" from page.tsx, compose server content with client boundary wrappers
- [ ] **Phase 12: PPR & Image Optimization** - Enable Partial Prerendering with streaming and next/image

## Phase Details

### Phase 9: Server-side GitHub Fetching

**Goal**: GitHub activity data loads instantly on page render with no client-side fetch or loading flash, refreshed via ISR
**Depends on**: v1.1 complete
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):

1. GitHub activity section shows real data on first paint with zero loading spinners or skeleton flash
2. GitHub data refreshes automatically every 5 minutes via ISR (stale page triggers background revalidation)
3. The github-activity component is purely presentational -- it receives data as props and has no fetch logic or caching logic
4. No module-level Map cache exists in any GitHub-related component file

Plans:

- [ ] 09-01: TBD

### Phase 10: Client Boundary Extraction

**Goal**: Animated sections and interactive components live in "use client" wrapper files that receive server-rendered data as props/children, enabling page.tsx to become a server component while preserving all framer-motion animations
**Depends on**: Phase 9
**Requirements**: RSC-02, RSC-03, RSC-04, RSC-05, CBH-01, CBH-02
**Success Criteria** (what must be TRUE):

1. Each animated section (hero, about, metrics, timeline, tech stack) has its framer-motion logic in a "use client" wrapper component
2. Wrapper components accept static content as props/children -- they don't fetch data or define content
3. Twinkling-stars renders as a server component with no "use client" directive
4. CSS-preloader renders as a server component with no client APIs
5. Marquee uses CSS animation only (no framer-motion) and can render as a server component
6. All animations visually match current behavior (no regression)

Plans:

- [ ] 10-01: TBD
- [ ] 10-02: TBD

### Phase 11: Server Component Page

**Goal**: page.tsx is a server component with "use client" removed, and all client-side code lives inside properly isolated boundary files
**Depends on**: Phase 9, Phase 10 (GitHub ISR and client boundary extraction complete)
**Requirements**: RSC-01, CBH-03
**Success Criteria** (what must be TRUE):

1. page.tsx has no "use client" directive and renders on the server
2. GraphSection loads via dynamic import with ssr:false inside a client boundary wrapper -- graph interactions work identically to before
3. Zustand store imports (graph-store) appear only inside files that have "use client" at the top

Plans:

- [ ] 11-01: TBD

### Phase 12: PPR & Image Optimization

**Goal**: The portfolio uses Partial Prerendering to serve a static shell instantly while streaming dynamic content, and all images use next/image optimization
**Depends on**: Phase 11 (server component page is prerequisite for PPR)
**Requirements**: PPR-01, PPR-02, PPR-03, PPR-04, IMG-01, IMG-02
**Success Criteria** (what must be TRUE):

1. Hero, about, metrics, and timeline sections render as static HTML in the initial response (visible in view-source before JS loads)
2. GitHub activity section streams in via Suspense with a skeleton fallback visible during loading
3. Every Suspense boundary has a paired ErrorBoundary that shows a meaningful fallback on failure
4. Tech stack icons use next/image with explicit width/height and produce no layout shift on load

Plans:

- [ ] 12-01: TBD
- [ ] 12-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 9, 10, 11, 12.
Phase 9 and 10 can potentially run in parallel. Phase 11 requires 9+10 done. Phase 12 requires 11 done.
Critical path: 9 -> 10 -> 11 -> 12

| Phase                          | Milestone | Plans Complete | Status      | Completed |
| ------------------------------ | --------- | -------------- | ----------- | --------- |
| 9. Server-side GitHub Fetching | v1.2      | 0/1            | Not started | -         |
| 10. Client Boundary Extraction | v1.2      | 0/2            | Not started | -         |
| 11. Server Component Page      | v1.2      | 0/1            | Not started | -         |
| 12. PPR & Image Optimization   | v1.2      | 0/2            | Not started | -         |

---

_Last updated: 2026-02-07 -- Phases 9-10 reverted (CSS animations approach abandoned), roadmap restructured around framer-motion + client boundaries_
