import React from 'react';
/**
 * Behavioral coverage for the image-load fallback and the name/state contracts
 * the static harness cannot trigger.
 */
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Avatar} from './index';

test('a failed image falls back to initials but keeps the name accessible', () => {
  render(<Avatar name="Ada Lovelace" src="https://example.test/broken.png" />);
  const img = screen.getByRole('img', {name: 'Ada Lovelace'});
  fireEvent.error(img);
  // The <img> is gone; initials render but the name is preserved on the container.
  expect(document.querySelector('img')).toBeNull();
  expect(screen.getByText('AL')).toBeTruthy();
  expect(screen.getByRole('img', {name: 'Ada Lovelace'})).toBeTruthy();
});

test('a new src clears a prior load failure and retries the image', () => {
  const {rerender} = render(<Avatar name="Ada Lovelace" src="https://example.test/broken.png" />);
  fireEvent.error(screen.getByRole('img', {name: 'Ada Lovelace'}));
  expect(document.querySelector('img')).toBeNull();

  rerender(<Avatar name="Ada Lovelace" src="https://example.test/fresh.png" />);
  const retried = document.querySelector('img');
  expect(retried).not.toBeNull();
  expect(retried?.getAttribute('src')).toBe('https://example.test/fresh.png');
});

test('presence status is exposed with an accessible label', () => {
  render(<Avatar name="Grace Hopper" status="online" />);
  expect(screen.getByRole('img', {name: 'Online'})).toBeTruthy();
});

test('fallback exposes both the name and the status (status not flattened)', () => {
  // No src: fallback path. The name lives on the initials element, not a wrapper
  // role=img, so the sibling status indicator keeps its own announced label.
  render(<Avatar name="Grace Hopper" status="busy" />);
  expect(screen.getByRole('img', {name: 'Grace Hopper'})).toBeTruthy();
  expect(screen.getByRole('img', {name: 'Busy'})).toBeTruthy();
});
