/**
 * Theming guide: semantic token catalog with light/dark swatches.
 *
 * All swatches render from the actual CSS custom properties. The catalog data
 * lives in ./tokenCatalog; its token NAMES are gate-enforced against the token
 * source by src/testing/static/tokenCatalog.test.ts, so a renamed or removed
 * token fails CI. The descriptions are curated by hand. Switching the story
 * theme addon updates swatches live.
 */
import React from 'react';
import type {Story} from '@ladle/react';
import {TOKEN_GROUPS, type TokenGroup} from './tokenCatalog';

function Swatch({tokenName}: {tokenName: string}): React.JSX.Element {
  const isText = tokenName.includes('text');
  const isSpace = tokenName.includes('space');
  const isRadius = tokenName.includes('radius');

  if (isSpace) {
    return (
      <div style={{
        width: `var(${tokenName})`,
        minWidth: 4,
        height: 16,
        background: 'var(--smd-color-brand-500)',
        borderRadius: 2,
        display: 'inline-block',
      }} />
    );
  }

  if (isRadius) {
    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: `var(${tokenName})`,
        border: '2px solid var(--smd-border-strong)',
        display: 'inline-block',
      }} />
    );
  }

  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: 4,
      background: isText ? `var(${tokenName})` : `var(${tokenName})`,
      border: '1px solid var(--smd-border-subtle)',
      display: 'inline-block',
    }} />
  );
}

function TokenRow({token}: {token: {name: string; description: string}}): React.JSX.Element {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr 2fr',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--smd-border-subtle)',
      alignItems: 'center',
    }}>
      <Swatch tokenName={token.name} />
      <code style={{fontSize: 12, color: 'var(--smd-text-secondary)', wordBreak: 'break-all'}}>
        {token.name}
      </code>
      <span style={{fontSize: 13, color: 'var(--smd-text-tertiary)'}}>
        {token.description}
      </span>
    </div>
  );
}

function TokenGroupSection({group}: {group: TokenGroup}): React.JSX.Element {
  return (
    <section style={{marginBottom: 32}}>
      <h3 style={{margin: '0 0 8px', color: 'var(--smd-text-primary)'}}>{group.name}</h3>
      <div>
        {group.tokens.map((t) => <TokenRow key={t.name} token={t} />)}
      </div>
    </section>
  );
}

export const TokenCatalog: Story = () => (
  <div style={{maxWidth: 800, margin: '0 auto', padding: 24}}>
    <h2 style={{marginBottom: 4}}>Semantic Token Catalog</h2>
    <p style={{color: 'var(--smd-text-secondary)', marginBottom: 32, fontSize: 14}}>
      All tokens adapt automatically to the active theme (light/dark). Switch the theme
      using the addon toolbar above to preview both modes. Tokens are defined in
      tokens.css and imported via the @sonarmd/ui/tokens.css subpath.
    </p>
    {TOKEN_GROUPS.map((g) => <TokenGroupSection key={g.name} group={g} />)}
  </div>
);
TokenCatalog.storyName = 'Semantic Token Catalog';

export const Setup: Story = () => (
  <div style={{maxWidth: 640, margin: '0 auto', padding: 24}}>
    <h2>Theming Setup</h2>
    <p style={{color: 'var(--smd-text-secondary)', fontSize: 14}}>
      1. Import tokens and styles in your app entry:
    </p>
    <pre style={{
      background: 'var(--smd-bg-subtle)',
      padding: 16,
      borderRadius: 8,
      fontSize: 13,
      overflowX: 'auto',
    }}>
{`import '@sonarmd/ui/tokens.css';
import '@sonarmd/ui/style.css';`}
    </pre>

    <p style={{color: 'var(--smd-text-secondary)', fontSize: 14, marginTop: 24}}>
      2. The theme follows prefers-color-scheme by default. To override, set the
      data-theme attribute on the html element:
    </p>
    <pre style={{
      background: 'var(--smd-bg-subtle)',
      padding: 16,
      borderRadius: 8,
      fontSize: 13,
    }}>
{`// Force dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Force light mode
document.documentElement.setAttribute('data-theme', 'light');

// Follow OS preference (default)
document.documentElement.removeAttribute('data-theme');`}
    </pre>

    <p style={{color: 'var(--smd-text-secondary)', fontSize: 14, marginTop: 24}}>
      3. Use semantic tokens in your component styles - never hardcoded values:
    </p>
    <pre style={{
      background: 'var(--smd-bg-subtle)',
      padding: 16,
      borderRadius: 8,
      fontSize: 13,
    }}>
{`.myCard {
  background: var(--smd-bg-base);
  border: 1px solid var(--smd-border-default);
  color: var(--smd-text-primary);
  border-radius: var(--smd-radius-md);
  padding: var(--smd-space-4);
}`}
    </pre>
  </div>
);
Setup.storyName = 'Theming Setup';
