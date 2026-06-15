import React from 'react';
import type {Story} from '@ladle/react';
import {GaugeChart} from './index';
import type {GaugeThreshold} from './index';

const thresholds: GaugeThreshold[] = [
  {at: 0.5, color: 'var(--smd-color-success-500)'},
  {at: 1.5, color: 'var(--smd-color-warning-500)'},
  {at: 3, color: 'var(--smd-color-danger-500)'},
];

export const Default: Story = () => (
  <GaugeChart value={0.87} min={0} max={3} height={250} thresholds={thresholds} label="HCC Score" />
);

export const HighRisk: Story = () => (
  <GaugeChart value={2.1} min={0} max={3} height={250} thresholds={thresholds} label="HCC Score" />
);

export const Loading: Story = () => (
  <GaugeChart value={0} min={0} max={3} height={250} isLoading />
);
