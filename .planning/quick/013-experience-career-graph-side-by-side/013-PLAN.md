---
phase: quick
plan: "013"
type: execute
wave: 1
depends_on: []
files_modified:
  - app/page.tsx
  - components/sections/experience-timeline.tsx
  - components/sections/graph-section.tsx
autonomous: true

must_haves:
  truths:
    - "On lg+ screens, Experience and Career Graph appear side by side"
    - "On mobile/tablet, they stack vertically as before"
    - "Experience is on the left, Career Graph on the right"
    - "No duplicate Career Graph header exists"
  artifacts:
    - path: "app/page.tsx"
      provides: "Shared wrapper section with side-by-side grid"
    - path: "components/sections/experience-timeline.tsx"
      provides: "Experience as a panel (no section wrapper)"
    - path: "components/sections/graph-section.tsx"
      provides: "Graph as a panel (no section wrapper)"
  key_links:
    - from: "app/page.tsx"
      to: "ExperienceTimeline + GraphSection"
      via: "shared parent section with lg:grid-cols layout"
---

<objective>
Place the Experience timeline and Career Graph sections side by side on desktop (lg+), with Experience on the left and Career Graph on the right. On mobile/tablet, they remain stacked vertically.

Purpose: Better use of horizontal space on wide screens - the Experience timeline is narrow text content while the Career Graph needs width for its interactive canvas.
Output: Updated layout with both components as panels inside a shared container.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/page.tsx (lines 251-267 - current section layout)
@components/sections/experience-timeline.tsx (full file - section wrapper + timeline)
@components/sections/graph-section.tsx (full file - section wrapper + graph)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Convert ExperienceTimeline from section to panel</name>
  <files>components/sections/experience-timeline.tsx</files>
  <action>
  Change ExperienceTimeline to render as a panel instead of a full-width section:

1. Replace the outer `<section className="relative py-24 bg-stone-950">` with a plain `<div>` (no section tag, no py-24, no bg - the parent in page.tsx will handle those).
2. Remove the `<div className="max-w-4xl mx-auto px-6 md:px-12">` inner wrapper - replace with just a plain `<div>`. The component will be sized by the grid column in the parent. Keep padding minimal or remove it (the parent grid gap handles spacing).
3. Keep all content (header span "Journey", h2 "EXPERIENCE", timeline items) exactly as-is.
   </action>
   <verify>TypeScript compiles: `npx tsc --noEmit --pretty 2>&1 | head -20`</verify>
   <done>ExperienceTimeline renders as a div panel without section/bg/padding wrappers</done>
   </task>

<task type="auto">
  <name>Task 2: Convert GraphSection from section to panel and adjust height</name>
  <files>components/sections/graph-section.tsx</files>
  <action>
  Change GraphSectionInner to render as a panel instead of a full-width section:

1. Replace the outer `<section id="graph" className="relative py-16 px-6 md:px-12 lg:px-24">` with `<div id="graph" className="relative">`. Remove all padding (parent handles it). Keep the id="graph" for anchor links.
2. Remove the `<div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/20 to-stone-950" />` gradient overlay - the parent section will have bg-stone-950.
3. Remove `max-w-7xl mx-auto` from the inner wrapper div (line 277) - the grid column constrains width. Just use `<div className="relative">`.
4. Keep the section header (motion.div with "Interactive" / "Career Graph" / description) exactly as-is - this is the REAL header that stays.
5. Keep the graph container grid (legend + graph) exactly as-is.
6. The graph height `h-[500px] md:h-[600px]` stays as-is - it will fill within its grid column.
   </action>
   <verify>TypeScript compiles: `npx tsc --noEmit --pretty 2>&1 | head -20`</verify>
   <done>GraphSectionInner renders as a div panel without section/padding/gradient wrappers</done>
   </task>

<task type="auto">
  <name>Task 3: Create shared side-by-side container in page.tsx</name>
  <files>app/page.tsx</files>
  <action>
  Replace lines 251-267 (the ExperienceTimeline call + the Career Graph section wrapper) with a single shared section:

```tsx
{
  /* Experience + Career Graph side by side */
}
<section className="relative py-24 bg-stone-950">
  <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16">
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-12 lg:gap-16">
      <ExperienceTimeline />
      <GraphSection />
    </div>
  </div>
</section>;
```

Key layout decisions:

- `lg:grid-cols-[minmax(300px,400px)_1fr]` gives Experience a constrained width (300-400px) and Graph gets the remaining space. This works because Experience is text content (narrow) and the graph canvas benefits from width.
- `gap-12 lg:gap-16` provides generous spacing between panels.
- `max-w-[1800px]` allows the layout to breathe on ultra-wide screens while still having bounds.
- Single `bg-stone-950` background covers both panels uniformly.
- `py-24` provides vertical padding like both sections had before.
- On mobile (`grid-cols-1`), they stack vertically with gap-12 between them.

IMPORTANT: Remove the duplicate Career Graph header that was in page.tsx (lines 255-265). The GraphSection component already has its own header internally.
</action>
<verify>

1. TypeScript compiles: `npx tsc --noEmit --pretty 2>&1 | head -20`
2. Dev server runs: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` returns 200 (if dev server is running)
   </verify>
   <done>Experience and Career Graph are side by side on lg+ with Experience left, Graph right. Stacked on mobile. No duplicate headers.</done>
   </task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. On a wide viewport (lg+, 1024px+): Experience timeline appears on the left, Career Graph on the right
3. On a narrow viewport (below lg): sections stack vertically, Experience first then Graph
4. Career Graph header ("Interactive" / "Career Graph") appears only once (from GraphSection component)
5. Both panels share the same stone-950 background seamlessly
6. Career Graph interactive features (hover to reveal nodes) still work
7. Experience timeline animations still trigger on scroll
</verification>

<success_criteria>

- Side-by-side layout on lg+ with Experience (left, ~300-400px) and Career Graph (right, remaining space)
- Vertical stack on mobile/tablet
- No duplicate section headers
- No visual seams between the two panels
- All interactive features preserved
  </success_criteria>

<output>
After completion, create `.planning/quick/013-experience-career-graph-side-by-side/013-SUMMARY.md`
</output>
