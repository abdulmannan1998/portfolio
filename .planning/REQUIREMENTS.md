# Requirements: Portfolio v1.2 SSR Migration

**Defined:** 2026-02-07
**Core Value:** The portfolio must remain visually polished and performant -- changes should improve code quality without degrading the user experience.

## v1 Requirements

Requirements for v1.2 milestone. Each maps to roadmap phases.

### Server Components

- [x] **RSC-01**: Page.tsx is a server component (no "use client" directive)
- [x] **RSC-02**: Hero parallax scroll logic is isolated in a client wrapper component that accepts server-rendered children
- [x] **RSC-03**: Twinkling-stars renders as server component (pure CSS, no client hooks)
- [x] **RSC-04**: CSS-preloader renders as server component (no client APIs used)
- [x] **RSC-05**: Graph-legend renders as server component with CSS entrance animation replacing framer-motion

### CSS Animations

- [x] **ANIM-01**: CSS keyframe animations defined in globals.css (fade-in-up, fade-in-down, fade-in-left, scale-in)
- [x] **ANIM-02**: About section entrance animations use CSS instead of framer-motion
- [x] **ANIM-03**: Metrics section entrance animations use CSS instead of framer-motion
- [x] **ANIM-04**: Experience timeline entrance animations use CSS instead of framer-motion
- [x] **ANIM-05**: Tech stack section entrance animations use CSS instead of framer-motion
- [x] **ANIM-06**: Intersection Observer polyfill activates animations in browsers without animation-timeline support
- [x] **ANIM-07**: CSS scroll-driven animations (animation-timeline: view()) trigger entrance effects in modern browsers
- [x] **ANIM-08**: Marquee text uses CSS animation instead of framer-motion

### Data Fetching

- [x] **DATA-01**: GitHub activity data is fetched server-side in page.tsx (no client-side loading flash)
- [x] **DATA-02**: GitHub data uses ISR with 5-minute revalidation
- [x] **DATA-03**: Module-level Map cache removed from github-activity component
- [x] **DATA-04**: GitHub-activity is a presentational component receiving data as props

### Image Optimization

- [x] **IMG-01**: Tech stack icons use next/image instead of raw img tags
- [x] **IMG-02**: All next/image instances have explicit width/height to prevent layout shift

### Streaming & PPR

- [x] **PPR-01**: Suspense boundaries wrap dynamic content (GitHub activity section)
- [x] **PPR-02**: Partial Prerendering enabled with static shell for hero, about, metrics, timeline
- [x] **PPR-03**: Error boundaries paired with every Suspense boundary
- [x] **PPR-04**: Skeleton fallback components render during streaming

### Client Boundary Hygiene

- [x] **CBH-01**: AnimatedCounter uses Intersection Observer to animate only when visible (not on mount)
- [x] **CBH-02**: GraphSection remains client with dynamic import and ssr:false (no regression)
- [x] **CBH-03**: Zustand store imports exist only inside "use client" boundary files

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Advanced Optimizations

- **OPT-01**: Remove framer-motion dependency entirely (currently kept for hero parallax)
- **OPT-02**: Convert hero parallax to CSS scroll-driven animation (browser support dependent)
- **OPT-03**: On-demand ISR revalidation via webhook (fresh data on push)
- **OPT-04**: Service worker for offline support

## Out of Scope

| Feature                                                            | Reason                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| Remove framer-motion entirely                                      | Still needed for hero parallax and graph interactions  |
| SSR the React Flow graph                                           | Canvas-based library, genuinely requires client JS     |
| Replace Zustand                                                    | Only 31 lines, well-architected for client graph state |
| User authentication/sessions                                       | Single-user portfolio, no auth needed                  |
| CMS integration                                                    | resume-data.ts is source of truth                      |
| Advanced image optimization (blur placeholders, responsive srcset) | Defer to v2, next/image basics sufficient              |

## Traceability

| Requirement | Phase | Status   |
| ----------- | ----- | -------- |
| RSC-01      | 11    | Complete |
| RSC-02      | 9     | Complete |
| RSC-03      | 10    | Complete |
| RSC-04      | 10    | Complete |
| RSC-05      | 10    | Complete |
| ANIM-01     | 9     | Complete |
| ANIM-02     | 10    | Complete |
| ANIM-03     | 10    | Complete |
| ANIM-04     | 10    | Complete |
| ANIM-05     | 10    | Complete |
| ANIM-06     | 9     | Complete |
| ANIM-07     | 9     | Complete |
| ANIM-08     | 10    | Complete |
| DATA-01     | 9     | Complete |
| DATA-02     | 9     | Complete |
| DATA-03     | 9     | Complete |
| DATA-04     | 9     | Complete |
| IMG-01      | 12    | Complete |
| IMG-02      | 12    | Complete |
| PPR-01      | 12    | Complete |
| PPR-02      | 12    | Complete |
| PPR-03      | 12    | Complete |
| PPR-04      | 12    | Complete |
| CBH-01      | 10    | Complete |
| CBH-02      | 10    | Complete |
| CBH-03      | 11    | Complete |

**Coverage:**

- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---

_Requirements defined: 2026-02-07_
_Last updated: 2026-02-07 -- Phase 12 complete (PPR-01-04, IMG-01-02), all v1.2 requirements fulfilled_
