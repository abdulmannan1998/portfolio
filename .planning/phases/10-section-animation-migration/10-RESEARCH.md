# Phase 10: Section Animation Migration - Research

**Researched:** 2026-02-07
**Domain:** Framer-motion to CSS animation migration, scroll-driven entrance animations
**Confidence:** HIGH

## Summary

Phase 10 migrates four static content sections (about, metrics, timeline, tech stack) from framer-motion's `whileInView` animations to CSS scroll-driven animations. The infrastructure from Phase 9 (CSS keyframes, `animation-timeline: view()`, Intersection Observer polyfill) provides the foundation for this migration.

Current framer-motion patterns in these sections are simple entrance animations: fade-in-up with stagger (metrics), fade-in-left (timeline), fade-in combinations (about). These map directly to existing CSS keyframes defined in Phase 9. The migration primarily involves removing motion components, applying CSS classes, and configuring stagger delays via CSS custom properties.

The standard approach uses inline `style={{ '--stagger-index': i }}` for per-item delays combined with `animation-delay: calc(var(--stagger-index) * 0.1s)` in CSS. This pattern is production-ready and widely used. The newer `sibling-index()` CSS function (70% browser support, no Firefox) offers a pure-CSS alternative but should not be used due to Firefox's lack of support and the project's constraint to avoid breaking Firefox compatibility.

**Primary recommendation:** Replace framer-motion components with semantic HTML + CSS animation classes from Phase 9. Use CSS custom properties (`--stagger-index`) for stagger delays. Apply `useScrollAnimation` hook only where needed for complex scroll detection, otherwise rely on native `animation-timeline: view()` with Intersection Observer polyfill fallback.

## Standard Stack

### Core

| Library                          | Version                 | Purpose                                  | Why Standard                                                               |
| -------------------------------- | ----------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| CSS `animation-timeline: view()` | Chrome 115+, Safari 26+ | Native scroll-driven entrance animations | Already implemented in Phase 9, runs on compositor thread                  |
| Intersection Observer polyfill   | Custom (Phase 9)        | Firefox fallback for view()              | Custom implementation in `hooks/use-scroll-animation.ts`                   |
| CSS keyframes (Phase 9)          | All browsers            | Pre-defined entrance animations          | `fade-in-up`, `fade-in-down`, `fade-in-left`, `scale-in` already available |
| CSS custom properties            | All modern browsers     | Stagger delay calculation                | Standard pattern: `--stagger-index` + `calc()`                             |

### Supporting

| Library                           | Version          | Purpose                               | When to Use                                                                   |
| --------------------------------- | ---------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| `useScrollAnimation` hook         | Custom (Phase 9) | React hook for IO polyfill            | Only needed for sections requiring per-element ref-based animation control    |
| `initScrollAnimations` function   | Custom (Phase 9) | Layout-level animation initialization | Alternative to per-component hooks, initializes all animation classes at once |
| `@media (prefers-reduced-motion)` | Baseline 2019    | Accessibility - opacity-only fades    | Already configured in Phase 9 for all animation classes                       |

### Alternatives Considered

| Instead of                        | Could Use                      | Tradeoff                                                                                                                                     |
| --------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS custom properties for stagger | `sibling-index()` CSS function | sibling-index() is pure CSS (no inline styles) but only 70% browser support, no Firefox support - not suitable                               |
| Individual stagger classes        | `:nth-child()` selectors       | nth-child works but requires knowing exact item count upfront, breaks with dynamic content                                                   |
| CSS animations                    | Keep framer-motion             | Framer-motion provides spring physics and complex orchestration, but Phase 10 animations are simple entrance effects that don't need springs |

**Installation:**

```bash
# No new dependencies - all infrastructure from Phase 9
# Migration only requires removing framer-motion usage from four sections
```

## Architecture Patterns

### Recommended Migration Structure

```
components/sections/
├── experience-timeline.tsx       # Remove motion, add CSS classes
├── metrics-section.tsx           # Remove motion, add stagger-index
├── tech-and-code-section.tsx     # Remove motion, add CSS classes
└── (about section in app/page.tsx) # Remove motion, add CSS classes
```

### Pattern 1: Simple whileInView to CSS Class Migration

**What:** Replace `motion.div` with regular HTML element + CSS animation class
**When to use:** Section uses simple entrance animation without complex timing
**Example:**

```tsx
// BEFORE (framer-motion)
<motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  className="relative pl-12"
>
  {content}
</motion.div>

// AFTER (CSS animation)
<div className="relative pl-12 fade-in-left">
  {content}
</div>
```

**Why it works:** `fade-in-left` keyframe matches the motion props (opacity 0→1, translateX -2rem→0)

### Pattern 2: Staggered List Animation Migration

**What:** Convert framer-motion stagger to CSS custom property + calc()
**When to use:** Multiple items animating with delays (metrics cards, timeline entries, tech icons)
**Example:**

```tsx
// BEFORE (framer-motion)
{
  items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {item.content}
    </motion.div>
  ));
}

// AFTER (CSS animation)
{
  items.map((item, index) => (
    <div
      key={item.id}
      className="fade-in-up"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      {item.content}
    </div>
  ));
}
```

**CSS already configured in Phase 9:**

```css
.fade-in-up {
  animation-delay: calc(var(--stagger-index, 0) * 0.1s);
}
```

### Pattern 3: Split-Screen Section Animation (About Section)

**What:** Coordinate left/right column entrance animations
**When to use:** Two-column layout where columns should animate independently
**Example:**

```tsx
// BEFORE (framer-motion)
<section className="grid md:grid-cols-2">
  {/* Left column */}
  <div>
    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
      About
    </motion.span>
    <motion.h2 initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
      BUILDING INTERFACES
    </motion.h2>
    <motion.p
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      First paragraph
    </motion.p>
  </div>

  {/* Right column pattern */}
  <div className="bg-stone-900">
    {/* Background pattern elements */}
  </div>
</section>

// AFTER (CSS animation)
<section className="grid md:grid-cols-2">
  {/* Left column */}
  <div>
    <span className="fade-in-up" style={{ '--stagger-index': 0 } as React.CSSProperties}>
      About
    </span>
    <h2 className="fade-in-up" style={{ '--stagger-index': 1 } as React.CSSProperties}>
      BUILDING INTERFACES
    </h2>
    <p className="fade-in-up" style={{ '--stagger-index': 2 } as React.CSSProperties}>
      First paragraph
    </p>
  </div>

  {/* Right column - could animate or stay static */}
  <div className="bg-stone-900">
    {/* Background pattern elements */}
  </div>
</section>
```

### Pattern 4: Optional Per-Component IO Hook (Complex Cases Only)

**What:** Use `useScrollAnimation` hook when component needs custom scroll detection logic
**When to use:** Section requires different threshold, rootMargin, or once behavior than global defaults
**Example:**

```tsx
"use client";
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function ComplexSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Custom scroll detection - only if needed
  useScrollAnimation(sectionRef, {
    threshold: 0.3, // Different from default 0.1
    rootMargin: "0px 0px -20% 0px", // Different from default -10%
    once: true,
  });

  return (
    <section ref={sectionRef} className="fade-in-up">
      {/* Content */}
    </section>
  );
}
```

**Note:** For Phase 10, most sections can use default thresholds from Phase 9. Only use hook if custom behavior needed.

### Anti-Patterns to Avoid

- **Mixing motion and CSS animations:** Don't use both `<motion.div>` and CSS animation classes on same element. Choose one approach per component.
- **Over-using useScrollAnimation hook:** If element only needs default animation behavior, just apply CSS class. Hook adds unnecessary React overhead.
- **Animating non-GPU properties:** Stick to existing keyframes that use `transform` and `opacity`. Don't introduce new animations that use `width`, `height`, `margin`.
- **sibling-index() for stagger:** Don't use `sibling-index()` CSS function (70% support, no Firefox). Use CSS custom properties pattern instead.
- **Changing animation timings arbitrarily:** User confirmed current animations "feel good" - preserve existing timing (0.6s duration, ease-out, 0.1s stagger).

## Don't Hand-Roll

| Problem                            | Don't Build                                                       | Use Instead                                               | Why                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Stagger delay calculation          | Individual classes for each position (`.delay-100`, `.delay-200`) | CSS custom properties + `calc()`                          | Scales to any list length, no class bloat, established pattern from Phase 9               |
| Scroll-driven animation polyfill   | Custom scroll listener + position calculation                     | Existing `useScrollAnimation` hook from Phase 9           | Already implements IO + feature detection + Firefox fallback                              |
| Easing curves for entrance effects | Custom cubic-bezier values                                        | `ease-out` timing function                                | User confirmed current animations feel good, ease-out is standard for entrance animations |
| Reduced-motion alternative         | Custom media query handling per section                           | Existing `@media (prefers-reduced-motion)` in globals.css | Already configured in Phase 9 to disable transforms, keep opacity fades                   |

**Key insight:** Phase 9 established all the primitives needed (keyframes, polyfill, reduced-motion). Phase 10 is purely refactoring existing components to use those primitives. Don't re-invent patterns - just apply the existing classes.

## Common Pitfalls

### Pitfall 1: Motion Import Removal Breaking "use client"

**What goes wrong:** Removing framer-motion import might leave component as server component when it needs client hooks
**Why it happens:** `motion` components force "use client" directive. After removing motion, TypeScript won't error if you accidentally use client hooks in server component
**How to avoid:** Check each migrated component - does it use hooks (useRef, useEffect, useState)? If yes, keep "use client" directive. If no hooks remain, can remove directive and make it server component
**Warning signs:** Build error "You're importing a component that needs X. It only works in a Client Component but none of its parents are marked with 'use client'"

### Pitfall 2: Stagger Index Off-By-One Errors

**What goes wrong:** First item doesn't animate, or last item has wrong delay
**Why it happens:** Map index starts at 0, but stagger calculation needs correct starting index
**How to avoid:** Always pass raw index from `.map((item, index) => ...)` to `--stagger-index`. CSS calc handles multiplication, don't manipulate index in JSX
**Warning signs:** First element appears instantly, animation sequence looks wrong

### Pitfall 3: TypeScript Error on CSS Custom Property

**What goes wrong:** `style={{ '--stagger-index': 0 }}` causes TypeScript error: "Type 'number' is not assignable to type 'string'"
**Why it happens:** React's CSSProperties type expects string values for CSS variables
**How to avoid:** Use type assertion: `style={{ '--stagger-index': index } as React.CSSProperties}` or convert to string: `'--stagger-index': String(index)`
**Warning signs:** TypeScript build error on CSS custom property assignment

### Pitfall 4: Forgetting animation-play-state: paused

**What goes wrong:** CSS animations start immediately instead of waiting for scroll trigger
**Why it happens:** Phase 9 CSS sets `animation-play-state: paused` initially, polyfill adds `.animate` class to trigger. If you modify CSS, might accidentally remove paused state
**How to avoid:** Don't modify the utility classes from Phase 9 globals.css. They already have correct play-state configuration
**Warning signs:** All animations trigger on page load instead of on scroll

### Pitfall 5: viewport once vs Animation Replay

**What goes wrong:** Animation behaves differently than current framer-motion when scrolling back up
**Why it happens:** Framer-motion `viewport={{ once: true }}` is default. Phase 9 polyfill also defaults to `once: true`, but native CSS animation-timeline doesn't have "once" concept - it replays
**How to avoid:** Phase 9 Intersection Observer polyfill uses `once: true` by default, matching framer-motion behavior. For consistency, ensure polyfill is applied (it already is via `initScrollAnimations`)
**Warning signs:** Animation replays when scrolling back up in Chrome/Safari but not in Firefox

### Pitfall 6: Nested motion Components

**What goes wrong:** Forgetting to migrate nested motion elements inside a parent motion element
**Why it happens:** Component has motion.div containing motion.span, motion.h2, motion.p - easy to miss nested elements
**How to avoid:** Search each file for ALL instances of `motion.` before considering migration complete. Use regex search: `<motion\.\w+`
**Warning signs:** Some elements still animate with framer-motion while others use CSS

### Pitfall 7: Animation Timing Mismatch with Current Feel

**What goes wrong:** CSS animations feel different from current framer-motion animations, even with matching duration/easing
**Why it happens:** Framer-motion uses spring physics by default (unless duration specified). Phase 10 sections already specify durations in framer-motion, so CSS timing should match
**How to avoid:** Current implementation uses explicit transition durations (e.g., `transition={{ delay: index * 0.1 }}`), which means they're NOT using spring physics. Direct CSS conversion preserves timing
**Warning signs:** User reports animations feel different after migration

## Code Examples

### Example 1: About Section Migration (Split-Screen Layout)

```tsx
// BEFORE: app/page.tsx about section with framer-motion
<section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
  {/* Left - Image/Pattern */}
  <div className="relative bg-stone-900 flex items-center justify-center p-12">
    {/* Static pattern - no animation */}
  </div>

  {/* Right - Text */}
  <div className="relative bg-black flex items-center p-12 md:p-16">
    <div>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-orange-500 font-mono text-sm uppercase tracking-widest"
      >
        About
      </motion.span>
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-black mt-4 mb-8 leading-tight"
      >
        BUILDING
        <br />
        <span className="text-orange-500">INTERFACES</span>
        <br />
        THAT FEEL ALIVE
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-white/60 text-lg leading-relaxed max-w-md mb-4"
      >
        First paragraph text
      </motion.p>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-white/60 text-lg leading-relaxed max-w-md"
      >
        Second paragraph text
      </motion.p>
    </div>
  </div>
</section>

// AFTER: Pure CSS animations with stagger
<section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
  {/* Left - Image/Pattern */}
  <div className="relative bg-stone-900 flex items-center justify-center p-12">
    {/* Static pattern - no animation */}
  </div>

  {/* Right - Text */}
  <div className="relative bg-black flex items-center p-12 md:p-16">
    <div>
      <span
        className="text-orange-500 font-mono text-sm uppercase tracking-widest fade-in-up"
        style={{ '--stagger-index': 0 } as React.CSSProperties}
      >
        About
      </span>
      <h2
        className="text-4xl md:text-5xl font-black mt-4 mb-8 leading-tight fade-in-up"
        style={{ '--stagger-index': 1 } as React.CSSProperties}
      >
        BUILDING
        <br />
        <span className="text-orange-500">INTERFACES</span>
        <br />
        THAT FEEL ALIVE
      </h2>
      <p
        className="text-white/60 text-lg leading-relaxed max-w-md mb-4 fade-in-up"
        style={{ '--stagger-index': 2 } as React.CSSProperties}
      >
        First paragraph text
      </p>
      <p
        className="text-white/60 text-lg leading-relaxed max-w-md fade-in-up"
        style={{ '--stagger-index': 3 } as React.CSSProperties}
      >
        Second paragraph text
      </p>
    </div>
  </div>
</section>
```

**Changes:**

- Removed all `motion.` components
- Applied `fade-in-up` class (matches y-axis translation)
- Used `--stagger-index` to preserve 0.1s incremental delays
- Can remove "use client" from page.tsx if no other client hooks remain

### Example 2: Metrics Section Migration (Horizontal Scroll with Stagger)

```tsx
// BEFORE: components/sections/metrics-section.tsx
"use client";
import { motion } from "framer-motion";

export function MetricsSection() {
  return (
    <section className="relative py-24 bg-black">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-6 md:px-12 pb-6">
          {RESUME_DATA.metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-80 h-96 bg-stone-900"
            >
              {/* Card content */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AFTER: Pure CSS animations
export function MetricsSection() {
  return (
    <section className="relative py-24 bg-black">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-6 md:px-12 pb-6">
          {RESUME_DATA.metrics.map((metric, index) => (
            <div
              key={metric.id}
              className="relative w-80 h-96 bg-stone-900 fade-in-up"
              style={{ "--stagger-index": index } as React.CSSProperties}
            >
              {/* Card content */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Changes:**

- Removed framer-motion import
- Can remove "use client" directive (no hooks remain)
- Applied `fade-in-up` class (matches initial y: 50 → y: 0)
- Preserved stagger pattern with CSS custom property

### Example 3: Timeline Migration (Sequential Left Entrance)

```tsx
// BEFORE: components/sections/experience-timeline.tsx
"use client";
import { motion } from "framer-motion";

export function ExperienceTimeline() {
  return (
    <div>
      {experienceData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative pl-12 pb-16"
        >
          {/* Timeline entry content */}
        </motion.div>
      ))}
    </div>
  );
}

// AFTER: Pure CSS animations
export function ExperienceTimeline() {
  return (
    <div>
      {experienceData.map((item, index) => (
        <div
          key={item.id}
          className="relative pl-12 pb-16 fade-in-left"
          style={{ "--stagger-index": index } as React.CSSProperties}
        >
          {/* Timeline entry content */}
        </div>
      ))}
    </div>
  );
}
```

**Changes:**

- Removed framer-motion import
- Can remove "use client" directive
- Applied `fade-in-left` class (matches x: -30 → x: 0)
- Added stagger-index for sequential entrance

**Note:** Current framer-motion code doesn't use stagger delays, but adding stagger may improve visual flow. User decision per CONTEXT.md.

### Example 4: Tech Stack Grid Migration (Nested Animations)

```tsx
// BEFORE: components/sections/tech-and-code-section.tsx
"use client";
import { motion } from "framer-motion";

export function TechAndCodeSection() {
  const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
    return acc;
  }, []);

  return (
    <section>
      {techCategories.map((category, catIndex) => {
        const categoryStartIndex = categoryOffsets[catIndex];
        return (
          <div key={category.name}>
            {/* Category header */}
            <motion.h3
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              className="text-2xl"
            >
              {category.name}
            </motion.h3>

            {/* Tech items */}
            <div className="flex flex-wrap gap-3">
              {category.items.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: (categoryStartIndex + index) * 0.03,
                    duration: 0.3,
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Tech icon and name */}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// AFTER: Pure CSS animations
export function TechAndCodeSection() {
  const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
    return acc;
  }, []);

  return (
    <section>
      {techCategories.map((category, catIndex) => {
        const categoryStartIndex = categoryOffsets[catIndex];
        return (
          <div key={category.name}>
            {/* Category header */}
            <h3
              className="text-2xl fade-in-left"
              style={{ "--stagger-index": catIndex } as React.CSSProperties}
            >
              {category.name}
            </h3>

            {/* Tech items */}
            <div className="flex flex-wrap gap-3">
              {category.items.map((tech, index) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 fade-in-up"
                  style={
                    {
                      "--stagger-index": (categoryStartIndex + index) * 0.3,
                    } as React.CSSProperties
                  }
                >
                  {/* Tech icon and name */}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
```

**Changes:**

- Removed framer-motion import
- Can remove "use client" directive
- Category headers: `fade-in-left` with category-level stagger
- Tech items: `fade-in-up` with global stagger index across categories
- Scaled stagger multiplier (0.03s → 0.3 for `--stagger-index` since CSS calc multiplies by 0.1s base)

**Note:** Current framer-motion uses 0.03s delays - very fast stagger. Consider user discretion: keep fast stagger (multiply index by 0.3) or slow down (multiply by 1.0 for 0.1s delays).

## State of the Art

| Old Approach                                 | Current Approach                  | When Changed    | Impact                                                                                  |
| -------------------------------------------- | --------------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| framer-motion for simple entrance animations | CSS scroll-driven animations      | 2026 (Phase 10) | Smaller bundle, better performance, animations run on compositor thread                 |
| JavaScript stagger with map index delays     | CSS custom properties + calc()    | 2025-2026       | Declarative, no JavaScript execution per item, standard pattern                         |
| sibling-index() for pure CSS stagger         | CSS custom properties for stagger | 2026            | sibling-index() only 70% support (no Firefox), custom properties have universal support |
| Individual nth-child stagger classes         | CSS custom properties             | 2020-2026       | Scales to any list length, no class bloat                                               |
| motion.div wrapping everything               | Semantic HTML + animation classes | 2026 (Phase 10) | Better SEO, faster hydration, cleaner markup                                            |

**Deprecated/outdated:**

- **framer-motion for static entrance animations:** Still valid for complex animations (springs, gestures, layout animations), but simple scroll-triggered fades/slides are better served by CSS
- **viewport={{ amount: 'some' }}:** CSS animation-timeline doesn't have equivalent to amount threshold, use Intersection Observer threshold instead if custom behavior needed
- **staggerChildren in motion parent:** CSS doesn't have parent-driven stagger, use per-child stagger-index instead

## Open Questions

1. **Timeline Animation Strategy: Per-Entry vs Section-Level**
   - What we know: Current implementation animates each timeline entry when it enters viewport (no stagger delays)
   - What's unclear: Should migration keep per-entry triggering or add section-level stagger for sequential flow
   - Recommendation: Add stagger-index for visual consistency with other sections. User discretion per CONTEXT.md.

2. **About Section Column Coordination**
   - What we know: Right column has text elements animating in sequence
   - What's unclear: Should left column (giant "4+") also animate, or stay static as visual anchor
   - Recommendation: Keep left column static, right column staggered. User decision per CONTEXT.md.

3. **Tech Stack Stagger Speed**
   - What we know: Current framer-motion uses 0.03s delays between items (very fast)
   - What's unclear: Should CSS version match 0.03s timing or slow down to standard 0.1s
   - Recommendation: Test both. 0.03s = multiply stagger-index by 0.3, 0.1s = multiply by 1.0. User discretion.

4. **Metrics Cards Already-In-View Behavior**
   - What we know: Metrics section uses horizontal scroll, first 1-2 cards visible on page load
   - What's unclear: Should already-visible cards animate on load or skip animation
   - Recommendation: Phase 9 polyfill handles this automatically (animation triggers when card in viewport). Test and verify feel is good.

5. **Client Directive Removal Scope**
   - What we know: Removing framer-motion imports might allow removing "use client" from some components
   - What's unclear: Which components can safely become server components (check for hooks, event handlers)
   - Recommendation: Audit each file - metrics/timeline/tech can likely remove "use client" if no other hooks remain. Page.tsx needs to stay client for hero animations.

## Sources

### Primary (HIGH confidence)

- Phase 9 Research (.planning/phases/09-animation-foundation/09-RESEARCH.md) - CSS keyframe infrastructure, polyfill patterns
- Current codebase implementation (app/page.tsx, components/sections/\*.tsx) - Existing framer-motion patterns
- Phase 9 globals.css - Animation class definitions and configuration
- Phase 9 hooks/use-scroll-animation.ts - Polyfill implementation

### Secondary (MEDIUM confidence)

- [MDN: animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay) - CSS custom properties in calc() supported
- [CSS-Tricks: Different Approaches for Creating a Staggered Animation](https://css-tricks.com/different-approaches-for-creating-a-staggered-animation/) - CSS variable stagger pattern verification
- [Can I Use: sibling-count()](https://caniuse.com/wf-sibling-count) - 70% support, no Firefox - not suitable for production
- [Smashing Magazine: CSS GPU Animation](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/) - Transform/opacity GPU acceleration best practices

### Tertiary (LOW confidence)

- [Motion.dev: Do You Still Need Framer Motion?](https://motion.dev/blog/do-you-still-need-framer-motion) - When to use CSS vs framer-motion
- [CSS-Tricks: sibling-index()](https://css-tricks.com/almanac/functions/s/sibling-index/) - New CSS feature not yet production-ready
- WebSearch results on framer-motion migration patterns - General community guidance, not specific to this project

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All infrastructure from Phase 9, CSS custom property pattern well-established
- Architecture: HIGH - Direct mapping from framer-motion props to CSS classes, verified in codebase
- Pitfalls: HIGH - TypeScript errors, stagger index issues, client directive removal all verifiable in code

**Research date:** 2026-02-07
**Valid until:** 2026-04-07 (60 days - CSS animation patterns stable, Phase 9 infrastructure in place)
