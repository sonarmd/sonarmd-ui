import React from 'react';
import type {Story} from '@ladle/react';
import {FunnelChart} from './index';
import type {FunnelStage} from './index';

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
