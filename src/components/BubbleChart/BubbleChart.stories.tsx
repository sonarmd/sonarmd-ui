import React from 'react';
import type {Story} from '@ladle/react';
import {BubbleChart} from './index';
import type {BubbleDataPoint} from './index';

const data: BubbleDataPoint[] = [
  {name: 'J. Smith', x: 1.2, y: 4, size: 30},
  {name: 'M. Chen', x: 0.8, y: 2, size: 15},
  {name: 'A. Johnson', x: 2.1, y: 6, size: 45},
  {name: 'R. Davis', x: 0.5, y: 1, size: 8},
  {name: 'L. White', x: 1.7, y: 5, size: 28},
];

export const Default: Story = () => (
  <BubbleChart data={data} xLabel="HCC Score" yLabel="Care Gaps" sizeLabel="Claims" height={350} />
);

export const Loading: Story = () => (
  <BubbleChart data={[]} height={350} isLoading />
);
