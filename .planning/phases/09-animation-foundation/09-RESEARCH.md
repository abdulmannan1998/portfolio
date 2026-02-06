# Phase 9: Animation Foundation - Research

**Researched:** 2026-02-07
**Domain:** CSS scroll-driven animations, keyframe animations, React parallax patterns
**Confidence:** HIGH

## Summary

CSS scroll-driven animations with `animation-timeline: view()` are production-ready as of 2026, with 78% browser support across Chrome 115+, Safari 26+, Edge 115+, and Opera 101+. Firefox remains the notable exception (requires manual flag enablement). The standard approach uses native CSS animations in supporting browsers with an Intersection Observer fallback for Firefox and older browsers.

For hero parallax extraction, the established pattern is a "use client" wrapper component that accepts server-rendered children via the `children` prop. This preserves RSC benefits while isolating client-side scroll logic. The current implementation uses `framer-motion`'s `useScroll` and `useTransform` hooks, which should be replaced with `requestAnimationFrame`-based direct DOM manipulation for better performance and zero-dependency implementation.

CSS keyframe animations using `transform` and `opacity` are GPU-accelerated by default and provide the best performance. The current framer-motion patterns (fade-in-up with stagger) can be directly replicated with CSS keyframes and either `animation-timeline: view()` or Intersection Observer triggers.

**Primary recommendation:** Use native CSS scroll-driven animations with custom Intersection Observer polyfill (not npm package) for maximum control and minimal bundle size. Hero parallax should use direct scroll listener with `requestAnimationFrame` throttling and `transform: translateY()` for GPU acceleration.

## Standard Stack

### Core

| Library                          | Version       | Purpose                             | Why Standard                                                            |
| -------------------------------- | ------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| CSS `animation-timeline: view()` | Chrome 115+   | Scroll-driven entrance animations   | Native browser API, runs on compositor thread, zero JavaScript overhead |
| Intersection Observer API        | Baseline 2019 | Polyfill for view() in Firefox      | Native browser API, widely supported, efficient viewport detection      |
| CSS `@keyframes`                 | All browsers  | Define reusable animation sequences | Standard CSS feature, GPU-accelerated, declarative                      |
| `requestAnimationFrame`          | All browsers  | Throttle parallax scroll events     | Standard browser API, syncs with browser paint cycles, prevents jank    |

### Supporting

| Library                           | Version             | Purpose                                   | When to Use                                          |
| --------------------------------- | ------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `@media (prefers-reduced-motion)` | Baseline 2019       | Accessibility - disable/reduce animations | Always - required for WCAG 2.3.3 compliance          |
| `will-change` CSS property        | All modern browsers | GPU layer promotion hint                  | Sparingly - only for active animations, remove after |

### Alternatives Considered

| Instead of             | Could Use                                           | Tradeoff                                                                                                      |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Custom IO polyfill     | `scroll-timeline` polyfill (flackr/scroll-timeline) | Polyfill adds ~10-15KB, requires external dependency, but provides higher fidelity to native API              |
| Direct scroll listener | GSAP ScrollTrigger                                  | GSAP adds significant bundle size (~50KB), overkill for simple parallax, but provides advanced features       |
| CSS animations         | Continue using framer-motion                        | framer-motion animations run in React (JavaScript thread), CSS runs on compositor thread (better performance) |

**Installation:**

```bash
# No npm packages required for core functionality
# Intersection Observer is native API (no polyfill needed - Baseline since 2019)
# All core features use native browser APIs
```

## Architecture Patterns

### Recommended Project Structure

```
app/
├── globals.css              # CSS keyframes defined here
│   ├── @keyframes fade-in-up
│   ├── @keyframes fade-in-down
│   ├── @keyframes fade-in-left
│   └── @keyframes scale-in
components/
├── hero-parallax.tsx        # Client wrapper for hero section
└── sections/
    └── [section].tsx        # Sections ready for Phase 10-12 migration
```

### Pattern 1: CSS Scroll-Driven Animations with Polyfill

**What:** Use `animation-timeline: view()` in supporting browsers, Intersection Observer in others
**When to use:** Entrance animations that trigger when elements enter viewport
**Example:**

```css
/* Source: MDN CSS animation-timeline documentation */
.fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    animation: fade-in-reduce 0.6s ease-out both;
  }

  @keyframes fade-in-reduce {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
```

### Pattern 2: Intersection Observer Polyfill for Firefox

**What:** Custom IO implementation that adds animation class when element enters viewport
**When to use:** As fallback for browsers without animation-timeline support
**Example:**

```typescript
// Custom hook for scroll-driven animation polyfill
function useScrollAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Feature detection - skip if native support exists
    if (CSS.supports("animation-timeline: view()")) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
```

### Pattern 3: Client Wrapper with Server-Rendered Children

**What:** "use client" component that accepts `children` prop for RSC content
**When to use:** When client interactivity (scroll listeners) needs to wrap server-rendered content
**Example:**

```typescript
// Source: Next.js official documentation - Server and Client Components
'use client';

export function HeroParallax({ children }: { children: React.ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const maxScroll = window.innerHeight * 0.15;
          const progress = Math.min(scrolled / maxScroll, 1);

          // GPU-accelerated transforms
          hero.style.transform = `scale(${1 - progress * 0.2})`;
          hero.style.opacity = `${1 - progress}`;

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="sticky top-0">
      {children}
    </section>
  );
}

// Usage in Server Component (page.tsx)
export default function Page() {
  return (
    <HeroParallax>
      <h1>Server-rendered static content</h1>
      <p>No framer-motion, no client-side rendering</p>
    </HeroParallax>
  );
}
```

### Pattern 4: Stagger Delays with CSS Custom Properties

**What:** Use CSS variables and calc() for scalable stagger patterns
**When to use:** Lists or grids where items should animate sequentially
**Example:**

```typescript
// Component
{items.map((item, i) => (
  <div
    key={item.id}
    className="fade-in-up"
    style={{ '--stagger-index': i } as React.CSSProperties}
  >
    {item.content}
  </div>
))}
```

```css
/* CSS */
.fade-in-up {
  animation-delay: calc(var(--stagger-index) * 0.1s);
}
```

### Anti-Patterns to Avoid

- **Animating width/height/margin:** Triggers expensive layout recalculation. Use `transform: scale()` instead.
- **Using will-change permanently:** Creates persistent GPU layers, wastes memory. Add only during animation, remove after.
- **Skipping prefers-reduced-motion:** Accessibility violation (WCAG 2.3.3). Always provide reduced-motion alternative.
- **Progress-based scroll mapping:** User chose trigger-based (element enters → animation plays at fixed duration), not continuous progress tracking.

## Don't Hand-Roll

| Problem                           | Don't Build                                       | Use Instead                                   | Why                                                                                                     |
| --------------------------------- | ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Viewport detection for animations | Custom scroll listener with getBoundingClientRect | Intersection Observer API                     | IO is optimized by browser, handles edge cases (iframes, scroll containers), avoids layout thrashing    |
| Animation frame throttling        | `setTimeout` or `setInterval`                     | `requestAnimationFrame`                       | rAF syncs with browser paint cycles, automatically pauses in background tabs, prevents screen tearing   |
| Scroll timeline polyfill          | Full polyfill replicating view() spec             | Custom IO wrapper adding CSS class            | Simple class-based approach is easier to debug, smaller bundle, sufficient for trigger-based animations |
| Cubic bezier easing               | Hand-calculated bezier curves                     | CSS named easings (`ease-out`, `ease-in-out`) | Named easings are optimized, widely understood, sufficient for 95% of use cases                         |

**Key insight:** Browser APIs for animations (CSS keyframes, Intersection Observer, rAF) are heavily optimized by browser vendors and run outside JavaScript main thread when possible. Custom JavaScript animations always run on main thread and compete with React renders, event handlers, and network requests.

## Common Pitfalls

### Pitfall 1: Animation Timeline Specificity Conflicts

**What goes wrong:** CSS animations defined globally interfere with component-specific animations when using `animation-timeline: view()`.
**Why it happens:** CSS `animation` shorthand resets all animation properties including `animation-timeline`, so order matters.
**How to avoid:** Define `animation-timeline` AFTER `animation` shorthand, or use longhand properties (`animation-name`, `animation-duration`, etc.) instead of shorthand.
**Warning signs:** Animations work in Chrome but not with IO polyfill, or animations trigger immediately instead of on scroll.

### Pitfall 2: Scroll-Driven Animations on Mobile Safari

**What goes wrong:** `position: sticky` with scroll-driven animations can cause janky behavior on iOS Safari during momentum scrolling.
**Why it happens:** iOS Safari uses different compositor behavior for momentum scrolling, sticky elements may not update transform in sync.
**How to avoid:** Test thoroughly on real iOS devices. Consider disabling parallax on mobile (`@media (hover: none)`) or using simpler fade animations instead of scale/transform.
**Warning signs:** Smooth on desktop Chrome, choppy on iPhone.

### Pitfall 3: Animation Range Units

**What goes wrong:** Confusing animation range syntax like `animation-range: cover 10vh` which starts at "cover start + 10vh", not "10vh from top".
**Why it happens:** CSS units in ranges are additive to named range positions (entry, contain, cover, exit), not absolute.
**How to avoid:** Use percentage-based ranges (`entry 0% cover 30%`) which are more intuitive than length units.
**Warning signs:** Animation triggers at unexpected scroll positions, hard to debug without reading W3C spec.

### Pitfall 4: Will-Change Memory Leaks

**What goes wrong:** Setting `will-change: transform, opacity` in CSS class causes persistent GPU layers even after animation completes.
**Why it happens:** `will-change` tells browser to keep element on GPU. If set in static CSS class, it never gets removed.
**How to avoid:** Add `will-change` dynamically via JavaScript when animation starts, remove when it ends. Or don't use at all - modern browsers auto-detect animated properties.
**Warning signs:** Increasing memory usage over time, DevTools Layers panel shows many promoted layers.

### Pitfall 5: Intersection Observer Root Margin Confusion

**What goes wrong:** Using `rootMargin: '100px'` to trigger animation "100px before element enters viewport" actually triggers 100px AFTER.
**Why it happens:** Positive rootMargin EXPANDS the root viewport bounds outward, making intersection happen later. Use negative values to trigger earlier.
**How to avoid:** Use `rootMargin: '0px 0px -100px 0px'` (negative bottom margin) to trigger when element is 100px from entering viewport.
**Warning signs:** Animations trigger too late, user sees un-animated elements appear.

### Pitfall 6: Firefox Scroll Timeline Flag

**What goes wrong:** Assuming Firefox "supports" scroll-driven animations based on feature detection, but it's behind a flag disabled by default.
**Why it happens:** Firefox shipped the feature in v114 but requires `layout.css.scroll-driven-animations.enabled` flag in about:config.
**How to avoid:** Always implement IO polyfill. Don't rely on Firefox support in production until enabled by default.
**Warning signs:** Feature detection passes, but animations don't work in Firefox stable.

## Code Examples

### Example 1: Complete Keyframe Set (fade-in-up, fade-in-down, fade-in-left, scale-in)

```css
/* Source: Current project patterns + MDN CSS animations best practices */

/* Fade in from bottom */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade in from top */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade in from left */
@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-2rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale in (grow from center) */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Utility classes with scroll-timeline */
.fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

.fade-in-down {
  animation: fade-in-down 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

.fade-in-left {
  animation: fade-in-left 0.6s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

.scale-in {
  animation: scale-in 0.5s ease-out both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

/* Reduced motion: remove transforms, keep fades */
@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .fade-in-down,
  .fade-in-left,
  .scale-in {
    animation: fade-only 0.6s ease-out both;
  }

  @keyframes fade-only {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
```

### Example 2: Intersection Observer Polyfill Hook

```typescript
// hooks/use-scroll-animation.ts
import { useEffect, RefObject } from "react";

export function useScrollAnimation(
  ref: RefObject<HTMLElement>,
  options?: {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
  },
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if browser supports native scroll-driven animations
    if (CSS.supports("animation-timeline: view()")) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add 'animate' class to trigger CSS animation
            entry.target.classList.add("animate");

            // Optionally disconnect after first trigger
            if (options?.once) {
              observer.unobserve(entry.target);
            }
          } else if (!options?.once) {
            // Remove class to allow re-triggering
            entry.target.classList.remove("animate");
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);
}
```

### Example 3: Polyfill-Compatible CSS Pattern

```css
/* CSS that works with both native and polyfill */

/* Native browsers: scroll-driven */
.fade-in-up {
  animation: fade-in-up 0.6s ease-out both paused;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

/* Polyfill browsers: class-based trigger */
.fade-in-up.animate {
  animation-play-state: running;
}

/* If browser doesn't support animation-timeline, animation stays paused
   until IO polyfill adds 'animate' class */
```

### Example 4: Hero Parallax with requestAnimationFrame

```typescript
// components/hero-parallax.tsx
'use client';

import { useEffect, useRef } from 'react';

export function HeroParallax({ children }: { children: React.ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const maxScroll = viewportHeight * 0.15; // Match current 15% threshold
      const progress = Math.min(scrolled / maxScroll, 1);

      // Apply transforms (GPU-accelerated)
      const scale = 1 - progress * 0.2; // 1.0 → 0.8
      const opacity = 1 - progress;      // 1.0 → 0.0

      hero.style.transform = `scale(${scale})`;
      hero.style.opacity = `${opacity}`;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial state
    updateParallax();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="sticky top-0 min-h-screen">
      {children}
    </section>
  );
}
```

### Example 5: Stagger Pattern with CSS Variables

```typescript
// components/sections/metrics-section.tsx (updated pattern)
export function MetricsSection() {
  return (
    <section>
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className="fade-in-up"
          style={{ '--stagger-index': index } as React.CSSProperties}
        >
          {/* content */}
        </div>
      ))}
    </section>
  );
}
```

```css
/* globals.css */
.fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
  animation-delay: calc(var(--stagger-index, 0) * 0.1s);
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

## State of the Art

| Old Approach                                               | Current Approach                                 | When Changed                                | Impact                                                                         |
| ---------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------ |
| JavaScript scroll listeners                                | CSS `animation-timeline: view()`                 | Chrome 115 (Aug 2023), Safari 26 (Sep 2025) | Animations run on compositor thread instead of main thread, better performance |
| IntersectionObserver polyfills required                    | Native IO in all modern browsers                 | Baseline since 2019                         | No polyfill package needed, can write custom wrapper                           |
| `transform: translate3d(0,0,0)` hack for GPU               | GPU acceleration automatic for transform/opacity | ~2018 (modern browsers)                     | Cleaner code, no need for translate3d hack                                     |
| Separate `animation-duration`, `animation-timing-function` | CSS `animation` shorthand                        | Always available                            | More concise, but watch out for resetting `animation-timeline`                 |
| `will-change` everywhere                                   | Browser auto-detection                           | ~2020 (Chrome 88+)                          | Less memory usage, simpler code                                                |
| framer-motion for scroll animations                        | Native CSS scroll-driven animations              | 2026 (current year)                         | Smaller bundle, better performance, progressive enhancement                    |

**Deprecated/outdated:**

- `transform: translate3d(0,0,0)` as GPU hint: Modern browsers auto-detect animated transforms
- `scroll-timeline` CSS property (old name): Replaced by `animation-timeline` in final spec
- `@scroll-timeline` at-rule: Replaced by `animation-timeline: scroll()` function
- npm `intersection-observer` polyfill: Baseline since 2019, native support sufficient

## Open Questions

1. **Polyfill Bundle Size Impact**
   - What we know: Custom IO wrapper is ~50 lines of code, flackr/scroll-timeline is ~10-15KB
   - What's unclear: Exact performance difference between custom class-based approach vs spec-compliant polyfill
   - Recommendation: Start with custom IO wrapper for Phase 9. If Phases 10-12 reveal limitations, can upgrade to flackr polyfill

2. **Mobile Parallax Behavior**
   - What we know: Current implementation uses scale + opacity parallax on hero section
   - What's unclear: Whether iOS Safari momentum scrolling causes jank with sticky + transform
   - Recommendation: Implement and test on real iOS device in Phase 9. If janky, add `@media (hover: none) { /* disable parallax */ }` in Phase 10

3. **Animation Timing Values**
   - What we know: Current framer-motion uses 0.6s-1s durations with ease-out curves
   - What's unclear: Exact stagger delays, whether CSS easing should match or refine framer-motion feel
   - Recommendation: Match current durations (0.6s for fades, 0.8s for scales) with `ease-out`. Test in browser, adjust by feel in Phase 9

4. **Reduced Motion Strategy**
   - What we know: Must respect `prefers-reduced-motion` for accessibility
   - What's unclear: Should we disable animations entirely or replace with opacity-only fades
   - Recommendation: Replace motion-based animations (transforms) with opacity-only fades. Provides feedback without triggering vestibular issues

## Sources

### Primary (HIGH confidence)

- [MDN: animation-timeline view()](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view) - Syntax, browser support, usage patterns
- [MDN: Scroll-driven animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) - Recommended patterns, performance considerations
- [Can I Use: animation-timeline view()](https://caniuse.com/mdn-css_properties_animation-timeline_view) - Exact browser support data (78% global usage)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility implementation patterns
- [MDN: easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function) - Easing curves for entrance animations
- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - Children prop pattern for RSC

### Secondary (MEDIUM confidence)

- [GitHub: flackr/scroll-timeline](https://github.com/flackr/scroll-timeline) - Official W3C polyfill for scroll-driven animations
- [Chrome for Developers: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) - Implementation guide
- [W3C WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - Accessibility requirements
- [CSS-Tricks: Staggered Animations](https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/) - CSS variable stagger pattern
- [Builder.io: Parallax scrolling 2026](https://www.builder.io/blog/parallax-scrolling-effect) - requestAnimationFrame pattern

### Tertiary (LOW confidence)

- WebSearch results on GPU acceleration best practices - multiple sources agree on transform/opacity
- WebSearch results on scroll-driven animation pitfalls - community experiences, not official docs
- WebSearch results on animation timing - general guidance, not specific to portfolio sites

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All recommendations based on MDN official docs and Can I Use data
- Architecture: HIGH - Next.js RSC pattern from official docs, IO API is Baseline, rAF is standard
- Pitfalls: MEDIUM - Combination of official docs (animation-range, rootMargin) and community experience (mobile Safari, will-change)

**Research date:** 2026-02-07
**Valid until:** 2026-04-07 (60 days - browser landscape stable, Safari 26 just shipped in Sep 2025)
