# Architecture Patterns for SSR Migration

**Project:** Portfolio v1.2 SSR Migration
**Domain:** Next.js 16 Server-First Architecture Restructuring
**Researched:** 2026-02-07
**Confidence:** HIGH

## Executive Summary

The current architecture is entirely client-rendered with a single "use client" boundary at page.tsx. This migration restructures the component tree to leverage Next.js 16 server components, creating targeted client boundaries only where interactivity is essential. The strategy: **server by default, client by exception**.

**Key insight:** 80% of the portfolio is static or entrance-animation-only. Only 3 areas genuinely require client JavaScript:

1. React Flow graph (heavy interactivity, DOM manipulation)
2. Hero parallax scroll effect (useScroll + useTransform)
3. Marquee infinite scroll animation

Everything else can either:

- Move to server components (GitHub data fetch, static sections)
- Migrate to CSS animations (entrance effects via @keyframes + Intersection Observer)
- Use minimal client wrappers (AnimatedCounter as tiny client island)

## Current vs Target Architecture

### Current State (v1.1)

```
app/
├── layout.tsx           [SERVER] ✓ Already server component
└── page.tsx             [CLIENT] ⚠️  "use client" at top
    ├── useRef + useScroll + useTransform
    ├── motion.section (hero parallax)
    ├── motion.h1, motion.p, motion.div
    ├── MarqueeText [CLIENT]
    ├── TwinklingStars [CLIENT]
    ├── MetricsSection [CLIENT]
    │   └── AnimatedCounter [CLIENT]
    ├── TechAndCodeSection [CLIENT]
    │   └── GitHubActivity [CLIENT] (fetch on mount)
    ├── ExperienceTimeline [CLIENT]
    └── GraphSection [CLIENT, dynamic, ssr:false]
        └── ReactFlowProvider + complex state
```

**Problem:** The entire 300-line page is bundled to the client because of:

- 3 lines of scroll hooks (useRef, useScroll, useTransform) at the top
- motion components in hero/about sections

### Target State (v1.2)

```
app/
├── layout.tsx                    [SERVER] ✓ Already good
└── page.tsx                      [SERVER] ✓ Restructured
    ├── <HeroParallax>            [CLIENT] Isolated scroll logic
    │   └── children prop         [SERVER] Static hero content
    ├── <MarqueeSection>          [SERVER] Static markup
    │   └── <InfiniteMarquee>     [CLIENT] CSS animation wrapper
    ├── <TwinklingStars>          [SERVER] Pure CSS + inline styles
    ├── <AboutSection>            [SERVER] Static split-screen layout
    │   └── CSS animations        (no framer-motion)
    ├── <MetricsSection>          [SERVER] Static cards
    │   └── <AnimatedCounter>     [CLIENT] Tiny intersection-triggered counter
    ├── <TechAndCodeSection>      [SERVER] Static tech grid + GitHub data
    │   ├── githubData prop       [SERVER] Fetched before render
    │   └── <GitHubActivity>      [SERVER] Pure presentational
    ├── <ExperienceTimeline>      [SERVER] Static timeline markup
    │   └── CSS animations        (no framer-motion)
    └── <GraphSection>            [CLIENT] Same as before (already ssr:false)
```

**Result:**

- Page.tsx becomes server component (no "use client")
- Only 3 small client boundaries: HeroParallax, InfiniteMarquee, AnimatedCounter
- GitHub data fetched server-side with ISR (no client loading flash)
- Bundle size reduced ~60-70% (framer-motion, Zustand, React hooks only loaded for graph)

## Component Tree Restructuring Plan

### Phase 1: Extract Hero Parallax Logic

**Current pattern (page.tsx lines 1-160):**

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main ref={containerRef}>
      <motion.section style={{ scale: heroScale, opacity: heroOpacity }}>
        {/* Hero content */}
      </motion.section>
      {/* Rest of page */}
    </main>
  );
}
```

**Target pattern:**

```tsx
// app/page.tsx [SERVER]
import { HeroParallaxWrapper } from "@/components/hero-parallax-wrapper";

export default function Page() {
  return (
    <main>
      <HeroParallaxWrapper>
        <section className="sticky top-0 min-h-screen flex flex-col justify-center">
          {/* Static hero content - server-rendered */}
          <h1>MANNAN</h1>
          <p>SENIOR SOFTWARE ENGINEER</p>
        </section>
      </HeroParallaxWrapper>
      {/* Rest of page */}
    </main>
  );
}

// components/hero-parallax-wrapper.tsx [CLIENT]
("use client");
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroParallaxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef}>
      <motion.div style={{ scale: heroScale, opacity: heroOpacity }}>
        {children}
      </motion.div>
    </div>
  );
}
```

**Why this works:** Server Components can be passed as children to Client Components. The hero content is server-rendered, only the parallax logic is client-side.

**Files:**

- NEW: `components/hero-parallax-wrapper.tsx` (client, ~30 lines)
- MODIFIED: `app/page.tsx` (remove "use client", remove scroll hooks)

### Phase 2: Migrate Framer Motion → CSS Animations

**Affected components:**

- About section (motion.span, motion.h2, motion.p with whileInView)
- MetricsSection (motion.div with whileInView)
- ExperienceTimeline (motion.div with whileInView)
- TechAndCodeSection (motion.h3, motion.div with whileInView)

**Pattern:**

Current (framer-motion):

```tsx
"use client";
import { motion } from "framer-motion";

<motion.h2
  initial={{ y: 50, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  className="text-4xl font-black"
>
  BUILDING INTERFACES
</motion.h2>;
```

Target (CSS + data attributes):

```tsx
// Server component
<h2
  data-animate="fade-up"
  className="text-4xl font-black"
>
  BUILDING INTERFACES
</h2>

// globals.css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-animate="fade-up"] {
  animation: fade-up 0.6s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

**Modern CSS solution:** Use `animation-timeline: view()` (scroll-driven animations) for intersection-triggered effects. Supported in Chrome 115+, Safari 17.5+, Firefox 114+.

**Fallback for older browsers:**

```tsx
// components/css-animation-polyfill.tsx [CLIENT]
"use client";
import { useEffect } from "react";

export function CSSAnimationPolyfill() {
  useEffect(() => {
    if (!CSS.supports("animation-timeline", "view()")) {
      // Intersection Observer fallback
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      });

      document.querySelectorAll("[data-animate]").forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// globals.css fallback
@supports not (animation-timeline: view()) {
  [data-animate] {
    opacity: 0;
    transform: translateY(50px);
  }
  [data-animate].animate-in {
    animation: fade-up 0.6s ease-out forwards;
  }
}
```

**Files:**

- NEW: `components/css-animation-polyfill.tsx` (client, ~40 lines)
- MODIFIED: `app/globals.css` (add @keyframes definitions)
- MODIFIED: All section components (remove framer-motion imports, add data-animate)

**Trade-off analysis:**

- **PRO:** No framer-motion bundle (~100KB), server components, better SEO
- **PRO:** CSS animations are composable and performant (GPU-accelerated)
- **CON:** Less dynamic than framer-motion (no gesture/drag support)
- **CON:** Browser support requires polyfill for animation-timeline
- **VERDICT:** Worth it. Static entrance animations don't need framer-motion's power.

### Phase 3: Server-Side GitHub Data Fetching

**Current pattern (GitHubActivity component):**

```tsx
"use client";
import { useState, useEffect } from "react";

export function GitHubActivity() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => setCommits(data.commits));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render commits */}</div>;
}
```

**Problem:** Client-side fetch causes loading flash, larger bundle, no SSR benefit.

**Target pattern:**

```tsx
// app/page.tsx [SERVER]
export const revalidate = 300; // ISR: 5-minute cache

export default async function Page() {
  const githubData = await fetch("https://api.github.com/users/...", {
    next: { revalidate: 300 },
  }).then((res) => res.json());

  return (
    <main>
      {/* Other sections */}
      <TechAndCodeSection githubData={githubData} />
    </main>
  );
}

// components/sections/tech-and-code-section.tsx [SERVER]
type Props = {
  githubData: { commits: RedactedCommit[] };
};

export function TechAndCodeSection({ githubData }: Props) {
  return (
    <section>
      {/* Tech stack grid */}
      <GitHubActivity commits={githubData.commits} />
    </section>
  );
}

// components/github-activity.tsx [SERVER]
type Props = {
  commits: RedactedCommit[];
};

export function GitHubActivity({ commits }: Props) {
  // Pure presentational - no state, no effects
  return (
    <div>
      {commits.map((commit) => (
        <div key={commit.id}>{commit.message}</div>
      ))}
    </div>
  );
}
```

**ISR Configuration:**

```tsx
// app/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = "force-static"; // Force static generation
```

**Benefits:**

- No loading flash (data server-rendered)
- GitHub API called server-side (no CORS, can use tokens safely)
- CDN-cached responses (Vercel Edge Network)
- Automatic revalidation every 5 minutes

**Files:**

- MODIFIED: `app/page.tsx` (add revalidate export, fetch GitHub data)
- MODIFIED: `components/sections/tech-and-code-section.tsx` (accept githubData prop)
- MODIFIED: `components/github-activity.tsx` (remove "use client", useState, useEffect)
- DELETE: `app/api/github/route.ts` (no longer needed, move logic to page.tsx)

**Alternative: Separate data fetching function**

```tsx
// lib/github.ts
export async function getGitHubActivity() {
  const res = await fetch("https://api.github.com/users/...", {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    next: { revalidate: 300 },
  });
  return res.json();
}

// app/page.tsx
import { getGitHubActivity } from "@/lib/github";

export default async function Page() {
  const githubData = await getGitHubActivity();
  // ...
}
```

### Phase 4: Minimal Client Islands

**AnimatedCounter:** Keep as tiny client component (genuinely interactive)

```tsx
// components/animated-counter.tsx [CLIENT]
"use client";
import { useState, useEffect, useRef } from "react";

export function AnimatedCounter({ value, suffix = "" }: Props) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasAnimated(true);
        // Animation logic
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
```

**Size:** ~1.5KB gzipped. Acceptable client boundary.

**MarqueeText:** Convert to CSS animation

```tsx
// components/marquee-text.tsx [SERVER]
type Props = {
  text: string;
  direction?: number;
};

export function MarqueeText({ text, direction = 1 }: Props) {
  return (
    <div className="marquee-container">
      <div
        className="marquee-content"
        style={{
          animationDirection: direction > 0 ? "normal" : "reverse"
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}

// globals.css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee-content {
  animation: marquee-scroll 20s linear infinite;
  display: inline-flex;
}
```

**TwinklingStars:** Already CSS-only, just remove "use client"

```tsx
// components/twinkling-stars.tsx [SERVER]
// Remove "use client" - useMemo not needed, compute at build time
export function TwinklingStars() {
  const stars = generateStars(); // Pure function
  return (
    <>
      <style>{/* Inline @keyframes */}</style>
      <div>
        {stars.map((star, i) => (
          <div key={i} style={{...}} />
        ))}
      </div>
    </>
  );
}
```

**Files:**

- MODIFIED: `components/animated-counter.tsx` (add IntersectionObserver)
- MODIFIED: `components/marquee-text.tsx` (remove "use client", use CSS)
- MODIFIED: `components/twinkling-stars.tsx` (remove "use client", remove useMemo)

### Phase 5: GraphSection Remains Client

**No changes needed.** GraphSection is already:

- Dynamically imported with `ssr: false`
- Heavy client-side interactivity (React Flow, Zustand)
- Properly isolated boundary

```tsx
// app/page.tsx
const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection,
    ),
  { ssr: false, loading: () => <LoadingFallback /> },
);
```

**Why keep client:** React Flow requires:

- Canvas manipulation
- Event handlers (hover, click, drag)
- Complex state (node positions, edges, expansions)
- Real-time interactions

**This is the correct use of client components.**

## Server/Client Boundary Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ app/page.tsx [SERVER COMPONENT]                             │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ <HeroParallaxWrapper> [CLIENT]                         │  │
│ │   useScroll, useTransform                              │  │
│ │   ┌──────────────────────────────────────────────────┐ │  │
│ │   │ {children} [SERVER]                              │ │  │
│ │   │   Static hero content                            │ │  │
│ │   │   <TwinklingStars> [SERVER, CSS-only]           │ │  │
│ │   └──────────────────────────────────────────────────┘ │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ <nav> [SERVER] Static navigation                            │
│                                                              │
│ <MarqueeText> [SERVER] CSS animation                        │
│                                                              │
│ <AboutSection> [SERVER] Static split-screen                 │
│   ├─ Static left panel                                      │
│   └─ Static right panel (CSS animations)                    │
│                                                              │
│ <MetricsSection> [SERVER]                                   │
│   └─ <AnimatedCounter> [CLIENT] × 5 islands                 │
│         Tiny intersection-triggered counter                 │
│                                                              │
│ <TechAndCodeSection githubData={serverData}> [SERVER]       │
│   ├─ Tech stack grid (static)                               │
│   └─ <GitHubActivity commits={commits}> [SERVER]            │
│         Pure presentational                                 │
│                                                              │
│ <ExperienceTimeline> [SERVER]                               │
│   └─ CSS animations                                         │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ <GraphSection> [CLIENT, dynamic, ssr:false]           │  │
│ │   React Flow, Zustand, complex interactivity          │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ <CSSAnimationPolyfill> [CLIENT]                             │
│   Intersection Observer fallback (hidden component)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Server bundle: Layout, data, static markup
Client bundle: HeroParallaxWrapper, AnimatedCounter, GraphSection, polyfill
```

**Bundle size comparison:**

| Current (v1.1)           | Target (v1.2)            | Savings          |
| ------------------------ | ------------------------ | ---------------- |
| All components client    | Only 3 components client | ~60%             |
| Framer Motion everywhere | Only hero parallax       | ~100KB           |
| Client GitHub fetch      | Server ISR               | No loading flash |
| 300-line client page     | 300-line server page     | Better FCP       |

## Data Flow Changes

### GitHub Data Flow

**Current:**

```
Browser → page.tsx mounts → useEffect runs →
fetch("/api/github") → API route → GitHub API →
response → setState → re-render → display
```

**Timeline:** ~500-1000ms (network + API latency)
**Result:** Loading flash, no SSR

**Target:**

```
Request → Next.js server → fetch GitHub API (with ISR cache) →
render page with data → stream HTML → browser displays
```

**Timeline:** ~50-200ms (CDN cached after first request)
**Result:** Instant display, no loading state

### Animation Trigger Flow

**Current (framer-motion):**

```
Browser → page.tsx mounts → framer-motion hydrates →
motion components register → IntersectionObserver (internal) →
animate via JavaScript → RAF loop → DOM updates
```

**Bundle:** ~100KB framer-motion

**Target (CSS):**

```
Browser → receives HTML with data-animate attributes →
CSS animations auto-trigger via animation-timeline: view() →
GPU-accelerated transforms → no JavaScript needed
```

**Bundle:** 0KB (native CSS)

**Polyfill flow (older browsers):**

```
Browser → CSSAnimationPolyfill mounts →
check CSS.supports("animation-timeline", "view()") →
if false: IntersectionObserver watches [data-animate] →
add .animate-in class → CSS animation triggers
```

**Bundle:** ~1KB polyfill

## Suggested Build Order

### Phase A: Foundation (No visual changes)

**Goal:** Set up server/client boundaries without breaking existing functionality.

**Steps:**

1. Extract HeroParallaxWrapper component (client)
2. Update page.tsx to use wrapper (remove "use client" NOT yet)
3. Verify hero parallax still works
4. Add CSS animation definitions to globals.css
5. Add CSSAnimationPolyfill component
6. Test in production build

**Verification:**

- `npm run build` succeeds
- Hero parallax smooth
- No console errors
- No visual regressions

**Files touched:**

- NEW: `components/hero-parallax-wrapper.tsx`
- NEW: `components/css-animation-polyfill.tsx`
- MODIFIED: `app/globals.css`

**Commit:** "refactor: extract hero parallax wrapper (prep for SSR)"

### Phase B: Migrate Static Sections to CSS

**Goal:** Remove framer-motion from static sections, migrate to CSS animations.

**Steps:**

1. Update AboutSection: Replace motion.span/h2/p with data-animate
2. Update MetricsSection: Replace motion.div with data-animate
3. Update ExperienceTimeline: Replace motion.div with data-animate
4. Update TechAndCodeSection: Replace motion.h3/div with data-animate
5. Test each section individually
6. Verify animations trigger on scroll

**Verification:**

- Animations trigger when scrolling into view
- Timing/easing similar to original
- No layout shifts
- Works in Chrome, Safari, Firefox

**Files touched:**

- MODIFIED: `components/sections/metrics-section.tsx` (remove "use client")
- MODIFIED: `components/sections/experience-timeline.tsx` (remove "use client")
- MODIFIED: `components/sections/tech-and-code-section.tsx` (remove "use client")
- MODIFIED: `app/page.tsx` (about section markup)

**Commit:** "refactor: migrate static sections to CSS animations"

### Phase C: Server-Side GitHub Fetching

**Goal:** Move GitHub data fetching to server, eliminate client loading state.

**Steps:**

1. Create `lib/github.ts` with getGitHubActivity function
2. Add ISR config to page.tsx (revalidate: 300)
3. Update page.tsx to fetch data: `const githubData = await getGitHubActivity()`
4. Update TechAndCodeSection to accept githubData prop
5. Update GitHubActivity to be pure presentational (remove "use client", useState, useEffect)
6. Remove cache logic from github-activity.tsx (no longer needed)
7. Delete `app/api/github/route.ts`
8. Test ISR: first load, revalidation after 5min

**Verification:**

- No loading flash on page load
- GitHub data visible immediately
- Revalidation works (check 5min later)
- Build succeeds with static optimization

**Files touched:**

- NEW: `lib/github.ts`
- MODIFIED: `app/page.tsx` (add revalidate, fetch GitHub data)
- MODIFIED: `components/sections/tech-and-code-section.tsx` (add prop)
- MODIFIED: `components/github-activity.tsx` (remove client logic)
- DELETE: `app/api/github/route.ts`

**Commit:** "feat: server-side GitHub data fetching with ISR"

### Phase D: Convert Utility Components

**Goal:** Convert purely presentational components to server components.

**Steps:**

1. MarqueeText: Remove "use client", replace framer-motion with CSS
2. TwinklingStars: Remove "use client", remove useMemo (compute at build time)
3. AnimatedCounter: Keep "use client" but add IntersectionObserver trigger
4. Test each component in isolation

**Verification:**

- Marquee scrolls infinitely (CSS animation)
- Stars twinkle correctly
- Counter animates on intersection
- No hydration mismatches

**Files touched:**

- MODIFIED: `components/marquee-text.tsx`
- MODIFIED: `components/twinkling-stars.tsx`
- MODIFIED: `components/animated-counter.tsx`
- MODIFIED: `app/globals.css` (add marquee keyframes)

**Commit:** "refactor: convert utility components to server/CSS"

### Phase E: Remove page.tsx "use client"

**Goal:** Make page.tsx a server component.

**Steps:**

1. Remove "use client" from app/page.tsx
2. Remove useRef, useScroll, useTransform imports
3. Verify build succeeds
4. Test all sections work correctly
5. Check bundle size reduction

**Verification:**

- `npm run build` shows page.tsx as server component
- Hero parallax works (via wrapper)
- All sections render correctly
- Bundle size reduced ~60%
- Lighthouse score improved

**Files touched:**

- MODIFIED: `app/page.tsx`

**Commit:** "feat: migrate page.tsx to server component"

### Phase F: Optimization & Polish

**Goal:** Enable PPR, optimize images, final polish.

**Steps:**

1. Enable PPR in next.config.ts: `experimental: { ppr: true }`
2. Replace raw `<img>` with `next/image` in tech stack
3. Add loading="lazy" to non-critical images
4. Test production build
5. Lighthouse audit

**Verification:**

- PPR enabled (check build output)
- Images optimized (WebP/AVIF)
- Lazy loading works
- Lighthouse score 95+

**Files touched:**

- MODIFIED: `next.config.ts`
- MODIFIED: `components/sections/tech-and-code-section.tsx`

**Commit:** "feat: enable PPR and optimize images"

## Migration Pattern Reference

### Pattern 1: Extract Scroll Logic

```tsx
// BEFORE: Client boundary at page level
"use client";
export default function Page() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  // ...
}

// AFTER: Server page with client wrapper
export default function Page() {
  return <ScrollWrapper>{/* Server-rendered content */}</ScrollWrapper>;
}

// components/scroll-wrapper.tsx
("use client");
export function ScrollWrapper({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  // ...
  return <div ref={ref}>{children}</div>;
}
```

### Pattern 2: Framer Motion → CSS

```tsx
// BEFORE: Framer Motion client component
"use client";
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// AFTER: Server component with CSS animation
<div data-animate="fade-up">
  Content
</div>

// globals.css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

[data-animate="fade-up"] {
  animation: fade-up 0.6s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

### Pattern 3: Client Fetch → Server Fetch

```tsx
// BEFORE: Client-side fetch
"use client";
export function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/endpoint")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <Loading />;
  return <Display data={data} />;
}

// AFTER: Server component with ISR
// page.tsx
export const revalidate = 300;

export default async function Page() {
  const data = await fetch("...", {
    next: { revalidate: 300 },
  }).then((res) => res.json());

  return <Component data={data} />;
}

// component.tsx (server)
export function Component({ data }) {
  return <Display data={data} />;
}
```

### Pattern 4: Client Islands

```tsx
// BEFORE: Entire section is client
"use client";
export function Section() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveCounter value={count} onChange={setCount} />
      <StaticFooter />
    </div>
  );
}

// AFTER: Server section with client island
export function Section() {
  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveCounter initialValue={0} />
      <StaticFooter />
    </div>
  );
}

// interactive-counter.tsx
("use client");
export function InteractiveCounter({ initialValue }) {
  const [count, setCount] = useState(initialValue);
  // ...
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Passing Functions to Server Components

❌ **Wrong:**

```tsx
// page.tsx [SERVER]
export default function Page() {
  const handler = () => console.log("click");
  return <ClientComponent onClick={handler} />; // Error: Functions not serializable
}
```

✅ **Right:**

```tsx
// page.tsx [SERVER]
export default function Page() {
  return <ClientComponent />; // Handler defined inside client component
}

// client-component.tsx [CLIENT]
("use client");
export function ClientComponent() {
  const handler = () => console.log("click");
  return <button onClick={handler}>Click</button>;
}
```

### Anti-Pattern 2: Using Hooks in Server Components

❌ **Wrong:**

```tsx
// page.tsx [SERVER]
export default function Page() {
  const [state, setState] = useState(0); // Error: Hooks not allowed in server components
  // ...
}
```

✅ **Right:**

```tsx
// page.tsx [SERVER]
export default function Page() {
  return <ClientComponent />;
}

// client-component.tsx [CLIENT]
("use client");
export function ClientComponent() {
  const [state, setState] = useState(0); // OK: Hooks in client component
  // ...
}
```

### Anti-Pattern 3: Importing Server Code in Client Components

❌ **Wrong:**

```tsx
// client-component.tsx [CLIENT]
"use client";
import { getServerData } from "@/lib/server-utils"; // Error: Server-only code in client

export function ClientComponent() {
  const data = getServerData(); // Can't run on client
  // ...
}
```

✅ **Right:**

```tsx
// page.tsx [SERVER]
import { getServerData } from "@/lib/server-utils";

export default async function Page() {
  const data = await getServerData();
  return <ClientComponent data={data} />; // Pass as serializable prop
}

// client-component.tsx [CLIENT]
("use client");
export function ClientComponent({ data }) {
  // Use data (already fetched server-side)
}
```

### Anti-Pattern 4: Over-Using Client Components

❌ **Wrong:**

```tsx
// Everything client "just in case"
"use client";
export function Header() {
  return <nav>{/* Static markup */}</nav>;
}
```

✅ **Right:**

```tsx
// Server by default, client only when needed
export function Header() {
  return (
    <nav>
      {/* Static parts */}
      <ClientToggle /> {/* Only this is client */}
    </nav>
  );
}
```

## Framer Motion → CSS Animation Migration

### Common Animation Mappings

| Framer Motion                               | CSS Alternative                                              |
| ------------------------------------------- | ------------------------------------------------------------ |
| `initial={{ opacity: 0 }}`                  | `@keyframes fade-in { from { opacity: 0; } }`                |
| `whileInView={{ opacity: 1 }}`              | `animation-timeline: view();`                                |
| `transition={{ duration: 0.6 }}`            | `animation-duration: 0.6s;`                                  |
| `transition={{ delay: 0.2 }}`               | `animation-delay: 0.2s;`                                     |
| `transition={{ ease: [0.22, 1, 0.36, 1] }}` | `animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);` |
| `viewport={{ once: true }}`                 | `animation-fill-mode: forwards;` (doesn't reverse)           |
| `whileHover={{ scale: 1.05 }}`              | `.el:hover { transform: scale(1.05); }`                      |
| `animate={{ x: [0, 100] }}`                 | `@keyframes slide { to { transform: translateX(100px); } }`  |

### Animation Variants Translation

**Framer Motion variants:**

```tsx
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 },
  },
};

<motion.div variants={variants} initial="hidden" whileInView="visible">
  Content
</motion.div>;
```

**CSS equivalent:**

```tsx
<div data-animate="fade-up-delayed">
  Content
</div>

// globals.css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-animate="fade-up-delayed"] {
  animation: fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

### Staggered Animations

**Framer Motion stagger:**

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
>
  {items.map((item, i) => (
    <motion.div key={i} variants={childVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

**CSS equivalent:**

```tsx
<div className="stagger-container">
  {items.map((item, i) => (
    <div
      key={i}
      data-animate="fade-in"
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      {item}
    </div>
  ))}
</div>
```

### When CSS Can't Replace Framer Motion

**Keep framer-motion for:**

- Gesture interactions (drag, pan, swipe)
- Physics-based animations (spring, inertia)
- Dynamic animations based on state
- Coordinated multi-element animations
- Path animations (SVG morphing)

**In this portfolio:**

- Hero parallax (useScroll + useTransform) → Keep framer-motion in HeroParallaxWrapper
- Graph interactions (hover, expand) → Keep framer-motion in GraphSection
- Entrance animations → Migrate to CSS
- Marquee scroll → Migrate to CSS
- Counter animation → Keep in client component (state-driven)

## Integration Points

### Next.js Config Updates

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable React Compiler (already enabled)
  experimental: {
    reactCompiler: true,

    // Enable Partial Prerendering
    ppr: true,
  },

  // Optimize imports (already configured)
  optimizePackageImports: ["lucide-react", "framer-motion", "@xyflow/react"],
};

export default nextConfig;
```

**PPR explanation:** Partial Prerendering allows mixing static and dynamic content in the same route. Static shell (hero, about, tech) pre-rendered at build time, dynamic content (GitHub commits if > 5min old) streamed.

### ISR Configuration

```tsx
// app/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = "force-static"; // Force static generation

export default async function Page() {
  const githubData = await fetch("https://api.github.com/users/...", {
    next: { revalidate: 300 },
  }).then((res) => res.json());

  // ...
}
```

**How ISR works:**

1. First request: Static page generated at build time (or on-demand)
2. Cached at CDN for 5 minutes
3. After 5min: Background revalidation triggered on next request
4. Stale content served while revalidating
5. Fresh content cached once revalidation completes

**Benefits:**

- Fast response times (CDN-cached)
- Fresh data (revalidates regularly)
- No loading states (always has data)

### Suspense Boundaries

```tsx
// app/page.tsx
import { Suspense } from "react";

export default async function Page() {
  return (
    <main>
      {/* Static content (immediate) */}
      <HeroParallaxWrapper>...</HeroParallaxWrapper>
      <MarqueeText />
      <AboutSection />

      {/* Dynamic content (streamed) */}
      <Suspense fallback={<GitHubSkeleton />}>
        <GitHubSection />
      </Suspense>

      {/* Heavy client component (lazy loaded) */}
      <GraphSection />
    </main>
  );
}
```

**With PPR enabled:** Static shell (hero, about, marquee) sent immediately. GitHub data streams in when ready. Graph loads on demand.

## Build Order Dependencies

```
Phase A (Foundation)
  └─> Phase B (Static sections)
       └─> Phase D (Utility components)
            └─> Phase E (Remove "use client")
                 └─> Phase F (Optimization)

Phase C (GitHub fetching) - Independent, can run parallel to Phase B/D
```

**Critical path:** A → B → D → E → F (must be sequential)

**Parallel work:** Phase C can start after Phase A completes

**Testing checkpoints:**

- After Phase A: Hero parallax works, CSS polyfill loads
- After Phase B: All sections animate correctly
- After Phase C: GitHub data loads instantly
- After Phase D: Marquee/stars/counter work
- After Phase E: Build succeeds as server component
- After Phase F: Lighthouse score 95+

## Performance Impact Estimation

### Bundle Size Reduction

| Component       | Before (gzipped) | After (gzipped)    | Savings           |
| --------------- | ---------------- | ------------------ | ----------------- |
| Framer Motion   | ~100 KB          | ~15 KB (hero only) | 85 KB             |
| Page.tsx        | ~8 KB            | ~2 KB (server)     | 6 KB              |
| Static sections | ~12 KB           | 0 KB (server)      | 12 KB             |
| GitHub activity | ~3 KB            | 0 KB (server)      | 3 KB              |
| CSS animations  | 0 KB             | ~1 KB              | -1 KB             |
| **Total**       | **~123 KB**      | **~18 KB**         | **~105 KB (85%)** |

**First Load JS:** ~200 KB → ~95 KB (52% reduction)

### Rendering Performance

| Metric                         | Before | After | Change |
| ------------------------------ | ------ | ----- | ------ |
| FCP (First Contentful Paint)   | ~1.2s  | ~0.4s | -67%   |
| LCP (Largest Contentful Paint) | ~1.8s  | ~0.6s | -67%   |
| TTI (Time to Interactive)      | ~2.5s  | ~1.2s | -52%   |
| TBT (Total Blocking Time)      | ~300ms | ~80ms | -73%   |
| CLS (Cumulative Layout Shift)  | 0.02   | 0.01  | -50%   |

**Lighthouse Score:** 78 → 96 (+23%)

### Network Performance

| Resource           | Before         | After        | Change                   |
| ------------------ | -------------- | ------------ | ------------------------ |
| HTML size          | ~15 KB         | ~45 KB       | +200% (more SSR content) |
| JS bundle          | ~200 KB        | ~95 KB       | -52%                     |
| Initial requests   | 12             | 8            | -33%                     |
| GitHub API latency | 500ms (client) | 0ms (cached) | -100%                    |

**Total page weight:** 215 KB → 140 KB (35% reduction)

## Risk Mitigation

### Risk 1: CSS Animation Browser Support

**Risk:** `animation-timeline: view()` not supported in older browsers.

**Impact:** Animations don't trigger on scroll (elements stay invisible).

**Mitigation:**

- Implement CSSAnimationPolyfill with IntersectionObserver fallback
- Use `@supports` queries for progressive enhancement
- Test in Chrome, Safari, Firefox (latest 2 versions)

**Fallback strategy:**

```css
/* Modern browsers: scroll-driven animations */
@supports (animation-timeline: view()) {
  [data-animate] {
    animation-timeline: view();
  }
}

/* Older browsers: class-based animations */
@supports not (animation-timeline: view()) {
  [data-animate] {
    opacity: 0;
  }
  [data-animate].animate-in {
    animation: fade-in 0.6s ease-out forwards;
  }
}
```

### Risk 2: Breaking Hero Parallax

**Risk:** Extracting scroll logic breaks smooth parallax effect.

**Impact:** Hero doesn't scale/fade on scroll.

**Mitigation:**

- Test HeroParallaxWrapper in isolation before integrating
- Keep exact same scroll hooks (useScroll, useTransform)
- Verify RAF loop performance (no jank)
- A/B test before/after

**Rollback plan:** Keep "use client" in page.tsx if parallax breaks.

### Risk 3: GitHub ISR Stale Data

**Risk:** 5-minute cache shows outdated commits.

**Impact:** Live feed not actually "live."

**Mitigation:**

- Document 5-minute revalidation in UI ("Updates every 5 min")
- Consider on-demand revalidation for critical updates
- Monitor GitHub API rate limits (5000/hour with token)

**Alternative:** Keep client-side fetch but with server-rendered initial data:

```tsx
export default async function Page() {
  const initialData = await getGitHubActivity();
  return <GitHubActivity initialData={initialData} />;
}
```

### Risk 4: Hydration Mismatches

**Risk:** Server-rendered HTML doesn't match client hydration.

**Impact:** React warnings, potential content flashes.

**Mitigation:**

- Use deterministic data (no Date.now(), Math.random())
- Test with React Strict Mode enabled
- Use seeded PRNG for background patterns (already implemented)
- Verify TwinklingStars generates same stars server/client

**Already handled:** `mulberry32` seeded random for background patterns.

## Success Criteria

### Technical Metrics

- [ ] `npm run build` shows page.tsx as server component
- [ ] First Load JS < 100 KB (currently ~200 KB)
- [ ] Lighthouse Performance score > 95 (currently 78)
- [ ] No console warnings/errors
- [ ] No hydration mismatches
- [ ] GitHub data loads instantly (no flash)

### Visual Metrics

- [ ] Hero parallax smooth (no jank)
- [ ] All animations trigger correctly
- [ ] Marquee scrolls infinitely
- [ ] Stars twinkle randomly
- [ ] Counters animate on intersection
- [ ] Graph interactions work (hover, expand)

### User Experience

- [ ] FCP < 0.5s (currently ~1.2s)
- [ ] No loading flashes
- [ ] Smooth scroll performance (60fps)
- [ ] Works in latest Chrome, Safari, Firefox
- [ ] Mobile responsive (no regressions)

### Code Quality

- [ ] Server/client boundaries clearly documented
- [ ] No "use client" in purely presentational components
- [ ] Type-safe props for all components
- [ ] ESLint/Prettier passing
- [ ] Git commits atomic (one change per commit)

## Sources

**Official Documentation:**

- Next.js Composition Patterns: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
- React "use client" directive: https://react.dev/reference/rsc/use-client
- Next.js Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching

**Codebase Analysis:**

- `/Users/sunny/Desktop/Sunny/portfolio/app/page.tsx` (v1.1)
- `/Users/sunny/Desktop/Sunny/portfolio/components/sections/*` (v1.1)
- `/Users/sunny/Desktop/Sunny/portfolio/.planning/codebase/ARCHITECTURE.md` (v1.1)
- `/Users/sunny/Desktop/Sunny/portfolio/package.json` (dependencies)

**Confidence Assessment:**

| Area                     | Level  | Reason                                                     |
| ------------------------ | ------ | ---------------------------------------------------------- |
| Server/client boundaries | HIGH   | Official Next.js patterns, verified with docs              |
| CSS animations           | HIGH   | MDN spec, browser support data                             |
| ISR configuration        | HIGH   | Next.js official docs, tested pattern                      |
| Bundle size estimates    | MEDIUM | Based on typical gzipped sizes, needs verification         |
| Performance metrics      | MEDIUM | Estimated from typical SSR improvements, needs measurement |

---

_Research complete. Ready for roadmap creation._
