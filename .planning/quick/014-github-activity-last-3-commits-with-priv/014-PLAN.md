---
phase: quick
plan: 014
type: execute
wave: 1
depends_on: []
files_modified:
  - app/api/github/route.ts
  - components/github-activity.tsx
autonomous: true
user_setup:
  - service: github
    why: "PAT with repo scope needed to access private repo events"
    env_vars:
      - name: GITHUB_TOKEN
        source: "GitHub -> Settings -> Developer settings -> Personal access tokens -> Generate new token (classic) with 'repo' scope"
    dashboard_config: []

must_haves:
  truths:
    - "Widget shows exactly 3 most recent commits (PushEvent), not generic events"
    - "Private repo commits appear in the feed (when GITHUB_TOKEN is set)"
    - "Public repo commits show full repo name, commit message, and link to commit"
    - "User's own private repo commits show commit message but repo name is redacted"
    - "Org/other private repo commits have both repo name AND commit message redacted"
    - "Browser network tab shows only pre-redacted data from /api/github (no raw private info)"
    - "Redacted items have a visual classified-document effect (not just plain text)"
    - "Without GITHUB_TOKEN, widget falls back to public API behavior gracefully"
  artifacts:
    - path: "app/api/github/route.ts"
      provides: "Server-side GitHub event fetching with redaction"
      exports: ["GET"]
    - path: "components/github-activity.tsx"
      provides: "Redesigned commit-focused widget with redaction visuals"
  key_links:
    - from: "components/github-activity.tsx"
      to: "/api/github"
      via: "fetch in useEffect"
      pattern: "fetch.*api/github"
    - from: "app/api/github/route.ts"
      to: "GitHub Events API"
      via: "authenticated fetch with GITHUB_TOKEN"
      pattern: "api\\.github\\.com/users/.*/events"
---

<objective>
Replace the current client-side GitHub activity widget with a commit-focused widget backed by a server-side API route. The API route authenticates with a GitHub PAT to access private repo events, applies tiered redaction rules server-side (so private info never reaches the browser), and returns exactly the last 3 commits. The frontend renders these with a classified-document redaction aesthetic for private items.

Purpose: Show real coding activity including private work, while protecting sensitive repo/commit details through server-side sanitization.
Output: Working `/api/github` route + redesigned `github-activity.tsx` showing 3 commits with redaction effects.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@components/github-activity.tsx
@components/sections/tech-and-code-section.tsx
@lib/social-links.ts
@next.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create server-side GitHub API route with tiered redaction</name>
  <files>app/api/github/route.ts</files>
  <action>
Create `app/api/github/route.ts` as a Next.js Route Handler (GET).

**Fetching logic:**

1. Read `process.env.GITHUB_TOKEN`. If not set, fall back to fetching from `https://api.github.com/users/abdulmannan1998/events/public?per_page=30` (no auth header).
2. If token exists, fetch `https://api.github.com/users/abdulmannan1998/events?per_page=30` with header `Authorization: Bearer ${GITHUB_TOKEN}`.
3. Filter events to only `PushEvent` type.
4. Flatten commits: each PushEvent can contain multiple commits in `payload.commits[]`. Extract individual commits, each carrying the parent event's `repo.name`, `created_at`, `public` flag, and the commit's own `message` and `sha`.
5. Take the first 3 commits (most recent first -- events API returns reverse chronological).

**Redaction logic (applied BEFORE returning response):**
For each commit, determine a `visibility` tier:

- `"public"`: `event.public === true`. Return everything as-is: `{ repo, message, sha, timestamp, visibility: "public", repoUrl, commitUrl }`.
- `"own-private"`: `event.public === false` AND `event.repo.name` starts with `abdulmannan1998/` (the user's own repos). Return: `{ repo: "[REDACTED]", message: <real message>, sha, timestamp, visibility: "own-private", repoUrl: null, commitUrl: null }`.
- `"org-private"`: `event.public === false` AND repo does NOT start with `abdulmannan1998/`. Return: `{ repo: "[REDACTED]", message: "[CLASSIFIED]", sha: sha.substring(0, 7), timestamp, visibility: "org-private", repoUrl: null, commitUrl: null }`.

**Response shape** (TypeScript type to export):

```typescript
export type RedactedCommit = {
  id: string; // unique id (sha + index)
  repo: string; // full "owner/repo" or "[REDACTED]"
  repoShort: string; // just repo name or "[REDACTED]"
  message: string; // commit message or "[CLASSIFIED]"
  sha: string; // full sha or truncated 7-char
  timestamp: string; // ISO date string
  visibility: "public" | "own-private" | "org-private";
  repoUrl: string | null;
  commitUrl: string | null;
};
```

**Caching:** Set response header `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` (5 min cache on CDN edge, 10 min stale-while-revalidate).

**Error handling:** If GitHub API fails, return `{ commits: [], error: "GitHub API unavailable" }` with status 200 (graceful degradation, not 500).

Do NOT import from `lib/social-links.ts` -- hardcode the username in the route to avoid pulling client module into server context. Add a comment noting it matches SOCIAL_LINKS.github.username.
</action>
<verify>
Run `npx next build` to confirm the route compiles without errors. Then run `curl http://localhost:3000/api/github` (after `npm run dev`) and confirm:

1. Response is JSON with `{ commits: [...] }` array
2. Each commit has all RedactedCommit fields
3. Without GITHUB_TOKEN set, returns public commits only (all visibility: "public")
   </verify>
   <done>API route exists at /api/github, returns up to 3 commits with correct redaction tiers, private data never appears in response for redacted items, graceful fallback when no token.</done>
   </task>

<task type="auto">
  <name>Task 2: Redesign github-activity.tsx as commit-focused widget with redaction visuals</name>
  <files>components/github-activity.tsx</files>
  <action>
Rewrite `components/github-activity.tsx` to consume the new `/api/github` endpoint and display exactly 3 commits with classified-document redaction styling.

**Data fetching changes:**

- Remove the direct GitHub API fetch. Instead fetch from `/api/github`.
- Import the `RedactedCommit` type from `@/app/api/github/route` (or redefine locally if import causes issues with "use client" -- in that case, duplicate the type with a comment referencing the source).
- Keep the client-side module-level cache (Map pattern) but update it to cache `RedactedCommit[]` with 5-min TTL.
- The component still accepts `username` prop (used for the "View Profile" link at bottom) but no longer uses it for fetching.

**Layout redesign -- show 3 commits as primary content:**
Remove the split "Latest Push" + "Recent Activity" layout. Replace with a single list of 3 commits, each as a distinct row/card. The first commit can be slightly more prominent (larger text) but all three are first-class items.

Each commit row shows:

1. **Visibility indicator** (left side):
   - Public: `Globe` icon in white/40
   - Own-private: `Lock` icon in orange-500
   - Org-private: `Lock` icon in orange-500 with a small `ShieldAlert` or double-lock feel

2. **Commit message** (main content):
   - Public/own-private: Display the message in white, `font-mono text-sm`, truncated to ~60 chars with ellipsis
   - Org-private: Display "[CLASSIFIED]" with redaction effect (see below)

3. **Repo name** (secondary):
   - Public: Clickable link in `text-orange-500 hover:text-orange-400`, shows short repo name, links to repo
   - Own-private / org-private: Show "[REDACTED]" with redaction effect

4. **Timestamp** (right side): Use the existing `formatTimeAgo` function. `text-white/30 font-mono text-xs`.

5. **Commit SHA** (subtle): Show first 7 chars of SHA in `text-white/20 font-mono text-[10px]`. For public commits, link to the commit on GitHub.

**Redaction visual effect** (the "classified document" aesthetic):
Create a reusable `<Redacted>` inline component (defined in the same file) that renders redacted text with these styles:

- Background: `bg-orange-500/20` with `px-2 py-0.5 inline-block`
- Text: `text-orange-500/60 font-mono text-xs uppercase tracking-wider`
- A subtle CSS animation: use Tailwind's `animate-pulse` at reduced opacity OR a custom shimmer. A simple approach: `relative overflow-hidden` with an `::after` pseudo-element (via Tailwind arbitrary) that creates a diagonal scan-line effect. If pseudo-element is too complex, just use `animate-pulse` with `bg-gradient-to-r from-orange-500/10 via-orange-500/25 to-orange-500/10`.
- The text content is the redacted label like "[REDACTED]" or "[CLASSIFIED]" -- visible but styled as obviously redacted.
- Add a subtle `border-l-2 border-orange-500` to give it a "highlight marker" feel.

**Keep existing elements:**

- Corner accent (orange square top-left)
- Header with GitHub icon + "GITHUB" title + "LIVE" badge
- "VIEW PROFILE" link at bottom
- Loading skeleton state (update to show 3 skeleton rows instead of 1)
- Error state

**Remove:**

- The old `GitHubEvent` type export (replace with `RedactedCommit`)
- The `getCommitMessage` helper (no longer needed, message comes pre-processed)
- Direct GitHub API URL construction

**Keep the `formatTimeAgo` function** -- it's still useful.

Ensure `GitHubActivityProps` still has `username` prop for the profile link.
</action>
<verify>
Run `npm run dev` and visually confirm:

1. Widget loads and shows 3 commit entries (or fewer if user has less activity)
2. Loading state shows 3 skeleton rows
3. Public commits show repo name as clickable link and full commit message
4. If any private commits appear (requires GITHUB_TOKEN), they show redaction effects
5. No TypeScript errors: `npx tsc --noEmit`
6. No raw private repo names or messages visible in browser Network tab response from `/api/github`
   </verify>
   <done>Widget displays exactly 3 commits from /api/github with correct redaction visuals per tier, loading/error states work, no private data leaks to browser, classified-document aesthetic matches the dark/orange/mono theme.</done>
   </task>

</tasks>

<verification>
1. `npx tsc --noEmit` -- no TypeScript errors across both files
2. `npm run build` -- production build succeeds
3. `curl localhost:3000/api/github | jq .` -- returns valid JSON with commits array, each having visibility field
4. Visual check: widget shows 3 commits in the Stack & Code section
5. Browser DevTools Network tab: `/api/github` response contains no private repo names or messages for redacted items
6. Without GITHUB_TOKEN env var: widget still works, showing public commits only
</verification>

<success_criteria>

- API route at /api/github returns up to 3 commits with server-side redaction
- Public commits: full info with links
- Own-private commits: message visible, repo name redacted
- Org-private commits: both message and repo name redacted
- Redacted items have classified-document visual treatment (orange tinted blocks, mono text)
- Network tab only shows pre-sanitized data
- Graceful fallback when GITHUB_TOKEN is not set
- No build errors
  </success_criteria>

<output>
After completion, create `.planning/quick/014-github-activity-last-3-commits-with-priv/014-SUMMARY.md`
</output>
