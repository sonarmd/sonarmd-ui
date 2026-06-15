import React, {useEffect} from 'react';
import type {GlobalProvider} from '@ladle/react';

// Lazy import so Ladle's bundler doesn't need the tokensCss module at startup.
async function injectTokens(): Promise<void> {
  const {buildTokensCss} = await import('../src/tokens/tokensCss');
  const id = 'smd-ladle-tokens';
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = buildTokensCss();
}

export const Provider: GlobalProvider = ({children, globalState}) => {
  const theme = globalState.theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    injectTokens();
  }, []);

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100vh',
        background: 'var(--smd-bg-base, #fff)',
        color: 'var(--smd-text-primary, #171724)',
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {children}
    </div>
  );
};
