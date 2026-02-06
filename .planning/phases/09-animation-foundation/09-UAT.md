---
status: diagnosed
phase: 09-animation-foundation
source: [09-01-SUMMARY.md, 09-02-SUMMARY.md]
started: 2026-02-07T00:00:00Z
updated: 2026-02-07T00:02:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Hero Parallax Scroll Effect

expected: Scroll down from the top. Hero section smoothly scales down (shrinks) and fades out as you scroll through the first ~15% of the page. Effect feels identical to before.
result: issue
reported: "The hero disappears way too soon. By the time I scroll down enough to see the entirety of the marquee-text, everything is black. That is way sooner than before"
severity: major

### 2. Hero Content Display

expected: Hero section shows all elements correctly: twinkling stars background, your name/heading, subtitle or tagline text, and a scroll-down indicator at the bottom of the hero area.
result: pass

### 3. No Visual Regression

expected: The rest of the site below the hero (about, metrics, experience, tech stack, GitHub activity, footer) looks and behaves the same as before. No broken layouts, missing sections, or visual glitches.
result: pass

## Summary

total: 3
passed: 2
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "Hero parallax scroll effect matches original behavior — gradual fade and scale over first ~15% of page scroll"
  status: failed
  reason: "User reported: The hero disappears way too soon. By the time I scroll down enough to see the entirety of the marquee-text, everything is black. That is way sooner than before"
  severity: major
  test: 1
  root_cause: "maxScroll uses window.innerHeight \* 0.15 (135px on 900px viewport) but framer-motion scrollYProgress [0, 0.15] means 15% of total scrollable distance (~615px on a 5000px page). Hero fades 4.5x faster than intended."
  artifacts:
  - path: "components/hero-parallax.tsx"
    issue: "Line 20: maxScroll = window.innerHeight \* 0.15 should use document scroll height"
    missing:
  - "Change maxScroll to (document.documentElement.scrollHeight - window.innerHeight) \* 0.15"
    debug_session: ".planning/debug/hero-parallax-fade.md"
