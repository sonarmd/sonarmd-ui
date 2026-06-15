/**
 * Recipe 5: Themed app setup
 *
 * tokens.css import, data-theme attribute, runtime toggle.
 * tokens.css sets all --smd-* CSS custom properties.
 * The data-theme="dark" attribute on <html> switches to the dark palette.
 * Without data-theme, prefers-color-scheme media query controls it.
 *
 * In your app root (e.g. main.tsx or App.tsx):
 *
 *   import '@sonarmd/ui/tokens.css';
 *   import '@sonarmd/ui/style.css';
 */
import React, {useState} from 'react';
import {Toggle} from '../../src/components/Toggle';
import {Badge} from '../../src/components/Badge';
import {Card} from '../../src/components/Card';
import {Button} from '../../src/components/Button';

/**
 * Apply theme to a target element (defaults to document.documentElement).
 * Use 'auto' to follow prefers-color-scheme.
 */
export function applyTheme(theme: 'light' | 'dark' | 'auto', el: HTMLElement = document.documentElement): void {
  if (theme === 'auto') {
    el.removeAttribute('data-theme');
  } else {
    el.setAttribute('data-theme', theme);
  }
}

/** Runtime theme toggle widget. */
export function ThemeToggle(): JSX.Element {
  const [dark, setDark] = useState(false);

  function toggle(): void {
    const next = !dark;
    setDark(next);
    applyTheme(next ? 'dark' : 'light');
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <Toggle label="Dark mode" checked={dark} onChange={toggle} />
      <Badge variant={dark ? 'neutral' : 'primary'}>{dark ? 'Dark' : 'Light'}</Badge>
    </div>
  );
}

/** Demo: compose themed components. */
export function ThemedApp(): JSX.Element {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--smd-bg-base)',
        color: 'var(--smd-text-primary)',
        padding: 24,
      }}
    >
      <ThemeToggle />
      <Card title="Theme Demo" style={{marginTop: 24}}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary" style={{marginLeft: 8}}>Secondary</Button>
      </Card>
    </div>
  );
}
