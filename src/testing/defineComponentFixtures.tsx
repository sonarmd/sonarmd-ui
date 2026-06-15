import type {ComponentType} from 'react';

export interface FixtureConfig<P> {
  /** Named prop sets, one per variant/state to snapshot + axe. */
  fixtures: Record<string, Partial<P>>;
  /** Wrap renders in a router (for components that use react-router links). */
  router?: boolean;
  /** Component renders into a portal; the harness serializes document.body. */
  portal?: boolean;
  /** axe rule ids to disable for this component. */
  skipAxe?: string[];
}

export interface ComponentFixtures {
  Component: ComponentType<Record<string, unknown>>;
  config: FixtureConfig<Record<string, unknown>>;
}

/**
 * A component's entire baseline suite, declared in one file. The harness
 * (src/testing/fixtures.test.tsx) glob-discovers every fixtures file and
 * generates a light snapshot, a dark snapshot, and an axe pass per named
 * fixture - no render/provider/mock/expect boilerplate in the fixture file.
 */
export function defineComponentFixtures<P>(
  Component: ComponentType<P>,
  config: FixtureConfig<P>,
): ComponentFixtures {
  return {
    Component: Component as ComponentType<Record<string, unknown>>,
    config: config as FixtureConfig<Record<string, unknown>>,
  };
}
