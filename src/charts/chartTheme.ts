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
 * Kept free of any echarts runtime import (ECOption is type-only) so it stays
 * cheap to unit-test.
 */
export function chartChrome(theme: ChartTheme, includeAxes: boolean): ECOption {
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
  return chrome;
}
