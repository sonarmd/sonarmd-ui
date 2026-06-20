import React from 'react';
/**
 * Behavioral coverage for the disclosure contract the static fixtures harness
 * cannot exercise: toggling, single-vs-multiple expansion, and roving focus
 * between headers via Arrow/Home/End.
 */
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Accordion, type AccordionItem} from './index';

const items: AccordionItem[] = [
  {key: 'a', title: 'Section A', content: 'Body A'},
  {key: 'b', title: 'Section B', content: 'Body B'},
  {key: 'c', title: 'Section C', content: 'Body C'},
];

test('header exposes aria-expanded and aria-controls to a labelled region', () => {
  render(<Accordion items={items} defaultExpandedKeys={['a']} />);
  const header = screen.getByRole('button', {name: 'Section A'});
  expect(header.getAttribute('aria-expanded')).toBe('true');
  const panelId = header.getAttribute('aria-controls');
  expect(panelId).toBeTruthy();
  const panel = document.getElementById(panelId as string);
  expect(panel?.getAttribute('role')).toBe('region');
  expect(panel?.getAttribute('aria-labelledby')).toBe(header.id);
});

test('single mode collapses the previously open section', () => {
  render(<Accordion items={items} defaultExpandedKeys={['a']} />);
  fireEvent.click(screen.getByRole('button', {name: 'Section B'}));
  expect(screen.getByRole('button', {name: 'Section A'}).getAttribute('aria-expanded')).toBe('false');
  expect(screen.getByRole('button', {name: 'Section B'}).getAttribute('aria-expanded')).toBe('true');
});

test('multiple mode keeps independent sections open', () => {
  render(<Accordion items={items} type="multiple" />);
  fireEvent.click(screen.getByRole('button', {name: 'Section A'}));
  fireEvent.click(screen.getByRole('button', {name: 'Section B'}));
  expect(screen.getByRole('button', {name: 'Section A'}).getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('button', {name: 'Section B'}).getAttribute('aria-expanded')).toBe('true');
});

test('ArrowDown and End move focus between headers', () => {
  render(<Accordion items={items} />);
  const a = screen.getByRole('button', {name: 'Section A'});
  const b = screen.getByRole('button', {name: 'Section B'});
  const c = screen.getByRole('button', {name: 'Section C'});

  a.focus();
  fireEvent.keyDown(a, {key: 'ArrowDown'});
  expect(document.activeElement).toBe(b);

  fireEvent.keyDown(b, {key: 'End'});
  expect(document.activeElement).toBe(c);
});
