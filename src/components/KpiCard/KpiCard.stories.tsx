import React from 'react';
import type {Story} from '@ladle/react';
import {KpiCard} from './index';

export const Default: Story = () => (
  <div style={{width: 280}}>
    <KpiCard title="Active Patients" value="1,240" />
  </div>
);

export const WithTrendUp: Story = () => (
  <div style={{width: 280}}>
    <KpiCard
      title="Active Patients"
      value="1,240"
      trend={{direction: 'up', value: '3.2%', sentiment: 'positive'}}
    />
  </div>
);

export const WithTrendDown: Story = () => (
  <div style={{width: 280}}>
    <KpiCard
      title="Avg HCC Score"
      value="0.87"
      trend={{direction: 'down', value: '0.04', sentiment: 'neutral'}}
    />
  </div>
);

export const NegativeTrend: Story = () => (
  <div style={{width: 280}}>
    <KpiCard
      title="Reviews Due"
      value="23"
      trend={{direction: 'up', value: '5', sentiment: 'negative'}}
    />
  </div>
);

export const WithSubtitle: Story = () => (
  <div style={{width: 280}}>
    <KpiCard title="HCC Gap Rate" value="12.4%" subtitle="Q2 2026" />
  </div>
);
