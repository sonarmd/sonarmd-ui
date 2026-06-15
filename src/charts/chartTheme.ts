import type {ECOption} from './echartsCore';
import {colors, colorsDark} from '../sonarmd-tokens';

export type ChartTheme = 'light' | 'dark';

/**
 * Theme-dependent chart chrome (axis, legend, tooltip colors) built from the
 * same semantic token map as the rest of the system. ChartCanvas layers this
 * onto a chart's option and re-applies it on data-theme changes, so charts
 * re-color in place with no re-instantiation. Series colors are the shared
 * brand palette and read on both themes, so they are not part of the chrome.
 *
 * Gauge series carry their own text chrome (the value `detail`, the `title`,
 * and the `axisLabel`) that echarts bakes from the light token map at build
 * time and never re-themes. Passing the option's `series` lets this layer
 * re-color those labels per theme, by index, leaving non-gauge series (and the
 * brand-palette `axisLine` threshold bands) untouched.
 *
 * Kept free of any echarts runtime import (ECOption is type-only) so it stays
 * cheap to unit-test.
 */
export function chartChrome(
  theme: ChartTheme,
  includeAxes: boolean,
  series?: unknown,
): ECOption {
  const c = theme === 'dark' ? {...colors, ...colorsDark} : colors;
  const chrome: ECOption = {
    legend: {textStyle: {color: c['text-tertiary']}},
    tooltip: {
      backgroundColor: theme === 'dark' ? c['bg-raised'] : 'rgba(255, 255, 255, 0.96)',
      borderColor: c['border-default'],
      textStyle: {color: c['text-primary']},
    },
  };
  if (includeAxes) {
    const axis = {
      axisLine: {lineStyle: {color: c['border-default']}},
      axisLabel: {color: c['text-tertiary']},
      splitLine: {lineStyle: {color: theme === 'dark' ? c['bg-raised'] : c['bg-subtle']}},
    };
    chrome.xAxis = axis;
    chrome.yAxis = axis;
  }
  const seriesArr = Array.isArray(series) ? series : series ? [series] : [];
  // Merge is index-aligned, so emit {} for every non-gauge slot (a no-op merge)
  // and a label-color override for each gauge.
  const overrides = seriesArr.map((s) =>
    s && typeof s === 'object' && (s as {type?: string}).type === 'gauge'
      ? {
          detail: {color: c['text-primary']},
          title: {color: c['text-secondary']},
          axisLabel: {color: c['text-tertiary']},
        }
      : {},
  );
  if (overrides.some((o) => Object.keys(o).length > 0)) {
    chrome.series = overrides as ECOption['series'];
  }
  return chrome;
}
