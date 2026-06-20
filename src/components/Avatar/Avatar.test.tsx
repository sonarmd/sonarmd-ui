import React from 'react';
/**
 * Behavioral coverage for the image-load fallback the static harness cannot
 * trigger: a broken src degrades to initials, and the presence dot is labelled.
 */
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Avatar} from './index';

test('a failed image falls back to initials', () => {
  render(<Avatar name="Ada Lovelace" src="https://example.test/broken.png" />);
  const img = screen.getByRole('img', {name: 'Ada Lovelace'});
  fireEvent.error(img);
  expect(screen.queryByRole('img', {name: 'Ada Lovelace'})).toBeNull();
  expect(screen.getByText('AL')).toBeTruthy();
});

test('presence status is exposed with an accessible label', () => {
  render(<Avatar name="Grace Hopper" status="online" />);
  expect(screen.getByRole('img', {name: 'Online'})).toBeTruthy();
});
