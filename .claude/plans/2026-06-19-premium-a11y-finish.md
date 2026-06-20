# Premium-tier + full-a11y finish-out (2026-06-19)

State: V1_SPEC fully implemented and merged to `main` on React 19. 267 tests green,
typecheck/build/size clean. This plan drives the library from "spec-complete" to
"premium-tier, fully accessible, fully equipped" - the gap between a passing audit
and a library indistinguishable from Radix/Mantine/MUI.

Mandate (verbatim): production-ready, fully functional, fully accessible (a11y),
indistinguishable from a premium-tier fully equipped React component library.

## Method

Verified each finding against real code before listing it (subagent audits were
checked, not trusted). Each phase: implement -> fixtures + behavioral tests ->
typecheck + `npm test` + build + size + ASCII sweep -> signed commit. One draft
PR per coherent workstream when 100% complete (no PR babysitting).

## Phase 1 - Accessibility hardening (existing components) [PRIORITY]

Verified defects (file refs):

1. Dropdown (`src/components/Dropdown/index.tsx`): listbox has no `id`, options
   have no stable `id`, trigger button has `aria-haspopup`/`aria-expanded` but no
   `aria-controls` and no `aria-activedescendant`. Arrow-key nav updates a visual
   highlight only - silent to screen readers. Fix: mirror the MultiSelect
   combobox completion already shipped (listbox id, `${id}-opt-${i}` option ids,
   `aria-controls` while open, `aria-activedescendant` while open + active).

2. Typeahead (`src/components/Typeahead/index.tsx`): `role="combobox"` with
   `aria-expanded`/`aria-autocomplete` but no `aria-controls`, no
   `aria-activedescendant`, listbox + options have no ids. Same fix.

3. Modal (`src/components/Modal/index.tsx`): hard-coded `id="modal-title"` and
   `aria-labelledby="modal-title"` - collides if two dialogs mount; replace with
   `useId()`. Dialog has NO accessible name when `title` is absent - add an
   `aria-label` prop fallback. Background not inert - add `inert`/`aria-hidden`
   on siblings while open (premium screen-reader containment), restored on close.

4. Tabs (`src/components/Tabs/index.tsx`): tabs have no `id` and no
   `aria-controls` to their panel; consumer panels cannot be linked. Add optional
   per-tab `id`/`panelId` so a panel can be wired (backward compatible: omitted =
   current behavior). Expose tab `id` for `aria-labelledby` on the panel.

5. DatePicker + DateRangePicker calendar grids: day cells lack grid semantics.
   Add `role="grid"` + `role="row"`/`role="gridcell"` (or roving-tabindex grid
   pattern), month/year title as a heading, `aria-label` on the grid.

6. Reduced motion (central): 17 component CSS files animate; only 7 honor
   `prefers-reduced-motion`. Add ONE central safety net in `buildTokensCss()`
   output (tokens.css, consumed by every app) scoped to library classes
   (`[class*="smd-"]`) that neutralizes animation/transition under reduced motion.
   Matches the codebase's "handle centrally, no repeated boilerplate" philosophy
   and S4.4. Verify tokens.test.ts still parses.

Each fix gets behavioral test coverage where the declarative harness cannot reach
(menus render closed), following the `MultiSelect.test.tsx` precedent.

## Phase 2 - Missing premium primitives (small, high reuse)

Net-new components, each: `index.tsx` + `.module.css` + `.fixtures.tsx`, tokens
only, forwardRef on DOM nodes, JSDoc on prop interfaces, barrel + subpath export,
axe-clean. Build only genuinely-missing, genuinely-expected primitives (no overlap
with existing). Order by value/effort:

- VisuallyHidden (utility; underpins skip links + SR-only labels)
- Separator / Divider (horizontal/vertical, semantic `role="separator"`)
- Avatar (initials + image + fallback, status dot, sizes)
- Progress (determinate linear bar, `role="progressbar"`, indeterminate variant)
- Accordion (single/multi, WAI-ARIA disclosure, keyboard, animated height via WAAPI)
- Pagination (page + cursor modes; pairs with DataTable / usePaginatedQuery)

Skip (already covered): Switch=Toggle, Tag=Badge, Spinner=LoadingSpinner,
Skeleton exists, Tooltip exists, Dropdown/Select/Typeahead/MultiSelect exist.

## Phase 3 - Floating UI primitives (medium) [only if Phase 1-2 land clean]

- Popover (interactive floating content; generalizes Tooltip positioning)
- Drawer (slide-in side panel; overlay pattern; focus trap reused from Modal)

## Gates per commit

typecheck 0 / `npm test` all green (note token-path EPERM sandbox artifacts per
global rule) / build clean / `npm run size` within budget / ASCII sweep
`tr -cd '\11\12\15\40-\176'` = no diff on changed files.

## PR strategy

Phase 1 = one draft PR (a11y hardening, coherent unit). Phase 2 = one draft PR
(new primitives). Phase 3 = one draft PR. Work on branches; open each PR only when
its phase is 100% complete and green. Base = `main` (CLAUDE.md commit-style).

## Order

Phase 1 fully -> green -> draft PR. Then Phase 2. Then Phase 3 if warranted.
