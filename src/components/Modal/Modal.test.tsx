import React from 'react';
/**
 * Behavioral coverage for the dialog accessibility contract: deterministic
 * title wiring, an accessible name when no visible title is given, Escape to
 * close, focus restoration, and assistive-tech containment (background siblings
 * marked inert/aria-hidden while open). The declarative harness only renders the
 * static open state, so the open/close transitions are verified here.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Modal} from './index';

function Harness({title, ariaLabel}: {title?: string; ariaLabel?: string}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} ariaLabel={ariaLabel}>
        <p>Body content</p>
      </Modal>
    </div>
  );
}

test('title is wired as the dialog accessible name via aria-labelledby', () => {
  render(<Harness title="Confirm action" />);
  fireEvent.click(screen.getByRole('button', {name: 'Open'}));

  const dialog = screen.getByRole('dialog');
  const labelledby = dialog.getAttribute('aria-labelledby');
  expect(labelledby).toBeTruthy();
  const heading = document.getElementById(labelledby as string);
  expect(heading?.textContent).toBe('Confirm action');
});

test('ariaLabel names the dialog when no visible title is rendered', () => {
  render(<Harness ariaLabel="Quick settings" />);
  fireEvent.click(screen.getByRole('button', {name: 'Open'}));

  const dialog = screen.getByRole('dialog');
  expect(dialog.getAttribute('aria-labelledby')).toBeNull();
  expect(dialog.getAttribute('aria-label')).toBe('Quick settings');
});

test('background siblings are inert while open and restored on close', () => {
  render(<Harness title="Confirm action" />);
  const trigger = screen.getByRole('button', {name: 'Open'});
  const appRoot = trigger.closest('div')?.parentElement as HTMLElement;

  fireEvent.click(trigger);
  expect(appRoot.getAttribute('aria-hidden')).toBe('true');
  expect(appRoot.inert).toBe(true);

  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(appRoot.getAttribute('aria-hidden')).toBeNull();
  expect(appRoot.inert).toBe(false);
});

test('Escape closes the dialog and focus returns to the opener', () => {
  render(<Harness title="Confirm action" />);
  const trigger = screen.getByRole('button', {name: 'Open'});

  trigger.focus();
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toBeTruthy();

  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
