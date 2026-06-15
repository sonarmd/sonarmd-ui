# MultiSelect: fix nested-interactive (combobox ARIA refactor)

## Problem
`src/components/MultiSelect/index.tsx` trigger is a `<div role="button" tabIndex=0>`
that contains interactive descendants (per-chip Remove buttons, Clear all button).
Interactive controls nested inside an element with an interactive role is an axe
`nested-interactive` violation. `MultiSelect.fixtures.tsx` currently masks it with
`skipAxe: ['nested-interactive']`.

## Fix (WAI-ARIA combobox pattern)
Make the chips/clear remove buttons siblings of the focusable trigger, not
descendants of it.

- Outer container becomes a plain `<div>` (no role, no tabIndex, no aria-*). It
  keeps `ref`, the visual `triggerArea` classes, and `onClick` to open. A plain
  div with onClick is not flagged by `nested-interactive`.
- Chips (with their Remove buttons), the placeholder, and the search input live
  directly inside that non-interactive container.
- The focusable combobox control:
  - searchable: the existing `<input>` gets `role="combobox"`, `id={wrapperId}`,
    `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-required`,
    `aria-invalid`, `aria-label` (when no visible label), `onKeyDown`.
  - non-searchable: a dedicated `<button>` (chevron inside) carries
    `id={wrapperId}`, `aria-haspopup="listbox"`, `aria-expanded`,
    `aria-controls`, `aria-invalid`, `aria-label` (when no label), `onKeyDown`.
- Accessible name: when a visible `label` exists, `<label htmlFor={wrapperId}>`
  names the control; otherwise fall back to `aria-label={placeholder}` so the
  label-less case (selections fixture) still passes `button-name` / input-name.
- `aria-controls` only set while open (listbox only exists while open; otherwise
  it would dangle and trip `aria-valid-attr-value`). Menu `role=listbox` gets
  `id={wrapperId}-listbox`.
- Focus on open: searchable -> focus search input (existing); non-searchable ->
  focus the trigger button, so keyboard nav works after click-to-open.
- Default placeholder `'Select...'` (ASCII) - the default now surfaces in an
  aria-label/snapshot, and ASCII LAW forbids the pre-existing ellipsis in changed
  output.

## Verify
- Remove `skipAxe: ['nested-interactive']` from MultiSelect.fixtures.tsx.
- `npx vitest run src/testing/fixtures.test.tsx -t "MultiSelect"` (axe per fixture).
- Update snapshots (-u) with one-line justification; typecheck; full test; build.
