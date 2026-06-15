import React from 'react';
import type {Story} from '@ladle/react';
import {ChartCard} from './index';
import {LineChart} from '../LineChart';
import {Button} from '../Button';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = months.map((month, i) => ({month, hcc: +(0.8 + i * 0.08).toFixed(2)}));

export const Default: Story = () => (
  <ChartCard title="HCC Score Trend">
    <LineChart data={data} xKey="month" series={[{key: 'hcc', name: 'HCC Score'}]} height={250} />
  </ChartCard>
);

export const WithSubtitleAndAction: Story = () => (
  <ChartCard
    title="HCC Score Trend"
    subtitle="Last 6 months"
    action={<Button variant="ghost" size="sm">Export</Button>}
  >
    <LineChart data={data} xKey="month" series={[{key: 'hcc', name: 'HCC Score'}]} height={250} />
  </ChartCard>
);

export const Loading: Story = () => (
  <ChartCard title="HCC Score Trend" isLoading placeholderHeight={250}>
    <LineChart data={[]} xKey="month" series={[{key: 'hcc', name: 'HCC Score'}]} height={250} />
  </ChartCard>
);

export const Empty: Story = () => (
  <ChartCard title="HCC Score Trend" isEmpty emptyMessage="No data for the selected period.">
    <LineChart data={[]} xKey="month" series={[{key: 'hcc', name: 'HCC Score'}]} height={250} />
  </ChartCard>
);
