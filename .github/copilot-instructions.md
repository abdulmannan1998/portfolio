# Copilot Instructions for AI Coding Agents

## Quick Summary

- Next.js app using the `/app` directory (app-router). UI lives in `/components` and primitives in `/components/ui`.
- Static content and the main dataset are in `/data/resume-data.ts` (imported as `RESUME_DATA`).
- Utilities and graph helpers are in `/lib` (e.g., `cn` in `lib/utils.ts`).

## Development & Commands

- Start dev server: `pnpm dev` (project uses pnpm; `package.json` scripts expect it).
- Build for production: `pnpm build` and preview with `pnpm start`.
- Linting: `eslint.config.mjs` is configured; run the project's eslint script if present.

## Architecture & Data Flow (Why it is structured this way)

- The app is a static/SPA-oriented portfolio/dashboard that composes reusable UI primitives with static data. The main view (`app/page.tsx`) imports `RESUME_DATA` and maps metrics into `LiveMetricWidget` components.
- Heavy UI/visualization pieces are lazy-loaded with `next/dynamic` and `ssr: false` (see [app/page.tsx](app/page.tsx)) to avoid server-side rendering of browser-only libraries (React Flow, Konva, ECharts).

## Conventions & Patterns (Project-specific)

- TypeScript throughout; prefer exported types in `data/` files (see `data/resume-data.ts`).
- Files: kebab-case. Components: PascalCase (e.g., `LiveMetricWidget`, `DashboardBackground`).
- UI primitives use `class-variance-authority` + Tailwind. Example: `components/ui/button.tsx` defines `buttonVariants` via `cva` and composes classes with `cn` from `lib/utils.ts`.
- Styling: Tailwind + `tailwind-merge` via `cn()` helper to combine classes safely.

## Notable Integration Points & Libraries

- Framer Motion is used for micro-interactions in `app/page.tsx`.
- Dynamic imports and `ssr: false` appear on heavy components to keep server builds clean: `DashboardBackground`, `LiveMetricWidget`, `MobileHero`.
- Design system is Shadcn-style primitives (see `/components/ui/*`)—follow the same prop patterns and `data-` attributes when adding components.

## Practical Guidance for Common Tasks

- Add a UI primitive: create file in `components/ui/` using existing primitives (follow `button.tsx` pattern), export named component and variants.
- Add a page widget: create component in `components/`, lazy-load it in `app/page.tsx` with `dynamic(..., { ssr: false })` if it uses browser-only APIs.
- Update content: edit [data/resume-data.ts](data/resume-data.ts) — UI reads `RESUME_DATA` directly.

## Files to Inspect for Examples

- Main: [app/page.tsx](app/page.tsx)
- Data model: [data/resume-data.ts](data/resume-data.ts)
- UI primitive example: [components/ui/button.tsx](components/ui/button.tsx)
- Utility helper: [lib/utils.ts](lib/utils.ts)

## When to Avoid Changes

- Do not add server routes or API folders unless required—this project is structured as a static/SPA portfolio without backend services.

## Questions / Unknowns to Confirm with Maintainer

- Are there CI checks or project-specific eslint/prettier scripts to run locally? (Check `package.json` before committing.)
- Preferred branch/review workflow (commit message format, PR target) — follow repository norms if present.

---

If anything here is unclear or you'd like the instructions to include additional examples (tests, CI steps, or commit conventions), tell me which area to expand.
