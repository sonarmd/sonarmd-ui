import React from 'react';
import type {Story} from '@ladle/react';
import {Spacer} from './index';

export const Horizontal: Story = () => (
  <div style={{display: 'flex', alignItems: 'center', background: 'var(--smd-bg-subtle)', padding: 8}}>
    <span>Left</span>
    <Spacer />
    <span>Right</span>
  </div>
);

export const Vertical: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', background: 'var(--smd-bg-subtle)', padding: 8, height: 200}}>
    <span>Top</span>
    <Spacer />
    <span>Bottom</span>
  </div>
);
