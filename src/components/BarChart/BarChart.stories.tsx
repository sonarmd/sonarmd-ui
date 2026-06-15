import React from 'react';
import type {Story} from '@ladle/react';
import {BarChart} from './index';

const data = [
  {category: 'Diabetes', count: 412},
  {category: 'CHF', count: 289},
  {category: 'CKD', count: 178},
  {category: 'COPD', count: 134},
  {category: 'CAD', count: 98},
];

export const Default: Story = () => (
  <BarChart data={data} xKey="category" yKey="count" height={300} />
);

export const Horizontal: Story = () => (
  <BarChart data={data} xKey="category" yKey="count" height={300} horizontal />
);

export const Loading: Story = () => (
  <BarChart data={[]} xKey="category" yKey="count" height={300} isLoading />
);
