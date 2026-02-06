---
phase: quick
plan: 006
type: execute
wave: 1
depends_on: []
files_modified:
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "Top-left nav text reads PORTFOLIO instead of MANNAN"
    - "GitHub, LinkedIn, and Email links are visible in the top-right sticky nav at every scroll position"
    - "Social links are no longer rendered in the hero section"
    - "Labs button remains in top-right nav alongside the new social links"
  artifacts:
    - path: "app/page.tsx"
      provides: "Updated nav with social links, renamed brand text"
      contains: "PORTFOLIO"
  key_links:
    - from: "app/page.tsx nav"
      to: "SOCIAL_LINKS constant"
      via: "import from @/lib/social-links"
      pattern: "SOCIAL_LINKS\\.(github|linkedin|email)"
---

<objective>
Move contact links (GitHub, LinkedIn, Email) from the hero section into the fixed top-right nav, and rename the top-left brand text from "MANNAN" to "PORTFOLIO".

Purpose: Make contact links persistently accessible at every scroll position instead of only visible in the hero. Update branding text.
Output: Modified app/page.tsx with relocated social links and updated brand text.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/page.tsx
@lib/social-links.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Relocate social links to nav and rename brand text</name>
  <files>app/page.tsx</files>
  <action>
  Three changes in app/page.tsx:

1. **Rename brand text (line 63):** Change `MANNAN` to `PORTFOLIO` in the nav Link span.

2. **Add social links to top-right nav (lines 66-78):** Inside the existing `<div className="flex items-center gap-6">` that wraps the Labs button, add GitHub, LinkedIn, and Email icon links BEFORE the Labs button. Use icon-only links (no text labels) to keep the nav compact. Each link should use the same icon components already imported (Github, Linkedin, Mail from lucide-react) at h-4 w-4 size. Style them as `text-white hover:text-orange-500 transition-colors`. Use SOCIAL_LINKS constants for URLs. GitHub and LinkedIn get `target="_blank" rel="noopener noreferrer"`. Email uses `SOCIAL_LINKS.email.mailto` as href.

The nav right-side structure should be:

```
<div className="flex items-center gap-4">
  <a href={SOCIAL_LINKS.github.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors" aria-label="GitHub">
    <Github className="h-4 w-4" />
  </a>
  <a href={SOCIAL_LINKS.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors" aria-label="LinkedIn">
    <Linkedin className="h-4 w-4" />
  </a>
  <a href={SOCIAL_LINKS.email.mailto} className="text-white hover:text-orange-500 transition-colors" aria-label="Email">
    <Mail className="h-4 w-4" />
  </a>
  {/* Labs Button with SOON badge - keep existing */}
  <Link href="/labs" ...>...</Link>
</div>
```

Note: Change the gap on the wrapper div from `gap-6` to `gap-4` for tighter spacing with the additional icons.

3. **Remove hero social links (lines 119-151):** Delete the entire `<motion.div>` block containing the three social links in the hero section (the one with `className="mt-12 flex items-center gap-8"`). This removes the GitHub, LinkedIn, and Email links from the hero since they now live in the nav.

Do NOT remove the `Github`, `Linkedin`, `Mail` imports from lucide-react -- they are still used in the nav and in the footer sections below.
</action>
<verify>
Run `npx next build` to confirm no build errors. Then visually confirm:

- `grep "PORTFOLIO" app/page.tsx` returns the nav brand text
- `grep -c "SOCIAL_LINKS.github.url" app/page.tsx` shows the GitHub link still exists (in nav + footer sections)
- The hero section no longer contains `mt-12 flex items-center gap-8` social links block
  </verify>
  <done>
- Nav top-left reads "PORTFOLIO"
- Nav top-right shows GitHub, LinkedIn, Email icons alongside Labs button
- Hero section no longer has social links
- Build succeeds with no errors
  </done>
  </task>

</tasks>

<verification>
- `npx next build` completes without errors
- Brand text in nav is "PORTFOLIO" not "MANNAN"
- Social link icons appear in the fixed nav (visible at all scroll positions)
- Hero section retains name, title, and scroll indicator but no social links
- Footer/CTA sections with GitHub and LinkedIn CTAs remain untouched
</verification>

<success_criteria>

- Nav displays "PORTFOLIO" brand text top-left
- GitHub, LinkedIn, Email icon links in top-right nav alongside Labs button
- Social links removed from hero section
- All existing footer social CTAs unchanged
- Build passes cleanly
  </success_criteria>

<output>
After completion, create `.planning/quick/006-move-contact-links-to-sticky-top-right-a/006-SUMMARY.md`
</output>
