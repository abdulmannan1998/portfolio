---
phase: quick-011
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/sections/tech-and-code-section.tsx
autonomous: false

must_haves:
  truths:
    - "Tech icons fill full width in a dense brutalist grid with visible gap-px dividers"
    - "Each tech item has its own grid cell with bg-black, padding, and hover:bg-orange-500/10"
    - "Category names appear as full-width row headers with orange left border accent"
    - "GitHub activity sits below the tech grid as a full-width horizontal strip"
    - "No 2-column sidebar layout remains — everything is full-width"
    - "Section looks dense and industrial, matching the brutalist aesthetic from DESIGN.md"
  artifacts:
    - path: "components/sections/tech-and-code-section.tsx"
      provides: "Redesigned full-width brutalist tech grid with GitHub activity below"
      contains: "gap-px"
  key_links:
    - from: "components/sections/tech-and-code-section.tsx"
      to: "data/tech-stack.ts"
      via: "techCategories import"
      pattern: "techCategories"
    - from: "components/sections/tech-and-code-section.tsx"
      to: "components/github-activity.tsx"
      via: "GitHubActivity import"
      pattern: "GitHubActivity"
---

<objective>
Redesign the Stack & Code section to eliminate whitespace and match the brutalist aesthetic.

Purpose: The current 2-column sidebar layout (1fr + 380px) creates dead space — the tech icons don't fill their column and the GitHub activity widget is squeezed into a narrow sidebar. This redesign makes everything full-width with a dense brutalist grid pattern.

Output: Restructured `tech-and-code-section.tsx` with full-width tech grid and horizontal GitHub activity strip below.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@DESIGN.md (brutalist grid pattern reference — Tech Grid section)
@components/sections/tech-and-code-section.tsx (current implementation)
@components/github-activity.tsx (GitHub activity component — no changes needed)
@data/tech-stack.ts (5 categories, 27 total tech items)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Restructure to full-width brutalist grid with GitHub below</name>
  <files>components/sections/tech-and-code-section.tsx</files>
  <action>
Rewrite the layout in `tech-and-code-section.tsx`. Remove the 2-column sidebar grid entirely. Replace with:

**1. Full-width tech grid per category:**

For each category, render:

- A full-width category header row: keep the orange left border accent (`w-0.5 h-4 bg-orange-500`) and mono label style, but make it span the full width. Add a subtle bottom border or keep the existing style — the key thing is it should sit as a visual separator between category groups.
- A brutalist grid of tech items using the DESIGN.md pattern:

```tsx
{
  /* Outer wrapper provides the "visible gap" line color */
}
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-px bg-white/10">
  {category.items.map((tech, index) => (
    <motion.div
      key={tech.name}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: (categoryStartIndex + index) * 0.03,
        duration: 0.3,
      }}
      className="bg-black p-4 md:p-6 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-colors cursor-default group"
    >
      <img
        src={tech.icon}
        alt={tech.name}
        className="w-8 h-8 md:w-10 md:h-10 object-contain"
      />
      <span className="text-[10px] font-mono uppercase text-white/50 group-hover:text-orange-500 transition-colors text-center leading-tight">
        {tech.name}
      </span>
    </motion.div>
  ))}
</div>;
```

Key design decisions:

- Use `grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9` — more columns than DESIGN.md suggests since we have many small items per category (4-7 items). 9 columns at lg ensures even a 7-item category fills most of a row without huge gaps. Adjust if needed but the goal is DENSE.
- `gap-px bg-white/10` on the grid wrapper creates the visible 1px divider lines between cells (the bg-white/10 shows through the 1px gap).
- Each cell gets `bg-black` to match the page background, with `hover:bg-orange-500/10` for the brutalist hover effect.
- Remove `whileHover={{ scale: 1.05 }}` from motion.div — scaling doesn't fit the brutalist grid-cell pattern. The hover bg color change is sufficient.
- Keep the staggered `initial/whileInView` animation with the precomputed `categoryOffsets`.

**2. Category spacing:**

Reduce `space-y-8` to `space-y-6` between categories. Each category block is: header + grid. The gap-px grid already provides visual density.

**3. GitHub Activity — full-width strip below:**

After the tech categories `div`, place the `GitHubActivity` component as a full-width element (no sidebar). Remove the `grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6` wrapper entirely.

Add a top margin (e.g., `mt-8`) and optionally a top border (`border-t border-white/10 pt-8`) to visually separate the GitHub activity from the tech grid.

The GitHubActivity component itself (`github-activity.tsx`) does NOT need changes — it already has `bg-stone-900 p-6` styling and works at any width. At full width it will naturally flow as a horizontal card.

**4. Overall section structure should become:**

```tsx
<section className="relative py-24 bg-black">
  {/* Section header — unchanged */}
  <div className="px-6 md:px-12 mb-16">...</div>

  {/* Tech grid — full width */}
  <div className="px-6 md:px-12">
    <div className="space-y-6">
      {techCategories.map((category, catIndex) => (
        <div key={category.name}>
          {/* Category header */}
          ...
          {/* Brutalist grid */}
          ...
        </div>
      ))}
    </div>

    {/* GitHub Activity — full width below */}
    <div className="mt-8 border-t border-white/10 pt-8">
      <GitHubActivity username={SOCIAL_LINKS.github.username} />
    </div>
  </div>
</section>
```

**What NOT to do:**

- Do NOT change `github-activity.tsx` — it works as-is at full width.
- Do NOT change `data/tech-stack.ts` — data is fine.
- Do NOT add border-radius anywhere — brutalist means `rounded-none` (which is default for divs).
- Do NOT remove the section header ("STACK & CODE") or change its style.
- Do NOT remove the `categoryOffsets` precomputation — it drives staggered animation.
  </action>
  <verify>
  Run `npm run build` to confirm no TypeScript or build errors. Visually inspect the section — tech items should appear in a dense grid with visible 1px dividers, category headers above each grid group, and GitHub activity as a full-width strip below.
  </verify>
  <done>
  The 2-column sidebar layout is completely removed. Tech items render in a full-width brutalist grid (gap-px, bg-white/10 dividers, bg-black cells, hover:bg-orange-500/10). Category headers separate each group. GitHub activity sits below the grid as a full-width section. The layout is dense with minimal whitespace.
  </done>
  </task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Redesigned Stack & Code section with full-width brutalist tech grid and horizontal GitHub activity strip</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open localhost:3000
    2. Scroll to the "STACK & CODE" section
    3. Verify: Tech items appear in a dense grid with visible 1px white dividers between cells
    4. Verify: Hovering a tech cell shows a subtle orange background tint
    5. Verify: Category names (LANGUAGES, FRAMEWORKS, etc.) appear as headers above each grid group
    6. Verify: GitHub activity appears below the tech grid, spanning full width (no sidebar)
    7. Verify: No large empty spaces — the section feels dense and industrial
    8. Test at mobile (375px) — grid should collapse to 3 columns
    9. Test at tablet (768px) — grid should show 6 columns
    10. Test at desktop (1280px+) — grid should show 9 columns
  </how-to-verify>
  <resume-signal>Type "approved" or describe what needs adjustment</resume-signal>
</task>

</tasks>

<verification>
- `npm run build` succeeds with no errors
- No TypeScript errors in tech-and-code-section.tsx
- Section renders at all breakpoints (375px, 768px, 1280px)
- GitHub activity component still loads and displays data
</verification>

<success_criteria>

- Full-width brutalist grid replaces the 2-column sidebar layout
- gap-px with bg-white/10 creates visible cell dividers
- Each tech item has its own grid cell with hover state
- Category headers separate tech groups
- GitHub activity renders full-width below the tech grid
- Responsive at all breakpoints (3/4/6/9 columns)
- User approves the visual result
  </success_criteria>

<output>
After completion, create `.planning/quick/011-redesign-stack-code-section-reduce-whitespa/011-SUMMARY.md`
</output>
