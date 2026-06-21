// Shared runtime-benchmark harness. Each per-library app calls mountHarness with
// a registry mapping component name -> a render of ONE instance (parameterized by
// index i and a tick t so updates actually mutate the DOM). The harness renders
// `count` instances and exposes a promise-based timing API on window.__bench that
// the Playwright runner drives.
//
// A measured action resolves inside useLayoutEffect after a forced synchronous
// layout (reading offsetHeight), so the number includes React render + commit +
// style injection (emotion / cssinjs run during render) + layout - everything
// except the async paint. This is sub-frame resolution: waiting for paint would
// floor every fast render at one frame (~16.7 ms) and hide real differences.
// Identical for every library, so the comparison is apples to apples.

import React, {useLayoutEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

export type RenderOne = (i: number, t: number) => React.ReactNode;
export type Registry = Record<string, RenderOne>;

interface Config {
  name: string | null;
  count: number;
  tick: number;
}

let applyConfig: ((next: Config | ((c: Config) => Config)) => void) | null = null;
let pending: {t0: number; resolve: (ms: number) => void} | null = null;

const measure = (action: Config | ((c: Config) => Config)): Promise<number> =>
  new Promise((resolve) => {
    pending = {t0: performance.now(), resolve};
    applyConfig?.(action);
  });

// A throwing component must not kill the page; it degrades to null and flips a
// global flag so the runner can mark that cell as errored rather than fast.
class Boundary extends React.Component<{children: React.ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError(): {failed: boolean} {
    return {failed: true};
  }
  componentDidCatch(): void {
    (window as unknown as {__benchError: boolean}).__benchError = true;
  }
  render(): React.ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export function mountHarness(registry: Registry): void {
  function App(): React.JSX.Element {
    const [cfg, setCfg] = useState<Config>({name: null, count: 0, tick: 0});
    applyConfig = setCfg;
    useLayoutEffect(() => {
      if (!pending) return;
      const p = pending;
      pending = null;
      // Force synchronous layout so layout cost is included, then stop the clock.
      void document.body.offsetHeight;
      p.resolve(performance.now() - p.t0);
    });
    const render = cfg.name ? registry[cfg.name] : null;
    return (
      <Boundary key={`${cfg.name ?? ''}`}>
        {render
          ? Array.from({length: cfg.count}, (_, i) => <div key={i}>{render(i, cfg.tick)}</div>)
          : null}
      </Boundary>
    );
  }

  createRoot(document.getElementById('root') as HTMLElement).render(<App />);

  (window as unknown as {__bench: unknown}).__bench = {
    ready: true,
    has: (name: string) => Boolean(registry[name]),
    names: () => Object.keys(registry),
    mount: (name: string, count: number) => {
      (window as unknown as {__benchError: boolean}).__benchError = false;
      return measure({name, count, tick: 0});
    },
    clear: () => measure({name: null, count: 0, tick: 0}),
    update: () => measure((c: Config) => ({...c, tick: c.tick + 1})),
  };

  // Boot marker: navigation start -> module evaluated + first (empty) commit.
  // The runner reads this entry's startTime as the per-library boot cost.
  performance.mark('bench-ready');
}
