# Quick Task 006: Move Contact Links to Sticky Nav

## Changes

- **Brand rename**: Changed top-left nav text from "MANNAN" to "PORTFOLIO"
- **Contact links relocated**: Moved GitHub, LinkedIn, Email icon links from hero section to fixed top-right nav bar
- **Persistent visibility**: Contact links now accessible at every scroll position alongside Labs button
- **Hero cleanup**: Removed social links block from hero section (name, title, and scroll indicator remain)

## Files Modified

| File           | Change                                                              |
| -------------- | ------------------------------------------------------------------- |
| `app/page.tsx` | Renamed brand, added social icons to nav, removed hero social links |

## Verification

- Build passes (`npx next build` - clean)
- Lint/format passes (lint-staged hook)
- Nav shows PORTFOLIO top-left, contact icons + Labs top-right
- Hero section retains giant name, title, scroll indicator

## Commit

- `e409854` - feat(quick-006): move contact links to sticky nav and rename to PORTFOLIO
