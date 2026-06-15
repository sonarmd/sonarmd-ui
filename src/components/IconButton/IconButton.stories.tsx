import React from 'react';
import type {Story} from '@ladle/react';
import {IconButton} from './index';

const TrashIcon = (
  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = (
  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M11 2l3 3-9 9H2v-3L11 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Default: Story = () => <IconButton label="Delete" >{TrashIcon}</IconButton>;

export const Variants: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <IconButton label="Edit (primary)" variant="primary">{EditIcon}</IconButton>
    <IconButton label="Edit (ghost)" variant="ghost">{EditIcon}</IconButton>
    <IconButton label="Delete (danger)" variant="danger">{TrashIcon}</IconButton>
  </div>
);

export const Sizes: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <IconButton label="Small" size="sm">{EditIcon}</IconButton>
    <IconButton label="Medium" size="md">{EditIcon}</IconButton>
    <IconButton label="Large" size="lg">{EditIcon}</IconButton>
  </div>
);
