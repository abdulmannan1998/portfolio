# Research Summary: v1.2 SSR Migration

**Synthesized:** 2026-02-07
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

## Key Findings

### Stack

- **No new runtime dependencies needed** — Next.js 16, React 19, PPR already configured
- CSS animations + Intersection Observer replace framer-motion entrance animations
- Optional dev dependencies: `server-only`, `client-only` for boundary enforcement
- Keep framer-motion only for hero parallax (useScroll/useTransform) and graph interactions

### Features

- **Table stakes:** Server component root, static shell rendering, client boundary isolation, hydration safety, animation quality preservation, GitHub server fetching
- **Differentiators:** PPR with streaming, CSS-based entrance animations, next/image optimization, ISR with smart revalidation
- **Anti-features:** Don't convert ALL animations to CSS, don't eliminate Zustand, don't aggressively split framer-motion bundle

### Architecture

- Current: Entire page is "use client" due to 3 lines of scroll hooks
- Target: Server page with 3 client islands (HeroParallax, AnimatedCounter, GraphSection)
- **80% of portfolio is static** — only 3 areas genuinely require client JS
- Pattern: Server fetches data, passes to client display components
- Estimated bundle reduction: ~105KB (85%) of client JS removed

### Critical Pitfalls

1. **Dynamic import boundaries** — GraphSection ssr:false needs client wrapper when page becomes server
2. **Module-level cache** — GitHub activity's Map cache breaks in server context, use ISR instead
3. **Framer-motion hydration** — 12+ components with initial/animate cause mismatches, replace with CSS
4. **useEffect in server components** — Audit all hooks before removing "use client"
5. **Zustand store imports** — Keep strictly inside client boundaries

## Migration Strategy

**Build order:** Foundation → CSS animations → GitHub ISR → Utility components → Remove page "use client" → PPR/optimization

**Critical path:** Extract hero parallax → Migrate entrance animations to CSS → Server-side GitHub fetch → Remove "use client" from page.tsx

## Risk Assessment

| Risk                           | Level  | Mitigation                                                            |
| ------------------------------ | ------ | --------------------------------------------------------------------- |
| Animation quality degradation  | Medium | Keep framer-motion for interactive animations, CSS only for entrances |
| CSS animation-timeline support | Low    | Intersection Observer polyfill for older browsers                     |
| GitHub ISR stale data          | Low    | 5-min revalidation matches current cache TTL                          |
| Hydration mismatches           | Medium | Deterministic rendering already implemented (seeded PRNG)             |
| GraphSection breaking          | Low    | Keep dynamic import with ssr:false at client boundary                 |

## Performance Expectations

- First Contentful Paint: ~1.2s → ~0.4s (-67%)
- JavaScript bundle: ~200KB → ~95KB (-52%)
- Lighthouse score: 78 → 96 (estimated)
- GitHub data: loading flash → instant render

---

_Research complete. Ready for requirements definition._
