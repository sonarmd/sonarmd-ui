import React from 'react';
import type {Story} from '@ladle/react';
import {QueryBoundary} from './index';
import type {QueryBoundaryProps} from './index';
import {EmptyState} from '../EmptyState';

type AlertItem = string;

const loadingQuery: QueryBoundaryProps<AlertItem[]>['query'] = {
  status: 'loading',
  data: undefined,
  error: undefined,
  refetch: async () => {},
};

const errorQuery: QueryBoundaryProps<AlertItem[]>['query'] = {
  status: 'error',
  data: undefined,
  error: new Error('Request failed'),
  refetch: async () => {},
};

const successQuery: QueryBoundaryProps<AlertItem[]>['query'] = {
  status: 'success',
  data: ['HCC gap: Diabetes', 'Annual wellness visit overdue'],
  error: undefined,
  refetch: async () => {},
};

const emptyQuery: QueryBoundaryProps<AlertItem[]>['query'] = {
  status: 'success',
  data: [],
  error: undefined,
  refetch: async () => {},
};

const renderAlerts = (alerts: AlertItem[]) => (
  <ul style={{margin: 0, padding: '0 16px'}}>
    {alerts.map((a) => <li key={a}>{a}</li>)}
  </ul>
);

export const Loading: Story = () => (
  <QueryBoundary query={loadingQuery}>{renderAlerts}</QueryBoundary>
);

export const ErrorState: Story = () => (
  <QueryBoundary query={errorQuery}>{renderAlerts}</QueryBoundary>
);

export const Success: Story = () => (
  <QueryBoundary query={successQuery}>{renderAlerts}</QueryBoundary>
);

export const Empty: Story = () => (
  <QueryBoundary
    query={emptyQuery}
    emptyState={<EmptyState title="No alerts" description="All gaps have been addressed." />}
  >
    {renderAlerts}
  </QueryBoundary>
);
