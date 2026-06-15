/**
 * Behavioral coverage for the combobox keyboard contract that the declarative
 * fixtures harness cannot reach - it renders the menu closed, so the option ids
 * and aria-activedescendant wiring never appear there. Driving real key events
 * verifies the active option is announced to assistive tech and that Enter
 * toggles selection.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {MultiSelect} from './index';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
  {label: 'Option C', value: 'c'},
];

function Harness({searchable = false}: {searchable?: boolean}): JSX.Element {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      label="Tags"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      searchable={searchable}
    />
  );
}

test('aria-activedescendant tracks the active option through ArrowDown', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Tags'});

  // Closed: nothing is active.
  expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, {key: 'ArrowDown'});

  const options = screen.getAllByRole('option');
  expect(options[0].id).toBeTruthy();
  expect(trigger.getAttribute('aria-activedescendant')).toBe(options[0].id);

  fireEvent.keyDown(trigger, {key: 'ArrowDown'});
  expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
});

test('Enter on the active option selects it', () => {
  render(<Harness />);
  const trigger = screen.getByRole('button', {name: 'Tags'});

  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, {key: 'ArrowDown'}); // activate Option A
  fireEvent.keyDown(trigger, {key: 'Enter'});

  // Selection surfaces as a removable pill outside the trigger control.
  // getByRole throws if absent, so reaching the assertion already proves it.
  expect(screen.getByRole('button', {name: 'Remove Option A'})).toBeTruthy();
});

test('searchable trigger is a combobox that carries activedescendant', () => {
  render(<Harness searchable />);
  const combobox = screen.getByRole('combobox');

  // Typing opens the menu; every label contains "o", so all options remain.
  fireEvent.change(combobox, {target: {value: 'O'}});
  fireEvent.keyDown(combobox, {key: 'ArrowDown'});

  const options = screen.getAllByRole('option');
  expect(combobox.getAttribute('aria-activedescendant')).toBe(options[0].id);
});
