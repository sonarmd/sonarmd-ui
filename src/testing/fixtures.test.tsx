/**
 * The declarative baseline matrix (V1_SPEC S7.0). Glob-discovers every
 * *.fixtures.tsx and, per named fixture, generates a DOM snapshot and a
 * vitest-axe pass. All render/provider/mock boilerplate lives here once; fixture
 * files contain only component-specific props.
 *
 * Note: jsdom does not apply CSS, so a component's DOM is identical in light and
 * dark - a separate dark DOM snapshot would be byte-for-byte equal. Dark
 * correctness is covered by the token contrast gate (contrast.test.ts) and the
 * chart re-theme test (chartTheme.test.ts) instead of duplicate snapshots.
 */
import React from 'react';
import {cleanup} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {axe} from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import {renderFixture} from './harness';
import type {ComponentFixtures} from './defineComponentFixtures';

expect.extend(axeMatchers);

// Centralized mocks (hoisted): charts render through ChartCanvas (mocked to a
// stub so echarts/canvas never load), and react-window renders a few rows.
vi.mock('../charts/ChartCanvas', () => ({
  ChartCanvas: () => <div data-testid="echarts-chart" />,
}));

vi.mock('react-window', () => ({
  List: ({
    rowComponent: Row,
    rowCount,
    rowProps,
  }: {
    rowComponent: React.ComponentType<{
      ariaAttributes: Record<string, string>;
      index: number;
      style: React.CSSProperties;
      [key: string]: unknown;
    }>;
    rowCount: number;
    rowProps?: Record<string, unknown>;
  }) => (
    <div data-testid="virtual-list">
      {Array.from({length: Math.min(rowCount, 3)}, (_, i) => (
        <Row key={i} ariaAttributes={{}} index={i} style={{}} {...(rowProps ?? {})} />
      ))}
    </div>
  ),
}));

afterEach(() => cleanup());

const fixtureModules = import.meta.glob<{default: ComponentFixtures}>(
  '../components/**/*.fixtures.tsx',
  {eager: true},
);

for (const [path, mod] of Object.entries(fixtureModules)) {
  const entry = mod.default;
  const name = /components\/([^/]+)\//.exec(path)?.[1] ?? path;

  describe(name, () => {
    for (const fixtureName of Object.keys(entry.config.fixtures)) {
      it(`${fixtureName} - dom`, () => {
        const {asFragment} = renderFixture(entry, fixtureName);
        expect(asFragment()).toMatchSnapshot();
      });

      it(`${fixtureName} - axe`, async () => {
        const {container} = renderFixture(entry, fixtureName);
        const rules = (entry.config.skipAxe ?? []).reduce<Record<string, {enabled: boolean}>>(
          (acc, id) => {
            acc[id] = {enabled: false};
            return acc;
          },
          {},
        );
        expect(await axe(container, {rules})).toHaveNoViolations();
      });
    }
  });
}
