import React from 'react';
/**
 * Behavioral coverage for the polymorphic skip-link contract: a focusable
 * VisuallyHidden renders as the focusable element itself (so focus lands on the
 * element the reveal styles target), not a nested non-focusable span.
 */
import {render, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {VisuallyHidden} from './index';

test('as="a" renders a focusable anchor carrying the reveal class', () => {
  render(
    <VisuallyHidden as="a" href="#main" focusable>
      Skip to main content
    </VisuallyHidden>,
  );
  const link = screen.getByRole('link', {name: 'Skip to main content'});
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('#main');
  // The reveal class is on the focusable element itself, so :focus can match it.
  expect(link.className).toContain('focusable');
});

test('defaults to a span for screen-reader-only content', () => {
  render(<VisuallyHidden>Close dialog</VisuallyHidden>);
  const el = screen.getByText('Close dialog');
  expect(el.tagName).toBe('SPAN');
});
