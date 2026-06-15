---
workstream: S3 (layout) + S4 (motion)
branch: feat/s2-performance
status: in-progress
created: 2026-06-15
---

# S3: Layout Primitives + S4: Motion System

Authoritative criteria: V1_SPEC.md S3 + S4.
Execution order: S3 layout -> S4 motion tokens/hooks -> workbench chrome update -> static checks -> gates.

## S3: Layout Primitives

### Components to build
- `Stack` - vertical flex column, gap from scale tokens
- `Cluster` - horizontal flex row with wrap, gap from scale tokens
- `Spacer` - flex grow or fixed size from scale
- `Columns` - CSS grid, configurable cols + gap, min column width
- `AppShell` - 3-column CSS grid (sidebar | content | context-rail)
  - Props: `sidebar` ReactNode, `contextRail` ReactNode?, `children` (content)
  - CSS Grid template with named columns
  - Context rail collapses first at md breakpoint (-> overlay drawer)
  - Sidebar collapse via existing Sidebar collapsed prop
  - Container query where supported, viewport fallback

### Static check: raw-px in margins/paddings
- New vitest suite: `src/testing/static/rawPx.test.ts`
- Grep all `src/components/**/*.module.css` and `src/components/**/*.css`
- Fail if any rule sets margin/padding with a raw px literal not from a var()
- Pattern: /margin|padding/... detect non-var px values

### Fixtures
Each component gets `*.fixtures.tsx` with representative variants.

## S4: Motion System

### Token updates (sonarmd-tokens.ts)
Update existing duration/ease to match V1_SPEC:
- duration: instant 0ms, fast 120ms, base 200ms, slow 320ms, page 400ms
- ease: standard, decelerate, accelerate, spring-out (linear() + ease-out fallback)

### Hooks in src/motion/
- `useAnimate.ts` - WAAPI wrapper
  - Signature: useAnimate(ref, keyframes, options) -> { play, reverse, cancel, finished }
  - Interrupt-safe: cancels live Animation before starting new one
  - Central reduced-motion: if prefers-reduced-motion, substitute opacity-only crossfade <= 120ms
- `usePresence.ts` - mount/unmount with exit animation
  - Tracks mounted state, plays exit animation, then removes from DOM
  - Uses useAnimate internally
- `useFlip.ts` - FLIP measured layout transitions
  - Records First position before update, Last position after, plays Invert+Play
  - Compositor-only: transform only

### ./motion subpath
- New entry: `src/motion/index.ts` exporting useAnimate, usePresence, useFlip, motion token constants
- Add to package.json exports + vite.config.ts entries
- Add to .size-limit.cjs (budget <= 2.5 kB gz, combined with future transitions + data must stay <= 6 kB)

### Workbench chrome update (criterion 8.3)
After AppShell is built, update dev/Workbench.tsx to use AppShell instead of current flex layout.

## Execution sequence

1. Update motion tokens in sonarmd-tokens.ts
2. Stack + Stack.fixtures.tsx
3. Cluster + Cluster.fixtures.tsx
4. Spacer + Spacer.fixtures.tsx
5. Columns + Columns.fixtures.tsx
6. AppShell + AppShell.fixtures.tsx
7. Add layout exports to src/index.ts
8. rawPx.test.ts static check
9. src/motion/ hooks (useAnimate -> usePresence -> useFlip)
10. src/motion/index.ts + ./motion subpath (package.json, vite.config.ts, size-limit)
11. Update dev/Workbench.tsx to use AppShell (criterion 8.3)
12. Run all gates: typecheck, tests, build, size
13. Update IMPLEMENTATION_STATUS.md
14. Commit + push

## Key constraints

- Zero new runtime deps
- All spacing/color via semantic tokens (no hardcoded px in component CSS)
- Animations: transform + opacity + clip-path only (compositor)
- WAAPI interruptible: cancel() before play()
- Reduced motion: central override in useAnimate, no per-site handling
- ASCII only in all files
