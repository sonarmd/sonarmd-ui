import React from 'react';
/**
 * Behavioral coverage for the async combobox keyboard contract the declarative
 * fixtures harness cannot reach (it renders the menu closed). Verifies the input
 * exposes aria-controls/aria-activedescendant once results load, so the active
 * option is announced to assistive tech.
 */
import {useState} from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Typeahead, type TypeaheadOption} from './index';

const OPTIONS: TypeaheadOption[] = [
  {label: 'Aspirin', value: 'asa'},
  {label: 'Atorvastatin', value: 'ator'},
];

function Harness(): React.JSX.Element {
  const [value, setValue] = useState<TypeaheadOption | null>(null);
  const loadOptions = async (): Promise<TypeaheadOption[]> => OPTIONS;
  return (
    <Typeahead
      label="Medication"
      value={value}
      onChange={setValue}
      loadOptions={loadOptions}
      debounceMs={0}
    />
  );
}

test('combobox exposes no listbox wiring before it opens', () => {
  render(<Harness />);
  const combobox = screen.getByRole('combobox');
  expect(combobox.getAttribute('aria-expanded')).toBe('false');
  expect(combobox.getAttribute('aria-controls')).toBeNull();
  expect(combobox.getAttribute('aria-activedescendant')).toBeNull();
});

test('aria-controls and aria-activedescendant wire up once results load', async () => {
  render(<Harness />);
  const combobox = screen.getByRole('combobox');

  fireEvent.change(combobox, {target: {value: 'a'}});

  const listbox = await screen.findByRole('listbox');
  await waitFor(() => expect(screen.getAllByRole('option').length).toBe(2));

  expect(listbox.id).toBeTruthy();
  expect(combobox.getAttribute('aria-controls')).toBe(listbox.id);

  fireEvent.keyDown(combobox, {key: 'ArrowDown'});
  const options = screen.getAllByRole('option');
  expect(options[0].id).toBeTruthy();
  expect(combobox.getAttribute('aria-activedescendant')).toBe(options[0].id);
});
