import React from 'react';
import type {Story} from '@ladle/react';
import {StackedBarChart} from './index';
import type {BarSeries} from './index';

const data = [
  {month: 'Jan', completed: 40, pending: 20, missed: 8},
  {month: 'Feb', completed: 52, pending: 18, missed: 6},
  {month: 'Mar', completed: 61, pending: 15, missed: 4},
  {month: 'Apr', completed: 55, pending: 22, missed: 7},
];

const series: BarSeries[] = [
  {key: 'completed', name: 'Completed'},
  {key: 'pending', name: 'Pending'},
  {key: 'missed', name: 'Missed'},
];

export const Default: Story = () => (
  <StackedBarChart data={data} xKey="month" series={series} height={300} />
);

export const Loading: Story = () => (
  <StackedBarChart data={[]} xKey="month" series={series} height={300} isLoading />
);
