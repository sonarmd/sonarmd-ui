import React from 'react';
import type {Story} from '@ladle/react';
import {KpiGrid} from './index';
import type {KpiCardProps} from '../KpiCard';

const kpis: KpiCardProps[] = [
  {title: 'Active Patients', value: '1,240', trend: {direction: 'up', value: '3.2%', sentiment: 'positive'}},
  {title: 'Avg HCC Score', value: '0.87', trend: {direction: 'down', value: '0.04', sentiment: 'neutral'}},
  {title: 'Reviews Due', value: '23', trend: {direction: 'up', value: '5', sentiment: 'negative'}},
  {title: 'Care Gaps Closed', value: '89', trend: {direction: 'up', value: '12', sentiment: 'positive'}},
];

export const ThreeColumns: Story = () => <KpiGrid items={kpis.slice(0, 3)} columns={3} />;

export const FourColumns: Story = () => <KpiGrid items={kpis} columns={4} />;

export const TwoColumns: Story = () => <KpiGrid items={kpis.slice(0, 2)} columns={2} />;
