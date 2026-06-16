/**
 * SonarMD Design System Tokens
 * Single source of truth for all design values used in JS/TS.
 * CSS counterparts are defined as --smd-* custom properties in index.css.
 */

// --- Color Primitives ----------------------------------------------------------

export const colors = {
  // Ocean Blue - primary brand
  'primary-10': '#E8E8FF',
  'primary-20': '#C7C7FD',
  'primary-30': '#A6A6FA',
  'primary-40': '#6363EC',
  'primary-50': '#393AF3',
  'primary-60': '#0A0AC6',

  // Cyan - secondary
  'cyan-10': '#EEFFFF',
  'cyan-20': '#BAF6F6',
  'cyan-30': '#75DADA',
  'cyan-40': '#24ADAD',
  'cyan-50': '#067676',
  'cyan-60': '#004242',

  // Beacon Orange - accent
  'accent-10': '#FFF3EE',
  'accent-20': '#FFBFA9',
  'accent-30': '#FF8B63',
  'accent-40': '#CC4D20',
  'accent-50': '#992800',
  'accent-60': '#661B00',

  // Magenta
  'magenta-10': '#FBEEFF',
  'magenta-20': '#D5A2E4',
  'magenta-30': '#B161CA',
  'magenta-40': '#902DAF',
  'magenta-50': '#6B048B',
  'magenta-60': '#4E0066',

  // Gray
  'gray-10': '#F5F5FA',
  'gray-20': '#EDEDF3',
  'gray-30': '#DEDEE6',
  'gray-40': '#C6C6D1',
  'gray-50': '#A2A2B2',
  'gray-60': '#727286',
  'gray-70': '#3F3F54',
  'gray-80': '#171724',

  // Semantic - positive
  'positive-10': '#D5EEDD',
  'positive-20': '#80CB98',
  'positive-30': '#2BA854',
  'positive-40': '#228643',
  'positive-50': '#185A2E',
  'positive-60': '#003311',

  // Semantic - negative
  'negative-10': '#FBE2E3',
  'negative-20': '#FFB2B7',
  'negative-30': '#E9424C',
  'negative-40': '#BB353D',
  'negative-50': '#7A1D22',
  'negative-60': '#470004',

  // Semantic - warning
  'warning-10': '#FFF9E6',
  'warning-20': '#FFEA8F',
  'warning-30': '#FFCA2D',
  'warning-40': '#C59505',
  'warning-50': '#7E5F02',
  'warning-60': '#3B2C00',

  // Functional aliases
  'text-primary':   '#171724',
  'text-secondary': '#3F3F54',
  // Darkened from gray-60 (#727286) so tertiary text clears WCAG AA (4.5:1) on
  // the subtle surface too, not just on base white (see contrast.test.ts).
  'text-tertiary':  '#6B6B7E',
  'text-inverse':   '#FFFFFF',
  'text-disabled':  '#A2A2B2',
  'text-link':      '#393AF3',

  'bg-base':    '#FFFFFF',
  'bg-subtle':  '#F5F5FA',
  'bg-raised':  '#FFFFFF',
  'bg-overlay': 'rgba(23, 23, 36, 0.5)',

  'border-default': '#DEDEE6',
  'border-strong':  '#C6C6D1',
  'border-focus':   '#393AF3',
  'border-error':   '#E9424C',
} as const;

// --- Dark Semantic Overrides -------------------------------------------------

/**
 * Dark-theme values for the functional aliases only. The primitive scale
 * (primary-*, gray-*, etc.) is shared across themes; only these semantic
 * surface/text/border tokens flip. Emitted under [data-theme="dark"] (and under
 * prefers-color-scheme: dark when no theme attribute is set). text-inverse and
 * border-error are intentionally not overridden - they read correctly on the
 * saturated brand surfaces in both themes.
 */
export const colorsDark = {
  'text-primary':   '#F5F5FA',
  'text-secondary': '#C6C6D1',
  'text-tertiary':  '#9A9AAB',
  'text-disabled':  '#6B6B80',
  'text-link':      '#A6A6FA',

  'bg-base':    '#14141F',
  'bg-subtle':  '#1E1E2C',
  'bg-raised':  '#24243A',
  'bg-overlay': 'rgba(0, 0, 0, 0.6)',

  'border-default': '#2E2E42',
  'border-strong':  '#3F3F54',
  'border-focus':   '#6363EC',
} as const;

// --- Spacing -------------------------------------------------------------------

export const spacing = {
  '0':  '0px',
  'px': '1px',
  '1':  '4px',
  '2':  '8px',
  '3':  '12px',
  '4':  '16px',
  '5':  '20px',
  '6':  '24px',
  '8':  '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
} as const;

// --- Border Radius -------------------------------------------------------------

export const radius = {
  'none': '0px',
  'sm':   '4px',
  'md':   '8px',
  'lg':   '12px',
  'xl':   '16px',
  'full': '9999px',
} as const;

// --- Shadows -------------------------------------------------------------------

export const shadows = {
  'sm':    '0 1px 2px 0 rgba(23,23,36,0.08)',
  'md':    '0 2px 8px 0 rgba(23,23,36,0.12)',
  'lg':    '0 4px 16px 0 rgba(23,23,36,0.16)',
  'focus': '0 0 0 3px rgba(57,58,243,0.25)',
  'focus-error': '0 0 0 3px rgba(233,66,76,0.25)',
} as const;

// --- Typography ----------------------------------------------------------------

export const fontSize = {
  'xs':   '11px',
  'sm':   '12px',
  'base': '14px',
  'lg':   '16px',
  'xl':   '18px',
  '2xl':  '20px',
  '3xl':  '24px',
} as const;

export const fontWeight = {
  'normal':   '400',
  'medium':   '500',
  'semibold': '600',
  'bold':     '700',
} as const;

export const lineHeight = {
  'tight':   '1.25',
  'base':    '1.5',
  'relaxed': '1.625',
} as const;

// --- Animation -----------------------------------------------------------------

// V1_SPEC S4.1 motion tokens. Values align with Material Motion guidelines.
export const duration = {
  'instant': '0ms',
  'fast':    '120ms',
  'base':    '200ms',
  'slow':    '320ms',
  'page':    '400ms',
} as const;

// spring-out approximated with linear() + ease-out fallback per CLAUDE.md.
// CSS @supports can gate the linear() form; fallback is always valid.
export const ease = {
  'standard':    'cubic-bezier(0.4, 0, 0.2, 1)',
  'decelerate':  'cubic-bezier(0, 0, 0.2, 1)',
  'accelerate':  'cubic-bezier(0.4, 0, 1, 1)',
  'spring-out':  'linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.987 44.7%, 1.014 50.8%, 1.021 53.5%, 1.021 55.2%, 1.017 57.6%, 1 65.5%, 0.996 70.3%, 1.001 86.3%, 1)',
} as const;

// --- Component Sizing ----------------------------------------------------------

export const inputHeight = {
  'sm': '28px',
  'md': '36px',
  'lg': '44px',
} as const;

export const inputPaddingX = {
  'sm': '8px',
  'md': '12px',
  'lg': '16px',
} as const;

/** Horizontal clearance for an icon embedded inside an input. */
export const inputIconInset = {
  'sm': '32px',
  'lg': '40px',
} as const;

export const inputFontSize = {
  'sm': fontSize.sm,
  'md': fontSize.base,
  'lg': fontSize.lg,
} as const;

export const sidebar = {
  width:           '256px',
  widthCollapsed:  '64px',
} as const;

// --- Z-Index -----------------------------------------------------------------

/** Stacking order for layered surfaces. Consumed as --smd-z-* in CSS modules. */
export const zIndex = {
  'dropdown': '1000',
  'modal':    '1100',
  'toast':    '1200',
  'tooltip':  '1300',
} as const;

// --- Chart Tokens --------------------------------------------------------------

/** Ordered for maximum visual distinction in multi-series charts */
export const chartColors = [
  colors['primary-50'],  // #393AF3
  colors['cyan-40'],     // #24ADAD
  colors['accent-40'],   // #CC4D20
  colors['magenta-40'],  // #902DAF
  colors['positive-30'], // #2BA854
  colors['primary-30'],  // #A6A6FA
  colors['cyan-30'],     // #75DADA
  colors['accent-30'],   // #FF8B63
  colors['magenta-30'],  // #B161CA
  colors['gray-60'],     // #727286
] as const;

/** Shared ECharts option fragments - spread these instead of copying inline */
export const echartsDefaults = {
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: colors['border-default'],
    borderWidth: 1,
    textStyle: {color: colors['text-primary'], fontSize: 13},
  },
  xAxis: {
    axisLine:  {lineStyle: {color: colors['border-default']}},
    axisLabel: {color: colors['text-tertiary'], fontSize: 11},
    axisTick:  {show: false},
  },
  yAxis: {
    axisLine:  {show: false},
    axisLabel: {color: colors['text-tertiary'], fontSize: 11},
    splitLine: {lineStyle: {color: colors['bg-subtle']}},
  },
  legend: {
    top: 0,
    textStyle: {fontSize: 12, color: colors['text-tertiary']},
    itemWidth: 14, itemHeight: 14, itemGap: 20,
  },
  grid: {top: 40, right: 20, bottom: 40, left: 60},
} as const;

/** Build a vertical linear gradient for area chart fills */
export function areaGradient(color: string, startOpacity = 0.3, endOpacity = 0.02) {
  return {
    type:  'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      {offset: 0, color: hexToRgba(color, startOpacity)},
      {offset: 1, color: hexToRgba(color, endOpacity)},
    ],
  };
}

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith('rgb')) return color;
  const h = color.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
