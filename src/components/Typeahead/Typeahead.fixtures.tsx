import {Typeahead} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Typeahead, {
  fixtures: {
    empty: {
      label: 'Search',
      value: null,
      onChange: noop,
      loadOptions: async () => [],
      placeholder: 'Type to search...',
    },
  },
});
