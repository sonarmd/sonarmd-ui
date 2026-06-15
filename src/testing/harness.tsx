import React from 'react';
import {render, type RenderResult} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import type {ComponentFixtures} from './defineComponentFixtures';

export type FixtureTheme = 'light' | 'dark';

/**
 * Render a named fixture with the harness providers applied (theme attribute,
 * optional router). Used by the generated baseline matrix and reusable by
 * interaction tests (`*.test.tsx`) so setup lives in exactly one place
 * (V1_SPEC 7.0.4).
 */
export function renderFixture(
  entry: ComponentFixtures,
  name: string,
  opts: {theme?: FixtureTheme} = {},
): RenderResult {
  document.documentElement.setAttribute('data-theme', opts.theme ?? 'light');
  const props = entry.config.fixtures[name];
  const element = <entry.Component {...props} />;
  return render(entry.config.router ? <MemoryRouter>{element}</MemoryRouter> : element);
}
