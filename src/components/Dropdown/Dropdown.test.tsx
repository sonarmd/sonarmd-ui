import React from 'react';
/**
 * Behavioral coverage for the listbox keyboard contract the declarative fixtures
 * harness cannot reach (it renders the menu closed). Driving real key events
 * verifies the trigger exposes aria-controls/aria-activedescendant so the active
 * option is announced to assistive tech, and that Enter selects it.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Dropdown} from './index';

const OPTIONS = [
  {label: 'Cardiology', value: 'cardio'},
  {label: 'Oncology', value: 'onco'},
  {label: 'Neurology', value: 'neuro'},
];

function Harness(): React.JSX.Element {
  const [value, setValue] = useState<string | null>(null);
  return <Dropdown label="Specialty" options={OPTIONS} value={value} onChange={setValue} />;
}

test('closed trigger exposes no listbox wiring', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Specialty'});
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(trigger.getAttribute('aria-controls')).toBeNull();
  expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
});

test('aria-controls points at the listbox and activedescendant tracks ArrowDown', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Specialty'});

  fireEvent.click(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  const listbox = screen.getByRole('listbox');
  expect(listbox.id).toBeTruthy();
  expect(trigger.getAttribute('aria-controls')).toBe(listbox.id);

  fireEvent.keyDown(trigger, {key: 'ArrowDown'});
  const options = screen.getAllByRole('option');
  expect(options[0].id).toBeTruthy();
  expect(trigger.getAttribute('aria-activedescendant')).toBe(options[0].id);

  fireEvent.keyDown(trigger, {key: 'ArrowDown'});
  expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
});

test('Enter on the active option selects it and closes the listbox', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Specialty'});

  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, {key: 'ArrowDown'}); // activate Cardiology
  fireEvent.keyDown(trigger, {key: 'Enter'});

  expect(screen.queryByRole('listbox')).toBeNull();
  expect(trigger.textContent).toContain('Cardiology');
});

test('Escape closes the listbox and restores focus to the trigger', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Specialty'});

  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeTruthy();
  fireEvent.keyDown(trigger, {key: 'Escape'});

  expect(screen.queryByRole('listbox')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
