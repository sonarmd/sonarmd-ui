/**
 * Single source for the theming-guide token catalog. The token NAMES below are
 * gate-enforced against the token source by src/testing/static/tokenCatalog.test.ts:
 * a renamed or removed token fails CI rather than rendering a dead swatch. The
 * human-readable descriptions are curated by hand.
 */
export interface TokenGroup {
  name: string;
  tokens: Array<{name: string; description: string}>;
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    name: 'Text',
    tokens: [
      {name: '--smd-text-primary', description: 'Primary body text, headings, labels'},
      {name: '--smd-text-secondary', description: 'Supporting text, subtitles, helper text'},
      {name: '--smd-text-tertiary', description: 'Placeholder text, disabled states, fine print'},
      {name: '--smd-text-inverse', description: 'Text on dark/colored surfaces (e.g. filled badges)'},
      {name: '--smd-text-link', description: 'Hyperlinks and interactive text labels'},
    ],
  },
  {
    name: 'Background',
    tokens: [
      {name: '--smd-bg-base', description: 'Page background, default surface'},
      {name: '--smd-bg-subtle', description: 'Slightly elevated surfaces, table row hover'},
      {name: '--smd-bg-raised', description: 'Elevated surfaces: cards, popovers, raised panels'},
      {name: '--smd-bg-overlay', description: 'Modal backdrop, tooltip container'},
    ],
  },
  {
    name: 'Border',
    tokens: [
      {name: '--smd-border-default', description: 'Standard dividers, card outlines, form field borders'},
      {name: '--smd-border-strong', description: 'Focused inputs, active selection rings'},
    ],
  },
  {
    name: 'Semantic Status',
    tokens: [
      {name: '--smd-color-positive-30', description: 'Positive outcomes, completed states'},
      {name: '--smd-color-warning-30', description: 'Caution, items needing attention'},
      {name: '--smd-color-negative-30', description: 'Errors, destructive actions, high risk'},
    ],
  },
  {
    name: 'Brand / Interactive',
    tokens: [
      {name: '--smd-color-primary-50', description: 'Primary brand color, CTA buttons, focus rings'},
      {name: '--smd-color-primary-60', description: 'Hover/pressed state for primary actions'},
      {name: '--smd-color-primary-10', description: 'Subtle brand tint, selected row background'},
    ],
  },
  {
    name: 'Spacing',
    tokens: [
      {name: '--smd-space-1', description: '4px - fine-grain padding, icon gaps'},
      {name: '--smd-space-2', description: '8px - tight component padding'},
      {name: '--smd-space-3', description: '12px - standard gap between fields'},
      {name: '--smd-space-4', description: '16px - card padding, section gap'},
      {name: '--smd-space-6', description: '24px - panel spacing'},
      {name: '--smd-space-8', description: '32px - page section spacing'},
    ],
  },
  {
    name: 'Radius',
    tokens: [
      {name: '--smd-radius-sm', description: 'Subtle rounding for badges, chips'},
      {name: '--smd-radius-md', description: 'Standard rounding for cards, inputs'},
      {name: '--smd-radius-lg', description: 'Prominent rounding for modals, panels'},
    ],
  },
];
