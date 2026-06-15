---
workstream: S5 (page transitions)
branch: feat/s2-performance
status: in-progress
created: 2026-06-15
---

# S5: Page Transitions

Authoritative criteria: V1_SPEC.md S5.
Depends on: S4 motion hooks (done).

## Architecture

Router-agnostic core + thin react-router adapter. Core never imports react-router.

### src/transitions/

- `patterns.ts` - 8 keyframe sets + pattern name type
- `TransitionContainer.tsx` - core, takes locationKey + direction + pattern
  - Keeps outgoing mounted during exit animation (dual-slot render)
  - Plays exit on outgoing, enter on incoming simultaneously
  - After exit done: removes outgoing from DOM
  - On locationKey change: snapshot outgoing, start both animations
  - Reduced motion: opacity crossfade only, no translate/scale
- `createTransitionOutlet.ts` - react-router adapter factory
  - Derives direction from useNavigationType (POP=back, PUSH=forward)
  - Reads route handle.transition for per-route pattern override
  - Renders TransitionContainer with outlet as children
- `index.ts` - barrel: TransitionContainer, createTransitionOutlet, PatternName

### 8 Patterns (V1_SPEC canonical vocabulary)

1. nav-forward: out translates X -24px + fade to 0.9; in from +32px decelerate
2. nav-back: mirror of nav-forward
3. resolve: clip-path inset expand + indicator fade, content 12px rise + fade
4. drill-in: FLIP origin -> header (simplified: scale + fade, full FLIP needs
   consumer-provided shared element ref; v1 ships the fade+scale approximation)
5. overlay: scale 0.96->1 + fade (modal/drawer entry)
6. swap: out fade, in fade + 4px rise
7. settle: stagger cascade crossfade (up to 6 groups, base duration max)
8. dismiss: fade + 8px translate toward exit edge

### Size budget

./transitions must fit within 6kB gz combined with ./motion (1.18kB) and
./data (future, est 2kB). Target: transitions <= 2.5kB brotli.

## Execution

1. src/transitions/patterns.ts
2. src/transitions/TransitionContainer.tsx
3. src/transitions/createTransitionOutlet.ts
4. src/transitions/index.ts
5. Add ./transitions subpath to package.json + vite.config.ts
6. Add ./transitions to .size-limit.cjs
7. TransitionContainer.fixtures.tsx (fake-history driven, no react-router)
8. typecheck, tests (update snapshots), build, size
9. Update IMPLEMENTATION_STATUS.md, commit, push
