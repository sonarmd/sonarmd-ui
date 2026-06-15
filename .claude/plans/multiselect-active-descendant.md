# MultiSelect: complete the combobox pattern (active-descendant)

## Why
The nested-interactive refactor made the trigger a real combobox/button, but the
listbox is still not programmatically linked to the active option. Arrow-key
navigation only changes a visual `optionHighlighted` class - a screen reader
announces nothing as the user moves through options. The WAI-ARIA combobox
pattern requires `aria-activedescendant` on the focusable control pointing at the
id of the currently-active `role="option"`.

## Changes (src/components/MultiSelect/index.tsx)
1. Stable option id helper: `optionId(index) = `${listboxId}-opt-${index}``.
2. Add `id={optionId(index)}` to every rendered option - both the virtualized
   `OptionRow` and the non-virtual `.map` branch.
3. Add `aria-activedescendant` to the shared `triggerAria` object, set only while
   open and `activeIndex >= 0`: `optionId(activeIndex)`. Applies to both the
   searchable `<input role="combobox">` and the non-searchable toggle `<button>`.
4. Scroll the active option into view on `activeIndex` change while open
   (non-virtual path): query the option element by id inside `menuRef` and call
   `scrollIntoView({block: 'nearest'})`. Safe no-op when the element is not in
   the DOM (e.g. an off-screen virtualized row), so it never throws.

## Tests
- `src/components/MultiSelect/MultiSelect.test.tsx`: behavioral coverage the
  declarative harness can't reach (it renders closed). Open the menu, assert the
  control gains `aria-activedescendant` matching the option id after ArrowDown,
  and that Enter toggles selection. Follows the `useForm.test.tsx` precedent.

## Constraints
- No new runtime deps. CSS/tokens unchanged. ASCII only.
- Fixtures render closed, so no snapshot churn and axe stays green.

## Verify
typecheck; full `vitest run`; build.
