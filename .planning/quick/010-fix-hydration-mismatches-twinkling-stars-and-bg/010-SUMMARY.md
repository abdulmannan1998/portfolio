# Quick Task 010: Fix Hydration Mismatches

## Problem

Two SSR/client hydration mismatches causing React warnings:

1. **`app/page.tsx`** — `Math.random()` at module scope for background pattern positions generated different values on server vs client
2. **`components/twinkling-stars.tsx`** — `<style jsx>` injected scoped className (`jsx-b58ee1241b39e34a`) on server that didn't match client rendering in App Router

## Solution

### Fix 1: Seeded PRNG for background pattern

- Extracted `mulberry32` PRNG to shared `lib/seeded-random.ts`
- Replaced `Math.random()` with `mulberry32(137)` for deterministic, reproducible positions
- Same approach already used successfully for TwinklingStars (seed 42)

### Fix 2: Remove styled-jsx scoping

- Changed `<style jsx>` to plain `<style>` tag
- The `@keyframes twinkle` animation doesn't need CSS scoping since it's applied via inline styles, not class selectors
- Eliminates the scoped className injection that caused server/client mismatch

### Files Changed

- `lib/seeded-random.ts` — New shared utility (extracted from twinkling-stars.tsx)
- `components/twinkling-stars.tsx` — Import shared PRNG, replace `<style jsx>` with `<style>`
- `app/page.tsx` — Import shared PRNG, replace `Math.random()` with seeded instance

## Verification

- Build passes cleanly
- No hydration mismatch warnings
