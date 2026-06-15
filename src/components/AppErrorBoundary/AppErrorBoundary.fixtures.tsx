import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {AppErrorBoundary} from './index';

// AppErrorBoundary is a class component - the harness renders children normally.
// The errored state is not snapshotable via fixtures (requires a throwing child).
// Behavioral coverage is in AppErrorBoundary.test.tsx.
export default defineComponentFixtures(AppErrorBoundary, {
  fixtures: {
    default: {
      children: 'App content',
    },
    withResetKeys: {
      children: 'App content',
      resetKeys: ['page-a'],
    },
  },
  skipAxe: [],
});
