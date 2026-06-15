import React from 'react';
import type {Story} from '@ladle/react';
import {Columns} from './index';
import {Card} from '../Card';

const Box = ({label}: {label: string}) => (
  <Card>
    <div style={{padding: 16, textAlign: 'center', color: 'var(--smd-text-secondary)'}}>
      {label}
    </div>
  </Card>
);

export const TwoColumns: Story = () => (
  <Columns cols={2} gap="4">
    <Box label="Column 1" />
    <Box label="Column 2" />
  </Columns>
);

export const ThreeColumns: Story = () => (
  <Columns cols={3} gap="4">
    <Box label="Stats" />
    <Box label="Chart" />
    <Box label="Table" />
  </Columns>
);

export const ResponsiveCollapse: Story = () => (
  <Columns cols={3} gap="4" minWidth="200px">
    <Box label="A" />
    <Box label="B" />
    <Box label="C" />
  </Columns>
);
