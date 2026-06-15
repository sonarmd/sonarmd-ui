import React from 'react';
import type {Story} from '@ladle/react';
import {Skeleton} from './index';

export const Text: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: 300}}>
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="90%" />
  </div>
);

export const Rect: Story = () => (
  <Skeleton variant="rect" width={300} height={200} />
);

export const Circle: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <Skeleton variant="circle" width={40} height={40} />
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      <Skeleton variant="text" width={120} />
      <Skeleton variant="text" width={80} />
    </div>
  </div>
);

export const Card: Story = () => (
  <div style={{width: 300, padding: 16, border: '1px solid var(--smd-border-default)', borderRadius: 8}}>
    <Skeleton variant="rect" width="100%" height={120} />
    <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8}}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </div>
  </div>
);
