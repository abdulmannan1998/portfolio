---
phase: "07"
plan: "02"
subsystem: code-splitting
tags: ["extraction", "refactoring", "maintainability", "gap-closure"]
depends_on:
  requires: ["07-01"]
  provides:
    [
      "experience-timeline-component",
      "metrics-section-component",
      "experience-data",
    ]
  affects: []
tech_stack:
  added: []
  patterns: ["data-component-separation", "self-contained-sections"]
key_files:
  created:
    - data/experience.ts
    - components/sections/experience-timeline.tsx
    - components/sections/metrics-section.tsx
  modified:
    - app/page.tsx
decisions:
  - id: experience-data-extraction
    choice: "Separate experience data into typed data file"
    rationale: "Follows established pattern from tech-stack.ts, enables data reuse"
  - id: color-map-preservation
    choice: "Use explicit colorMap object for Tailwind classes"
    rationale: "Tailwind purges dynamic classes; explicit mapping ensures colors work in production"
metrics:
  duration: "~3 minutes"
  completed: "2026-02-06"
  line_reduction: "520 -> 390 (130 lines, 25% reduction)"
---

# Phase 07 Plan 02: Gap Closure - Additional Section Extraction

**One-liner:** Extracted experience timeline and metrics sections to bring page.tsx under 400 lines (390 final).

## What Was Done

### Task 1: Extract Experience Data and Timeline Component

Created `data/experience.ts`:

- Defined `ExperienceItem` type with company, role, period, color, and highlights
- Exported `experienceData` array with 3 experience entries (Intenseye, Layermark, Bilkent)
- Typed color field as union type for type safety

Created `components/sections/experience-timeline.tsx`:

- Self-contained component with "use client" directive
- Imports experience data from dedicated data file
- Uses explicit `colorMap` for Tailwind class preservation
- Renders full timeline section with animated entries

### Task 2: Extract Metrics Section Component

Created `components/sections/metrics-section.tsx`:

- Self-contained component with "use client" directive
- Imports RESUME_DATA and AnimatedCounter internally
- Renders full metrics section with horizontal scroll cards
- Encapsulates all metric rendering logic

### Task 3: Update page.tsx

Updated `app/page.tsx`:

- Added imports for ExperienceTimeline and MetricsSection
- Removed AnimatedCounter and RESUME_DATA imports (now internal)
- Replaced 130+ lines of inline JSX with two component calls
- Final line count: 390 (target: under 400)

## Artifacts Created

| File                                          | Purpose                    | Lines |
| --------------------------------------------- | -------------------------- | ----- |
| `data/experience.ts`                          | Experience data with types | 48    |
| `components/sections/experience-timeline.tsx` | Timeline section component | 62    |
| `components/sections/metrics-section.tsx`     | Metrics section component  | 63    |

## Key Implementation Details

### Tailwind Class Preservation

Tailwind's JIT compiler purges classes not found statically. Dynamic classes like `bg-${color}-500` would be purged. Solution:

```typescript
const colorMap: Record<ExperienceItem["color"], { bg: string; text: string }> =
  {
    orange: { bg: "bg-orange-500", text: "text-orange-500" },
    blue: { bg: "bg-blue-500", text: "text-blue-500" },
    purple: { bg: "bg-purple-500", text: "text-purple-500" },
  };
```

### Component Self-Containment

Each extracted component is fully self-contained:

- Has its own "use client" directive
- Imports its own dependencies
- Can be moved or reused without changes

## Verification Results

| Criterion                                           | Result |
| --------------------------------------------------- | ------ |
| data/experience.ts exports experienceData (3 items) | Pass   |
| ExperienceTimeline component exported               | Pass   |
| MetricsSection component exported                   | Pass   |
| page.tsx imports new components                     | Pass   |
| page.tsx under 400 lines (390)                      | Pass   |
| npm run build passes                                | Pass   |
| TypeScript compiles                                 | Pass   |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash    | Type     | Description                                    |
| ------- | -------- | ---------------------------------------------- |
| e9a5724 | feat     | Extract experience data and timeline component |
| 048fe6d | feat     | Extract metrics section component              |
| d4fff58 | refactor | Update page.tsx to use extracted sections      |

## Phase 7 Final State

After plan 02 (gap closure):

- **page.tsx**: 390 lines (original: 815, target: under 400) - **ACHIEVED**
- **Extracted components**: 5 total (tech-stack, graph, experience-timeline, metrics-section, plus data files)
- **Data files**: 3 (resume-data, tech-stack, experience)

## Next Phase Readiness

Phase 7 complete. Ready for Phase 8 (final verification).
