import React from 'react';
/**
 * Behavioral coverage for the anchored popover: trigger aria wiring, toggle,
 * outside-click and Escape dismissal, and focus moving into the panel on open
 * then back to the trigger on Escape.
 */
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Popover} from './index';

function Harness(): React.JSX.Element {
  return (
    <div>
      <span>outside</span>
      <Popover trigger={<button type="button">Actions</button>} ariaLabel="Quick actions">
        <button type="button">Archive</button>
      </Popover>
    </div>
  );
}

test('trigger exposes haspopup/expanded and toggles the dialog', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Actions'});
  expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  expect(trigger.getAttribute('aria-expanded')).toBe('false');

  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', {name: 'Quick actions'});
  expect(dialog).toBeTruthy();
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
});

test('opening moves focus into the panel', () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
  expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Archive'}));
});

test('outside pointer-down closes the popover', () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
  expect(screen.queryByRole('dialog')).toBeTruthy();

  fireEvent.mouseDown(screen.getByText('outside'));
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('Escape closes and returns focus to the trigger', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Actions'});
  fireEvent.click(trigger);
  expect(screen.queryByRole('dialog')).toBeTruthy();

  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
