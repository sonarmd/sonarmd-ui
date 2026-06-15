import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {DateRangePicker} from './index';
import type {DateRange} from './index';

export const Default: Story = () => {
  const [value, setValue] = useState<DateRange>({start: null, end: null});
  return (
    <DateRangePicker label="Date Range" value={value} onChange={setValue} placeholder="Select range..." />
  );
};

export const WithPresets: Story = () => {
  const now = new Date();
  const [value, setValue] = useState<DateRange>({start: null, end: null});

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);

  return (
    <DateRangePicker
      label="Service Date Range"
      value={value}
      onChange={setValue}
      presets={[
        {label: 'Last 30 days', range: {start: thirtyDaysAgo, end: now}},
        {label: 'Last 90 days', range: {start: ninetyDaysAgo, end: now}},
      ]}
      clearable
    />
  );
};
