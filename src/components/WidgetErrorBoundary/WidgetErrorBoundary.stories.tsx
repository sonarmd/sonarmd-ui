import React from 'react';
import type {Story} from '@ladle/react';
import {WidgetErrorBoundary} from './index';

function ThrowingComponent(): React.JSX.Element {
  throw new Error('Widget failed to load');
}

export const Default: Story = () => (
  <div style={{width: 300}}>
    <WidgetErrorBoundary>
      <ThrowingComponent />
    </WidgetErrorBoundary>
  </div>
);

export const CustomFallback: Story = () => (
  <WidgetErrorBoundary fallback={<div style={{padding: 16, color: 'var(--smd-text-tertiary)'}}>Chart unavailable.</div>}>
    <ThrowingComponent />
  </WidgetErrorBoundary>
);

export const NoError: Story = () => (
  <WidgetErrorBoundary>
    <div style={{padding: 16, color: 'var(--smd-text-primary)'}}>Widget loaded successfully.</div>
  </WidgetErrorBoundary>
);
