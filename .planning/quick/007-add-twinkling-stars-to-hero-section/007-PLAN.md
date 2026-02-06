---
phase: quick-007
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/twinkling-stars.tsx
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "Hero section background has sparse twinkling star dots on black"
    - "Stars twinkle with staggered, varied-duration opacity animations"
    - "Stars do not cause hydration mismatches between server and client"
    - "Stars move with the hero section during scroll-driven scale/opacity transforms"
  artifacts:
    - path: "components/twinkling-stars.tsx"
      provides: "TwinklingStars component with deterministic star positions and CSS twinkle animation"
      min_lines: 30
    - path: "app/page.tsx"
      provides: "Hero section renders TwinklingStars component"
      contains: "TwinklingStars"
  key_links:
    - from: "app/page.tsx"
      to: "components/twinkling-stars.tsx"
      via: "import and render inside hero motion.section"
      pattern: "import.*TwinklingStars"
---

<objective>
Add a classy smattering of twinkling stars to the hero section background.

Purpose: Enhance the hero's visual depth and ambiance while maintaining the brutalist aesthetic. The stars should feel like a subtle night-sky texture -- sparse, understated, not distracting from the bold typography.

Output: A `TwinklingStars` component rendered inside the hero section, with deterministic positioning and pure-CSS twinkle animations.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/page.tsx (lines 107-157: hero section)
@components/marquee-text.tsx (component conventions: "use client", named export, typed props)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create TwinklingStars component</name>
  <files>components/twinkling-stars.tsx</files>
  <action>
Create `components/twinkling-stars.tsx` with the following approach:

1. Add `"use client"` directive at top.

2. Import `useMemo` from React.

3. Create a seeded pseudo-random number generator function inside the component file. Use a simple mulberry32 or similar PRNG seeded with a fixed value (e.g., 42). This ensures identical star positions on server and client, preventing hydration mismatches. Do NOT use `Math.random()`.

4. Define a `Star` type with: `x` (percentage 0-100), `y` (percentage 0-100), `size` (1 or 2 px), `opacity` (0.1 to 0.3), `animationDelay` (string like "0s" to "5s"), `animationDuration` (string like "2s" to "5s").

5. In the component, use `useMemo` with an empty dependency array to generate an array of ~40 stars using the seeded PRNG. Distribute positions across the full 0-100% range for both x and y. Vary sizes: ~70% should be 1px, ~30% should be 2px. Vary base opacity between 0.05 and 0.25. Assign random animation delays (0-5s) and durations (2-5s).

6. Render a `div` with `className="absolute inset-0 overflow-hidden pointer-events-none"` (fills parent, does not intercept clicks).

7. Inside, render each star as a `div` with:
   - `position: absolute`
   - `left: {x}%`, `top: {y}%`
   - `width` and `height` from the star's size
   - `backgroundColor: white`
   - `borderRadius: 9999px` (circular dots -- this is an exception to the sharp-edges rule since 1-2px dots need to be round to look like stars)
   - `opacity` from the star's base opacity
   - Apply CSS class for the twinkle animation

8. Define a CSS `@keyframes twinkle` animation using a `<style>` JSX tag rendered once inside the component:

   ```
   @keyframes twinkle {
     0%, 100% { opacity: var(--star-base-opacity); }
     50% { opacity: var(--star-peak-opacity); }
   }
   ```

   Each star gets `--star-base-opacity` as its base and `--star-peak-opacity` as `base * 3` (capped at 0.6). Apply `animation: twinkle` with the star's duration and delay, `infinite`, `ease-in-out`.

9. Export as a named export: `export function TwinklingStars()`.

10. No props needed -- the component is self-contained with fixed configuration.

Why CSS animations over Framer Motion: With ~40 elements animating continuously, CSS animations are GPU-composited and far more performant than JS-driven per-element Framer Motion animations. Framer Motion would create 40 animation loops in JS.

Why seeded PRNG over Math.random: Next.js server-renders first, then hydrates on client. Math.random() produces different values on each call, causing server HTML to differ from client render, triggering React hydration warnings.
</action>
<verify> - `npx tsc --noEmit` passes (no type errors) - File exists at `components/twinkling-stars.tsx` - Grep confirms no usage of `Math.random` in the file - Grep confirms `"use client"` directive present
</verify>
<done>TwinklingStars component exists with deterministic star generation, CSS twinkle animation, and proper client directive.</done>
</task>

<task type="auto">
  <name>Task 2: Integrate TwinklingStars into hero section</name>
  <files>app/page.tsx</files>
  <action>
1. Add import at the top of `app/page.tsx` with the other component imports:
   ```tsx
   import { TwinklingStars } from "@/components/twinkling-stars";
   ```

2. Inside the hero `motion.section` (line ~108-157), add `<TwinklingStars />` as the FIRST child element, immediately after the opening tag and before the `{/* Giant name */}` comment. This ensures stars render behind all hero content (the text and scroll indicator already have their own positioning contexts).

3. The hero section already has no `relative` class but uses `sticky` positioning. The TwinklingStars component uses `absolute inset-0`, which will position relative to the nearest positioned ancestor. Since `sticky` creates a positioning context, the stars will correctly fill the hero section. No additional classes needed on the section.

4. Do NOT modify any other part of the hero section or any other section.
   </action>
   <verify> - `npx tsc --noEmit` passes - `npm run build` completes without errors - Grep `app/page.tsx` for "TwinklingStars" confirms import and usage - Dev server shows twinkling stars behind hero text (visual confirmation)
   </verify>
   <done>Hero section renders twinkling stars behind the MANNAN text. Stars are visible as subtle white dots on the black background, twinkling at varied rates. Stars scale and fade with the hero section on scroll. No hydration warnings in console.</done>
   </task>

</tasks>

<verification>
1. `npx tsc --noEmit` -- no type errors across the project
2. `npm run build` -- production build succeeds without warnings
3. Dev server (`npm run dev`) -- hero section shows ~40 small twinkling white dots
4. Stars are subtle (low opacity), not distracting from "MANNAN" text or orange subtitle
5. No React hydration mismatch warnings in browser console
6. Scrolling past hero section: stars move with section (scale + fade via heroScale/heroOpacity)
7. Stars do not intercept mouse events (pointer-events-none)
</verification>

<success_criteria>

- TwinklingStars component created at components/twinkling-stars.tsx
- Component uses deterministic PRNG (no Math.random)
- CSS @keyframes animation for performance (not Framer Motion per-star)
- ~40 stars with varied sizes (1-2px), opacities (0.05-0.25), and animation timings
- Integrated into hero section of app/page.tsx
- Build passes, no hydration mismatches
- Visual result: classy, sparse star field -- ambient, not busy
  </success_criteria>

<output>
After completion, create `.planning/quick/007-add-twinkling-stars-to-hero-section/007-SUMMARY.md`
</output>
