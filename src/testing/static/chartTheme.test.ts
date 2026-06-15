/**
 * chartChrome is the theme-dependent chart chrome layered onto echarts options
 * so charts re-color on data-theme change (V1_SPEC Criterion 2.3, charts
 * portion). It is a pure function over the token map, so it is unit-tested
 * directly without spinning up echarts.
 */
import {test, expect} from 'vitest';
import {chartChrome} from '../../charts/chartTheme';
import {colors, colorsDark} from '../../sonarmd-tokens';

const one = <T>(v: T | T[] | undefined): T | undefined => (Array.isArray(v) ? v[0] : v);

test('dark chrome uses the dark token map', () => {
  const dark = chartChrome('dark', true);
  expect(one(dark.tooltip)?.backgroundColor).toBe(colorsDark['bg-raised']);
  expect(one(dark.tooltip)?.borderColor).toBe(colorsDark['border-default']);
  expect(one(dark.xAxis)?.axisLabel?.color).toBe(colorsDark['text-tertiary']);
  expect(one(dark.legend)?.textStyle?.color).toBe(colorsDark['text-tertiary']);
});

test('light chrome uses the light token map', () => {
  const light = chartChrome('light', true);
  expect(one(light.xAxis)?.axisLabel?.color).toBe(colors['text-tertiary']);
  expect(one(light.tooltip)?.borderColor).toBe(colors['border-default']);
});

test('axisless charts (pie/gauge/funnel) get no phantom axes', () => {
  const noAxes = chartChrome('dark', false);
  expect('xAxis' in noAxes).toBe(false);
  expect('yAxis' in noAxes).toBe(false);
  expect(one(noAxes.tooltip)?.backgroundColor).toBe(colorsDark['bg-raised']);
});
