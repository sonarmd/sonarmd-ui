import React from 'react';
import type {Story} from '@ladle/react';
import {FunnelChart} from '../components/FunnelChart/FunnelChart';
import type {FunnelStage} from '../components/FunnelChart/FunnelChart';

const stages: FunnelStage[] = [
  {name: 'Identified', value: 1240},
  {name: 'Outreached', value: 890},
  {name: 'Scheduled', value: 540},
  {name: 'Completed', value: 380},
];

export const Default: Story = () => (
  <FunnelChart stages={stages} height={300} />
);

export const Loading: Story = () => (
  <FunnelChart stages={[]} height={300} isLoading />
);
