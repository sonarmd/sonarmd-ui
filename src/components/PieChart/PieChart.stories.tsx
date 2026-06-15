import React from 'react';
import type {Story} from '@ladle/react';
import {PieChart} from './index';
import type {PieDataItem} from './index';

const data: PieDataItem[] = [
  {name: 'Low Risk', value: 412},
  {name: 'Medium Risk', value: 289},
  {name: 'High Risk', value: 90},
];

export const Default: Story = () => (
  <PieChart data={data} height={300} />
);

export const Donut: Story = () => (
  <PieChart data={data} height={300} donut />
);

export const Loading: Story = () => (
  <PieChart data={[]} height={300} isLoading />
);
