# Domain Pitfalls: Next.js Client-to-Server Migration

**Domain:** Next.js 16 + React 19 Portfolio SSR Migration
**Researched:** 2026-02-07
**Context:** 24 "use client" files, heavy framer-motion usage, React Flow, Zustand, previous hydration issues

## Critical Pitfalls

Mistakes that cause rewrites, broken builds, or runtime failures.

### Pitfall 1: Breaking Dynamic Import Boundaries

**What goes wrong:** Dynamically imported client components with `ssr: false` stop working when parent moves to server component. React Flow is currently dynamically imported in page.tsx with `ssr: false` — if page.tsx becomes a server component, the dynamic import behavior changes.

**Why it happens:** `dynamic(import, { ssr: false })` in a client component means "don't render on server at all". When the parent becomes a server component, Next.js may try to pre-render the fallback on the server, breaking the assumption that nothing renders server-side.

**Consequences:**

- React Flow throws runtime errors about `window` or DOM APIs being undefined
- Hydration mismatches between server fallback and client render
- Graph section breaks entirely

**Prevention:**

1. Keep dynamic imports with `ssr: false` at the client component boundary
2. Create a thin client wrapper around React Flow that lives in a separate file
3. Import the wrapper in server component page.tsx

**Example structure:**

```typescript
// components/sections/graph-section-client.tsx (NEW)
"use client";
export { GraphSection } from "./graph-section"; // re-export

// app/page.tsx (SERVER)
const GraphSectionClient = dynamic(
  () => import("@/components/sections/graph-section-client").then(m => m.GraphSection),
  { ssr: false, loading: () => <GraphSkeleton /> }
);
```

**Detection:** Build fails with "cannot import client component in server component" OR graph section renders blank.

---

### Pitfall 2: Module-Level Client State Breaks SSR

**What goes wrong:** The GitHub activity component uses module-level `Map` for caching (line 29: `const commitCache = new Map<string, CacheEntry>()`). When this component moves to server context or is imported by server components, the module-level cache causes unpredictable behavior.

**Why it happens:** Server components execute on every request. Module-level state that works in client components (executed once in browser) becomes shared across all requests on the server, causing:

- Cache pollution between users
- Race conditions
- Memory leaks (Map never clears across requests)

**Consequences:**

- User A sees User B's cached GitHub data
- Memory grows unbounded on server
- ISR revalidation doesn't clear stale cache
- Dev mode shows different data than production

**Prevention:**

1. Move cache to server-side solution (Next.js fetch cache, Redis, or Vercel KV)
2. For ISR pattern, rely on Next.js built-in caching with `revalidate`
3. Remove module-level Map entirely

**Recommended migration path:**

```typescript
// app/api/github/route.ts (KEEP as API route OR move to server component)
export async function getGitHubActivity() {
  const res = await fetch('...', {
    next: { revalidate: 300 } // 5 minutes, replaces module cache
  });
  return res.json();
}

// app/page.tsx (SERVER)
export default async function Page() {
  const githubActivity = await getGitHubActivity();
  return <GitHubActivityDisplay data={githubActivity} />;
}

// components/github-activity-display.tsx (CLIENT - just UI)
"use client";
export function GitHubActivityDisplay({ data }: { data: RedactedCommit[] }) {
  // No fetch, no loading state, just render
}
```

**Detection:**

- Warning signs: `const X = new Map()` or `const cache = {}` at module level in client components
- Tests: Multiple users see same data in dev mode
- Build warnings about server-side module execution

---

### Pitfall 3: Framer Motion Entrance Animations Cause Massive Hydration Mismatches

**What goes wrong:** 12+ components use framer-motion with `initial`, `animate`, `whileInView` props. When these components are rendered on the server, they output the `initial` state HTML. On client, motion skips `initial` and jumps to `animate`, causing hydration mismatches.

**Why it happens:** Framer Motion animations rely on client-side JavaScript and viewport intersection observers. Server renders the "initial" state (opacity: 0, y: 50), but React expects server HTML to match first client render. If client detects viewport immediately, it renders "animate" state (opacity: 1, y: 0), and React throws hydration errors.

**Consequences:**

- Console floods with hydration warnings: "Text content did not match. Server: 'opacity: 0' Client: 'opacity: 1'"
- Layout shift as components re-render on client
- Performance degradation from full client re-render
- Breaks React Fast Refresh in dev mode

**Current examples in codebase:**

- page.tsx line 110-160: Hero section with motion.h1, motion.p, motion.div
- page.tsx line 201-240: About section with motion.span, motion.h2, motion.p
- graph-section.tsx line 276: motion.div with whileInView
- graph-legend.tsx line 14: motion.div with whileInView
- All section components use framer-motion entrance animations

**Prevention:**

1. **Replace with CSS animations** where possible (entrance animations don't need JS)
2. **Use view-timeline CSS** for scroll-triggered animations (no JS needed)
3. **Keep framer-motion ONLY for interactive animations** (hover, click, drag)
4. **Suppress hydration warnings as last resort** (not recommended, masks real issues)

**CSS animation replacement pattern:**

```css
/* Replace motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
```

**For scroll-triggered animations (whileInView replacement):**

```css
/* Modern CSS with view-timeline (replaces whileInView) */
@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.scroll-animate {
  animation: appear linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

**Detection:**

- Build succeeds but console shows: "Warning: Expected server HTML to contain..."
- Components flash/flicker on page load
- Layout shift visible in Lighthouse/Core Web Vitals

**Phase recommendation:** Address in Phase 2 (after basic server migration works). Start with non-critical sections.

---

### Pitfall 4: useEffect Hooks in Server-Migrated Components

**What goes wrong:** When converting client components to server components, forgetting to remove or extract `useEffect` logic causes immediate build failures. Multiple components currently use `useEffect` for:

- Animated counter: useEffect for count animation (line 14-29)
- GitHub activity: useEffect for data fetching (line 82-112)
- Graph section: useEffect for reveal sequence, resize observer, timers (lines 217-270)

**Why it happens:** Server components can't use hooks. React hooks are client-side APIs. Attempting to use `useEffect`, `useState`, `useRef` in a server component causes:

```
Error: Cannot use hooks in Server Components
```

**Consequences:**

- Build fails immediately
- TypeScript errors in IDE before build
- Forces complete rewrite of component logic

**Prevention:**

1. **Audit all useEffect usage before migration** — map out what each effect does
2. **Extract effects into client wrapper components**
3. **Replace data-fetching effects with server-side async calls**
4. **Keep timer/animation effects in client boundary**

**Decision matrix:**

| useEffect Purpose     | Solution                                                             |
| --------------------- | -------------------------------------------------------------------- |
| Data fetching         | Move to server component as `async function` or `fetch` with caching |
| Timers/intervals      | Keep in client component                                             |
| Animation logic       | Keep in client OR replace with CSS                                   |
| Event listeners       | Keep in client component                                             |
| Intersection observer | Keep in client OR use CSS view-timeline                              |

**Example migration:**

```typescript
// BEFORE (client component)
"use client";
export function Section() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data?.value}</div>;
}

// AFTER (server component)
async function getData() {
  const res = await fetch('...', { next: { revalidate: 300 } });
  return res.json();
}

export async function Section() {
  const data = await getData();
  return <div>{data.value}</div>;
}
```

**Detection:**

- Build error: "Error: Cannot use hooks in Server Components"
- TypeScript error in IDE before build

**Phase recommendation:** Address in Phase 1 (during initial server component conversion).

---

### Pitfall 5: Zustand Store Imported by Server Component

**What goes wrong:** graph-store.tsx is used by graph-section.tsx and achievement nodes. If any part of the import chain reaches a server component, the build breaks or causes runtime errors.

**Why it happens:** Zustand creates client-side reactive state with subscriptions. Server components can't subscribe to reactive state. If server component imports file that imports Zustand store:

```
app/page.tsx (server)
  → imports graph-section.tsx (client) ✓
    → imports graph-store.tsx (client state) ✓

app/page.tsx (server)
  → imports some-helper.tsx (server)
    → imports graph-store.tsx (client state) ✗ BUILD ERROR
```

**Consequences:**

- Build error: "Unsupported module imported in Server Component"
- Runtime error if build succeeds: "Cannot subscribe in server environment"
- Forces rearchitecture of state management

**Prevention:**

1. **Keep Zustand store imports strictly inside "use client" boundaries**
2. **Never import store in shared utility files** (lib/graph-utils.ts should NOT import store)
3. **Pass store state as props** from client to server-side utilities if needed
4. **Use React Context** if state needs to be shared across server/client boundary

**Current risk areas in codebase:**

- graph-store.tsx (line 18): Used by graph-section.tsx (client) — SAFE
- graph-store.tsx: Used by achievement-node.tsx (client) — SAFE
- lib/graph-utils.ts: Does NOT import store — SAFE
- Risk: If any new server utility imports graph-store, breaks

**Detection:**

- Build error: "You're importing a component that needs X. It only works in a Client Component"
- grep check: `grep -r "useGraphStore" --include="*.tsx" --exclude="*node_modules*"`

**Phase recommendation:** Validate in Phase 1 during initial migration. Add boundary tests.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require refactoring.

### Pitfall 6: Seeded PRNG Pattern Becomes Unnecessary Complexity

**What goes wrong:** TwinklingStars component uses seeded PRNG (mulberry32) to generate deterministic star positions, solving previous hydration mismatches. When component becomes server-rendered, the seeded PRNG is still correct but adds unnecessary complexity.

**Why it happens:** The original problem was: client-side `Math.random()` generates different values on every render, causing server HTML (stars at positions A) to not match client hydration (stars at positions B). Seeded PRNG solved this by ensuring deterministic values. BUT: if component is server-rendered, positions are generated once on server and sent as HTML — client never re-generates them, so any PRNG works (or even just hardcoded positions).

**Consequences:**

- Maintains technical debt (seeded-random.ts library)
- Confuses future developers ("why do we need this?")
- Miss opportunity to simplify

**Prevention:**

1. When migrating static-on-server components, reconsider if deterministic generation is needed
2. Seeded PRNG only needed when: component is client-rendered AND generates dynamic values
3. If server-rendered: generate once on server, send as props

**Recommended refactor:**

```typescript
// BEFORE (client component with seeded PRNG to avoid hydration mismatch)
"use client";
export function TwinklingStars() {
  const stars = useMemo(() => {
    const random = mulberry32(42); // deterministic
    return generateStars(random);
  }, []);
  return <StarElements stars={stars} />;
}

// AFTER (server component, generate on server)
// No "use client", no seeded PRNG needed
export function TwinklingStars() {
  const stars = generateStars(Math.random); // or just hardcode 50 stars
  return <StarElements stars={stars} />;
}
```

**Detection:** Components using `mulberry32` that move to server components.

**Phase recommendation:** Phase 3-4 (cleanup after core migration works). Not urgent.

---

### Pitfall 7: Animated Counter Fires on Mount Instead of Viewport Entry

**What goes wrong:** AnimatedCounter component fires useEffect on mount (line 14), animating count from 0 to target. If metrics section is below fold, counter animates before user sees it. User arrives at section and sees static final number (no animation).

**Why it happens:** useEffect with empty deps array runs once on mount, not on viewport entry. This is broken UX, but unrelated to SSR migration — EXCEPT that fixing it during migration may introduce new hydration issues.

**Consequences (current):**

- Animation plays off-screen
- User never sees the satisfying count-up effect
- Metrics feel static/boring

**Consequences (during migration):**

- If fixed with IntersectionObserver, risk hydration mismatch (observer fires on client, not server)
- If fixed with framer-motion's `whileInView`, adds to framer-motion hydration issue (Pitfall 3)
- If fixed with CSS scroll-timeline, requires browser support check

**Prevention:**

1. **Fix UX issue separate from SSR migration** (don't bundle two changes)
2. **Use IntersectionObserver in client component** (keep "use client")
3. **OR use CSS view-timeline** and accept browser support limitations
4. **OR server-render final value, client-animate only when visible** (requires Suspense boundary)

**Recommended approach:**

```typescript
// Keep as client component, fix viewport detection
"use client";
export function AnimatedCounter({ value }: Props) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animate only after hasAnimated is true
  useEffect(() => {
    if (!hasAnimated) return;
    // ... existing animation logic
  }, [hasAnimated]);

  return <span ref={ref}>{count}</span>;
}
```

**Detection:**

- Metrics section loads, animation plays, then user scrolls down and sees static number
- No animation visible when metrics come into viewport

**Phase recommendation:** Phase 4-5 (polish after SSR migration stable). Not blocking.

---

### Pitfall 8: GraphLegend Uses Framer-Motion But Could Be Pure CSS

**What goes wrong:** GraphLegend component (graph-legend.tsx) is marked "use client" solely for framer-motion's `whileInView` animation (line 14-18). The legend itself is static markup — no interactivity, no state, no effects beyond entrance animation.

**Why it happens:** Developer reached for framer-motion by default for entrance animation, not considering CSS alternative. This forces client boundary, increases bundle size, and creates hydration risk.

**Consequences:**

- Unnecessarily large client bundle (framer-motion imported for 1 component)
- Component must stay client-rendered (can't be static HTML)
- Hydration mismatch risk (Pitfall 3 applies)

**Prevention:**

1. **Audit all framer-motion usage** — separate interactive from entrance-only
2. **Replace entrance-only animations with CSS** before marking "use client"
3. **Reserve framer-motion for** hover effects, drag interactions, complex sequencing

**Recommended refactor:**

```typescript
// BEFORE (client component for animation)
"use client";
import { motion } from "framer-motion";
export function GraphLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="..."
    >
      {/* static content */}
    </motion.div>
  );
}

// AFTER (server component with CSS)
export function GraphLegend() {
  return (
    <div className="animate-fade-in-left ...">
      {/* static content */}
    </div>
  );
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in-left': {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to: { opacity: 1, transform: 'translateX(0)' }
        }
      },
      animation: {
        'fade-in-left': 'fade-in-left 0.5s ease-out'
      }
    }
  }
}
```

**Detection:** Search for `"use client"` components that only use framer-motion for entrance animations.

**Phase recommendation:** Phase 2-3 (during animation refactor). Medium priority.

---

### Pitfall 9: CSSPreloader Marked Client But Uses No Client APIs

**What goes wrong:** CSSPreloader component (css-preloader.tsx) is marked "use client" (line 1) but uses zero client-side APIs. It's pure JSX with inline styles and Tailwind classes. Could be server component.

**Why it happens:** Component was created during client-first architecture. Developer added "use client" by default, never reconsidered during refactors.

**Consequences:**

- Forces client boundary unnecessarily
- Misses opportunity for static generation
- Sets bad pattern (mark everything client by default)

**Prevention:**

1. **Default to server components** — only add "use client" when needed
2. **Audit for client APIs before marking**: useState, useEffect, event handlers, browser APIs
3. **Run build and let Next.js tell you** if client directive is needed

**How to validate:**

```bash
# Remove "use client" from css-preloader.tsx
# Run build
pnpm build

# If build succeeds → was server-compatible all along
# If build fails with "Cannot use X in server component" → add "use client" back
```

**Detection:** Search for `"use client"` and manually review each file for client API usage.

**Phase recommendation:** Phase 1 (during initial audit). Quick win.

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 10: next/image Migration Blocks SSR Benefits

**What goes wrong:** Tech stack icons currently use raw `<img>` tags (PROJECT.md line 63: "Replace raw `<img>` with `next/image`"). These don't benefit from Next.js optimization. BUT: migrating to `next/image` during SSR refactor may introduce layout shift issues if sizes aren't specified.

**Why it happens:** `next/image` requires width/height or fill. Without explicit dimensions, component can't render correctly on server. Original `<img>` tags may not have width/height attributes, relying on CSS to size them.

**Consequences:**

- Layout shift during hydration (image size changes)
- Cumulative Layout Shift (CLS) penalty in Lighthouse
- TypeScript errors if width/height missing

**Prevention:**

```typescript
// BEFORE (raw img)
<img src="/icons/react.svg" alt="React" className="w-12 h-12" />

// AFTER (next/image, WRONG)
<Image src="/icons/react.svg" alt="React" className="w-12 h-12" />
// Error: width and height required

// AFTER (next/image, CORRECT)
<Image src="/icons/react.svg" alt="React" width={48} height={48} className="w-12 h-12" />
```

**Detection:** TypeScript error: "Property 'width' is missing in type"

**Phase recommendation:** Phase 5-6 (optimization after SSR migration). Not blocking SSR work.

---

### Pitfall 11: Suspense Boundaries Without Error Boundaries

**What goes wrong:** Planning includes "Implement Suspense streaming for dynamic content" (PROJECT.md line 61). Adding Suspense without error boundaries means server errors crash the entire page instead of showing fallback UI.

**Why it happens:** Suspense handles loading states, not error states. Need parallel error boundary implementation.

**Consequences (without error boundary):**

- Server fetch error crashes entire page
- User sees blank screen or Next.js error page
- No graceful degradation

**Prevention:**

```typescript
// WRONG (Suspense only)
<Suspense fallback={<Skeleton />}>
  <ServerComponent /> {/* if this throws, page crashes */}
</Suspense>

// RIGHT (Suspense + Error Boundary)
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Skeleton />}>
    <ServerComponent />
  </Suspense>
</ErrorBoundary>
```

**Detection:** Test by intentionally throwing error in server component — page crashes instead of showing fallback.

**Phase recommendation:** Phase 3 (when adding Suspense streaming). Must be paired.

---

### Pitfall 12: ISR Revalidation Tag Strategy Not Defined

**What goes wrong:** GitHub activity will use ISR with 5-minute revalidation (PROJECT.md line 60: "Server-side GitHub data fetching with ISR"). But no strategy defined for:

- Manual revalidation (what if user wants fresh data now?)
- Revalidation on deployment (stale data persists across deploys)
- Cache warming (first visitor after revalidation waits for fetch)

**Why it happens:** ISR planning focuses on happy path (automatic revalidation) without considering edge cases.

**Consequences:**

- User reports "data is stale" but no way to force refresh
- Deploy new code, old cached data persists
- First visitor after revalidation has slow page load

**Prevention:**

1. **Define revalidation tags** for manual invalidation
2. **Document revalidation strategy** in code comments
3. **Add cache warming** to deployment pipeline (optional)

**Recommended pattern:**

```typescript
// app/api/github/route.ts
export async function GET() {
  const data = await fetchGitHub();
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

// For manual revalidation:
import { revalidateTag } from "next/cache";
await fetch("...", { next: { tags: ["github-activity"] } });
// Later: revalidateTag('github-activity');
```

**Detection:** No detection method — requires proactive planning.

**Phase recommendation:** Phase 4 (during ISR implementation). Define before coding.

---

## Phase-Specific Warnings

| Phase Topic                       | Likely Pitfall                                                     | Mitigation                                               |
| --------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| Phase 1: Initial server migration | Pitfall 4 (useEffect hooks), Pitfall 5 (Zustand imports)           | Audit all hooks and imports before removing "use client" |
| Phase 2: Animation refactor       | Pitfall 3 (framer-motion hydration), Pitfall 8 (GraphLegend)       | Start with low-risk components (about section, legend)   |
| Phase 3: Suspense streaming       | Pitfall 11 (missing error boundaries)                              | Always pair Suspense with ErrorBoundary                  |
| Phase 4: GitHub ISR migration     | Pitfall 2 (module-level cache), Pitfall 12 (revalidation strategy) | Remove Map cache, define revalidation tags               |
| Phase 5: Dynamic imports          | Pitfall 1 (React Flow boundary)                                    | Keep ssr:false at client wrapper level                   |
| Phase 6: Image optimization       | Pitfall 10 (layout shift)                                          | Measure width/height before migration                    |

---

## Testing Strategy per Pitfall

| Pitfall              | Test Method                                        | Expected Outcome                      |
| -------------------- | -------------------------------------------------- | ------------------------------------- |
| 1: Dynamic imports   | Load page with React Flow section                  | No console errors, graph renders      |
| 2: Module cache      | Open in 2 incognito windows, check GitHub activity | Different users don't share cache     |
| 3: Framer Motion     | Check console for hydration warnings               | Zero hydration errors                 |
| 4: useEffect         | Build succeeds                                     | No "cannot use hooks" error           |
| 5: Zustand           | Build succeeds                                     | No "unsupported module" error         |
| 6: Seeded PRNG       | Visual regression test                             | Stars render identically              |
| 7: Animated counter  | Scroll to metrics section                          | Counter animates on entry             |
| 8: GraphLegend       | Check bundle size                                  | Framer-motion not in legend chunk     |
| 9: CSSPreloader      | Build without "use client"                         | Build succeeds                        |
| 10: next/image       | Lighthouse CLS score                               | CLS < 0.1                             |
| 11: Suspense errors  | Throw error in server component                    | Error UI shows, page doesn't crash    |
| 12: ISR revalidation | Deploy, check GitHub data                          | Fresh data appears after revalidation |

---

## Quick Reference: "Should This Be Server or Client?"

Use this decision tree when converting components:

```
Does component use useState/useReducer?
├─ YES → Client component
└─ NO → Continue

Does component use useEffect/useLayoutEffect?
├─ YES → Client component
└─ NO → Continue

Does component use event handlers (onClick, onChange, etc)?
├─ YES → Client component
└─ NO → Continue

Does component use browser APIs (window, document, IntersectionObserver)?
├─ YES → Client component
└─ NO → Continue

Does component use client-only libraries (framer-motion, zustand)?
├─ YES → Client component (or refactor to remove)
└─ NO → Continue

Does component use React Context?
├─ YES, and needs to PROVIDE context → Client component
├─ YES, and only CONSUMES context → Client component
└─ NO → Server component ✓
```

---

## Confidence Assessment

| Pitfall                           | Confidence | Source                                                          |
| --------------------------------- | ---------- | --------------------------------------------------------------- |
| 1: Dynamic imports                | HIGH       | Next.js docs on dynamic imports, observed in codebase           |
| 2: Module-level cache             | HIGH       | Identified in github-activity.tsx:29, server component patterns |
| 3: Framer Motion hydration        | HIGH       | Known React hydration behavior, 12+ instances in codebase       |
| 4: useEffect in server components | HIGH       | React documentation, TypeScript will error                      |
| 5: Zustand in server context      | HIGH       | Zustand client-only, observed usage in graph components         |
| 6: Seeded PRNG complexity         | MEDIUM     | Observed in twinkling-stars.tsx, SSR pattern knowledge          |
| 7: Animated counter timing        | HIGH       | Observed in animated-counter.tsx:14, UX issue                   |
| 8: GraphLegend optimization       | HIGH       | Observed in graph-legend.tsx:14, unnecessary client boundary    |
| 9: CSSPreloader client directive  | HIGH       | Observed in css-preloader.tsx:1, no client API usage            |
| 10: next/image migration          | MEDIUM     | Common Next.js migration pattern, PROJECT.md:63                 |
| 11: Suspense error handling       | HIGH       | React error boundary patterns, PROJECT.md:61                    |
| 12: ISR revalidation strategy     | MEDIUM     | Next.js ISR patterns, PROJECT.md:60                             |

---

## Sources

**Primary sources:**

- Codebase analysis: /Users/sunny/Desktop/Sunny/portfolio/
- .planning/PROJECT.md (milestone context)
- Next.js 16 App Router documentation (server/client components)
- React 19 documentation (hydration, server components)
- Framer Motion documentation (animation patterns)

**Key files analyzed:**

- app/page.tsx (main client component, 390 lines)
- components/github-activity.tsx (module-level cache pattern)
- components/twinkling-stars.tsx (seeded PRNG pattern)
- components/animated-counter.tsx (useEffect timing issue)
- components/sections/graph-section.tsx (complex client interactions)
- components/graph-legend.tsx (unnecessary client directive)
- components/css-preloader.tsx (pure JSX marked client)
- lib/seeded-random.ts (hydration mismatch solution)

**Knowledge base:**

- Next.js server/client component boundaries (as of training, verified patterns still apply in Next.js 16)
- React hydration mismatch patterns
- Framer Motion SSR limitations (well-documented in community)
- Zustand server compatibility (explicitly client-only library)

**Confidence level:** HIGH for architectural patterns, MEDIUM for Next.js 16 specific behaviors (training data is Jan 2025, Next.js 16.1.6 release may have nuances)
