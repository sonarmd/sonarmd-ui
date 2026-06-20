import React from 'react';
/**
 * Behavioral coverage for the progressbar value contract: aria-valuenow is
 * clamped to [0, max] so assistive tech never receives an out-of-range value,
 * and the indeterminate variant exposes no value.
 */
import {render, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Progress} from './index';

test('aria-valuenow reflects the clamped value, not the raw input', () => {
  const {rerender} = render(<Progress value={150} max={100} label="Sync" />);
  let bar = screen.getByRole('progressbar', {name: 'Sync'});
  expect(bar.getAttribute('aria-valuenow')).toBe('100');
  expect(bar.getAttribute('aria-valuemax')).toBe('100');

  rerender(<Progress value={-20} max={100} label="Sync" />);
  bar = screen.getByRole('progressbar', {name: 'Sync'});
  expect(bar.getAttribute('aria-valuenow')).toBe('0');
});

test('indeterminate exposes no value', () => {
  render(<Progress label="Loading" />);
  const bar = screen.getByRole('progressbar', {name: 'Loading'});
  expect(bar.getAttribute('aria-valuenow')).toBeNull();
});
