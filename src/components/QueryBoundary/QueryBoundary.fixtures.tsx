import {ComponentType} from 'react';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {QueryBoundary} from './index';
import type {QueryBoundaryProps} from './index';

const noop = (): void => {};

// Cast to non-generic so defineComponentFixtures can infer props correctly.
const QB = QueryBoundary as ComponentType<QueryBoundaryProps<string[]>>;

const loadingQuery = {status: 'loading' as const, data: undefined, error: undefined, refetch: noop};
const errorQuery = {status: 'error' as const, data: undefined, error: new Error('failed'), refetch: noop};
const emptyQuery = {status: 'success' as const, data: [] as string[], error: undefined, refetch: noop};
const successQuery = {status: 'success' as const, data: ['item-a', 'item-b'] as string[], error: undefined, refetch: noop};

export default defineComponentFixtures(QB, {
  fixtures: {
    loading: {
      query: loadingQuery,
      children: (data: string[]) => data.join(', '),
    },
    error: {
      query: errorQuery,
      children: (data: string[]) => data.join(', '),
    },
    empty: {
      query: emptyQuery,
      children: (data: string[]) => data.join(', '),
    },
    success: {
      query: successQuery,
      children: (data: string[]) => data.join(', '),
    },
  },
  skipAxe: [],
});
