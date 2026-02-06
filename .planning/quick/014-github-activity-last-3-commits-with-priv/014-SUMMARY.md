---
phase: quick
plan: 014
subsystem: ui-components
completed: 2026-02-06
duration: 167s
tags: [github, api, privacy, redaction, next.js, route-handlers]

requires: [tech-and-code-section, github-activity-widget]
provides: [server-side-github-api, redacted-commit-feed, classified-document-ui]
affects: []

decisions:
  - id: server-side-redaction
    what: Apply redaction server-side before response
    why: Never expose private repo/commit data to browser
    alternatives: Client-side redaction (rejected - leaks data in network tab)

  - id: tiered-visibility
    what: Three visibility tiers (public, own-private, org-private)
    why: Different privacy needs - own repos show messages, org repos fully redacted
    alternatives: Binary public/private (rejected - too coarse)

  - id: classified-document-aesthetic
    what: Orange gradient + pulse animation for redacted items
    why: Matches dark/orange theme, makes redaction visually clear
    alternatives: Solid black bars (rejected - too harsh), blur effect (rejected - suggests hidden content)

key-files:
  created:
    - app/api/github/route.ts
  modified:
    - components/github-activity.tsx

tech-stack:
  added: []
  patterns:
    [
      next.js-route-handlers,
      server-side-data-sanitization,
      tiered-access-control,
    ]
---

# Quick Task 014: GitHub Activity - Last 3 Commits with Private Repo Support

**One-liner:** Server-side GitHub API route with tiered redaction shows last 3 commits including private repos (with PAT), applies classified-document visual treatment to sensitive data.

## What Was Built

Replaced the client-side GitHub activity widget with a commit-focused design backed by a server-side API route. The route authenticates with GitHub using a PAT (if provided) to access private repo events, applies three-tier redaction rules server-side, and returns exactly the last 3 commits. The frontend renders these with a classified-document aesthetic for redacted items.

**Key components:**

1. **Server-side API route** (`/api/github`):
   - Fetches from GitHub Events API (authenticated if `GITHUB_TOKEN` env var set)
   - Filters to `PushEvent` only, flattens commits
   - Applies tiered redaction:
     - **Public**: Full info (repo name, message, links)
     - **Own-private**: Message visible, repo name → `[REDACTED]`
     - **Org-private**: Both repo and message → `[REDACTED]` / `[CLASSIFIED]`
   - Returns up to 3 commits with pre-sanitized data
   - 5-minute CDN cache with stale-while-revalidate

2. **Redesigned widget** (`github-activity.tsx`):
   - Consumes `/api/github` endpoint (replaces direct GitHub API calls)
   - Shows 3 commits as first-class items (not "latest + recent" split)
   - Visibility indicators: `Globe` (public), `Lock` (own-private), `ShieldAlert` (org-private)
   - Redacted text uses `<Redacted>` component with orange gradient + pulse animation
   - First commit slightly larger to establish hierarchy
   - Loading state shows 3 skeleton rows
   - Maintains module-level cache (5-min TTL)

## Tasks Completed

| #   | Task                                                                         | Files                            | Commit  |
| --- | ---------------------------------------------------------------------------- | -------------------------------- | ------- |
| 1   | Create server-side GitHub API route with tiered redaction                    | `app/api/github/route.ts`        | 57e8fca |
| 2   | Redesign github-activity.tsx as commit-focused widget with redaction visuals | `components/github-activity.tsx` | 45bdec1 |

## Decisions Made

### 1. Server-Side Redaction

**Decision:** Apply all redaction logic server-side in the API route, before sending response to browser.

**Context:** Private repo names and commit messages are sensitive. Client-side redaction would still expose raw data in the browser's Network tab (visible in DevTools).

**Options considered:**

- **Server-side redaction** (chosen): API route fetches events, applies redaction, returns sanitized data. Browser never sees private info.
- Client-side redaction: Fetch raw events, redact in React component. Rejected - leaks data in network inspector.

**Impact:** Network tab shows only `[REDACTED]` / `[CLASSIFIED]` for sensitive fields. True privacy enforcement.

---

### 2. Three-Tier Visibility System

**Decision:** Distinguish between public, own-private, and org-private commits with different redaction rules.

**Context:**

- Public commits: Should show everything (transparency about open source work)
- Own private commits: Safe to show commit messages (user's own work), but repo names might be sensitive
- Org private commits: Both repo and commit details are sensitive (company/client work)

**Options considered:**

- **Three tiers** (chosen): public (full), own-private (message only), org-private (fully redacted)
- Binary public/private: Rejected - treats own repos same as org repos, unnecessarily hides useful info
- All private fully redacted: Rejected - too conservative, loses signal about personal projects

**Impact:** Users can see their own private commit activity without exposing which repos they're working on. Org work is fully classified.

---

### 3. Classified-Document Aesthetic

**Decision:** Use orange gradient background + border + pulse animation for redacted items, with visible `[REDACTED]` / `[CLASSIFIED]` text.

**Context:** Redacted items need to be obviously different from real data, while matching the portfolio's dark/orange/monospace brutalist theme.

**Options considered:**

- **Orange gradient + pulse** (chosen): `bg-gradient-to-r from-orange-500/10 via-orange-500/25 to-orange-500/10`, left border, animate-pulse
- Solid black bars: Rejected - too harsh, looks like censorship rather than intentional design
- Blur effect: Rejected - implies content is hidden underneath, misleading
- Dotted/dashed text: Rejected - harder to read, doesn't convey "classified" feel

**Impact:** Redacted items are visually striking, clearly intentional, and match the site's aesthetic. Users immediately understand these are private items.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All verification criteria met:

- ✅ `npx tsc --noEmit` - No TypeScript errors
- ✅ `npm run build` - Production build succeeds
- ✅ `curl localhost:3000/api/github | jq .` - Returns valid JSON with `commits` array
- ✅ Visual check: Widget displays correctly in Stack & Code section
- ✅ Browser Network tab: `/api/github` response contains no raw private data
- ✅ Without `GITHUB_TOKEN`: Widget works, returns empty commits array (graceful fallback)

## Key Implementation Details

### API Route Structure

```typescript
export type RedactedCommit = {
  id: string;
  repo: string; // "owner/repo" or "[REDACTED]"
  repoShort: string; // repo name or "[REDACTED]"
  message: string; // commit message or "[CLASSIFIED]"
  sha: string; // full sha or 7-char
  timestamp: string;
  visibility: "public" | "own-private" | "org-private";
  repoUrl: string | null;
  commitUrl: string | null;
};
```

**Redaction logic:**

```typescript
if (event.public) {
  // Public: show everything
} else if (event.repo.name.startsWith(`${username}/`)) {
  // Own-private: show message, redact repo
} else {
  // Org-private: redact everything
}
```

### Redacted Component

```tsx
function Redacted({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2 py-0.5 bg-gradient-to-r from-orange-500/10 via-orange-500/25 to-orange-500/10 border-l-2 border-orange-500 overflow-hidden animate-pulse">
      <span className="text-orange-500/60 font-mono text-xs uppercase tracking-wider">
        {children}
      </span>
    </span>
  );
}
```

Renders `[REDACTED]` and `[CLASSIFIED]` with orange tinted, pulsing background.

### Layout Changes

**Before:** Split layout - "Latest Push" (large) + "Recent Activity" (3 small rows)

**After:** Unified layout - 3 commits all first-class:

- First commit: Larger text (16-18px), bottom border separator
- Commits 2-3: Standard size (14px)
- Each shows: Icon + Message + Timestamp (top row), Repo + SHA (bottom row)

## Performance Impact

- **API caching:** 5-minute edge cache reduces GitHub API calls
- **Client caching:** Module-level Map cache (5-min TTL) prevents redundant fetches
- **Bundle size:** Minimal - replaced `GitHubEvent` type with `RedactedCommit`, same dependencies

## Next Phase Readiness

**Blockers:** None

**Recommended improvements:**

1. Set `GITHUB_TOKEN` environment variable to enable private repo activity
2. Consider rate limit monitoring if traffic increases
3. Add "last updated" timestamp to widget footer

**Dependencies for other work:** None - self-contained feature

## Notes

- Deprecation warning on `Github` icon from lucide-react is cosmetic (no functional impact)
- GitHub Events API returns events in reverse chronological order (newest first)
- Empty commits array is normal when: no recent push events, rate limited, or user has no public activity
- Private repo commits only appear if `GITHUB_TOKEN` env var is set with `repo` scope
- The route hardcodes username `abdulmannan1998` (matches `SOCIAL_LINKS.github.username`) to avoid importing client module into server context

## Related Files

- `components/sections/tech-and-code-section.tsx` - Renders the GitHub widget in the Stack & Code section
- `lib/social-links.ts` - Contains GitHub username constant
- `.env.local` - Should contain `GITHUB_TOKEN=ghp_...` (not committed) for private repo access
