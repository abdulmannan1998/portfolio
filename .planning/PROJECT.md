# Portfolio

## What This Is

A brutalist personal portfolio site showcasing career timeline, achievements, and skills through multiple sections including an interactive graph visualization. Built with Next.js 16, React 19, React Flow, and Framer Motion. Features a server-first architecture with Partial Prerendering — static HTML shell serves instantly while dynamic GitHub activity streams via Suspense.

## Core Value

The portfolio must remain visually polished and performant — changes should improve code quality without degrading the user experience.

## Current State

**Latest shipped:** v1.2 SSR Migration (2026-02-07)
**Current milestone:** v1.3 Graph Improvements

- Server component page.tsx composing all sections directly (no page-content.tsx wrapper)
- Partial Prerendering: static HTML shell + dynamic GitHub streaming via Suspense
- ISR data fetching with 5-minute revalidation (zero loading flash)
- Client boundary architecture: framer-motion isolated in "use client" wrappers
- Hydration-aware animations: PPR shell visible before JS loads
- next/image for all 27 tech stack SVG icons (zero layout shift)
- ErrorBoundary + skeleton fallback for GitHub API failures
- 5,527 LOC (TypeScript/CSS)

**Tech stack:** Next.js 16, React 19, React Flow, Zustand, Framer Motion, Tailwind CSS

## Requirements

### Validated

- ✓ Interactive career graph with reveal animation — v1.0
- ✓ Achievement nodes that expand on hover — v1.0
- ✓ Responsive layout (desktop graph, mobile timeline) — v1.0
- ✓ Smooth animations via Framer Motion — v1.0
- ✓ Static resume data driving all content — v1.0
- ✓ Clean graph store with minimal state — v1.0
- ✓ Centralized layout constants — v1.0
- ✓ Type-safe node structures — v1.0
- ✓ Optimized animation performance — v1.0
- ✓ Brutalist hero section with scroll animation — pre-GSD
- ✓ Marquee text banner — pre-GSD
- ✓ About section (split screen layout) — pre-GSD
- ✓ Tech stack grid (18 technologies) — pre-GSD
- ✓ Experience timeline (vertical) — pre-GSD
- ✓ Metrics section with animated counters — pre-GSD
- ✓ GitHub activity live feed — pre-GSD
- ✓ Labs page (coming soon placeholder) — pre-GSD
- ✓ DEBT-01: Timer cleanup in graph-section — v1.1 Phase 8
- ✓ DEBT-02: Debounce .cancel() method — v1.1 Phase 8
- ✓ DEBT-03: GitHub API caching — v1.1 Phase 8
- ✓ DEBT-04: Code splitting to modular components — v1.1 Phase 7
- ✓ RSC-01: Page.tsx is a server component — v1.2
- ✓ RSC-02: Hero parallax in client wrapper with server children — v1.2
- ✓ RSC-03: Twinkling-stars as server component — v1.2
- ✓ RSC-04: CSS-preloader as server component — v1.2
- ✓ RSC-05: Graph-legend as server component with CSS animation — v1.2
- ✓ ANIM-01 through ANIM-08: CSS/framer-motion entrance animations — v1.2
- ✓ DATA-01 through DATA-04: Server-side GitHub fetching with ISR — v1.2
- ✓ IMG-01, IMG-02: next/image for tech stack icons — v1.2
- ✓ PPR-01 through PPR-04: Partial Prerendering with Suspense streaming — v1.2
- ✓ CBH-01 through CBH-03: Client boundary hygiene — v1.2

### Active

#### Current Milestone: v1.3 Graph Improvements

**Goal:** Transform the graph from a mechanical node reveal into a cinematic, recruiter-optimized guided career story.

**Target features:**

- Cinematic reveal triggered by name node interaction (not mouse enter)
- Reverse-chronological narrative: Intenseye → Layermark → Bilkent → Courses
- Camera follows the story — smooth pan to each new node
- Click-to-expand achievement nodes (replacing hover-to-spawn)
- Subtler soft skill treatment (badges/labels, not full floating nodes)
- Polished node card design (typography, borders, shadows)
- Animated edge connections (gradients, flowing particles)
- Course nodes under Bilkent education
- Smoother layout and transitions throughout

### Out of Scope

- Mobile-specific graph view — PWA works well on mobile
- Video/media content — static portfolio is sufficient
- CMS integration — resume-data.ts is source of truth
- Remove framer-motion entirely — still needed for hero parallax and graph interactions
- SSR the React Flow graph — canvas-based library, genuinely requires client JS
- Replace Zustand — only 31 lines, well-architected for client graph state
- Advanced image optimization (blur placeholders, responsive srcset) — next/image basics sufficient

## File Structure

```
/app
  /page.tsx           # Server component page (sync, composes all sections)
  /labs/page.tsx      # Labs coming soon page

/components
  /sections/
    /hero-section.tsx         # Hero with self-contained scroll parallax ("use client")
    /about-section.tsx        # About section wrapper ("use client")
    /metrics-section.tsx      # Impact metrics with animated counters ("use client")
    /experience-timeline.tsx  # Vertical career timeline ("use client")
    /tech-stack-section.tsx   # Tech stack grid (server component)
    /graph-section.tsx        # Interactive career graph ("use client")
    /graph-section-loader.tsx # Client wrapper for dynamic import with ssr:false
  /github-activity.tsx        # Presentational GitHub feed (no directive)
  /github-activity-stream.tsx # Async server component fetching GitHub data
  /github-activity-skeleton.tsx # Skeleton fallback for Suspense
  /github-activity-error.tsx  # ErrorBoundary for GitHub section
  /twinkling-stars.tsx        # Background stars (server component)
  /graph-legend.tsx           # React Flow legend (server component)
  /custom-node.tsx            # React Flow custom node
  /nodes/
    /achievement-node.tsx     # Achievement expansion node

/data
  /resume-data.ts       # Portfolio content (bio, skills, companies)
  /tech-stack.ts        # Tech stack grid data (18 technologies)
  /experience.ts        # Experience timeline data

/lib
  /debounce.ts          # Debounce utility with cancel method
  /github.ts            # Server-side GitHub fetch with ISR
  /graph-utils.ts       # Graph node/edge generation
  /layout-constants.ts  # Layout and timing constants
  /use-hydrated.ts      # Hydration detection hook
  /stores/
    /graph-store.tsx    # Zustand graph state
```

## Constraints

- **Preserve UX quality**: Changes can improve visuals but shouldn't degrade them
- **No new dependencies**: Use existing stack unless compelling reason
- **Atomic commits**: Each change should be independently revertible

## Key Decisions

| Decision                            | Rationale                                | Outcome |
| ----------------------------------- | ---------------------------------------- | ------- |
| Systematic cleanup via CONCERNS.md  | Ensures comprehensive coverage           | ✓ Good  |
| Domain-grouped constants            | Related values organized together        | ✓ Good  |
| Discriminated union for node types  | Enables type narrowing                   | ✓ Good  |
| Array instead of Set in store       | JSON serializability                     | ✓ Good  |
| store.getState() for callbacks      | Avoids stale closures                    | ✓ Good  |
| useMemo for debounced fitView       | React Compiler compatibility             | ✓ Good  |
| Extract sections to components      | Maintainability, reusability             | ✓ Good  |
| Extract data to typed files         | Single source of truth, reuse            | ✓ Good  |
| Timer tracking with useRef          | Prevents memory leaks on unmount         | ✓ Good  |
| Memory cache over localStorage      | Simplicity, session-based data           | ✓ Good  |
| Fetch-level ISR over segment-level  | cacheComponents conflict avoidance       | ✓ Good  |
| Server/client page split            | SSR data + client interactivity          | ✓ Good  |
| Keep framer-motion (strategy pivot) | CSS animation-timeline unreliable        | ✓ Good  |
| Client boundary wrappers            | SSR benefits via component architecture  | ✓ Good  |
| PPR split: static + dynamic stream  | Fast initial paint + fresh data          | ✓ Good  |
| useHydrated hook                    | Standard hydration detection utility     | ✓ Good  |
| Conditional initial + key remount   | PPR shell visible, animations play later | ✓ Good  |
| next/image with unoptimized for SVG | Vectors don't need optimization pipeline | ✓ Good  |

---

_Last updated: 2026-02-07 after v1.3 milestone started_
