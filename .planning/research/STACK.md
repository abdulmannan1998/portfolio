# Technology Stack for SSR Migration

**Project:** Portfolio SSR Migration
**Researched:** 2026-02-07
**Confidence:** HIGH

## Executive Summary

The portfolio already has a strong foundation with Next.js 16.1.6, React 19.2.3, and PPR enabled. SSR migration requires **minimal new dependencies** but significant architectural changes. The primary challenge is replacing framer-motion's scroll-based animations (whileInView, useScroll) with CSS alternatives that work in Server Components.

**Key insight:** Most framer-motion usage is for entrance animations and scroll effects. These can be replaced with CSS animations + Intersection Observer API for the client boundary components that need interactivity triggers.

---

## Current Stack (Validated)

### Core Framework

| Technology | Version | Status                 |
| ---------- | ------- | ---------------------- |
| Next.js    | 16.1.6  | ✓ Current, PPR enabled |
| React      | 19.2.3  | ✓ Latest stable        |
| TypeScript | 5.x     | ✓ Current              |

### Rendering Configuration

| Feature                    | Status      | Config                   |
| -------------------------- | ----------- | ------------------------ |
| PPR (Partial Prerendering) | ✓ Enabled   | `cacheComponents: true`  |
| React Compiler             | ✓ Enabled   | `reactCompiler: true`    |
| Suspense Streaming         | ✓ Available | Built-in with App Router |

### UI/Animation Libraries

| Library                    | Version | Usage                               | SSR Status            |
| -------------------------- | ------- | ----------------------------------- | --------------------- |
| Framer Motion              | 12.31.0 | Entrance animations, scroll effects | ⚠️ Client-only        |
| React Flow (@xyflow/react) | 12.10.0 | Interactive graph                   | ⚠️ Client-only (keep) |
| Zustand                    | 5.0.11  | Graph state                         | ⚠️ Client-only (keep) |
| Tailwind CSS               | 4.x     | Styling                             | ✓ SSR-compatible      |
| tw-animate-css             | 1.4.0   | CSS animations                      | ✓ SSR-compatible      |

### Other Dependencies

| Library                  | Version | Purpose           |
| ------------------------ | ------- | ----------------- |
| Lucide React             | 0.563.0 | Icons             |
| Vercel Analytics         | 1.6.1   | Analytics         |
| class-variance-authority | 0.7.1   | Variant utilities |

---

## Stack Additions/Changes for SSR Migration

### ✅ No New Runtime Dependencies Required

The existing stack already includes everything needed for SSR migration. The migration is primarily **architectural**, not dependency-based.

### CSS Animation Strategy

**Replace framer-motion entrance animations with native CSS + minimal client-side logic.**

#### Pattern 1: CSS Keyframes for Static Entrance Animations

**What to replace:** `motion` components with `initial`, `animate` props (non-scroll)

**How:**

```tsx
// BEFORE (Client Component)
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>

// AFTER (Server Component + CSS)
<div className="animate-fade-in-up">
  Content
</div>
```

**CSS (add to globals.css):**

```css
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

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

**Benefits:**

- Works in Server Components
- No hydration mismatch
- Plays immediately on page load
- Better performance (no JS execution)

**Limitations:**

- Cannot be triggered conditionally
- No scroll-based triggers
- Fixed timing (but can use `animation-delay` for staggering)

---

#### Pattern 2: Intersection Observer for Scroll-Based Entrance Animations

**What to replace:** `whileInView` props

**Strategy:** Minimal client component wrapper that adds CSS class on intersection

**How:**

```tsx
// NEW: Shared client component wrapper
// components/animate-on-view.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
};

export function AnimateOnView({ children, className, threshold = 0.1 }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={isVisible ? className : "opacity-0"}>
      {children}
    </div>
  );
}

// USAGE in Server Component
import { AnimateOnView } from "@/components/animate-on-view";

export function MetricsSection() {
  return (
    <section>
      <AnimateOnView className="animate-fade-in-up">
        <div>Server-rendered content</div>
      </AnimateOnView>
    </section>
  );
}
```

**Benefits:**

- Server Components can use it via `children` pattern
- Single, reusable client boundary
- Native Intersection Observer (widely supported)
- No external dependency

**Limitations:**

- Requires one client component in the tree
- Not as declarative as `whileInView`
- Need to predefine animation classes

---

#### Pattern 3: CSS Scroll-Driven Animations (Advanced)

**What to replace:** `useScroll`, `useTransform`, scroll-linked effects

**Browser Support:** Chrome 115+, Edge 115+, Safari 18+ (September 2025)
**Fallback:** Progressive enhancement (animation just doesn't play in older browsers)

**How:**

```css
/* For scroll-linked parallax/scale effects */
@keyframes hero-scale {
  from {
    scale: 1;
    opacity: 1;
  }
  to {
    scale: 0.8;
    opacity: 0;
  }
}

.hero-sticky {
  animation: hero-scale linear;
  animation-timeline: scroll();
  animation-range: 0 15vh;
}
```

**When to use:**

- Hero sections with scroll-linked transforms
- Parallax effects
- Progressive enhancement scenarios

**When NOT to use:**

- Need IE11 or older Safari support
- Animations are critical to UX (no fallback)
- Complex gesture interactions beyond scrolling

---

#### Pattern 4: Keep Framer Motion for Complex Interactions

**What to keep:** Truly interactive animations that can't be replicated with CSS

**Examples:**

- `MarqueeText` - Infinite looping marquee with direction control
- Drag interactions
- Gesture-based animations (drag, pinch, etc.)
- Dynamic animations based on user input

**Strategy:** Isolate these in small client components

```tsx
// Keep as client component
"use client";
import { motion } from "framer-motion";

export function MarqueeText({ text }: { text: string }) {
  return (
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity }}
    >
      {text}
    </motion.div>
  );
}
```

---

### Next.js 16 Server Component Patterns

#### Data Fetching Pattern: ISR with Fetch Revalidation

**For static content with periodic updates (resume data, blog posts):**

```tsx
// app/page.tsx (Server Component)
export const revalidate = 3600; // Revalidate every hour

async function getResumeData() {
  // Could fetch from CMS, but for now it's imported
  return RESUME_DATA;
}

export default async function Page() {
  const data = await getResumeData();

  return (
    <main>
      <MetricsSection metrics={data.metrics} />
    </main>
  );
}
```

**For dynamic content (GitHub activity):**

```tsx
async function getGitHubActivity() {
  const res = await fetch(
    "https://api.github.com/users/abdulmannan1998/events",
    {
      next: {
        revalidate: 300, // 5 minutes
        tags: ["github-activity"],
      },
    },
  );
  return res.json();
}

// Can trigger on-demand revalidation
import { revalidateTag } from "next/cache";

async function refreshGitHubData() {
  "use server";
  revalidateTag("github-activity");
}
```

---

#### Suspense Streaming Pattern

**For slow data fetches or client-heavy components:**

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      {/* Fast: Rendered immediately */}
      <HeroSection />

      {/* Slow: Streamed in when ready */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsSection />
      </Suspense>

      {/* Client-only: Hydrated after static shell */}
      <Suspense fallback={<GraphSkeleton />}>
        <GraphSection />
      </Suspense>
    </main>
  );
}
```

**Benefits:**

- Initial HTML arrives faster (TTFB)
- Progressive enhancement
- Better perceived performance

**Critical:** Wrap runtime APIs in Suspense

```tsx
// components/user-preferences.tsx (Server Component)
import { cookies } from "next/headers";

async function UserPreferences() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");

  return <div>Theme: {theme?.value}</div>;
}

// MUST wrap in Suspense in parent
<Suspense fallback={<div>Loading preferences...</div>}>
  <UserPreferences />
</Suspense>;
```

---

#### Image Optimization Pattern

**Already configured in next.config.ts:**

```ts
images: {
  formats: ["image/avif", "image/webp"],
}
```

**Usage pattern for remote images:**

```tsx
import Image from 'next/image'

// Need to whitelist domains for remote images
// next.config.ts:
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'avatars.githubusercontent.com',
      pathname: '/u/**',
    },
  ],
}

// Component:
<Image
  src="https://avatars.githubusercontent.com/u/12345"
  alt="GitHub Avatar"
  width={64}
  height={64}
  className="rounded-full"
/>
```

**For static imports (already optimal):**

```tsx
import profileImage from "@/public/profile.png";

<Image
  src={profileImage}
  alt="Profile"
  placeholder="blur" // Auto-generated blur placeholder
/>;
```

---

### Component Boundary Strategy

**Guideline: Start with Server Components, add `'use client'` only when necessary.**

#### Keep as Client Components:

1. **React Flow graph** (`GraphSection`) - Canvas-based, highly interactive
2. **Zustand store** (`graph-store.tsx`) - Client state management
3. **Animated counter** - Uses `useEffect` for counting animation
4. **Marquee text** - Continuous animation with framer-motion
5. **Intersection Observer wrapper** - `AnimateOnView` (new)

#### Convert to Server Components:

1. **Main page layout** (`app/page.tsx`) - Remove `'use client'`
2. **Metrics section** - Static content, replace framer with CSS
3. **Experience timeline** - Static content, replace framer with CSS
4. **Tech stack section** - Static content
5. **Navigation** - Static links (can stay in layout)

#### Hybrid Approach:

```tsx
// Server Component (outer)
export function MetricsSection() {
  const metrics = RESUME_DATA.metrics;

  return (
    <section className="py-24">
      <h2>Measurable Results</h2>
      <div className="grid gap-6">
        {metrics.map((metric) => (
          // Client Component (inner, only for animation)
          <AnimateOnView key={metric.id} className="animate-fade-in-up">
            <MetricCard metric={metric} />
          </AnimateOnView>
        ))}
      </div>
    </section>
  );
}

// Server Component (metric card itself)
function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="bg-stone-900 p-8">
      <h3>{metric.label}</h3>
      {metric.value.includes("→") ? (
        <span className="text-6xl">{metric.value}</span>
      ) : (
        <AnimatedCounter value={metric.value} /> // This stays client
      )}
    </div>
  );
}
```

---

## Migration Dependencies (Development Only)

### Potentially Useful for Debugging

| Package       | Purpose                  | Install? |
| ------------- | ------------------------ | -------- |
| `server-only` | Enforce server-only code | Optional |
| `client-only` | Enforce client-only code | Optional |

**Usage:**

```tsx
// lib/data.ts
import "server-only";

export async function getSecretData() {
  // If accidentally imported in client component, build fails
  return fetch("...", {
    headers: { Authorization: `Bearer ${process.env.SECRET_KEY}` },
  });
}
```

**Recommendation:** Add during refactor to catch boundary violations early.

```bash
npm install server-only client-only --save-dev
```

---

## What NOT to Add

### ❌ SSR-Specific Animation Libraries

**Avoid:**

- `react-intersection-observer` - Built-in Intersection Observer API is sufficient
- `react-spring` - Adds bundle size, doesn't solve SSR animation fundamentally
- `gsap` - Overkill for entrance animations, mostly client-side

**Why:** CSS + minimal Intersection Observer wrapper is lighter and more maintainable.

### ❌ State Management for Server Data

**Avoid:**

- `@tanstack/react-query` - Not needed with Next.js built-in fetch caching
- `swr` - Redundant with Next.js revalidation
- `redux` / `jotai` for static data - Unnecessary complexity

**Why:** Next.js App Router has built-in caching, revalidation, and streaming. Only Zustand for client-only graph state is justified.

### ❌ Additional Meta Frameworks

**Avoid:**

- `remix` - Not compatible with Next.js
- `astro` - Different paradigm
- `qwik` - Different paradigm

**Why:** Next.js 16 with PPR already provides optimal server/client rendering.

---

## CSS Animation Utilities (Add to globals.css)

**Recommended additions to support Server Component animations:**

```css
/* Entrance animations - replaces framer-motion initial/animate */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

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

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Utility classes */
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Stagger utilities (via animation-delay) */
.delay-100 {
  animation-delay: 100ms;
}
.delay-200 {
  animation-delay: 200ms;
}
.delay-300 {
  animation-delay: 300ms;
}
.delay-400 {
  animation-delay: 400ms;
}
.delay-500 {
  animation-delay: 500ms;
}

/* Scroll-driven animations (progressive enhancement) */
@supports (animation-timeline: scroll()) {
  .scroll-fade-in {
    animation: fade-in linear;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  .scroll-scale {
    animation: scale-in linear;
    animation-timeline: scroll();
    animation-range: 0 15vh;
  }
}
```

**Integration with tw-animate-css:**

The portfolio already uses `tw-animate-css` which provides additional CSS animation utilities. Check if it already includes some of these patterns to avoid duplication.

---

## Installation Summary

**New runtime dependencies:** NONE

**New dev dependencies (optional):**

```bash
npm install --save-dev server-only client-only
```

**New files to create:**

1. `/components/animate-on-view.tsx` - Intersection Observer wrapper
2. Add CSS keyframes to `/app/globals.css`

**Configuration changes:**

- None required (PPR already enabled)
- Optionally add remote image domains to `next.config.ts` if using external images

---

## Integration Points with Existing Stack

### Framer Motion Reduction Strategy

| Current Component        | Motion Usage                | Migration Strategy                                     |
| ------------------------ | --------------------------- | ------------------------------------------------------ |
| `page.tsx` hero          | `useScroll`, `useTransform` | CSS scroll-driven animation or keep as client boundary |
| `page.tsx` text sections | `whileInView`               | `AnimateOnView` wrapper + CSS                          |
| `MetricsSection`         | `whileInView` with stagger  | `AnimateOnView` + `animation-delay`                    |
| `MarqueeText`            | Infinite animation          | Keep as-is (client component)                          |
| `TwinklingStars`         | Pure CSS (no motion)        | Already SSR-compatible                                 |

### React Flow (Keep Client-Only)

```tsx
// GraphSection remains client component
'use client'
import { ReactFlow } from '@xyflow/react'
import { useGraphStore } from '@/lib/stores/graph-store'

export function GraphSection() {
  // Interactive canvas, can't be server-rendered
  return <ReactFlow ... />
}

// Parent can still be Server Component
import { Suspense } from 'react'
import { GraphSection } from './graph-section'

export function ExperiencePage() {
  return (
    <section>
      <Suspense fallback={<GraphSkeleton />}>
        <GraphSection />
      </Suspense>
    </section>
  )
}
```

### Zustand (Keep for Client State)

Zustand is only used for graph interaction state. This is appropriate client-side state management and should remain.

---

## Performance Expectations

### Before SSR Migration (Current)

- **TTFB:** Fast (Vercel edge)
- **FCP:** Delayed (entire page client-rendered)
- **LCP:** Delayed (content painted after hydration)
- **TTI:** Slow (all JS must load and execute)
- **JavaScript bundle:** ~500KB+ (framer-motion, react-flow, all components)

### After SSR Migration

- **TTFB:** Same or better
- **FCP:** Much faster (static HTML shell arrives immediately)
- **LCP:** Much faster (static content visible before JS)
- **TTI:** Faster (only interactive components hydrate)
- **JavaScript bundle:** ~200-300KB (framer-motion mostly removed, only client boundaries)

**Estimated improvements:**

- 50-70% reduction in JavaScript bundle size
- 2-3x faster First Contentful Paint
- 1.5-2x faster Largest Contentful Paint
- Better Core Web Vitals scores

---

## Confidence Assessment

| Area                         | Confidence | Reason                                                                 |
| ---------------------------- | ---------- | ---------------------------------------------------------------------- |
| PPR Configuration            | HIGH       | Official Next.js 16 docs, already enabled in project                   |
| Server Component Patterns    | HIGH       | Official React 19 + Next.js docs                                       |
| ISR/Revalidation             | HIGH       | Official Next.js docs, well-established pattern                        |
| Suspense Streaming           | HIGH       | Official React 19 docs                                                 |
| CSS Animation Strategy       | MEDIUM     | Based on CSS standards, but requires manual implementation             |
| Intersection Observer        | HIGH       | Standard Web API, widely supported                                     |
| CSS Scroll-Driven Animations | MEDIUM     | New spec, limited browser support, use as progressive enhancement      |
| Performance Impact           | MEDIUM     | Based on typical SSR benefits, actual numbers depend on implementation |

---

## Sources

**Official Documentation:**

- Next.js Partial Prerendering: https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
- Next.js Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Next.js ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- React Suspense: https://react.dev/reference/react/Suspense
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- MDN CSS Scroll-Driven Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- MDN Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

**Current Project Files:**

- `/Users/sunny/Desktop/Sunny/portfolio/package.json` - Verified versions
- `/Users/sunny/Desktop/Sunny/portfolio/next.config.ts` - Verified PPR configuration
- `/Users/sunny/Desktop/Sunny/portfolio/app/page.tsx` - Current framer-motion usage
- `/Users/sunny/Desktop/Sunny/portfolio/app/globals.css` - Existing CSS setup
- `/Users/sunny/Desktop/Sunny/portfolio/components/twinkling-stars.tsx` - Example of CSS-only animation

---

## Next Steps for Implementation

1. **Phase 1: Setup**
   - Add `server-only` / `client-only` dev dependencies
   - Create `AnimateOnView` component
   - Add CSS keyframes to globals.css

2. **Phase 2: Component Migration**
   - Remove `'use client'` from `app/page.tsx`
   - Identify which sections can be pure Server Components
   - Wrap interactive parts in minimal client boundaries

3. **Phase 3: Animation Replacement**
   - Replace `motion.div` with `AnimateOnView` + CSS classes
   - Convert `useScroll`/`useTransform` to CSS scroll-driven or keep as isolated client component
   - Test animations across browsers

4. **Phase 4: Data Fetching**
   - Add `revalidate` exports to routes
   - Implement Suspense boundaries for slow data
   - Test streaming behavior

5. **Phase 5: Optimization**
   - Remove unused framer-motion imports
   - Bundle analysis to verify size reduction
   - Performance testing (Lighthouse, Core Web Vitals)
