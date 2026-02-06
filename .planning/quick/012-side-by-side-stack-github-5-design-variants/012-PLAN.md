# Quick Task 012: Side-by-Side Stack & GitHub — 5 Design Variants

## Goal

Redesign the Stack & Code section so that the tech stack grid and GitHub live feed sit **side by side** instead of stacked vertically. Create **5 distinct creative variants** for the user to choose from.

## Narrative Context

This section sits after Impact Metrics and before Experience Timeline. It answers: "What tools does this engineer use, and is he actively building?" The side-by-side layout creates a visual dialogue between **capability** (left: tech stack) and **proof** (right: live GitHub activity).

## Design Constraints

- Brutalist aesthetic: sharp edges, no border-radius, high contrast, industrial grid
- Color palette: black, stone-900, white, orange-500 accents
- Typography: font-mono labels, font-black headers, uppercase tracking-widest
- Responsive: side-by-side on lg+, stacked on mobile
- Preserve all existing functionality (animations, caching, hover states)
- Keep GitHubActivity component unchanged — only change how it's composed

## Variants

### Variant 1: "Command Center"

Split layout — left 2/3 tech grid, right 1/3 GitHub panel as a dark terminal-style feed. GitHub panel has a fixed height matching the grid, with a monospace "terminal header" bar (green dot + "LIVE TERMINAL"). The grid uses the existing brutalist gap-px pattern. Both panels share a single outer border of white/10.

### Variant 2: "Asymmetric Panels"

Dramatic asymmetric split — left panel (60%) with tech arranged as horizontal category rows (icon + name inline, no grid), right panel (40%) GitHub activity with oversized latest commit message as a pull quote. A thick orange-500 vertical divider (4px) separates them. The right panel has a stone-900 background creating depth contrast.

### Variant 3: "Newspaper Editorial"

Editorial layout — left column has tech stack organized like a newspaper's classified section (dense, multi-column within categories, small text), right column is a "DISPATCH" sidebar with GitHub activity styled as breaking news items. Thin rule lines between sections. Category headers use a black bg with white text label style.

### Variant 4: "Dashboard Tiles"

Data dashboard aesthetic — left panel shows tech in a tight 2-row grid per category (horizontal scrollable chips on mobile, full grid on desktop), right panel shows GitHub as a "status board" with the latest push as a large "status card" and recent activity as compact log entries below. Both panels are equal-height with matching stone-900 backgrounds and subtle internal grid borders.

### Variant 5: "Brutalist Magazine"

Magazine spread — left page has tech stack in a dramatic stacked layout with oversized category headers and small icon clusters. Right page has GitHub activity with a massive pull-quote of the latest commit message, repo badge, and recent activity as a sidebar index. An orange diagonal stripe element cuts across the junction point of both halves.

## Tasks

1. **Create 5 variant component files** in `components/sections/variants/`:
   - `variant-1-command-center.tsx`
   - `variant-2-asymmetric-panels.tsx`
   - `variant-3-newspaper-editorial.tsx`
   - `variant-4-dashboard-tiles.tsx`
   - `variant-5-brutalist-magazine.tsx`

2. **Create variant switcher** — Temporary modification to `tech-and-code-section.tsx` that imports all 5 and renders them stacked with labels, so the user can scroll through and compare.

3. **Commit artifacts** — Single atomic commit with all variants.

## Output

- 5 fully-functional variant files in `components/sections/variants/`
- Modified `tech-and-code-section.tsx` showing all 5 for comparison
- User chooses one; unchosen variants get removed in a follow-up task
