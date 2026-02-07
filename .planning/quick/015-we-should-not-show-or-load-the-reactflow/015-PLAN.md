---
phase: quick-015
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/sections/graph-section-loader.tsx
autonomous: true

must_haves:
  truths:
    - "ReactFlow JS bundle is NOT downloaded on mobile/tablet viewports (< 1024px)"
    - "Graph section renders nothing on mobile — no skeleton, no placeholder, no DOM"
    - "On desktop (>= 1024px), graph loads and functions identically to before"
    - "Page layout has no empty space or artifacts on mobile where graph used to be"
  artifacts:
    - path: "components/sections/graph-section-loader.tsx"
      provides: "Viewport-gated graph loader that prevents ReactFlow import below lg breakpoint"
  key_links:
    - from: "components/sections/graph-section-loader.tsx"
      to: "components/sections/graph-section.tsx"
      via: "next/dynamic import — only triggered when matchMedia confirms >= 1024px"
      pattern: "dynamic.*graph-section"
---

<objective>
Prevent ReactFlow graph from loading or rendering on mobile/tablet devices.

Purpose: ReactFlow is a heavy client-side library that serves no purpose on small screens — the experience timeline already provides the content in a mobile-friendly format. Loading ReactFlow on mobile wastes bandwidth and hurts performance.

Output: Modified `graph-section-loader.tsx` that gates the dynamic import behind a viewport width check using `window.matchMedia`. On mobile, the component returns `null` — no bundle downloaded, no DOM produced.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@components/sections/graph-section-loader.tsx
@components/sections/graph-section.tsx
@app/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Gate ReactFlow dynamic import behind desktop viewport check</name>
  <files>components/sections/graph-section-loader.tsx</files>
  <action>
Rewrite `graph-section-loader.tsx` to conditionally load ReactFlow only on desktop viewports:

1. Add `useState` + `useEffect` to detect desktop viewport using `window.matchMedia('(min-width: 1024px)')`. The 1024px threshold matches Tailwind's `lg:` breakpoint, which is the same breakpoint the page grid uses (`lg:grid-cols-[minmax(300px,400px)_1fr]` on line 170 of `app/page.tsx`).

2. Initialize state to `null` (unknown) to avoid flash. On mount, read `matchMedia.matches` to set the actual value. Listen for `change` events on the MediaQueryList so resizing between mobile/desktop toggles the graph.

3. When viewport is below 1024px, return `null` from `GraphSectionLoader`. This is critical — do NOT use CSS `hidden`/`display:none` because that would still trigger the JS dynamic import and download the ReactFlow bundle. The gate must be in JS, before the dynamic component renders.

4. When viewport is >= 1024px, render the existing `<GraphSection />` dynamic import exactly as today (with `ssr: false` and the loading skeleton).

5. When state is `null` (initial SSR/first render before useEffect fires), return `null` — this is fine because the existing `ssr: false` already means the graph shows nothing during SSR anyway.

6. Clean up the matchMedia listener in the useEffect cleanup function.

Implementation pattern:

```tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[500px] md:h-[700px] rounded-xl border border-stone-800 bg-stone-950/50 animate-pulse flex items-center justify-center">
        <span className="text-white/40 font-mono text-sm uppercase">
          Loading graph...
        </span>
      </div>
    ),
  },
);

export function GraphSectionLoader() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) return null;

  return <GraphSection />;
}
```

Note: The loading skeleton styles were updated to match the graph container styles from `graph-section.tsx` (line 284) — the old skeleton wrapped in `<section className="py-24 px-6">` was wrong since GraphSection renders inside a grid cell, not as a standalone section. The skeleton should match the graph container dimensions.
</action>
<verify>

- `pnpm build` succeeds with no errors
- In Chrome DevTools mobile emulation (iPhone SE, 375px): open Network tab, filter JS — confirm no `graph-section` or `xyflow` chunks appear
- In desktop viewport (1280px+): graph loads normally with skeleton then full graph, reveal animation works on hover
- Resize from desktop to mobile: graph disappears. Resize back: graph reappears and loads.
  </verify>
  <done>On viewports below 1024px, ReactFlow bundle is never downloaded and graph section produces zero DOM output. On desktop, graph works identically to before. No layout artifacts on mobile — the `grid-cols-1` fallback in page.tsx already handles single-child layout correctly since returning null produces no grid item.</done>
  </task>

</tasks>

<verification>
1. `pnpm build` — no TypeScript or build errors
2. Mobile test (Chrome DevTools, 375px width):
   - No ReactFlow JS chunks in Network tab (filter for "graph" or "xyflow")
   - No loading skeleton visible
   - Experience timeline section renders full-width, no trailing empty space
3. Desktop test (1280px+ width):
   - Graph loads via dynamic import (skeleton visible briefly)
   - Node reveal animation works on mouse enter
   - Achievement nodes expand on hover
   - Graph is interactive (pan, zoom)
4. Resize test: start at mobile width, drag to desktop — graph appears. Drag back — graph disappears.
</verification>

<success_criteria>

- ReactFlow bundle (all @xyflow chunks) is NOT downloaded on viewports < 1024px
- Graph section produces zero DOM output on mobile (JS gate, not CSS hiding)
- Desktop graph functionality is 100% preserved
- No layout shifts or empty space on mobile
- Build passes clean
  </success_criteria>

<output>
After completion, create `.planning/quick/015-we-should-not-show-or-load-the-reactflow/015-SUMMARY.md`
</output>
