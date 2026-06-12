# @sonarmd/ui

React component library + design system for SonarMD (HIPAA/SOC2 healthcare). The complete delivery contract is **V1_SPEC.md**. Read it before writing any code. PRODUCTION_READINESS_PLAN.md is the audit record behind it.

## Prime directive

Work autonomously. Do not ask the user questions. Every architectural decision is already made in V1_SPEC.md or the Resolved Decisions below. If you hit something genuinely unspecified, decide it yourself using this priority order and record the decision in IMPLEMENTATION_STATUS.md:

1. Security and PHI safety
2. Minimization and tree-shakeability (zero runtime deps, budgets are law)
3. DX and UX (drop-in import, a handful of props, it just works)
4. Everything else

## Hard guardrails (violating any of these is a defect)

- Zero new runtime dependencies. echarts is a peerDependency. No motion libraries, no TanStack Query, no date libraries, no classnames/clsx, no lodash. devDependencies are fine.
- Animations: CSS + WAAPI only, compositor-only properties (transform, opacity, clip-path for resolve), interrupt-reversible, reduced-motion crossfade fallback handled centrally.
- No hardcoded colors, px spacing, durations, or easings in component code. Semantic tokens only.
- PHI safety: never log or render raw error messages, request/response bodies, or headers. Path templates and status codes only.
- size-limit budgets in V1_SPEC S1 gate every change.
- Every component has a `*.fixtures.tsx`; every component has a `dev/zones/*.tsx`. The harness completeness check enforces this.
- No repeated test/setup boilerplate anywhere. If you write the same 5 lines twice, extract it into the harness or a shared util.
- Public API: named exports, forwardRef on every DOM-rendering component, JSDoc on every exported prop interface.

## Resolved decisions (do not revisit, do not ask)

- Package manager: npm. Delete yarn.lock.
- Docs/stories: Ladle. Bundle budgets: size-limit. Versioning: changesets.
- Static checks (token completeness, raw-hex/raw-px detection, fixture completeness) are implemented as vitest suites under `src/testing/static/`, not as ESLint/stylelint plugins. One test runner for everything.
- Browser targets: evergreen, last 2 versions. `linear()` easing with `ease-out` fallback.
- Dark mode: `data-theme` attribute on `<html>`; absent attribute follows `prefers-color-scheme`. Charts re-theme from the same semantic map.
- Subpath entries: `.`, `./charts`, `./motion`, `./transitions`, `./data`, `./tokens`, `./tokens.css`, `./style.css`, `./testing` (dev-only).
- Dev workbench lives in `dev/` (replaces `playground/`), entry `dev/index.tsx`, zones auto-discovered via `import.meta.glob`.
- File pattern per component: `src/components/<Name>/index.tsx`, `<Name>.module.css`, `<Name>.fixtures.tsx`, optional `<Name>.test.tsx`.
- CI: GitHub Actions, React 18 + 19 matrix, all gates from V1_SPEC S7.1.
- Commit style: conventional commits, one workstream = one commit series, e.g. `feat(s1): externalize echarts behind core wrapper`.

## Code style (match existing)

- TypeScript strict, single quotes, semicolons, no space inside import braces: `import {useState} from 'react';`
- CSS modules, class prefix `smd-` (configured in vite.config.ts).
- Numbered rule comments exist in older files (`// Rule 6: ...`); do not cargo-cult them into new code, write plain comments only where intent is non-obvious.

## Commands

- `npm run dev` dev workbench (after S8a; currently watch-build)
- `npm test` vitest run including static check suites
- `npm run typecheck` tsc noEmit
- `npm run build` vite build + declaration emit; must stay green after every workstream

## Execution protocol

Work the spec in sequence: S1 → S2 → S0 → S7.0 + S8a → S3 + S4 → S5 → S6 → S7.1 → S8b. After each workstream: typecheck, full test run, build, then update IMPLEMENTATION_STATUS.md (create it on first run) with what shipped, criteria checked off, and any self-made decisions. Snapshot updates require a one-line justification in the commit message. If a criterion cannot be met, do not silently weaken it; implement the closest compliant behavior and flag it prominently at the top of IMPLEMENTATION_STATUS.md.
