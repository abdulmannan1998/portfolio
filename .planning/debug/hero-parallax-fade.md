---
status: diagnosed
trigger: "Hero parallax scroll effect fades out too aggressively"
created: 2026-02-07T00:00:00Z
updated: 2026-02-07T00:00:00Z
---

## ROOT CAUSE FOUND

### Summary

The hero fades out too quickly because the new implementation uses **viewport height** (`window.innerHeight * 0.15`) as the scroll threshold, while the original framer-motion implementation used **scroll progress relative to the container element**.

### Evidence

**Original framer-motion implementation (commit 62ceaee^):**

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: containerRef });

const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
```

- `containerRef` was attached to the `<main>` element (entire page container)
- `useScroll({ target: containerRef })` returns `scrollYProgress` which is a value from 0 to 1
- This represents: **how far the containerRef has scrolled through the viewport**
- The `[0, 0.15]` range means: "apply the transform from 0% to 15% of the container's scroll progress"

**Current requestAnimationFrame implementation:**

```typescript
const updateParallax = () => {
  const scrolled = window.scrollY;
  const maxScroll = window.innerHeight * 0.15; // ❌ Wrong calculation
  const progress = Math.min(scrolled / maxScroll, 1);

  const scale = 1 - progress * 0.2;
  const opacity = 1 - progress;
  // ...
};
```

- Uses `window.scrollY` (absolute scroll position in pixels)
- Uses `window.innerHeight * 0.15` as threshold
- On a typical 900px viewport, this is only **135px of scroll** before hero is completely faded
- Original implementation would fade over a much longer distance

### The Critical Difference

**Framer-motion's `scrollYProgress` with `target: containerRef`:**

- Tracks how far the `<main>` container has scrolled through the viewport
- For a long page (e.g., 5000px tall), 15% of scroll progress = **~750px** of scrolling
- The fade happens gradually as you scroll through the first ~15% of the page content

**Current implementation:**

- Uses `window.innerHeight * 0.15` = **~135px** on a 900px viewport
- Fades out in just 135 pixels of scroll, which is **way too aggressive**
- User barely starts scrolling before hero is gone

### What Needs to Change

The `maxScroll` calculation needs to represent **15% of the document's scrollable height**, not 15% of the viewport height.

**Correct calculation:**

```typescript
const maxScroll = document.documentElement.scrollHeight * 0.15;
```

Or to more closely match framer-motion's behavior (scroll progress relative to container):

```typescript
const scrollHeight = document.documentElement.scrollHeight;
const viewportHeight = window.innerHeight;
const scrollableHeight = scrollHeight - viewportHeight;
const maxScroll = scrollableHeight * 0.15;
```

### Files Involved

- `/Users/sunny/Desktop/Sunny/portfolio/components/hero-parallax.tsx` (line 20)
  - Current: `const maxScroll = window.innerHeight * 0.15;`
  - Should use: Document scroll height, not viewport height

### Verification Steps

1. Change `maxScroll` calculation to use `document.documentElement.scrollHeight * 0.15`
2. Test scroll behavior - hero should fade gradually over ~15% of page scroll
3. Compare fade timing to original framer-motion behavior (if possible, temporarily revert to test)
4. Ensure fade completes before marquee section is fully visible

### Additional Context

**Why viewport height seemed logical but was wrong:**

- The key insight is that framer-motion's `scrollYProgress` is **not** based on viewport height
- It's based on how far the target element has scrolled through the viewport
- For a container that's much taller than the viewport, this creates a much longer fade distance
- The `[0, 0.15]` range refers to **15% of scroll progress**, which is distance-based, not viewport-based

**Math comparison (example page):**

- Page height: 5000px
- Viewport height: 900px
- Scrollable distance: 4100px

Original behavior (15% of scroll progress):

- Fade distance: 4100px x 0.15 = **615px**

Current broken behavior (15% of viewport):

- Fade distance: 900px x 0.15 = **135px**

**Result:** Hero fades 4.5x faster than intended.
