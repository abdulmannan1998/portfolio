---
phase: quick
plan: "009"
subsystem: ui-sections
tags: [tech-stack, github-activity, layout, framer-motion, responsive]
dependency-graph:
  requires: [Q004-tech-stack-icons, Q006-sticky-nav-contacts]
  provides: [combined-tech-code-section, slimmed-github-activity]
  affects: []
tech-stack:
  added: []
  patterns: [precomputed-animation-offsets, two-column-sidebar-layout]
key-files:
  created:
    - components/sections/tech-and-code-section.tsx
  modified:
    - components/github-activity.tsx
    - app/page.tsx
decisions:
  - id: precomputed-offsets
    decision: Precompute animation delay offsets at module level to satisfy React immutability lint rules
    rationale: React hooks linter rejects mutable variable reassignment inside render; precomputation is idiomatic
  - id: sidebar-layout
    decision: Use lg:grid-cols-[1fr_380px] for tech/activity two-column layout
    rationale: Fixed 380px sidebar prevents activity panel from competing with tech icons for space
  - id: live-badge-header
    decision: Move LIVE badge into header row instead of separate line
    rationale: More compact for sidebar; consolidates status indication with section identity
metrics:
  duration: ~3 min
  completed: "2026-02-06"
---

# Quick Task 009: Merge Tech Stack & Live Code Sections Summary

**Combined two separate sections (Tech Stack + Live Code) into a single cohesive "STACK & CODE" section with a two-column layout.**

## What Changed

### New Component: `TechAndCodeSection`

Created `components/sections/tech-and-code-section.tsx` as a self-contained "use client" component that combines:

- **Left column**: Tech stack with larger icons (w-10 h-10, up from w-8 h-8), orange left-border accent per category label, staggered `whileInView` animations (30ms delay between icons), and `scale-105` hover transforms
- **Right column (380px sidebar)**: Slimmed GitHub activity feed + compact social CTA cards (GitHub + LinkedIn)
- **Responsive**: Stacks vertically on mobile (tech first, activity below)

### Slimmed `GitHubActivity` Component

Modified to work in a sidebar context:

- Corner accent: `w-16 h-16` reduced to `w-8 h-8`
- Latest push text: `text-2xl md:text-3xl` reduced to `text-lg md:text-xl`
- Padding: `p-8 md:p-12` reduced to `p-6`
- Removed header VIEW PROFILE button, added compact "VIEW PROFILE" text link at bottom
- Added LIVE badge with pulsing orange dot in header row

### Cleaned Up `page.tsx`

- Removed 47-line tech stack section and 58-line Live Code section (net -107 lines from page)
- Added single `<TechAndCodeSection />` after MetricsSection
- Cleaned unused imports: `techCategories`, `GitHubActivity`, `ExternalLink`
- Section order preserved: Metrics -> Stack & Code -> Experience Timeline

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed mutable render variable for animation offsets**

- **Found during:** Task 1
- **Issue:** React hooks immutability linter rejected `globalIndex += ...` inside render's `.map()` callback
- **Fix:** Precomputed `categoryOffsets` array at module level using `.reduce()`, referenced by index in render
- **Files modified:** `components/sections/tech-and-code-section.tsx`
- **Commit:** 65ab961

## Commits

| #   | Hash    | Message                                                                        |
| --- | ------- | ------------------------------------------------------------------------------ |
| 1   | 65ab961 | `feat(quick-009): create TechAndCodeSection combined component`                |
| 2   | 756765f | `refactor(quick-009): slim down GitHubActivity for sidebar context`            |
| 3   | f6c8149 | `feat(quick-009): replace separate tech/code sections with TechAndCodeSection` |

## Verification

- [x] Both sections combined into one "STACK & CODE" section
- [x] Tech stack icons are larger (w-10 h-10) with staggered animations
- [x] GitHub activity displays in sidebar with compact styling
- [x] Social CTAs present and functional (GitHub + LinkedIn)
- [x] Mobile responsive (stacks vertically below lg breakpoint)
- [x] No broken imports or unused code
- [x] Section order: MetricsSection -> TechAndCodeSection -> ExperienceTimeline
- [x] Full build passes (`next build` clean)
- [x] TypeScript type-check passes
- [x] ESLint + Prettier pass via pre-commit hooks
