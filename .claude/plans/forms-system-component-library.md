# Plan: @sonarmd/ui Forms System

Status: draft
Date: 2026-06-08
Owner: avespoli
Repo: sonarmd/sonarmd-ui (@sonarmd/ui)
Stack: React 18, TypeScript 5.6, Vite 6 (lib mode, ESM+UMD+dts), Vitest 4, CSS Modules, design tokens in src/sonarmd-tokens.ts

## Goal

A production form SYSTEM layered on top of the existing 42 components. Not new
inputs - the orchestration: headless state, validation, error handling, layout,
motion, and accessibility. Targets: beat MUI and Bootstrap on >= 9/10 of
performance, UX, and ease-of-implementation; WCAG 2.2 AA + Section 508; zero
data-layer coupling; brand-native; tree-shakeable.

## Success criteria (measurable)

1. Time-to-first-render and INP for a standard 20-field form beat MUI and
   Bootstrap on a fixed benchmark harness (median of N runs, throttled CPU).
2. Form-core runtime adds <= ~5KB min+gzip and ZERO required runtime deps.
3. Typing a character in one field triggers re-render of THAT field only
   (measured render count), never the whole form.
4. axe-core: zero violations on every component and on 6 canonical example forms.
5. Full keyboard operation; visible focus; submit-fail moves focus to an
   aria-live error summary that deep-links to fields.
6. SSR-safe (no hydration warnings) and prefers-reduced-motion honored.
7. DX: a working 5-field validated form in <= 25 lines, fully typed, no casts.

## Non-goals / hard constraints

- NO data layer. The library never fetches. onSubmit(values) returns a promise;
  server errors are injected via form.setErrors(). Telemetry only via optional
  callbacks.
- NO global state, NO required third-party state/form/validation lib. Validation
  adapters (zod/valibot/yup) are OPTIONAL peer integrations, never bundled.
- Stateless where possible: uncontrolled-first inputs; state lives in a small
  per-form store, not React context re-render churn.
- Do not fork or rewrite the existing 42 components. Bind to them through an
  adapter layer + FieldWrapper. Changes to existing components only if strictly
  required, additive, and documented.

## Architecture

### 1. Headless form core (the perf engine)
- `useForm<TValues>(opts)` returns a stable controller: register/field, handle
  submit, getValues, setValue, setErrors, reset, subscribe.
- State held in a tiny external store; components subscribe per-field via
  `useSyncExternalStore`. This is the key to criterion #3 (field-local
  re-renders, no form-wide re-render on keystroke).
- Uncontrolled-first: inputs use defaultValue + ref reads; controlled mode
  available where a component requires it (DatePicker, MultiSelect).
- `<Form>` is a thin provider that wires submit + the store; `<Field name>`
  (render-prop + typed) binds a registered field to any existing component.

### 2. Binding contract to existing components
- The existing field components already accept value/defaultValue, onChange,
  name, error, disabled, required. Define a `FieldControl` adapter mapping
  register(name) -> the props each component expects, wrapped in FieldWrapper
  (which already renders label/hint/error with role="alert" and id wiring).
- Adapters ship for: TextInput, TextArea, Select, Checkbox, CheckboxGroup,
  Radio, RadioGroup, Toggle, Dropdown, Typeahead, MultiSelect, DatePicker,
  DateRangePicker. Zero changes to those components targeted.

### 3. Validation layer
- A thin `Validator<TValues>` interface: validateField, validateForm, returns a
  normalized error map. Schema-agnostic.
- Ship: native validators (required, min/max, pattern, email, custom) and thin
  resolvers for zod / valibot / yup (peer-optional). One adapter == one file.
- Sync + async (debounced), field-level + form-level + cross-field. Server
  errors merged via setErrors. Validation timing configurable
  (onSubmit/onBlur/onChange) per form and per field.

### 4. Error boundary layer
- `<FormErrorBoundary>` wraps a form: catches render/runtime errors, renders a
  branded fallback, exposes onError callback (no data layer).
- `<FieldErrorBoundary>` optional, isolates a single field subtree.
- `<FormErrorSummary>`: aria-live region listing validation errors with links
  that focus the offending field; shown on submit-fail.

### 5. Layout system
- `<FormGrid>` (CSS grid, responsive column counts from tokens), `<FormRow>`,
  `<FormSection>` (renders fieldset/legend for grouping + a11y), `<FormActions>`
  (submit/cancel zone with sticky option). All token-driven spacing.

### 6. Motion + feedback primitives (modular, reusable)
- CSS-only (keyframes + token durations/easings), prefers-reduced-motion aware,
  no JS animation dependency: `<Fade>`, `<Collapse>`, `<Stagger>`, `<SlideIn>`.
- Reuse existing `LoadingSpinner` and `Skeleton`; add motion tokens to
  sonarmd-tokens.ts (duration-fast/base/slow, ease-standard/emphasized).
- Submit lifecycle: idle -> validating -> submitting (spinner) -> success/error
  with branded transitions.

### 7. Branding / theming
- Consume sonarmd-tokens.ts via CSS custom properties; semantic colors already
  present (primary #393AF3, positive/negative/warning, text-*, bg-*). Dark mode
  via CSS variables. Focus ring + error styling from tokens for AA contrast.

### 8. Accessibility / compliance (WCAG 2.2 AA, 508)
- Label association (FieldWrapper htmlFor), aria-invalid, aria-describedby
  chaining hint+error, required semantics, fieldset/legend grouping,
  autocomplete tokens (relevant for intake forms), focus management on submit,
  aria-live error summary, keyboard-complete, visible focus, reduced motion,
  RTL-ready, contrast verified against tokens. axe in CI.

## Public API surface (initial)
useForm, Form, Field, FieldArray (dynamic lists), FormGrid, FormRow,
FormSection, FormActions, FormErrorBoundary, FieldErrorBoundary,
FormErrorSummary, validators (native), resolvers (zod/valibot/yup),
Fade, Collapse, Stagger, SlideIn. All named exports + exported types,
added to src/index.ts barrel; tree-shakeable.

## Performance strategy
- Zero required runtime deps for core; CSS modules (existing pattern).
- useSyncExternalStore field subscriptions; memoized field prop objects.
- Uncontrolled inputs; batched store writes; lazy/debounced validation.
- SSR-safe; no layout thrash; code-splittable adapters/resolvers.
- Benchmark harness: a fixed 20-field form built in @sonarmd/ui vs MUI vs
  Bootstrap; measure TTFR, INP, bundle delta, re-render counts under CPU
  throttle; record results in the repo.

## Testing / quality gates
- Unit (Vitest + Testing Library), snapshot parity with existing convention,
  axe-core a11y per component + per example, perf bench, SSR smoke,
  reduced-motion + keyboard tests. Honor the existing 14-rule perf addendum.

## Canonical examples (DX proof, also test fixtures)
login, patient-intake (healthcare, autocomplete + grouping), multi-step wizard,
dynamic field array (add/remove rows), async-validated (debounced uniqueness),
server-error injection. Each <= target LOC, fully typed.

## Phasing
- P0 Contract lock: headless core API + binding contract + Validator interface +
  perf budget + a11y checklist + file layout. Reviewed before any build.
- P1 Build (parallel): core, validation, error layer, layout, motion, adapters.
- P2 Verify (adversarial): axe, perf bench vs MUI/Bootstrap, DX examples,
  senior review + break-it pass.
- P3 Synthesize: integrate, fix findings, barrel, docs/examples, one draft PR.

## Risks
- Re-render isolation regressions (mitigate: render-count tests as a gate).
- Controlled components (DatePicker/MultiSelect) needing controlled mode in an
  uncontrolled-first core (mitigate: hybrid binding in the adapter).
- Bench fairness vs MUI/Bootstrap (mitigate: identical form spec, public harness).
- Token motion additions touching shared tokens file (coordinate, additive only).

## Component pattern - FOLLOW TO THE TEE (extracted from existing code)

Every new component MUST match this exactly:

- Layout: `src/components/<Name>/index.tsx` + `src/components/<Name>/<Name>.module.css`.
  Component lives in `index.tsx`. No per-component test file.
- TSX shape:
  - `export interface <Name>Props extends Omit<React.XHTMLAttributes<El>, '...'> {}`
    (extend the native element props; omit only what you redefine, e.g. `size`).
  - `export const <Name> = React.memo(React.forwardRef<El, Props>(function <Name>(props, ref) {...}));`
  - `<Name>.displayName = '<Name>';`
  - Memoize EVERY derived value with `useMemo`: ids, aria-describedby, className
    strings. Class composition: `[styles.a, cond ? styles.b : ''].filter(Boolean).join(' ')`.
  - id derivation: `id ?? (name ? \`input-${name}\` : undefined)`.
  - a11y inline: `aria-invalid`, `aria-describedby` (error wins over hint),
    `required`; wrap field controls in `FieldWrapper`.
- CSS module: style ONLY via `--smd-*` CSS custom properties (never hardcode hex,
  never import the TS tokens into CSS). Use `--smd-duration-*` + `--smd-ease-*`
  for transitions; focus via `--smd-shadow-focus`; error via
  `[aria-invalid='true']` + `--smd-border-error`; spacing via `--smd-space-*`.
- Barrel: add `export {X} from './components/X';` and
  `export type {XProps} from './components/X';` to `src/index.ts`.
- Tests: extend `src/__tests__/snapshots.test.tsx` (render with minimal valid
  props; echarts + react-window already mocked; wrap in MemoryRouter).
- Perf addendum (inferred, treat as law): memo + forwardRef on every component;
  no unmemoized objects/arrays/callbacks in render; CSS-var transitions only
  (no JS animation lib); displayName set.

## Consolidation landscape (the real "one-off" problem)

Three diverging surfaces exist today:

1. `@sonarmd/shared` (in `~/code/frontend/shared`) - OLD web lib, SCSS modules,
   has `Form/Button/Spinner/Text/Box/Link/Survey`. This is what the web apps
   (admin/provider/patient/seat) actually use today.
2. `@sonarmd/ui` (this repo) - NEW web lib, CSS modules + `--smd-*` tokens, 42
   components. NOT yet imported by any web app (grep found zero).
3. `frontend-patient-app` - React Native / Expo (RN 0.81, react-native-web
   0.21). Its own `components/forms`, `components/survey`. No DOM; CSS-module
   components cannot run here, but TOKENS can, and react-native-web gives a
   bridge option.

Consolidation strategy this implies:
- Make `@sonarmd/ui` the single canonical WEB system. The new Forms System is
  designed to SUPERSEDE `@sonarmd/shared`'s `Form` and be the migration target
  for admin/provider/patient/seat. Match `@sonarmd/shared`'s real form use-cases
  (incl. `Survey`) so migration is mechanical.
- Extract tokens as the cross-platform contract: `--smd-*` CSS vars for web,
  the same values exported for RN (StyleSheet/react-native-web) so the patient
  mobile app shares palette/spacing/type/motion without sharing DOM components.
- RN component parity (if wanted) is a SEPARATE track that consumes shared
  tokens; it is not the DOM forms library.

## Open decisions (need a call before/at P0)
1. Scope now: WEB-only (build in @sonarmd/ui, plan migration off @sonarmd/shared)
   with tokens shared to RN later - or also build RN form parity in this effort?
2. Migration stance: is the Forms System a drop-in replacement for the
   @sonarmd/shared `Form` (API-compatible shim) or a clean new API with a codemod?
3. Default validation adapter shipped in examples: native-only, or zod?
4. FieldArray API shape (index-keyed vs id-keyed rows).
5. Dark mode now or token-ready-but-later.
6. Resolvers in-package (optional subpath exports) vs a separate docs recipe.
