---
phase: quick
plan: 002
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/social-links.ts
  - app/page.tsx
  - public/llms.txt
autonomous: true

must_haves:
  truths:
    - "All social links derive from single source of truth"
    - "Changing a URL in constants updates all usages"
    - "No hardcoded social URLs remain in components"
  artifacts:
    - path: "lib/social-links.ts"
      provides: "Social link constants"
      exports: ["SOCIAL_LINKS"]
  key_links:
    - from: "app/page.tsx"
      to: "lib/social-links.ts"
      via: "import SOCIAL_LINKS"
      pattern: "import.*SOCIAL_LINKS.*from"
---

<objective>
Centralize all social links (GitHub, LinkedIn, email) into a single constants file.

Purpose: Eliminate inconsistencies between hardcoded URLs and enable easy updates from one location.
Output: `lib/social-links.ts` constants file with all components updated to use it.
</objective>

<context>
@.planning/STATE.md (v1.1 complete, quick maintenance task)

Current state analysis:

- app/page.tsx has 6 hardcoded social links (3 GitHub, 2 LinkedIn, 2 email)
- public/llms.txt has 2 hardcoded social links
- components/github-activity.tsx receives username as prop
- INCONSISTENCY: GitHub is "sunnyimmortal" in page.tsx but "mannanabdul" in llms.txt
- lib/ directory exists with utils, stores, etc. - no constants/ subdirectory
  </context>

<tasks>

<task type="auto">
  <name>Task 1: Create social links constants file</name>
  <files>lib/social-links.ts</files>
  <action>
Create `lib/social-links.ts` with typed constants:

```typescript
export const SOCIAL_LINKS = {
  github: {
    url: "https://github.com/USERNAME",
    username: "USERNAME",
  },
  linkedin: {
    url: "https://linkedin.com/in/USERNAME",
  },
  email: {
    address: "email@example.com",
    mailto: "mailto:email@example.com",
  },
} as const;

export type SocialLinks = typeof SOCIAL_LINKS;
```

Use placeholder values (USERNAME, email@example.com) - user will update with correct values.
</action>
<verify>`cat lib/social-links.ts` shows file exists with SOCIAL_LINKS export</verify>
<done>Constants file created with typed structure and placeholder values</done>
</task>

<task type="auto">
  <name>Task 2: Update app/page.tsx to use constants</name>
  <files>app/page.tsx</files>
  <action>
1. Add import at top: `import { SOCIAL_LINKS } from "@/lib/social-links";`

2. Replace all hardcoded URLs:
   - Line 126: `href="https://github.com/sunnyimmortal"` -> `href={SOCIAL_LINKS.github.url}`
   - Line 135: `href="https://linkedin.com/in/mannanabdul"` -> `href={SOCIAL_LINKS.linkedin.url}`
   - Line 144: `href="mailto:abdul.1998.17@gmail.com"` -> `href={SOCIAL_LINKS.email.mailto}`
   - Line 304: `username="sunnyimmortal"` -> `username={SOCIAL_LINKS.github.username}`
   - Line 310: GitHub href -> `href={SOCIAL_LINKS.github.url}`
   - Line 330: LinkedIn href -> `href={SOCIAL_LINKS.linkedin.url}`
   - Line 362: Email href -> `href={SOCIAL_LINKS.email.mailto}`
   - Line 368: GitHub href -> `href={SOCIAL_LINKS.github.url}`

Verify no hardcoded github.com, linkedin.com, or mailto: strings remain in social link contexts.
</action>
<verify>`grep -E "github.com/|linkedin.com/in/|mailto:" app/page.tsx` returns no matches</verify>
<done>All social links in page.tsx derive from SOCIAL_LINKS constant</done>
</task>

<task type="auto">
  <name>Task 3: Update public/llms.txt to use consistent values</name>
  <files>public/llms.txt</files>
  <action>
Update lines 65-66 in public/llms.txt to use placeholder values matching the constants file:

```
- GitHub: https://github.com/USERNAME
- LinkedIn: https://linkedin.com/in/USERNAME
```

Note: llms.txt is static text, not code - cannot import from constants.
Add a comment or note that these should be kept in sync with lib/social-links.ts.
</action>
<verify>`grep -E "GitHub:|LinkedIn:" public/llms.txt` shows placeholder values</verify>
<done>llms.txt uses consistent placeholder values with sync note</done>
</task>

</tasks>

<verification>
1. `npm run build` completes without errors
2. `grep -rE "github.com/sunnyimmortal|linkedin.com/in/mannanabdul|abdul.1998.17@gmail.com" app/ components/` returns no matches
3. `cat lib/social-links.ts` shows constants file with placeholder values
</verification>

<success_criteria>

- Single source of truth exists at lib/social-links.ts
- app/page.tsx imports and uses SOCIAL_LINKS for all social URLs
- No hardcoded social URLs remain in component code
- Build passes successfully
- User can update placeholder values in one location to fix all links
  </success_criteria>

<output>
After completion, create `.planning/quick/002-centralize-social-links-to-constants-fil/002-SUMMARY.md`
</output>
