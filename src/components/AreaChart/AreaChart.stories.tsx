import React from 'react';
import type {Story} from '@ladle/react';
import {AreaChart} from './index';

const data = [
  {month: 'Jan', score: 0.82},
  {month: 'Feb', score: 0.85},
  {month: 'Mar', score: 0.89},
  {month: 'Apr', score: 0.91},
  {month: 'May', score: 0.94},
  {month: 'Jun', score: 0.98},
];

export const Default: Story = () => (
  <AreaChart data={data} xKey="month" yKey="score" height={300} />
);

export const WithGradient: Story = () => (
  <AreaChart data={data} xKey="month" yKey="score" height={300} gradient />
);

export const Smooth: Story = () => (
  <AreaChart data={data} xKey="month" yKey="score" height={300} smooth gradient />
);

export const Loading: Story = () => (
  <AreaChart data={[]} xKey="month" yKey="score" height={300} isLoading />
);
