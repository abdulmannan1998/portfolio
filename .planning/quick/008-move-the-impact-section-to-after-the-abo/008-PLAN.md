---
phase: quick-008
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [app/page.tsx]
autonomous: true

must_haves:
  truths:
    - "The Impact (MetricsSection) section appears immediately after the About section on the page"
    - "The Impact section appears before the Tech Stack section"
    - "All other sections remain in their original order"
  artifacts:
    - path: "app/page.tsx"
      provides: "Main page with reordered sections"
      contains: "MetricsSection"
  key_links:
    - from: "app/page.tsx"
      to: "components/sections/metrics-section.tsx"
      via: "import and JSX render"
      pattern: "<MetricsSection"
---

<objective>
Move the Impact section (MetricsSection component) to appear directly after the About section on the main portfolio page.

Purpose: Improve content flow so visitors see measurable impact immediately after reading about the developer, before diving into tech stack details.
Output: Updated app/page.tsx with reordered sections.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reorder MetricsSection to after About section</name>
  <files>app/page.tsx</files>
  <action>
In app/page.tsx, move the `<MetricsSection />` JSX element (currently at line 297, between ExperienceTimeline and the Career Graph section) to immediately after the About section closing tag (after line 242's `</section>`), placing it before the Tech Stack section (which starts at line 244).

Current section order in JSX:

1. Hero
2. Marquee
3. About (lines 169-242)
4. Tech Stack (lines 244-291)
5. ExperienceTimeline (line 294)
6. **MetricsSection (line 297)** <-- MOVE THIS
7. Career Graph (lines 300-312)
8. GitHub Activity (lines 314-372)
9. CTA/Footer
10. Bottom marquee

Target section order:

1. Hero
2. Marquee
3. About
4. **MetricsSection** <-- TO HERE
5. Tech Stack
6. ExperienceTimeline
7. Career Graph
8. GitHub Activity
9. CTA/Footer
10. Bottom marquee

Simply cut `<MetricsSection />` from its current position and paste it after the About section comment block. Add a comment `{/* Impact metrics */}` above it for consistency with other section comments. Keep a blank line before and after for readability.

Do NOT change any imports, props, styling, or other section ordering.
</action>
<verify>
Run `npx next build` to confirm no build errors. Visually inspect that the JSX order in page.tsx shows MetricsSection immediately after the About section and before the Tech Stack section.
</verify>
<done>MetricsSection renders directly after the About section and before Tech Stack. No other section ordering changed. Build succeeds.</done>
</task>

</tasks>

<verification>
- `npx next build` completes without errors
- In app/page.tsx, MetricsSection appears after the About section (grid cols-2 block) and before the Tech Stack section (py-24 bg-black with "Technologies" heading)
- All other sections remain in their original relative order
</verification>

<success_criteria>

- The Impact section (MetricsSection) is positioned immediately after the About section in the page
- The Tech Stack section follows the Impact section
- ExperienceTimeline no longer has MetricsSection below it (MetricsSection moved earlier)
- Build passes, no runtime errors
  </success_criteria>

<output>
After completion, create `.planning/quick/008-move-the-impact-section-to-after-the-abo/008-SUMMARY.md`
</output>
