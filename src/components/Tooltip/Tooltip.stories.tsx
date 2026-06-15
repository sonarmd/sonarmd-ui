import React from 'react';
import type {Story} from '@ladle/react';
import {Tooltip} from './index';
import {Button} from '../Button';
import {IconButton} from '../IconButton';

export const Default: Story = () => (
  <div style={{padding: 64}}>
    <Tooltip content="Hover to see this tooltip">
      <Button variant="ghost">Hover me</Button>
    </Tooltip>
  </div>
);

export const Placements: Story = () => (
  <div style={{display: 'flex', gap: 32, padding: 80, justifyContent: 'center'}}>
    <Tooltip content="Top tooltip" placement="top">
      <Button variant="ghost" size="sm">Top</Button>
    </Tooltip>
    <Tooltip content="Bottom tooltip" placement="bottom">
      <Button variant="ghost" size="sm">Bottom</Button>
    </Tooltip>
    <Tooltip content="Left tooltip" placement="left">
      <Button variant="ghost" size="sm">Left</Button>
    </Tooltip>
    <Tooltip content="Right tooltip" placement="right">
      <Button variant="ghost" size="sm">Right</Button>
    </Tooltip>
  </div>
);

export const OnIconButton: Story = () => (
  <div style={{padding: 64}}>
    <Tooltip content="Delete this record">
      <IconButton label="Delete">
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconButton>
    </Tooltip>
  </div>
);
