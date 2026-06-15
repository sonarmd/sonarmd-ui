import React from 'react';
import type {Story} from '@ladle/react';
import {StackedAreaChart} from './index';

const data = [
  {month: 'Jan', low: 412, medium: 289, high: 90},
  {month: 'Feb', low: 398, medium: 310, high: 102},
  {month: 'Mar', low: 380, medium: 325, high: 118},
  {month: 'Apr', low: 365, medium: 340, high: 132},
];

export const Default: Story = () => (
  <StackedAreaChart
    data={data}
    xKey="month"
    series={[
      {key: 'low', name: 'Low Risk'},
      {key: 'medium', name: 'Medium Risk'},
      {key: 'high', name: 'High Risk'},
    ]}
    height={300}
  />
);

export const Loading: Story = () => (
  <StackedAreaChart data={[]} xKey="month" series={[{key: 'low', name: 'Low'}]} height={300} isLoading />
);
