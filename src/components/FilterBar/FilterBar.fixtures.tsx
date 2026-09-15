import {FilterBar} from './FilterBar';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(FilterBar, {
  fixtures: {
    activeFilters: {onClear: noop, activeFilterCount: 3, children: <span>Status: Active</span>},
  },
});
