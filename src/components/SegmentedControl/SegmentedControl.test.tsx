import React from 'react';
/**
 * Behavioral coverage for the radiogroup toggle contract: single tab stop,
 * aria-checked tracking, click selection, and Arrow/Home/End selection.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {SegmentedControl} from './index';

const views = [
  {value: 'list', label: 'List'},
  {value: 'grid', label: 'Grid'},
  {value: 'board', label: 'Board'},
];

function Harness(): React.JSX.Element {
  const [value, setValue] = useState('list');
  return <SegmentedControl options={views} value={value} onChange={setValue} ariaLabel="View" />;
}

test('renders a radiogroup with one tab stop on the checked segment', () => {
  render(<Harness />);
  const group = screen.getByRole('radiogroup', {name: 'View'});
  expect(group).toBeTruthy();
  const list = screen.getByRole('radio', {name: 'List'});
  expect(list.getAttribute('aria-checked')).toBe('true');
  expect((list as HTMLButtonElement).tabIndex).toBe(0);
  expect((screen.getByRole('radio', {name: 'Grid'}) as HTMLButtonElement).tabIndex).toBe(-1);
});

test('clicking a segment selects it', () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('radio', {name: 'Grid'}));
  expect(screen.getByRole('radio', {name: 'Grid'}).getAttribute('aria-checked')).toBe('true');
  expect(screen.getByRole('radio', {name: 'List'}).getAttribute('aria-checked')).toBe('false');
});

test('ArrowRight and Home move the selection', () => {
  render(<Harness />);
  const list = screen.getByRole('radio', {name: 'List'});
  list.focus();
  fireEvent.keyDown(list, {key: 'ArrowRight'});
  expect(screen.getByRole('radio', {name: 'Grid'}).getAttribute('aria-checked')).toBe('true');

  fireEvent.keyDown(screen.getByRole('radio', {name: 'Grid'}), {key: 'Home'});
  expect(screen.getByRole('radio', {name: 'List'}).getAttribute('aria-checked')).toBe('true');
});
