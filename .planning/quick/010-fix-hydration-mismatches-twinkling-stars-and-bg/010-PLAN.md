---
phase: quick-010
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/seeded-random.ts
  - components/twinkling-stars.tsx
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "No hydration mismatch warnings in browser console on page load"
    - "Background pattern 'M' letters render identically on server and client"
    - "Twinkling stars animate correctly with no styled-jsx scoped class mismatch"
  artifacts:
    - path: "lib/seeded-random.ts"
      provides: "Shared seeded PRNG utility"
      exports: ["mulberry32"]
    - path: "components/twinkling-stars.tsx"
      provides: "Twinkling stars with no styled-jsx"
      contains: "<style>"
    - path: "app/page.tsx"
      provides: "Deterministic background pattern"
      contains: "mulberry32"
  key_links:
    - from: "components/twinkling-stars.tsx"
      to: "lib/seeded-random.ts"
      via: "import mulberry32"
      pattern: "import.*mulberry32.*from.*seeded-random"
    - from: "app/page.tsx"
      to: "lib/seeded-random.ts"
      via: "import mulberry32"
      pattern: "import.*mulberry32.*from.*seeded-random"
---

<objective>
Fix two hydration mismatch sources in the portfolio: (1) `Math.random()` at module scope in `app/page.tsx` producing different values server vs client, and (2) styled-jsx in `components/twinkling-stars.tsx` injecting scoped classNames that differ between server and client in Next.js App Router.

Purpose: Eliminate React hydration warnings that cause visual flicker and console noise.
Output: Three files modified — shared PRNG utility, deterministic background pattern, styled-jsx removal.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@components/twinkling-stars.tsx
@app/page.tsx
@lib/social-links.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extract mulberry32 to shared utility</name>
  <files>lib/seeded-random.ts, components/twinkling-stars.tsx</files>
  <action>
Create `lib/seeded-random.ts` containing the `mulberry32` function currently defined in `components/twinkling-stars.tsx` (lines 6-13). Export it as a named export:

```typescript
// Seeded PRNG (mulberry32) for deterministic random values across SSR and client
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Then update `components/twinkling-stars.tsx`:

- Remove the local `mulberry32` function definition (lines 6-13)
- Add import: `import { mulberry32 } from "@/lib/seeded-random";`
- Keep the existing `mulberry32(42)` call on line 27 unchanged
  </action>
  <verify>Run `npx tsc --noEmit` — no type errors. Grep `lib/seeded-random.ts` exists and exports `mulberry32`. Grep `components/twinkling-stars.tsx` imports from `@/lib/seeded-random`.</verify>
  <done>mulberry32 lives in `lib/seeded-random.ts`, twinkling-stars imports it from there, no local definition remains in the component.</done>
  </task>

<task type="auto">
  <name>Task 2: Fix backgroundPattern hydration in page.tsx</name>
  <files>app/page.tsx</files>
  <action>
In `app/page.tsx`, replace the `Math.random()` based `backgroundPattern` (lines 37-42) with a seeded PRNG:

1. Add import: `import { mulberry32 } from "@/lib/seeded-random";`
2. Replace the backgroundPattern block with:

```typescript
// Generate deterministic positions for background pattern (seeded to avoid hydration mismatch)
const bgRandom = mulberry32(137);
const backgroundPattern = [...Array(20)].map(() => ({
  top: bgRandom() * 100,
  left: bgRandom() * 100,
  rotate: bgRandom() * 360,
}));
```

Use seed 137 (different from twinkling stars' seed 42) so the two patterns are visually distinct.
</action>
<verify>Run `npx tsc --noEmit` — no type errors. Grep `app/page.tsx` for `Math.random` — should return zero matches. Grep for `mulberry32(137)` — should match.</verify>
<done>`backgroundPattern` in `app/page.tsx` uses seeded PRNG, no `Math.random()` calls remain at module scope, server and client produce identical values.</done>
</task>

<task type="auto">
  <name>Task 3: Fix styled-jsx hydration in TwinklingStars</name>
  <files>components/twinkling-stars.tsx</files>
  <action>
In `components/twinkling-stars.tsx`, replace the `<style jsx>` block (lines 71-81) with a plain `<style>` tag. The `jsx` attribute causes styled-jsx to inject a scoped className (e.g., `jsx-b58ee1241b39e34a`) that differs between server and client in Next.js App Router.

Replace:

```tsx
<style jsx>{`
  @keyframes twinkle {
    0%,
    100% {
      opacity: var(--star-base-opacity);
    }
    50% {
      opacity: var(--star-peak-opacity);
    }
  }
`}</style>
```

With a plain style tag (no jsx attribute, no template literal — use a regular string child):

```tsx
<style>{`
  @keyframes twinkle {
    0%, 100% { opacity: var(--star-base-opacity); }
    50% { opacity: var(--star-peak-opacity); }
  }
`}</style>
```

This works because:

- The `twinkle` keyframe name is unique enough (no collision risk)
- The animation is applied via inline `style` prop (line 98), not via className
- Removing `jsx` prevents the scoped class injection that causes the mismatch
  </action>
  <verify>Run `npx tsc --noEmit` — no type errors. Grep `components/twinkling-stars.tsx` for `style jsx` — should return zero matches. Grep for `<style>` — should match. Run `npm run build` to confirm no build errors and no hydration warnings in build output.</verify>
  <done>TwinklingStars uses a plain `<style>` tag instead of styled-jsx. No scoped className injection. Twinkle animation still works via CSS custom properties and inline style application.</done>
  </task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with zero errors
2. `npm run build` completes successfully
3. No `Math.random()` calls at module scope in `app/page.tsx`
4. No `style jsx` in `components/twinkling-stars.tsx`
5. `lib/seeded-random.ts` exists and exports `mulberry32`
6. Both `twinkling-stars.tsx` and `page.tsx` import from `@/lib/seeded-random`
7. Open the site in browser, check console for hydration mismatch warnings — should be none
</verification>

<success_criteria>

- Zero hydration mismatch warnings in browser console on fresh page load
- Background pattern "M" letters render with deterministic positions (same on every load)
- Twinkling stars animate correctly (fade in/out with CSS custom properties)
- Build passes with no errors or warnings related to hydration
  </success_criteria>

<output>
After completion, create `.planning/quick/010-fix-hydration-mismatches-twinkling-stars-and-bg/010-SUMMARY.md`
</output>
