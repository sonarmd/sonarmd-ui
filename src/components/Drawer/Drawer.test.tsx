import React from 'react';
/**
 * Behavioral coverage for the drawer dialog contract (shared with Modal via
 * useDialogA11y): accessible naming, Escape-to-close with focus restoration, and
 * background inert containment while open.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Drawer} from './index';

function Harness({title, ariaLabel}: {title?: string; ariaLabel?: string}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title={title} ariaLabel={ariaLabel}>
        <p>Panel content</p>
      </Drawer>
    </div>
  );
}

test('title names the dialog and ariaLabel covers the title-less case', () => {
  const {unmount} = render(<Harness title="Filters" />);
  fireEvent.click(screen.getByRole('button', {name: 'Open'}));
  const dialog = screen.getByRole('dialog');
  const labelledby = dialog.getAttribute('aria-labelledby');
  expect(document.getElementById(labelledby as string)?.textContent).toBe('Filters');
  unmount();

  render(<Harness ariaLabel="Quick filters" />);
  fireEvent.click(screen.getByRole('button', {name: 'Open'}));
  expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Quick filters');
});

test('Escape closes, restores focus, and lifts background inert', () => {
  render(<Harness title="Filters" />);
  const trigger = screen.getByRole('button', {name: 'Open'});
  const appRoot = trigger.closest('div')?.parentElement as HTMLElement;

  trigger.focus();
  fireEvent.click(trigger);
  expect(appRoot.inert).toBe(true);

  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(appRoot.inert).toBe(false);
  expect(document.activeElement).toBe(trigger);
});
