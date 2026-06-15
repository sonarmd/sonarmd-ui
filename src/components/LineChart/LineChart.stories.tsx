import React from 'react';
import type {Story} from '@ladle/react';
import {LineChart} from './index';
import type {LineSeries} from './index';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = months.map((month, i) => ({month, hcc: +(0.8 + i * 0.08).toFixed(2), ra: +(0.6 + i * 0.05).toFixed(2)}));

const series: LineSeries[] = [
  {key: 'hcc', name: 'HCC Score'},
  {key: 'ra', name: 'RA Score'},
];

export const Default: Story = () => (
  <LineChart data={data} xKey="month" series={series} height={300} />
);

export const Smooth: Story = () => (
  <LineChart data={data} xKey="month" series={series} height={300} smooth />
);

export const Loading: Story = () => (
  <LineChart data={[]} xKey="month" series={series} height={300} isLoading />
);

export const Empty: Story = () => (
  <LineChart data={[]} xKey="month" series={series} height={300} isEmpty emptyMessage="No trend data available." />
);

export const SingleSeries: Story = () => (
  <LineChart
    data={data}
    xKey="month"
    series={[{key: 'hcc', name: 'HCC Score'}]}
    height={300}
    formatYAxis={(v) => v.toFixed(2)}
  />
);
