import type {Story} from '@ladle/react';
import {VisuallyHidden} from './index';

export default {
  title: 'Components/VisuallyHidden',
};

/**
 * Content present for screen readers but not painted. Import:
 * `import { VisuallyHidden } from '@sonarmd/ui'`
 */
export const Default: Story = () => (
  <button type="button">
    <span aria-hidden>X</span>
    <VisuallyHidden>Close dialog</VisuallyHidden>
  </button>
);

/** A skip link: hidden until focused (Tab to reveal). */
export const SkipLink: Story = () => (
  <a href="#main">
    <VisuallyHidden focusable>Skip to main content</VisuallyHidden>
  </a>
);
