# Copilot Instructions for AI Coding Agents

## Project Overview

- This is a Next.js app using the `/app` directory structure, bootstrapped with `create-next-app`.
- Main UI components are in `/components` and `/components/ui`.
- Data sources (e.g., resume data) are in `/data`.
- Utility and graph logic are in `/lib`.

## Key Workflows

- **Development:** Use `pnpm dev` (or `npm/yarn/bun dev`) to start the local server.
- **Editing:** Main entry is `/app/page.tsx`. Global styles in `/app/globals.css`.
- **Build:** Use `pnpm build` for production builds.
- **Linting:** Project uses ESLint (`eslint.config.mjs`) and Prettier (`.prettierrc`).
- **Formatting:** Run Prettier for code style consistency.
- **Deployment:** Deploy via Vercel; see `README.md` for details.

## Architectural Patterns

- **Component Structure:** UI is modularized in `/components/ui` (e.g., `button.tsx`, `card.tsx`). Custom widgets (e.g., `live-metric-widget.tsx`) are in `/components`.
- **Data Flow:** Static data (e.g., resume) is imported from `/data`. No backend API integration is present by default.
- **Styling:** Uses global CSS and component-level styles. Font optimization via `next/font` (Geist).
- **Config:** Next.js config in `next.config.ts`, TypeScript config in `tsconfig.json`.

## Conventions & Patterns

- **TypeScript:** All code is written in TypeScript.
- **File Naming:** Use kebab-case for files, PascalCase for components.
- **Component Props:** Prefer explicit prop typing.
- **UI Library:** Custom UI primitives in `/components/ui` are reused across the app.
- **No API Routes:** No `/pages/api` or serverless functions by default.

## Integration Points

- **External:** Next.js, Vercel, Geist font, ESLint, Prettier, PostCSS.
- **Internal:** Data and utility modules are imported directly; no cross-service boundaries.

## Examples

- To add a new UI element, create it in `/components/ui` and import into `/app/page.tsx`.
- To update resume data, edit `/data/resume-data.ts`.
- To add a new utility, place it in `/lib` and import as needed.

---

_If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions._
