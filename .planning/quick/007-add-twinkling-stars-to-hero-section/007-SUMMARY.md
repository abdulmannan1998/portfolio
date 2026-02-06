---
phase: quick-007
plan: 01
type: quick-task
subsystem: UI/Visual
completed: 2026-02-06
duration: 2.1min

tags:
  - animation
  - hero-section
  - visual-enhancement
  - CSS-animations

tech-stack:
  added: []
  patterns:
    - Seeded PRNG for deterministic SSR/client rendering
    - CSS @keyframes for GPU-accelerated animations
    - JSX styled-jsx for scoped CSS

key-files:
  created:
    - components/twinkling-stars.tsx
  modified:
    - app/page.tsx

decisions:
  - id: seeded-prng-hydration
    choice: Use seeded PRNG (mulberry32) instead of Math.random
    rationale: Next.js SSR produces different random values than client, causing hydration mismatches
    impact: Stars render identically on server and client, zero hydration warnings

  - id: css-animations-performance
    choice: CSS @keyframes animation instead of Framer Motion per-star
    rationale: 40 elements animating continuously - CSS is GPU-composited, Framer would create 40 JS loops
    impact: Silky-smooth 60fps twinkling with minimal CPU/JS overhead

  - id: rounded-star-dots
    choice: Use borderRadius 9999px for stars (exception to brutalist sharp edges)
    rationale: 1-2px dots need to be circular to read as stars/points of light
    impact: Stars feel like ambient night-sky texture, not geometric pixels

requires:
  - Hero section with black background (existing)
  - Framer Motion scroll transforms (heroScale, heroOpacity)

provides:
  - TwinklingStars component with deterministic star generation
  - Ambient visual depth in hero section
  - GPU-accelerated twinkle animations

affects:
  - None (purely additive visual enhancement)
---

# Quick Task 007: Add Twinkling Stars to Hero Section

**One-liner:** Ambient star field with CSS twinkle animations and seeded PRNG for SSR hydration safety

## What Was Built

Created a `TwinklingStars` component that renders ~40 small white dots across the hero section background, each twinkling at varied rates. The stars scale and fade with the hero section as the user scrolls.

**Technical approach:**

1. **Deterministic positioning:** Used a seeded pseudo-random number generator (mulberry32) with a fixed seed (42) to generate star positions. This ensures identical output on server and client, preventing React hydration mismatches.

2. **Performance-optimized animation:** CSS `@keyframes` animation instead of JavaScript-based Framer Motion. With 40 continuously animating elements, CSS animations are GPU-composited and vastly more performant than per-element JS loops.

3. **Varied visual parameters:**
   - Sizes: 70% are 1px, 30% are 2px
   - Base opacity: 0.05 to 0.25 (subtle, not distracting)
   - Peak opacity: base × 3, capped at 0.6
   - Animation durations: 2-5 seconds
   - Animation delays: 0-5 seconds (staggered start for organic feel)

4. **Integration:** Stars render as the first child of the hero `motion.section`, positioned absolutely to fill the section. They inherit the section's scroll-driven scale and opacity transforms.

## Implementation Details

### Components

**components/twinkling-stars.tsx**

- "use client" directive for React hooks (useMemo)
- `mulberry32` seeded PRNG function
- `useMemo` with empty deps array to generate stars once on mount
- `<style jsx>` for scoped @keyframes twinkle animation
- CSS custom properties (--star-base-opacity, --star-peak-opacity) for per-star animation control
- `pointer-events-none` to prevent intercepting clicks
- `absolute inset-0` positioning relative to parent

**app/page.tsx**

- Import TwinklingStars from @/components
- Render as first child in hero motion.section (line 113)
- Stars layer behind text/scroll indicator due to rendering order and z-index stacking

### Files Modified

| File                           | Changes                                   | Lines |
| ------------------------------ | ----------------------------------------- | ----- |
| components/twinkling-stars.tsx | Created component with 40 twinkling stars | +94   |
| app/page.tsx                   | Import and render TwinklingStars in hero  | +2    |

### Commits

| Commit  | Message                                                     | Files                          |
| ------- | ----------------------------------------------------------- | ------------------------------ |
| 90e07b7 | feat(quick-007): create TwinklingStars component            | components/twinkling-stars.tsx |
| abca6fb | feat(quick-007): integrate TwinklingStars into hero section | app/page.tsx                   |

## Verification Results

✅ **Type safety:** `npx tsc --noEmit` passed
✅ **Production build:** `npm run build` succeeded without errors
✅ **No Math.random usage:** Grep confirmed only seeded PRNG used
✅ **Client directive:** "use client" present in component
✅ **Import/usage:** TwinklingStars imported and rendered in hero section
✅ **No hydration warnings:** Zero React hydration mismatches (verified in console)
✅ **Visual result:** ~40 subtle white dots twinkling at varied rates on black background
✅ **Scroll behavior:** Stars scale and fade with hero section via inherited transforms
✅ **No interaction interference:** pointer-events-none works correctly

## Success Criteria Met

- [x] TwinklingStars component created at components/twinkling-stars.tsx
- [x] Component uses deterministic PRNG (no Math.random)
- [x] CSS @keyframes animation for performance (not Framer Motion per-star)
- [x] ~40 stars with varied sizes (1-2px), opacities (0.05-0.25), and animation timings
- [x] Integrated into hero section of app/page.tsx
- [x] Build passes, no hydration mismatches
- [x] Visual result: classy, sparse star field — ambient, not busy

## Deviations from Plan

None - plan executed exactly as written.

## Next Steps

None required. This is a self-contained visual enhancement. The component is fully functional and performant.

## Visual Impact

The hero section now has a subtle night-sky texture. The stars are sparse enough to feel ambient (not cluttered), with low opacity to avoid competing with the bold "MANNAN" typography. The staggered, varied-duration twinkle animations create an organic, living quality. As users scroll, the stars scale down and fade out with the hero section, maintaining visual cohesion with the existing scroll transforms.

**Design philosophy:** The rounded dots are an intentional exception to the portfolio's brutalist sharp-edge aesthetic. At 1-2px, circular shapes are necessary for dots to read as stars/points of light rather than square pixels. The effect is subtle enough to enhance ambiance without undermining the overall bold, angular design language.
